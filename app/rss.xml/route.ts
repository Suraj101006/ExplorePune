import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL('/feed.xml', request.url);
  return NextResponse.redirect(url, { status: 308 });
}
