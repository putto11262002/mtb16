route: "/news/[slug]"
page_name: "News Details"

# 1) Purpose & Audience

purpose: education
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Read full news article"
- "View related media or attachments"

# 2) Core Messages (what this page must convey)

key_messages:

- "This news article provides accurate, current information about MBT 16 activities"
- "All relevant details and media are available"
  proof_points:
- "Title, publish date, author, content, and image_url fields from cms.News"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View related images or attachments"
  target: "image_url"
- type: "value_props"
  count: 1-2
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Announcement or PR feeds"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Full article content loads within 1 second"
- "Images or media load or lazy-load without blocking text"

# 5) Data & Content Inputs

data_needs:

- id: "news_detail"
  type: "cms_collection"
  description: "News record matching slug"
  constraints: {min_count: 1, max_count: 1}
  status: "approved"
  source: "cms.News"
  copy_blocks:
- id: "none"
  type: "static_content"
  asset_needs:
- id: "article_image"
  type: "dynamic_content"
  format: "jpg|webp"
  alt_required: true
  status: "approved"
  description: "Featured image from image_url field"

# 6) Measurement & SEO

success_signals:
kpis: - "Scroll depth ≥ 50%"
telemetry_events: - id: "news_image_view" props: {news_id:"<id>"}
seo_intent:
title: "{news.title} – MBT 16 News"
description: "Read the full MBT 16 news article about {news.tags}."
target_keywords: ["MBT 16 news", "{news.tags}"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Images have descriptive alt text"
- "Links and media player controls keyboard accessible"
  perf_targets:
- "LCP ≤ 2s"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given news slug, when page loads, then title and content render correctly
- Given lazy-load image, when scrolled into view, then image loads within 500ms
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
