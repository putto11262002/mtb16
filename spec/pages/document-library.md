route: "/document-library"
page_name: "Document Library"

# 1) Purpose & Audience

purpose: support
primary_audience: "Army Personnel"
top_user_tasks:

- "Find and download official documents and resources"
- "Browse documents by category or search for specific files"
- "Access important forms and guidelines"

# 2) Core Messages (what this page must convey)

key_messages:

- "Centralized access to all essential documents for Army personnel."
- "Efficiently locate and download the resources you need."
- "Stay updated with the latest official publications."
  proof_points:
- "Categorized document listings"
- "Search functionality for documents"
- "Clear download links"

# 3) Must-Include Content (content contract, not UI)

must_include:

- type: "document_list"
  display_fields: ["title", "date_published", "category", "file_type", "download_link"]
  pagination: true
- type: "category_filter"
  categories: ["Forms", "Guidelines", "Reports", "Policies"]
- type: "search_bar"
  intent: "Search documents"

exclusions:

- "Classified or restricted documents"
- "Outdated versions of documents"

# 4) UX Outcomes (observable behaviors)

ux_outcomes:

- "Users can quickly find and download a specific document."
- "Users can easily navigate through different document categories."
- "Users are confident they are accessing the most current version of a document."

# 5) Data & Content Inputs

data_needs:

- id: "documents"
  description: "List of documents with title, publication date, category, file type, and a direct download URL."
  constraints: {min_count: 10}
  copy_blocks:
- id: "page_title"
  tone: "informative, official"
  length: "≤ 5 words"
  asset_needs:
- id: "file_type_icons"
  alt_required: false
  aspect_ratio: "1:1"

# 6) Measurement & SEO

success_signals:
kpis: - "Document download rate ≥ 15%" - "Search/filter usage rate ≥ 25%" - "Bounce rate ≤ 30%"
telemetry_events: - id: "document_library_page_view" props: {} - id: "document_download" props: {document_id: "{id}"} - id: "document_filter_applied" props: {category: "{category}"}
seo_intent:
title: "MBT 16 Document Library | Official Forms, Guidelines & Resources"
description: "Access the official document library of MBT 16 (มณฑลทหารบกที่ 16) for essential forms, guidelines, reports, and policies for Army personnel."
target_keywords: ["MBT 16 documents", "military forms", "army guidelines", "official resources", "document download"]

# 7) Accessibility & Performance Guardrails

a11y_requirements:

- "All document titles are clear and descriptive."
- "Download links are clearly identifiable and accessible."
- "Page content is structured for easy navigation by screen readers."
  perf_targets:
- "LCP ≤ 2.5s (mobile)"
- "CLS < 0.1"
- "TBT ≤ 200ms"

# 8) Acceptance Criteria (testable outcomes)

acceptance_criteria:

- Given a user is on the Document Library page, when they click a download link, then the corresponding document begins to download.
- Given a user applies a category filter, when the page updates, then only documents belonging to that category are displayed.
- Given the page loads, when documents are listed, then each document entry includes its title, publication date, and file type.
  review_checklist:
- "[ ] Messages align with project.md goals"
- "[ ] Route matches sitemap.md exactly"
- "[ ] All must-include items specified"
