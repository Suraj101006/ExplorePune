import { NextResponse } from 'next/server';
import { isLimited } from '@/lib/rateLimit';
import { moderateCommunityContent, sanitizeUserText } from '@/lib/communityModeration';

export async function POST(req: Request) {
  // 1. Server-side Rate Limiting (Anti-Bot Protection)
  if (isLimited(req, 'community-moderate-api', 30, 60000)) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        outcome: 'blocked',
        category: 'spam_scam',
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const title = typeof body.title === 'string' ? sanitizeUserText(body.title) : '';
    const content = typeof body.content === 'string' ? sanitizeUserText(body.content) : '';

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Title or content required for moderation check.' },
        { status: 400 }
      );
    }

    // 2. Perform 3-Tier Moderation
    const result = moderateCommunityContent(title, content);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Moderation check failed.' },
      { status: 500 }
    );
  }
}
