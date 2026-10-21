import fs from 'fs';
import path from 'path';

async function downloadDirect() {
  const images = [
    {
      name: 'rajgad-fort.jpg',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Suvela_machi%2CRajgad_fort%2C_Maharashtra%2CIndia_July2015.jpg/1280px-Suvela_machi%2CRajgad_fort%2C_Maharashtra%2CIndia_July2015.jpg'
    },
    {
      name: 'shivneri-fort.jpg',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Shivneri_fort1.JPG/1280px-Shivneri_fort1.JPG'
    }
  ];

  for (const img of images) {
    const dest = path.resolve('public/images/places', img.name);
    console.log(`Downloading ${img.name}...`);
    const res = await fetch(img.url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact: info@explorepune.in)' } });
    if (!res.ok) {
      console.error(`Failed ${img.name}: HTTP ${res.status}`);
      continue;
    }
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    console.log(`✓ Saved ${img.name} (${(buf.byteLength / 1024).toFixed(1)} KB)`);
  }
}

downloadDirect();
