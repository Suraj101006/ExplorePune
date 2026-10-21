'use client';

import { useState } from 'react';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function PlaceMap({ latitude, longitude, name }: PlaceMapProps) {
  const lat = latitude || 18.5204;
  const lng = longitude || 73.8567;
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  const [copied, setCopied] = useState(false);

  // Google Maps Universal Embed:
  // Loads genuine Google Maps tiles, street labels, Pune landmarks, and pin without requiring paid API keys
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const googleMapEmbedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&maptype=${mapView}`
    : `https://maps.google.com/maps?q=${lat},${lng}&t=${mapView === 'satellite' ? 'k' : ''}&z=15&ie=UTF8&iwloc=&output=embed`;

  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+Pune&center=${lat},${lng}`;

  const handleCopyGps = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', minWidth: 0 }}>
      {/* Google Maps Container */}
      <div
        style={{
          width: '100%',
          height: 350,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          background: '#f8fafc',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Floating Google Maps Overlay Controls */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            pointerEvents: 'none',
          }}
        >
          {/* Brand Badge */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: 999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: '#1e293b',
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: 13 }}>🗺️</span>
            <span>Google Maps</span>
          </div>

          {/* View Toggle (Default vs Satellite) */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '2px',
              borderRadius: 999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              display: 'inline-flex',
              gap: 2,
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setMapView('roadmap')}
              style={{
                border: 'none',
                background: mapView === 'roadmap' ? '#065f46' : 'transparent',
                color: mapView === 'roadmap' ? '#ffffff' : '#475569',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => setMapView('satellite')}
              style={{
                border: 'none',
                background: mapView === 'satellite' ? '#065f46' : 'transparent',
                color: mapView === 'satellite' ? '#ffffff' : '#475569',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Real Google Maps Embed Iframe */}
        <iframe
          title={`Google Map of ${name}`}
          width="100%"
          height="100%"
          style={{ border: 0, width: '100%', height: '100%' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={googleMapEmbedUrl}
        />
      </div>

      {/* Map Action Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: 13,
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={handleCopyGps}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--muted)',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          title="Click to copy map coordinates"
        >
          📍 Coordinates: <strong style={{ color: 'var(--ink)' }}>{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</strong>
          <span style={{ fontSize: 11, color: '#059669', marginLeft: 4 }}>
            {copied ? '✓ Copied' : '📋'}
          </span>
        </button>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a
            href={gmapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              padding: '6px 14px',
              fontSize: 12,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span>🧭</span>
            <span>Directions on Google Maps ↗</span>
          </a>
          <a
            href={gmapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="chip"
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              textDecoration: 'none',
              background: '#f8fafc',
            }}
          >
            <span>🔍</span>
            <span>Search Nearby ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
