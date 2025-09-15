---
description: Generate one task per shared component extracted from page blocks
agent: build
---

# Objective
Scan page blocks for reusable or interactive patterns and generate one task per extracted component. Each component must be **feature- or content-model-specific**, with scoped names and clearly mapped usage.

# Input
You are given the list of blocks from all pages. Identify and extract components that meet the criteria below and generate one task file per component.

# Operational Workflow
1. Analyze all blocks used across pages.
2. For each reusable or interactive pattern that meets any of the following:
   - Appears on 2+ pages
   - Requires client interactivity (e.g. hydration, event handlers)
   - Composes or customizes multiple ShadCN primitives
   - Encapsulates behavior tied to a feature or content model
3. For each valid pattern:
   - Assign a **specific name**: `NewsListCard`, `ProcurementUploadGrid`, `DirectoryProfileImage`
   - Task ID: `component-<feature>-<purpose>` (kebab-case)
   - File path: `tasks/35-components/*-component-<feature>-<purpose>.yaml`
   - Use fields:
     - `id`: same as filename
     - `title`: "Implement <ComponentName> shared component"
     - `layers: ["interface"]`
     - `tags: ["component", "frontend"]`
     - `spec_refs:` include each `spec:pages.<id>.blocks[N]` where this block was used
     - `feature:` should match the relevant spec feature (e.g. `"news"`)
     - `needs:` must include any action tasks whose data the component consumes
4. Checklist items (2–5) must verify:
   - That the component implements the correct visual/data contract
   - Props are typed using the corresponding content model
   - Any interactivity is correctly handled
   - The component is integrated into the relevant pages
5. Skip emitting a component task if:
   - It is trivial and only wraps a ShadCN primitive
   - It is only used on one page
   - It has no interactivity or logic
6. Do not write a `components-common.yaml` file.
7. Do not update `tasks/index.yaml`.

# Done Checklist
- Each shared component extracted has its own task
- Task IDs and filenames follow `component-<feature>-<purpose>` format
- `spec_refs` and `feature:` fields are specific and accurate
- Checklist items refer to the actual model and integration
- Trivial or one-off blocks are not extracted

# Output
Emit:
- One task file per shared component:
  - `tasks/35-components/component-<feature>-<purpose>.yaml`

---

## Component Extraction Strategy

A block should be extracted into a shared component if it meets any of:

- Reused across 2+ pages
- Requires interactivity or hydration
- Composes multiple ShadCN primitives or meaningfully extends them
- Tied to a feature or content model with a consistent data shape

**ShadCN Exemption Rule:**  
Do not extract components that merely wrap a single ShadCN primitive with minimal customization.

---

## Spec Slice (do not regenerate)

!`yq -oy '.pages[] | pick(["id", "blocks"])' docs/SPEC.yaml`
