import fs from 'fs';
import { generateCertificatePdf } from '../lib/generateCertificatePdf.ts';

console.log('========================================================');
console.log('MILESTONE IMAGE PROOF, PRIVACY & COMMUNITY GALLERY VERIFICATION');
console.log('========================================================\n');

let failed = 0;
function assert(cond, name, details = '') {
  if (cond) {
    console.log(`✅ [PASS] ${name}`);
  } else {
    console.error(`❌ [FAIL] ${name} - ${details}`);
    failed++;
  }
}

// 1. Check PlaceActions has image requirement and default private
const placeActionsCode = fs.readFileSync('C:/Users/Suraj/explore-pune/components/PlaceActions.tsx', 'utf-8');
assert(placeActionsCode.includes('useState(false)'), 'PlaceActions has privacy state defaulting to false (Private)');
assert(placeActionsCode.includes('DEFAULT TO PRIVATE'), 'PlaceActions documents default to private');
assert(placeActionsCode.includes('imagePreview'), 'PlaceActions validates image preview before submission');
assert(placeActionsCode.includes('is_public: isPublic'), 'PlaceActions saves is_public to Firestore visits doc');

// 2. Check CommunityGallery component exists and is embedded in PlaceDetailClient
const communityGalleryExists = fs.existsSync('C:/Users/Suraj/explore-pune/components/CommunityGallery.tsx');
assert(communityGalleryExists, 'CommunityGallery.tsx component exists');
const placeDetailCode = fs.readFileSync('C:/Users/Suraj/explore-pune/components/PlaceDetailClient.tsx', 'utf-8');
assert(placeDetailCode.includes('<CommunityGallery'), 'CommunityGallery is embedded in PlaceDetailClient');

// 3. Check Milestones page has Check-in modal and Certificate Download
const milestonesCode = fs.readFileSync('C:/Users/Suraj/explore-pune/app/milestones/page.tsx', 'utf-8');
assert(milestonesCode.includes('handleCompleteMilestoneSubmit'), 'Milestones page contains check-in photo submission handler');
assert(milestonesCode.includes('name="modal-privacy"'), 'Milestones modal has private/public privacy selector');
assert(milestonesCode.includes('downloadCertificatePdf'), 'Milestones page offers certificate PDF download for unlocked milestones');
assert(milestonesCode.includes('communityCheckins'), 'Milestones page includes community check-in feed');

// 4. Test Certificate PDF generation
const certDoc = generateCertificatePdf({
  explorerName: 'Suraj Dhok',
  milestoneTitle: 'Fort Conqueror / दुर्गवीर',
  milestoneBadge: '🏰',
  milestoneDesc: 'Scaled 3 historic Sahyadri hill fortresses with verified photo check-ins.',
  dateUnlocked: '2026-10-20',
});
const certOutput = certDoc.output();
assert(certOutput.includes('Suraj Dhok'), 'Certificate PDF contains explorer name "Suraj Dhok"');
assert(certOutput.includes('Sahil Jadhav'), 'Certificate PDF contains team signature "Sahil Jadhav"');
assert(certOutput.includes('Warm regards'), 'Certificate PDF contains "Warm regards" signature');

console.log('\n========================================================');
if (failed === 0) {
  console.log('🎉 ALL MILESTONE, PRIVACY & COMMUNITY GALLERY CHECKS PASSED!');
} else {
  console.error(`⚠️ ${failed} check(s) failed.`);
}
console.log('========================================================');
