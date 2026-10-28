'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DayJourney, JourneyPlaceStop } from '@/lib/journeyStorage';
import {
  JourneyReelData,
  JourneyReelMusicTrack,
  REEL_MUSIC_TRACKS,
  ReelPlaceItem,
  buildReelPlacesFromJourney,
  getRecommendedMusic,
  saveGeneratedReel,
  saveCustomPlacePhotos,
  compressUploadedPhoto,
} from '@/lib/journeyReel';
import { getReelAudioEngine } from '@/lib/reelAudioEngine';
import {
  X,
  Sparkles,
  Camera,
  Music,
  Sliders,
  CheckCircle2,
  Play,
  Film,
  Pause,
  Upload,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface CreateJourneyReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeys: DayJourney[];
  todayJourney: DayJourney | null;
  onReelGenerated: (reel: JourneyReelData) => void;
  isMr?: boolean;
  userName?: string;
  initialMode?: 'today' | 'overall';
}

type Step = 'journey_select' | 'photos_review' | 'style_music' | 'generating';

export default function CreateJourneyReelModal({
  isOpen,
  onClose,
  journeys,
  todayJourney,
  onReelGenerated,
  isMr = false,
  userName = 'Suraj',
  initialMode = 'today',
}: CreateJourneyReelModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('journey_select');
  const [journeyScope, setJourneyScope] = useState<'today' | 'overall' | 'custom'>(
    initialMode === 'today' && todayJourney ? 'today' : 'overall'
  );

  // Selected places for the reel
  const [placesList, setPlacesList] = useState<ReelPlaceItem[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<Set<string>>(new Set());

  // Selected Style & Music
  const [reelStyle, setReelStyle] = useState<'cinematic' | 'adventure' | 'heritage' | 'spiritual' | 'food' | 'nature' | 'minimal'>('cinematic');
  const [selectedMusic, setSelectedMusic] = useState<JourneyReelMusicTrack>(REEL_MUSIC_TRACKS[0]);
  const [previewingMusicId, setPreviewingMusicId] = useState<string | null>(null);
  const [musicLanguageFilter, setMusicLanguageFilter] = useState<'all' | 'marathi' | 'hindi' | 'ambient'>('all');
  const [selectedSection, setSelectedSection] = useState<'intro' | 'verse' | 'drop'>('verse');

  // Generation Loading Animation State (5 progressive steps)
  const [genPhase, setGenPhase] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadPlaceId, setActiveUploadPlaceId] = useState<string | null>(null);
  const audioEngine = useRef(getReelAudioEngine());

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Derive target journey / places when journeyScope changes
  useEffect(() => {
    if (!isOpen) return;

    let targetPlaces: ReelPlaceItem[] = [];

    if (journeyScope === 'today' && todayJourney) {
      targetPlaces = buildReelPlacesFromJourney(todayJourney);
    } else {
      // Overall journey: collect all visited places across all journeys
      const seen = new Set<string>();
      const stops: JourneyPlaceStop[] = [];

      for (const j of journeys) {
        for (const p of j.places) {
          if (p.isVisited && !seen.has(p.placeId)) {
            seen.add(p.placeId);
            stops.push(p);
          }
        }
      }

      // If no visited places recorded yet, fallback to earliest journey stops
      if (stops.length === 0 && journeys.length > 0) {
        stops.push(...journeys[0].places);
      }

      targetPlaces = buildReelPlacesFromJourney({
        id: 'overall-journey',
        date: new Date().toISOString().slice(0, 10),
        dateLabelEn: 'Overall Pune Exploration',
        dateLabelMr: 'पुणे समग्र सफर',
        title: 'Complete Pune Exploration',
        titleMr: 'पुणे समग्र प्रवास',
        travelMode: 'public_transit',
        status: 'completed',
        totalDistanceKm: 28,
        totalDurationMinutes: 360,
        startLocation: 'Pune',
        places: stops,
      });
    }

    setPlacesList(targetPlaces);
    setSelectedPlaceIds(new Set(targetPlaces.map((p) => p.placeId)));

    // Auto-recommend music based on places
    const { recommended } = getRecommendedMusic(targetPlaces);
    setSelectedMusic(recommended);
    setCurrentStep('journey_select');
  }, [isOpen, journeyScope, todayJourney, journeys]);

  // Cleanup audio preview when closing modal
  useEffect(() => {
    if (!isOpen) {
      audioEngine.current.stop();
      setPreviewingMusicId(null);
    }
  }, [isOpen]);

  // Toggle music preview
  const handleToggleMusicPreview = (track: JourneyReelMusicTrack) => {
    if (previewingMusicId === track.id) {
      audioEngine.current.stop();
      setPreviewingMusicId(null);
    } else {
      audioEngine.current.start(track.audioGeneratorType);
      setPreviewingMusicId(track.id);
    }
  };

  // Toggle place inclusion
  const togglePlaceSelection = (placeId: string) => {
    setSelectedPlaceIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        if (next.size > 1) {
          next.delete(placeId);
        }
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  // Handle photo upload for a place
  const handleUploadPhotoClick = (placeId: string) => {
    setActiveUploadPlaceId(placeId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadPlaceId) return;
    setUploadError(null);

    try {
      const compressedUrls: string[] = [];
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        const compressed = await compressUploadedPhoto(file);
        compressedUrls.push(compressed);
      }

      if (compressedUrls.length > 0) {
        setPlacesList((prev) =>
          prev.map((p) => {
            if (p.placeId === activeUploadPlaceId) {
              const updatedPhotos = [...compressedUrls, ...p.photos];
              saveCustomPlacePhotos(p.placeId, updatedPhotos);
              return { ...p, photos: updatedPhotos };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.warn('Failed to compress uploaded photo:', err);
      const msg = err?.message || 'Failed to process photo upload.';
      setUploadError(msg);
      alert(isMr ? `फोटो अपलोड त्रुटी: ${msg}` : `Photo upload error: ${msg}`);
    }
  };

  // Delete a photo from a place
  const handleDeletePhoto = (placeId: string, photoIdx: number) => {
    setPlacesList((prev) =>
      prev.map((p) => {
        if (p.placeId === placeId) {
          const updated = p.photos.filter((_, idx) => idx !== photoIdx);
          saveCustomPlacePhotos(p.placeId, updated);
          return {
            ...p,
            photos: updated.length > 0 ? updated : ['/images/places/shaniwar-wada.jpg'],
          };
        }
        return p;
      })
    );
  };

  // Start generation animation sequence
  const handleStartGeneration = () => {
    audioEngine.current.stop();
    setPreviewingMusicId(null);
    setCurrentStep('generating');
    setGenPhase(0);

    // Sequence the travel-themed loading phases:
    // 0: "Collecting your memories..." (0ms)
    // 1: "Arranging your places..." (600ms)
    // 2: "Matching the music..." (1200ms)
    // 3: "Adding cinematic transitions..." (1700ms)
    // 4: "Your reel is ready!" (2300ms)
    setTimeout(() => setGenPhase(1), 600);
    setTimeout(() => setGenPhase(2), 1200);
    setTimeout(() => setGenPhase(3), 1700);
    setTimeout(() => setGenPhase(4), 2300);

    setTimeout(() => {
      // Build final Reel Data
      const activePlaces = placesList.filter((p) => selectedPlaceIds.has(p.placeId));
      const finalTitle = isMr
        ? `${userName} ची पुणे सफर`
        : journeyScope === 'today'
        ? `${userName}'s Today's Journey`
        : `${userName}'s Pune Travel Reel`;

      const reel: JourneyReelData = {
        id: `reel-${Date.now()}`,
        journeyId: journeyScope === 'today' ? (todayJourney?.id || 'today') : 'overall',
        title: finalTitle,
        titleMr: `${userName} ची पुणे सफर`,
        type: journeyScope === 'today' ? 'today' : 'overall',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        places: activePlaces,
        reel: {
          duration: Math.max(18, activePlaces.length * 6),
          music: selectedMusic,
          style: reelStyle,
          generatedAt: new Date().toISOString(),
        },
      };

      saveGeneratedReel(reel);
      onReelGenerated(reel);
      onClose();
    }, 2800);
  };

  if (!isOpen) return null;

  const activePlacesCount = placesList.filter((p) => selectedPlaceIds.has(p.placeId)).length;

  return (
    <div
      className="journey-reel-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Create Journey Reel"
      onClick={(e) => {
        if (e.target === e.currentTarget && currentStep !== 'generating') onClose();
      }}
    >
      {/* Hidden file input for uploading place photos */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <div
        className="create-reel-modal-card"
        style={{
          position: 'relative',
          width: 'min(94vw, 620px)',
          maxHeight: 'min(90dvh, 760px)',
          margin: 'auto',
          borderRadius: 20,
          background: '#0f172a',
          color: '#ffffff',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================
            MODAL HEADER
            =================================================================== */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              <Film size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isMr ? 'पुणे प्रवास रील' : 'Explore Pune One-Reel'}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMr ? 'पुणे प्रवास रील तयार करा' : 'Create Pune Journey Reel'}
              </h2>
            </div>
          </div>

          {currentStep !== 'generating' && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ===================================================================
            STEP 1: SELECT JOURNEY SCOPE & VISITED PLACES
            =================================================================== */}
        {currentStep === 'journey_select' && (
          <div
            style={{
              padding: '20px 24px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {/* Scope Switcher: Today's Journey vs Overall Journey */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: 4,
                borderRadius: 14,
                marginBottom: 20,
              }}
            >
              <button
                type="button"
                onClick={() => setJourneyScope('today')}
                disabled={!todayJourney}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: todayJourney ? 'pointer' : 'not-allowed',
                  opacity: todayJourney ? 1 : 0.45,
                  background: journeyScope === 'today' ? '#10b981' : 'transparent',
                  color: '#ffffff',
                  transition: 'background 180ms ease',
                }}
              >
                {isMr ? "आजची सफर (Today's)" : "Today's Journey"}
              </button>

              <button
                type="button"
                onClick={() => setJourneyScope('overall')}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: journeyScope === 'overall' ? '#10b981' : 'transparent',
                  color: '#ffffff',
                  transition: 'background 180ms ease',
                }}
              >
                {isMr ? 'एकूण सफर (Overall)' : 'Overall Journey'}
              </button>
            </div>

            {/* Places List Checklist */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                  {isMr ? 'समाविष्ट करायची ठिकाणे:' : 'Places Included in Reel:'}
                </span>
                <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
                  {activePlacesCount} {isMr ? 'निवडले' : 'Selected'}
                </span>
              </div>

              {placesList.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 16,
                    color: '#94a3b8',
                    fontSize: 13,
                  }}
                >
                  {isMr
                    ? 'या सफरीत अद्याप कोणतीही ठिकाणे नाहीत. सहल आखा किंवा चेक-इन करा!'
                    : 'No visited stops found yet. Plan an itinerary or check in at a Pune landmark!'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {placesList.map((place, idx) => {
                    const isSelected = selectedPlaceIds.has(place.placeId);
                    return (
                      <div
                        key={place.placeId}
                        onClick={() => togglePlaceSelection(place.placeId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 14px',
                          borderRadius: 14,
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1.5px solid ${isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                          cursor: 'pointer',
                          transition: 'all 160ms ease',
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: isSelected ? '#10b981' : 'transparent',
                            border: `2px solid ${isSelected ? '#10b981' : '#64748b'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <span style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>✓</span>}
                        </div>

                        <img
                          src={place.photos[0] || '/images/places/shaniwar-wada.jpg'}
                          alt={place.placeName}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            objectFit: 'cover',
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {isMr ? place.placeNameMr || place.placeName : place.placeName}
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            {place.categoryName || 'Heritage'} • {place.photos.length} {isMr ? 'फोटो' : 'photo(s)'}
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: '#64748b' }}>Stop {idx + 1}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 2: REVIEW PHOTOS & UPLOAD CUSTOM PHOTOS
            =================================================================== */}
        {currentStep === 'photos_review' && (
          <div
            style={{
              padding: '20px 24px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>
              {isMr
                ? 'प्रत्येक ठिकाणासाठी तुमचे प्रत्यक्ष काढलेले फोटो जोडा. फोटो नसतील तर अस्सल पुणे फोटो वापरले जातील.'
                : 'Upload your real camera photos for each place. Authentic Pune landmark photos are pre-loaded by default.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {placesList
                .filter((p) => selectedPlaceIds.has(p.placeId))
                .map((place) => (
                  <div
                    key={place.placeId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                        {isMr ? place.placeNameMr || place.placeName : place.placeName}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUploadPhotoClick(place.placeId)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '5px 10px',
                          borderRadius: 8,
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(52, 211, 153, 0.4)',
                          color: '#6ee7b7',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={13} />
                        {isMr ? 'फोटो जोडा' : 'Add Photos'}
                      </button>
                    </div>

                    {/* Photos Thumbnail Strip */}
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                      {place.photos.map((url, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            position: 'relative',
                            width: 72,
                            height: 72,
                            borderRadius: 10,
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          <img
                            src={url}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {place.photos.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(place.placeId, pIdx)}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: 'rgba(0, 0, 0, 0.7)',
                                border: 'none',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                              title="Remove photo"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 3: CHOOSE REEL STYLE & SMART PLACE MUSIC
            =================================================================== */}
        {currentStep === 'style_music' && (
          <div
            style={{
              padding: '20px 24px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {/* Visual Style Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
                {isMr ? 'रील दृश्य शैली (Reel Style):' : 'Reel Visual Mood:'}
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {[
                  { id: 'cinematic', label: '🎬 Cinematic Wonder', desc: 'Slow Ken Burns & golden hour tone' },
                  { id: 'adventure', label: '⚔️ Sahyadri Bastion', desc: 'High octane, mountain mist' },
                  { id: 'heritage', label: '🏛️ Peshwa Royalty', desc: '18th-century court & teakwood' },
                  { id: 'spiritual', label: '🕉️ Sacred Solace', desc: 'Temple bells & bansuri peace' },
                  { id: 'food', label: '🍲 Puneri Food Trail', desc: 'Spicy misal & street rhythms' },
                  { id: 'nature', label: '🌊 Lakeside Bliss', desc: 'Serene ripples & hill breeze' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setReelStyle(s.id as any)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 12,
                      background: reelStyle === s.id ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1.5px solid ${reelStyle === s.id ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Music Recommendation with Real Vocals & Language Filter */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <label style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                  {isMr ? 'अस्सल गाणी व संगीत (Real Songs):' : 'Authentic Real Songs & Vocals:'}
                </label>
                <span
                  style={{
                    fontSize: 10.5,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                >
                  ✓ Authorized & Legal
                </span>
              </div>

              {/* Language Filters */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[
                  { id: 'all', label: 'All Songs' },
                  { id: 'marathi', label: 'मराठी (Marathi)' },
                  { id: 'hindi', label: 'हिंदी (Hindi)' },
                  { id: 'ambient', label: 'Ambient & Classical' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMusicLanguageFilter(tab.id as any)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: musicLanguageFilter === tab.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      transition: 'background 150ms ease',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {REEL_MUSIC_TRACKS.filter((track) => {
                  if (musicLanguageFilter === 'marathi') return track.vocalLanguage?.toLowerCase().includes('marathi');
                  if (musicLanguageFilter === 'hindi') return track.vocalLanguage?.toLowerCase().includes('hindi');
                  if (musicLanguageFilter === 'ambient') return !track.isCulturalVocalTheme;
                  return true;
                }).map((track) => {
                  const isSelected = selectedMusic.id === track.id;
                  const isPreviewing = previewingMusicId === track.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedMusic(track)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        padding: '10px 14px',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1.5px solid ${isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* Play/Stop Audio Preview Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMusicPreview(track);
                            }}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: isPreviewing ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                              border: 'none',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            aria-label={isPreviewing ? 'Stop music preview' : 'Play music preview'}
                          >
                            {isPreviewing ? <Pause size={14} /> : <Play size={14} fill="#ffffff" />}
                          </button>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff' }}>
                                {isMr ? track.titleMr || track.title : track.title}
                              </span>
                              {track.isCulturalVocalTheme && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: '#facc15',
                                    background: 'rgba(250, 204, 21, 0.15)',
                                    padding: '1px 6px',
                                    borderRadius: 6,
                                  }}
                                >
                                  🎼 {track.vocalLanguage}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                              {track.artist} • {track.source}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: '#34d399',
                              background: 'rgba(16, 185, 129, 0.2)',
                              padding: '3px 8px',
                              borderRadius: 10,
                            }}
                          >
                            Selected
                          </span>
                        )}
                      </div>

                      {/* Song Section Selector if Selected */}
                      {isSelected && (
                        <div
                          style={{
                            marginTop: 4,
                            paddingTop: 8,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span style={{ fontSize: 11.5, color: '#cbd5e1', fontWeight: 600 }}>
                            {isMr ? 'सुरुवात विभाग निवडा:' : 'Reel Sync Section:'}
                          </span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {[
                              { id: 'intro', label: 'Intro (वातावरण)' },
                              { id: 'verse', label: 'Verse (काव्य बोल)' },
                              { id: 'drop', label: 'Beat Drop (ढोल कळस)' },
                            ].map((sec) => (
                              <button
                                key={sec.id}
                                type="button"
                                onClick={() => setSelectedSection(sec.id as any)}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 8,
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: selectedSection === sec.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                                  color: '#ffffff',
                                }}
                              >
                                {sec.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 4: TRAVEL-THEMED LOADING GENERATION ANIMATION
            =================================================================== */}
        {currentStep === 'generating' && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {/* Spinning Travel Compass */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '2px solid rgba(52, 211, 153, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                marginBottom: 24,
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.35)',
                animation: 'spin 4s linear infinite',
              }}
            >
              🧭
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px', color: '#ffffff' }}>
              {isMr ? 'पुणे प्रवास रील तयार होत आहे...' : 'Creating Your Journey Reel...'}
            </h3>

            {/* Cinematic step progression indicator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 320,
                width: '100%',
                textAlign: 'left',
                marginTop: 12,
              }}
            >
              {[
                { phase: 0, text: isMr ? '📸 तुमच्या आठवणी गोळा करत आहोत' : 'Collecting your memories' },
                { phase: 1, text: isMr ? '🗺️ ऐतिहासिक स्थाने क्रमाने मांडत आहोत' : 'Arranging your places' },
                { phase: 2, text: isMr ? '🎵 वातावरणास साजेसे संगीत जुळवत आहोत' : 'Matching the music' },
                { phase: 3, text: isMr ? '✨ सिनेमॅटिक ट्रान्झिशन्स जोडत आहोत' : 'Adding cinematic transitions' },
                { phase: 4, text: isMr ? '🎬 तुमचा रील सज्ज झाला आहे!' : 'Your reel is ready' },
              ].map((item) => {
                const isDone = genPhase > item.phase;
                const isCurrent = genPhase === item.phase;

                return (
                  <div
                    key={item.phase}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 13,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isDone ? '#34d399' : isCurrent ? '#ffffff' : '#64748b',
                      opacity: isDone || isCurrent ? 1 : 0.45,
                      transition: 'all 250ms ease',
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: isDone ? '#10b981' : isCurrent ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                        border: `1.5px solid ${isDone || isCurrent ? '#10b981' : '#64748b'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                      }}
                    >
                      {isDone ? '✓' : ''}
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL FOOTER (Next / Back / Generate Buttons)
            =================================================================== */}
        {currentStep !== 'generating' && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {currentStep === 'journey_select' ? (
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                {activePlacesCount} {isMr ? 'ठिकाणे निवडली' : 'places selected'}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  audioEngine.current.stop();
                  setPreviewingMusicId(null);
                  if (currentStep === 'photos_review') setCurrentStep('journey_select');
                  if (currentStep === 'style_music') setCurrentStep('photos_review');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={14} />
                {isMr ? 'मागे' : 'Back'}
              </button>
            )}

            {currentStep === 'journey_select' && (
              <button
                type="button"
                disabled={activePlacesCount === 0}
                onClick={() => setCurrentStep('photos_review')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: activePlacesCount > 0 ? '#10b981' : '#334155',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: activePlacesCount > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                <span>{isMr ? 'पुढील: फोटो' : 'Next: Photos'}</span>
                <ArrowRight size={14} />
              </button>
            )}

            {currentStep === 'photos_review' && (
              <button
                type="button"
                onClick={() => setCurrentStep('style_music')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>{isMr ? 'पुढील: संगीत व शैली' : 'Next: Style & Music'}</span>
                <ArrowRight size={14} />
              </button>
            )}

            {currentStep === 'style_music' && (
              <button
                type="button"
                onClick={handleStartGeneration}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Sparkles size={16} />
                <span>{isMr ? 'रील तयार करा' : 'Generate One Reel'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
