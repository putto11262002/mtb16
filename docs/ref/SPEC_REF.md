---
title: Contentful Website Spec Reference
description: A single-file, YAML "source of truth" for a Contentful-backed website with an admin panel.
version: 4.0.0
---

## Introduction

> **Purpose:** A single-file, YAML “source of truth” for a Contentful-backed website with an admin panel.  
> **Order of truth:** 1) `features` (upstream, outcome-based) → 2) infer `content_model`, `sitemap`, and `layouts` → 3) define `pages` (blocks, data, ACL, metrics).

This document is organized into the following sections:

0. **Conventions** — global rules for IDs, enums, dates, placeholders, layouts, and auth modeling.  
1. **Top-Level Structure** — overview of the YAML file and its root keys.  
2. **Sections** — detailed grammar and examples for each top-level key:  
   - `meta`  
   - `context`  
   - ~~`roles`~~ (removed in v4.0.0)  
   - `features`  
   - `sitemap`  
   - `pages`  
   - `layouts`  
   - `content_model`  
3. **Data Query Grammar** — formal specification of query syntax and placeholders.  
4. **Actions/Mutations Grammar** — definitions for first-class mutations.  
5. **ACL Model (Auth Classes)** — `public` vs `authenticated`, inheritance, and grammar.  
6. **Content Model** — schema definition for Contentful types and fields.  
7. **Metrics** — per-page analytics goals and targets.  
8. **Validation Checklist** — rules for linting and consistency checks.  
9. **Minimal Working Example** — trimmed YAML showing a complete spec.  
10. **Quick How-To** — step-by-step guide for defining features, pages, layouts, and validations.  

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
  - When the app needs per-user fields, define a separate **profile** type with a **1:1 link** to the external auth user (see §6 “Auth-Linked Profile Pattern”).
  - Use `:user.id` (see §3.2) to reference the current authenticated user.

---

## 1) Top-Level Structure

```yaml
meta: {}           # object
context: {}        # object
features: []       # array of feature objects; upstream, outcome-based; no refs to pages/types
sitemap: []        # array of route nodes
layouts: []        # array of layouts; shared, nestable wrappers with slots
pages: []          # array of pages; outcomes, blocks, data, actions, ACL, metrics
content_model:
  types: []        # array of content types
# acceptance: []   # optional: brief, binary top-level checks
````

---

## 2) Sections (Required Fields, Grammar, Examples)

### 2.1 `meta`

**Purpose:** Doc identity + optional global KPIs.

```yaml
meta:
  spec_id: web-001              # string
  name: "Unit Website"          # string
  version: 0.1.0                # string (semver suggested)
  source_brief: 
     path: docs/PRODUCT_BRIEF.md  # optional string
     version: 0.1.0               # optional string
  metrics:                      # optional global KPIs (few, high-level)
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

### ~~2.3 `roles`~~ (removed in v4.0.0)

**Rationale:** The spec operates without custom roles. Only **auth classes** are supported: `public` (anonymous) and `authenticated` (signed-in). See §5.

---

### 2.4 `features` (Upstream, Outcome-Based)

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
    purpose: "Users discover recent updates easily"        # outcome statement
    outcomes:                                              # optional, specific outcomes
      - "Users find a relevant post within 2 clicks"
    params: []                                             # route params if any
    data:                                                  # declarative queries (see §3)
      queries:
        q_recent:
          mode: many                 # enum: [one, many, count, aggregate]
          type: "newsArticle"
          by: slug                   # enum: [id, slug]
          where:                     # AND of predicates by default; see boolean logic in §3.1
            - field: "publishedAt"
              op: lt
              value: ":now"
          sort: "-publishedAt"
          limit: 12
          offset: 0
          select: ["title","slug","seo"]
          include: ["author","unit"]
          includeDepth: 1
          locale: "th-TH"
    blocks:                                                # semantic, not visual (see §2.6.2)
      - type: collection                                   # canonical types: collection|entity|content|media|action-point|nav
        uses: { query: q_recent }                          # per-type contract (see §2.6.2)
        empty_state: "No content yet"
    actions:                                               # first-class mutations (see §4)
      - id: submit_contact
        intent: "Store inquiry and notify staff"
        operation: create
        on: "supportRequest"
        input:
          schema_ref: content_model.types.supportRequest
        acl:
          allowed_roles: ["public","authenticated"]        # only these two are valid
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
    acl:                                                   # OPTIONAL (see §5 for inheritance)
      visibility: ["public"]                               # or ["authenticated"]
    metrics:
      - id: m-newslist-bounce
        event: "bounce_rate"
        target: "<=40%"
        source: "GA4|custom"
        segment: "all|organic|<segment_id>"
        window: "30d"
```

**SEO `derive_from` note:** may reference `queryId.fieldPath` (e.g., `q_post.seo`) or a content field path literal `type.field` (used when the page’s canonical entity is obvious).

#### 2.6.2 Block Semantics (Contracts & When to Use)

> Blocks are **semantic outputs**—they describe *what the page should deliver*, not specific UI widgets.

* **`collection`** — render a set of items.

  * **Contract:** `uses: { query: <query_id> }` *(query `mode` SHOULD be `many` or `count|aggregate` for summaries)*
  * **Validations:** bound query exists; `mode ∈ [many,count,aggregate]`.
  * **When:** lists, feeds, tables, grids, archives.

* **`entity`** — render a single item.

  * **Contract:** `uses: { query: <query_id> }` *(query `mode` MUST be `one`)*
  * **Validations:** query `mode=one`.
  * **When:** detail pages, single-record views.

* **`content`** — static copy or settings content.

  * **Contract:** `uses: { source: "settings.<path>" | text: "<inline>" }`
  * **When:** headings, legal text, footers, banners, labels.

* **`media`** — file output (image/video/document).

  * **Contract:** `uses: { query: <query_id>, field: "<fileFieldPath>" }` **or** `uses: { from: "<query_id.fieldPath>" }`
  * **When:** hero images, galleries, attachments.

* **`action-point`** — interaction surface that can collect input and invoke an action.

  * **Contract:** `action_id: <action_id>`; optional `prefill: { query: <query_id> }`, `success_state`, `error_state`.
  * **Validations:** referenced action exists.
  * **When:** forms, buttons that submit data, multi-step inputs.

* **`nav`** — navigation or action trigger without data entry.

  * **Contract:** `uses: { route: "<path>" }` **or** `uses: { action_id: "<action_id>" }`
  * **When:** CTAs, next/prev, simple triggers.

**Deprecated names removed in v3.0.0:** `list`, `detail`, `form`, `cta`.

---

### 2.7 `layouts` (Shared chrome & nesting)

**Purpose:** Reusable, nestable wrappers around pages (header/nav/footer/etc.). Layouts follow the same `data` and `blocks` grammar as pages but are **not routes**. A layout renders its own blocks and must expose an `outlet` slot where the child page is rendered.

```yaml
layouts:
  - id: base
    purpose: "Global chrome: header, nav, footer"
    params: []                           # inherits route params; declare if used in queries
    data:                                # same grammar as §3 (scoped to this layout)
      queries:
        q_recent_news: { mode: many, type: newsArticle, sort: "-publishedAt", limit: 5 }
    slots:
      header:
        blocks:
          - { type: content, uses: { text: "Unit Website" } }
      sidebar:
        blocks:
          - { type: collection, uses: { query: q_recent_news } }
      outlet: {}                         # REQUIRED: where the nested page renders
      footer:
        blocks:
          - { type: content, uses: { text: "© Unit" } }
    acl:                                 # optional guard for all pages using this layout
      visibility: ["public"]             # or ["authenticated"]
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
      mode: many             # enum: [one, many, count, aggregate]
      type: "content_type_id"
      by: slug               # enum: [id, slug] (sugar for equality on sys.id or slug)
      where:                  # AND-list by default; see §3.1 for grouped boolean logic
        - field: "slug"
          op: eq
          value: ":param.slug"
      sort: "-publishedAt"
      limit: 10
      offset: 0
      select: ["title","slug"]
      include: ["author"]
      includeDepth: 1
      locale: "th-TH"
      # aggregate (only when mode=aggregate)
      # aggregate:
      #   measures: [ { func: count, field: "*" }, { func: sum, field: "views" } ]
      #   group_by: ["unit.id"]
      #   having:
      #     - { field: "count", op: gt, value: 0 }
```

### 3.1 Formal Mini-Grammar (concise)

```
query := {
  mode: one|many|count|aggregate,
  type: <content_type_id>,
  by?: id|slug,
  where?: predicates | logic,
  sort?: "<field>" | "-<field>",
  limit?: int, offset?: int,
  select?: string[],
  include?: string[], includeDepth?: 1|2,
  locale?: string,
  aggregate?: {
    measures: {func: count|sum|avg|min|max, field: string|"*"}[],
    group_by?: string[],
    having?: predicates | logic
  }
}

# Predicates and boolean logic
predicates := [ predicate, ... ]          # implicit AND
logic := { and?: (predicate|logic)[], or?: (predicate|logic)[], not?: (predicate|logic) }

predicate := {
  field: string,
  op: op,
  value?: literal | placeholder | array
  quantifier?: any|all
}

op := eq|ne|gt|gte|lt|lte|in|nin|contains|starts_with|ends_with|matches|exists|between

literal := string | number | boolean | null | datetime
array := [ literal | placeholder, ... ]
```

**Notes**

* A top-level `where: []` means no filter (i.e., all).
* `quantifier` applies when the `field` is an array or relation collection.
* `matches` is an engine-regex match (implementation-defined syntax).
* `mode=one` SHOULD yield exactly 1 entry; otherwise it’s a spec error.
* If both `by` and `where` are present, they must be consistent.

### 3.2 Placeholder Variables (canonical)

Allowed everywhere a `value` appears:

* `:now` — current server time (ISO-8601)
* `:locale` — effective locale (BCP 47)
* `:user.id` — authenticated user id (or `null`)
* `:param.<name>` — route param value from `sitemap.path`
* `:query.<id>.<fieldPath>` — value from an earlier query in the **same** page/layout scope

**Removed in v4.0.0:** `:role`, `:user.roles[]`.

**Validation**

* Unknown placeholder prefixes → error.
* `:query.*` cannot create cycles; must reference an earlier query id in declaration order.

### 3.3 Sorting, Pagination, Locales

* **Sorting:** `sort` is a single key ascending (`"field"`) or descending (`"-field"`). For stable pagination, include a deterministic tiebreaker in your schema (e.g., `createdAt` + primary key).
* **Pagination:** `limit`/`offset` only. (**No cursor paging** in v3+.)
* **Locales:** precedence is query-level `locale` > page/layout default (if provided) > system default.

---

## 4) Actions/Mutations Grammar (Detailed)

```yaml
actions:
  - id: submit_contact
    intent: "Store inquiry and notify staff"
    operation: create        # enum: [create, update, delete, publish, custom]
    on: "supportRequest"
    input:
      schema_ref: content_model.types.supportRequest
    acl:
      allowed_roles: ["public","authenticated"]   # only these two allowed
      # rule?: <expr>  # optional; may reference input.*, :user.id, :now, :param.*
    effects:
      writes: ["supportRequest"]
      revalidate: ["/support/:id"]
      webhooks: ["notifyOps"]
    success: ["Entry created", "Notification sent"]
    failure: ["Validation error surfaced"]
    rate_limit: { window: "1m", max: 5 }
```

**Canonical “update current profile” example:**

```yaml
actions:
  - id: update_profile
    intent: "Update current user profile"
    operation: update
    on: "userProfile"
    input:
      schema_ref: content_model.types.userProfile
    acl:
      allowed_roles: ["authenticated"]
      rule: 'input.authUserId == :user.id'
    effects:
      writes: ["userProfile"]
```

**Form binding (via block):** An `action-point` block MUST reference a valid `actions.<id>` via `action_id`.

---

## 5) ACL Model (Auth Classes)

**Overview**

* **Auth classes only:** `public` (anonymous) and `authenticated` (signed-in).
* Two layers remain: (1) Allowed auth classes lists, (2) Optional expression rules. If both are present for the same check, **both must pass** (logical AND).

### 5.1 Layouts & Pages

```yaml
layouts[].acl:
  visibility?: ["public"] | ["authenticated"]
  visibility_rule?: <expr>             # optional; no content.* context

pages[].acl:
  visibility?: ["public"] | ["authenticated"]
  visibility_rule?: <expr>             # optional; no content.* context
```

**Inheritance & Effective Visibility**

* If `pages[].acl` is omitted, the page inherits visibility from attached layouts (outer→inner). Effective visibility = **intersection** of all attached layouts’ visibility (and layout `visibility_rule` if present).
* If `pages[].acl` is present, effective visibility = intersection of attached layouts’ visibility (and rules) **and** the page’s `visibility` (and rule, if present).

**Page/Layout expression context**

* Allowed refs: `:user.id`, `:locale`, `:now`, `:param.<name>`.
* **Forbidden:** `content.*` (no record context at page/layout visibility), `:user.roles`, `:role`.

### 5.2 Content Types

```yaml
content_model.types[].acl:
  read?:   ["public"] | ["authenticated"]
  create?: ["authenticated"]
  update?: ["authenticated"]
  publish?:["authenticated"]
  rule?:   # optional per-operation expressions
    read?:    <expr>
    create?:  <expr>
    update?:  <expr>
    publish?: <expr>
```

**Content expression context**

* Allowed refs: `content.<fieldPath>`, `:user.id`, `:locale`, `:now`, `:param.<name>`.
* **Semantics:** A request must satisfy the allowed auth class list **and** the operation’s rule if both are present.

### 5.3 Actions

```yaml
actions[].acl:
  allowed_roles?: ["public"] | ["authenticated"]
  rule?: <expr>    # may reference input.<fieldPath>, :user.id, :locale, :now, :param.*
```

**Expression Grammar (minimal, deterministic)**

```
expr     := orExpr
orExpr   := andExpr { "||" andExpr }
andExpr  := unaryExpr { "&&" unaryExpr }
unaryExpr:= [ "!" ] primary
primary  := literal | ref | "(" expr ")" | call
literal  := string | number | boolean | null | datetime
ref      := contentRef | userRef | paramRef | specialRef | inputRef
contentRef:= "content." fieldPath          # only in content type rules
userRef  := ":user.id"
paramRef := ":param." ident
specialRef:= ":locale" | ":now"
inputRef := "input." fieldPath             # only in action rules
call     := ident "(" args? ")"
args     := expr { "," expr }
ops      := "==" "!=" ">" ">=" "<" "<=" "in" "nin" "contains" "starts_with" "ends_with"
builtins := exists(fieldPath) | length(value)
```

**Examples**

```yaml
# Content rule: public read only when published or after embargo
rule:
  read: 'content.published == true || :now >= content.embargoAt'

# Content rule: only owner can update (no roles concept)
rule:
  update: 'content.owner == :user.id'
```

**Validation**

* Unknown identifiers or context-forbidden refs → error.
* String ops require string operands; `in`/`nin` require RHS array/set.

---

## 6) Content Model (Contentful)

```yaml
content_model:
  types:
    - id: newsArticle
      name: "News Article"
      localized: true
      fields:
        - { id: title,       type: varchar, required: true, localized: true, max_length: 255 }
        - { id: slug,        type: varchar, unique: true, max_length: 255 } # optional: pattern validation
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

    - id: unit
      name: "Unit"
      fields:
        - { id: name,   type: varchar, required: true, max_length: 255 }
        - id: parent
          type: relation
          to: "unit"
          cardinality: many-to-one
          on_delete: nullify
      acl:
        read: ["public"]
        create: ["authenticated"]
        update: ["authenticated"]
        publish: ["authenticated"]

    - id: person
      name: "Person"
      fields:
        - { id: name,     type: varchar, required: true, max_length: 255 }
        - { id: rank,     type: varchar, max_length: 255 }
        - { id: role,     type: varchar, max_length: 255 }
        - { id: portrait, type: file, validations: { mime_types: ["image/*"] } }
        - id: unit
          type: relation
          to: "unit"
          cardinality: many-to-one
          on_delete: restrict
      acl:
        read: ["public"]
        create: ["authenticated"]
        update: ["authenticated"]
        publish: ["authenticated"]
```

### Auth-Linked Profile Pattern (MUST)

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

### Field Types (enum)

`text | varchar | int | float | boolean | datetime | enum | file | relation | array | json`

### Global Field Options (unless noted)

* `required: boolean`
* `unique: boolean`
* `default: <literal | expression>` (e.g., `":now"` for `datetime`)
* `nullable: boolean` (optional)
* `index: boolean` (optional)

### Type-Specific Options & Shapes

* **`varchar`**: `max_length` (default **255** if omitted)

* **`text`**: optional `format` (e.g., `"markdown"`)

* **`int` / `float`**: `min`, `max`

* **`datetime`**: ISO-8601 date-time with timezone; `default` may be `":now"`

* **`enum`**: `values: ["a","b","c"]` (distinct, lowercase strings)

* **`file`**: object shape

  ```yaml
  file:
    id: string
    filename: string
    url: string
    size: number
    mimeType: string
    createdAt: datetime
  ```

  Validations: `mime_types: ["image/*", "application/pdf", ...]`, `max_size: <bytes>`

* **`relation`**:

  ```yaml
  relation:
    to: "<typeId>"
    cardinality: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many"
    on_delete: "restrict" | "cascade" | "nullify"   # optional
    inverse: "<fieldId>"                             # optional, documentation-only
  ```

* **`array`**:
  `items: { type: <primitive> }` where **primitive ∈ { text, varchar, int, float, boolean, datetime, enum }**

* **`json`**: free-form; optional `shape` (documentation-only)

---

## 7) Metrics (Per-Page Analytics Goals)

```yaml
metrics:
  - id: m-news-time
    event: "avg_engaged_time"
    target: ">=90s"
    source: "GA4|custom"
    segment: "all|organic|<segment_id>"
    window: "30d"
```

**Rules**

* Keep ≤ 3 metrics per page (80/20).
* Targets are human-readable comparators: `>=`, `<=`, `=`, `%`, `s`, counts.

---

## 8) Validation Checklist

* **IDs unique** per scope (`features`, `pages`, `types`, `actions`, `metrics`).
* **Routes → pages:** every `sitemap.page_id` exists in `pages[].id`.
* **Sitemap → layouts:** all `sitemap[].layout` refs exist in `layouts[].id`; chains are acyclic.
* **Layouts:** every `layouts[].slots` contains `outlet`.
* **Page queries:** `blocks[].uses.query` references `data.queries.<id>` in the same page; layout queries are not referenceable by pages.
* **Block contracts:**

  * `entity` → bound query `mode=one`.
  * `collection` → bound query `mode ∈ many|count|aggregate`.
  * `action-point` → has valid `action_id`.
  * `media` → has `field` or `from`.
* **Placeholders:**

  * Allowed: `:now`, `:locale`, `:user.id`, `:param.*`, `:query.*` (acyclic).
  * **Errors:** `:role`, `:user.roles[]`, unknown prefixes.
* **Queries:**

  * If `mode=one`, result cardinality must be exactly 1.
  * If `by` is present with `where`, they must be consistent.
  * `limit`/`offset` only; **no cursor**.
* **ACL (Auth Classes):**

  * Any ACL lists must be a subset of `{ "public", "authenticated" }`.
  * Page/layout `visibility_rule` must not reference `content.*`.
  * Content rules may reference `content.*` and `:user.id`.
* **Auth modeling:**

  * **Error** to define `content_model.types[].id` as `user` or `authUser`.
  * If a profile type exists, it **must** contain a unique FK to the auth user (e.g., `authUserId: varchar, unique: true`).
* **Examples sanity:**

  * Replace legacy role examples (`admin`/`editor`) with auth classes.
  * Profile queries filtering on `:user.id` SHOULD use `mode: one`.

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

layouts:
  - id: base
    slots:
      header: { blocks: [ { type: content, uses: { text: "Unit" } } ] }
      outlet: {}
      footer: { blocks: [ { type: content, uses: { text: "© Unit" } } ] }
    acl: { visibility: ["public"] }

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

  - id: news_detail
    purpose: "Read a single post"
    params: ["slug"]
    data:
      queries:
        q_post:
          mode: one
          type: newsArticle
          by: slug
          where: [{ field: "slug", op: eq, value: ":param.slug" }]
          include: ["author"]
    blocks:
      - { type: entity, uses: { query: q_post } }
      - { type: media,  uses: { from: "q_post.heroImage" } }
    seo: { derive_from: "q_post.seo" }
    metrics:
      - { id: m-news-time, event: "avg_engaged_time", target: ">=90s", source: "GA4", window: "30d" }

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
```

---

## 10) Quick How-To

* **Add a new feature:** add to `features[]` with `success[]`.
* **Infer types/routes/layouts:** design `content_model.types[]`, `sitemap[]`, and `layouts[]`.
* **Define a page:** write outcomes → declare `data.queries` → add **semantic** `blocks` (`collection|entity|content|media|action-point|nav`) → wire `actions` (if needed) → (optional) set `acl` (public/authenticated) → add `metrics`.
* **Attach a layout:** define `layouts[]` with an `outlet`, then reference it via `sitemap.layout` (array order = outer→inner).
* **Model users:** never define a `user` type; use `userProfile` with a unique `authUserId` and gate updates with `:user.id`.
* **Lint:** run checks per §8; ensure all references resolve.

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
