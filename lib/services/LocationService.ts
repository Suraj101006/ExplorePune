/**
 * Explore Pune - Professional Location & GNSS Service
 * Manages device GPS, network positioning, permission states, and continuous tracking.
 * Guarantees high-accuracy configuration (enableHighAccuracy: true, timeout: 20000, maximumAge: 0).
 */

import { LocationAccuracyService, AccuracyEvaluation } from './LocationAccuracyService';
import { GeocodingService, ReverseGeocodeResult } from './GeocodingService';
import { LocationPermissionService } from './LocationPermissionService';
import { calculateHaversineDistanceKm } from '../utils/distanceCalculator';

export type LocationSource = 'gps' | 'network' | 'ip' | 'manual' | 'default';

export interface LocationRecord {
  id: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  accuracyMeters: number;
  accuracyTier: AccuracyEvaluation;
  source: LocationSource;
  timestamp: number;
  speedKmh?: number | null;
  heading?: number | null;
  altitudeMeters?: number | null;
  nameEn: string;
  nameMr: string;
  isOutsidePune: boolean;
  distanceFromPuneKm: number;
  addressDetails: {
    road?: string;
    suburb?: string;
    neighborhood?: string;
    city: string;
    district?: string;
    state: string;
    country: string;
    postalCode?: string;
    formattedAddress: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
}

export interface LocationDetectionResult {
  success: boolean;
  location?: LocationRecord;
  error?: string;
  errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'INSECURE_CONTEXT' | 'UNSUPPORTED' | 'INVALID_COORDS';
  source?: LocationSource;
  evaluation?: AccuracyEvaluation;
}

const STORAGE_KEY = 'explore-pune-user-location';

export class LocationService {
  private static subscribers = new Set<(loc: LocationRecord) => void>();
  private static activeWatchId: number | null = null;
  private static lastValidLocation: LocationRecord | null = null;

  /**
   * Reads stored location from localStorage, if any.
   */
  static getStoredLocation(): LocationRecord | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && LocationAccuracyService.isValidCoordinate(parsed.latitude, parsed.longitude)) {
        return {
          ...parsed,
          lat: parsed.lat ?? parsed.latitude,
          lng: parsed.lng ?? parsed.longitude,
          accuracyTier: LocationAccuracyService.evaluate(parsed.accuracyMeters),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Persists location to localStorage and broadcasts change to all subscribers and window events.
   */
  static setStoredLocation(loc: LocationRecord): void {
    if (typeof window === 'undefined') return;
    try {
      this.lastValidLocation = loc;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      window.dispatchEvent(new CustomEvent('explore-pune-location-changed', { detail: loc }));
      this.subscribers.forEach((cb) => {
        try { cb(loc); } catch (err) { console.error('Location subscriber error:', err); }
      });
    } catch (e) {
      console.error('Failed to store location:', e);
    }
  }

  /**
   * Subscribes to live location updates. Returns an unsubscribe function.
   */
  static subscribe(callback: (loc: LocationRecord) => void): () => void {
    this.subscribers.add(callback);
    const current = this.lastValidLocation || this.getStoredLocation();
    if (current) {
      try { callback(current); } catch {}
    }
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Detects fresh device GPS position with standard high-accuracy configuration:
   * - enableHighAccuracy: true
   * - timeout: 20000 (20 seconds for satellite lock)
   * - maximumAge: 0 (fresh reading, zero cached coordinates)
   */
  static async detectFreshPosition(): Promise<LocationDetectionResult> {
    if (!LocationPermissionService.isSecureContext()) {
      return {
        success: false,
        errorCode: 'INSECURE_CONTEXT',
        error: 'Location access requires a secure connection (HTTPS).',
      };
    }

    if (!LocationPermissionService.isSupported()) {
      return {
        success: false,
        errorCode: 'UNSUPPORTED',
        error: 'Geolocation is not supported by your browser.',
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result = await this.processPosition(position);
          resolve(result);
        },
        async (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[LocationService] Geolocation error:', error.code, error.message);
          }
          let errorCode: LocationDetectionResult['errorCode'] = 'POSITION_UNAVAILABLE';
          if (error.code === error.PERMISSION_DENIED) errorCode = 'PERMISSION_DENIED';
          else if (error.code === error.TIMEOUT) errorCode = 'TIMEOUT';

          // Attempt secondary IP-based detection as distinct fallback
          const ipFallback = await this.detectIpFallback();
          if (ipFallback.success) {
            resolve({
              success: true,
              location: ipFallback.location,
              source: 'ip',
              evaluation: ipFallback.location?.accuracyTier,
            });
            return;
          }

          resolve({
            success: false,
            errorCode,
            error: LocationPermissionService.handlePositionError(error),
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Processes a raw GeolocationPosition into a verified LocationRecord.
   */
  static async processPosition(pos: GeolocationPosition): Promise<LocationDetectionResult> {
    const { latitude, longitude, accuracy, speed, heading, altitude } = pos.coords;

    if (!LocationAccuracyService.isValidCoordinate(latitude, longitude)) {
      return {
        success: false,
        errorCode: 'INVALID_COORDS',
        error: 'Device returned invalid coordinates.',
      };
    }

    // Determine source based on hardware accuracy
    // True GNSS satellites typically deliver <= 30m; cellular towers deliver > 30m
    const source: LocationSource = accuracy <= 30 ? 'gps' : 'network';
    const evaluation = LocationAccuracyService.evaluate(accuracy);

    // Development-only logging as required by Section 5 & 10
    if (process.env.NODE_ENV === 'development') {
      console.log('[LocationService] GPS Position Acquired:', {
        latitude,
        longitude,
        accuracy: `${accuracy}m`,
        source,
        timestamp: pos.timestamp,
      });
    }

    const distFromPune = calculateHaversineDistanceKm(latitude, longitude, 18.5204, 73.8567);
    const isOutsidePune = distFromPune > 50;

    // Check for impossible sudden jump
    if (this.lastValidLocation) {
      const isJump = LocationAccuracyService.isSuddenUnrealisticJump(
        { lat: this.lastValidLocation.lat, lng: this.lastValidLocation.lng, timestamp: this.lastValidLocation.timestamp },
        { lat: latitude, lng: longitude, timestamp: pos.timestamp }
      );
      if (isJump && accuracy > 100) {
        console.warn('[LocationService] Sudden unrealistic jump detected; rejecting coarse fix');
        return {
          success: false,
          errorCode: 'INVALID_COORDS',
          error: 'Unrealistic location shift detected from low-accuracy signal.',
        };
      }
    }

    const speedKmh = speed != null && speed > 0 ? Math.round(speed * 3.6 * 10) / 10 : null;
    const parsedHeading = heading != null && !isNaN(heading) ? Math.round(heading) : null;
    const parsedAltitude = altitude != null && !isNaN(altitude) ? Math.round(altitude) : null;

    // Reverse geocode to retrieve real address components
    let geocoded: ReverseGeocodeResult;
    try {
      geocoded = await GeocodingService.reverseGeocode(latitude, longitude);
    } catch {
      geocoded = {
        success: true,
        source: 'raw_coordinates',
        latitude,
        longitude,
        nameEn: `Location (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`,
        nameMr: `स्थान (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`,
        distanceFromPuneCenterKm: Math.round(distFromPune * 10) / 10,
        isOutsidePune,
        address: {
          city: isOutsidePune ? 'Outside Pune' : 'Pune',
          state: 'Maharashtra',
          country: 'India',
          formattedAddress: `${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E`,
          googleMapsUrl: GeocodingService.getSearchUrl(latitude, longitude),
          googleMapsEmbedUrl: GeocodingService.getEmbedUrl(latitude, longitude),
        },
      };
    }

    const loc: LocationRecord = {
      id: 'live-gps',
      latitude,
      longitude,
      lat: latitude,
      lng: longitude,
      accuracyMeters: Math.round(accuracy),
      accuracyTier: evaluation,
      source,
      timestamp: pos.timestamp || Date.now(),
      speedKmh,
      heading: parsedHeading,
      altitudeMeters: parsedAltitude,
      nameEn: geocoded.nameEn,
      nameMr: geocoded.nameMr,
      isOutsidePune,
      distanceFromPuneKm: Math.round(distFromPune * 10) / 10,
      addressDetails: geocoded.address,
    };

    this.setStoredLocation(loc);

    return {
      success: true,
      location: loc,
      source,
      evaluation,
    };
  }

  /**
   * Starts continuous real-time GPS tracking using navigator.geolocation.watchPosition().
   */
  static startContinuousTracking(onUpdate?: (loc: LocationRecord) => void): boolean {
    if (!LocationPermissionService.isSupported() || !LocationPermissionService.isSecureContext()) {
      return false;
    }

    this.stopContinuousTracking();

    if (onUpdate) {
      this.subscribers.add(onUpdate);
    }

    this.activeWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const result = await this.processPosition(pos);
        if (result.success && result.location) {
          // Subscribers are automatically notified by setStoredLocation
        }
      },
      (err) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[LocationService] watchPosition error:', err);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000, // Accept 5s recent fix during motion
      }
    );

    return true;
  }

  /**
   * Stops continuous GPS tracking and releases watcher resources.
   */
  static stopContinuousTracking(): void {
    if (typeof window !== 'undefined' && this.activeWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.activeWatchId);
      this.activeWatchId = null;
    }
  }

  /**
   * Fallback IP location provider (clearly marked as source: 'ip' and never disguised as GPS).
   */
  static async detectIpFallback(): Promise<LocationDetectionResult> {
    const endpoints = [
      {
        url: 'https://ipapi.co/json/',
        parse: (d: any) => ({
          lat: parseFloat(d.latitude),
          lng: parseFloat(d.longitude),
          city: d.city || 'Pune',
          region: d.region || 'Maharashtra',
          country: d.country_name || 'India',
        }),
      },
      {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        parse: (d: any) => ({
          lat: parseFloat(d.latitude),
          lng: parseFloat(d.longitude),
          city: d.city || 'Pune',
          region: d.region || 'Maharashtra',
          country: d.country || 'India',
        }),
      },
    ];

    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(ep.url, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const parsed = ep.parse(data);
          if (LocationAccuracyService.isValidCoordinate(parsed.lat, parsed.lng)) {
            const dist = calculateHaversineDistanceKm(parsed.lat, parsed.lng, 18.5204, 73.8567);
            const isOutside = dist > 50;

            const loc: LocationRecord = {
              id: 'ip-location',
              latitude: parsed.lat,
              longitude: parsed.lng,
              lat: parsed.lat,
              lng: parsed.lng,
              accuracyMeters: 5000,
              accuracyTier: LocationAccuracyService.evaluate(5000),
              source: 'ip',
              timestamp: Date.now(),
              nameEn: `Estimated Location (~${parsed.city})`,
              nameMr: `अंदाजे स्थान (~${parsed.city})`,
              isOutsidePune: isOutside,
              distanceFromPuneKm: Math.round(dist * 10) / 10,
              addressDetails: {
                city: parsed.city,
                state: parsed.region,
                country: parsed.country,
                formattedAddress: `${parsed.city}, ${parsed.region}, ${parsed.country}`,
                googleMapsUrl: GeocodingService.getSearchUrl(parsed.lat, parsed.lng),
                googleMapsEmbedUrl: GeocodingService.getEmbedUrl(parsed.lat, parsed.lng),
              },
            };

            this.setStoredLocation(loc);
            return { success: true, location: loc, source: 'ip' };
          }
        }
      } catch {
        // Try next
      }
    }

    return { success: false, error: 'Could not determine IP location.' };
  }
}
