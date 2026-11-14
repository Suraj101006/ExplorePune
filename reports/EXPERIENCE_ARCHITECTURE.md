# Explore Pune: Beyond the Ordinary — Technical Architecture & WebGL Lifecycle

**Document Type:** System Architecture Specification  
**Route:** `/experience`  
**Stack:** Next.js 16 (App Router), React 19, Three.js (`^0.182.0`), Web Audio API, TypeScript, CSS Modules / Scoped CSS  

---

## 1. Architectural Strategy & Isolation Guardrails
The `/experience` route is architected as an isolated visual sandbox within Explore Pune. To prevent any negative impact on Core Web Vitals, SEO, or runtime bundle size on the main 106 destination pages, the following guardrails are enforced:

1. **Zero Contamination of Core Pages:**
   - Three.js is exclusively imported inside `components/experience/ExperienceCanvas.tsx`.
   - `app/experience/page.tsx` dynamically imports `ExperienceCanvas` with `ssr: false`:
     ```tsx
     const ExperienceCanvas = dynamic(
       () => import('@/components/experience/ExperienceCanvas'),
       { ssr: false }
     );
     ```
   - No Three.js bytes are loaded on `/`, `/destinations`, `/planner`, or `/places/[slug]`.
2. **Pure Experience Mandate:**
   - The route contains strictly artistic visual scenes.
   - It contains zero tourism listings, booking buttons, itineraries, or functional map pins.
3. **Scoped CSS Architecture:**
   - All styling is scoped under `.experience-root` in `app/experience/experience.css`.
   - Global root variables (`--ep-gold`, `--ep-amber`, `--ep-void`) do not pollute global styles.

---

## 2. Component Hierarchy

```
app/experience/page.tsx (Client Component)
├── ExperienceCanvas (Three.js WebGL Engine, dynamic ssr:false)
│   ├── PerspectiveCamera (FOV 60, Aspect Ratio responsive)
│   ├── Points Geometry (2,500 particles desktop / 800 particles mobile)
│   ├── AmbientLight (#453822, 0.8 intensity)
│   ├── PointLight 1 (#d4af37, Key Light)
│   ├── PointLight 2 (#0284c7, Rim Light)
│   └── Polyhedral Core (Icosahedron & Torus Rings with MeshStandardMaterial)
├── ExperienceCursor (Desktop custom smooth trailing cursor)
├── ExperienceControls (Floating bottom HUD dock)
│   ├── Scene Jump Buttons (01 - 07)
│   └── ExperienceAudio (Procedural Web Audio synthesizer, default OFF)
└── Scene Sequence Sections:
    ├── Scene 01: ScenePortal
    ├── Scene 02: SceneInfiniteUniverse
    ├── Scene 03: SceneKineticTypography
    ├── Scene 04: SceneVisualGallery
    ├── Scene 05: SceneInteractive3D
    ├── Scene 06: SceneMotionLab
    └── Scene 07: SceneGrandFinale
```

---

## 3. WebGL Lifecycle & Memory Management
Three.js allocations can cause critical memory leaks on single-page applications if contexts are not explicitly destroyed upon component unmount.

### Lifecycle Implementation in `ExperienceCanvas.tsx`:
```ts
useEffect(() => {
  if (!mountRef.current) return;

  // 1. Initialization
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(...);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });

  // 2. Geometry & Material Allocation
  const particleGeo = new THREE.BufferGeometry();
  const particleMat = new THREE.PointsMaterial(...);
  const meshGeo = new THREE.IcosahedronGeometry(2.2, 1);
  const meshMat = new THREE.MeshStandardMaterial(...);

  // 3. Animation Frame Loop with requestAnimationFrame
  let animId: number;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    // Render loop logic
    renderer.render(scene, camera);
  };
  animate();

  // 4. Strict Destruction on Unmount
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);

    particleGeo.dispose();
    particleMat.dispose();
    meshGeo.dispose();
    meshMat.dispose();
    renderer.dispose();

    if (mountRef.current && renderer.domElement) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };
}, []);
```

---

## 4. Active Scene Detection via IntersectionObserver
Scene transitions and HUD updates are managed via a high-performance `IntersectionObserver` observing all seven scene elements:
- `threshold: [0.2, 0.5, 0.8]`
- Dispatches zero layout thrashing or unneeded re-renders.
- Updates URL hash cleanly (`#scene-01` through `#scene-07`) without triggering full page reloads.

---

## 5. Web Audio API Procedural Synthesis
- **Zero Asset Download:** No audio files (`.mp3` / `.wav`) are downloaded over the network.
- **Lazy AudioContext:** `AudioContext` is only instantiated when the user explicitly clicks the audio toggle.
- **Node Graph:**
  `[4 Oscillators (C2, G2, E3, C4)] -> [GainNode (Master Volume 0.15)] -> [BiquadFilter (Lowpass 480Hz)] -> [Destination]`.
- **Ramp Volume Transitions:** Volume transitions use `linearRampToValueAtTime` over 0.6 seconds to eliminate audible popping or clicks when muting/unmuting.
