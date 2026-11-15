# Explore Pune — Architecture & Engineering Decisions (Experience v2)

**Document**: DECISIONS.md  
**Date**: November 15, 2026  
**Status**: APPROVED & LOCKED  
**Branch**: `experience-v2`  
**Author**: Tech Lead  

---

## 1. Basemap Provider Selection (MapLibre GL JS)

### Context & Requirements
- Target: Full-screen interactive dark map of Pune for Part B.
- Constraint: Free-tier only, strictly NO paid APIs, NO secret keys, NO credit/debit card requirement.
- Preference hierarchy:
  1. Self-hosted Protomaps PMTiles with dark style
  2. OpenFreeMap-based custom dark style
  3. CARTO Dark Matter

### Evaluation
1. **Self-hosted Protomaps PMTiles**:
   - Pros: Fully self-contained.
   - Cons: A vector tile extract of Pune and surrounding Western Ghats ranges 50–120 MB. Storing this inside the Next.js bundle or Vercel serverless function causes deployment size bloat and cold-start latency.
2. **OpenFreeMap Dark Style (`https://tiles.openfreemap.org/styles/dark`)**:
   - Pros:
     - 100% free and open-source public tile infrastructure.
     - Zero billing card, zero secret keys, zero token signups.
     - Vector tile GL style JSON compatible directly with `maplibre-gl`.
     - Built on OpenMapTiles and OpenStreetMap data.
     - Generous hosting without hard request quotas.
   - License & Attribution:
     - Map data: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL).
     - Style & tiles: © [OpenFreeMap](https://openfreemap.org/) (CC-BY 4.0).
3. **CARTO Dark Matter (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`)**:
   - Retained as a reliable secondary fallback if OpenFreeMap is ever unreachable.
   - Attribution: `© CARTO © OpenStreetMap contributors`.

### Decision
**Adopt OpenFreeMap Dark Style (`https://tiles.openfreemap.org/styles/dark`) as Primary Basemap**, with automatic failover to **CARTO Dark Matter** vector/raster tiles if network requests fail. Render clear attribution `© OpenFreeMap © OpenStreetMap` in the bottom-left legend.

---

## 2. Page Architecture & Section Division

### Decision
The `/experience` route is strictly partitioned into **two distinct, high-impact parts and nothing else**:

1. **PART A (Intro)**:
   - High-editorial scroll intro inspired by [Dialed Coffee](https://www.dialedcoffee.com/).
   - Dark & Light theme support.
   - Sections:
     - A0: Real asset-tied preloader ("Mapping Pune 0%..100%").
     - A1: Hero ("EXPLORE PUNE. / YOUR WAY.") with framed photo & 3 floating place cards.
     - A2: Live verified marquee strip (timings, routes, fees).
     - A3: "Explore by interest" interactive category slider linking to deep-link category map states.
     - A4: Sticky pinned "Everything you need in one guide" highlighting real verified features.
     - A5: Real data-driven numbers strip (106 places, 7 core categories, 5 geographic zones, 8 itineraries).
     - A6: Editorial stories row (3 real verified dispatches).
     - A7: Verified FAQ accordion based on real municipal/traveler knowledge.
     - A8: Atmospheric transition bridge handing off to Part B ("Now see Pune.").

2. **PART B (Map)**:
   - Always dark theme (`#181a20` / `#0f1117`).
   - Driven by the 5.25s camera motion curve (overview -> flight with plane marker & route trail -> second zone focus -> framing overview with place drawer).
   - Desktop left glass panel with search, category tabs, and place list.
   - Top chips for 5 zones.
   - Right detail drawer on place selection.
   - Mobile responsive bottom sheet with peek/half/full snap points.
   - Crawlable server-rendered category directory below map for SEO bots and no-JS visitors.

---

## 3. Five Geographic Zones Definition

To structure Pune's 106 destinations logically across the landscape, 5 geographic zones are established:

1. **Historic Peths & Wadas** (`historic-peths`):
   - Wadas, Kasba Ganpati, Dagdusheth, Mandai, Tulshibaug, Kelkar Museum, Tambat Ali, 17 historic Peths.
2. **Deccan & Kothrud** (`deccan-kothrud`):
   - FC Road, BMCC, Fergusson, Prabhat Rd, Vetal Tekdi, ARAI Tekdi, Pataleshwar Cave, Chatushrungi.
3. **Camp & Cantonment** (`camp-cantonment`):
   - MG Road, East Street, National War Memorial, Empress Botanical Garden, Synagogue, St. Mary's.
4. **Koregaon Park & Nagar Rd** (`kp-nagar-rd`):
   - Koregaon Park, Osho Teerth Park, Aga Khan Palace, Bund Garden, Yerwada heritage.
5. **Sahyadri Forts & Reservoirs** (`sahyadri-forts`):
   - High-altitude Maratha forts (Sinhagad, Rajgad, Torna, Purandar, Lohagad, Visapur, Tikona, Shivneri) and Sahyadri lakes/ghats (Khadakwasla, Panshet, Mulshi, Tamhini).

---

## 4. Ground-Truth Data & Conflict Resolution

- Source of truth: `data/pune_places_106.json`.
- 15 cataloged forts in data; 7 featured high-altitude adventure treks.
- Shaniwar Wada ASI verified hours: 09:30 AM – 05:30 PM.
- Raja Dinkar Kelkar Museum collection: 20,000+ artifacts.
- Distance radius gating (<25km) on city / short itineraries.
- Recorded all conflicts in `docs/experience/data-issues.md`.

---

## 5. Animation, Performance & Accessibility

- Lenis smooth scroll active in Part A; disabled if `prefers-reduced-motion` is set.
- MapLibre GL JS loaded dynamically via `next/dynamic` only when Part B nears the viewport (`IntersectionObserver` threshold).
- Zero WebGL in Part A to ensure LCP < 2.5s and instant first-paint on mid-range Android 4G.
- Full keyboard operability (Tab, Enter, Space, Escape, Arrow keys) and screen-reader aria landmarks.
