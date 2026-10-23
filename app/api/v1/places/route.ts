import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get('category');
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    const qRef = query(collection(db, 'places'), where('status', '==', 'published'));
    const snap = await getDocs(qRef);

    let places = snap.docs.map((d) => {
      const data = d.data() as any;
      const catSlug = data.category_slug || (Array.isArray(data.place_categories) ? data.place_categories[0]?.slug : data.category) || 'heritage';
      const price = data.place_prices?.[0];
      const entryFee = price ? (price.is_free ? 0 : Number(price.amount)) : (data.entry_fee ?? 0);

      return {
        id: d.id,
        name: data.name || '',
        name_mr: data.name_mr || data.name || '',
        slug: data.slug || '',
        category_slug: catSlug,
        category_name: data.category_name || catSlug,
        category_name_mr: data.category_name_mr || catSlug,
        latitude: data.latitude || 18.5204,
        longitude: data.longitude || 73.8567,
        image_url: data.image_url || '/images/places/shaniwar-wada.jpg',
        entry_fee: entryFee,
        recommended_duration_minutes: data.recommended_duration_minutes || 45,
        popularity_score: data.popularity_score || 50,
      };
    });

    if (cat && cat !== 'all') {
      places = places.filter((p) => p.category_slug === cat);
    }

    if (q) {
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_mr.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    places.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));

    return NextResponse.json({ data: places }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: err?.message || 'Failed to load places' } },
      { status: 500 }
    );
  }
}
