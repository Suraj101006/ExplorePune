# Explore Pune — Experience v2 Master Storyboard & Narrative Spec

**Document**: storyboard.md  
**Date**: November 15, 2026  
**Status**: APPROVED SPECIFICATION  
**Branch**: `experience-v2`  
**Author**: Creative Director & Tech Lead  

---

## 1. Overall Experience Concept & Rhythm

The `/experience` route is partitioned into two complementary movements:

1. **PART A: BOLD EDITORIAL SCROLL INTRO** (Inspired by dialedcoffee.com)
   - Heavy typography, high-contrast imagery, smooth inertia scrubbing, and rich micro-interactions.
   - Purpose: To clearly articulate **every real verified capability** of Explore Pune (106 places with open-now telemetry, Smart Trip Planner, offline passes, badges, community, weather, helplines).
   - Light/Dark theme adaptable.
   - Zero WebGL in Part A for instantaneous LCP and performance.

2. **PART B: FULL-SCREEN INTERACTIVE FLYOVER MAP** (From reference video)
   - Deep cinematic basemap (`#30333E` slate with MapLibre GL JS vector tiles).
   - Driven by a 5.25s cubic ease-in-out flyover choreography (Beat 1 to Beat 4).
   - 106 destination pins, 5 geographic zones with glowing vector boundaries, search, live filters, bottom sheet on mobile, glass panel on desktop, and place detail drawer.
   - Crawlable server-rendered directory below the map for SEO and no-JS visitors.

---

## 2. Part A Storyboard (The 9 Editorial Steps)

```
[ A0: PRELOADER ] -> "Mapping Pune 0%..100%" (Asset-tied, skippable, once-per-session curtain wipe)
      |
[ A1: HERO ]      -> "EXPLORE PUNE. / YOUR WAY." (Framed photo + 3 floating cards + "Fly Over Pune" CTA)
      |
[ A2: MARQUEE ]   -> Continuous live telemetry strip (ASI hours, Curfew alerts, Metro routes)
      |
[ A3: SLIDER ]    -> "Explore by interest" (Heritage, Forts, Temples, Nature with hover swap & map deep link)
      |
[ A4: PINNED ]    -> "Everything you need in one guide" (Sticky visual left + 6 scroll steps right with "Try it" links)
      |
[ A5: NUMBERS ]   -> Live data strip (106 places, 7 categories, 5 zones, 8 itineraries)
      |
[ A6: STORIES ]   -> 3 authentic traveler dispatches with verified readings
      |
[ A7: FAQ ]       -> Verified traveler FAQ accordion
      |
[ A8: BRIDGE ]    -> Background eases into #30333E dark slate: "Now see Pune." -> Hands off to Part B
```

---

## 3. Part B Motion Spec (5.25s Flight Curve)

```
0.0s ──────────────── 1.0s ──────────────── 2.0s ──────────────── 3.0s ──────────────── 5.25s
[ BEAT 1: OVERVIEW ]  [ BEAT 2: FLIGHT ]    [ BEAT 3: ARRIVAL ]   [ BEAT 4: FRAMING & DRAWER ]
- Camera at pitch 45° - Plane glyph spawns  - Line touches stop 2 - Camera eases to fitBounds
- Zone 1 fades in     - Red route draws     - Zone 2 lights up    - Both zones framed
- Glowing blue outline- Camera tracks       - Glowing green line  - Right detail drawer slides in
- Red pin on start    - Bearing follows path- Red pin on dest     - Labels stay visible
```

- **Trigger Actions**:
  1. Primary "Fly Over Pune" button in Part A scrolls directly to `#map` and starts the flight.
  2. "Fly the Trail" button runs the sequential auto-tour across the selected category.
  3. Clicking any place pin flies the camera to `zoom ~15.5` with a `45°` tilt and slides in the drawer.
  4. Manual map drag or zoom immediately pauses or dismisses the scripted flight animation without jank.
  5. `prefers-reduced-motion: reduce`: snaps camera bounds instantaneously with zero duration, hiding the plane marker and route drawing.
