import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/places');

const items = [
  { slug: 'pataleshwar-cave-temple', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Pataleshwar_Caves_-_Main_Temple_Entrance.jpg' },
  { slug: 'empress-botanical-garden', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Empress_GArden_%2867%29.JPG' },
  { slug: 'baps-swaminarayan-mandir', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/BAPS_Swaminarayan_Temple%2C_Pune.jpg' },
  { slug: 'tribal-museum', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Tribal_museum_%28Sadhu_waswani_path%29_%2843%29.JPG' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  for (const item of items) {
    const dest = path.join(outDir, `${item.slug}.jpg`);
    const res = await fetch(item.url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact@explorepune.in)' } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`Saved ${item.slug}: ${buf.length} bytes`);
    } else {
      console.log(`Failed ${item.slug}: HTTP ${res.status}`);
    }
    await sleep(1500);
  }
}

main();
