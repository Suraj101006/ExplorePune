import fs from 'fs';
import path from 'path';

const SEED_JOURNEYS_FILE = 'lib/journeyStorage.ts';
const content = fs.readFileSync(SEED_JOURNEYS_FILE, 'utf8');
const imgUrls = [...content.matchAll(/image_url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log('Journey places image URLs count:', imgUrls.length);
const missing = [];
for (const u of imgUrls) {
  if (u.startsWith('/')) {
    const filePath = path.join('public', u.slice(1));
    if (!fs.existsSync(filePath)) {
      missing.push({ url: u, path: filePath });
    }
  }
}

console.log('Missing journey images:', missing);
