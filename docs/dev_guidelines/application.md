# Application Layer Guidelines (Astro Actions + Drizzle)

### 2) Scope, Responsibilities & Interaction Points

**Scope:** The Application layer: data access, domain logic, validation, auth/storage integrations, and the server-action surface consumed by the Interface layer.

**Out of scope:** UI concerns (React/Astro components), styling, client-side state.

**Responsibilities:** Turn validated inputs → thin DTO outputs within perf/security budgets; own DB schema contracts; enforce auth/ownership; expose capabilities via server actions.

**Interaction Points:**

* **Upstream (primitives):** DB (`db`, `schema`), auth (`auth`), storage (`FileStore`).
* **Downstream (interface):** Interface layer calls `server.<feature>.<action>()` only.
* **Boundaries:** Primitives → Application → Interface allowed; no reverse imports.

<pre>
<infra/primitives>  <-->  <application>  <-->  <interface>
^                     | exposes actions      |
|                    +------------------------+
|                          consumes primitives
</pre>

---

### 3) Working Files, Primitives & Dependency Map

#### Working Files (exact paths & roles)

* `src/actions/<feature>/action.ts` — feature action namespace export
* `src/actions/<feature>/schema.ts` — Zod I/O (use `astro:schema`) \[1]
* `src/actions/shared.ts` — `MutationResult`, `PaginatedQueryResult<T>`, `PaginationParams`
* `src/actions/index.ts` — aggregate: `export const server = { users, posts, … }`
* `src/db/index.ts` — exports `db` (configured with `{ schema }`)
* `src/db/schema.ts` — authoritative DB schema & relations \[5]
* `src/lib/auth/index.ts` — server-side auth
* `src/lib/storage/index.ts`, `src/lib/storage/types.ts` — `getFileStore()`, `FileStore`
* `src/middleware.ts` — injects `ctx.locals.user`

#### Primitives (import from where)

* `import { db } from '@/db'` → `src/db/index.ts`
* `import * as schema from '@/db/schema'` → `src/db/schema.ts`
* `import { auth } from '@/lib/auth'` → `src/lib/auth/index.ts`
* `import { getFileStore } from '@/lib/storage'` and `import type { FileStore } from '@/lib/storage/types'`
* `import { defineAction, ActionError } from 'astro:actions'` \[1]
* `import { z } from 'astro:schema'` (use this, not plain zod) \[1]

#### Import Rules

* Application may import primitives; never import Interface components.
* Interface calls Application only via actions; no direct DB/auth/storage usage.

#### Minimal tree

```txt
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

---

### 4) Core/Global Modules & Interactions

**Modules (overview):** Server Actions, Database Schema, Data Access (Drizzle/RQB), Storage, Performance/Reliability.

**Interaction Rules**

* Interface → Application via `server.<feature>.<action>()`; no imports of `actions/<feature>/internal`.
* Application uses `db`, `auth`, `FileStore`; cross-module errors use typed action errors.
* **High-level Workflow:** validate input (`astro:schema`) → authorize (`ctx.locals.user`) → query/mutate via Drizzle → map to thin DTO → return (no clients/streams). \[1,10,11]

---

### 5) Modules

#### 5.1 Module: Server Actions

##### 5.1.1 Rules

* Define actions with `defineAction({ input, handler, accept? })`. \[1]
* Group per feature: `export const <feature> = { ... }`; aggregate in `src/actions/index.ts` as `export const server = { ... }`.
* Validate with `z` from `astro:schema`; throw `ActionError` (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL`). \[1]

##### 5.1.2 Patterns & Recipes

* **Create action**

  * `schema.ts` with input/output Zod (from `astro:schema`). \[1]
  * `action.ts` with `defineAction`. \[1]
  * Namespace export → aggregate in `src/actions/index.ts`.
  * **Tests:** unit for pure logic; integration for DB.
* **Forms**

  * For HTML forms, set `accept: 'form'`; use `z.instanceof(File)` for file inputs. \[1]

##### 5.1.3 Examples (compact)

```ts
// src/actions/users/action.ts
import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
import { db } from '@/db'; import * as s from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { MutationResult } from '@/actions/shared'

export const create = defineAction({
  input: z.object({ email: z.string().email(), name: z.string().min(1).max(120) }),
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Login required.' })
    const exists = await db.select({ id: s.users.id }).from(s.users).where(eq(s.users.email, input.email))
    if (exists.length) throw new ActionError({ code: 'CONFLICT', message: 'Email already exists.' })
    const [row] = await db.insert(s.users).values({ email: input.email, name: input.name }).returning({ id: s.users.id })
    return { ok: true, id: row.id, message: 'User created' }
  },
})
export const users = { create }
```

##### 5.1.4 References

* Astro Actions overview, `defineAction`, forms (`accept: 'form'`), `ActionError`, validation with `astro:schema`. \[1]

##### 5.1.5 Common Workflows

* **Add a new feature (schema + actions + tests) — checklist:**

  * Define/extend `schema.ts` with Zod from `astro:schema`
  * Implement actions; group in `export const <feature>`
  * Aggregate in `src/actions/index.ts` (`server`)
  * Add tests (unit/integration)
  * Use `ActionError` codes; return thin DTOs only \[1]

##### 5.1.6 Checklist

* Inputs validated via `astro:schema`
* Namespaced + aggregated exports
* Errors are controlled (`ActionError`)

##### 5.1.7 Common Pitfalls

* Importing plain zod instead of `astro:schema` \[1]
* Scattered actions not aggregated into `server`

---

#### 5.2 Module: Database Schema (src/db/schema.ts)

##### 5.2.1 Rules

* **IDs:** `uuid` PRIMARY KEY `DEFAULT gen_random_uuid()` (pgcrypto). \[2,4,5]
* **Timestamps:** `timestamptz` for `created_at`/`updated_at`; `created_at DEFAULT now()`; prefer `$onUpdate(() => sql\`CURRENT\_TIMESTAMP\`)`for`updated\_at\`. \[3,5]
* **Typed JSON/JSONB:** Always type `json/jsonb` with `.$type<T>()`. Prefer `jsonb` in Postgres. Keep JSON payload DTOs small & versionable. \[5]
* No soft deletes; archive if needed.
* Table names: `snake_case` plural; `uniques` for natural keys; `indexes` for hot filters/joins.

##### 5.2.2 Patterns & Recipes

**Enums/Uniques/Indexes:** centralize in schema file.
**Relations:** use `relations(...)`; set `onDelete`/`onUpdate` explicitly. \[5]

**Self-referencing foreign keys (TypeScript-safe)**
Due to a TS limitation, self-reference must either (A) use an explicit return type for the `references` callback, **or** (B) declare a standalone `foreignKey(...)`. \[FK Doc]

**A) Explicit return type on `references` (compact)**

```ts
import { pgTable, uuid, text, timestamp, index, AnyPgColumn } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, { onDelete:'set null', onUpdate:'cascade' }),
  createdAt: timestamp('created_at',{ withTimezone:true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at',{ withTimezone:true }).defaultNow().notNull(),
}, t => ({ byParent: index('categories_parent_idx').on(t.parentId) }))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields:[categories.parentId], references:[categories.id] }),
  children: many(categories),
}))
```

**B) Standalone `foreignKey(...)`**

```ts
import { pgTable, uuid, text, timestamp, index, foreignKey } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at',{ withTimezone:true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at',{ withTimezone:true }).defaultNow().notNull(),
}, t => [
  index('categories_parent_idx').on(t.parentId),
  foreignKey({ columns:[t.parentId], foreignColumns:[t.id], name:'categories_parent_fk', onDelete:'set null', onUpdate:'cascade' }),
])

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields:[categories.parentId], references:[categories.id] }),
  children: many(categories),
}))
```

##### 5.2.3 Examples (compact)

**PK, Typed JSONB, Timestamps**

```ts
import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export type UserId = string & { __brand:'user_id' }
export type Profile = { bio: string; score: number }

export const users = pgTable('users', {
  id: uuid('id').$type<UserId>().primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull(),
  profile: jsonb('profile').$type<Profile>().notNull(),
  createdAt: timestamp('created_at',{ withTimezone:true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at',{ withTimezone:true }).default(sql`CURRENT_TIMESTAMP`).notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
})
```

##### 5.2.4 References

* Drizzle PG column types (`uuid`, timestamps, `defaultNow`, JSON/JSONB, identity): \[5], **Identity deep link:** [https://orm.drizzle.team/docs/column-types/pg#identity-columns](https://orm.drizzle.team/docs/column-types/pg#identity-columns)
* Foreign keys (incl. TS note & self-reference patterns): [https://orm.drizzle.team/docs/indexes-constraints#foreign-key](https://orm.drizzle.team/docs/indexes-constraints#foreign-key)

##### 5.2.5 Common Workflows

* `TIMESTAMPTZ` migrations: use explicit `USING` when altering timestamp types. \[3]

##### 5.2.6 Checklist

* PK `uuid` default via `gen_random_uuid()`
* `timestamptz` + defaults; `updated_at` auto via `$onUpdate`
* Deterministic order columns available for pagination
* JSON/JSONB columns are typed with `.$type<T>()`

##### 5.2.7 Common Pitfalls

* Casting timestamp types without `USING` clause during migration (include explicit SQL). \[3]
* **Self-reference without explicit typing:** Using `references(() => table.id)` on the same table **without** `(): AnyPgColumn` or **without** a standalone `foreignKey(...)` triggers TS errors—use one of the two patterns above.

---

#### 5.3 Module: Data Access with Drizzle (RQB-First)

##### 5.3.1 Rules

* Prefer RQB: `db.query.<table>.findMany({ with: {...} })` → one SQL, typed nested results. \[10]
* Use operators (`eq`, `and`, `ilike`, …) for safe filtering. \[12]
* Deterministic ordering for pagination; append a unique column. \[7]

##### 5.3.2 Patterns & Recipes

* Initialize `db` with `{ schema }` to enable cross-file typing. \[10]
* **Pagination**

  * Small/slow sets: `limit`/`offset`. \[11]
  * Large/fast sets: cursor-based (order by unique/sequential columns). \[14]

##### 5.3.3 Examples (compact)

```ts
// RQB with relation + stable ordering
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true, createdAt: true },
  with: { author: { columns: { id: true, email: true } } },
  orderBy: (t, { desc, asc }) => [desc(t.createdAt), asc(t.id)],
  limit: 20, offset: 0,
})
```

##### 5.3.4 References

* RQB (`db.query.<table>`), nested `with`. \[10]
* `select`/`limit`/`offset`, `orderBy`. \[11]
* Operators. \[12]
* Cursor-style pagination building blocks (`gt`/`lt` + stable order). \[14]
* SQL tag, placeholders (`sql.placeholder`). \[15]

##### 5.3.5 Common Workflows

* **List with filters & pagination**

  * Enforce `pageSize` cap; whitelist `orderBy`. \[11]
  * Count totals separately if needed.
* **Update rows with `updated_at`**

  * If the column uses `.$onUpdate(() => sql\`CURRENT\_TIMESTAMP\`)`, Drizzle sets it automatically on `db.update(...).set({...})\`.
  * If using raw SQL/bypassing the builder, **manually bump** `updated_at` (or add a DB trigger).
* **Hard delete**

  * Use `DELETE` with proper auth and cascading. \[10,11]

##### 5.3.6 Checklist

* Projection of only needed columns
* Operators used (no string SQL building)
* Deterministic order
* Prepared statements on hot paths (optional) \[13]

##### 5.3.7 Common Pitfalls

* Non-deterministic pagination ordering \[11]
* Skipping transactions for multi-step mutations \[16]

---

#### 5.4 Module: Storage Integration (FileStore)

##### 5.4.1 Rules

* Interact via `FileStore` only; never return raw buffers/streams from actions (return IDs/metadata).

##### 5.4.2 Patterns & Recipes (compact)

```ts
import { getFileStore } from '@/lib/storage'
import type { FileStore } from '@/lib/storage/types'
const files: FileStore = getFileStore()
const meta = await files.store(fileBuffer, { name: input.name, mimeType: input.mimeType })
const stream = await files.getStream(meta.id)
```

##### 5.4.3 References

* Forms + file inputs in Actions. \[1]

---

#### 5.5 Module: Performance & Reliability

##### 5.5.1 Rules

* Projection first; index hot filters/joins (§5.2). \[5]
* Prepared statements for hot paths; bound parameters. \[13,15]
* No implicit caching; add cache explicitly if needed. \[17]

##### 5.5.2 Examples (compact)

```ts
import { sql } from 'drizzle-orm'
const userById = db
  .select({ id: s.users.id, email: s.users.email })
  .from(s.users)
  .where(eq(s.users.id, sql.placeholder('id')))
  .prepare('user_by_id')
const row = await userById.execute({ id })
```

##### 5.5.3 Checklist

* Index coverage for hot queries
* Prepared on hot paths
* Read/write separation (if replicas introduced) \[18]

---

### 6) Global Workflow (end-to-end)

**Trigger:** Interface calls `server.<feature>.<action>()` → **Path:** validate (Zod via `astro:schema`) → authorize (`ctx.locals.user`) → execute Drizzle query/transaction → map to DTO (serializable) → return → telemetry (logs/traces). \[1,10,16]

---

### 7) Global Checklist (DoD)

* Rules respected (no boundary violations)
* Inputs validated with `astro:schema`; outputs are thin DTOs
* Aggregated actions in `server`
* RQB/pagination guidance followed; deterministic order
* Multi-step writes in transactions; `updated_at` bumped or `$onUpdate` configured
* Schema: `uuid` PK via `gen_random_uuid()`, `timestamptz` timestamps
* **JSON/JSONB columns typed with `.$type<T>()`**
* No soft deletes
* Tests green; docs updated

---

### 8) Important Notes

Keep **Rules** centralized; prefer **Recipes** to reduce variance; keep **Examples** runnable.
For \~20% edge cases, consult **References** in each module and document trade-offs in PRs.

---

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
createdAt: timestamp('created_at',{ withTimezone:true }).defaultNow().notNull(),
updatedAt: timestamp('updated_at',{ withTimezone:true }).defaultNow().notNull()
  .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
```

**// Typed JSONB**

```ts
type Payload = { foo: string; bar: number }
jsonb('payload').$type<Payload>().notNull()
```

**// Self-reference (pick one)**

```ts
parentId: uuid('parent_id').references((): AnyPgColumn => table.id, { onDelete:'set null' })
// or
foreignKey({ columns:[t.parentId], foreignColumns:[t.id], onDelete:'set null' })
```

**// RQB select with relations**

```ts
await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: { author: { columns: { id: true, email: true } } },
  orderBy: (t,{ desc,asc }) => [desc(t.createdAt), asc(t.id)],
  limit: 20, offset: 0,
})
```

**// Operators**

```ts
import { eq, and, ilike, desc, asc } from 'drizzle-orm'
```

---

## References Index (Deep Links)

**Astro**

1. Astro Actions — overview, `defineAction`, forms, errors, validation with `astro:schema`: [https://docs.astro.build/en/guides/actions/](https://docs.astro.build/en/guides/actions/)

**PostgreSQL**
2\) `pgcrypto` extension (includes `gen_random_uuid()`): [https://www.postgresql.org/docs/current/pgcrypto.html](https://www.postgresql.org/docs/current/pgcrypto.html)
3\) Date/Time types (`TIMESTAMP WITH TIME ZONE`), `now()` defaults:
• Types: [https://www.postgresql.org/docs/current/datatype-datetime.html](https://www.postgresql.org/docs/current/datatype-datetime.html)
• Current time functions: [https://www.postgresql.org/docs/current/functions-datetime.html](https://www.postgresql.org/docs/current/functions-datetime.html)
4\) UUID type: [https://www.postgresql.org/docs/current/datatype-uuid.html](https://www.postgresql.org/docs/current/datatype-uuid.html)

**Drizzle ORM (Postgres)**
5\) Column types for Postgres (`uuid`, `timestamp`, `defaultNow`, JSON/JSONB, identity): [https://orm.drizzle.team/docs/column-types/pg](https://orm.drizzle.team/docs/column-types/pg)
**Identity deep link:** [https://orm.drizzle.team/docs/column-types/pg#identity-columns](https://orm.drizzle.team/docs/column-types/pg#identity-columns)
**Foreign keys:** [https://orm.drizzle.team/docs/indexes-constraints#foreign-key](https://orm.drizzle.team/docs/indexes-constraints#foreign-key)
10\) Data querying (RQB: `db.query.<table>`, nested relations): [https://orm.drizzle.team/docs/data-querying](https://orm.drizzle.team/docs/data-querying)
11\) `select`, `where`, `orderBy`, `limit`/`offset`: [https://orm.drizzle.team/docs/select](https://orm.drizzle.team/docs/select)
12\) Operators (`eq`, `and`, `ilike`, …): [https://orm.drizzle.team/docs/operators](https://orm.drizzle.team/docs/operators)
13\) Performance & prepared queries: [https://orm.drizzle.team/docs/perf-queries](https://orm.drizzle.team/docs/perf-queries)
14\) Query utils helpful for cursor pagination (e.g., comparisons): [https://orm.drizzle.team/docs/query-utils](https://orm.drizzle.team/docs/query-utils)
15\) SQL tag, placeholders (`sql.placeholder`): [https://orm.drizzle.team/docs/sql](https://orm.drizzle.team/docs/sql)
16\) Transactions (multi-step writes): [https://orm.drizzle.team/docs/transactions](https://orm.drizzle.team/docs/transactions)
17\) Serverless perf & caching considerations: [https://orm.drizzle.team/docs/perf-serverless](https://orm.drizzle.team/docs/perf-serverless)
18\) Read replicas (read/write separation): [https://orm.drizzle.team/docs/read-replicas](https://orm.drizzle.team/docs/read-replicas)
