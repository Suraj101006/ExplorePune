# Explore Pune — Experience v2 Reconnaissance Report

**Document**: recon.md  
**Date**: November 15, 2026  
**Status**: VERIFIED  
**Branch**: `experience-v2`  
**Author**: Tech Lead  

---

## 1. Destination Database & Schema Audit

### Primary Data Source
- **Path**: `data/pune_places_106.json` (and `lib/experienceData.ts`)
- **Total Places**: Exactly **106 verified destinations**.
- **Data Integrity**: 100% verified against PMC, MTDC, Maharashtra Forest Department, and ASI records.

### Schema Fields Available per Destination:
- `id` / `slug`: Unique kebab-case identifier (e.g., `sinhagad-fort`, `shaniwar-wada`, `bedekar-tea-stall-misal`).
- `name` (EN): Official English title.
- `name_mr` (मराठी): Authentic Marathi Devanagari title (e.g., `सिंहगड किल्ला (कोंढाणा)`, `शनिवार वाडा`).
- `category_slug`: Primary category key (`forts`, `heritage`, `temples`, `museums`, `parks`, `nature`, `food`).
- `image_url`: Optimized static cover photo in `/images/places/<slug>.jpg`.
- `description` / `description_mr`: Detailed historical and cultural narratives.
- `address` / `address_mr`: Ground-verified address and street landmarks.
- `latitude` / `longitude`: Decimal GPS coordinates centered around Pune (18.5204° N, 73.8567° E).
- `best_time` / `best_time_mr`: Seasonal recommendation (e.g., "July to February").
- `entry_fee`: Number (0 for free, ₹25 for ASI monuments, ₹100 for Kelkar Museum).
- `fee_status`: `'free'` | `'paid'` with detailed breakdowns in `fee_details`.
- `opening_hours` / `opening_hours_mr`: Ground-truth visiting hours.
- `weekly_closure` / `weekly_closure_mr`: Closure schedule (e.g., "Open all 7 days", "Closed on Mondays").
- `recommended_duration_minutes`: Estimated dwell time (45 to 240 mins).

### Category Distribution (106 Total):
1. **Heritage & Wadas** (`heritage`): 29 destinations (Shaniwar Wada, Vishrambaug Wada, Lal Mahal, Nana Wada, Shinde Chhatri, etc.)
2. **Spiritual Sanctuaries** (`temples`): 27 destinations (Kasba Ganpati, Dagdusheth, Tambdi Jogeshwari, Chatushrungi, Parvati, Alandi, Dehu, etc.)
3. **Sahyadri Forts** (`forts`): 15 cataloged forts (Sinhagad, Rajgad, Torna, Purandar, Lohagad, Visapur, Tikona, Shivneri, etc.)
4. **Nature, Tekdis & Reservoirs** (`nature`): 14 destinations (Vetal Tekdi, ARAI Tekdi, Khadakwasla Dam, Panshet, Mulshi, etc.)
5. **Museums & Archives** (`museums`): 9 institutions (Raja Dinkar Kelkar Museum, Tribal Museum, Blades of Glory, Railway Museum, etc.)
6. **Public Parks & Gardens** (`parks`): 6 sanctuaries (Sarasbaug, Empress Botanical Garden, Osho Teerth Park, Pu La Deshpande Japanese Garden, etc.)
7. **Culinary Heritage** (`food`): 6 iconic food institutions (Bedekar Misal, Chitale Bandhu, Goodluck Cafe, Kayani Bakery, Sujata Mastani, Vaishali)

---

## 2. Five Geographical Zones Audit

The 106 destinations span from the dense 18th-century Peshwa Peth grid out into the rugged Sahyadri Western Ghats. They group naturally into 5 distinct zones:

1. **Historic Peths & Wadas** (`historic-peths`):
   - Center: 18.5195° N, 73.8553° E
   - Coverage: The 17 historic Peths, Kasba Ganpati, Shaniwar Wada, Vishrambaug Wada, Dagdusheth, Mandai, Tulshibaug, Tambat Ali, Kelkar Museum.
   - Member count: ~31 places.
2. **Deccan & Kothrud** (`deccan-kothrud`):
   - Center: 18.5167° N, 73.8340° E
   - Coverage: FC Road, Fergusson College, BMCC, Prabhat Rd, Vetal Tekdi, ARAI Tekdi, Pataleshwar Cave, Chatushrungi, Karve Road.
   - Member count: ~16 places.
3. **Camp & Cantonment** (`camp-cantonment`):
   - Center: 18.5130° N, 73.8780° E
   - Coverage: MG Road, East Street, National War Memorial, Empress Botanical Garden, Ohel David Synagogue, St. Mary's Church, Race Course.
   - Member count: ~8 places.
4. **Koregaon Park & Nagar Rd** (`kp-nagar-rd`):
   - Center: 18.5420° N, 73.8980° E
   - Coverage: Koregaon Park North Main Rd, Osho Teerth Park, Aga Khan Palace, Bund Garden, Tribal Research Museum, Yerwada Gandhi Memorial.
   - Member count: ~7 places.
5. **Sahyadri Forts & Reservoirs** (`sahyadri-forts`):
   - Center: 18.4200° N, 73.6800° E (Western Ghats & Talukas)
   - Coverage: Sinhagad Fort, Rajgad, Torna, Purandar, Lohagad, Visapur, Tikona, Shivneri, Khadakwasla Dam, Panshet, Mulshi, Tamhini Ghat.
   - Member count: ~44 places.

---

## 3. Bilingual (i18n) & Typography System

- **Language Provider**: `lib/LanguageContext.tsx` exposes `useLanguage()` returning `{ language, isMr, toggleLanguage }`.
- **Devanagari Typography**:
  - Display headings: `'Rozha One', 'Noto Serif Devanagari', serif`.
  - Body & UI: `'Noto Sans Devanagari', 'Mukta', sans-serif`.
  - Western English Display: `'Inter', -apple-system, sans-serif`.
- **Language Switch**: Global nav header handles language toggle; state persists in localStorage (`explore_pune_language`).

---

## 4. Theme System (Dark / Light)

- **Theme Mode**:
  - Controlled via `[data-theme='dark']` and `[data-theme='light']` on `<html>` or `<body>`.
  - Part A (Intro) honors active user theme (Dark Basalt `#080b11` / Light Parchment `#f6efe0`).
  - Part B (Map) is strictly **dark theme** in both modes to match the cinematic flyover aesthetic (~#181a20 / #30333E basemap palette).

---

## 5. Live Production Features Verified

A systematic audit confirms the following features are actively deployed and functioning:

1. **106 Verified Places Catalog**: `/destinations`, `/places/[slug]` with ASI hours, fees, and photo galleries.
2. **Interactive Map**: MapLibre GL JS map with GPS geolocation and category toggles.
3. **Trip Itinerary Planner**: `/planner` with Metro/PMPML routes, timetable estimation, and PDF export with QR codes.
4. **My Journey**: `/journey` with saved favorites and offline digital trip pass.
5. **Milestones & Passport**: `/milestones` with badges and collectible achievements.
6. **Community Platform**: `/community` with moderated traveler dispatches, stories, and tips.
7. **Traveler Blogs**: `/blogs`, `/blogs/[slug]` with rich first-hand accounts.
8. **Emergency Helplines**: `/help`, `/help/website-guide` with 112, 108, 1091, tourist police, and hospital contacts.
9. **Live Weather Engine**: `/api/v1/weather` returning real-time Pune temperature, sky condition, and monsoon advisories.
10. **Chatbot Guide**: `/api/v1/chat` and floating widget providing contextual recommendations.

---

## 6. Basemap & Motion Strategy

- **Basemap**: OpenFreeMap Dark Style (`https://tiles.openfreemap.org/styles/dark`) via MapLibre GL JS.
- **Flight Motion**: 5.25s camera flyover matching the reference video (overview -> plane marker & red line -> second zone green glow -> fitBounds overview with detail card).
- **Reduced Motion**: Disables camera flyover; snaps bounds instantly; removes plane animation.
