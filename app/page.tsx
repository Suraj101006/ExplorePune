import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
const PAGE = 24;
const TIER: Record<string, string> = { verified: 'Verified', enriched: 'Details from public sources', listed: 'Hours and fees not verified' };

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; page?: string }> }) {
  const sp = await searchParams;
  const cat = (sp.cat ?? '').replace(/[^a-z0-9-]/gi, '');
  const term = (sp.q ?? '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 60);
  const pg = Math.max(1, parseInt(sp.page ?? '1') || 1);

  const { data: cats } = await supabase.from('place_categories').select('name, slug').order('sort_order').order('name');
  let q: any = supabase
    .from('places')
    .select(`id, name, name_mr, slug, data_tier, zone, place_categories${cat ? '!inner' : ''}(name, slug)`, { count: 'exact' })
    .eq('status', 'published');
  if (cat) q = q.eq('place_categories.slug', cat);
  if (term) q = q.or(`name.ilike.%${term}%,name_mr.ilike.%${term}%`);
  const { data, count, error } = await q.order('popularity_score', { ascending: false }).order('name').range((pg - 1) * PAGE, pg * PAGE - 1);
  const places = (data ?? []) as any[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));
  const href = (p: number) => `/?${new URLSearchParams({ ...(term && { q: term }), ...(cat && { cat }), page: String(p) })}`;

  return (
    <main>
      <section className="hero wrap">
        <div>
          <h1>Explore Pune</h1>
          <p className="lede">Forts, wadas, temples, lakes and viewpoints, each with a plain note on how much we have checked.</p>
          <form className="search" action="/" role="search">
            <input name="q" defaultValue={term} placeholder="Search a place, in English or मराठी" aria-label="Search places" />
            {cat && <input type="hidden" name="cat" value={cat} />}
            <button className="btn">Search</button>
          </form>
          <Link className="btn clay" href="/planner">Plan my trip</Link>
        </div>
        <div className="hero-deva" aria-hidden="true">पुणे</div>
      </section>

      <div className="wrap">
        <nav className="chips" aria-label="Categories">
          <Link className="chip" href="/" aria-current={!cat}>All</Link>
          {(cats ?? []).map((c) => <Link key={c.slug} className="chip" href={`/?cat=${c.slug}${term ? `&q=${encodeURIComponent(term)}` : ''}`} aria-current={cat === c.slug}>{c.name}</Link>)}
        </nav>

        {error && <p className="note err">We couldn’t load places right now. Please refresh in a minute.</p>}
        {!error && places.length === 0 && (
          <p className="note">No places match{term ? ` “${term}”` : ''}. <Link href="/">Clear filters</Link> or try a shorter name.</p>
        )}
        {!error && places.length > 0 && <p style={{ color: 'var(--muted)', margin: '0 0 12px' }}>{count} places</p>}

        <section className="grid">
          {places.map((p) => {
            const c = Array.isArray(p.place_categories) ? p.place_categories[0] : p.place_categories;
            return (
              <Link key={p.id} href={`/places/${p.slug}`} className="card">
                <span className="cat">{c?.name ?? 'Attraction'}{p.zone === 'day_trip' ? ', day trip' : ''}</span>
                <h2>{p.name}</h2>
                {p.name_mr && <p className="mr" lang="mr">{p.name_mr}</p>}
                <span className={`tier ${p.data_tier}`}>{TIER[p.data_tier] ?? p.data_tier}</span>
              </Link>
            );
          })}
        </section>

        {pages > 1 && (
          <nav className="pager" aria-label="Pages">
            {pg > 1 && <Link className="chip" href={href(pg - 1)}>Previous</Link>}
            <span style={{ padding: '8px 0' }}>Page {pg} of {pages}</span>
            {pg < pages && <Link className="chip" href={href(pg + 1)}>Next</Link>}
          </nav>
        )}
      </div>
    </main>
  );
}
