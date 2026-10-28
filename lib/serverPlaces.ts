import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

let cachedPlaces: any[] | null = null;
let cachedCats: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const DEFAULT_CATEGORIES = [
  { slug: 'forts', name: 'Forts & Treks', name_mr: 'किल्ले व गड', sort_order: 1 },
  { slug: 'heritage', name: 'Historic Wadas', name_mr: 'ऐतिहासिक वाडे', sort_order: 2 },
  { slug: 'temples', name: 'Temples & Shrines', name_mr: 'प्रसिद्ध मंदिरे', sort_order: 3 },
  { slug: 'museums', name: 'Museums & Reformers', name_mr: 'वस्तुसंग्रहालये', sort_order: 4 },
  { slug: 'parks', name: 'Parks & Botanical Gardens', name_mr: 'उद्याने व बागा', sort_order: 5 },
  { slug: 'nature', name: 'Lakes & Scenic Viewpoints', name_mr: 'तलाव व निसर्ग', sort_order: 6 },
  { slug: 'food', name: 'Food & Culinary Heritage', name_mr: 'पुणेरी खाद्यसंस्कृती', sort_order: 7 },
];

export async function getCachedPlacesData() {
  const now = Date.now();
  if (cachedPlaces && cachedCats && now - cacheTime < CACHE_TTL_MS) {
    return { places: cachedPlaces, categories: cachedCats };
  }

  let cats: any[] = [];
  try {
    const catsSnap = await getDocs(collection(db, 'place_categories'));
    cats = catsSnap.docs.map((doc) => doc.data());
    cats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || (a.name || '').localeCompare(b.name || ''));
  } catch (err) {
    console.warn('[serverPlaces] Categories fetch fallback:', err);
  }

  if (cats.length === 0) {
    cats = DEFAULT_CATEGORIES;
  }

  let allPlaces: any[] = [];
  try {
    const placesSnap = await getDocs(collection(db, 'places'));
    allPlaces = placesSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
    allPlaces = allPlaces.filter((p) => p.status === 'published');
  } catch (err) {
    console.warn('[serverPlaces] Places fetch fallback to structured dataset:', err);
  }

  if (allPlaces.length === 0 && Array.isArray(ALL_STRUCTURED_PLACES)) {
    allPlaces = ALL_STRUCTURED_PLACES.map((p) => ({ ...p, status: 'published' }));
  }

  cachedPlaces = allPlaces;
  cachedCats = cats;
  cacheTime = now;

  return { places: cachedPlaces, categories: cachedCats };
}

export function projectPlaceCardSummary(p: any) {
  return {
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    name_mr: p.name_mr || '',
    category: p.category || '',
    category_slug: p.category_slug || '',
    image_url: p.image_url || '',
    fee_status: p.fee_status || '',
    entry_fee: typeof p.entry_fee === 'number' ? p.entry_fee : null,
    place_prices: Array.isArray(p.place_prices) ? p.place_prices.slice(0, 1) : [],
    operating_hours: p.operating_hours || null,
    popularity_score: p.popularity_score || 0,
    latitude: typeof p.latitude === 'number' ? p.latitude : null,
    longitude: typeof p.longitude === 'number' ? p.longitude : null,
    address: p.address || '',
    address_mr: p.address_mr || '',
    description: (p.description || '').slice(0, 160),
    description_mr: (p.description_mr || '').slice(0, 160),
    tier: p.tier || 'verified',
    place_categories: Array.isArray(p.place_categories)
      ? p.place_categories.map((c: any) => ({ slug: c.slug, name: c.name }))
      : [],
  };
}
