import { AUTHENTIC_PLACES } from './seed-authentic-places.mjs';

console.log('Total places in AUTHENTIC_PLACES:', AUTHENTIC_PLACES.length);
const cats = {};
for (const p of AUTHENTIC_PLACES) {
  cats[p.category_slug] = (cats[p.category_slug] || 0) + 1;
}
console.log('Categories breakdown:');
for (const [c, count] of Object.entries(cats)) {
  console.log(`  ${c}: ${count}`);
}

console.log('\nList of places:');
AUTHENTIC_PLACES.forEach((p, i) => {
  console.log(`${i + 1}. [${p.category_slug}] ${p.name} (${p.name_mr}) - ${p.id}`);
});
