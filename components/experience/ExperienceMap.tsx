'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ALL_106_PLACES,
  ExperiencePlace,
} from '@/lib/experienceData';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Compass,
  Layers,
  List,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Tag,
  Eye,
  X,
} from 'lucide-react';

interface ExperienceMapProps {
  isMr: boolean;
}

// Bounding box for Pune metropolitan & regional getaways
const BOUNDS = {
  minLat: 18.20,
  maxLat: 19.25,
  minLng: 73.30,
  maxLng: 74.20,
};

// Area definitions
const AREA_FILTERS = [
  { id: 'all', label: 'All Locations', labelMr: 'सर्व ठिकाणे' },
  { id: 'heritage-core', label: 'Old Heritage Core (Peths)', labelMr: 'जुने पुणे (पेठा)' },
  { id: 'shivajinagar-deccan', label: 'Shivajinagar & Deccan', labelMr: 'शिवाजीनगर व डेक्कन' },
  { id: 'kothrud', label: 'Kothrud & Karve Nagar', labelMr: 'कोथरूड व कर्वे नगर' },
  { id: 'koregaon-park', label: 'Koregaon Park & Camp', labelMr: 'कोरेगाव पार्क व कॅम्प' },
  { id: 'sinhagad-khadakwasla', label: 'Sinhagad & Khadakwasla', labelMr: 'सिंहगड व खडकवासला' },
  { id: 'regional-getaways', label: 'Regional Getaways (Lonavala/Mulshi)', labelMr: 'आसपासच्या सहली' },
];

function isRegional(place: ExperiencePlace): boolean {
  // Flag places outside urban Pune (e.g. Lonavala, Junnar, Saswad, Mulshi)
  return (
    place.latitude > 18.65 ||
    place.latitude < 18.42 ||
    place.longitude < 73.72 ||
    place.longitude > 73.98
  );
}

function matchesArea(place: ExperiencePlace, areaId: string): boolean {
  if (areaId === 'all') return true;
  const addr = (place.address || '').toLowerCase();
  const name = place.name.toLowerCase();

  if (areaId === 'heritage-core') {
    return (
      addr.includes('peth') ||
      addr.includes('shaniwar') ||
      addr.includes('kasba') ||
      addr.includes('budhwar') ||
      addr.includes('sadashiv') ||
      addr.includes('narayan') ||
      name.includes('wada')
    );
  }
  if (areaId === 'shivajinagar-deccan') {
    return addr.includes('shivajinagar') || addr.includes('deccan') || addr.includes('fc road') || addr.includes('jm road');
  }
  if (areaId === 'kothrud') {
    return addr.includes('kothrud') || addr.includes('karve') || addr.includes('paud');
  }
  if (areaId === 'koregaon-park') {
    return addr.includes('koregaon') || addr.includes('camp') || addr.includes('cantonment') || addr.includes('dhole patil');
  }
  if (areaId === 'sinhagad-khadakwasla') {
    return addr.includes('sinhagad') || addr.includes('donje') || addr.includes('khadakwasla') || name.includes('sinhagad');
  }
  if (areaId === 'regional-getaways') {
    return isRegional(place);
  }
  return true;
}

// Haversine formula to compute distance in km
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function ExperienceMap({ isMr }: ExperienceMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPlace, setSelectedPlace] = useState<ExperiencePlace>(ALL_106_PLACES[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // SVG Pan & Drag state
  const isDraggingRef = useRef(false);
  const startDragRef = useRef({ x: 0, y: 0 });

  // Geolocation request
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(isMr ? 'आपल्या ब्राउझरमध्ये GPS सेवा उपलब्ध नाही.' : 'Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocatingUser(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocatingUser(false);
        alert(isMr ? 'स्थान निश्चित करता आले नाही.' : 'Could not access current location. Please verify browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filter places
  const filteredPlaces = useMemo(() => {
    return ALL_106_PLACES.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.name_mr && p.name_mr.toLowerCase().includes(q)) ||
        p.address.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'all' || p.category_slug === selectedCategory;

      const matchesAr = matchesArea(p, selectedArea);

      return matchesSearch && matchesCat && matchesAr;
    });
  }, [searchQuery, selectedCategory, selectedArea]);

  // Project lat/lng to SVG 1000x700 coordinates
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 1000;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 700;
    return { x, y };
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.4, 3.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.4, 0.8));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <section id="map" className="exp-section exp-map-section">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Compass size={14} />
            <span>{isMr ? 'विभाग ०३ • भौगोलिक नकाशा' : 'SECTION 03 • GEOGRAPHICAL MAP'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुणे अनुभव परस्परसंवादी नकाशा' : 'Interactive Pune Experience Map'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'पुणे शहर आणि परिसरातील सर्व १०६ प्रमाणित ठिकाणे अचूक भौगोलिक निर्देशांकांसह (GPS) एक्सप्लोर करा.'
              : 'Explore all 106 verified destinations with genuine coordinates, area filtering, real-time distance calculations, and instant navigation.'}
          </p>
        </div>

        {/* Map Control Bar */}
        <div className="exp-map-controls-card">
          <div className="exp-map-controls-row">
            {/* Search Input */}
            <div className="exp-search-box">
              <Search size={16} className="exp-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMr ? 'ठिकाण, पेठ किंवा परिसर शोधा...' : 'Search destination, locality, or heritage...'}
                className="exp-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="exp-search-clear"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Area Filter */}
            <div className="exp-area-select-wrapper">
              <MapPin size={16} />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="exp-select-dropdown"
                aria-label="Filter by Pune area"
              >
                {AREA_FILTERS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {isMr ? a.labelMr : a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Location Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locatingUser}
              className={`exp-gps-btn ${userLocation ? 'active' : ''}`}
            >
              <Navigation size={15} className={locatingUser ? 'spin-icon' : ''} />
              <span>
                {locatingUser
                  ? isMr
                    ? 'स्थान शोधत आहे...'
                    : 'Locating...'
                  : userLocation
                  ? isMr
                    ? 'GPS सक्रिय'
                    : 'GPS Active'
                  : isMr
                  ? 'माझे स्थान'
                  : 'My Location'}
              </span>
            </button>

            {/* View Mode Toggle */}
            <div className="exp-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`exp-view-btn ${viewMode === 'map' ? 'active' : ''}`}
                aria-label="Map view"
              >
                <Layers size={15} />
                <span>{isMr ? 'नकाशा' : 'Map'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`exp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                aria-label="List view"
              >
                <List size={15} />
                <span>{isMr ? 'यादी' : 'List'} ({filteredPlaces.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="exp-cat-chips-row">
            {[
              { id: 'all', label: isMr ? 'सर्व (१०६)' : 'All (106)' },
              { id: 'heritage', label: isMr ? 'वारसा (२९)' : 'Heritage (29)' },
              { id: 'forts', label: isMr ? 'किल्ले (१५)' : 'Forts (15)' },
              { id: 'temples', label: isMr ? 'मंदिरे (२७)' : 'Temples (27)' },
              { id: 'nature', label: isMr ? 'निसर्ग (१४)' : 'Nature (14)' },
              { id: 'museums', label: isMr ? 'संग्रहालये (९)' : 'Museums (9)' },
              { id: 'parks', label: isMr ? 'उद्याने (६)' : 'Parks (6)' },
              { id: 'food', label: isMr ? 'खाद्यसंस्कृती (६)' : 'Food (6)' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`exp-chip ${selectedCategory === c.id ? 'active' : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Workspace */}
        {viewMode === 'map' ? (
          <div className="exp-map-display-layout">
            {/* SVG Visual Geographical Map Viewport */}
            <div className="exp-map-canvas-card">
              {/* Zoom & Pan Tools */}
              <div className="exp-map-floating-tools">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="exp-tool-btn"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="exp-tool-btn"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="exp-tool-btn"
                  aria-label="Reset zoom"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Geographical Legend Badge */}
              <div className="exp-map-legend">
                <div className="exp-legend-dot city" />
                <span>{isMr ? 'पुणे शहर' : 'Pune City'}</span>
                <div className="exp-legend-dot regional" />
                <span>{isMr ? 'सह्याद्री / परिसर' : 'Regional Getaway'}</span>
              </div>

              {/* Interactive SVG Surface */}
              <div
                className="exp-svg-container"
                onMouseDown={(e) => {
                  isDraggingRef.current = true;
                  startDragRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
                }}
                onMouseMove={(e) => {
                  if (!isDraggingRef.current) return;
                  setPanOffset({
                    x: e.clientX - startDragRef.current.x,
                    y: e.clientY - startDragRef.current.y,
                  });
                }}
                onMouseUp={() => {
                  isDraggingRef.current = false;
                }}
                onMouseLeave={() => {
                  isDraggingRef.current = false;
                }}
              >
                <svg
                  viewBox="0 0 1000 700"
                  className="exp-svg-map"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: '50% 50%',
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                    </radialGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Geographical Grid Lines */}
                  <g className="exp-grid-lines" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4">
                    <line x1="0" y1="175" x2="1000" y2="175" />
                    <line x1="0" y1="350" x2="1000" y2="350" />
                    <line x1="0" y1="525" x2="1000" y2="525" />
                    <line x1="250" y1="0" x2="250" y2="700" />
                    <line x1="500" y1="0" x2="500" y2="700" />
                    <line x1="750" y1="0" x2="750" y2="700" />
                  </g>

                  {/* Pune Center Ambient Glow */}
                  <circle cx="560" cy="420" r="280" fill="url(#mapGlow)" />

                  {/* Stylized River Mula-Mutha Confluence Route */}
                  <path
                    d="M 120 540 Q 300 480 480 440 T 560 410 T 680 390 T 950 350"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                  />
                  <text x="640" y="380" fill="#38bdf8" fontSize="10" opacity="0.6" fontStyle="italic">
                    Mula-Mutha Confluence
                  </text>

                  {/* Sahyadri Western Ridge Contour */}
                  <path
                    d="M 150 120 Q 220 280 180 420 T 190 650"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeOpacity="0.3"
                  />
                  <text x="110" y="240" fill="#34d399" fontSize="10" opacity="0.5">
                    Sahyadri Western Crest
                  </text>

                  {/* User Location Pulse Marker */}
                  {userLocation && (
                    (() => {
                      const uCoords = projectCoords(userLocation.lat, userLocation.lng);
                      return (
                        <g transform={`translate(${uCoords.x}, ${uCoords.y})`}>
                          <circle r="16" fill="#38bdf8" opacity="0.3">
                            <animate attributeName="r" values="8;22;8" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <circle r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        </g>
                      );
                    })()
                  )}

                  {/* Destination Markers */}
                  {filteredPlaces.map((place) => {
                    const coords = projectCoords(place.latitude, place.longitude);
                    const isSelected = selectedPlace.slug === place.slug;
                    const regional = isRegional(place);

                    return (
                      <g
                        key={place.slug}
                        transform={`translate(${coords.x}, ${coords.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlace(place);
                        }}
                        style={{ cursor: 'pointer' }}
                        filter="url(#shadow)"
                      >
                        {isSelected && (
                          <circle
                            r="18"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            strokeDasharray="4 2"
                            opacity="0.9"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0"
                              to="360"
                              dur="8s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                        <circle
                          r={isSelected ? '9' : '6'}
                          fill={regional ? '#10b981' : '#f59e0b'}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                        />
                        {/* Selected or zoomed label */}
                        {(isSelected || zoomLevel > 1.8) && (
                          <text
                            y="-12"
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize={isSelected ? '12' : '10'}
                            fontWeight={isSelected ? '700' : '500'}
                            style={{ textShadow: '0 2px 4px #000000' }}
                          >
                            {isMr && place.name_mr ? place.name_mr : place.name}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Destination Preview Sidebar Card */}
            <div className="exp-map-sidebar">
              {selectedPlace ? (
                <div className="exp-preview-card">
                  <div className="exp-preview-media">
                    <Image
                      src={selectedPlace.image_url}
                      alt={selectedPlace.name}
                      fill
                      sizes="400px"
                      className="exp-preview-img"
                    />
                    <div className="exp-preview-tag">
                      {isRegional(selectedPlace)
                        ? isMr
                          ? 'सह्याद्री परिसर सहल'
                          : 'Regional Getaway'
                        : isMr
                        ? 'पुणे शहर वारसा'
                        : 'Pune City Landmark'}
                    </div>
                  </div>

                  <div className="exp-preview-body">
                    <div className="exp-preview-category">
                      <Tag size={13} />
                      <span>{selectedPlace.category}</span>
                    </div>

                    <h3 className="exp-preview-title">
                      {isMr && selectedPlace.name_mr ? selectedPlace.name_mr : selectedPlace.name}
                    </h3>

                    <p className="exp-preview-addr">
                      <MapPin size={13} />
                      <span>{selectedPlace.address}</span>
                    </p>

                    {/* Coordinates & Haversine Distance */}
                    <div className="exp-preview-meta-row">
                      <div className="exp-meta-chip">
                        <span>
                          {selectedPlace.latitude.toFixed(4)}°N, {selectedPlace.longitude.toFixed(4)}°E
                        </span>
                      </div>
                      {userLocation && (
                        <div className="exp-meta-chip active">
                          <Navigation size={12} />
                          <span>
                            {computeDistanceKm(
                              userLocation.lat,
                              userLocation.lng,
                              selectedPlace.latitude,
                              selectedPlace.longitude
                            )}{' '}
                            km {isMr ? 'अंतर' : 'away'}
                          </span>
                        </div>
                      )}
                    </div>

                    {selectedPlace.opening_hours && (
                      <p className="exp-preview-hours">
                        <Clock size={13} />
                        <span>{selectedPlace.opening_hours}</span>
                      </p>
                    )}

                    <p className="exp-preview-desc">
                      {selectedPlace.description ? selectedPlace.description.slice(0, 140) + '…' : ''}
                    </p>

                    <div className="exp-preview-actions">
                      <Link
                        href={`/places/${selectedPlace.slug}`}
                        className="exp-btn-primary full-w"
                      >
                        <Eye size={16} />
                        <span>{isMr ? 'संपूर्ण माहिती पाहा' : 'View Full Details'}</span>
                      </Link>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exp-btn-secondary full-w"
                      >
                        <Navigation size={16} />
                        <span>{isMr ? 'Google Maps ने जा' : 'Navigate (Google Maps)'}</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="exp-preview-empty">
                  <MapPin size={32} />
                  <p>{isMr ? 'नकाशावरील कोणत्याही पिनवर क्लिक करा' : 'Click any marker pin on the map to preview destination'}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="exp-places-list-view">
            <div className="exp-list-grid">
              {filteredPlaces.map((place) => {
                const dist = userLocation
                  ? computeDistanceKm(userLocation.lat, userLocation.lng, place.latitude, place.longitude)
                  : null;
                return (
                  <div
                    key={place.slug}
                    className={`exp-list-item-card ${selectedPlace.slug === place.slug ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPlace(place);
                      setViewMode('map');
                    }}
                  >
                    <div className="exp-list-item-media">
                      <Image
                        src={place.image_url}
                        alt={place.name}
                        fill
                        sizes="160px"
                        className="exp-list-item-img"
                      />
                    </div>
                    <div className="exp-list-item-content">
                      <div className="exp-list-item-header">
                        <span className="exp-list-cat">{place.category}</span>
                        {dist !== null && (
                          <span className="exp-list-dist">
                            <Navigation size={11} /> {dist} km
                          </span>
                        )}
                      </div>
                      <h4 className="exp-list-name">
                        {isMr && place.name_mr ? place.name_mr : place.name}
                      </h4>
                      <p className="exp-list-addr">{place.address}</p>
                      <div className="exp-list-actions">
                        <span className="exp-list-btn-preview">
                          {isMr ? 'नकाशावर पाहा →' : 'View on Map →'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
