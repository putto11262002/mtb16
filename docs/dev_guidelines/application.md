Here is the provided content in an appropriate Markdown format.

## Application Layer Guidelines (Astro Actions + Drizzle)

### 2\) Scope, Responsibilities & Interaction Points

**Scope:** The Application layer: data access, domain logic, validation, auth/storage integrations, and the server-action surface consumed by the Interface layer.

**Out of scope:** UI concerns (React/Astro components), styling, client-side state.

**Responsibilities:** Turn validated inputs → thin DTO outputs within perf/security budgets; own DB schema contracts; enforce auth/ownership; expose capabilities via server actions.

**Interaction Points:**

  * **Upstream (primitives):** DB (`db`, `schema`), auth (`auth`), storage (`FileStore`).
  * **Downstream (interface):** Interface layer calls `server.<feature>.<action>()` only.
  * **Boundaries:** Primitives → Application → Interface allowed; no reverse imports.

\<pre\>
\<infra/primitives\>  \<--\>  \<application\>  \<--\>  \<interface\>
^                     | exposes actions      |
|                    +------------------------+
|                          consumes primitives
\</pre\>

-----

### 3\) Working Files, Primitives & Dependency Map

#### Working Files (exact paths & roles)

  * `src/actions/<feature>/action.ts` — feature action namespace export
  * `src/actions/<feature>/schema.ts` — Zod I/O (use `astro:schema`)
  * `src/actions/shared.ts` — `MutationResult`, `PaginatedQueryResult<T>`, `PaginationParams`
  * `src/actions/index.ts` — aggregate: `export const server = { users, posts, … }`
  * `src/db/index.ts` — exports `db` (configured with `{ schema }`)
  * `src/db/schema.ts` — authoritative DB schema & relations
  * `src/lib/auth/index.ts` — server-side auth
  * `src/lib/storage/index.ts`, `src/lib/storage/types.ts` — `getFileStore()`, `FileStore`
  * `src/middleware.ts` — injects `ctx.locals.user`

#### Primitives (import from where)

  * `import { db } from '@/db'` → `src/db/index.ts`
  * `import * as schema from '@/db/schema'` → `src/db/schema.ts`
  * `import { auth } from '@/lib/auth'` → `src/lib/auth/index.ts`
  * `import { getFileStore } from '@/lib/storage'` and `import type { FileStore } from '@/lib/storage/types'`
  * `import { defineAction, ActionError } from 'astro:actions'`
  * `import { z } from 'astro:schema'` (use this, not plain zod) ([docs.astro.build](https://docs.astro.build))

#### Import Rules

  * Application may import primitives; never import Interface components.
  * Interface calls Application only via actions; no direct DB/auth/storage usage.

#### Minimal tree

```
src/
  actions/
    <feature>/
      action.ts
      schema.ts
    shared.ts
    index.ts
  db/
    index.ts
    schema.ts
  lib/
    auth/index.ts
    storage/index.ts
    storage/types.ts
  middleware.ts
```

-----

### 4\) Core/Global Modules & Interactions

**Modules (overview):** Server Actions, Database Schema, Data Access (Drizzle/RQB), Storage, Performance/Reliability.

**Interaction Rules**

  * Interface → Application via `server.<feature>.<action>()`; no imports of `actions/<feature>/internal`.
  * Application uses `db`, `auth`, `FileStore`; cross-module errors use typed action errors.
  * **High-level Workflow:** validate input (`astro:schema`) → authorize (`ctx.locals.user`) → query/mutate via Drizzle → map to thin DTO → return (no clients/streams).

-----

### 5\) Modules

#### 5.1 Module: Server Actions

##### 5.1.1 Rules

  * Define actions with `defineAction({ input, handler, accept? })`.
  * Group per feature: `export const <feature> = { ... }`; aggregate in `src/actions/index.ts` as `export const server = { ... }`.
  * Validate with `z` from `astro:schema`; throw `ActionError` (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL`). ([1])

##### 5.1.2 Patterns & Recipes

  * **Create action**
      * Add `schema.ts` with input/output Zod (from `astro:schema`).
      * Implement `action.ts` with `defineAction`.
      * Namespace export `export const <feature> = { <actionA>, <actionB> }`.
      * Aggregate in `src/actions/index.ts` as `server`.
      * **Tests:** unit for pure logic; integration for DB.
  * **Forms**
      * For HTML forms, set `accept: 'form'`; use `z.instanceof(File)` for file inputs. ([1])

##### 5.1.3 Examples

```ts
// src/actions/users/action.ts
import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { MutationResult } from '@/actions/shared'

export const create = defineAction({
  input: z.object({ email: z.string().email(), name: z.string().min(1).max(120) }),
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Login required.' })
    const exists = await db.select({ id: schema.users.id })
      .from(schema.users).where(eq(schema.users.email, input.email))
    if (exists.length) throw new ActionError({ code: 'CONFLICT', message: 'Email already exists.' })
    const now = new Date()
    const [row] = await db.insert(schema.users).values({ email: input.email, name: input.name, createdAt: now, updatedAt: now })
      .returning({ id: schema.users.id })
    return { ok: true, id: row.id, message: 'User created' }
  },
})
export const users = { create }
```

##### 5.1.4 References

  * Astro Actions overview, forms, ActionError, `astro:schema`. ([1])

##### 5.1.5 Common Workflows

  * **Add a new feature (schema + actions + tests) — checklist:**
      * Define/extend `schema.ts` with Zod from `astro:schema`
      * Implement actions; group in `export const <feature>`
      * Aggregate in `src/actions/index.ts` (`server`)
      * Add tests (unit/integration)
      * Use `ActionError` codes; return thin DTOs only ([1])

##### 5.1.6 Checklist

  * Inputs validated via `astro:schema`
  * Namespaced + aggregated exports
  * Errors are controlled (`ActionError`)

##### 5.1.7 Common Pitfalls

  * Importing plain zod instead of `astro:schema`
  * Scattered actions not aggregated into `server`

-----

#### 5.2 Module: Database Schema (src/db/schema.ts)

##### 5.2.1 Rules

  * **IDs:** `uuid` PRIMARY KEY `DEFAULT gen_random_uuid()` (pgcrypto). ([2], [4], [5])
  * **Timestamps:** `timestamptz` for `created_at`/`updated_at`; `created_at DEFAULT now()`; bump `updated_at` in writes. ([3], [5])
  * No soft deletes; archive if needed.
  * Table names: `snake_case` plural; `uniques` for natural keys; `indexes` for hot filters/joins.

##### 5.2.2 Patterns & Recipes

  * Centralize enums, uniques, and indexes in schema file.
  * Use `relations(...)` for type-safe joins; set `onDelete`/`onUpdate` explicitly.

##### 5.2.3 Examples

```ts
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ usersEmailUq: uniqueIndex('users_email_uq').on(t.email) }))
```

##### 5.2.4 References

  * Drizzle PG column types (`uuid`/`timestamps`). ([5])
  * PostgreSQL UUID, pgcrypto, datetime types. ([2], [3], [4])

##### 5.2.5 Common Workflows

  * `TIMESTAMPTZ` migrations: use explicit `USING` when altering timestamp types.

##### 5.2.6 Checklist

  * PK `uuid` default via `gen_random_uuid()`
  * `timestamptz` + defaults
  * Deterministic order columns available for pagination

##### 5.2.7 Common Pitfalls

  * Casting timestamp types without `USING` clause during migration (include explicit SQL).

-----

#### 5.3 Module: Data Access with Drizzle (RQB-First)

##### 5.3.1 Rules

  * Prefer RQB: `db.query.<table>.findMany({ with: {...} })` → one SQL, typed nested results. ([10])
  * Use operators (`eq`, `and`, `ilike`, …) for safe filtering. ([12])
  * Deterministic ordering for pagination; append a unique column. ([7])

##### 5.3.2 Patterns & Recipes

  * Initialize `db` with `{ schema }` to enable cross-file typing. ([10])
  * **Pagination**
      * Small/slow sets: `limit`/`offset`.
      * Large/fast sets: cursor-based (order by unique/sequential columns). ([14])

##### 5.3.3 Examples

```ts
// RQB with relation, deterministic order
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true, createdAt: true },
  with: { author: { columns: { id: true, email: true } } },
  orderBy: (t, { desc, asc }) => [desc(t.createdAt), asc(t.id)],
  limit: 20,
  offset: 0,
})
```

##### 5.3.4 References

  * RQB, `select`/`limit`/`offset`, operators, cursor pagination, \`sql\`\`. ([10], [11], [12], [14], [15])

##### 5.3.5 Common Workflows

  * **List with filters & pagination**
      * Enforce `pageSize` cap; whitelist `orderBy`.
      * Count totals separately if needed.
  * **Update rows with `updated_at`**
      * Always bump `updated_at` on writes.
  * **Hard delete**
      * Use `DELETE` with proper auth and cascading.

##### 5.3.6 Checklist

  * Projection of only needed columns
  * Operators used (no string SQL building)
  * Deterministic order
  * Prepared statements on hot paths (optional) ([13])

##### 5.3.7 Common Pitfalls

  * Non-deterministic pagination ordering
  * Skipping transactions for multi-step mutations

-----

#### 5.4 Module: Storage Integration (FileStore)

##### 5.4.1 Rules

  * Interact via `FileStore` only; never return raw buffers/streams from actions (return IDs/metadata).

##### 5.4.2 Patterns & Recipes

```ts
import { getFileStore } from '@/lib/storage'
import type { FileStore } from '@/lib/storage/types'
const files: FileStore = getFileStore()
const meta = await files.store(fileBuffer, { name: input.name, mimeType: input.mimeType })
const stream = await files.getStream(meta.id)
```

##### 5.4.3 References

  * Forms + file inputs in Actions. ([1])

-----

#### 5.5 Module: Performance & Reliability

##### 5.5.1 Rules

  * Projection first; index hot filters/joins (§5.2).
  * Prepared statements for hot paths; bound parameters. ([13])
  * No implicit caching; add cache explicitly if needed.

##### 5.5.2 Examples

```ts
import { sql } from 'drizzle-orm'
const userById = db
  .select({ id: schema.users.id, email: schema.users.email })
  .from(schema.users)
  .where(eq(schema.users.id, sql.placeholder('id')))
  .prepare('user_by_id')
const row = await userById.execute({ id })
```

##### 5.5.3 Checklist

  * Index coverage for hot queries
  * Prepared on hot paths
  * Read/write separation (if replicas introduced)

-----

### 6\) Global Workflow (end-to-end)

**Trigger:** Interface calls `server.<feature>.<action>()` → **Path:** validate (Zod via `astro:schema`) → authorize (`ctx.locals.user`) → execute Drizzle query/transaction → map to DTO (serializable) → return → telemetry (logs/traces).

-----

### 7\) Global Checklist (DoD)

  * Rules respected (no boundary violations)
  * Inputs validated with `astro:schema`; outputs are thin DTOs
  * Aggregated actions in `server`
  * RQB/pagination guidance followed; deterministic order
  * Multi-step writes in transactions; `updated_at` bumped
  * Schema: `uuid` PK via `gen_random_uuid()`, `timestamptz` timestamps
  * No soft deletes
  * Tests green; docs updated

-----

### 8\) Important Notes

Keep **Rules** centralized; prefer **Recipes** to reduce variance; keep **Examples** runnable.

For \~20% edge cases, consult **References** in each module and document trade-offs in PRs.

-----

### Appendix: Quick Reference (Cheatsheet)

**// Actions (aggregate)**

```ts
import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
export const server = { users, posts }
```

**// Schema PK & timestamps**

```ts
id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
```

**// RQB select with relations**

```ts
await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: { author: { columns: { id: true, email: true } } },
  orderBy: (t, { desc, asc }) => [desc(t.createdAt), asc(t.id)],
  limit: 20, offset: 0,
})
```

**// Operators**

```ts
import { eq, and, ilike, desc, asc } from 'drizzle-orm'
```

**References (Deep Links)**

  * **Astro Actions** — overview, organization, forms, ActionError, `z` from `astro:schema`. ([docs.astro.build](https://docs.astro.build))
  * **Drizzle ORM** — RQB (`db.query.<table>`), operators, `select`/`limit`/`offset`, cursor pagination, \`sql\`\`\`, performance/prepared statements, PG column types. ([10], [11], [12], [15], [14], [13], [5])
  * **PostgreSQL** — `gen_random_uuid()`(pgcrypto), `timestamptz`. ([4], [3], [2])
