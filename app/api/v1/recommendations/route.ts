import { NextRequest, NextResponse } from 'next/server';
import {
  recommendDestinations,
  parseRecommendationQuery,
  PUNE_REFERENCE_HUBS,
  RecommendationCriteria,
} from '@/lib/recommendationEngine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const hub = searchParams.get('hub');
    const timeStr = searchParams.get('time');
    const budgetStr = searchParams.get('budget');
    const mode = searchParams.get('mode') as any;
    const cat = searchParams.get('cat');
    const lang = (searchParams.get('lang') || 'en') as 'en' | 'mr';

    let criteria: RecommendationCriteria;

    if (query) {
      criteria = parseRecommendationQuery(query);
      if (lang) criteria.lang = lang;
    } else {
      let startingLocation = undefined;
      if (hub && PUNE_REFERENCE_HUBS[hub.toLowerCase()]) {
        startingLocation = PUNE_REFERENCE_HUBS[hub.toLowerCase()];
      }

      criteria = {
        startingLocation,
        availableMinutes: timeStr ? parseInt(timeStr, 10) : 180,
        budgetInr: budgetStr !== null && budgetStr !== undefined ? parseInt(budgetStr, 10) : undefined,
        travelMode: mode || 'driving',
        interests: cat ? [cat] : ['heritage'],
        lang,
      };
    }

    const result = recommendDestinations(criteria);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error in /api/v1/recommendations GET:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to generate recommendations.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let criteria: RecommendationCriteria;

    if (body.query && typeof body.query === 'string') {
      criteria = parseRecommendationQuery(body.query, body.userLocation);
      if (body.lang) criteria.lang = body.lang;
    } else {
      criteria = {
        startingLocation: body.startingLocation,
        availableMinutes: body.availableMinutes,
        budgetInr: body.budgetInr,
        interests: body.interests,
        travelMode: body.travelMode,
        companionType: body.companionType,
        accessibilityRequired: body.accessibilityRequired,
        excludePlaceIds: body.excludePlaceIds,
        savedPlaceIds: body.savedPlaceIds,
        weatherCondition: body.weatherCondition,
        currentHourOfDay: body.currentHourOfDay,
        maxResults: body.maxResults,
        lang: body.lang,
      };
    }

    const result = recommendDestinations(criteria);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Error in /api/v1/recommendations POST:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process recommendation request.' },
      { status: 500 }
    );
  }
}
