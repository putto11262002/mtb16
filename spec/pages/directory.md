route: "/directory"
page_name: "Directory"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel, Local Community, General Public"
top_user_tasks:

- "Find contact information for internal sub-units and departments"
- "Discover external network and partnerships"
- "Navigate to specific directory listings"

# 2) Core Messages (what this page must convey)

key_messages:

- "Easily connect with the relevant departments and partners of MBT 16."
- "MBT 16 fosters strong internal and external relationships."
- "Our comprehensive directory ensures you find the information you need."
  proof_points:
- "Clear categorization of internal and external directories"
- "Search and filter capabilities for directory listings"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "directory_links"
  links: ["/directory/internal", "/directory/external"]
- type: "search_bar"
  intent: "Search directory listings"
- type: "brief_description"
  content: "This directory provides contact information for internal sub-units and departments, as well as our external network and partnerships."

exclusions:

- "Individual contact information for non-public facing personnel"
- "Sensitive internal operational details"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly choose between internal and external directories."
- "Users can efficiently locate specific directory entries."
- "Users understand the purpose and scope of the directory."

# 5) Data & Content Inputs

data_needs:

- id: "internal_directory_summary"
  description: "Summary of internal sub-units and departments available."
- id: "external_directory_summary"
  description: "Summary of external network and partnerships available."
  copy_blocks:
- id: "directory_headline"
  tone: "informative, helpful"
  length: "≤ 5 words"
  asset_needs:
- id: "directory_icon"
  alt_required: true
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to internal/external directories ≥ 20%" - "Search usage rate ≥ 15%"
telemetry_events: - id: "directory_page_view" props: {} - id: "directory_type_selection" props: {type: "{internal|external}"}
seo_intent:
title: "MBT 16 Directory | Internal Units & External Partnerships"
description: "Find contact information for MBT 16's internal sub-units and departments, as well as our external network and partnerships."
target_keywords: ["MBT 16 directory", "military units contact", "army partnerships", "department contacts"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Directory links are clearly labeled and navigable."
- "Search functionality is accessible via keyboard."
- "Information is presented in a clear and structured manner."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the Directory page, when they click on 'Internal Sub-Units & Departments', then they are navigated to /directory/internal.
- Given a user is on the Directory page, when they use the search bar, then relevant directory entries are displayed.
- Given the page loads, when the directory links are present, then they are clearly distinguishable and clickable.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
