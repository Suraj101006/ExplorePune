'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'explore_pune_intro_shown';
// Cut precisely at 2.45 seconds before any mock web page screenshot appears
const TARGET_INTRO_DURATION = 2.45;
const VIDEO_ASPECT = 16 / 9;
const NORM_X = 1160 / 1280; // 0.90625 (horizontal center of Gemini watermark)
const NORM_Y = 599.5 / 720; // 0.8326388888888889 (vertical center of Gemini watermark)

interface LogoPosition {
  left: number;
  top: number;
  size: number;
  visible: boolean;
}

function calculateLogoPosition(w: number, h: number): LogoPosition {
  const screenAspect = w / h;
  let renderedWidth: number;
  let renderedHeight: number;
  let renderedLeft: number;
  let renderedTop: number;

  if (screenAspect >= VIDEO_ASPECT) {
    renderedWidth = w;
    renderedHeight = w / VIDEO_ASPECT;
    renderedLeft = 0;
    renderedTop = (h - renderedHeight) / 2;
  } else {
    renderedHeight = h;
    renderedWidth = h * VIDEO_ASPECT;
    renderedLeft = (w - renderedWidth) / 2;
    renderedTop = 0;
  }

  const scale = renderedWidth / 1280;
  const centerX = renderedLeft + NORM_X * renderedWidth;
  const centerY = renderedTop + NORM_Y * renderedHeight;
  const size = Math.max(38, Math.round(52 * scale));

  const visible =
    centerX + size / 2 >= 0 &&
    centerX - size / 2 <= w &&
    centerY + size / 2 >= 0 &&
    centerY - size / 2 <= h;

  return { left: centerX, top: centerY, size, visible };
}

export default function IntroVideoOverlay() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [introState, setIntroState] = useState<'playing' | 'fading' | 'none'>('playing');
  const [showTitleCard, setShowTitleCard] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [logoPos, setLogoPos] = useState<LogoPosition | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finishTriggeredRef = useRef(false);

  // Smoothly fade out the overlay and reveal the real homepage underneath
  const handleFinish = useCallback((immediate = false) => {
    if (finishTriggeredRef.current && !immediate) return;
    finishTriggeredRef.current = true;

    // Immediately stop video playback
    if (videoRef.current && !videoRef.current.paused) {
      try {
        videoRef.current.pause();
      } catch {}
    }

    // Smoothly fade audio
    if (audioRef.current && !audioRef.current.paused) {
      try {
        const a = audioRef.current;
        const fadeInterval = setInterval(() => {
          if (a.volume > 0.1) {
            a.volume = Math.max(0, a.volume - 0.15);
          } else {
            a.pause();
            clearInterval(fadeInterval);
          }
        }, 50);
      } catch {}
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      document.documentElement.classList.remove('intro-active');
      document.documentElement.classList.add('intro-dismissed');
    } catch {}

    if (immediate) {
      setIntroState('none');
      return;
    }

    setIntroState('fading');
    fadeTimeoutRef.current = setTimeout(() => {
      setIntroState('none');
      try {
        document.documentElement.classList.remove('intro-active');
      } catch {}
    }, 550);
  }, []);

  const handleSkip = useCallback(() => {
    handleFinish(true);
  }, [handleFinish]);

  // Transition from aerial footage to "Explore Pune" text title card at 2.4s
  const triggerTitleCard = useCallback(() => {
    if (showTitleCard || finishTriggeredRef.current) return;
    setShowTitleCard(true);

    if (videoRef.current && !videoRef.current.paused) {
      try {
        videoRef.current.pause();
      } catch {}
    }

    // Showcase "Explore Pune" text card for 850ms before smoothly revealing the site
    titleTimeoutRef.current = setTimeout(() => {
      handleFinish(false);
    }, 850);
  }, [showTitleCard, handleFinish]);

  // Handle video progress to freeze at 2.4s and show "Explore Pune" text
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (e.currentTarget.currentTime >= TARGET_INTRO_DURATION) {
        triggerTitleCard();
      }
    },
    [triggerTitleCard]
  );

  // High-frequency animation frame monitor to stop at exactly 2.40s
  useEffect(() => {
    if (introState !== 'playing' || showTitleCard) return;
    let animId: number;
    const checkTime = () => {
      const v = videoRef.current;
      if (v && !v.paused && v.currentTime >= TARGET_INTRO_DURATION) {
        triggerTitleCard();
        return;
      }
      animId = requestAnimationFrame(checkTime);
    };
    animId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(animId);
  }, [introState, showTitleCard, triggerTitleCard]);

  // Track viewport resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePosition = () => {
      setLogoPos(calculateLogoPosition(window.innerWidth, window.innerHeight));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Initialize playback, sound, and session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setMounted(true);

    if (pathname !== '/') {
      try {
        document.documentElement.classList.remove('intro-active');
        document.documentElement.classList.add('intro-dismissed');
      } catch {}
      setIntroState('none');
      return;
    }

    // Bot & Crawler bypass: ensure search engines & speed tools see instant rendered content
    const isBot =
      typeof navigator !== 'undefined' &&
      /bot|googlebot|crawler|spider|robot|crawling|lighthouse|seoptimer|headlesschrome/i.test(
        navigator.userAgent
      );
    if (isBot) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        document.documentElement.classList.remove('intro-active');
        document.documentElement.classList.add('intro-dismissed');
      } catch {}
      setIntroState('none');
      return;
    }

    // Prefers-reduced-motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        document.documentElement.classList.remove('intro-active');
        document.documentElement.classList.add('intro-dismissed');
      } catch {}
      setIntroState('none');
      return;
    }

    // Session check
    try {
      const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
      if (alreadySeen === 'true') {
        document.documentElement.classList.remove('intro-active');
        document.documentElement.classList.add('intro-dismissed');
        setIntroState('none');
        return;
      }
      // Activate fullscreen intro mode: completely hides all bars & places
      document.documentElement.classList.add('intro-active');
      document.documentElement.classList.remove('intro-dismissed');
    } catch {
      setIntroState('none');
      return;
    }

    // Start background music (BGM) - unmuted from start
    if (audioRef.current) {
      audioRef.current.volume = 0.85;
      audioRef.current.muted = false;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsMuted(false);
        }).catch(() => {
          // If browser strictly blocks unmuted autoplay until user gesture, mark muted flag
          setIsMuted(true);
        });
      }
    }

    // Fallback safety timer (3.8s)
    const fallbackTimer = setTimeout(() => {
      handleFinish(false);
    }, 3800);

    // Start video
    if (videoRef.current) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {
          handleFinish(false);
        });
      }
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
    };
  }, [handleFinish, pathname]);

  // Toggle BGM sound
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // User click on intro overlay: start BGM if blocked
  const handleOverlayClick = () => {
    if (isMuted && audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }
  };

  if (!mounted || introState === 'none') {
    return null;
  }

  const overlayContent = (
    <div
      id="explore-pune-intro-overlay"
      className={`intro-overlay ${introState === 'fading' ? 'fading' : ''}`}
      aria-label="Explore Pune Cinematic Introduction"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      {/* Heritage Background Music Audio */}
      <audio
        ref={audioRef}
        src="/audio/explore-pune-intro-bgm.wav"
        preload="none"
        loop={false}
      />

      {/* Explore Pune Brand Badge - Top Left */}
      <div className="intro-brand-badge" aria-hidden="true">
        <Image
          src="/images/logo.svg"
          alt="Explore Pune Logo"
          width={30}
          height={30}
          style={{ borderRadius: '50%', display: 'block' }}
          priority
        />
        <span className="intro-brand-text">
          Explore <span style={{ color: '#10b981' }}>Pune</span>
        </span>
      </div>

      {/* Top-Right Controls: Sound Toggle + SKIP INTRO (Clean side-by-side, zero overlap) */}
      <div className="intro-top-controls">
        <button
          type="button"
          onClick={toggleSound}
          className="intro-sound-btn"
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          <span>{isMuted ? '🔇 MUTE' : '🔊 SOUND ON'}</span>
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="intro-skip-btn"
          aria-label="Skip Intro"
        >
          <span>SKIP INTRO</span>
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      {/* Cinematic "Explore Pune" Text Title Card (replaces the last webpage screenshot frame) */}
      <div
        className={`intro-explore-title-card ${showTitleCard ? 'visible' : ''}`}
        aria-hidden={!showTitleCard}
      >
        <div className="intro-title-crest">
          <Image
            src="/images/logo.svg"
            alt="Explore Pune Crest"
            width={80}
            height={80}
            style={{ borderRadius: '50%', display: 'block' }}
            priority
          />
        </div>
        <div role="heading" aria-level={2} className="intro-title-heading">
          Explore <span className="intro-title-highlight">Pune</span>
        </div>
        <p className="intro-title-marathi">
          एक्सप्लोर पुणे • सह्याद्री आणि संस्कृती दर्शन
        </p>
      </div>

      {/* Explore Pune Logo Badge covering the Gemini Watermark on the video */}
      <div
        className="intro-gemini-cover-badge"
        style={
          logoPos
            ? {
                left: `${logoPos.left}px`,
                top: `${logoPos.top}px`,
                width: `${logoPos.size}px`,
                height: `${logoPos.size}px`,
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                display: logoPos.visible && !showTitleCard ? 'flex' : 'none',
              }
            : undefined
        }
        aria-hidden="true"
      >
        <Image
          src="/images/logo.svg"
          alt="Explore Pune"
          width={logoPos ? logoPos.size : 52}
          height={logoPos ? logoPos.size : 52}
          className="intro-gemini-cover-img"
          priority
        />
      </div>

      {/* Video Asset strictly capped at 2.45s before mock web screenshot */}
      <video
        ref={videoRef}
        src="/videos/explore-pune-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => triggerTitleCard()}
        onError={() => handleFinish(true)}
        className={`intro-video-element ${showTitleCard ? 'dimmed' : ''}`}
      />
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(overlayContent, document.body) : null;
}
