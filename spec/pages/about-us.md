route: "/about-us"
page_name: "About Us"

# 1) Purpose & Audience

purpose: education | trust
primary_audience: "Local Community, General Public, Non-Army Visitors"
top_user_tasks:

- "Learn about MBT 16's mission and history"
- "Understand the unit's role and values"
- "Find information about the unit's structure"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is a dedicated and integral part of national security and community support."
- "Our unit operates with integrity, discipline, and a commitment to service."
- "We are transparent about our structure and leadership."
  proof_points:
- "Clear mission statement and historical overview"
- "Organizational structure diagram (if applicable)"
- "Links to leadership profiles"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "mission_statement"
  source: "project.md"
- type: "history_overview"
  length: "~200 words"
- type: "values_statement"
  count: 3-5
- type: "leadership_section"
  intent: "Introduce key leadership"
  target: "/about-us/leadership"

exclusions:

- "Highly sensitive operational details"
- "Individual personnel details beyond leadership"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can articulate MBT 16's core mission after visiting."
- "Users feel a sense of trust and transparency regarding the unit."
- "Users can easily find information about the unit's leadership."

# 5) Data & Content Inputs

data_needs:

- id: "unit_history"
  description: "Key historical milestones and founding principles."
- id: "unit_values"
  description: "Core values that guide the unit's operations."
  copy_blocks:
- id: "about_headline"
  tone: "formal, informative"
  length: "≤ 7 words"
- id: "history_text"
  tone: "informative"
  length: "~200 words"
  asset_needs:
- id: "unit_crest"
  alt_required: true
  aspect_ratio: "1:1"
- id: "historical_photo"
  alt_required: true
  aspect_ratio: "16:9"

# 6) Measurement & SEO

success_signals:
kpis: - "Time on page ≥ 120 seconds" - "Click-through rate to /about-us/leadership ≥ 10%"
telemetry_events: - id: "about_us_page_view" props: {} - id: "leadership_link_click" props: {}
seo_intent:
title: "About MBT 16 | Mission, History & Values of the Thai Army Unit"
description: "Learn about MBT 16 (มณฑลทหารบกที่ 16)'s mission, rich history, core values, and organizational structure."
target_keywords: ["MBT 16 mission", "Thai army history", "unit values", "military organization", "about us"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All textual content is easily readable."
- "Any diagrams or charts have text alternatives."
- "Page is navigable using keyboard only."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the About Us page, when they read the content, then they can identify the unit's primary mission.
- Given the page loads, when the leadership section is present, then a clickable link to the detailed leadership page is available.
- Given a user navigates to the page, when all content is loaded, then there are no layout shifts.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
