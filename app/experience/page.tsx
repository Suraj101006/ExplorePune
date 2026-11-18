'use client';

import React, { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/LanguageContext';
import { getAllPlaces, getPlaceBySlug } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  MapStyleKey,
  DISTRICT_TOUR_STOPS,
  formatCoordinatesDD,
} from '@/lib/experience/puneDistrictData';
import './experience.css';

// Dynamic import for WebGL Map to avoid SSR overhead
const LivePuneDistrictMap = dynamic(
  () => import('@/components/experience/LivePuneDistrictMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-zinc-950 text-white/50 font-mono">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-emerald-400">
          CALIBRATING REAL PUNE DISTRICT SATELLITE ENGINE...
        </p>
      </div>
    ),
  }
);

import type { DistrictMapHandle } from '@/components/experience/LivePuneDistrictMap';
import LiveDistrictTelemetry from '@/components/experience/LiveDistrictTelemetry';
import DistrictControlPanel from '@/components/experience/DistrictControlPanel';
import DistrictLocationDrawer from '@/components/experience/DistrictLocationDrawer';
import DistrictTourController from '@/components/experience/DistrictTourController';
import DistrictMapControls from '@/components/experience/DistrictMapControls';
import DistrictDirectoryTable from '@/components/experience/DistrictDirectoryTable';

export default function ExperiencePage() {
  const { lang, isMr } = useLanguage();
  const mapRef = useRef<DistrictMapHandle | null>(null);

  const [currentStyle, setCurrentStyle] = useState<MapStyleKey>('satellite');
  const [selectedPlace, setSelectedPlace] = useState<ExperiencePlace | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [is3d, setIs3d] = useState<boolean>(true);

  // Live Telemetry state
  const [cursorLat, setCursorLat] = useState<number | null>(null);
  const [cursorLng, setCursorLng] = useState<number | null>(null);
  const [cameraPitch, setCameraPitch] = useState<number>(45);
  const [cameraBearing, setCameraBearing] = useState<number>(-15);

  // Autonomous Drone Tour state
  const [isTouring, setIsTouring] = useState<boolean>(false);
  const [isTourPaused, setIsTourPaused] = useState<boolean>(false);
  const [tourStopIndex, setTourStopIndex] = useState<number>(0);

  const allPlaces = getAllPlaces();

  // Handle Place Selection
  const handleSelectPlace = useCallback((place: ExperiencePlace) => {
    setSelectedPlace(place);
    mapRef.current?.flyToPlace(place);
  }, []);

  // Cursor Move Tracker
  const handleCursorMove = useCallback((lat: number, lng: number) => {
    setCursorLat(lat);
    setCursorLng(lng);
  }, []);

  // Camera Change Tracker
  const handleCameraChange = useCallback((pitch: number, bearing: number) => {
    setCameraPitch(pitch);
    setCameraBearing(bearing);
  }, []);

  // Autonomous Tour Execution
  const executeTourStop = useCallback((stopIdx: number) => {
    if (stopIdx >= DISTRICT_TOUR_STOPS.length) {
      setIsTouring(false);
      setTourStopIndex(0);
      return;
    }

    setTourStopIndex(stopIdx);
    const stop = DISTRICT_TOUR_STOPS[stopIdx];

    // Find place if exists
    const place = getPlaceBySlug(stop.slug);
    if (place) {
      setSelectedPlace(place);
    }

    mapRef.current?.flyToCoordinates(
      stop.latitude,
      stop.longitude,
      stop.zoom,
      stop.pitch,
      stop.bearing
    );

    // Auto advance after 4.5 seconds if tour is active
    setTimeout(() => {
      setTourStopIndex((currentIdx) => {
        const nextIdx = currentIdx + 1;
        if (nextIdx < DISTRICT_TOUR_STOPS.length) {
          executeTourStop(nextIdx);
        } else {
          setIsTouring(false);
        }
        return nextIdx;
      });
    }, 4500);
  }, []);

  const handleStartTour = useCallback(() => {
    setIsTouring(true);
    setIsTourPaused(false);
    executeTourStop(0);
  }, [executeTourStop]);

  const handleStopTour = useCallback(() => {
    setIsTouring(false);
    setIsTourPaused(false);
    setTourStopIndex(0);
    mapRef.current?.resetDistrictView();
  }, []);

  const handleSkipNext = useCallback(() => {
    const nextIdx = tourStopIndex + 1;
    if (nextIdx < DISTRICT_TOUR_STOPS.length) {
      executeTourStop(nextIdx);
    } else {
      handleStopTour();
    }
  }, [tourStopIndex, executeTourStop, handleStopTour]);

  // Controls Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => {
    setSelectedPlace(null);
    mapRef.current?.resetDistrictView();
  };
  const handleToggleTilt = () => {
    setIs3d(!is3d);
    mapRef.current?.toggleTilt();
  };
  const handleLocateUser = () => mapRef.current?.locateUser();

  // Scroll to Map and focus on a place from Directory Table
  const handleFocusPlaceFromDirectory = (slug: string) => {
    const place = getPlaceBySlug(slug);
    if (place) {
      setSelectedPlace(place);
      mapRef.current?.flyToPlace(place);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: isMr ? 'पुणे जिल्हा थेट उपग्रह नकाशा व GPS निर्देशांक' : 'Pune District Live Satellite Map & GPS Coordinates',
    description: 'Explore live coordinates and realistic satellite imagery of all 106 destinations across Pune District.',
    url: 'https://explorepune-guide.vercel.app/experience',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5204,
      longitude: 73.8567,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* ========================================================================= */}
      {/* FULL-SCREEN LIVE PUNE DISTRICT MAP VIEWPORT                               */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[88vh] min-h-[620px] max-h-[1080px] bg-zinc-950 overflow-hidden select-none">
        {/* Real Satellite / Topo / Dark MapLibre Canvas */}
        <div className="absolute inset-0 z-0">
          <LivePuneDistrictMap
            ref={mapRef}
            currentStyle={currentStyle}
            selectedPlace={selectedPlace}
            selectedCategory={selectedCategory}
            selectedTaluka={selectedTaluka}
            searchQuery={searchQuery}
            onPlaceSelect={handleSelectPlace}
            onCursorMove={handleCursorMove}
            onCameraChange={handleCameraChange}
            lang={lang}
          />
        </div>

        {/* Top Floating Live GPS Telemetry Bar */}
        <div className="absolute top-3 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-7xl mx-auto">
            <LiveDistrictTelemetry
              cursorLat={cursorLat}
              cursorLng={cursorLng}
              pitch={cameraPitch}
              bearing={cameraBearing}
              totalLocations={allPlaces.length}
              activePlaceCount={allPlaces.length}
              selectedCategoryName={selectedCategory}
              lang={lang}
            />
          </div>
        </div>

        {/* Left Floating Search & Coordinates Directory Panel */}
        <DistrictControlPanel
          selectedPlace={selectedPlace}
          selectedCategory={selectedCategory}
          selectedTaluka={selectedTaluka}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={setSelectedCategory}
          onSelectTaluka={setSelectedTaluka}
          onSelectPlace={handleSelectPlace}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          lang={lang}
        />

        {/* Right Location Coordinate Inspector Drawer */}
        <DistrictLocationDrawer
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onFocusSatellite={(p) => mapRef.current?.flyToPlace(p)}
          lang={lang}
        />

        {/* Autonomous District Tour Controller */}
        <DistrictTourController
          isTouring={isTouring}
          isPaused={isTourPaused}
          currentStopIndex={tourStopIndex}
          onStartTour={handleStartTour}
          onPauseToggle={() => setIsTourPaused(!isTourPaused)}
          onSkipNext={handleSkipNext}
          onStopTour={handleStopTour}
          lang={lang}
        />

        {/* Bottom-Right Navigation & Style Switcher Controls */}
        <DistrictMapControls
          currentStyle={currentStyle}
          onSelectStyle={setCurrentStyle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetDistrictView={handleResetView}
          onToggleTilt={handleToggleTilt}
          onLocateUser={handleLocateUser}
          is3d={is3d}
          lang={lang}
        />
      </div>

      {/* ========================================================================= */}
      {/* CRAWLABLE DISTRICT CATALOG WITH ALL 106 GPS COORDINATES (SEO / ACCESSIBLE)*/}
      {/* ========================================================================= */}
      <DistrictDirectoryTable
        lang={lang}
        onFocusPlace={handleFocusPlaceFromDirectory}
      />
    </main>
  );
}
