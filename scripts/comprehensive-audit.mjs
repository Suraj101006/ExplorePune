import { readFileSync, existsSync } from 'fs';

async function testHttpEndpoints() {
  const routes = [
    '/',
    '/about',
    '/account',
    '/admin',
    '/blogs',
    '/blogs/sinhagad-monsoon-trek-guide',
    '/blogs/heritage-walk-old-pune-peshwas',
    '/journey',
    '/login',
    '/milestones',
    '/places/shaniwar-wada',
    '/places/sinhagad-fort',
    '/planner',
    '/api/v1/health',
  ];

  console.log('--- Testing HTTP Routes on http://localhost:3000 ---');
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      const text = await res.text();
      console.log(`Route [${r}] => Status: ${res.status}, Length: ${text.length}`);
      if (res.status >= 400) {
        console.error(`ERROR: Route ${r} returned status ${res.status}`);
      }
    } catch (err) {
      console.error(`ERROR connecting to ${r}:`, err.message);
    }
  }
}

async function testApiEndpoints() {
  console.log('\n--- Testing API Endpoints ---');

  // 1. Health
  try {
    const res = await fetch('http://localhost:3000/api/v1/health');
    const json = await res.json();
    console.log('Health API:', json);
  } catch (err) {
    console.error('Health API error:', err.message);
  }

  // 2. Chat API
  try {
    const res = await fetch('http://localhost:3000/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How to reach Shaniwar Wada by metro?', lang: 'en' }),
    });
    const json = await res.json();
    console.log('Chat API status:', res.status, 'Has reply:', !!json.reply, 'Places:', json.places?.length);
  } catch (err) {
    console.error('Chat API error:', err.message);
  }

  // 3. Planner Generate API
  try {
    const res = await fetch('http://localhost:3000/api/v1/itineraries/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        availableMinutes: 180,
        mode: 'public_transit',
        budgetPerPerson: 500,
        start: { lat: 18.5195, lng: 73.8553 },
        startMinuteOfDay: 570,
        interests: ['heritage'],
      }),
    });
    const json = await res.json();
    console.log('Planner API status:', res.status, 'Plans count:', json.data?.plans?.length);
  } catch (err) {
    console.error('Planner API error:', err.message);
  }

  // 4. Feedback API
  try {
    const res = await fetch('http://localhost:3000/api/v1/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit Bot',
        type: 'experience',
        email: 'audit@example.com',
        rating: 5,
        message: 'Comprehensive health check validation.',
      }),
    });
    const json = await res.json();
    console.log('Feedback API status:', res.status, 'Response:', json);
  } catch (err) {
    console.error('Feedback API error:', err.message);
  }
}

async function run() {
  await testHttpEndpoints();
  await testApiEndpoints();
}

run();
