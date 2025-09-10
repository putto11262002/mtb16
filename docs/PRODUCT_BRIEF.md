---
title: Product Brief — 16th Military Circle Public Website (v1)
version: 1.0
---
# Product Brief — 16th Military Circle Public Website (v1)

## 1) Overview & Mission

**Unit:** มณฑลทหารบกที่ 16 (มทบ. 16) / 16th Military Circle **Website primary
language:** Thai (this brief is in English)

**Mission (v1):** Build the official **public information hub** for the 16th
Military Circle—authoritative, timely, and easy to navigate—covering
**Announcements**, **News & Events**, **About & Commanders**, **Network
Directory**, **Procurement (current listings + archive)**, and **Contact**, with
an **image-based homepage alert popup** when needed.

**Objectives (v1):**

* Provide **accurate, timely, readable** official information to the public
  (Thai UI/content).
* Publish **Procurement** as **current listings (open)** and **archive
  (closed)** with attached official files; include **Annual Procurement Plan
  (แผนการจัดซื้อจัดจ้าง)**, **Invitation/Announcement
  (ประกาศเชิญชวน/สอบราคา/e-bidding)**, and **Price Disclosure (เปิดเผยราคากลาง)**.
* Centralize **Contact** details and a **Network Directory** (sub-units,
  partners, parent unit, Army).
* Measure success with **Public Reach ≥ 3,000 MUV by Month 3** and **open
  rates** for **News (≥30%)** and **Announcements (≥35%)**.

## 2) Audiences, Language & Access (task-focused)

**Public (primary)** — must be able to:

* Read official information/updates with clear provenance.
* Skim recent activities and outcomes from the unit.
* Understand the unit’s purpose and leadership structure.
* Find appropriate contact channels (visit, call, online).
* Review purchasing information (current opportunities and past records).
* See urgent notices when applicable.

**Partners / Contractors / NGOs** — must be able to:

* Discover opportunities and associated public documentation.
* Verify timelines and public terms from authoritative sources.
* Locate the correct point of contact for coordination.

**Prospective recruits / students** — must be able to:

* Understand pathways and basic requirements at a high level.
* Navigate onward to official recruitment channels.

**Internal unit members (read-only)** — must be able to:

* Consume the same public information as civilians (no additional access).
* Rely on the site as the single public source of truth.

**Administrative users (CMS Admins)** — must be able to:

* Create, update, and remove public content.
* Control visibility via a **single `published` flag** and manage homepage
  alerts.
* 

## 3) v1 Feature Scope

**Announcements**

* Purpose: Publish authoritative notices; public can scan a list and open
  details; admins create/update, attach official files, publish/unpublish.
* Out of scope: scheduling, multi-role approvals, categories.

**News & Events**

* Purpose: Share activities and outcomes; public can browse and read details;
  admins create/update, publish/unpublish.
* Out of scope: registration, calendars, tagging.

**About & Commanders**

* Purpose: Explain mission/roles and show leadership hierarchy.
* Commanders display: **headshot + name + rank + role**.
* Out of scope: deep org charts, long biographies.

**Network Directory**

* Purpose: Discover **sub-units**, **partners/NGOs/contractors**, **parent
  unit**, and **Army** references; public finds names and outbound links/contact
  references.
* Out of scope: advanced filtering, partner profile pages.

**Procurement (current + archive)**

* Purpose: Transparency for purchasing.
* Public: view **current listings (open)** and **archived (closed)** items; open
  attached official documents.
* Included document types (v1): **Annual Procurement Plan (แผนการจัดซื้อจัดจ้าง)**,
  **Invitation/Announcement (ประกาศเชิญชวน/สอบราคา/e-bidding)**, **Price
  Disclosure (เปิดเผยราคากลาง)**.
* Admins: upload official files; set **status = open/closed**;
  publish/unpublish.
* Compliance: formal disclaimer shown on list & detail.
* Out of scope: participant lists, awards/contracts workflow, CSV exports.

**Contact**

* Purpose: Provide official channels and location info; admins keep details up
  to date.
* Out of scope: chat/inbox, ticketing.

**Homepage Alert Popup (image-only)**

* Behavior: **single image + alt text**, optional outbound link, **once per
  visitor per 24h**, manual on/off.
* Out of scope: severity levels, scheduling, multiple queued alerts.

## 4) Success Metrics

* **Public Reach:** ≥ **3,000** monthly unique visitors by **Month 3** after
  launch.
* **Engagement:**

  * **News open rate:** ≥ **30%** (list → article detail)
  * **Announcements open rate:** ≥ **35%** (list → announcement detail)
* **Measurement:** Tracked via site analytics; “Month 3” = third full calendar
  month post-launch.

## 5) Risks, Assumptions & Disclaimer

**Key Risks**

* Single-role publishing can push errors live → use preview + `published`
  checklist.
* Content freshness risk with a small team → assign owners; monthly checks.
* Procurement compliance (personal data, mismatches) → redact where required;
  restrict file types; show disclaimer.
* Popup fatigue → “critical/important only”; once-per-24h suppression.

**Assumptions**

* Thai UI/content; this brief in English with Thai official labels.
* Public-only access; internal users consume the same public content.
* Admin-only CMS; visibility via `published`; no scheduling/approvals.
* Procurement shows **dates + status (open/closed)** and attached official
  files.
