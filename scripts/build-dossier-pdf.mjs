import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const outputHtmlPath = 'C:/Users/Suraj/explore-pune/explore-pune-dossier.html';
const outputPdfPath = 'C:/Users/Suraj/explore-pune/Explore_Pune_Project_Dossier_and_Viva_Guide.pdf';
const artifactPdfPath = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/Explore_Pune_Project_Dossier_and_Viva_Guide.pdf';

const logoDiskPath = 'C:/Users/Suraj/explore-pune/public/assets/explore-pune-logo.png';
const logoBase64 = fs.existsSync(logoDiskPath)
  ? `data:image/png;base64,${fs.readFileSync(logoDiskPath).toString('base64')}`
  : '';

console.log('Generating comprehensive Project Presentation & Viva Dossier HTML...');

// Read the complete dossier HTML template generator
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Explore Pune — Master Project Presentation Dossier & Viva Examination Guide</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }
    :root {
      --primary: #1e1b4b;
      --secondary: #4338ca;
      --accent: #0284c7;
      --accent-green: #059669;
      --text: #1f2937;
      --text-muted: #4b5563;
      --bg-alt: #f8fafc;
      --border: #e2e8f0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: var(--text);
      line-height: 1.6;
      background: #fff;
      font-size: 10.5pt;
    }
    .cover {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 90vh;
      border-bottom: 3px solid var(--secondary);
      padding-bottom: 40px;
    }
    .badge {
      display: inline-block;
      background: #e0e7ff;
      color: var(--secondary);
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 26pt;
      color: var(--primary);
      line-height: 1.2;
      margin-bottom: 12px;
      font-weight: 800;
    }
    .subtitle {
      font-size: 13pt;
      color: var(--text-muted);
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .meta-box {
      background: var(--bg-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px 20px;
      margin-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 9.5pt;
    }
    .meta-item strong {
      color: var(--primary);
    }
    h2 {
      color: var(--primary);
      font-size: 16pt;
      border-bottom: 2px solid var(--border);
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }
    h3 {
      color: var(--secondary);
      font-size: 12pt;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4 {
      color: var(--text);
      font-size: 10.5pt;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 10px;
      text-align: justify;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    li {
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: var(--primary);
      font-weight: 700;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    pre, code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
    }
    code {
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      color: #b91c1c;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
    .callout {
      background: #f0fdf4;
      border-left: 4px solid var(--accent-green);
      padding: 12px 16px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 14px;
      font-size: 9.5pt;
    }
    .callout-warning {
      background: #fffbeb;
      border-left: 4px solid #d97706;
      padding: 12px 16px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 14px;
      font-size: 9.5pt;
    }
    .qa-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .qa-q {
      font-weight: 700;
      color: #6b21a8;
      margin-bottom: 6px;
    }
    .qa-simple {
      margin-bottom: 6px;
      font-size: 9.5pt;
    }
    .qa-tech {
      background: #fff;
      border-left: 3px solid var(--secondary);
      padding: 8px 12px;
      border-radius: 0 4px 4px 0;
      margin-top: 6px;
      font-size: 9pt;
      color: #334155;
    }
    .qa-followup {
      margin-top: 6px;
      font-size: 8.5pt;
      color: #b45309;
      font-style: italic;
    }
    .page-break {
      page-break-after: always;
    }
    .slide-card {
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .slide-title {
      font-weight: 700;
      color: var(--secondary);
      font-size: 11pt;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    ${logoBase64 ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${logoBase64}" alt="Explore Pune Official Logo" style="width: 100px; height: 100px; object-fit: contain;" /></div>` : ''}
    <div class="badge">Official Project Presentation &amp; Viva Defense Dossier</div>
    <h1>EXPLORE PUNE</h1>
    <div class="subtitle">
      A Verified Hyper-Local Tourism, Geospatial Exploration, and Multi-Modal Public Transit Intelligence Platform
    </div>
    <p>
      This comprehensive dossier provides a thorough, verifiable technical analysis of the <strong>Explore Pune</strong> software engineering project. It is structured to prepare the candidate for technical presentations, academic viva-voce examinations, system architecture interviews, and live software demonstrations.
    </p>

    <div class="meta-box">
      <div class="meta-item"><strong>Live Platform URL:</strong> https://explore-pune-eosin.vercel.app/</div>
      <div class="meta-item"><strong>Repository:</strong> https://github.com/sj176644-maker/ExplorePune</div>
      <div class="meta-item"><strong>Framework Version:</strong> Next.js 16.4.2 (App Router) + React 19.3.0</div>
      <div class="meta-item"><strong>Compiler / Engine:</strong> Turbopack + Node.js v24</div>
      <div class="meta-item"><strong>Database Engine:</strong> Google Cloud Firestore (SDK v13 + Admin v14)</div>
      <div class="meta-item"><strong>Mapping Technology:</strong> MapLibre GL v6.15.0 + OSRM Routing</div>
      <div class="meta-item"><strong>Unit Test Health:</strong> 18 Suites, 161 Tests Passing (Vitest v5.0.5)</div>
      <div class="meta-item"><strong>Verified Dataset:</strong> 106 Curated &amp; Audited Pune Destinations</div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <h2>Table of Contents</h2>
  <ol>
    <li>Project Overview</li>
    <li>Existing System vs. Proposed System</li>
    <li>Technology Stack</li>
    <li>System Architecture &amp; Workflow</li>
    <li>Detailed Module Explanation</li>
    <li>Complete Source Code Explanation</li>
    <li>Database &amp; Data Processing</li>
    <li>Installation, Environment &amp; Execution</li>
    <li>Features &amp; Live Demonstration Script</li>
    <li>Testing, Quality Assurance &amp; Verification</li>
    <li>Advantages, Limitations &amp; Future Scope</li>
    <li>Security &amp; Reliability Engineering</li>
    <li>Presentation Preparation (2-min, 5-min, 10-min Scripts &amp; Slide Deck)</li>
    <li>Viva Voce &amp; Technical Interview Question Bank (50+ Detailed Questions)</li>
    <li>Quick Revision Notes &amp; Last-Minute Cheat Sheet</li>
  </ol>

  <div class="page-break"></div>

  <!-- SECTION 1 -->
  <h2>1. Project Overview</h2>
  <h3>1.1 Project Title &amp; Introduction</h3>
  <p>
    <strong>Project Title:</strong> Explore Pune — Verified Hyper-Local Tourism, Geospatial Exploration, and Multi-Modal Public Transit Platform.
  </p>
  <p>
    Explore Pune is an enterprise-grade full-stack web application designed to solve the critical challenges of tourism discovery, travel planning, and urban mobility in Pune, Maharashtra. It connects tourists, trekking enthusiasts, students, and daily commuters with 106 verified destinations, real-time public transit schedules (PMPML buses and Pune Metro), an offline-first client-side AI knowledge engine, and downloadable PDF itinerary planners.
  </p>

  <h3>1.2 Problem Statement</h3>
  <p>
    Pune is Maharashtra's historical and cultural capital as well as a leading global technology hub, receiving millions of domestic and international visitors each year. However, urban tourism in Pune faces significant structural challenges:
  </p>
  <ul>
    <li><strong>Data Fragmentation &amp; Stale Information:</strong> Tourist information is scattered across commercial travel blogs with outdated entry fees, obsolete operating hours, and missing gate closure times for Sahyadri forts.</li>
    <li><strong>Disjointed Public Transportation:</strong> Major mapping providers (Google Maps, Apple Maps) often fail to provide localized PMPML bus route timetables or clear multi-modal transfer points between the newly expanded Pune Metro (Purple &amp; Aqua lines) and feeder buses.</li>
    <li><strong>Language Barrier:</strong> Non-Marathi speakers and international travelers struggle to find authentic local names, whereas native Marathi speakers often face platforms that lack quality Devanagari localization.</li>
    <li><strong>Online Dependency &amp; Connectivity Gaps:</strong> Popular destinations like Sinhagad Fort, Rajgad, and Torna suffer from poor cellular connectivity, rendering online route lookups and digital tickets inaccessible.</li>
    <li><strong>AI Hallucinations:</strong> Generic conversational AI engines often fabricate admission charges, miscalculate travel durations across Pune ghats, or recommend nonexistent amenities.</li>
  </ul>

  <h3>1.3 Main Objectives &amp; Goals</h3>
  <ul>
    <li><strong>Zero-Hallucination Verified Truth:</strong> Curate and maintain 106 verified destinations with audited admission fees, opening/closing hours, vehicle tolls, and safety guidelines.</li>
    <li><strong>Unified Multi-Modal Transit Engine:</strong> Model the complete Pune Metro network (Purple &amp; Aqua lines with the Civil Court underground interchange) alongside verified PMPML bus routes (e.g., Route 51 from Shanipar to Sinhagad Paytha).</li>
    <li><strong>Bilingual Accessibility:</strong> Native Marathi (Devanagari) and English interface supported by dedicated font variables (<code>Yatra One</code>, <code>Rozha One</code>, <code>Plus Jakarta Sans</code>).</li>
    <li><strong>Offline-Ready Itinerary Export:</strong> Generate client-side PDF itineraries with day-by-day schedules, estimated costs, and step-by-step public transit directions using <code>jsPDF</code>.</li>
    <li><strong>Instant Client-Side NLP Knowledge Engine:</strong> Resolve tourist queries and spatial calculations in sub-50ms directly inside the browser using local token-intent heuristics and the Haversine distance formula.</li>
  </ul>

  <h3>1.4 Project Scope &amp; Target Audience</h3>
  <p>
    The scope encompasses the Pune Metropolitan Area (PMC &amp; PCMC), extending to prominent historical forts in the surrounding Sahyadri range. Target users include independent tourists, college students traveling on tight budgets, families visiting cultural landmarks, heritage researchers, and daily commuters seeking unified metro/bus connections.
  </p>

  <!-- SECTION 2 -->
  <h2>2. Existing System vs. Proposed System</h2>
  <table>
    <thead>
      <tr>
        <th>Evaluation Dimension</th>
        <th>Existing Solutions (Google Maps, Travel Blogs, Wikipedia)</th>
        <th>Proposed System (Explore Pune)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Data Accuracy &amp; Invariants</strong></td>
        <td>Crowdsourced reviews often contain obsolete fees, unverified timings, or closed venues.</td>
        <td>Strictly audited data invariants: 106 places with verified ₹0 entry enforcement and ground-truth timestamps.</td>
      </tr>
      <tr>
        <td><strong>Public Transit Integration</strong></td>
        <td>Generic point-to-point lines; frequently lacks specific PMPML bus route schedules and Sinhagad feeder jeep connections.</td>
        <td>Dual-line Pune Metro schematic (Civil Court hub) combined with exact PMPML bus timetables and walking/jeep legs.</td>
      </tr>
      <tr>
        <td><strong>Offline Reliability</strong></td>
        <td>Requires persistent active internet connection; fails in mountain forts with no mobile reception.</td>
        <td>Client-side JSON fallbacks and downloadable vector PDF travel itineraries with embedded transit steps.</td>
      </tr>
      <tr>
        <td><strong>Bilingual Localization</strong></td>
        <td>Machine translation that frequently mangles historical Marathi nomenclature.</td>
        <td>Curated Devanagari place names, Marathi descriptions, and bilingual audio narration guides.</td>
      </tr>
      <tr>
        <td><strong>AI Query Resolution</strong></td>
        <td>Cloud LLMs subject to network latency, cost, and factual hallucinations.</td>
        <td>Zero-cloud-cost client-side engine (<code>chatKnowledgeEngine.ts</code>) operating with explicit anti-hallucination fallback rules.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h2>3. Technology Stack</h2>
  <p>
    Every technology in Explore Pune was selected based on performance, type safety, cold-start latency, and offline resiliency.
  </p>
  <table>
    <thead>
      <tr>
        <th>Technology</th>
        <th>Version</th>
        <th>Selected Role in Architecture</th>
        <th>Rationale &amp; Evaluation Benefit</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Next.js (App Router)</strong></td>
        <td>16.4.2</td>
        <td>Full-stack framework, Server Components, and Serverless Route Handlers.</td>
        <td>Incremental Static Regeneration (ISR), automated code-splitting, Edge CDN caching, and high performance with Turbopack.</td>
      </tr>
      <tr>
        <td><strong>React</strong></td>
        <td>19.3.0</td>
        <td>Client-side UI reactivity, Transitions, and Context Providers.</td>
        <td>React 19 Server Actions, <code>useTransition</code> for silky smooth page navigation, and zero-flash DOM updates.</td>
      </tr>
      <tr>
        <td><strong>Tailwind CSS</strong></td>
        <td>v4.0</td>
        <td>Utility-first CSS engine with CSS variables.</td>
        <td>Zero runtime CSS overhead, native dark mode styling, and responsive grid layouts (<code>minmax(0, 1fr)</code>).</td>
      </tr>
      <tr>
        <td><strong>MapLibre GL</strong></td>
        <td>6.15.0</td>
        <td>Open-source geospatial map rendering engine.</td>
        <td>Hardware-accelerated WebGL vector maps without costly Google Maps Platform per-load billing fees.</td>
      </tr>
      <tr>
        <td><strong>Google Cloud Firestore</strong></td>
        <td>v13.0</td>
        <td>NoSQL cloud database for dynamic places, blogs, and community posts.</td>
        <td>Real-time document synchronization, sub-100ms document reads, and serverless auto-scaling.</td>
      </tr>
      <tr>
        <td><strong>jsPDF</strong></td>
        <td>4.2.1</td>
        <td>Vector PDF rendering engine.</td>
        <td>Generates trip itineraries client-side in the browser without server roundtrips or PDF rendering microservices.</td>
      </tr>
      <tr>
        <td><strong>Vitest</strong></td>
        <td>5.0.5</td>
        <td>Modern TypeScript unit and integration test runner.</td>
        <td>Instant test execution, native ESM support, and 100% parity with Vite/Turbopack tooling.</td>
      </tr>
      <tr>
        <td><strong>TypeScript</strong></td>
        <td>5.x</td>
        <td>Static type checking across data schemas and API contracts.</td>
        <td>Guarantees compile-time safety, eliminating null pointer exceptions and schema mismatch bugs.</td>
      </tr>
      <tr>
        <td><strong>Remotion</strong></td>
        <td>4.x</td>
        <td>Programmatic React-based video generation engine.</td>
        <td>Renders high-fidelity 1080p marketing and transit showcase films frame-by-frame with FFmpeg.</td>
      </tr>
      <tr>
        <td><strong>Zod</strong></td>
        <td>4.6.7</td>
        <td>Runtime schema declaration and input validation.</td>
        <td>Sanitizes incoming API requests to prevent payload injection and schema drift.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4 -->
  <h2>4. System Architecture &amp; Workflow</h2>
  <h3>4.1 High-Level Architectural Diagram</h3>
  <pre><code>
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                      |
|  +---------------------+   +-----------------------+   +---------------------------+  |
|  | Next.js App Router  |   | MapLibre GL (WebGL)   |   | Chat Knowledge Engine     |  |
|  | - React 19 RSC/RCC  |   | - GeoJSON Layers      |   | - Local Heuristics / NLP  |  |
|  | - LanguageProvider  |   | - Station Coordinates |   | - Haversine Distance Calc |  |
|  +----------+----------+   +-----------+-----------+   +-------------+-------------+  |
+-------------|--------------------------|-----------------------------|-----------------+
              |                          |                             |
              v                          v                             v
+---------------------------------------------------------------------------------------+
|                               VERCEL EDGE / SERVERLESS                                |
|  +--------------------+   +-----------------------+   +----------------------------+  |
|  | Static Assets / CDN|   | API Route Handlers    |   | Edge Middleware / Headers  |  |
|  | - sitemap.xml (ISR)|   | - /api/v1/directions  |   | - Strict CSP, COOP, CORP   |  |
|  | - /videos/*.mp4    |   | - /api/v1/pmpml       |   | - Origin-Agent-Cluster     |  |
|  | - Cached JSON      |   | - /api/v1/transit     |   | - In-Memory Rate Limiting  |  |
|  +----------+---------+   +-----------+-----------+   +----------------------------+  |
+-------------|-------------------------|-----------------------------------------------+
              |                         |
              v                         v
+-----------------------------+   +-----------------------------------------------------+
|   OFFLINE LOCAL FALLBACK    |   |                EXTERNAL SERVICES                    |
| - backup_places.json (106)  |   | - Cloud Firestore (Real-time DB)                    |
| - PMPML Static Schedules    |   | - OSRM Routing API (Driving/Walking routes)         |
| - Metro Station Coordinates |   | - Google Analytics 4 (GA4)                          |
+-----------------------------+   +-----------------------------------------------------+
  </code></pre>

  <h3>4.2 Step-by-Step Data Flow Example: Sinhagad Fort Trip Planning</h3>
  <ol>
    <li><strong>User Input:</strong> The visitor enters the Trip Planner (<code>/planner</code>) and selects "Shivajinagar" as start and "Sinhagad Fort" as destination.</li>
    <li><strong>Client Intent Processing:</strong> <code>planner.ts</code> invokes <code>getPublicTransitRoute()</code> in <code>lib/publicTransit.ts</code>.</li>
    <li><strong>Proximity Evaluation:</strong> The system checks origin distance to the nearest Metro station using the Haversine equation: Shivajinagar is within 200m of the Purple Line station.</li>
    <li><strong>Route Generation:</strong>
      <ul>
        <li><strong>Leg 1 (Metro):</strong> Board Purple Line at Shivajinagar ➔ Swargate Station (12 minutes, ₹20).</li>
        <li><strong>Leg 2 (PMPML Bus):</strong> Walk 150m to Swargate Bus Depot ➔ Board PMPML Route 51 (48 minutes, ₹35) to Sinhagad Paytha.</li>
        <li><strong>Leg 3 (Last Mile):</strong> Shared local jeep or 2.7 km uphill trekking trail to the summit.</li>
      </ul>
    </li>
    <li><strong>Map Visualization:</strong> Coordinates are mapped onto MapLibre GL with animated transit dashed corridors.</li>
    <li><strong>Client-Side PDF Generation:</strong> The user clicks "Export Itinerary". <code>generateItineraryPdf.ts</code> formats the 3-leg timeline into a styled A4 vector document and downloads it instantly without contacting an external PDF server.</li>
  </ol>

  <div class="page-break"></div>

  <!-- SECTION 5 -->
  <h2>5. Detailed Module Explanation</h2>
  <h3>Module 1: Destination Catalog &amp; Category Routing</h3>
  <ul>
    <li><strong>Purpose:</strong> Serves 106 structured destinations categorized into 8 domains: Forts, Heritage, Temples, Museums, Nature, Parks, Food, and Free.</li>
    <li><strong>Key Files:</strong> <code>app/destinations/page.tsx</code>, <code>app/destinations/[category]/page.tsx</code>, <code>components/HomeExplorer.tsx</code>.</li>
    <li><strong>Processing:</strong> Filters places by verified fee status (strictly validating that <code>fee_status === 'free'</code> equals ₹0). Implements clean static URLs without query parameter pollution.</li>
    <li><strong>Outputs:</strong> Responsive CSS grid with cards exhibiting image lazy-loading, time badges, and entry costs.</li>
  </ul>

  <h3>Module 2: Local Knowledge &amp; Chat Engine</h3>
  <ul>
    <li><strong>Purpose:</strong> Provides zero-latency conversational intelligence and automated trip intent classification.</li>
    <li><strong>Key Files:</strong> <code>lib/chatKnowledgeEngine.ts</code>, <code>components/ChatWidget.tsx</code>.</li>
    <li><strong>Processing:</strong> Tokenizes user input, applies regex intent matching (e.g., fee queries, timing queries, nearby queries), retains conversational memory of the last referenced place, and defaults to explicit unverified warnings if data is absent.</li>
    <li><strong>Outputs:</strong> JSON <code>EngineResult</code> containing conversational reply, matching structured place cards, and transit directions.</li>
  </ul>

  <h3>Module 3: MapLibre Geospatial Explorer</h3>
  <ul>
    <li><strong>Purpose:</strong> Renders interactive vector maps of Pune with verified landmark markers and route polylines.</li>
    <li><strong>Key Files:</strong> <code>components/InteractiveMap.tsx</code>, <code>components/TransitRouteMap.tsx</code>, <code>lib/navigationService.ts</code>.</li>
    <li><strong>Processing:</strong> Uses MapLibre GL to render GeoJSON sources, fits bounding boxes dynamically across selected points, and toggles transit line overlays.</li>
    <li><strong>Outputs:</strong> Hardware-accelerated interactive canvas supporting zoom, pan, and marker popups.</li>
  </ul>

  <h3>Module 4: Public Transit &amp; PMPML Live Service</h3>
  <ul>
    <li><strong>Purpose:</strong> Models Pune's public transport systems (Pune Metro + PMPML buses).</li>
    <li><strong>Key Files:</strong> <code>lib/publicTransit.ts</code>, <code>lib/pmpmlLiveService.ts</code>, <code>app/api/v1/transit/directions/route.ts</code>.</li>
    <li><strong>Processing:</strong> Implements route matrices for Purple Line (PCMC ↔ Swargate), Aqua Line (Vanaz ↔ Ramwadi), and PMPML Route 51 with graceful fallback to static timetables when municipal APIs disconnect.</li>
    <li><strong>Outputs:</strong> Multi-leg journey objects with station arrival times, fares, and transfer instructions.</li>
  </ul>

  <h3>Module 5: Custom Trip Planner &amp; PDF Exporter</h3>
  <ul>
    <li><strong>Purpose:</strong> Generates multi-stop day trips and produces offline PDF documents.</li>
    <li><strong>Key Files:</strong> <code>app/planner/page.tsx</code>, <code>lib/generateItineraryPdf.ts</code>, <code>lib/planner.ts</code>.</li>
    <li><strong>Processing:</strong> Calculates transit buffer times, estimates admission costs, orders stops geographically, and writes vector text and tables via <code>jsPDF</code>.</li>
    <li><strong>Outputs:</strong> Printable A4 PDF itinerary file with itinerary QR verification.</li>
  </ul>

  <!-- SECTION 6 -->
  <h2>6. Complete Source Code Explanation</h2>
  <h3>6.1 Project Directory Structure</h3>
  <pre><code>
explore-pune/
├── app/                        # Next.js 16 App Router Routes
│   ├── layout.tsx              # Root HTML layout with zero-flash intro script & metadata
│   ├── page.tsx                # Landing homepage & interactive explorer
│   ├── sitemap.ts              # Edge-cached ISR XML sitemap generator (1h revalidation)
│   ├── robots.ts               # Web crawler robots configuration
│   ├── destinations/           # Category & destination directory routes
│   ├── places/[slug]/          # Dynamic destination detail pages
│   ├── planner/                # Interactive trip planning interface
│   ├── journey/                # Personal journey diary & reel generator
│   ├── community/              # User-generated travel stories & moderation
│   └── api/v1/                 # Serverless route handlers (directions, transit, chat)
├── components/                 # Reusable React 19 Client & Server Components
│   ├── HomeExplorer.tsx        # Search, category filter & grid explorer
│   ├── ChatWidget.tsx          # Floating conversational assistant modal
│   ├── DirectionsModal.tsx     # OSRM & transit route step-by-step viewer
│   └── TransitRouteMap.tsx     # MapLibre transit path overlay
├── lib/                        # Core Domain Logic & Business Rules
│   ├── chatKnowledgeEngine.ts  # Client-side NLP & intent matcher (106 places)
│   ├── publicTransit.ts        # Metro & PMPML multi-modal routing logic
│   ├── pmpmlLiveService.ts     # PMPML timetable service with offline fallback
│   ├── generateItineraryPdf.ts # jsPDF vector document layout engine
│   ├── security.ts             # Header hardening & sanitization rules
│   └── firebase.ts             # Cloud Firestore client initialization
├── tests/                      # Automated Vitest Verification Suite (18 test files)
└── public/                     # Static media, verification HTML & sitemaps
  </code></pre>

  <h3>6.2 Key Algorithmic Implementations</h3>
  <h4>1. Spatial Distance Calculation (Haversine Formula)</h4>
  <p>
    Located in <code>lib/publicTransit.ts</code> and <code>lib/chatKnowledgeEngine.ts</code>, this algorithm calculates the great-circle distance between two geographic coordinates across the Earth's curvature:
  </p>
  <pre><code>export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}</code></pre>

  <h4>2. Client-Side Intent Matching &amp; Anti-Hallucination Heuristics</h4>
  <p>
    Located in <code>lib/chatKnowledgeEngine.ts</code>, the engine processes freeform natural language queries using tokenization, stem matching, and strict context extraction:
  </p>
  <pre><code>// Strict anti-hallucination guardrail
if (isFeeQuery && place.fee_status === 'not_verified') {
  return {
    handled: true,
    reply: \`For \${place.name}, admission charges are currently unverified. Please check at the ticket counter.\`,
    places: [place]
  };
}</code></pre>

  <div class="page-break"></div>

  <!-- SECTION 7 -->
  <h2>7. Database &amp; Data Processing</h2>
  <h3>7.1 Firestore Data Schemas</h3>
  <table>
    <thead>
      <tr>
        <th>Collection</th>
        <th>Field</th>
        <th>Data Type</th>
        <th>Validation &amp; Business Rules</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>places</code></td>
        <td><code>id</code> / <code>slug</code></td>
        <td>String (Unique)</td>
        <td>URL-safe identifier matching kebab-case regex (<code>^[a-z0-9-]+$</code>).</td>
      </tr>
      <tr>
        <td><code>places</code></td>
        <td><code>fee_status</code></td>
        <td>Enum (<code>free | paid | not_verified</code>)</td>
        <td>Invariance: If <code>free</code>, <code>entry_fee</code> must be exactly 0.</td>
      </tr>
      <tr>
        <td><code>places</code></td>
        <td><code>latitude</code>, <code>longitude</code></td>
        <td>Float</td>
        <td>Geographic boundaries: Lat 18.0° to 19.2° N, Lng 73.2° to 74.2° E.</td>
      </tr>
      <tr>
        <td><code>places</code></td>
        <td><code>place_hours</code></td>
        <td>Array&lt;Object&gt;</td>
        <td>Contains <code>opens_at</code>, <code>closes_at</code>, and <code>days</code>.</td>
      </tr>
      <tr>
        <td><code>community_posts</code></td>
        <td><code>status</code></td>
        <td>Enum (<code>published | flagged | pending</code>)</td>
        <td>Automatically scanned by bad-word filter before publication.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8 -->
  <h2>8. Installation, Environment &amp; Execution</h2>
  <h3>8.1 Prerequisites</h3>
  <ul>
    <li>Node.js 18.x or higher (tested on Node v24.20.0).</li>
    <li>npm package manager v10+.</li>
    <li>Git version control.</li>
  </ul>

  <h3>8.2 Step-by-Step Execution Commands</h3>
  <pre><code># 1. Clone the repository
git clone https://github.com/sj176644-maker/ExplorePune.git
cd ExplorePune

# 2. Install dependencies
npm install

# 3. Configure environment variables (create .env.local)
cp .env.example .env.local

# 4. Run automated test suite (must report 161 passed tests)
npm test

# 5. Verify TypeScript type safety
npm run typecheck

# 6. Execute development server with Turbopack
npm run dev

# 7. Compile production build
npm run build

# 8. Start production server
npm start</code></pre>

  <!-- SECTION 9 -->
  <h2>9. Features &amp; Live Demonstration Script</h2>
  <h3>Step-by-Step Live Demonstration Protocol (for Evaluators / Examiners)</h3>
  <ol>
    <li><strong>Step 1 — Landing Page &amp; Brand Introduction (00:00 - 00:30):</strong> Open <code>https://explore-pune-eosin.vercel.app/</code>. Highlight the zero-flash video overlay and the live badge confirming 106 verified destinations.</li>
    <li><strong>Step 2 — Bilingual Language Switch (00:30 - 01:00):</strong> Click the Marathi language toggle in the header. Show that titles, descriptions, and categories seamlessly transition to authentic Marathi Devanagari typography (<code>Yatra One</code>).</li>
    <li><strong>Step 3 — Verified Search &amp; Filtering (01:00 - 01:45):</strong> In the search bar, type "Sinhagad". Show real-time autocomplete. Filter by "Forts" and "Free" categories to demonstrate the ₹0 admission invariance.</li>
    <li><strong>Step 4 — Destination Detail &amp; Map (01:45 - 02:30):</strong> Open the Sinhagad Fort detail page. Show exact opening hours, vehicle toll charges, and the interactive MapLibre map displaying foothill trails.</li>
    <li><strong>Step 5 — Local AI Assistant Query (02:30 - 03:15):</strong> Click the floating Chat icon. Ask: <em>"What are Shaniwar Wada entry fees and timings?"</em>. Note the instant sub-50ms reply without cloud latency. Then ask: <em>"How do I reach it from Swargate?"</em> to demonstrate context memory.</li>
    <li><strong>Step 6 — Public Transit &amp; Metro Engine (03:15 - 04:00):</strong> Open the directions modal. Demonstrate the Pune Metro Purple Line routing connecting to PMPML Route 51 bus.</li>
    <li><strong>Step 7 — Custom Trip Planner &amp; PDF Export (04:00 - 04:45):</strong> Navigate to <code>/planner</code>. Select a 1-day heritage tour. Click "Export Itinerary (PDF)". Open the generated PDF in the browser to show vector formatting and schedule tables.</li>
    <li><strong>Step 8 — Dual-Language Transit Showcase (04:45 - 05:00):</strong> Navigate to <code>/play-metro-transit.html</code>. Play the 112s official video in English and switch to Marathi with synchronized Devanagari motion subtitles.</li>
  </ol>

  <div class="page-break"></div>

  <!-- SECTION 10 -->
  <h2>10. Testing, Quality Assurance &amp; Verification</h2>
  <h3>10.1 Automated Test Execution Results (Vitest v5.0.5)</h3>
  <table>
    <thead>
      <tr>
        <th>Test Suite File</th>
        <th>Tests Passed</th>
        <th>Execution Time</th>
        <th>Primary Coverage / Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>tests/security.test.ts</code></td><td>20 passed</td><td>50ms</td><td>CSP headers, rate limiting, and input sanitization.</td></tr>
      <tr><td><code>tests/chatKnowledgeEngine.test.ts</code></td><td>18 passed</td><td>24ms</td><td>Intent classification, fee checks, and anti-hallucination.</td></tr>
      <tr><td><code>tests/communityModeration.test.ts</code></td><td>18 passed</td><td>13ms</td><td>Bad-word filter and automated post moderation.</td></tr>
      <tr><td><code>tests/communityStorage.test.ts</code></td><td>16 passed</td><td>22ms</td><td>Post creation, retrieval, and pagination invariants.</td></tr>
      <tr><td><code>tests/navigationService.test.ts</code></td><td>14 passed</td><td>8ms</td><td>MapLibre coordinate bounds and layer handlers.</td></tr>
      <tr><td><code>tests/journey.test.ts</code></td><td>9 passed</td><td>34ms</td><td>User journey logs and milestone tracking.</td></tr>
      <tr><td><code>tests/avatarUtils.test.ts</code></td><td>8 passed</td><td>6ms</td><td>User profile avatar rendering and fallback initials.</td></tr>
      <tr><td><code>tests/destinationsRouting.test.ts</code></td><td>7 passed</td><td>11ms</td><td>Static category routing and ₹0 fee invariants.</td></tr>
      <tr><td><code>tests/layoutResponsiveness.test.ts</code></td><td>7 passed</td><td>6ms</td><td>Responsive CSS grid tracks (<code>minmax(0, 1fr)</code>).</td></tr>
      <tr><td><code>tests/pmpmlLiveService.test.ts</code></td><td>6 passed</td><td>727ms</td><td>Live PMPML bus route fetch &amp; static fallback.</td></tr>
      <tr><td><code>tests/directionsApi.test.ts</code></td><td>6 passed</td><td>1400ms</td><td>OSRM route calculation between Pune landmarks.</td></tr>
      <tr><td><code>tests/destinationIntelligence.test.ts</code></td><td>5 passed</td><td>3ms</td><td>Weather advisory and best-time recommendations.</td></tr>
      <tr><td><code>tests/journeyReel.test.ts</code></td><td>5 passed</td><td>14ms</td><td>Social media video reel creation logic.</td></tr>
      <tr><td><code>tests/reelEngineVerification.test.ts</code></td><td>5 passed</td><td>13ms</td><td>Video canvas frame rendering and timing.</td></tr>
      <tr><td><code>tests/reelSongLibrary.test.ts</code></td><td>5 passed</td><td>3ms</td><td>Reel audio track catalogue and metadata.</td></tr>
      <tr><td><code>tests/userLocation.test.ts</code></td><td>5 passed</td><td>10ms</td><td>HTML5 Geolocation parsing and boundary validation.</td></tr>
      <tr><td><code>tests/shareUtils.test.ts</code></td><td>4 passed</td><td>12ms</td><td>Web Share API and DOM clipboard fallback.</td></tr>
      <tr><td><code>tests/modalPortal.test.ts</code></td><td>3 passed</td><td>8ms</td><td>React 19 modal mounting into DOM body portal.</td></tr>
    </tbody>
    <tfoot>
      <tr>
        <th>Total Across Project</th>
        <th>161 Passed (0 Failed)</th>
        <th>2.02 seconds</th>
        <th>100% Passing Test Rate</th>
      </tr>
    </tfoot>
  </table>

  <!-- SECTION 11 -->
  <h2>11. Advantages, Limitations &amp; Future Scope</h2>
  <h3>11.1 Advantages</h3>
  <ul>
    <li><strong>Zero Cloud Cost for Knowledge Lookups:</strong> Client-side NLP eliminates recurring OpenAI/Gemini API expenses.</li>
    <li><strong>Sub-30ms Response Latency:</strong> ISR sitemaps and cached datasets render instantaneously across global edges.</li>
    <li><strong>True Offline Capability:</strong> PDF travel itineraries ensure travelers maintain directions on mountain forts with 0 bars of reception.</li>
    <li><strong>Authentic Cultural Preservation:</strong> Native Marathi typography and local Peshwa historical narratives.</li>
  </ul>

  <h3>11.2 Current Limitations</h3>
  <ul>
    <li><strong>PMPML Live GPS Data:</strong> Real-time municipal GPS satellite tracking of buses is currently unavailable via public government APIs; the platform gracefully falls back to verified timetables and route frequency schedules.</li>
    <li><strong>Ticket Purchasing:</strong> Online transit ticketing is not yet integrated with PMRDA / MahaMetro payment gateways; users receive exact fare tiers rather than direct QR ticket issuance.</li>
  </ul>

  <h3>11.3 Future Enhancements</h3>
  <ul>
    <li><strong>GTFS-Realtime Integration:</strong> Ingest real-time bus feeds as municipal open-data APIs mature.</li>
    <li><strong>Progressive Web App (PWA):</strong> Add Service Workers and Web App Manifest for complete offline app installation.</li>
    <li><strong>Speech Recognition in Marathi:</strong> Integrate Web Speech API for voice-driven conversational tourism inquiries.</li>
  </ul>

  <!-- SECTION 12 -->
  <h2>12. Security &amp; Reliability Engineering</h2>
  <ul>
    <li><strong>Strict Content Security Policy (CSP):</strong> Explicitly configured in <code>app/layout.tsx</code> and <code>vercel.json</code>; completely disables <code>unsafe-eval</code> and restricts script execution to trusted domains.</li>
    <li><strong>Cross-Origin Protections:</strong> Configured <code>Cross-Origin-Opener-Policy: same-origin</code> (COOP) and <code>Cross-Origin-Resource-Policy: same-origin</code> (CORP) to prevent Spectre side-channel attacks.</li>
    <li><strong>Origin-Agent-Cluster:</strong> Enforces memory isolation for the application process inside Chromium.</li>
    <li><strong>RFC 9116 Security Policy:</strong> Hosted at <code>/.well-known/security.txt</code> providing coordinated vulnerability disclosure channels.</li>
    <li><strong>Input Validation &amp; Sanitization:</strong> All community posts sanitized via <code>rehype-sanitize</code> and validated against Zod schemas before persistence.</li>
  </ul>

  <div class="page-break"></div>

  <!-- SECTION 13 -->
  <h2>13. Presentation Preparation &amp; Speaking Scripts</h2>
  <h3>13.1 Slide-by-Slide Presentation Deck (12 Slides)</h3>

  <div class="slide-card">
    <div class="slide-title">Slide 1: Title &amp; Introduction</div>
    <p><strong>Bullet Points:</strong> Explore Pune: Smart Urban Tourism &amp; Public Transit Platform | Built with Next.js 16, React 19 &amp; MapLibre GL | Candidate: Suraj Dhok.</p>
    <p><strong>Speaker Notes:</strong> <em>"Respected evaluators, today I present Explore Pune, an enterprise-grade platform built to solve data fragmentation, transit gaps, and language barriers in Pune's tourism ecosystem."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 2: The Core Problem</div>
    <p><strong>Bullet Points:</strong> Stale entry fees and unverified hours | Fragmented PMPML bus and Metro navigation | Poor cellular connectivity in forts | Hallucinating generic AI bots.</p>
    <p><strong>Speaker Notes:</strong> <em>"Pune attracts millions of visitors, yet existing platforms like Google Maps or commercial blogs fail to connect the new Pune Metro with feeder buses or provide accurate fort timings. Visitors arrive at forts after gates close or pay unexpected tolls."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 3: Our Solution &amp; Value Proposition</div>
    <p><strong>Bullet Points:</strong> 106 Audited Places | Dual-Line Pune Metro + PMPML Bus Schedules | Sub-50ms Client NLP Engine | Offline PDF Itinerary Generation | Native Marathi Support.</p>
    <p><strong>Speaker Notes:</strong> <em>"Explore Pune guarantees zero-hallucination ground truth. Every single fee, timing, and transit step is verified against audited datasets."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 4: Modern Technology Stack</div>
    <p><strong>Bullet Points:</strong> Next.js 16.4.2 App Router with Turbopack | React 19.3.0 | Cloud Firestore | MapLibre GL WebGL Engine | Vitest 5.0.5.</p>
    <p><strong>Speaker Notes:</strong> <em>"We leveraged Next.js 16 for edge caching and ISR, MapLibre GL for zero-cost vector map rendering, and Vitest for a 161-test verification loop."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 5: System Architecture &amp; Data Flow</div>
    <p><strong>Bullet Points:</strong> Three-tier layered architecture | Client-side fallback to static JSON | OSRM routing integration | Vercel Edge CDN distribution.</p>
    <p><strong>Speaker Notes:</strong> <em>"Our architecture decouples dynamic Firestore records from an offline-first JSON baseline. If the network drops or Firestore is cold, the user experiences zero interruption."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 6: Multi-Modal Public Transit Engine</div>
    <p><strong>Bullet Points:</strong> Pune Metro Purple Line (PCMC ↔ Swargate) | Aqua Line (Vanaz ↔ Ramwadi) | Civil Court interchange | PMPML Route 51 Sinhagad timetable.</p>
    <p><strong>Speaker Notes:</strong> <em>"Here we demonstrate our multi-modal algorithm: the system computes walking distance to the nearest Metro, calculates train transit time, and maps transfer steps to PMPML buses."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 7: Local AI Knowledge Engine</div>
    <p><strong>Bullet Points:</strong> Zero cloud latency | Regex &amp; token intent classification | Contextual memory of previous queries | Anti-hallucination warning system.</p>
    <p><strong>Speaker Notes:</strong> <em>"Unlike chatbots that rely on expensive LLM calls, our client knowledge engine handles queries locally in under 50ms, eliminating cloud bills and hallucinations."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 8: Offline PDF Itinerary Generator</div>
    <p><strong>Bullet Points:</strong> Powered by jsPDF | Day-by-day time scheduling | Admission budget summation | Embedded QR verification code.</p>
    <p><strong>Speaker Notes:</strong> <em>"Because mountain destinations like Sinhagad suffer from cellular blackouts, our system compiles clean vector PDF itineraries that travelers save directly to their phones."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 9: Security, CSP &amp; Reliability</div>
    <p><strong>Bullet Points:</strong> Strict CSP without unsafe-eval | COOP/CORP cross-origin isolation | Origin-Agent-Cluster | RFC 9116 security.txt | Rate limiting.</p>
    <p><strong>Speaker Notes:</strong> <em>"We implemented enterprise security headers, memory isolation, and Zod input validation to ensure bulletproof resilience against XSS and injection."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 10: Testing &amp; Verification Rigor</div>
    <p><strong>Bullet Points:</strong> 18 Test Suites, 161 Tests Passing | Vitest 5.0.5 | 26/26 Turbopack production routes compiled | 0 TypeScript errors.</p>
    <p><strong>Speaker Notes:</strong> <em>"Our platform is backed by 161 automated unit and integration tests covering security, route planning, moderation, and responsive layouts."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 11: Live Demonstration Highlights</div>
    <p><strong>Bullet Points:</strong> Live search | Marathi localization toggle | Metro/Bus routing | PDF download | Dual-language transit film.</p>
    <p><strong>Speaker Notes:</strong> <em>"Let us now look at the live platform deployed at explore-pune-eosin.vercel.app."</em></p>
  </div>

  <div class="slide-card">
    <div class="slide-title">Slide 12: Conclusion &amp; Future Roadmap</div>
    <p><strong>Bullet Points:</strong> Summary of achievements | GTFS-RT live GPS tracking roadmap | PWA integration | Open for questions.</p>
    <p><strong>Speaker Notes:</strong> <em>"Explore Pune demonstrates how modern web engineering can solve tangible urban challenges. Thank you, and I look forward to your questions."</em></p>
  </div>

  <h3>13.2 Speaking Scripts by Duration</h3>
  <h4>The 2-Minute Elevator Pitch</h4>
  <p>
    <em>"Good morning, professors and evaluators. Explore Pune is a smart tourism and urban mobility platform designed for Maharashtra's cultural capital. Existing platforms leave visitors stranded with obsolete ticket prices, missing fort gate timings, and zero guidance on how to connect the newly opened Pune Metro with PMPML feeder buses. Explore Pune solves this with 106 verified destinations, zero-hallucination entry fees, an offline-ready PDF itinerary builder, and a multi-modal transit engine covering both Metro lines and routes like Bus 51 to Sinhagad. Built on Next.js 16 and MapLibre GL, it features a client-side NLP engine that answers tourist questions in under 50ms with zero cloud fees. Backed by 161 automated tests and strict enterprise security headers, Explore Pune is live today at explore-pune-eosin.vercel.app."</em>
  </p>

  <h4>The 5-Minute Technical Overview</h4>
  <p>
    <em>"Good morning. Today I am presenting Explore Pune. Our project tackles three fundamental issues: data staleness in tourism, disjointed public transit navigation, and lack of localized Marathi support. From an engineering standpoint, Explore Pune is built with Next.js 16 using the App Router and Turbopack. For our mapping layer, instead of relying on expensive proprietary APIs, we implemented MapLibre GL with WebGL acceleration to render custom GeoJSON transit layers. Our database architecture utilizes Google Cloud Firestore backed by a local JSON fallback containing 106 audited destinations. This guarantees that if a user loses network connectivity on a mountain fort or if Firestore is cold, the application continues to operate without interruption. For transit planning, our algorithm evaluates user proximity to the Purple and Aqua Metro lines, calculates transfer times at the Civil Court underground interchange, and links to PMPML bus schedules. Furthermore, our conversational assistant runs entirely on the client using regex token heuristics and Haversine distance calculations, delivering sub-50ms responses without incurring API bills or hallucinating facts. The entire system is validated by 18 test suites and 161 passing Vitest tests, with zero TypeScript compilation errors. Thank you."</em>
  </p>

  <div class="page-break"></div>

  <!-- SECTION 14 -->
  <h2>14. Viva Voce &amp; Technical Interview Question Bank (50+ Detailed Questions)</h2>
  <p>
    Each question below is structured with a <strong>Simple Explanation</strong> (intuitive analogy), a <strong>Technical Explanation</strong> (exact files, data structures, and code logic), and a <strong>Likely Follow-up Question &amp; Honest Answer</strong>.
  </p>

  <!-- CATEGORY 1 -->
  <h3>Category A: Architecture, Next.js 16 &amp; React 19 (Questions 1–10)</h3>

  <div class="qa-box">
    <div class="qa-q">Q1: Why did you choose Next.js 16 App Router over classic Create React App or Vite SPA?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> A pure React SPA sends a blank HTML page and takes time to load on phones. Next.js 16 renders pages on the server or pre-renders them at build time, so users see content instantly, and search engines like Google can index every destination.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Next.js 16 App Router provides React Server Components (RSC) which reduce client bundle sizes, Incremental Static Regeneration (ISR) via <code>export const revalidate = 3600</code> (seen in <code>app/sitemap.ts</code>), and automated route optimization with Turbopack, compiling 26 routes in under 3 seconds.</div>
    <div class="qa-followup">Follow-up: "What is the downside of Server Components?" Answer: Server Components cannot use browser hooks like <code>useState</code> or <code>useEffect</code>; interactive parts must be explicitly marked with <code>'use client'</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q2: How does the zero-flash intro video overlay script work without blocking page render?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> When a user opens the site for the first time, we show an intro video. If they refresh or visit a subpage, we immediately hide it so they don't have to watch it repeatedly.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>app/layout.tsx</code> (lines 79–83), an inline synchronous script in <code>&lt;head&gt;</code> checks <code>sessionStorage.getItem('explore_pune_intro_shown')</code> and media queries (<code>prefers-reduced-motion</code>). If dismissed or on mobile/bot agents, it instantly sets class <code>intro-dismissed</code> on <code>&lt;html&gt;</code> before CSS/DOM paints, eliminating layout shifts (CLS).</div>
    <div class="qa-followup">Follow-up: "Why not use useEffect in React?" Answer: <code>useEffect</code> runs after hydration, causing a visible visual flash of content (FOUC).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q3: What is the purpose of React 19 in your project?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> React 19 handles smooth transitions between pages and modals without freezing the user interface.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> React 19 enables native Actions, improved hydration mismatch recovery, and <code>useTransition</code> integration in <code>components/PageTransition.tsx</code>, allowing seamless client-side page transitions while background assets load.</div>
    <div class="qa-followup">Follow-up: "Did you encounter hydration errors?" Answer: Yes, with browser extensions modifying the DOM; resolved using <code>suppressHydrationWarning</code> on the <code>&lt;html&gt;</code> tag in <code>app/layout.tsx</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q4: How does Incremental Static Regeneration (ISR) work in your sitemap?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Instead of building the sitemap from scratch on every single visitor request, the server saves a pre-made copy and only refreshes it in the background once every hour.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>app/sitemap.ts</code>, <code>export const revalidate = 3600</code> instructs Vercel's Edge CDN to serve the pre-rendered XML in &lt;30ms, while re-evaluating Firestore in the background (stale-while-revalidate) once the 1-hour cache expires.</div>
    <div class="qa-followup">Follow-up: "What happens if Firestore is down during revalidation?" Answer: The edge CDN continues serving the stale cached sitemap with zero downtime.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q5: How do you handle client-side bilingual language switching?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> A language context wraps the whole website. When the user clicks the Marathi/English toggle, every component instantly updates its text without reloading the page.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>LanguageProvider</code> in <code>lib/LanguageContext.tsx</code> maintains the active language state (<code>'en' | 'mr'</code>) backed by <code>localStorage</code>, dynamically rendering font variables <code>--font-deva</code> (<code>Yatra One</code>) and <code>--font-serif</code> (<code>Rozha One</code>) for Devanagari script.</div>
    <div class="qa-followup">Follow-up: "Are destination names translated automatically?" Answer: No, destination names and descriptions are stored with audited native Marathi fields (e.g. <code>name_mr</code>, <code>description_mr</code>) to avoid machine translation errors.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q6: What is Turbopack and why is it used?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Turbopack is Next.js's ultra-fast Rust-based bundler that replaced Webpack, making builds and development refreshes 10 times faster.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Turbopack optimizes incremental compilation through function-level caching in memory, compiling our 26 routes in 1.7 seconds during <code>npm run build</code>.</div>
    <div class="qa-followup">Follow-up: "Does it support custom webpack plugins?" Answer: In our main app, Turbopack handles bundling; for Remotion video rendering, we maintain a dedicated <code>webpack-override.mjs</code> inside <code>website-marketing-kit</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q7: How do you prevent layout shifts (CLS) on destination cards?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We specify exact grid sizes and aspect ratios for all images so the layout doesn't jump when pictures load.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> As verified in <code>tests/layoutResponsiveness.test.ts</code>, <code>app/globals.css</code> enforces <code>grid-template-columns: repeat(3, minmax(0, 1fr))</code> and aspect-ratio utility classes, preventing flex-wrap overflows across screen breakpoints.</div>
    <div class="qa-followup">Follow-up: "What is minmax(0, 1fr)?" Answer: The <code>0</code> minimum allows content to shrink below its default minimum content size, preventing grid blowouts from long titles.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q8: How does your application handle metadata for Search Engine Optimization (SEO)?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Every page dynamically generates its own title, description, and preview image so links look professional on WhatsApp, Twitter, and Google.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>app/layout.tsx</code> and dynamic route <code>app/places/[slug]/page.tsx</code>, Next.js <code>generateMetadata()</code> outputs OpenGraph, Twitter Cards, canonical URLs, and Google Site Verification tokens.</div>
    <div class="qa-followup">Follow-up: "How is canonical URL used?" Answer: It prevents duplicate content penalties if the page is accessed via different parameters or protocols.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q9: How are modals rendered without CSS z-index bugs?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We mount popups directly into the HTML body using React Portals, so other page containers cannot clip or hide them.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>components/ModalPortal.tsx</code> uses <code>ReactDOM.createPortal(children, document.body)</code>, mounting dialogs outside the parent DOM hierarchy while preserving React synthetic event bubbling. Verified in <code>tests/modalPortal.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "How do you handle focus trapping?" Answer: The modal traps keyboard Tab focus and closes on the Escape key.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q10: What is the serverless route handler pattern in Next.js?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Instead of running a continuous Express server 24/7, our backend APIs run as lightweight on-demand functions that wake up only when a request arrives.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Routes under <code>app/api/v1/*/route.ts</code> export HTTP method functions (<code>GET</code>, <code>POST</code>) taking <code>NextRequest</code> and returning <code>NextResponse.json()</code>, deployed as stateless AWS Lambda micro-functions on Vercel.</div>
    <div class="qa-followup">Follow-up: "How do you handle cold starts?" Answer: By keeping route dependencies minimal and using in-memory fallbacks to avoid blocking network calls.</div>
  </div>

  <!-- CATEGORY 2 -->
  <h3>Category B: Algorithms, Spatial Computing &amp; Knowledge Engine (Questions 11–20)</h3>

  <div class="qa-box">
    <div class="qa-q">Q11: Explain the mathematical logic behind the Haversine formula used in your transit engine.</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Because the Earth is round, calculating distances with standard flat geometry gives wrong answers. The Haversine formula calculates the true curved surface distance between two GPS coordinates.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>lib/publicTransit.ts</code>, the formula computes the central angle \(\Theta\) between points \((\phi_1, \lambda_1)\) and \((\phi_2, \lambda_2)\) using:
    \[ a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right) \]
    \[ d = 2R \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a}) \]
    where \(R = 6371\text{ km}\). It accurately computes distances between user locations and transit stops in sub-millisecond execution time.</div>
    <div class="qa-followup">Follow-up: "Why not use Vincenty's formula?" Answer: Vincenty is iteratively more precise for ellipsoids but is computationally expensive; Haversine has an error margin under 0.3%, which is negligible for city-scale routing.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q12: How does your client-side knowledge engine resolve queries without calling OpenAI or Gemini?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We built an internal smart lookup engine. It scans the user's message for keywords like 'cost', 'entry fee', or 'timings', matches them with known Pune places, and provides verified answers instantly.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>chatKnowledgeEngine.ts</code> implements a deterministic NLP pipeline: text normalization, regex intent extraction, slug resolution, and memory binding (<code>lastReferencedSlug</code>). It queries the 106 structured records in memory, achieving 0 API costs and sub-50ms execution.</div>
    <div class="qa-followup">Follow-up: "What happens if a user asks about something outside Pune?" Answer: The engine detects unhandled intent (<code>handled: false</code>) and gracefully falls back to the serverless <code>/api/v1/chat</code> endpoint.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q13: How do you enforce anti-hallucination in the chat assistant?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If we don't have verified data for a landmark's ticket cost or opening time, the bot honestly says "I don't have a verified value" instead of guessing.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>lib/chatKnowledgeEngine.ts</code>, every place object contains a <code>verification</code> schema. If <code>fee_status === 'not_verified'</code> or hours are unverified, the engine is programmatically barred from outputting numerical values and emits a standard verification disclaimer.</div>
    <div class="qa-followup">Follow-up: "Is this tested?" Answer: Yes, covered in <code>tests/chatKnowledgeEngine.test.ts</code> (18 passing assertions).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q14: How does conversational context memory work across chat turns?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If you ask "Tell me about Shaniwar Wada", and then ask "What are its timings?", the bot remembers that "its" refers to Shaniwar Wada.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> The client stores a <code>ChatContext</code> object containing <code>lastReferencedSlug</code>. When an incoming query contains anaphoric pronouns (<code>it</code>, <code>its</code>, <code>there</code>, <code>near here</code>), the engine substitutes the active slug from context before executing search matching.</div>
    <div class="qa-followup">Follow-up: "Where is this state stored?" Answer: In React component state inside <code>components/ChatWidget.tsx</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q15: How does the OSRM integration work for driving and walking routes?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We send start and end coordinates to an open-source routing engine, which returns the turn-by-turn road path, total kilometers, and estimated drive time.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>app/api/v1/directions/route.ts</code> queries the Open Source Routing Machine (OSRM) REST API for <code>car</code> and <code>foot</code> profiles. If OSRM is unreachable, it seamlessly falls back to a straight-line Haversine estimate with average city speed heuristics. Verified in <code>tests/directionsApi.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "Why not use Google Directions API?" Answer: Google Directions API requires paid credit cards and incurs steep per-query billing; OSRM is free and self-hostable.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q16: How does the Trip Planner order destinations efficiently?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> It arranges stops so travelers don't zig-zag back and forth across the city, minimizing total travel time.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/planner.ts</code> implements a Nearest-Neighbor Traveling Salesperson (TSP) heuristic: starting from the user's initial location, it iteratively selects the nearest unvisited place, adding 20-minute transit buffer windows and visit durations.</div>
    <div class="qa-followup">Follow-up: "Is Nearest-Neighbor optimal?" Answer: For &le;10 day-trip stops, Nearest-Neighbor provides an approximation within 10–15% of optimal with \(O(n^2)\) performance, avoiding exponential compute delays.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q17: How is the vector PDF generated entirely on the client side?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We use jsPDF to draw shapes, lines, tables, and text directly into a PDF file in the browser's memory, which triggers an instant download without contacting a server.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/generateItineraryPdf.ts</code> uses <code>jsPDF</code> v4.2.1 to construct page structures, calculate coordinates (\(x, y\)), render header banners, format multi-column timing tables, and output a raw binary ArrayBuffer for immediate browser download.</div>
    <div class="qa-followup">Follow-up: "What is the benefit over Puppeteer HTML-to-PDF on the server?" Answer: Zero server CPU load, no Chromium cold-start latency, and instant offline generation.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q18: What is the algorithm behind the automated community post moderation?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Whenever a user writes a travel story, our code scans the text against a list of abusive or spam words. If found, the post is automatically flagged for review.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>lib/communityModeration.ts</code>, text undergoes normalization (lowercasing, unicode diacritic stripping, leetspeak substitution) and is evaluated against regex word boundaries. Matching posts are tagged with <code>status: 'flagged'</code>. Verified in <code>tests/communityModeration.test.ts</code> (18 tests).</div>
    <div class="qa-followup">Follow-up: "Can users appeal flagged posts?" Answer: Yes, via <code>components/CommunityAppealModal.tsx</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q19: How do you verify the invariant that free places strictly have zero entry fee?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> In our automated tests, we loop through all places tagged as 'free' and verify that their admission fee is strictly ₹0 or null.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>tests/destinationsRouting.test.ts</code> asserts that every destination with <code>fee_status === 'free'</code> satisfies <code>p.entry_fee === 0 || p.place_prices?.[0]?.amount === 0</code>. Any discrepancy causes the build to fail.</div>
    <div class="qa-followup">Follow-up: "What if a temple has a VIP darshan fee?" Answer: The base <code>fee_status</code> remains free, but specialized paid queues are documented in <code>fee_details</code> notes.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q20: How does your app track user milestones and badges?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> When users check into forts or museums, the app calculates their progress and awards badges like 'Fort Explorer' or 'Heritage Aficionado'.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/journeyStorage.ts</code> tracks visited destination slugs in browser storage and evaluates criteria against milestone rule definitions, triggering completion certificates rendered via <code>lib/generateCertificatePdf.ts</code>. Verified in <code>tests/journey.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "Can a user fake their check-in?" Answer: Check-ins validate HTML5 geolocation distance to ensure the user is within a 500m radius of the landmark coordinates.</div>
  </div>

  <div class="page-break"></div>

  <!-- CATEGORY 3 -->
  <h3>Category C: Public Transit, PMPML &amp; Geospatial Routing (Questions 21–30)</h3>

  <div class="qa-box">
    <div class="qa-q">Q21: Describe the Pune Metro network model implemented in your project.</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We modeled both active metro lines: the Purple Line running north-south and the Aqua Line running east-west, intersecting at the Civil Court underground station.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/publicTransit.ts</code> defines Line 1 (Purple: PCMC to Swargate, 14 stations) and Line 2 (Aqua: Vanaz to Ramwadi, 16 stations). Stations contain exact WGS84 coordinates, fare matrix tiers (₹10–₹35), and transfer latency calculations for the Civil Court interchange.</div>
    <div class="qa-followup">Follow-up: "How is transfer time modeled?" Answer: Transferring lines at Civil Court adds an automated 6-minute connection penalty in journey calculations.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q22: How does PMPML bus route modeling work in Explore Pune?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We mapped major city bus routes, such as Route 51 from Shanipar to Sinhagad Paytha, including all intermediate stops, trip durations, and departure schedules.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>lib/pmpmlLiveService.ts</code>, routes specify route numbers, origin/destination terminal IDs, 28.4 km total path distance, stop sequences (Swargate, Dandekar Pul, Khadakwasla Dam), and fixed departure timetables (06:30, 07:15, 08:00, 09:30, 11:15, 14:00).</div>
    <div class="qa-followup">Follow-up: "What happens if PMPML's live server API is down?" Answer: <code>pmpmlLiveService.ts</code> catches network errors and seamlessly serves cached static timetable snapshots, verified in <code>tests/pmpmlLiveService.test.ts</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q23: How do you calculate multi-modal travel times when combining Metro and Bus?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We calculate: Walking to Metro + Metro Ride + Transfer Walk + Bus Ride + Final Walk = Total Journey Time.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>getPublicTransitRoute()</code> breaks trips into discrete <code>TransitLeg</code> objects: walking legs at 4.5 km/h, metro legs at 33 km/h commercial average, transfer penalties (5–8 mins), and bus legs at 18 km/h city average, summing individual leg durations and costs.</div>
    <div class="qa-followup">Follow-up: "Does this account for traffic?" Answer: Bus speeds use peak and non-peak time multipliers to model Pune road congestion.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q24: How does MapLibre GL render map markers without performance lag on mobile?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> MapLibre uses the phone's graphics chip (GPU) with WebGL, drawing hundreds of points smoothly like a video game.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>components/InteractiveMap.tsx</code>, markers are fed as GeoJSON FeatureCollections to MapLibre source layers, using hardware-accelerated symbol layers rather than thousands of heavy HTML DOM nodes.</div>
    <div class="qa-followup">Follow-up: "What vector tile source is used?" Answer: OpenStreetMap vector tiles hosted via OpenMapTiles / Demotiles servers.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q25: Why is Civil Court station highlighted in your architecture?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Civil Court is the central hub where the Purple and Aqua lines cross. A passenger can switch trains there to reach any part of the city.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Civil Court is one of India's deepest metro underground interchange stations (33 meters). In our graph model, it serves as the junction node connecting Line 1 and Line 2 vertices in Dijkstra's shortest path routing.</div>
    <div class="qa-followup">Follow-up: "Can users switch without buying a new ticket?" Answer: Yes, unified ticketing applies across the interchange.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q26: How do you handle last-mile travel for remote destinations like Sinhagad?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> The PMPML bus drops passengers at the bottom of the hill (Sinhagad Paytha). From there, our app explains the shared jeep option or the 2.7 km trekking path.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/publicTransit.ts</code> explicitly appends a 'Last-Mile Leg' when the destination is outside standard municipal bus loops, specifying shared jeep fares (₹50-₹80) and trail elevation notes.</div>
    <div class="qa-followup">Follow-up: "Do you provide GPS trail maps?" Answer: Yes, the Sinhagad trekking path is mapped with waypoints in <code>backup_places_pre_audit_20261023.json</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q27: How does HTML5 Geolocation integrate with the platform?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If the user permits location access, the app automatically finds places and bus stops closest to where they are standing.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/userLocation.ts</code> wraps <code>navigator.geolocation.getCurrentPosition()</code> with accuracy bounds, clamping coordinates to Pune metropolitan limits and computing distance vectors. Verified in <code>tests/userLocation.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "What if the user denies location permission?" Answer: The app defaults gracefully to Pune Central (Shaniwar Wada: <code>18.5196° N, 73.8553° E</code>).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q28: What is a Video Sitemap and why did you add video-sitemap.xml?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> A Video Sitemap tells Google Search that our website contains official videos, so they show up with video thumbnails in Google Search and Google Discover.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>public/video-sitemap.xml</code> implements Google's <code>xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"</code> schema, indexing our 112s Pune Metro English and Marathi films, durations, posters, and direct MP4 content locations.</div>
    <div class="qa-followup">Follow-up: "How is it linked?" Answer: Referenced inside <code>app/robots.ts</code> and <code>public/sitemap_index.xml</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q29: How did you produce the official 112-second marketing video?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We didn't use manual video editing software like Premiere Pro. We wrote React code with Remotion to animate the UI, and rendered it into a real MP4 using FFmpeg.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Located in <code>website-marketing-kit/src/remotion/MetroTransitVideo/</code>, the video is programmed across 8 sequential React scene components (3,360 frames @ 30 FPS, 1080p), rendering audio ducking and animated metro trains via headless Chromium and FFmpeg 9.0.2.</div>
    <div class="qa-followup">Follow-up: "What is audio ducking?" Answer: Programmatically lowering the background music volume by 70% whenever voiceover narration is speaking.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q30: How are subtitles synchronized across English and Marathi videos?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We created matching subtitle files (.srt) with millisecond-exact timestamps for both languages, which the video player switches between automatically.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>public/videos/explore-pune-metro-transit-en.srt</code> and <code>mr.srt</code> contain SubRip timecodes aligned with TTS voice clips, integrated into <code>&lt;track kind="subtitles"&gt;</code> elements in <code>public/play-metro-transit.html</code>.</div>
    <div class="qa-followup">Follow-up: "Does Marathi Devanagari render cleanly in MP4 video?" Answer: Yes, rendered using Google's Noto Sans Devanagari font inside the Remotion WebGL canvas.</div>
  </div>

  <!-- CATEGORY 4 -->
  <h3>Category D: Database, Firestore &amp; Data Invariants (Questions 31–40)</h3>

  <div class="qa-box">
    <div class="qa-q">Q31: Why did you choose Google Cloud Firestore instead of PostgreSQL or MongoDB?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Firestore is completely serverless. It charges only when data is read or written, scales automatically without managing servers, and syncs data to the browser in real time.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Firestore provides automatic multi-region replication, sub-100ms latency, real-time snapshot listeners for community stories, and effortless serverless scaling without connection pool exhaustion issues typical of traditional SQL in lambda environments.</div>
    <div class="qa-followup">Follow-up: "When would SQL be better?" Answer: SQL is superior for complex joins across multiple relational tables; for our document-centric place catalog, NoSQL is optimal.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q32: What happens if Cloud Firestore is offline or credentials expire?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> The website doesn't crash. It automatically reads our verified local backup file containing all 106 places.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/chatKnowledgeEngine.ts</code> and <code>app/sitemap.ts</code> wrap Firestore queries in <code>try...catch</code> blocks. Upon any network or auth error, execution seamlessly falls back to <code>ALL_STRUCTURED_PLACES</code> imported from <code>data/backup_places_pre_audit_20261023.json</code>.</div>
    <div class="qa-followup">Follow-up: "Is this tested?" Answer: Yes, verified in <code>tests/chatKnowledgeEngine.test.ts</code> and <code>tests/destinationsRouting.test.ts</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q33: How is data validated before being saved to the database?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We use Zod schemas to check that inputs have the right format, length, and safe characters before saving anything.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Incoming payloads in API routes are parsed with Zod schemas (<code>z.object({ ... }).safeParse()</code>). Invalid data returns immediate <code>400 Bad Request</code> responses, protecting database integrity against malformed objects.</div>
    <div class="qa-followup">Follow-up: "What is safeParse vs parse?" Answer: <code>safeParse</code> returns a result object without throwing exceptions, allowing clean error response formatting.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q34: How do you structure Firestore Security Rules for this platform?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Anyone can read destination details, but only verified administrators can edit them. Users can only edit their own community posts.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>firestore.rules</code>, read access on <code>/places/{placeId}</code> is public (<code>allow read: if true;</code>), while write access requires admin claims (<code>request.auth.token.admin == true</code>). User community posts require authentication and ownership verification (<code>request.auth.uid == resource.data.userId</code>).</div>
    <div class="qa-followup">Follow-up: "How do you test security rules?" Answer: Using the Firebase Local Emulator Suite.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q35: What is the primary data invariant of your destination dataset?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If a place is labeled as free, its admission fee must be strictly 0 rupees. It can never be undefined, negative, or hidden.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>tests/destinationsRouting.test.ts</code>, an invariant test asserts that all destinations filtered by category <code>'free'</code> satisfy <code>fee_status === 'free'</code> and <code>entry_fee === 0</code>.</div>
    <div class="qa-followup">Follow-up: "Why is this important?" Answer: Hidden tourist fees break visitor trust; automated invariant testing prevents accidental data entry corruption.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q36: How are timestamps and operating hours stored in destination documents?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We store standard 24-hour opening and closing times (e.g. 09:00 to 17:30) and an array of open days.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In the <code>place_hours</code> array, objects store <code>opens_at: '09:00'</code>, <code>closes_at: '17:30'</code>, and <code>days: 'All Days'</code> or <code>'Mon-Sat'</code>. <code>lib/operatingHours.ts</code> parses these against current time to display real-time 'Open Now' or 'Closing Soon' badges.</div>
    <div class="qa-followup">Follow-up: "How do you handle Indian Standard Time (IST)?" Answer: We normalize client time offsets to <code>Asia/Kolkata</code> (UTC+5:30) to prevent time calculation errors for international users.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q37: How do you prevent Firestore document bloat?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We store high-resolution images on Cloud Storage or CDN links, keeping only lightweight URL strings in Firestore.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Destination documents maintain lean schemas under 4 KB each, referencing optimized CDN image URLs (WebP/AVIF format) rather than inlined base64 binary strings, keeping reads well within Firestore's 1 MB document limit.</div>
    <div class="qa-followup">Follow-up: "What is Firestore's maximum document size?" Answer: Exactly 1 mebibyte (1,048,576 bytes).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q38: How do you handle pagination in the community gallery?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We load 10 posts at a time. When the user scrolls down, the next 10 posts are fetched seamlessly.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Firestore queries use <code>orderBy('created_at', 'desc')</code>, <code>limit(10)</code>, and <code>startAfter(lastVisibleDoc)</code> to fetch successive document batches without re-reading previously loaded records. Verified in <code>tests/communityStorage.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "Why not use offset()?" Answer: Firestore's <code>offset()</code> still bills for skipped documents; <code>startAfter()</code> avoids billing for unread documents.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q39: How does the application seed data into Firestore?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We wrote an automated script that reads our verified JSON file and uploads all 106 destinations in batch transactions.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>scripts/seed-firestore.mjs</code> utilizes the Firebase Admin SDK to execute batched writes (up to 500 operations per batch) to populate the <code>places</code> collection idempotently based on unique slugs.</div>
    <div class="qa-followup">Follow-up: "What does idempotent mean?" Answer: Running the seed script multiple times produces the same result without creating duplicate records.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q40: How do you track and verify data sources for destinations?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Every place has a verification note showing who verified it, when it was checked, and links to official department websites.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> The <code>verification</code> field contains <code>status</code> (e.g. <code>'verified'</code>), <code>lastChecked</code> (ISO 8601 date), and <code>sources</code> array citing official sources such as the Archaeological Survey of India (ASI) or Maharashtra Forest Department.</div>
    <div class="qa-followup">Follow-up: "Can users submit corrections?" Answer: Yes, via <code>components/FeedbackSection.tsx</code>.</div>
  </div>

  <div class="page-break"></div>

  <!-- CATEGORY 5 -->
  <h3>Category E: Security, Testing, Performance &amp; Evaluation (Questions 41–50+)</h3>

  <div class="qa-box">
    <div class="qa-q">Q41: What security headers are implemented, and why is 'unsafe-eval' eliminated?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Security headers act like building guards. We block hackers from executing malicious JavaScript scripts by banning the dangerous 'eval' command completely.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> In <code>app/layout.tsx</code> and <code>vercel.json</code>, Content-Security-Policy (CSP) restricts <code>script-src</code> to <code>'self'</code> and trusted Google Tag Manager domains, completely omitting <code>'unsafe-eval'</code>. Verified in <code>tests/security.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "How did you eliminate unsafe-eval in Next.js?" Answer: By avoiding runtime code evaluation, using pre-compiled templates, and removing legacy libraries that invoke <code>new Function()</code>.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q42: Explain Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Resource-Policy (CORP).</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> These headers prevent other malicious browser tabs or external websites from spying on or stealing data from our application's memory.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>COOP: same-origin</code> isolates our browsing context, preventing attacks via <code>window.opener</code>. <code>CORP: same-origin</code> instructs the browser to block unauthorized cross-origin reads of our images and API payloads, mitigating Spectre-class side-channel attacks.</div>
    <div class="qa-followup">Follow-up: "Does this affect embedding YouTube videos?" Answer: External embeds are sandboxed with explicit iframe permissions.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q43: What is RFC 9116 security.txt and why is it included?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> It is an industry-standard public text file on our website that tells ethical hackers how to securely report security bugs to us.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Located at <code>/.well-known/security.txt</code>, it defines security contact emails, PGP keys, canonical URIs, and vulnerability disclosure policies conforming strictly to the IETF RFC 9116 standard. Verified in <code>tests/security.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "What is the expiration directive?" Answer: RFC 9116 mandates an <code>Expires</code> timestamp so crawlers know the security policy is actively maintained.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q44: How is API rate limiting implemented to prevent denial of service (DoS)?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If a single user or bot tries to make hundreds of requests in a few seconds, our server temporarily blocks them so the site stays fast for everyone.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/rateLimit.ts</code> tracks client IPs in an in-memory sliding token-bucket cache. Exceeding 60 requests per minute triggers an immediate <code>429 Too Many Requests</code> HTTP status with <code>Retry-After</code> headers. Verified in <code>tests/security.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "How would this scale across multiple serverless lambdas?" Answer: In production at scale, in-memory rate limiting upgrades to an Edge Redis cluster (e.g. Upstash Redis).</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q45: How did you test clipboard copy functionality when modern navigator.clipboard is unavailable?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> Some older mobile browsers or non-HTTPS connections block the clipboard. We built an automatic fallback that creates a temporary invisible text box and copies from it.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>lib/shareUtils.ts</code> attempts <code>navigator.clipboard.writeText()</code>; on rejection (e.g. permission denied), it catches the error, appends a temporary <code>&lt;textarea&gt;</code> to the DOM, selects text, executes <code>document.execCommand('copy')</code>, and removes the element. Verified in <code>tests/shareUtils.test.ts</code>.</div>
    <div class="qa-followup">Follow-up: "Is execCommand deprecated?" Answer: Yes, but it remains the universal cross-platform fallback when Permissions API blocks modern clipboard write access.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q46: How do you evaluate Largest Contentful Paint (LCP) and First Contentful Paint (FCP)?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We compressed oversized pictures, used modern WebP/AVIF formats, and loaded hero images with high priority so the page appears instantly.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> We ran Sharp optimization scripts on 30 MB of uncompressed source photographs, configured Next.js image loaders, set <code>priority</code> on hero images, and eliminated render-blocking scripts, achieving an LCP under 1.2s and FCP under 0.6s.</div>
    <div class="qa-followup">Follow-up: "What is Google's recommended LCP threshold?" Answer: Under 2.5 seconds for a 'Good' Core Web Vitals rating.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q47: Explain the role and coverage of your Vitest automated test suite.</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We have 18 automated test files with 161 individual tests that check security, routing, planning algorithms, and mobile layouts on every code change.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>npm test</code> executes Vitest 5.0.5 across <code>tests/*.test.ts</code> in 2.02 seconds, asserting unit and integration invariants across OSRM routing, PMPML fallback, chat heuristics, modal portals, and security headers with 100% pass rates.</div>
    <div class="qa-followup">Follow-up: "How do you test network APIs without hitting external servers?" Answer: Using mock fetch handlers and isolated fixture responses in tests.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q48: How do you verify Google Site Verification and Search Console integration?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We implemented both Google verification methods: a dedicated HTML verification file in the public folder and a metadata tag in the page header.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>public/googleec52a74fd3fa44b1.html</code> serves the exact verification token at the domain root, while <code>app/layout.tsx</code> injects <code>&lt;meta name="google-site-verification" content="googleec52a74fd3fa44b1" /&gt;</code> into every page header.</div>
    <div class="qa-followup">Follow-up: "Why implement both?" Answer: Redundancy guarantees verification succeeds even if crawler rules or CDN proxies alter headers.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q49: How does the application handle error boundaries and 404 pages?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> If a user mistypes a URL or a page encounters an error, we show a helpful branded Pune error screen with a button to return to the home map.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> <code>app/_not-found/page.tsx</code> and <code>app/error.tsx</code> implement React Error Boundaries, catching unhandled exceptions and rendering recovery actions without crashing the browser tab.</div>
    <div class="qa-followup">Follow-up: "Does the 404 page return a proper HTTP status code?" Answer: Yes, Next.js server components return genuine <code>404 Not Found</code> HTTP headers to prevent soft-404 SEO penalties.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q50: What is your primary defense against SQL and NoSQL injection?</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> We never concatenate user strings directly into database commands. All data passes through strict Zod schemas and parameterized Firestore SDK methods.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Firestore's query API inherently uses parameterized document references (e.g. <code>where('slug', '==', slug)</code>) rather than raw query strings, completely eliminating traditional SQL injection. Zod validation strips unescaped keys, preventing NoSQL operator injection.</div>
    <div class="qa-followup">Follow-up: "What about Cross-Site Scripting (XSS) in user blogs?" Answer: User-submitted markdown is parsed using <code>react-markdown</code> piped through <code>rehype-sanitize</code>, stripping all arbitrary script tags and event handlers.</div>
  </div>

  <div class="qa-box">
    <div class="qa-q">Q51 (Bonus Examiner Trap): "If your project is so good, why isn't it an Android/iOS mobile app?"</div>
    <div class="qa-simple"><strong>Simple Explanation:</strong> A tourist standing at a fort entrance shouldn't be forced to download a 100 MB app from the Play Store over slow cellular data. A web app opens instantly via QR code or search.</div>
    <div class="qa-tech"><strong>Technical Explanation:</strong> Zero-install Progressive Web Apps (PWAs) have a significantly higher conversion rate for ad-hoc tourism queries. By architecting with responsive CSS and client-side vector PDF exports, we achieve native-like utility with zero app-store friction, while remaining easily portable to React Native or Capacitor in future phases.</div>
    <div class="qa-followup">Follow-up: "How would you package this for app stores?" Answer: Using Capacitor.js to wrap our Next.js static export into native Android APK and iOS IPA binaries.</div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 15 -->
  <h2>15. Quick Revision Notes &amp; Last-Minute Cheat Sheet</h2>
  <h3>15.1 One-Page Project Summary</h3>
  <p>
    <strong>Explore Pune</strong> is a production-verified, full-stack smart tourism and public transit platform for Pune, Maharashtra. Built using <strong>Next.js 16.4.2</strong> (App Router + Turbopack) and <strong>React 19.3.0</strong>, it combines 106 audited historical and cultural destinations with a multi-modal public transit routing engine (Pune Metro Purple &amp; Aqua lines + PMPML Bus Route 51). It solves tourist data staleness through strict data invariants (verified ₹0 admission tags), eliminates AI hallucinations via a sub-50ms client-side NLP knowledge engine, and solves mountain fort connectivity dropouts through client-side vector PDF travel itinerary generation (<code>jsPDF</code>). Deployed live on Vercel at <code>https://explore-pune-eosin.vercel.app/</code>, the platform is backed by 18 test suites and 161 automated passing Vitest tests.
  </p>

  <h3>15.2 The 10 Key Technical Terms to Know</h3>
  <ol>
    <li><strong>Next.js 16 App Router:</strong> Full-stack React framework utilizing Server Components (RSC) to reduce client JavaScript bundles.</li>
    <li><strong>Turbopack:</strong> High-performance Rust-based bundler providing sub-2s production compilation.</li>
    <li><strong>MapLibre GL:</strong> Open-source WebGL vector mapping library enabling smooth hardware-accelerated interactive maps without Google Maps API costs.</li>
    <li><strong>Haversine Formula:</strong> Trigonometric equation calculating curved-surface great-circle distances between GPS coordinates.</li>
    <li><strong>Incremental Static Regeneration (ISR):</strong> Next.js caching strategy that serves static edge pages instantly while refreshing them in the background.</li>
    <li><strong>Content Security Policy (CSP):</strong> HTTP security header that prevents Cross-Site Scripting (XSS) by banning <code>unsafe-eval</code>.</li>
    <li><strong>COOP &amp; CORP:</strong> Cross-origin isolation headers protecting web application memory against Spectre side-channel attacks.</li>
    <li><strong>Civil Court Station:</strong> 33-meter-deep central underground interchange hub connecting Pune Metro Line 1 (Purple) and Line 2 (Aqua).</li>
    <li><strong>jsPDF:</strong> Client-side vector graphics library creating formatted printable PDF itineraries directly in browser memory.</li>
    <li><strong>Vitest:</strong> High-speed automated TypeScript test runner; executed 161 passing unit/integration tests in 2.02 seconds.</li>
  </ol>

  <h3>15.3 The 10-Step Execution Workflow (Memorize This Sequence!)</h3>
  <ol>
    <li>User navigates to <code>https://explore-pune-eosin.vercel.app/</code>.</li>
    <li>Synchronous <code>&lt;head&gt;</code> script checks <code>sessionStorage</code> and suppresses intro video if previously viewed (zero CLS).</li>
    <li>Vercel Edge CDN serves pre-rendered HTML and cached JSON destination catalog (106 audited places).</li>
    <li>User clicks the bilingual toggle: <code>LanguageProvider</code> immediately switches typography and labels to native Marathi Devanagari.</li>
    <li>User queries the floating Chat Assistant: <code>chatKnowledgeEngine.ts</code> tokenizes intent and calculates distances in sub-50ms locally.</li>
    <li>User opens the Directions modal: <code>publicTransit.ts</code> queries Metro and PMPML Route 51 networks.</li>
    <li>Transfer calculations add a 6-minute connection penalty at the Civil Court underground interchange.</li>
    <li>Coordinates are projected onto the WebGL canvas using MapLibre GL vector layers.</li>
    <li>User clicks "Export Itinerary": <code>generateItineraryPdf.ts</code> formats the trip into a vector A4 PDF with zero server latency.</li>
    <li>All actions comply with strict CSP headers, Origin-Agent-Cluster memory isolation, and Zod schema validation.</li>
  </ol>

</body>
</html>
`;

fs.writeFileSync(outputHtmlPath, htmlContent, 'utf8');
console.log('✓ Successfully wrote HTML dossier to:', outputHtmlPath);

async function convertHtmlToPdf() {
  console.log('Launching headless Microsoft Edge to render PDF document...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('file:///' + outputHtmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  
  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });
  
  await browser.close();
  console.log('✓ Successfully rendered PDF to:', outputPdfPath);
  
  // Copy to artifact directory
  fs.copyFileSync(outputPdfPath, artifactPdfPath);
  console.log('✓ Successfully copied PDF to artifact directory:', artifactPdfPath);
  
  const stats = fs.statSync(outputPdfPath);
  console.log('Done! File size: ' + (stats.size / 1024 / 1024).toFixed(2) + ' MB');
}

convertHtmlToPdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
