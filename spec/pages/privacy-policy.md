route: "/privacy-policy"
page_name: "Privacy Policy"

# 1) Purpose & Audience

purpose: trust
primary_audience: "All Audiences (Local Community, General Public, Army Personnel)"
top_user_tasks:

- "Understand how personal data is collected and used"
- "Learn about data protection and user rights"
- "Comply with legal and regulatory requirements"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is committed to protecting your privacy and personal data."
- "We are transparent about our data handling practices."
- "Your trust is paramount to us."
  proof_points:
- "Clear, concise language explaining data practices"
- "Sections on data collection, usage, sharing, and user rights"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "legal_text"
  sections: ["Introduction", "Data Collection", "Data Usage", "Data Sharing", "Data Security", "User Rights", "Cookies", "Changes to Policy", "Contact Information"]
  language: "Thai"
- type: "last_updated_date"

exclusions:

- "Jargon or overly complex legal language without clear explanations"
- "Any content that contradicts actual data handling practices"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can easily find and understand the privacy policy."
- "Users feel confident that their data is handled responsibly."
- "Users can locate specific sections of interest within the policy."

# 5) Data & Content Inputs

data_needs:

- id: "privacy_policy_text"
  description: "Comprehensive legal text for the privacy policy, including all required sections."
  copy_blocks:
- id: "page_title"
  tone: "formal, clear"
  length: "≤ 5 words"
  asset_needs:
- id: "none"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 180 seconds" - "Scroll depth ≥ 75%"
telemetry_events: - id: "privacy_policy_page_view" props: {}
seo_intent:
title: "MBT 16 Privacy Policy | Data Protection & User Rights"
description: "Read the official Privacy Policy of MBT 16 (มณฑลทหารบกที่ 16) to understand our data collection, usage, and protection practices."
target_keywords: ["MBT 16 privacy", "privacy policy", "data protection", "user rights", "Thai army data"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Text is highly readable with good contrast and font size."
- "Page content is structured with headings for easy navigation."
- "Printable version available or easily printable from browser."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the Privacy Policy page, when they read the content, then they can identify how their data is used.
- Given the page loads, when the policy is displayed, then it includes a clear "Last Updated" date.
- Given a user navigates the page, when they use headings, then they can jump to relevant sections.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
