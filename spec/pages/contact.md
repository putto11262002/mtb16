route: "/contact"
page_name: "Contact"

# 1) Purpose & Audience

purpose: conversion
primary_audience: "General Public & Army Personnel"
top_user_tasks:

- "Submit inquiries via contact form"
- "Find centralized contact info and social links"

# 2) Core Messages (what this page must convey)

key_messages:

- "Reach out to MBT 16 leadership or support team easily"
- "All inquiries are valued and will be addressed promptly"
  proof_points:
- "Contact form powered by dynamic backend endpoint"
- "Listing of email, phone, and social media links"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Submit inquiry"
  target: "/contact/form"
- type: "value_props"
  count: 2-3
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "Job application forms or unrelated feedback portals"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Form submission confirmation visible within 5 seconds of submit"
- "Contact info and social links are visible without scrolling"

# 5) Data & Content Inputs

data_needs:

- id: "contact_methods"
  type: "static_asset"
  description: "Email, phone, and social media details"
  constraints: {min_count: 1}
  status: "approved"
  source: "upload_required"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "friendly"
  length: "≤ 5 words"
  status: "approved"
  content: "Get in Touch"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "We’re here to help with your inquiries"
  asset_needs:
- id: "contact_icon"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing communication or forms"

# 6) Measurement & SEO

success_signals:
kpis: - "Form submission rate ≥ 10%"
telemetry_events: - id: "contact_submit" props: {form_id:"contact_form"}
seo_intent:
title: "Contact MBT 16 – Submit Inquiry"
description: "Contact form, email, phone, and social links to reach MBT 16."
target_keywords: ["contact MBT 16", "army unit contact", "inquiries"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Form fields and buttons are keyboard accessible"
- "Error and success messages readable by screen readers"
  perf_targets:
- "LCP ≤ 2.5s (desktop)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given form submission, when submit, then confirmation message appears within 5s
- Given page load, when scanning, then contact methods visible above fold
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
