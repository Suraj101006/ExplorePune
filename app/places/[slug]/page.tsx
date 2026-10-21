import { notFound } from 'next/navigation';
import PlaceDetailClient from '@/components/PlaceDetailClient';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
      const data = snap.docs[0].data();
      return {
        title: `${data.name_mr ? `${data.name_mr} (${data.name})` : data.name} | Explore Pune`,
        description:
          data.description?.slice(0, 160) ?? `Visitor information and guide for ${data.name}, Pune.`,
      };
    }
  } catch {}
  return { title: 'Place Not Found | Explore Pune' };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = SLUG_ALIASES[slug] || slug;

  let place: any = null;
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
      place = { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch {}

  if (!place) {
    notFound();
  }

  return <PlaceDetailClient place={place} />;
}
