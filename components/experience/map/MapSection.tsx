'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ExperiencePlace, ZoneId } from '@/lib/experience/types';
import {
  getAllPlaces,
  getPlaceBySlug,
  getZones,
} from '@/lib/experience/selectors';
import { getExperienceDictionary } from '@/lib/experience/i18n';
import type { MapHandle } from './MapContainer';
import {
  ZoneChips,
  LeftPanel,
  DetailDrawer,
  BottomSheet,
  MapControls,
  MapLegend,
  TourHud,
} from '../map-ui';

// Dynamically import MapContainer to ensure client-side WebGL loading
const MapContainer = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1F242D] text-white/50">
      <div className="w-10 h-10 border-2 border-white/20 border-t-[#F1293A] rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-mono">Initializing Map Engine...</p>
    </div>
  ),
});

interface MapSectionProps {
  lang?: string;
  initialCategory?: string;
  initialZone?: string;
  initialPlaceSlug?: string;
}

export default function MapSection({
  lang = 'en',
  initialCategory = 'all',
  initialZone = 'all',
  initialPlaceSlug,
}: MapSectionProps) {
  const dict = getExperienceDictionary(lang);
  const mapRef = useRef<MapHandle | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<ExperiencePlace | null>(() => {
    if (initialPlaceSlug) {
      return getPlaceBySlug(initialPlaceSlug) || null;
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedZone, setSelectedZone] = useState<ZoneId | 'all'>(
    (initialZone as ZoneId) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [is3d, setIs3d] = useState<boolean>(true);

  // Flight Tour State
  const [isTouring, setIsTouring] = useState<boolean>(false);
  const [isTourPaused, setIsTourPaused] = useState<boolean>(false);
  const [tourLeg, setTourLeg] = useState<number>(0);

  // 4 iconic stops itinerary across 5 zones
  const tourStops: { fromSlug: string; toSlug: string }[] = [
    { fromSlug: 'shaniwar-wada', toSlug: 'sinhagad-fort' },
    { fromSlug: 'sinhagad-fort', toSlug: 'pataleshwar-cave-temple' },
    { fromSlug: 'pataleshwar-cave-temple', toSlug: 'aga-khan-palace' },
    { fromSlug: 'aga-khan-palace', toSlug: 'national-war-memorial-southern-command' },
  ];

  // Deep linking: read query parameters on client mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const zn = params.get('zone');
      const plc = params.get('place');
      const tour = params.get('tour');

      if (cat) setSelectedCategory(cat);
      if (zn) setSelectedZone(zn as ZoneId);
      if (plc) {
        const found = getPlaceBySlug(plc);
        if (found) setSelectedPlace(found);
      }
      if (tour === '1' || tour === 'true') {
        startTour();
      }
    }
  }, []);

  // Handle Place Selection
  const handlePlaceSelect = useCallback((place: ExperiencePlace) => {
    setSelectedPlace(place);
    mapRef.current?.flyToPlace(place);
  }, []);

  // Handle Zone Selection
  const handleZoneSelect = useCallback((zoneId: ZoneId | 'all') => {
    setSelectedZone(zoneId);
    if (zoneId === 'all') {
      mapRef.current?.resetView();
    } else {
      const zones = getZones();
      const targetZone = zones.find((z) => z.id === zoneId);
      if (targetZone) {
        mapRef.current?.flyToZone(targetZone);
      }
    }
  }, []);

  // Handle Category Selection
  const handleCategorySelect = useCallback((catSlug: string) => {
    setSelectedCategory(catSlug);
  }, []);

  // Run next flight tour leg
  const runTourLeg = useCallback((legIndex: number) => {
    if (legIndex >= tourStops.length) {
      setIsTouring(false);
      setTourLeg(0);
      return;
    }

    setTourLeg(legIndex);
    const leg = tourStops[legIndex];
    const startPlace = getPlaceBySlug(leg.fromSlug) || getAllPlaces()[0];
    const endPlace = getPlaceBySlug(leg.toSlug) || getAllPlaces()[1];

    setSelectedPlace(startPlace);

    mapRef.current?.runVideoFlyover(startPlace, endPlace, () => {
      setSelectedPlace(endPlace);
      // Wait 2.5s at end destination then fly to next leg
      setTimeout(() => {
        setTourLeg((prev) => {
          const nextLeg = prev + 1;
          if (nextLeg < tourStops.length) {
            runTourLeg(nextLeg);
          } else {
            setIsTouring(false);
          }
          return nextLeg;
        });
      }, 2500);
    });
  }, [tourStops]);

  const startTour = useCallback(() => {
    setIsTouring(true);
    setIsTourPaused(false);
    runTourLeg(0);
  }, [runTourLeg]);

  const stopTour = useCallback(() => {
    setIsTouring(false);
    setIsTourPaused(false);
    setTourLeg(0);
    mapRef.current?.stopFlyover();
  }, []);

  const skipTourLeg = useCallback(() => {
    const nextLeg = tourLeg + 1;
    if (nextLeg < tourStops.length) {
      runTourLeg(nextLeg);
    } else {
      stopTour();
    }
  }, [tourLeg, tourStops.length, runTourLeg, stopTour]);

  // Controls Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetView = () => mapRef.current?.resetView();
  const handleToggleTilt = () => {
    setIs3d(!is3d);
    mapRef.current?.toggleTilt();
  };
  const handleLocateUser = () => mapRef.current?.locateUser();

  const currentLegConfig = tourStops[tourLeg];
  const legStartPlace = currentLegConfig ? getPlaceBySlug(currentLegConfig.fromSlug) : null;
  const legEndPlace = currentLegConfig ? getPlaceBySlug(currentLegConfig.toSlug) : null;

  return (
    <section
      id="map"
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] bg-[#1F242D] overflow-hidden select-none"
      aria-label="Interactive Map of Pune"
    >
      {/* 1. Full-screen Vector Map (MapLibre GL) */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          lang={lang}
          selectedPlace={selectedPlace}
          selectedCategory={selectedCategory}
          selectedZone={selectedZone}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>

      {/* 2. Top Center Zone Chips */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100vw-32px)]">
        <ZoneChips
          selectedZone={selectedZone}
          onSelectZone={handleZoneSelect}
          lang={lang}
        />
      </div>

      {/* 3. Left Panel (Desktop Directory & Search) */}
      <LeftPanel
        selectedPlace={selectedPlace}
        selectedCategory={selectedCategory}
        selectedZone={selectedZone}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={handleCategorySelect}
        onSelectPlace={handlePlaceSelect}
        lang={lang}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* 4. Right Detail Drawer (Desktop Place Details) */}
      <DetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        lang={lang}
      />

      {/* 5. Mobile Bottom Sheet */}
      <BottomSheet
        selectedPlace={selectedPlace}
        selectedCategory={selectedCategory}
        selectedZone={selectedZone}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={handleCategorySelect}
        onSelectPlace={handlePlaceSelect}
        onClosePlace={() => setSelectedPlace(null)}
        lang={lang}
      />

      {/* 6. Tour HUD (Shown when flight tour is active) */}
      <TourHud
        isActive={isTouring}
        isPaused={isTourPaused}
        currentLeg={tourLeg}
        totalLegs={tourStops.length}
        startPlace={legStartPlace}
        endPlace={legEndPlace}
        onPauseToggle={() => setIsTourPaused(!isTourPaused)}
        onSkip={skipTourLeg}
        onStop={stopTour}
        lang={lang}
      />

      {/* 7. Bottom Right Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onToggleTilt={handleToggleTilt}
        onLocateUser={handleLocateUser}
        lang={lang}
        is3d={is3d}
      />

      {/* 8. Bottom Left Legend & Attribution */}
      <MapLegend lang={lang} />
    </section>
  );
}
