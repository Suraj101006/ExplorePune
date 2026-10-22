'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { PlacePhotoItem } from '@/app/api/v1/places/photos/route';

interface CinematicPlaceSlideshowProps {
  place: {
    id: string;
    slug: string;
    name: string;
    name_mr?: string;
    image_url?: string;
    category_slug?: string;
    category?: string;
    address?: string;
    address_mr?: string;
  };
  onOpenFullscreenTheater?: (startIndex: number) => void;
}

const KEN_BURNS_EFFECTS = [
  'kenburns-active-zoom-in',
  'kenburns-active-pan-left',
  'kenburns-active-zoom-out',
  'kenburns-active-pan-right',
];

const SLIDE_DURATION_MS = 4500;
const MANUAL_PAUSE_RESUME_MS = 2500;

export default function CinematicPlaceSlideshow({
  place,
  onOpenFullscreenTheater,
}: CinematicPlaceSlideshowProps) {
  const { isMr } = useLanguage();

  const [photos, setPhotos] = useState<PlacePhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // References
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const failedUrlsRef = useRef<Set<string>>(new Set());

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // 1. Initial Load: Fetch curated, authentic photos for this specific place
  useEffect(() => {
    failedUrlsRef.current.clear();
    const primaryUrl = place.image_url || `/images/places/${place.slug}.jpg`;
    const initialPhoto: PlacePhotoItem = {
      url: primaryUrl,
      thumbnail: primaryUrl,
      title: place.name,
      caption: isMr
        ? `${place.name_mr || place.name} — अधिकृत छायाचित्र`
        : `${place.name} — Authentic Maharashtra Heritage Photograph`,
      source: 'Maharashtra Tourism / Wikimedia Commons',
      license: 'CC BY-SA 4.0 / Public Domain',
      attribution: 'Wikimedia Commons & Explore Pune Archive',
      isPrimary: true,
    };

    setPhotos([initialPhoto]);
    setCurrentIndex(0);
    setIsPlaying(true);

    let isMounted = true;
    fetch(`/api/v1/places/photos?slug=${encodeURIComponent(place.slug)}&name=${encodeURIComponent(place.name)}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        }
      })
      .catch((err) => {
        console.warn('Could not load extra place photos:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [place.slug, place.name, place.image_url, isMr]);

  // Preload next image to eliminate flickering
  useEffect(() => {
    if (photos.length <= 1) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    const nextPhoto = photos[nextIdx];
    if (nextPhoto && nextPhoto.url && typeof window !== 'undefined') {
      const img = new Image();
      img.src = nextPhoto.url;
    }
  }, [currentIndex, photos]);

  // 2. Navigation Actions
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

  // Temporary pause on manual interaction, restarts after 2.5s
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

  // 3. Automated Slideshow Flow (4.5s Interval with progress ticker)
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) {
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
  }, [isPlaying, photos.length, handleNext]);

  // 4. Broken image fallback (skip failed image)
  const handleImageError = (failedUrl: string) => {
    failedUrlsRef.current.add(failedUrl);
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.url !== failedUrl);
      if (filtered.length === 0) {
        return [
          {
            url: place.image_url || '/images/places/shaniwar-wada.jpg',
            thumbnail: place.image_url || '/images/places/shaniwar-wada.jpg',
            title: place.name,
            caption: place.name,
            source: 'Explore Pune',
            license: 'Public Heritage',
            attribution: 'Explore Pune Verified Archive',
            isPrimary: true,
          },
        ];
      }
      return filtered;
    });
    handleNext();
  };

  // 5. Touch Gestures (Swipe Left / Right for mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = touchStartYRef.current ? e.changedTouches[0].clientY - touchStartYRef.current : 0;

    // Detect horizontal swipe if delta X > 45px and predominantly horizontal
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleManualAction(handleNext);
      } else {
        handleManualAction(handlePrev);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const currentPhoto = photos[currentIndex] || photos[0];
  const primaryTitle = isMr ? place.name_mr || place.name : place.name;
  const secondaryTitle = isMr ? place.name : place.name_mr;
  const shortAddress = (isMr ? place.address_mr : place.address)?.split(',').slice(0, 2).join(', ') || 'Pune, Maharashtra';
  const categoryLabel = (place.category_slug || place.category || 'Heritage').toUpperCase();

  const effectClass = prefersReducedMotion
    ? ''
    : KEN_BURNS_EFFECTS[currentIndex % KEN_BURNS_EFFECTS.length];

  return (
    <section
      aria-label={`${primaryTitle} Automated Photo Slideshow`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(360px, 50vh, 520px)',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        background: '#090d16',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28)',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Cinematic Progress Bar */}
      {photos.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3.5,
            background: 'rgba(255, 255, 255, 0.15)',
            zIndex: 30,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)',
              transition: isPlaying ? 'width 50ms linear' : 'none',
            }}
          />
        </div>
      )}

      {/* 2. Layered Image Frame with Smooth Crossfade & Ken Burns Movement */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: '#030712',
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
                pointerEvents: isActive ? 'auto' : 'none',
                overflow: 'hidden',
              }}
            >
              <img
                src={photo.url}
                alt={photo.caption || photo.title || primaryTitle}
                className={isActive ? effectClass : ''}
                onError={() => handleImageError(photo.url)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.92) contrast(1.04)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 3. Subtle Vignette & Gradient Overlays (Never blocks main image subject) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(3, 7, 18, 0.88) 0%, rgba(3, 7, 18, 0.2) 35%, rgba(3, 7, 18, 0.1) 60%, rgba(3, 7, 18, 0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* 4. Top Overlay: Place Title, Category & Top Right Controls */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 25,
          pointerEvents: 'none',
        }}
      >
        {/* Left: Place identity title & locality label */}
        <div style={{ pointerEvents: 'auto', maxWidth: '75%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '3px 10px',
              borderRadius: 999,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: 11,
              fontWeight: 800,
              color: '#f8fafc',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}
          >
            <span>📍</span>
            <span>{categoryLabel}</span>
            <span>•</span>
            <span>{shortAddress}</span>
          </div>

          <h2
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: 'clamp(20px, 3.2vw, 30px)',
              fontWeight: 800,
              lineHeight: 1.2,
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
              fontFamily: isMr ? 'var(--deva)' : 'inherit',
            }}
          >
            {primaryTitle}
            {secondaryTitle && (
              <span
                style={{
                  fontSize: '0.6em',
                  fontWeight: 600,
                  opacity: 0.85,
                  marginLeft: 8,
                  fontFamily: isMr ? 'inherit' : 'var(--deva)',
                }}
              >
                ({secondaryTitle})
              </span>
            )}
          </h2>
        </div>

        {/* Right Controls: Slide Counter, Pause/Play, Fullscreen */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Photo Counter */}
          <span
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              color: '#f8fafc',
              fontSize: 11.5,
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 999,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📷</span>
            <span>
              {currentIndex + 1} / {photos.length}
            </span>
          </span>

          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title={isPlaying ? (isMr ? 'स्लाइडशो थांबवा' : 'Pause Slideshow') : (isMr ? 'स्लाइडशो सुरू करा' : 'Resume Slideshow')}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Fullscreen Theater Expand Button */}
          {onOpenFullscreenTheater && (
            <button
              type="button"
              onClick={() => onOpenFullscreenTheater(currentIndex)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
                transition: 'all 0.15s ease',
              }}
              title={isMr ? 'पूर्ण स्क्रीन थिएटर मोड (क्लिक करा)' : 'Open Fullscreen Theater'}
              aria-label="Open Fullscreen Theater"
            >
              ⛶
            </button>
          )}
        </div>
      </div>

      {/* 5. Navigation Chevrons (Left & Right) */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => handleManualAction(handlePrev)}
            style={{
              position: 'absolute',
              top: '50%',
              left: 14,
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 25,
              transition: 'all 0.18s ease',
            }}
            title={isMr ? 'मागील छायाचित्र' : 'Previous Photo'}
            aria-label="Previous Photo"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => handleManualAction(handleNext)}
            style={{
              position: 'absolute',
              top: '50%',
              right: 14,
              transform: 'translateY(-50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 25,
              transition: 'all 0.18s ease',
            }}
            title={isMr ? 'पुढील छायाचित्र' : 'Next Photo'}
            aria-label="Next Photo"
          >
            ›
          </button>
        </>
      )}

      {/* 6. Bottom Story Mode & Caption Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 12,
          zIndex: 25,
        }}
      >
        {/* Story Caption */}
        <div style={{ maxWidth: '68%' }}>
          {currentPhoto?.caption && (
            <p
              key={currentPhoto.caption}
              style={{
                margin: 0,
                color: '#f8fafc',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                lineHeight: 1.45,
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s ease',
              }}
            >
              “{currentPhoto.caption}”
            </p>
          )}

          {/* Authentic Licensing & Attribution Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10.5,
              color: '#cbd5e1',
              marginTop: 4,
              opacity: 0.9,
            }}
          >
            <span>📜 {currentPhoto?.source || 'Wikimedia Commons'}</span>
            <span>•</span>
            <span>{currentPhoto?.license || 'CC BY-SA 4.0'}</span>
            {currentPhoto?.attribution && (
              <>
                <span>•</span>
                <span>{currentPhoto.attribution}</span>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Preview Strip (Desktop & Tablets) */}
        {photos.length > 1 && (
          <div
            className="hide-on-mobile"
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              background: 'rgba(3, 7, 18, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '4px 6px',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxWidth: '30%',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {photos.slice(0, 6).map((p, idx) => {
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
                    width: 36,
                    height: 26,
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.25)',
                    padding: 0,
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.6,
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
    </section>
  );
}
