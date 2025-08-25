route: "/directory/internal"
page_name: "Internal Directory"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel"
top_user_tasks:

- "Find contact info for internal sub-units and departments"
- "Filter entries by name or category"

# 2) Core Messages (what this page must convey)

key_messages:

- "Internal directory centralizes all unit sub-group contacts"
- "Information is accurate, maintained by MBT 16"
  proof_points:
- "cms.DirectoryEntry entries where type=internal with names and contact details"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View sub-unit details"
  target: "/directory/internal/[slug]"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "External partnership listings"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users click into sub-unit profile within 3 seconds"
- "Filter controls for search and category visible above the fold"

# 5) Data & Content Inputs

data_needs:

- id: "internal_entries"
  type: "cms_collection"
  description: "Directory entries filtered by type=internal"
  constraints: {min_count: 5}
  status: "approved"
  source: "cms.DirectoryEntry?type=internal"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "Internal Directory"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "Contacts for all MBT 16 units"
  asset_needs:
- id: "directory_icon_internal"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing internal directory listings"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to internal profiles ≥ 30%"
telemetry_events: - id: "dir_internal_click" props: {entry_type:"internal"}
seo_intent:
title: "MBT 16 | Internal Directory"
description: "Find contact information for MBT 16 sub-units and departments."
target_keywords: ["internal directory", "unit contacts"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Filter inputs keyboard accessible"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "LCP ≤ 2.5s"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning, then at least 5 internal entries visible
- Given user clicks an entry, when click, then navigates to that profile
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
