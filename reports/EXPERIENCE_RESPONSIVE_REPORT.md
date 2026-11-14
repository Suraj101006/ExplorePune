# Explore Pune: Beyond the Ordinary — Responsive Design & Cross-Device Test Report

**Document Type:** Cross-Device & Responsive Verification  
**Route:** `/experience`  

---

## 1. Responsive Viewport Matrix

| Viewport Category | Screen Resolution | Device Emulation | Testing Outcome | Key Adaptations |
|---|---|---|---|---|
| **Mobile Portrait** | 390 x 844 | iPhone 14 / Pixel 7 | 🟢 Verified | 800 particles; single-column card stack; touch swipe gestures; custom cursor hidden; font sizes scaled down (`clamp(2.5rem, 8vw, 6rem)`). |
| **Mobile Landscape** | 844 x 390 | Landscape Smartphone | 🟢 Verified | Reduced vertical padding; scene headers repositioned; viewport height calculated using `100dvh`. |
| **Tablet Portrait** | 768 x 1024 | iPad Air / Galaxy Tab | 🟢 Verified | 1,500 particles; two-column physics node grid; touch drag interactions enabled. |
| **Desktop Full HD** | 1920 x 1080 | Windows / macOS | 🟢 Verified | Full 2,500 particles; interactive smooth trailing cursor; horizontal kinetic typography skewers; 4-column motion lab grid. |
| **Ultra-Wide 4K** | 2560 x 1440+ | High-DPI Monitor | 🟢 Verified | Max-width content boundaries (`max-width: 1400px`); centered layout; crisp antialiased WebGL rendering. |

---

## 2. Dynamic Viewport Height (`dvh`) Standard
To address mobile browser URL bar expansion and retraction bugs on iOS Safari and Android Chrome, all full-screen scene containers use:
```css
min-height: 100dvh;
height: 100dvh;
```
This guarantees that each scene fits perfectly within the physical screen boundaries without unexpected jumping or scroll snapping cutoffs.

---

## 3. Touch vs Pointer Interactivity
- **Desktop:** The custom glowing cursor (`ExperienceCursor.tsx`) actively tracks pointer coordinates, with smooth trailing lerp physics and hover growth states.
- **Mobile / Touch Devices:** The custom cursor is automatically disabled via `@media (hover: none) and (pointer: coarse)` and `isTouchDevice` checks, reverting seamlessly to native system touch scrolling and tap feedback.
