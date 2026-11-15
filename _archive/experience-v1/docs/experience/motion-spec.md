# Explore Pune: "Pune Through Time"
## Master Motion Specification & Choreography Guidelines

**Version**: 2.0.0  
**Creative Director & Art Director**: Explore Pune Experience Team  
**Engineering Alignment**: Next.js 16, Lenis Smooth Scroll, WebGL Three.js, CSS Hardware Transforms  
**Accessibility Compliance**: WCAG 2.1 Success Criterion 2.2.2 (Pause, Stop, Hide), 2.3.3 (Animation from Interactions)

---

## 1. Motion Philosophy & Architectural Principles

Motion in the "Pune Through Time" experience is not ornamental decoration; it is **narrative cartography**. Every movement conveys the physical weight of Deccan basalt, the regal poise of Maratha history, and the fluid rhythm of the Sahyadri seasons.

### The Three Sacred Rules of Motion
1. **Weight & Basalt Integrity**: Pune is built on Deccan volcanic rock. Objects do not bounce like rubber toys unless specifically designed as playful tactile artifacts. UI entrances carry architectural mass—swift initial deceleration with an extended, graceful settle.
2. **Scroll Continuity (Scrubbed vs Triggered)**:
   - **Continuous Scrubbed Motion**: Camera pans, horizontal carousels, and seasonal shaders map 1:1 to scroll progress. When the user stops scrolling, the world rests.
   - **Triggered Discrete Motion**: Micro-interactions, badges, dials, and button clicks fire autonomous physics-based animations that resolve within 400ms.
3. **Inclusive Motion (Universal Grace)**: Every visual beat MUST have an identical semantic meaning when animations are disabled. Reduced motion is not an error state; it is a first-class calm reading mode.

---

## 2. Standard Easing Curves & Mathematical Formulas

All animation in the experience MUST utilize one of the seven verified easing curves defined below. Custom, unapproved cubic beziers are strictly prohibited.

```
       1.0 +------------------------------------------------------+
           |                                       ....-----------| <-- expoOut / peshwaEase
           |                                ...''''               |
           |                            ..''                      |
           |                         .''                          |
       0.5 |                      .''                             |
           |                   ..'                                |
           |                ..''                                  |
           |            ..''                                      |
           |        ..''                                          |
       0.0 +------------------------------------------------------+
           0.0                        0.5                       1.0
```

### Easing Matrix

| Easing Token | Cubic Bezier Formula | CSS Variable | Character & Use Case |
|:---|:---|:---|:---|
| **`expoOut`** | `cubic-bezier(0.16, 1, 0.3, 1)` | `--exp-ease-expo-out` | **Swift Natural Deceleration**. Used for UI toggles, modal slides, drawer reveals, and cursor snaps. |
| **`peshwaEase`** | `cubic-bezier(0.22, 1, 0.36, 1)` | `--exp-ease-peshwa` | **Regal Architectural Glide**. Used for landmark cards, headline reveals, and epoch milestone switches. |
| **`cinematicPeshwa`**| `cubic-bezier(0.19, 1, 0.22, 1)` | `--exp-ease-cinematic-peshwa` | **Grand Curtain Rise**. High-friction majestic easing for full-screen chapter transitions and shutter wipes. |
| **`springGentle`** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `--exp-ease-spring-gentle` | **Tactile Physical Bounce**. Used exclusively for workshop controls (Misal gauge, Dhol pad, stamps). |
| **`sahyadriMist`** | `cubic-bezier(0.4, 0, 0.2, 1)` | `--exp-ease-sahyadri-mist` | **Organic Atmospheric Dissolve**. Used for cloud layers, ambient fog, and weather cross-fades. |
| **`monsoonSurge`** | `cubic-bezier(0.77, 0, 0.175, 1)` | `--exp-ease-monsoon-surge` | **Dramatic Portal Swell**. Heavy anticipation followed by an explosive forward surge into the map or 3D terrain. |
| **`linear`** | `linear` | `--exp-ease-linear` | **Continuous Uniform Velocity**. Used strictly for time-synchronized scrubbing, compass tickers, and particle drift. |

### Mathematical Formulas for WebGL / Canvas Interpolation

For three.js and custom canvas loops, use these exact interpolation functions rather than arbitrary lerp multipliers:

```typescript
// Expo Out: 1 - 2^(-10t)
export function easeExpoOut(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Peshwa Regal Ease: Quintic Out variant
export function easePeshwa(t: number): number {
  const p = t - 1;
  return p * p * p * p * p + 1;
}

// Spring Gentle (Subtle overshoot, damping ratio zeta = 0.72)
export function easeSpringGentle(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
```

---

## 3. Duration Hierarchy & Timing Standards

To maintain visual harmony, motion durations are quantized into 8 precise tiers:

| Token | Duration (ms) | CSS Token | Description & Usage |
|:---|:---|:---|:---|
| **Instant** | `0ms` | `--exp-duration-instant` | Immediate state changes, theme switching, DOM detachment. |
| **Micro** | `100ms` | `--exp-duration-micro` | Button active depress, hover color shift, checkmark tick. |
| **Fast** | `200ms` | `--exp-duration-fast` | Tooltips, badge pops, small chip selections, quick toggles. |
| **Base** | `400ms` | `--exp-duration-base` | Card expansion, drawer slide-in, modal overlay backdrop fade. |
| **Deliberate** | `600ms` | `--exp-duration-deliberate` | Pathway tilt settle, search filter accordion, map flyover target shift. |
| **Slow** | `800ms` | `--exp-duration-slow` | Epoch backdrop cross-fade, seasonal weather transition. |
| **Cinematic** | `1200ms` | `--exp-duration-cinematic` | Full-screen hero shutter wipe, Chapter 0 ink curtain dissolve. |
| **Epic** | `2000ms` | `--exp-duration-epic` | Overture opening sequence, orbit camera arrival flyover. |
| **Ambient** | `8000ms` | `--exp-duration-ambient` | Continuous loop of Sahyadri clouds and slow star rotation. |

---

## 4. Stagger Cascades & Group Sequencing

When multiple UI elements enter or leave simultaneously, apply sequential stagger offsets to create organic reading flow:

```
Item 01: [====== 400ms ======]
Item 02:    [====== 400ms ======]  (+60ms)
Item 03:       [====== 400ms ======]  (+120ms)
Item 04:          [====== 400ms ======]  (+180ms)
```

### Stagger Rules by Component Type

1. **Numeric Telemetry & Tickers (`tight: 30ms`)**:
   - Devanagari counter digits and coordinate ticker letters animate with a 30ms step offset.
2. **List Items & Pathway Cards (`normal: 60ms`)**:
   - The 16 pathway cards and itinerary checklist cards reveal with an exact 60ms stagger.
   - Max cascade cap: Never stagger beyond 8 items (cap at 480ms total delay) to avoid frustrating users.
3. **Grid Landmark Cards & Epoch Artifacts (`loose: 120ms`)**:
   - Multi-column place cards in the living map or heritage section stagger by 120ms per row.
4. **Cinematic Hero Headlines (`theatrical: 200ms`)**:
   - Headline split phrases (*"पुणे: सह्याद्रीची शान"* followed by *"विद्येचे माहेरघर"*) stagger by 200ms to preserve monumental rhythm.

---

## 5. Scroll-Driven Scrub Mechanics (Lenis Integration)

The experience uses **Lenis** as the smooth virtual scroll engine. The following rules govern how scroll input translates to visual transformation:

### Virtual Scroll Configuration
```typescript
export const lenisConfig = {
  duration: 1.2,              // Dampened deceleration
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo Out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.8,
  infinite: false,
};
```

### Scrubbed Chapter Pinning Mechanics
When a chapter specifies pinning (e.g., Chapter 2 Four Epochs at `400vh` or Chapter 3 Pathways at `300vh`):
1. **Container Pinning**: The section wrapper is pinned using CSS `position: sticky; top: 0; height: 100vh; overflow: hidden;`.
2. **Track Height**: The parent container has a height equal to `viewportHeight * (scrollMultiplier)`.
3. **Normalized Scrub Progress**:
   ```typescript
   function calculateScrub(
     elementTop: number,
     elementHeight: number,
     viewportHeight: number,
     scrollY: number
   ): number {
     const scrollDistance = elementHeight - viewportHeight;
     if (scrollDistance <= 0) return 0;
     const currentScroll = scrollY - elementTop;
     return Math.max(0, Math.min(1, currentScroll / scrollDistance));
   }
   ```
4. **Threshold Transitions**:
   In multi-epoch or multi-season chapters, progress `[0, 1]` is divided into distinct zones. A smoothing buffer of 10% (0.05 on each side of the boundary) must be applied to prevent abrupt snapping between stages.

---

## 6. GPU Performance & Rendering Budget (60 FPS Mandate)

To guarantee 60 frames per second on mobile devices (e.g., mid-range Android and iOS devices prevalent in Maharashtra):

### 1. Composite-Only Properties
**MANDATORY**: Animate ONLY properties that can be handled on the GPU compositor thread without triggering layout reflow or repaint:
- `transform: translate3d(x, y, z)`
- `transform: scale(s)`
- `transform: rotate(deg)`
- `opacity`

**STRICTLY FORBIDDEN IN ANIMATIONS**:
- Animating `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Animating `filter: blur()` or `box-shadow` continuously on scroll (use pre-rendered pseudo-element opacity fades instead).

### 2. Hardware Layer Promotion
Promote actively animated elements to their own GPU layer using `will-change`:
```css
.exp-scrub-layer {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```
*Note: Remove `will-change` when the element is off-screen or animation completes to avoid VRAM exhaustion.*

### 3. Draw Call & Vertex Budget for WebGL Chapters
- **Max Draw Calls**: <= 45 draw calls per frame across all 3D layers.
- **Max Polygon Count**: <= 65,000 vertices total in active viewport.
- **Texture Resolutions**: Max 2048x2048 for hero sky dome, 1024x1024 for 3D artifacts, compressed as WebP/KTX2.
- **RAF Throttling**: When the 3D canvas is outside the viewport (`IntersectionObserver`), suspend the `requestAnimationFrame` loop completely.

---

## 7. Accessibility & Prefers-Reduced-Motion Rules

The experience must strictly honor user accessibility preferences and provide a full-fidelity **Calm / Lite Mode** (`?lite=1`):

### 1. Reduced Motion Detection & CSS Safeguard
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Disable all WebGL canvases and heavy particle systems */
  .exp-canvas-container,
  .exp-world3d-section canvas,
  .exp-particle-canvas {
    display: none !important;
  }

  /* Unpin horizontal tracks into vertical scroll */
  .exp-horizontal-rail {
    transform: none !important;
    display: flex !important;
    flex-direction: column !important;
    overflow-x: visible !important;
  }
}
```

### 2. Calm / Lite Mode Architecture (`?lite=1`)
When the user toggles Calm/Lite mode (or passes URL query `?lite=1`):
1. **Lenis Virtual Scroll**: Completely disabled; browser reverts to native high-performance OS scrolling.
2. **Three.js WebGL Engine**: Zero bundle loading; WebGL canvas components are dynamically skipped via dynamic import conditions.
3. **Pinning Elimination**: All 400vh and 300vh scrub containers flatten to `height: auto`, rendering content as clean editorial cards.
4. **Zero Layout Shifts**: Text hierarchy and image placements remain 100% identical, preserving reading continuity.

---

## 8. Master Motion Choreography Cheat Sheet

```
+----------------------------------------------------------------------------------------------------+
| CHAPTER 0: PRELOADER                                                                               |
| Ink Droplet Impact:   expoOut (0.5s -> 1.6s)                                                        |
| Devanagari Draw:      stroke-dasharray linear (1100ms)                                             |
| Exit Iris Wipe:       cinematicPeshwa (2.2s -> 2.5s)                                               |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 1: ARRIVAL                                                                                 |
| Basalt Boulders Split: translate3d (+/-140px) scrubbed [0.0 - 0.3] via peshwaEase                   |
| Bhagwa Banner Ripple: vertex displacement (freq: 2.4, amp: 0.15) continuous                        |
| Headline Lock:        translateY(24px -> 0px), opacity(0.85 -> 1.0) scrubbed [0.3 - 0.7]           |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 2: FOUR EPOCHS                                                                             |
| Epoch Cross-fade:     opacity(0 -> 1) over 10% scrub zone via sahyadriMist                         |
| Artifact Rotation:    rotateY(0deg -> 360deg) linear continuous with scroll                        |
| Torch Sparks:         translateY(-120px) fadeOut over 1200ms                                       |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 3: SIXTEEN PATHWAYS                                                                        |
| Rail Translation:     translateX(0% -> -100%) linear scrubbed across 300vh                         |
| Card Hover Lift:      translateY(-16px), scale(1.02) over 200ms via expoOut                        |
| Interactive Tilt:     rotateX(py * -8deg) rotateY(px * 8deg) instantaneous lerp 0.15               |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 4: LIVING MAP                                                                              |
| Camera Orbital Fly:   altitude 8000m -> 600m scrubbed [0.0 - 0.3] via monsoonSurge                 |
| Pin Cascade:          scale(0 -> 1) springGentle with 30ms stagger                                  |
| River Shimmer:        procedural water normal uv offset (0.02 * time)                              |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 5: PLAYGROUND                                                                              |
| Tab Entrance:         springGentle bounce with 60ms stagger                                        |
| Button Press:         scale(0.96) micro 100ms -> springGentle recovery 150ms                       |
| Dhol Shockwave:       scale(1 -> 3.5), opacity(0.8 -> 0) over 400ms expoOut                        |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 6: SEASONS                                                                                 |
| Weather Cross-fade:   sahyadriMist dissolve over 75vh per season                                   |
| Rain Streaks:         translateY(100vh) linear 450ms cycle                                         |
| Heat Shimmer:         fragment shader noise distortion (amplitude 0.008)                           |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 7: YOUR PLAN                                                                               |
| FLIP Sorter:          transform translate3d over 350ms via expoOut                                 |
| Stamp Impact:         scale(1.4 -> 1.0), rotate(random -4deg to +4deg) over 250ms springGentle    |
+----------------------------------------------------------------------------------------------------+
| CHAPTER 8: OUTRO                                                                                   |
| Dusk Gradient Shift:  hue-rotate & opacity scrubbed [0.0 - 0.6]                                    |
| Monumental Quote:     translateY(32px -> 0px), opacity(0 -> 1) over 1200ms cinematicPeshwa         |
| Starfield Drift:      rotate(5deg) over 150vh scroll span                                          |
+----------------------------------------------------------------------------------------------------+
```

---

*Authored by Creative & Art Direction for Explore Pune. All rights reserved.*
