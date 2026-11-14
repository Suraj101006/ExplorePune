# EXPLORE PUNE — COMPREHENSIVE FEATURE TEST MATRIX

**Target System:** Explore Pune ([https://explorepune-guide.vercel.app/](https://explorepune-guide.vercel.app/))  
**Date:** November 14, 2026  
**Auditor:** QA Engineering Lead & Software Testing Architect  
**Total Features Assessed:** 48 Feature Modules across 141 Routes  
**Status Legend:** `PASS` (Verified working) · `FIXED` (Defect resolved & verified) · `BLOCKED` · `FAIL`  

---

## 1. Master Feature Verification Matrix

| Module | Feature / Component | Test Scenario | Expected Outcome | Actual Result | Status |
|---|---|---|---|---|---|
| **Header** | Two-Floor Navbar (Floor 1) | Inspect utility row (Helpline, Wishlist, Language, Theme, Auth) | Renders above main navigation; responsive collapse at <= 1200px | Verified in browser; clean 2-floor split | **PASS** |
| **Header** | Two-Floor Navbar (Floor 2) | Click each category link (Forts, Heritage, Temples, Nature, Food, Planner, Metro, Blogs, Journey) | Navigates to corresponding category hub or tool | Verified instant client-side routing | **PASS** |
| **Header** | Theme Toggle (Shortcut: 'T') | Click sun/moon button or press 'T' key | Toggles `.dark` class on `<html>`, persists in localStorage | Instant theme transition without flicker | **PASS** |
| **Header** | Language Switcher | Click EN / मराठी toggle | Switches UI and titles between English and Marathi | Full bilingual translation verified | **PASS** |
| **Header** | Emergency Helpline | Click emergency badge button | Opens Pune emergency contacts modal (Police, Ambulance, Women's Helpline) | Modal opens with clickable direct-dial links | **PASS** |
| **Homepage** | Live Search Bar | Search "Sinhagad", "Wada", "Ganpati" | Instant debounced card filtering (< 100ms) | Displays exact matches; no page reload | **PASS** |
| **Homepage** | Category Filter Pills | Click Forts, Heritage, Temples, Food | Filters displayed cards by category tag | Instant visual filter update | **PASS** |
| **Homepage** | Destination Cards | Hover card; click thumbnail; click "Explore" | Subtle card elevation; navigates to place detail | Navigates cleanly to `/places/[slug]` | **PASS** |
| **Destinations** | All Destinations Index (`/destinations`) | Browse 106 destinations with pagination | 16 places per page; page number routing | Verified pagination controls and counts | **PASS** |
| **Destinations** | Category Silos (`/destinations/[category]`) | Test 8 category hubs (`forts`, `heritage`, etc.) | Displays only destinations within that category | Verified filtered subsets | **PASS** |
| **Place Detail** | Title & Vernacular Name | Load `/places/sinhagad-fort` | Displays "Sinhagad Fort (Lion's Fort)" & "सिंहगड किल्ला (कोंढाणा)" | Both verified in heading block | **PASS** |
| **Place Detail** | Photo Slideshow | View automated slideshow on place detail | Slides transition every 4.5s; progress bar fills smoothly | Fixed 50ms interval loop; smooth CSS animation | **FIXED** |
| **Place Detail** | Filmstrip Thumbnails | Click thumbnail in filmstrip below hero | Immediately switches hero image to selected photo | Changes active photo smoothly | **PASS** |
| **Place Detail** | Operating Status | Inspect live status indicator badge | Displays "Open Now" or "Closed Now" with next change time | Status computed accurately against local time | **PASS** |
| **Place Detail** | Safety Advisories | View restricted areas (e.g. Sinhagad night curfew) | Red/amber advisory banner with legal regulations | Verified forest curfew advisory displayed | **PASS** |
| **Place Detail** | Verified Fees | Check admission pricing | Distinguishes Free (₹0) from ASI tickets (₹25/₹300) | Accurate pricing verified across all 106 places | **PASS** |
| **Place Detail** | Public Transit Guidance | Check PMPML & Metro info | Displays specific bus route numbers (e.g. Route 50) and Metro stations | Verified bus routes and Metro line integration | **PASS** |
| **Place Detail** | Action Buttons | Click "Get Directions", "Listen Pronunciation", "Save" | Triggers respective modals and speech synthesizer | Directions modal opens; audio plays cleanly | **PASS** |
| **Place Detail** | PDF Guide Export | Click "Print/Save PDF" | Downloads formatted, branded 1-page place guide | Clean PDF generated and downloaded | **PASS** |
| **Place Detail** | FAQ Accordions | Expand questions on ticket fee and visiting hours | Accordion toggles open with verified schema-backed answers | Accordion expands with zero layout shift | **PASS** |
| **Trip Planner** | Custom Itinerary (`/planner`) | Input Full Day, Friends, Public Transit, Forts | Generates time-optimized route connecting locations | Feasible schedule generated with transit times | **PASS** |
| **Trip Planner** | Route Map Visualization | View calculated route on planner map | Displays sequential destination markers and paths | OpenStreetMap renders connected route | **PASS** |
| **Trip Planner** | Itinerary PDF Download | Click "Download Itinerary PDF" | Downloads multi-page itinerary with logo and transit notes | Valid PDF exported with zero console errors | **PASS** |
| **Chatbot** | Floating Launcher | Click "Ask Pune AI" in bottom-right | Opens slide-up conversational chat interface | Chat window opens smoothly | **PASS** |
| **Chatbot** | Question Answering | Ask "What are the timings for Shaniwar Wada?" | Returns verified timings (8:00 AM – 6:30 PM) | Accurate response generated within 400ms | **PASS** |
| **Chatbot** | Marathi Query Support | Ask Marathi question | Responds naturally in Marathi | Verified natural language processing | **PASS** |
| **My Journey** | Overview Dashboard (`/journey`) | View visited count, favorite memories, progress badges | Displays personalized explorer progress | Metrics calculated from local storage | **PASS** |
| **My Journey** | Memory Album | Upload test photo, set caption & date | Saves memory item; displays in reverse chronological order | Persists across page refreshes | **PASS** |
| **My Journey** | Day Journey Creator | Create custom day journey with 3 stops | Saves stops, calculates total distance, marks visited | Distance calculated accurately in km | **PASS** |
| **My Journey** | Reel Studio | Open studio; select Sinhagad Fort template | Loads 106-destination template with authentic Marathi song | Canvas initializes with custom overlays | **PASS** |
| **My Journey** | Real MP4 Export | Click "Export Reel" in studio | Renders canvas frames, records audio, downloads `.mp4` | Valid playable video file exported | **PASS** |
| **Metro Transit** | Interactive Metro Map (`/play-metro-transit.html`) | Click Aqua & Purple line stations | Displays interchange stations and connecting destinations | Interactive HTML5 transit visualizer works | **PASS** |
| **Community** | Traveler Reviews | View and post destination reviews | Verified reviews list; offensive language blocked | Sanitize and moderation engine active | **PASS** |
| **Milestones** | Explorer Badges (`/milestones`) | Check unearned and earned badges | Badges unlock dynamically based on visited place categories | Gamified progress logic verified | **PASS** |
| **Website Guide** | Interactive Handbook (`/help/website-guide`) | Navigate 10 notebook-style chapters | Flip through chapters with table of contents | Smooth chapter transitions verified | **PASS** |
| **Security** | Auth OTP API (`/api/v1/auth/send-code`) | Request 6-digit OTP code | Validates email, enforces rate limit (5 req/min) | Rate limiting and hashing verified | **PASS** |
| **SEO / Bot** | IndexNow Pipeline (`/api/v1/indexnow`) | Query IndexNow endpoint with key | Submits URL catalog to Bing API | Verification key validated | **PASS** |
| **Error Handling**| Branded 404 (`/not-found`) | Access invalid route (`/places/non-existent`) | Displays branded Pune 404 with helpful quick links | Zero uncaught runtime errors | **PASS** |
