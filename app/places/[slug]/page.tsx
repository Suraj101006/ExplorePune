import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import PlaceActions from '@/components/PlaceActions';
import Reviews from '@/components/Reviews';

const PlaceMap = dynamicImport(() => import('@/components/PlaceMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '280px',
        borderRadius: '12px',
        backgroundColor: '#f5f5f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#78716c',
        fontSize: '13px',
      }}
    >
      Loading Map...
    </div>
  ),
});

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from('places').select('name, description').eq('slug', slug).eq('status', 'published').maybeSingle();
  return data ? { title: data.name, description: data.description?.slice(0, 160) ?? `Visitor information for ${data.name}, Pune.` } : { title: 'Place not found' };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: place, error } = await supabase
    .from('places')
    .select(`
      id,
      name,
      name_mr,
      slug,
      description,
      address,
      latitude,
      longitude,
      data_tier,
      place_categories ( name, slug ),
      place_prices ( visitor_category, amount, is_free, currency )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !place) {
    notFound();
  }

  const tierBadgeStyle = {
    verified: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    enriched: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    listed: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  }[place.data_tier as 'verified' | 'enriched' | 'listed'] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };

  return (
    <main style={{ color: '#1c1917', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#1F4D3A', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', marginBottom: '24px', display: 'inline-block' }}>
          &larr; All places
        </Link>

        <header style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#B4512F', textTransform: 'uppercase' }}>
              {(place.place_categories as any)?.name || 'Attraction'}
            </span>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: tierBadgeStyle.bg, color: tierBadgeStyle.text, border: `1px solid ${tierBadgeStyle.border}`, textTransform: 'uppercase', fontWeight: 'bold' }}>
              {place.data_tier}
            </span>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#1c1917', margin: '4px 0' }}>{place.name}</h1>
          {place.name_mr && (
            <p style={{ fontSize: '16px', color: '#78716c', margin: '0 0 12px 0' }}>{place.name_mr}</p>
          )}

          <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '12px', marginTop: '12px', fontSize: '12px', color: '#78716c', display: 'flex', gap: '16px' }}>
            <span>Coordinates: {place.latitude?.toFixed(4)}, {place.longitude?.toFixed(4)}</span>
            {place.address && <span>Address: {place.address}</span>}
          </div>
        </header>

        <PlaceActions placeId={place.id} />

        {place.data_tier !== 'verified' && (
          <p className="note" style={{ marginBottom: '24px' }}>
            Opening hours and entry fees for this place haven’t been verified. Please check with the venue before you go. Location data © OpenStreetMap contributors.
          </p>
        )}

        <div className="stack" style={{ marginBottom: '24px' }}>
          <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #f5f5f4', paddingBottom: '8px', marginTop: 0 }}>
              About
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444' }}>
              {place.description || 'We don’t have a description for this place yet.'}
            </p>
          </section>

          <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #f5f5f4', paddingBottom: '8px', marginTop: 0 }}>
              Visitor Info
            </h2>
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#78716c', textTransform: 'uppercase', display: 'block' }}>Admission</span>
              <p style={{ fontSize: '14px', margin: '4px 0', color: '#1c1917' }}>
                {place.place_prices && place.place_prices.length > 0
                  ? place.place_prices.map((p: any) => `${p.visitor_category}: ${p.is_free ? 'Free' : `₹${p.amount}`}`).join(', ')
                  : 'Fees not yet verified'}
              </p>
            </div>
          </section>
        </div>

        <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e7e5e4' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #f5f5f4', paddingBottom: '8px', marginTop: 0, marginBottom: '16px' }}>
            Location & Map
          </h2>
          <PlaceMap
            latitude={place.latitude}
            longitude={place.longitude}
            name={place.name}
          />
        </section>
        <Reviews placeId={place.id} />
      </div>
    </main>
  );
}