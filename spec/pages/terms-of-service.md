route: "/terms-of-service"
page_name: "Terms of Service"

# 1) Purpose & Audience

purpose: trust
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Review terms, conditions, and legal agreements"
- "Find specific clauses or contact legal queries"

# 2) Core Messages (what this page must convey)

key_messages:

- "Use of this site and its content is governed by these terms"
- "Users must agree to abide by the stated conditions"
  proof_points:
- "Full terms text pulled from static asset"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "static_content"
  description: "Complete terms of service text"
  exclusions:
- "Embedded sign-up forms or transaction flows"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Text is organized with clear headings and sections"
- "Users can navigate to clauses via linkable headings"

# 5) Data & Content Inputs

data_needs:

- id: "terms_text"
  type: "static_asset"
  description: "Legal terms of service document"
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
kpis: - "Average time on page ≥ 90s"
telemetry_events: - id: "tos_section_view" props: {section:"<section name>"}
seo_intent:
title: "MBT 16 Terms of Service"
description: "Read the terms and conditions for using the MBT 16 site."
target_keywords: ["MBT 16 terms of service", "legal terms"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All headings use semantic HTML"
- "Contrast ≥ 4.5:1 for text"
  perf_targets:
- "Text load time ≤ 1s"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page load, when scanning, then table of contents of key clauses present
- Given user clicks clause link, when click, then scrolls to that clause
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
