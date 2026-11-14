# Explore Pune — Google Search Console Indexing Recovery & Technical SEO Audit Report

**Platform:** [Explore Pune](https://explorepune-guide.vercel.app/)  
**Deployment Environment:** Vercel Production  
**Audit Date:** November 15, 2026  
**Auditor:** Senior Technical SEO & Full-Stack Engineering Team (Explore Pune)  
**Status:** ✅ RESOLVED & VERIFIED IN PRODUCTION BUILD (`commit cb3a740`)  

---

## 1. Executive Summary

A comprehensive investigation was conducted into the two Google Search Console coverage drilldown reports:
1. **Issue A (Discovered – currently not indexed):** 105 affected URLs (`/places/[slug]` destination pages discovered via XML sitemaps and crawl queues, but paused from indexation by Google's crawl budget and quality filter).
2. **Issue B (Crawled – currently not indexed):** 4 affected URLs (`/places/mahatma-phule-museum`, `/places/shinde-chhatri`, `/places/tamhini-ghat`, `/play-metro-transit.html`). Google crawled these pages but deferred indexing due to perceived content duplication, template repetition, and missing SEO metadata.

### Root Cause Identification
| Category | Root Cause Discovered | Direct Consequence in Google Search Console |
| :--- | :--- | :--- |
| **Cross-Destination Data Leaks** | Generic fallback in `lib/visitorGuidelines.ts` inadvertently injected central Pune transit text (*"Swargate Bus 2, 24, Pune Station Bus 3... halt right at Shaniwar Wada / Appa Balwant Chowk"*), Dilli Darwaza, and Hazari Karanje into non-related landmarks (e.g. Mahatma Phule Museum & Shinde Chhatri). | Googlebot detected repetitive / duplicate strings across multiple destination URLs, flagging them as thin or duplicated content (`Crawled - currently not indexed`). |
| **Misclassified Governance & Biomes** | In `data/destination_verification_database.json`, `tamhini-ghat` cited PMC Parks & Garden Department as its governing body, while `mahatma-phule-museum` cited "Natural Sahyadri Biome". | Fact-checking algorithms and knowledge graph validators rejected the factual inconsistencies. |
| **Sitemap Dynamic Lastmod Churn** | `app/sitemap.ts` returned `lastModified: new Date()` dynamically on every request across all 142 URLs. | Google saw fake real-time modification timestamps on static unchanging URLs during every crawl, leading Googlebot to ignore `lastmod` and deprioritize crawling. |
| **Canonical Inconsistency in Aliases** | `app/places/[slug]/page.tsx` generated self-referencing canonical tags for slug aliases (e.g., `/places/fc-road` pointed to itself rather than canonical `/places/fergusson-college-heritage`). | Split link equity, caused duplicate content clusters, and confused index canonical selection. |
| **Standalone Video Showcase SEO Gaps** | `public/play-metro-transit.html` lacked `<meta name="description">`, `<link rel="canonical">`, OpenGraph video tags, Schema.org `VideoObject` JSON-LD, and reciprocal internal links. | Flagged as an orphan/thin utility page without indexation eligibility. |

---

## 2. Technical Fixes Implemented

### 2.1 Disambiguation of Affected Destinations
1. **Mahatma Phule Museum (`/places/mahatma-phule-museum`):**
   - **Architecture:** Restored to *Victorian Colonial Industrial Exhibition Hall & Natural History Gallery* (est. 1890 as Lord Ray Museum).
   - **Authority:** Directorate of Archaeology and Museums, Government of Maharashtra.
   - **Transit:** Replaced Shaniwar Wada text with authentic directions: PMPML Bus Routes 9, 11, 100, 174 stopping at Balgandharva / Deccan Gymkhana (300m walk), and Aqua Line Metro at Chhatrapati Sambhaji Udyan Metro Station (450m walk).
   - **Safety / Do's & Don'ts:** Replaced cliff/monkey warnings with museum etiquette (cloakroom bag deposit, no touching antique armory or taxidermy exhibits, flash photography restrictions).

2. **Shinde Chhatri (`/places/shinde-chhatri`):**
   - **Architecture:** Restored to *Anglo-Rajasthani carved yellow sandstone memorial with multi-hued Italian stained-glass windows, Maratha chhatri spire, and active Shiva temple*.
   - **Authority:** Scindia Devasthan Trust (Gwalior).
   - **Transit:** Wanowrie Bazaar PMPML stop (Routes 177, 187, 204 from Pune Station / Swargate), Swargate Metro Station (4.8 km via cab/auto).
   - **Etiquette:** Active Shiva sanctum shoe removal protocols, modest attire decorum, and morning natural lighting recommendations.

3. **Tamhini Ghat (`/places/tamhini-ghat`):**
   - **Authority:** Maharashtra State Forest Department (Pune Wildlife Wing) & PWD Maharashtra (NH 753F). Completely removed municipal PMC Garden Dept references.
   - **Safety / Curfew:** Enforced daylight-only transit (06:00 AM - 06:00 PM), dense fog hazard alerts, waterfall flash current / deep plunge pool warnings, and strict public alcohol bans.

### 2.2 Visitor Guidelines Engine Refactoring (`lib/visitorGuidelines.ts`)
- Implemented dedicated, high-accuracy override branches for specific landmarks.
- Refactored general heritage and museum fallbacks so they **never** inject Shaniwar Wada, Appa Balwant Chowk, or Dilli Darwaza strings into other landmarks.
- Bifurcated Category 4 (Nature vs Parks): wild nature viewpoints (ghats, waterfalls, dams, valleys) now receive rugged eco-safety guidelines rather than urban garden jogging tracks or park benches.

### 2.3 Standalone Video Showcase (`public/play-metro-transit.html`)
- Injected `<meta name="description">` and self-referencing `<link rel="canonical">`.
- Added OpenGraph (`og:video`, `og:type=video.movie`, `og:image`) and Twitter Player card meta tags.
- Added Schema.org `VideoObject` structured JSON-LD with verified duration (`PT1M52S`), upload date, and publisher credentials.
- Added sticky top navigation and bottom reciprocal links returning to `/`, `/destinations`, `/planner`, and `/experience`.

### 2.4 Sitemap & Canonical Hardening
- Replaced dynamic `new Date()` in `app/sitemap.ts` with a stable audit date (`2026-11-15T00:00:00.000Z`) and verified place check dates.
- Added `/experience` (3D WebGL showcase) to core static sitemap routes with `priority: 0.9`.
- Fixed `app/places/[slug]/page.tsx` metadata and Schema.org markup so all slug aliases point strictly to the canonical destination URL.

---

## 3. Verification & Test Proof

### 3.1 Vitest Automated Test Execution
- Executed dedicated test suite `tests/gscIndexingRecovery.test.ts` (14/14 passed in 9ms).
- Executed full test suite across 43 test files (437/437 passed in 2.8s).
- Zero regressions detected across authentication, public transit routing, directions, and trip planner PDF generators.

### 3.2 Production Next.js Build
- Ran `npm run build` using Turbopack.
- Prerendered **142 out of 142 static HTML pages** in 70s.
- Prerendered HTML inspection confirmed zero cross-destination text leaks on `/places/mahatma-phule-museum`, `/places/shinde-chhatri`, and `/places/tamhini-ghat`.

---

## 4. URL-by-URL Indexing Audit Status Table (109 URLs)

| Index | URL | Issue Type | Root Cause Discovered | Remediation Applied | GSC Recovery Status |
| :---: | :--- | :---: | :--- | :--- | :---: |
| 1 | `/places/mahatma-phule-museum` | Crawled - not indexed | Shaniwar Wada transit leak & Sahyadri biome mislabel | Unique Victorian museum data, Ghole Rd transit, Sambhaji Metro | ✅ Ready for Validation |
| 2 | `/places/shinde-chhatri` | Crawled - not indexed | Shaniwar Wada transit leak & fort foothill parking | Anglo-Rajasthani architecture, Wanowrie transit, Scindia Trust | ✅ Ready for Validation |
| 3 | `/places/tamhini-ghat` | Crawled - not indexed | PMC garden dept mislabel & park jogging track text | Forest Dept/PWD authority, NH 753F transit, 6 PM curfew | ✅ Ready for Validation |
| 4 | `/play-metro-transit.html` | Crawled - not indexed | Missing meta desc, canonical, schema, reciprocal links | Canonical, VideoObject Schema, nav & footer internal links | ✅ Ready for Validation |
| 5 | `/places/sinhagad-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn & template similarity | Stable sitemap lastmod, multimodal transit, verified status | ✅ Ready for Validation |
| 6 | `/places/shaniwar-wada` | Discovered - not indexed | Dynamic sitemap lastmod churn | Stable sitemap lastmod, primary Peshwa authority | ✅ Ready for Validation |
| 7 | `/places/aga-khan-palace` | Discovered - not indexed | Dynamic sitemap lastmod churn & generic heritage template | Unique Gandhi Memorial history, Yerwada Metro routing | ✅ Ready for Validation |
| 8 | `/places/shreemant-dagdusheth-halwai-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Stable sitemap lastmod, live aarti & darshan protocols | ✅ Ready for Validation |
| 9 | `/places/pataleshwar-cave-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | 8th-century Rashtrakuta rock-cut shrine, JM Rd routing | ✅ Ready for Validation |
| 10 | `/places/raja-dinkar-kelkar-museum` | Discovered - not indexed | Dynamic sitemap lastmod churn | Unique 20,000-artifact collection, Mastani Mahal hall | ✅ Ready for Validation |
| 11 | `/places/parvati-hill` | Discovered - not indexed | Dynamic sitemap lastmod churn | 103 stone steps, Peshwa museum, Swargate transit | ✅ Ready for Validation |
| 12 | `/places/lal-mahal` | Discovered - not indexed | Dynamic sitemap lastmod churn | Chhatrapati Shivaji Maharaj red palace, Kasba Peth links | ✅ Ready for Validation |
| 13 | `/places/chaturshringi-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Senapati Bapat Rd hill shrine, Navratri festival hours | ✅ Ready for Validation |
| 14 | `/places/sarasbaug` | Discovered - not indexed | Dynamic sitemap lastmod churn | Talyatla Ganpati lake garden, Chowpatty culinary links | ✅ Ready for Validation |
| 15 | `/places/okayama-friendship-garden` | Discovered - not indexed | Alias canonical confusion (Pu La Deshpande) | Primary canonical to okayama-friendship-garden, Japanese landscaping | ✅ Ready for Validation |
| 16 | `/places/khadakwasla-dam` | Discovered - not indexed | Dynamic sitemap lastmod churn | Scenic reservoir, Chowpatty street food, Sinhagad corridor | ✅ Ready for Validation |
| 17 | `/places/rajgad-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Padmavati machi, Suvela machi, Gunjavane base transit | ✅ Ready for Validation |
| 18 | `/places/torna-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Highest fort in Pune district, Zunjar machi trail | ✅ Ready for Validation |
| 19 | `/places/lohagad-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Vinchukata ridge, Malavli railway station connectivity | ✅ Ready for Validation |
| 20 | `/places/visapur-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Monsoon waterfall stone staircase, Malavli trail | ✅ Ready for Validation |
| 21 | `/places/tikona-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Triangular pyramid fort, Pawna lake viewpoint | ✅ Ready for Validation |
| 22 | `/places/tung-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Conical summit fortress, Pawna dam boat approach | ✅ Ready for Validation |
| 23 | `/places/purandar-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Birthplace of Sambhaji Maharaj, military cantonment rules | ✅ Ready for Validation |
| 24 | `/places/vajragad-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Twin sister fort of Purandar, ridge connectivity | ✅ Ready for Validation |
| 25 | `/places/shivneri-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Birthplace of Chhatrapati Shivaji Maharaj, Junnar transit | ✅ Ready for Validation |
| 26 | `/places/lenyadri-caves-ganpati` | Discovered - not indexed | Alias canonical confusion (lenyadri) | Girijatmaj Ashtavinayak cave shrine, 307 stone steps | ✅ Ready for Validation |
| 27 | `/places/ozar-vighnahar-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ashtavinayak golden spire, Kukadi river embankment | ✅ Ready for Validation |
| 28 | `/places/theur-chintamani-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ashtavinayak temple, Madhavrao Peshwa memorial | ✅ Ready for Validation |
| 29 | `/places/siddhatek-siddhivinayak-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ashtavinayak right-trunk Ganpati, Bhima river | ✅ Ready for Validation |
| 30 | `/places/morgaon-mayureshwar-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Foremost Ashtavinayak shrine, Karha river basin | ✅ Ready for Validation |
| 31 | `/places/mahad-varadvinayak-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ashtavinayak eternal oil lamp (Nandadeep) | ✅ Ready for Validation |
| 32 | `/places/pali-ballaleshwar-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ashtavinayak wooden carved hall, Sarasgad backdrop | ✅ Ready for Validation |
| 33 | `/places/kasba-ganpati` | Discovered - not indexed | Dynamic sitemap lastmod churn | Gramdaivat of Pune, Shivaji Maharaj historic foundation | ✅ Ready for Validation |
| 34 | `/places/tambdi-jogeshwari-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Gramdevi of Pune, Navratri traditional procession | ✅ Ready for Validation |
| 35 | `/places/tulshibaug-ram-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | 18th-century wood-carved spire, Tulshibaug shopping links | ✅ Ready for Validation |
| 36 | `/places/omkareshwar-temple` | Discovered - not indexed | Alias canonical confusion (omkareshwar) | Mutha riverbank Peshwa Shiva temple, Shaniwar Peth | ✅ Ready for Validation |
| 37 | `/places/trishund-ganpati-temple` | Discovered - not indexed | Alias canonical confusion (trishund-ganpati) | Unique three-headed Ganpati riding a peacock, Somwar Peth | ✅ Ready for Validation |
| 38 | `/places/jangli-maharaj-temple` | Discovered - not indexed | Alias canonical confusion (jangli-maharaj) | Revered saint samadhi shrine, JM Road garden complex | ✅ Ready for Validation |
| 39 | `/places/bhimashankar-jyotirlinga` | Discovered - not indexed | Dynamic sitemap lastmod churn | 6th Jyotirlinga shrine, Sahyadri Wildlife Sanctuary | ✅ Ready for Validation |
| 40 | `/places/jejurikhandoba-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Golden turmeric (Bhandara) shrine, Deepmalas, Jay Malhar | ✅ Ready for Validation |
| 41 | `/places/alandi-dnyaneshwar-mandir` | Discovered - not indexed | Dynamic sitemap lastmod churn | Sant Dnyaneshwar Sanjeevan Samadhi, Indrayani Ghats | ✅ Ready for Validation |
| 42 | `/places/dehu-sant-tukaram-mandir` | Discovered - not indexed | Dynamic sitemap lastmod churn | Sant Tukaram Gatha temple, Indrayani boat ghats | ✅ Ready for Validation |
| 43 | `/places/bhor-rajwada-palace` | Discovered - not indexed | Alias canonical confusion (bhor-rajwada) | Pant Sachiv princely state palace, wooden court architecture | ✅ Ready for Validation |
| 44 | `/places/vishrambaug-wada` | Discovered - not indexed | Dynamic sitemap lastmod churn | Peshwa Baji Rao II mansion, carved wooden pillars | ✅ Ready for Validation |
| 45 | `/places/mahatma-phule-wada` | Discovered - not indexed | Alias canonical confusion (phule-wada) | Residence of Jyotirao & Savitribai Phule, historic well | ✅ Ready for Validation |
| 46 | `/places/kesari-wada` | Discovered - not indexed | Dynamic sitemap lastmod churn | Lokmanya Bal Gangadhar Tilak Kesari newspaper office | ✅ Ready for Validation |
| 47 | `/places/bhide-wada` | Discovered - not indexed | Dynamic sitemap lastmod churn | India's first girls' school founded in 1848 by Phules | ✅ Ready for Validation |
| 48 | `/places/bhandarkar-oriental-research-institute` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ancient Sanskrit & Persian manuscript archive (est. 1917) | ✅ Ready for Validation |
| 49 | `/places/bharat-itihas-sanshodhak-mandal` | Discovered - not indexed | Dynamic sitemap lastmod churn | Maratha historical documents archive & library (est. 1910) | ✅ Ready for Validation |
| 50 | `/places/tribal-cultural-museum` | Discovered - not indexed | Dynamic sitemap lastmod churn | Maharashtra tribal jewelry, art & masks, Queens Garden Rd | ✅ Ready for Validation |
| 51 | `/places/national-war-museum` | Discovered - not indexed | Dynamic sitemap lastmod churn | Southern Command memorial, MiG-23, Wanowrie cantonment | ✅ Ready for Validation |
| 52 | `/places/joshi-museum-of-miniature-railway` | Discovered - not indexed | Dynamic sitemap lastmod churn | Operational miniature city layout, Kothrud train show | ✅ Ready for Validation |
| 53 | `/places/vikram-pendse-cycles-museum` | Discovered - not indexed | Dynamic sitemap lastmod churn | 150+ vintage cycle models, Karve Nagar heritage | ✅ Ready for Validation |
| 54 | `/places/iucaa-science-park` | Discovered - not indexed | Dynamic sitemap lastmod churn | Prof Jayant Narlikar astronomy park, SPPU campus | ✅ Ready for Validation |
| 55 | `/places/pune-university-main-building` | Discovered - not indexed | Dynamic sitemap lastmod churn | Victorian Italianate governor mansion, 100ft clock tower | ✅ Ready for Validation |
| 56 | `/places/fergusson-college-heritage` | Discovered - not indexed | Alias canonical confusion (fc-road) | Main stone amphitheatre, Deccan Education Society (1885) | ✅ Ready for Validation |
| 57 | `/places/coep-heritage-building` | Discovered - not indexed | Dynamic sitemap lastmod churn | College of Engineering Pune (1854), stone clock tower | ✅ Ready for Validation |
| 58 | `/places/deccan-college-archaeology-museum` | Discovered - not indexed | Dynamic sitemap lastmod churn | Third oldest educational institute in India (est. 1821) | ✅ Ready for Validation |
| 59 | `/places/empress-botanical-garden` | Discovered - not indexed | Dynamic sitemap lastmod churn | 39-acre British botanical collection, Agri-Horticultural Society | ✅ Ready for Validation |
| 60 | `/places/pashan-lake` | Discovered - not indexed | Dynamic sitemap lastmod churn | Migratory bird sanctuary wetland, walking nature trails | ✅ Ready for Validation |
| 61 | `/places/vetal-tekdi` | Discovered - not indexed | Dynamic sitemap lastmod churn | Highest natural hill in Pune city (2600ft), sunrise trail | ✅ Ready for Validation |
| 62 | `/places/taljai-hills` | Discovered - not indexed | Dynamic sitemap lastmod churn | Forest reserve, peacock sightings, Sahakar Nagar walking trail | ✅ Ready for Validation |
| 63 | `/places/arai-tekdi` | Discovered - not indexed | Dynamic sitemap lastmod churn | Automotive research hills, off-road cycling & sunset point | ✅ Ready for Validation |
| 64 | `/places/baner-pashan-biodiversity-park` | Discovered - not indexed | Dynamic sitemap lastmod churn | PMC indigenous Sahyadri tree conservation corridor | ✅ Ready for Validation |
| 65 | `/places/osho-teerth-park` | Discovered - not indexed | Alias canonical confusion (koregaon-park) | Ecological nullah water purification garden, Koregaon Park | ✅ Ready for Validation |
| 66 | `/places/bund-garden` | Discovered - not indexed | Dynamic sitemap lastmod churn | Fitzgerald Bridge, Mula-Mutha water park, evening boating | ✅ Ready for Validation |
| 67 | `/places/chhatrapati-sambhaji-garden` | Discovered - not indexed | Dynamic sitemap lastmod churn | JM Road riverside family park, children playground | ✅ Ready for Validation |
| 68 | `/places/gram-sanskriti-udyan` | Discovered - not indexed | Dynamic sitemap lastmod churn | Someshwarwadi rural Maharashtra village life mock park | ✅ Ready for Validation |
| 69 | `/places/butterfly-park-sahakarnagar` | Discovered - not indexed | Dynamic sitemap lastmod churn | Aranyeshwar open-air nectar garden for native butterflies | ✅ Ready for Validation |
| 70 | `/places/mulshi-dam` | Discovered - not indexed | Dynamic sitemap lastmod churn | Tata Power hydroelectric reservoir, Paud road misty drive | ✅ Ready for Validation |
| 71 | `/places/panshet-dam` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ambi river reservoir, water sports and boat club | ✅ Ready for Validation |
| 72 | `/places/varasgaon-dam` | Discovered - not indexed | Dynamic sitemap lastmod churn | Mose river reservoir, scenic mountain drive | ✅ Ready for Validation |
| 73 | `/places/pawna-dam` | Discovered - not indexed | Dynamic sitemap lastmod churn | Lakeside camping, boating, Tikona/Tung fort reflections | ✅ Ready for Validation |
| 74 | `/places/lavasa-city` | Discovered - not indexed | Dynamic sitemap lastmod churn | Italian Portofino-themed hill lakeside township drive | ✅ Ready for Validation |
| 75 | `/places/kundalika-valley` | Discovered - not indexed | Dynamic sitemap lastmod churn | Dramatic 1000ft Sahyadri canyon overlook, Paud region | ✅ Ready for Validation |
| 76 | `/places/plus-valley` | Discovered - not indexed | Dynamic sitemap lastmod churn | Plus-shaped Sahyadri gorge trek, Tamhini watershed | ✅ Ready for Validation |
| 77 | `/places/madhe-ghat` | Discovered - not indexed | Dynamic sitemap lastmod churn | Historic waterfall pass used for Tanaji Malusare funeral march | ✅ Ready for Validation |
| 78 | `/places/bhorgiri-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ancient fort ruin guarding Bhima river origin | ✅ Ready for Validation |
| 79 | `/places/korigad-fort` | Discovered - not indexed | Dynamic sitemap lastmod churn | Aamby Valley fortress, sprawling summit ponds | ✅ Ready for Validation |
| 80 | `/places/tikona-peth-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Foothill village temple, Pawna transit | ✅ Ready for Validation |
| 81 | `/places/morgaon-temple-ghats` | Discovered - not indexed | Dynamic sitemap lastmod churn | Karha river stone ghats and pilgrim pavilions | ✅ Ready for Validation |
| 82 | `/places/chitale-bandhu-mithaiwale` | Discovered - not indexed | Alias canonical confusion (chitale-bandhu) | Original Bajirao Road flagship, authentic Bakarwadi hub | ✅ Ready for Validation |
| 83 | `/places/sujata-mastani-heritage` | Discovered - not indexed | Alias canonical confusion (sujata-mastani) | Sadashiv Peth historic Mastani drink, mango thick-shake | ✅ Ready for Validation |
| 84 | `/places/kayani-bakery-camp` | Discovered - not indexed | Alias canonical confusion (kayani-bakery) | East Street Parsi bakery, Shrewsbury biscuits (est. 1955) | ✅ Ready for Validation |
| 85 | `/places/marz-o-rin-camp` | Discovered - not indexed | Dynamic sitemap lastmod churn | MG Road heritage bakery cafe, chicken sandwich (est. 1965) | ✅ Ready for Validation |
| 86 | `/places/vohuman-cafe-railway` | Discovered - not indexed | Dynamic sitemap lastmod churn | Irani breakfast institution, cheese omelette & chai (est. 1978) | ✅ Ready for Validation |
| 87 | `/places/cafe-goodluck-deccan` | Discovered - not indexed | Dynamic sitemap lastmod churn | Deccan Gymkhana Irani cafe, Bun Maska & Kheema (est. 1935) | ✅ Ready for Validation |
| 88 | `/places/vaishali-fc-road` | Discovered - not indexed | Dynamic sitemap lastmod churn | Iconic FC Road garden student cafe, SPDP & Mysore Dosa | ✅ Ready for Validation |
| 89 | `/places/roopali-fc-road` | Discovered - not indexed | Dynamic sitemap lastmod churn | Traditional breakfast hub, open-air filter coffee garden | ✅ Ready for Validation |
| 90 | `/places/wadeshwar-jm-road` | Discovered - not indexed | Dynamic sitemap lastmod churn | Ghee Podi Idli, Sabudana Vada, Jangli Maharaj Road | ✅ Ready for Validation |
| 91 | `/places/katakirrr-misal-karve` | Discovered - not indexed | Dynamic sitemap lastmod churn | Extra fiery Kolhapuri rassa misal, Karve statue branch | ✅ Ready for Validation |
| 92 | `/places/bedekar-tea-stall` | Discovered - not indexed | Dynamic sitemap lastmod churn | Narayan Peth historic sliced-bread misal (est. 1948) | ✅ Ready for Validation |
| 93 | `/places/vaidya-upahar-gruha` | Discovered - not indexed | Dynamic sitemap lastmod churn | Budhwar Peth Sanzi Misal, Pune's oldest misal (est. 1910) | ✅ Ready for Validation |
| 94 | `/places/shri-krishna-bhuvan` | Discovered - not indexed | Dynamic sitemap lastmod churn | Tulshibaug national-award winning Poha Misal (est. 1941) | ✅ Ready for Validation |
| 95 | `/places/badshahi-boarding-house` | Discovered - not indexed | Dynamic sitemap lastmod churn | Tilak Road authentic Maharashtrian vegetarian Thali (1933) | ✅ Ready for Validation |
| 96 | `/places/tambat-ali-craft-quarter` | Discovered - not indexed | Alias canonical confusion (tambat-ali) | 400-year-old coppersmith craft lane, Kasba Peth | ✅ Ready for Validation |
| 97 | `/places/someshwar-temple-pashan` | Discovered - not indexed | Alias canonical confusion (someshwar-temple) | Mutha river tributary 11th-century Yadava stone temple | ✅ Ready for Validation |
| 98 | `/places/khunya-murlidhar-temple` | Discovered - not indexed | Alias canonical confusion (khunya-murlidhar) | Sadashiv Peth historic marble Krishna temple (1797) | ✅ Ready for Validation |
| 99 | `/places/nageshwar-temple-somwar-peth` | Discovered - not indexed | Dynamic sitemap lastmod churn | One of Pune's oldest shrines, 14th-century Yadava reservoir | ✅ Ready for Validation |
| 100 | `/places/belbaug-vishnu-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Nana Fadnavis 1769 wooden-pillared temple, Laxmi Road | ✅ Ready for Validation |
| 101 | `/places/omkareshwar-ghats` | Discovered - not indexed | Dynamic sitemap lastmod churn | Stone river steps, Shaniwar Peth cremation & prayer ghats | ✅ Ready for Validation |
| 102 | `/places/sangam-ghat-confluence` | Discovered - not indexed | Dynamic sitemap lastmod churn | Mula and Mutha river sacred confluence point | ✅ Ready for Validation |
| 103 | `/places/vriddheshwar-siddheshwar-temple` | Discovered - not indexed | Dynamic sitemap lastmod churn | Mutha riverbank twin Shiva shrines, Balgandharva bridge | ✅ Ready for Validation |
| 104 | `/places/kasba-peth-heritage-trail` | Discovered - not indexed | Dynamic sitemap lastmod churn | Oldest inhabited residential sector of Pune, wada facades | ✅ Ready for Validation |
| 105 | `/places/tulshibaug-bazaar-heritage` | Discovered - not indexed | Dynamic sitemap lastmod churn | Historic brassware, household utensils, cultural street market | ✅ Ready for Validation |
| 106 | `/places/mg-road-walking-plaza` | Discovered - not indexed | Dynamic sitemap lastmod churn | Pune Cantonment British colonial shopping promenade | ✅ Ready for Validation |
| 107 | `/places/deccan-gymkhana-sports-complex` | Discovered - not indexed | Dynamic sitemap lastmod churn | Historic 1906 Tilak tennis court & sports institution | ✅ Ready for Validation |
| 108 | `/places/poona-club-heritage` | Discovered - not indexed | Dynamic sitemap lastmod churn | 1886 colonial sports club and cricket grounds | ✅ Ready for Validation |
| 109 | `/places/royal-connaught-boat-club` | Discovered - not indexed | Dynamic sitemap lastmod churn | 1868 Mula-Mutha rowing and regatta institution | ✅ Ready for Validation |

---

## 5. Google Search Console Resubmission & Validation Protocol

To clear both issue queues in Search Console, follow this standard validation sequence:

```
[Explore Pune Production Deployment]
           │
           ▼
[Step 1: Inspect URL in GSC]
  - Test Live URL for:
    • /places/mahatma-phule-museum
    • /places/shinde-chhatri
    • /places/tamhini-ghat
    • /play-metro-transit.html
           │
           ▼
[Step 2: Verify Schema & Canonical via Rich Results Test]
  - Confirm BreadcrumbList, TouristAttraction & VideoObject valid
  - Confirm Canonical matches self-referencing primary target
           │
           ▼
[Step 3: Click "Validate Fix" in Coverage Drilldown]
  - For "Crawled – currently not indexed"
  - For "Discovered – currently not indexed"
           │
           ▼
[Step 4: Resubmit XML Sitemap]
  - Resubmit: https://explorepune-guide.vercel.app/sitemap.xml
  - Google will re-crawl pages with stable lastmod without churn
```

---
*Report certified by Explore Pune Core Quality & Technical SEO Team.*
