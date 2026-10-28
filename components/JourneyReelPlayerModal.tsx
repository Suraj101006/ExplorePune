'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { DayJourney } from '@/lib/journeyStorage';
import {
  JourneyReelData,
  ReelVisualScene,
  buildReelPlacesFromJourney,
  buildOneReelSceneSequence,
  getRecommendedMusic,
} from '@/lib/journeyReel';
import { getReelAudioEngine } from '@/lib/reelAudioEngine';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  RotateCcw,
  MapPin,
  Compass,
  Download,
  Film,
  Music,
  Check,
  Copy,
} from 'lucide-react';
import { shareOrCopy } from '@/lib/shareUtils';
import { exportJourneyReelToMP4, RenderProgressUpdate, RenderedVideoResult } from '@/lib/reelVideoExporter';
import { REAL_SONG_CATALOG } from '@/lib/reelSongLibrary';

interface JourneyReelPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: DayJourney | null;
  reelData?: JourneyReelData | null;
  isMr?: boolean;
  onShare?: () => void;
  userName?: string;
}

export default function JourneyReelPlayerModal({
  isOpen,
  onClose,
  journey,
  reelData,
  isMr = false,
  onShare,
  userName = 'Suraj',
}: JourneyReelPlayerModalProps) {
  // Construct dynamic One-Reel data
  const finalReelData = useMemo<JourneyReelData | null>(() => {
    if (reelData) return reelData;
    if (!journey) return null;

    const places = buildReelPlacesFromJourney(journey);
    const { recommended } = getRecommendedMusic(places);

    const titleEn = userName ? `${userName}'s Pune Journey` : journey.title || 'My Pune Journey';
    const titleMr = userName ? `${userName} ची पुणे सफर` : journey.titleMr || 'माझा पुणे प्रवास';

    return {
      id: `reel-${journey.id}`,
      journeyId: journey.id,
      title: titleEn,
      titleMr,
      type: journey.id.includes('today') ? 'today' : 'overall',
      date: journey.dateLabelEn || journey.date,
      places,
      reel: {
        duration: 30,
        music: recommended,
        style: 'cinematic',
        generatedAt: new Date().toISOString(),
      },
    };
  }, [reelData, journey, userName]);

  // Construct Scene sequence
  const { scenes, totalScenes } = useMemo(() => {
    if (!finalReelData) return { scenes: [], totalScenes: 0, estimatedDurationSeconds: 0 };
    return buildOneReelSceneSequence(finalReelData);
  }, [finalReelData]);

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [controlsVisible, setControlsVisible] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);

  // MP4 Export & Social Attribution state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<RenderProgressUpdate | null>(null);
  const [exportedVideo, setExportedVideo] = useState<RenderedVideoResult | null>(null);
  const [copiedAudioTag, setCopiedAudioTag] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioEngine = useRef(getReelAudioEngine());
  const abortControllerRef = useRef<AbortController | null>(null);

  const matchedSong = useMemo(() => {
    return REAL_SONG_CATALOG.find((s) => s.id === finalReelData?.reel.music.id) || null;
  }, [finalReelData]);

  const handleExportMP4 = async () => {
    if (!finalReelData || isExporting) return;
    setIsPaused(true);
    audioEngine.current.pause();
    setIsExporting(true);

    const abortCtrl = new AbortController();
    abortControllerRef.current = abortCtrl;

    setExportProgress({
      percent: 0,
      phase: 'preparing',
      message: 'Initializing cinematic composition...',
      currentFrame: 0,
      totalFrames: 100,
    });

    try {
      const result = await exportJourneyReelToMP4(finalReelData, {
        signal: abortCtrl.signal,
        onProgress: (p) => setExportProgress(p),
      });
      setExportedVideo(result);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // Cancelled by user, silent recovery
      } else {
        console.error('Failed to export video:', err);
        alert(isMr ? 'व्हिडिओ एक्सपोर्ट करताना त्रुटी आली.' : 'Video export could not be completed. Please try again.');
      }
    } finally {
      setIsExporting(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelExport = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExporting(false);
  };

  const handleDownloadVideo = () => {
    if (!exportedVideo) return;
    const a = document.createElement('a');
    a.href = exportedVideo.downloadUrl;
    a.download = exportedVideo.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyAudioTag = () => {
    if (!matchedSong) return;
    const text = matchedSong.socialAudioTag.recommendedSoundName;
    navigator.clipboard?.writeText(text);
    setCopiedAudioTag(true);
    setTimeout(() => setCopiedAudioTag(false), 2500);
  };

  // Determine duration for current scene
  const currentScene = scenes[currentSceneIdx];
  const sceneDurationMs = useMemo(() => {
    if (!currentScene) return 3000;
    if (currentScene.type === 'intro') return 2500;
    if (currentScene.type === 'place_intro') return 1900;
    if (currentScene.type === 'place_photo') return 2800;
    if (currentScene.type === 'outro') return 4500;
    return 3000;
  }, [currentScene]);


  // Audio lifecycle
  useEffect(() => {
    if (isOpen && finalReelData) {
      const musicStyle = finalReelData.reel.music.audioGeneratorType || 'pune_ambient';
      audioEngine.current.start(musicStyle);
      audioEngine.current.setMuted(isMuted);
    } else {
      audioEngine.current.stop();
    }

    return () => {
      audioEngine.current.stop();
    };
  }, [isOpen, finalReelData, isMuted]);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setCurrentSceneIdx(0);
      setSceneProgress(0);
      setIsPaused(false);
      setControlsVisible(true);
    }
  }, [isOpen, finalReelData?.id]);

  // Navigation handlers
  const goToNextScene = useCallback(() => {
    setSceneProgress(0);
    setCurrentSceneIdx((prev) => {
      if (prev + 1 >= totalScenes) {
        setIsPaused(true);
        return prev;
      }
      return prev + 1;
    });
  }, [totalScenes]);

  const goToPrevScene = useCallback(() => {
    setSceneProgress(0);
    setCurrentSceneIdx((prev) => Math.max(0, prev - 1));
  }, []);

  // Scene progress ticker
  useEffect(() => {
    if (!isOpen || totalScenes === 0) return;

    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      audioEngine.current.pause();
      return;
    } else {
      audioEngine.current.resume();
    }

    const intervalStep = 50;
    const increment = (intervalStep / sceneDurationMs) * 100;

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev + increment >= 100) {
          goToNextScene();
          return 0;
        }
        return prev + increment;
      });
    }, intervalStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, sceneDurationMs, totalScenes, goToNextScene]);

  // Auto-hide controls timer
  const resetHideControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      if (!isPaused) {
        setControlsVisible(false);
      }
    }, 2800);
  }, [isPaused]);

  useEffect(() => {
    if (isOpen) {
      resetHideControlsTimer();
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isOpen, resetHideControlsTimer]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideControlsTimer();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      if (e.key === 'ArrowRight') goToNextScene();
      if (e.key === 'ArrowLeft') goToPrevScene();
      if (e.key.toLowerCase() === 'm') {
        setIsMuted((prev) => {
          const next = !prev;
          audioEngine.current.setMuted(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNextScene, goToPrevScene, resetHideControlsTimer]);

  // Share handler
  const handleShareReel = async () => {
    if (onShare) {
      onShare();
      return;
    }
    const title = finalReelData?.title || 'Explore Pune Journey Reel';
    const text = isMr
      ? `माझी पुणे सफर पहा: ${title} • Explore Pune वर!`
      : `Watch my Pune travel reel: ${title} • Explore Pune!`;
    const res = await shareOrCopy({
      title,
      text,
      url: typeof window !== 'undefined' ? window.location.href : 'https://punetrail.web.app/journey',
    });
    if (res === 'shared' || res === 'copied') {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2400);
    }
  };

  if (!isOpen || !finalReelData || totalScenes === 0 || !currentScene) {
    return null;
  }

  const musicTrack = finalReelData.reel.music;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="journey-reel-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Pune Travel Journey Reel"
      onMouseMove={resetHideControlsTimer}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="journey-reel-player-container reel-touchable"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={resetHideControlsTimer}
      >
        {/* ===================================================================
            TOP PROGRESS BAR SEGMENTS (Instagram / TikTok Reel Style)
            =================================================================== */}
        <div
          className={`reel-progress-row ${controlsVisible ? 'opacity-100' : 'opacity-70'}`}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            display: 'flex',
            gap: 4,
            zIndex: 40,
            transition: 'opacity 250ms ease',
          }}
        >
          {scenes.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentSceneIdx(i);
                setSceneProgress(0);
              }}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.28)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width:
                    i < currentSceneIdx
                      ? '100%'
                      : i === currentSceneIdx
                      ? `${sceneProgress}%`
                      : '0%',
                  background: '#10b981',
                  transition: i === currentSceneIdx ? 'width 50ms linear' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* ===================================================================
            TOP BAR HEADER (Brand, Audio Status, Play/Pause, Close)
            =================================================================== */}
        <div
          className="reel-top-bar"
          style={{
            position: 'absolute',
            top: 24,
            left: 14,
            right: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 40,
            color: '#ffffff',
            opacity: controlsVisible ? 1 : 0,
            transform: controlsVisible ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 250ms ease, transform 250ms ease',
            pointerEvents: controlsVisible ? 'auto' : 'none',
          }}
        >
          {/* Left badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.08em',
                background: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#6ee7b7',
                padding: '4px 10px',
                borderRadius: 20,
                backdropFilter: 'blur(10px)',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>🎬</span>
              {isMr ? 'पुणे प्रवास रील्स' : 'Pune Journey Reel'}
            </span>

            {/* Music Info Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: '#e2e8f0',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '3px 8px',
                borderRadius: 14,
                backdropFilter: 'blur(8px)',
                maxWidth: 150,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={`${musicTrack.title} (${musicTrack.license})`}
            >
              <span>🎵</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMr ? musicTrack.titleMr || musicTrack.title : musicTrack.title}
              </span>
            </div>
          </div>

          {/* Right action controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                audioEngine.current.setMuted(nextMuted);
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} color="#34d399" />}
            </button>

            {/* MP4 Download / Export button */}
            <button
              type="button"
              onClick={handleExportMP4}
              disabled={isExporting}
              style={{
                background: 'rgba(16, 185, 129, 0.4)',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                color: '#ffffff',
                height: 32,
                padding: '0 10px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                cursor: isExporting ? 'wait' : 'pointer',
                backdropFilter: 'blur(8px)',
              }}
              title="Export high-resolution MP4 video"
            >
              <Download size={13} />
              <span>MP4</span>
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play size={15} /> : <Pause size={15} />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ===================================================================
            TAP ZONES (Left 35% Prev, Right 65% Next)
            =================================================================== */}
        <div
          onClick={goToPrevScene}
          style={{
            position: 'absolute',
            top: 60,
            bottom: 80,
            left: 0,
            width: '35%',
            zIndex: 30,
            cursor: 'pointer',
          }}
          aria-label="Previous scene"
        />
        <div
          onClick={goToNextScene}
          style={{
            position: 'absolute',
            top: 60,
            bottom: 80,
            right: 0,
            width: '65%',
            zIndex: 30,
            cursor: 'pointer',
          }}
          aria-label="Next scene"
        />

        {/* ===================================================================
            🎬 SCENE 1: OPENING TITLE & TRAVEL OVERVIEW
            =================================================================== */}
        {currentScene.type === 'intro' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 28px',
              background: 'radial-gradient(circle at center, #064e3b 0%, #022c22 65%, #01140e 100%)',
              color: '#ffffff',
              overflow: 'hidden',
            }}
          >
            {/* Topographic pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.18,
                backgroundImage: 'radial-gradient(#34d399 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 340 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '2px solid rgba(52, 211, 153, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  boxShadow: '0 0 35px rgba(16, 185, 129, 0.4)',
                }}
              >
                🧭
              </div>

              <span
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#6ee7b7',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {isMr ? 'पुणे प्रवास आठवण' : 'MY PUNE JOURNEY'}
              </span>

              <h2
                style={{
                  fontSize: 'clamp(26px, 7vw, 34px)',
                  fontWeight: 800,
                  margin: '0 0 12px',
                  color: '#ffffff',
                  lineHeight: 1.25,
                }}
              >
                {isMr ? currentScene.titleMr || currentScene.title : currentScene.title}
              </h2>

              <p
                style={{
                  fontSize: 15,
                  color: '#a7f3d0',
                  margin: '0 auto 24px',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“पुण्याच्या वाटा, ऐतिहासिक गड आणि समृद्ध आठवणी.”'
                  : '“Historical trails, mountain bastions, and living heritage.”'}
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 18px',
                  borderRadius: 24,
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <span>📅 {currentScene.dateLabel}</span>
                <span>•</span>
                <span>📍 {currentScene.placesCount} {isMr ? 'ठिकाणे' : 'Places'}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            🎬 SCENE 2: CINEMATIC PLACE INTRODUCTION SCREEN (Place Billboard)
            =================================================================== */}
        {currentScene.type === 'place_intro' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 24px',
              background: 'linear-gradient(175deg, #020617 0%, #064e3b 80%, #022c22 100%)',
              color: '#ffffff',
              overflow: 'hidden',
            }}
          >
            {/* Background blur of place image */}
            <img
              src={currentScene.place.photos[0] || '/images/places/shaniwar-wada.jpg'}
              alt={currentScene.place.placeName}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(32px) brightness(0.28)',
                transform: 'scale(1.2)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 320 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  color: '#34d399',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                {isMr ? `ठिकाण ${currentScene.placeIndex} / ${currentScene.totalPlaces}` : `STOP ${currentScene.placeIndex} OF ${currentScene.totalPlaces}`}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(32px, 8vw, 42px)',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  margin: '0 0 10px',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  lineHeight: 1.15,
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                }}
              >
                {isMr ? currentScene.place.placeNameMr || currentScene.place.placeName : currentScene.place.placeName}
              </h2>

              <div
                style={{
                  fontSize: 14,
                  color: '#cbd5e1',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {currentScene.place.locationSubtitle || 'Pune, Maharashtra'}
              </div>

              {currentScene.place.elevation && (
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: 11.5,
                    color: '#94a3b8',
                    padding: '3px 10px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {currentScene.place.elevation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            🎬 SCENE 3: PLACE PHOTO WITH KEN BURNS & ELEGANT CAPTION
            =================================================================== */}
        {currentScene.type === 'place_photo' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              background: '#0a0f1d',
            }}
          >
            {/* Background subtle blurred layer (prevents letterboxing for portrait/landscape) */}
            <img
              src={currentScene.photoUrl}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(28px) brightness(0.4)',
                transform: 'scale(1.2)',
              }}
            />

            {/* Foreground crisp photo with smooth Ken Burns zoom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                src={currentScene.photoUrl}
                alt={currentScene.place.placeName}
                className="ken-burns-slow"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Cinematic Gradient Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(10, 15, 26, 0.95) 0%, rgba(10, 15, 26, 0.25) 45%, rgba(10, 15, 26, 0.65) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Caption / Location Card Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 34,
                left: 20,
                right: 20,
                color: '#ffffff',
                zIndex: 20,
              }}
            >
              {/* Category & Time Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isMr ? currentScene.place.categoryNameMr || currentScene.place.categoryName : currentScene.place.categoryName}
                </span>

                {currentScene.place.visitedAt && (
                  <span style={{ fontSize: 12, color: '#e2e8f0', opacity: 0.9 }}>
                    ⏰ {currentScene.place.visitedAt}
                  </span>
                )}

                {currentScene.totalPhotosInPlace > 1 && (
                  <span
                    style={{
                      fontSize: 10.5,
                      color: '#cbd5e1',
                      background: 'rgba(255,255,255,0.18)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    📷 {currentScene.photoIndex} / {currentScene.totalPhotosInPlace}
                  </span>
                )}
              </div>

              {/* Place Name */}
              <h3
                style={{
                  fontSize: 'clamp(22px, 5.5vw, 28px)',
                  fontWeight: 800,
                  margin: '0 0 8px',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                }}
              >
                {isMr
                  ? currentScene.place.placeNameMr || currentScene.place.placeName
                  : currentScene.place.placeName}
              </h3>

              {/* Poetic description / user note */}
              <p
                style={{
                  fontSize: 14,
                  color: '#cbd5e1',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {isMr
                  ? currentScene.place.quoteMr || currentScene.place.quoteEn
                  : currentScene.place.quoteEn}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            🎬 SCENE 4: CLOSING OUTRO RECAP & EXPLORE PUNE BRANDING
            =================================================================== */}
        {currentScene.type === 'outro' && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '70px 24px 34px',
              background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 85%, #022c22 100%)',
              color: '#ffffff',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: '#6ee7b7',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {isMr ? 'सहल सारांश' : 'JOURNEY COMPLETED'}
              </span>

              <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 16px', color: '#ffffff' }}>
                {isMr ? currentScene.journeyTitleMr || currentScene.journeyTitle : currentScene.journeyTitle}
              </h2>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 10px',
                  borderRadius: 16,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#34d399' }}>
                    {currentScene.placesCount}
                  </div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>{isMr ? 'ठिकाणे' : 'Places'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#38bdf8' }}>
                    {Math.round(currentScene.totalDistanceKm)}
                  </div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>km</div>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fbbf24' }}>100%</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>{isMr ? 'अभिमान' : 'Memories'}</div>
                </div>
              </div>

              {/* Places visited pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {currentScene.placesSummary.map((pName, pIdx) => (
                  <span
                    key={pIdx}
                    style={{
                      fontSize: 11.5,
                      background: 'rgba(255, 255, 255, 0.12)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      color: '#e2e8f0',
                    }}
                  >
                    ✓ {pName}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: 14.5,
                  color: '#cbd5e1',
                  margin: '0 0 20px',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {isMr
                  ? '“पुणे हे केवळ शहराचे नाव नाही, ही तुम्ही अनुभवलेली अमर जीवनकथा आहे.”'
                  : '“Pune is not just a place on a map. It is a journey etched in memory.”'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleShareReel}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 18px',
                    borderRadius: 14,
                    background: '#10b981',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 13.5,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Share2 size={16} />
                  {shareSuccess ? (isMr ? 'लिंक कॉपी झाली!' : 'Link Copied!') : isMr ? 'सफर शेअर करा' : 'Share Journey Reel'}
                </button>

                <button
                  type="button"
                  onClick={handleExportMP4}
                  disabled={isExporting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 13.5,
                    border: 'none',
                    cursor: isExporting ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  <Download size={16} />
                  {isMr ? 'MP4 डाऊनलोड' : 'Export MP4'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentSceneIdx(0);
                    setSceneProgress(0);
                    setIsPaused(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: 13.5,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCcw size={15} />
                  {isMr ? 'पुन्हा पहा' : 'Replay'}
                </button>
              </div>

              {/* Branding Footer */}
              <div
                style={{
                  marginTop: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 11.5,
                  color: '#94a3b8',
                }}
              >
                <span>🏛️</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Explore Pune</span>
                <span>• punetrail.web.app</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MP4 EXPORT IN PROGRESS OVERLAY
            =================================================================== */}
        {isExporting && exportProgress && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(12px)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                color: '#34d399',
                animation: 'pulse 1.8s infinite',
              }}
            >
              <Film size={32} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>
              {isMr ? 'सिनेमॅटिक MP4 रील तयार होत आहे...' : 'Exporting Cinematic Travel Reel...'}
            </h3>

            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px', maxWidth: 280 }}>
              {exportProgress.message}
            </p>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                maxWidth: 280,
                height: 8,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                overflow: 'hidden',
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: `${exportProgress.percent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                  borderRadius: 4,
                  transition: 'width 200ms ease',
                }}
              />
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', marginBottom: 16 }}>
              {exportProgress.percent}% {exportProgress.totalFrames > 0 && `(${exportProgress.currentFrame}/${exportProgress.totalFrames} frames)`}
            </div>

            <button
              type="button"
              onClick={handleCancelExport}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isMr ? 'रद्द करा (Cancel)' : 'Cancel Export'}
            </button>
          </div>
        )}

        {/* ===================================================================
            VIDEO EXPORT COMPLETED DIALOG
            =================================================================== */}
        {exportedVideo && !isExporting && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(14px)',
              zIndex: 105,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.25)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                color: '#34d399',
              }}
            >
              <Check size={28} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>
              {isMr
                ? `🎉 ${exportedVideo.format.toUpperCase()} रील सज्ज झाली!`
                : `🎉 ${exportedVideo.format.toUpperCase()} Reel Exported Successfully!`}
            </h3>

            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px', maxWidth: 300 }}>
              {isMr
                ? `९:१६ व्हर्टिकल • ${exportedVideo.format.toUpperCase()} (${exportedVideo.hasAudio ? 'ऑडिओसह' : 'व्हिडिओ'}) • ${Math.round(exportedVideo.durationSec)}s`
                : `9:16 Vertical • ${exportedVideo.format.toUpperCase()} (${exportedVideo.hasAudio ? 'with Audio' : 'Video Only'}) • ${Math.round(exportedVideo.durationSec)}s`}
            </p>

            {/* Social Media Audio Attribution Card */}
            {matchedSong && (
              <div
                style={{
                  width: '100%',
                  maxWidth: 320,
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 20,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>
                  <Music size={13} />
                  <span>{isMr ? 'इन्स्टाग्राम / युट्यूब ऑडिओ टॅग' : 'Official Social Audio Attribution'}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
                  {matchedSong.socialAudioTag.recommendedSoundName}
                </div>
                <button
                  type="button"
                  onClick={handleCopyAudioTag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: copiedAudioTag ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: copiedAudioTag ? '#34d399' : '#ffffff',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copiedAudioTag ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedAudioTag ? (isMr ? 'ऑडिओ टॅग कॉपी झाला!' : 'Audio Tag Copied!') : isMr ? 'ऑडिओ टॅग कॉपी करा' : 'Copy Audio Name'}</span>
                </button>
              </div>
            )}

            {/* Download & Dismiss Buttons */}
            <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320 }}>
              <button
                type="button"
                onClick={handleDownloadVideo}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Download size={16} />
                {isMr ? `${exportedVideo.format.toUpperCase()} डाऊनलोड` : `Download ${exportedVideo.format.toUpperCase()}`}
              </button>

              <button
                type="button"
                onClick={() => setExportedVideo(null)}
                style={{
                  padding: '13px 16px',
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 13,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}
