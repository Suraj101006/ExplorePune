import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  
  // Verify Database Connection
  const { count, error } = await supabase
    .from('place_categories')
    .select('*', { count: 'exact', head: true });

  const latencyMs = Date.now() - startTime;

  if (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: 'healthy',
    database: 'connected',
    latencyMs,
    categoriesCount: count,
    timestamp: new Date().toISOString(),
  });
}