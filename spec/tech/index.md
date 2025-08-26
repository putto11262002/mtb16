# Technical Specification

## 1) Project Context

- **Domain:** MBT 16 (มณฑลทหารบกที่ 16) - A platform for public relations for the army unit.
- **Scale & SLOs:**
  - Audience: Army Personnel, Local Community, General Public.
  - Performance SLOs: LCP < 2.5s (mobile), FID < 100ms, CLS < 0.1.
- **Constraints:**
  - Technical: Astro, Tailwind CSS, TypeScript, Bun. Emphasis on cheap hosting, leveraging static site generation (SSG) for most content. PocketBase with SQLite for the backend.
  - Time / Budget: Not specified, aiming for cost-effective hosting.
- **Non‑functionals:**
  - Primary Language: Thai.
  - Security: No sensitive data handling.

## 2) System Overview (Technology-Agnostic)

- **Runtime Model:**
  - **Option A (Recommended):** Primarily Static Site Generation (SSG) for most content, with client-side islands (React) for interactivity. Server-Side Rendering (SSR) or Incremental Static Regeneration (ISR) for dynamic content feeds (news, announcements) to ensure content freshness.
  - **Option B:** Server-Side Rendering (SSR) for all pages.
  - **Trade-offs:** Option A offers better performance and cost-efficiency for static content, aligning with project goals. Option B is simpler for dynamic content but may incur higher hosting costs.
- **API Style:**
  - **Option A (Recommended):** REST API, leveraging PocketBase's built-in capabilities.
  - **Option B:** GraphQL API.
  - **Trade-offs:** Option A is simpler and directly supported by PocketBase. Option B adds complexity but offers more flexibility for complex data fetching patterns.
- **Data Tier:**
  - **Option A (Recommended):** SQLite, managed by PocketBase.
  - **Option B:** Another database.
  - **Trade-offs:** Option A aligns with the chosen backend (PocketBase) and its default configuration, emphasizing simplicity and cost-effectiveness.
- **Files/Media:**
  - **Option A (Recommended):** PocketBase's built-in file storage and serving.
  - **Option B:** Cloud storage (e.g., S3) and CDN.
  - **Trade-offs:** Option A is simpler and more cost-effective initially. Option B offers greater scalability and performance but adds complexity and cost.
- **AuthN/AuthZ:**
  - **Option A (Recommended):** PocketBase's built-in authentication for the admin interface. Public-facing content is unauthenticated.
  - **Option B:** Custom authentication.
  - **Trade-offs:** Option A leverages the backend's features for administrative access. Public content requires no special authentication.
- **Background Work:**
  - **Option A (Recommended):** No explicit background work for initial scope.
  - **Option B:** Bun's capabilities or a simple task queue if media processing or scheduled tasks arise.
  - **Trade-offs:** Option A keeps the architecture lean. Option B adds overhead but prepares for future needs.
- **Caching Layers:**
  - **Option A (Recommended):** Astro's SSG/ISR capabilities, browser caching, and CDN for assets.
  - **Option B:** Additional caching layers (e.g., Redis) for API/data.
  - **Trade-offs:** Option A provides efficient caching with minimal added complexity. Option B offers more fine-grained control at the cost of increased infrastructure.

## 3) Directory & Module Map — “Where Things Go”

> This section removes ambiguity: _exact_ locations & boundaries.

```

/app               # UI routes/screens (public/secure separated)
/components        # Reusable presentational components (no data calls)
/features          # Vertical slices; each owns UI + hooks + services + tests
/<entity>/
ui/            # feature-specific UI
api/           # client SDK wrappers for API endpoints
domain/        # types, guards, pure business logic
state/         # store/selectors (if client state exists)
tests/         # unit/integration for this feature
/lib               # cross-cutting utilities (date, fmt, logger)
/api               # server-side endpoints/controllers/resolvers
/services          # app services (auth, mail, payment, storage)
/db                # schema/migrations/seeds/query builders
/queues            # workers, jobs, schedulers
/config            # env schema, runtime config mapping
/security          # policies, permission maps, input/output validation
/observability     # logging/metrics/tracing config, dashboards
/spec              # specs (project, data-model, tech, pages, UI guidelines

```

- **Routing rules:** {how routes map to features, guarded routes location}
- **Co-location:** tests and types live with code they validate.
- **No cross‑feature imports** from `domain/` without explicit boundary doc.

## 4) Conventions Registry (Single Source of Truth)

> Define once. All agents must follow.

- **Naming**
  - Files: `kebab-case.ts`; React/Components: `PascalCase.tsx`
  - Hooks: `useThing.ts`; Schemas: `ThingSchema.ts`; Types: `Thing`
- **Error Handling**
  - Domain errors vs transport errors; error codes table; user‑safe messages
- **Validation**
  - **Input**: schema‑first on API boundary; **Output**: response schema
  - Client forms mirror server schema; shared validators in `/security`
- **API**
  - REST: `/{resource}` (list/create), `/{resource}/{id}` (read/update/delete)
  - GraphQL: queries for reads, mutations for writes; pagination standard
  - Pagination: cursor‑based preferred; include `total/hasNext` semantics
- **Auth**
  - Session vs token; token TTL/refresh; CSRF strategy (if cookies)
  - RBAC roles matrix and permission gates; decorators/guards location
- **State**
  - Server state from API; client state only for UI/ephemeral concerns
  - Caching keys & invalidation events catalog
- **i18n**
  - Keys format `feature.scope.message`; where translation files live
- **Styling**
  - Design tokens source of truth; utility vs component styles; theming switch
- **Logging/Tracing**
  - Log levels, PII policy, trace propagation, correlation IDs
- **Security**
  - Threat model checklist; allowlist/denylist locations; secrets handling
- **Accessibility**
  - Keyboard paths, focus traps, landmarks, color contrast policy

## 5) CRUD Playbooks (Per Entity)

> Repeat per entity in `spec/data-model.md`.

### Entity: `{EntityName}`

- **Routes**
  - List: `/entities`
  - Create: `/entities/new`
  - Read: `/entities/:id`
  - Update: `/entities/:id/edit`
- **API Contract**
  - List: `GET /api/entities?cursor=&limit=`
  - Create: `POST /api/entities` (body: `CreateEntityInput`)
  - Read: `GET /api/entities/{id}`
  - Update: `PATCH /api/entities/{id}` (body: `UpdateEntityInput`)
  - Delete: `DELETE /api/entities/{id}`
- **Validation Schemas**
  - `CreateEntityInput`, `UpdateEntityInput`, `EntityDTO` (server & client)
- **AuthZ**
  - Role matrix for list/read/create/update/delete (RBAC table)
- **Files**
  - Fields storing files? Storage bucket/path convention; max size; MIME allowlist
- **Indexes**
  - Query patterns and required DB indexes
- **Optimistic UI**
  - Which mutations support optimistic updates and rollback policy

## 6) Authentication & Authorization

- **Identity Providers:** {email/password, OTP, OAuth, SSO}, fallback flows
- **Sessions/Tokens:** {cookie/session vs JWT/Bearer}; refresh/rotation policy
- **RBAC/ABAC:** roles, attributes, permission check location (`/security`)
- **Protected Routes:** guard strategy; anonymous vs authenticated areas

## 7) Files & Media

- **Storage backend:** {local, S3‑like, vendor}; bucket naming; regions
- **Security:** signed URLs, time‑bound access, virus scan hooks
- **Derivatives:** thumbnails/transcodes; background job pipeline
- **CDN strategy:** cache headers, purge rules

## 8) Database

- **Modeling:** normalization guidelines, soft delete policy, multi‑tenant strategy
- **Migrations:** where migration files live; forward/backward rules
- **Transactions:** when required; idempotency for writes
- **Performance:** indexing policy; query budgets; N+1 avoidance

## 9) API Design Details

- **Versioning:** `v1` path or header; deprecation window
- **Errors:** canonical problem detail shape; machine‑readable codes
- **Rate Limits:** per IP/user/key; retry‑after semantics
- **Webhooks/Realtime:** event names, payload contracts, signing

## 10) Performance & Accessibility Budgets

- **Perf:** LCP ≤ 2.5s (mobile), CLS < 0.1, TTI ≤ 3s, initial JS ≤ 200KB gz
- **A11y:** WCAG 2.1 AA baseline, keyboard paths for all critical flows
- **Images:** responsive rules; lazy‑loading policy; font loading strategy

## 11) Testing Strategy

- **Unit:** domain logic, utils (co‑located in `tests/`)
- **Integration:** API + DB with fixtures; contract tests
- **E2E:** critical user journeys; auth + file upload paths
- **A11y:** automated scans + scripted keyboard checks
- **Test Data:** seeds in `/db/seeds`; anonymized sample datasets

## 12) Observability & Operations

- **Logs:** structure, redaction rules, retention
- **Metrics:** RED/USE for services; SLO alerts
- **Tracing:** spans across API/DB/queues
- **Feature flags:** storage & rollout policy
- **Incident basics:** error budgets, rollback guidelines

## 13) Environment & Deployment

- **Config:** env var schema and defaults; config loader location (`/config`)
- **Envs:** local, staging, prod — differences and guardrails
- **Build/Deploy:** pipeline stages; smoke checks; database migration step
- **Secrets:** where/how loaded; rotation cadence

## 14) Decision Log (auto‑maintained)

- Summaries of confirmed choices (sourced from `todowrite` entries)
