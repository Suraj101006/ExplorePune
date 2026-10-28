'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { JourneyReelData, getSavedReels, deleteSavedReel } from '@/lib/journeyReel';
import ModalPortal from '@/components/ModalPortal';
import {
  Film,
  Play,
  Download,
  Trash2,
  Sparkles,
  Calendar,
  Music,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

interface ReelLibraryTabProps {
  onPlayReel: (reelData: JourneyReelData) => void;
  onOpenCreateReel: () => void;
  userId?: string | null;
}

export default function ReelLibraryTab({ onPlayReel, onOpenCreateReel, userId }: ReelLibraryTabProps) {
  const { isMr } = useLanguage();
  const [reels, setReels] = useState<JourneyReelData[]>([]);
  const [reelToDelete, setReelToDelete] = useState<JourneyReelData | null>(null);

  const refreshReels = () => {
    setReels(getSavedReels(userId));
  };

  useEffect(() => {
    refreshReels();
    const handleSync = () => refreshReels();
    window.addEventListener('explore-pune-reels-changed', handleSync);
    return () => window.removeEventListener('explore-pune-reels-changed', handleSync);
  }, [userId]);

  const handleConfirmDelete = () => {
    if (!reelToDelete) return;
    deleteSavedReel(reelToDelete.id, userId);
    setReelToDelete(null);
    refreshReels();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Studio Banner */}
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(234, 88, 12, 0.25)',
              border: '1px solid rgba(234, 88, 12, 0.5)',
              color: '#fb923c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Film size={28} />
          </div>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isMr ? 'सिनेमॅटिक रील स्टुडिओ' : 'Cinematic Reel Studio'}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 4px', color: '#ffffff' }}>
              {isMr ? 'तुमच्या पुणे प्रवासाचे ९:१६ व्हिडिओ रील' : 'Your Pune Travel Reels'}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', maxWidth: 480 }}>
              {isMr
                ? 'सिंहगड, वाडे आणि मंदिरांच्या आठवणींचे इन्स्टाग्राम/सोशल मीडिया-रेडी व्हिडिओ तयार करा व डाउनलोड करा.'
                : 'Turn your Pune journeys into 9:16 vertical travel reels with beat-synchronized motion and cultural themes.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreateReel}
          style={{
            padding: '11px 22px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: 14,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.4)',
          }}
        >
          <Sparkles size={18} />
          <span>{isMr ? 'नवीन रील तयार करा' : 'Create New Reel'}</span>
        </button>
      </div>

      {/* Reels List / Grid */}
      {reels.length === 0 ? (
        <div
          style={{
            padding: '52px 24px',
            textAlign: 'center',
            borderRadius: 20,
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Film size={30} />
          </div>
          <div>
            <h4 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {isMr ? 'अद्याप कोणतेही रील तयार केलेले नाही' : 'No cinematic reels created yet'}
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', maxWidth: 440 }}>
              {isMr
                ? 'तुमच्या कोणत्याही एका प्रवासाची निवड करा आणि एका क्लिकवर सिनेमॅटिक ९:१६ व्हिडिओ रील बनवा.'
                : 'Choose any saved journey from your journal to generate your first beat-synced travel reel.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCreateReel}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            {isMr ? 'पहिले रील बनवा' : 'Create Your First Reel'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {reels.map((item, idx) => {
            const reel = item.reel;
            const poster = item.places[0]?.photos?.[0] || '/images/places/shaniwar-wada.jpg';
            const placeCount = item.places.length;
            const durationSec = Math.round(reel.duration || 30);

            return (
              <div
                key={item.id || idx}
                style={{
                  borderRadius: 18,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* 9:16 Video Poster Thumbnail Card */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 10',
                    width: '100%',
                    background: '#0b1120',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => onPlayReel(item)}
                >
                  <img
                    src={poster}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                  />

                  {/* Play Button Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'rgba(234, 88, 12, 0.9)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        paddingLeft: 3,
                      }}
                    >
                      <Play size={22} fill="#ffffff" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#ffffff',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ⏱️ {durationSec}s
                  </div>

                  {/* Aspect Ratio Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: 10.5,
                      fontWeight: 700,
                    }}
                  >
                    📱 9:16 Vertical
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                      {isMr && item.titleMr ? item.titleMr : item.title}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12, color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={12} />
                        <span>{placeCount} {isMr ? 'ठिकाणे' : 'Destinations'}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Music size={12} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {reel.music?.title || 'Pune Heritage Theme'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions: Watch, Delete */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onPlayReel(item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#c2410c',
                        fontSize: 12,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={13} fill="#c2410c" />
                      <span>{isMr ? 'रील पहा' : 'Watch Reel'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReelToDelete(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: 6,
                      }}
                      title="Delete Reel"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reelToDelete && (
        <ModalPortal isOpen={Boolean(reelToDelete)} onClose={() => setReelToDelete(null)}>
          <div
            className="journey-reel-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setReelToDelete(null)}
          >
            <div
              style={{
                width: 'min(92vw, 400px)',
                background: '#ffffff',
                borderRadius: 18,
                padding: '24px',
                margin: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                    {isMr ? 'व्हिडिओ रील हटवायचे आहे का?' : 'Delete Travel Reel?'}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                    {isMr ? 'हे रील तुमच्या लायब्ररीतून हटवले जाईल.' : 'This will remove the reel from your saved reels library.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setReelToDelete(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isMr ? 'होय, हटवा' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
