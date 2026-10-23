import { NextRequest, NextResponse } from 'next/server';
import {
  getPmpmlLiveStops,
  searchPmpmlLiveStops,
  getPmpmlNearbyStops,
  getPmpmlLiveRoutes,
  getPmpmlRouteDetails,
  getPmpmlRouteSchedule,
} from '@/lib/pmpmlLiveService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'routes';

    switch (action) {
      case 'stops': {
        const query = searchParams.get('search');
        if (query) {
          const results = await searchPmpmlLiveStops(query, 25);
          return NextResponse.json({
            success: true,
            action: 'stops',
            count: results.length,
            stops: results,
          });
        }
        const allStops = await getPmpmlLiveStops();
        return NextResponse.json({
          success: true,
          action: 'stops',
          count: allStops.length,
          stops: allStops.slice(0, 50), // paginate first 50 by default
        });
      }

      case 'nearby': {
        const lat = parseFloat(searchParams.get('lat') || '');
        const lon = parseFloat(searchParams.get('lon') || searchParams.get('lng') || '');
        const maxDist = parseFloat(searchParams.get('radius') || '1.5');
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        if (isNaN(lat) || isNaN(lon)) {
          return NextResponse.json(
            { success: false, error: 'Valid "lat" and "lon" query parameters are required.' },
            { status: 400 }
          );
        }

        const nearby = await getPmpmlNearbyStops(lat, lon, maxDist, limit);
        return NextResponse.json({
          success: true,
          action: 'nearby',
          origin: { lat, lon },
          count: nearby.length,
          stops: nearby,
        });
      }

      case 'routes': {
        const search = searchParams.get('q') || searchParams.get('search') || undefined;
        const routes = await getPmpmlLiveRoutes(search);
        return NextResponse.json({
          success: true,
          action: 'routes',
          count: routes.length,
          routes: routes.slice(0, 100),
        });
      }

      case 'route_details': {
        const routeName = searchParams.get('route');
        if (!routeName) {
          return NextResponse.json(
            { success: false, error: 'Missing required "route" parameter (e.g. ?route=100ADOWN)' },
            { status: 400 }
          );
        }
        const details = await getPmpmlRouteDetails(routeName);
        return NextResponse.json({
          success: true,
          action: 'route_details',
          route: routeName,
          details,
        });
      }

      case 'schedule': {
        const routeName = searchParams.get('route');
        if (!routeName) {
          return NextResponse.json(
            { success: false, error: 'Missing required "route" parameter (e.g. ?route=100ADOWN)' },
            { status: 400 }
          );
        }
        const schedule = await getPmpmlRouteSchedule(routeName);
        return NextResponse.json({
          success: true,
          action: 'schedule',
          route: routeName,
          schedule,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported action "${action}". Supported: stops, nearby, routes, route_details, schedule`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[API /api/v1/pmpml Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal transit server error',
      },
      { status: 500 }
    );
  }
}
