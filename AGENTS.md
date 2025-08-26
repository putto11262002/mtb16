# AGENTS.md

## Commands

- **Development server**: `bun dev`
- **Build**: `bun run build`
- **Preview**: `bun run preview`
- **Format code**: `bun run format` (runs prettier on all files)
- **Type checking**: Built into Astro, runs during build/dev

NEVER run bun dev can can assume that the server is running in development mode.

## Code Style Guidelines

### Imports

- Use absolute imports with `@/*` alias pointing to `./src/*`
- Import components with explicit extensions (e.g., `.astro`)
- Group imports logically (external libraries, then internal imports)

### Types

- TypeScript strict mode enabled
- JSX configured for React
- Type checking built into Astro tooling

### Naming Conventions

- Components: PascalCase (e.g., Button.astro)
- Pages: lowercase with hyphens (e.g., about.astro, markdown-page.md)
- Variables/functions: camelCase
- CSS classes: Tailwind utility classes preferred

### Error Handling

- Client-side errors should be handled gracefully
- Use Astro's built-in error boundaries where appropriate

### Component Structure

- Astro components use `.astro` extension
- Component script sections in `---` blocks
- Use Tailwind for styling
- Prefer functional components

# Git Workflow & Rules

## Principles

- **`main` is always clean and deployable.** Never commit directly.
- **One task = one branch = one PR.**
- **Always commit in small, incremental steps** (don’t wait until the end).
- **Rebase, don’t merge** – keep history linear.
- **All PRs must pass CI before merge.**

---

## Branch Naming

```
type/agent/slug
```

Examples:

- `feat/ui/sitemap-sync`
- `fix/server/404-handler`

---

## Commits

- Make **small, incremental commits** as you work.
- Use [Conventional Commits](https://www.conventionalcommits.org/):

  ```
  type(scope): short imperative summary
  ```

  Example: `feat(ui): add sitemap sync check`

---

## Standard Flow

```bash
# 1. Sync main
git checkout main
git pull origin main

# 2. Create branch
git checkout -b feat/ui/sitemap-sync

# 3. Work → commit often (small, incremental commits)
git add -A
git commit -m "feat(ui): add sitemap sync check"

# 4. Rebase to stay current
git fetch origin
git rebase origin/main

# 5. When task is done → push & create PR
git push -u origin feat/ui/sitemap-sync
gh pr create --fill --base main
```

---

## Merging

- **Squash merge** PRs into `main`.
- Delete branch after merge.

# Best Practices for Astro + React

### **1. Component Architecture & Hydration**

- **Astro for Structure:** Use Astro components (`.astro`) for all static page structure, layouts, and non-interactive content. These components are server-rendered and must not ship client-side JavaScript.
- **React for Interactivity:** Use React components (`.jsx`/`.tsx`) _only_ for isolated, interactive UI elements (islands). These components must be as small and focused as possible.
- **Strategic Hydration:** Apply `client:*` directives to React components deliberately.
  - Default to `client:visible` for components that are not in the initial viewport.
  - Use `client:idle` for lower-priority components that are in the initial viewport.
  - Use `client:load` sparingly, only for critical, immediately interactive UI.
- **No monolithic React apps:** Never wrap an entire page or large sections in a single client-side hydrated React component. Compose pages with multiple Astro components and small, targeted React islands.

### **2. Data Flow & State Management**

- **Server-Side Data Fetching:** All primary data fetching must occur in the server-side frontmatter (between the `---` fences) of `.astro` files.
- **Props-Down Communication:** Pass data from Astro components to React components exclusively via props. Do not perform initial data fetches inside a React component using `useEffect`.
- **Shared State:** For state that must be shared between different React islands, use a framework-agnostic store like **Nano Stores**. Do not use React Context, as islands are isolated and do not share a common provider tree.
- **Local State:** Use standard React hooks like `useState` and `useReducer` only for state that is fully contained within a single React island.

### **3. Assets & Styling**

- **Image Optimization:** Always use Astro's built-in `<Image />` or `<Picture />` components to handle image processing and optimization.
- **Scoped Styles:** Enforce style encapsulation. Utilize Astro's default scoped styling (`<style>` tags in `.astro` files) or CSS Modules to prevent global CSS conflicts.

## Project Architecture: Structure & Logic Conventions

### Directory Structure

src/
├── components/
│ ├── ui/ # Shadcn UI primitives (managed by CLI)
│ ├── islands/ # Interactive React components (UI Logic)
│ └── blocks/ # Static, server-rendered Astro components
├── layouts/
│ └── BaseLayout.astro
├── lib/
│ ├── utils.ts # Reusable functions (Business Logic)
│ └── api.ts # API clients or serverless functions
├── pages/
│ └── index.astro # Routes (Data Fetching & Composition Logic)
├── styles/
│ └── globals.css
└── store/
└── cart.ts # Shared state definitions (State Logic)
Application Logic Placement
Data Fetching & Composition Logic: Place in the frontmatter (---) of .astro files inside the src/pages/ directory. This is where you fetch data from APIs or databases and assemble the page by composing layouts and components.

Code snippet

---

// src/pages/index.astro
import { getProducts } from '../lib/api';
import ProductGrid from '../components/blocks/ProductGrid.astro';

// Data fetching logic lives here
const products = await getProducts();

---

<ProductGrid products={products} />
UI & Interaction Logic: Place inside React components (.tsx) within the src/components/islands/ directory. This includes handling user events (onClick, onChange), managing component-local state with useState, and any client-side animations or effects.

Reusable Business Logic: Place in helper files (.ts) inside the src/lib/ (or src/utils/) directory. This is for pure functions that can be shared across the entire application, such as data formatting, validation rules, or complex calculations. These helpers can be used on both the server (.astro files) and the client (React islands).

Shared State Logic: Define in store files (.ts) inside the src/store/ directory. Use a library like Nano Stores to create atoms or stores that manage state shared between different interactive islands (e.g., a shopping cart, user authentication status).
