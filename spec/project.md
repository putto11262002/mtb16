---
id: project
status: approved
---

# Project Overview

## Identity

- **Company / Project Name:** MBT 16 (มณฑลทหารบกที่ 16)
- **One-liner:** A platform for public relations for the army unit.
- **Description:** The website will provide information about the unit, news reports (including past events), formal announcements, and downloadable resources.

## Goals

1. Enhance Public Image
2. Improve Internal Communication
3. Increase Engagement
4. Facilitate Information Dissemination

- **Non-Goals:** No e-commerce/online transactions, no sensitive data handling, no interactive forums/social media features, no recruitment applications, no internal operational systems integration.

## Audience

- **Personas:** Army Personnel, Local Community, General Public.
- **Top Journeys / Tasks:**
  - **Non-Army Visitors:** Find information about the unit and the general Thai army, see recruitment announcements.
  - **Army Personnel:** View news, announcements, and download resources.

## Requirements & Idea

- **Core Requirements:**
  - Distinct Feeds for Formal Announcements and News/PR (both with tagging)
  - Unit Information Pages (About, Leadership Profiles)
  - Internal Sub-Units & Departments Directory
  - External Network/Partnerships Directory
  - Centralized Document Library
  - Contact & Connect Section (Contact page, centralized contact info/social links)
  - Search Functionality
  - Responsive Design
  - Content Management System (CMS)
- **Project Idea / Vision:** To modernize and rebuild the existing, outdated website to better serve its public relations and information dissemination goals.
- **Note:** The primary language used in the website is Thai.

## Scope

- **Pages in Scope:** Homepage, Announcements Feed Page, Individual Announcement Pages, News Feed Page, Individual News Pages, About the Unit Page, Unit Commanders & Leadership Page, Internal Sub-Units & Departments Directory Page, Individual Sub-Unit Pages, External Network/Partnerships Directory Page, Document Library Page, Contact Page, Search Results Page.
- **Features / Integrations:** (Implicitly covered by Core Requirements and CMS choice)

## Constraints

- **Technical:**
  - **Framework/Technologies:** Astro, Tailwind CSS, Shadcn UI, TypeScript, Bun.
  - **Hosting:** Emphasis on cheap hosting, leveraging static site generation (SSG) for most content.
  - **Dynamic Content Handling:** For content that isn't static but not actively updated (e.g., news archives), consider server-side rendering (SSR) or incremental static regeneration (ISR) triggered by updates, with aggressive caching.
  - **CMS/Backend:** PocketBase (using SQLite as its database).
- **Time / Budget:** Not specified, aiming for cost-effective hosting.

## Success Metrics

- **Business:** Engagement (Unique Visitors, Page Views, Time on Site, Bounce Rate, Returning Visitors) and Content Consumption (Top Viewed Pages/Content, Download Metrics).
- **Performance:** LCP < 2.5s, FID < 100ms, CLS < 0.1.
- **Tracking Tool:** Google Analytics.

## Risks & Mitigations

- **Risks:** Content Migration Challenges, Stakeholder Alignment/Content Approval Delays, Technical Debt from Old Site, Security Vulnerabilities.
- **Mitigations:** Phased content migration, clear communication/deadlines, thorough audit of existing site, implement security best practices.
