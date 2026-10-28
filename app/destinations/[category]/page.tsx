import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getCachedPlacesData, projectPlaceCardSummary } from '@/lib/serverPlaces';
import HomeExplorer from '@/components/HomeExplorer';

export const revalidate = 1800; // 30-minute ISR
const PAGE = 16;

interface CategoryMeta {
  title: string;
  description: string;
  headingEn: string;
  headingMr: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  forts: {
    title: 'Historic Forts in Pune | Sahyadri Bastions, Treks & Heritage Guide',
    description:
      'Explore Pune’s majestic hill forts including Sinhagad, Rajgad, Torna, and Lohagad with verified trekking routes, timings, and entry details.',
    headingEn: 'Sahyadri Hill Forts & Mountain Bastions',
    headingMr: 'सह्याद्रीचे ऐतिहासिक गड व किल्ले',
  },
  heritage: {
    title: 'Peshwa Wadas & Historic Palaces in Pune | Architecture & Heritage Guide',
    description:
      'Step inside Pune’s Maratha and Peshwa wadas including Shaniwar Wada, Lal Mahal, and Vishrambaug Wada with verified visitor timings and entry fees.',
    headingEn: 'Peshwa Era Wadas & Historic Palaces',
    headingMr: 'पेशवेकालीन ऐतिहासिक वाडे व राजवाडे',
  },
  temples: {
    title: 'Ancient Temples & Sacred Shrines in Pune | Spiritual Field Guide',
    description:
      'Visit Pune’s most revered temples and Jyotirlinga shrines including Dagdusheth Ganpati, Omkareshwar, Alandi, and Bhimashankar.',
    headingEn: 'Sacred Temples & Historic Shrines',
    headingMr: 'पुण्यनगरीची पवित्र मंदिरे व तीर्थक्षेत्रे',
  },
  museums: {
    title: 'Museums & Reformers Memorials in Pune | Cultural Guide',
    description:
      'Discover Pune’s historic museums and reformer landmarks including Raja Dinkar Kelkar Museum, Mahatma Phule Wada, and Aga Khan Palace.',
    headingEn: 'Museums & Reformers Memorials',
    headingMr: 'वस्तुसंग्रहालये व समाजसुधारकांची स्मारके',
  },
  nature: {
    title: 'Scenic Lakes, Tekdis & Nature Reserves in Pune | Outdoor Guide',
    description:
      'Discover Pune’s tranquil lakes and Sahyadri hills including Khadakwasla Dam, Pashan Lake, and Vetal Tekdi with nature trail details.',
    headingEn: 'Scenic Lakes, Tekdis & Nature Trails',
    headingMr: 'निसर्गरम्य तलाव, टेकड्या व निसर्ग वाटा',
  },
  parks: {
    title: 'Botanical Gardens & Parks in Pune | Green Sanctuaries Guide',
    description:
      'Stroll through Pune’s serene gardens including Pu La Deshpande Okayama Garden and Empress Botanical Garden with visitor hours.',
    headingEn: 'Parks, Botanical Gardens & Promenades',
    headingMr: 'उद्याने, बागा व शांत परिसर',
  },
  food: {
    title: 'Punekar Food Heritage & Iconic Eateries | Culinary Guide',
    description:
      'Explore Pune’s legendary culinary institutions along FC Road and Pune Camp, authentic Misal, Chitale Bakarwadi, and Sujata Mastani.',
    headingEn: 'Pune Culinary Heritage & Legendary Eateries',
    headingMr: 'पुणेरी खाद्यसंस्कृती व प्रसिद्ध उपाहारगृहे',
  },
  free: {
    title: 'Free Entry Heritage Sites & Nature Places in Pune | Budget Field Guide',
    description:
      'Explore verified free-entry destinations in Pune (₹0 admission) including historic memorials, public gardens, ghats, and hill trails.',
    headingEn: 'Verified Free Entry Destinations (₹0 Admission)',
    headingMr: 'मोफत प्रवेश असणारी पर्यटन व वारसा स्थळे',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) {
    return {
      title: 'Destinations | Explore Pune',
      description: 'Explore Pune historic destinations, forts, wadas, and sacred temples.',
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/destinations/${category}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/destinations/${category}`,
      siteName: 'Explore Pune',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/images/pune-map-hero.jpg',
          width: 1200,
          height: 630,
          alt: meta.headingEn,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/images/pune-map-hero.jpg'],
    },
  };
}

export default async function CategoryDestinationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { category: catParam } = await params;
  const sp = await searchParams;
  const term = (sp.q ?? '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 60);
  const pg = Math.max(1, parseInt(sp.page ?? '1') || 1);

  const { places: rawPlaces, categories: cats } = await getCachedPlacesData();

  // If the parameter matches a place slug, redirect permanently to /places/:slug
  const matchingPlace = rawPlaces.find(
    (p) => p.slug === catParam || p.id === catParam
  );
  if (matchingPlace) {
    permanentRedirect(`/places/${matchingPlace.slug || matchingPlace.id}`);
  }

  // Validate category
  const meta = CATEGORY_META[catParam];
  if (!meta && !cats.some((c) => c.slug === catParam)) {
    notFound();
  }

  let allPlaces = [...rawPlaces];

  if (catParam === 'free') {
    allPlaces = allPlaces.filter(
      (p) => p.fee_status === 'free' && (p.entry_fee === 0 || p.place_prices?.[0]?.amount === 0)
    );
  } else {
    allPlaces = allPlaces.filter(
      (p) =>
        p.place_categories?.some((c: any) => c.slug === catParam) ||
        p.category_slug === catParam ||
        p.category === catParam
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

  allPlaces.sort((a, b) => {
    if ((b.popularity_score || 0) !== (a.popularity_score || 0)) {
      return (b.popularity_score || 0) - (a.popularity_score || 0);
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  const count = allPlaces.length;
  const pages = Math.max(1, Math.ceil(count / PAGE));
  const places = allPlaces.slice((pg - 1) * PAGE, pg * PAGE).map(projectPlaceCardSummary);

  const categoryName = meta?.headingEn || catParam;

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
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `https://explore-pune-eosin.vercel.app/destinations/${catParam}`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    itemListElement: places.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HomeExplorer
        places={places}
        categories={cats}
        currentCat={catParam}
        searchTerm={term}
        page={pg}
        totalPages={pages}
        totalCount={count}
      />
    </main>
  );
}
