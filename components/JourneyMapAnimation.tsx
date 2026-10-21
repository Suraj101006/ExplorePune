'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DayJourney, JourneyPlaceStop } from '@/lib/journeyStorage';

interface JourneyMapAnimationProps {
  journey: DayJourney | null;
  allJourneys?: DayJourney[];
  isOverallMode?: boolean;
  selectedDateId?: string;
  onSelectDate?: (dateId: string) => void;
  onStopClick?: (stop: JourneyPlaceStop, index: number) => void;
  isMr?: boolean;
}

// Convert geographic coordinates to SVG 900x560 canvas coordinates
function projectCoord(lat: number, lng: number): { x: number; y: number } {
  const minLng = 73.40;
  const maxLng = 74.00;
  const minLat = 18.25;
  const maxLat = 18.75;

  const clampLng = Math.max(minLng, Math.min(maxLng, lng));
  const clampLat = Math.max(minLat, Math.min(maxLat, lat));

  const x = ((clampLng - minLng) / (maxLng - minLng)) * 780 + 60;
  const y = ((maxLat - clampLat) / (maxLat - minLat)) * 460 + 50;

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// Build curved SVG bezier path connecting points
function buildCurvedPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    // Gentle curve via control points
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    // Orthogonal curvature offset
    const offset = Math.min(24, Math.sqrt(dx * dx + dy * dy) * 0.12);
    const cx = midX - (dy / Math.max(1, Math.sqrt(dx * dx + dy * dy))) * offset;
    const cy = midY + (dx / Math.max(1, Math.sqrt(dx * dx + dy * dy))) * offset;

    d += ` Q ${Math.round(cx)} ${Math.round(cy)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function JourneyMapAnimation({
  journey,
  allJourneys = [],
  isOverallMode = false,
  selectedDateId,
  onSelectDate,
  onStopClick,
  isMr = false,
}: JourneyMapAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = start, 1..N = stops
  const [playbackSpeed, _setPlaybackSpeed] = useState(1);
  const [activePopupStop, setActivePopupStop] = useState<JourneyPlaceStop | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const places = useMemo(() => journey?.places || [], [journey]);
  const totalSteps = places.length;

  // Build point coordinates for current journey
  const startPt = journey?.startCoords
    ? projectCoord(journey.startCoords.lat, journey.startCoords.lng)
    : places.length > 0
    ? projectCoord(places[0].latitude - 0.02, places[0].longitude + 0.01)
    : { x: 450, y: 280 };

  const stopPoints = places.map((p) => ({
    ...projectCoord(p.latitude, p.longitude),
    place: p,
  }));

  const allPathPoints = [startPt, ...stopPoints];

  // SVG curved path for current journey
  const fullJourneyPath = buildCurvedPath(allPathPoints);

  // Progressive path for playback: draws up to current step
  const progressivePoints = allPathPoints.slice(0, currentStep + 1);
  const activeDrawPath = progressivePoints.length >= 2 ? buildCurvedPath(progressivePoints) : '';

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    playTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        if (places[next - 1]) {
          setActivePopupStop(places[next - 1]);
        }
        return next;
      });
    }, 2800 / playbackSpeed);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, totalSteps, playbackSpeed, places]);

  // Reset step when journey changes
  useEffect(() => {
    setCurrentStep(places.length); // Default to full route view
    setIsPlaying(false);
    setActivePopupStop(null);
  }, [journey?.id, places.length]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= totalSteps) {
        setCurrentStep(0);
        setActivePopupStop(null);
      }
      setIsPlaying(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (places[next - 1]) setActivePopupStop(places[next - 1]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (prev > 0 && places[prev - 1]) {
        setActivePopupStop(places[prev - 1]);
      } else {
        setActivePopupStop(null);
      }
    }
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setActivePopupStop(null);
    setIsPlaying(true);
  };

  return (
    <div
      className="journey-map-container"
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #fbf9f5 0%, #f4ede1 100%)',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid #e7ded0',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(194, 65, 12, 0.08), inset 0 0 80px rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Top Map Header & Controls Strip */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Map Context Pill */}
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(234, 88, 12, 0.25)',
            borderRadius: 999,
            padding: '6px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
          }}
        >
          <span style={{ fontSize: 16 }}>{isOverallMode ? '🗺️' : '🧭'}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#9a3412' }}>
            {isOverallMode
              ? isMr ? 'पुणे संपूर्ण प्रवास नकाशा' : 'Overall Exploration Map'
              : isMr ? journey?.dateLabelMr || journey?.date : journey?.dateLabelEn || journey?.date}
          </span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
            {isOverallMode
              ? `${allJourneys.length} ${isMr ? 'सफरी' : 'Journeys'}`
              : `${places.length} ${isMr ? 'ठिकाणे' : 'Stops'} • ${journey?.totalDistanceKm || 0} km`}
          </span>
        </div>

        {/* Playback Controls (Single Journey Mode) */}
        {!isOverallMode && places.length > 0 && (
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '4px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="chip"
              style={{ padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
              title={isMr ? 'मागील ठिकाण' : 'Previous Stop'}
            >
              ◀
            </button>

            <button
              type="button"
              onClick={handlePlayToggle}
              className="btn"
              style={{
                background: isPlaying ? '#ea580c' : '#047857',
                color: '#fff',
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>{isPlaying ? '⏸' : '▶'}</span>
              <span>
                {isPlaying
                  ? (isMr ? 'थांबवा' : 'Pause')
                  : currentStep >= totalSteps
                  ? (isMr ? 'पुन्हा पहा' : 'Replay')
                  : (isMr ? 'सुरू करा' : 'Play Journey')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStep >= totalSteps}
              className="chip"
              style={{ padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
              title={isMr ? 'पुढील ठिकाण' : 'Next Stop'}
            >
              ▶
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="chip"
              style={{ padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
              title={isMr ? 'सुरुवातीपासून पहा' : 'Reset & Replay'}
            >
              🔄
            </button>
          </div>
        )}
      </div>

      {/* SVG Stylized Pune Geographic Canvas */}
      <svg
        viewBox="0 0 900 560"
        style={{
          width: '100%',
          height: 'auto',
          minHeight: 380,
          maxHeight: 560,
          display: 'block',
          userSelect: 'none',
        }}
      >
        <defs>
          {/* Subtle Canvas Gradients */}
          <linearGradient id="puneLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="100%" stopColor="#f5efe4" />
          </linearGradient>

          <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="markerShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.22)" />
          </filter>
        </defs>

        {/* Pune Stylized Landmass & Topography */}
        <rect width="900" height="560" fill="url(#puneLandGrad)" />

        {/* Sahyadri Western Ghats Mountain Ridges Contour Shapes */}
        <g opacity="0.45" fill="none" stroke="#d5c7b3" strokeWidth="1.2">
          {/* Western Sahyadri Ridges */}
          <path d="M 40,80 Q 90,130 80,210 Q 70,290 110,380 Q 140,440 120,530" strokeDasharray="3,3" />
          <path d="M 120,50 Q 170,120 150,230 Q 140,320 200,420 Q 230,480 210,540" strokeDasharray="4,4" />
          {/* Sinhagad & South Ridges */}
          <path d="M 380,520 Q 460,490 540,510 Q 620,530 700,510" strokeDasharray="2,2" />
        </g>

        {/* Major Waterways: Mutha & Mula Rivers of Pune */}
        <g fill="none" stroke="#bae6fd" strokeWidth="4.5" strokeLinecap="round" opacity="0.8">
          {/* Mutha River from Khadakwasla to Sangam */}
          <path d="M 500,430 C 530,370 560,320 620,290 C 650,275 670,265 720,250 C 760,238 820,235 880,230" />
          {/* Mula River from Aundh to Sangam */}
          <path d="M 420,180 C 490,200 560,225 640,260 C 670,265 720,250 880,230" strokeWidth="3.5" />
        </g>

        {/* Region Labels */}
        <g fontSize="10.5" fontFamily="sans-serif" fontWeight="700" fill="#a89a85" opacity="0.75" letterSpacing="0.08em">
          <text x="70" y="70">MAVAL & LONAVALA FORTS</text>
          <text x="320" y="475">SINHAGAD & SAHYADRI RANGE</text>
          <text x="610" y="240">OLD PUNE PETH CLUSTERS</text>
          <text x="740" y="210">EASTERN PALACES</text>
        </g>

        {/* =============================================================
            MODE 1: OVERALL MULTI-ROUTE VISUALIZATION
            ============================================================= */}
        {isOverallMode && (
          <g className="overall-routes-layer">
            {allJourneys.map((j) => {
              const isSelected = selectedDateId === j.id || selectedDateId === j.date;
              const isHovered = hoveredRouteId === j.id;
              const jPlaces = j.places || [];
              if (jPlaces.length === 0) return null;

              const jPoints = [
                j.startCoords ? projectCoord(j.startCoords.lat, j.startCoords.lng) : projectCoord(jPlaces[0].latitude - 0.01, jPlaces[0].longitude + 0.01),
                ...jPlaces.map((p) => projectCoord(p.latitude, p.longitude)),
              ];
              const pathD = buildCurvedPath(jPoints);

              return (
                <g
                  key={j.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectDate && onSelectDate(j.id)}
                  onMouseEnter={() => setHoveredRouteId(j.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                >
                  {/* Route connecting line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSelected || isHovered ? '#ea580c' : 'rgba(194, 65, 12, 0.35)'}
                    strokeWidth={isSelected || isHovered ? 4 : 2}
                    strokeDasharray={isSelected ? '6,4' : 'none'}
                    strokeLinecap="round"
                    style={{ transition: 'all 0.25s ease' }}
                  />

                  {/* Stop dots */}
                  {jPlaces.map((p, pIdx) => {
                    const pt = projectCoord(p.latitude, p.longitude);
                    return (
                      <circle
                        key={p.placeId || pIdx}
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6.5 : isHovered ? 5 : 3.5}
                        fill={isSelected ? '#ea580c' : isHovered ? '#f97316' : '#c2410c'}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 1}
                        style={{ transition: 'all 0.2s ease' }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
        )}

        {/* =============================================================
            MODE 2: INDIVIDUAL / TODAY'S JOURNEY ANIMATION
            ============================================================= */}
        {!isOverallMode && (
          <g className="single-journey-layer">
            {/* Full Path Base Shadow Line */}
            {fullJourneyPath && (
              <path
                d={fullJourneyPath}
                fill="none"
                stroke="rgba(234, 88, 12, 0.18)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}

            {/* Active Drawing Route Path */}
            {activeDrawPath && (
              <path
                d={activeDrawPath}
                fill="none"
                stroke="url(#activeRouteGrad)"
                strokeWidth="4"
                strokeDasharray="8,5"
                strokeLinecap="round"
                filter="url(#glowFilter)"
                className="animated-journey-path"
              />
            )}

            {/* Starting Location Marker with Pulsing Halo */}
            <g transform={`translate(${startPt.x}, ${startPt.y})`}>
              <circle r="16" fill="rgba(6, 95, 70, 0.15)" className="start-marker-pulse" />
              <circle r="8" fill="#047857" stroke="#ffffff" strokeWidth="2.5" filter="url(#markerShadow)" />
              <circle r="3" fill="#ffffff" />
              <text
                x="0"
                y="-14"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#065f46"
              >
                🚩 {isMr ? 'सुरुवात' : 'START'}
              </text>
            </g>

            {/* Destination Markers */}
            {stopPoints.map((pt, idx) => {
              const stopNumber = idx + 1;
              const isRevealed = currentStep >= stopNumber;
              const isCurrentFocus = currentStep === stopNumber;
              const p = pt.place;

              return (
                <g
                  key={p.placeId || idx}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  style={{
                    cursor: 'pointer',
                    opacity: isRevealed ? 1 : 0.45,
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => {
                    setActivePopupStop(p);
                    if (onStopClick) onStopClick(p, idx);
                  }}
                >
                  {/* Expanding Ripple on Arrival */}
                  {isCurrentFocus && (
                    <circle r="22" fill="none" stroke="#ea580c" strokeWidth="2" className="arrival-ripple" />
                  )}

                  {/* Marker Pin Circle */}
                  <circle
                    r={isCurrentFocus ? 13 : p.isVisited ? 10 : 9}
                    fill={isCurrentFocus ? '#ea580c' : p.isVisited ? '#047857' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth={isCurrentFocus ? 3 : 2}
                    filter="url(#markerShadow)"
                  />

                  {/* Number or Checkmark */}
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fontSize={isCurrentFocus ? '11' : '9.5'}
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    {p.isVisited ? '✓' : stopNumber}
                  </text>

                  {/* Place Name Tag */}
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isCurrentFocus ? '#9a3412' : '#334155'}
                    stroke="#ffffff"
                    strokeWidth="3"
                    paintOrder="stroke"
                    strokeLinejoin="round"
                  >
                    {isMr && p.placeNameMr ? p.placeNameMr : p.placeName}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Floating Interactive Landmark Detail Card / Popup */}
      {activePopupStop && (
        <div
          className="map-landmark-popup"
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            maxWidth: 360,
            width: 'calc(100% - 40px)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius)',
            border: '1.5px solid rgba(234, 88, 12, 0.35)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            padding: 14,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            zIndex: 20,
            animation: 'slideUpPopup 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#e2e8f0',
              position: 'relative',
            }}
          >
            <img
              src={activePopupStop.image_url || '/images/places/shaniwar-wada.jpg'}
              alt={activePopupStop.placeName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#c2410c',
                  background: '#ffedd5',
                  padding: '2px 7px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                }}
              >
                {activePopupStop.categoryName || activePopupStop.category}
              </span>
              <button
                type="button"
                onClick={() => setActivePopupStop(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 16,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: '0 4px',
                }}
              >
                ✕
              </button>
            </div>

            <h4
              style={{
                margin: '4px 0 2px',
                fontSize: 14.5,
                fontWeight: 800,
                color: 'var(--ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isMr && activePopupStop.placeNameMr ? activePopupStop.placeNameMr : activePopupStop.placeName}
            </h4>

            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
              {activePopupStop.arrivalTime && `⏰ ${activePopupStop.arrivalTime}`}
              {activePopupStop.isVisited ? ' • ✓ Visited' : ' • 📍 Planned'}
            </div>

            {activePopupStop.note && (
              <div
                style={{
                  fontSize: 11,
                  color: '#78350f',
                  fontStyle: 'italic',
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                &ldquo;{activePopupStop.note}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS Keyframes for smooth travel animations */}
      <style jsx>{`
        @keyframes startPulse {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.2;
          }
        }
        .start-marker-pulse {
          animation: startPulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes arrivalRippleAnim {
          0% {
            r: 12px;
            opacity: 1;
          }
          100% {
            r: 32px;
            opacity: 0;
          }
        }
        .arrival-ripple {
          animation: arrivalRippleAnim 1.4s ease-out infinite;
        }

        @keyframes slideUpPopup {
          from {
            transform: translateY(14px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .start-marker-pulse,
          .arrival-ripple,
          .animated-journey-path {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
