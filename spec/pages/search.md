route: "/search"
page_name: "Search Results"

# 1) Purpose & Audience

purpose: support
primary_audience: "All Audiences (Army Personnel, Local Community, General Public)"
top_user_tasks:

- "Find specific information within the website"
- "Locate relevant content based on keywords"
- "Filter and sort search results for better relevance"

# 2) Core Messages (what this page must convey)

key_messages:

- "Easily find any information you need across the MBT 16 website."
- "Our comprehensive search helps you quickly pinpoint relevant content."
- "Get precise results to your queries."
  proof_points:
- "Display of search query and number of results"
- "Categorization or filtering of results"
- "Snippet of content with keyword highlighting"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "search_input_field"
  intent: "Refine search query"
  prefilled_with_query: true
- type: "search_results_list"
  display_fields: ["title", "url", "snippet", "type"]
  pagination: true
- type: "no_results_message"
  content: "No results found for your query. Please try a different search term."

exclusions:

- "Sensitive internal data not meant for public search"
- "Irrelevant external search results"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly understand the relevance of each search result."
- "Users can easily navigate to the source page of a search result."
- "Users can refine their search or try new queries if initial results are unsatisfactory."

# 5) Data & Content Inputs

data_needs:

- id: "search_results"
  description: "List of search results including title, URL, a relevant content snippet, and content type (e.g., news, document, page)."
  constraints: {min_count: 0}
  copy_blocks:
- id: "page_title"
  tone: "informative"
  length: "≤ 5 words"
  asset_needs:
- id: "search_icon"
  alt_required: true
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate on search results ≥ 20%" - "Search refinement rate ≤ 15% (indicating good initial results)"
telemetry_events: - id: "search_results_page_view" props: {query: "{query}"} - id: "search_result_click" props: {result_id: "{id}"} - id: "search_refined" props: {new_query: "{query}"}
seo_intent:
title: "Search Results | MBT 16 Official Website"
description: "View search results for your query on the official MBT 16 (มณฑลทหารบกที่ 16) website. Find news, documents, and unit information."
target_keywords: ["MBT 16 search", "military website search", "army information find"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Search results are clearly structured and navigable."
- "Keyboard navigation is fully supported for results and pagination."
- "Sufficient contrast for text and interactive elements."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user performs a search, when results are displayed, then the search query is visible and editable.
- Given the page loads with search results, when a result is clicked, then the user is navigated to the corresponding page.
- Given a search yields no results, when the page loads, then a clear 'no results' message is displayed.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
