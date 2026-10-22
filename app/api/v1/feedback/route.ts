import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebaseAdmin';
import { collection, addDoc } from 'firebase/firestore';
import { isLimited } from '@/lib/rateLimit';
import { sendFeedbackConfirmationEmail, sendFeedbackAdminNotificationEmail } from '@/lib/mail';
import fs from 'fs/promises';
import path from 'path';

const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  type: z.string().min(2).max(50),
  message: z.string().min(5).max(2000),
  email: z.string().email(),
  userName: z.string().max(100).optional(),
  userId: z.string().max(100).optional(),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

export async function POST(req: NextRequest) {
  // Rate limit feedback: 10 submissions per hour per IP
  if (isLimited(req, 'feedback', 10, 3600_000)) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many feedback submissions. Please try again in a little while.',
        },
      },
      { status: 429, headers: { 'Retry-After': '600' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = FeedbackSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
          },
        },
        { status: 400 }
      );
    }

    const { rating, type, message, email, userName, userId, lang } = parsed.data;
    const isMr = lang === 'mr';
    const cleanUserName = userName?.trim() || email.split('@')[0];

    // 1. Save feedback to Firestore 'feedbacks' collection
    let feedbackId = '';
    const feedbackPayload = {
      user_id: userId || 'anonymous',
      user_name: cleanUserName,
      user_email: email,
      rating,
      type,
      message: message.trim(),
      created_at: new Date().toISOString(),
      reviewed: false,
    };

    try {
      if (adminDb) {
        const docRef = await adminDb.collection('feedbacks').add(feedbackPayload);
        feedbackId = docRef.id;
      } else {
        const docRef = await addDoc(collection(db, 'feedbacks'), feedbackPayload);
        feedbackId = docRef.id;
      }
    } catch {
      try {
        const docRef = await addDoc(collection(db, 'feedbacks'), feedbackPayload);
        feedbackId = docRef.id;
      } catch (dbErr: any) {
        console.warn('Could not write feedback to Firestore directly, falling back:', dbErr?.message);
      }
    }

    // 1b. Persistent local backup so feedback is never lost
    try {
      const dataFilePath = path.join(process.cwd(), 'data', 'feedbacks.json');
      let existing: any[] = [];
      try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        existing = JSON.parse(fileContent);
      } catch {
        existing = [];
      }
      existing.push({
        id: feedbackId || `fb_${Date.now()}`,
        ...feedbackPayload,
      });
      await fs.writeFile(dataFilePath, JSON.stringify(existing, null, 2), 'utf-8');
    } catch (fsErr: any) {
      console.warn('Local feedback file write skipped:', fsErr?.message);
    }

    // 2. Also record in 'mail' collection if Firebase Trigger Email extension is configured
    try {
      const userMailPayload = {
        to: [email],
        message: {
          subject: isMr
            ? 'पुणे भ्रमंती अभिप्राय नोंदणीबद्दल मनःपूर्वक धन्यवाद! 🙏 | सुरज ढोक आणि साहिल जाधव'
            : 'Thank you for your valuable feedback on Explore Pune! 🙏 | Suraj Dhok & Sahil Jadhav',
          text: `Thank you for sharing your feedback with Explore Pune! - Suraj Dhok & Sahil Jadhav.\n\nRating: ${rating}/5\nCategory: ${type}\nMessage: "${message.trim()}"`,
        },
        created_at: new Date().toISOString(),
      };

      const adminEmail = process.env.ADMIN_FEEDBACK_EMAIL || 'explorepune232@gmail.com';
      const adminMailPayload = {
        to: [adminEmail],
        message: {
          subject: `[Explore Pune Feedback] ${cleanUserName} (${rating}★ - ${type})`,
          text: `New feedback from ${cleanUserName} (${email}):\nRating: ${rating}/5\nCategory: ${type}\n\n"${message.trim()}"`,
        },
        created_at: new Date().toISOString(),
      };

      if (adminDb) {
        await Promise.allSettled([
          adminDb.collection('mail').add(userMailPayload),
          adminDb.collection('mail').add(adminMailPayload),
        ]);
      } else {
        await Promise.allSettled([
          addDoc(collection(db, 'mail'), userMailPayload),
          addDoc(collection(db, 'mail'), adminMailPayload),
        ]);
      }
    } catch {
      // Non-blocking
    }

    // 3. Send automated confirmation email to the user (from Suraj Dhok and Sahil Jadhav)
    const userEmailResult = await sendFeedbackConfirmationEmail({
      toEmail: email,
      userName: cleanUserName,
      rating,
      type,
      message: message.trim(),
      isMarathi: isMr,
    });

    // 4. Send email notification to US (Admin team / Suraj & Sahil) with the feedback content!
    const adminEmailResult = await sendFeedbackAdminNotificationEmail({
      userEmail: email,
      userName: cleanUserName,
      userId,
      rating,
      type,
      message: message.trim(),
      feedbackId,
    });

    const politeSuccessMsg = isMr
      ? '🙏 आपले बहुमोल मत आणि अभिप्राय नोंदवल्याबद्दल मनःपूर्वक धन्यवाद! एक्सप्लोर पुणे अधिक समृद्ध करण्यासाठी आपल्या सूचनेचा आम्ही मनापासून आदर करतो.'
      : 'Thank you for sharing your valuable opinion! We truly appreciate your thoughtful feedback and support in making Explore Pune better for everyone.';

    return NextResponse.json({
      success: true,
      feedbackId,
      userEmailSent: userEmailResult.success,
      adminEmailSent: adminEmailResult.success,
      message: politeSuccessMsg,
    });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while submitting feedback. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
