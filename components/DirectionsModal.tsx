'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Navigation,
  MapPin,
  Car,
  Bus,
  Footprints,
  Bike,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronDown,
  Map as MapIcon,
  List,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  NavDestination,
  NavOrigin,
  TravelMode,
  DirectionsResult,
  DIRECTIONS_MODAL_EVENT,
  validateDestination,
  evaluateGpsAccuracy,
  getStoredTravelMode,
  setStoredTravelMode,
  buildExternalNavigationUrl,
  fetchDirectionsRoute,
} from '@/lib/navigationService';
import {
  detectBrowserGps,
  PUNE_ALL_LOCALITIES,
  PuneLocality,
  searchPuneLocalities,
  getStoredUserLocation,
} from '@/lib/userLocation';

type ModalState =
  | 'idle'
  | 'permission_prompt'
  | 'locating'
  | 'calculating'
  | 'ready'
  | 'error'
  | 'manual_picker';

export default function DirectionsModal() {
  const { isMr } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [destination, setDestination] = useState<NavDestination | null>(null);
  const [origin, setOrigin] = useState<NavOrigin | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [routeResult, setRouteResult] = useState<DirectionsResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<{ en: string; mr: string } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'steps'>('map');

  // Manual origin picker state
  const [manualQuery, setManualQuery] = useState('');
  const [manualList, setManualList] = useState<PuneLocality[]>(PUNE_ALL_LOCALITIES.slice(0, 8));

  // Focus trap ref
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize stored travel mode
  useEffect(() => {
    setTravelMode(getStoredTravelMode());
  }, []);

  // Update manual search list
  useEffect(() => {
    setManualList(searchPuneLocalities(manualQuery));
  }, [manualQuery]);

  // Close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setModalState('idle');
    setRouteResult(null);
    setErrorMessage(null);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Compute route from current origin and destination
  const calculateRoute = useCallback(
    async (
      currentOrigin: NavOrigin,
      currentDest: NavDestination,
      mode: TravelMode
    ) => {
      setModalState('calculating');
      setErrorMessage(null);

      try {
        const result = await fetchDirectionsRoute({
          origin: {
            lat: currentOrigin.latitude,
            lng: currentOrigin.longitude,
            name: currentOrigin.name,
          },
          destination: {
            lat: currentDest.latitude!,
            lng: currentDest.longitude!,
            name: currentDest.name,
            address: currentDest.address,
          },
          travelMode: mode,
          lang: isMr ? 'mr' : 'en',
        });

        setRouteResult(result);
        setModalState('ready');
      } catch (err: any) {
        setErrorMessage({
          en: err?.message || 'Could not calculate route. Please try again.',
          mr: 'मार्ग शोधण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.',
        });
        setModalState('error');
      }
    },
    [isMr]
  );

  // Acquire live GPS position
  const requestGpsAndRoute = useCallback(
    async (targetDest: NavDestination, mode: TravelMode) => {
      setModalState('locating');
      setErrorMessage(null);

      try {
        const detection = await detectBrowserGps();

        if (detection.success && detection.location) {
          const newOrigin: NavOrigin = {
            name: isMr ? 'माझे थेट स्थान' : 'My Current Location',
            latitude: detection.location.lat,
            longitude: detection.location.lng,
            isGps: true,
            accuracyMeters: detection.accuracyMeters,
            timestamp: Date.now(),
          };

          setOrigin(newOrigin);
          setGpsAccuracy(detection.accuracyMeters || null);

          // Proceed to route calculation
          await calculateRoute(newOrigin, targetDest, mode);
        } else {
          setErrorMessage({
            en:
              detection.error ||
              'We could not determine your current location. Check your GPS settings and try again.',
            mr: 'आम्हाला तुमचे अचूक स्थान मिळू शकले नाही. कृपया GPS सुरू आहे का ते तपासा.',
          });
          setModalState('error');
        }
      } catch {
        setErrorMessage({
          en: 'Location detection timed out or failed. Please try again from an area with better reception.',
          mr: 'GPS संपर्क होऊ शकला नाही. कृपया मोकळ्या जागेत जाऊन पुन्हा प्रयत्न करा.',
        });
        setModalState('error');
      }
    },
    [isMr, calculateRoute]
  );

  // Global event listener to open modal for any destination
  useEffect(() => {
    const handleOpenDirections = (e: Event) => {
      const customEvent = e as CustomEvent<{
        destination: NavDestination;
        initialOrigin?: NavOrigin;
      }>;
      const dest = customEvent.detail?.destination;
      const initOrigin = customEvent.detail?.initialOrigin;

      if (!dest) return;

      // 1. Destination validation
      const validation = validateDestination(dest);
      if (!validation.valid) {
        setDestination(dest);
        setIsOpen(true);
        setErrorMessage({
          en: validation.error || 'Destination coordinates are unavailable.',
          mr: validation.errorMr || 'या ठिकाणाचे GPS निर्देशांक उपलब्ध नाहीत.',
        });
        setModalState('error');
        return;
      }

      setDestination(dest);
      setIsOpen(true);
      setErrorMessage(null);

      // If origin is explicitly provided (e.g. from manual selection or cached)
      if (initOrigin) {
        setOrigin(initOrigin);
        setGpsAccuracy(initOrigin.accuracyMeters || null);
        calculateRoute(initOrigin, dest, travelMode);
        return;
      }

      // Check if location permission has already been granted in browser
      if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
        navigator.permissions
          .query({ name: 'geolocation' as PermissionName })
          .then((perm) => {
            if (perm.state === 'granted') {
              // Permission already granted -> locate immediately
              requestGpsAndRoute(dest, travelMode);
            } else {
              // Permission not yet granted or prompt -> ask user first
              setModalState('permission_prompt');
            }
          })
          .catch(() => {
            setModalState('permission_prompt');
          });
      } else {
        setModalState('permission_prompt');
      }
    };

    window.addEventListener(DIRECTIONS_MODAL_EVENT, handleOpenDirections);
    return () => window.removeEventListener(DIRECTIONS_MODAL_EVENT, handleOpenDirections);
  }, [travelMode, calculateRoute, requestGpsAndRoute]);

  // Handle travel mode change
  const handleModeChange = (newMode: TravelMode) => {
    setTravelMode(newMode);
    setStoredTravelMode(newMode);
    if (origin && destination) {
      calculateRoute(origin, destination, newMode);
    }
  };

  // Select a manual Pune locality as starting origin
  const handleSelectManualLocality = (loc: PuneLocality) => {
    const newOrigin: NavOrigin = {
      name: isMr ? loc.nameMr : loc.nameEn,
      latitude: loc.latitude,
      longitude: loc.longitude,
      isGps: false,
    };
    setOrigin(newOrigin);
    setGpsAccuracy(null);
    if (destination) {
      calculateRoute(newOrigin, destination, travelMode);
    }
  };

  if (!isOpen || !destination) return null;

  const destTitle = isMr && destination.nameMr ? destination.nameMr : destination.name;
  const accuracyEval = evaluateGpsAccuracy(gpsAccuracy);

  // Universal Google Maps directions embed URL for in-app map view
  const embedTravelFlag =
    travelMode === 'transit' ? 'r' : travelMode === 'walking' ? 'w' : travelMode === 'bicycling' ? 'b' : 'd';
  const embedRouteUrl = origin
    ? `https://maps.google.com/maps?saddr=${origin.latitude.toFixed(5)},${origin.longitude.toFixed(5)}&daddr=${destination.latitude!.toFixed(5)},${destination.longitude!.toFixed(5)}&dirflg=${embedTravelFlag}&hl=${isMr ? 'mr' : 'en'}&output=embed`
    : `https://maps.google.com/maps?q=${destination.latitude!.toFixed(5)},${destination.longitude!.toFixed(5)}&hl=${isMr ? 'mr' : 'en'}&output=embed`;

  // Start Navigation external links
  const navUrls = origin
    ? buildExternalNavigationUrl({
        origin: { latitude: origin.latitude, longitude: origin.longitude },
        destination: { latitude: destination.latitude!, longitude: destination.longitude!, name: destTitle },
        travelMode,
      })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="directions-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* ===================================================================
            MODAL HEADER
            =================================================================== */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Navigation size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? 'पुणे थेट नेव्हिगेशन' : 'Explore Pune Navigation'}
              </div>
              <h2
                id="directions-modal-title"
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  margin: 0,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {destTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close directions dialog"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#ffffff',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ===================================================================
            MODAL BODY / DIFFERENT STATES
            =================================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* 1. PERMISSION PROMPT STATE */}
          {modalState === 'permission_prompt' && (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <MapPin size={28} />
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                {isMr ? 'स्थानाचा परवाना आवश्यक आहे' : 'Allow Location Access'}
              </h3>

              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 420 }}>
                {isMr
                  ? 'तुमच्या सध्याच्या GPS स्थानावरून गंतव्यस्थानाचा थेट मार्ग आणि अंदाजे वेळ मिळवण्यासाठी स्थानाचा परवाना द्या.'
                  : 'Allow location access to get directions from your current location.'}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
                <button
                  type="button"
                  onClick={() => requestGpsAndRoute(destination, travelMode)}
                  className="btn"
                  style={{
                    background: '#047857',
                    color: '#ffffff',
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 10,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Navigation size={16} />
                  <span>{isMr ? 'स्थान परवाना द्या (Allow Location)' : 'Allow Location'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="btn outline"
                  style={{
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 10,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setModalState('manual_picker')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {isMr ? '✏️ किंवा पुण्यातून प्रारंभ ठिकाण निवडा' : '✏️ Or enter starting location manually'}
                </button>
              </div>
            </div>
          )}

          {/* 2. LOCATING STATE */}
          {modalState === 'locating' && (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: '#f0fdf4',
                  border: '2px solid #86efac',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'pulse 1.5s infinite',
                }}
              >
                <Navigation size={24} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                {isMr ? 'तुमचे स्थान शोधत आहे…' : 'Finding your location…'}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                {isMr ? 'GPS उपग्रहाशी संपर्क साधत आहे…' : 'Connecting to GPS sensors…'}
              </p>
            </div>
          )}

          {/* 3. CALCULATING ROUTE STATE */}
          {modalState === 'calculating' && (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: '#eff6ff',
                  border: '2px solid #93c5fd',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'pulse 1.5s infinite',
                }}
              >
                <RotateCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                {isMr ? 'स्थान मिळाले ✓ मार्ग शोधत आहे…' : 'Location found ✓ Finding route…'}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                {isMr ? 'रस्ता आणि रहदारीची अचूक वेळ तपासत आहे…' : 'Calculating realistic road route & travel duration…'}
              </p>
            </div>
          )}

          {/* 4. ERROR STATE */}
          {modalState === 'error' && errorMessage && (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <AlertTriangle size={26} />
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#991b1b', margin: '0 0 8px' }}>
                {isMr ? 'मार्ग उपलब्ध करता आला नाही' : 'Location / Route Error'}
              </h3>

              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 440 }}>
                {isMr ? errorMessage.mr : errorMessage.en}
              </p>

              {destination.address && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 12.5,
                    color: '#334155',
                    marginBottom: 20,
                    textAlign: 'left',
                  }}
                >
                  📍 <strong>{isMr ? 'पत्ता:' : 'Address:'}</strong> {destination.address}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => requestGpsAndRoute(destination, travelMode)}
                  className="btn"
                  style={{
                    padding: '10px 20px',
                    fontSize: 13.5,
                    fontWeight: 700,
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCw size={14} />
                  <span>{isMr ? 'पुन्हा प्रयत्न करा' : 'Try Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalState('manual_picker')}
                  className="btn outline"
                  style={{
                    padding: '10px 18px',
                    fontSize: 13.5,
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                >
                  {isMr ? 'प्रारंभ ठिकाण निवडा' : 'Enter starting location'}
                </button>
              </div>
            </div>
          )}

          {/* 5. MANUAL STARTING LOCATION PICKER */}
          {modalState === 'manual_picker' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {isMr ? 'प्रारंभ ठिकाण निवडा' : 'Enter Starting Location'}
                </h3>
                <button
                  type="button"
                  onClick={() => requestGpsAndRoute(destination, travelMode)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Navigation size={13} />
                  <span>{isMr ? 'माझे GPS वापरा' : 'Use My GPS'}</span>
                </button>
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  placeholder={isMr ? 'उदा. डेक्कन, स्वारगेट, कोथरूड, पुणे स्टेशन…' : 'e.g. Deccan, Swargate, Kothrud, Pune Station…'}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 13.5,
                    outline: 'none',
                  }}
                  autoFocus
                />
              </div>

              {/* Locality suggestions list */}
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {manualList.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectManualLocality(loc)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13.5, color: '#0f172a', display: 'block' }}>
                        {isMr ? loc.nameMr : loc.nameEn}
                      </strong>
                      <span style={{ fontSize: 11.5, color: '#64748b' }}>
                        {isMr ? loc.popularTransitHubMr : loc.popularTransitHubEn}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>
                      {isMr ? 'निवडा →' : 'Select →'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. READY / ROUTE DISPLAY STATE */}
          {modalState === 'ready' && routeResult && origin && (
            <div>
              {/* Origin & Destination Corridor */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#059669', fontSize: 16 }}>📍</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      {isMr ? 'प्रारंभ स्थान' : 'Start'}
                    </span>
                    <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {origin.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalState('manual_picker')}
                    style={{
                      fontSize: 11,
                      color: '#0284c7',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {isMr ? 'बदला' : 'Change'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ color: '#dc2626', fontSize: 16 }}>📌</span>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      {isMr ? 'गंतव्यस्थान' : 'Destination'}
                    </span>
                    <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {destTitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* GPS Low Accuracy Warning */}
              {accuracyEval.isLow && (
                <div
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: 10,
                    padding: '8px 12px',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#92400e',
                  }}
                >
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{isMr ? accuracyEval.warningMr : accuracyEval.warning}</span>
                </div>
              )}

              {/* Travel Mode Selector Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 6,
                  background: '#f1f5f9',
                  padding: 4,
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                {[
                  { mode: 'driving' as TravelMode, icon: Car, label: isMr ? 'गाडी' : 'Drive' },
                  { mode: 'transit' as TravelMode, icon: Bus, label: isMr ? 'बस/मेट्रो' : 'Transit' },
                  { mode: 'walking' as TravelMode, icon: Footprints, label: isMr ? 'पायी' : 'Walk' },
                  { mode: 'bicycling' as TravelMode, icon: Bike, label: isMr ? 'सायकल' : 'Cycle' },
                ].map(({ mode, icon: Icon, label }) => {
                  const isSelected = travelMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleModeChange(mode)}
                      style={{
                        padding: '8px 4px',
                        border: 'none',
                        borderRadius: 8,
                        background: isSelected ? '#ffffff' : 'transparent',
                        color: isSelected ? '#047857' : '#64748b',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: 12,
                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Route Metric Summary Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#047857', letterSpacing: '0.04em' }}>
                    {isMr ? 'शिफारस केलेला मार्ग' : 'Recommended Route'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: '#065f46' }}>
                      {routeResult.durationText}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#047857' }}>
                      • {routeResult.distanceText}
                    </span>
                  </div>
                  {routeResult.trafficNote && (
                    <div style={{ fontSize: 11, color: '#065f46', marginTop: 2 }}>
                      ℹ️ {routeResult.trafficNote}
                    </div>
                  )}
                </div>

                {/* Alternative Route Chip */}
                {routeResult.alternative && (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      padding: '6px 10px',
                      fontSize: 11.5,
                      color: '#475569',
                    }}
                  >
                    <span style={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>
                      {routeResult.alternative.summary}
                    </span>
                    <span>{routeResult.alternative.durationText} · {routeResult.alternative.distanceText}</span>
                  </div>
                )}
              </div>

              {/* Map vs Steps Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: activeTab === 'map' ? '#047857' : '#cbd5e1',
                    background: activeTab === 'map' ? '#047857' : '#ffffff',
                    color: activeTab === 'map' ? '#ffffff' : '#475569',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <MapIcon size={13} />
                  <span>{isMr ? 'नकाशा दृश्य' : 'In-App Map'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('steps')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: activeTab === 'steps' ? '#047857' : '#cbd5e1',
                    background: activeTab === 'steps' ? '#047857' : '#ffffff',
                    color: activeTab === 'steps' ? '#ffffff' : '#475569',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <List size={13} />
                  <span>{isMr ? 'मार्गदर्शक पावले' : 'Turn-by-Turn Steps'}</span>
                </button>
              </div>

              {/* TAB 1: In-App Road Route Map */}
              {activeTab === 'map' && (
                <div
                  style={{
                    height: 260,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    position: 'relative',
                    marginBottom: 16,
                  }}
                >
                  <iframe
                    title={`Route map from ${origin.name} to ${destTitle}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={embedRouteUrl}
                  />
                </div>
              )}

              {/* TAB 2: Turn-by-Turn Steps */}
              {activeTab === 'steps' && (
                <div
                  style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '10px 14px',
                    background: '#ffffff',
                    marginBottom: 16,
                  }}
                >
                  {routeResult.steps && routeResult.steps.length > 0 ? (
                    <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#334155' }}>
                      {routeResult.steps.map((st, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <span style={{ fontWeight: 600 }}>
                            {isMr && st.instructionMr ? st.instructionMr : st.instruction}
                          </span>
                          {st.distanceText && (
                            <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>
                              ({st.distanceText})
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                      {isMr ? 'थेट नेव्हिगेशनसाठी खालील बटण दाबा.' : 'Follow the interactive route to destination.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================
            MODAL FOOTER WITH PROMINENT "START NAVIGATION"
            =================================================================== */}
        {modalState === 'ready' && navUrls && (
          <div
            style={{
              padding: '14px 20px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 12, color: '#64748b' }}>
              📍 {destTitle}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
              <a
                href={navUrls.gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  flex: '1 1 auto',
                  boxShadow: '0 4px 14px rgba(4, 120, 87, 0.28)',
                  transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <span>🚗</span>
                <span>{isMr ? 'थेट नेव्हिगेशन सुरू करा (Start Navigation) ↗' : 'Start Navigation ↗'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
