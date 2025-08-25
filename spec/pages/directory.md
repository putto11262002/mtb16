route: "/directory"
page_name: "Directory"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel & General Public"
top_user_tasks:

- "Locate contact information for internal sub-units"
- "Discover external partnerships and resources"

# 2) Core Messages (what this page must convey)

key_messages:

- "All unit and partner contacts are centralized in one directory"
- "Easily filter between internal and external listings"
  proof_points:
- "Counts of internal and external entries from cms.DirectoryEntry"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View internal directory"
  target: "/directory/internal"
- type: "primary_cta"
  intent: "View external partnerships"
  target: "/directory/external"
- type: "value_props"
  count: 2-4
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "News or announcements content"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users click either internal or external link within 5 seconds"
- "Entry counts for both categories are visible at a glance"

# 5) Data & Content Inputs

data_needs:

- id: "internal_entries"
  type: "cms_collection"
  description: "Directory entries where type=internal"
  constraints: {min_count: 5}
  status: "approved"
  source: "cms.DirectoryEntry?type=internal"
- id: "external_entries"
  type: "cms_collection"
  description: "Directory entries where type=external"
  constraints: {min_count: 5}
  status: "approved"
  source: "cms.DirectoryEntry?type=external"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "Unit Directory"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "Find contacts for internal and external listings"
  asset_needs:
- id: "directory_icon"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing directory or list"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to internal ≥ 30%" - "Click-through rate to external ≥ 20%"
telemetry_events: - id: "directory_link_click" props: {category:"internal|external"}
seo_intent:
title: "MBT 16 | Directory"
description: "Centralized directory of unit contacts and external partnerships."
target_keywords: ["MBT 16 directory", "unit contacts", "partners"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Links have discernible names for screen readers"
- "Contrast ≥ 4.5:1 for link text"
  perf_targets:
- "LCP ≤ 2.5s"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when user scans, then at least two CTAs (internal/external) are visible
- Given user clicks CTA, when click occurs, then navigates to the corresponding directory page
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
