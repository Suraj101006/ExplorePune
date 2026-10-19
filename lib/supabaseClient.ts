import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_* must be referenced literally so Next can inline them at build time.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

// Placeholder values keep `next build` from crashing if env vars are missing; requests then fail gracefully.
export const supabase = createClient(url || 'http://localhost:54321', key || 'missing-key');
