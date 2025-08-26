# Data Model

## Domain Overview

business_domain: "Public-facing website content management for a military unit"
primary_workflows:

- "Content publishing and updates for formal announcements and news/PR"
- "Directory listing management (internal and external)"
- "Document library organization and access"
- "Management of small, dynamic text snippets for UI"

## Core Entities

### Announcement

description: "Represents formal, crucial communications for the public or unit members."
purpose: "To disseminate official notices, policy updates, or critical information."
lifecycle: "create → update → archive"

fields:

- name: "id"
  type: "uuid"
  required: true
  unique: true
- name: "title"
  type: "string"
  required: true
  constraints:
  max_length: 500
  description: "The title of the announcement."
- name: "content"
  type: "text"
  required: true
  description: "The full body content of the announcement."
- name: "published_at"
  type: "datetime"
  required: true
  description: "The date and time the announcement was published."
- name: "author"
  type: "string"
  required: false
  constraints:
  max_length: 255
  description: "The author or responsible party for the announcement (e.g., 'Headquarters', 'Commander\'s Office')."
- name: "tags"
  type: "json"
  required: false
  description: "Keywords or categories for the announcement (e.g., 'policy', 'safety', 'recruitment')."
- name: "attachments"
  type: "json"
  required: false
  description: "An array of objects, each representing an attached file with its URL and optional metadata (e.g., [{'url': '...', 'title': '...'}])."

access_patterns:

- query: "Retrieve latest announcements, ordered by published_at"
  frequency: "high"
  performance_notes: "Index on 'published_at'."
- query: "Retrieve announcements by tag"
  frequency: "medium"
  performance_notes: "Index on 'tags' if possible, or full-text search."

### News

description: "Represents public relations content, including reports on past events/work."
purpose: "To showcase unit activities, achievements, and general updates for public consumption."
lifecycle: "create → update → archive"

fields:

- name: "id"
  type: "uuid"
  required: true
  unique: true
- name: "title"
  type: "string"
  required: true
  constraints:
  max_length: 500
  description: "The title of the news article."
- name: "summary"
  type: "text"
  required: false
  description: "A brief summary or excerpt of the news article, useful for listings."
- name: "content"
  type: "text"
  required: true
  description: "The full body content of the news article."
- name: "published_at"
  type: "datetime"
  required: true
  description: "The date and time the news article was published or the event/work occurred."
- name: "author"
  type: "string"
  required: false
  constraints:
  max_length: 255
  description: "The author of the news article."
- name: "image_url"
  type: "string"
  required: false
  constraints:
  max_length: 1000
  format: "url"
  description: "URL to a featured image for the news article, if applicable."
- name: "tags"
  type: "json"
  required: false
  description: "Keywords or categories for the news article (e.g., 'community service', 'training', 'awards')."
- name: "location"
  type: "string"
  required: false
  constraints:
  max_length: 500
  description: "Location where the event/work described in the news article took place, if applicable."
- name: "attachments"
  type: "json"
  required: false
  description: "An array of objects, each representing an attached file with its URL and optional metadata (e.g., [{'url': '...', 'title': '...'}])."

access_patterns:

- query: "Retrieve latest news articles, ordered by published_at"
  frequency: "high"
  performance_notes: "Index on 'published_at'."
- query: "Retrieve news articles by tag"
  frequency: "medium"
  performance_notes: "Index on 'tags' if possible, or full-text search."
- query: "Search news articles by title, summary, or content"
  frequency: "medium"
  performance_notes: "Full-text search index on 'title', 'summary', and 'content'."

### DynamicCopy

description: "Represents a small, dynamic piece of text content used across the website."
purpose: "To store and manage dynamic text snippets like hero titles, call-to-action buttons, or other short, frequently updated copy."
lifecycle: "create → update"

fields:

- name: "id"
  type: "uuid"
  required: true
  unique: true
- name: "key"
  type: "string"
  required: true
  unique: true
  constraints:
  max_length: 255
  description: "Unique identifier for the copy (e.g., 'home_hero_title', 'contact_cta_button_text')."
- name: "value"
  type: "text"
  required: true
  description: "The actual text content."
- name: "description"
  type: "text"
  required: false
  description: "A brief description of where and how this copy is used."

access_patterns:

- query: "Retrieve copy by key"
  frequency: "high"
  performance_notes: "Index on 'key' for fast lookups."

### DirectoryEntry

description: "Represents an entry in either the internal or external directory."
purpose: "To store contact and descriptive information for individuals, organizations, or departments."
lifecycle: "create → update → archive"

fields:

- name: "id"
  type: "uuid"
  required: true
  unique: true
- name: "type"
  type: "string"
  required: true
  allowed_values: ["internal", "external"]
  description: "Specifies if the entry is for an internal entity (e.g., staff) or external (e.g., partner)."
- name: "name"
  type: "string"
  required: true
  constraints:
  max_length: 500
  description: "The name of the individual, organization, or department."
- name: "description"
  type: "text"
  required: false
  description: "A brief description or bio for the entry."
- name: "contact_email"
  type: "string"
  required: false
  constraints:
  max_length: 255
  format: "email"
  description: "Email address for contact."
- name: "contact_phone"
  type: "string"
  required: false
  constraints:
  max_length: 50
  description: "Phone number for contact."
- name: "website_url"
  type: "string"
  required: false
  constraints:
  max_length: 500
  format: "url"
  description: "URL to an associated website."
- name: "address"
  type: "text"
  required: false
  description: "Physical address for the entry."
- name: "category"
  type: "string"
  required: false
  constraints:
  max_length: 255
  description: "Optional category for directory entries (e.g., 'Leadership', 'Departments', 'Vendors')."

access_patterns:

- query: "Retrieve directory entries by type and/or category"
  frequency: "medium"
  performance_notes: "Index on 'type' and 'category'."
- query: "Search directory entries by name or description"
  frequency: "medium"
  performance_notes: "Full-text search index on 'name' and 'description'."

### Document

description: "Represents a document available in the document library."
purpose: "To store metadata about files that can be downloaded or viewed."
lifecycle: "create → update → archive"

fields:

- name: "id"
  type: "uuid"
  required: true
  unique: true
- name: "title"
  type: "string"
  required: true
  constraints:
  max_length: 500
  description: "The title of the document."
- name: "description"
  type: "text"
  required: false
  description: "A brief description of the document's content."
- name: "file_url"
  type: "string"
  required: true
  constraints:
  max_length: 1000
  format: "url"
  description: "The URL or path to the document file."
- name: "file_type"
  type: "string"
  required: false
  constraints:
  max_length: 50
  description: "The type of file (e.g., 'pdf', 'docx', 'xlsx')."
- name: "category"
  type: "string"
  required: false
  constraints:
  max_length: 255
  description: "Category for organizing documents (e.g., 'Reports', 'Forms', 'Policies')."
- name: "published_date"
  type: "date"
  required: false
  description: "The date the document was published or made available."

access_patterns:

- query: "Retrieve documents by category"
  frequency: "medium"
  performance_notes: "Index on 'category'."
- query: "Search documents by title or description"
  frequency: "medium"
  performance_notes: "Full-text search index on 'title' and 'description'."

## Relationships

# (No explicit relationships between core entities at this time)
