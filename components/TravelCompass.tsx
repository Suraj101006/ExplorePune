'use client';

import React, { useMemo } from 'react';

interface TravelCompassProps {
  latitude?: number;
  longitude?: number;
  targetName?: string;
  isMarathi?: boolean;
  size?: number;
  showBearingText?: boolean;
}

// Pune Zero Mile Stone / Central Historic Reference (Budhwar Peth / Shaniwar Wada)
const PUNE_CENTER = { lat: 18.5196, lng: 73.8553 };

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = toDeg(Math.atan2(y, x));
  return Math.round((brng + 360) % 360);
}

function getCardinalDirection(bearing: number, isMr: boolean): string {
  const directionsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directionsMr = ['उत्तर', 'ईशान्य', 'पूर्व', 'आग्नेय', 'दक्षिण', 'नैऋत्य', 'पश्चिम', 'वायव्य'];
  const index = Math.round(bearing / 45) % 8;
  return isMr ? directionsMr[index] : directionsEn[index];
}

export default function TravelCompass({
  latitude,
  longitude,
  targetName = 'Destination',
  isMarathi = false,
  size = 40,
  showBearingText = true,
}: TravelCompassProps) {
  const bearing = useMemo(() => {
    if (!latitude || !longitude) return 0;
    return calculateBearing(PUNE_CENTER.lat, PUNE_CENTER.lng, latitude, longitude);
  }, [latitude, longitude]);

  const cardinal = useMemo(() => getCardinalDirection(bearing, isMarathi), [bearing, isMarathi]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
      }}
      title={`${targetName}: ${bearing}° ${cardinal} from Central Pune`}
    >
      <div
        className="travel-compass-container"
        style={{
          width: size,
          height: size,
          flexShrink: 0,
        }}
      >
        {/* Compass Dial Outer Ring */}
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }}>
          {/* North Tick */}
          <line x1="20" y1="2" x2="20" y2="5" stroke="#dc2626" strokeWidth="1.5" />
          <text x="20" y="10" textAnchor="middle" fontSize="6" fontWeight="800" fill="#dc2626" fontFamily="sans-serif">
            N
          </text>

          {/* East Tick */}
          <line x1="38" y1="20" x2="35" y2="20" stroke="#94a3b8" strokeWidth="1" />
          {/* South Tick */}
          <line x1="20" y1="38" x2="20" y2="35" stroke="#94a3b8" strokeWidth="1" />
          {/* West Tick */}
          <line x1="2" y1="20" x2="5" y2="20" stroke="#94a3b8" strokeWidth="1" />

          {/* Pivot Dot */}
          <circle cx="20" cy="20" r="2.5" fill="#0f172a" />
        </svg>

        {/* Dynamic Rotating Compass Needle */}
        <svg
          width={size * 0.75}
          height={size * 0.75}
          viewBox="0 0 30 30"
          className="travel-compass-needle"
          style={{
            transform: `rotate(${bearing}deg)`,
          }}
        >
          {/* Red North Pointer */}
          <polygon points="15,3 18,15 15,13" fill="#dc2626" />
          <polygon points="15,3 12,15 15,13" fill="#ef4444" />
          {/* Gunmetal South Pointer */}
          <polygon points="15,27 18,15 15,17" fill="#475569" />
          <polygon points="15,27 12,15 15,17" fill="#64748b" />
          {/* Center Pivot Pin */}
          <circle cx="15" cy="15" r="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
        </svg>
      </div>

      {showBearingText && (
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
            {cardinal} ({bearing}°)
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>
            {isMarathi ? 'मध्यवर्ती पुण्यातून' : 'From Pune Center'}
          </div>
        </div>
      )}
    </div>
  );
}
