import type { Metadata } from 'next';
import { getCachedPlacesData, projectPlaceCardSummary } from '@/lib/serverPlaces';
import HomeExplorer from '@/components/HomeExplorer';

export const revalidate = 1800; // 30-minute ISR
const PAGE = 16;

export const metadata: Metadata = {
  title: 'All Destinations & Historic Sites in Pune | Field Guide',
  description:
    'Complete field guide to 80+ historic forts, Peshwa-era wadas, ancient temples, museums, and scenic trails across Pune.',
  alternates: {
    canonical: '/destinations',
  },
  openGraph: {
    title: 'All Destinations & Historic Sites in Pune | Explore Pune',
    description:
      'Complete field guide to 80+ historic forts, Peshwa-era wadas, ancient temples, museums, and scenic trails across Pune.',
    url: '/destinations',
    siteName: 'Explore Pune',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/pune-map-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Explore Pune Destinations Field Guide',
      },
    ],
  },
};

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const term = (sp.q ?? '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 60);
  const pg = Math.max(1, parseInt(sp.page ?? '1') || 1);

  const { places: rawPlaces, categories: cats } = await getCachedPlacesData();
  let allPlaces = [...rawPlaces];

  if (term) {
    const lowerTerm = term.toLowerCase();
    allPlaces = allPlaces.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(lowerTerm)) ||
        (p.name_mr && p.name_mr.toLowerCase().includes(lowerTerm)) ||
        (p.description && p.description.toLowerCase().includes(lowerTerm)) ||
        (p.category && p.category.toLowerCase().includes(lowerTerm))
    );
  }

  allPlaces.sort((a, b) => {
    if ((b.popularity_score || 0) !== (a.popularity_score || 0)) {
      return (b.popularity_score || 0) - (a.popularity_score || 0);
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  const count = allPlaces.length;
  const pages = Math.max(1, Math.ceil(count / PAGE));
  const places = allPlaces.slice((pg - 1) * PAGE, pg * PAGE).map(projectPlaceCardSummary);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://explore-pune-eosin.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinations',
        item: 'https://explore-pune-eosin.vercel.app/destinations',
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomeExplorer
        places={places}
        categories={cats}
        currentCat=""
        searchTerm={term}
        page={pg}
        totalPages={pages}
        totalCount={count}
      />
    </main>
  );
}
