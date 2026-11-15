'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Feather, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getPreloaderStats } from '@/lib/experience/selectors';
import { formatPercentage, toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import { globalChapterRegistry } from '@/lib/experience/registry';
import gsap from 'gsap';

interface ChapterPreloaderProps {
  onComplete?: () => void;
}

export default function ChapterPreloader({ onComplete }: ChapterPreloaderProps) {
  const {
    isAudioEnabled,
    toggleAudio,
    isLiteMode,
    toggleLiteMode,
    prefersReducedMotion,
    setIsLoaded,
    lang,
    isMr,
  } = useExperience();

  const dict = getExperienceI18n(lang);
  const ch0 = dict.chapters.ch0_preloader;
  const stats = getPreloaderStats();

  const [counterProgress, setCounterProgress] = useState<number>(0);
  const [telemetryText, setTelemetryText] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isAudioPrompted, setIsAudioPrompted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const strokePathRef = useRef<SVGPathElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const isReduced = prefersReducedMotion || isLiteMode;

  // Register Chapter 0 with global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'preloader',
      titleEn: ch0.title,
      titleMr: ch0.devanagariHero,
      order: 0,
      exit: () => {
        setIsDismissed(true);
      },
    });

    return () => {
      globalChapterRegistry.unregister('preloader');
    };
  }, [ch0.title, ch0.devanagariHero]);

  // Telemetry typewriter effect
  useEffect(() => {
    if (isReduced) {
      setTelemetryText('COORDINATES: 18.5204° N, 73.8567° E • ELEVATION: 560M • DECCAN VOLCANIC BASALT • 106 PLACES');
      return;
    }

    const fullTelemetry =
      'COORDINATES: 18.5204° N, 73.8567° E • ELEVATION: 560M • DECCAN VOLCANIC BASALT • 106 PLACES VERIFIED';
    let idx = 0;
    const interval = setInterval(() => {
      setTelemetryText(fullTelemetry.slice(0, idx));
      idx++;
      if (idx > fullTelemetry.length) {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [isReduced]);

  // Ambient gold dust particles (Canvas)
  useEffect(() => {
    if (isReduced || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 80 Ambient Paithani Gold & Amber dust motes
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.1,
      alpha: Math.random() * 0.7 + 0.2,
      fadeSpeed: Math.random() * 0.008 + 0.002,
      isGold: Math.random() > 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.fadeSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(234, 179, 8, ${p.alpha})` // Paithani Gold
          : `rgba(234, 88, 12, ${p.alpha * 0.75})`; // Peshwa Saffron
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isReduced]);

  // Main loading progress animation
  useEffect(() => {
    if (isReduced) {
      setCounterProgress(100);
      return;
    }

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onUpdate: () => {
        setCounterProgress(Math.round(obj.val));
      },
      onComplete: () => {
        // Auto unlock trigger after brief hold at 100%
        setTimeout(() => {
          handleEnter();
        }, 650);
      },
    });

    // Ink drop impact and ripple
    if (rippleRef.current) {
      tl.fromTo(
        rippleRef.current,
        { r: 0, opacity: 0.9 },
        { r: 240, opacity: 0, duration: 1.4, ease: 'power2.out' },
        0.2
      );
    }

    // Devanagari calligraphy draw
    if (strokePathRef.current) {
      const length = strokePathRef.current.getTotalLength() || 1200;
      strokePathRef.current.style.strokeDasharray = `${length}`;
      strokePathRef.current.style.strokeDashoffset = `${length}`;

      tl.to(
        strokePathRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power3.inOut',
        },
        0.4
      );
    }

    // Number ticker 0 -> 100%
    tl.to(
      obj,
      {
        val: 100,
        duration: 2.1,
        ease: 'power2.out',
      },
      0.1
    );

    return () => {
      tl.kill();
    };
  }, [isReduced]);

  const handleEnter = () => {
    if (isDismissed) return;

    if (isReduced) {
      setIsDismissed(true);
      setIsLoaded(true);
      onComplete?.();
      return;
    }

    // Majestic iris shutter dissolve wipe
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        duration: 0.75,
        ease: 'power4.inOut',
        onComplete: () => {
          setIsDismissed(true);
          setIsLoaded(true);
          onComplete?.();
        },
      });
    } else {
      setIsDismissed(true);
      setIsLoaded(true);
      onComplete?.();
    }
  };

  if (isDismissed) return null;

  return (
    <div
      ref={containerRef}
      id="preloader"
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#04060a] text-slate-100 select-none"
      role="dialog"
      aria-modal="true"
      aria-label={ch0.title}
    >
      {/* Background Ambient Dust Canvas */}
      {!isReduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {/* Top HUD Bar: Telemetry, Audio Prompt & Mode Toggles */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] sm:text-xs tracking-wider text-monsoon-400 opacity-80 uppercase">
            {telemetryText || 'CALIBRATING PUNE EXPEDITION'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Unlock Button (Strict Hard Rule #3) */}
          <button
            type="button"
            onClick={() => {
              toggleAudio();
              setIsAudioPrompted(true);
            }}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
              isAudioEnabled
                ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
            title={dict.common.audioMutedNotice}
            aria-label={isAudioEnabled ? dict.common.audioOn : dict.common.audioOff}
          >
            {isAudioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{isAudioEnabled ? dict.common.audioOn : dict.common.audioOff}</span>
          </button>

          {/* Calm / Lite Mode Quick Toggle */}
          <button
            type="button"
            onClick={toggleLiteMode}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              isLiteMode
                ? 'border-monsoon-500 bg-monsoon-950/80 text-monsoon-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
            }`}
            title={dict.common.liteModeNotice}
          >
            <Zap className="h-3 w-3" />
            <span>{isLiteMode ? dict.common.liteModeOn : 'Calm Mode'}</span>
          </button>
        </div>
      </header>

      {/* Centerpiece: Ink Drop & "पुणे" Calligraphy & Numeral Ticker */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Subtle radial aura */}
        <div
          className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Calligraphic Ink SVG */}
        <div className="relative mb-6 flex items-center justify-center">
          <svg
            className="w-56 h-36 sm:w-80 sm:h-48 drop-shadow-[0_0_25px_rgba(234,179,8,0.35)]"
            viewBox="0 0 300 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Ripple Shockwave */}
            {!isReduced && (
              <circle
                ref={rippleRef}
                cx="150"
                cy="75"
                r="10"
                stroke="#eab308"
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
            )}

            {/* Authentic "पुणे" Calligraphic Stroke Path */}
            <path
              ref={strokePathRef}
              d="
                M 30,35 L 270,35
                M 60,35 L 60,75 C 60,95 85,95 85,75 L 85,35 L 85,115
                C 85,135 65,138 55,122
                M 135,35 L 135,78 C 135,95 165,95 165,78 L 165,35
                M 195,35 L 195,115
                M 195,35 C 185,12 165,15 155,20
              "
              stroke="#eab308"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isReduced ? 'stroke-dashoffset-0' : ''}
            />
          </svg>
        </div>

        {/* Devanagari Numeral Counter */}
        <div className="mb-4 flex items-baseline justify-center gap-1.5 font-display-mr">
          <span className="text-5xl sm:text-7xl font-bold tracking-tight text-amber-400 drop-shadow-[0_4px_24px_rgba(245,158,11,0.4)]">
            {formatPercentage(counterProgress, isMr)}
          </span>
        </div>

        {/* Narrative Subtitle */}
        <p className="max-w-md text-sm sm:text-base text-slate-400 font-body-pune leading-relaxed">
          {ch0.subtitle}
        </p>

        {/* Verified Stats Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-amber-400" />
            <strong className="text-slate-200">{toDevanagariDigits(stats.totalDestinations)}</strong>{' '}
            {ch0.placesCount}
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <strong className="text-slate-200">{toDevanagariDigits(stats.catalogedForts)}</strong>{' '}
            {ch0.fortsCount}
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Feather className="h-3.5 w-3.5 text-monsoon-400" />
            <strong className="text-slate-200">{toDevanagariDigits(stats.centuriesOfHistory)}</strong>{' '}
            {ch0.centuriesCount}
          </span>
        </div>
      </main>

      {/* Bottom Bar: Action CTAs */}
      <footer className="relative z-10 flex items-center justify-between px-6 pb-6 sm:px-10">
        <div className="text-[11px] text-slate-500 font-mono tracking-wider">
          EXPEDITION CALIBRATION • PUNE THROUGH TIME
        </div>

        <div className="flex items-center gap-3">
          {counterProgress >= 100 ? (
            <button
              type="button"
              onClick={handleEnter}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <span>{ch0.enterCta}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnter}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors uppercase tracking-widest px-3 py-1.5"
            >
              <span>{ch0.skipCta}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
