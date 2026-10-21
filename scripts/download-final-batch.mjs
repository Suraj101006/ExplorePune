import fs from 'fs';
import path from 'path';

async function downloadFinalImages() {
  const images = [
    {
      name: 'kesari-wada.jpg',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Kesari_Wada%2C_Pune.jpg/1280px-Kesari_Wada%2C_Pune.jpg'
    },
    {
      name: 'joshi-miniature-railway.jpg',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Lane_towards_Joshi%27s_Museum_of_Miniature_Railway.jpg/1280px-Lane_towards_Joshi%27s_Museum_of_Miniature_Railway.jpg'
    },
    {
      name: 'sambhaji-park.jpg',
      url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Sambhaji_Park.JPG'
    },
    {
      name: 'tulshibaug-temple.jpg',
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Tulshibaug_lane.JPG/1280px-Tulshibaug_lane.JPG'
    }
  ];

  for (const img of images) {
    const dest = path.resolve('public/images/places', img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      const res = await fetch(img.url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (info@explorepune.in)' } });
      if (!res.ok) {
        console.error(`Failed ${img.name}: HTTP ${res.status}`);
        continue;
      }
      const buf = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buf));
      console.log(`✓ Saved ${img.name} (${(buf.byteLength / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(e.message);
    }
  }
}

downloadFinalImages();
