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
  calculateDistanceKm,
} from '@/lib/experience/puneDistrictData';
import { MapLayerState, TimeOfDayKey } from '@/components/experience/DistrictMapControls';
import { ambientAudio } from '@/lib/experience/ambientAudio';
import {
  fetchRealRoadRoute,
  fetchMultiStopRoute,
  checkArrivalThreshold,
  NavigationTravelMode,
  NavigationRouteResult,
  DeviceGpsState,
  INITIAL_GPS_STATE,
} from '@/lib/experience/navigationEngine';
import { LocationAccuracyService } from '@/lib/services/LocationAccuracyService';
import { LocationPermissionService } from '@/lib/services/LocationPermissionService';
import { PuneLocality } from '@/lib/userLocation';
import './experience.css';

// Dynamic import for WebGL Map to avoid SSR overhead
const LivePuneDistrictMap = dynamic(
  () => import('@/components/experience/LivePuneDistrictMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-zinc-950 text-white/70">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-emerald-400 font-sans font-semibold">
          Loading Pune District Open-World 3D Map...
        </p>
      </div>
    ),
  }
);

// Lazy-load non-critical modals and heavy secondary components on demand
const GpsPermissionModal = dynamic(
  () => import('@/components/experience/GpsPermissionModal'),
  { ssr: false }
);
const DiscoveryMissionsModal = dynamic(
  () => import('@/components/experience/DiscoveryMissionsModal'),
  { ssr: false }
);
const AchievementsModal = dynamic(
  () => import('@/components/experience/AchievementsModal'),
  { ssr: false }
);
const DistrictDirectoryTable = dynamic(
  () => import('@/components/experience/DistrictDirectoryTable'),
  { ssr: false }
);
const ExploreAnywhereModal = dynamic(
  () => import('@/components/experience/ExploreAnywhereModal'),
  { ssr: false }
);
const MapIntro = dynamic(
  () => import('@/components/experience/MapIntro'),
  { ssr: false }
);

import type { DistrictMapHandle } from '@/components/experience/LivePuneDistrictMap';
import type { DiscoveryMission } from '@/components/experience/DiscoveryMissionsModal';
import GameHUD, { GameMapMode, CameraModeKey } from '@/components/experience/GameHUD';
import GameMinimap from '@/components/experience/GameMinimap';
import GameControlsHUD from '@/components/experience/GameControlsHUD';
import GameWaypointBar from '@/components/experience/GameWaypointBar';
import AchievementToast from '@/components/experience/AchievementToast';
import GameNotificationBanner, { GameNotification } from '@/components/experience/GameNotificationBanner';
import DistrictRegionBar from '@/components/experience/DistrictRegionBar';
import DistrictControlPanel from '@/components/experience/DistrictControlPanel';
import DistrictLocationDrawer from '@/components/experience/DistrictLocationDrawer';
import DistrictTourController from '@/components/experience/DistrictTourController';
import {
  loadExplorationProfile,
  recordPlaceVisit,
  recordMissionCompleted,
  recordMissionStopProgress,
  ExplorationAchievement,
  UserExplorationProfile,
  MASTER_ACHIEVEMENTS,
} from '@/lib/experience/achievements';

export default function ExperiencePage() {
  const { lang, isMr } = useLanguage();
  const mapRef = useRef<DistrictMapHandle | null>(null);

  // Opening Intro state (defaults to false so users immediately access the live map)
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Basemap & Open-World Map Mode states
  const [mapMode, setMapMode] = useState<GameMapMode>('open-world');
  const [cameraMode, setCameraMode] = useState<CameraModeKey>('explorer');
  const [currentStyle, setCurrentStyle] = useState<MapStyleKey>('satellite');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayKey>('afternoon');
  const [is3d, setIs3d] = useState<boolean>(true);

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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  // Debounce search query to prevent DOM marker thrashing during typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Default collapsed for 95% unoccluded 3D map!
  const [isRegionsOpen, setIsRegionsOpen] = useState<boolean>(false); // Clean sky by default; toggleable from HUD

  // GTA GPS Waypoint & Real Road Route state
  const [waypointPlace, setWaypointPlace] = useState<ExperiencePlace | null>(null);
  const [travelMode, setTravelMode] = useState<NavigationTravelMode>('driving');
  const [routeResult, setRouteResult] = useState<NavigationRouteResult | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);
  const [isArrived, setIsArrived] = useState<boolean>(false);

  // Professional Device GPS State
  const [deviceGps, setDeviceGps] = useState<DeviceGpsState>(INITIAL_GPS_STATE);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState<boolean>(false);
  const gpsWatchIdRef = useRef<number | null>(null);

  // Discovery Missions state
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState<boolean>(false);
  const [activeMission, setActiveMission] = useState<DiscoveryMission | null>(null);

  // Exploration Achievements & Trophies state
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [activeAchievementToast, setActiveAchievementToast] = useState<ExplorationAchievement | null>(null);
  const [profile, setProfile] = useState<UserExplorationProfile>(loadExplorationProfile());

  // Game-Style Notifications state
  const [gameNotification, setGameNotification] = useState<GameNotification | null>(null);

  // AAA Cinematic Camera State
  const [isCinematicActive, setIsCinematicActive] = useState<boolean>(false);

  // User Device GPS Location (for authentic on-site proximity discovery)
  const [userLocationCoords, setUserLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Custom Multi-Stop Trail State
  const [customTrailPlaces, setCustomTrailPlaces] = useState<ExperiencePlace[]>([]);

  // Ambient Drift & Audio state
  const [isDrifting, setIsDrifting] = useState<boolean>(false);
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false);

  // Explore Anywhere Spotlight Modal state
  const [isExploreModalOpen, setIsExploreModalOpen] = useState<boolean>(false);

  // Driving Route state
  const [isRouteActive, setIsRouteActive] = useState<boolean>(false);

  // Live Camera & Telemetry state
  const [cameraState, setCameraState] = useState({
    centerLat: 18.5204,
    centerLng: 73.8567,
    bearing: -15,
    pitch: 45,
    zoom: 10.2,
  });

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

  // Handle GTA 5-Mode Camera Switcher (Declared before keyboard listener)
  const handleSelectCameraMode = useCallback((mode: CameraModeKey) => {
    setCameraMode(mode);
    mapRef.current?.setCameraMode?.(mode, selectedPlace || waypointPlace);
  }, [selectedPlace, waypointPlace]);

  // Keyboard shortcut listener for Explore Anywhere (`/` or `Ctrl+K`), Camera Modes (1-5), Missions (M), Trophies (T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key === 'Escape' && isCinematicActive) {
        e.preventDefault();
        mapRef.current?.stopCinematicSequence?.();
        return;
      }

      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsExploreModalOpen(true);
      } else if (e.key === '1') {
        handleSelectCameraMode('world');
      } else if (e.key === '2') {
        handleSelectCameraMode('explorer');
      } else if (e.key === '3') {
        handleSelectCameraMode('destination');
      } else if (e.key === '4') {
        handleSelectCameraMode('cinematic');
      } else if (e.key === '5') {
        handleSelectCameraMode('navigation');
      } else if (e.key.toLowerCase() === 'm') {
        setIsMissionsModalOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        setIsAchievementsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectCameraMode]);

  // Handle Map Mode Selection (Open-World 3D, Satellite, Classic 2D)
  const handleSelectMapMode = useCallback((mode: GameMapMode) => {
    setMapMode(mode);
    if (mode === 'open-world') {
      setCurrentStyle('satellite');
      setIs3d(true);
      mapRef.current?.pitchUp?.();
    } else if (mode === 'satellite') {
      setCurrentStyle('satellite');
      setIs3d(true);
    } else {
      setCurrentStyle('topo');
      setIs3d(false);
      mapRef.current?.pitchDown?.();
    }
  }, []);

  // Handle Layer Toggle
  const handleToggleLayer = useCallback((layerKey: keyof MapLayerState) => {
    setLayerState((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  // Handle Place Selection & Discovery Achievements Recording
  const handleSelectPlace = useCallback(
    (place: ExperiencePlace) => {
      setSelectedPlace(place);
      mapRef.current?.flyToPlace(place);

      // Record place visit for exploration trophies & optional proximity
      const {
        profile: updatedProfile,
        newlyUnlocked,
        isFirstDiscovery,
        isProximityDiscovery,
        talukaName,
      } = recordPlaceVisit(place, allPlaces, userLocationCoords || undefined);
      setProfile(updatedProfile);

      // Check if place progresses active mission
      let missionCompletedNow = false;
      if (activeMission && activeMission.stopSlugs.includes(place.slug)) {
        const { profile: msnProfile, newlyCompleted, newlyUnlocked: msnAchievements } =
          recordMissionStopProgress(activeMission.id, place.slug, activeMission.stopSlugs);
        setProfile(msnProfile);

        if (newlyCompleted) {
          missionCompletedNow = true;
          const missionStops = activeMission.stopSlugs
            .map((s) => getPlaceBySlug(s))
            .filter(Boolean) as ExperiencePlace[];
          mapRef.current?.playMissionCompletion?.(missionStops);

          setGameNotification({
            id: `msn_comp_${Date.now()}`,
            type: 'mission_completed',
            title: isMr ? `${activeMission.titleMr} पूर्ण!` : `${activeMission.titleEn} Completed!`,
            subtitle: isMr
              ? `सर्व ${activeMission.stopSlugs.length} मार्ग ठिकाणांची यशस्वी सफर!`
              : `All ${activeMission.stopSlugs.length} trail waypoints successfully explored!`,
            xp: 250,
            badge: 'MISSION COMPLETE',
          });
        }

        if (msnAchievements.length > 0) {
          setActiveAchievementToast(msnAchievements[0]);
        }
      }

      if (newlyUnlocked.length > 0) {
        setActiveAchievementToast(newlyUnlocked[0]);
        if (!missionCompletedNow) {
          setGameNotification({
            id: `ach_${Date.now()}`,
            type: 'achievement_unlocked',
            title: isMr ? newlyUnlocked[0].titleMr : newlyUnlocked[0].titleEn,
            subtitle: isMr ? newlyUnlocked[0].descriptionMr : newlyUnlocked[0].descriptionEn,
            xp: newlyUnlocked[0].xp,
            icon: newlyUnlocked[0].icon,
            badge: newlyUnlocked[0].code,
          });
        }
      } else if (isFirstDiscovery && !missionCompletedNow) {
        setGameNotification({
          id: `disc_${Date.now()}`,
          type: 'destination_discovered',
          title: isMr ? place.name_mr || place.name : place.name,
          subtitle: isProximityDiscovery
            ? `${isMr ? 'प्रत्यक्ष जागेवर शोध' : 'On-Site GPS Discovery'} · ${talukaName || place.category_slug}`
            : `${isMr ? 'अ‍ॅटलस शोध' : 'Atlas Discovery'} · ${talukaName || place.category_slug}`,
          xp: isProximityDiscovery ? 150 : 50,
          badge: isProximityDiscovery ? 'ON-SITE GPS' : 'NEW DISCOVERY',
        });
      }
    },
    [allPlaces, userLocationCoords, activeMission, isMr]
  );

  // Handle Taluka Selection
  const handleSelectTaluka = useCallback((talukaId: string) => {
    setSelectedTaluka(talukaId);
    mapRef.current?.flyToTaluka(talukaId);
  }, []);

  // Live Browser Geolocation Request & Real-Time Tracking
  const handleRequestGps = useCallback(() => {
    if (!LocationPermissionService.isSupported()) {
      setDeviceGps((prev) => ({
        ...prev,
        permissionState: 'unsupported',
        errorMessage: isMr ? 'तुमचा ब्राउझर GPS चे समर्थन करत नाही.' : 'Geolocation is not supported by your browser.',
      }));
      setIsGpsModalOpen(true);
      return;
    }

    if (!LocationPermissionService.isSecureContext()) {
      setDeviceGps((prev) => ({
        ...prev,
        permissionState: 'insecure_context',
        errorMessage: isMr ? 'स्थान निश्चितीसाठी सुरक्षित (HTTPS) कनेक्शन आवश्यक आहे.' : 'Location requires a secure connection (HTTPS).',
      }));
      setIsGpsModalOpen(true);
      return;
    }

    if (gpsWatchIdRef.current !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      gpsWatchIdRef.current = null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading, speed } = pos.coords;
        const accuracyTier = LocationAccuracyService.evaluate(accuracy);
        const speedKmh = speed ? Math.round(speed * 3.6) : null;
        const normHeading = typeof heading === 'number' && !isNaN(heading) ? heading : null;

        setDeviceGps({
          isActive: true,
          coords: { latitude, longitude },
          accuracyMeters: Math.round(accuracy),
          accuracyTier,
          heading: normHeading,
          speedKmh,
          timestamp: pos.timestamp,
          isRealGPS: true,
          permissionState: 'granted',
          errorMessage: null,
        });

        setUserLocationCoords({ latitude, longitude });

        // Update real GPS puck & accuracy circle on map
        mapRef.current?.setUserGpsLocation?.({
          latitude,
          longitude,
          accuracyMeters: accuracy,
          heading: normHeading || undefined,
        });

        // If first lock, fly map smoothly to user location
        mapRef.current?.flyToCoordinates(latitude, longitude, 14.5, 55);

        ambientAudio.playDiscoveryPing(800);
      },
      (err) => {
        console.warn('[GPS] Error:', err.message);
        if (err.code === 1) {
          // Permission denied
          setDeviceGps((prev) => ({
            ...prev,
            isActive: false,
            isRealGPS: false,
            permissionState: 'denied',
            errorMessage: isMr ? 'स्थान परवानगी नाकारली गेली.' : 'Location permission denied by user.',
          }));
          setIsGpsModalOpen(true);
        } else if (err.code === 2) {
          // Position unavailable
          setDeviceGps((prev) => ({
            ...prev,
            isActive: false,
            isRealGPS: false,
            permissionState: 'prompt',
            errorMessage: isMr ? 'स्थान सिग्नल अनुपलब्ध आहे.' : 'GPS location signal is currently unavailable.',
          }));
          setGameNotification({
            id: `gps_err_${Date.now()}`,
            type: 'mission_started',
            title: isMr ? 'GPS अनुपलब्ध' : 'GPS Signal Unavailable',
            subtitle: isMr ? 'स्थान सिग्नल सापडला नाही, व्हर्च्युअल एक्सप्लोरर वापरत आहे.' : 'Unable to acquire satellite fix. Using virtual explorer.',
            badge: 'GPS OFFLINE',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 3000,
      }
    );

    gpsWatchIdRef.current = watchId;
  }, [isMr]);

  // Clean watch on unmount
  useEffect(() => {
    return () => {
      if (gpsWatchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      }
    };
  }, []);

  const handleToggleGps = useCallback(() => {
    if (deviceGps.isActive) {
      if (gpsWatchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      setDeviceGps(INITIAL_GPS_STATE);
      mapRef.current?.setUserGpsLocation?.(null);
    } else {
      handleRequestGps();
    }
  }, [deviceGps.isActive, handleRequestGps]);

  const handleSelectLocalityFallback = useCallback((loc: PuneLocality) => {
    mapRef.current?.setExplorerPosition?.(loc.longitude, loc.latitude);
    mapRef.current?.flyToCoordinates(loc.latitude, loc.longitude, 14.2, 52);
    setGameNotification({
      id: `loc_${Date.now()}`,
      type: 'destination_discovered',
      title: isMr ? loc.nameMr : loc.nameEn,
      subtitle: isMr ? 'आरंभ स्थान निवडले' : 'Starting Origin Set',
      badge: 'ORIGIN SET',
    });
  }, [isMr]);

  // Real Road Route Calculation
  const calculateRoute = useCallback(
    async (
      targetPlace: ExperiencePlace | null,
      mode: NavigationTravelMode = travelMode
    ) => {
      if (!targetPlace) {
        setRouteResult(null);
        setIsArrived(false);
        mapRef.current?.clearGtaWaypointRoute?.();
        mapRef.current?.setWaypointBeacon?.(null);
        return;
      }

      setIsRoutingLoading(true);

      const originLat =
        deviceGps.isRealGPS && deviceGps.coords
          ? deviceGps.coords.latitude
          : cameraState.centerLat;
      const originLng =
        deviceGps.isRealGPS && deviceGps.coords
          ? deviceGps.coords.longitude
          : cameraState.centerLng;

      const result = await fetchRealRoadRoute({
        originLat,
        originLng,
        originName: deviceGps.isRealGPS ? 'Your Real GPS Position' : 'Virtual Explorer Position',
        destLat: targetPlace.latitude,
        destLng: targetPlace.longitude,
        destName: targetPlace.name,
        travelMode: mode,
        lang,
      });

      setRouteResult(result);
      setIsRoutingLoading(false);

      if (result.success && result.geometryCoordinates.length > 0) {
        mapRef.current?.setGtaWaypointRoute?.(result.geometryCoordinates, result.isRealRoad);
        mapRef.current?.setWaypointBeacon?.(targetPlace);

        const arrival = checkArrivalThreshold(
          { latitude: originLat, longitude: originLng },
          { latitude: targetPlace.latitude, longitude: targetPlace.longitude },
          150
        );

        if (arrival.hasArrived) {
          setIsArrived(true);
          ambientAudio.playDiscoveryPing(950);
          setGameNotification({
            id: `arr_${Date.now()}`,
            type: 'destination_discovered',
            title: isMr ? `${targetPlace.name_mr || targetPlace.name} येथे आगमन!` : `Arrived at ${targetPlace.name}!`,
            subtitle: isMr ? 'तुम्ही यशस्वीरीत्या गंतव्यस्थानी पोहोचलात.' : 'You have arrived at your navigation destination.',
            xp: 150,
            badge: 'ARRIVED',
          });
        } else {
          setIsArrived(false);
        }
      }
    },
    [deviceGps, cameraState, travelMode, lang, isMr]
  );

  // GTA GPS Waypoint Handlers
  const handleSetWaypoint = useCallback(
    (place: ExperiencePlace) => {
      setWaypointPlace(place);
      setSelectedPlace(place);
      ambientAudio.playUiBlip(1040, 0.08);

      calculateRoute(place, travelMode);

      setGameNotification({
        id: `wp_${Date.now()}`,
        type: 'waypoint_added',
        title: isMr ? place.name_mr || place.name : place.name,
        subtitle: isMr ? 'GPS वेपॉईंट निश्चित केला · रस्ता मार्ग शोधत आहे' : 'GPS Waypoint Locked · Calculating Road Route',
        badge: 'GPS WAYPOINT',
      });
    },
    [calculateRoute, travelMode, isMr]
  );

  const handleClearWaypoint = useCallback(() => {
    setWaypointPlace(null);
    setRouteResult(null);
    setIsArrived(false);
    mapRef.current?.clearGtaWaypointRoute?.();
    mapRef.current?.setWaypointBeacon?.(null);
    ambientAudio.playUiBlip(640, 0.04);
  }, []);

  const handleSelectTravelMode = useCallback(
    (mode: NavigationTravelMode) => {
      setTravelMode(mode);
      if (waypointPlace) {
        calculateRoute(waypointPlace, mode);
      }
    },
    [waypointPlace, calculateRoute]
  );

  // Discovery Missions Selection Handler
  const handleSelectMission = useCallback(
    (mission: DiscoveryMission, stops: ExperiencePlace[]) => {
      setActiveMission(mission);
      setCustomTrailPlaces(stops);

      // Draw mission route line on map
      const coords: [number, number][] = stops.map((s) => [s.longitude, s.latitude]);
      mapRef.current?.setCustomRouteLine?.(coords);

      // Fly to first stop of mission and position Virtual Explorer there
      if (stops[0]) {
        setSelectedPlace(stops[0]);
        setWaypointPlace(stops[0]);
        mapRef.current?.teleportExplorerToPlace?.(stops[0]);
        mapRef.current?.playMissionIntro?.(stops);
      }

      setGameNotification({
        id: `msn_start_${Date.now()}`,
        type: 'mission_started',
        title: isMr ? mission.titleMr : mission.titleEn,
        subtitle: `${stops.length} ${isMr ? 'मार्ग ठिकाणे' : 'Stops in Sequence'} · ${isMr ? 'मार्ग सक्रिय' : 'Route Active'}`,
        badge: mission.code,
      });
    },
    [isMr]
  );

  // Custom Multi-Stop Trail Handlers
  const handleAddToCustomTrail = useCallback((place: ExperiencePlace) => {
    setCustomTrailPlaces((prev) => {
      if (prev.some((p) => p.slug === place.slug)) return prev;
      return [...prev, place];
    });
  }, []);

  const handleRemoveFromCustomTrail = useCallback((slug: string) => {
    setCustomTrailPlaces((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const handleDrawCustomTrail = useCallback((places: ExperiencePlace[]) => {
    if (places.length < 2) return;
    const coords: [number, number][] = places.map((p) => [p.longitude, p.latitude]);
    mapRef.current?.setCustomRouteLine?.(coords);
  }, []);

  const handleClearCustomTrail = useCallback(() => {
    setCustomTrailPlaces([]);
    setActiveMission(null);
    mapRef.current?.clearCustomRouteLine?.();
  }, []);

  // Ambient 3D Camera Drift Toggle
  const handleToggleDrift = useCallback(() => {
    const active = mapRef.current?.toggleAmbientDrift?.();
    setIsDrifting(!!active);
  }, []);

  // Ambient Mountain Breeze Soundscape Toggle
  const handleToggleSound = useCallback(() => {
    const active = ambientAudio.toggleAmbientWind();
    setIsSoundActive(active);
  }, []);

  // Fullscreen Mode Toggle
  const handleToggleFullscreen = useCallback(() => {
    mapRef.current?.toggleFullscreen?.();
  }, []);

  // 3D Orbit Camera around a place
  const handleOrbitPlace = useCallback((place: ExperiencePlace) => {
    mapRef.current?.orbitAroundTarget?.(place.latitude, place.longitude);
  }, []);

  // Handle Driving Route Visualization
  const handleShowRoute = useCallback((place: ExperiencePlace) => {
    setIsRouteActive(true);
    handleSetWaypoint(place);
  }, [handleSetWaypoint]);

  const handleClearRoute = useCallback(() => {
    setIsRouteActive(false);
    handleClearWaypoint();
  }, [handleClearWaypoint]);

  // Cursor Move Tracker (No-op to eliminate redundant root re-renders)
  const handleCursorMove = useCallback((_lat: number, _lng: number) => {}, []);

  // Camera Change Tracker (Delegated to throttled handleCameraUpdate to prevent duplicate dispatches)
  const handleCameraChange = useCallback((_pitch: number, _bearing: number) => {}, []);

  const handleCameraUpdate = useCallback((state: { centerLat: number; centerLng: number; bearing: number; pitch: number; zoom: number }) => {
    setCameraState(state);
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

    const coords: [number, number][] = trail.stops.map((s) => [s.longitude, s.latitude]);
    mapRef.current?.setStoryTrailLine(coords);

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
    setWaypointPlace(null);
    setSelectedTaluka('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setIsRouteActive(false);
    mapRef.current?.clearDrivingRoute();
    mapRef.current?.clearGtaWaypointRoute?.();
    mapRef.current?.resetDistrictView();
  };
  const handleToggleTilt = () => {
    setIs3d(!is3d);
    mapRef.current?.toggleTilt();
  };

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
    name: isMr ? 'पुणे जिल्हा थेट संवादी नकाशा व GTA ओपन-वर्ल्ड अनुभव' : 'Pune District Open-World 3D Map & GPS Navigation',
    description: 'Explore live coordinates, 3D terrain, 15 talukas, minimap radar, and all 106 destinations across Pune District.',
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

      {/* GTA Open-World Discovery Missions Dialog */}
      <DiscoveryMissionsModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        onSelectMission={handleSelectMission}
        profile={profile}
        activeMissionId={activeMission?.id}
        lang={lang}
      />

      {/* Exploration Achievements / Trophies Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        profile={profile}
        totalLocations={allPlaces.length}
        onFlyToPlace={handleSelectPlace}
        lang={lang}
      />

      {/* Real Device GPS Permission Guidance & Fallback Modal */}
      <GpsPermissionModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        onRequestGps={handleRequestGps}
        onSelectFallbackLocality={handleSelectLocalityFallback}
        permissionState={deviceGps.permissionState}
        lang={lang}
      />

      {/* Game HUD Notification Banner */}
      <GameNotificationBanner
        notification={gameNotification}
        onDismiss={() => setGameNotification(null)}
        lang={lang}
      />

      {/* GTA In-Game Achievement Unlock Toast */}
      <AchievementToast
        achievement={activeAchievementToast}
        onDismiss={() => setActiveAchievementToast(null)}
        lang={lang}
      />

      {/* ========================================================================= */}
      {/* HERO: FULL-VIEWPORT LIVING PUNE DISTRICT 3D MAP CANVAS                     */}
      {/* ========================================================================= */}
      <div
        className="relative w-full bg-zinc-950 overflow-hidden select-none"
        style={{ height: '90vh', minHeight: '640px', maxHeight: '1100px' }}
      >
        {/* Real Satellite / Topo / 3D Open-World MapLibre Canvas */}
        <div className="absolute inset-0 z-0">
          <LivePuneDistrictMap
            ref={mapRef}
            currentStyle={currentStyle}
            timeOfDay={timeOfDay}
            layerState={layerState}
            selectedPlace={selectedPlace}
            selectedCategory={selectedCategory}
            selectedTaluka={selectedTaluka}
            searchQuery={debouncedSearchQuery}
            onPlaceSelect={handleSelectPlace}
            onCursorMove={handleCursorMove}
            onCameraChange={handleCameraChange}
            onCameraUpdate={handleCameraUpdate}
            onCinematicStateChange={setIsCinematicActive}
            is3d={is3d}
            lang={lang}
          />
        </div>

        {/* Top GTA Game HUD & Compass Tape */}
        <div className="absolute top-2 left-0 right-0 z-20 pointer-events-none">
          <GameHUD
            bearing={cameraState.bearing}
            pitch={cameraState.pitch}
            zoom={cameraState.zoom}
            centerLat={cameraState.centerLat}
            centerLng={cameraState.centerLng}
            mapMode={mapMode}
            cameraMode={cameraMode}
            timeOfDay={timeOfDay}
            onSelectMapMode={handleSelectMapMode}
            onSelectCameraMode={handleSelectCameraMode}
            onSelectTimeOfDay={setTimeOfDay}
            onOpenMissions={() => setIsMissionsModalOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenSearch={() => setIsExploreModalOpen(true)}
            onToggleAtlas={() => setIsCollapsed(!isCollapsed)}
            isAtlasOpen={!isCollapsed}
            onToggleRegions={() => setIsRegionsOpen(!isRegionsOpen)}
            isRegionsOpen={isRegionsOpen}
            totalLocations={allPlaces.length}
            unlockedTrophiesCount={profile.unlockedAchievementIds.length}
            totalTrophiesCount={MASTER_ACHIEVEMENTS.length}
            onPlayCityFlyover={() => mapRef.current?.playCityFlyover?.()}
            onPlayDistrictIntro={() => mapRef.current?.playDistrictIntro?.()}
            isRealGpsActive={deviceGps.isRealGPS}
            gpsAccuracyMeters={deviceGps.accuracyMeters}
            onToggleGps={handleToggleGps}
            lang={lang}
          />
        </div>

        {/* Skippable Cinematic Sequence Active Banner & Floating Skip Button */}
        {isCinematicActive && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/90 backdrop-blur-2xl border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white font-mono text-xs animate-in fade-in slide-in-from-top-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider">
              {isMr ? 'सिनेमॅटिक कॅमेरा सक्रिय' : 'CINEMATIC SEQUENCE ACTIVE'}
            </span>
            <button
              type="button"
              onClick={() => {
                mapRef.current?.stopCinematicSequence?.();
                ambientAudio.playUiBlip(700, 0.04);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-[10px] tracking-wider transition-all shadow-lg active:scale-95"
            >
              <span>{isMr ? 'रद्द करा' : 'SKIP SEQUENCE'}</span>
              <kbd className="px-1 py-0.5 rounded bg-black/20 text-[9px] font-mono">ESC</kbd>
            </button>
          </div>
        )}

        {/* Top Regional Taluka Navigator Bar (Toggleable from HUD) */}
        {isRegionsOpen && (
          <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none animate-in fade-in slide-in-from-top-2">
            <div className="pointer-events-auto max-w-7xl mx-auto">
              <DistrictRegionBar
                selectedTaluka={selectedTaluka}
                onSelectTaluka={handleSelectTaluka}
                allPlaces={allPlaces}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* Left Floating Search & 15-Taluka Landmark Directory Panel */}
        <DistrictControlPanel
          selectedPlace={selectedPlace}
          selectedCategory={selectedCategory}
          selectedTaluka={selectedTaluka}
          searchQuery={searchQuery}
          customTrailPlaces={customTrailPlaces}
          onSearchChange={setSearchQuery}
          onSelectCategory={setSelectedCategory}
          onSelectTaluka={handleSelectTaluka}
          onSelectPlace={handleSelectPlace}
          onAddToCustomTrail={handleAddToCustomTrail}
          onRemoveFromCustomTrail={handleRemoveFromCustomTrail}
          onDrawCustomTrail={handleDrawCustomTrail}
          onClearCustomTrail={handleClearCustomTrail}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          lang={lang}
        />

        {/* Bottom-Left Circular GTA Radar Minimap */}
        <div className={`absolute bottom-4 left-4 z-20 pointer-events-none ${selectedPlace ? 'hidden md:block' : ''}`}>
          <GameMinimap
            centerLat={cameraState.centerLat}
            centerLng={cameraState.centerLng}
            bearing={cameraState.bearing}
            pitch={cameraState.pitch}
            zoom={cameraState.zoom}
            allPlaces={allPlaces}
            selectedPlace={selectedPlace}
            waypointPlace={waypointPlace}
            onSelectPlace={handleSelectPlace}
            onResetBearing={() => mapRef.current?.resetNorth?.()}
            isRealGpsActive={deviceGps.isRealGPS}
            routeCoords={routeResult?.geometryCoordinates || []}
            lang={lang}
          />
        </div>

        {/* Bottom Floating GPS Waypoint Navigation Banner */}
        {waypointPlace && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 max-w-xl w-[calc(100%-2rem)] pointer-events-none">
            <GameWaypointBar
              waypointPlace={waypointPlace}
              multiStopPlaces={customTrailPlaces}
              playerCoords={
                deviceGps.isRealGPS && deviceGps.coords
                  ? deviceGps.coords
                  : { latitude: cameraState.centerLat, longitude: cameraState.centerLng }
              }
              isRealGpsActive={deviceGps.isRealGPS}
              gpsAccuracyMeters={deviceGps.accuracyMeters}
              travelMode={travelMode}
              onSelectTravelMode={handleSelectTravelMode}
              routeResult={routeResult}
              isRoutingLoading={isRoutingLoading}
              onRetryRoute={() => calculateRoute(waypointPlace, travelMode)}
              onFitRouteBounds={() => mapRef.current?.fitRouteBounds?.(routeResult?.geometryCoordinates || [])}
              onClearWaypoint={handleClearWaypoint}
              onFlyToWaypoint={(p) => mapRef.current?.flyToPlace(p)}
              onInspectWaypoint={(p) => setSelectedPlace(p)}
              isArrived={isArrived}
              lang={lang}
            />
          </div>
        )}

        {/* Right Location Coordinate Inspector Drawer */}
        <DistrictLocationDrawer
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onFocusSatellite={(p) => mapRef.current?.flyToPlace(p)}
          onOrbit={handleOrbitPlace}
          onShowRoute={handleShowRoute}
          onClearRoute={handleClearRoute}
          onAddToTrail={handleAddToCustomTrail}
          onSetWaypoint={handleSetWaypoint}
          onStartMissionTrail={(mission) => {
            const stops = mission.stopSlugs.map((s) => getPlaceBySlug(s)).filter(Boolean) as ExperiencePlace[];
            handleSelectMission(mission, stops);
          }}
          isPlaceInTrail={!!selectedPlace && customTrailPlaces.some((p) => p.slug === selectedPlace.slug)}
          isRouteActive={isRouteActive}
          userCoords={userLocationCoords}
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
          onInspectStop={() => {}}
          lang={lang}
          className={isTouring ? 'top-28 md:top-24' : 'top-28 md:top-24'}
        />

        {/* Bottom-Right Game Camera Controls & Shortcut Guide */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
          <GameControlsHUD
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            onRotateLeft={() => mapRef.current?.rotateLeft?.()}
            onRotateRight={() => mapRef.current?.rotateRight?.()}
            onPitchUp={() => mapRef.current?.pitchUp?.()}
            onPitchDown={() => mapRef.current?.pitchDown?.()}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleSound={handleToggleSound}
            isSoundActive={isSoundActive}
            is3d={is3d}
            onToggleTilt={handleToggleTilt}
            lang={lang}
          />
        </div>
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
