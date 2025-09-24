# Interface Development Guide

> Section micro-structure: **Rules → Recipes → Examples → References**

## 2) Scope, Responsibilities & Interaction Points

**Rules**

* This guide standardizes how we build the **Interface layer** (Astro + React + Tailwind + shadcn/ui) and how it interacts with the **Application layer** (server actions).
* Treat this as the **single source of truth** for frontend conventions. If it’s not here, check **AGENTS.md** or the official docs in §9.
* Do **not** invent APIs. Use only what’s defined in **AGENTS.md**, action schemas in `src/actions/<feature>/schema.ts`, and shadcn/ui primitives.
* **Validation & Types (high-level):** Frontend derives validation and action I/O types from **action schemas** at `src/actions/<feature>/schema.ts`. See §5.10 and §5.5.1.
* **Types policy (shared vs UI-only):**

  * **Shared domain types** (data that exists in both frontend & backend, e.g., `User`, `Product`) are **never re-declared** in the Interface layer. **Import type-only** from `src/db/schema.ts` and **compose** with TS utilities (`Pick`, `Omit`, `Partial`, etc.) as needed.
    `import type { User } from "@/db/schema"`
  * **I/O contracts** for actions (request/response) still come from **action schemas** in `src/actions/<feature>/schema.ts`. If an action returns a DTO that differs from the DB shape, **the action schema is the source of truth** for that path.
  * **UI-only types** (pure presentation or component-internal state that never crosses the frontend boundary) may be defined locally in the Interface layer.

**Interaction Points**

* **Upstream** (Application): call only server **actions** exposed by `src/actions/index.ts`.
* **Downstream** (Interface): pages/layouts/components render UI, **never** access DB/auth/storage directly.
* **Boundaries**: Interface (outer) depends on Application (inner)—**never the reverse**.
* **Validation**: Frontend derives types/validation from action schemas at `src/actions/<feature>/schema.ts`. **All user input forms** must use **shadcn Form** + **react-hook-form** (`useForm`) + **Zod** on the client; **client calls send JSON by default** (no FormData conversion) unless using an HTML `<form>` or uploading files; **results must notify users via Sonner toasts**. See §5.10.

---

## 3) Working Files, Primitives & Dependency Map

**Rules**

* **Directory shape (Interface-relevant)**

  * `src/pages/*` — pages (must render under `BaseLayout`)
  * `src/layouts/*` — layout components; extend `BaseLayout.astro`
  * `src/components/server/<feature>/*` — server-rendered components
  * `src/components/client/<feature>/*` — client-only (React island roots)
  * `src/components/ui/*` — shadcn/ui primitives (CLI managed)
  * `src/hooks/<feature>/*` — React hooks co-located per feature

* **Imports**

  * Use `@/` alias from `src` for local modules.
  * **Client / Islands / `<script>` in `.astro`:** `import { actions } from 'astro:actions'`.
  * **Server (frontmatter or endpoints):** `await Astro.callAction(actions.someAction, input)`.
  * **HTML forms (zero-JS):** `<form method="POST" action={actions.someAction}>` + `Astro.getActionResult(actions.someAction)` for results.
  * **Shared types:** Import **types only** from `@/db/schema` (`import type { User } from "@/db/schema"`). Do **not** import runtime values from `@/db/schema` into client code.
  * **Compose, don’t copy:** Extend shared types with TS utilities (`Pick`, `Omit`, `Partial`, `Readonly`, template unions). Do not duplicate shapes in component props or fetching layers.
  * **UI-only types allowed:** If a type never leaves the Interface layer (e.g., a view model or local sort state), define it locally.

* Use **pnpm** commands as defined in AGENTS.md. Do not add alternate scripts.

* **Schemas used by UI:** `src/actions/<feature>/schema.ts` exports the **canonical Zod input schema** and must be **browser-safe** (pure Zod/types; no server-only imports) so islands can reuse it. If the form shape differs from the action input, define a **local form schema** in the component and **map** it to the action input before calling.

**Examples**

```
src/
  pages/
  layouts/
  components/
    server/<feature>/
    client/<feature>/
    ui/
  hooks/<feature>/
  actions/<feature>/
    schema.ts
```

```ts
// src/pages/example.astro (frontmatter server call)
---
import { actions } from 'astro:actions'
const { data, error } = await Astro.callAction(actions.items.list, { /* input */ })
---
```

```ts
// src/components/server/users/UserCard.astro (frontmatter TS)
import type { User } from "@/db/schema"

// Only what the card needs
type PublicUser = Pick<User, "id" | "name" | "avatarUrl">
interface UserCardProps { user: Readonly<PublicUser> }
```

**References**

* AGENTS.md → “Working files (Interface)”, “Import rules”, “CLI Tooling”

---

## 4) Core/Global Modules & Interactions

**Modules (overview)**

* **Pages & Layouts** — structure, shells, and composition
* **Client Islands** — React interactivity mounted via client directives
* **Styling & Tokens** — Tailwind + shadcn design tokens
* **UI Components (shadcn/ui)** — component primitives (CLI-managed)
* **Frontend ↔ Actions** — data flow via Astro Actions
* **Data/State Access** — SSR-first queries; minimal client state
* **Integration Points** — auth client, notifications, logging discipline
* **Performance & Reliability** — hydration strategy, images, perceived speed

**Interaction Rules**

* **SSR-first**. Prefer server rendering; use islands **only** where interactivity is required.
* **All data flows through actions** exported in `src/actions/index.ts`.
* **No ad-hoc fetches** to DB/services from the frontend—always go through actions.

**High-level workflow**

Validate user input → submit via **Action** → handle result (PRG or client toast) → revalidate/render SSR → show notifications & update view.

**References**

* AGENTS.md → “Operating Model”, “Interface Layer”, “Application Layer”

---

## 5) Module: Pages & Layouts

### 5.1.1 Rules

* Nest layouts for complex shells but always extend `BaseLayout`.
* Abstract shared chrome (nav, sidebars) into feature-specific layouts under `src/layouts/`.
* Use Layout to guard routes with common auth/permissions (via middleware).
* `BaseLayout` exposes **two named slots**: `head` and `body`.

  * **In layouts:** define with `<slot name="head" />` and `<slot name="body" />`.
  * **In consumers (pages/components):** pass content by setting the **`slot` attribute** on an element: `<div slot="head">…</div>` and `<main slot="body">…</main>`.
  * Do **not** use `<slot>` tags in a consumer; `<slot>` is only used **inside** the layout component itself.
* Prefer **static** for static content; switch to dynamic only when required.
* All pages render within `src/layouts/BaseLayout.astro`.

### 5.1.2 Recipes

* **New page**

  1. Create file under `src/pages/…`
  2. Wrap with `BaseLayout`
  3. Fetch data via actions (server-side)
  4. Compose server components; keep page thin
  5. Add route tests/links

* **Shared chrome**

  1. Create `src/layouts/<Feature>Layout.astro`
  2. Extend `BaseLayout.astro`
  3. Slot feature components

### 5.1.3 Examples

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro'
import { actions } from 'astro:actions'
import List from '@/components/server/items/List.astro'
const { data } = await Astro.callAction(actions.items.list, {})
const items = data ?? []
---
<BaseLayout>
  <Fragment slot="head">
    <title>Items</title>
    <meta name="description" content="List of items" />
  </Fragment>

  <main slot="body">
    <List items={items} />
  </main>
</BaseLayout>
```

```astro
---
// src/layouts/BaseLayout.astro
const { title } = Astro.props
---
<html lang="en">
  <head>
    {title && <title>{title}</title>}
    <slot name="head" />
  </head>
  <body>
    <slot name="body" />
  </body>
</html>
```

### 5.1.4 References

* AGENTS.md → Pages & Layouts conventions

---

## 5) Module: Client Islands (React)

### 5.2.1 Rules

* Use islands **only** for interactivity. Group related widgets into a single island root.
* Prefer the least-eager directive that satisfies UX: `client:visible` → `client:idle` → `client:load`.

### 5.2.2 Recipes

* Create island at `src/components/client/<feature>/Widget.tsx` and mount from `.astro` with a client directive.

### 5.2.3 Examples

```astro
---
import Counter from '@/components/client/counter/Counter.tsx'
---
<Counter client:visible />
```

### 5.2.4 References

* AGENTS.md → “Interface Layer / Client islands”

---

## 5) Module: Styling & Tokens (Tailwind + shadcn)

### 5.3.1 Rules

* Tailwind for **all** styling. **Order classes**: layout → flex/grid → spacing → sizing → typography → background → border → effects → interactivity → svg.
* Use shadcn **design tokens** (CSS variables) for color/shape consistency. Extend via Tailwind utilities (e.g., `bg-background/50`).

### 5.3.2 Examples

**Available tokens**

* `--radius`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1`, `--chart-2`, `--chart-3`, `--chart-4`, `--chart-5`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`.

**Usage**

```tsx
<button className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground shadow">
  Save
</button>
```

### 5.3.3 References

* AGENTS.md → tokens & styling

---

## 5) Module: UI Components (shadcn/ui)

### 5.4.1 Rules

* Always compose from **shadcn primitives** for consistency.
* **Install before use** via shadcn CLI. Don’t paste random examples; adapt.

### 5.4.2 Recipes (CLI workflow)

* Registry is always `@shadcn`.
* List catalog: `list_items_in_registries({ registries: ["@shadcn"] })`
* Pick items & get add command: `get_add_command_for_items({ items: ["@shadcn/button", "@shadcn/card"] })`
* Install with the returned CLI via `bash` (confirm first).
* Before using, fetch examples/demos: `get_item_examples_from_registries({ registries: ["@shadcn"], query: "<item>-demo" })`
* Optional inspect: `view_items_in_registries({ items: ["@shadcn/tooltip"] })`
* Search: `search_items_in_registries({ registries:["@shadcn"], query:"date" })`
* After adding, run `get_audit_checklist()` and address items.

### 5.4.3 Examples (trace)

```
ai: list shadcn items
→ tool: list_items_in_registries({ registries:["@shadcn"] })
ai: plan to use @shadcn/button and @shadcn/dialog
→ tool: get_add_command_for_items({ items:["@shadcn/button","@shadcn/dialog"] })
ai: run install command via bash (upon approval)
ai: fetch dialog examples to adapt for Astro islands
→ tool: get_item_examples_from_registries({ registries:["@shadcn"], query:"dialog-demo" })
```

**Available components (install per need)**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, data-table, date-picker, dialog, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip, typography

### 5.4.4 References

* AGENTS.md → “Primitives / Shadcn UI components”

---

## 5) Module: Frontend ↔ Actions (Interaction Patterns)

### 5.5.1 Rules

* **All data flows through actions** exported in `src/actions/index.ts`.
* Use action **input/output** types from `src/actions/<feature>/schema.ts`.
* Prefer **PRG (Post → Redirect → Get)** for mutations/navigation.
* **Client calls send JSON by default**—do **not** convert to `FormData` unless posting from an HTML `<form>` or uploading files.
* **Types alignment:** For **action inputs/outputs**, derive types from the **action Zod schemas**. For **entity shapes** rendered by the UI (e.g., component props that represent a `User`), import **shared domain types** from `@/db/schema` and narrow with TS utilities as needed. If an action’s DTO differs from the DB entity, **prefer the action schema type** for that path.

### 5.5.2 Recipes

* **Zero-JS HTML form → action → server handling**

  1. Template: `<form method="POST" action={actions.feature.create}>`
  2. Server (same `.astro`): `const result = Astro.getActionResult(actions.feature.create)` then branch on `result?.error`
  3. Redirect on success with `Astro.redirect('/path')`

* **Client-side call (React island / `<script>`)**

  * `const { data, error } = await actions.feature.create(jsonInput)` (use JSON).
    Use `FormData` only for HTML forms/files.

* **Server-side call (frontmatter)**

  * `const { data, error } = await Astro.callAction(actions.feature.find, { query })`

### 5.5.3 Examples

```astro
---
import { actions } from 'astro:actions'
const result = Astro.getActionResult(actions.createProduct)
if (result && !result.error) Astro.redirect(`/products/${result.data.id}`)
---
<form method="POST" action={actions.createProduct}>
  <input name="name" required />
  <button>Create</button>
</form>
```

```tsx
// React island (JSON call)
import { actions, isInputError } from 'astro:actions'
import { toast } from 'sonner'

export async function save(input: { name: string }) {
  const { data, error } = await actions.items.create(input)
  if (error) {
    if (isInputError(error)) {
      // map field errors to RHF setError in a real form component
    }
    toast.error(error.message)
  } else {
    toast.success('Saved')
  }
}
```

### 5.5.4 References

* Official → Astro Actions (see §9)

---

## 5) Module: Data / State Access

### 5.6.1 Rules

* **Queries**: SSR by default; cache at page/component boundary when appropriate.
* **Client state**: Keep local UI state in React; do not mirror server data unless necessary.
* **Validation**: Trust server action schemas; optional client pre-validation may re-use the same Zod schemas when feasible.

### 5.6.2 Recipes

* **Lists**: render server-side; add a small island for sorting/filter controls.
* **Detail**: render server-side; on mutation, use PRG to revalidate.

### 5.6.3 Examples

```astro
---
import { actions } from 'astro:actions'
const { data, error } = await Astro.callAction(actions.products.list, {})
const products = data ?? []
---
<ProductTable products={products} />
```

### 5.6.4 References

* AGENTS.md → SSR guidance

---

## 5) Module: Integration Points & Adapters

### 5.7.1 Rules

* **Auth (client)**: use `authClient` from `src/lib/auth/client.ts` for login/logout and session checks.
* **Notifications**: use `sonner` for success/error feedback from actions.
* **Logging in UI**: `console` for dev only. Persisted logging happens server-side.

### 5.7.2 Recipes

* Show error/success from standard action result type (see `src/actions/shared.ts`).
* Gate client features using user from server context (passed down) or `authClient`.

### 5.7.3 Examples

```tsx
import { Toaster, toast } from "sonner"
export function AppToaster(){ return <Toaster richColors /> }
```

### 5.7.4 References

* AGENTS.md → Interface primitives (Auth), action result shape location

---

## 5) Module: Performance & Reliability

### 5.8.1 Rules

* Minimize hydration. Prefer **server components**; **consolidate** islands.
* Use the least-eager directive that satisfies UX (`client:visible` over `client:load`).
* Use skeletons for perceived speed; avoid spinners where possible.
* Images: use Astro image utilities; set explicit width/height.

### 5.8.2 Recipes

* Partition large interactive areas into **one island root** rather than many scattered islands.
* Preload critical CSS; defer non-critical scripts.

### 5.8.3 Examples

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <Skeleton className="h-24" />
  <Skeleton className="h-24" />
  <Skeleton className="h-24" />
</div>
```

### 5.8.4 References

* AGENTS.md → “Interface Layer / Tech”, images & styling guides

---

## 5) Module: Common Pitfalls

### 5.9.1 Rules

* Using `className` in `.astro` HTML tags (should be `class`).
* Hydrating entire pages instead of targeted islands.
* Calling services/DB directly from frontend (must be via actions).
* Diverging from action schemas (types drift) — keep in sync.
* Pasting unreviewed examples without adapting to tokens/layout.
* Copying shadcn **Next.js** snippets verbatim (e.g., `"use client"` / `"use server"`) — **Astro doesn’t use these directives**. Mount React with Astro **client directives** and call **Astro Actions** instead.
* Converting values to **FormData** for client calls unnecessarily — **pass JSON** to actions from islands; use `FormData` only for HTML forms or file uploads.
* Re-declaring `User/Product/...` shapes in UI → **Fix:** `import type { User } from "@/db/schema"` and compose (`Pick`, `Omit`).
* Using `<slot>` elements inside pages to pass content → **Fix:** put a normal element with `slot="name"` (e.g., `<div slot="head">...</div>`); `<slot>` belongs inside the layout.

### 5.9.2 Examples

* Anti-pattern: multiple tiny islands competing for state → **Fix**: merge into one island.

### 5.9.3 References

* AGENTS.md → layering rules, import rules

---

## 5) Module: Forms + Server Actions

### 5.10.1 Rules

* **Stack (mandatory):** All user-facing forms must use **shadcn/ui Form primitives** (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) + **react-hook-form** (`useForm`) with **`zodResolver`**, backed by a **Zod schema**.
* **Schema source of truth:** Reuse the **action’s input Zod schema** from `src/actions/<feature>/schema.ts` wherever possible.

  * If the **form schema differs** (extra UI-only fields, different shapes), define a **local form schema** in the component and **map** it to the action input before calling.
  * Keep schemas **browser-safe** (pure Zod/types; no server-only imports) when used by client islands.
* **Submission (client islands):** **Send JSON** to actions: `const { data, error } = await actions.feature.create(json)`. Do not convert to `FormData` unless uploading files.
* **Submission (HTML forms / PRG):** Use `<form method="POST" action={actions.feature.create}>` and read results with `Astro.getActionResult()`; redirect server-side on success.
* **Error handling:** If `isInputError(error)`, map `error.fields` into RHF via `setError`. Otherwise show a generic error.
* **User feedback:** Always **notify via Sonner** toasts on success/error.
* **Redirects:** Prefer **PRG** for page-level navigations. For inline client flows, remain on page; optionally call `navigate('/path')` (view transitions) after success.

### 5.10.2 Recipes

**A) Client form (JSON) → action (no FormData)**

1. Import the **action input schema**; optionally declare a **local form schema** if UI differs.
2. Initialize RHF with `zodResolver(LocalOrActionSchema)`.
3. On submit: `actions.<feature>.<op>(mapToAction(values))`.
4. If `isInputError(error)`, call `setError` for each field; always toast result.

**B) Files / HTML forms (PRG)**

* Use `<form method="POST" action={actions.feature.create}>` (which posts `FormData`) when dealing with **file uploads** or you want **PRG** behavior. Branch on `Astro.getActionResult()` in the same page and redirect server-side.

**C) Optional client redirect**

* After successful client call, you may `navigate('/path')` from `astro:transitions/client` to switch views without PRG.

### 5.10.3 Examples

```tsx
// src/components/client/items/ItemForm.tsx
import { actions, isInputError } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form"

// Canonical (import from src/actions/items/schema.ts in real code)
export const ItemActionInput = z.object({
  name: z.string().min(2),
  priceCents: z.number().int().min(0),
})
type ItemActionInput = z.infer<typeof ItemActionInput>

// Local form schema (UI differs: dollars vs cents)
const ItemFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  price: z.coerce.number().min(0, "Must be >= 0"),
})
type ItemFormValues = z.infer<typeof ItemFormSchema>

const mapToAction = (v: ItemFormValues): ItemActionInput => ({
  name: v.name,
  priceCents: Math.round(v.price * 100),
})

export default function ItemForm() {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: { name: "", price: 0 },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const { data, error } = await actions.items.create(mapToAction(values)) // JSON

    if (error) {
      if (isInputError(error)) {
        Object.entries(error.fields).forEach(([name, messages]) => {
          form.setError(name as keyof ItemFormValues, { message: messages.join(", ") })
        })
      }
      toast.error(error.message || "Something went wrong")
      return
    }

    toast.success("Item created")
    // Optional client redirect for inline flows
    // await navigate(`/items/${data.id}`)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="e.g., Deluxe Widget" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">Create</Button>
          <Button type="button" variant="ghost" onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  )
}
```

```astro
---
// src/pages/items/new.astro
import BaseLayout from "@/layouts/BaseLayout.astro"
import ItemForm from "@/components/client/items/ItemForm.tsx"
---
<BaseLayout title="New Item">
  <!-- Astro islands: no "use client" -->
  <ItemForm client:visible slot="body" />
</BaseLayout>
```

### 5.10.4 References

* shadcn/ui — Forms (RHF + Zod)
* Astro — Actions (guide + API), PRG, `Astro.getActionResult()`, `isInputError`, `Astro.callAction`
* Astro — View transitions (`navigate()`)

---

## 6) Global Workflow (end-to-end)

* **Browse/List (SSR)**: route request → call `Astro.callAction` → map data → render page under `BaseLayout` → (optional) island enhances controls.
* **Create/Update (PRG)**: form submit → `actions.<feature>.create` → `Astro.getActionResult()` → on success `Astro.redirect()` → GET renders new state.
* **Client mutation (island)**: user event → `actions.<feature>.<op>(JSON input)` → show **Sonner** toast → reconcile UI or navigate.

**Artifacts**: action schemas (`src/actions/<feature>/schema.ts`), SSR components, islands, toasts.
**Errors**: branch on `{ data, error }` from action results.
**Observability**: UI uses `sonner`; durable logs/traces live server-side.

---

## 7) Global Checklist (DoD)

* [ ] Pages use `BaseLayout` and compose server components.
* [ ] Interactive parts isolated to clearly named islands under `src/components/client/...`.
* [ ] Styling uses tokens; contrast checked; focus states visible.
* [ ] All actions invoked via the aggregator; results mapped to toasts.
* [ ] Types aligned with action schemas; **no `any`**.
* [ ] Shadcn components installed via CLI; audit checklist passed.
* [ ] **Forms** use shadcn **Form** + **RHF** + **Zod**; **action schema reused** (or mapped from a local form schema); **client calls send JSON**; field errors handled via `isInputError()`; feedback via **Sonner**.
* [ ] **Shared types** imported type-only from `@/db/schema`; no duplicated entity shapes in UI.
* [ ] **Slots**: layouts define with `<slot name="…"/>`; consumers pass with `slot="…"` attribute.

---

## 8) Important Notes

* **Class vs ClassName**: In `.astro`/HTML tags use `class`. In React components use `className`.
* **Type everything**: components, props, hooks return types, action usage.
* **Accessibility**: semantic HTML, labeled controls, keyboard focus order, color contrast.
* **Layout contract**: all pages render within `src/layouts/BaseLayout.astro`.
* **Type-only imports:** In client-facing code, import shared types with `import type { … }` to avoid bundling server code.

---

## 9) Official References (Deep Links)

> Each link includes **Use when** guidance to decide quickly.

### Astro

* Actions — [https://docs.astro.build/en/guides/actions](https://docs.astro.build/en/guides/actions) — *Use when:* building forms, calling backend from client, handling PRG, reading `Astro.getActionResult()`, throwing `ActionError`.
* Actions API — [https://docs.astro.build/en/reference/modules/astro-actions/](https://docs.astro.build/en/reference/modules/astro-actions/) — *Use when:* exact types & helpers (`defineAction`, `Astro.callAction`, `isInputError`).
* Framework components — [https://docs.astro.build/en/guides/framework-components/](https://docs.astro.build/en/guides/framework-components/) — *Use when:* adding React components & choosing hydration directives.
* Directives reference — [https://docs.astro.build/en/reference/directives-reference/](https://docs.astro.build/en/reference/directives-reference/) — *Use when:* checking `client:*` and `transition:*`.
* Routing — [https://docs.astro.build/en/guides/routing](https://docs.astro.build/en/guides/routing) — *Use when:* pages & dynamic routes.
* Prefetch — [https://docs.astro.build/en/guides/prefetch](https://docs.astro.build/en/guides/prefetch) — *Use when:* optimizing perceived latency of links.
* Images — [https://docs.astro.build/en/guides/images](https://docs.astro.build/en/guides/images) — *Use when:* responsive images with width/height.
* Styling — [https://docs.astro.build/en/guides/styling](https://docs.astro.build/en/guides/styling) — *Use when:* integrating Tailwind / CSS strategies.
* Integrations: Tailwind — [https://docs.astro.build/en/guides/integrations-guide/tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind) — *Use when:* configuring Tailwind in Astro.
* Integrations: React — [https://docs.astro.build/en/guides/integrations-guide/react](https://docs.astro.build/en/guides/integrations-guide/react) — *Use when:* enabling React support.
* Client-side scripts — [https://docs.astro.build/en/guides/client-side-scripts](https://docs.astro.build/en/guides/client-side-scripts) — *Use when:* inline `<script>` in `.astro`.
* Middleware — [https://docs.astro.build/en/guides/middleware](https://docs.astro.build/en/guides/middleware) — *Use when:* gating actions, auth checks, persisting action results.
* Environment variables — [https://docs.astro.build/en/guides/environment-variables](https://docs.astro.build/en/guides/environment-variables) — *Use when:* reading secrets at build/runtime.
* View transitions — [https://docs.astro.build/en/guides/view-transitions](https://docs.astro.build/en/guides/view-transitions) — *Use when:* animating navigations; can persist inputs with `transition:persist`.
* Server islands — [https://docs.astro.build/en/guides/server-islands](https://docs.astro.build/en/guides/server-islands) — *Use when:* deferring server-rendered sections for faster TTI.
* Markdown content — [https://docs.astro.build/en/guides/markdown-content](https://docs.astro.build/en/guides/markdown-content) — *Use when:* MD/MDX content.
* Configuring Astro — [https://docs.astro.build/en/guides/configuring-astro](https://docs.astro.build/en/guides/configuring-astro) — *Use when:* project-wide config.
* Syntax highlighting — [https://docs.astro.build/en/guides/syntax-highlighting](https://docs.astro.build/en/guides/syntax-highlighting) — *Use when:* code blocks & themes.
* **Components & Slots** — [https://docs.astro.build/en/core-concepts/astro-components/#slots](https://docs.astro.build/en/core-concepts/astro-components/#slots) — *Use when:* defining named slots in layouts and passing slot content from pages.

### React

* Setup — [https://react.dev/learn/setup](https://react.dev/learn/setup) — *Use when:* environment & tooling.
* Typescript — [https://react.dev/learn/typescript](https://react.dev/learn/typescript) — *Use when:* typing components/hooks.
* State & Props — [https://react.dev/learn/managing-state](https://react.dev/learn/managing-state) — *Use when:* choosing state location & structure.
* Effects — [https://react.dev/learn/lifecycle-of-reactive-effects](https://react.dev/learn/lifecycle-of-reactive-effects) — *Use when:* side-effects; see *You might not need an Effect*.
* Reducers & Context — [https://react.dev/learn/scaling-up-with-reducer-and-context](https://react.dev/learn/scaling-up-with-reducer-and-context) — *Use when:* lifting/sharing state.
* Lists & Keys — [https://react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists) — *Use when:* mapping arrays.
* Performance (Compiler) — [https://react.dev/learn/react-compiler](https://react.dev/learn/react-compiler) — *Use when:* compiler adoption & perf.
* Escape hatches — [https://react.dev/learn/escape-hatches](https://react.dev/learn/escape-hatches) — *Use when:* refs, imperative DOM, measured updates.
* You might not need an Effect — [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

### shadcn UI

* Installation (Astro) — [https://ui.shadcn.com/docs/installation](https://ui.shadcn.com/docs/installation) — *Use when:* CLI & tokens for Astro.
* CLI — [https://ui.shadcn.com/docs/cli](https://ui.shadcn.com/docs/cli) — *Use when:* `init`, `add`, maintaining components.
* Components — [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) — *Use when:* API/props for any primitive.
* Dialog — [https://ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog) — *Use when:* modals.
* Form — [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) — *Use when:* with react-hook-form.
* Data Table — [https://ui.shadcn.com/docs/components/data-table](https://ui.shadcn.com/docs/components/data-table) — *Use when:* tabular collections.
* Toast/Sonner — [https://ui.shadcn.com/docs/components/sonner](https://ui.shadcn.com/docs/components/sonner) — *Use when:* notifications.
* Skeleton — [https://ui.shadcn.com/docs/components/skeleton](https://ui.shadcn.com/docs/components/skeleton) — *Use when:* loading placeholders.
* Sheet/Drawer — [https://ui.shadcn.com/docs/components/sheet](https://ui.shadcn.com/docs/components/sheet) — *Use when:* off-canvas UI.

### TypeScript

* **Type-only Imports & Exports** — [https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) — *Use when:* importing shared types into client code without bundling server modules.

---

### Appendix: Quick Reference (Cheatsheet)

**React island wrapper**

```tsx
export default function FilterBar(){
  const [q, setQ] = useState("")
  return (
    <div className="flex gap-2">
      <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" />
      <Button onClick={() => {/* trigger filter */}}>Apply</Button>
    </div>
  )
}
```

**Form (react-hook-form + Zod) → action (JSON)**

```tsx
import { actions, isInputError } from 'astro:actions'
const form = useForm<Inputs>({ resolver: zodResolver(InputSchema) })
<form onSubmit={form.handleSubmit(async (v)=>{
  const { data, error } = await actions.items.create(v) // JSON, no FormData
  if (error) {
    if (isInputError(error)) {
      Object.entries(error.fields).forEach(([name, messages])=>{
        form.setError(name as keyof Inputs, { message: messages.join(", ") })
      })
    }
    toast.error(error.message)
  } else {
    toast.success('Saved')
  }
})}>
  {/* shadcn <Form>, <FormField>, <Input>, <Button> */}
</form>
```

**Token usage**

```tsx
<div className="bg-background/50 text-foreground rounded-[var(--radius)]" />
```

**Slots quick tip**

```astro
<!-- consumer -->
<BaseLayout>
  <Fragment slot="head"><title>My Page</title></Fragment>
  <main slot="body">Hello</main>
</BaseLayout>

<!-- layout -->
<head><slot name="head" /></head>
<body><slot name="body" /></body>
```
