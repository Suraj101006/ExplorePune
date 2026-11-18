'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/LanguageContext';
import { getAllPlaces, getPlaceBySlug } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  MapStyleKey,
  DISTRICT_TOUR_STOPS,
  STORY_TRAILS,
  StoryTrail,
  PUNE_TALUKAS,
} from '@/lib/experience/puneDistrictData';
import { MapLayerState } from '@/components/experience/DistrictMapControls';
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
          CALIBRATING REAL PUNE DISTRICT GEOSPATIAL ENGINE...
        </p>
      </div>
    ),
  }
);

import type { DistrictMapHandle } from '@/components/experience/LivePuneDistrictMap';
import LiveDistrictTelemetry from '@/components/experience/LiveDistrictTelemetry';
import DistrictRegionBar from '@/components/experience/DistrictRegionBar';
import DistrictControlPanel from '@/components/experience/DistrictControlPanel';
import DistrictLocationDrawer from '@/components/experience/DistrictLocationDrawer';
import DistrictTourController from '@/components/experience/DistrictTourController';
import DistrictMapControls from '@/components/experience/DistrictMapControls';
import DistrictDirectoryTable from '@/components/experience/DistrictDirectoryTable';
import ExploreAnywhereModal from '@/components/experience/ExploreAnywhereModal';
import MapIntro from '@/components/experience/MapIntro';

export default function ExperiencePage() {
  const { lang, isMr } = useLanguage();
  const mapRef = useRef<DistrictMapHandle | null>(null);

  // Opening Intro state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Basemap & Layer states
  const [currentStyle, setCurrentStyle] = useState<MapStyleKey>('satellite');
  const [layerState, setLayerState] = useState<MapLayerState>({
    districtBoundary: true,
    talukaBoundaries: true,
    rivers: true,
    highways: true,
    markers: true,
  });

  // Discovery & Selection states
  const [selectedPlace, setSelectedPlace] = useState<ExperiencePlace | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [is3d, setIs3d] = useState<boolean>(true);

  // Explore Anywhere Spotlight Modal state
  const [isExploreModalOpen, setIsExploreModalOpen] = useState<boolean>(false);

  // Driving Route state
  const [isRouteActive, setIsRouteActive] = useState<boolean>(false);

  // Live Telemetry state
  const [cursorLat, setCursorLat] = useState<number | null>(null);
  const [cursorLng, setCursorLng] = useState<number | null>(null);
  const [cameraPitch, setCameraPitch] = useState<number>(45);
  const [cameraBearing, setCameraBearing] = useState<number>(-15);

  // Autonomous Drone Tour & Story Trails state
  const [isTouring, setIsTouring] = useState<boolean>(false);
  const [isTourPaused, setIsTourPaused] = useState<boolean>(false);
  const [tourStopIndex, setTourStopIndex] = useState<number>(0);
  const [activeStoryTrailId, setActiveStoryTrailId] = useState<string | null>(null);

  const allPlaces = getAllPlaces();

  // Complete Intro Handler
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    mapRef.current?.playIntroFlyIn();
  }, []);

  // Keyboard shortcut listener for Explore Anywhere (`/` or `Ctrl+K`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsExploreModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !isInput) {
        e.preventDefault();
        setIsExploreModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Layer Toggle
  const handleToggleLayer = useCallback((layerKey: keyof MapLayerState) => {
    setLayerState((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  // Handle Place Selection
  const handleSelectPlace = useCallback((place: ExperiencePlace) => {
    setSelectedPlace(place);
    mapRef.current?.flyToPlace(place);
  }, []);

  // Handle Taluka Selection
  const handleSelectTaluka = useCallback((talukaId: string) => {
    setSelectedTaluka(talukaId);
    mapRef.current?.flyToTaluka(talukaId);
  }, []);

  // Handle Driving Route Visualization
  const handleShowRoute = useCallback((place: ExperiencePlace) => {
    setIsRouteActive(true);
    // Pune Station: [73.8744, 18.5284]
    mapRef.current?.setDrivingRoute([73.8744, 18.5284], [place.longitude, place.latitude]);
  }, []);

  const handleClearRoute = useCallback(() => {
    setIsRouteActive(false);
    mapRef.current?.clearDrivingRoute();
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
      setActiveStoryTrailId(null);
      return;
    }

    setTourStopIndex(stopIdx);
    const stop = DISTRICT_TOUR_STOPS[stopIdx];

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
  }, []);

  const handleStartTour = useCallback(() => {
    setIsTouring(true);
    setIsTourPaused(false);
    setActiveStoryTrailId(null);
    executeTourStop(0);
  }, [executeTourStop]);

  // Story Trails Execution
  const handleSelectStoryTrail = useCallback((trail: StoryTrail) => {
    setIsTouring(true);
    setIsTourPaused(false);
    setActiveStoryTrailId(trail.id);
    setTourStopIndex(0);

    // Set animated trail line on map
    const coords: [number, number][] = trail.stops.map((s) => [s.longitude, s.latitude]);
    mapRef.current?.setStoryTrailLine(coords);

    // Fly to first stop
    const firstStop = trail.stops[0];
    if (firstStop) {
      const place = getPlaceBySlug(firstStop.slug);
      if (place) setSelectedPlace(place);
      mapRef.current?.flyToCoordinates(firstStop.latitude, firstStop.longitude, 14.8, 52, -20);
    }
  }, []);

  const handleStopTour = useCallback(() => {
    setIsTouring(false);
    setIsTourPaused(false);
    setTourStopIndex(0);
    setActiveStoryTrailId(null);
    mapRef.current?.clearStoryTrailLine();
    mapRef.current?.resetDistrictView();
  }, []);

  const handleSkipNext = useCallback(() => {
    const total = activeStoryTrailId
      ? STORY_TRAILS.find((t) => t.id === activeStoryTrailId)?.stops.length || 5
      : DISTRICT_TOUR_STOPS.length;
    const nextIdx = tourStopIndex + 1;
    if (nextIdx < total) {
      if (activeStoryTrailId) {
        const trail = STORY_TRAILS.find((t) => t.id === activeStoryTrailId);
        if (trail && trail.stops[nextIdx]) {
          setTourStopIndex(nextIdx);
          const stop = trail.stops[nextIdx];
          const place = getPlaceBySlug(stop.slug);
          if (place) setSelectedPlace(place);
          mapRef.current?.flyToCoordinates(stop.latitude, stop.longitude, 14.8, 52, -20);
        }
      } else {
        executeTourStop(nextIdx);
      }
    } else {
      handleStopTour();
    }
  }, [tourStopIndex, activeStoryTrailId, executeTourStop, handleStopTour]);

  const handleSkipPrev = useCallback(() => {
    const prevIdx = Math.max(0, tourStopIndex - 1);
    if (activeStoryTrailId) {
      const trail = STORY_TRAILS.find((t) => t.id === activeStoryTrailId);
      if (trail && trail.stops[prevIdx]) {
        setTourStopIndex(prevIdx);
        const stop = trail.stops[prevIdx];
        const place = getPlaceBySlug(stop.slug);
        if (place) setSelectedPlace(place);
        mapRef.current?.flyToCoordinates(stop.latitude, stop.longitude, 14.8, 52, -20);
      }
    } else {
      executeTourStop(prevIdx);
    }
  }, [tourStopIndex, activeStoryTrailId, executeTourStop]);

  // Orbit landmark in 3D
  const handleOrbitStop = useCallback(() => {
    if (selectedPlace) {
      mapRef.current?.orbitAroundTarget?.(selectedPlace.latitude, selectedPlace.longitude);
    } else if (activeStoryTrailId) {
      const trail = STORY_TRAILS.find((t) => t.id === activeStoryTrailId);
      const stop = trail?.stops[tourStopIndex];
      if (stop) {
        mapRef.current?.orbitAroundTarget?.(stop.latitude, stop.longitude);
      }
    } else {
      const stop = DISTRICT_TOUR_STOPS[tourStopIndex];
      if (stop) {
        mapRef.current?.orbitAroundTarget?.(stop.latitude, stop.longitude);
      }
    }
  }, [selectedPlace, activeStoryTrailId, tourStopIndex]);

  // Controls Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => {
    setSelectedPlace(null);
    setSelectedTaluka('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setIsRouteActive(false);
    mapRef.current?.clearDrivingRoute();
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
    name: isMr ? 'पुणे जिल्हा थेट संवादी नकाशा व GPS निर्देशांक' : 'Pune District Interactive Living Map & GPS Coordinates',
    description: 'Explore live coordinates, real 3D satellite terrain, 15 talukas, and all 106 destinations across Pune District.',
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

      {/* Opening Cinematic Calibration Intro */}
      <MapIntro
        isOpen={showIntro}
        onComplete={handleIntroComplete}
        lang={lang}
      />

      {/* Explore Anywhere Direct GPS Jump Spotlight Dialog */}
      <ExploreAnywhereModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        onSelectAndFly={handleSelectPlace}
        lang={lang}
      />

      {/* ========================================================================= */}
      {/* HERO: FULL-VIEWPORT LIVING PUNE DISTRICT MAP CANVAS                        */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[90vh] min-h-[640px] max-h-[1100px] bg-zinc-950 overflow-hidden select-none">
        {/* Real Satellite / Topo / Dark 3D MapLibre Canvas */}
        <div className="absolute inset-0 z-0">
          <LivePuneDistrictMap
            ref={mapRef}
            currentStyle={currentStyle}
            layerState={layerState}
            selectedPlace={selectedPlace}
            selectedCategory={selectedCategory}
            selectedTaluka={selectedTaluka}
            searchQuery={searchQuery}
            onPlaceSelect={handleSelectPlace}
            onCursorMove={handleCursorMove}
            onCameraChange={handleCameraChange}
            is3d={is3d}
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
              onOpenExploreAnywhere={() => setIsExploreModalOpen(true)}
              lang={lang}
            />
          </div>
        </div>

        {/* Top Regional Taluka Navigator Bar */}
        <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-7xl mx-auto">
            <DistrictRegionBar
              selectedTaluka={selectedTaluka}
              onSelectTaluka={handleSelectTaluka}
              allPlaces={allPlaces}
              lang={lang}
            />
          </div>
        </div>

        {/* Left Floating Search & 15-Taluka Landmark Directory Panel */}
        <DistrictControlPanel
          selectedPlace={selectedPlace}
          selectedCategory={selectedCategory}
          selectedTaluka={selectedTaluka}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={setSelectedCategory}
          onSelectTaluka={handleSelectTaluka}
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
          onShowRoute={handleShowRoute}
          onClearRoute={handleClearRoute}
          isRouteActive={isRouteActive}
          lang={lang}
        />

        {/* Autonomous District Tour & 5 Story Trails Controller */}
        <DistrictTourController
          isTouring={isTouring}
          isPaused={isTourPaused}
          currentStopIndex={tourStopIndex}
          activeStoryTrailId={activeStoryTrailId}
          onStartTour={handleStartTour}
          onSelectStoryTrail={handleSelectStoryTrail}
          onPauseToggle={() => setIsTourPaused(!isTourPaused)}
          onSkipNext={handleSkipNext}
          onSkipPrev={handleSkipPrev}
          onStopTour={handleStopTour}
          onOrbitStop={handleOrbitStop}
          onInspectStop={() => {
            // Selected place drawer opens automatically
          }}
          lang={lang}
          className={isTouring ? 'top-28 md:top-24' : 'top-28 md:top-24'}
        />

        {/* Bottom-Right Navigation, Basemap Switcher & Layer Controls */}
        <DistrictMapControls
          currentStyle={currentStyle}
          layerState={layerState}
          onSelectStyle={setCurrentStyle}
          onToggleLayer={handleToggleLayer}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetDistrictView={handleResetView}
          onToggleTilt={handleToggleTilt}
          onLocateUser={handleLocateUser}
          onReplayIntro={() => setShowIntro(true)}
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
