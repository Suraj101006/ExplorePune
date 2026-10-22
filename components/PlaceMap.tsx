'use client';

import { useState } from 'react';
import { detectBrowserGps } from '@/lib/userLocation';
import { calculateDistanceKm } from '@/lib/publicTransit';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function PlaceMap({ latitude, longitude, name }: PlaceMapProps) {
  const lat = latitude || 18.5204;
  const lng = longitude || 73.8567;
  const [mapEngine, setMapEngine] = useState<'google' | 'osm'>('google');
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  const [copied, setCopied] = useState(false);

  // Live GPS measurement
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsDistance, setGpsDistance] = useState<{
    km: number;
    accuracy: number;
    userLat: number;
    userLng: number;
  } | null>(null);
  const [gpsError, setGpsError] = useState('');

  // 1. Google Maps Universal Precision Embed
  // Using exact lat,lng coordinates + name pin marker with zoom 16 (100% free, zero authorization errors)
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent(name + ' Pune')})&t=${mapView === 'satellite' ? 'k' : ''}&z=16&ie=UTF8&iwloc=B&output=embed`;

  // 2. OpenStreetMap Precision Marker Embed (100% free, guaranteed pin on landmark)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.006).toFixed(5)}%2C${(lat - 0.004).toFixed(5)}%2C${(lng + 0.006).toFixed(5)}%2C${(lat + 0.004).toFixed(5)}&layer=mapnik&marker=${lat.toFixed(5)}%2C${lng.toFixed(5)}`;

  const currentEmbedUrl = mapEngine === 'osm' ? osmEmbedUrl : googleMapEmbedUrl;

  const gmapsDirectionsUrl = gpsDistance
    ? `https://www.google.com/maps/dir/?api=1&origin=${gpsDistance.userLat.toFixed(5)},${gpsDistance.userLng.toFixed(5)}&destination=${lat.toFixed(5)},${lng.toFixed(5)}&travelmode=transit`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(5)},${lng.toFixed(5)}`;

  const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+Pune&center=${lat.toFixed(5)},${lng.toFixed(5)}`;
  const osmFullUrl = `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=17/${lat.toFixed(5)}/${lng.toFixed(5)}`;

  const handleCopyGps = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetGpsDistance = async () => {
    setLocatingGps(true);
    setGpsError('');
    try {
      const result = await detectBrowserGps();
      if (result.success && result.location) {
        const d = calculateDistanceKm(result.location.lat, result.location.lng, lat, lng);
        setGpsDistance({
          km: Math.round(d * 10) / 10,
          accuracy: result.accuracyMeters || 10,
          userLat: result.location.lat,
          userLng: result.location.lng,
        });
      } else {
        setGpsError(result.error || 'Could not acquire GPS position.');
      }
    } catch {
      setGpsError('Failed to access device GPS sensor.');
    } finally {
      setLocatingGps(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', minWidth: 0 }}>
      {/* Map Display Card */}
      <div
        style={{
          width: '100%',
          height: 380,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          background: '#f8fafc',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Floating Controls Overlay */}
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
          {/* Map Engine Toggle */}
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
              onClick={() => setMapEngine('google')}
              style={{
                border: 'none',
                background: mapEngine === 'google' ? '#1e293b' : 'transparent',
                color: mapEngine === 'google' ? '#ffffff' : '#475569',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🗺️ Google Maps
            </button>
            <button
              type="button"
              onClick={() => setMapEngine('osm')}
              style={{
                border: 'none',
                background: mapEngine === 'osm' ? '#059669' : 'transparent',
                color: mapEngine === 'osm' ? '#ffffff' : '#475569',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📍 OpenStreetMap
            </button>
          </div>

          {/* Satellite view toggle (when Google Maps is active) */}
          {mapEngine === 'google' && (
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
          )}
        </div>

        {/* Map Embed Iframe */}
        <iframe
          key={`${mapEngine}-${mapView}`}
          title={`Map of ${name}`}
          width="100%"
          height="100%"
          style={{ border: 0, width: '100%', height: '100%' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={currentEmbedUrl}
        />
      </div>

      {/* Live Device GPS Proximity Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          background: gpsDistance ? '#ecfdf5' : '#f8fafc',
          border: gpsDistance ? '1px solid #10b981' : '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '8px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span>🎯</span>
          {gpsDistance ? (
            <span style={{ color: '#065f46', fontWeight: 600 }}>
              You are <strong>{gpsDistance.km} km</strong> away from {name} (GPS ±{gpsDistance.accuracy}m)
            </span>
          ) : (
            <span style={{ color: '#475569' }}>
              Want to see how far you are right now?
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleGetGpsDistance}
          disabled={locatingGps}
          className="btn outline"
          style={{
            padding: '4px 12px',
            fontSize: 12,
            borderRadius: 999,
            background: '#ffffff',
            borderColor: '#059669',
            color: '#065f46',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {locatingGps ? '⏳ Acquiring GPS…' : '📍 Measure From My GPS'}
        </button>
      </div>

      {gpsError && (
        <div
          style={{
            fontSize: 12,
            color: '#dc2626',
            background: '#fef2f2',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #fecaca',
          }}
        >
          ⚠️ {gpsError}
        </div>
      )}

      {/* Map Action Links & Precise Coordinates */}
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
          title="Click to copy exact GPS coordinates"
        >
          📍 Precise GPS: <strong style={{ color: 'var(--ink)' }}>{lat.toFixed(5)}° N, {lng.toFixed(5)}° E</strong>
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
            href={osmFullUrl}
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
            <span>🗺️</span>
            <span>OpenStreetMap Pin ↗</span>
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
