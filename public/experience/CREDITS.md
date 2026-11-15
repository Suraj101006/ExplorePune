# Explore Pune — Experience Tab Asset Credits & Provenance Register

**Project:** Explore Pune (`https://explorepune-guide.vercel.app/experience`)  
**Route:** `/experience` ("Pune Through Time")  
**Compliance Standard:** Hard Rule #8 — Original & Licensed Assets Only  
**Audio Budget Standard:** Under 2 MB Payload Budget (Current bundle: ~573 KB total across WebM Opus & MP3)  
**Audio Policy:** Hard Rule #3 — Strictly OFF by default, user opt-in only, auto-pause on hidden tab  
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

*All audio assets are strictly OFF by default per Hard Rule #3 and play only following explicit user opt-in gesture.*  
*All files are compressed via `ffmpeg` into WebM (Opus 64kbps) and MP3 (LAME 96kbps) for cross-browser efficiency, backed by a real-time Web Audio API procedural synthesis fallback.*

| Sound ID / File | Category | Description & Synthesis Method | Codec & Size | Source / Tool | License Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/experience/audio/preloader-drone.webm` / `.mp3` | Ambient Loop | Grounding meditative C2/G2/C3 tanpura harmonic drone for Chapter 0 Preloader & Chapter 8 Outro | Opus: 32 KB<br>MP3: 48 KB | Procedural code synthesis (`scripts/generate-audio-stems.mjs`) | MIT / Original Production |
| `/experience/audio/sahyadri-wind.webm` / `.mp3` | Ambient Loop | High-altitude mountain wind gust loop across Sinhagad and Sahyadri ridgelines with whistle resonance | Opus: 31 KB<br>MP3: 48 KB | Filtered Brownian noise & procedural LFO synthesis | MIT / Original Production |
| `/experience/audio/peshwa-court.webm` / `.mp3` | Ambient Loop | Royal Peshwa court instruments: Tanpura drone in D with resonant sitar sympathetic strings & sanai vibrato gamak | Opus: 45 KB<br>MP3: 48 KB | Multi-oscillator harmonic additive synthesis | MIT / Original Production |
| `/experience/audio/market-bustle.webm` / `.mp3` | Ambient Loop | Pune Mandai & Tulshibaug bazaar atmosphere with diffused murmur and distant temple/shop bell pings | Opus: 30 KB<br>MP3: 48 KB | Formant-filtered noise with procedural bell decay | MIT / Original Production |
| `/experience/audio/dhol-tasha.webm` / `.mp3` | Ambient Loop | Traditional Puneri Dhol-Tasha festive rhythm loop dynamically linked to scroll velocity | Opus: 31 KB<br>MP3: 36 KB | Physical drum skin pitch-drop & tasha rim transient synthesis | MIT / Original Production |
| `/experience/audio/monsoon-rain.webm` / `.mp3` | Ambient Loop | Pune monsoon downpour with continuous rain wash, droplet impacts, and distant Sahyadri thunder | Opus: 32 KB<br>MP3: 48 KB | Filtered rain texture & sub-bass thunder synthesis | MIT / Original Production |
| `/experience/audio/hammer-strike.webm` / `.mp3` | Interaction SFX | Steel hammer striking Kasba Tambat red copper vessel with 880Hz/1760Hz metallic resonance | Opus: 7 KB<br>MP3: 7 KB | Dual-mode copper bell decay synthesis | MIT / Original Production |
| `/experience/audio/coin-drop.webm` / `.mp3` | Interaction SFX | Peshwa Shivrai bronze/silver coin dropping and rattling on stone pavement with jittered bounces | Opus: 6 KB<br>MP3: 9 KB | High-Q sinusoidal FM decay synthesis | MIT / Original Production |
| `/experience/audio/misal-sizzle.webm` / `.mp3` | Interaction SFX | Sizzling hot spicy Katakirrr misal tarri and mustard seed tempering (tadka) | Opus: 10 KB<br>MP3: 14 KB | Filtered crackling noise burst synthesis | MIT / Original Production |
| `/experience/audio/ui-click.webm` / `.mp3` | Interaction SFX | Tactile wooden/mechanical UI button click transient for seamless interaction feedback | Opus: 1.7 KB<br>MP3: 1.9 KB | 10ms micro-envelope impulse synthesis | MIT / Original Production |
| `/experience/audio/win-fanfare.webm` / `.mp3` | Interaction SFX | Uplifting pentatonic victory chime arpeggio (D5, F#5, A5, D6) for mini-game completion | Opus: 21 KB<br>MP3: 20 KB | Harmonic chime arpeggiator synthesis | MIT / Original Production |
| `SyntheticAudioEngine` (Web Audio API) | Engine Fallback | 100% offline, zero-network procedural audio engine synthesizing all ambient tracks & SFX directly via AudioContext | In-memory 0 KB | Web Audio API procedural synthesis fallback | MIT / Original Production |

**Total Audio Payload:** 573 KB (28% of the 2 MB hard budget).

---

## 3. Libraries & Dependencies

| Package | Version | Purpose | License |
| :--- | :--- | :--- | :--- |
| `howler` | `2.2.4` | Cross-browser audio engine with real-time rate control & crossfading | MIT License |
| `@types/howler` | `2.2.12` | TypeScript definitions for Howler.js | MIT License |
| `gsap` | `3.12.5` | High-performance animation & ScrollTrigger choreography | Standard GreenSock License |
| `lenis` | `1.1.20` | Smooth inertia scroll driver | MIT License |
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
