route: "/directory/internal"
page_name: "Internal Sub-Units & Departments"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel"
top_user_tasks:

- "Locate contact information for specific internal sub-units"
- "Understand the structure and function of different departments"
- "Find relevant internal resources or points of contact"

# 2) Core Messages (what this page must convey)

key_messages:

- "Efficiently connect with any internal sub-unit or department within MBT 16."
- "This directory streamlines internal communication and collaboration."
- "Access the right contact for your internal needs."
  proof_points:
- "Categorized listings of sub-units/departments"
- "Search and filter capabilities"
- "Key contact details (e.g., phone, email, office location)"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "department_list"
  display_fields: ["name", "description", "contact_info"]
  min_count: 5
- type: "search_bar"
  intent: "Search internal departments"
- type: "category_filter"
  categories: ["Administration", "Operations", "Logistics", "Medical"]

exclusions:

- "Highly sensitive internal contact details"
- "Information not relevant to internal communication"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly find the contact details for a specific internal department."
- "Users understand the primary function of each listed sub-unit."
- "Users can easily navigate between different internal departments."

# 5) Data & Content Inputs

data_needs:

- id: "internal_departments"
  description: "List of internal sub-units/departments with name, brief description, and contact information (e.g., phone, email, physical location)."
  constraints: {min_count: 5}
  copy_blocks:
- id: "page_headline"
  tone: "informative, functional"
  length: "≤ 7 words"
  asset_needs:
- id: "department_icon"
  alt_required: true
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Search usage rate ≥ 20%" - "Click-through rate to department details ≥ 15%"
telemetry_events: - id: "internal_directory_page_view" props: {} - id: "department_contact_click" props: {department_id: "{id}"}
seo_intent:
title: "MBT 16 Internal Directory | Sub-Units & Departments Contact"
description: "Find contact information and details for all internal sub-units and departments within MBT 16 (มณฑลทหารบกที่ 16)."
target_keywords: ["MBT 16 internal", "army departments", "military sub-units", "internal contacts"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All contact information is clearly presented and accessible."
- "Search and filter controls are keyboard navigable."
- "Content is structured for easy scanning and readability."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the internal directory page, when they search for a department, then relevant results are displayed.
- Given the page loads, when department listings are present, then each listing includes a name, description, and contact method.
- Given a user clicks on a department, when a detailed view is available, then it provides comprehensive information.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
