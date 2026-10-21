'use client';

import React from 'react';
import { TransitRouteInfo } from '@/lib/publicTransit';

interface TransitRouteMapProps {
  origin: {
    name: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    lat: number;
    lng: number;
  };
  transitInfo: TransitRouteInfo;
  isMarathi?: boolean;
}

export default function TransitRouteMap({
  origin,
  destination,
  transitInfo,
  isMarathi = false,
}: TransitRouteMapProps) {
  // Compute comfortable bounding box containing both origin and destination
  const minLat = Math.min(origin.lat, destination.lat) - 0.02;
  const maxLat = Math.max(origin.lat, destination.lat) + 0.02;
  const minLng = Math.min(origin.lng, destination.lng) - 0.02;
  const maxLng = Math.max(origin.lng, destination.lng) + 0.02;

  const gmapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const googleMapsEmbedRouteUrl = gmapsApiKey
    ? `https://www.google.com/maps/embed/v1/directions?key=${gmapsApiKey}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=transit`
    : `https://maps.google.com/maps?saddr=${origin.lat},${origin.lng}&daddr=${destination.lat},${destination.lng}&dirflg=r&hl=${isMarathi ? 'mr' : 'en'}&output=embed`;

  const gmapsTransitUrl =
    transitInfo.gmapsTransitUrl ||
    `https://www.google.com/maps/dir/?api=1&origin=${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}&destination=${destination.lat.toFixed(5)},${destination.lng.toFixed(5)}&travelmode=transit`;

  return (
    <div
      style={{
        marginTop: 18,
        borderRadius: 14,
        overflow: 'hidden',
        border: '1.5px solid #cbd5e1',
        background: '#ffffff',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Route Journey Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: '#4ade80' }}>🏠 {origin.name}</span>
          <span style={{ color: '#94a3b8' }}>➔</span>
          <span style={{ color: '#f87171' }}>🚩 {destination.name}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, fontSize: 12, alignItems: 'center' }}>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 6 }}>
            ⏱️ ~{transitInfo.estimatedMinutes} {isMarathi ? 'मि.' : 'mins'}
          </span>
          <span style={{ background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
            🎫 ₹{transitInfo.estimatedCostInr}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span>🚍 PMPML & 🚇 Metro</span>
          </span>
        </div>
      </div>

      {/* Live Google Maps Transit Route Frame */}
      <div style={{ width: '100%', height: 320, position: 'relative', background: '#f8fafc' }}>
        <iframe
          title={`Google Maps Transit route from ${origin.name} to ${destination.name}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={googleMapsEmbedRouteUrl}
        />
      </div>

      {/* Map Action Bar & Live Navigation */}
      <div
        style={{
          padding: '12px 16px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 12, color: '#475569' }}>
          💡{' '}
          {isMarathi
            ? 'नकाशावर थेट मार्ग व अचूक वेळापत्रकासाठी गुगल मॅप्स ट्रान्झिट मोड वापरा.'
            : 'Interactive map displays your commute corridor. Click below for real-time turn-by-turn transit.'}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a
            href={gmapsTransitUrl}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              background: '#0284c7',
              color: '#ffffff',
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🧭</span>
            <span>{isMarathi ? 'गुगल मॅप्सवर थेट मार्ग पहा ↗' : 'Open Transit in Google Maps ↗'}</span>
          </a>

          {transitInfo.nearestMetro && (
            <a
              href="https://wa.me/919420101990?text=Hi"
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{
                background: '#25D366',
                color: '#ffffff',
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 8,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🎟️</span>
              <span>{isMarathi ? 'व्हॉट्सअॅप मेट्रो तिकीट' : 'WhatsApp Metro QR'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
