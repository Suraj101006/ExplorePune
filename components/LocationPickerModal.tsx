'use client';

import React, { useState, useEffect } from 'react';
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
    if (loc.id.startsWith('osm-')) {
      const saved: UserSavedLocation = {
        id: loc.id,
        nameEn: loc.nameEn,
        nameMr: loc.nameMr,
        latitude: loc.latitude,
        longitude: loc.longitude,
        lat: loc.latitude,
        lng: loc.longitude,
        timestamp: Date.now(),
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
        setCurrentLoc(result.location);
        onLocationSelected?.(result.location);
        setFeedbackMessage(
          isMr
            ? `✓ थेट GPS स्थान निश्चित झाले! (अचूकता: ±${result.accuracyMeters}m)`
            : `✓ Live GPS Location acquired! (Accuracy: ±${result.accuracyMeters}m)`
        );
        setTimeout(() => onClose(), 900);
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
          background: '#ffffff',
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
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
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

        {/* Current Active Location Bar */}
        {currentLoc && (
          <div
            style={{
              padding: '10px 22px',
              background: '#ecfdf5',
              borderBottom: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12.5,
              color: '#065f46',
            }}
          >
            <span>
              {isMr ? 'सध्या निवडलेले स्थान:' : 'Currently Active:'}{' '}
              <strong style={{ color: '#047857' }}>
                {isMr ? currentLoc.nameMr : currentLoc.nameEn}
              </strong>
            </span>
            <span
              style={{
                fontSize: 10.5,
                background: '#047857',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {isMr ? 'परिसर' : 'Locality'}
            </span>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quick Location Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {/* Live Device GPS */}
            <button
              type="button"
              onClick={handleDetectLiveGps}
              disabled={isLocatingGps}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #10b981',
                background: '#ecfdf5',
                color: '#065f46',
                textAlign: 'left',
                cursor: isLocatingGps ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 24 }}>{isLocatingGps ? '⏳' : '🎯'}</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13.5, color: '#047857' }}>
                  {isLocatingGps
                    ? (isMr ? 'GPS शोधत आहे…' : 'Acquiring GPS…')
                    : (isMr ? 'थेट डिव्हाइस GPS' : 'Live Device GPS')}
                </strong>
                <span style={{ fontSize: 11, color: '#059669' }}>
                  {isLocatingGps
                    ? (isMr ? 'सॅटेलाइट लॉक सुरू आहे' : 'Locking satellite sensors…')
                    : (isMr ? 'अचूक सेन्सर स्थान वापरा' : 'Accurate device coordinates')}
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
                background: '#eff6ff',
                color: '#1d4ed8',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 24 }}>📍</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13.5, color: '#1e40af' }}>
                  {isMr ? 'मध्यवर्ती पुणे (शनिवार वाडा)' : 'Central Pune (Shaniwar Wada)'}
                </strong>
                <span style={{ fontSize: 11, color: '#3b82f6' }}>
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
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
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
                color: '#94a3b8',
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
                  ? 'पुणे परिसर शोधा (उदा. कोथरूड, बाणेर, डेक्कन, हडपसर)...'
                  : 'Search Pune locality (e.g. Kothrud, Baner, Deccan, Hadapsar)...'
              }
              style={{
                width: '100%',
                padding: '11px 14px 11px 40px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13.5,
                color: '#0f172a',
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
                  color: '#64748b',
                }}
              >
                ⏳ {isMr ? 'शोधत आहे…' : 'Searching…'}
              </span>
            )}
          </div>

          {/* Localities List */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#64748b',
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
                maxHeight: '320px',
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {searchResults.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                  {isMr ? 'कोणतेही ठिकाण सापडले नाही.' : 'No matching areas found.'}
                </div>
              ) : (
                searchResults.map((loc) => {
                  const isSelected = currentLoc?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocality(loc)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: 13.5,
                            color: isSelected ? '#065f46' : '#0f172a',
                          }}
                        >
                          {isMr ? loc.nameMr : loc.nameEn}
                        </strong>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          🚇 {isMr ? loc.popularTransitHubMr : loc.popularTransitHubEn}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          color: isSelected ? '#047857' : '#94a3b8',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {isSelected ? '✓ ' + (isMr ? 'निवडले' : 'Active') : isMr ? loc.zoneMr : loc.zoneEn}
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
            padding: '12px 22px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 11.5, color: '#64748b' }}>
            {isMr ? '५०+ पुणे उपनगरे उपलब्ध' : '50+ Pune neighborhoods supported'}
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
  );
}
