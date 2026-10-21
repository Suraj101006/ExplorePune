import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    const snap = await getDocs(query(collection(db, 'place_categories'), limit(1)));
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      latencyMs,
      categoriesCount: snap.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check database query failure:', error?.message);
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
}