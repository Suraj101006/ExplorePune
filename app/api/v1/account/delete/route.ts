import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// Deletes the signed-in user's auth account; their profile, reviews, blogs, visits and favorites cascade.
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, sk = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !sk) return NextResponse.json({ error: { code: 'NOT_CONFIGURED', message: 'Account deletion is not enabled on this server yet.' } }, { status: 501 });
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer /i, '');
  const { data } = token ? await supabase.auth.getUser(token) : { data: { user: null } };
  if (!data.user) return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } }, { status: 401 });
  const { error } = await createClient(url, sk, { auth: { persistSession: false } }).auth.admin.deleteUser(data.user.id);
  if (error) return NextResponse.json({ error: { code: 'DELETE_FAILED', message: 'Could not delete the account. Please try again.' } }, { status: 500 });
  return NextResponse.json({ data: { deleted: true } });
}
