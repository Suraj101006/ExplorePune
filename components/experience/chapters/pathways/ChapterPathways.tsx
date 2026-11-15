'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Mountain,
  Flame,
  Trees,
  Utensils,
  Palette,
  ShoppingBag,
  Compass,
  PartyPopper,
  Moon,
  Heart,
  Camera,
  X,
  ExternalLink,
} from 'lucide-react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getExperienceI18n } from '@/lib/experience/i18n';
import { getPathwayCategories, getPlacesByPathway, PathwayCategorySummary } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experienceData';
import { globalChapterRegistry } from '@/lib/experience/registry';
import { useScrollTriggerManager, toDevanagariDigits } from '@/components/experience/motion/motionUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Icon Map helper
const ICON_MAP: Record<string, React.ReactNode> = {
  Mountain: <Mountain className="h-5 w-5 text-amber-400" />,
  Flame: <Flame className="h-5 w-5 text-orange-400" />,
  Trees: <Trees className="h-5 w-5 text-emerald-400" />,
  Utensils: <Utensils className="h-5 w-5 text-amber-400" />,
  Sparkles: <Sparkles className="h-5 w-5 text-yellow-400" />,
  Palette: <Palette className="h-5 w-5 text-rose-400" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5 text-amber-400" />,
  Compass: <Compass className="h-5 w-5 text-sky-400" />,
  PartyPopper: <PartyPopper className="h-5 w-5 text-purple-400" />,
  Moon: <Moon className="h-5 w-5 text-indigo-400" />,
  Heart: <Heart className="h-5 w-5 text-rose-400" />,
  Camera: <Camera className="h-5 w-5 text-cyan-400" />,
  MapPin: <MapPin className="h-5 w-5 text-amber-400" />,
};

export default function ChapterPathways() {
  const { isLiteMode, prefersReducedMotion, lang, isMr, scrubChapter } = useExperience();
  const dict = getExperienceI18n(lang);
  const ch3 = dict.chapters.ch3_pathways;
  const categories = getPathwayCategories();
  const { addTrigger } = useScrollTriggerManager();

  const isReduced = prefersReducedMotion || isLiteMode;

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [selectedPathway, setSelectedPathway] = useState<PathwayCategorySummary | null>(null);
  const [pathwayPlaces, setPathwayPlaces] = useState<ExperiencePlace[]>([]);

  // Dragging and inertia state
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(0);
  const prevTranslateRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Register Chapter 3 in global registry
  useEffect(() => {
    globalChapterRegistry.register({
      id: 'pathways',
      titleEn: ch3.title,
      titleMr: ch3.title,
      order: 3,
      scrub: (p) => {
        // Handled by ScrollTrigger
      },
    });

    return () => {
      globalChapterRegistry.unregister('pathways');
    };
  }, [ch3.title]);

  // Update places when pathway modal opens
  const handleOpenPathway = (cat: PathwayCategorySummary) => {
    setSelectedPathway(cat);
    const places = getPlacesByPathway(cat.id);
    setPathwayPlaces(places);
  };

  const handleClosePathway = () => {
    setSelectedPathway(null);
    setPathwayPlaces([]);
  };

  // Pinned Horizontal Scrub via ScrollTrigger
  useEffect(() => {
    if (isReduced || !containerRef.current || !pinTrackRef.current || !railRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const rail = railRef.current;
    const calculateMaxScroll = () => {
      return rail.scrollWidth - window.innerWidth + 120;
    };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinTrackRef.current,
      scrub: 0.8,
      onUpdate: (self) => {
        if (isDraggingRef.current) return; // Don't override while user is dragging
        const progress = self.progress;
        scrubChapter('pathways', progress);

        const maxScroll = calculateMaxScroll();
        const targetX = -progress * maxScroll;
        currentTranslateRef.current = targetX;
        gsap.set(rail, { x: targetX });

        // Update active card index based on progress
        const idx = Math.min(
          Math.floor(progress * categories.length),
          categories.length - 1
        );
        setActiveCardIndex(idx);
      },
    });

    addTrigger(trigger);

    return () => {
      trigger.kill();
    };
  }, [isReduced, addTrigger, scrubChapter, categories.length]);

  // Keyboard Arrow Navigation
  const shiftRailByIndex = useCallback(
    (newIndex: number) => {
      const clamped = Math.max(0, Math.min(categories.length - 1, newIndex));
      setActiveCardIndex(clamped);

      if (railRef.current) {
        const cardWidth = 340; // Approx card width + gap
        const targetX = -clamped * cardWidth;
        currentTranslateRef.current = targetX;
        gsap.to(railRef.current, {
          x: targetX,
          duration: 0.45,
          ease: 'power3.out',
        });
      }
    },
    [categories.length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        shiftRailByIndex(activeCardIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        shiftRailByIndex(activeCardIndex - 1);
      }
    },
    [activeCardIndex, shiftRailByIndex]
  );

  // Mouse / Touch Drag Support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isReduced) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    prevTranslateRef.current = currentTranslateRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !railRef.current) return;
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dx = e.clientX - startXRef.current;

    if (dt > 0) {
      velocityRef.current = dx / dt;
    }

    const maxScroll = railRef.current.scrollWidth - window.innerWidth + 120;
    let nextX = prevTranslateRef.current + dx;

    // Elastic damping beyond bounds
    if (nextX > 0) {
      nextX = nextX * 0.35;
    } else if (nextX < -maxScroll) {
      const over = nextX + maxScroll;
      nextX = -maxScroll + over * 0.35;
    }

    currentTranslateRef.current = nextX;
    gsap.set(railRef.current, { x: nextX });
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current || !railRef.current) return;
    isDraggingRef.current = false;

    // Apply inertia release
    const inertiaDistance = velocityRef.current * 180;
    const maxScroll = railRef.current.scrollWidth - window.innerWidth + 120;
    let finalX = currentTranslateRef.current + inertiaDistance;

    finalX = Math.max(-maxScroll, Math.min(0, finalX));
    currentTranslateRef.current = finalX;

    gsap.to(railRef.current, {
      x: finalX,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  // 3D Card Hover Tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: -y * 12,
      rotateY: x * 12,
      scale: 1.02,
      duration: 0.25,
      ease: 'power1.out',
      transformPerspective: 1000,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced) return;
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={containerRef}
      id="pathways"
      className={`relative w-full ${isReduced ? 'min-h-screen py-16' : 'h-[320vh]'} bg-[#080b11] text-slate-100 overflow-hidden select-none`}
      aria-label={ch3.title}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        ref={pinTrackRef}
        className={`relative w-full ${isReduced ? 'min-h-screen' : 'h-screen'} flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#080b11] via-[#0f172a] to-[#04060a]`}
      >
        {/* Top Header: Badge, Title & Navigation Controls */}
        <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-6 sm:px-12 border-b border-slate-800/60 pb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="rounded-full bg-saffron-600/20 border border-saffron-500/40 px-3 py-1 text-xs font-semibold text-saffron-300 font-mono uppercase tracking-wider">
                {ch3.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {isMr ? '१६ प्रमाणित शोध मार्ग' : '16 Verified Pathways'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display-pune">
              {ch3.title}
            </h2>
          </div>

          {/* Left / Right Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftRailByIndex(activeCardIndex - 1)}
              disabled={activeCardIndex <= 0}
              className="p-2 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Previous Pathway Card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">
              {isMr
                ? `${toDevanagariDigits(activeCardIndex + 1)} / ${toDevanagariDigits(16)}`
                : `${activeCardIndex + 1} / 16`}
            </span>
            <button
              type="button"
              onClick={() => shiftRailByIndex(activeCardIndex + 1)}
              disabled={activeCardIndex >= categories.length - 1}
              className="p-2 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Next Pathway Card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Center Draggable Rail (Desktop/Pinned) OR Accessible Grid (Reduced Motion) */}
        <main
          className="relative z-10 flex-1 flex items-center overflow-hidden py-4"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {isReduced ? (
            /* Accessible CSS Grid for Calm / Lite Mode */
            <div className="w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[80vh]">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  onClick={() => handleOpenPathway(cat)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between hover:border-amber-400 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-900/50 rounded px-2 py-0.5">
                        {isMr ? toDevanagariDigits(idx + 1) : String(idx + 1).padStart(2, '0')}
                      </span>
                      {ICON_MAP[cat.iconName] || <Compass className="h-5 w-5 text-amber-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 font-display-pune mb-1">
                      {isMr ? cat.titleMr : cat.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium mb-2">{cat.tagline}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      {isMr
                        ? `${toDevanagariDigits(cat.placeCount)} ${ch3.stopsLabel}`
                        : `${cat.placeCount} Destinations`}
                    </span>
                    <span className="text-amber-400 font-semibold">{ch3.viewPathway} →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Kinetic 3D Hover Tilt Horizontal Draggable Rail */
            <div
              ref={railRef}
              className="flex items-center gap-6 px-12 will-change-transform cursor-grab active:cursor-grabbing"
              style={{ transform: 'translateX(0px)' }}
            >
              {categories.map((cat, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <div
                    key={cat.id}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    onClick={() => handleOpenPathway(cat)}
                    className={`relative w-[300px] sm:w-[340px] h-[460px] rounded-2xl border transition-all duration-300 flex-shrink-0 flex flex-col justify-between p-6 overflow-hidden backdrop-blur-md cursor-pointer ${
                      isActive
                        ? 'border-amber-400 bg-slate-900/90 shadow-[0_20px_48px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 shadow-xl'
                    }`}
                  >
                    {/* Background Subtle Gradient */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Card Header: Devanagari Numeral Badge & Icon */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1">
                        {isMr ? toDevanagariDigits(idx + 1) : String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                        {ICON_MAP[cat.iconName] || <Compass className="h-5 w-5 text-amber-400" />}
                      </div>
                    </div>

                    {/* Card Body: Title, Tagline & Description */}
                    <div className="relative z-10 my-auto pt-6">
                      <h3 className="text-xl font-bold text-slate-100 font-display-pune mb-1.5 leading-snug">
                        {isMr ? cat.titleMr : cat.title}
                      </h3>
                      <p className="text-xs font-semibold text-amber-400 mb-3">{cat.tagline}</p>
                      <p className="text-xs text-slate-400 font-body-pune leading-relaxed line-clamp-4">
                        {cat.description}
                      </p>
                    </div>

                    {/* Card Footer: Stops Count & Explore Action */}
                    <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        <strong className="text-slate-200">
                          {isMr ? toDevanagariDigits(cat.placeCount) : cat.placeCount}
                        </strong>{' '}
                        {ch3.stopsLabel}
                      </span>
                      <span className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
                        {ch3.viewPathway}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Bottom Bar: Drag & Keyboard Instructions */}
        <footer className="relative z-20 flex items-center justify-between px-6 pb-6 sm:px-12 border-t border-slate-800/60 pt-3">
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            {ch3.dragInstruction}
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Use Left/Right arrow keys to navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
              →
            </kbd>
          </div>
        </footer>
      </div>

      {/* Pathway Places Modal / Drawer */}
      {selectedPathway && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPathway.title}
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <header className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  {selectedPathway.tagline}
                </span>
                <h3 className="text-xl font-bold font-display-pune mt-0.5">
                  {isMr ? selectedPathway.titleMr : selectedPathway.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClosePathway}
                className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Places List */}
            <div className="p-6 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-400 mb-4">{selectedPathway.description}</p>
              {pathwayPlaces.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  {isMr ? 'या मार्गातील माहिती उपलब्ध होत आहे...' : 'Loading verified places...'}
                </p>
              ) : (
                pathwayPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">
                          {isMr ? (place.name_mr || place.name) : place.name}
                        </h4>
                        <span className="text-xs text-slate-400">{place.category}</span>
                      </div>
                    </div>
                    <a
                      href={`/destinations/${place.slug}`}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:underline font-mono"
                    >
                      <span>{isMr ? 'पहा' : 'View'}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <footer className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                {isMr
                  ? `${toDevanagariDigits(pathwayPlaces.length)} ठिकाणे पडताळली`
                  : `${pathwayPlaces.length} Verified Destinations`}
              </span>
              <button
                type="button"
                onClick={handleClosePathway}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
              >
                {dict.common.close}
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
