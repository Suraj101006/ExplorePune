async function searchWiki() {
  const queries = [
    { key: 'rajgad', term: 'Rajgad' },
    { key: 'shivneri', term: 'Shivneri' },
    { key: 'kesari', term: 'Kesari Wada' },
    { key: 'joshi', term: 'Miniature railway Pune' },
    { key: 'sambhaji', term: 'Sambhaji Garden Pune' },
    { key: 'tulshibaug', term: 'Tulshibaug' }
  ];

  for (const q of queries) {
    // 1. Search Wikipedia pages
    const pUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q.term)}&format=json`;
    const pRes = await fetch(pUrl, { headers: { 'User-Agent': 'ExplorePune/1.0' } });
    const pData = await pRes.json();
    const hits = pData.query?.search?.slice(0, 3) || [];
    console.log(`=== Query: ${q.term} ===`);
    for (const h of hits) {
      console.log(`  Page: "${h.title}"`);
      // get image of page
      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1000&titles=${encodeURIComponent(h.title)}`;
      const iRes = await fetch(imgUrl, { headers: { 'User-Agent': 'ExplorePune/1.0' } });
      const iData = await iRes.json();
      const p = Object.values(iData.query?.pages || {})[0];
      const src = p?.thumbnail?.source || p?.original?.source;
      if (src) console.log(`    Image: ${src}`);
    }
  }
}

searchWiki();
