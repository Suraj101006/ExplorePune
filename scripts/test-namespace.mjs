async function testNamespace() {
  const queries = [
    'Kesari Wada Pune',
    'Joshi Miniature Railway',
    'Sambhaji park Pune',
    'Tulshibaug'
  ];

  for (const q of queries) {
    await new Promise(r => setTimeout(r, 1200));
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (info@explorepune.in)' } });
    const data = await res.json();
    console.log(`=== Query: ${q} ===`);
    const pages = data.query?.pages || {};
    for (const p of Object.values(pages)) {
      console.log(`  ${p.title}: ${p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url}`);
    }
  }
}

testNamespace();
