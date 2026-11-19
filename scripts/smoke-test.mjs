const routes = [
  '/',
  '/experience',
  '/destinations',
  '/destinations/forts',
  '/destinations/temples',
  '/places/shaniwar-wada',
  '/places/sinhagad-fort',
  '/places/tiger-point-lonavala',
  '/planner',
  '/journey',
  '/community',
  '/about',
  '/data',
  '/help',
  '/help/website-guide',
  '/api/v1/health',
  '/api/v1/places',
];

async function testRoutes() {
  console.log('Testing 17 key routes on http://localhost:3000:');
  let passCount = 0;
  for (const r of routes) {
    const start = Date.now();
    try {
      const res = await fetch('http://localhost:3000' + r);
      const ms = Date.now() - start;
      if (res.status === 200) {
        passCount++;
        console.log(`  ✓ [200 OK] ${r.padEnd(28)} (${ms}ms)`);
      } else {
        console.error(`  ✗ [${res.status}] ${r.padEnd(28)} (${ms}ms)`);
      }
    } catch (e) {
      console.error(`  ✗ [ERR] ${r.padEnd(28)}: ${e.message}`);
    }
  }

  // Also test /api/v1/directions POST
  try {
    const start = Date.now();
    const res = await fetch('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.3663,
        destLng: 73.7558,
        travelMode: 'driving',
      }),
    });
    const ms = Date.now() - start;
    if (res.status === 200) {
      passCount++;
      console.log(`  ✓ [200 OK] /api/v1/directions (POST)    (${ms}ms)`);
    } else {
      console.error(`  ✗ [${res.status}] /api/v1/directions (POST) (${ms}ms)`);
    }
  } catch (e) {
    console.error(`  ✗ [ERR] /api/v1/directions: ${e.message}`);
  }

  console.log(`\nResult: ${passCount} / 18 routes verified 200 OK.`);
}

testRoutes();
