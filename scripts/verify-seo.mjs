// Verification script for SEO metadata, canonicals, robots, and JSON-LD
async function verifyEndpoint(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`\n=== Testing: ${url} (Status: ${res.status}) ===`);

    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'NONE'}`);

    const canonicalMatch = text.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"[^>]*>/i) ||
                           text.match(/<link[^>]+href="([^"]+)"[^>]*rel="canonical"[^>]*>/i);
    console.log(`Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NONE'}`);

    const robotsMatch = text.match(/<meta[^>]+name="robots"[^>]*content="([^"]+)"[^>]*>/i);
    console.log(`Robots Meta: ${robotsMatch ? robotsMatch[1] : 'default'}`);

    const jsonLdMatches = [...text.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    console.log(`JSON-LD Structured Data: ${jsonLdMatches.length} blocks found`);
    jsonLdMatches.forEach((m, idx) => {
      try {
        const parsed = JSON.parse(m[1]);
        console.log(`  [Block ${idx + 1}] Type: ${parsed['@type']}, Name: ${parsed.name || parsed.headline || 'N/A'}`);
      } catch {
        console.log(`  [Block ${idx + 1}] Invalid JSON`);
      }
    });
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
  }
}

async function run() {
  await verifyEndpoint('http://localhost:3000/');
  await verifyEndpoint('http://localhost:3000/places/sinhagad-fort');
  await verifyEndpoint('http://localhost:3000/journey');
  await verifyEndpoint('http://localhost:3000/planner');
  await verifyEndpoint('http://localhost:3000/community');
  await verifyEndpoint('http://localhost:3000/about');
  await verifyEndpoint('http://localhost:3000/data');
}

run();
