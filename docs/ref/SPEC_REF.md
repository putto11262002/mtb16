---
title: Contentful Website Spec Reference
description: A single-file, YAML "source of truth" for a Contentful-backed website with an admin panel.
version: 2.0.0
---

## 0) Conventions

* **IDs:** `kebab-case`, unique within their scope.
* **Enums:** use lowercase literals listed below.
* **Dates/Windows:** ISO-8601 dates; reporting windows like `"30d"`.
* **Placeholders in values:** `:param` (route), `:env` (build/runtime), `:role` (current user role), `:now` (server time).
* **Layouts:** `layouts[].id` uses `kebab-case`. Every layout MUST declare an `outlet` slot.

---

## 1) Top-Level Structure

```yaml
meta: {}           # object
context: {}        # object
roles: []          # array of role objects
features: []       # array of feature objects; upstream, outcome-based; no refs to pages/types
sitemap: []        # array of route nodes
layouts: []        # array of layouts; shared, nestable wrappers with slots
pages: []          # array of pages; outcomes, blocks, data, actions, ACL, metrics
content_model:
  types: []        # array of content types
# acceptance: []   # optional: brief, binary top-level checks
```

---

## 2) Sections (Required Fields, Grammar, Examples)

### 2.1 `meta`

**Purpose:** Doc identity + optional global KPIs.

```yaml
meta:
  spec_id: web-001              # string
  name: "Unit Website"          # string
  version: 0.1.0                # string (semver suggested)
  source_brief: docs/product-brief.md
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
  audiences: ["public", "press", "staff"]
  locales: ["th-TH","en-US"]
```

---

### 2.3 `roles`

**Purpose:** System roles, referenced by ACLs.

```yaml
roles:
  - id: admin
    desc: "Full control incl. schema & publish"
  - id: editor
    desc: "Create/edit/publish content"
  - id: public
    desc: "Anonymous visitor"
```

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
    data:                                                  # declarative queries (see grammar)
      queries:
        q_recent:
          mode: many                 # enum: [one, many, count, aggregate]
          type: "newsArticle"
          by: slug                   # enum: [id, slug]
          where:                     # AND of predicates
            - field: "publishedAt"
              op: lt                 # enum: [eq, ne, in, gt, lt, contains, matches]
              value: ":now"
          sort: "-publishedAt"
          limit: 12
          offset: 0
          select: ["title","slug","seo"]                   # optional projection
          include: ["author","unit"]                       # expand relations
          locale: "th-TH"                                  # optional
    blocks:                                                # semantic, not visual
      - type: list                                         # enum: [list, detail, content, media, form, cta]
        uses: { query: q_recent }                          # per-type contract (see §2.6.2)
        empty_state: "No content yet"                      # optional
    actions:                                               # first-class mutations
      - id: submit_contact
        intent: "Store inquiry and notify staff"
        operation: create          # enum: [create, update, delete, publish, custom]
        on: "supportRequest"       # content type id or "custom"
        input:
          schema_ref: content_model.types.supportRequest   # or null
          # OR explicit fields if no schema_ref:
          # fields: [ { id: "email", type: Email, required: true } ]
        acl: { allowed_roles: ["public","editor","admin"] }
        effects:
          writes: ["supportRequest"]                       # resources touched
          revalidate: ["/support/:id"]                     # optional
          webhooks: ["notifyOps"]                          # optional
        success: ["Entry created", "Notification sent"]
        failure: ["Validation error surfaced"]
        rate_limit: { window: "1m", max: 5 }               # optional
    seo:
      index: true
      title_tmpl: "News – %s"
      derive_from: "q_post.seo"                            # or "type.field"
    acl:                                                   # OPTIONAL (see §5 for inheritance)
      visibility: ["public"]                               # or ["authenticated"] or role IDs
      actions:
        visit: ["public","editor","admin"]
        use_action: { submit_contact: ["public","editor","admin"] }  # per-action gate
        manage_modules: ["admin"]
    metrics:                                               # analytics goals (behavioral)
      - id: m-newslist-bounce
        event: "bounce_rate"                               # GA4 or custom event name
        target: "<=40%"                                    # comparator literal, e.g. "<=40%" or ">=90s"
        source: "GA4|custom"
        segment: "all|organic|<segment_id>"                # optional
        window: "30d"
```

#### 2.6.2 Block Taxonomy & `uses` Shapes

* **`list`** — render many entries
  `uses: { query: <query_id> }` *(query `mode` SHOULD be `many` or `count|aggregate` for summaries)*

* **`detail`** — render one entry
  `uses: { query: <query_id> }` *(query `mode` MUST be `one`)*

* **`content`** — static copy or settings content
  `uses: { source: "settings.<path>" | text: "<inline>" }`

* **`media`** — hero, gallery, or single **file**
  `uses: { query: <query_id>, field: "<fileFieldPath>" }` **or** `uses: { from: "<query_id.fieldPath>" }`

* **`form`** — user input; must map to `actions.<id>`
  `action_id: <action_id>`
  Optional: `prefill: { query: <query_id> }`, `success_state`, `error_state`

* **`cta`** — navigational/action triggers
  `uses: { route: "<path>" }` **or** `uses: { action_id: "<action_id>" }`

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
    slots:                               # named regions rendered around the child page
      header:
        blocks:
          - { type: content, uses: { text: "Unit Website" } }
      sidebar:
        blocks:
          - { type: list, uses: { query: q_recent_news } }
      outlet: {}                         # REQUIRED: where the nested page renders
      footer:
        blocks:
          - { type: content, uses: { text: "© Unit" } }
    acl:                                 # optional guard for all pages using this layout
      visibility: ["public"]
    metrics:                             # optional; same grammar as §7
      - { id: m-layout-nav-CTR, event: "nav_click", target: ">=3%", source: "GA4", window: "30d" }
```

**Rules**

* Every layout MUST declare an `outlet` slot.
* `data.queries` & `blocks` follow §3 and §2.6.2; query ids are **scoped to the layout** (pages can’t reference layout queries directly).
* **Attach via `sitemap.layout`**; order = outer→inner. The page renders inside the last layout’s `outlet`.
* **Inheritance:** Children inherit parent layouts unless they provide their own `layout` (which replaces the chain).
* **ACL:** Layout `acl` uses **visibility** only. It constrains all nested pages (see §5).
* Keep ≤ 3 layout-level metrics (80/20).

---

## 3) Data Query Grammar (Detailed)

```yaml
data:
  queries:
    q_example:
      mode: many             # enum: [one, many, count, aggregate]
      type: "content_type_id"
      by: slug               # enum: [id, slug]
      where:                  # array => AND
        - field: "slug"
          op: eq             # enum: [eq, ne, in, gt, lt, contains, matches]
          value: ":param"
      sort: "-publishedAt"
      limit: 10
      offset: 0
      select: ["title","slug"]
      include: ["author"]     # expand relations
      locale: "th-TH"
      # aggregate: { func: count, field: "views" }  # only when mode=aggregate
```

**Rules**

* Applies to both `pages[].data` and `layouts[].data`. Query ids are scoped to their owner.
* `mode=one` SHOULD yield exactly one entry (enforced by `where/by`).
* `by` is syntactic sugar for a single `where` on `sys.id` or `slug`.
* `include` expands declared **relations** and embeds related entries in the result.
* Placeholders allowed in `value`: `:slug` (from route), `:now`, etc.

---

## 4) Actions/Mutations Grammar (Detailed)

```yaml
actions:
  - id: submit_contact
    intent: "Store inquiry and notify staff"
    operation: create        # enum: [create, update, delete, publish, custom]
    on: "supportRequest"     # content type id or "custom"
    input:
      schema_ref: content_model.types.supportRequest
      # OR use fields instead of schema_ref:
      # fields: [ { id: "email", type: Email, required: true } ]
    acl:
      allowed_roles: ["public","editor","admin"]
    effects:
      writes: ["supportRequest"]
      revalidate: ["/support/:id"]
      webhooks: ["notifyOps"]
    success: ["Entry created", "Notification sent"]
    failure: ["Validation error surfaced"]
    rate_limit: { window: "1m", max: 5 }
```

**Form binding:** A `form` block MUST reference a valid `actions.<id>` via `action_id`.

---

## 5) ACL Model

* **Roles registry:** `roles[].id` is the only source of truth for role names.
* **Layouts ACL:** optional `visibility` list; constrains all nested pages that attach the layout (directly or via inheritance).
* **Pages ACL (optional):**

  * If `pages[].acl` is **omitted**, the page **inherits** visibility from the attached layout chain (outer→inner) — i.e., effective visibility equals the **intersection** of all attached layouts’ `acl.visibility`.
  * If `pages[].acl` is **present**, effective visibility equals the **intersection** of all attached layouts’ `acl.visibility` and the page’s `acl.visibility` (stricter wins).
  * `actions` (e.g., `visit`, `use_action`, `manage_modules`) are optional; when not specified, defaults are:

    * `visit`: the page’s effective visibility list.
    * `use_action`: allowed roles are the **intersection** of the page’s `visit` roles and each action’s `acl.allowed_roles` (from §4). If page ACL omitted, use the inherited `visit` roles from layouts.
* **Content types ACL (`content_model.types[].acl`):**

  * `read`, `create`, `update`, `publish`: arrays of roles.
* **Actions ACL:** `actions[].acl.allowed_roles` always applies.

**Validation Rules**

* Every role referenced MUST exist in `roles`.
* `pages[].acl.use_action` keys MUST reference declared `actions[].id` on the same page.

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
        create: ["editor","admin"]
        update: ["editor","admin"]
        publish: ["editor","admin"]

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
        create: ["admin"]
        update: ["admin"]
        publish: ["admin"]

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
        create: ["admin"]
        update: ["admin"]
        publish: ["admin"]
```

**Field Types (enum):** `text | varchar | int | float | boolean | datetime | enum | file | relation | array | json`

**Global Field Options (unless noted):**

* `required: boolean`
* `unique: boolean`
* `default: <literal | expression>` (e.g., `":now"` for `datetime`)
* `nullable: boolean` (optional)
* `index: boolean` (optional)

**Type-Specific Options & Shapes:**

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
  `items: { type: <primitive> }` where \*\*primitive ∈ { text, varchar, int, float, boolean, datetime, enum }\`
* **`json`**: free-form; optional `shape` (documentation-only)

---

## 7) Metrics (Per-Page Analytics Goals)

```yaml
metrics:
  - id: m-news-time
    event: "avg_engaged_time"           # GA4 metric or custom
    target: ">=90s"                     # comparator + value (%, s, count)
    source: "GA4|custom"
    segment: "all|organic|<segment_id>" # optional
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
* **Page queries:** `blocks[].uses.query` references `data.queries.<id>`.
* **Block contracts:**

  * `detail` → bound query `mode=one`.
  * `list` → bound query `mode=many|count|aggregate`.
  * `form` → has valid `action_id`.
  * `media` → has `field` or `from`.
* **Roles:** all ACL role IDs exist in `roles`.
* **Actions:** `use_action` keys exist in `actions[].id`.
* **ACL effective visibility:** computed as intersection of attached layouts’ `visibility`, and page `visibility` if provided.
* **Field types & options:**

  * `enum.values` non-empty; all distinct lowercase strings.
  * When `type: varchar`, `max_length` present (default 255 if omitted).
  * When `type: relation`, `to` targets an existing `types[].id` and `cardinality` is valid.
  * When `type: file`, validations (if provided) use supported keys (`mime_types`, `max_size`).
  * Any `unique: true` field must be indexable (implicit or explicit).
  * `array.items.type` must be a **primitive** (`text|varchar|int|float|boolean|datetime|enum`).

---

## 9) Minimal Working Example (Trimmed)

```yaml
meta: { spec_id: "web-001", name: "Unit Website", version: "0.1.0", source_brief: "docs/product-brief.md" }

context:
  goals: ["Inform public", "Editors publish without dev help"]
  audiences: ["public","staff"]
  locales: ["th-TH","en-US"]

roles:
  - { id: admin,  desc: "All permissions" }
  - { id: editor, desc: "Create/edit/publish" }
  - { id: public, desc: "Anonymous" }

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
      - { type: list, uses: { query: q_recent } }
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
          where: [{ field: "slug", op: eq, value: ":slug" }]
          include: ["author"]
    blocks:
      - { type: detail, uses: { query: q_post } }
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
        create: ["editor","admin"]
        update: ["editor","admin"]
        publish: ["editor","admin"]
```

---

## 10) Quick How-To

* **Add a new feature:** add to `features[]` with `success[]`.
* **Infer types/routes/layouts:** design `content_model.types[]`, `sitemap[]`, and `layouts[]`.
* **Define a page:** write outcomes → declare `data.queries` → add `blocks` → wire `actions` (if needed) → (optional) set `acl` → add `metrics`.
* **Attach a layout:** define `layouts[]` with an `outlet`, then reference it via `sitemap.layout` (array order = outer→inner).
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
