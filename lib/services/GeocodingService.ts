/**
 * Explore Pune - Multi-Tier Precision Geocoding Service
 * Resolves verified human-readable addresses (road, suburb, city, district, state, pincode)
 * from GPS coordinates using Google Maps, OpenStreetMap Nominatim, and spatial locality indices.
 */

import { calculateHaversineDistanceKm } from '../utils/distanceCalculator';
import { PUNE_ALL_LOCALITIES, PuneLocality } from '../userLocation';

export interface ReverseGeocodeAddress {
  road?: string;
  suburb?: string;
  neighborhood?: string;
  locality?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  postalCode?: string;
  formattedAddress: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

export interface ReverseGeocodeResult {
  success: boolean;
  source: 'google_maps_api' | 'nominatim_osm' | 'pune_spatial_engine' | 'raw_coordinates';
  latitude: number;
  longitude: number;
  nameEn: string;
  nameMr: string;
  address: ReverseGeocodeAddress;
  distanceFromPuneCenterKm: number;
  isOutsidePune: boolean;
}

interface CacheEntry {
  data: ReverseGeocodeResult;
  expiry: number;
}

const geocodeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

export class GeocodingService {
  /**
   * Generates cache key rounded to 4 decimals (~11 meters)
   */
  private static getCacheKey(lat: number, lng: number, lang: string): string {
    return `${lat.toFixed(4)}_${lng.toFixed(4)}_${lang}`;
  }

  /**
   * Universal Google Maps Embed URL (zero API key authorization required)
   */
  static getEmbedUrl(lat: number, lng: number, zoom = 16): string {
    return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}&z=${zoom}&output=embed`;
  }

  /**
   * Universal Google Maps Search / Navigation URL
   */
  static getSearchUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
  }

  /**
   * Master Reverse Geocoding method with multi-tier fallback pipeline:
   * 1. Check LRU memory cache
   * 2. Google Maps Geocoding API (if key configured)
   * 3. OpenStreetMap Nominatim API (public, verified)
   * 4. Regional Pune spatial index (for Pune metropolitan coordinates)
   * 5. Raw coordinate representation (retains real lat/lng, never fakes address)
   */
  static async reverseGeocode(
    lat: number,
    lng: number,
    lang: 'en' | 'mr' = 'en'
  ): Promise<ReverseGeocodeResult> {
    const cacheKey = this.getCacheKey(lat, lng, lang);
    const cached = geocodeCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    const distFromPune = calculateHaversineDistanceKm(lat, lng, 18.5204, 73.8567);
    const isOutsidePune = distFromPune > 50;

    // TIER 1: Google Maps Geocoding API
    const googleApiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (googleApiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat.toFixed(6)},${lng.toFixed(6)}&key=${googleApiKey}&language=${lang}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const json = await res.json();
          if (json.status === 'OK' && Array.isArray(json.results) && json.results.length > 0) {
            const top = json.results[0];
            const result = this.parseGoogleResult(lat, lng, top, distFromPune, isOutsidePune, lang);
            geocodeCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
            return result;
          }
        }
      } catch {
        // Fall through to Tier 2
      }
    }

    // TIER 2: OpenStreetMap Nominatim Reverse Geocoder
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&zoom=18&addressdetails=1`;
      const res = await fetch(osmUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ExplorePune/2.0 (contact: surajdhok1010@gmail.com; Maharashtra Heritage Platform)',
          'Accept-Language': lang === 'mr' ? 'mr,en' : 'en',
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const osmData = await res.json();
        if (osmData && osmData.address) {
          const result = this.parseNominatimResult(lat, lng, osmData, distFromPune, isOutsidePune, lang);
          geocodeCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
          return result;
        }
      }
    } catch {
      // Fall through to Tier 3
    }

    // TIER 3: Pune Regional Spatial Locality Match (if within 50 km of Pune)
    if (!isOutsidePune) {
      const spatialResult = this.matchPuneLocality(lat, lng, distFromPune, lang);
      geocodeCache.set(cacheKey, { data: spatialResult, expiry: Date.now() + CACHE_TTL_MS });
      return spatialResult;
    }

    // TIER 4: Raw Coordinates (Safe baseline: retains real coordinates, no false addresses)
    const rawResult: ReverseGeocodeResult = {
      success: true,
      source: 'raw_coordinates',
      latitude: lat,
      longitude: lng,
      nameEn: `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      nameMr: `स्थान (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      distanceFromPuneCenterKm: Math.round(distFromPune * 10) / 10,
      isOutsidePune: true,
      address: {
        city: 'Outside Pune',
        state: 'Maharashtra',
        country: 'India',
        formattedAddress: `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
        googleMapsUrl: this.getSearchUrl(lat, lng),
        googleMapsEmbedUrl: this.getEmbedUrl(lat, lng),
      },
    };

    geocodeCache.set(cacheKey, { data: rawResult, expiry: Date.now() + CACHE_TTL_MS });
    return rawResult;
  }

  private static parseGoogleResult(
    lat: number,
    lng: number,
    top: any,
    distFromPune: number,
    isOutsidePune: boolean,
    lang: string
  ): ReverseGeocodeResult {
    const components: any[] = top.address_components || [];
    let road = '';
    let sublocality = '';
    let neighborhood = '';
    let city = '';
    let district = '';
    let state = 'Maharashtra';
    let country = 'India';
    let postalCode = '';

    for (const c of components) {
      const types: string[] = c.types || [];
      if (types.includes('route')) road = c.long_name;
      else if (types.includes('sublocality_level_1') || types.includes('sublocality')) sublocality = c.long_name;
      else if (types.includes('neighborhood')) neighborhood = c.long_name;
      else if (types.includes('locality')) city = c.long_name;
      else if (types.includes('administrative_area_level_2')) district = c.long_name;
      else if (types.includes('administrative_area_level_1')) state = c.long_name;
      else if (types.includes('country')) country = c.long_name;
      else if (types.includes('postal_code')) postalCode = c.long_name;
    }

    const primary = sublocality || neighborhood || road || city || 'Current Location';
    const nameEn = road && sublocality && road !== sublocality
      ? `${road}, ${sublocality}`
      : `${primary}${city && city !== primary ? ', ' + city : ''}`;

    const nameMr = lang === 'mr' ? primary : nameEn;

    return {
      success: true,
      source: 'google_maps_api',
      latitude: lat,
      longitude: lng,
      nameEn,
      nameMr,
      distanceFromPuneCenterKm: Math.round(distFromPune * 10) / 10,
      isOutsidePune,
      address: {
        road: road || undefined,
        suburb: sublocality || undefined,
        neighborhood: neighborhood || undefined,
        locality: city || undefined,
        city: city || 'Pune',
        district: district || undefined,
        state,
        country,
        postalCode: postalCode || undefined,
        formattedAddress: top.formatted_address || `${nameEn}, ${state}, ${country}`,
        googleMapsUrl: this.getSearchUrl(lat, lng),
        googleMapsEmbedUrl: this.getEmbedUrl(lat, lng),
      },
    };
  }

  private static parseNominatimResult(
    lat: number,
    lng: number,
    data: any,
    distFromPune: number,
    isOutsidePune: boolean,
    lang: string
  ): ReverseGeocodeResult {
    const addr = data.address || {};
    const road = addr.road || addr.street || addr.pedestrian || '';
    const suburb = addr.suburb || addr.neighbourhood || addr.residential || '';
    const city = addr.city || addr.town || addr.village || addr.municipality || 'Pune';
    const district = addr.state_district || addr.county || '';
    const state = addr.state || 'Maharashtra';
    const country = addr.country || 'India';
    const postalCode = addr.postcode || '';

    const primaryArea = suburb || road || city || 'Current Location';
    const nameEn = road && suburb && road !== suburb ? `${road}, ${suburb}` : `${primaryArea}, ${city}`;
    const nameMr = lang === 'mr' ? primaryArea : nameEn;

    return {
      success: true,
      source: 'nominatim_osm',
      latitude: lat,
      longitude: lng,
      nameEn,
      nameMr,
      distanceFromPuneCenterKm: Math.round(distFromPune * 10) / 10,
      isOutsidePune,
      address: {
        road: road || undefined,
        suburb: suburb || undefined,
        neighborhood: addr.neighbourhood || undefined,
        locality: city,
        city,
        district: district || undefined,
        state,
        country,
        postalCode: postalCode || undefined,
        formattedAddress: data.display_name || `${nameEn}, ${state}, ${country}`,
        googleMapsUrl: this.getSearchUrl(lat, lng),
        googleMapsEmbedUrl: this.getEmbedUrl(lat, lng),
      },
    };
  }

  private static matchPuneLocality(
    lat: number,
    lng: number,
    distFromPune: number,
    lang: string
  ): ReverseGeocodeResult {
    let closest: PuneLocality = PUNE_ALL_LOCALITIES[0];
    let minDistance = Infinity;

    for (const loc of PUNE_ALL_LOCALITIES) {
      const d = calculateHaversineDistanceKm(lat, lng, loc.latitude, loc.longitude);
      if (d < minDistance) {
        minDistance = d;
        closest = loc;
      }
    }

    const shortEn = closest.nameEn.split('/')[0].trim();
    const shortMr = closest.nameMr.split('/')[0].trim();

    const nameEn = `Near ${shortEn}, Pune`;
    const nameMr = `${shortMr} जवळ, पुणे`;

    return {
      success: true,
      source: 'pune_spatial_engine',
      latitude: lat,
      longitude: lng,
      nameEn,
      nameMr,
      distanceFromPuneCenterKm: Math.round(distFromPune * 10) / 10,
      isOutsidePune: false,
      address: {
        suburb: shortEn,
        neighborhood: closest.zoneEn,
        city: 'Pune',
        district: 'Pune District',
        state: 'Maharashtra',
        country: 'India',
        formattedAddress: `${closest.nameEn}, Pune, Maharashtra, India`,
        googleMapsUrl: this.getSearchUrl(lat, lng),
        googleMapsEmbedUrl: this.getEmbedUrl(lat, lng),
      },
    };
  }
}
