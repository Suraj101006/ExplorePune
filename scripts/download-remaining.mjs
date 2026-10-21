import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/places');

const remaining = [
  {
    slug: 'raja-dinkar-kelkar-museum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg/960px-Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg',
  },
  {
    slug: 'okayama-friendship-garden',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pu_La_Deshpande_garden_5.JPG/960px-Pu_La_Deshpande_garden_5.JPG',
  },
  {
    slug: 'khadakwasla-dam',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Khadakwasla_Dam_image.JPG/960px-Khadakwasla_Dam_image.JPG',
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
    slug: 'pashan-lake',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pashan_Lake.jpg/960px-Pashan_Lake.jpg',
  },
  {
    slug: 'pataleshwar-cave-temple',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pataleshwar_Cave_Temple%2C_Pune.jpg/960px-Pataleshwar_Cave_Temple%2C_Pune.jpg',
  },
  {
    slug: 'empress-botanical-garden',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Empress_Garden_Pune.jpg/960px-Empress_Garden_Pune.jpg',
  },
  {
    slug: 'baps-swaminarayan-mandir',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/BAPS_Shri_Swaminarayan_Mandir_Pune.jpg/960px-BAPS_Shri_Swaminarayan_Mandir_Pune.jpg',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadWithRetry(item, attempts = 3) {
  const dest = path.join(outDir, `${item.slug}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`Already have: ${item.slug}`);
    return true;
  }
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'ExplorePuneGuideBot/1.0 (https://explorepune.in; contact@explorepune.in) Mozilla/5.0 Chrome/124.0.0.0',
          'Accept': 'image/jpeg,image/png,image/*;q=0.8',
        },
      });
      if (res.status === 429) {
        console.log(`Rate limited on ${item.slug}, waiting 4s...`);
        await sleep(4000);
        continue;
      }
      if (!res.ok) {
        console.log(`HTTP ${res.status} on ${item.slug}`);
        return false;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`SUCCESS: ${item.slug} (${buf.length} bytes)`);
      return true;
    } catch (e) {
      console.error(`Error on ${item.slug}:`, e.message);
      await sleep(2000);
    }
  }
  return false;
}

async function main() {
  for (const item of remaining) {
    await downloadWithRetry(item);
    await sleep(2500);
  }
  console.log('All remaining downloads complete!');
}

main();
