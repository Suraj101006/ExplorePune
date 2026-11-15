'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useLanguage } from '@/lib/LanguageContext';
import './experience.css';

// Dynamic client import for Three.js WebGL canvas (zero SSR overhead)
const ExperienceCanvas = dynamic(
  () => import('@/components/experience/ExperienceCanvas'),
  {
    ssr: false,
    loading: () => <div className="exp-canvas-container" aria-hidden="true" />,
  }
);

// Dynamic 3D World Component
const ExperienceWorld3D = dynamic(
  () => import('@/components/experience/ExperienceWorld3D'),
  {
    ssr: false,
    loading: () => <div className="exp-section exp-world3d-section" style={{ minHeight: 600 }} />,
  }
);

// Experience Foundation: Context Provider, Lenis Smooth Motion, Web Audio Architecture, and Central WebGL Scene
import ExperienceProvider from '@/components/experience/context/ExperienceProvider';
import LenisBootstrap from '@/components/experience/motion/LenisBootstrap';
import AudioManager from '@/components/experience/audio/AudioManager';
import AudioControls from '@/components/experience/audio/AudioControls';
import LazyWebGLCanvas from '@/components/experience/webgl/LazyWebGLCanvas';

// Custom Interactive Trailing Cursor
import ExperienceCursor from '@/components/experience/ExperienceCursor';
import ExperienceCinematicIntro from '@/components/experience/ExperienceCinematicIntro';

// 9 Epic Chapters of "Pune Through Time"
import {
  ChapterPreloader,
  ChapterArrival,
  ChapterEpochs,
  ChapterPathways,
  ChapterLivingMap,
  ChapterPlayground,
  ChapterSeasons,
  ChapterPlan,
  ChapterOutro,
} from '@/components/experience/chapters';

// Core Experience Discoveries & Storytelling Sections (SSR & Crawlable Content)
import ExperienceHero from '@/components/experience/ExperienceHero';
import ExperienceNavSticky from '@/components/experience/ExperienceNavSticky';
import ExperiencePinnedJourney from '@/components/experience/ExperiencePinnedJourney';
import ExperienceCategories from '@/components/experience/ExperienceCategories';
import ExperienceMap from '@/components/experience/ExperienceMap';
import HeritageStorySection from '@/components/experience/HeritageStorySection';
import AdventureFortsSection from '@/components/experience/AdventureFortsSection';
import TasteOfPuneSection from '@/components/experience/TasteOfPuneSection';
import ExperienceCuriosityCabinet from '@/components/experience/ExperienceCuriosityCabinet';
import CultureTraditionsSection from '@/components/experience/CultureTraditionsSection';
import NatureEscapesSection from '@/components/experience/NatureEscapesSection';
import HiddenGemsSection from '@/components/experience/HiddenGemsSection';
import SeasonalExperienceSection from '@/components/experience/SeasonalExperienceSection';
import PersonalizedFinder from '@/components/experience/PersonalizedFinder';
import ItineraryBuilderSection from '@/components/experience/ItineraryBuilderSection';
import ExperienceStoriesSection from '@/components/experience/ExperienceStoriesSection';
import CommunityProgressSection from '@/components/experience/CommunityProgressSection';
import ExperienceFooterCta from '@/components/experience/ExperienceFooterCta';

export default function ExperiencePage() {
  const { isMr } = useLanguage();
  const [showIntro, setShowIntro] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(true);
    try {
      const dismissed = sessionStorage.getItem('ep_experience_intro_dismissed');
      if (dismissed !== 'true') {
        // First visit overture if desired
      }
    } catch (e) {
      // Graceful fallback in sandboxed iframe/storage environments
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('ep_experience_intro_dismissed', 'true');
    } catch (e) {}
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Structured Data (JSON-LD) for SEO, GEO & AI Search Discovery
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': 'https://explorepune-guide.vercel.app/experience#destination',
        name: 'Experience Pune — Immersive Tourism Discovery Platform',
        alternateName: 'पुणे अनुभव: काळाच्या प्रवासात',
        description:
          'Next-generation immersive tourism discovery platform exploring 106 verified destinations, 3D interactive terrain, Maratha forts, Peshwa heritage wadas, authentic culinary institutions, and seasonal itineraries across Pune, Maharashtra.',
        url: 'https://explorepune-guide.vercel.app/experience',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 18.5204,
          longitude: 73.8567,
        },
        hasMap: 'https://explorepune-guide.vercel.app/experience#map',
        touristType: [
          'Heritage Tourism',
          'Adventure Tourism',
          'Culinary Tourism',
          'Spiritual Pilgrimage',
          'Cultural Tourism',
          '3D Virtual Tourism',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://explorepune-guide.vercel.app/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Experience',
            item: 'https://explorepune-guide.vercel.app/experience',
          },
        ],
      },
    ],
  };

  return (
    <ExperienceProvider>
      <AudioManager>
        <LenisBootstrap>
          <main className="experience-root relative min-h-screen text-slate-100 bg-[#080b11]">
            {/* Chapter 0: Preloader & Hardware Calibration (0% to 100% Devanagari Counter) */}
            <ChapterPreloader onComplete={handleIntroComplete} />

            {/* Optional 10-Second Cinematic Opening Overture Replay */}
            {showIntro && isClient && (
              <ExperienceCinematicIntro
                onComplete={handleIntroComplete}
                isMr={isMr}
              />
            )}

            {/* JSON-LD Schema Script */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            {/* Central WebGL Three.js Scene: Sahyadri terrain, Sinhagad summit, Shaniwar Wada plinth & sky dome */}
            <LazyWebGLCanvas sceneId="central-world" />

            {/* Subtle Three.js Fixed Background WebGL Starfield/Particles Canvas */}
            <ExperienceCanvas currentScene={1} />

            {/* Floating Glassmorphic Audio Controls HUD */}
            <AudioControls />

            {/* Interactive Trailing Cursor (Desktop) */}
            <ExperienceCursor />

            {/* Atmospheric Overlays */}
            <div className="exp-vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
            <div className="exp-grid-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />

            {/* Sticky Quick-Navigation Bar with 9 Chapters, Calm/Lite Mode & Audio Toggle */}
            <ExperienceNavSticky isMr={isMr} onReplayIntro={handleReplayIntro} />

            {/* Sequential Episodic Chapters (0 to 8) */}
            <div className="exp-content-wrapper relative z-10">
              {/* Chapter 1: Arrival ("प्रवेश" / Threshold: The Basalt Horizon) */}
              <ChapterArrival />
              <div className="sr-only">
                <ExperienceHero isMr={isMr} />
              </div>

              {/* Chapter 2: Four Epochs ("चार युगे" / The 4 Epochs of Pune) */}
              <ChapterEpochs />
              <div className="sr-only">
                <ExperiencePinnedJourney isMr={isMr} />
              </div>

              {/* Chapter 3: Sixteen Pathways ("सोळा वाटा" / The 16 Living Veins) */}
              <ChapterPathways />
              <div className="sr-only">
                <ExperienceCategories isMr={isMr} />
              </div>

              {/* Chapter 4: Living Map ("जिवंत नकाशा" / Cartography of 17 Peths & 106 Sanctuaries) */}
              <ChapterLivingMap />
              <div className="sr-only">
                <ExperienceWorld3D isMr={isMr} />
                <ExperienceMap isMr={isMr} />
              </div>

              {/* Chapter 5: Tactile Playground ("खेळ आणि कौशल्य" / 5 Tactile Mini-Games) */}
              <ChapterPlayground />

              {/* Deep-Dive Cultural Heritage & Sanctuaries Catalog (Server-Rendered & Accessible) */}
              <section className="exp-deep-dive-archive max-w-7xl mx-auto px-4 py-12 space-y-16">
                <div id="heritage">
                  <HeritageStorySection isMr={isMr} />
                </div>
                <div id="forts">
                  <AdventureFortsSection isMr={isMr} />
                </div>
                <div id="food">
                  <TasteOfPuneSection isMr={isMr} />
                </div>
                <div id="curiosities">
                  <ExperienceCuriosityCabinet isMr={isMr} />
                </div>
                <div id="culture">
                  <CultureTraditionsSection isMr={isMr} />
                </div>
                <div id="nature">
                  <NatureEscapesSection isMr={isMr} />
                </div>
                <div id="gems">
                  <HiddenGemsSection isMr={isMr} />
                </div>
              </section>

              {/* Chapter 6: Seasons ("चार ऋतू" / The Sahyadri Breath) */}
              <ChapterSeasons />
              <div className="sr-only">
                <SeasonalExperienceSection isMr={isMr} />
              </div>

              {/* Chapter 7: Your Plan ("नियोजन आणि पासपोर्ट" / The Pune Expedition Studio) */}
              <ChapterPlan />
              <div className="sr-only">
                <PersonalizedFinder isMr={isMr} />
                <ItineraryBuilderSection isMr={isMr} />
                <CommunityProgressSection isMr={isMr} />
              </div>

              {/* Chapter 8: Outro ("समारोप" / The Deccan Reverie & Horizon Portal) */}
              <ChapterOutro />
              <div className="sr-only">
                <ExperienceStoriesSection isMr={isMr} />
                <ExperienceFooterCta isMr={isMr} />
              </div>
            </div>
          </main>
        </LenisBootstrap>
      </AudioManager>
    </ExperienceProvider>
  );
}
