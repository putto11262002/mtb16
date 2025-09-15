---
description: Generate action tasks from SPEC.yaml
agent: build
---

# Objective
Emit one server action task per operation (read/write) defined in the spec’s pages — including queries and declared actions — using the canonical task format for phase 20.

# Input
You are given the extracted slices of all `pages[*].data.queries` and `pages[*].actions` definitions. These define what server functions must exist. Use them to generate one action task per server function.

# Operational Workflow
1. Parse each query in `pages[*].data.queries.*` and each action in `pages[*].actions.*`.
2. Group them by `feature` (inferred from `pages[].id` prefix or matching `features[].id`).
3. For each function:
   - Emit one task file under `tasks/20-actions/` named `action-<feature>-<fn>.yaml`
   - Assign `id` = `action-<feature>-<fn>` (e.g., `action-news-list`)
   - Use `feature: "<feature>"` to group related tasks
   - Use `layers: ["application"]`
   - Use `tags:` at minimum `["server-action", "validation"]`, and additionally:
     - `db-access` if query hits content
     - `auth` if rule contains auth logic
     - `storage` if file fields involved
4. Add `spec_refs:` pointing to the precise query/action origin
5. Each task should include a binary `done_checklist` (e.g. function exists, schema validated, errors handled)
6. Each task must `needs: ["cm-schema"]`
7. Skip writing if unchanged; do **not** update `tasks/index.yaml`.

# Done Checklist
- All server functions defined in the spec have one task each
- Each task file follows naming and ID conventions
- Feature grouping, layers, tags, and spec_refs are present and correct
- All tasks depend on `cm-schema`
- Task content reflects the actual I/O contract and logic from the spec

# Output
Emit:
- One task file per action: `tasks/20-actions/*-action-<feature>-<fn>.yaml`

---

## Spec Slice (do not regenerate)

!`yq -oy '(.pages[] | pick(["id", "actions"]))' docs/SPEC.yaml`
