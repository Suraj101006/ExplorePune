# Explore Pune — Data Inconsistencies & Ground-Truth Resolution Register

**Document**: data-issues.md  
**Date**: November 15, 2026  
**Status**: DOCUMENTED & RESOLVED VIA GROUND-TRUTH RECORDS  
**Branch**: `experience-v2`  
**Author**: Data Integrator & Tech Lead  

---

## 1. Summary of Identified Data Conflicts

Per the project rules, when data fields conflict across different files or sections in the repository, the **place's own detail record** in `data/pune_places_106.json` and official archaeological/government records serve as the definitive source of truth.

---

### Conflict 1: Fort Counts (15 vs 12 vs 7)
- **Observed Inconsistency**:
  - Legacy badge in `components/HomeExplorer.tsx` previously stated "12 Forts" (`१२ गड-किल्ले`).
  - `FORTS_ADVENTURE_DATA` in `lib/experienceData.ts` lists 7 featured high-altitude forts.
  - `data/pune_places_106.json` contains exactly 15 cataloged forts (`sinhagad-fort`, `rajgad-fort`, `torna-fort`, `shivneri-fort`, `purandar-fort`, `lohagad-fort`, `visapur-fort`, `tikona-fort`, `tung-fort`, `korigad-fort`, `rohide-fort`, `kenjalgad-fort`, `hadsar-fort`, `chavand-fort`, `jivadhan-fort`).
- **Ground-Truth Resolution**:
  - The total cataloged fort count is **15**.
  - The 7 featured trekking forts represent the high-altitude difficulty tier.
  - The legacy text "12 Forts" was a typographical relic and has been updated to **15 Forts** (`१५ गड-किल्ले`).

---

### Conflict 2: Shaniwar Wada Visiting Hours (09:30 AM vs 09:00 AM)
- **Observed Inconsistency**:
  - An earlier text string in a heritage component listed 09:00 AM – 05:30 PM.
  - Archaeological Survey of India (ASI) official ticketing gate hours for Shaniwar Wada are 09:30 AM – 05:30 PM (with the evening sound & light show starting at 06:30 PM).
- **Ground-Truth Resolution**:
  - `data/pune_places_106.json` and ASI records confirm **09:30 AM – 05:30 PM**.
  - All experience selectors and place cards use `09:30 AM – 05:30 PM`.

---

### Conflict 3: Raja Dinkar Kelkar Museum Collection Size (20,000+ vs 22,000)
- **Observed Inconsistency**:
  - Some promotional text cited "over 22,000 artifacts", while the official museum trust and inventory register lists "over 20,000 artifacts" (of which ~2,500 are on active public display across 42 sections).
- **Ground-Truth Resolution**:
  - Ground-truth data is verified as **20,000+ priceless Indian artifacts**.

---

### Conflict 4: "Pune in 2 Hours" Itinerary Duration Calculation
- **Observed Inconsistency**:
  - A dynamic formula in the custom trip builder was multiplying stops by a fixed 1.25 hours, yielding ~3.8 hours for the "Pune in 2 Hours" template.
- **Ground-Truth Resolution**:
  - Preset templates must strictly respect their author-defined estimated hours (`activeTemplate.estimatedHours = 2.0`), while custom itineraries apply realistic dwell times (45 min) plus transit buffer (15 min).

---

### Conflict 5: Outlying Destinations in City Half-Day Itineraries (Karla Caves)
- **Observed Inconsistency**:
  - Because Karla Caves is tagged `heritage`, default popularity sorting was occasionally injecting it into 2-hour or half-day city suggestions, despite being located ~60 km away in Lonavala.
- **Ground-Truth Resolution**:
  - Added a strict 25 km distance radius gating filter (`distKm <= 25`) from Pune Zero Stone (18.5204° N, 73.8567° E) for short (`2hr`) and half-day (`halfDay`) itineraries. Karla Caves is correctly suggested only for `fullDay` and `weekend` itineraries.
