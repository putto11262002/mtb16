# Task System Reference

> Single source of truth for generating, organizing, and completing tasks derived from docs/SPEC.yaml.
> 

**Version:** 1.1.1

**Scope:** Phases, filesystem, task schema, layers/tags, index file, mapping rules, generation algorithm, extension guidance (incl. new primitives like `AIClient`), validation, and examples.

---

## 1) Purpose & Relationship to the Spec

- **Input:** `docs/SPEC.yaml` (See Spec reference for structure/semantics.)
- **Output:** Self-contained YAML task files under `tasks/` plus a checklist index.
- **Goal:** Deterministic, minimal DAG of actionable tasks that respects **application ⇄ interface** boundaries and aligns with our tech stack.

---

## 2) Core Concepts

### 2.1 Phases (directory convention)

- All tasks live in `tasks/<NN>-<slug>/`
- `<NN>` orders phases (10, 20, 30, 35, 40, 50 …). Insert with `25-…`/`45-…` if needed.
- Tasks in the **same phase** may start in parallel; exact blocking is encoded with `needs`.
- Optional intra-phase filename prefix `<LL>-` (10,20,30) aids human ordering, e.g.:
    - `tasks/40-pages/10-page-news-list.yaml`

**Phase set (final):**

```jsx

10-content-model
20-actions
30-layouts
35-components
40-pages
50-metrics-testing

```

### 2.2 Task unit

- One file per task; the file **is** the contract (outcome + binary checks).
- Size target: **30–120 min**, ≤ 4 areas changed, one primary outcome. Split otherwise.

### 2.3 Dependencies (`needs`)

- Array of task IDs; may point to the **same** or **lower** phase only.
- No forward deps. Break cycles by splitting tasks.

### 2.4 Layers & Tags

- `layers: []` — allowed: `"application"`, `"interface"` (prefer single; multi-layer only for E2E/bridges).
- `tags: []` — canonical, multi-select labels describing touched components (e.g., `server-action`, `db-schema`, `page`).

---

## 3) Filesystem Layout

```jsx

tasks/
10-content-model/
20-actions/
30-layouts/
35-components/
40-pages/
50-metrics-testing/

```

- File path pattern: `tasks/<NN>-<slug>/<LL>-<id>.yaml`
- **ID rule:** YAML `id:` equals filename `<id>` (kebab), ignoring `<LL>-` and `.yaml`.

---

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
```

**Authoring guards**

- Keep `layers.length === 1` unless it’s truly E2E/bridge.
- Each checklist item must be verifiable from code/tests.
- Use specific `spec_refs` (e.g., `"spec:`[`]({{http://pages.news}})[pages.news](http://pages.news)[`]({{http://pages.news}})`_`[`]({{http://list.data}})[list.data](http://list.data)[`]({{http://list.data}})`.queries.q_recent"`).

### 4.1 Type-specific extensions (optional)

These refine the base schema for certain task types while keeping the core minimal.

- **Page tasks**
    - `components: []` — list of **custom component task IDs** used by the page (exclude primitives like button/link).
    - **Validation:** every `components[]` entry **must also** appear in `needs[]` as `component-<id>`.
- **Component tasks**
    - No extra fields required; use tags `["component","frontend"]` and document usage in outcome/checklist.

---

## 5) Layers

| Layer | Meaning | Notes |
| --- | --- | --- |
| application | Server-side surfaces & rules: models, server actions, auth, IO | Interface must only consume these |
| interface | Pages, layouts, components, routes, UI behavior, metrics wiring | Never hits DB/auth/storage directly |

### 5.1 Canonical Tags (extensible)

| Tag | Typical layer | Meaning (short) | db-schema | application | Database schema & relations |
| --- | --- | --- | --- | --- | --- |
| db-access | application | DB queries, inserts, updates, deletes | validation | application | Validation schemas (Zod) for I/O |
| migration | application | Explicit migration steps | server-action | application | Server action surface (Astro), business logic |
| auth | application | Access rules/ownership checks at the action boundary | storage | application | File adapters, uploads, validations |
| component | interface | Reusable UI building blocks | frontend | interface | UI composition, styling |
| page | interface | Page implementation | layout | interface | Layout with required `outlet` |
| route | interface | File-based routing & dynamic params (now per **page**) | testing | app/interface | Unit/integration/E2E |
| e2e | both | End-to-end flow across layers | metrics | interface | Event wiring + assertions |
| seo | interface | SEO title/meta derivation |  |  |  |

**Project-specific tags** (allowed): keep names simple (e.g., `ai-client`). See §9.2 for registering new primitives.

---

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
      - { id: "component-collection-list", done: false }
      - { id: "component-entity-header",   done: false }
      - { id: "component-media-card",      done: false }

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

## 7) Spec → Tasks Mapping Rules

### 7.1 Deterministic mapping (stack-aligned)

> Use this list to emit tasks from docs/SPEC.yaml. “Needs (derived)” are computed mechanically (see §8).
> 
- **`content_model.types[*]`** (entire model) → **`cm-schema`**
    - **Phase:** 10
    - **layers:** `["application"]`
    - **tags:** `["db-schema","migration"]`
    - **needs:** —
    - **Notes:** **single** task maps the spec content model to Drizzle schema + migrations.
- **Actions (per server function)** Sources: `pages.*.data.queries.*` (reads) **and** `pages.*.actions.*` (writes), plus any explicitly enumerated operations in the spec’s Actions grammar.

**Emit:** `action-<feature>-<fn>` — one task per function (e.g., `list`, `getBySlug`, `create`, `update`, `publish`, `delete`).

- **Phase:** 20
- **layers:** `["application"]`
- **tags:** Always include `["server-action","validation"]`; add `["db-access","auth","storage"]` as applicable.
- **needs:** `["cm-schema"]`
- **Grouping:** Same `feature` (namespace) across tasks via `feature: "<feature>"` and shared `spec_refs`.
- **Notes:** Align with action organization: `src/actions/<feature>/action.ts` exports a single namespace object `{ fn1, fn2, ... }`, aggregated in `src/actions/index.ts` as `export const server = { <feature> }`.
- **`layouts.<L>`** → **`layout-<L>`**
    - **Phase:** 30
    - **layers:** `["interface"]`
    - **tags:** `["layout","frontend"]`
    - **needs:** `["action-<feature>-<fn>", …]` used by layout queries or actions
    - **Notes:** Each layout **must** provide an `outlet`. Route-group guards live here (e.g., admin).
- **Components (shared UI extracted from blocks)** Sources: `pages.*.blocks` (frequency + shared data shapes).

**Emit:** `component-<id>` — one task per reusable component (e.g., `collection-list`, `entity-header`, `media-card`).

- **Phase:** 35
- **layers:** `["interface"]`
- **tags:** `["component","frontend"]`
- **needs:** `["action-<feature>-<fn>", …]` if a component consumes action data contracts
- **Notes:** Each component lives in its own task to enable parallel work and clear ownership.
- **`pages.<P>`** → **`page-<P>`**
    - **Phase:** 40
    - **layers:** `["interface"]`
    - **tags:** `["page","frontend","route"]` (+ `["seo"]` if page has SEO)
    - **components:** `["component-<id>", …]` list of **custom** components used by the page.
    - **needs:** All layouts in chain, **each** `component-<id>` declared in `components`, and relevant `action-<feature>-<fn>` tasks.
    - **Routing duties:** The **page** task ensures file-based route exists and matches `sitemap.path` (e.g., `/news/:slug` → `src/pages/news/[slug].astro`), attaches declared layouts, and types dynamic params.
- **`pages.<P>.metrics.*`** → **`metrics-<P>`**
    - **Phase:** 50
    - **layers:** `["interface"]` *(or `["application","interface"]` if truly end-to-end)*
    - **tags:** `["testing","metrics"]` (+ `["e2e"]` if cross-layer)
    - **needs:** `["page-<P>"]`
    - **Notes:** Use E2E only when validating the full UI↔server flow.
- **Feature-level flow in** `features[].success` **(optional)** → **`e2e-<feature>`**
    - **Phase:** 50
    - **layers:** `["application","interface"]`
    - **tags:** `["testing","e2e","metrics"]`
    - **needs:** participating `["action-*","page-*"]`
    - **Notes:** Only when the spec spells out a create→publish→render (or similar) flow.

**Removed mapping:** `sitemap.* → routes-all` (routing is verified within per-page tasks).

---

## 8) Generation Algorithm (deterministic)

**Goal:** deterministically emit tasks in **phases** (10→50). What to emit in each phase is defined only by the **Mapping Rules (§7.1)**.

### Inputs

- `docs/SPEC.yaml` (validated)
- Existing `tasks/` tree (optional)
- Existing `tasks/index.yaml` (optional; for preserving `done`)

### Outputs

- `tasks/<NN>-<slug>/<LL>-<id>.yaml` task files (see §4)
- Updated `tasks/index.yaml` (see §6)

### Pipeline (high level)

1. **Validate spec**
    - Enforce auth classes (`public|authenticated`), forbid `user|authUser` content types, allow only canonical placeholders.
2. **Build anchors**
    - Create a resolvable index of `spec:*` paths for features, content types, sitemap pages, pages (and subpaths), and layouts.
3. **Precompute namespaces & operations**
    - Infer `feature` namespaces (prefer `features[].id`, else derive from page id prefix).
    - Collect **operations** from `pages.*.data.queries.*` and `pages.*.actions.*` (reads + writes). De-duplicate per `<feature>, <fn>`.
4. **Phase passes (emit in order)**
    - **10:** Emit **one** `cm-schema`.
    - **20:** For each `<feature>, <fn>`, emit `action-<feature>-<fn>` with `needs: ["cm-schema"]`.
    - **30:** Emit `layout-<id>` per spec. Derive `needs` for any action calls within layout data/actions.
    - **35:** **For each recurring UI block/pattern, emit** `component-<id>`. Add `needs` for any action contracts it consumes.
    - **40:** Emit `page-<id>` per page. Set `needs` = layout chain + **each** `component-<id>` in `components` + all required `action-<feature>-<fn>`.
    - **50:** Emit `metrics-<page>` and optional `e2e-<feature>` tasks; set `needs` accordingly.
5. **Enforce phase constraints**
    - Every `needs` must reference tasks in the **same** or a **lower-numbered** phase. Insert a `35-…`/`45-…` tranche if needed. IDs remain stable.
6. **Intra-phase ordering**
    - Within each phase, **toposort by same-phase** `needs`.
    - Optionally assign local filename prefixes `<LL>` in steps of 10 (10,20,30…).
7. **Write files (idempotent)**
    - Field order: `id, title, layers, tags, feature, spec_refs, outcome, done_checklist, needs`.
    - Create phase directories as needed; skip writes when content is unchanged.
8. **Update** `tasks/index.yaml`
    - Maintain the **phases list**; preserve existing `done` by matching on `id`.
    - Add new tasks with `done: false`; remove entries for deleted files.
    - Sort phases by `<NN>`; inside a phase, sort by `<LL>` then `id`.
9. **Validate & report**
    - **DAG:** no cycles.
    - **No forward deps:** all `needs` point to same/lower phases.
    - **Index consistency:** every `{dir,id}` resolves to exactly one task file.
    - **Spec refs:** every `spec_refs[]` resolves in `docs/SPEC.yaml`.
    - **Boundary check:** interface never calls DB/auth/storage/AI directly—only via server actions.
    - **Routing check:** every [`]({{http://sitemap.page}})[sitemap.page](http://sitemap.page)[`]({{http://sitemap.page}})`_id` has a `page-*` task; each `page-*` checklist covers file route + layout chain.

---

## 9) Authoring & Maintenance

### 9.1 Common operations

- **Add a task:** create YAML in the lowest feasible phase where all `needs` live → add to `index.yaml` with `done:false`.
- **Complete a task:** satisfy `done_checklist` → set `done:true` in `index.yaml`.
- **Move a task:** `git mv` to a new phase dir → update its entry under that `dir` in `index.yaml`.
- **Insert a phase:** add `NN` like `35-…`; do **not** renumber existing folders.

---

## 10) Validation Rules (quick checklist)

- **No forward deps:** each `needs` must resolve to same/lower phase.
- **DAG:** no cycles across all tasks.
- **Index consistency:** every `{dir,id}` in `index.yaml` resolves to exactly one file.
- **Spec refs:** every `spec_refs[]` resolves to a current path in `docs/SPEC.yaml`.
- **Boundary rules:** interface never touches DB/auth/storage/AI directly; only through server actions.
- **Routing rules (page tasks):**
    - Route file exists at `src/pages/...` and matches `sitemap.path` (params → bracket notation).
    - Page renders under declared layout chain; content in final layout’s `outlet`.
    - Dynamic params are typed (Zod) and passed to actions.
- **Page ↔ component binding:** For **page** tasks, every item in `components[]` must have a matching `component-<id>` in `needs[]`, and the corresponding component task must exist.

---

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
title: ""
layers: ["application"]
tags: ["server-action","validation"]
spec_refs: ["spec:[pages.news.data](http://pages.news.data).queries.list"]
outcome: "Server action returns typed list data."
done_checklist:
  - "Zod schema validates inputs/outputs"
  - "Auth applied as per spec"
needs:
  - "cm-schema"
```

```yaml
id: "action-news-get-by-slug"
title: ""
layers: ["application"]
tags: ["server-action","validation"]
spec_refs: ["spec:[pages.news.data](http://pages.news.data).queries.getBySlug"]
outcome: "Server action returns typed detail."
done_checklist:
  - "Zod schema validates inputs/outputs"
  - "Auth applied as per spec"
needs:
  - "cm-schema"
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

**35 — component (shared)**

```yaml
id: "component-collection-list"
title: "Implement CollectionList component (server/client)"
layers: ["interface"]
tags: ["component","frontend"]
spec_refs:
  - "spec:pages"   # sourced from common block patterns
outcome: "CollectionList renders items with props aligned to action output."
done_checklist:
  - "Props typed; matches action output schema"
  - "Usage example documented"
needs:
  - "action-news-list"
```

**40 — page**

```yaml
id: "page-news-list"
title: "Build News List page (collection block)"
layers: ["interface"]
tags: ["page","frontend","route","seo"]
components:
  - "component-collection-list"
  - "component-entity-header"
spec_refs:
  - "spec:[pages.news](http://pages.news)"
outcome: "News List page renders under declared layouts, routes match sitemap, components wired."
done_checklist:
  - "Route file matches sitemap.path and renders under layout chain"
  - "Components render with typed props matching action outputs"
  - "SEO title/meta present if specified"
needs:
  - "layout-base"
  - "action-news-list"
  - "component-collection-list"
  - "component-entity-header"
```

**50 — metrics (UI)**

```yaml
id: "metrics-newslist"
title: "Wire & assert News List metrics"
layers: ["interface"]
tags: ["testing","metrics"]
spec_refs: ["spec:[pages.news](http://pages.news).metrics"]
outcome: "Events are wired and asserted."
done_checklist:
  - "Key events fired with required params"
  - "Assertions in place"
needs:
  - "page-news-list"
```

**50 — E2E flow (cross-layer, optional)**

```yaml
id: "e2e-news-publish-flow"
title: "E2E: publish news and render on list/detail"
layers: ["application","interface"]
tags: ["testing","e2e","metrics"]
spec_refs:
  - "spec:[features.news](http://features.news).success"
outcome: "Create→publish→render end-to-end flow validated."
done_checklist:
  - "Create action works"
  - "Publish updates visibility"
  - "List & detail render published item"
needs:
  - "action-news-create"
  - "action-news-update"
  - "page-news-list"
```

---

## 12) Versioning & Changelog

**1.1.1 (current)**

- Replaced single `components-common` with **per-component tasks** `component-<id>` (Phase 35).
- Added **page task extension** `components: []` and validation tying each to `needs`.
- Updated mapping rules, generation algorithm (Phase 35), `tasks/index.yaml` example, and examples.

**1.1.0**

- Collapsed per-type content model tasks into a single `cm-schema` (Phase 10).
- Removed `routes-all`; routing responsibilities moved into per-page tasks.
- Introduced `35-components` (now per-component tasks).
- Switched actions mapping to **one task per server function** (queries **and** mutations), grouped by feature.
