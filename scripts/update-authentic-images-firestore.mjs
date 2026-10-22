import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const placesDir = path.resolve('public/images/places');
const availableFiles = new Set(fs.readdirSync(placesDir));

const CATEGORY_FALLBACK_REAL_IMAGE = {
  forts: '/images/places/sinhagad-fort.jpg',
  heritage: '/images/places/shaniwar-wada.jpg',
  temples: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
  museums: '/images/places/raja-dinkar-kelkar-museum.jpg',
  parks: '/images/places/sarasbaug.jpg',
  nature: '/images/places/khadakwasla-dam.jpg',
};

async function main() {
  const snap = await getDocs(collection(db, 'places'));
  console.log(`Updating ${snap.size} places in Firestore with authentic Pune landmark images...`);

  let directCount = 0;
  let fallbackCount = 0;

  for (const d of snap.docs) {
    const data = d.data();
    const slug = d.id;
    let imgPath = null;

    if (availableFiles.has(`${slug}.jpg`)) {
      imgPath = `/images/places/${slug}.jpg`;
      directCount++;
    } else {
      const cat = data.category_slug || 'heritage';
      imgPath = CATEGORY_FALLBACK_REAL_IMAGE[cat] || '/images/places/shaniwar-wada.jpg';
      fallbackCount++;
    }

    await updateDoc(doc(db, 'places', d.id), {
      image_url: imgPath,
    });
  }

  console.log(`Finished updating! ${directCount} direct authentic images, ${fallbackCount} category-authentic landmark images.`);
}

main().catch(console.error);
