const fs = require('fs');

const places106 = JSON.parse(fs.readFileSync('data/pune_places_106.json', 'utf8'));
const published106 = JSON.parse(fs.readFileSync('data/published_106_places.json', 'utf8'));
const verifDb = JSON.parse(fs.readFileSync('data/destination_verification_database.json', 'utf8'));

console.log('=== DATA SYNCHRONIZATION AUDIT ===');
console.log('pune_places_106 count:', places106.length);
console.log('published_106 count:', published106.length);
console.log('destination_verification_database count:', verifDb.length);

const ids106 = new Set(places106.map(p => p.id));
const slugs106 = new Set(places106.map(p => p.slug));

let missingInPublished = published106.filter(p => !ids106.has(p.id) && !slugs106.has(p.slug));
let missingInVerif = verifDb.filter(p => !ids106.has(p.id) && !slugs106.has(p.slug));

console.log('Published records not in 106:', missingInPublished.length);
console.log('VerifDb records not in 106:', missingInVerif.length);

// Check if any slug is duplicated
let slugCounts = {};
places106.forEach(p => {
  slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
});
let dupSlugs = Object.entries(slugCounts).filter(([s, c]) => c > 1);
console.log('Duplicate slugs in pune_places_106:', dupSlugs);
