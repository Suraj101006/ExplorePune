import fs from 'fs';
import path from 'path';

const LANDMARKS = [
  {
    slug: 'rajgad-fort',
    name: 'Rajgad Fort',
    wikiPage: 'Rajgad_Fort',
    fallbackQuery: 'Rajgad fort Pune',
    filename: 'rajgad-fort.jpg'
  },
  {
    slug: 'torna-fort',
    name: 'Torna Fort (Prachandagad)',
    wikiPage: 'Torna_Fort',
    fallbackQuery: 'Torna fort Pune',
    filename: 'torna-fort.jpg'
  },
  {
    slug: 'shivneri-fort',
    name: 'Shivneri Fort',
    wikiPage: 'Shivneri',
    fallbackQuery: 'Shivneri fort Pune',
    filename: 'shivneri-fort.jpg'
  },
  {
    slug: 'lohagad-fort',
    name: 'Lohagad Fort',
    wikiPage: 'Lohagad',
    fallbackQuery: 'Lohagad fort Pune',
    filename: 'lohagad-fort.jpg'
  },
  {
    slug: 'malhargad-fort',
    name: 'Malhargad Fort',
    wikiPage: 'Malhargad',
    fallbackQuery: 'Malhargad fort Saswad',
    filename: 'malhargad-fort.jpg'
  },
  {
    slug: 'kesari-wada',
    name: 'Kesari Wada (Tilak Smarak)',
    wikiPage: 'Kesari_(newspaper)',
    fallbackQuery: 'Kesari Wada Pune',
    filename: 'kesari-wada.jpg'
  },
  {
    slug: 'joshi-miniature-railway',
    name: 'Joshi\'s Museum of Miniature Railways',
    wikiPage: 'Joshi\'s_Museum_of_Miniature_Railways',
    fallbackQuery: 'Joshi museum miniature railways Pune',
    filename: 'joshi-miniature-railway.jpg'
  },
  {
    slug: 'mahatma-phule-museum',
    name: 'Mahatma Phule Museum',
    wikiPage: 'Mahatma_Phule_Museum',
    fallbackQuery: 'Mahatma Phule Museum Pune Ghole road',
    filename: 'mahatma-phule-museum.jpg'
  },
  {
    slug: 'sambhaji-park',
    name: 'Chhatrapati Sambhaji Garden',
    wikiPage: 'Chhatrapati_Sambhaji_Garden',
    fallbackQuery: 'Sambhaji park Pune JM road',
    filename: 'sambhaji-park.jpg'
  },
  {
    slug: 'mulshi-dam',
    name: 'Mulshi Dam & Lake',
    wikiPage: 'Mulshi_Dam',
    fallbackQuery: 'Mulshi Dam Pune',
    filename: 'mulshi-dam.jpg'
  },
  {
    slug: 'panshet-dam',
    name: 'Panshet Dam (Tanajisagar)',
    wikiPage: 'Panshet_Dam',
    fallbackQuery: 'Panshet Dam Pune',
    filename: 'panshet-dam.jpg'
  },
  {
    slug: 'tulshibaug-temple',
    name: 'Tulshibaug Ram Mandir',
    wikiPage: 'Tulshibagh',
    fallbackQuery: 'Tulshibaug Ram mandir Pune',
    filename: 'tulshibaug-temple.jpg'
  }
];

async function getWikiImage(pageTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${encodeURIComponent(pageTitle)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePune/1.0 (info@explorepune.in)' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    return page.thumbnail?.source || page.original?.source || null;
  } catch {
    return null;
  }
}

async function searchCommons(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePune/1.0 (info@explorepune.in)' } });
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
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePune/1.0 (info@explorepune.in)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buf));
}

async function main() {
  const destDir = path.resolve('public/images/places');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  for (const item of LANDMARKS) {
    const outPath = path.join(destDir, item.filename);
    console.log(`Processing [${item.slug}] ...`);

    let imgUrl = await getWikiImage(item.wikiPage);
    if (!imgUrl) {
      console.log(`  Wiki direct failed, searching Commons for "${item.fallbackQuery}"...`);
      imgUrl = await searchCommons(item.fallbackQuery);
    }

    if (imgUrl) {
      console.log(`  Found URL: ${imgUrl}`);
      try {
        await downloadFile(imgUrl, outPath);
        const stats = fs.statSync(outPath);
        console.log(`  ✓ Successfully downloaded: ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ✗ Download failed:`, err.message);
      }
    } else {
      console.log(`  ✗ No image found on Wikipedia/Commons for ${item.name}`);
    }
  }
}

main();
