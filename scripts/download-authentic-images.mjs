import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/places');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Exact Wikimedia direct thumbnail URLs for actual Pune places
const sources = [
  {
    slug: 'shaniwar-wada',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada_illuminated.jpg/960px-Front_view_of_Shaniwar_Wada_illuminated.jpg',
  },
  {
    slug: 'sinhagad-fort',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sinhagad.jpg/960px-Sinhagad.jpg',
  },
  {
    slug: 'aga-khan-palace',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Pune_Palace.jpg/960px-Pune_Palace.jpg',
  },
  {
    slug: 'shreemant-dagdusheth-halwai-ganpati',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Dagdusheth_Ganpati_Temple_Decorated_during_Ganesh_Chaturti_September_2012_%281%29.JPG/960px-Dagdusheth_Ganpati_Temple_Decorated_during_Ganesh_Chaturti_September_2012_%281%29.JPG',
  },
  {
    slug: 'lal-mahal',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lal_Mahal%2C_Pune.jpg/960px-Lal_Mahal%2C_Pune.jpg',
  },
  {
    slug: 'parvati-hill',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Parvati.JPG/960px-Parvati.JPG',
  },
  {
    slug: 'sarasbaug',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Saras_Bagh%2CPune%2CIndia.JPG/960px-Saras_Bagh%2CPune%2CIndia.JPG',
  },
  {
    slug: 'raja-dinkar-kelkar-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg/960px-Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg',
  },
  {
    slug: 'okayama-friendship-garden',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pu_La_Deshpande_garden_5.JPG/960px-Pu_La_Deshpande_garden_5.JPG',
  },
  {
    slug: 'chaturshringi-temple',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Chaturshringi-TempleGates.jpg/960px-Chaturshringi-TempleGates.jpg',
  },
  {
    slug: 'khadakwasla-dam',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Khadakwasla_Dam_image.JPG/960px-Khadakwasla_Dam_image.JPG',
  },
  {
    slug: 'vetal-tekdi',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Vetal_tekdi.jpg/960px-Vetal_tekdi.jpg',
  },
  {
    slug: 'vishrambaug-wada',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vishram_Baug_Wada.jpg/960px-Vishram_Baug_Wada.jpg',
  },
  {
    slug: 'rajiv-gandhi-zoological-park',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Rajiv_Gandhi_zoo_entrance.png/960px-Rajiv_Gandhi_zoo_entrance.png',
  },
  {
    slug: 'national-war-memorial',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/National_War_Memorial%2C_Pune.JPG/960px-National_War_Memorial%2C_Pune.JPG',
  },
  {
    slug: 'kasba-ganpati',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/KasbaganpatiMandir.JPG/960px-KasbaganpatiMandir.JPG',
  },
  {
    slug: 'pashan-lake',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pashan_Lake.jpg/960px-Pashan_Lake.jpg',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function download(item) {
  const dest = path.join(outDir, `${item.slug}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`Already exists: ${item.slug}`);
    return true;
  }
  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://en.wikipedia.org/',
      },
    });
    if (!res.ok) {
      console.error(`Failed ${item.slug}: HTTP ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Saved: ${item.slug} (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`Error ${item.slug}:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`Starting authentic image downloads to ${outDir}...`);
  for (const item of sources) {
    await download(item);
    await sleep(800);
  }
  console.log('Done!');
}

main();
