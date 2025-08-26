route: "/about-us/leadership"
page_name: "Unit Leadership"

# 1) Purpose & Audience

purpose: trust
primary_audience: "General Public"
top_user_tasks:

- "View profiles of MBT 16 commanders and leadership"
- "Learn leadership roles and responsibilities"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16’s leadership brings expertise, integrity, and experience"
- "Profiles include roles, bios, and contact methods"
  proof_points:
- "List of leadership entries from cms.DirectoryEntry filtered by category 'Leadership'"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View detailed profile"
  target: "/directory/[slug]"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "News, announcements, or general directory items"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can select a leader within 3 seconds"
- "Profiles display headshot, name, rank, and role summary"

# 5) Data & Content Inputs

data_needs:

- id: "leadership_entries"
  type: "cms_collection"
  description: "Directory entries for leadership"
  constraints: {min_count: 3}
  status: "approved"
  source: "cms.DirectoryEntry?category=Leadership"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "professional"
  length: "≤ 5 words"
  status: "approved"
  content: "Our Leadership"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "Meet the team guiding MBT 16"
  asset_needs:
- id: "leader_photo"
  type: "dynamic_content"
  format: "jpg|webp"
  alt_required: true
  status: "approved"
  description: "Headshot image provided by image_url field"

# 6) Measurement & SEO

success_signals:
kpis: - "Profile click rate ≥ 30%"
telemetry_events: - id: "leadership_profile_click" props: {leader_id:"<id>"}
seo_intent:
title: "MBT 16 Leadership – Commanders & Officers"
description: "Meet the leadership team of MBT 16: biographies, roles, and experience."
target_keywords: ["MBT 16 leadership", "unit commanders"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Images have descriptive alt text (name and rank)"
- "Profile links keyboard accessible"
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning, then at least three leadership cards displayed
- Given user selects a profile, when click, then navigates to individual profile page
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
