---
id: spec-readme
status: draft
---

# Specification Overview

This specification serves as the **source of truth** for Claude Code when implementing the website. It organizes all requirements, guidelines, and page data in Markdown files so they can be parsed deterministically and updated collaboratively.

The spec is not a pixel-perfect design doc. Instead, it defines:

- **Project intent** (goals, scope, success metrics)
- **Tokens, components, and UI/UX guidelines** (what’s reusable, how to use them)
- **Content and page data** (structure, copy, assets)
- **Development and delivery rules** (performance, accessibility, hosting)
- **SEO and metadata** (keywords, schema, robots)

## Navigation Hierarchy

The spec is organized to show dependencies. If a higher-level doc changes, dependent docs may require re-evaluation.

1. **Project (`project.md`)**  
   Defines goals, scope, audience, and constraints.  
   → Changes here may ripple down to: `brand-tokens.md`, `ui-ux-guidelines.md`, `content guidelines`, and page specs.

2. **Design Foundation**
   - `brand-tokens.md` (colors, type, spacing)
   - `ui-ux-guidelines.md` (voice, tone, interaction patterns, accessibility)
   - `components.md` (inventory, usage rules)  
     → If project identity or brand strategy shifts, revisit these.

3. **Content & Structure**
   - `sitemap.md` (information architecture)
   - `/pages/*.md` (page-level structure + copy + assets)  
     → If sitemap changes, all page docs under `/pages` must be checked.

4. **Cross-Cutting Concerns**
   - `seo.md` (keywords, schema, robots)
   - `development-guidelines.md` (performance, accessibility, i18n, analytics, coding rules)  
     → Changes in these apply across all pages.

5. **Delivery**
   - `delivery.md` (hosting, build commands, cache/CDN, headers)
   - `security.md` (if required, deeper security rules)  
     → Adjust if infra/stack choices change.

## Status Lifecycle

- `draft` → `review` → `approved`
- Use `x.codegen` field for agent-specific implementation notes.

## Authoring Checklist

- [ ] Project goals & constraints defined
- [ ] Brand tokens & UI/UX guidelines approved
- [ ] Sitemap finalized
- [ ] Top pages filled out (Home, Pricing, Contact)
- [ ] SEO strategy drafted
- [ ] Development & delivery guidelines approved
- [ ] Security reviewed (if applicable)
