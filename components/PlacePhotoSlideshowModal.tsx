'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export interface PlacePhotoItem {
  url: string;
  title: string;
  isPrimary?: boolean;
}

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
  } | null;
  initialIndex?: number;
}

export default function PlacePhotoSlideshowModal({
  isOpen,
  onClose,
  place,
  initialIndex = 0,
}: PlacePhotoSlideshowModalProps) {
  const { isMr } = useLanguage();
  const [photos, setPhotos] = useState<PlacePhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartXRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load photos when modal opens or place changes
  useEffect(() => {
    if (!isOpen || !place) return;

    setCurrentIndex(initialIndex);
    setIsPlaying(true);

    // Initial fallback photo while fetching gallery
    const basePhoto: PlacePhotoItem = {
      url: place.image_url || '/images/places/shaniwar-wada.jpg',
      title: place.name,
      isPrimary: true,
    };
    setPhotos([basePhoto]);
    setLoading(true);

    let isMounted = true;
    fetch(`/api/v1/places/photos?slug=${encodeURIComponent(place.slug)}&name=${encodeURIComponent(place.name)}&limit=10`)
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
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, place, initialIndex]);

  const handleNext = useCallback(() => {
    setPhotos((prev) => {
      if (prev.length <= 1) return prev;
      setCurrentIndex((curr) => (curr + 1) % prev.length);
      return prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setPhotos((prev) => {
      if (prev.length <= 1) return prev;
      setCurrentIndex((curr) => (curr - 1 + prev.length) % prev.length);
      return prev;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Auto-play loop (advances automatically every 3 seconds)
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, photos.length, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !place) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  const totalPhotos = photos.length;
  const displayName = isMr && place.name_mr ? place.name_mr : place.name;
  const secondaryName = isMr && place.name_mr ? place.name : place.name_mr;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(5, 12, 10, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.2s ease-out',
        padding: '16px',
        boxSizing: 'border-box',
        color: '#ffffff',
      }}
      onClick={onClose}
    >
      {/* 1. TOP CONTROLS & HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '4px 8px',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span
            style={{
              background: '#c2410c',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📸</span>
            <span>
              {isMr ? 'छायाचित्र' : 'Photo'} {currentIndex + 1} / {totalPhotos}
            </span>
          </span>

          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
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
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {secondaryName}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons: AutoPlay + Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {totalPhotos > 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              style={{
                background: isPlaying ? '#065f46' : 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s ease',
              }}
              title={isPlaying ? 'Pause Slideshow' : 'Start Auto Slideshow'}
            >
              <span>{isPlaying ? '⏸' : '▶'}</span>
              <span className="hidden-sm">{isPlaying ? (isMr ? 'थांबवा' : 'Pause') : isMr ? 'स्लाइडशो सुरू करा' : 'Auto-play'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              width: 36,
              height: 36,
              borderRadius: '50%',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            title={isMr ? 'बंद करा (Escape)' : 'Close (Escape)'}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Animated Auto-play Progress Bar */}
      {isPlaying && totalPhotos > 1 && (
        <div
          style={{
            height: 3,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 2,
            overflow: 'hidden',
            margin: '4px 0 2px',
          }}
        >
          <div
            key={`${currentIndex}-${isPlaying}`}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #f97316 0%, #10b981 100%)',
              width: '100%',
              animation: 'photoSlideProgress 3000ms linear forwards',
            }}
          />
        </div>
      )}

      {/* Keyframe animation style */}
      <style>{`
        @keyframes photoSlideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* 2. MAIN PHOTO STAGE & ARROWS */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '12px 0',
          minHeight: 0,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: 12,
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              width: 44,
              height: 44,
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              transition: 'transform 0.15s, background 0.15s',
            }}
            title={isMr ? 'मागील छायाचित्र (डावा बाण)' : 'Previous photo (Left Arrow)'}
          >
            ‹
          </button>
        )}

        {/* Large Main Photo */}
        <div
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {currentPhoto && (
            <img
              key={currentPhoto.url}
              src={currentPhoto.url}
              alt={currentPhoto.title || displayName}
              style={{
                maxWidth: '92vw',
                maxHeight: '66vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                animation: 'fadeSlide 0.25s ease-out',
                userSelect: 'none',
              }}
            />
          )}

          {/* Photo Caption Pill */}
          {currentPhoto && currentPhoto.title && (
            <div
              style={{
                marginTop: 10,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                color: '#cbd5e1',
                maxWidth: '85vw',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {currentPhoto.isPrimary ? `⭐ ${isMr ? 'अधिकृत छायाचित्र:' : 'Featured View:'} ` : '📷 '}
              {currentPhoto.title}
            </div>
          )}
        </div>

        {/* Next Button */}
        {totalPhotos > 1 && (
          <button
            type="button"
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: 12,
              zIndex: 20,
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              width: 44,
              height: 44,
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              transition: 'transform 0.15s, background 0.15s',
            }}
            title={isMr ? 'पुढील छायाचित्र (उजवा बाण)' : 'Next photo (Right Arrow)'}
          >
            ›
          </button>
        )}
      </div>

      {/* 3. THUMBNAIL STRIP */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'auto',
          padding: '8px 4px',
          maxWidth: '100%',
          scrollbarWidth: 'thin',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={`${item.url}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: 58,
                height: 44,
                padding: 0,
                borderRadius: '6px',
                overflow: 'hidden',
                border: isActive ? '2.5px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.25)',
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.18s ease',
                cursor: 'pointer',
                background: '#0f172a',
                flexShrink: 0,
              }}
              title={item.title || `Photo ${idx + 1}`}
            >
              <img
                src={item.url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
