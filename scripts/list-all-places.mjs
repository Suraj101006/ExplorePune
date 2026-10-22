import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listAll() {
  const snap = await getDocs(collection(db, 'places'));
  const places = snap.docs.map(d => ({
    id: d.id,
    slug: d.data().slug || d.id,
    name: d.data().name,
    name_mr: d.data().name_mr,
    category: d.data().category_slug || d.data().category,
    image_url: d.data().image_url,
    tier: d.data().data_tier,
    status: d.data().status
  }));

  console.log(JSON.stringify(places, null, 2));
}

listAll().catch(console.error);
