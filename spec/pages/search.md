route: "/search"
page_name: "Search Results"

# 1) Purpose & Audience

purpose: support
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Search site for relevant content across news, announcements, and documents"
- "Refine results by category or keyword"

# 2) Core Messages (what this page must convey)

key_messages:

- "Search delivers accurate, relevant results across all content types"
- "Results update dynamically as you refine your query"
  proof_points:
- "Combined index from cms.News, cms.Announcement, cms.Document"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "View content"
  target: "result.url"
- type: "value_props"
  count: 2-3
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Empty state without guidance or feedback"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Search input focused and ready for typing on page load"
- "Results list updates within 500ms of query change"

# 5) Data & Content Inputs

data_needs:

- id: "search_results"
  type: "dynamic_content"
  description: "Search index results across content collections"
  constraints: {min_count: 0, max_count: 50}
  status: "approved"
  source: "api.search"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "Search Results"
  asset_needs:
- id: "search_icon"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing search function"

# 6) Measurement & SEO

success_signals:
kpis: - "Result click-through rate ≥ 20%"
telemetry_events: - id: "search_query" props: {query:"<search term>"} - id: "search_result_click" props: {result_type:"news|announcement|document"}
seo_intent:
title: "Search – MBT 16"
description: "Search MBT 16 site for news, announcements, and documents."
target_keywords: ["site search", "MBT 16 search"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Search input and results accessible via keyboard"
- "ARIA live region communicates result count changes"
  perf_targets:
- "Time to first result ≤ 0.5s"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when user lands, then search input is focused
- Given query input, when typed, then results update within 500ms
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
