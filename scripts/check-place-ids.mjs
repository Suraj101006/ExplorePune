import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfxzypc2mqyQwPx9WqOsttvGScJOfUHSw",
  authDomain: "punetrail.firebaseapp.com",
  projectId: "punetrail",
  storageBucket: "punetrail.firebasestorage.app",
  messagingSenderId: "783087382799",
  appId: "1:783087382799:web:ac5de4e4e481863bf44e7a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const snap = await getDocs(collection(db, 'places'));
  const allIds = new Set(snap.docs.map(d => d.id));
  const allSlugs = new Set(snap.docs.map(d => d.data().slug || d.id));

  console.log('Total places in database:', allIds.size);

  const journeyPlaceIds = [
    'shaniwar-wada',
    'lal-mahal',
    'pataleshwar-cave-temple',
    'fc-road',
    'raja-dinkar-kelkar-museum',
    'khadakwasla-dam',
    'sinhagad-fort',
    'pu-la-deshpande-garden',
    'aga-khan-palace',
    'shinde-chhatri',
    'parvati-hill',
    'sarasbaug',
    'vishrambaug-wada',
    'lohagad-fort',
    'bhaja-caves',
    'koregaon-park'
  ];

  for (const doc of snap.docs) {
    const d = doc.data();
    const str = `${doc.id} ${d.slug} ${d.name}`.toLowerCase();
    if (str.includes('fc') || str.includes('fergusson') || str.includes('okayama') || str.includes('deshpande') || str.includes('koregaon') || str.includes('osho')) {
      console.log(`Matched place in DB: id=${doc.id}, slug=${d.slug}, name=${d.name}`);
    }
  }
}

check().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
