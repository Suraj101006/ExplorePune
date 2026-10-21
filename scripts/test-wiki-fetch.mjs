async function testWikiApi() {
  const titles = [
    { en: 'Shaniwar_Wada', mr: 'शनिवार_वाडा' },
    { en: 'Sinhagad', mr: 'सिंहगड' },
    { en: 'Aga_Khan_Palace', mr: 'आगाखान_पॅलेस' },
    { en: 'Lal_Mahal', mr: 'लाल_महाल' },
    { en: 'Pataleshwar', mr: 'पाताळेश्वर' },
    { en: 'Rajgad_Fort', mr: 'राजगड' },
    { en: 'Torna_Fort', mr: 'तोरणा_किल्ला' },
    { en: 'Shivneri', mr: 'शिवनेरी' },
    { en: 'Lohagad', mr: 'लोहगड' },
    { en: 'Malhargad', mr: 'मल्हारगड' },
    { en: 'Pu_La_Deshpande_Udyan', mr: 'पु._ल._देशपांडे_उद्यान' },
    { en: 'Sarasbaug', mr: 'सारसबाग' },
    { en: 'Raja_Dinkar_Kelkar_Museum', mr: 'राजा_दिनकर_केळकर_वस्तुसंग्रहालय' },
    { en: 'Khadakwasla_Dam', mr: 'खडकवासला_धरण' },
    { en: 'Vetal_Hill', mr: 'वेताळ_टेकडी' },
    { en: 'Pashan_Lake', mr: 'पाषाण_तलाव' },
    { en: 'Mulshi_Dam', mr: 'मुळशी_धरण' },
    { en: 'Panshet_Dam', mr: 'पानशेत_धरण' },
    { en: 'Dagdusheth_Halwai_Ganapati_Temple', mr: 'दगडूशेठ_हलवाई_गणपती' },
    { en: 'Kasba_Ganapati_Temple', mr: 'कसबा_गणपती' },
    { en: 'Chaturshringi_Temple', mr: 'चतुःशृंगी_मंदिर' },
    { en: 'Vishrambaug_Wada', mr: 'विश्रामबाग_वाडा' },
    { en: 'Kesari_Wada', mr: 'केसरी_वाडा' },
    { en: 'Joshi\'s_Museum_of_Miniature_Railways', mr: 'जोशी_रेल्वे_संग्रहालय' },
    { en: 'Mahatma_Phule_Museum', mr: 'महात्मा_फुले_वस्तुसंग्रहालय' },
    { en: 'Empress_Gardens', mr: 'एम्प्रेस_गार्डन्स' },
    { en: 'Rajiv_Gandhi_Zoological_Park', mr: 'राजीव_गांधी_प्राणीसंग्रहालय' }
  ];

  console.log(`Testing Wikipedia API for ${titles.length} locations...`);
  for (const item of titles) {
    try {
      const enRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.en)}`, {
        headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact: info@explorepune.in)' }
      });
      const enData = enRes.ok ? await enRes.json() : null;

      let mrExtract = null;
      try {
        const mrRes = await fetch(`https://mr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.mr)}`, {
          headers: { 'User-Agent': 'ExplorePuneApp/1.0 (contact: info@explorepune.in)' }
        });
        if (mrRes.ok) {
          const mrData = await mrRes.json();
          mrExtract = mrData.extract;
        }
      } catch {}

      console.log(`[${item.en}]`);
      console.log(`  EN Title: ${enData?.title}`);
      console.log(`  EN Photo: ${enData?.thumbnail?.source || enData?.originalimage?.source || 'NO_PHOTO'}`);
      console.log(`  EN Extract: ${enData?.extract?.slice(0, 100)}...`);
      console.log(`  MR Extract: ${mrExtract ? mrExtract.slice(0, 80) + '...' : 'NONE'}`);
    } catch (err) {
      console.error(`Error fetching ${item.en}:`, err.message);
    }
  }
}

testWikiApi();
