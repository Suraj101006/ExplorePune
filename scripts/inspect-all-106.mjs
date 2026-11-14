import fs from 'fs';

const p106 = JSON.parse(fs.readFileSync('./data/pune_places_106.json', 'utf8'));

console.log(`Total places: ${p106.length}\n`);
console.log('Idx | ID | Name | Cat | Lat, Lng | Fee | Verified Sources');
console.log('-'.repeat(85));

p106.forEach((p, i) => {
  const sources = p.verification?.sources?.length || 0;
  const latLng = `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`;
  console.log(
    `${(i + 1).toString().padStart(3)} | ${p.id.padEnd(28)} | ${p.name.slice(0, 26).padEnd(26)} | ${(p.category || '').padEnd(8)} | ${latLng.padEnd(17)} | ${(p.fee_status || 'unknown').padEnd(6)} | ${sources} sources`
  );
});
