const candidateMap = {
  'shaniwar-wada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada_illuminated.jpg/960px-Front_view_of_Shaniwar_Wada_illuminated.jpg',
  'sinhagad-fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sinhagad.jpg/960px-Sinhagad.jpg',
  'aga-khan-palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Pune_Palace.jpg/960px-Pune_Palace.jpg',
  'shreemant-dagdusheth-halwai-ganpati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Dagdusheth_Ganpati_Temple_Decorated_during_Ganesh_Chaturti_September_2012_%281%29.JPG/960px-Dagdusheth_Ganpati_Temple_Decorated_during_Ganesh_Chaturti_September_2012_%281%29.JPG',
  'lal-mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lal_Mahal%2C_Pune.jpg/960px-Lal_Mahal%2C_Pune.jpg',
  'parvati-hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Parvati.JPG/960px-Parvati.JPG',
  'sarasbaug': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Saras_Bagh%2CPune%2CIndia.JPG/960px-Saras_Bagh%2CPune%2CIndia.JPG',
  'raja-dinkar-kelkar-museum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg/960px-Building_of_Raja_Dinkar_Kelkar_Museum%2C_Pune.jpg',
  'okayama-friendship-garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pu_La_Deshpande_garden_5.JPG/960px-Pu_La_Deshpande_garden_5.JPG',
  'chaturshringi-temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Chaturshringi-TempleGates.jpg/960px-Chaturshringi-TempleGates.jpg',
  'khadakwasla-dam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Khadakwasla_Dam_image.JPG/960px-Khadakwasla_Dam_image.JPG',
  'vetal-tekdi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Vetal_tekdi.jpg/960px-Vetal_tekdi.jpg',
  'vishrambaug-wada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vishram_Baug_Wada.jpg/960px-Vishram_Baug_Wada.jpg',
  'rajiv-gandhi-zoological-park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Rajiv_Gandhi_zoo_entrance.png/960px-Rajiv_Gandhi_zoo_entrance.png',
  'national-war-memorial': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/National_War_Memorial%2C_Pune.JPG/960px-National_War_Memorial%2C_Pune.JPG',
  'kasba-ganpati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/KasbaganpatiMandir.JPG/960px-KasbaganpatiMandir.JPG',
  'pashan-lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Pashan_Lake.jpg/960px-Pashan_Lake.jpg',
  'pataleshwar-cave-temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Pataleshwar_Caves%2C_Pune.jpg/960px-Pataleshwar_Caves%2C_Pune.jpg',
  'empress-botanical-garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Empress_garden.JPG/960px-Empress_garden.JPG',
  'baps-swaminarayan-mandir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/BAPS_Shri_Swaminarayan_Mandir%2C_Pune.jpg/960px-BAPS_Shri_Swaminarayan_Mandir%2C_Pune.jpg',
  'tribal-museum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tribal_Research_and_Training_Institute_Pune.jpg/960px-Tribal_Research_and_Training_Institute_Pune.jpg',
  'joshi-miniature-railway-museum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Joshi%27s_Museum_of_Miniature_Railways_Pune.jpg/960px-Joshi%27s_Museum_of_Miniature_Railways_Pune.jpg'
};

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact@explorepune.in)' } });
    return res.status;
  } catch (e) {
    return e.message;
  }
}

async function main() {
  for (const [k, u] of Object.entries(candidateMap)) {
    const status = await checkUrl(u);
    console.log(`${k} -> ${status}`);
  }
}

main();
