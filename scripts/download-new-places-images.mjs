import fs from 'fs';
import path from 'path';

const NEW_PLACES = [
  // FORTS
  {
    slug: 'tikona-fort',
    name: 'Tikona Fort',
    wikiPage: 'Tikona',
    fallbackQuery: 'Tikona fort Pune Pawna',
    filename: 'tikona-fort.jpg'
  },
  {
    slug: 'visapur-fort',
    name: 'Visapur Fort',
    wikiPage: 'Visapur_Fort',
    fallbackQuery: 'Visapur Fort waterfall stairs Pune',
    filename: 'visapur-fort.jpg'
  },
  {
    slug: 'purandar-fort',
    name: 'Purandar Fort',
    wikiPage: 'Purandar_fort',
    fallbackQuery: 'Purandar fort Pune Saswad',
    filename: 'purandar-fort.jpg'
  },
  {
    slug: 'rajmachi-fort',
    name: 'Rajmachi Fort',
    wikiPage: 'Rajmachi',
    fallbackQuery: 'Rajmachi fort Shrivardhan Sahyadri',
    filename: 'rajmachi-fort.jpg'
  },
  {
    slug: 'korigad-fort',
    name: 'Korigad Fort',
    wikiPage: 'Korigad',
    fallbackQuery: 'Korigad fort Lonavala Pune',
    filename: 'korigad-fort.jpg'
  },
  {
    slug: 'rohida-fort',
    name: 'Rohida Fort (Vichitragad)',
    wikiPage: 'Rohida_fort',
    fallbackQuery: 'Rohida fort Bhor Pune',
    filename: 'rohida-fort.jpg'
  },

  // HERITAGE
  {
    slug: 'shinde-chhatri',
    name: 'Shinde Chhatri',
    wikiPage: 'Shinde_Chhatri',
    fallbackQuery: 'Shinde Chhatri Pune Wanowrie',
    filename: 'shinde-chhatri.jpg'
  },
  {
    slug: 'fergusson-college-heritage',
    name: 'Fergusson College Heritage Building',
    wikiPage: 'Fergusson_College',
    fallbackQuery: 'Fergusson College Pune main building',
    filename: 'fergusson-college-heritage.jpg'
  },
  {
    slug: 'pune-university-heritage-building',
    name: 'Savitribai Phule Pune University Main Building',
    wikiPage: 'Savitribai_Phule_Pune_University',
    fallbackQuery: 'Pune University main building tower',
    filename: 'pune-university-heritage-building.jpg'
  },
  {
    slug: 'bund-garden',
    name: 'Bund Garden & Fitzgerald Bridge',
    wikiPage: 'Bund_Garden,_Pune',
    fallbackQuery: 'Bund Garden Pune river',
    filename: 'bund-garden.jpg'
  },
  {
    slug: 'osho-teerth-park',
    name: 'Osho Teerth Park & Ashram',
    wikiPage: 'Osho_International_Meditation_Resort',
    fallbackQuery: 'Osho Teerth Park Koregaon Park Pune',
    filename: 'osho-teerth-park.jpg'
  },

  // TEMPLES
  {
    slug: 'alandi-dnyaneshwar-mandir',
    name: 'Alandi Sant Dnyaneshwar Samadhi Mandir',
    wikiPage: 'Alandi',
    fallbackQuery: 'Alandi temple Pune Indrayani',
    filename: 'alandi-dnyaneshwar-mandir.jpg'
  },
  {
    slug: 'dehu-tukaram-mandir',
    name: 'Dehu Sant Tukaram Maharaj Gatha Mandir',
    wikiPage: 'Dehu',
    fallbackQuery: 'Dehu Gatha Mandir Pune',
    filename: 'dehu-tukaram-mandir.jpg'
  },
  {
    slug: 'jejuri-khandoba-temple',
    name: 'Khandoba Temple Jejuri',
    wikiPage: 'Khandoba_temple,_Jejuri',
    fallbackQuery: 'Jejuri temple Khandoba Pune bhandara',
    filename: 'jejuri-khandoba-temple.jpg'
  },
  {
    slug: 'morgaon-mayureshwar-ganpati',
    name: 'Mayureshwar Ganpati Mandir Morgaon',
    wikiPage: 'Mayureshwar_Temple,_Morgaon',
    fallbackQuery: 'Mayureshwar temple Morgaon Ashtavinayak',
    filename: 'morgaon-mayureshwar-ganpati.jpg'
  },
  {
    slug: 'ranjangaon-mahaganpati',
    name: 'Mahaganpati Mandir Ranjangaon',
    wikiPage: 'Ranjangaon_Ganpati',
    fallbackQuery: 'Ranjangaon Mahaganpati temple Pune',
    filename: 'ranjangaon-mahaganpati.jpg'
  },
  {
    slug: 'theur-chintamani-ganpati',
    name: 'Chintamani Ganpati Mandir Theur',
    wikiPage: 'Chintamani_Temple,_Theur',
    fallbackQuery: 'Theur Chintamani Ganpati temple Pune',
    filename: 'theur-chintamani-ganpati.jpg'
  },
  {
    slug: 'iskcon-nvcc-kondhwa',
    name: 'ISKCON NVCC Pune',
    wikiPage: 'ISKCON_Temple,_Pune',
    fallbackQuery: 'ISKCON Temple Kondhwa Pune NVCC',
    filename: 'iskcon-nvcc-kondhwa.jpg'
  },
  {
    slug: 'bhimashankar-temple',
    name: 'Bhimashankar Jyotirlinga Temple',
    wikiPage: 'Bhimashankar_Temple',
    fallbackQuery: 'Bhimashankar temple Pune Jyotirlinga',
    filename: 'bhimashankar-temple.jpg'
  },

  // CAVES & ANCIENT
  {
    slug: 'karla-caves',
    name: 'Karla Caves',
    wikiPage: 'Karla_Caves',
    fallbackQuery: 'Karla Caves Chaitya hall Lonavala Pune',
    filename: 'karla-caves.jpg'
  },
  {
    slug: 'bhaja-caves',
    name: 'Bhaja Caves',
    wikiPage: 'Bhaja_Caves',
    fallbackQuery: 'Bhaja caves stupas Lonavala Pune',
    filename: 'bhaja-caves.jpg'
  },
  {
    slug: 'bedse-caves',
    name: 'Bedse Caves',
    wikiPage: 'Bedse_Caves',
    fallbackQuery: 'Bedse caves pillars Kamshet Pune',
    filename: 'bedse-caves.jpg'
  },

  // NATURE & WATER
  {
    slug: 'pawna-lake',
    name: 'Pawna Lake & Dam',
    wikiPage: 'Pawna_Lake',
    fallbackQuery: 'Pawna Lake camping Pune Kamshet',
    filename: 'pawna-lake.jpg'
  },
  {
    slug: 'tiger-point-lonavala',
    name: 'Tiger Point Lonavala',
    wikiPage: 'Tiger%27s_Leap',
    fallbackQuery: 'Tigers leap Lonavala cliff view',
    filename: 'tiger-point-lonavala.jpg'
  },
  {
    slug: 'bushi-dam',
    name: 'Bushi Dam Lonavala',
    wikiPage: 'Bushi_Dam',
    fallbackQuery: 'Bushi Dam steps water Lonavala',
    filename: 'bushi-dam.jpg'
  },
  {
    slug: 'tamhini-ghat',
    name: 'Tamhini Ghat & Waterfalls',
    wikiPage: 'Tamhini_Ghat',
    fallbackQuery: 'Tamhini Ghat waterfall monsoon Pune',
    filename: 'tamhini-ghat.jpg'
  },
  {
    slug: 'taljai-hills',
    name: 'Taljai Hills',
    wikiPage: 'Taljai_Hills',
    fallbackQuery: 'Taljai Tekdi Pune park birds',
    filename: 'taljai-hills.jpg'
  },
  {
    slug: 'arai-tekdi',
    name: 'ARAI Hill (Vetal Hill Ridge)',
    wikiPage: 'Vetal_Hill',
    fallbackQuery: 'ARAI Tekdi Kothrud Pune hill view',
    filename: 'arai-tekdi.jpg'
  },
  {
    slug: 'lavasa-lakeside',
    name: 'Lavasa Lakeside Promenade',
    wikiPage: 'Lavasa',
    fallbackQuery: 'Lavasa city lake promenade Pune',
    filename: 'lavasa-lakeside.jpg'
  },

  // PARKS & SCIENCE
  {
    slug: 'iucaa-science-park',
    name: 'IUCAA Science Park & Campus',
    wikiPage: 'Inter-University_Centre_for_Astronomy_and_Astrophysics',
    fallbackQuery: 'IUCAA Pune building statue Charles Correa',
    filename: 'iucaa-science-park.jpg'
  },
  {
    slug: 'gram-sanskruti-udyan',
    name: 'Gram Sanskruti Udyan (Village Culture Park)',
    wikiPage: 'Gram_Sanskruti_Udyan',
    fallbackQuery: 'Gram Sanskruti Udyan Pashan Pune statues',
    filename: 'gram-sanskruti-udyan.jpg'
  }
];

const TARGET_DIR = path.resolve('public/images/places');

async function getWikiImage(pageTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${encodeURIComponent(pageTitle)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (tourism@explorepune.org)' } });
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
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (tourism@explorepune.org)' } });
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
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneBot/1.0 (tourism@explorepune.org)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log(`Starting download for ${NEW_PLACES.length} new authentic places...`);
  const results = [];

  for (const item of NEW_PLACES) {
    const dest = path.join(TARGET_DIR, item.filename);
    console.log(`\nProcessing [${item.slug}] ${item.name}...`);
    let imgUrl = null;

    if (item.wikiPage) {
      imgUrl = await getWikiImage(item.wikiPage);
      if (imgUrl) console.log(`  Found via Wikipedia page: ${imgUrl}`);
    }

    if (!imgUrl && item.fallbackQuery) {
      imgUrl = await searchCommons(item.fallbackQuery);
      if (imgUrl) console.log(`  Found via Commons search: ${imgUrl}`);
    }

    if (!imgUrl) {
      console.error(`  ❌ FAILED to find image for ${item.name}`);
      results.push({ slug: item.slug, status: 'missing' });
      continue;
    }

    try {
      await downloadFile(imgUrl, dest);
      const stats = fs.statSync(dest);
      console.log(`  ✓ Saved ${item.filename} (${Math.round(stats.size / 1024)} KB)`);
      results.push({ slug: item.slug, status: 'ok', size: stats.size, url: imgUrl });
    } catch (err) {
      console.error(`  ❌ Error downloading: ${err.message}`);
      results.push({ slug: item.slug, status: 'error', error: err.message });
    }
  }

  console.log('\n--- DOWNLOAD SUMMARY ---');
  const okCount = results.filter(r => r.status === 'ok').length;
  console.log(`Total: ${NEW_PLACES.length}, Succeeded: ${okCount}, Failed: ${NEW_PLACES.length - okCount}`);
}

run().catch(console.error);
