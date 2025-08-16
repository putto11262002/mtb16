route: "/directory/external"
page_name: "External Network & Partnerships"

# 1) Purpose & Audience

purpose: trust | support
primary_audience: "Local Community, General Public"
top_user_tasks:

- "Identify official partners and collaborators of MBT 16"
- "Understand the scope of MBT 16's external engagements"
- "Find contact information for external organizations working with MBT 16"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 actively collaborates with a network of trusted external partners."
- "Our partnerships strengthen our mission and extend our reach within the community."
- "Transparency in our external relationships builds public trust."
  proof_points:
- "List of partner organizations with brief descriptions"
- "Links to partner websites (if applicable)"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "partner_list"
  display_fields: ["name", "description", "contact_info", "website_link"]
  min_count: 3
- type: "search_bar"
  intent: "Search external partners"
- type: "brief_overview"
  content: "This section details the external organizations and partnerships that collaborate with MBT 16 to achieve our shared goals."

exclusions:

- "Private or sensitive partnership agreements"
- "Individual contact information for external personnel"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can easily identify key external partners of MBT 16."
- "Users understand the nature of the partnerships."
- "Users can navigate to partner websites if provided."

# 5) Data & Content Inputs

data_needs:

- id: "external_partners"
  description: "List of external organizations with name, brief description of partnership, contact information, and optional website URL."
  constraints: {min_count: 3}
  copy_blocks:
- id: "page_headline"
  tone: "informative, collaborative"
  length: "≤ 7 words"
  asset_needs:
- id: "partner_logos"
  alt_required: true
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Click-through rate to partner websites ≥ 5%" - "Search usage rate ≥ 10%"
telemetry_events: - id: "external_directory_page_view" props: {} - id: "partner_website_click" props: {partner_id: "{id}"}
seo_intent:
title: "MBT 16 External Partnerships | Collaborators & Network"
description: "Explore the external network and partnerships of MBT 16 (มณฑลทหารบกที่ 16). Discover our collaborators and their contributions."
target_keywords: ["MBT 16 partners", "military collaborations", "external network", "Thai army partnerships"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Partner names and descriptions are clearly readable."
- "Links to external websites are clearly indicated."
- "Page is navigable by keyboard."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the external directory page, when they click on a partner's link, then they are navigated to the partner's website (if provided).
- Given the page loads, when partner listings are present, then each listing includes a name and a brief description of the partnership.
- Given a user searches for a partner, when results are displayed, then relevant partner entries are shown.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
