'use client';

import React, { useState, useEffect } from 'react';
import { useUserLocation } from '@/lib/hooks/useUserLocation';
import { LocationService, LocationRecord } from '@/lib/services/LocationService';
import LocationAccuracyIndicator from './LocationAccuracyIndicator';
import { calculateHaversineDistanceKm } from '@/lib/utils/distanceCalculator';

export default function GpsDiagnosticsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'geocoding' | 'simulate'>('telemetry');
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    location,
    status,
    isLocating,
    isTracking,
    error,
    errorCode,
    accuracyTier,
    permission,
    detectLocation,
    startTracking,
    stopTracking,
    refreshPermission,
  } = useUserLocation();

  // Auto-open if query parameter ?gps_debug=true or #gps_debug is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('gps_debug') === 'true' || window.location.hash === '#gps_debug') {
        setIsOpen(true);
      }
    }
  }, []);

  const handleCopyCoords = () => {
    if (location && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSimulate = (lat: number, lng: number, name: string, accuracy: number, source: any) => {
    const distFromPune = calculateHaversineDistanceKm(lat, lng, 18.5204, 73.8567);
    const mockLoc: LocationRecord = {
      id: 'simulated-debug',
      latitude: lat,
      longitude: lng,
      lat,
      lng,
      accuracyMeters: accuracy,
      accuracyTier: {
        tier: accuracy <= 15 ? 'excellent' : accuracy <= 30 ? 'good' : 'moderate',
        accuracyMeters: accuracy,
        labelEn: `Simulated (±${accuracy}m)`,
        labelMr: `सिम्युलेटेड (±${accuracy} मी)`,
        color: accuracy <= 30 ? '#10b981' : '#f59e0b',
        badgeBg: 'rgba(16, 185, 129, 0.12)',
        isHighPrecision: accuracy <= 30,
        recommendRetry: false,
      },
      source,
      timestamp: Date.now(),
      nameEn: name,
      nameMr: name,
      isOutsidePune: distFromPune > 50,
      distanceFromPuneKm: Math.round(distFromPune * 10) / 10,
      addressDetails: {
        city: distFromPune > 50 ? 'Maharashtra' : 'Pune',
        state: 'Maharashtra',
        country: 'India',
        formattedAddress: `${name}, Maharashtra, India`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        googleMapsEmbedUrl: `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
      },
    };
    LocationService.setStoredLocation(mockLoc);
  };

  const formatFixAge = (timestamp?: number) => {
    if (!timestamp) return 'No fix yet';
    const sec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (sec < 5) return 'Just now (< 5s)';
    if (sec < 60) return `${sec}s ago`;
    const mins = Math.floor(sec / 60);
    return `${mins}m ${sec % 60}s ago`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            refreshPermission();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 999,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Open GPS & Location Diagnostics Panel"
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: location ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 8px ${location ? '#10b981' : '#f59e0b'}`,
            }}
          />
          <span>GPS Diagnostics</span>
        </button>
      )}

      {/* Expanded Diagnostics Panel Modal / Drawer */}
      {isOpen && (
        <div
          style={{
            width: 360,
            maxHeight: '85vh',
            backgroundColor: '#ffffff',
            borderRadius: 14,
            boxShadow: '0 12px 32px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: location ? '#10b981' : '#f59e0b',
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                GPS Telemetry & Diagnostics
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
              }}
              aria-label="Close GPS Diagnostics"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              padding: '2px 4px',
            }}
          >
            {(['telemetry', 'geocoding', 'simulate'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: '0.74rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#0f172a' : '#64748b',
                  backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  margin: '2px',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div style={{ padding: 14, overflowY: 'auto', flex: 1, fontSize: '0.78rem' }}>
            {activeTab === 'telemetry' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Accuracy Status Banner */}
                {location ? (
                  <LocationAccuracyIndicator
                    accuracyMeters={location.accuracyMeters}
                    evaluation={accuracyTier}
                    source={location.source}
                    onRefresh={detectLocation}
                    isRefreshing={isLocating}
                    showAdvice
                  />
                ) : (
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      textAlign: 'center',
                    }}
                  >
                    No position fix recorded yet. Tap "Detect Fresh GPS".
                  </div>
                )}

                {/* Coordinate Details Table */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '8px 10px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Latitude</span>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                      {location ? location.lat.toFixed(6) : '—'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Longitude</span>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                      {location ? location.lng.toFixed(6) : '—'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Source Mode</span>
                    <div style={{ fontWeight: 600, color: '#334155', textTransform: 'uppercase' }}>
                      {location ? location.source : '—'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Fix Age</span>
                    <div style={{ fontWeight: 600, color: '#334155' }}>
                      {formatFixAge(location?.timestamp)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Speed / Heading</span>
                    <div style={{ fontWeight: 600, color: '#334155' }}>
                      {location?.speedKmh ? `${location.speedKmh} km/h` : '0 km/h'}
                      {location?.heading ? ` @ ${location.heading}°` : ''}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Distance from Pune</span>
                    <div style={{ fontWeight: 600, color: '#334155' }}>
                      {location ? `${location.distanceFromPuneKm} km` : '—'}
                    </div>
                  </div>
                </div>

                {/* Permission Status */}
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: '#f1f5f9',
                    fontSize: '0.72rem',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Permission: <strong>{permission?.state || 'checking...'}</strong></span>
                  <button
                    type="button"
                    onClick={refreshPermission}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Check
                  </button>
                </div>

                {/* Error Banner if any */}
                {error && (
                  <div
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: '#fee2e2',
                      border: '1px solid #f87171',
                      color: '#991b1b',
                      fontSize: '0.73rem',
                    }}
                  >
                    <strong>Error ({errorCode || 'FAIL'}):</strong> {error}
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: isLocating ? 'wait' : 'pointer',
                      opacity: isLocating ? 0.7 : 1,
                    }}
                  >
                    {isLocating ? 'Acquiring GPS...' : '📡 Detect Fresh GPS'}
                  </button>
                  <button
                    type="button"
                    onClick={isTracking ? stopTracking : () => startTracking()}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: isTracking ? '#dc2626' : '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {isTracking ? '⏹ Stop Tracking' : '▶ Continuous Tracking'}
                  </button>
                </div>

                {location && (
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: '0.73rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copySuccess ? '✓ Copied to clipboard!' : '📋 Copy Latitude, Longitude'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'geocoding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  Reverse Geocoded Address
                </span>
                {location ? (
                  <div
                    style={{
                      padding: 10,
                      backgroundColor: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Formatted Address</span>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {location.addressDetails?.formattedAddress || location.nameEn}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Suburb / Area</span>
                        <div style={{ fontWeight: 600 }}>{location.addressDetails?.suburb || '—'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>City</span>
                        <div style={{ fontWeight: 600 }}>{location.addressDetails?.city || '—'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>State</span>
                        <div style={{ fontWeight: 600 }}>{location.addressDetails?.state || 'Maharashtra'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Pincode</span>
                        <div style={{ fontWeight: 600 }}>{location.addressDetails?.postalCode || '—'}</div>
                      </div>
                    </div>
                    {location.addressDetails?.googleMapsUrl && (
                      <a
                        href={location.addressDetails.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: 4,
                          color: '#2563eb',
                          textDecoration: 'underline',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        ↗ Open in Google Maps
                      </a>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#64748b' }}>No location acquired yet.</div>
                )}
              </div>
            )}

            {activeTab === 'simulate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  QA Simulation Coordinates
                </span>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem' }}>
                  Inject precise coordinates directly into LocationService to test UI behavior without waiting for physical movement.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => handleSimulate(18.5196, 73.8553, 'Shaniwar Wada (Central)', 10, 'gps')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>Shaniwar Wada (Central Pune)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>18.5196° N, 73.8553° E • ±10m GPS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulate(18.5913, 73.7389, 'Hinjawadi Phase 1 (IT Park)', 15, 'gps')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>Hinjawadi Phase 1 (IT Park)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>18.5913° N, 73.7389° E • ±15m GPS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulate(18.5679, 73.9143, 'Viman Nagar / Airport', 25, 'network')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>Viman Nagar (Airport Road)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>18.5679° N, 73.9143° E • ±25m Network</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulate(18.7500, 73.4000, 'Lonavala (Outside Pune)', 2500, 'ip')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: '#fef3c7',
                      border: '1px solid #fde047',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>Lonavala (Outside Pune Metropolitan)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#b45309' }}>18.7500° N, 73.4000° E • ±2500m IP</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
