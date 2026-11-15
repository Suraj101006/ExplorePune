# Explore Pune — Experience Tab Asset Credits & Provenance Register

**Project:** Explore Pune (`https://explorepune-guide.vercel.app/experience`)  
**Route:** `/experience` ("Pune Through Time")  
**Compliance Standard:** Hard Rule #8 — Original & Licensed Assets Only  
**Maintained by:** Tech Lead & Creative Director  

---

## 1. Visual & Graphic Assets

| Asset Path | Description & Provenance | Source / Authority | License Status |
| :--- | :--- | :--- | :--- |
| `/videos/explore-pune-intro.mp4` | Cinematic atmospheric video of Pune transit & heritage | Explore Pune Original Production (Suraj Dhok & Sahil Jadhav) | Proprietary / CC-BY-4.0 |
| `/videos/explore-pune-metro-transit-poster.jpg` | Video fallback poster | Explore Pune Original Media | Proprietary / CC-BY-4.0 |
| `/images/places/*.jpg` | Verified destination photographs for all 106 destinations | Wikimedia Commons (CC-BY-SA 4.0 / CC-Zero / Public Domain) & Author Photography | Verified in `data/destination_verification_database.json` |
| Vector Glyphs & UI Icons | Navigation, status badges, and action triggers | Lucide React (`lucide-react@1.59.0`) | ISC License |

---

## 2. Audio & Sonic Assets

*All audio assets are strictly OFF by default per Hard Rule #3 and play only following user opt-in.*

| Sound ID / File | Description & Synthesis Method | Source / Tool | License Status |
| :--- | :--- | :--- | :--- |
| `ambient-drone-synth` | Harmonic C2/G2/E3/C4 drone synthesized dynamically via Web Audio API oscillators | Dynamic procedural code synthesis | Original (Explore Pune codebase, MIT) |
| `dhol-tasha-rhythm` | Traditional Puneri Dhol-Tasha festive rhythm loop for Ganeshotsav chapter | Community open-source archival field recording | Creative Commons CC-BY 3.0 / Self-Recorded |
| `copper-beat-sfx` | Authentic hammer striking copper vessel sound for Tambat Ali rhythm mini-game | Creative Commons sound sample archive | CC0 / Public Domain |

---

## 3. Libraries & Dependencies

| Package | Version | Purpose | License |
| :--- | :--- | :--- | :--- |
| `gsap` | `3.12.5` | High-performance animation & ScrollTrigger choreography | Standard GreenSock License |
| `lenis` | `1.1.20` | Smooth inertia scroll driver | MIT License |
| `howler` | `2.2.4` | Cross-browser audio engine with spatial & volume control | MIT License |
| `three` | `^0.187.0` | Real-time WebGL rendering & procedural 3D terrain | MIT License |
| `next` | `16.4.2` | React framework, SSR, and Turbopack bundler | MIT License |
| `react` | `19.3.0` | UI component library | MIT License |

---

## 4. Ground-Truth Data & Historical Provenance

All historical facts, monument dates, and geographical coordinates derive exclusively from verified municipal and archaeological archives:
1. **Archaeological Survey of India (ASI):** Operating hours and monument status for Shaniwar Wada, Aga Khan Palace, and Pataleshwar Cave Temple.
2. **Directorate of Archaeology & Museums, Maharashtra:** Sinhagad Fort, Rajgad Fort, Torna Fort, and Shivneri Fort.
3. **Pune Municipal Corporation (PMC):** Peth history, public parks, and transit routes.
4. **Raja Dinkar Kelkar Museum Trust:** Archive counts and Mastani Mahal provenance.
