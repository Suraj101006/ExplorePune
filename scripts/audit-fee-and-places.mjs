import { AUTHENTIC_PLACES } from './seed-authentic-places.mjs';

console.log('=== EXPLORE PUNE: 80 PLACES AUDIT ===');
AUTHENTIC_PLACES.forEach((p, idx) => {
  const price = p.place_prices?.[0];
  console.log(`${idx + 1}. [${p.category_slug}] ${p.id}: ${p.name} | Fee: ${price ? (price.is_free ? 'FREE (0)' : price.amount) : 'NONE'}`);
});
