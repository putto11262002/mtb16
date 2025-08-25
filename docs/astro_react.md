# Astro + React LLM Coding Agent — Breadth‑First Quick Context

> Use this as a **short, practical reference** while editing an Astro + React codebase. Keep changes **small, typed, accessible, and idiomatic**.

---

## 0) Golden Rules (TL;DR)

* **Server‑first data fetching**: fetch in `.astro` frontmatter or API endpoints; only fetch in React when user interaction/live state requires it.
* **React files use `className`** (never `class`).
* **In `.astro`**: use `class` for normal HTML; when mounting a **React component**, pass styling via its `className` prop.
* Prefer **islands**: render minimal React with `client:*` directives; keep most markup in `.astro`.
* **Type everything** (props, loaders) with TypeScript.
* **A11y first** (labels, roles, keyboard, focus states, alt text).
* **Performance**: ship less JS, use `client:idle` / `client:visible`; optimize images.
* **Consistency**: Tailwind + shadcn/ui; follow project tokens.

---

## Task Approach Framework (for LLM)

**Goal:** ship small, correct changes. Prefer server HTML + small React islands.

### 0) Triage

* **What is asked?** (new page, section, component, behavior, style)
* **Inputs available?** (APIs, copy, assets, tokens)
* **Interactivity needed?** If **no**, stay in `.astro`.

### 1) Render Model Decision (quick tree)

* **Static HTML only?** → `.astro` markup.
* **Server data, no client state?** → Fetch in `.astro` frontmatter, render HTML.
* **Needs client interaction/live state?** → Extract smallest possible **React island** with `client:*` and keep data flow top‑down.

### 2) Decompose UI

* **Page → Layout → Sections → Components**

  * **Layout** when multiple pages share head/body chrome or wrappers.
  * **Section component** for reusable blocks (hero, feature grid).
  * **Extract component** if:

    * repeated ≥2×,
    * exceeds \~30–50 lines,
    * has its own semantics/a11y,
    * needs parameters (text, href, variant).
* Prefer `.astro` components for static/repeatable markup; **React** only for interactive pieces.

### 3) Define Props & Slots

* Pages/layouts: use **`<slot />`** for content holes.
* Components: minimal, **typed props**; avoid `any`.
* Style via `class` (Astro HTML) or `className` (React). Support a small `variant` prop when useful.

### 4) Data Flow (server‑first)

* Fetch on server in `.astro`; map to **plain props** for components.
* Only fetch in React when strictly needed (user input, polling, websockets).

### 5) Accessibility & Perf Guardrails

* Landmarks (`<main>`, `<nav>`), labels, keyboard paths.
* Hydration: choose `client:visible`/`client:idle` by default.
* Images lazy/optimized, avoid large client bundles.

### 6) Quick Refactor Recipes

**A. Extract to Astro component with slots**

```astro
---
// src/components/FeatureRow.astro
const { title, href } = Astro.props as { title: string; href: string };
---
<section class="grid gap-3 md:grid-cols-2">
  <h3 class="text-xl font-semibold">{title}</h3>
  <div class="text-muted-foreground"><slot /></div>
  <a class="link" href={href}>Learn more →</a>
</section>
```

Usage:

```astro
<FeatureRow title="Fast" href="/docs/speed">Runs quick on edge.</FeatureRow>
```

**B. Extract minimal React island**

```tsx
// src/components/CopyButton.tsx
import { useState } from "react";
export default function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="btn" onClick={() => { navigator.clipboard.writeText(text); setOk(true); }}>
      {ok ? "Copied" : "Copy"}
    </button>
  );
}
```

Mount:

```astro
<CopyButton client:visible text={code} />
```

**C. Promote shared chrome to a layout**

```astro
---
// src/layouts/Docs.astro
const { title } = Astro.props as { title: string };
---
<html lang="en">
  <body class="grid md:grid-cols-[240px,1fr]">
    <aside class="p-4"><slot name="nav" /></aside>
    <main class="p-6">
      <h1 class="text-3xl font-bold">{title}</h1>
      <slot />
    </main>
  </body>
</html>
```

Page usage:

```astro
<Docs title="Getting Started">
  <nav slot="nav">…</nav>
  <p>Content…</p>
</Docs>
```

**D. Convert large interactive block → small island**

* Keep container markup in `.astro`.
* Move the interactive controls only into React.
* Pass **primitive props**, avoid passing complex DOM.

> When unsure: start in `.astro`, then introduce a tiny island.

---

## 1) Project Structure (minimal mental model)

```
src/
  pages/                 # route-based; .astro or .mdx map to URLs
    index.astro
    about.astro
    api/health.ts        # endpoint: /api/health
  components/            # UI components (React .tsx or Astro .astro)
  layouts/               # shared page layouts (.astro)
  lib/                   # utilities (ts)
public/                  # static assets served at /
```

**Routing:** `src/pages/foo.astro` → `/foo`. Folders/`index.astro` map as expected.

---

## 2) Astro Basics (safe patterns)

**.astro file anatomy**

```astro
---
// Frontmatter: TypeScript allowed
import BaseLayout from "../layouts/BaseLayout.astro";
import Counter from "../components/Counter.tsx";
const { title = "Home" } = Astro.props as { title?: string };
---
<BaseLayout title={title}>
  <h1 class="text-2xl font-semibold">Welcome</h1>
  <Counter client:idle initial={0} />
</BaseLayout>
```

* Use **frontmatter fence** `---` for imports/logic.
* Pass data to React islands with **`client:*`**: `client:load | client:idle | client:visible | client:media | client:only`.
* Static HTML in `.astro` supports `class` (not `className`).
* Access env: `import.meta.env.PUBLIC_*` (client-safe). Server‑only: `import.meta.env.SECRET_*` (naming varies by project policy).

**Layouts** (wrap pages):

```astro
---
const { title = "" } = Astro.props as { title?: string };
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · MySite</title>
  </head>
  <body class="min-h-screen bg-background text-foreground">
    <slot />
  </body>
</html>
```

**Endpoints (API)**

```ts
// src/pages/api/health.ts
import type { APIRoute } from "astro";
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
};
```

---

## 2.1) Class vs `className` (quick examples)

**Correct in `.astro`:**

```astro
---
import Counter from "../components/Counter.tsx";
---
<div class="p-4">            <!-- HTML uses `class` -->
  <Counter client:visible className="text-sm" /> <!-- React prop uses `className` -->
</div>
```

**Correct in React (`.tsx`):**

```tsx
export function Badge() {
  return <span className="inline-block rounded px-2">New</span>; // React uses className
}
```

## 3) React in Astro (islands)

**React component template**

```tsx
// src/components/Counter.tsx
import { useState } from "react";

export default function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className="rounded-lg border px-3 py-1"
        onClick={() => setCount((c) => c - 1)}
        aria-label="Decrease"
      >–</button>
      <output className="tabular-nums" aria-live="polite">{count}</output>
      <button
        type="button"
        className="rounded-lg border px-3 py-1"
        onClick={() => setCount((c) => c + 1)}
        aria-label="Increase"
      >+</button>
    </div>
  );
}
```

**Mounting from `.astro`**

```astro
<Counter client:visible initial={2} />
```

**Do not** import React components into other React components via `.astro` assumptions—treat them like normal React once inside React.

---

## 4) Styling & UI Kit

* Tailwind enabled: prefer **utility classes**; keep class lists short.
* Use **design tokens** (e.g., `text-foreground`, `bg-background`).
* Prefer **shadcn/ui** for primitives; import per component.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

---

## 5) Data Fetching Patterns

* **Server‑first (default):** Fetch in `.astro` frontmatter (build/SSR) or dedicated API endpoints, then render HTML or pass data as props to islands.

```astro
---
const res = await fetch("https://api.example.com/posts.json");
const posts: Array<{ id: string; title: string }> = await res.json();
---
<ul>
  {posts.map((p) => <li>{p.title}</li>)}
</ul>
```

* **Client fetch in React** only when **interactivity or live state** demands it (e.g., user‑driven updates, websockets, polling). Keep islands small.
* Consider caching / revalidation mechanisms provided by the project when server‑fetching.

---

const res = await fetch("[https://api.example.com/posts.json](https://api.example.com/posts.json)");
const posts: Array<{ id: string; title: string }> = await res.json();
---------------------------------------------------------------------

<ul>
  {posts.map((p) => <li>{p.title}</li>)}
</ul>
```
- **React client fetch** only if user interaction or live state requires it.
- Cache with `fetch` Request `cache`/`revalidate` or project helper (if provided).

---

## 6) Accessibility Cheatsheet

* Provide **alt** text; skip decorative with `alt=""`.
* Label controls (`<label for>` / `aria-label`); ensure **focus rings** visible.
* Keyboard: `Enter/Space` activate buttons; `role` only when semantics missing.
* Use `<nav>`, `<main>`, `<header>`, `<footer>` landmarks.

---

## 7) Performance Defaults

* Prefer **`client:visible`** over `client:load`.
* Use `<Image />` (if project configured) or `<img loading="lazy" decoding="async">`.
* Split islands; avoid lifting large libraries to client.
* Inline small SVGs; sprite or componentize icons.

---

## 8) State & Props

* Keep React islands **small and local**; lift state only when needed.
* Type props:

```ts
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
```

* Avoid context unless multiple siblings need shared state.

---

## 9) Common Pitfalls (quick fixes)

* **React:** must use `className`, not `class`.
* **Astro:** don’t put JSX-only syntax in `.astro` frontmatter render; use proper braces in markup.
* **Hydration:** using a React component without `client:*` means it renders **only at build/SSR**, no interactivity.
* **Env:** never expose secrets to client; only `PUBLIC_` variables are safe for browser.

---

## 10) Testing & Linting

* Run lint/format before commit; follow repo configs (ESLint, Prettier, TypeScript strict).
* Prefer **component tests** for React islands; keep snapshots stable.

---

## 11) Minimal Templates (copy‑paste)

**New page**

```astro
---
import Base from "../layouts/BaseLayout.astro";
const { title = "New Page" } = Astro.props as { title?: string };
---
<Base title={title}>
  <section class="container mx-auto py-12">
    <h1 class="text-3xl font-bold">{title}</h1>
    <p class="mt-4 text-muted-foreground">Hello, Astro.</p>
  </section>
</Base>
```

**Simple React island**

```tsx
type ToggleProps = { label: string };
export default function Toggle({ label }: ToggleProps) {
  const [on, setOn] = useState(false);
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <span>{label}: {on ? "On" : "Off"}</span>
    </label>
  );
}
```

**Endpoint with params**

```ts
// src/pages/api/echo/[id].ts
import type { APIRoute } from "astro";
export const GET: APIRoute = ({ params, url }) => {
  return new Response(JSON.stringify({ id: params.id, q: url.searchParams.get("q") }), {
    headers: { "content-type": "application/json" },
  });
};
```

---

## 12) Review Checklist (before commit)

* [ ] Builds locally
* [ ] No React `class` usage; all `className`
* [ ] Islands use appropriate `client:*`
* [ ] Props & APIs typed; no `any`
* [ ] A11y: labels, roles, alt, keyboard
* [ ] Images lazy/optimized; no oversized imports
* [ ] No secrets in client code
* [ ] Lint/format clean

---

## 13) Approach Framework (when coding)

When tackling a task (new page, feature, or refactor), follow this framework:

1. **Clarify the scope**

   * What is being built? (page, component, layout, data flow)
   * Server or client concern?

2. **Choose placement**

   * Pages → `src/pages/`
   * Shared layout → `src/layouts/`
   * Reusable UI → `src/components/`
   * Utilities/data → `src/lib/`

3. **Decompose**

   * Break large UIs into small, typed components.
   * Extract repeated structures into layouts or partials.
   * Keep React islands **minimal**; prefer Astro for structure.

4. **Data strategy**

   * Default: fetch server‑side in `.astro` or API route.
   * Only fetch in React if interaction/live updates needed.

5. **Styling**

   * Use Tailwind tokens.
   * Apply `class` in Astro HTML, `className` in React.
   * Reuse shadcn/ui primitives.

6. **Accessibility & semantics**

   * Use landmarks, labels, keyboard support.
   * Test with keyboard only.

7. **Performance**

   * Hydrate minimally (`client:visible`/`idle`).
   * Optimize assets, lazy‑load images.

8. **Final review**

   * Run through checklist above.
   * Ensure consistent patterns, no duplication.

---

