import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import HomeExplorer from '@/components/HomeExplorer';

export const dynamic = 'force-dynamic';
const PAGE = 72;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const cat = (sp.cat ?? '').replace(/[^a-z0-9-]/gi, '');
  const term = (sp.q ?? '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 60);
  const pg = Math.max(1, parseInt(sp.page ?? '1') || 1);

  // Fetch categories from Firestore
  let cats: any[] = [];
  try {
    const catsSnap = await getDocs(collection(db, 'place_categories'));
    cats = catsSnap.docs.map((doc) => doc.data());
    cats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || (a.name || '').localeCompare(b.name || ''));
  } catch (err) {
    console.error('Failed to load categories:', err);
  }

  // Fetch places and apply filters in memory
  let allPlaces: any[] = [];
  try {
    const placesSnap = await getDocs(collection(db, 'places'));
    allPlaces = placesSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
    allPlaces = allPlaces.filter((p) => p.status === 'published');

    if (cat) {
      allPlaces = allPlaces.filter((p) =>
        p.place_categories?.some((c: any) => c.slug === cat) ||
        p.category_slug === cat ||
        p.category === cat
      );
    }

    if (term) {
      const lowerTerm = term.toLowerCase();
      allPlaces = allPlaces.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(lowerTerm)) ||
          (p.name_mr && p.name_mr.toLowerCase().includes(lowerTerm)) ||
          (p.description && p.description.toLowerCase().includes(lowerTerm))
      );
    }

    // Sort by popularity_score desc then name asc
    allPlaces.sort((a, b) => {
      if ((b.popularity_score || 0) !== (a.popularity_score || 0)) {
        return (b.popularity_score || 0) - (a.popularity_score || 0);
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  } catch (err: any) {
    console.error('Failed to load places:', err);
  }

  const count = allPlaces.length;
  const pages = Math.max(1, Math.ceil(count / PAGE));
  const places = allPlaces.slice((pg - 1) * PAGE, pg * PAGE);

  return (
    <main>
      <HomeExplorer
        places={places}
        categories={cats}
        currentCat={cat}
        searchTerm={term}
        page={pg}
        totalPages={pages}
        totalCount={count}
      />
    </main>
  );
}
