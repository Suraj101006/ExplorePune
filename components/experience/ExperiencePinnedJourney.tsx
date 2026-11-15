'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Compass,
  Landmark,
  Mountain,
  Flame,
  Clock,
} from 'lucide-react';
import { EXPERIENCE_STORIES_DATA } from '@/lib/experienceData';

interface ExperiencePinnedJourneyProps {
  isMr: boolean;
}

const EPOCH_STAGES = [
  {
    step: '01',
    epoch: '8th Century CE',
    title: 'The Basalt Monoliths',
    titleMr: 'अखंड पाषाण शिल्पे',
    kicker: 'Subterranean Roots of Punyavishaya',
    kickerMr: 'पुण्यविषयाची प्राचीन मुळे',
    description: 'Deep beneath modern Jangli Maharaj Road, 8th-century Rashtrakuta artisans carved Pataleshwar out of a single monolithic basalt bedrock. A subterranean sanctuary honoring Lord Shiva that has withstood twelve centuries of monsoon downpours.',
    imageUrl: '/images/places/pataleshwar-cave-temple.jpg',
    themeColor: '#d97706',
    keyLandmark: 'Pataleshwar Cave Temple',
  },
  {
    step: '02',
    epoch: '17th Century CE',
    title: 'The Swarajya Bastions',
    titleMr: 'स्वराज्याची अजिंक्य तोरणे',
    kicker: 'Chhatrapati Shivaji Maharaj & Sinhagad',
    kickerMr: 'छत्रपती शिवाजी महाराज व सिंहगड',
    description: 'From Lal Mahal where Shivaji Maharaj spent his boyhood to the legendary midnight storming of Sinhagad by Tanaji Malusare, Pune became the fiery political forge of Maratha Swarajya.',
    imageUrl: '/images/places/sinhagad-fort.jpg',
    themeColor: '#10b981',
    keyLandmark: 'Sinhagad Fort & Lal Mahal',
  },
  {
    step: '03',
    epoch: '18th Century CE',
    title: 'The Imperial Peshwa Court',
    titleMr: 'पेशवेकालीन वैभव',
    kicker: 'Shaniwar Wada & The 17 Planned Peths',
    kickerMr: 'शनिवार वाडा व १७ पेठा',
    description: 'Peshwa Bajirao I built Shaniwar Wada, elevating Pune to the imperial command post of the Maratha Confederacy. Timbered wadas with carved peacocks, copper alleys in Tambat Ali, and evening chants on Parvati Hill defined this golden age.',
    imageUrl: '/images/places/shaniwar-wada.jpg',
    themeColor: '#f59e0b',
    keyLandmark: 'Shaniwar Wada & Vishrambaug',
  },
  {
    step: '04',
    epoch: '19th & 20th Century CE',
    title: 'The Crucible of Freedom & Reform',
    titleMr: 'क्रांती आणि समाजसुधारणा',
    kicker: 'Universal Education, Tilak & Gandhi',
    kickerMr: 'स्त्रीशिक्षण, टिळक आणि गांधी',
    description: 'India\'s first girls\' school by Savitribai and Jyotirao Phule at Bhide Wada, Lokmanya Tilak\'s national Ganesh festival at Kesari Wada, and Mahatma Gandhi\'s internment at Aga Khan Palace — Pune led India\'s cultural renaissance.',
    imageUrl: '/images/places/aga-khan-palace.jpg',
    themeColor: '#38bdf8',
    keyLandmark: 'Aga Khan Palace & Kesari Wada',
  },
];

export default function ExperiencePinnedJourney({ isMr }: ExperiencePinnedJourneyProps) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // Scroll observer to trigger stage changes
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = containerRef.current.offsetHeight - viewportHeight;

      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrolled = Math.abs(rect.top);
        const progress = Math.min(Math.max(scrolled / totalDist, 0), 0.99);
        const stepIdx = Math.floor(progress * EPOCH_STAGES.length);
        setActiveStep(stepIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentEpoch = EPOCH_STAGES[activeStep] || EPOCH_STAGES[0];

  return (
    <section
      id="pinned-journey"
      ref={containerRef}
      className="exp-pinned-journey-section"
      aria-label="Pinned Epoch Storytelling"
    >
      <div className="exp-pinned-sticky-stage">
        {/* Ambient Radial Lighting based on active epoch */}
        <div
          className="exp-pinned-ambient"
          style={{
            background: `radial-gradient(circle at 70% 50%, ${currentEpoch.themeColor}22 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        <div className="exp-container">
          {/* Section Kicker */}
          <div className="exp-pinned-topbar">
            <div className="exp-pinned-kicker">
              <Layers size={14} style={{ color: currentEpoch.themeColor }} />
              <span>{isMr ? 'पुण्याचा जीवनप्रवाह • ४ ऐतिहासिक युगे' : 'THE LIVING PULSE OF PUNE • 4 EPOCHS'}</span>
            </div>
            {/* Step Progress Pills */}
            <div className="exp-pinned-indicators">
              {EPOCH_STAGES.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`exp-indicator-dot ${activeStep === idx ? 'active' : ''}`}
                  style={{
                    backgroundColor: activeStep === idx ? s.themeColor : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={`Jump to stage ${s.step}: ${s.title}`}
                />
              ))}
            </div>
          </div>

          {/* Main Visual Display Grid */}
          <div className="exp-pinned-grid">
            {/* Left: Dramatic Kinetic Typography */}
            <div className="exp-pinned-typography">
              <div className="exp-pinned-epoch-badge">
                <span>{currentEpoch.epoch}</span>
                <span className="dot" />
                <span>Stage {currentEpoch.step}/04</span>
              </div>

              <h2 className="exp-pinned-title">
                {isMr ? currentEpoch.titleMr : currentEpoch.title}
              </h2>

              <p className="exp-pinned-subkicker">
                {isMr ? currentEpoch.kickerMr : currentEpoch.kicker}
              </p>

              <p className="exp-pinned-desc">
                {currentEpoch.description}
              </p>

              <div className="exp-pinned-landmark-box">
                <Landmark size={15} style={{ color: currentEpoch.themeColor }} />
                <span>
                  <strong>{isMr ? 'प्रमुख वारसा:' : 'Key Bastion:'}</strong> {currentEpoch.keyLandmark}
                </span>
              </div>
            </div>

            {/* Right: Dynamic Cinematic Visual Mask */}
            <div className="exp-pinned-visual">
              <div className="exp-pinned-image-frame">
                <Image
                  key={currentEpoch.imageUrl}
                  src={currentEpoch.imageUrl}
                  alt={currentEpoch.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="exp-pinned-img"
                  priority
                />
                <div className="exp-pinned-mask-overlay" />
                <div className="exp-pinned-floating-year">
                  {currentEpoch.epoch}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Instruction Hint */}
        <div className="exp-pinned-scroll-hint" aria-hidden="true">
          <span>{isMr ? 'पुढील युग पाहण्यासाठी खाली स्क्रोल करा' : 'Scroll to travel across epochs'}</span>
          <div className="line" />
        </div>
      </div>
    </section>
  );
}
