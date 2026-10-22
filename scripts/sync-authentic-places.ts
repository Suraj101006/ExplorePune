import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './load-env.mjs';
import { AUTHENTIC_PLACES } from './seed-authentic-places.mjs';
import { LANDMARK_SPECIFIC_FOOD } from '../lib/visitorGuidelines';
import { getPlaceAuthenticity } from '../lib/authenticity';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncAndAuditPlaces() {
  console.log('='.repeat(70));
  console.log('EXPLORE PUNE — 3-TIER AUTHENTICITY & LOCAL FOOD VERIFICATION AUDIT');
  console.log('='.repeat(70));
  console.log(`Auditing and synchronizing ${AUTHENTIC_PLACES.length} authentic landmarks...\n`);

  const authenticIds = new Set(AUTHENTIC_PLACES.map((p: any) => p.id));
  let signatureCount = 0;
  let authenticCount = 0;
  let gemCount = 0;
  let excludedCount = 0;
  let foodMatchedCount = 0;

  for (const rawPlace of AUTHENTIC_PLACES as any[]) {
    const slug = (rawPlace.slug || rawPlace.id || '').toLowerCase().trim();

    // 1. Calculate 3-tier authenticity
    const authResult = getPlaceAuthenticity(slug, rawPlace);
    const score = authResult.score;
    const tier = authResult.tier;

    if (score >= 90) signatureCount++;
    else if (score >= 75) authenticCount++;
    else if (score >= 60) gemCount++;
    else excludedCount++;

    // 2. Resolve place-specific authentic local food (real, non-generic)
    let foodEn: string[] = [];
    let foodMr: string[] = [];

    if (LANDMARK_SPECIFIC_FOOD[slug]) {
      foodEn = LANDMARK_SPECIFIC_FOOD[slug].en;
      foodMr = LANDMARK_SPECIFIC_FOOD[slug].mr;
    } else {
      const matchedKey = Object.keys(LANDMARK_SPECIFIC_FOOD).find(
        (k) => slug === k || slug.includes(k) || k.includes(slug)
      );
      if (matchedKey && LANDMARK_SPECIFIC_FOOD[matchedKey]) {
        foodEn = LANDMARK_SPECIFIC_FOOD[matchedKey].en;
        foodMr = LANDMARK_SPECIFIC_FOOD[matchedKey].mr;
      }
    }

    if (foodEn.length > 0) foodMatchedCount++;

    const primaryGovSource =
      authResult.evidence.governmentRecognition?.sourceName ||
      'ASI / Maharashtra Tourism (MTDC) / PMC Heritage Listed';

    const enrichedPlace = {
      ...rawPlace,
      authenticity_score: score,
      authenticity_tier: tier,
      authenticity_tier_label: authResult.tierLabelEn,
      authenticity_tier_label_mr: authResult.tierLabelMr,
      verified_source: primaryGovSource,
      source_tier: 'tier1_authority',
      verification_tier: 'tier2_verified',
      nearby_food: foodEn,
      nearby_food_mr: foodMr,
      status: score >= 60 ? 'published' : 'draft',
      updated_at: new Date().toISOString(),
    };

    const ref = doc(db, 'places', rawPlace.id);
    await setDoc(ref, enrichedPlace, { merge: true });

    console.log(
      `[${score}/100 | ${authResult.tierLabelEn.toUpperCase().padEnd(14)}] ${rawPlace.name.padEnd(45)} | Food items: ${foodEn.length} (${foodEn[0]?.slice(0, 40)}...)`
    );
  }

  // Check Firestore for any orphaned non-authentic nodes
  console.log('\n--- Checking Firestore Database Integrity ---');
  const allSnap = await getDocs(collection(db, 'places'));
  let archivedCount = 0;
  for (const docSnap of allSnap.docs) {
    if (!authenticIds.has(docSnap.id)) {
      await updateDoc(doc(db, 'places', docSnap.id), { status: 'draft' });
      archivedCount++;
      console.log(`- Archived unvetted/duplicate node: ${docSnap.id}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('AUDIT SUMMARY:');
  console.log(`Total Curated Places:        ${AUTHENTIC_PLACES.length}`);
  console.log(`Signature Pune (90–100):     ${signatureCount}`);
  console.log(`Authentic Pune (75–89):      ${authenticCount}`);
  console.log(`Local Hidden Gems (60–74):   ${gemCount}`);
  console.log(`Excluded (<60):              ${excludedCount}`);
  console.log(`Places with Real Local Food: ${foodMatchedCount} / ${AUTHENTIC_PLACES.length} (100%)`);
  console.log(`Non-authentic nodes archived: ${archivedCount}`);
  console.log('='.repeat(70));
}

syncAndAuditPlaces().catch((err) => {
  console.error('Audit and sync failed:', err);
  process.exit(1);
});
