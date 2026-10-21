import { generateCertificatePdf } from '../lib/generateCertificatePdf.ts';

const doc = generateCertificatePdf({
  explorerName: 'Suraj Dhok',
  milestoneTitle: 'Fort Conqueror / दुर्गवीर',
  milestoneBadge: '🏰',
  milestoneDesc: 'Scaled 3 historic Sahyadri hill fortresses with verified photo check-ins.',
  dateUnlocked: '2026-10-20',
});

const output = doc.output();
console.log('Certificate PDF generated successfully! Length:', output.length);
console.log('Contains Suraj Dhok:', output.includes('Suraj Dhok'));
console.log('Contains Sahil Jadhav:', output.includes('Sahil Jadhav'));
