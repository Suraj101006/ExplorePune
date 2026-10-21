import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyBfxzypc2mqyQwPx9WqOsttvGScJOfUHSw',
  projectId: 'punetrail',
});
const db = getFirestore(app);

async function verify() {
  const snap = await getDocs(collection(db, 'places'));
  const published = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.status === 'published');

  console.log(`\n========================================`);
  console.log(`TOTAL PUBLISHED PLACES IN FIRESTORE: ${published.length}`);
  console.log(`========================================\n`);

  const cats = {};
  for (const p of published) {
    const c = p.category_slug || p.category || 'uncategorized';
    cats[c] = (cats[c] || 0) + 1;
  }

  console.log('Categories breakdown:');
  for (const [c, cnt] of Object.entries(cats)) {
    console.log(`  - ${c}: ${cnt} places`);
  }

  console.log('\nChecking image URLs and Marathi translations:');
  let missingImg = 0;
  let missingMr = 0;
  published.forEach((p, idx) => {
    if (!p.image_url) {
      console.log(`❌ Missing image_url: ${p.id}`);
      missingImg++;
    }
    if (!p.name_mr || !p.description_mr) {
      console.log(`❌ Missing Marathi text: ${p.id}`);
      missingMr++;
    }
  });

  console.log(`\nIntegrity check:`);
  console.log(`  Missing images: ${missingImg}`);
  console.log(`  Missing Marathi info: ${missingMr}`);
  console.log(`  Verified authentic: ${published.length - missingImg - missingMr}/${published.length}`);
}

verify().catch(console.error);
