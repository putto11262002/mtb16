route: "/news"
page_name: "News"

# 1) Purpose & Audience

purpose: education
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Browse latest news articles"
- "Filter or search news by tag or keyword"

# 2) Core Messages (what this page must convey)

key_messages:

- "Stay informed about MBT 16 activities and events"
- "News content is up-to-date and curated"
  proof_points:
- "Feed of news articles from cms.News ordered by published date"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Read news article"
  target: "/news/[slug]"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Formal announcement content"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "News articles load within 2 seconds"
- "Users can start filtering or searching within 5 seconds of load"

# 5) Data & Content Inputs

data_needs:

- id: "news_feed"
  type: "cms_collection"
  description: "List of news articles"
  constraints: {min_count: 5, max_count: 20}
  status: "approved"
  source: "cms.News"
- id: "tags"
  type: "cms_collection"
  description: "Available news tags"
  constraints: {min_count: 1}
  status: "approved"
  source: "cms.News.tags"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 6 words"
  status: "approved"
  content: "Latest News"
  asset_needs:
- id: "news_thumbnail"
  type: "dynamic_content"
  format: "jpg|webp"
  alt_required: true
  status: "approved"
  description: "Thumbnail image for each news article from image_url field"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate ≥ 30%"
telemetry_events: - id: "news_select" props: {list:"news"}
seo_intent:
title: "MBT 16 | News"
description: "Get the latest updates and event reports from MBT 16."
target_keywords: ["MBT 16 news", "military events", "unit updates"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All filter and search controls keyboard accessible"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "LCP ≤ 2.5s (desktop)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when load completes, then at least 5 news items display
- Given a keyword search, when search submitted, then list updates within 2 seconds
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
