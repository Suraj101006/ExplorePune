# Explore Pune: "Pune Through Time" (पुणे: काळाच्या प्रवासात)
## Master Experience Storyboard & Chapter Narrative Architecture

**Version**: 2.0.0  
**Creative Director & Art Director**: Explore Pune Experience Team  
**Design Philosophy**: National Geographic Architectural Editorial meets Authentic Maharashtrian Heritage  
**Bilingual Support**: English & Devanagari Marathi (`mr`)  
**Accessibility Standard**: WCAG 2.1 AA Compliant, Strict Zero-Autoplay Audio (Hard Rule #3), Calm/Lite Mode Support (?lite=1) (Hard Rule #4)

---

## Executive Overview & Narrative Arc

"Pune Through Time" is an episodic, scroll-choreographed interactive odyssey through the volcanic basalt bedrock, royal Maratha bastions, intellectual wadas, artisanal lanes, and contemporary cyber corridors of Pune, Maharashtra.

The experience is structured across **9 seamless chapters** (Chapters 0 through 8), designed for smooth fluid scrubbing via Lenis virtual scroll while guaranteeing a static, lightweight, CSS-only fallback for users requesting Calm/Lite mode or utilizing assistive technology.

```
+---------------------------------------------------------------------------------------------------+
| CHAPTER 0: PRELOADER ("उगम" / Genesis: Ink-drop & Calibration)                                    |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 1: ARRIVAL ("प्रवेश" / Threshold: The Basalt Horizon)                                     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 2: FOUR EPOCHS ("चार युगे" / The Four Epochs of Punawadi)                                 |
| [Pataleshwar 8th C.] -> [Sinhagad 1670] -> [Shaniwar Wada 1732] -> [Phule Wada & Modernity 1848+] |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 3: SIXTEEN PATHWAYS ("सोळा वाटा" / The 16 Living Veins)                                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 4: LIVING MAP ("जिवंत नकाशा" / Cartography of 17 Peths & 106 Sanctuaries)                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 5: PLAYGROUND ("खेळ आणि कौशल्ये" / The Tactile Workshop)                                  |
| [Misal Spice Gauge] -> [Tambat Brass] -> [Tanaji Rope] -> [Relic Brush] -> [Dhol Tasha Pad]        |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 6: SEASONS ("चार ऋतू" / The Sahyadri Breath)                                              |
| [Grishma: Summer] -> [Varsha: Monsoon] -> [Sharad: Festive Autumn] -> [Shishir: Crisp Winter]     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 7: YOUR PLAN ("नियोजन आणि पासपोर्ट" / The Pune Expedition Studio)                         |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| CHAPTER 8: OUTRO ("समारोप" / The Deccan Reverie & Horizon Portal)                                 |
+---------------------------------------------------------------------------------------------------+
```

---

## Chapter 0: Preloader — "उगम" (Genesis: Ink-drop & Calibration)

### 1. Narrative Objective
Before the physical city appears, Pune exists in historical memory and Modi script ink chronicles (*बखर*). Chapter 0 establishes the contemplative reverence of Deccan volcanic antiquity and calibrates hardware capabilities without blocking user access.

### 2. User View
- **Background**: Absolute pitch-black void (`#04060a`, Basalt 950) with 80 ambient golden amber dust motes floating gently in zero-gravity.
- **Centerpiece**: A calligraphic ink-drop ripples outward on canvas. As the ripple reaches 200px radius, the Devanagari word **"पुणे"** draws itself via stroke-dasharray laser line in Paithani gold (`#eab308`).
- **Telemetry Stream**: Subtle top-left coordinate readout:  
  `COORDINATES: 18.5204° N, 73.8567° E • ELEVATION: 560M • DECCAN VOLCANIC BASALT • 106 PLACES VERIFIED`
- **Numeral Counter**: Large, majestic Devanagari numerals cycling smoothly:  
  `०% → २५% → ५०% → ७५% → १००%` (`0% → 100%` in English mode).
- **Control Bar**: Skip button (`लगेच सुरू करा` / `Skip Intro`), audio opt-in toggle button with clear mute icon, and Calm/Lite mode toggle.

### 3. Scroll Length & Budget
- **Length**: `0vh` (Viewport-locked modal overlay).
- **Timing**: Automatic duration 2.4 seconds, or user tap on `Skip` / click to dismiss immediately.
- **Budget**: `< 150KB` SVG + script execution payload.

### 4. Motion Beats & Keyframe Choreography
- **Beat 01 (0.0s – 0.5s)**: Blackout curtain. Telemetry coordinates typewriter effect in Monsoon Blue (`#38bdf8`) with linear 15ms character interval.
- **Beat 02 (0.5s – 1.6s)**: Virtual ink droplet impacts center canvas; radial water-ring shader expands with `--exp-ease-expo-out`. The Devanagari stroke for **"पुणे"** draws over 1,100ms.
- **Beat 03 (1.6s – 2.2s)**: Golden particle burst accelerates; Devanagari counter snaps to १००% with slight spring overshoot (`--exp-ease-spring-gentle`).
- **Beat 04 (2.2s – 2.5s)**: Shutter wipe iris expands outward revealing the dawn sky of Chapter 1.

### 5. Sound Cues
- *Strict Hard Rule #3 Compliance: Audio is 100% MUTED by default.*
- **Ambient Cue (Opt-in)**: C# fundamental deep Tanpura resonant drone (432Hz harmonic tuning, volume -20dB LUFS).
- **Foley Trigger**: Soft traditional bronze temple bell (*घंटा*) strike as the counter hits १००% (volume -14dB, high-frequency cutoff at 8kHz).

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Bypasses canvas particles and SVG stroke drawing completely.
- Displays static Pune emblem with instantaneous text fade (`opacity: 0 → 1` in 200ms) and an immediate "अनुभव एक्सप्लोर करा" / "Enter Experience" button.

---

## Chapter 1: Arrival — "प्रवेश" (Threshold: The Basalt Horizon)

### 1. Narrative Objective
Placing the visitor high atop the Sahyadri ridge at Sinhagad Fort, overlooking the expanse of Punawadi where rivers Mula and Mutha converge. This chapter establishes the physical, geographical, and historical grounding of the city.

### 2. User View
- **Visual Composition**: Deep multiplane stereoscopic 3D parallax view.
  - **Foreground (Plane 3)**: Chiseled Deccan volcanic basalt boulders (`#080b11`), mountain shrubs, and stone masonry boundary.
  - **Midground (Plane 2)**: The ramparts of Tanaji's Cliff (तान्हाजी कडा) and a weather-worn saffron Maratha pennant (*भगवा ध्वज*) fluttering in Sahyadri ridge gusts.
  - **Background (Plane 1)**: Panoramic mist rolling across Khadakwasla lake and the sprawling Pune urban basin in the distance.
- **Sky Shader**: Procedural sky dome dynamically rendered according to real-time Pune local time (Dawn saffron `#ea580c`, Noon brilliant azure `#0284c7`, Sunset burnt terracotta `#9a3412`, Night starry basalt `#080b11`).
- **Typography**:
  - English: *"Pune: Sahyadri’s Crown, Sanctuary of Intellect"*
  - Marathi: *"सह्याद्रीचे कडे आणि मुळा-मुठेचे खोरे — हे आमचे पुणे"*
- **Badge**: Dynamic pill badge with live Pune temperature and wind velocity.

### 3. Scroll Length & Budget
- **Scroll Length**: `150vh` (Pins at 100vh for 50vh scrub before handing over to Epochs).
- **Virtual Scroll Scrub**: Lenis dampening 0.82 for weighty architectural deceleration.

### 4. Motion Beats & Keyframe Choreography
- **0% – 30% Scroll**: Foreground basalt rocks separate laterally (`transform: translate3d(-140px, 0, 0)` on left boulder, `+140px` on right boulder), opening a natural portal.
- **30% – 70% Scroll**: Saffron pennant ripples through vertex shader wind displacement (`frequency: 2.4, amplitude: 0.15`). The headline typography eases down by 24px and locks in place.
- **70% – 100% Scroll**: Camera pitches down 12 degrees while Sahyadri mist layers dissolve from `opacity: 0.85` to `0.20`, funneling the gaze into the subterranean rock cavern of Pataleshwar.

### 5. Sound Cues
- **Ambient Cue**: Sahyadri alpine wind loop with filtered pink noise (-24dB).
- **Spatial Foley**: Distinct cry of a Sahyadri mountain eagle / hawk panning subtly across stereo channels at 45% scroll position.

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Replaces WebGL vertex wind shader with an optimized static CSS photo hero.
- Replaces 3D camera pan with pure CSS sticky positioning. Zero horizontal parallax shift.

---

## Chapter 2: Four Epochs — "चार युगे" (The Four Epochs of Punawadi)

### 1. Narrative Objective
To illustrate Pune’s continuous civilization through 1,300 years of documented history. Pune is not merely a modern tech hub; it is an organic continuum spanning rock-cut caves, Maratha guerrilla warfare, Peshwa courtly grandeur, and social revolution.

### 2. User View
A pinned full-viewport interactive timeline theatre. As the user scrolls, the background architecture and focal 3D relic morph smoothly across four distinct historical epochs:

```
+---------------------------------------------------------------------------------------------------------+
| EPOCH 1: 8th Century (Rashtrakuta)      | Subterranean Basalt Temple, Monolithic Nandi Mandapa, Diya    |
| EPOCH 2: 17th Century (Maratha Swarajya)| Sinhagad Ramparts, Kalyan Darwaza, Torches, Talwar & Dhal    |
| EPOCH 3: 18th Century (Peshwa Empire)   | Shaniwar Wada, Hazari Karanje, Carved Teakwood, Paithani Silk |
| EPOCH 4: 19th-21st C. (Social & Cyber)  | Bhide Wada (1848), Fergusson (1885), Hinjawadi IT Silicon     |
+---------------------------------------------------------------------------------------------------------+
```

- **Layout**:
  - Left Pane (45% width): Epoch year in giant outline typography (`750 CE`, `1670 CE`, `1732 CE`, `1848–2026 CE`), Marathi epoch moniker in bold Devanagari (*"पाषाण युग"*, *"स्वराज्य युग"*, *"पेशवाई वैभव"*, *"ज्ञान व आधुनिकता"*), concise historical narrative, verified artifact citation.
  - Right Pane (55% width): Photorealistic / 3D low-poly artifact rotating in physical space with authentic lighting.

### 3. Scroll Length & Budget
- **Scroll Length**: `400vh` (100vh per epoch, pinned viewport).
- **Pin Duration**: 4 stages with distinct transition threshold marks at 25%, 50%, 75%, and 100%.

### 4. Motion Beats & Keyframe Choreography
- **Stage 1 (0% – 25% Scroll) — 8th c. Pataleshwar**:
  - Palette: Deep charcoal basalt (`#1c1917`) and flickering mustard diya flame (`#f59e0b`).
  - Artifact: Carved stone Shiva Lingam & monolithic pillar rotating slowly.
  - Ambient particles: Rising incense smoke sprites.
- **Stage 2 (25% – 50% Scroll) — 1670 Sinhagad Maratha Swarajya**:
  - Cross-dissolve: Basalt cavern fractures via voronoi shatter into Sinhagad stone battlements.
  - Palette: Deep night sky and blazing torchlight saffron (`#ea580c`).
  - Artifact: Chhatrapati Shivaji era Maratha *Dhal-Talwar* (shield and curved steel sword) glinting under firelight.
- **Stage 3 (50% – 75% Scroll) — 1732 Shaniwar Wada Peshwai**:
  - Cross-dissolve: Torches transition into ornate brass chandeliers; heavy dark timber pillars rise from floor.
  - Palette: Polished teak brown (`#78350f`) and Paithani zari gold (`#eab308`).
  - Artifact: Water ripples of the famous Hazari Karanje (Fountain of a Thousand Jets) with floating rose petals.
- **Stage 4 (75% – 100% Scroll) — 1848–Present Modern Renaissance**:
  - Cross-dissolve: Wada lattices morph into the wooden study desk of Mahatma Jyotirao & Savitribai Phule, transitioning into architectural blueprint lines of Fergusson College and the fiber-optic grid of Hinjawadi.
  - Palette: Parchment cream (`#f6efe0`) and electric monsoon cyan (`#0284c7`).

### 5. Sound Cues
- **Epoch 1**: Low cavernous stone resonance, slow hollow water droplets falling on basalt stone.
- **Epoch 2**: Crisp metallic unsheathing of sword, short authentic Tutari horn call (-16dB), crackling bonfire.
- **Epoch 3**: Classical sarod/sitar *alaap* phrase in Raag Yaman, soft courtyard fountain babble.
- **Epoch 4**: Sound of quill on Modi paper, vintage mechanical printing press rhythm, transitioning to subtle clean digital hum.

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Removes the 400vh pinning and morphing WebGL canvas.
- Renders as a clean 4-card vertical stack or responsive tabbed timeline.
- High-contrast typography with instant tab switching.

---

## Chapter 3: Sixteen Pathways — "सोळा वाटा" (The 16 Living Veins)

### 1. Narrative Objective
To break the monolithic guidebook mold by grouping Pune’s 106 verified destinations into 16 thematic, curated pathways that celebrate culinary heritage, artisan guilds, fort treks, bakery traditions, and scholarly pursuits.

### 2. User View
- **Composition**: A horizontal cinematic rail scrolling over a subtle parchment topographic map of Pune’s surrounding hills.
- **Interactive Rail**: 16 tall editorial cards (aspect ratio 3:4). Each card features:
  - Pathway Number in Devanagari numeral badge (*०१* to *१६*).
  - High-resolution hero photography with subtle parallax depth.
  - Marathi and English titles:
    1. *किल्ले आणि पराक्रम* (Forts & Valor)
    2. *पेठांची सफर* (The Historic Peth Trails)
    3. *मिसळ महामार्ग* (The Misal & Street Food Odyssey)
    4. *इराणी कॅफे आणि बेकऱ्या* (Irani Cafes & Heritage Bakeries)
    5. *तांबट आळी आणि हस्तकला* (Tambat Ali Brass Artisans)
    6. *विद्येचे माहेरघर* (Institutions & Scholarly Pune)
    7. *पुणेरी गणेशोत्सव* (Manache Ganpati & Festive Faith)
    8. *संगीत आणि रंगभूमी* (Classical Music & Theatre Bastions)
    9. *सह्याद्री ट्रेक्स* (Western Ghats Treks & Waterfalls)
    10. *टेकडी संस्कृती* (ARAI, Vetal & Taljai Tekdi Culture)
    11. *जुने वाडे आणि स्थापत्य* (Peshwa Wada Architecture)
    12. *खवय्ये कट्टा* (Chitale Bandhu, Sujata & Midnight Food)
    13. *संग्रहालये आणि ऐतिहासिक दस्तऐवज* (Museums & Archives)
    14. *आध्यात्मिक वारसा* (Alandi & Dehu Warkari Path)
    15. *सायकल आणि कट्टा कट्टा* (Cycling Routes & Open Cafes)
    16. *सायबर पुणे आणि स्टार्टअप्स* (Cybercity, Tech & Global Pulse)
- **Interactive Indicator**: Drag handle with magnetic cursor snapping and mouse wheel horizontal deflection.

### 3. Scroll Length & Budget
- **Scroll Length**: `300vh`.
- **Horizontal Travel**: Translates the 16-card track from `translateX(0px)` to `translateX(-calc(100% - 100vw))` across the 300vh scroll span.

### 4. Motion Beats & Keyframe Choreography
- **Scroll Mapping**: Strict linear progress calculation: `scrollProgress = (window.scrollY - sectionTop) / sectionScrollDistance`.
- **Card Hover**: Active card elevates 16px with `--exp-shadow-float` and a glowing 1px gold border rim (`--exp-border-glow-gold`).
- **3D Card Tilt**: Mouse pointer position on card generates real-time `perspective(1000px) rotateX(calc(py * -8deg)) rotateY(calc(px * 8deg))`.

### 5. Sound Cues
- **Foley Slider**: Tactile wooden sliding shutter resonance as cards glide left/right (-24dB).
- **Hover Micro-tone**: Soft warm marimba tone tuned to Indian pentatonic scale (Bhoopali) on card mouseenter.

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Disables horizontal scroll hijacking.
- Renders cards as a standard responsive CSS grid (4 columns on desktop, 2 on tablet, 1 on mobile) with native touch swipe.
- Zero tilt or cursor-follow calculations.

---

## Chapter 4: Living Map — "जिवंत नकाशा" (Cartography of 17 Peths & 106 Sanctuaries)

### 1. Narrative Objective
To bridge story with actionable exploration. Pune's geography is defined by its historic 17 Peths (each founded for a specific day or trade) and 106 verified destinations. This chapter provides a spatial bird's-eye living map.

### 2. User View
- **Visual Composition**: Full-bleed WebGL / MapLibre 3D cartographic terrain tilted at a 45-degree isometric angle.
- **Key Cartographic Features**:
  - The serpentine silver-blue line of the Mutha River dividing the city.
  - Color-coded glowing vector pins across 106 verified places.
  - Boundary polygon overlays for the 17 Peths: Kasba (Oldest), Shaniwar, Raviwar, Budhwar, Shukrawar, Somwar, Mangalwar, Bhavani, Nana, Rasta, Ganj, Sadashiv, Narayan, Guruwar, Ganesh, Shivajinagar, Navi Peth.
- **"Today's Peth" Interactive Compass Dial**:
  - Bottom-right floating HUD wheel showcasing the Peth corresponding to today's day of the week (e.g., Budhwar Peth on Wednesday) with its historical trade specialty.
- **Filter Pills**: Instant toggle between Forts, Heritage, Food, Nature, and Spiritual.

### 3. Scroll Length & Budget
- **Scroll Length**: `250vh` (Camera moves along designated spline path through the valley).

### 4. Motion Beats & Keyframe Choreography
- **0% – 30% Scroll**: High orbital view (altitude 8,000m) descending swiftly down to 600m over the Kasba Ganpati temple and Shaniwar Wada.
- **30% – 70% Scroll**: Camera pans east-to-west along the heritage corridor, pins pop up with staggered spring physics (30ms interval).
- **70% – 100% Scroll**: Camera pulls back slightly to reveal the surrounding perimeter forts (Sinhagad, Purandar, Torna) ringing the horizon.

### 5. Sound Cues
- **Atmospheric Layer**: Subtle low-frequency city wind combined with distant temple chimes (-26dB).
- **Pin Interaction**: Crisp brass chime (high-Q tap, 1,400Hz, -18dB) whenever a place card or map pin is selected.

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Bypasses 3D WebGL map canvas completely.
- Loads an ultra-crisp MapLibre 2D vector map or high-resolution SVG interactive schematic map with accessible search filter buttons and expandable cards.

---

## Chapter 5: Playground — "खेळ आणि कौशल्ये" (The Tactile Workshop)

### 1. Narrative Objective
To honor Pune's living cultural artifacts through tactile, playful micro-interactions. Pune’s culture is participatory: from savoring tear-inducing Misal spice to beating copper in Tambat Ali and drumming in a Ganpati Dhol-Tasha pathak.

### 2. User View
An interactive tactile workshop dashboard featuring 5 physical mini-games / micro-interactions:
1. **The Misal Spice Gauge (काटावरचा ठसका)**:
   - Analog brass needle dial from "साधी मिसळ" (Mild) to "झणझणीत कोल्हापुरी कट" (Fiery Volcano).
   - Real-time heat distortion shader and steam particle count based on slider position.
2. **Tambat Ali Copper Beater (तांबट आळी ठोककाम)**:
   - High-resolution 3D beaten copper pot (*हंडा*).
   - Click/tap creates realistic physical metal indentations with authentic hammered metal acoustic feedback.
3. **Tanaji's Sinhagad Rope Climb (तानाजींची दोरी)**:
   - Interactive vertical drag rope physics; pulling the rope climbs the sheer basalt cliff face with historical quotes appearing at elevation milestones.
4. **Pataleshwar Relic Dusting (पाताळेश्वर उत्खनन)**:
   - Cursor acts as an archaeologist's brush, wiping away centuries of dust particles to reveal the hidden 8th-century monolithic rock carvings.
5. **Ganeshotsav Dhol-Tasha Beat Pad (ढोल-ताशा ताल)**:
   - 4-pad interactive rhythm machine:
     - Pad A: Pune Dhol (*धूम* - Deep bass thud)
     - Pad B: Tasha (*ताशा* - Sharp high-frequency rim roll)
     - Pad C: Jhanj (*झांज* - Brass cymbal crash)
     - Pad D: Shankh (*शंख* - Sacred conch fanfare)
   - Visual ripple shockwaves radiate in Peshwa Saffron across the screen.

### 3. Scroll Length & Budget
- **Scroll Length**: `200vh` (Pins during active tab interaction; allows seamless pass-through if user does not engage).

### 4. Motion Beats & Keyframe Choreography
- **Entrance**: The 5 workshop tabs animate onto screen with staggered 60ms spring bounces (`--exp-ease-spring-gentle`).
- **Tactile Feedback**: Every button press triggers an active-state scale depression to 0.96 with instant 0ms response and 150ms spring recovery.
- **Particle System**: Limited to 40 active canvas particles for steam, sparks, and shockwaves to maintain locked 60fps on mobile.

### 5. Sound Cues
- **Misal Sizzle**: Gentle oil crackle and simmering tari loop (-22dB).
- **Tambat Strike**: High-harmonic metallic ringing hammer on copper (-14dB).
- **Dhol Thud**: Authentic 55Hz acoustic bass drum strike (-10dB).
- **Tasha Snap**: Crisp 2,200Hz skin-drum rim shot (-12dB).

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Interactive canvas mini-games transform into accessible static showcases with cultural explainers, audio preview buttons (with explicit user click), and photo galleries.

---

## Chapter 6: Seasons — "चार ऋतू" (The Sahyadri Breath)

### 1. Narrative Objective
Pune’s soul shifts radically with its seasons. From the dry heat of Grishma to the mist-drenched emerald waterfalls of Varsha, this chapter captures the seasonal rhythm that defines life in the Deccan.

### 2. User View
A full-bleed atmospheric landscape showing a single iconic vantage point (Vetal Tekdi overlooking the city) morphing through the four traditional seasons:

```
+---------------------------------------------------------------------------------------------------+
| GRISHMA (उन्हाळा / Summer): 38°C dry golden heat, falling crimson Gulmohar blossoms, chilled mango |
| VARSHA (पावसाळा / Monsoon): Torrential mist, emerald hills, Tamhini waterfalls, steaming Chai    |
| SHARAD (शरद / Festive Autumn): Paithani silk, marigold garlands, blue skies, Diwali Pahat ragas   |
| SHISHIR (हिवाळा / Crisp Winter): 12°C morning fog over Mutha, dawn cycling on ARAI Tekdi, Bhutta  |
+---------------------------------------------------------------------------------------------------+
```

- **HUD Widget**: Real-time season selector and scroll-scrub barometer showing humidity, temperature, and local Maharashtrian seasonal delicacies (e.g., Aamras Puri in Grishma, Kanda Bhajji in Varsha).

### 3. Scroll Length & Budget
- **Scroll Length**: `300vh` (75vh per season).

### 4. Motion Beats & Keyframe Choreography
- **0% – 25% Scroll (Grishma)**: Canvas warm color grading (`hue-rotate(-15deg) sepia(0.35)`), Gulmohar petal particles drift diagonally downward with wind velocity.
- **25% – 50% Scroll (Varsha)**: Lightning bloom flash (100ms opacity flash), screen-space rain streaks, terrain color turns lush emerald green (`#047857`), cloud fog descends from top of viewport.
- **50% – 75% Scroll (Sharad)**: Sky clears into radiant deep blue (`#0284c7`), floating festive paper lanterns rise gently, golden warm rim light frames the hills.
- **75% – 100% Scroll (Shishir)**: Temperature drops; a ground-level fog layer rolls across screen; breath vapor condensation effect on glass perimeter.

### 5. Sound Cues
- **Grishma**: Afternoon dry wind and rhythmic cicada chorus (-22dB).
- **Varsha**: Steady monsoon rain on basalt rock, distant Sahyadri thunder roll (-16dB).
- **Sharad**: Morning Sanai (Shehnai) melody in Raag Bhairav, soft temple bells (-20dB).
- **Shishir**: Crisp morning mountain breeze, calls of the Indian Robin and Bulbul bird (-24dB).

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Removes dynamic canvas weather shaders and particle emitters.
- Renders as a 4-panel split card carousel with static photography and seasonal itinerary recommendations.

---

## Chapter 7: Your Plan — "नियोजन आणि पासपोर्ट" (The Pune Expedition Studio)

### 1. Narrative Objective
To convert emotional wonder into concrete travel reality. Users can assemble personalized itineraries, filter places according to their traveling group, and preview their collectible Pune Cultural Passport.

### 2. User View
- **Smart Itinerary Builder**:
  - 3-step filter:
    1. *Who is traveling?* (Solo, Friends, Family, Senior Citizens)
    2. *Pace & Duration?* (Half Day, 24 Hours, Weekend, 3-Day Deep Dive)
    3. *Curated Interest?* (Heritage & Forts, Culinary Explorer, Nature & Hills, Modern Pune)
- **Interactive Route Map & Timecard**: Shows verified opening hours, ticket entry prices, travel distance between points, and nearest metro/bus route.
- **Pune Digital Passport (सांस्कृतिक पासपोर्ट)**:
  - 8 collectible digital stamps (Sinhagad Conqueror, Misal Connoisseur, Wada Wanderer, Peth Historian, Tekdi Walker, Classical Rasika, Bakeries Veteran, Pune Scholar).
  - Stamp completion progress ring.

### 3. Scroll Length & Budget
- **Scroll Length**: `150vh`.

### 4. Motion Beats & Keyframe Choreography
- **Itinerary Filter Selection**: Route cards re-order with smooth FLIP animation (First, Last, Invert, Play) via `--exp-ease-expo-out` over 350ms.
- **Passport Stamp Drop**: When a user marks an itinerary item or explores a section, a digital stamp drops with a 4-degree random tilt and a subtle ink splatter particle effect.

### 5. Sound Cues
- **Card Switch**: Tactile paper leafing sound (-22dB).
- **Stamp Mark**: Heavy wooden rubber-stamp "thud" with authentic hollow desk rebound (-14dB).

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Standard zero-animation form controls with immediate instant DOM updates and high-contrast accessible list views.

---

## Chapter 8: Outro — "समारोप" (The Deccan Reverie & Horizon Portal)

### 1. Narrative Objective
To leave the traveler with an unforgettable impression of Pune’s timeless character: a city that honors its warrior and scholar roots while fearlessly embracing the future.

### 2. User View
- **Visual Composition**: Grand panoramic silhouette of the Pune skyline at dusk. Shaniwar Wada’s towering Dilli Darwaza stands in the foreground, with the distant hill temple of Parvati Hill lit by oil lamps, and the sleek modern glass towers of Senapati Bapat Road twinkling in the evening twilight.
- **Centerpiece Typography**:
  - Devanagari: *"पुण्यनगरी: जिथे इतिहास आणि भविष्य एकाच श्वासात जगतात."*
  - English: *"Pune: Where six centuries of valour meet the architects of tomorrow."*
- **Expedition Portal Actions**:
  - Primary Button: *"संपूर्ण १०६ ठिकाणे पाहा / Explore All 106 Places"* (routes to main directory).
  - Secondary Button: *"ऑफलाईन गाईड डाउनलोड करा / Download Free Itinerary Guide"* (PDF format).
  - Tertiary Button: *"समुदायात सहभागी व्हा / Join Traveler Community"*.
- **Credits & Provenance Drawer**: Respectfully acknowledging local historians, Pune Municipal archives, Marathi linguists, and open-source contributors.
- **Return to Apex**: Floating circular compass button that smoothly glides the user back to Chapter 1.

### 3. Scroll Length & Budget
- **Scroll Length**: `150vh`.

### 4. Motion Beats & Keyframe Choreography
- **0% – 60% Scroll**: Sunset saffron shifts into basalt night indigo (`#080b11`). Twilight city lights pulse with gentle 0.05Hz breathing frequency.
- **60% – 100% Scroll**: The grand Marathi quote ascends 32px with `--exp-ease-cinematic-peshwa`. Action buttons illuminate with golden rim glows (`--exp-shadow-gold-rim`).

### 5. Sound Cues
- **Final Harmonic**: Meditative solo bamboo flute (*बांसुरी*) melody in Raag Desh accompanied by soft Tanpura drone, slowly fading out over 4 seconds into evening crickets and restful silence.

### 6. Calm / Lite Mode (?lite=1) & Reduced Motion Alternative
- Static night silhouette illustration, instant button visibility, zero infinite light pulses.

---

## Master Chapter Specification Summary Table

| Ch # | Chapter Name (En / Mr) | Scroll Budget | Core 3D / WebGL Element | Sound Signature (Opt-in) | Reduced Motion Fallback |
|:---|:---|:---|:---|:---|:---|
| **0** | Preloader / *उगम* | `0vh` (Modal) | Calligraphic Ink & Gold Dust Shader | C# Tanpura & Ghanṭā Bell | Static emblem + Instant Enter |
| **1** | Arrival / *प्रवेश* | `150vh` | Stereoscopic Sinhagad Basalt Ridge | Sahyadri Wind & Hawk Call | Static CSS Hero Photo |
| **2** | Four Epochs / *चार युगे* | `400vh` | Morphing 3D Artifacts (Lingam -> Sword -> Wada -> Book) | Tutari, Sitar, Water, Press | Tabbed Historical Cards |
| **3** | 16 Pathways / *सोळा वाटा* | `300vh` | Kinetic 3D Hover Tilt Horizontal Rail | Foley Shutter & Marimba | Standard CSS Grid |
| **4** | Living Map / *जिवंत नकाशा* | `250vh` | MapLibre 45° 3D Isometric Valley & Peths | City Hum & Brass Tap Chime | 2D Clean Vector Map |
| **5** | Playground / *खेळ आणि कौशल्ये* | `200vh` | 5 Mini-Games (Misal, Tambat, Tanaji, Relic, Dhol) | Dhol Thud, Tasha, Copper Ding | Accessible Static Cards |
| **6** | Seasons / *चार ऋतू* | `300vh` | Real-time Weather Shader (Rain, Fog, Shimmer) | Rain, Cicadas, Shehnai, Wind | 4-Season Photo Panel |
| **7** | Your Plan / *नियोजन* | `150vh` | FLIP Itinerary Sorter & Passport Stamps | Paper Foley & Stamp Thud | Clean Accessible Form |
| **8** | Outro / *समारोप* | `150vh` | Twilight Skyline Silhouette & Starlight | Raag Desh Bamboo Flute | Static Editorial Footer |

---

*Authored by Creative & Art Direction for Explore Pune. All rights reserved.*
