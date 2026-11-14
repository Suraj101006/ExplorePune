'use client';

import React from 'react';
import LocationAccuracyIndicator from './LocationAccuracyIndicator';
import { AccuracyEvaluation } from '@/lib/services/LocationAccuracyService';
import { LocationSource } from '@/lib/services/LocationService';

interface CurrentLocationMarkerProps {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  accuracyTier?: AccuracyEvaluation;
  heading?: number | null;
  speedKmh?: number | null;
  source?: LocationSource;
  address?: string;
  isMr?: boolean;
  onCenterClick?: () => void;
}

export default function CurrentLocationMarker({
  latitude,
  longitude,
  accuracyMeters = 15,
  accuracyTier,
  heading,
  speedKmh,
  source = 'gps',
  address,
  isMr = false,
  onCenterClick,
}: CurrentLocationMarkerProps) {
  const hasHeading = typeof heading === 'number' && !isNaN(heading);
  const hasSpeed = typeof speedKmh === 'number' && speedKmh > 0;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        @keyframes gpsPulseWave {
          0% {
            transform: scale(0.95);
            opacity: 0.75;
          }
          70% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>

      {/* Accuracy Radius Circle representation */}
      <div
        style={{
          position: 'absolute',
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          border: '1.5px solid rgba(59, 130, 246, 0.45)',
          animation: 'gpsPulseWave 2.4s ease-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Direction Heading Cone (if device in motion with compass/GNSS course) */}
      {hasHeading && (
        <div
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            top: -8,
            transform: `rotate(${heading}deg)`,
            transformOrigin: 'bottom center',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
            <polygon points="12,2 4,22 12,17 20,22" fill="rgba(37, 99, 235, 0.55)" />
          </svg>
        </div>
      )}

      {/* High-visibility Core Marker Pin */}
      <button
        type="button"
        onClick={onCenterClick}
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          border: '3px solid #ffffff',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.6), 0 0 0 1px rgba(0,0,0,0.1)',
          cursor: onCenterClick ? 'pointer' : 'default',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        aria-label={isMr ? 'तुमचे वर्तमान थेट स्थान' : 'Your current live location'}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
          }}
        />
      </button>

      {/* Floating Info Pill */}
      <div
        style={{
          marginTop: 6,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '4px 8px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#1e293b',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 3,
        }}
      >
        <span>{latitude.toFixed(5)}°, {longitude.toFixed(5)}°</span>
        <LocationAccuracyIndicator
          accuracyMeters={accuracyMeters}
          evaluation={accuracyTier}
          source={source}
          isMr={isMr}
          compact
        />
        {hasSpeed && (
          <span style={{ color: '#0369a1', fontSize: '0.68rem', fontWeight: 700 }}>
            {speedKmh} km/h
          </span>
        )}
      </div>
    </div>
  );
}
