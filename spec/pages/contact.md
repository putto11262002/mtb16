route: "/contact"
page_name: "Contact Us"

# 1) Purpose & Audience

purpose: conversion | support
primary_audience: "Local Community, General Public, Non-Army Visitors"
top_user_tasks:

- "Find official contact information for MBT 16"
- "Submit an inquiry or message to the unit"
- "Locate MBT 16 on a map or find directions"

# 2) Core Messages (what this page must convey)

key_messages:

- "MBT 16 is accessible and ready to assist with your inquiries."
- "We value open communication with the public and our partners."
- "Easily reach out to the appropriate channels."
  proof_points:
- "Clearly listed contact methods (phone, email, address)"
- "Functional contact form (if implemented)"
- "Map integration for physical location"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "contact_information"
  details: ["phone_number", "official_email", "physical_address", "mailing_address"]
- type: "social_media_links"
  platforms: ["Facebook", "Twitter", "YouTube"]
- type: "contact_form"
  fields: ["name", "email", "subject", "message"]
  submission_target: "internal_email_system"
- type: "map_embed"
  location: "MBT 16 Headquarters"

exclusions:

- "Personal contact details of individuals"
- "Internal-only communication channels"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can easily find the most appropriate way to contact MBT 16."
- "Users can successfully submit an inquiry through the contact form."
- "Users can locate the physical address of MBT 16 on a map."

# 5) Data & Content Inputs

data_needs:

- id: "contact_details"
  description: "Official phone numbers, email addresses, and physical/mailing addresses for MBT 16."
  copy_blocks:
- id: "page_headline"
  tone: "helpful, professional"
  length: "≤ 5 words"
- id: "form_instructions"
  tone: "clear, concise"
  length: "≤ 30 words"
  asset_needs:
- id: "map_image"
  alt_required: true
  aspect_ratio: "16:9"

# 6) Measurement & SEO

success_signals:
kpis: - "Contact form submission rate ≥ 5%" - "Click-through rate on phone/email links ≥ 10%" - "Map interaction rate ≥ 8%"
telemetry_events: - id: "contact_page_view" props: {} - id: "contact_form_submit" props: {} - id: "phone_number_click" props: {}
seo_intent:
title: "Contact MBT 16 | Official Contact Information & Inquiries"
description: "Get in touch with MBT 16 (มณฑลทหารบกที่ 16). Find our official contact information, submit an inquiry, or locate us on a map."
target_keywords: ["MBT 16 contact", "military contact", "army inquiries", "contact form", "Thai army address"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "Contact form fields have clear labels and error messages."
- "All contact information is readable by screen readers."
- "Map is accessible or has a text alternative."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user fills out the contact form and submits it, when the submission is successful, then a confirmation message is displayed.
- Given the page loads, when contact information is present, then the phone number and email address are clickable.
- Given a user views the map, when they interact with it, then they can zoom and pan.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
