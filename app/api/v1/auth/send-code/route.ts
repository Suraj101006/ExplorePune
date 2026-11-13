import { NextRequest, NextResponse } from 'next/server';
import { checkSendRateLimit, createAndStoreOtp } from '@/lib/authOtpService';
import { sendAuthVerificationCodeEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, lang = 'en', purpose = 'signin' } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check Rate Limit
    const rateCheck = checkSendRateLimit(trimmedEmail);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many code requests. Please wait ${rateCheck.retryAfterSeconds} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    // 2. Generate and store 6-digit verification code
    const code = createAndStoreOtp(trimmedEmail, purpose);

    // 3. Dispatch Email with Explore Pune branding
    const emailResult = await sendAuthVerificationCodeEmail({
      toEmail: trimmedEmail,
      code,
      userName: name,
      isMarathi: lang === 'mr',
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully to your email.',
      email: trimmedEmail,
      mode: emailResult.mode,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/auth/send-code:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch verification code. Please try again.' },
      { status: 500 }
    );
  }
}
