import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isLimited } from '@/lib/rateLimit';
import { getLiveGoogleTransitRoute } from '@/lib/googleTransit';
import { calculateRoadDistanceKm } from '@/lib/userLocation';

const DirectionsSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  originName: z.string().max(120).optional(),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  destName: z.string().max(150).optional(),
  destAddress: z.string().max(250).optional(),
  travelMode: z.enum(['driving', 'transit', 'walking', 'bicycling']).default('driving'),
  lang: z.enum(['en', 'mr']).default('en').optional(),
});

/**
 * Format minutes into human-friendly duration text
 */
function formatDuration(minutes: number, isMr: boolean): string {
  if (minutes < 60) {
    return isMr ? `${minutes} मि.` : `${minutes} min`;
  }
  const hrs = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return isMr ? `${hrs} तास` : `${hrs} hr`;
  }
  return isMr ? `${hrs} तास ${remainingMins} मि.` : `${hrs} hr ${remainingMins} min`;
}

/**
 * Format meters into km string
 */
function formatDistance(km: number, isMr: boolean): string {
  return `${km.toFixed(1)} ${isMr ? 'किमी' : 'km'}`;
}

export async function POST(req: NextRequest) {
  // Rate limiting: 60 directions calculations per 15 minutes per IP
  if (isLimited(req, 'directions-route', 60, 900_000)) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many directions requests. Please try again in a few moments.',
        },
      },
      { status: 429, headers: { 'Retry-After': '120' } }
    );
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = DirectionsSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid coordinate or navigation parameters.',
          },
        },
        { status: 400 }
      );
    }

    const {
      originLat,
      originLng,
      originName,
      destLat,
      destLng,
      destName,
      travelMode,
      lang,
    } = parsed.data;

    const isMr = lang === 'mr';
    const targetName = destName || 'Pune Destination';

    const gmapsTravelMode =
      travelMode === 'transit'
        ? 'transit'
        : travelMode === 'walking'
        ? 'walking'
        : travelMode === 'bicycling'
        ? 'bicycling'
        : 'driving';

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat.toFixed(5)},${originLng.toFixed(5)}&destination=${destLat.toFixed(5)},${destLng.toFixed(5)}&travelmode=${gmapsTravelMode}`;
    const appleMapsUrl = `https://maps.apple.com/?saddr=${originLat.toFixed(5)},${originLng.toFixed(5)}&daddr=${destLat.toFixed(5)},${destLng.toFixed(5)}&dirflg=${travelMode === 'transit' ? 'r' : travelMode === 'walking' ? 'w' : travelMode === 'bicycling' ? 'c' : 'd'}`;

    // -------------------------------------------------------------------------
    // 1. PUBLIC TRANSIT ROUTING
    // -------------------------------------------------------------------------
    if (travelMode === 'transit') {
      const transitData = await getLiveGoogleTransitRoute({
        originLat,
        originLng,
        destLat,
        destLng,
        destPlace: {
          id: 'dest-point',
          name: targetName,
          latitude: destLat,
          longitude: destLng,
        },
        originName,
        isMr,
      });

      const roadKm = calculateRoadDistanceKm(originLat, originLng, destLat, destLng);

      const steps = (isMr ? transitData.stepsMr : transitData.stepsEn).map((st, i) => ({
        instruction: st,
        instructionMr: transitData.stepsMr[i],
        distanceText: '',
        durationText: '',
      }));

      return NextResponse.json({
        success: true,
        distanceKm: roadKm,
        durationMinutes: transitData.estimatedMinutes,
        durationText: formatDuration(transitData.estimatedMinutes, isMr),
        distanceText: formatDistance(roadKm, isMr),
        travelMode: 'transit',
        steps,
        summary: isMr ? transitData.summaryMr : transitData.summaryEn,
        gmapsUrl: transitData.googleMapsUrl || gmapsUrl,
        appleMapsUrl,
        trafficNote: isMr
          ? 'पीएमपीएमएल बसेस व पुणे मेट्रोच्या नियमित वेळापत्रकानुसार.'
          : 'Based on scheduled Pune Metro and PMPML bus services.',
        source: 'pune_transit_engine',
        geometryCoordinates: [
          [originLng, originLat],
          [destLng, destLat],
        ],
      });
    }

    // -------------------------------------------------------------------------
    // 2. DRIVING, WALKING & BICYCLING ROUTING VIA OSRM / ROAD ENGINE
    // -------------------------------------------------------------------------
    const osrmProfile =
      travelMode === 'walking'
        ? 'foot'
        : travelMode === 'bicycling'
        ? 'bike'
        : 'driving';

    let osrmResult: any = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${originLng.toFixed(5)},${originLat.toFixed(5)};${destLng.toFixed(5)},${destLat.toFixed(5)}?overview=full&geometries=geojson&steps=true&alternatives=true`;

      const osrmRes = await fetch(osrmUrl, {
        headers: { 'User-Agent': 'ExplorePune-Navigation/1.0' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (osrmRes.ok) {
        const data = await osrmRes.json();
        if (data.code === 'Ok' && Array.isArray(data.routes) && data.routes.length > 0) {
          osrmResult = data;
        }
      }
    } catch {
      // OSRM network timeout or fallback handled gracefully below
    }

    if (osrmResult && osrmResult.routes[0]) {
      const primaryRoute = osrmResult.routes[0];
      const distanceMeters = primaryRoute.distance || 0;
      const durationSeconds = primaryRoute.duration || 0;

      const distanceKm = Number((distanceMeters / 1000).toFixed(1));
      let durationMinutes = Math.max(2, Math.round(durationSeconds / 60));

      // For driving in urban Pune, OSRM free-flow speed is often high; adjust with realistic city traffic multiplier
      if (travelMode === 'driving' && distanceKm > 1) {
        durationMinutes = Math.max(durationMinutes, Math.round(distanceKm * 2.5) + 3);
      }

      const rawCoords: Array<[number, number]> = primaryRoute.geometry?.coordinates || [
        [originLng, originLat],
        [destLng, destLat],
      ];

      // Parse turn-by-turn steps
      const steps = (primaryRoute.legs?.[0]?.steps || []).map((step: any) => {
        const stepDistKm = (step.distance || 0) / 1000;
        const stepMins = Math.round((step.duration || 0) / 60);
        const name = step.name ? ` onto ${step.name}` : '';
        const nameMr = step.name ? ` (${step.name})` : '';

        let inst = step.maneuver?.type || 'Proceed';
        let instMr = 'पुढे चला';

        if (step.maneuver?.type === 'turn') {
          const mod = step.maneuver?.modifier || '';
          if (mod.includes('left')) {
            inst = `Turn left${name}`;
            instMr = `डावीकडे वळा${nameMr}`;
          } else if (mod.includes('right')) {
            inst = `Turn right${name}`;
            instMr = `उजवीकडे वळा${nameMr}`;
          }
        } else if (step.maneuver?.type === 'depart') {
          inst = `Head toward destination${name}`;
          instMr = `गंतव्यस्थानाकडे निघा${nameMr}`;
        } else if (step.maneuver?.type === 'arrive') {
          inst = `Arrive at ${targetName}`;
          instMr = `${targetName} येथे पोहोचलात`;
        }

        return {
          instruction: inst,
          instructionMr: instMr,
          distanceText:
            stepDistKm < 1
              ? `${Math.round(stepDistKm * 1000)} m`
              : `${stepDistKm.toFixed(1)} km`,
          durationText: stepMins > 0 ? `${stepMins} min` : '< 1 min',
          maneuver: step.maneuver?.type,
        };
      });

      // Alternative route (if OSRM provided one)
      let alternative: any = undefined;
      if (osrmResult.routes[1]) {
        const altRoute = osrmResult.routes[1];
        const altKm = Number(((altRoute.distance || 0) / 1000).toFixed(1));
        const altMins = Math.max(2, Math.round((altRoute.duration || 0) / 60));
        alternative = {
          distanceKm: altKm,
          durationMinutes: altMins,
          distanceText: formatDistance(altKm, isMr),
          durationText: formatDuration(altMins, isMr),
          summary: isMr ? 'पर्यायी मार्ग' : 'Alternative Route',
        };
      }

      return NextResponse.json({
        success: true,
        distanceKm,
        durationMinutes,
        durationText: formatDuration(durationMinutes, isMr),
        distanceText: formatDistance(distanceKm, isMr),
        travelMode,
        geometryCoordinates: rawCoords,
        steps: steps.length > 0 ? steps : undefined,
        summary: isMr
          ? `${formatDuration(durationMinutes, true)} · ${formatDistance(distanceKm, true)}`
          : `${formatDuration(durationMinutes, false)} · ${formatDistance(distanceKm, false)}`,
        alternative,
        gmapsUrl,
        appleMapsUrl,
        trafficNote: isMr
          ? 'अंदाजे वेळ सामान्य पुणे वाहतूक परिस्थितीवर आधारित आहे.'
          : 'Estimated travel time based on standard Pune traffic conditions.',
        source: 'osrm',
      });
    }

    // -------------------------------------------------------------------------
    // 3. ROBUST GEODESIC ROAD NETWORK FALLBACK
    // -------------------------------------------------------------------------
    const roadKm = calculateRoadDistanceKm(originLat, originLng, destLat, destLng);
    let speedKmh = 22; // Pune urban driving average
    if (travelMode === 'walking') speedKmh = 4.8;
    if (travelMode === 'bicycling') speedKmh = 13;

    const durationMinutes = Math.max(
      travelMode === 'walking' ? 5 : 3,
      Math.round((roadKm / speedKmh) * 60)
    );

    // Generate intermediate waypoints for smooth road curve preview
    const midLat = (originLat + destLat) / 2 + 0.003;
    const midLng = (originLng + destLng) / 2 + 0.002;

    const fallbackSteps = [
      {
        instruction: `Depart from ${originName || 'your location'}`,
        instructionMr: `${originName || 'तुमच्या स्थानावरून'} निघा`,
        distanceText: '0 km',
        durationText: '0 min',
      },
      {
        instruction: `Follow road route towards ${targetName} (${formatDistance(roadKm, false)})`,
        instructionMr: `${targetName} कडे जाणाऱ्या मुख्य रस्त्याने पुढे चला (${formatDistance(roadKm, true)})`,
        distanceText: formatDistance(roadKm, false),
        durationText: formatDuration(durationMinutes, false),
      },
      {
        instruction: `Arrive at destination: ${targetName}`,
        instructionMr: `गंतव्यस्थानी पोहोचा: ${targetName}`,
        distanceText: '0 km',
        durationText: '0 min',
      },
    ];

    return NextResponse.json({
      success: true,
      distanceKm: roadKm,
      durationMinutes,
      durationText: formatDuration(durationMinutes, isMr),
      distanceText: formatDistance(roadKm, isMr),
      travelMode,
      geometryCoordinates: [
        [originLng, originLat],
        [midLng, midLat],
        [destLng, destLat],
      ],
      steps: fallbackSteps,
      summary: isMr
        ? `${formatDuration(durationMinutes, true)} · ${formatDistance(roadKm, true)}`
        : `${formatDuration(durationMinutes, false)} · ${formatDistance(roadKm, false)}`,
      gmapsUrl,
      appleMapsUrl,
      trafficNote: isMr
        ? 'थेट नेव्हिगेशनसाठी खालील "नेव्हिगेशन सुरू करा" बटण वापरा.'
        : 'Estimated travel time. Tap "Start Navigation" below for live turn-by-turn guidance.',
      source: 'geodesic_road_model',
    });
  } catch (err: any) {
    console.error('Directions API error:', err?.message || err);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to calculate directions at this moment.',
        },
      },
      { status: 500 }
    );
  }
}
