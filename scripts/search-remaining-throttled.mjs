async function searchRemainingThrottled() {
  const queries = [
    'Kesari Wada',
    'Joshi Museum Miniature Railways',
    'Sambhaji park Pune',
    'Tulshibaug Pune'
  ];

  for (const q of queries) {
    await new Promise(r => setTimeout(r, 1500));
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (info@explorepune.in)' } });
      if (!res.ok) {
        console.log(`Failed ${q}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const pages = data.query?.pages || {};
      console.log(`=== Query: ${q} ===`);
      for (const pid of Object.keys(pages)) {
        const p = pages[pid];
        const ii = p.imageinfo?.[0];
        console.log(`  File: ${p.title} -> ${ii?.thumburl || ii?.url}`);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

searchRemainingThrottled();
