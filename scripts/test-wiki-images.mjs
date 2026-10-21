const landmarks = [
  { slug: 'shaniwar-wada', title: 'Shaniwar_Wada' },
  { slug: 'sinhagad-fort', title: 'Sinhagad' },
  { slug: 'aga-khan-palace', title: 'Aga_Khan_Palace' },
  { slug: 'shreemant-dagdusheth-halwai-ganpati', title: 'Dagadusheth_Halwai_Ganapati_Temple' },
  { slug: 'pataleshwar-cave-temple', title: 'Pataleshwar' },
  { slug: 'lal-mahal', title: 'Lal_Mahal' },
  { slug: 'parvati-hill', title: 'Parvati_Hill' },
  { slug: 'sarasbaug', title: 'Sarasbaug' },
  { slug: 'raja-dinkar-kelkar-museum', title: 'Raja_Dinkar_Kelkar_Museum' },
  { slug: 'okayama-friendship-garden', title: 'Pu._La._Deshpande_Udyan' },
  { slug: 'chaturshringi-temple', title: 'Chaturshringi_Temple' },
  { slug: 'khadakwasla-dam', title: 'Khadakwasla_Dam' },
  { slug: 'vetal-tekdi', title: 'Vetal_Hill' },
  { slug: 'empress-botanical-garden', title: 'Empress_Gardens' },
  { slug: 'vishrambaug-wada', title: 'Vishrambaug_Wada' },
  { slug: 'rajiv-gandhi-zoological-park', title: 'Rajiv_Gandhi_Zoological_Park' },
  { slug: 'national-war-memorial', title: 'National_War_Memorial_Southern_Command' },
  { slug: 'kasba-ganpati', title: 'Kasba_Ganapati' },
  { slug: 'pashan-lake', title: 'Pashan_Lake' },
  { slug: 'tribal-museum', title: 'Tribal_Research_and_Training_Institute' },
];

async function getWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact@explorepune.in)' } });
    const data = await res.json();
    const pages = data.query?.pages || {};
    for (const id in pages) {
      if (pages[id]?.thumbnail?.source) {
        return pages[id].thumbnail.source;
      }
    }
  } catch (e) {
    console.error(title, e.message);
  }
  return null;
}

async function main() {
  const results = {};
  for (const item of landmarks) {
    const img = await getWikiImage(item.title);
    results[item.slug] = img;
    console.log(`${item.slug}: ${img}`);
  }
}

main();
