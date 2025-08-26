route: "/announcements/[slug]"
page_name: "Announcement Details"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel & General Public"
top_user_tasks:

- "Read full announcement content"
- "Download or view attachments"

# 2) Core Messages (what this page must convey)

key_messages:

- "This announcement is official and authoritative from MBT 16"
- "All relevant details and attachments are provided"
  proof_points:
- "Title, publish date, author, and content fields from cms.Announcement"
- "List of attachments with download links"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Download attachment"
  target: "attachments[].url"
- type: "value_props"
  count: 1-2
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Related news or unrelated content feeds"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Full announcement content loads within 1 second"
- "Attachment downloads initiate within 2 seconds of click"

# 5) Data & Content Inputs

data_needs:

- id: "announcement_detail"
  type: "cms_collection"
  description: "Announcement record matching slug"
  constraints: {min_count: 1, max_count: 1}
  status: "approved"
  source: "cms.Announcement"
  copy_blocks:
- id: "none"
  type: "static_content"
  asset_needs:
- id: "attachment_files"
  type: "dynamic_content"
  format: "file links"
  status: "approved"
  description: "Attachment files from announcement"

# 6) Measurement & SEO

success_signals:
kpis: - "Attachment download rate ≥ 10%"
telemetry_events: - id: "announcement_attachment_download" props: {announcement_id:"<id>"}
seo_intent:
title: "{announcement.title} – MBT 16 Official Announcement"
description: "Read the full MBT 16 announcement on {announcement.published_at}."
target_keywords: ["MBT 16 announcement", "official notice", "{announcement.tags}"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Images or icons within content have alt text"
- "Links and attachments accessible via keyboard"
  perf_targets:
- "LCP ≤ 2s"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given announcement slug, when page loads, then title and content display correctly
- Given user clicks attachment link, when click, then download starts within 2s
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
