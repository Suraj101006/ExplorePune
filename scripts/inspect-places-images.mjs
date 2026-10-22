import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectImages() {
  const snap = await getDocs(collection(db, 'places'));
  const places = snap.docs.map(d => ({
    id: d.id,
    name: d.data().name,
    name_mr: d.data().name_mr,
    category: d.data().category_slug || d.data().category,
    image_url: d.data().image_url,
    tier: d.data().data_tier,
    hasDescMr: !!d.data().description_mr,
    hasDescEn: !!d.data().description,
    status: d.data().status
  }));

  console.log(`Total places: ${places.length}`);
  const imageCounts = {};
  for (const p of places) {
    const img = p.image_url || 'NONE';
    imageCounts[img] = (imageCounts[img] || 0) + 1;
  }

  console.log('\n--- Duplicate Images Count ---');
  for (const [img, count] of Object.entries(imageCounts)) {
    if (count > 1) {
      console.log(`${img}: used ${count} times!`);
    }
  }

  console.log('\n--- Places without unique image or with duplicates ---');
  const published = places.filter(p => p.status === 'published');
  console.log(`Published places: ${published.length}`);
  for (const p of published) {
    console.log(`[${p.category}] ${p.name} (mr: ${p.name_mr || 'MISSING'}) -> img: ${p.image_url || 'NONE'} | desc_mr: ${p.hasDescMr ? 'YES' : 'NO'}`);
  }
}

inspectImages().catch(console.error);
