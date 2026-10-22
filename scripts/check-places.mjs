import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const snap = await getDocs(collection(db, 'places'));
  console.log(`Total places: ${snap.size}`);
  const list = snap.docs.map(d => ({ id: d.id, name: d.data().name, tier: d.data().data_tier, cat: d.data().category_slug }));
  console.log(JSON.stringify(list, null, 2));
}

main().catch(console.error);
