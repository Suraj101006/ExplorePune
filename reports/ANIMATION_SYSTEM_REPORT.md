# Explore Pune: Beyond the Ordinary — Animation System & Motion Graphics Specification

**Document Type:** Motion Design & Animation Specification  
**Route:** `/experience`  
**Engine:** CSS Hardware-Accelerated Animations + Three.js Matrix Transformations + Custom Trailing Cursor  

---

## 1. Motion Principles
1. **Physical Weight & Elasticity:** Animations follow realistic physics using cubic-bezier timing (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.22, 1, 0.36, 1)`) to deliver a smooth, luxurious deceleration curve.
2. **Kinetic Parallax:** As the user scrolls vertically, multi-layered visual elements move at differentiated velocities:
   - Three.js camera translates along the Z/Y axes based on `window.scrollY`.
   - Kinetic typography outlines drift horizontally.
   - Cinematic gallery cards translate with subtle 3D rotational perspective (`perspective(1200px) rotateY(...) rotateX(...)`).
3. **Cursor Reactivity:** Custom smooth trailing cursor follows pointer motion using linear interpolation (`lerp(current, target, 0.12)`), expanding on clickable nodes and shifting color upon interaction with physics modules.

---

## 2. Keyframe Animations Catalogue

| Animation Name | Duration | Easing | Transform / Property | Effect |
|---|---|---|---|---|
| `portalRingPulse` | `8s` | `linear infinite` | `rotate(360deg)` | Continuous subtle rotation of outer golden ring |
| `portalAuraBreathe` | `4s` | `ease-in-out infinite alternate` | `scale(1) <-> scale(1.15)`, opacity `0.4 <-> 0.8` | Breathing volumetric glow in Scene 01 |
| `kineticFloat` | `6s` | `ease-in-out infinite alternate` | `translateY(0) <-> translateY(-18px)` | Weightless levitation for interactive polyhedra |
| `labNodePulse` | `3s` | `ease-in-out infinite alternate` | `box-shadow: 0 0 25px rgba(...)` | Pulsing energy aura on interactive physics nodes |
| `finaleSupernova` | `10s` | `ease-in-out infinite alternate` | `scale(0.9) <-> scale(1.3)`, opacity `0.3 <-> 0.7` | Cosmic light explosion in Scene 07 |
| `eqBarDance` | `1.2s` | `ease-in-out infinite alternate` | `scaleY(0.2) <-> scaleY(1)` | Active equalizer wave bars on audio toggle |

---

## 3. WebGL Real-Time Loop Calculations
In `components/experience/ExperienceCanvas.tsx`:
```ts
// Time delta & rotational velocity
const elapsedTime = clock.getElapsedTime();

// Core Icosahedron Rotation
icosahedron.rotation.x = elapsedTime * 0.18 + mouseY * 0.4;
icosahedron.rotation.y = elapsedTime * 0.28 + mouseX * 0.4;

// Torus Knot Orbital Ring Rotation
torusRing.rotation.x = -elapsedTime * 0.12;
torusRing.rotation.y = elapsedTime * 0.15;

// Camera Dolly along Scroll Progress
const targetCameraY = -scrollY * 0.008;
const targetCameraZ = 12 + scrollY * 0.004;
camera.position.y += (targetCameraY - camera.position.y) * 0.05;
camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
```

---

## 4. Accessibility & `prefers-reduced-motion` Standard
In accordance with WCAG 2.1 Success Criterion 2.2.2 (Pause, Stop, Hide) and 2.3.3 (Animation from Interactions), the entire animation system respects OS-level reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .experience-root *,
  .experience-root *::before,
  .experience-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Furthermore, the Three.js loop automatically stops high-frequency rotation when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is detected.
