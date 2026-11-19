import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const INDEXNOW_KEY = '404a71b2d7fc4f2b9b7342813589b21e';
const HOST = 'explorepune-guide.vercel.app';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const CORE_STATIC_ROUTES = [
  `https://${HOST}/`,
  `https://${HOST}/experience`,
  `https://${HOST}/destinations`,
  `https://${HOST}/destinations/forts`,
  `https://${HOST}/destinations/heritage`,
  `https://${HOST}/destinations/temples`,
  `https://${HOST}/destinations/museums`,
  `https://${HOST}/destinations/nature`,
  `https://${HOST}/destinations/parks`,
  `https://${HOST}/destinations/food`,
  `https://${HOST}/destinations/free`,
  `https://${HOST}/planner`,
  `https://${HOST}/help`,
  `https://${HOST}/help/website-guide`,
  `https://${HOST}/play-metro-transit.html`,
  `https://${HOST}/community`,
  `https://${HOST}/blogs`,
  `https://${HOST}/about`,
  `https://${HOST}/data`,
  `https://${HOST}/milestones`,
  `https://${HOST}/privacy`,
  `https://${HOST}/cookies`,
  `https://${HOST}/terms`,
];

async function main() {
  console.log('🚀 Compiling complete Explore Pune URL list for IndexNow submission...');
  const urlSet = new Set(CORE_STATIC_ROUTES);

  const placesFilePath = path.join(rootDir, 'data', 'pune_places_106.json');
  if (fs.existsSync(placesFilePath)) {
    const placesData = JSON.parse(fs.readFileSync(placesFilePath, 'utf8'));
    for (const p of placesData) {
      const slug = p.slug || p.id;
      if (slug) {
        urlSet.add(`https://${HOST}/places/${encodeURIComponent(slug)}`);
      }
    }
  }

  const urlList = Array.from(urlSet);
  console.log(`📋 Total URLs queued for instant crawl indexing: ${urlList.length}`);
  console.log(`   - Core static & discovery routes: ${CORE_STATIC_ROUTES.length}`);
  console.log(`   - Verified destination routes: ${urlList.length - CORE_STATIC_ROUTES.length}`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const endpoints = [
    { name: 'IndexNow (Universal)', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow', url: 'https://www.bing.com/indexnow' },
  ];

  for (const ep of endpoints) {
    try {
      console.log(`📡 Pinging ${ep.name} (${ep.url})...`);
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      console.log(`   Response: HTTP ${res.status} ${res.statusText}`);
      if (res.status === 200 || res.status === 202) {
        console.log(`   ✅ Success! Search engine accepted all ${urlList.length} URLs for immediate crawl.`);
      } else {
        const text = await res.text();
        console.log(`   ⚠️ Engine response body: ${text || '(empty)'}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to submit to ${ep.name}:`, err.message);
    }
  }

  console.log('🏁 IndexNow submission job completed.');
}

main().catch((err) => {
  console.error('Fatal error during indexing submission:', err);
  process.exit(1);
});
