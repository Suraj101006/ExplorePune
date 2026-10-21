import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/images/places');

const ITEMS = [
  { slug: 'fergusson-college-heritage', filename: 'fergusson-college-heritage.jpg', query: 'Fergusson College' },
  { slug: 'bund-garden', filename: 'bund-garden.jpg', query: 'Bund Garden Pune' },
  { slug: 'osho-teerth-park', filename: 'osho-teerth-park.jpg', query: 'Osho Pune' },
  { slug: 'morgaon-mayureshwar-ganpati', filename: 'morgaon-mayureshwar-ganpati.jpg', query: 'Morgaon' },
  { slug: 'pawna-lake', filename: 'pawna-lake.jpg', query: 'Pavana' },
  { slug: 'tiger-point-lonavala', filename: 'tiger-point-lonavala.jpg', query: 'Lonavala' },
  { slug: 'tamhini-ghat', filename: 'tamhini-ghat.jpg', query: 'Tamhini' },
  { slug: 'gram-sanskruti-udyan', filename: 'gram-sanskruti-udyan.jpg', query: 'Pashan' }
];

async function searchCommonsImages(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' filetype:bitmap')}&srnamespace=6&srlimit=10&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
  if (!res.ok) return [];
  const data = await res.json();
  const search = data.query?.search || [];
  return search.map(s => s.title);
}

async function getImageUrl(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;
  const p = pages[Object.keys(pages)[0]];
  const ii = p.imageinfo?.[0];
  return ii?.thumburl || ii?.url || null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  for (const item of ITEMS) {
    console.log(`\nSearching Commons for "${item.query}"...`);
    const files = await searchCommonsImages(item.query);
    console.log(`  Found ${files.length} candidate files:`, files.slice(0, 3));
    let downloaded = false;
    for (const f of files) {
      if (f.endsWith('.svg') || f.endsWith('.tif') || f.endsWith('.pdf')) continue;
      const imgUrl = await getImageUrl(f);
      if (imgUrl) {
        console.log(`  Downloading from: ${f} -> ${imgUrl}`);
        const dest = path.join(TARGET_DIR, item.filename);
        try {
          await downloadFile(imgUrl, dest);
          const st = fs.statSync(dest);
          console.log(`  ✓ Saved ${item.filename} (${Math.round(st.size / 1024)} KB)`);
          downloaded = true;
          break;
        } catch (e) {
          console.log(`  Failed download: ${e.message}`);
        }
      }
    }
    if (!downloaded) {
      console.log(`  ❌ Could not download for ${item.slug}`);
    }
  }
}

run().catch(console.error);
