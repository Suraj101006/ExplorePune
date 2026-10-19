import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function promote() {
  console.log('1. Fetching categories map...');
  const { data: categories, error: catError } = await supabase
    .from('place_categories')
    .select('id, slug');

  if (catError || !categories) {
    throw new Error('Could not fetch categories: ' + catError?.message);
  }

  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.slug, c.id));

  console.log('2. Fetching pending records from staging...');
  const { data: stagedRows, error: stageError } = await supabase
    .from('place_import_staging')
    .select('*')
    .eq('status', 'pending')
    .limit(300);

  if (stageError) throw stageError;
  if (!stagedRows || stagedRows.length === 0) {
    console.log('No pending staged rows found.');
    return;
  }

  console.log(`Processing ${stagedRows.length} staged places...`);

  let promotedCount = 0;
  for (const row of stagedRows) {
    const categoryId = categoryMap.get(row.suggested_category) || categoryMap.get('attractions');
    const baseSlug = slugify(row.name);
    const uniqueSlug = `${baseSlug}-${row.source_id.replace(/[^a-zA-Z0-9]/g, '-')}`;

    const { data: insertedPlace, error: insertError } = await supabase
      .from('places')
      .upsert(
        {
          slug: uniqueSlug,
          name: row.name,
          name_mr: row.name_mr,
          category_id: categoryId,
          latitude: row.latitude,
          longitude: row.longitude,
          osm_id: row.source_id.startsWith('osm:') ? row.source_id : null,
          data_tier: 'listed',
          status: 'published',
          zone: 'city',
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (insertError) {
      console.error(`Failed to insert ${row.name}:`, insertError.message);
      continue;
    }

    await supabase
      .from('place_import_staging')
      .update({ status: 'approved', matched_place_id: insertedPlace.id })
      .eq('id', row.id);

    promotedCount++;
  }

  console.log(`Success! Promoted ${promotedCount} places to 'published' status.`);
}

promote().catch((err) => {
  console.error('Promotion failed:', err);
  process.exit(1);
});