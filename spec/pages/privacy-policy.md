route: "/privacy-policy"
page_name: "Privacy Policy"

# 1) Purpose & Audience

purpose: trust
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Understand how MBT 16 collects and uses personal data"
- "Find information on data protection practices"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is committed to protecting your privacy"
- "Data collection and usage practices are transparent and compliant"
  proof_points:
- "Detailed privacy policy text pulled from static asset"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "static_content"
  description: "Full privacy policy text"
  exclusions:
- "Links to recruitment or unrelated services"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Text is readable with clear headings and sections"
- "Users can find specific policy sections via table of contents"

# 5) Data & Content Inputs

data_needs:

- id: "privacy_text"
  type: "static_asset"
  description: "Legal privacy policy document"
  constraints: {min_count: 1}
  status: "approved"
  source: "upload_required"
  copy_blocks:
- id: "none"
  type: "static_content"
  asset_needs:
- id: "none"
  type: "static_content"

# 6) Measurement & SEO

success_signals:
kpis: - "Average time on page ≥ 120s"
telemetry_events: - id: "policy_section_view" props: {section:"<section name>"}
seo_intent:
title: "MBT 16 Privacy Policy"
description: "Learn how MBT 16 collects, uses, and protects personal data."
target_keywords: ["MBT 16 privacy policy", "data protection"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All headings use semantic HTML"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "Text load time ≤ 1s"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning, then table of contents is present
- Given user selects section in TOC, when click, then jumps to section
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
