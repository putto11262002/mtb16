route: "/"
page_name: "Home Page"

# 1) Purpose & Audience

purpose: acquisition
primary_audience: "Non-Army Visitors, Local Community, General Public"
top_user_tasks:

- "Understand MBT 16's role and mission"
- "Find current news and activities"
- "Discover key unit information"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is a vital part of the community, committed to its mission."
- "Stay informed with the latest news, activities, and announcements from MBT 16."
- "Learn about MBT 16's structure, leadership, and community involvement."
  proof_points:
- "Prominent display of recent news/activities"
- "Clear links to 'About Us' and 'News & Activities' pages"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Explore News & Activities"
  target: "/news-activities"
- type: "value_props"
  count: 3
  qualities: ["concise", "impactful", "Thai language"]
- type: "recent_news_feed"
  count: 3
  source: "CMS"
- type: "unit_mission_statement"
  source: "project.md"

exclusions:

- "Sensitive internal operational details"
- "Recruitment application forms (only announcements)"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Primary CTA visible above fold on mobile and desktop."
- "Users can identify the unit's core purpose within 5 seconds."
- "Users can easily navigate to recent news or about sections."

# 5) Data & Content Inputs

data_needs:

- id: "recent_news"
  description: "Latest 3 news/activity items with title, date, and summary."
  constraints: {min_count: 0}
  copy_blocks:
- id: "headline"
  tone: "informative, welcoming"
  length: "≤ 10 words"
- id: "mission_summary"
  tone: "formal, clear"
  length: "≤ 50 words"
  asset_needs:
- id: "hero_image"
  alt_required: true
  aspect_ratio: "16:9"
- id: "unit_logo"
  alt_required: true
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Bounce Rate ≤ 40%" - "Click-through rate on 'Explore News & Activities' CTA ≥ 15%" - "Time on Site ≥ 60 seconds"
telemetry_events: - id: "home_page_view" props: {} - id: "cta_explore_news_click" props: {}
seo_intent:
title: "MBT 16 - Official Website | News, Activities & Unit Information"
description: "Explore the official website of MBT 16 (มณฑลทหารบกที่ 16) for the latest news, activities, unit information, and community engagement."
target_keywords: ["MBT 16", "มณฑลทหารบกที่ 16", "Thai Army", "military news", "unit information", "public relations"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All images have descriptive alt text."
- "Navigation is fully keyboard accessible."
- "Color contrast meets WCAG 2.1 AA standards."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "Total Blocking Time (TBT) ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user lands on the home page, when they scroll, then the primary CTA remains visible or easily accessible.
- Given a user is on the home page, when they click the 'Explore News & Activities' CTA, then they are redirected to the /news-activities page.
- Given the page loads, when the hero image is displayed, then its alt text accurately describes the image content.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
