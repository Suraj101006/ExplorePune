'use client';

import React, { useState, useEffect } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { useLanguage } from '@/lib/LanguageContext';
import {
  getStoredUserLocation,
  setStoredUserLocation,
  setLocationFromLocality,
  setStaticPuneLocation,
  DEFAULT_PUNE_STATIC_LOCATION,
  detectBrowserGps,
  searchPuneLocalities,
  searchPuneLivePlaces,
  PUNE_ALL_LOCALITIES,
  UserSavedLocation,
  PuneLocality,
} from '@/lib/userLocation';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected?: (loc: UserSavedLocation) => void;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onLocationSelected,
}: LocationPickerModalProps) {
  const { isMr } = useLanguage();
  const [currentLoc, setCurrentLoc] = useState<UserSavedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PuneLocality[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentLoc(getStoredUserLocation() || DEFAULT_PUNE_STATIC_LOCATION);
      setFeedbackMessage(null);
      setSearchResults(searchPuneLocalities(''));
    }
  }, [isOpen]);

  // Live address & locality search with debounce
  useEffect(() => {
    let cancelled = false;
    const clean = searchQuery.trim();

    if (!clean) {
      setSearchResults(searchPuneLocalities(''));
      setIsSearchingLive(false);
      return;
    }

    // Immediate local match
    setSearchResults(searchPuneLocalities(clean));

    if (clean.length >= 3) {
      setIsSearchingLive(true);
      const timer = setTimeout(async () => {
        try {
          const live = await searchPuneLivePlaces(clean);
          if (!cancelled) {
            setSearchResults(live);
          }
        } finally {
          if (!cancelled) setIsSearchingLive(false);
        }
      }, 350);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectLocality = (loc: PuneLocality) => {
    if (loc.id.startsWith('osm-') || loc.id.startsWith('gmap-')) {
      const saved: UserSavedLocation = {
        id: loc.id,
        nameEn: loc.nameEn,
        nameMr: loc.nameMr,
        latitude: loc.latitude,
        longitude: loc.longitude,
        lat: loc.latitude,
        lng: loc.longitude,
        timestamp: Date.now(),
        accuracyRadiusMeters: 10,
        addressDetails: {
          formattedAddress: loc.popularTransitHubEn || loc.nameEn,
          city: 'Pune',
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${loc.latitude.toFixed(6)},${loc.longitude.toFixed(6)}`,
          googleMapsEmbedUrl: `https://www.google.com/maps?q=${loc.latitude.toFixed(6)},${loc.longitude.toFixed(6)}&z=15&output=embed`,
        },
      };
      setStoredUserLocation(saved);
      setCurrentLoc(saved);
      onLocationSelected?.(saved);
      onClose();
      return;
    }

    const saved = setLocationFromLocality(loc.id);
    if (saved) {
      setCurrentLoc(saved);
      onLocationSelected?.(saved);
      onClose();
    }
  };

  const handleDetectLiveGps = async () => {
    setIsLocatingGps(true);
    setGpsError(null);
    setFeedbackMessage(null);

    try {
      const result = await detectBrowserGps();
      if (result.success && result.location) {
        let updatedLoc = result.location;

        // Immediate Google Maps reverse geocode fetch to enrich name & address details
        try {
          const revRes = await fetch(
            `/api/v1/location/reverse?lat=${updatedLoc.latitude}&lng=${updatedLoc.longitude}&lang=${isMr ? 'mr' : 'en'}`
          );
          if (revRes.ok) {
            const revJson = await revRes.json();
            if (revJson.success && revJson.data) {
              const d = revJson.data;
              updatedLoc = {
                ...updatedLoc,
                nameEn: d.nameEn || updatedLoc.nameEn,
                nameMr: d.nameMr || updatedLoc.nameMr,
                addressDetails: {
                  ...updatedLoc.addressDetails,
                  ...d.addressDetails,
                },
              };
              setStoredUserLocation(updatedLoc);
            }
          }
        } catch {
          // Keep existing GPS result
        }

        setCurrentLoc(updatedLoc);
        onLocationSelected?.(updatedLoc);
        setFeedbackMessage(
          isMr
            ? `✓ गुगल मॅप्स स्थान निश्चित झाले! (अचूकता: ±${result.accuracyMeters}m)`
            : `✓ Google Maps verified location locked! (Accuracy: ±${result.accuracyMeters}m)`
        );
        setTimeout(() => onClose(), 1000);
      } else {
        setGpsError(result.error || (isMr ? 'GPS स्थान मिळवता आले नाही.' : 'Could not acquire GPS position.'));
      }
    } catch {
      setGpsError(isMr ? 'GPS सेन्सर सुरू करताना त्रुटी आली.' : 'Failed to connect to device GPS sensor.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  const handleSetCentralPune = () => {
    const saved = setStaticPuneLocation();
    setCurrentLoc(saved);
    onLocationSelected?.(saved);
    setFeedbackMessage(
      isMr
        ? '✓ मध्यवर्ती पुणे (शनिवार वाडा) स्थान यशस्वीरीत्या निवडले!'
        : '✓ Set to Central Pune (Shaniwar Wada) successfully!'
    );
    setTimeout(() => onClose(), 800);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          background: 'var(--card)',
          color: 'var(--ink)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--line-light)',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📍</span>
              <span>{isMr ? 'तुमचा पुणे परिसर निवडा' : 'Select Your Pune Area'}</span>
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
              {isMr
                ? 'नकाशा, मेट्रो, पीएमपीएमएल बसेस आणि अंतर यानुसार मोजले जाईल'
                : 'Distances, Metro & PMPML bus routes update from your chosen area'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Current Active Location - Google Maps Precision Card */}
        {currentLoc && (
          <div
            style={{
              padding: '12px 20px',
              background: 'var(--card-subtle, rgba(16, 185, 129, 0.08))',
              borderBottom: '1px solid var(--line, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink, #0f172a)' }}>
                    {isMr ? currentLoc.nameMr : currentLoc.nameEn}
                  </div>
                  {currentLoc.addressDetails?.formattedAddress && (
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--muted, #64748b)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '280px',
                      }}
                      title={currentLoc.addressDetails.formattedAddress}
                    >
                      {currentLoc.addressDetails.formattedAddress}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    background: currentLoc.isGps ? '#059669' : '#2563eb',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentLoc.isGps
                    ? (isMr ? '🎯 GPS अचूक' : `🎯 GPS (±${currentLoc.accuracyRadiusMeters || 15}m)`)
                    : (isMr ? '🗺️ गुगल मॅप्स' : '🗺️ Google Maps')}
                </span>
                <a
                  href={
                    currentLoc.addressDetails?.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${currentLoc.latitude.toFixed(6)},${currentLoc.longitude.toFixed(6)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2563eb',
                    background: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                  title={isMr ? 'गुगल मॅप्समध्ये उघडा' : 'Open in Google Maps'}
                >
                  <span>{isMr ? 'मॅप्स ↗' : 'Maps ↗'}</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Google Map Preview */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 120,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid var(--line, #cbd5e1)',
                background: 'var(--line-light, #e2e8f0)',
              }}
            >
              <iframe
                title="Active Google Maps Location"
                src={`https://www.google.com/maps?q=${currentLoc.latitude.toFixed(6)},${currentLoc.longitude.toFixed(6)}&z=15&output=embed`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 0,
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quick Location Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {/* Live Device GPS */}
            <button
              type="button"
              onClick={handleDetectLiveGps}
              disabled={isLocatingGps}
              style={{
                position: 'relative',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #10b981',
                background: 'var(--card-subtle, rgba(16, 185, 129, 0.08))',
                color: 'var(--ink, #065f46)',
                textAlign: 'left',
                cursor: isLocatingGps ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.18s var(--ease-standard)',
              }}
            >
              {isLocatingGps && <div className="gps-pulse-outer" />}
              <span style={{ fontSize: 22, position: 'relative' }}>{isLocatingGps ? '🛰️' : '🎯'}</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13, color: '#059669' }}>
                  {isLocatingGps
                    ? (isMr ? 'गुगल मॅप्स स्थान शोधत आहे…' : 'Locating via Google Maps…')
                    : (isMr ? 'थेट डिव्हाइस GPS' : 'Live Device GPS')}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--muted, #059669)' }}>
                  {isLocatingGps
                    ? (isMr ? 'सॅटेलाइट लॉक सुरू आहे' : 'Locking satellite signal…')
                    : (isMr ? 'गुगल मॅप्स अचूक स्थान वापरा' : 'Accurate device coordinates')}
                </span>
              </div>
            </button>

            {/* Quick Default Button: Central Pune */}
            <button
              type="button"
              onClick={handleSetCentralPune}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #3b82f6',
                background: 'var(--card-subtle, rgba(59, 130, 246, 0.08))',
                color: 'var(--ink, #1d4ed8)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 22 }}>📍</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13, color: '#2563eb' }}>
                  {isMr ? 'मध्यवर्ती पुणे (शनिवार वाडा)' : 'Central Pune (Shaniwar Wada)'}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--muted, #3b82f6)' }}>
                  {isMr
                    ? 'सर्व मेट्रो व बस मार्गांसाठी'
                    : 'Best for Metro & Transit'}
                </span>
              </div>
            </button>
          </div>

          {gpsError && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                color: '#b91c1c',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⚠️</span>
              <span>{gpsError}</span>
            </div>
          )}

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#059669',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                color: 'var(--muted, #94a3b8)',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMr
                  ? 'गुगल मॅप्स परिसर किंवा पत्ता शोधा (उदा. एफसी रोड, बाणेर, कोथरूड)...'
                  : 'Search Google Maps location or street (e.g. FC Road, Baner)...'
              }
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: 10,
                border: '1.5px solid var(--line, #cbd5e1)',
                background: 'var(--card, #ffffff)',
                fontSize: 13.5,
                color: 'var(--ink, #0f172a)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
            />
            {isSearchingLive && (
              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 11,
                  color: 'var(--muted, #64748b)',
                }}
              >
                ⏳ {isMr ? 'गुगल मॅप्स शोधत आहे…' : 'Searching Google Maps…'}
              </span>
            )}
          </div>

          {/* Localities List */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--muted, #64748b)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}
            >
              {searchQuery
                ? isMr
                  ? `शोध निकाल (${searchResults.length})`
                  : `Search Results (${searchResults.length})`
                : isMr
                ? 'प्रमुख पुणे उपनगरे व भाग'
                : 'Popular Pune Neighborhoods'}
            </div>

            <div
              style={{
                display: 'grid',
                gap: 6,
                maxHeight: '280px',
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {searchResults.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: 13 }}>
                  {isMr ? 'कोणतेही ठिकाण सापडले नाही.' : 'No matching areas found.'}
                </div>
              ) : (
                searchResults.map((loc) => {
                  const isSelected = currentLoc?.id === loc.id;
                  const isGmap = loc.id.startsWith('gmap-');
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocality(loc)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: isSelected ? '1.5px solid #10b981' : '1px solid var(--line, #e2e8f0)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--card, #ffffff)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: 13.5,
                            color: isSelected ? '#10b981' : 'var(--ink, #0f172a)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isMr ? loc.nameMr : loc.nameEn}
                        </strong>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--muted, #64748b)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {isGmap ? '🗺️ ' : '🚇 '}
                          {isMr ? loc.popularTransitHubMr : loc.popularTransitHubEn}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          color: isSelected
                            ? '#10b981'
                            : isGmap
                            ? '#2563eb'
                            : 'var(--muted, #94a3b8)',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {isSelected
                          ? '✓ ' + (isMr ? 'निवडले' : 'Active')
                          : isGmap
                          ? (isMr ? 'गुगल मॅप्स' : 'Google Maps')
                          : isMr ? loc.zoneMr : loc.zoneEn}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--line, #e2e8f0)',
            background: 'var(--line-light, #f8fafc)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--muted, #64748b)' }}>
            {isMr ? 'गुगल मॅप्स आणि ५०+ पुणे परिसर समर्थित' : 'Powered by Google Maps & 50+ Pune Areas'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn outline"
            style={{ padding: '6px 14px', fontSize: 12.5 }}
          >
            {isMr ? 'बंद करा' : 'Done'}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
