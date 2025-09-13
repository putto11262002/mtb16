# Task System Reference

> Single source of truth for generating, organizing, and completing tasks derived from `docs/SPEC.yaml`.

**Version:** 1.1.0  
**Scope:** Phases, filesystem, task schema, layers/tags, index file, mapping rules, generation algorithm, extension guidance (incl. new primitives like `AIClient`), validation, and examples.

---

<a id="purpose"></a>

## 1) Purpose & Relationship to the Spec

* **Input:** `docs/SPEC.yaml` (See Spec reference for structure/semantics.)
* **Output:** Self-contained YAML task files under `tasks/` plus a checklist index.
* **Goal:** Deterministic, minimal DAG of actionable tasks that respects **application ⇄ interface** boundaries and aligns with our tech stack.

---

<a id="concepts"></a>

## 2) Core Concepts

<a id="phases"></a>

### 2.1 Phases (directory convention)

* All tasks live in `tasks/<NN>-<slug>/`
* `<NN>` orders phases (10, 20, 30, 35, 40, 50 …). Insert with `25-…`/`45-…` if needed.
* Tasks in the **same phase** may start in parallel; exact blocking is encoded with `needs`.
* Optional intra-phase filename prefix `<LL>-` (10,20,30) aids human ordering, e.g.:
  * `tasks/40-pages/10-page-news-list.yaml`

**Phase set (final):**
```

10-content-model
20-actions
30-layouts
35-components
40-pages
50-metrics-testing

```

<a id="task-unit"></a>

### 2.2 Task unit

* One file per task; the file **is** the contract (outcome + binary checks).
* Size target: **30–120 min**, ≤ 4 areas changed, one primary outcome. Split otherwise.

<a id="needs"></a>

### 2.3 Dependencies (`needs`)

* Array of task IDs; may point to the **same** or **lower** phase only.
* No forward deps. Break cycles by splitting tasks.

<a id="layers-tags"></a>

### 2.4 Layers & Tags

* `layers: []` — allowed: `"application"`, `"interface"` (prefer single; multi-layer only for E2E/bridges).
* `tags: []` — canonical, multi-select labels describing touched components (e.g., `server-action`, `db-schema`, `page`).

---

<a id="fs-layout"></a>

## 3) Filesystem Layout

```

tasks/
10-content-model/
20-actions/
30-layouts/
35-components/
40-pages/
50-metrics-testing/

````

* File path pattern: `tasks/<NN>-<slug>/<LL>-<id>.yaml`
* **ID rule:** YAML `id:` equals filename `<id>` (kebab), ignoring `<LL>-` and `.yaml`.

---

<a id="task-schema"></a>

## 4) Task YAML Schema (minimal)

```yaml
id: ""                       # kebab-case, equals filename <id>
title: ""                    # imperative, outcome-focused
layers: []                   # ["application"] | ["interface"] | both (rare)
tags: []                     # canonical tags below; choose ≥1
feature: ""                  # optional: links to features[].id
spec_refs: []                # required if derived from SPEC.yaml (spec:<label>.<path>)
outcome: ""                  # concise, measurable result (1–3 lines)
done_checklist: []           # 2–8 binary checks
needs: []                    # ids in same or lower phase
````

**Authoring guards**

* Keep `layers.length === 1` unless it’s truly E2E/bridge.
* Each checklist item must be verifiable from code/tests.
* Use specific `spec_refs` (e.g., `"spec:pages.news_list.data.queries.q_recent"`).

---

<a id="layers"></a>

## 5) Layers

| Value       | Meaning                                                         | Notes                               |
| ----------- | --------------------------------------------------------------- | ----------------------------------- |
| application | Server-side surfaces & rules: models, server actions, auth, IO  | Interface must only consume these   |
| interface   | Pages, layouts, components, routes, UI behavior, metrics wiring | Never hits DB/auth/storage directly |

<a id="tags"></a>

### 5.1 Canonical Tags (extensible)

| Tag           | Typical layer | Meaning (short)                                        |
| ------------- | ------------- | ------------------------------------------------------ |
| db-schema     | application   | Database schema & relations                            |
| db-access     | application   | DB queries, inserts, updates, deletes                  |
| validation    | application   | Validation schemas (Zod) for I/O                       |
| migration     | application   | Explicit migration steps                               |
| server-action | application   | Server action surface (Astro), business logic          |
| auth          | application   | Access rules/ownership checks at the action boundary   |
| storage       | application   | File adapters, uploads, validations                    |
| component     | interface     | Reusable UI building blocks                            |
| frontend      | interface     | UI composition, styling                                |
| page          | interface     | Page implementation                                    |
| layout        | interface     | Layout with required `outlet`                          |
| route         | interface     | File-based routing & dynamic params (now per **page**) |
| testing       | app/interface | Unit/integration/E2E                                   |
| e2e           | both          | End-to-end flow across layers                          |
| metrics       | interface     | Event wiring + assertions                              |
| seo           | interface     | SEO title/meta derivation                              |

**Project-specific tags** (allowed): keep names simple (e.g., `ai-client`). See §9.2 for registering new primitives.

---

<a id="index-file"></a>

## 6) `tasks/index.yaml` (phase overview & checklist)

```yaml
version: 1
phases:
  - dir: "10-content-model"
    tasks:
      - { id: "cm-schema", done: false }

  - dir: "20-actions"
    tasks:
      - { id: "action-news-list", done: false }
      - { id: "action-news-get-by-slug", done: false }
      - { id: "action-news-create", done: false }
      - { id: "action-news-update", done: false }

  - dir: "30-layouts"
    tasks:
      - { id: "layout-base", done: false }

  - dir: "35-components"
    tasks:
      - { id: "components-common", done: false }

  - dir: "40-pages"
    tasks:
      - { id: "page-news-list", done: false }
      - { id: "page-news-detail", done: false }

  - dir: "50-metrics-testing"
    tasks:
      - { id: "metrics-newslist", done: false }
```

**Invariants:** Each `{dir,id}` must resolve to exactly one file `tasks/<dir>/*-<id>.yaml`. `done` is authoritative.

---

<a id="mapping"></a>

## 7) Spec → Tasks Mapping Rules

### 7.1 Deterministic mapping (stack-aligned)

> Use this list to **emit tasks** from `docs/SPEC.yaml`. “Needs (derived)” are computed mechanically (see §8).

* **`content_model.types[*]` (entire model) → `cm-schema`**

  * **Phase:** 10
  * **layers:** `["application"]`
  * **tags:** `["db-schema","migration"]`
  * **needs:** —
  * **Notes:** **single** task maps the spec content model to Drizzle schema + migrations.

* **Actions (per server function)**
  **Sources:** `pages.*.data.queries.*` (reads) **and** `pages.*.actions.*` (writes), plus any explicitly enumerated operations in the spec’s Actions grammar.
  **Emit:** `action-<feature>-<fn>` — one task per function (e.g., `list`, `getBySlug`, `create`, `update`, `publish`, `delete`).

  * **Phase:** 20
  * **layers:** `["application"]`
  * **tags:** Always include `["server-action","validation"]`; add `["db-access","auth","storage"]` as applicable.
  * **needs:** `["cm-schema"]`
  * **Grouping:** Same `feature` (namespace) across tasks via `feature: "<feature>"` and shared `spec_refs`.
  * **Notes:** Align with action organization: `src/actions/<feature>/action.ts` exports a single namespace object `{ fn1, fn2, ... }`, aggregated in `src/actions/index.ts` as `export const server = { <feature> }`.

* **`layouts.<L>` → `layout-<L>`**

  * **Phase:** 30
  * **layers:** `["interface"]`
  * **tags:** `["layout","frontend"]`
  * **needs:** `["action-<feature>-<fn>", …]` used by layout queries or actions
  * **Notes:** Each layout **must** provide an `outlet`. Route-group guards live here (e.g., admin).

* **Components (shared UI extracted from blocks)**
  **Sources:** `pages.*.blocks` (frequency + shared data shapes) → **components-common**

  * **Phase:** 35
  * **layers:** `["interface"]`
  * **tags:** `["component","frontend"]`
  * **needs:** `["action-<feature>-<fn>", …]` if a component consumes action data contracts
  * **Notes:** Single task to implement reusable server/client components used by multiple pages.

* **`pages.<P>` → `page-<P>`**

  * **Phase:** 40
  * **layers:** `["interface"]`
  * **tags:** `["page","frontend","route"]` (+ `["seo"]` if page has SEO)
  * **needs:** All layouts in chain, `components-common`, and relevant `action-<feature>-<fn>` tasks.
  * **Routing duties:** The **page** task ensures file-based route exists and matches `sitemap.path` (e.g., `/news/:slug` → `src/pages/news/[slug].astro`), attaches declared layouts, and types dynamic params.

* **`pages.<P>.metrics.*` → `metrics-<P>`**

  * **Phase:** 50
  * **layers:** `["interface"]` *(or `["application","interface"]` if truly end-to-end)*
  * **tags:** `["testing","metrics"]` (+ `["e2e"]` if cross-layer)
  * **needs:** `["page-<P>"]`
  * **Notes:** Use E2E only when validating the full UI↔server flow.

* **Feature-level flow in `features[].success` (optional) → `e2e-<feature>`**

  * **Phase:** 50
  * **layers:** `["application","interface"]`
  * **tags:** `["testing","e2e","metrics"]`
  * **needs:** participating `["action-*","page-*"]`
  * **Notes:** Only when the spec spells out a create→publish→render (or similar) flow.

**Removed mapping:** `sitemap.* → routes-all` (routing is verified within per-page tasks).

---

<a id="generator"></a>

## 8) Generation Algorithm (deterministic)

**Goal:** deterministically emit tasks in **phases** (10→50). What to emit in each phase is defined only by the **Mapping Rules (§7.1)**.

### Inputs

* `docs/SPEC.yaml` (validated)
* Existing `tasks/` tree (optional)
* Existing `tasks/index.yaml` (optional; for preserving `done`)

### Outputs

* `tasks/<NN>-<slug>/<LL>-<id>.yaml` task files (see §4)
* Updated `tasks/index.yaml` (see §6)

### Pipeline (high level)

0. **Validate spec**

   * Enforce auth classes (`public|authenticated`), forbid `user|authUser` content types, allow only canonical placeholders.

1. **Build anchors**

   * Create a resolvable index of `spec:*` paths for features, content types, sitemap pages, pages (and subpaths), and layouts.

2. **Precompute namespaces & operations**

   * Infer `feature` namespaces (prefer `features[].id`, else derive from page id prefix).
   * Collect **operations** from `pages.*.data.queries.*` and `pages.*.actions.*` (reads + writes). De-duplicate per `<feature>, <fn>`.

3. **Phase passes (emit in order)**

   * **10:** Emit **one** `cm-schema`.
   * **20:** For each `<feature>, <fn>`, emit `action-<feature>-<fn>` with `needs: ["cm-schema"]`.
   * **30:** Emit `layout-<id>` per spec. Derive `needs` for any action calls within layout data/actions.
   * **35:** Emit **one** `components-common` (shared blocks). Add `needs` for any action contracts it consumes.
   * **40:** Emit `page-<id>` per page. Set `needs` = layout chain + `components-common` + all required `action-<feature>-<fn>`.
   * **50:** Emit `metrics-<page>` and optional `e2e-<feature>` tasks; set `needs` accordingly.

4. **Enforce phase constraints**

   * Every `needs` must reference tasks in the **same** or a **lower-numbered** phase. Insert a `35-…`/`45-…` tranche if needed. IDs remain stable.

5. **Intra-phase ordering**

   * Within each phase, **toposort by same-phase `needs`**.
   * Optionally assign local filename prefixes `<LL>` in steps of 10 (10,20,30…).

6. **Write files (idempotent)**

   * Field order: `id, title, layers, tags, feature, spec_refs, outcome, done_checklist, needs`.
   * Create phase directories as needed; skip writes when content is unchanged.

7. **Update `tasks/index.yaml`**

   * Maintain the **phases list**; preserve existing `done` by matching on `id`.
   * Add new tasks with `done: false`; remove entries for deleted files.
   * Sort phases by `<NN>`; inside a phase, sort by `<LL>` then `id`.

8. **Validate & report**

   * **DAG:** no cycles.
   * **No forward deps:** all `needs` point to same/lower phases.
   * **Index consistency:** every `{dir,id}` resolves to exactly one task file.
   * **Spec refs:** every `spec_refs[]` resolves in `docs/SPEC.yaml`.
   * **Boundary check:** interface never calls DB/auth/storage/AI directly—only via server actions.
   * **Routing check:** every `sitemap.page_id` has a `page-*` task; each `page-*` checklist covers file route + layout chain.

---

<a id="authoring"></a>

## 9) Authoring & Maintenance

### 9.1 Common operations

* **Add a task:** create YAML in the lowest feasible phase where all `needs` live → add to `index.yaml` with `done:false`.
* **Complete a task:** satisfy `done_checklist` → set `done:true` in `index.yaml`.
* **Move a task:** `git mv` to a new phase dir → update its entry under that `dir` in `index.yaml`.
* **Insert a phase:** add `NN` like `35-…`; do **not** renumber existing folders.

### 9.2 Registering a new primitive (e.g., `AIClient`)

Use a small table entry and (optionally) a project-specific tag.

| Primitive      | Suggested tag | Default layer | Typical phase | Mapping triggers in SPEC       | Notes                                                              |
| -------------- | ------------- | ------------- | ------------: | ------------------------------ | ------------------------------------------------------------------ |
| DB Client      | `db`          | application   |            10 | `content_model.types.*`        | Covered by `cm-schema`                                             |
| Auth Client    | `auth`        | application   |            20 | reads/writes requiring auth    | Add `auth` to action tasks as needed                               |
| Storage Client | `storage`     | application   |            20 | file fields or uploads appear  | Add `storage` to action tasks as needed                            |
| **AIClient**   | `ai-client`   | application   |            20 | pages/actions that call AI ops | Add `ai-client` to action tasks; interface never calls AI directly |

---

<a id="validation"></a>

## 10) Validation Rules (quick checklist)

* **No forward deps:** each `needs` must resolve to same/lower phase.
* **DAG:** no cycles across all tasks.
* **Index consistency:** every `{dir,id}` in `index.yaml` resolves to exactly one file.
* **Spec refs:** every `spec_refs[]` resolves to a current path in `docs/SPEC.yaml`.
* **Boundary rules:** interface never touches DB/auth/storage/AI directly; only through server actions.
* **Routing rules (page tasks):**

  * Route file exists at `src/pages/...` and matches `sitemap.path` (params → bracket notation).
  * Page renders under declared layout chain; content in final layout’s `outlet`.
  * Dynamic params are typed (Zod) and passed to actions.

---

<a id="examples"></a>

## 11) Minimal Examples

**10 — content model (single)**

```yaml
id: "cm-schema"
title: "Map spec content model to Drizzle (schema + migrations)"
layers: ["application"]
tags: ["db-schema","migration"]
spec_refs:
  - "spec:content_model.types"
outcome: "Spec content model is represented in Drizzle with migrations applied."
done_checklist:
  - "All types from spec are mapped to Drizzle tables/relations"
  - "Migrations generated and applied"
  - "Unique indexes & defaults match spec"
```

**20 — actions (per function, grouped by feature)**

```yaml
id: "action-news-list"
title: "server.news.list: paginate & sort recent posts"
layers: ["application"]
tags: ["server-action","db-access","validation"]
feature: "news"
spec_refs:
  - "spec:content_model.types.newsArticle"
  - "spec:pages.news_list.data.queries.q_recent"
outcome: "Expose server.news.list(limit, offset, sort='-publishedAt') with Zod I/O and Drizzle-backed query."
done_checklist:
  - "src/actions/news/action.ts exports const news = { list, ... }"
  - "ListInputSchema/ListOutputSchema in src/actions/news/schema.ts; types via z.infer"
  - "src/actions/index.ts exports const server = { news }"
  - "Order by publishedAt desc; limit/offset respected"
  - "ActionError(400) invalid input; ActionError(500) unexpected failures logged"
needs: ["cm-schema"]
```

```yaml
id: "action-news-get-by-slug"
title: "server.news.getBySlug: resolve a post by slug"
layers: ["application"]
tags: ["server-action","db-access","validation"]
feature: "news"
spec_refs:
  - "spec:content_model.types.newsArticle"
  - "spec:pages.news_detail"
outcome: "Expose server.news.getBySlug(slug) with Zod I/O and 404 on missing item."
done_checklist:
  - "news.getBySlug present in src/actions/news/action.ts"
  - "GetBySlugInputSchema/GetBySlugOutputSchema exist"
  - "Returns 404 via ActionError when not found"
needs: ["cm-schema"]
```

```yaml
id: "action-news-create"
title: "server.news.create: create a post (auth required)"
layers: ["application"]
tags: ["server-action","db-access","validation","auth","storage"]
feature: "news"
spec_refs:
  - "spec:content_model.types.newsArticle"
outcome: "Expose server.news.create(payload) requiring authenticated user; payload validated; optional file validations."
done_checklist:
  - "news.create present in src/actions/news/action.ts"
  - "CreateInputSchema/CreateOutputSchema; auth enforced via ctx.locals.user"
  - "File handling with getFileStore(); mime/size per model"
  - "DB insert respects defaults (e.g., publishedAt)"
needs: ["cm-schema"]
```

```yaml
id: "action-news-update"
title: "server.news.update: edit a post with ownership/ACL"
layers: ["application"]
tags: ["server-action","db-access","validation","auth","storage"]
feature: "news"
spec_refs:
  - "spec:content_model.types.newsArticle"
outcome: "Expose server.news.update(id, patch) enforcing ownership/ACL (:user.id); partial payload with Zod."
done_checklist:
  - "news.update present in src/actions/news/action.ts"
  - "UpdateInputSchema/UpdateOutputSchema exist"
  - "Auth check on owner/roles; files replaced/cleaned safely"
needs: ["cm-schema"]
```

**30 — layout**

```yaml
id: "layout-base"
title: "Implement Base layout with outlet"
layers: ["interface"]
tags: ["layout","frontend"]
spec_refs: ["spec:layouts.base"]
outcome: "Header/footer/outlet; any layout data wired."
done_checklist:
  - "Base layout renders `outlet`"
  - "If layout queries/actions exist, calls go through server actions only"
```

**35 — components (shared)**

```yaml
id: "components-common"
title: "Implement shared UI components extracted from blocks"
layers: ["interface"]
tags: ["component","frontend"]
spec_refs:
  - "spec:pages"   # scanning blocks for common patterns
outcome: "Shared server/client components exist for the most common blocks & data shapes."
done_checklist:
  - "Common blocks identified and implemented (e.g., CollectionList, EntityHeader, MediaCard)"
  - "Props are typed and align with action output schemas"
  - "Demo usage docs / examples for pages"
```

**40 — page**

```yaml
id: "page-news-list"
title: "Build News List page (collection block)"
layers: ["interface"]
tags: ["page","frontend","route","seo"]
spec_refs:
  - "spec:pages.news_list"
  - "spec:sitemap.news_list"
outcome: "Paginated list (12/page) with empty state and SEO title; route & layouts wired."
done_checklist:
  - "Route file matches spec path: src/pages/news/index.astro"
  - "Renders under declared layout chain; content in final layout’s outlet"
  - "Calls server.news.list(limit=12, order desc publishedAt)"
  - "SEO title = 'News – %s'"
needs: ["layout-base","components-common","action-news-list"]
```

**50 — metrics (UI)**

```yaml
id: "metrics-newslist"
title: "Wire & assert News List metrics"
layers: ["interface"]
tags: ["testing","metrics"]
spec_refs: ["spec:pages.news_list.metrics"]
outcome: "Events emit and assertions pass for news list."
done_checklist:
  - "Emit 'click_news_teaser' on card click"
  - "E2E assertion passes"
needs: ["page-news-list"]
```

**50 — E2E flow (cross-layer, optional)**

```yaml
id: "e2e-news-publish-flow"
title: "E2E: publish news and render on list/detail"
layers: ["application","interface"]
tags: ["testing","e2e","metrics"]
spec_refs:
  - "spec:features.news"
  - "spec:pages.news_list"
  - "spec:pages.news_detail"
outcome: "Create→publish→render verified; click-through event emitted."
done_checklist:
  - "Create via server.news.create succeeds (auth required)"
  - "Item appears on '/news' ordered by publishedAt"
  - "Detail renders body/seo"
needs: ["action-news-create","action-news-list","page-news-list"]
```

---

<a id="versioning"></a>

## 12) Versioning & Changelog

**1.1.0 (current)**
**Breaking**

* Collapsed per-type content model tasks into a single `cm-schema` (Phase 10).
* Removed `routes-all`; routing responsibilities moved into per-page tasks.
* Introduced `35-components` with a single `components-common` task.
* Switched actions mapping to **one task per server function** (queries **and** mutations), grouped by feature.

**Migration tips**

* Move any `cm-*` tasks to `cm-schema` and merge their checklists.
* Delete `routes-all` and add route checks to each affected `page-*`.
* Add `35-components/components-common` and update `page-*` `needs` accordingly.
* Split prior `action-surface-<feature>` into `action-<feature>-<fn>` tasks; keep the namespace object export pattern.

---

### Maintenance tips

* Prefer **tables** (like §7.1 and §9.2) for rules that may grow (e.g., new primitives/tags).
* Keep canonical tags lean; add project-specific tags only when they alter routing or validation.
* If this doc exceeds \~1,200 lines, split into:

  * `docs/tasks/REFERENCE.md` (normative spec),
  * `docs/tasks/GENERATOR.md` (implementation details),
  * `docs/tasks/AUTHORING.md` (human guidelines),
    …while preserving section anchors.


---

## CATALOG

- **docs/tasks/REFERENCE.md** → **v1.1.0**
  - **Changed:** Mapping rules and phases.
    - Collapsed content-model tasks into single `cm-schema` (Phase 10).
    - Actions now emit **per-function** tasks (queries + mutations) grouped by feature (Phase 20).
    - Added `35-components` with `components-common` task; pages depend on it.
    - Removed `routes-all`; routing checks moved into `page-*` tasks.
  - **Breaking:** Update existing tasks/index to new IDs/dirs; see migration tips in §12.
  - **Why:** Better alignment with project tech stack and real workflow.

