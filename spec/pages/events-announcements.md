route: "/events-announcements"
page_name: "Events & Announcements"

# 1) Purpose & Audience

purpose: education
primary_audience: "Army Personnel, Local Community, General Public"
top_user_tasks:

- "Find upcoming events and important announcements"
- "Review past events and announcements"
- "Get details for specific events or announcements"

# 2) Core Messages (what this page must convey)

key_messages:

- "Stay informed about all official events and critical announcements from MBT 16."
- "This page provides a focused view of our public engagements and important notices."
  proof_points:
- "Filtered display of content from the unified news feed"
- "Clear event dates and announcement effective dates"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "content_feed"
  item_type: "event, announcement"
  display_fields: ["title", "date", "summary", "location", "tags"]
  pagination: true
- type: "search_bar"
  intent: "Search events and announcements"
- type: "filter_by_type"
  types: ["events", "announcements"]

exclusions:

- "General news or activities not classified as events or announcements"
- "Sensitive internal details"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly distinguish between events and announcements."
- "Users can easily find details for a specific event or announcement."
- "Users can browse upcoming and past entries efficiently."

# 5) Data & Content Inputs

data_needs:

- id: "filtered_feed_items"
  description: "Event and announcement items from the unified feed with relevant metadata."
  constraints: {min_count: 0}
  copy_blocks:
- id: "page_title"
  tone: "informative"
  length: "≤ 5 words"
  asset_needs:
- id: "event_thumbnail"
  alt_required: true
  aspect_ratio: "16:9"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 75 seconds" - "Click-through rate to individual items ≥ 12%"
telemetry_events: - id: "events_announcements_page_view" props: {} - id: "event_announcement_click" props: {item_id: "{id}"}
seo_intent:
title: "MBT 16 Events & Announcements | Upcoming & Past Activities"
description: "Find all official events and important announcements from MBT 16 (มณฑลทหารบกที่ 16). Stay informed about our public engagements."
target_keywords: ["MBT 16 events", "military announcements", "Thai army calendar", "upcoming events"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Event dates and times are clearly presented."
- "All interactive elements are keyboard accessible."
- "Content is structured for screen reader compatibility."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the Events & Announcements page, when they click on an event, then they are navigated to the detailed event page.
- Given the page loads, when there are no events or announcements, then a clear message indicating no content is displayed.
- Given a user searches for a specific event, when results are displayed, then the relevant event is shown.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
