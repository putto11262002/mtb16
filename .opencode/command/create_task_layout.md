---
description: Generate layout tasks from SPEC.yaml
agent: build
---

# Objective
Generate one layout implementation task for each layout defined in the spec, using the canonical task format for phase 30.

# Input
You are given the list of layouts from the spec. Each layout must be implemented as a reusable layout file with slot support, scoped queries, and optional guards.

# Operational Workflow
1. For each layout object:
   - Use the layout `id` to generate the task ID: `layout-<id>`
   - Emit to `tasks/30-layouts/*-layout-<id>.yaml`
   - Use `layers: ["interface"]`
   - Use `tags: ["layout", "frontend"]`
   - Use `spec_refs: ["spec:layouts.<id>"]`
   - `title`: "Implement <id> layout with outlet"
   - `outcome`: "Layout <id> renders all declared slots with correct ACL and outlet content."
2. If the layout includes `data.queries` or `actions`, the task must **reference the relevant server actions** and include `needs: ["action-<feature>-<fn>", ...]`
3. Each task must include 2–4 verifiable checklist items covering:
   - outlet rendering
   - layout slot usage
   - ACL rules
   - action/query calls (via server only)
4. Skip writing the file if content is unchanged.
5. Do **not** update `tasks/index.yaml`.

# Done Checklist
- A task is created for each layout in the spec
- Task ID and filename match `layout-<id>` convention
- Correct `layers`, `tags`, `spec_refs`, and `title` used
- Checklist verifies outlet rendering, ACL, and data hooks
- Relevant server actions are added to `needs`

# Output
Emit:
- One task file per layout: `tasks/30-layouts/*-layout-<id>.yaml`

---

## Spec Slice (do not regenerate)

!`yq -oy '.layouts' docs/SPEC.yaml`
