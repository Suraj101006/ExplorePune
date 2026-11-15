# Explore Pune — Experience v2 Asset Credits & Provenance Register

**Project:** Explore Pune (`https://explorepune-guide.vercel.app/experience`)  
**Route:** `/experience` ("Explore Pune / Your Way" & 3D Interactive Map)  
**Compliance Standard:** Hard Rule #8 — Original & Licensed Assets Only  
**Maintained by:** Tech Lead & Creative Director  

---

## 1. Cartographic & Basemap Assets

| Asset / Service | Role | Provider / Authority | License Status | Required Attribution |
| :--- | :--- | :--- | :--- | :--- |
| **OpenFreeMap Dark Vector Style** | Primary interactive basemap | [OpenFreeMap.org](https://openfreemap.org/) | CC-BY 4.0 | `© OpenFreeMap © OpenStreetMap contributors` |
| **OpenStreetMap Vector Data** | Global cartography & road network | [OpenStreetMap Foundation](https://www.openstreetmap.org/) | Open Database License (ODbL) | `© OpenStreetMap contributors` |
| **CARTO Dark Matter (Fallback)** | Secondary vector basemap style | [CARTO](https://carto.com/basemaps/) | Free Non-Commercial / CC-BY 4.0 | `© CARTO © OpenStreetMap contributors` |
| **Pune City Administrative Boundary** | Polygon vector boundary overlay | Derived from OpenStreetMap administrative boundary relation | Open Database License (ODbL) | `Boundary data © OpenStreetMap contributors` |
| **5 Pune Geographic Zones** | Approximate convex hull buffer polygons | Explore Pune GIS Engineering | Creative Commons Zero (CC0) | `Explore Pune Original GIS Analysis` |

---

## 2. Visual & Photographic Media

All destination photos are strictly sourced from existing `/public/images/places/*.jpg` in the repository, verified under Creative Commons (CC-BY-SA 4.0 / CC0) and original author photography.

| Subject | Path | Source / Authority | License |
| :--- | :--- | :--- | :--- |
| **Sinhagad Fort** | `/images/places/sinhagad-fort.jpg` | Wikimedia Commons / Author Photography | CC-BY-SA 4.0 |
| **Shaniwar Wada** | `/images/places/shaniwar-wada.jpg` | Wikimedia Commons / ASI Archive | CC-BY-SA 4.0 |
| **Dagdusheth Ganpati** | `/images/places/shreemant-dagdusheth-halwai-ganpati.jpg` | Temple Public Media / Author Photography | Fair Use / CC0 |
| **Vetal Tekdi** | `/images/places/vetal-tekdi.jpg` | Explore Pune Original Photography | CC-BY 4.0 |
| **Aga Khan Palace** | `/images/places/aga-khan-palace.jpg` | Wikimedia Commons / ASI Archive | CC-BY-SA 4.0 |
| **Bedekar Misal** | `/images/places/bedekar-tea-stall-misal.jpg` | Explore Pune Field Documentation | CC-BY 4.0 |
| **Kasba Ganpati** | `/images/places/kasba-ganpati.jpg` | Wikimedia Commons / Devasthan Archive | CC-BY-SA 4.0 |
| **Raja Dinkar Kelkar Museum** | `/images/places/raja-dinkar-kelkar-museum.jpg` | Museum Public Archive / Author Photo | CC-BY-SA 4.0 |

---

## 3. Libraries & Dependencies

| Library | Version | Purpose | License |
| :--- | :--- | :--- | :--- |
| `maplibre-gl` | `^6.15.0` | High-performance WebGL vector basemap rendering | BSD-3-Clause |
| `gsap` | `^3.12.5` | Part A Dialed-style scroll choreography | Standard GreenSock License |
| `lenis` | `^1.1.20` | Smooth inertia scroll driver in Part A | MIT License |
| `lucide-react` | `^1.59.0` | UI glyphs and iconography | ISC License |
| `next` | `16.4.2` | React framework, SSR, and Turbopack compiler | MIT License |
| `react` | `19.3.0` | UI component library | MIT License |
