import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/authOtpService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const result = verifyOtpCode(trimmedEmail, code);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.reason || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      email: trimmedEmail,
      authSecret: result.authSecret,
      name: name?.trim() || null,
      message: 'Verification code confirmed.',
    });
  } catch (err: any) {
    console.error('Error in /api/v1/auth/verify-code:', err);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
