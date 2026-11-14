# Explore Pune: Beyond the Ordinary — Technical Implementation Plan

**Scope:** Dedicated `/experience` route with Three.js WebGL canvas, 7 cinematic scenes, interactive cursor, Web Audio ambient engine, and navbar integration.

---

## 1. File Structure
```
app/
  experience/
    page.tsx             # Main server/client component entrypoint for /experience
    experience.css       # Scoped styling, keyframes, transitions, responsive layouts
components/
  experience/
    ExperienceCanvas.tsx       # Dynamic client component: Three.js WebGL 3D scene & particle cosmos
    ScenePortal.tsx            # Scene 1: The Portal
    SceneInfiniteUniverse.tsx  # Scene 2: Infinite Particle Universe
    SceneKineticTypography.tsx # Scene 3: Kinetic Typography
    SceneVisualGallery.tsx     # Scene 4: Cinematic Visual Gallery
    SceneInteractive3D.tsx     # Scene 5: Interactive 3D Polyhedra
    SceneMotionLab.tsx         # Scene 6: Interactive Motion Lab
    SceneGrandFinale.tsx       # Scene 7: The Grand Finale
    ExperienceCursor.tsx       # Smooth trailing magnetic cursor
    ExperienceAudio.tsx        # Procedural Web Audio API ambient sound generator & mute toggle
    ExperienceControls.tsx     # Scene navigation bar & quality toggles
```

## 2. Technical Safeguards
- **Zero Global Contamination:** All CSS selectors are prefixed with `.exp-` or scoped inside `.experience-root`.
- **Dynamic 3D Import:** `ExperienceCanvas` is loaded via `next/dynamic` with `ssr: false` to ensure zero SSR hydration issues and optimal initial page load.
- **Graceful WebGL Fallback:** In environments without hardware WebGL support, a clean CSS 3D/canvas fallback is presented automatically.
- **Audio Integrity:** Web Audio API synth starts muted. Sound only plays upon explicit user gesture (mute toggle click).
