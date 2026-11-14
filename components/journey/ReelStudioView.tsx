'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Music2,
  Sparkles,
  Sliders,
  Download,
  Save,
  Share2,
  ChevronRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';
import {
  REEL_TEMPLATES_106,
  findReelTemplate,
  getReelTemplateForPlace,
  ReelTemplate106,
} from '@/lib/reelTemplates106';
import {
  REAL_SONG_CATALOG,
  recommendReelSong,
  ReelSongTrack,
} from '@/lib/reelSongLibrary';
import {
  JourneyReelData,
  buildOneReelSceneSequence,
  ReelVisualScene,
  REEL_MUSIC_TRACKS,
  JourneyReelMusicTrack,
} from '@/lib/journeyReel';
import {
  exportJourneyReelToMP4,
  RenderProgressUpdate,
  RenderedVideoResult,
} from '@/lib/reelVideoExporter';
import {
  saveProjectDraft,
  saveRenderedExport,
  ReelProjectDraft,
} from '@/lib/memoryAlbumStorage';

interface ReelStudioViewProps {
  initialPlace?: StructuredPlace | null;
  allPlaces: StructuredPlace[];
  isMr: boolean;
  userId?: string | null;
  initialDraft?: ReelProjectDraft | null;
  onSavedReelCreated?: (exportRecord: any) => void;
}

export default function ReelStudioView({
  initialPlace,
  allPlaces,
  isMr,
  userId,
  initialDraft,
  onSavedReelCreated,
}: ReelStudioViewProps) {
  // Mode selection: 'auto' | 'ai' | 'manual'
  const [studioMode, setStudioMode] = useState<'auto' | 'ai' | 'manual'>('auto');

  // Selected Place
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(
    initialPlace?.id || initialDraft?.placeId || allPlaces[0]?.id || 'shaniwar-wada'
  );

  const selectedPlace = useMemo(() => {
    return allPlaces.find((p) => p.id === selectedPlaceId || p.slug === selectedPlaceId) || allPlaces[0];
  }, [allPlaces, selectedPlaceId]);

  // Selected Template
  const activeTemplate = useMemo<ReelTemplate106>(() => {
    return getReelTemplateForPlace(selectedPlace?.id || selectedPlace?.slug);
  }, [selectedPlace]);

  // Music Selection
  const [selectedSongId, setSelectedSongId] = useState<string>(() => {
    if (initialDraft?.musicTrackId) return initialDraft.musicTrackId;
    const res = recommendReelSong([
      { category: selectedPlace?.category, placeSlug: selectedPlace?.slug },
    ]);
    return res?.recommended?.id || REAL_SONG_CATALOG[0].id;
  });

  const selectedSong = useMemo<ReelSongTrack>(() => {
    return REAL_SONG_CATALOG.find((s) => s.id === selectedSongId) || REAL_SONG_CATALOG[0];
  }, [selectedSongId]);

  // Resolution setting: 1080p or 720p
  const [resolutionTier, setResolutionTier] = useState<'1080p' | '720p'>('720p');

  // Custom text overlays
  const [customTitle, setCustomTitle] = useState(
    initialDraft?.title || (selectedPlace ? (isMr && selectedPlace.name_mr ? selectedPlace.name_mr : selectedPlace.name) : 'Pune Journey')
  );

  // Playback state in 9:16 Canvas
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentActIndex, setCurrentActIndex] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 1
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<RenderProgressUpdate | null>(null);
  const [renderedResult, setRenderedResult] = useState<RenderedVideoResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [saveDraftToast, setSaveDraftToast] = useState(false);

  // Acts list from active template
  const acts = activeTemplate.acts || [];

  // Playback timer loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 0.02;
          const actIdx = Math.min(acts.length - 1, Math.floor(next * acts.length));
          setCurrentActIndex(actIdx);
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, acts.length]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (playbackProgress >= 1) setPlaybackProgress(0);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setPlaybackProgress(0);
    setCurrentActIndex(0);
    setIsPlaying(true);
  };

  // Construct valid JourneyReelData for export
  const currentReelData = useMemo<JourneyReelData>(() => {
    const musicTrack: JourneyReelMusicTrack =
      REEL_MUSIC_TRACKS.find((m) => m.id === selectedSong.id) || REEL_MUSIC_TRACKS[0];

    return {
      id: `reel_${Date.now()}`,
      journeyId: `place_${selectedPlace?.id || 'place'}`,
      title: customTitle,
      type: 'custom',
      date: new Date().toISOString().slice(0, 10),
      places: [
        {
          placeId: selectedPlace?.id || 'place_1',
          placeSlug: selectedPlace?.slug || 'shaniwar-wada',
          placeName: selectedPlace?.name || 'Pune Landmark',
          photos: selectedPlace?.image_url ? [selectedPlace.image_url] : ['/images/places/shaniwar-wada.jpg'],
          category: selectedPlace?.category || 'Heritage',
          isVisited: true,
        },
      ],
      reel: {
        duration: 15,
        music: musicTrack,
        style: 'cinematic',
        generatedAt: new Date().toISOString(),
      },
    };
  }, [selectedPlace, customTitle, selectedSong]);

  // Handle Save Draft
  const handleSaveDraft = () => {
    saveProjectDraft({
      title: customTitle,
      placeId: selectedPlace?.id || 'shaniwar-wada',
      placeName: selectedPlace?.name || 'Pune Landmark',
      templateId: activeTemplate.placeId,
      musicTrackId: selectedSong.id,
      scenes: acts.map((a) => ({
        id: a.actNumber.toString(),
        type: 'place_photo',
        caption: isMr ? a.titleMr : a.titleEn,
        duration: a.durationSec,
      })),
      aspectRatio: '9:16',
      userId: userId || undefined,
    });
    setSaveDraftToast(true);
    setTimeout(() => setSaveDraftToast(false), 3000);
  };

  // Handle Real MP4 Export
  const handleStartExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setRenderedResult(null);

    try {
      const width = resolutionTier === '1080p' ? 1080 : 720;
      const height = resolutionTier === '1080p' ? 1920 : 1280;

      const result = await exportJourneyReelToMP4(currentReelData, {
        song: selectedSong,
        width,
        height,
        fps: 30,
        maxDurationSec: 15,
        onProgress: (p) => setExportProgress(p),
      });

      setRenderedResult(result);

      // Save to Rendered Exports in persistent storage
      const savedExport = saveRenderedExport({
        title: customTitle,
        placeName: selectedPlace?.name,
        downloadUrl: result.downloadUrl,
        filename: result.filename,
        durationSec: result.durationSec,
        format: result.format,
        resolution: resolutionTier,
        userId: userId || undefined,
      });

      if (onSavedReelCreated) {
        onSavedReelCreated(savedExport);
      }
    } catch (err: any) {
      console.error('MP4 Export failed:', err);
      setExportError(err?.message || 'Video export encountered an error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Studio Header Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Film size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'सिनेमॅटिक रील स्टुडिओ (Reel Studio 9:16)' : 'Cinematic Reel Studio 9:16'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? '१०६ पुणे टेम्पलेट्स, अस्सल मराठी संगीत व रिअल MP4 एक्सपोर्ट'
                : '106 Pune templates, authentic Marathi soundtracks, and real MP4 export.'}
            </span>
          </div>
        </div>

        {/* 3 Studio Modes */}
        <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
          {[
            { id: 'auto', label: isMr ? '⚡ ऑटो रील' : '⚡ Auto Create' },
            { id: 'ai', label: isMr ? '🤖 AI असिस्टेड' : '🤖 AI Assisted' },
            { id: 'manual', label: isMr ? '🎛️ मॅन्युअल एडिटर' : '🎛️ Manual Editor' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setStudioMode(mode.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: studioMode === mode.id ? 700 : 500,
                border: 'none',
                background: studioMode === mode.id ? '#ffffff' : 'transparent',
                color: studioMode === mode.id ? '#7c3aed' : '#64748b',
                cursor: 'pointer',
                boxShadow: studioMode === mode.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Two-Column Workspace */}
      <div
        className="reel-studio-workspace"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 360px) 1fr',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Left Column: 9:16 Vertical Video Preview Monitor */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignItems: 'center',
          }}
        >
          {/* 9:16 Canvas Mockup */}
          <div
            style={{
              width: '100%',
              maxWidth: 320,
              aspectRatio: '9/16',
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0f172a',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
              border: '4px solid #1e293b',
            }}
          >
            {/* Background image with simulated Ken Burns zoom */}
            <img
              src={selectedPlace?.image_url || '/images/places/shaniwar-wada.jpg'}
              alt={selectedPlace?.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isPlaying ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 3.5s ease-out',
              }}
            />

            {/* Gradient Overlays */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }}
            />

            {/* Top Reel Info Pill */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🎬</span>
                <span>{selectedPlace?.name}</span>
              </div>

              <div
                style={{
                  padding: '3px 8px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(124, 58, 237, 0.8)',
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {resolutionTier}
              </div>
            </div>

            {/* Center Act Text Typography Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: 20,
                right: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                textAlign: 'center',
                color: '#ffffff',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#fb923c',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                Act {currentActIndex + 1}: {acts[currentActIndex]?.titleEn || 'Pune Story'}
              </span>

              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 900,
                  lineHeight: 1.25,
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                }}
              >
                {isMr && acts[currentActIndex]?.titleMr
                  ? acts[currentActIndex].titleMr
                  : acts[currentActIndex]?.titleEn || customTitle}
              </h3>
            </div>

            {/* Bottom Music Tag */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                fontSize: 11,
              }}
            >
              <Music2 size={13} color="#a855f7" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedSong.title} • {selectedSong.artist}
              </span>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px',
              borderRadius: 14,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <button
              type="button"
              onClick={handleRestart}
              title="Restart"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: '#7c3aed',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
            </button>

            <div style={{ width: 100, height: 6, borderRadius: 3, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${playbackProgress * 100}%`,
                  height: '100%',
                  backgroundColor: '#7c3aed',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            >
              {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>

        {/* Right Column: Controls, Template Selector, Music, and Export Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 1. Destination & Template Selection */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid #e2e8f0',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                {isMr ? '१. ठिकाण व ५-अंकी टेम्पलेट' : '1. Destination & 5-Act Template'}
              </h3>
              <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>
                {activeTemplate.acts.length} Acts Defined
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  {isMr ? 'पुणे ठिकाण निवडा' : 'Select Pune Destination (106)'}
                </label>
                <select
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    background: '#ffffff',
                    outline: 'none',
                  }}
                >
                  {allPlaces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isMr && p.name_mr ? p.name_mr : p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  {isMr ? 'रील शीर्षक' : 'Custom Reel Title'}
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    background: '#ffffff',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Acts breakdown pills */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 6 }}>
              {acts.map((act, i) => (
                <div
                  key={act.actNumber}
                  onClick={() => setCurrentActIndex(i)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: currentActIndex === i ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                    backgroundColor: currentActIndex === i ? '#faf5ff' : '#f8fafc',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#7c3aed' }}>
                    Act {act.actNumber} ({act.durationSec}s)
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                    {isMr ? act.titleMr : act.titleEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Authentic Music Library Selection */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid #e2e8f0',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                {isMr ? '२. अस्सल पुणे ऑडिओ ट्रॅक' : '2. Authentic Soundtrack Library'}
              </h3>
              <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>
                {selectedSong.bpm} BPM • {selectedSong.genre}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {REAL_SONG_CATALOG.slice(0, 4).map((track) => {
                const isSelected = selectedSongId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedSongId(track.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{track.title}</strong>
                      {isSelected && <CheckCircle2 size={15} color="#2563eb" />}
                    </div>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {track.artist} • {track.genre}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Export & Resolution Control Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid #e2e8f0',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                  {isMr ? '३. MP4 व्हिडिओ एक्सपोर्ट' : '3. Real MP4 Video Exporter'}
                </h3>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  {isMr ? 'mp4-muxer सह ९:१६ हाय-डेफिनिशन रेंडरिंग' : 'Full client-side rendering with mp4-muxer'}
                </span>
              </div>

              {/* Resolution Toggle */}
              <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
                <button
                  type="button"
                  onClick={() => setResolutionTier('720p')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: resolutionTier === '720p' ? 700 : 500,
                    border: 'none',
                    background: resolutionTier === '720p' ? '#ffffff' : 'transparent',
                    color: resolutionTier === '720p' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  720p HD
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionTier('1080p')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: resolutionTier === '1080p' ? 700 : 500,
                    border: 'none',
                    background: resolutionTier === '1080p' ? '#ffffff' : 'transparent',
                    color: resolutionTier === '1080p' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  1080p Full HD
                </button>
              </div>
            </div>

            {/* Export Progress Bar */}
            {isExporting && exportProgress && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px', borderRadius: 12, backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: '#7c3aed' }}>
                  <span>{exportProgress.message}</span>
                  <span>{exportProgress.percent}%</span>
                </div>
                <div style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: '#e9d5ff', overflow: 'hidden' }}>
                  <div style={{ width: `${exportProgress.percent}%`, height: '100%', backgroundColor: '#7c3aed', transition: 'width 0.2s ease' }} />
                </div>
              </div>
            )}

            {/* Rendered Result Download & Share */}
            {renderedResult && (
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 14,
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={24} color="#059669" />
                  <div>
                    <strong style={{ fontSize: 14, color: '#065f46', display: 'block' }}>
                      {isMr ? 'MP4 व्हिडिओ तयार झाला आहे!' : 'MP4 Video Rendered Successfully!'}
                    </strong>
                    <span style={{ fontSize: 12, color: '#047857' }}>
                      {renderedResult.filename} • {renderedResult.durationSec.toFixed(1)}s • {renderedResult.width}x{renderedResult.height}
                    </span>
                  </div>
                </div>

                <a
                  href={renderedResult.downloadUrl}
                  download={renderedResult.filename}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Download size={15} />
                  <span>{isMr ? 'व्हिडिओ डाउनलोड करा' : 'Download MP4'}</span>
                </a>
              </div>
            )}

            {exportError && (
              <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} />
                <span>{exportError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Save size={15} />
                <span>{saveDraftToast ? (isMr ? 'मसुदा जतन झाला!' : 'Draft Saved!') : (isMr ? 'मसुदा जतन करा' : 'Save Project Draft')}</span>
              </button>

              <button
                type="button"
                onClick={handleStartExport}
                disabled={isExporting}
                style={{
                  padding: '11px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: isExporting
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  color: '#ffffff',
                  fontSize: 13.5,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)',
                }}
              >
                <Film size={16} />
                <span>{isExporting ? (isMr ? 'व्हिडिओ रेंडर करत आहे…' : 'Rendering MP4…') : (isMr ? 'MP4 व्हिडिओ एक्सपोर्ट करा' : 'Export MP4 Video')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
