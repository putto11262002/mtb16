route: "/announcements"
page_name: "Announcements"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel & General Public"
top_user_tasks:

- "Browse recent official announcements"
- "Filter announcements by category/tag"

# 2) Core Messages (what this page must convey)

key_messages:

- "Access formal, timely communications from MBT 16 leadership"
- "Announcements are official and authoritative"
  proof_points:
- "Ordered list of announcements from cms.Announcement with publish date"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Read announcement"
  target: "/announcements/[slug]"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "News article summaries or unrelated PR content"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can click into announcement details within 3 seconds"
- "Filtering options visible and usable above fold"

# 5) Data & Content Inputs

data_needs:

- id: "announcement_feed"
  type: "cms_collection"
  description: "List of announcements"
  constraints: {min_count: 5, max_count: 20}
  status: "approved"
  source: "cms.Announcement"
- id: "tags"
  type: "cms_collection"
  description: "Available announcement tags/categories"
  constraints: {min_count: 1}
  status: "approved"
  source: "cms.Announcement.tags"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "Official Announcements"
  asset_needs:
- id: "announcement_icon"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing announcements or megaphone"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate ≥ 25%"
telemetry_events: - id: "announcement_select" props: {list:"announcements"}
seo_intent:
title: "MBT 16 | Announcements"
description: "Official announcements from MBT 16 leadership, policy updates, and notices."
target_keywords: ["MBT 16 announcements", "army notices", "official updates"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All filter controls keyboard accessible"
- "Contrast ≥ 4.5:1 for text and icons"
  perf_targets:
- "LCP ≤ 2.5s (desktop)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given any user, when page loads, then at least 5 announcements display in list
- Given a user filters by tag, when selecting a tag, then list updates to show only matching items
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
