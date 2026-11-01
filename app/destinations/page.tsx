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

  const destinationsFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the top must-visit historical places in Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The top historical destinations in Pune include Shaniwar Wada (the historic Peshwa seat), Sinhagad Fort (famed for Tanaji Malusare’s 1670 battle), Aga Khan Palace (Gandhi memorial), Lal Mahal, and the 8th-century Pataleshwar Cave Temple.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which historical forts near Pune can be visited in one day?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sinhagad Fort, Lohagad Fort, Tikona Fort, and Malhargad are ideal one-day trips located within 25 to 55 km of central Pune, easily accessible via road and public transport.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are there any free tourist attractions in Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Major cultural and heritage landmarks with zero entry fee include Shreemant Dagdusheth Halwai Ganpati Mandir, Kasba Ganpati, Pataleshwar Caves, Saras Baug, and Vetal Tekdi.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many heritage and cultural spots are covered on Explore Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Explore Pune provides verified field records for over 80 curated destinations spanning Sahyadri hill forts, Peshwa-era wadas, ancient temples, botanical gardens, and culinary landmarks.',
        },
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Historic & Cultural Places in Pune',
    itemListElement: places.map((p, idx) => ({
      '@type': 'ListItem',
      position: (pg - 1) * PAGE + idx + 1,
      name: p.name,
      url: `https://explore-pune-eosin.vercel.app/places/${encodeURIComponent(p.slug || p.id)}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationsFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
