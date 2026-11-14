/**
 * Explore Pune - Intelligent Location Accuracy Service
 * Classifies GNSS / GPS accuracy into standard quality tiers, detects sudden location jumps,
 * and validates coordinate sanity.
 */

import { calculateHaversineDistanceKm } from '../utils/distanceCalculator';

export type AccuracyTier = 'excellent' | 'good' | 'moderate' | 'low' | 'poor';

export interface AccuracyEvaluation {
  tier: AccuracyTier;
  accuracyMeters: number;
  labelEn: string;
  labelMr: string;
  color: string;
  badgeBg: string;
  isHighPrecision: boolean;
  recommendRetry: boolean;
}

export class LocationAccuracyService {
  /**
   * Evaluates accuracy in meters into 5 standardized tiers:
   * - 0–15m:   Excellent (Hardware GPS lock)
   * - 16–30m:  Good (High-quality urban GNSS / Wi-Fi)
   * - 31–75m:  Moderate (Cellular + Wi-Fi assisted)
   * - 76–150m: Low (Coarse cellular positioning)
   * - > 150m:  Poor (Wide-area cell or IP-based approximation)
   */
  static evaluate(accuracyMeters: number | null | undefined): AccuracyEvaluation {
    const acc = typeof accuracyMeters === 'number' && !isNaN(accuracyMeters) && accuracyMeters >= 0
      ? Math.round(accuracyMeters)
      : 5000;

    if (acc <= 15) {
      return {
        tier: 'excellent',
        accuracyMeters: acc,
        labelEn: `Excellent (±${acc}m)`,
        labelMr: `उत्कृष्ट (±${acc} मी)`,
        color: '#10b981', // Emerald 500
        badgeBg: 'rgba(16, 185, 129, 0.12)',
        isHighPrecision: true,
        recommendRetry: false,
      };
    }

    if (acc <= 30) {
      return {
        tier: 'good',
        accuracyMeters: acc,
        labelEn: `Good (±${acc}m)`,
        labelMr: `चांगले (±${acc} मी)`,
        color: '#059669', // Emerald 600
        badgeBg: 'rgba(5, 150, 105, 0.12)',
        isHighPrecision: true,
        recommendRetry: false,
      };
    }

    if (acc <= 75) {
      return {
        tier: 'moderate',
        accuracyMeters: acc,
        labelEn: `Moderate (±${acc}m)`,
        labelMr: `मध्यम (±${acc} मी)`,
        color: '#f59e0b', // Amber 500
        badgeBg: 'rgba(245, 158, 11, 0.12)',
        isHighPrecision: false,
        recommendRetry: false,
      };
    }

    if (acc <= 150) {
      return {
        tier: 'low',
        accuracyMeters: acc,
        labelEn: `Low (±${acc}m)`,
        labelMr: `कमी अचूकता (±${acc} मी)`,
        color: '#ea580c', // Orange 600
        badgeBg: 'rgba(234, 88, 12, 0.12)',
        isHighPrecision: false,
        recommendRetry: true,
      };
    }

    return {
      tier: 'poor',
      accuracyMeters: acc,
      labelEn: `Coarse (±${acc > 1000 ? Math.round(acc / 1000) + 'km' : acc + 'm'})`,
      labelMr: `अंदाजे (±${acc > 1000 ? Math.round(acc / 1000) + ' किमी' : acc + ' मी'})`,
      color: '#dc2626', // Red 600
      badgeBg: 'rgba(220, 38, 38, 0.12)',
      isHighPrecision: false,
      recommendRetry: true,
    };
  }

  /**
   * Validates whether latitude and longitude numbers are mathematically valid coordinates.
   */
  static isValidCoordinate(lat: unknown, lng: unknown): boolean {
    if (typeof lat !== 'number' || typeof lng !== 'number') return false;
    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;
    // Discard exactly (0, 0) Null Island as invalid default GPS
    if (lat === 0 && lng === 0) return false;
    return true;
  }

  /**
   * Detects sudden impossible location jumps (e.g. teleporting > 100 km in 5 seconds).
   * Returns true if the jump exceeds physical velocity limits (default: 250 km/h).
   */
  static isSuddenUnrealisticJump(
    prev: { lat: number; lng: number; timestamp: number },
    curr: { lat: number; lng: number; timestamp: number },
    maxVelocityKmh = 250
  ): boolean {
    const elapsedSeconds = Math.max(1, (curr.timestamp - prev.timestamp) / 1000);
    const distanceKm = calculateHaversineDistanceKm(prev.lat, prev.lng, curr.lat, curr.lng);
    const speedKmh = (distanceKm / elapsedSeconds) * 3600;

    return speedKmh > maxVelocityKmh && distanceKm > 1.0;
  }
}
