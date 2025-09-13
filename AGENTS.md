This file outlines the project structure, technologies used, conventions, rules for contributing to the codebase.
You MUST strictly thoroughly read and ADHERE to the rules and conventions outlined in this document.
You MUST read and adhere development guideline docs that details the aspect of the project you are working on.

## Tech
The project uses the following technologies:
- Language: TypeScript 5
- Frontend: Astro 5.13.5, React 19.1.1
- UI Library: Tailwind CSS 4.1.12
- UI Components: Shadcn UI (CLI managed)
- Backend: Astro server actions
- Database: Drizzle ORM 0.44.5, PostgreSQL 8.16.3
- Hosting: Netlify
- Package management: pnpm
- Version control: Git, GitHub


## CLI Tooling

- `pnpm dev`: Start the development server
- `pnpm build`: Build the project for production
- `pnpm preview`: Preview the production build locally
- `pnpm lint`: Lint the codebase
- `bash ./scripts/setup-postgres.sh`: Setup a local PostgreSQL database using Docker


## Operating Model

The core components of the development process are:
- Spec: A high-level description of a feature or task that outlines the desired outcome and acceptance criteria.
- Primitives: A set of pre-configured building blocks and environment presets; DB Client, Auth Client, Storage Client, Logger, Base Layout, UI Components, Design Tokens.
- Rules: Conventions, standards, and best practices that govern how code is written and organized. It must be followed strictly.
- Recipes: Opinionated assembly patterns that wires primitives together to solve common tasks. 
- Feature: A user-facing capability delivered by composing primitives according to rules and (where applicable) a recipe.

```
spec -> primitives + rules + recipes -> feature
```

1. Agents are given a spec.
2. Write code by composing primitives according to rules and (where applicable) a recipe.
3. Produce features that meet the acceptance criteria in the spec.

- Code is organized into two layers: **Application → Interface**.

- Each layer has its own concerns, primitives, and rules.

- The outer layer depends on the inner layer. The inner layer NEVER depends on the outer layer.

- Application Layer:

  - **Responsibility:** Data access, domain/business logic, validation, integrations (auth, storage), and the server action surface consumed by the Interface layer. **Schema is in this layer.**
  - **Tech:** TypeScript, Astro server actions, Drizzle ORM + PostgreSQL, Zod, Better Auth, file storage adapter, middleware.

  - Working files: 
    * `src/db/schema.ts` — database schema & relations
    * `src/lib/auth/index.ts` — server-side auth
    * `src/lib/storage/index.ts` — file storage factory (types in `src/lib/storage/types.ts`)
    * `src/lib/log/index.ts` — logging adapter
    * `src/middleware.ts` — request context surface
    * `src/actions/<feature>/action.ts` — action namespace per feature
    * `src/actions/<feature>/schema.ts` — Zod input/output schemas and inferred types
    * `src/actions/index.ts` — action aggregator

  - Primitives:
    * DB: 
        * `db` — Drizzle DB instance: `src/db/index.ts`.
    * Auth:
        * `auth` — Better Auth server instance: `src/lib/auth/index.ts`.
        * Types and database schemas: `src/lib/auth/schema.ts` (re-exported in `src/db/schema.ts`); 
        * `ctx.locals.user` — current user (injected by middleware).
    * Storage:
        * `getFileStore()` — factory function: `src/lib/storage/index.ts`.
        * Types, inferfaces: `src/lib/storage/types.ts`.
    * Middleware -  Injects per-request context (e.g., `auth` user) into `ctx.locals`: `src/middleware.ts`.
   - API surface:
        * `src/actions/index.ts` — aggregate and export all server actions.
        * `src/actions/<feature>/action.ts` — feature-specific action namespaces.
        * `src/actions/<feature>/schema.ts` — feature-specific Zod input/output schemas and inferred types.
    - Logging:
        * `getLogger()` — factory function that returns a `Logger` instance: `src/lib/log/index.ts`.
      

- Interface Layer:

  - Responsibility: Page rendering, UI composition, client-side interaction, and calling the Application layer via the exposed action surface.
  - **Tech:** Astro, React, Tailwind CSS, shadcn/ui.

  - Working files:
    * `src/pages/` — pages (must render under BaseLayout)
    * `src/layouts/` — layout components (must extends BaseLayout)
    * `src/components/client/<feature>/*` — client-only components (React, Astro islands)
    * `src/components/server/<feature>/*` — server-rendered feature-specific components
    * `src/hooks/<feature>/*` — feature-specific React hooks (e.g., data fetching, mutations)

  * **Primitives:
    * BaseLayout - BaseLayout that provides basic HTML structure, imports global CSS/JS, and has `head` and `body` slots: `src/layouts/BaseLayout.astro`.
    * Shadcn UI components — installed and managed via the `shadcn/ui` CLI: `src/components/ui/*`.
    * Auth: 
        * `authClient` — Better Auth client instance: `src/lib/auth/client.ts`.
        * Types: `src/lib/auth/types.ts`.
    * Error Files: 
        * `src/pages/404.astro` — 404 Not Found page.
        * `src/pages/500.astro` — Custom 500 error page.

  * Dependency on Application layer:
    * Use server actions for both mutations and queries.
    * Refer to actions input/output schemas for typing and frontend validation.

##  Development Guidelines  (Rules + Recipes)

- Interface: @docs/dev_guides/interface.md
- Application: @docs/dev_guides/application.md


## Rules and Conventions

## Typescript
- Use `interface` for defining object shapes
- Use `type` for union and intersection types
- Prefer `readonly` for immutable data structures
- Use `unknown` instead of `any` whenever possible
- Use `async/await` for asynchronous code
- Use `Promise.all` for concurrent asynchronous operations
- Use `const` for variables that are not reassigned
- ALWAYS type your functions and components, never rely on inference

## Import rules
   - Use ES module syntax (`import`/`export`)
   - Use @/ alias for absolute imports from `src` e.g. `import Button from '@/components/Button'`
