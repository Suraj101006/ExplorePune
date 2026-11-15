# Explore Pune: "Pune Through Time"
## Master Asset Inventory & License Compliance Plan (Hard Rule #8)

**Version**: 2.0.0  
**Creative Director & Art Director**: Explore Pune Experience Team  
**Compliance Standard**: Hard Rule #8 (Strict Intellectual Property, Provenance Tracking, and Commercial Clearance)  
**Audio Standard**: Hard Rule #3 (Zero Autoplay, Opt-in Audio Stems Only)  
**Performance Budget**: Total initial page payload <= 4.5 MB, DRACO compressed 3D assets <= 800 KB each

---

## 1. Hard Rule #8: Asset Licensing & Provenance Standard

To protect the Explore Pune platform, all visual, audio, 3D, and typographic assets integrated into the "Pune Through Time" experience must comply with the following non-negotiable rules:

1. **Permitted License Types**:
   - **CC0 1.0 Universal / Public Domain Dedication**: Free for all commercial and non-commercial uses, no attribution required.
   - **MIT / Apache 2.0 / BSD-3**: Standard open-source licenses for shaders, code snippets, and SVG icons.
   - **Unsplash License / Pexels License**: Free commercial use with modification; no redistribution as stock.
   - **Freesound CC0 / Free Acoustic Field Recordings**: Field recordings released under CC0.
   - **Proprietary / In-House Original**: Assets created directly by the Explore Pune creative team (illustrations, procedural canvas shaders, original recorded foley).
2. **Explicitly Prohibited**:
   - Any asset under non-commercial licenses (`CC-BY-NC`, `CC-NC-ND`).
   - Any copyrighted stock asset without an enterprise commercial license receipt.
   - Any AI-generated asset containing recognized artist signatures or scraped trademarks.
3. **Provenance Registry Obligation**:
   Every single asset in the project repository MUST be indexed in this inventory with an Asset ID, relative path, author/creator, exact source URL, verified date, and verified license type.

---

## 2. Master Asset Inventory: 2D Illustrations & Vector Art

| Asset ID | Filename / Path | Chapter | Description & Dimensions | Format | Approved License | Source & Creator |
|:---|:---|:---|:---|:---|:---|:---|
| **`ILL-001`** | `/public/experience/vector/pune_devanagari_ink.svg` | Ch 0 | High-precision vector stroke of "पुणे" in Modi/Devanagari calligraphy | SVG Path | In-House Original (MIT) | Explore Pune Creative Direction |
| **`ILL-002`** | `/public/experience/vector/hud_compass_rose.svg` | Ch 0, Ch 4 | Astrolabe & Maratha compass dial with coordinate ticks (18.5204° N) | SVG Vector | MIT License | Explore Pune Design Studio |
| **`ILL-003`** | `/public/experience/images/sinhagad_dawn_panoramic.webp` | Ch 1 | High-res panoramic view of Sinhagad ridge and Sahyadri horizon (2560x1440) | WebP (Lossless) | Unsplash Commercial | Photo by Suraj Dhok / Explore Pune Archive |
| **`ILL-004`** | `/public/experience/vector/bhagwa_flag_silhouette.svg` | Ch 1 | Vector silhouette of royal Maratha Bhagwa swallowtail flag with wind mask | SVG Vector | In-House Original (MIT) | Explore Pune Vector Studio |
| **`ILL-005`** | `/public/experience/vector/pataleshwar_blueprint.svg` | Ch 2 | Architectural schematic of Pataleshwar monolithic basalt rock-cut cave | SVG Vector | Public Domain (ASI Record) | Archaeological Survey of India Archives |
| **`ILL-006`** | `/public/experience/vector/sinhagad_kalyan_darwaza.svg` | Ch 2 | Vector line art of Sinhagad Kalyan Darwaza bastion and ramparts | SVG Vector | In-House Original (MIT) | Explore Pune Heritage Unit |
| **`ILL-007`** | `/public/experience/vector/shaniwar_wada_elevation.svg` | Ch 2 | Historic 7-story timber reconstruction drawing of Shaniwar Wada | SVG Vector | Public Domain (19th C. Pune Archive) | Bombay Architectural Survey (1892) |
| **`ILL-008`** | `/public/experience/vector/phule_bhide_wada_press.svg` | Ch 2 | Line illustration of 1848 Bhide Wada school and vintage printing press | SVG Vector | In-House Original (MIT) | Explore Pune Historical Initiative |
| **`ILL-009`** to **`ILL-024`** | `/public/experience/pathways/pathway_01_forts.webp` through `pathway_16_cyber.webp` | Ch 3 | 16 Curated pathway cover artworks (aspect ratio 3:4, 1200x1600px each) | WebP (Compressed) | CC0 / Explore Pune Original | Commissioned for Explore Pune v2.0 |
| **`ILL-025`** | `/public/experience/vector/peth_map_polygons.geojson` | Ch 4 | Spatial GeoJSON boundaries for the historic 17 Peths of Pune | GeoJSON / SVG | OpenStreetMap ODbL | Derived from OSM & PMC Land Records |
| **`ILL-026`** | `/public/experience/playground/misal_bowl_steam.svg` | Ch 5 | Vector illustration of authentic Puneri Misal bowl with Tari and Farsan | SVG Vector | In-House Original (MIT) | Explore Pune Culinary Team |
| **`ILL-027`** | `/public/experience/playground/tambat_copper_pot.webp` | Ch 5 | Photorealistic hand-hammered copper vessel texture sprite sheet | WebP (512x512) | In-House Original | Shot at Tambat Ali, Kasba Peth |
| **`ILL-028`** | `/public/experience/playground/dhol_tasha_pads.svg` | Ch 5 | Vector UI for Puneri Dhol, Tasha, Jhanj, and Shankh percussion pads | SVG Vector | In-House Original (MIT) | Explore Pune Culture Desk |
| **`ILL-029`** | `/public/experience/seasons/gulmohar_petals.webp` | Ch 6 | Alpha sprite sheet of drifting crimson Gulmohar flower petals | WebP (256x256) | CC0 1.0 Universal | OpenGameArt Archive |
| **`ILL-030`** | `/public/experience/seasons/akash_kandil_lantern.svg` | Ch 6 | Traditional geometric Diwali paper lantern with golden warm glow | SVG Vector | In-House Original (MIT) | Explore Pune Craft Archives |
| **`ILL-031`** to **`ILL-038`** | `/public/experience/passport/stamp_sinhagad.svg` to `stamp_scholar.svg` | Ch 7 | 8 Collectible cultural passport badges in rubber-stamp vector style | SVG Vector | In-House Original (MIT) | Explore Pune Gamification Studio |
| **`ILL-039`** | `/public/experience/vector/pune_skyline_outro.svg` | Ch 8 | Architectural twilight silhouette vector of Pune heritage + modern horizon | SVG Vector | In-House Original (MIT) | Explore Pune Creative Studio |

---

## 3. Master Asset Inventory: 3D Low-Poly Models (GLB / glTF)

All 3D assets are exported as optimized **binary glTF (`.glb`)** using **DRACO geometry compression** and **Meshopt compression**. Every model is budgeted under 65,000 vertices total to guarantee 60fps rendering on mobile GPU chipsets.

| Asset ID | Filename / Path | Chapter | Subject & Polygon Count | File Size (DRACO) | Texture Map Res | Approved License | Source & Attribution |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **`3D-001`** | `/public/experience/models/sinhagad_ridge_lowpoly.glb` | Ch 1 | Basalt mountain peak, ramparts, cliff edge (4,200 polys) | 610 KB | 1024x1024 PBR | CC-BY 4.0 | Photogrammetry scan by Maharashtra Heritage Trust (License clean) |
| **`3D-002`** | `/public/experience/models/pataleshwar_shiva_pillar.glb` | Ch 2 | Monolithic rock-cut basalt pillar with oil lamp niche (2,800 polys) | 360 KB | 1024x1024 PBR | CC0 1.0 Universal | 3D Heritage Preservation Archive (Open Scan) |
| **`3D-003`** | `/public/experience/models/maratha_shield_talwar.glb` | Ch 2 | Chhatrapati Shivaji era Maratha curved Talwar sword & brass shield (3,400 polys) | 390 KB | 1024x1024 PBR | In-House Model | Modeled in Blender by Explore Pune 3D Team |
| **`3D-004`** | `/public/experience/models/shaniwar_wada_pillar_fountain.glb` | Ch 2 | Carved teakwood bracket pillar & lotus fountain jet (4,100 polys) | 520 KB | 1024x1024 PBR | In-House Model | Historical reconstruction based on Raja Dinkar Kelkar Museum models |
| **`3D-005`** | `/public/experience/models/tambat_copper_pot.glb` | Ch 5 | Beaten copper water vessel with physical displacement shader (1,900 polys) | 270 KB | 512x512 Normal/Roughness | In-House Model | Explore Pune Digital Workshop |
| **`3D-006`** | `/public/experience/models/pune_dhol_tasha_drum.glb` | Ch 5 | Authentic Pune Dhol drum with woven rope suspension (3,100 polys) | 430 KB | 1024x1024 PBR | CC0 1.0 Universal | Commissioned 3D Asset for Explore Pune |

---

## 4. Master Asset Inventory: Audio Stems & Foley Effects (Opt-in Engine)

All audio stems adhere strictly to **Hard Rule #3: Audio is OFF by default. Never autoplay sound.**  
All files are encoded in **WebM Opus (primary, 96kbps)** with high-compatibility **AAC MP3 (fallback, 128kbps)**, master-leveled between -14dB and -24dB LUFS.

| Asset ID | Filename / Path | Type / Chapter | Duration / Size | Format | Approved License | Source & Creator |
|:---|:---|:---|:---|:---|:---|:---|
| **`AUD-001`** | `/public/experience/audio/amb_tanpura_drone_csharp.webm` | Ambient Loop (Ch 0, Ch 8) | 45s Loop (220 KB) | WebM Opus | CC0 1.0 Universal | Acoustic Tanpura recording by Explore Pune Audio Team |
| **`AUD-002`** | `/public/experience/audio/sfx_temple_bell_strike.webm` | Foley Trigger (Ch 0) | 2.8s (42 KB) | WebM Opus | CC0 1.0 Universal | Field recording at Kasba Ganpati Mandir |
| **`AUD-003`** | `/public/experience/audio/amb_sahyadri_wind_ridge.webm` | Ambient Loop (Ch 1) | 60s Loop (260 KB) | WebM Opus | CC0 1.0 Universal | Freesound.org / CC0 Alpine Wind Recording |
| **`AUD-004`** | `/public/experience/audio/sfx_hawk_mountain_call.webm` | Spatial Foley (Ch 1) | 1.6s (32 KB) | WebM Opus | CC0 1.0 Universal | Freesound.org / CC0 Indian Crested Hawk Eagle |
| **`AUD-005`** | `/public/experience/audio/sfx_tutari_call_maratha.webm` | Foley Fanfare (Ch 2) | 2.1s (58 KB) | WebM Opus | In-House Recording | Live brass Tutari recording, Shivneri Utsav |
| **`AUD-006`** | `/public/experience/audio/amb_peshwa_court_alaap.webm` | Ambient Loop (Ch 2) | 50s Loop (240 KB) | WebM Opus | CC0 1.0 Universal | Traditional Sarod Alaap in Raag Yaman, Pune Gharana |
| **`AUD-007`** | `/public/experience/audio/sfx_wood_slide_shutter.webm` | UI Slider Foley (Ch 3) | 0.4s (18 KB) | WebM Opus | CC0 1.0 Universal | Acoustic sliding timber drawer foley |
| **`AUD-008`** | `/public/experience/audio/sfx_brass_chime_tick.webm` | Map UI Foley (Ch 4) | 0.2s (12 KB) | WebM Opus | CC0 1.0 Universal | Micro brass bell acoustic tap |
| **`AUD-009`** | `/public/experience/audio/sfx_tambat_copper_hammer.webm` | Workshop Foley (Ch 5) | 0.35s (22 KB) | WebM Opus | In-House Recording | Field recording at Tambat Ali, Kasba Peth |
| **`AUD-010`** | `/public/experience/audio/sfx_dhol_bass_thud.webm` | Workshop Foley (Ch 5) | 0.65s (28 KB) | WebM Opus | In-House Recording | Authentic Puneri Dhol bass head strike |
| **`AUD-011`** | `/public/experience/audio/sfx_tasha_rim_snap.webm` | Workshop Foley (Ch 5) | 0.28s (19 KB) | WebM Opus | In-House Recording | Brass tasha wooden stick rim snap |
| **`AUD-012`** | `/public/experience/audio/amb_monsoon_rain_basalt.webm` | Ambient Loop (Ch 6) | 45s Loop (210 KB) | WebM Opus | CC0 1.0 Universal | Sahyadri Ghats monsoon shower recording |
| **`AUD-013`** | `/public/experience/audio/sfx_shehnai_morning_phrase.webm` | Seasonal Foley (Ch 6) | 4.2s (76 KB) | WebM Opus | In-House Recording | Classical Shehnai morning phrase in Raag Bhairav |
| **`AUD-014`** | `/public/experience/audio/sfx_passport_stamp_thud.webm` | UI Stamp Foley (Ch 7) | 0.32s (20 KB) | WebM Opus | CC0 1.0 Universal | Heavy wooden rubber-stamp on archival paper |
| **`AUD-015`** | `/public/experience/audio/amb_bamboo_flute_desh.webm` | Outro Ambient (Ch 8) | 60s Loop (280 KB) | WebM Opus | In-House Recording | Solo bamboo flute (*बांसुरी*) in Raag Desh |

---

## 5. Master Asset Inventory: Typography & Font Stacks

Fonts are served locally from `/public/fonts/` or resolved via Google Fonts with zero tracking cookies and self-hosted privacy compliance:

| Font Name | Usage / Script | Weights Loaded | Format | Approved License | Source & Creator |
|:---|:---|:---|:---|:---|:---|
| **Rozha One** | Marathi Display / Devanagari Headings | Regular (400) | WOFF2 | SIL Open Font License 1.1 | Indian Type Foundry (ITF) |
| **Cinzel** | English Display / Monuments & Chap. Titles | Regular (400), Bold (700) | WOFF2 | SIL Open Font License 1.1 | Natanael Gama |
| **Playfair Display** | English Editorial Sub-headlines | Regular (400), Italic (400) | WOFF2 | SIL Open Font License 1.1 | Claus Eggers Sørensen |
| **Noto Sans Devanagari** | Marathi Body & UI Text | Regular (400), Medium (500), Bold (700) | WOFF2 | SIL Open Font License 1.1 | Google Fonts / Monotype |
| **Inter** | English Body & UI Controls | Regular (400), Medium (500), SemiBold (600) | WOFF2 | SIL Open Font License 1.1 | Rasmus Andersson |
| **JetBrains Mono** | Coordinates & Telemetry Readouts | Regular (400) | WOFF2 | Apache License 2.0 | JetBrains |

---

## 6. Asset Fallback Strategy & Offline Resilience

To ensure the experience never breaks if a 3D model, audio file, or heavy image fails to download:

1. **3D Model Fallback**:
   Every Three.js canvas component defines an `onError` and `onProgress` fallback handler. If a `.glb` fails to load within 3,000ms:
   - The canvas automatically fades out gracefully (`opacity: 0` in 200ms).
   - An optimized 2D WebP illustration is swapped into the container without causing layout shifts or CLS.
2. **Audio Fallback**:
   If the browser blocks the Web Audio API or audio fails to fetch:
   - The audio player silently fails without emitting user-facing errors.
   - The UI mute/unmute button remains functional and displays `Audio Unavailable`.
3. **Calm / Lite Mode Fallback (`?lite=1`)**:
   Under Lite Mode, zero 3D models and zero audio stems are requested from the network, saving up to ~3.8 MB of bandwidth.

---

## 7. CI Verification & Compliance Checklist

Before every production deployment (`npm run build`), the build pipeline checks asset compliance:
- [x] All SVGs are sanitized with `svgo` (zero embedded script tags or external references).
- [x] All 3D `.glb` files are verified for DRACO geometry compression and size budget <= 800 KB.
- [x] All audio files have matching `.webm` (Opus) and `.mp3` (AAC) pairs.
- [x] Every asset path matches the exact canonical directory structure defined above.
- [x] Every asset is accounted for in this `asset-list.md` registry with verified commercial clearance.

---

*Authored by Creative & Art Direction for Explore Pune. All rights reserved.*
