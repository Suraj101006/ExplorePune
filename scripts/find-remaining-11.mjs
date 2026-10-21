import fs from 'fs';
import path from 'path';

const REMAINING = [
  {
    slug: 'purandar-fort',
    name: 'Purandar Fort',
    queries: ['Purandar_Fort', 'Purandar Fort', 'Purandar fort Pune'],
    filename: 'purandar-fort.jpg'
  },
  {
    slug: 'fergusson-college-heritage',
    name: 'Fergusson College',
    queries: ['Fergusson_College,_Pune', 'Fergusson College Pune', 'Fergusson College'],
    filename: 'fergusson-college-heritage.jpg'
  },
  {
    slug: 'bund-garden',
    name: 'Bund Garden',
    queries: ['Bund Garden Pune', 'Fitzgerald Bridge Pune', 'Bund Garden'],
    filename: 'bund-garden.jpg'
  },
  {
    slug: 'osho-teerth-park',
    name: 'Osho Teerth Park',
    queries: ['Osho Pune', 'Koregaon Park Pune garden', 'Osho International Meditation Resort'],
    filename: 'osho-teerth-park.jpg'
  },
  {
    slug: 'jejuri-khandoba-temple',
    name: 'Jejuri Khandoba',
    queries: ['Jejuri', 'Khandoba temple Jejuri', 'Jejuri temple Pune'],
    filename: 'jejuri-khandoba-temple.jpg'
  },
  {
    slug: 'morgaon-mayureshwar-ganpati',
    name: 'Morgaon Mayureshwar',
    queries: ['Morgaon Ganesha temple', 'Morgaon', 'Mayureshwar Temple, Morgaon', 'Mayureshwar temple'],
    filename: 'morgaon-mayureshwar-ganpati.jpg'
  },
  {
    slug: 'pawna-lake',
    name: 'Pawna Lake / Pavana Dam',
    queries: ['Pavana Dam', 'Pawna Dam', 'Pawna Lake', 'Pawana Dam Pune'],
    filename: 'pawna-lake.jpg'
  },
  {
    slug: 'tiger-point-lonavala',
    name: 'Tiger Point Lonavala',
    queries: ['Tiger\'s Leap', 'Tigers point Lonavala', 'Lonavala cliff', 'Lions point Lonavala'],
    filename: 'tiger-point-lonavala.jpg'
  },
  {
    slug: 'bushi-dam',
    name: 'Bhushi Dam',
    queries: ['Bhushi Dam', 'Bhushi Dam Lonavala', 'Bushi Dam'],
    filename: 'bushi-dam.jpg'
  },
  {
    slug: 'tamhini-ghat',
    name: 'Tamhini Ghat',
    queries: ['Tamhini Ghat', 'Tamhini waterfalls', 'Tamhini'],
    filename: 'tamhini-ghat.jpg'
  },
  {
    slug: 'gram-sanskruti-udyan',
    name: 'Gram Sanskruti Udyan',
    queries: ['Pashan Pune garden', 'Gram Sanskruti Udyan', 'Someshwar Pashan Pune', 'Rural Maharashtra village statue park'],
    filename: 'gram-sanskruti-udyan.jpg'
  }
];

const TARGET_DIR = path.resolve('public/images/places');

async function checkWikiPage(pageTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${encodeURIComponent(pageTitle)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null;
    const page = pages[pageId];
    return page.thumbnail?.source || page.original?.source || null;
  } catch {
    return null;
  }
}

async function searchCommons(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const pid of Object.keys(pages)) {
      const p = pages[pid];
      const ii = p.imageinfo?.[0];
      const imgUrl = ii?.thumburl || ii?.url;
      if (imgUrl && !imgUrl.endsWith('.svg') && !imgUrl.endsWith('.tif')) {
        return imgUrl;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.in)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  for (const item of REMAINING) {
    console.log(`\nChecking [${item.slug}] ${item.name}...`);
    let found = null;
    for (const q of item.queries) {
      found = await checkWikiPage(q);
      if (found) {
        console.log(`  Found via wiki page "${q}": ${found}`);
        break;
      }
      found = await searchCommons(q);
      if (found) {
        console.log(`  Found via commons search "${q}": ${found}`);
        break;
      }
    }

    if (found) {
      const dest = path.join(TARGET_DIR, item.filename);
      await downloadFile(found, dest);
      const st = fs.statSync(dest);
      console.log(`  ✓ Successfully downloaded ${item.filename} (${Math.round(st.size / 1024)} KB)`);
    } else {
      console.log(`  ❌ Still not found: ${item.name}`);
    }
  }
}

run().catch(console.error);
