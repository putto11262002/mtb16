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

## Project Architecture

- Database: Database schema and migrations
    - Uses Drizzle ORM to define schema, manage migrations, and interact with the database
    - `src/db/schema.ts`: Database schema definitions
    - `src/db/index.ts`: Drizzle ORM instance and database connection
- Core: The main application logic and rules
    - Zod for schema definition and validation. These schemas must be consistent with the database schema defined in `src/db/schema.ts`
    - Drizzle ORM for database interactions
    - `src/core/`: Core application logic and rules
- Astro Actions: Exposes usecases from core to the frontend via Astro server actions
    - `src/actions/`: Astro server actions
- Auth: Uses better-auth for authentication and authorization
    - `src/lib/auth/`: Better-auth setup and configuration
- UI Components: Shadcn UI components and custom components
    - `src/components/ui/`: Shadcn UI components
    - Use Shadcn as ui primitives and build custom components as needed by composing shadcn, radix-ui and tailwind utilities.
    - UI are all written in React and must not contain any environment specific code (e.g. Astro, React Router, etc)
- Hooks: Custom React hooks for client-side logic
    - `src/hooks/`: Custom React hooks
- Pages, Layouts, and Routing: Astro pages and layouts
    - `src/pages/`: Astro pages and routing
- Server-side rendering: call the usecases from core directly from Astro pages for SSR
- Client-side interactivity: 
    - React Queries: Client-side data fetching and state management using React Query
        - Provide the query client for parts of the app that need it.
        - `src/hooks/<feature>/{queries,mutations}.ts`: React Query hooks for specific features
    - React Router: For part of the application that requires highly dyanamic routing & data fetching
        - `src/lib/router/`: React Router setup and configuration
    - Try to push client-side interactivity down the component tree as much as possible. 
- Styles: Global styles and Tailwind configuration
    - `src/styles/`: Global styles and Tailwind configuration


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
