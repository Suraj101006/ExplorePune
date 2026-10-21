'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  getStoredUserLocation,
  setLocationFromLocality,
  searchPuneLocalities,
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
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentLoc(getStoredUserLocation());
      setGpsMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLocalities = searchPuneLocalities(searchQuery);

  const handleSelectLocality = (loc: PuneLocality) => {
    const saved = setLocationFromLocality(loc.id);
    if (saved) {
      setCurrentLoc(saved);
      onLocationSelected?.(saved);
      onClose();
    }
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
            ? `⚠️ तुमचे GPS स्थान पुण्याच्या बाहेर (${Math.round(res.distanceFromPuneKm || 0)} किमी) आढळले. अचूक स्थानिक बस व मेट्रो मार्गासाठी खालीलपैकी तुमचा पुणे परिसर निवडा.`
            : `⚠️ GPS detected ${Math.round(res.distanceFromPuneKm || 0)} km outside Pune (IP/remote geolocation). For accurate city commute & distances, select your Pune area below.`,
          isError: true,
        });
      } else {
        setGpsMessage({
          text: isMr
            ? `✓ अचूक स्थान नोंदवले: ${res.location.nameMr}`
            : `✓ Location locked: ${res.location.nameEn}`,
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
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGpsClick}
            disabled={isDetectingGps}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1.5px solid #10b981',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              color: '#047857',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: isDetectingGps ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isDetectingGps ? '⏳' : '🎯'}</span>
            <span>
              {isDetectingGps
                ? (isMr ? 'थेट अचूक GPS शोधत आहे…' : 'Acquiring Precise GPS Signal…')
                : (isMr ? 'माझे थेट GPS स्थान वापरा' : 'Detect My Live Precise GPS')}
            </span>
          </button>

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
              placeholder={isMr ? 'पुण्यातील परिसर शोधा (उदा. कोथरूड, वाकड, बाणेर, कॅम्प...)' : 'Search Pune area (e.g. Kothrud, Baner, Wakad, Camp, Viman Nagar)...'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px 10px 36px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
              }}
            />
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

          {/* Localities Directory List */}
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
              {isMr ? `सर्व परिसर (${filteredLocalities.length}):` : `All Pune Localities (${filteredLocalities.length}):`}
            </span>
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
                      background: isSelected ? '#f0fdf4' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                        {isMr ? loc.nameMr : loc.nameEn}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        🚇 {isMr ? loc.popularTransitHubMr : loc.popularTransitHubEn}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                      {isSelected ? '✓ Active' : 'Select'}
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
