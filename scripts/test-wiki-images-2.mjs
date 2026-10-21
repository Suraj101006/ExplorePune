const titles = [
  'Pataleshwar_Caves',
  'Pune-Okayama_Friendship_Garden',
  'Empress_Garden',
  'BAPS_Shri_Swaminarayan_Mandir_Pune',
  "Joshi's_Museum_of_Miniature_Railways",
  'Rajgad_Fort',
  'Torna_Fort',
  'Shinde_Chhatri',
  'Osho_Teerth_Park',
  'Katraj_Jain_Temple'
];

async function getWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=960`;
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
  for (const t of titles) {
    const img = await getWikiImage(t);
    console.log(`${t} => ${img}`);
  }
}

main();
