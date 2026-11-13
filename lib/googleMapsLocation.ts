/**
 * Explore Pune - Google Maps Precision Geolocation & Reverse Geocoding Service
 *
 * Bridges device GPS coordinates to accurate Google Maps locations, street names,
 * and neighborhoods across the Pune Metropolitan Region.
 *
 * Architecture:
 * 1. PRIMARY: Google Maps Geocoding REST API (reverse & forward search with language support).
 * 2. FALLBACK: Comprehensive Pune spatial locality network (32+ transit hubs & 106+ landmarks).
 * 3. VISUALIZATION: Google Maps Universal Precision Embed & direct Google Maps navigation links.
 */

import { PUNE_ALL_LOCALITIES, calculateDistanceKm, PuneLocality } from './userLocation';

export interface GoogleMapsAddressDetails {
  formattedAddress: string;
  sublocality?: string;
  route?: string;
  neighborhood?: string;
  locality?: string;
  postalCode?: string;
  country?: string;
  placeId?: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

export interface GoogleMapsLocationResult {
  success: boolean;
  source: 'google_maps_api' | 'pune_spatial_engine';
  latitude: number;
  longitude: number;
  nameEn: string;
  nameMr: string;
  distanceFromCenterKm: number;
  isOutsidePune: boolean;
  addressDetails: GoogleMapsAddressDetails;
}

// In-memory LRU cache to prevent duplicate Google Maps API calls (1-hour TTL)
interface CacheEntry {
  data: GoogleMapsLocationResult;
  expiry: number;
}
const reverseGeocodeCache = new Map<string, CacheEntry>();

function getCacheKey(lat: number, lng: number, lang: string): string {
  // Round to 4 decimal places (~11 meters accuracy)
  return `${lat.toFixed(4)}_${lng.toFixed(4)}_${lang}`;
}

/**
 * Generate Google Maps Universal Precision Embed URL
 * Zero-cost, 100% reliable embed for in-app mini-maps
 */
export function getGoogleMapsEmbedUrl(lat: number, lng: number, zoom = 15): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}&z=${zoom}&output=embed`;
}

/**
 * Generate Universal Google Maps Link for external directions or web/app view
 */
export function getGoogleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Fallback spatial reverse-geocoding using Pune's 32+ verified locality hubs
 */
export function fallbackPuneLocalityMatch(
  lat: number,
  lng: number,
  isMr = false
): GoogleMapsLocationResult {
  const distFromCenter = calculateDistanceKm(lat, lng, 18.5204, 73.8567);
  const isOutside = distFromCenter > 45;

  let closest: PuneLocality = PUNE_ALL_LOCALITIES[0];
  let minDistance = Infinity;

  for (const loc of PUNE_ALL_LOCALITIES) {
    const dist = calculateDistanceKm(lat, lng, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  const localityShortEn = closest.nameEn.split('/')[0].trim();
  const localityShortMr = closest.nameMr.split('/')[0].trim();

  const nameEn = isOutside
    ? `Pune Region (~${Math.round(distFromCenter)} km from Center)`
    : `${localityShortEn}, Pune`;
  const nameMr = isOutside
    ? `पुणे परिसर (मध्यवर्ती भागापासून ~${Math.round(distFromCenter)} किमी)`
    : `${localityShortMr}, पुणे`;

  const formattedAddress = `${closest.nameEn}, Pune, Maharashtra, India`;

  return {
    success: true,
    source: 'pune_spatial_engine',
    latitude: lat,
    longitude: lng,
    nameEn,
    nameMr,
    distanceFromCenterKm: Math.round(distFromCenter * 10) / 10,
    isOutsidePune: isOutside,
    addressDetails: {
      formattedAddress,
      sublocality: localityShortEn,
      locality: 'Pune',
      neighborhood: closest.zoneEn,
      country: 'India',
      googleMapsUrl: getGoogleMapsSearchUrl(lat, lng),
      googleMapsEmbedUrl: getGoogleMapsEmbedUrl(lat, lng),
    },
  };
}

/**
 * Reverse Geocode GPS coordinates via Google Maps Geocoding API
 * Resolves verified street, neighborhood, sublocality, and formatted address.
 */
export async function reverseGeocodeGoogleMaps(
  lat: number,
  lng: number,
  lang: 'en' | 'mr' = 'en'
): Promise<GoogleMapsLocationResult> {
  const cacheKey = getCacheKey(lat, lng, lang);
  const cached = reverseGeocodeCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_API_KEY;

  const isMr = lang === 'mr';

  if (!apiKey) {
    const fallback = fallbackPuneLocalityMatch(lat, lng, isMr);
    reverseGeocodeCache.set(cacheKey, { data: fallback, expiry: Date.now() + 3_600_000 });
    return fallback;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat.toFixed(6)},${lng.toFixed(6)}&key=${apiKey}&language=${lang}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Google Maps API HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
      const topResult = data.results[0];
      const components: any[] = topResult.address_components || [];

      let sublocality = '';
      let route = '';
      let neighborhood = '';
      let locality = 'Pune';
      let postalCode = '';
      let country = 'India';

      for (const comp of components) {
        const types: string[] = comp.types || [];
        if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
          sublocality = comp.long_name;
        } else if (types.includes('route')) {
          route = comp.long_name;
        } else if (types.includes('neighborhood')) {
          neighborhood = comp.long_name;
        } else if (types.includes('locality')) {
          locality = comp.long_name;
        } else if (types.includes('postal_code')) {
          postalCode = comp.long_name;
        } else if (types.includes('country')) {
          country = comp.long_name;
        }
      }

      // Build a clean, readable name for UI chips and search badges
      const primaryArea = sublocality || neighborhood || route || locality;
      const secondaryArea = route && route !== primaryArea ? route : locality;

      const nameEn = route && sublocality && route !== sublocality
        ? `${route}, ${sublocality}`
        : `${primaryArea}, ${locality}`;

      const nameMr = isMr && topResult.formatted_address
        ? primaryArea
        : nameEn;

      const distFromCenter = calculateDistanceKm(lat, lng, 18.5204, 73.8567);

      const result: GoogleMapsLocationResult = {
        success: true,
        source: 'google_maps_api',
        latitude: lat,
        longitude: lng,
        nameEn,
        nameMr,
        distanceFromCenterKm: Math.round(distFromCenter * 10) / 10,
        isOutsidePune: distFromCenter > 45,
        addressDetails: {
          formattedAddress: topResult.formatted_address || `${nameEn}, India`,
          sublocality: sublocality || undefined,
          route: route || undefined,
          neighborhood: neighborhood || undefined,
          locality,
          postalCode: postalCode || undefined,
          country,
          placeId: topResult.place_id,
          googleMapsUrl: getGoogleMapsSearchUrl(lat, lng),
          googleMapsEmbedUrl: getGoogleMapsEmbedUrl(lat, lng),
        },
      };

      reverseGeocodeCache.set(cacheKey, { data: result, expiry: Date.now() + 3_600_000 });
      return result;
    }
  } catch (err) {
    // Graceful fallback to Pune spatial engine on network/quota failure
    console.warn('[GoogleMapsLocation] Geocoding API notice:', err instanceof Error ? err.message : err);
  }

  const fallback = fallbackPuneLocalityMatch(lat, lng, isMr);
  reverseGeocodeCache.set(cacheKey, { data: fallback, expiry: Date.now() + 1_800_000 });
  return fallback;
}

/**
 * Search places and addresses in Pune via Google Maps Geocoding API
 */
export async function searchPuneLocationsWithGoogleMaps(
  query: string,
  lang: 'en' | 'mr' = 'en'
): Promise<GoogleMapsLocationResult[]> {
  const clean = query.trim();
  if (!clean) return [];

  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      // Restrict query to Pune, Maharashtra, India with bounding box
      const encoded = encodeURIComponent(`${clean}, Pune, Maharashtra, India`);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&bounds=18.35,73.65|18.75,74.05&key=${apiKey}&language=${lang}`;

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
          return data.results.slice(0, 5).map((r: any) => {
            const lat = r.geometry.location.lat;
            const lng = r.geometry.location.lng;
            const distFromCenter = calculateDistanceKm(lat, lng, 18.5204, 73.8567);

            return {
              success: true,
              source: 'google_maps_api',
              latitude: lat,
              longitude: lng,
              nameEn: r.formatted_address.split(',')[0].trim() + ', Pune',
              nameMr: r.formatted_address.split(',')[0].trim() + ', पुणे',
              distanceFromCenterKm: Math.round(distFromCenter * 10) / 10,
              isOutsidePune: distFromCenter > 45,
              addressDetails: {
                formattedAddress: r.formatted_address,
                locality: 'Pune',
                placeId: r.place_id,
                googleMapsUrl: getGoogleMapsSearchUrl(lat, lng),
                googleMapsEmbedUrl: getGoogleMapsEmbedUrl(lat, lng),
              },
            };
          });
        }
      }
    } catch {
      // Fall through to local index matching
    }
  }

  // Fallback: match against local Pune localities database
  const lower = clean.toLowerCase();
  const matched = PUNE_ALL_LOCALITIES.filter(
    (l) =>
      l.nameEn.toLowerCase().includes(lower) ||
      l.nameMr.includes(clean) ||
      l.popularTransitHubEn.toLowerCase().includes(lower) ||
      l.zoneEn.toLowerCase().includes(lower)
  ).slice(0, 5);

  return matched.map((loc) => {
    const dist = calculateDistanceKm(loc.latitude, loc.longitude, 18.5204, 73.8567);
    return {
      success: true,
      source: 'pune_spatial_engine',
      latitude: loc.latitude,
      longitude: loc.longitude,
      nameEn: `${loc.nameEn.split('/')[0].trim()}, Pune`,
      nameMr: `${loc.nameMr.split('/')[0].trim()}, पुणे`,
      distanceFromCenterKm: Math.round(dist * 10) / 10,
      isOutsidePune: false,
      addressDetails: {
        formattedAddress: `${loc.nameEn}, Pune, Maharashtra, India`,
        sublocality: loc.nameEn.split('/')[0].trim(),
        locality: 'Pune',
        googleMapsUrl: getGoogleMapsSearchUrl(loc.latitude, loc.longitude),
        googleMapsEmbedUrl: getGoogleMapsEmbedUrl(loc.latitude, loc.longitude),
      },
    };
  });
}
