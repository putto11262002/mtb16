---
description: Generate a content model task from SPEC.yaml
agent: build
---

# Objective
Generate a single task file (`cm-schema`) that maps the spec content model into the canonical task format for phase 10.

# Input
You are given the extracted `content_model` portion of the spec below. Use this as the source of truth to emit one task file.

# Operational Workflow
1. Analyze the content model schema and field definitions below.
2. Create a task file named `cm-schema.yaml` under `tasks/10-content-model/`.
3. Use this structure:
   - `id: "cm-schema"`
   - `title: "Map spec content model to Drizzle (schema + migrations)"`
   - `layers: ["application"]`
   - `tags: ["db-schema","migration"]`
   - `spec_refs: ["spec:content_model.types"]`
4. The `outcome` should describe: “Spec content model is represented in Drizzle with migrations applied.”
5. The `done_checklist` must contain 2–5 binary checks (e.g. schema is complete, constraints match, migrations generated).
6. Only write the task file if it differs from what’s already present.
7. Do **not** update `tasks/index.yaml`; that will be handled separately.

# Done Checklist
- `tasks/10-content-model/*-cm-schema.yaml` is created or updated as needed
- Task fields use correct structure and values
- File contents match spec structure and logic
- Checklist is clear, binary, and directly testable

# Output
Emit:
- `tasks/10-content-model/*-cm-schema.yaml`

---

## Spec Slice (do not regenerate)


!`yq -oy '.content_model' docs/SPEC.yaml`
