import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OVERPASS_QUERY = `
[out:json][timeout:180];
(
  nwr["tourism"~"^(attraction|museum|gallery|viewpoint|zoo|theme_park|aquarium)$"](18.35,73.65,18.75,74.05);
  nwr["historic"~"^(castle|fort|monument|memorial|archaeological_site|ruins)$"](18.35,73.65,18.75,74.05);
  nwr["leisure"~"^(park|garden|nature_reserve)$"]["name"](18.35,73.65,18.75,74.05);
  nwr["amenity"="place_of_worship"]["name"]["wikidata"](18.35,73.65,18.75,74.05);
);
out center tags;
`;

function mapCategory(tags: Record<string, string>): string {
  if (tags.historic === 'castle' || /fort/i.test(tags.name || '')) return 'forts';
  if (tags.historic) return 'heritage';
  if (tags.tourism === 'museum' || tags.tourism === 'gallery') return 'museums';
  if (tags.amenity === 'place_of_worship') return 'temples';
  if (tags.leisure) return 'parks';
  if (tags.natural === 'peak' || tags.tourism === 'viewpoint') return 'nature';
  return 'attractions';
}

async function run() {
  console.log('1. Querying OpenStreetMap via Overpass API...');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
    headers: { 'User-Agent': 'ExplorePune-Pipeline/2.0 (student-academic-build)' },
  });

  if (!res.ok) {
    throw new Error(`Overpass fetch failed with HTTP status ${res.status}`);
  }

  const json = await res.json();
  const rawPath = path.join(process.cwd(), 'data', 'raw', 'osm-pune-core.json');
  fs.mkdirSync(path.dirname(rawPath), { recursive: true });
  fs.writeFileSync(rawPath, JSON.stringify(json, null, 2));
  console.log(`Saved raw JSON cache to: ${rawPath}`);

  console.log('2. Recording import run...');
  const { data: runRecord, error: runError } = await supabase
    .from('import_runs')
    .insert({ source: 'overpass', area_label: 'pune-core' })
    .select()
    .single();

  if (runError) throw runError;

  const validElements = json.elements.filter((el: any) => el.tags && el.tags.name);
  const stagingRows = validElements.map((el: any) => ({
    run_id: runRecord.id,
    source: 'osm',
    source_id: `osm:${el.type}/${el.id}`,
    name: el.tags.name,
    name_mr: el.tags['name:mr'] ?? null,
    latitude: el.lat ?? el.center?.lat,
    longitude: el.lon ?? el.center?.lon,
    suggested_category: mapCategory(el.tags),
    raw_tags: el.tags,
    status: 'pending',
  })).filter((row: any) => row.latitude && row.longitude);

  console.log(`3. Upserting ${stagingRows.length} elements into place_import_staging...`);
  const CHUNK_SIZE = 200;
  for (let i = 0; i < stagingRows.length; i += CHUNK_SIZE) {
    const chunk = stagingRows.slice(i, i + CHUNK_SIZE);
    const { error: upsertErr } = await supabase
      .from('place_import_staging')
      .upsert(chunk, { onConflict: 'source,source_id' });
    if (upsertErr) throw upsertErr;
  }

  await supabase
    .from('import_runs')
    .update({
      finished_at: new Date().toISOString(),
      records_fetched: json.elements.length,
      records_new: stagingRows.length,
    })
    .eq('id', runRecord.id);

  console.log(`Done! Staged ${stagingRows.length} raw records for review.`);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});