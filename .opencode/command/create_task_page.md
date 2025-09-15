---
description: Generate one task per page in the spec
agent: build
---

# Objective
Generate one task per page defined in the spec. Each task represents the implementation of a UI page that wires data, blocks, routing, SEO, and access control.

# Input
You are given the list of pages and sitemap definitions from the spec. Use these to generate a task per page.

# Operational Workflow
1. For each page in the spec:
   - Set the task ID to `page-<id>` (e.g. `page-news-list`)
   - File path: `tasks/40-pages/*-page-<id>.yaml`
   - Use:
     - `title`: "Implement <id> page"
     - `layers: ["interface"]`
     - `tags: ["page", "frontend", "route"]`
     - Add `"seo"` tag if the page defines a `seo:` block
     - `spec_refs: ["spec:pages.<id>", "spec:sitemap.<id>"]`
     - `needs:` must include:
       - Layout(s) from `sitemap.layout` chain
       - All required action tasks for queries/mutations on this page
       - `component-*` if shared components are used (optional)
2. Each page task must:
   - Reference the correct route file path (e.g., `/news/:slug` → `src/pages/news/[slug].astro`)
   - Declare all required layouts in rendering order (outer to inner)
   - Integrate shared components if `35-components/` files exist
3. Checklist items (2–6) must verify:
   - Page route and layout integration
   - Query/mutation logic is correctly wired via server actions
   - Any shared components are used if available
   - ACL visibility is respected
   - SEO metadata is present if defined
4. Skip writing if the task file already exists and is identical.
5. Do not update `tasks/index.yaml`.

# Done Checklist
- One task is emitted for each page in the spec
- `needs:` includes layouts, components, and action tasks used by the page
- Checklist validates route, layout chain, server wiring, and SEO
- File path and task ID match conventions

# Output
Emit:
- One task file per page:
  - `tasks/40-pages/page-<id>.yaml`

---

## Spec Slice (do not regenerate)

!`yq -oy '. |= pick(["sitemap", "pages"])' docs/SPEC.yaml`
