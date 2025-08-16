route: "/about-us/leadership"
page_name: "Unit Commanders & Leadership"

# 1) Purpose & Audience

purpose: trust | education
primary_audience: "Local Community, General Public, Army Personnel"
top_user_tasks:

- "Learn about the key leaders of MBT 16"
- "Understand the roles and responsibilities of the leadership team"
- "Gain confidence in the unit's command structure"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is led by experienced and dedicated professionals."
- "Our leadership team is committed to the unit's mission and the well-being of its personnel."
- "Transparency and accountability are core tenets of our command."
  proof_points:
- "Individual profiles with photos, ranks, and brief biographies"
- "Clear hierarchy or organizational chart (if applicable)"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "leadership_profiles"
  display_fields: ["name", "rank", "position", "photo", "short_bio"]
  min_count: 3
- type: "organizational_overview"
  description: "Brief explanation of the leadership structure."

exclusions:

- "Personal contact information (unless publicly available)"
- "Sensitive career details or operational assignments"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can easily identify the key leaders of MBT 16."
- "Users feel a sense of trust and professionalism from the leadership team."
- "Users understand the chain of command within the unit."

# 5) Data & Content Inputs

data_needs:

- id: "leadership_data"
  description: "Data for each leader including name, rank, position, photo URL, and a concise biography."
  constraints: {min_count: 3}
  copy_blocks:
- id: "page_headline"
  tone: "formal, respectful"
  length: "≤ 7 words"
  asset_needs:
- id: "leader_photos"
  alt_required: true
  aspect_ratio: "3:4"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 90 seconds" - "Click-through rate to individual profiles (if applicable) ≥ 10%"
telemetry_events: - id: "leadership_page_view" props: {} - id: "leader_profile_click" props: {leader_id: "{id}"}
seo_intent:
title: "MBT 16 Leadership | Unit Commanders & Key Personnel"
description: "Meet the dedicated commanders and leadership team of MBT 16 (มณฑลทหารบกที่ 16). Learn about their roles and commitment to service."
target_keywords: ["MBT 16 leadership", "unit commanders", "military hierarchy", "army officers", "leadership profiles"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All leader photos have descriptive alt text."
- "Text content is clear and easy to read."
- "Page is navigable by keyboard."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the leadership page, when they view a leader's profile, then their rank, name, and position are clearly displayed.
- Given the page loads, when leader photos are present, then they are high-resolution and appropriately cropped.
- Given the page loads, when multiple leaders are listed, then the order is logical (e.g., by rank or position).
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
