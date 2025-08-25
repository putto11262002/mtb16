route: "/directory/external"
page_name: "External Partnerships"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel & General Public"
top_user_tasks:

- "Discover external organizations and partners"
- "Find contact info and partnership details"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 collaborates with reliable external partners"
- "Partnership details and contacts are readily available"
  proof_points:
- "cms.DirectoryEntry entries where type=external with organization info"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View partner details"
  target: "/directory/external/[slug]"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Internal department listings"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users click into partner profile within 3 seconds"
- "Listing clearly differentiates internal vs external"

# 5) Data & Content Inputs

data_needs:

- id: "external_entries"
  type: "cms_collection"
  description: "Directory entries filtered by type=external"
  constraints: {min_count: 5}
  status: "approved"
  source: "cms.DirectoryEntry?type=external"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "External Partnerships"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "Connect with our trusted partners"
  asset_needs:
- id: "directory_icon_external"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing external partnerships listings"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to external profiles ≥ 20%"
telemetry_events: - id: "dir_external_click" props: {entry_type:"external"}
seo_intent:
title: "MBT 16 | External Partnerships"
description: "Explore MBT 16’s external partners and collaborations."
target_keywords: ["external partnerships", "army collaborations"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Filter inputs keyboard accessible"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "LCP ≤ 2.5s"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning, then at least 5 external entries visible
- Given user clicks a partner entry, when click, then navigates to that profile
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
