'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  getStoredUserLocation,
  setStoredUserLocation,
  setLocationFromLocality,
  setStaticPuneLocation,
  DEFAULT_PUNE_STATIC_LOCATION,
  searchPuneLocalities,
  searchPuneLivePlaces,
  detectPreciseGps,
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
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentLoc(getStoredUserLocation());
      setGpsMessage(null);
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

  const filteredLocalities = searchResults;

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
        isGps: true,
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

  const handleStaticClick = () => {
    const saved = setStaticPuneLocation();
    setCurrentLoc(saved);
    onLocationSelected?.(saved);
    setGpsMessage({
      text: isMr
        ? '✓ कार्यक्षम मध्यवर्ती पुणे स्थान (शनिवार वाडा - 18.5204, 73.8567) यशस्वीरीत्या निवडले!'
        : '✓ Set to 100% Workable Static Pune Location: Central Pune (Shaniwar Wada - 18.5204, 73.8567)!',
    });
    setTimeout(() => onClose(), 900);
  };

  const handleGpsClick = async () => {
    setIsDetectingGps(true);
    setGpsMessage(null);

    const res = await detectPreciseGps();
    setIsDetectingGps(false);

    if (res.success && res.location) {
      setCurrentLoc(res.location);
      onLocationSelected?.(res.location);

      if (res.isOutsidePune) {
        setGpsMessage({
          text: isMr
            ? `ℹ️ तुमचे डिव्हाइस नेटवर्क पुण्याच्या बाहेर (${Math.round(res.distanceFromPuneKm || 0)} किमी) आढळले. अचूक मेट्रो व बस मार्गांसाठी मध्यवर्ती पुणे (शनिवार वाडा) हे स्थान स्वयंचलित सेट केले आहे!`
            : `ℹ️ Remote location detected (${Math.round(res.distanceFromPuneKm || 0)} km from Pune). Auto-set to Central Pune (Shaniwar Wada) so all transit & distances work 100%!`,
          isError: false,
        });
        setTimeout(() => onClose(), 1400);
      } else {
        const accuracyText = res.accuracyMeters ? ` (±${res.accuracyMeters}m)` : '';
        setGpsMessage({
          text: isMr
            ? `✓ अचूक थेट स्थान नोंदवले: ${res.location.nameMr}${accuracyText}`
            : `✓ Live GPS locked: ${res.location.nameEn}${accuracyText}`,
        });
        setTimeout(() => onClose(), 1200);
      }
    } else {
      setGpsMessage({
        text: res.error || (isMr ? 'स्थान शोधता आले नाही.' : 'Unable to acquire GPS.'),
        isError: true,
      });
    }
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
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 18,
          width: '100%',
          maxWidth: 540,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
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
              <span>{isMr ? 'तुमचे अचूक स्थान निवडा' : 'Set Your Exact Location'}</span>
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
              {isMr
                ? 'नकाशा, मेट्रो, पीएमपीएमएल बसेस आणि जवळची ठिकाणे यानुसार अपडेट होतील'
                : 'Distances, Metro & PMPML bus routes update from your exact home area'}
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
                background: currentLoc.isGps ? '#10b981' : '#047857',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {currentLoc.isGps ? (isMr ? 'थेट GPS' : 'GPS Device') : (isMr ? 'परिसर' : 'Locality')}
            </span>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Dual Location Strategy: Live Dynamic GPS vs 100% Workable Static Pune GPS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            {/* 1. Dynamic GPS Button */}
            <button
              type="button"
              onClick={handleGpsClick}
              disabled={isDetectingGps}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #10b981',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                color: '#047857',
                fontSize: 13,
                fontWeight: 700,
                cursor: isDetectingGps ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{isDetectingGps ? '⏳' : '🎯'}</span>
                <span>{isMr ? 'थेट डायनॅमिक GPS' : 'Live Dynamic GPS'}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#059669' }}>
                {isDetectingGps
                  ? (isMr ? 'स्थान शोधत आहे…' : 'Locating device…')
                  : (isMr ? 'ब्राउझर / फोन सेन्सर्स' : 'Browser / Phone Sensors')}
              </span>
            </button>

            {/* 2. 100% Workable Static Pune Location */}
            <button
              type="button"
              onClick={handleStaticClick}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1.5px solid #c2410c',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                color: '#9a3412',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                boxShadow: '0 2px 6px rgba(194, 65, 12, 0.12)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📍</span>
                <span>{isMr ? 'कार्यक्षम स्टॅटिक GPS' : 'Workable Static GPS'}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#c2410c' }}>
                {isMr ? 'मध्यवर्ती शनिवार वाडा (अचूक)' : 'Central Pune (Shaniwar Wada)'}
              </span>
            </button>
          </div>

          {/* GPS Message */}
          {gpsMessage && (
            <div
              style={{
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: gpsMessage.isError ? '#fef2f2' : '#f0fdf4',
                color: gpsMessage.isError ? '#b91c1c' : '#15803d',
                border: `1px solid ${gpsMessage.isError ? '#fecaca' : '#bbf7d0'}`,
                lineHeight: 1.45,
              }}
            >
              {gpsMessage.text}
            </div>
          )}

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                color: '#94a3b8',
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
                  ? 'पुण्यातील कोणताही परिसर, रस्ता किंवा लँडमार्क शोधा…'
                  : 'Search any Pune area, street or landmark (e.g. Kothrud, FC Road, Magarpatta)…'
              }
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 36px 10px 36px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
              }}
            />
            {isSearchingLive && (
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 12,
                  color: '#059669',
                }}
                title="Searching OpenStreetMap live..."
              >
                ⏳
              </span>
            )}
          </div>

          {/* Quick Popular Localities */}
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
              {isMr ? 'लोकप्रिय मुख्य परिसर:' : 'Popular Pune Localities:'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PUNE_ALL_LOCALITIES.slice(0, 12).map((loc) => {
                const isSelected = currentLoc?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocality(loc)}
                    style={{
                      border: isSelected ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#065f46' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isMr ? loc.nameMr.split('/')[0].trim() : loc.nameEn.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Localities & Live Places Directory List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? `परिसर व ठिकाणे (${filteredLocalities.length}):` : `Areas & Landmarks (${filteredLocalities.length}):`}
              </span>
              {isSearchingLive && (
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                  🌐 {isMr ? 'थेट GPS शोधत आहे…' : 'Searching live map…'}
                </span>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: 220,
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {filteredLocalities.map((loc) => {
                const isSelected = currentLoc?.id === loc.id;
                const isLiveOsm = loc.id.startsWith('osm-');
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocality(loc)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : isLiveOsm ? '#f8fafc' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.12s ease',
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isLiveOsm ? '📍 ' : ''}{isMr ? loc.nameMr : loc.nameEn}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isLiveOsm
                          ? `🌐 GPS: ${loc.latitude.toFixed(4)}°, ${loc.longitude.toFixed(4)}°`
                          : `🚇 ${isMr ? loc.popularTransitHubMr : loc.popularTransitHubEn}`}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: isSelected ? '#059669' : '#475569',
                        fontWeight: 700,
                        flexShrink: 0,
                        background: isLiveOsm ? '#ecfdf5' : 'transparent',
                        padding: isLiveOsm ? '2px 6px' : '0',
                        borderRadius: 4,
                      }}
                    >
                      {isSelected ? '✓ Active' : isLiveOsm ? 'Live GPS' : 'Select'}
                    </span>
                  </button>
                );
              })}
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
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn"
            style={{ padding: '6px 18px', fontSize: 13, borderRadius: 8 }}
          >
            {isMr ? 'पूर्ण झाले' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
