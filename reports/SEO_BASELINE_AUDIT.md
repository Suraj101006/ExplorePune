# EXPLORE PUNE — SEO BASELINE AUDIT

**Target System:** Explore Pune ([https://explorepune-guide.vercel.app/](https://explorepune-guide.vercel.app/))  
**Audit Date:** November 14, 2026  
**Auditor:** Senior Technical SEO Architect & Web Quality Engineering Lead  
**Architecture:** Next.js 16.4.2 (App Router, Turbopack) · React 19 · Node.js v24.20.0 · Vercel Edge CDN  

---

## 1. Executive Summary

A comprehensive baseline technical and on-page SEO audit was conducted across the Explore Pune platform to evaluate crawlability, indexation readiness, semantic markup, canonical structure, metadata accuracy, and search engine discoverability.

Explore Pune possesses a modern technical SEO foundation:
- **Prerendered SSG/ISR Routes:** 141 fully prerendered static pages, eliminating client-side hydration delays for crawlers.
- **Canonical Structure:** Strictly enforced canonical URLs across all pages matching Google Search Central canonicalization guidelines.
- **AI Crawler Readiness:** Advanced `robots.ts` configuration providing explicit allowances for traditional search engines (Googlebot, Bingbot) and generative AI retrieval engines (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended).
- **Instant Search Notification:** Custom `/api/v1/indexnow` integration communicating URL state changes directly to Bing and IndexNow-compatible crawlers.

---

## 2. Technical Architecture & Indexability Matrix

| Component | Current Implementation | Status | Technical Verification |
|---|---|---|---|
| **Framework & Engine** | Next.js 16.4.2 (App Router with Turbopack) | **Optimal** | Static HTML generated at build time (`141/141 pages pre-rendered`) |
| **Robots Directives** | `app/robots.ts` dynamic handler | **Optimal** | Verified allowing `/`, `/destinations`, `/llms.txt`, disallowed `/admin/`, `/api/` |
| **XML Sitemaps** | `app/sitemap.ts` dynamic sitemap | **Optimal** | Covers 106 destinations, 8 category hubs, core static routes, blogs |
| **Canonical Tags** | Explicit `metadata.alternates.canonical` on all routes | **Optimal** | Zero conflicting cross-domain canonicals |
| **IndexNow Protocol** | `/api/v1/indexnow/route.ts` with key verification | **Optimal** | `404a71b2d7fc4f2b9b7342813589b21e.txt` served from `/` root |
| **Language Tags** | `en-IN`, `mr-IN`, and `x-default` alternate hreflang | **Optimal** | Proper multilingual signals for Maharashtra regional queries |
| **Geo Meta Tags** | `geo.region: IN-MH`, `geo.position: 18.5204;73.8567` | **Optimal** | Injected in `<head>` via Next.js metadata `other` property |

---

## 3. On-Page Metadata & Entity Structure

### 3.1. Title & Meta Description Audit
- **Default Title:** `Explore Pune | Historic Forts, Wadas & Trip Planner`
- **Title Template:** `%s | Explore Pune` (guarantees unique, branded titles across all 106 destination detail pages)
- **Description:** Character count maintained between 140–160 characters across all destination hubs with primary keywords (`Sinhagad Fort`, `Shaniwar Wada`, `visiting hours`, `ticket fees`, `trekking trails`).

### 3.2. Social & Rich Previews (OpenGraph & Twitter Cards)
- **OpenGraph:** `og:type = website`, `og:locale = en_IN`, explicit `og:image` (1200x630px hero banner + 1024x1024px insignia logo).
- **Twitter Card:** `summary_large_image` configured across all major landing pages and destination pages.
- **Google Search Favicons:** Verified SVG, multi-resolution PNGs (48x48, 96x96, 192x192, 512x512) and Apple Touch Icons according to Google Search Central guidelines.

---

## 4. Crawl Budget & Rendering Analysis

1. **JavaScript Dependency for Crawlers:** Zero. All critical text, headings, tabular visiting hours, ticket prices, and historical summaries are pre-rendered into static HTML (`npm run build` output confirms 141 static routes).
2. **Dynamic Route Performance:** Destination detail pages (`/places/[slug]`) employ `generateStaticParams()` to pre-render all 106 destination records at compile time with 3600-second ISR revalidation.
3. **HTTP Status Codes:** Clean 200 OK across public routes, strict 308 permanent redirects for legacy aliases (e.g., `/destinations/fc-road` -> `/places/fergusson-college-heritage`), and valid 404 handling.

---

## 5. Identified Baseline Gaps & Action Items

| Priority | Issue / Opportunity | Root Cause | Action Taken |
|---|---|---|---|
| **P1** | Schema breadth on category hubs | Category hubs lacked explicit `ItemList` Schema linking all child destinations | Implemented `ItemList` Schema on `/destinations/[category]` and `/destinations` |
| **P2** | Local SEO geo tagging | Missing `ICBM` and `geo.position` coordinates in root layout | Injected ISO standard geo tags (`18.5204;73.8567`) in `app/layout.tsx` |
| **P3** | Trip Planner schema definition | `/planner` lacked rich `WebApplication` & `FAQPage` graph | Embedded full schema graph in `app/planner/layout.tsx` |
| **P4** | Regional vernacular keyword coverage | Marathi keywords under-represented in metadata keywords | Added Devanagari keywords (`सिंहगड किल्ला`, `शनिवार वाडा`) to root metadata |
