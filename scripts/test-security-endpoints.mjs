async function test() {
  const base = 'http://localhost:3000';
  console.log('Testing security endpoints against dev server...');

  // 1. Health check & security headers
  try {
    const res = await fetch(`${base}/api/v1/health`);
    console.log('\n[API Health Check]');
    console.log('Status:', res.status);
    console.log('X-Content-Type-Options:', res.headers.get('x-content-type-options'));
    console.log('X-Frame-Options:', res.headers.get('x-frame-options'));
    console.log('Referrer-Policy:', res.headers.get('referrer-policy'));
    console.log('X-Powered-By:', res.headers.get('x-powered-by') || '(none - safely removed)');
  } catch (err) {
    console.error('Health test error:', err.message);
  }

  // 2. Probing blocked paths
  const blockedPaths = ['/.env', '/.env.local', '/.git/config', '/debug', '/admin-debug', '/database.sql', '/backup/dump.sql'];
  console.log('\n[Blocked Path Protection]');
  for (const p of blockedPaths) {
    try {
      const res = await fetch(`${base}${p}`);
      console.log(`${p} -> status: ${res.status} (${res.status === 404 || res.status === 403 ? 'PASS' : 'FAIL'})`);
    } catch (err) {
      console.log(`${p} -> error: ${err.message}`);
    }
  }

  // 3. API input validation test on /api/v1/transit/directions with invalid coordinates
  console.log('\n[API Input Validation]');
  try {
    const res = await fetch(`${base}/api/v1/transit/directions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originLat: 'INVALID_STRING', originLng: 73.85 }),
    });
    console.log('/api/v1/transit/directions malformed input -> status:', res.status, `(${res.status === 400 ? 'PASS' : 'FAIL'})`);
  } catch (err) {
    console.log('Validation test error:', err.message);
  }

  // 4. API input validation test on /api/v1/places/photos with path traversal attempt
  console.log('\n[Path Traversal Defense]');
  try {
    const res = await fetch(`${base}/api/v1/places/photos?slug=../../package&limit=5`);
    console.log('/api/v1/places/photos path traversal probe -> status:', res.status);
    const json = await res.json();
    console.log('Response photos count:', json.photos?.length || 0, `(${res.status === 400 || (json.photos && json.photos.every(p => !p.url.includes('package'))) ? 'PASS' : 'FAIL'})`);
  } catch (err) {
    console.log('Traversal test error:', err.message);
  }
}

test().catch(console.error);
