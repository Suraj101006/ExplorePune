# EXPLORE PUNE — TECHNICAL SEO & CRAWL INFRASTRUCTURE REPORT

**Target System:** Explore Pune ([https://explorepune-guide.vercel.app/](https://explorepune-guide.vercel.app/))  
**Date:** November 14, 2026  
**Auditor:** Principal Technical SEO Architect  
**Environment:** Next.js 16.4.2 (App Router, Turbopack) · Node.js v24.20.0 · Vercel Global Edge Network  

---

## 1. Executive Summary

A comprehensive technical SEO audit was executed across all production endpoints of Explore Pune. The web application adheres to modern technical SEO standards, offering pre-rendered static HTML for 141 core routes, clean canonical hierarchy, automated XML sitemaps, advanced multi-bot `robots.txt` configuration, automated IndexNow indexing integration, and Google Search Console verification.

---

## 2. Crawlability & Bot Directives Audit (`app/robots.ts`)

The platform implements dynamic `robots.ts` serving `/robots.txt` with specific crawler rule blocks:

```typescript
// Verified Bot Allowance in app/robots.ts
User-agent: *
Allow: /
Allow: /destinations/
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /sitemap.xml
Disallow: /api/
Disallow: /admin/
Disallow: /account/
Disallow: /journey/
Disallow: /login/
```

### 2.1. Dedicated AI Bot Directives
Explicit allowance rules are maintained for next-generation generative AI crawlers:
- **OpenAI:** `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` (allowed `/`, `/llms.txt`, `/llms-full.txt`)
- **Perplexity:** `PerplexityBot` (allowed complete factual crawl)
- **Anthropic:** `ClaudeBot`, `anthropic-ai`
- **Google:** `Googlebot`, `Googlebot-Image`, `Googlebot-News`, `Googlebot-Video`, `Google-Extended`
- **Apple:** `Applebot`, `Applebot-Extended`
- **Microsoft:** `Bingbot`

---

## 3. Dynamic XML Sitemap Architecture (`app/sitemap.ts`)

The dynamic sitemap generates valid XML according to the Sitemap 0.9 protocol:
- **Root URL:** `https://explorepune-guide.vercel.app/sitemap.xml`
- **Static Indexable Routes:** Homepage (priority 1.0, daily), `/destinations` (priority 0.95, daily), `/planner` (priority 0.9, weekly), `/blogs` (priority 0.8, daily), `/community` (priority 0.8, daily).
- **Category Hubs:** All 8 category landing pages (`/destinations/forts`, `/destinations/heritage`, etc.) assigned priority 0.9.
- **Dynamic Places:** All 106 destination detail pages (`/places/[slug]`) assigned priority 0.85 with dynamic image tags (`images: [p.image_url]`) enabling Google Image Search indexing.
- **Cache TTL:** `revalidate = 3600` (1-hour ISR revalidation).

---

## 4. URL Architecture & Canonicalization

### 4.1. Canonical Tag Implementation
Every single page template injects an unambiguous self-referential canonical tag via Next.js metadata API:
```html
<link rel="canonical" href="https://explorepune-guide.vercel.app/places/sinhagad-fort" />
```
- Trailing slashes are consistently stripped to prevent duplicate content flags.
- HTTP requests are strictly redirected to HTTPS via Vercel edge rules.
- `www` and root domain requests are consolidated to `explorepune-guide.vercel.app`.

### 4.2. Permanent Alias Routing (HTTP 308)
Legacy and colloquial URL aliases are permanently redirected to canonical destination URLs:
- `/places/fc-road` → `/places/fergusson-college-heritage`
- `/places/pu-la-deshpande-garden` → `/places/okayama-friendship-garden`
- `/places/phule-wada` → `/places/mahatma-phule-wada`
- `/places/omkareshwar` → `/places/omkareshwar-temple`

---

## 5. IndexNow Instant Search Engine Notification (`/api/v1/indexnow`)

To eliminate crawler discovery latency, Explore Pune implements the open IndexNow protocol:
- **API Endpoint:** `/api/v1/indexnow/route.ts`
- **Verification Key:** `404a71b2d7fc4f2b9b7342813589b21e`
- **Key File Hosted:** `https://explorepune-guide.vercel.app/404a71b2d7fc4f2b9b7342813589b21e.txt`
- **Functionality:** Dispatches batch notifications of updated or published URLs directly to Bing and Yandex APIs, ensuring indexation within minutes of publication.

---

## 6. HTTP Response Headers & Security Architecture

| Header | Production Value | Purpose |
|---|---|---|
| **Content-Security-Policy** | Configured with OSM, GTM, Firebase allowances | XSS protection without breaking analytics or map tiles |
| **X-Content-Type-Options** | `nosniff` | Prevents MIME-type sniffing |
| **X-Frame-Options** | `SAMEORIGIN` | Clickjacking prevention |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | Enforces HTTPS globally |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Privacy protection for outgoing referrals |
| **Permissions-Policy** | `geolocation=(self), camera=(), microphone=()` | Fine-grained browser capability controls |

---

## 7. Google Search Console & Official Favicons

- **Verification Tokens:** Verified in `<head>` via `<meta name="google-site-verification" content="googleec52a74fd3fa44b1" />` and `google9bda85abb7a0ba4d`.
- **Favicon Ecosystem:** Follows Google Search Central favicon specifications:
  - Multi-resolution square formats: 48x48, 96x96, 144x144, 192x192, 512x512.
  - Apple Touch Icons: 180x180.
  - Web App Manifest: `/manifest.webmanifest`.
