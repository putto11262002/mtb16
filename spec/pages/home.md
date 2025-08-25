route: "/"
page_name: "Home"

# 1) Purpose & Audience

purpose: acquisition
primary_audience: "General Public"
top_user_tasks:

- "Understand MBT 16's role and mission"
- "Navigate to news or announcements"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 provides up-to-date news, official announcements, and resources"
- "Engage with community and unit information"
  proof_points:
- "Dynamic feed of latest news and announcements from cms.News and cms.Announcement collections"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Learn more about the unit"
  target: "/about-us"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Recruitment application forms or e-commerce options"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Primary CTA visible above fold on mobile"
- "Key message recognized within 5 seconds"

# 5) Data & Content Inputs

data_needs:

- id: "news_feed"
  type: "cms_collection"
  description: "Latest news articles"
  constraints: {min_count: 3, max_count: 10}
  status: "approved"
  source: "cms.News"
- id: "announcement_feed"
  type: "cms_collection"
  description: "Latest announcements"
  constraints: {min_count: 3, max_count: 10}
  status: "approved"
  source: "cms.Announcement"
- id: "dynamic_copy"
  type: "cms_collection"
  description: "Hero title and subheading"
  constraints: {min_count: 1}
  status: "approved"
  source: "cms.DynamicCopy"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "friendly"
  length: "≤ 10 words"
  status: "approved"
  content: "Welcome to MBT 16 – Your source for news and official updates"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 15 words"
  status: "approved"
  content: "Stay informed with our latest announcements, news stories, and downloadable resources"
  asset_needs:
- id: "hero_image"
  type: "static_asset"
  format: "jpg|webp"
  alt_required: true
  aspect_ratio: "16:9"
  dimensions: "min 1200x675"
  status: "approved"
  description: "Hero banner featuring unit imagery or abstract military-themed gradient"
- id: "unit_logo"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "MBT 16 logo for brand recognition"

# 6) Measurement & SEO

success_signals:
kpis: - "Bounce rate ≤ 50%" - "Time on page ≥ 60s"
telemetry_events: - id: "home_cta_click" props: {target:"/about-us"}
seo_intent:
title: "MBT 16 | Home – Army Unit News & Resources"
description: "MBT 16 official site: news, announcements, leadership info, and downloadable resources."
target_keywords: ["MBT 16", "military news", "announcements"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All interactive elements keyboard accessible"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a mobile user lands on home, when page loads, then primary CTA is visible without scrolling
- Given any user, when viewing hero, then key message text is readable within 5s
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
