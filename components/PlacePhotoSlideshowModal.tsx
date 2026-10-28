'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { useLanguage } from '@/lib/LanguageContext';
import { PlacePhotoItem } from '@/app/api/v1/places/photos/route';
import { Play, Pause, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface PlacePhotoSlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: {
    id: string;
    slug: string;
    name: string;
    name_mr?: string;
    image_url?: string;
    category_slug?: string;
    address?: string;
    address_mr?: string;
  } | null;
  initialIndex?: number;
}

const KEN_BURNS_EFFECTS = [
  'kenburns-active-zoom-in',
  'kenburns-active-pan-left',
  'kenburns-active-zoom-out',
  'kenburns-active-pan-right',
];

const SLIDE_DURATION_MS = 4500;
const MANUAL_PAUSE_RESUME_MS = 2500;

export default function PlacePhotoSlideshowModal({
  isOpen,
  onClose,
  place,
  initialIndex = 0,
}: PlacePhotoSlideshowModalProps) {
  const { isMr } = useLanguage();
  const [photos, setPhotos] = useState<PlacePhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  // Load photos when modal opens
  useEffect(() => {
    if (!isOpen || !place) return;

    setCurrentIndex(initialIndex);
    setIsPlaying(true);
    setProgress(0);

    const primaryUrl = place.image_url || `/images/places/${place.slug}.jpg`;
    const basePhoto: PlacePhotoItem = {
      url: primaryUrl,
      thumbnail: primaryUrl,
      title: place.name,
      caption: isMr ? `${place.name_mr || place.name} — अधिकृत छायाचित्र` : `${place.name} — Authentic Maharashtra Heritage Photograph`,
      source: 'Maharashtra Tourism / Wikimedia Commons',
      license: 'CC BY-SA / Public Domain',
      attribution: 'Wikimedia Commons Archive',
      isPrimary: true,
    };
    setPhotos([basePhoto]);

    let isMounted = true;
    fetch(`/api/v1/places/photos?slug=${encodeURIComponent(place.slug)}&name=${encodeURIComponent(place.name)}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
          setIsPlaying(true);
        }
      })
      .catch((err) => {
        console.warn('Could not load extra photos:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, place, initialIndex, isMr]);

  // Preload next image
  useEffect(() => {
    if (photos.length <= 1) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    const nextPhoto = photos[nextIdx];
    if (nextPhoto && nextPhoto.url && typeof window !== 'undefined') {
      const img = new Image();
      img.src = nextPhoto.url;
    }
  }, [currentIndex, photos]);

  const handleNext = useCallback(() => {
    setPhotos((prev) => {
      if (prev.length <= 1) return prev;
      setCurrentIndex((curr) => (curr + 1) % prev.length);
      setProgress(0);
      return prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setPhotos((prev) => {
      if (prev.length <= 1) return prev;
      setCurrentIndex((curr) => (curr - 1 + prev.length) % prev.length);
      setProgress(0);
      return prev;
    });
  }, []);

  const handleManualAction = useCallback(
    (action: () => void) => {
      setIsPlaying(false);
      setProgress(0);
      action();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, MANUAL_PAUSE_RESUME_MS);
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleManualAction(handleNext);
      } else if (e.key === 'ArrowLeft') {
        handleManualAction(handlePrev);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, handleManualAction]);

  // Autoplay ticker
  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalStepMs = 50;
    const increment = (intervalStepMs / SLIDE_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalStepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPlaying, photos.length, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = touchStartYRef.current ? e.changedTouches[0].clientY - touchStartYRef.current : 0;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleManualAction(handleNext);
      } else {
        handleManualAction(handlePrev);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !place) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  const totalPhotos = photos.length;
  const displayName = isMr && place.name_mr ? place.name_mr : place.name;
  const secondaryName = isMr && place.name_mr ? place.name : place.name_mr;
  const effectClass = prefersReducedMotion ? '' : KEN_BURNS_EFFECTS[currentIndex % KEN_BURNS_EFFECTS.length];

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.25s ease-out',
        color: '#ffffff',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Progress Bar */}
      {totalPhotos > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3.5,
            background: 'rgba(255, 255, 255, 0.15)',
            zIndex: 30,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.7)',
              transition: isPlaying ? 'width 50ms linear' : 'none',
            }}
          />
        </div>
      )}

      {/* 2. Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          zIndex: 30,
          background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span
            style={{
              background: '#ea580c',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}
          >
            <span>📸</span>
            <span>
              {currentIndex + 1} / {totalPhotos}
            </span>
          </span>

          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </h3>
            {secondaryName && (
              <span
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                }}
              >
                {secondaryName}
              </span>
            )}
          </div>
        </div>

        {/* Controls: Pause / Play & Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {totalPhotos > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              style={{
                background: isPlaying ? 'rgba(5, 150, 105, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span className="hide-on-mobile">{isPlaying ? (isMr ? 'थांबवा' : 'Pause') : (isMr ? 'सुरू करा' : 'Play')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            title={isMr ? 'बंद करा (Esc)' : 'Close Theater (Esc)'}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 3. Main Center Stage with Ken Burns Transition */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {photos.map((photo, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={photo.url}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: prefersReducedMotion
                  ? 'opacity 0.3s ease'
                  : 'opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: isActive ? 'auto' : 'none',
                overflow: 'hidden',
              }}
            >
              <img
                src={photo.url}
                alt={photo.caption || photo.title || displayName}
                className={isActive ? effectClass : ''}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          );
        })}

        {/* Previous Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={() => handleManualAction(handlePrev)}
            style={{
              position: 'absolute',
              left: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            title={isMr ? 'मागील छायाचित्र' : 'Previous'}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={() => handleManualAction(handleNext)}
            style={{
              position: 'absolute',
              right: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
            title={isMr ? 'पुढील छायाचित्र' : 'Next'}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* 4. Bottom Story Caption & Desktop Thumbnails */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(to top, rgba(3, 7, 18, 0.95) 0%, rgba(3, 7, 18, 0) 100%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Caption & Source info */}
        <div style={{ textAlign: 'center' }}>
          {currentPhoto?.caption && (
            <p
              key={currentPhoto.caption}
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 600,
                color: '#f8fafc',
                textShadow: '0 2px 8px rgba(0,0,0,0.85)',
              }}
            >
              “{currentPhoto.caption}”
            </p>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '11px',
              color: '#94a3b8',
              marginTop: 4,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} color="#10b981" />
              {currentPhoto?.source || 'Maharashtra Tourism / Wikimedia Archive'}
            </span>
            <span>•</span>
            <span>{currentPhoto?.license || 'CC BY-SA'}</span>
            {currentPhoto?.attribution && (
              <>
                <span>•</span>
                <span>{currentPhoto.attribution}</span>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Preview Bar on Desktop */}
        {totalPhotos > 1 && (
          <div
            className="hide-on-mobile"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              overflowX: 'auto',
              padding: '6px 0',
              scrollbarWidth: 'none',
            }}
          >
            {photos.map((p, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={p.url + idx}
                  type="button"
                  onClick={() =>
                    handleManualAction(() => {
                      setCurrentIndex(idx);
                      setProgress(0);
                    })
                  }
                  style={{
                    width: 50,
                    height: 36,
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
                    padding: 0,
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.5,
                    flexShrink: 0,
                    background: '#0f172a',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                  title={p.title}
                >
                  <img
                    src={p.thumbnail || p.url}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}
