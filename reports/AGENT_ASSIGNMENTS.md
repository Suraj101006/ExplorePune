# Explore Pune: Beyond the Ordinary — Specialist Agent Assignments

**Project:** Explore Pune (`/experience`)  
**Status:** In Progress — Active Sprint  

---

## Workstream Task Allocations

### 1. Creative & Art Direction Stream (Agent 1 & Agent 2)
- [x] Establish the 7-scene narrative journey:
  - Scene 1: The Portal ("Beyond the Ordinary / Enter a Different Dimension")
  - Scene 2: Infinite Motion Universe (Interactive 3D particle cosmos)
  - Scene 3: Kinetic Typography ("Feel the Motion", "Beyond Limits", "Imagine More", "Enter the Unknown")
  - Scene 4: Cinematic Visual Gallery (Deep perspective visual compositions & clipping masks)
  - Scene 5: Interactive 3D Universe (Metallic golden polyhedra, liquid reflective materials, mouse orbits)
  - Scene 6: Interactive Motion Lab (Physics magnetic playground, cursor trails, distortion)
  - Scene 7: The Grand Finale ("The Experience Never Ends", particle dispersion, camera pullback)
- [x] Standardize color palette: Obsidian black (`#050507`), deep charcoal (`#0c0d12`), antique gold (`#d4af37`), electric amber (`#f59e0b`), burnished copper (`#ea580c`).

### 2. 3D WebGL & Canvas Stream (Agent 4 & Agent 7)
- [x] Build `components/experience/ExperienceCanvas.tsx`:
  - Three.js WebGL renderer with high-DPR scaling and antialiasing.
  - Interactive particle cloud (2,500 particles on desktop, 800 on mobile) responding to mouse/touch.
  - Floating 3D golden icosahedron and torus knots with metallic reflections and point lights.
  - Smooth camera dolly and orbital interaction.
  - Clean memory disposal (`geometry.dispose()`, `material.dispose()`, `renderer.dispose()`).

### 3. Frontend Architecture & Modular Components Stream (Agent 5 & Agent 6)
- [x] Implement `/experience` page route in `app/experience/page.tsx`.
- [x] Create isolated CSS stylesheet `app/experience/experience.css` (zero pollution of global CSS).
- [x] Build `components/experience/ExperienceCursor.tsx` with magnetic snapping and smoothing.
- [x] Build `components/experience/ExperienceAudio.tsx` with procedural Web Audio API ambient drone and toggle.
- [x] Build `components/experience/ExperienceControls.tsx` for scene jumping and quality mode switching.

### 4. Navbar & Navigation Integration Stream (Agent 5 & Agent 12)
- [x] Update `components/AppHeader.tsx`:
  - Add `{ href: '/experience', label: 'Experience', labelMr: 'अनुभव' }` to `navLinks`.
  - Ensure desktop active highlighting and mobile drawer links render seamlessly.

### 5. Performance, Accessibility & QA Stream (Agent 9, Agent 10, Agent 11)
- [x] Respect `prefers-reduced-motion` with accessible CSS and paused render loops.
- [x] Create comprehensive automated test suite `tests/experiencePage.test.ts`.
- [x] Verify production build (`npm run build`) and TypeScript check (`npx tsc --noEmit`).
