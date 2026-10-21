async function searchImage(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json&srlimit=3`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneGuideBot/1.0 (contact@explorepune.in)' } });
  const data = await res.json();
  const results = data.query?.search || [];
  for (const r of results) {
    console.log(q, '=>', r.title);
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(r.title)}&prop=imageinfo&iiprop=url|size&format=json`;
    const ires = await fetch(infoUrl, { headers: { 'User-Agent': 'ExplorePuneGuideBot/1.0 (contact@explorepune.in)' } });
    const idata = await ires.json();
    const pages = idata.query?.pages || {};
    for (const p in pages) {
      const info = pages[p]?.imageinfo?.[0];
      if (info) {
        console.log('  Direct URL:', info.url);
        return info.url;
      }
    }
  }
  return null;
}

async function main() {
  await searchImage('Pataleshwar Caves Pune');
  await searchImage('Empress Botanical Garden Pune');
  await searchImage('BAPS Swaminarayan Mandir Pune');
  await searchImage('Tribal Museum Pune');
}

main();
