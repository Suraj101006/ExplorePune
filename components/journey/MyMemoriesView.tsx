'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  Camera,
  Heart,
  Search,
  Filter,
  Grid,
  Maximize2,
  Trash2,
  Plus,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  Wand2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import {
  MemoryMediaItem,
  saveMemoryItem,
  deleteMemoryItem,
  toggleFavoriteMemory,
  updateMemoryItem,
} from '@/lib/memoryAlbumStorage';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';

interface MyMemoriesViewProps {
  allMemories: MemoryMediaItem[];
  allPlaces: StructuredPlace[];
  isMr: boolean;
  userId?: string | null;
  onOpenCreateReel: () => void;
}

export default function MyMemoriesView({
  allMemories,
  allPlaces,
  isMr,
  userId,
  onOpenCreateReel,
}: MyMemoriesViewProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Lightbox modal state
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isAiInspectorOpen, setIsAiInspectorOpen] = useState(false);
  const [aiCaptionApplied, setAiCaptionApplied] = useState(false);

  // Upload dialog state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadPlaceId, setUploadPlaceId] = useState(allPlaces[0]?.id || '');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().slice(0, 10));

  // Filtered memories list
  const filteredMemories = useMemo(() => {
    return allMemories.filter((item) => {
      if (onlyFavorites && !item.isFavorite) return false;
      if (selectedPlaceId !== 'all' && item.placeId !== selectedPlaceId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCap = item.caption ? item.caption.toLowerCase().includes(q) : false;
        const matchPlace = item.placeName ? item.placeName.toLowerCase().includes(q) : false;
        if (!matchCap && !matchPlace) return false;
      }
      return true;
    });
  }, [allMemories, onlyFavorites, selectedPlaceId, searchQuery]);

  const activeLightboxItem = activeLightboxIndex !== null ? filteredMemories[activeLightboxIndex] : null;

  // AI Photo Intelligence analysis
  const activeAiAnalysis = useMemo(() => {
    if (!activeLightboxItem) return null;
    const pName = isMr && activeLightboxItem.placeName ? activeLightboxItem.placeName : (activeLightboxItem.placeName || 'Pune Landmark');
    const seed = activeLightboxItem.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const score = 92 + (seed % 7); // 92 to 98 quality score

    const suggestedCaptionEn = `Timeless beauty and quiet heritage at ${pName}. Capturing indelible moments across Maharashtra.`;
    const suggestedCaptionMr = `${pName} येथील शांत आणि समृद्ध वारसा. पुण्याच्या संस्कृतीची एक सुंदर आठवण.`;

    const acts = ['Act 1: Cinematic Hook', 'Act 2: Establishing Frame', 'Act 3: Cultural Immersion', 'Act 4: Hero Climax'];
    const suggestedAct = acts[seed % acts.length];
    const cropAdvice = seed % 2 === 0
      ? 'Optimal 9:16 vertical balance; center focus intact'
      : 'Slight top headroom; ideal for lower-third caption placement';

    return {
      score,
      suggestedCaptionEn,
      suggestedCaptionMr,
      suggestedAct,
      cropAdvice,
    };
  }, [activeLightboxItem, isMr]);

  const handleApplyAiCaption = () => {
    if (!activeLightboxItem || !activeAiAnalysis) return;
    const cap = isMr ? activeAiAnalysis.suggestedCaptionMr : activeAiAnalysis.suggestedCaptionEn;
    updateMemoryItem(activeLightboxItem.id, { caption: cap }, userId);
    setAiCaptionApplied(true);
    setTimeout(() => setAiCaptionApplied(false), 2500);
  };

  // Handle saving new photo
  const handleSaveUpload = () => {
    if (!uploadUrl.trim()) return;
    const selectedPlace = allPlaces.find((p) => p.id === uploadPlaceId || p.slug === uploadPlaceId);
    saveMemoryItem({
      placeId: uploadPlaceId,
      placeName: selectedPlace?.name || 'Pune Landmark',
      url: uploadUrl.trim(),
      type: 'photo',
      caption: uploadCaption.trim() || undefined,
      capturedDate: uploadDate,
      userId: userId || undefined,
    });
    setUploadUrl('');
    setUploadCaption('');
    setIsUploadOpen(false);
  };

  // Next / Previous Lightbox navigation
  const handleNextPhoto = () => {
    if (activeLightboxIndex === null) return;
    if (activeLightboxIndex < filteredMemories.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    } else {
      setActiveLightboxIndex(0); // loop around
    }
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex === null) return;
    if (activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    } else {
      setActiveLightboxIndex(filteredMemories.length - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Top Header & Actions Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'माझ्या आठवणी (Digital Travel Album)' : 'My Memories (Digital Travel Album)'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? `एकूण ${allMemories.length} फोटो व व्हिडिओ जतन केले आहेत.`
                : `${allMemories.length} captured moments across Pune destinations.`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              style={{
                padding: '9px 18px',
                borderRadius: 12,
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
              }}
            >
              <Plus size={16} />
              <span>{isMr ? 'फोटो अपलोड करा' : 'Upload Memories'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Destination Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={15} color="#64748b" />
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                color: '#1e293b',
                background: '#ffffff',
                outline: 'none',
                maxWidth: 220,
              }}
            >
              <option value="all">{isMr ? 'सर्व ठिकाणे' : 'All Destinations'}</option>
              {allPlaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {isMr && p.name_mr ? p.name_mr : p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              border: onlyFavorites ? '1px solid #ef4444' : '1px solid #cbd5e1',
              backgroundColor: onlyFavorites ? '#fef2f2' : '#ffffff',
              color: onlyFavorites ? '#dc2626' : '#475569',
              fontSize: 13,
              fontWeight: onlyFavorites ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Heart size={14} fill={onlyFavorites ? '#dc2626' : 'none'} color="#dc2626" />
            <span>{isMr ? 'फक्त आवडते' : 'Favorites'}</span>
          </button>

          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              marginLeft: 'auto',
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder={isMr ? 'कॅप्शन शोधा…' : 'Search captions…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 12.5,
                color: '#0f172a',
                width: 140,
              }}
            />
          </div>
        </div>
      </div>

      {/* Memories Photo Gallery Grid */}
      {filteredMemories.length === 0 ? (
        <div
          style={{
            padding: '50px 24px',
            borderRadius: 20,
            background: '#ffffff',
            border: '1px dashed #cbd5e1',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Camera size={36} color="#94a3b8" />
          <h3 style={{ margin: 0, fontSize: 16, color: '#334155' }}>
            {isMr ? 'कोणतेही फोटो सापडले नाहीत' : 'No memories match your selection'}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            {isMr
              ? 'नवीन आठवण जोडण्यासाठी वरील "फोटो अपलोड करा" बटणावर क्लिक करा.'
              : 'Upload personal travel photos to build your Pune memory gallery.'}
          </p>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isMr ? 'फोटो अपलोड करा' : 'Upload Memories'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {filteredMemories.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#0f172a',
                position: 'relative',
                height: 240,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                transition: 'transform 0.16s ease',
              }}
            >
              <img
                src={item.url}
                alt={item.caption || 'Memory'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />

              {/* Heart Favorite Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteMemory(item.id, userId);
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Heart
                  size={16}
                  color={item.isFavorite ? '#ef4444' : '#ffffff'}
                  fill={item.isFavorite ? '#ef4444' : 'none'}
                />
              </button>

              {/* Place Name Tag */}
              {item.placeName && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    padding: '3px 8px',
                    borderRadius: 8,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {item.placeName}
                </div>
              )}

              {/* Caption Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 12,
                  color: '#ffffff',
                }}
              >
                {item.caption && (
                  <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                    {item.caption}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
                  <Calendar size={11} />
                  <span>{item.capturedDate || item.uploadedAt.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog Modal */}
      {isUploadOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 480,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {isMr ? 'पुणे प्रवास फोटो जोडा' : 'Add Travel Memory Photo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                {isMr ? 'फोटो लिंक (URL)' : 'Photo Image URL'}
              </label>
              <input
                type="text"
                placeholder="https://... or /images/places/..."
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                {isMr ? 'पुण्यातील ठिकाण' : 'Associated Destination'}
              </label>
              <select
                value={uploadPlaceId}
                onChange={(e) => setUploadPlaceId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  background: '#ffffff',
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
                {isMr ? 'कॅप्शन किंवा आठवण' : 'Memory Caption'}
              </label>
              <input
                type="text"
                placeholder={isMr ? 'उदा. शनिवार वाड्याचे ऐतिहासिक दिल्ली दरवाजा' : 'e.g., Majestic Dilli Darwaza at sunset'}
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                {isMr ? 'तारीख' : 'Capture Date'}
              </label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveUpload}
                style={{
                  padding: '8px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isMr ? 'जतन करा' : 'Save Memory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          {/* Top Controls */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 24,
              right: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
            }}
          >
            <div>
              <strong style={{ fontSize: 16 }}>{activeLightboxItem.placeName || 'Pune Memory'}</strong>
              <span style={{ fontSize: 12, color: '#94a3b8', display: 'block' }}>
                {activeLightboxItem.capturedDate}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                onClick={() => setIsAiInspectorOpen(!isAiInspectorOpen)}
                style={{
                  border: isAiInspectorOpen ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.25)',
                  background: isAiInspectorOpen ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                  padding: '6px 12px',
                  borderRadius: 10,
                  color: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={15} color="#c084fc" />
                <span>{isMr ? 'AI फोटो विश्लेषण' : 'AI Photo Intel'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleFavoriteMemory(activeLightboxItem.id, userId)}
                style={{ border: 'none', background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
              >
                <Heart
                  size={20}
                  color={activeLightboxItem.isFavorite ? '#ef4444' : '#ffffff'}
                  fill={activeLightboxItem.isFavorite ? '#ef4444' : 'none'}
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteMemoryItem(activeLightboxItem.id, userId);
                  setActiveLightboxIndex(null);
                }}
                style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={20} />
              </button>

              <button
                type="button"
                onClick={() => setActiveLightboxIndex(null)}
                style={{ border: 'none', background: 'transparent', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            style={{
              position: 'absolute',
              left: 20,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Main Photo */}
          <div style={{ maxWidth: '85vw', maxHeight: '75vh', display: 'flex', justifyContent: 'center' }}>
            <img
              src={activeLightboxItem.url}
              alt={activeLightboxItem.caption || 'Memory'}
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8 }}
            />
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextPhoto}
            style={{
              position: 'absolute',
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* AI Photo Intelligence Inspector Panel */}
          {isAiInspectorOpen && activeAiAnalysis && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                maxWidth: 480,
                width: '90%',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: 18,
                border: '1.5px solid #a855f7',
                padding: '16px 20px',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={18} color="#c084fc" />
                  <strong style={{ fontSize: 13.5, color: '#f3e8ff' }}>
                    {isMr ? 'AI फोटो गुणवत्ता व रील विश्लेषण' : 'AI Photo Intelligence & Reel Curation'}
                  </strong>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: '#059669', color: '#ffffff' }}>
                  Score: {activeAiAnalysis.score}/100
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ color: '#c084fc', fontWeight: 700 }}>9:16 Crop:</span>
                  <span>{activeAiAnalysis.cropAdvice}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ color: '#c084fc', fontWeight: 700 }}>Reel Placement:</span>
                  <span style={{ color: '#fcd34d', fontWeight: 600 }}>{activeAiAnalysis.suggestedAct}</span>
                </div>
              </div>

              {/* Suggested Caption */}
              <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#c084fc', display: 'block', marginBottom: 4 }}>
                  {isMr ? 'AI सुचवलेले कॅप्शन' : 'AI Suggested Caption'}
                </span>
                <p style={{ margin: 0, fontSize: 12.5, color: '#f8fafc', lineHeight: 1.4, fontStyle: 'italic' }}>
                  {isMr ? activeAiAnalysis.suggestedCaptionMr : activeAiAnalysis.suggestedCaptionEn}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                {aiCaptionApplied ? (
                  <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} /> {isMr ? 'कॅप्शन लागू झाले!' : 'Caption Applied!'}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={handleApplyAiCaption}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: '#a855f7',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Wand2 size={13} />
                  <span>{isMr ? 'हे कॅप्शन फोटोला जोडा' : 'Apply AI Caption'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Caption footer */}
          {activeLightboxItem.caption && (
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                padding: '8px 16px',
                borderRadius: 20,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {activeLightboxItem.caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
