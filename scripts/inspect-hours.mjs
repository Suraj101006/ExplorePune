import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyBfxzypc2mqyQwPx9WqOsttvGScJOfUHSw',
  projectId: 'punetrail',
});
const db = getFirestore(app);

async function inspect() {
  const snap = await getDocs(query(collection(db, 'places'), limit(5)));
  for (const doc of snap.docs) {
    const d = doc.data();
    console.log(doc.id, {
      opening_hours: d.opening_hours,
      best_time: d.best_time,
      place_hours: d.place_hours,
      timing: d.timing,
      hours: d.hours
    });
  }
}
inspect().catch(console.error);
