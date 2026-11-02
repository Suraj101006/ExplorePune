import { notFound } from 'next/navigation';
import PlaceDetailClient from '@/components/PlaceDetailClient';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import { getCachedPlacesData } from '@/lib/serverPlaces';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugSet = new Set<string>();

  try {
    const snap = await getDocs(collection(db, 'places'));
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.status === 'published') {
        const s = data.slug || d.id;
        if (s) slugSet.add(s);
      }
    });
  } catch (err) {
    console.warn('[generateStaticParams] Firestore fetch fallback to local places:', err);
  }

  if (Array.isArray(ALL_STRUCTURED_PLACES)) {
    ALL_STRUCTURED_PLACES.forEach((p) => {
      const s = p.slug || p.id;
      if (s) slugSet.add(s);
    });
  }

  return Array.from(slugSet).map((slug) => ({
    slug,
  }));
}

const SLUG_ALIASES: Record<string, string> = {
  'fc-road': 'fergusson-college-heritage',
  'fergusson-college-road': 'fergusson-college-heritage',
  'koregaon-park': 'osho-teerth-park',
  'pu-la-deshpande-garden': 'okayama-friendship-garden',
  'pul-deshpande-garden': 'okayama-friendship-garden',
  'phule-wada': 'mahatma-phule-wada',
  'jyotirao-phule-wada': 'mahatma-phule-wada',
  'omkareshwar': 'omkareshwar-temple',
  'trishund-ganpati': 'trishund-ganpati-temple',
  'balgandharva': 'balgandharva-ranga-mandir',
  'bhor-rajwada': 'bhor-rajwada-palace',
  'lenyadri': 'lenyadri-caves-ganpati',
  'chitale-bandhu': 'chitale-bandhu-mithaiwale',
  'sujata-mastani': 'sujata-mastani-heritage',
  'kayani-bakery': 'kayani-bakery-camp',
  'someshwar-temple': 'someshwar-temple-pashan',
  'tambat-ali': 'tambat-ali-craft-quarter',
  'jangli-maharaj': 'jangli-maharaj-temple',
  'khunya-murlidhar': 'khunya-murlidhar-temple',
};

async function getPlaceData(slug: string) {
  const target = SLUG_ALIASES[slug] || slug;

  try {
    const q = query(
      collection(db, 'places'),
      where('slug', '==', target),
      where('status', '==', 'published'),
      limit(1)
    );
    let snap = await getDocs(q);
    if (snap.empty) {
      const byId = await getDocs(
        query(collection(db, 'places'), where('__name__', '==', target), limit(1))
      );
      if (!byId.empty) snap = byId;
    }
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
    }
  } catch (err) {
    console.warn(`[getPlaceData] Firestore query failed for ${slug}, checking fallback:`, err);
  }

  // Fallback to verified local structured places database
  const fallback = ALL_STRUCTURED_PLACES.find((p) => p.slug === target || p.id === target);
  if (fallback) {
    return fallback as any;
  }

  return null;
}

function getRelatedPlaces(place: any, pool: any[], count = 4) {
  const currentCategory = place.category_slug || place.category;
  const currentSlug = place.slug || place.id;

  const dataset = pool && pool.length > 0 ? pool : ALL_STRUCTURED_PLACES;

  const sameCategory = dataset.filter(
    (p: any) =>
      p.slug !== currentSlug &&
      p.id !== currentSlug &&
      (p.category_slug === currentCategory || p.category === currentCategory)
  );

  const others = dataset.filter(
    (p: any) =>
      p.slug !== currentSlug &&
      p.id !== currentSlug &&
      p.category_slug !== currentCategory &&
      p.category !== currentCategory
  );

  return [...sameCategory, ...others].slice(0, count);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (place) {
    const feeStr =
      place.fee_status === 'free' || place.entry_fee === 0
        ? 'Free Entry'
        : place.entry_fee
        ? `Ticket ₹${place.entry_fee}`
        : 'Visitor Guide';
    const title = `${place.name} Pune — Timings, ${feeStr} & Visitor Guide`;
    const description =
      `Visiting ${place.name} in Pune? Check verified opening hours, ticket entry fee (${feeStr}), history, and public transit directions. ${place.description?.slice(0, 90) || ''}`.trim();
    const imageUrl = place.image_url || '/images/pune-map-hero.jpg';

    return {
      title,
      description,
      alternates: {
        canonical: `/places/${slug}`,
      },
      openGraph: {
        title: `${title} | Explore Pune`,
        description,
        url: `/places/${slug}`,
        siteName: 'Explore Pune',
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${place.name} Pune`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Explore Pune`,
        description,
        images: [imageUrl],
      },
    };
  }

  return {
    title: 'Place Not Found',
    description: 'The requested Pune historic destination or heritage site could not be found.',
    robots: { index: false, follow: false },
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    notFound();
  }

  const categorySlug = place.category_slug || place.category || 'heritage';
  const categoryName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

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
        item: `https://explore-pune-eosin.vercel.app/destinations/${encodeURIComponent(categorySlug)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: place.name,
        item: `https://explore-pune-eosin.vercel.app/places/${encodeURIComponent(slug)}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the ticket entry fee for ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            place.fee_status === 'free' || place.entry_fee === 0
              ? `Entry to ${place.name} is completely free for all visitors.`
              : place.entry_fee
              ? `The ticket entry fee for ${place.name} is ₹${place.entry_fee} per adult.${place.fee_details?.foreigner ? ` For international tourists, entry fee is ₹${place.fee_details.foreigner}.` : ''}`
              : `Standard admission fees apply. Visitors can verify current municipal or ASI ticketing at the entrance gate.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the visiting hours for ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            place.place_hours && place.place_hours.length > 0
              ? `${place.name} is open from ${place.place_hours[0].opens_at || '9:00 AM'} to ${place.place_hours[0].closes_at || '6:00 PM'}.${place.place_hours[0].days ? ` (${place.place_hours[0].days})` : ''}`
              : `${place.name} is typically accessible daily from sunrise to sunset (approx. 6:00 AM to 6:00 PM). Visiting during daylight hours is recommended.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where is ${place.name} located in Pune?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${place.name} is located at ${place.address || 'Pune District, Maharashtra, India'}. Visitors can reach it using Pune Metro, PMPML public transit, or local taxis.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best time to visit ${place.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            place.best_time ||
            'The ideal time to visit is between October and March during Pune’s pleasant winter weather, or early morning hours for cooler conditions and clear sightseeing.',
        },
      },
    ],
  };

  const touristAttractionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    alternateName: place.name_mr || undefined,
    description: place.description || undefined,
    image: place.image_url ? `https://explore-pune-eosin.vercel.app${place.image_url}` : undefined,
    url: `https://explore-pune-eosin.vercel.app/places/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address || undefined,
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    geo:
      place.latitude && place.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: place.latitude,
            longitude: place.longitude,
          }
        : undefined,
    isAccessibleForFree: place.fee_status === 'free' || place.entry_fee === 0,
    priceRange: place.fee_status === 'free' || place.entry_fee === 0 ? 'Free' : `₹${place.entry_fee}`,
    currenciesAccepted: 'INR',
    publicAccess: true,
    touristType: ['Heritage', 'History', 'Culture', 'Tourism'],
  };

  const { places: pool } = await getCachedPlacesData();
  const relatedPlaces = getRelatedPlaces(place, pool, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
      <PlaceDetailClient place={place} relatedPlaces={relatedPlaces} />
    </>
  );
}
