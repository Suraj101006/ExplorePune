import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const snap = await getDocs(collection(db, 'places'));
  const verified = [];
  const listed = [];
  for (const d of snap.docs) {
    const data = d.data();
    if (data.data_tier === 'verified' || data.popularity_score >= 80) {
      verified.push({ id: d.id, name: data.name, name_mr: data.name_mr, cat: data.category_slug, score: data.popularity_score });
    } else {
      listed.push({ id: d.id, name: data.name, cat: data.category_slug });
    }
  }
  console.log('=== VERIFIED & FAMOUS PLACES ===', verified.length);
  verified.sort((a,b) => (b.score || 0) - (a.score || 0));
  for (const v of verified) {
    console.log(`${v.id} | ${v.name} (${v.name_mr || ''}) [${v.cat}] - score: ${v.score}`);
  }
  console.log('\n=== OTHER LISTED NODES ===', listed.length);
  for (const l of listed.slice(0, 20)) {
    console.log(`${l.id} | ${l.name} [${l.cat}]`);
  }
}

main().catch(console.error);
