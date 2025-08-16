route: "/news-activities"
page_name: "News & Activities"

# 1) Purpose & Audience

purpose: education
primary_audience: "All Audiences (Army Personnel, Local Community, General Public)"
top_user_tasks:

- "Find the latest news and announcements from MBT 16"
- "Discover upcoming events and past activities"
- "Filter news/activities by type or tag"

# 2) Core Messages (what this page must convey)

key_messages:

- "Stay informed about MBT 16's dynamic engagement and operations."
- "MBT 16 is actively involved in community and national initiatives."
- "All important updates are centralized and easily accessible here."
  proof_points:
- "Chronological listing of news, activities, events, and announcements"
- "Filtering options for different content types"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "content_feed"
  item_type: "news, activity, event, announcement"
  display_fields: ["title", "date", "summary", "tags"]
  pagination: true
- type: "filtering_options"
  options: ["news", "activities", "events", "announcements"]
- type: "search_bar"
  intent: "Search within news and activities"

exclusions:

- "Sensitive operational details"
- "Personal information of individuals (unless publicly approved)"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly find specific news items using search or filters."
- "Users can easily distinguish between different types of content (news vs. events)."
- "Users can browse through historical news and activities."

# 5) Data & Content Inputs

data_needs:

- id: "unified_feed_items"
  description: "All news, activities, events, and announcements with metadata (title, date, summary, full content link, tags)."
  constraints: {min_count: 10}
  copy_blocks:
- id: "page_title"
  tone: "informative"
  length: "≤ 5 words"
  asset_needs:
- id: "thumbnail_images"
  alt_required: true
  aspect_ratio: "4:3"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 90 seconds" - "Filter/Search usage rate ≥ 20%" - "Click-through rate to individual items ≥ 10%"
telemetry_events: - id: "news_activities_page_view" props: {} - id: "filter_applied" props: {filter_type: "{type}"} - id: "news_item_click" props: {item_id: "{id}"}
seo_intent:
title: "MBT 16 News & Activities | Latest Updates, Events & Announcements"
description: "Stay up-to-date with the latest news, activities, events, and announcements from MBT 16 (มณฑลทหารบกที่ 16)."
target_keywords: ["MBT 16 news", "military activities", "Thai army events", "announcements", "news feed"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All content is readable with screen readers."
- "Filtering and search functionalities are keyboard navigable."
- "Sufficient contrast for text and interactive elements."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "FID ≤ 100ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user applies a filter, when the page reloads, then only content matching the filter is displayed.
- Given a user searches for a keyword, when results are displayed, then relevant items containing the keyword are prioritized.
- Given the page loads, when multiple content items are present, then pagination controls are visible and functional.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
