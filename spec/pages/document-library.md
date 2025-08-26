route: "/document-library"
page_name: "Document Library"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel & General Public"
top_user_tasks:

- "Browse and download documents"
- "Search or filter documents by category"

# 2) Core Messages (what this page must convey)

key_messages:

- "Central repository for essential MBT 16 documents"
- "Documents are official, up-to-date, and categorized"
  proof_points:
- "Collection of documents with metadata (title, description, file type, published date) from cms.Document"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "primary_cta"
  intent: "Download document"
  target: "file_url"
- type: "value_props"
  count: 3-5
  qualities: ["tangible", "non-jargon"]
  exclusions:
- "News or announcements content"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "At least 5 documents load within 2 seconds of page render"
- "Filter controls visible and usable above the fold"

# 5) Data & Content Inputs

data_needs:

- id: "documents"
  type: "cms_collection"
  description: "List of downloadable documents"
  constraints: {min_count: 5}
  status: "approved"
  source: "cms.Document"
  copy_blocks:
- id: "headline"
  type: "generated_content"
  tone: "informative"
  length: "≤ 5 words"
  status: "approved"
  content: "Document Library"
- id: "subhead"
  type: "generated_content"
  tone: "benefit-led"
  length: "≤ 10 words"
  status: "approved"
  content: "Access official MBT 16 resources and forms"
  asset_needs:
- id: "document_icon"
  type: "static_asset"
  format: "svg"
  alt_required: true
  status: "approved"
  description: "Icon representing documents or files"

# 6) Measurement & SEO

success_signals:
kpis: - "Download click rate ≥ 20%"
telemetry_events: - id: "document_download" props: {document_id:"<document id>"}
seo_intent:
title: "MBT 16 | Document Library"
description: "Download official MBT 16 documents, forms, and resources."
target_keywords: ["MBT 16 documents", "download resources", "unit forms"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All download links keyboard accessible"
- "Contrast ≥ 4.5:1 for text and icons"
  perf_targets:
- "LCP ≤ 2.5s (desktop)"
- "CLS < 0.1"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given page loads, when document list renders, then at least 5 items are visible
- Given a user clicks download, when click occurs, then document file download initiates
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
