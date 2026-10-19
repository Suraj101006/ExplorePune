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
    // Log internal error on server without leaking details publicly (S6)
    console.error('Health check database query failure:', error.message);
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'disconnected',
        error: 'Database connection check failed.',
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