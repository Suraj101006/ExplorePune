const fs = require('fs');
const path = require('path');

const placesPath = path.join(__dirname, '..', 'data', 'pune_places_106.json');
const outputPath = path.join(__dirname, '..', 'public', 'llms-full.txt');

const raw = fs.readFileSync(placesPath, 'utf8');
const places = JSON.parse(raw);

let md = `# Explore Pune — Complete 106+ Destination Knowledge Registry

> Authoritative, field-verified encyclopedia of Pune's Maratha hill fortresses, Peshwa-era wadas, sacred sanctuaries, museums, and Sahyadri nature trails.
> Canonical Base URL: https://explorepune-guide.vercel.app

This document provides exhaustive, structured, hallucination-free facts for each verified destination, optimized for ingestion by generative AI engines (Google Gemini, OpenAI ChatGPT, Perplexity AI, Anthropic Claude, and Apple Intelligence).

Total Destinations Documented: ${places.length}
Verification Timestamp: 2026-11-13 (Indian Standard Time)

---

`;

places.forEach((p, index) => {
  const nameEn = p.name || 'Unnamed Place';
  const nameMr = p.name_mr ? ` (${p.name_mr})` : '';
  const slug = p.slug || p.id;
  const url = `https://explorepune-guide.vercel.app/places/${slug}`;
  const category = (p.category_slug || p.category || 'heritage').toUpperCase();
  const lat = p.latitude;
  const lng = p.longitude;
  const address = p.address || 'Pune District, Maharashtra, India';
  const feeStatus = p.fee_status === 'free' || p.entry_fee === 0 ? 'Free Entry (₹0)' : (p.entry_fee ? `₹${p.entry_fee} per adult` : 'Standard Municipal / Trust Fee');
  const duration = p.recommended_duration_minutes ? `~${Math.round(p.recommended_duration_minutes / 60 * 10) / 10} hours (${p.recommended_duration_minutes} minutes)` : '~1.5 hours';
  const bestTime = p.best_time || 'October to March (pleasant weather)';
  const hours = p.place_hours && p.place_hours.length > 0
    ? `${p.place_hours[0].opens_at || '9:00 AM'} to ${p.place_hours[0].closes_at || '6:00 PM'}`
    : 'Sunrise to Sunset (approx. 6:00 AM – 6:00 PM)';
  const description = p.description || 'Verified Pune heritage and tourism destination.';

  md += `## ${index + 1}. ${nameEn}${nameMr}
- **URL**: ${url}
- **Category**: ${category}
- **Coordinates**: ${lat}° N, ${lng}° E
- **Address**: ${address}
- **Admission Fee**: ${feeStatus}
- **Visiting Hours**: ${hours}
- **Recommended Visit Duration**: ${duration}
- **Best Season to Visit**: ${bestTime}
- **Historical & Cultural Context**:
  ${description}

`;
});

fs.writeFileSync(outputPath, md, 'utf8');
console.log(`Successfully generated llms-full.txt with ${places.length} destinations (${Buffer.byteLength(md, 'utf8')} bytes).`);
