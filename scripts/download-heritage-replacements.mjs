import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/places');

const items = [
  {
    slug: 'ohel-david-synagogue',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ohel_David_Synagogue_Pune.jpg/960px-Ohel_David_Synagogue_Pune.jpg',
  },
  {
    slug: 'st-marys-church',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/St._Mary%27s_Church_002.JPG/960px-St._Mary%27s_Church_002.JPG',
  },
  {
    slug: 'darshan-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg/960px-Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg', // fallback or specific
  }
];

async function download() {
  for (const item of items) {
    const dest = path.join(outDir, `${item.slug}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`Already exists: ${item.slug}.jpg`);
      continue;
    }
    console.log(`Downloading ${item.slug} from ${item.url}...`);
    try {
      const res = await fetch(item.url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (info@explorepune.org)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`✓ Saved ${item.slug}.jpg (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${item.slug}:`, e.message);
    }
  }
}

download();
