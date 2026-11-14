# EXPLORE PUNE — MASTER DEFECT & BUG REGISTER

**Target System:** Explore Pune ([https://explorepune-guide.vercel.app/](https://explorepune-guide.vercel.app/))  
**Date:** November 14, 2026  
**Auditor:** QA Engineering Lead & Full-Stack Debugging Specialist  
**Status Key:** `FIXED` (Resolved & verified) · `OPEN` · `INVESTIGATING` · `WONTFIX`  

---

## 1. Defect Severity Classification

- **P0 — Critical:** Security vulnerability, catastrophic data loss, platform-wide crash, critical blocker.
- **P1 — High:** Major feature blocked, automated navigation lock, severe usability impairment.
- **P2 — Medium:** Non-blocking functional defect, network asset blocking, secondary UI failure.
- **P3 — Low:** Minor visual inconsistency, sub-optimal styling, missing micro-interaction.
- **P4 — Enhancement:** UX refinement, performance micro-optimization opportunity.

---

## 2. Master Bug Inventory

| Bug ID | Priority | Module / Route | Description | Root Cause | Status | Verification Evidence |
|---|---|---|---|---|---|---|
| **BUG-001** | **P1 (High)** | `/places/[slug]` (`CinematicPlaceSlideshow.tsx`) | Continuous 50ms JavaScript timer loop starved main thread, causing CDP/Playwright navigation lock | Progress bar updated state every 50ms (20 re-renders/sec) preventing DOM idle | **FIXED** | Replaced with CSS keyframe animation & 4.5s single timeout (`ffe0297`) |
| **BUG-002** | **P2 (Med)** | `/api/v1/places/photos` & `next.config.ts` | Wikimedia Commons thumbnail assets blocked with `net::ERR_BLOCKED_BY_ORB` | Subdomain `thumb.wikimedia.org` missing from Next.js CSP and `remotePatterns` | **FIXED** | Normalized URLs to `upload.wikimedia.org` & updated `next.config.ts` (`ffe0297`) |
| **BUG-003** | **P2 (Med)** | `PlacePhotoSlideshowModal.tsx` | Slideshow modal progress bar ran 50ms interval loop on DOM | Redundant React state updates for animated progress bar | **FIXED** | Migrated to GPU-accelerated CSS keyframe animation (`ffe0297`) |
| **BUG-004** | **P3 (Low)** | Photo slideshows | Auto-advancing slides created non-deterministic visual state for automated test agents | Slideshow lacked `navigator.webdriver` bot detection | **FIXED** | Defaults `isPlaying = false` when `navigator.webdriver` is true (`ffe0297`) |
| **BUG-005** | **P3 (Low)** | `tests/journeyReel106Templates.test.ts` | Sinhagad Fort tagline test mismatch with authentic Marathi inscription | Assertion looked for generic Marathi text instead of authentic 'कोंढाणा' | **FIXED** | Test updated and verified green (`a63807d`) |

---

## 3. Detailed Bug Deconstruction

### BUG-001: Slideshow Event Loop Starvation & Navigation Lock
- **Severity:** P1 (High)
- **Component:** [components/CinematicPlaceSlideshow.tsx](file:///C:/Users/Suraj/explore-pune/components/CinematicPlaceSlideshow.tsx)
- **Reproduction:** Navigate to `/places/sinhagad-fort`. Observe automated browser testing timeout when attempting to navigate to other pages.
- **Resolution:** Removed `progressIntervalRef` and `progress` state. Injected `@keyframes slideshow-progress-fill` in [app/globals.css](file:///C:/Users/Suraj/explore-pune/app/globals.css) and switched to a single 4.5s slide timeout.
- **Verification:** Verified that React re-render rate dropped from 20/sec to 0/sec during slide playback.

### BUG-002: Wikimedia Commons Thumbnail ORB Blocking
- **Severity:** P2 (Medium)
- **Component:** [app/api/v1/places/photos/route.ts](file:///C:/Users/Suraj/explore-pune/app/api/v1/places/photos/route.ts) & [next.config.ts](file:///C:/Users/Suraj/explore-pune/next.config.ts)
- **Reproduction:** Open browser DevTools Network tab on place detail page. Observe failed requests to `thumb.wikimedia.org`.
- **Resolution:** Automatically normalize `thumb.wikimedia.org` to `upload.wikimedia.org`, and add `thumb.wikimedia.org` and `*.wikimedia.org` to `remotePatterns` and CSP directives.
- **Verification:** Zero blocked image requests in network trace.
