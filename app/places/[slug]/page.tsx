import { notFound } from 'next/navigation';
import PlaceDetailClient from '@/components/PlaceDetailClient';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

export const dynamic = 'force-dynamic';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (place) {
    const title = place.name_mr ? `${place.name_mr} (${place.name})` : place.name;
    const description =
      place.description?.slice(0, 160) ??
      `Visitor timings, ticket entry fee, historical significance, and travel guide for ${place.name}, Pune.`;
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
            alt: place.name,
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
      <PlaceDetailClient place={place} />
    </>
  );
}
