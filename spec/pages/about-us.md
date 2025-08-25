route: "/about-us"
page_name: "About Us"

# 1) Purpose & Audience

purpose: education
primary_audience: "General Public"
top_user_tasks:

- "Discover MBT 16’s mission, history, and values"
- "Navigate to leadership profiles"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 has a distinguished history of service and community engagement"
- "Our leadership team guides the unit with expertise and integrity"
  proof_points:
- "Timeline of key milestones in MBT 16 history"
- "Summary of leadership roles and achievements"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View leadership profiles"
  target: "/about-us/leadership"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "News or announcement feeds"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users locate leadership section link within 5 seconds"
- "Historical timeline entries are scannable and clearly labeled"

# 5) Data & Content Inputs

data_needs:

- id: "unit_history"
  type: "static_asset"
  description: "Content block or asset representing historical timeline"
  constraints: {min_count: 1}
  status: "requesting"
  source: "upload_required"
- id: "leadership_overview"
  type: "generated_content"
  description: "Summary text introducing leadership team"
  constraints: {min_count: 1}
  status: "requesting"
  source: "cms.DynamicCopy"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "professional"
  length: "≤ 5 words"
  status: "approved"
  content: "About MBT 16"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 12 words"
  status: "approved"
  content: "Our mission, values, and leadership"
  asset_needs:
- id: "history_image"
  type: "static_asset"
  format: "jpg|png"
  alt_required: true
  status: "requesting"
  description: "Archival or illustrative image showcasing MBT 16’s history"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to leadership ≥ 20%"
telemetry_events: - id: "about_leadership_click" props: {target:"/about-us/leadership"}
seo_intent:
title: "About MBT 16 – History & Leadership"
description: "Learn about the mission, values, and leadership of MBT 16."
target_keywords: ["MBT 16 history", "unit leadership"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Images have alt text describing historical context"
- "Contrast ≥ 4.5:1 for timeline text"
  perf_targets:
- "LCP ≤ 2.5s (desktop)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning page, then headline and subhead visible within first view
- Given user clicks leadership CTA, when click event, then navigates to leadership page
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
