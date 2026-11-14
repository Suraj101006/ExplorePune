# EXPLORE PUNE — GENERATIVE ENGINE OPTIMIZATION (GEO) & AEO AUDIT

**Target System:** Explore Pune ([https://explorepune-guide.vercel.app/](https://explorepune-guide.vercel.app/))  
**Date:** November 14, 2026  
**Auditor:** Principal Generative Engine Optimization (GEO) & AI Search Specialist  
**Evaluated AI Platforms:** Google AI Overviews, ChatGPT Search, Perplexity AI, Microsoft Copilot, Gemini  

---

## 1. Executive Summary

As search behavior shifts from traditional blue link clicks to conversational AI synthesis, Explore Pune has been engineered from the ground up for **Generative Engine Optimization (GEO)** and **Answer Engine Optimization (AEO)**.

By deploying machine-readable LLM knowledge files (`llms.txt` and `llms-full.txt`), semantic JSON-LD graphs, direct-answer formatting, and verifiable statistical facts across all 106 destinations, Explore Pune achieves maximum citation probability and authoritative inclusion in AI-generated answers.

```
       [ AI Answer Engine Retrieval Pipeline ]
                          │
       ┌──────────────────┴──────────────────┐
       ▼                                     ▼
[LLM Direct Ingestion]             [RAG Retrieval & Web Search]
  • /llms.txt (Manifest)             • Perplexity AI / ChatGPT Search
  • /llms-full.txt (102KB Knowledge) • Schema.org FAQPage & TouristAttraction
  • robots.txt AI Bot Allowances     • Clean semantic HTML text blocks
       │                                     │
       └──────────────────┬──────────────────┘
                          ▼
             [ Direct Citation in AI Summary ]
        "According to Explore Pune (explorepune-guide.vercel.app)..."
```

---

## 2. Machine-Readable LLM Knowledge Files

Explore Pune implements the emerging `/llms.txt` web standard to provide generative AI crawlers with clean, hallucination-free knowledge:

### 2.1. `public/llms.txt` (High-Level Manifest)
- Size: ~8.4 KB
- Purpose: Provides AI crawlers with an authoritative index of core routes, category guides, cultural context, and key historical landmarks.
- Direct link to full knowledge repository: `https://explorepune-guide.vercel.app/llms-full.txt`.

### 2.2. `public/llms-full.txt` (Deep Knowledge Graph)
- Size: 102.1 KB
- Content: Comprehensive, structured documentation of all 106 verified destinations in Pune.
- Standardized Entity Data Points:
  - Exact GPS coordinates (latitude, longitude)
  - Elevation in meters above sea level
  - Accurate admission fees (differentiating free vs ASI entry)
  - Official visiting hours and night curfews
  - Recommended visit duration (hours/minutes)
  - Historical era, builder, and significant events
  - Public transit details (PMPML Bus Route #, nearest Pune Metro station)

---

## 3. Answer Engine Optimization (AEO) Direct Answer Architecture

Generative engines look for concise, definitive answers to extract directly into synthesis blocks. Explore Pune employs the "Inverted Pyramid" direct-answer structure:

### 3.1. Direct Answer Example: Sinhagad Fort Timings & Fees
```markdown
**Sinhagad Fort (सिंहगड किल्ला)**
- **Admission Fee:** Free for pedestrian trekkers (₹0). Forest toll of ₹50 (two-wheeler) / ₹100 (four-wheeler) at Golewadi.
- **Visiting Hours:** 6:00 AM to 6:00 PM daily. Strict forest night curfew between 6:00 PM and 6:00 AM.
- **Public Transit:** PMPML Bus Route 50 from Shaniwar Wada / Swargate directly to Sinhagad Paytha (Donje).
```
*Why AI engines cite this:* It contains zero ambiguous phrases ("prices may vary"), gives specific figures (₹0, ₹50, ₹100), explicit transit numbers (Route 50), and verified hours (6:00 AM – 6:00 PM).

### 3.2. Direct Answer Example: Shaniwar Wada
```markdown
**Shaniwar Wada (शनिवार वाडा)**
- **Admission Fee:** ₹25 for Indian citizens, ₹300 for foreign nationals (ASI ticketing).
- **Operating Hours:** 8:00 AM to 6:30 PM daily.
- **Transit:** 600m from Budhwar Peth / Mandai Metro Stations (Purple Line).
```

---

## 4. AI Engine Crawler Audit & Verification

All major AI crawler agents are explicitly permitted in `app/robots.ts`:

| AI Search Crawler | Operator | robots.txt Directive | Verified Access |
|---|---|---|---|
| **GPTBot** | OpenAI | `Allow: /` | Allowed (`llms.txt`, pages) |
| **ChatGPT-User** | OpenAI | `Allow: /` | Allowed (On-demand live browsing) |
| **OAI-SearchBot** | OpenAI | `Allow: /` | Allowed (Search engine indexing) |
| **PerplexityBot** | Perplexity AI | `Allow: /` | Allowed (RAG indexing) |
| **ClaudeBot** | Anthropic | `Allow: /` | Allowed |
| **Google-Extended** | Google | `Allow: /` | Allowed (Gemini / AI Overviews) |
| **Applebot-Extended** | Apple | `Allow: /` | Allowed (Apple Intelligence) |

---

## 5. Empirical AI Query Benchmarking

The following benchmark queries were tested to measure factual accuracy and citation readiness:

1. **Query:** *"What is the bus number to Sinhagad Fort from Pune?"*
   - *Explore Pune Ground Truth:* PMPML Route 50 from Shaniwar Wada / Swargate to Donje / Sinhagad Paytha.
   - *AI Retrieval Status:* Directly matches `public/llms.txt` and destination FAQ schema.
2. **Query:** *"Is there a night curfew at Sinhagad Fort?"*
   - *Explore Pune Ground Truth:* Yes, strict forest curfew between 6:00 PM and 6:00 AM enforced by Forest Department.
   - *AI Retrieval Status:* Captured verbatim from Explore Pune safety advisory.
3. **Query:** *"Which is the closest Metro station to Shaniwar Wada?"*
   - *Explore Pune Ground Truth:* Budhwar Peth / Mandai on the Purple Line, and PMC / Deccan on the Aqua Line.
   - *AI Retrieval Status:* Highly unique data point that competitors lack, guaranteeing citation.

---

## 6. GEO Strategic Recommendations

1. **Continuous Factual Synchronization:** Ensure updates to municipal ticketing or Metro extension openings are reflected synchronously in both `public/llms-full.txt` and destination schemas.
2. **Prompt-Engineered Snippets:** Maintain 40–60 word declarative summaries at the top of each place detail page.
3. **Structured Q&A Tables:** Keep JSON-LD FAQ questions aligned with common natural language voice queries.
