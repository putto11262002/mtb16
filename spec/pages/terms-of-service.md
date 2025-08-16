route: "/terms-of-service"
page_name: "Terms of Service"

# 1) Purpose & Audience

purpose: trust
primary_audience: "All Audiences (Local Community, General Public, Army Personnel)"
top_user_tasks:

- "Understand the rules and conditions for using the website"
- "Learn about user responsibilities and limitations"
- "Comply with legal and regulatory requirements"

# 2) Core Messages (what this page must convey)

key_messages:

- "By using this website, you agree to abide by our terms and conditions."
- "These terms are designed to ensure a safe and respectful online environment for all users."
- "We are committed to maintaining fair and clear guidelines for website usage."
  proof_points:
- "Clear, concise language explaining terms of use"
- "Sections on user conduct, intellectual property, disclaimers, and limitations of liability"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "legal_text"
  sections: ["Introduction", "Acceptance of Terms", "User Conduct", "Intellectual Property", "Disclaimers", "Limitation of Liability", "Governing Law", "Changes to Terms", "Contact Information"]
  language: "Thai"
- type: "last_updated_date"

exclusions:

- "Jargon or overly complex legal language without clear explanations"
- "Any content that contradicts actual website usage policies"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can easily find and understand the terms of service."
- "Users are aware of their responsibilities when using the website."
- "Users can locate specific sections of interest within the terms."

# 5) Data & Content Inputs

data_needs:

- id: "terms_of_service_text"
  description: "Comprehensive legal text for the terms of service, including all required sections."
  copy_blocks:
- id: "page_title"
  tone: "formal, clear"
  length: "≤ 5 words"
  asset_needs:
- id: "none"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 180 seconds" - "Scroll depth ≥ 75%"
telemetry_events: - id: "terms_of_service_page_view" props: {}
seo_intent:
title: "MBT 16 Terms of Service | Website Usage Guidelines"
description: "Review the official Terms of Service for the MBT 16 (มณฑลทหารบกที่ 16) website. Understand the rules and conditions for using our online platform."
target_keywords: ["MBT 16 terms", "terms of service", "website guidelines", "user agreement", "Thai army website rules"]

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

- Given a user is on the Terms of Service page, when they read the content, then they can identify their responsibilities.
- Given the page loads, when the terms are displayed, then it includes a clear "Last Updated" date.
- Given a user navigates the page, when they use headings, then they can jump to relevant sections.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
