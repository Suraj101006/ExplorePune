'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin as MapPinIcon,
  Compass,
  Search,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { palette } from '@/components/experience/tokens/tokens';
import {
  getMapPlacePins,
  getTodaysPeth,
  HISTORIC_PETHS_DATA,
  MapPin,
  PethInfo,
} from '@/lib/experience/selectors';
import { globalChapterRegistry } from '@/lib/experience/registry';
import ExperienceWebGLScene from '@/components/experience/webgl/ExperienceWebGLScene';

const CATEGORIES = [
  { id: 'all', labelEn: 'All 106 Places', labelMr: 'सर्व १०६ ठिकाणे' },
  { id: 'forts', labelEn: 'Forts (15)', labelMr: 'किल्ले (१५)' },
  { id: 'heritage', labelEn: 'Heritage (29)', labelMr: 'ऐतिहासिक (२९)' },
  { id: 'temples', labelEn: 'Temples (27)', labelMr: 'मंदिरे (२७)' },
  { id: 'nature', labelEn: 'Nature & Tekdis (20)', labelMr: 'निसर्ग व टेकड्या (२०)' },
  { id: 'museums', labelEn: 'Museums (9)', labelMr: 'संग्रहालये (९)' },
  { id: 'food', labelEn: 'Food Traditions (6)', labelMr: 'अन्न संस्कृती (६)' },
];

export default function ChapterLivingMap() {
  const { isLiteMode, prefersReducedMotion, isMr } = useExperience();

  // Register Chapter 4 in global chapter registry
  React.useEffect(() => {
    globalChapterRegistry.register({
      id: 'map',
      titleEn: 'Chapter 4: Living Map',
      titleMr: 'प्रकरण ४: जिवंत नकाशा',
      order: 4,
    });
    return () => {
      globalChapterRegistry.unregister('map');
    };
  }, []);

  // All 106 pins from selectors
  const allPins = useMemo(() => getMapPlacePins(), []);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlaceSlug, setSelectedPlaceSlug] = useState<string | null>(null);

  // Today's Peth state
  const todaysPeth = useMemo(() => getTodaysPeth(), []);
  const [activePeth, setActivePeth] = useState<PethInfo>(todaysPeth);
  const [isPethCardOpen, setIsPethCardOpen] = useState<boolean>(true);

  // Selected place object
  const selectedPlace = useMemo(() => {
    if (!selectedPlaceSlug) return null;
    return allPins.find((p) => p.slug === selectedPlaceSlug) || null;
  }, [selectedPlaceSlug, allPins]);

  // Filtered pins
  const filteredPins = useMemo(() => {
    return allPins.filter((pin) => {
      // Category match
      const matchesCat =
        selectedCategory === 'all' ||
        pin.categorySlug === selectedCategory ||
        (selectedCategory === 'nature' && pin.categorySlug === 'parks');

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        pin.name.toLowerCase().includes(query) ||
        pin.nameMr.includes(query) ||
        pin.category.toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    });
  }, [allPins, selectedCategory, searchQuery]);

  // Handle pin click
  const handlePinSelect = useCallback((slug: string) => {
    setSelectedPlaceSlug((prev) => (prev === slug ? null : slug));
  }, []);

  // Highlight places associated with active Peth
  const handleHighlightPethPlaces = useCallback(() => {
    if (activePeth.associatedPlaceSlugs.length > 0) {
      setSelectedPlaceSlug(activePeth.associatedPlaceSlugs[0]);
    }
  }, [activePeth]);

  return (
    <section
      id="chapter-living-map"
      className="exp-chapter-map"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: palette.basalt[950],
        color: palette.basalt[50],
        overflow: 'hidden',
        padding: '3rem 1.5rem',
      }}
      aria-label="Chapter 4: Living Map of Pune"
    >
      {/* Chapter Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto 1.5rem auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            background: 'rgba(234, 88, 12, 0.15)',
            border: `1px solid ${palette.saffron[600]}`,
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: palette.saffron[400],
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.75rem',
          }}
        >
          <Compass size={14} />
          <span>{isMr ? 'प्रकरण ४ • जिवंत नकाशा' : 'CHAPTER 4 • LIVING CARTOGRAPHY'}</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                color: palette.gold[400],
                margin: 0,
                lineHeight: 1.15,
                fontFamily: isMr ? 'var(--exp-font-devanagari)' : 'inherit',
              }}
            >
              {isMr ? '१७ पेठा आणि १०६ प्रमाणित ठिकाणे' : '17 Peths & 106 Sanctuaries'}
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: palette.basalt[300],
                margin: '0.4rem 0 0 0',
                maxWidth: '640px',
              }}
            >
              {isMr
                ? '४५° कोनातून दख्खनच्या कातळावरील पुण्याचा विहंगम नकाशा — सिंहगडापासून शनिवार वाडा आणि मुळा-मुठा नदीपर्यंत.'
                : 'A 45° isometric cartographic flight across Deccan volcanic basalt — from Sinhagad ramparts to Shaniwar Wada courtyards.'}
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              minWidth: '260px',
              maxWidth: '360px',
              width: '100%',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: palette.basalt[400],
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMr ? 'नावानुसार शोधा (उदा. सिंहगड)...' : 'Search 106 places...'}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                background: 'rgba(15, 23, 42, 0.85)',
                border: `1px solid ${palette.stone[700]}`,
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: palette.basalt[400],
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginTop: '1.25rem',
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? palette.saffron[500] : palette.stone[700]}`,
                  background: isActive ? palette.saffron[600] : 'rgba(15, 23, 42, 0.75)',
                  color: isActive ? '#fff' : palette.basalt[300],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isMr ? cat.labelMr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Viewport & 3D Flight Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          height: '620px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          border: `1px solid ${palette.stone[700]}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          background: palette.basalt[900],
        }}
      >
        {/* 3D WebGL Scene in 45° Isometric Map Mode */}
        <ExperienceWebGLScene
          activeChapter="map"
          cameraMode="map"
          selectedPlaceSlug={selectedPlaceSlug}
          onPlaceSelect={handlePinSelect}
          showMapPins={true}
          highlightCategory={selectedCategory}
          className="living-map-3d-canvas"
        />

        {/* TODAY'S PETH FLOATING HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            zIndex: 25,
            maxWidth: '380px',
            background: 'rgba(8, 11, 17, 0.94)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${palette.saffron[600]}`,
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 12px 35px rgba(0,0,0,0.7)',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color={palette.saffron[400]} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: palette.saffron[400],
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {isMr ? 'आजची जिवंत पेठ' : "TODAY'S LIVING PETH"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPethCardOpen(!isPethCardOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: palette.basalt[400],
                cursor: 'pointer',
                padding: '0.2rem',
              }}
              aria-label="Toggle Today's Peth HUD"
            >
              {isPethCardOpen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>

          {/* 7-Day Weekday Quick Select Strip */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '0.75rem',
            }}
          >
            {HISTORIC_PETHS_DATA.map((p) => {
              const isSelected = activePeth.dayOfWeek === p.dayOfWeek;
              const isCurrentDay = todaysPeth.dayOfWeek === p.dayOfWeek;
              return (
                <button
                  key={p.dayOfWeek}
                  type="button"
                  onClick={() => setActivePeth(p)}
                  style={{
                    flex: 1,
                    padding: '0.25rem 0',
                    fontSize: '0.7rem',
                    fontWeight: isSelected ? 700 : 500,
                    borderRadius: '4px',
                    border: isSelected
                      ? `1px solid ${palette.saffron[500]}`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected
                      ? palette.saffron[700]
                      : isCurrentDay
                      ? 'rgba(234, 88, 12, 0.25)'
                      : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#fff' : palette.basalt[300],
                    cursor: 'pointer',
                  }}
                  title={`${p.dayNameEn} - ${p.pethNameEn}`}
                >
                  {isMr ? p.dayNameMr.substring(0, 3) : p.dayNameEn.substring(0, 3)}
                </button>
              );
            })}
          </div>

          {isPethCardOpen && (
            <div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: palette.gold[400],
                  marginBottom: '0.25rem',
                }}
              >
                {isMr ? activePeth.pethNameMr : activePeth.pethNameEn}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: palette.basalt[400],
                  marginBottom: '0.5rem',
                }}
              >
                {activePeth.establishedYear} • {activePeth.establishedBy}
              </div>

              <p
                style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  color: palette.basalt[200],
                  margin: '0 0 0.5rem 0',
                }}
              >
                {isMr ? activePeth.specialtyBazaarMr : activePeth.specialtyBazaarEn}
              </p>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: palette.monsoon[300],
                  background: 'rgba(56, 189, 248, 0.08)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  borderLeft: `2px solid ${palette.monsoon[500]}`,
                  marginBottom: '0.75rem',
                }}
              >
                <strong>{isMr ? 'टीप:' : 'Tip:'}</strong>{' '}
                {isMr ? activePeth.visitorTipMr : activePeth.visitorTipEn}
              </div>

              {activePeth.associatedPlaceSlugs.length > 0 && (
                <button
                  type="button"
                  onClick={handleHighlightPethPlaces}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: palette.saffron[600],
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <MapPinIcon size={13} />
                  <span>{isMr ? 'नकाशावर ठिकाणे दाखवा' : 'Focus Peth Landmarks on 3D Map'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* SELECTED PLACE PREVIEW DRAWER */}
        {selectedPlace && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 30,
              width: '320px',
              maxWidth: 'calc(100% - 2rem)',
              background: 'rgba(8, 11, 17, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.gold[500]}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.85)',
            }}
          >
            {/* Header Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '140px',
                background: palette.basalt[800],
              }}
            >
              <Image
                src={selectedPlace.imageUrl || '/images/places/sinhagad.jpg'}
                alt={selectedPlace.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="320px"
              />
              <button
                type="button"
                onClick={() => setSelectedPlaceSlug(null)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                aria-label="Close Preview"
              >
                <X size={15} />
              </button>

              <div
                style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.5rem',
                  background: palette.saffron[600],
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                {selectedPlace.category}
              </div>
            </div>

            {/* Details Body */}
            <div style={{ padding: '1rem' }}>
              <h4
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: palette.gold[300],
                  margin: '0 0 0.2rem 0',
                }}
              >
                {isMr ? selectedPlace.nameMr : selectedPlace.name}
              </h4>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  color: palette.basalt[300],
                  marginBottom: '0.75rem',
                }}
              >
                <span>📍 {selectedPlace.distanceFromCenterKm} km {isMr ? 'पुण्यापासून' : 'from Center'}</span>
                <span>⭐ {selectedPlace.popularityScore}/100</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link
                  href={`/places/${selectedPlace.slug}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: palette.saffron[600],
                    color: '#fff',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  <span>{isMr ? 'सविस्तर माहिती' : 'Explore Guide'}</span>
                  <ExternalLink size={13} />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedPlaceSlug(null)}
                  style={{
                    padding: '0.55rem 0.8rem',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.08)',
                    color: palette.basalt[200],
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'बंद करा' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 20,
            background: 'rgba(8, 11, 17, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '0.5rem 0.85rem',
            fontSize: '0.75rem',
            color: palette.basalt[300],
            border: `1px solid ${palette.stone[700]}`,
          }}
        >
          <span>{filteredPins.length} {isMr ? 'ठिकाणे दृश्यमान' : 'Sanctuaries Visible'}</span>
        </div>
      </div>

      {/* Directory list of all 106 verified places */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '2rem auto 0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: palette.gold[400],
              margin: 0,
            }}
          >
            {isMr ? 'सर्व प्रमाणित ठिकाणांची सूची' : 'Verified Destinations Directory'} ({filteredPins.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: palette.basalt[400] }}>
            {isMr ? 'ठिकाणावर क्लिक करून ३डी / सविस्तर माहिती पाहा' : 'Click any place to preview on 3D map'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '0.65rem',
            maxHeight: '320px',
            overflowY: 'auto',
            paddingRight: '0.5rem',
          }}
        >
          {filteredPins.map((pin) => {
            const isSelected = selectedPlaceSlug === pin.slug;
            return (
              <button
                key={pin.slug}
                type="button"
                onClick={() => handlePinSelect(pin.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(234, 88, 12, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${isSelected ? palette.saffron[500] : 'rgba(255, 255, 255, 0.08)'}`,
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: palette.basalt[800],
                  }}
                >
                  <Image
                    src={pin.imageUrl || '/images/places/sinhagad.jpg'}
                    alt={pin.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="38px"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isSelected ? palette.gold[300] : palette.basalt[100],
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {isMr ? pin.nameMr : pin.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: palette.basalt[400],
                      display: 'flex',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{pin.category}</span>
                    <span>• {pin.distanceFromCenterKm} km</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
