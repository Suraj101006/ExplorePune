import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isLimited } from '@/lib/rateLimit';
import { sendItineraryEmail } from '@/lib/mail';

const Schema = z.object({
  email: z.string().email(),
  userName: z.string().max(100).optional(),
  lang: z.enum(['en', 'mr']).default('en').optional(),
  itineraryData: z.object({
    userName: z.string().optional(),
    planTitle: z.string(),
    planTitleMr: z.string().optional(),
    planTheme: z.string().optional().default(''),
    planThemeMr: z.string().optional(),
    badge: z.string().optional().default('🗺️'),
    startLocationName: z.string(),
    startTime: z.string(),
    travelMode: z.string(),
    totalDurationMinutes: z.number(),
    bufferMinutes: z.number().optional().default(0),
    estimatedCost: z.number().optional().default(0),
    isMr: z.boolean().optional(),
    stops: z.array(
      z.object({
        index: z.number(),
        name: z.string(),
        nameMr: z.string().optional(),
        arrivalTime: z.string().optional(),
        departureTime: z.string().optional(),
        visitMinutes: z.number(),
        travelMinutes: z.number().optional().default(0),
        entryCost: z.number().nullable().optional(),
        transitSummary: z.string().optional(),
        transitStepByStep: z.array(z.string()).optional(),
        nearestMetro: z.string().optional(),
        nearestBus: z.string().optional(),
        ticketInfo: z.string().optional(),
      })
    ),
    warnings: z.array(z.string()).optional(),
  }),
});

export async function POST(req: NextRequest) {
  // Rate limit: 6 itinerary emails per hour per IP
  if (isLimited(req, 'itinerary-email', 6, 3600_000)) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many itinerary email requests. Please try again in a little while.',
        },
      },
      { status: 429, headers: { 'Retry-After': '600' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = Schema.safeParse(raw);
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

    const { email, userName, lang, itineraryData } = parsed.data;
    const isMr = lang === 'mr' || Boolean(itineraryData.isMr);
    const resolvedUserName = userName?.trim() || itineraryData.userName?.trim() || email.split('@')[0];

    const emailResult = await sendItineraryEmail({
      toEmail: email.trim(),
      userName: resolvedUserName,
      itineraryData: {
        ...itineraryData,
        userName: resolvedUserName,
        stops: itineraryData.stops.map((s) => ({
          ...s,
          entryCost: s.entryCost ?? null,
        })),
      },
      isMarathi: isMr,
    });

    if (!emailResult.success) {
      console.warn('Itinerary email dispatch failed:', emailResult.error || emailResult.reason);
      return NextResponse.json(
        {
          success: false,
          emailSent: false,
          mode: emailResult.mode,
          error: {
            code: 'EMAIL_SEND_FAILED',
            message: isMr
              ? `ईमेल पाठवण्यात अडचण आली (${emailResult.error || 'सर्व्हर टाइमआउट'}). आपण खालील बटणाने थेट PDF डाऊनलोड करू शकता किंवा Gmail मध्ये उघडू शकता.`
              : `Could not send email (${emailResult.error || 'Server timeout'}). You can download the PDF directly or open the itinerary in Gmail below.`,
          },
        },
        { status: 502 }
      );
    }

    const successMsg = isMr
      ? `✓ तुमचा सानुकूल सहल आराखडा आणि PDF फाईल ${email} वर पाठवण्यात आली आहे!`
      : `✓ Custom itinerary and PDF have been successfully sent to ${email}!`;

    return NextResponse.json({
      success: true,
      emailSent: true,
      mode: emailResult.mode,
      message: successMsg,
    });
  } catch (err: any) {
    console.error('Itinerary email error:', err);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while generating or dispatching the itinerary email.',
        },
      },
      { status: 500 }
    );
  }
}
