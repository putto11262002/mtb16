---
title: Contentful Website Spec Reference
description: A single-file, YAML "source of truth" for a Contentful-backed website with an admin panel.
version: 4.1.0
---

## Introduction

> **Purpose:** A single-file, YAML “source of truth” for a Contentful-backed website with an admin panel.  
> **Order of truth:** 1) `features` (upstream, outcome-based) → 2) define `content_model` → 3) map routes in `sitemap` → 4) define `pages` (blocks, data, ACL, metrics) → 5) compose `layouts`.

This document is organized into the following sections:

0. **Conventions** — global rules for IDs, enums, dates, placeholders, layouts, and auth modeling.  
1. **Top-Level Structure** — overview of the YAML root keys (in canonical order).  
2. **Sections** — required fields, grammar, and examples for each top-level key (in canonical order):  
   - `meta`  
   - `context`  
   - `features`  
   - `content_model`  
   - `sitemap`  
   - `pages`  
   - `layouts`  
3. **Data Query Grammar** — formal query syntax and placeholders.  
4. **Actions/Mutations Grammar** — first-class mutations and form binding.  
5. **ACL Model (Auth Classes)** — `public` vs `authenticated`, inheritance, and grammar.  
6. **Content Model (Field Types & Options)** — schema field taxonomy, validations, and options.  
7. **Metrics** — per-page analytics goals and targets.  
8. **Validation Checklist** — linting and consistency rules.  
9. **Minimal Working Example** — trimmed YAML showing a complete spec.  
10. **Quick How-To** — step-by-step checklist to author a spec.

---

## 0) Conventions

* **IDs:** `kebab-case`, unique within their scope.
* **Enums:** use lowercase literals listed below.
* **Dates/Windows:** ISO-8601 dates; reporting windows like `"30d"`.
* **Placeholders in values:** only the canonical set in §3.2.
* **Layouts:** `layouts[].id` uses `kebab-case`. Every layout MUST declare an `outlet` slot. Layouts share the same schema as pages for `params`, `data`, `blocks`, `acl`, and `metrics`, but are **not routes**.
* **Auth & User Modeling (strict):**
  - The authentication **user** entity is **external & pre-seeded** by the platform (not modeled in `content_model`).
  - **Do NOT** define `content_model.types` with ids `user` or `authUser` (validator error).
  - When the app needs per-user fields, define a separate **profile** type with a **1:1 link** to the external auth user (see §2.4 “Auth-Linked Profile Pattern”).
  - Use `:user.id` (see §3.2) to reference the current authenticated user.

---

## 1) Top-Level Structure

> **Canonical key order in the spec file:**

```yaml
meta: {}           # object
context: {}        # object
features: []       # array of outcome-based feature objects
content_model:     # object
  types: []        # array of content types
sitemap: []        # array of route nodes
pages: []          # array of pages (outcomes, data, blocks, actions, ACL, metrics)
layouts: []        # array of shared, nestable wrappers with slots
# acceptance: []   # optional: brief, binary top-level checks
````

---

## 2) Sections (Required Fields, Grammar, Examples)

### 2.1 `meta`

**Purpose:** Doc identity + optional global KPIs.

```yaml
meta:
  spec_id: web-001
  name: "Unit Website"
  version: 0.1.0
  source_brief:
    path: docs/PRODUCT_BRIEF.md
    version: 0.1.0
  metrics:
    - id: kpi-post-cadence
      desc: "≥ 4 posts/month"
      target: ">=4/mo"
      source: "manual|GA4"
      window: "30d"
```

---

### 2.2 `context`

**Purpose:** Scope + audiences.

```yaml
context:
  goals: ["Inform public", "Editors publish without dev help"]
  non_goals: ["No e-commerce v1"]
  audiences: ["public", "authenticated"]
  locales: ["th-TH","en-US"]
```

---

### 2.3 `features` (Upstream, Outcome-Based)

**Purpose:** Define capabilities independent of UI/schema.

```yaml
features:
  - id: news
    label: "News & Announcements"
    intent: "Publish localized posts with hero image"
    priority: must   # enum: [must, should, could]
    constraints: ["SEO required", "Two locales"]
    success:
      - "Editors create, localize, publish a post"
      - "Slug uniqueness enforced"
      - "List paginates 12 per page"
```

**Notes:** No back-references to pages or types here.

---

### 2.4 `content_model`

**Purpose:** Define content types and ACL at the schema level. Full field taxonomy in §6.

```yaml
content_model:
  types:
    - id: newsArticle
      name: "News Article"
      localized: true
      fields:
        - { id: title,       type: varchar, required: true, localized: true, max_length: 255 }
        - { id: slug,        type: varchar, unique: true, max_length: 255 }
        - { id: excerpt,     type: text, localized: true }
        - { id: body,        type: text, localized: true, format: "markdown" }
        - { id: heroImage,   type: file, validations: { mime_types: ["image/*"], max_size: 5242880 } }
        - { id: publishedAt, type: datetime, required: true, default: ":now" }
        - { id: seo,         type: json, shape: { title: "varchar", ogImage: "file" } }
      acl:
        read: ["public"]
        create: ["authenticated"]
        update: ["authenticated"]
        publish: ["authenticated"]
        rule:
          read: 'content.published == true || :now >= content.embargoAt'
          update: 'content.owner == :user.id'
```

**Auth-Linked Profile Pattern (MUST)**
When you need per-user fields, define a **profile** type that maps **1:1** to the external auth user:

```yaml
content_model:
  types:
    - id: userProfile
      name: "User Profile"
      fields:
        - { id: authUserId, type: varchar, required: true, unique: true, max_length: 255 } # FK to auth user
        - { id: displayName, type: varchar, max_length: 255 }
        - { id: photo,       type: file, validations: { mime_types: ["image/*"] } }
        - { id: preferences, type: json }
      acl:
        read: ["authenticated"]
        create: ["authenticated"]
        update: ["authenticated"]
        rule:
          update: 'content.authUserId == :user.id'
```

**Query example (page or layout):**

```yaml
data:
  queries:
    q_me:
      mode: one
      type: userProfile
      where:
        - { field: "authUserId", op: eq, value: ":user.id" }
```

> **Do NOT** define types named `user` or `authUser` (validator error). See §6 for field types/options.

---

### 2.5 `sitemap`

**Purpose:** Route tree and stable `page_id`s.

```yaml
sitemap:
  - page_id: home
    path: "/"
    layout: ["base"]
    children:
      - page_id: news_list
        path: "/news"          # inherits ["base"]
      - page_id: staff_list
        path: "/staff"         # inherits ["base"]
  - page_id: news_detail
    path: "/news/:slug"        # inherits nearest ancestor layouts
  - page_id: admin
    path: "/admin"
    layout: ["base","admin"]
```

**Rules**

* Every `page_id` must exist in `pages[].id`.
* `path` supports params `:slug`, etc.
* `children` defines nav hierarchy (optional).
* `layout` is optional `string | string[]` of `layouts[].id`.
  Children inherit the parent’s `layout` chain unless they set `layout` (which **replaces** the inherited chain).
  All `layout` ids must exist; layout chains must be acyclic.

---

### 2.6 `pages` (Outcome → Blocks → Data → Actions → ACL → Metrics)

**Purpose:** Page-level outcomes, semantic blocks, data needs, actions (mutations), ACL, and analytics metrics.

*A page renders inside the route’s attached layouts (`sitemap.layout`, outer→inner) at the final layout’s `outlet`.*

#### 2.6.1 Page Object

```yaml
pages:
  - id: news_list
    purpose: "Users discover recent updates easily"
    outcomes:
      - "Users find a relevant post within 2 clicks"
    params: []
    data:
      queries:
        q_recent:
          mode: many
          type: "newsArticle"
          by: slug
          where:
            - { field: "publishedAt", op: lt, value: ":now" }
          sort: "-publishedAt"
          limit: 12
          offset: 0
          select: ["title","slug","seo"]
          include: ["author","unit"]
          includeDepth: 1
          locale: "th-TH"
    blocks:                                   # semantic, not visual (see §2.6.2)
      - type: collection                      # collection|entity|content|media|action-point|nav
        uses: { query: q_recent }
        empty_state: "No content yet"
    actions:                                   # see §4
      - id: submit_contact
        intent: "Store inquiry and notify staff"
        operation: create
        on: "supportRequest"
        input: { schema_ref: content_model.types.supportRequest }
        acl: { allowed_roles: ["public","authenticated"] }
        effects:
          writes: ["supportRequest"]
          revalidate: ["/support/:id"]
          webhooks: ["notifyOps"]
        success: ["Entry created", "Notification sent"]
        failure: ["Validation error surfaced"]
        rate_limit: { window: "1m", max: 5 }
    seo:
      index: true
      title_tmpl: "News – %s"
      derive_from: "q_post.seo"
    acl: { visibility: ["public"] }           # or ["authenticated"]
    metrics:
      - { id: m-newslist-bounce, event: "bounce_rate", target: "<=40%", source: "GA4|custom", segment: "all", window: "30d" }
```

**SEO `derive_from` note:** may reference `queryId.fieldPath` (e.g., `q_post.seo`) or a content field path literal `type.field`.

#### 2.6.2 Block Semantics (Contracts & When to Use)

> Blocks are **semantic outputs**—they describe *what the page should deliver*, not specific UI widgets.

* **`collection`** — render a set of items. Contract: `uses: { query: <query_id> }`; `mode ∈ [many,count,aggregate]`.
* **`entity`** — render a single item. Contract: `mode=one`.
* **`content`** — static copy or settings content. Contract: `uses: { source: "settings.<path>" | text: "<inline>" }`.
* **`media`** — file output. Contract: `uses: { query, field }` or `uses: { from: "<query.field>" }`.
* **`action-point`** — form/interaction; Contract: `action_id: <id>`.
* **`nav`** — route/action trigger; Contract: `uses: { route | action_id }`.

**Deprecated names removed in v3.0.0:** `list`, `detail`, `form`, `cta`.

---

### 2.7 `layouts` (Shared chrome & nesting)

**Purpose:** Reusable, nestable wrappers around pages (header/nav/footer/etc.). Layouts follow the same `data` and `blocks` grammar as pages but are **not routes**.

```yaml
layouts:
  - id: base
    purpose: "Global chrome: header, nav, footer"
    params: []
    data:
      queries:
        q_recent_news: { mode: many, type: newsArticle, sort: "-publishedAt", limit: 5 }
    slots:
      header:
        blocks:
          - { type: content, uses: { text: "Unit Website" } }
      sidebar:
        blocks:
          - { type: collection, uses: { query: q_recent_news } }
      outlet: {}                         # REQUIRED
      footer:
        blocks:
          - { type: content, uses: { text: "© Unit" } }
    acl: { visibility: ["public"] }      # or ["authenticated"]
    metrics:
      - { id: m-layout-nav-CTR, event: "nav_click", target: ">=3%", source: "GA4", window: "30d" }
```

**Rules**

* Every layout MUST declare an `outlet` slot.
* `data.queries` & `blocks` follow §3 and §2.6.2; query ids are **scoped to the layout** (pages can’t reference layout queries).
* **Attach via `sitemap.layout`**; order = outer→inner. The page renders inside the last layout’s `outlet`.
* **Inheritance:** Children inherit parent layouts unless they provide their own `layout` (which replaces the chain).
* **ACL:** Layout `acl` constrains all nested pages (see §5).

---

## 3) Data Query Grammar (Formal)

```yaml
data:
  queries:
    q_example:
      mode: many
      type: "content_type_id"
      by: slug
      where:
        - { field: "slug", op: eq, value: ":param.slug" }
      sort: "-publishedAt"
      limit: 10
      offset: 0
      select: ["title","slug"]
      include: ["author"]
      includeDepth: 1
      locale: "th-TH"
```

### 3.1 Formal Mini-Grammar (concise)

*(unchanged; omitted here for brevity)*

### 3.2 Placeholder Variables (canonical)

Allowed: `:now`, `:locale`, `:user.id`, `:param.<name>`, `:query.<id>.<fieldPath>`
**Removed in v4.0.0:** `:role`, `:user.roles[]`.

---

## 4) Actions/Mutations Grammar (Detailed)

*(unchanged aside from public/authenticated examples; see §2.6.1 and prior version for full block.)*

---

## 5) ACL Model (Auth Classes)

*(unchanged; only `public`/`authenticated` are valid.)*

---

## 6) Content Model (Field Types & Options)

> This section defines the **field taxonomy and options**. For the **profile pattern**, see §2.4.

*(Field type enums, global options, type-specific options, and examples remain as in 4.0.0.)*

---

## 7) Metrics (Per-Page Analytics Goals)

*(unchanged)*

---

## 8) Validation Checklist

*(updated to account for the canonical key order and cross-refs)*

* **Top-level key order:** `meta` → `context` → `features` → `content_model` → `sitemap` → `pages` → `layouts`.
  (Order is normative for readability; validators MAY warn if out of order.)
* All prior validation items from v4.0.0 remain in effect (auth classes only, no `user`/`authUser` types, etc.).

---

## 9) Minimal Working Example (Trimmed)

```yaml
meta: { spec_id: "web-001", name: "Unit Website", version: "0.1.0", source_brief: "docs/product-brief.md" }

context:
  goals: ["Inform public", "Editors publish without dev help"]
  audiences: ["public","authenticated"]
  locales: ["th-TH","en-US"]

features:
  - id: news
    label: "News"
    intent: "Publish localized posts"
    priority: must
    success: ["Editors publish a post", "Slug is unique", "List paginates 12"]

content_model:
  types:
    - id: newsArticle
      name: "News Article"
      localized: true
      fields:
        - { id: title,       type: varchar, required: true, localized: true, max_length: 255 }
        - { id: slug,        type: varchar, unique: true, max_length: 255 }
        - { id: body,        type: text, localized: true, format: "markdown" }
        - { id: heroImage,   type: file, validations: { mime_types: ["image/*"] } }
        - { id: publishedAt, type: datetime, required: true, default: ":now" }
        - { id: seo,         type: json, shape: { title: "varchar", ogImage: "file" } }
      acl:
        read: ["public"]
        create: ["authenticated"]
        update: ["authenticated"]
        publish: ["authenticated"]
        rule:
          read: 'content.published == true || :now >= content.embargoAt'
          update: 'content.owner == :user.id'

sitemap:
  - { page_id: home, path: "/", layout: ["base"] }
  - { page_id: news_list, path: "/news" }
  - { page_id: news_detail, path: "/news/:slug" }

pages:
  - id: home
    purpose: "Show latest news"
    data:
      queries:
        q_recent: { mode: many, type: newsArticle, sort: "-publishedAt", limit: 3 }
    blocks:
      - { type: collection, uses: { query: q_recent } }
    seo: { index: true, title_tmpl: "%s – Unit" }
    metrics:
      - { id: m-home-news-CTR, event: "click_news_teaser", target: ">=3.5%", source: "GA4", window: "28d" }

layouts:
  - id: base
    slots:
      header: { blocks: [ { type: content, uses: { text: "Unit" } } ] }
      outlet: {}
      footer: { blocks: [ { type: content, uses: { text: "© Unit" } } ] }
    acl: { visibility: ["public"] }
```

---

## 10) Quick How-To

* **Add features first:** define outcomes in `features[]`.
* **Model data second:** create `content_model.types[]` (use the **profile** pattern if you need per-user fields; never define `user`).
* **Map routes:** build `sitemap[]` using stable `page_id`s and layout chains.
* **Define pages:** write outcomes → declare `data.queries` → add **semantic** `blocks` → wire `actions` → (optional) page `acl` (public/authenticated) → add `metrics`.
* **Compose layouts:** define `layouts[]` with an `outlet`; reference via `sitemap.layout` (outer→inner).
* **Lint:** run checks per §8; ensure references resolve.

---

# Changelog

- **v1.0.0 — Initial publication**
  - Imported the initial draft of the Contentful Website Spec Reference.

- **v1.0.1 — YAML normalization (non-breaking)**
  - Converted all YAML examples to syntactically valid YAML.
  - Replaced pseudo-syntax (`;`, choice bars like `a | b | c`, and `[ ... ]`) with concrete values plus inline `# enum: [...]` comments.
  - Quoted dotted paths and placeholders where necessary.
  - No schema/semantic changes to the reference itself; examples only.

## v2.0.0 - Content model definition refinement

### Changed
- Replaced field type system with: text, varchar, int, float, boolean, datetime, enum, file, relation, array, json.
- Added global Field Options (required, unique, default, nullable, index) and type-specific options.
- Defined `file` object shape (id, filename, url, size, mimeType, createdAt: datetime).
- Introduced `relation` with explicit cardinality and optional on_delete/inverse.
- Clarified query language: `include` now expands relations.
- Updated examples and block/docs text from Asset/Reference/Object/DateTime to File/Relation/JSON/Datetime equivalents.

### Breaking Changes
- `Asset` → `file`; `Reference` → `relation`; `Object` → `json`; `DateTime` → `datetime`.
- Removed legacy types (`Slug`, `ShortText`, `LongText`, `RichText`, `Integer`, `Float`, `Boolean`) in favor of new set.
- Media block wording now references files instead of assets.

### Migration Notes
- Replace `Slug` with `varchar` + `unique: true` (+ optional `pattern` validation).
- Map `RichText` to `text` (e.g., `format: "markdown"`) unless a structured editor is required (use `json`).
- Convert `DateTime` fields to `datetime` (ISO-8601 timestamp); keep `default: ":now"` where applicable.
- Replace `Asset` fields with `file` using the documented file object shape and validations.
- Replace `Reference { to: [...] }` with `relation { to: <typeId>, cardinality: ..., on_delete: ... }`.
- Ensure `array.items.type` is a primitive (`text|varchar|int|float|boolean|datetime|enum`).


## 3.0.0 — 2025-09-10

### Summary
Major spec refresh emphasizing semantic blocks, formalized queries, and a minimal but expressive ACL model.

### Changes
- **Blocks:** Introduced canonical semantic block types: `collection`, `entity`, `content`, `media`, `action-point`, `nav`.
- **Queries (§3):** Added a concise formal grammar with boolean logic (`and/or/not`), extended operators (`eq, ne, gt, gte, lt, lte, in, nin, contains, starts_with, ends_with, matches, exists, between`), and optional `quantifier: any|all` for arrays/relations. Kept `limit`/`offset` pagination only.
- **Placeholders (§3.2):** Canonicalized allowed placeholders (`:now`, `:locale`, `:role`, `:user.id`, `:user.roles[]`, `:param.<name>`, `:query.<id>.<fieldPath>`). **Removed `:env.*`.**
- **Layouts (§2.7):** Clarified schema parity with pages and scoping of layout queries.
- **ACL (§5):** Added optional expression rules for pages/layouts (visibility rules, no `content.*`) and for content types (rules may reference `content.*`). Added action rules with `input.*`. Roles and rules compose with logical AND.

### Breaking Changes
- Removed deprecated block names: **`list`, `detail`, `form`, `cta`**. Use `collection`, `entity`, `action-point`, `nav`.
- Page/layout ACL expressions **cannot** reference `content.*`.

### Not Added
- No cursor paging; only `limit`/`offset`.
- No computed `select` expressions.

### Migration Notes
- Replace old block names with canonical ones.
- Remove any use of `:env.*` placeholders.
- If relying on complex page-level content logic, move it into content-type ACL `rule` expressions where `content.*` is available, or into queries and page data.


## [4.0.0] - 2025-09-12

### Changed
- **SPEC_REF.md**: Adopted **auth classes** model (no custom roles). All ACLs now accept only `["public"]` or `["authenticated"]`.
- Added **Auth & User Modeling (strict)** in Conventions: the auth user entity is external/pre-seeded; **do not** model `user`/`authUser`.
- §6: Introduced **Auth-Linked Profile Pattern** (`userProfile` 1:1 with `authUserId`) + query example.
- §4: Added canonical `update_profile` action example.
- §3.2: **Removed placeholders** `:role` and `:user.roles[]`; clarified `:user.id`.
- §5: Renamed to **ACL Model (Auth Classes)** and updated grammar/examples.
- §8: Added validation rules enforcing the above.

### Removed
- `roles` top-level section and any references to custom roles (editor/admin/etc.).
- Any examples using role-based checks; replaced with `public`/`authenticated` or `:user.id` logic.

### Breaking Changes
- Defining `content_model.types` with ids `user` or `authUser` is now a **validator error**.
- Any ACL lists must be a subset of `{ "public", "authenticated" }`; other role ids are invalid.
- Placeholders `:role` and `:user.roles[]` are **invalid**.
- The `roles:` top-level key is no longer recognized by the spec.

### Migration Notes
- Replace legacy `roles:` definitions and role references with `public`/`authenticated`.
- For per-user fields, create `userProfile` with unique `authUserId` and rewrite rules to use `:user.id`.
- Update action/page/layout ACLs to the new auth classes lists; remove role-based expressions.


## [4.1.0] - 2025-09-12

### Changed
- Re-ordered canonical section flow and updated overview:
  - `meta` → `context` → `features` → `content_model` → `sitemap` → `pages` → `layouts`.
- Updated **Top-Level Structure** to match canonical key order.
- Added §2.4 `content_model` (with the **Auth-Linked Profile Pattern**) and moved cross-references accordingly.
- Renamed §6 heading to **Content Model (Field Types & Options)** for clarity.
- Updated the **Minimal Working Example** to reflect the new order.
- Adjusted cross-references in Conventions, Pages, Layouts, and Validation Checklist.

### Notes
- No grammar/behavioral breaking changes; this is a structural/organizational refinement on top of v4.0.0.
- All **auth-class** constraints from v4.0.0 remain (only `public` and `authenticated`; no custom roles; no `user`/`authUser` types).
