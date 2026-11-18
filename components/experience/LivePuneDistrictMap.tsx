'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Ensure MapLibre Web Worker loads from local public directory with correct module/script MIME
if (typeof window !== 'undefined') {
  try {
    maplibregl.setWorkerUrl(`${window.location.origin}/maplibre-gl-worker.js`);
  } catch {
    maplibregl.setWorkerUrl('/maplibre-gl-worker.js');
  }
}

import { getAllPlaces } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  getPuneDistrictBoundaryGeoJson,
  getPuneTalukasGeoJson,
  getPuneRiversGeoJson,
  getPuneHighwaysGeoJson,
  PUNE_TALUKAS,
  formatCoordinatesDD,
  calculateDistanceKm,
  getTalukaOrRegion,
  getElevationEstimate,
  MapStyleKey,
} from '@/lib/experience/puneDistrictData';
import { MapLayerState, TimeOfDayKey } from './DistrictMapControls';
import { CameraModeKey } from './GameHUD';
import { ambientAudio } from '@/lib/experience/ambientAudio';

export interface DistrictMapHandle {
  flyToPlace: (place: ExperiencePlace) => void;
  flyToCoordinates: (lat: number, lng: number, zoom?: number, pitch?: number, bearing?: number) => void;
  flyToTaluka: (talukaId: string) => void;
  resetDistrictView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleTilt: () => void;
  setStyle: (style: MapStyleKey) => void;
  locateUser: () => void;
  setDrivingRoute: (start: [number, number], end: [number, number]) => void;
  clearDrivingRoute: () => void;
  setStoryTrailLine: (coords: [number, number][]) => void;
  clearStoryTrailLine: () => void;
  setCustomRouteLine?: (coords: [number, number][]) => void;
  clearCustomRouteLine?: () => void;
  playIntroFlyIn: () => void;
  orbitAroundTarget?: (lat: number, lng: number) => void;
  toggleAmbientDrift?: () => boolean;
  toggleFullscreen?: () => void;
  rotateLeft?: () => void;
  rotateRight?: () => void;
  pitchUp?: () => void;
  pitchDown?: () => void;
  resetNorth?: () => void;
  setGtaWaypointRoute?: (start: [number, number], end: [number, number]) => void;
  clearGtaWaypointRoute?: () => void;
  setCameraMode?: (mode: CameraModeKey, targetPlace?: ExperiencePlace | null) => void;
}

interface LivePuneDistrictMapProps {
  currentStyle: MapStyleKey;
  layerState: MapLayerState;
  timeOfDay?: TimeOfDayKey;
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedTaluka: string;
  searchQuery: string;
  onPlaceSelect: (place: ExperiencePlace) => void;
  onCursorMove: (lat: number, lng: number) => void;
  onCameraChange: (pitch: number, bearing: number) => void;
  onCameraUpdate?: (state: {
    centerLat: number;
    centerLng: number;
    bearing: number;
    pitch: number;
    zoom: number;
  }) => void;
  is3d?: boolean;
  lang?: string;
}

// Full district bounds for extent fitting
const PUNE_DISTRICT_BOUNDS: [[number, number], [number, number]] = [
  [73.20, 18.02], // Southwest: Bhor / Velhe / Mahad border
  [75.05, 19.38], // Northeast: Junnar / Shirur / Indapur border
];

const DEFAULT_CENTER: [number, number] = [73.8567, 18.5204];
const DEFAULT_ZOOM = 10.0;
const DEFAULT_PITCH = 60;
const DEFAULT_BEARING = -20;

// Flagship destination slugs that get prominent badge labels at overview zoom
const FLAGSHIP_SLUGS = [
  'shaniwar-wada',
  'sinhagad-fort',
  'rajgad-fort',
  'shivneri-fort',
  'lonavala',
  'shreemant-dagdusheth-halwai-ganpati',
  'aga-khan-palace',
  'bhimashankar-temple',
  'karla-caves',
  'khadakwasla-dam',
];

// Real Satellite Hybrid Style
const SATELLITE_HYBRID_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, Aerogrid, IGN, IGP',
      maxzoom: 19,
    },
    'esri-reference': {
      type: 'raster',
      tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: 'esri-reference-layer',
      type: 'raster',
      source: 'esri-reference',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// Real Topographic Terrain Style
const TOPO_TERRAIN_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-topo': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: '© Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'esri-topo-layer',
      type: 'raster',
      source: 'esri-topo',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// Dark Tactical Style
const DARK_TACTICAL_STYLE = 'https://tiles.openfreemap.org/styles/dark';

/**
 * Generates an interpolated curved path between two points that mimics natural highway / valley corridors
 */
function generateCurvedPath(
  start: [number, number],
  end: [number, number],
  steps: number = 36
): [number, number][] {
  const points: [number, number][] = [];
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dist = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / (dist || 1);
  const perpY = dx / (dist || 1);
  const bend = Math.min(0.035, dist * 0.14) * (start[0] > end[0] ? 1 : -1);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const arc = Math.sin(t * Math.PI) * bend;
    const lng = start[0] + dx * t + perpX * arc;
    const lat = start[1] + dy * t + perpY * arc;
    points.push([Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
  }
  return points;
}

const LivePuneDistrictMap = forwardRef<DistrictMapHandle, LivePuneDistrictMapProps>(
  function LivePuneDistrictMap(
    {
      currentStyle,
      layerState,
      timeOfDay = 'afternoon',
      selectedPlace,
      selectedCategory,
      selectedTaluka,
      searchQuery,
      onPlaceSelect,
      onCursorMove,
      onCameraChange,
      onCameraUpdate,
      is3d = true,
      lang = 'en',
    },
    ref
  ) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const activeMarkerRef = useRef<maplibregl.Marker | null>(null);
    const travelerMarkerRef = useRef<maplibregl.Marker | null>(null);
    const customWaypointsRef = useRef<maplibregl.Marker[]>([]);

    // Animation frame refs
    const routeAnimRef = useRef<number | null>(null);
    const trailAnimRef = useRef<number | null>(null);
    const customRouteAnimRef = useRef<number | null>(null);
    const orbitAnimRef = useRef<number | null>(null);
    const driftAnimRef = useRef<number | null>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const [isTilted, setIsTilted] = useState<boolean>(is3d);
    const [isDriftActive, setIsDriftActive] = useState<boolean>(false);
    const isDriftEnabledRef = useRef<boolean>(true);

    // 1. Initialize Map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      if (typeof window !== 'undefined') {
        try {
          maplibregl.setWorkerUrl(`${window.location.origin}/maplibre-gl-worker.js`);
        } catch {
          maplibregl.setWorkerUrl('/maplibre-gl-worker.js');
        }
      }

      const initialStyle =
        currentStyle === 'satellite'
          ? SATELLITE_HYBRID_STYLE
          : currentStyle === 'topo'
          ? TOPO_TERRAIN_STYLE
          : DARK_TACTICAL_STYLE;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: initialStyle,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        bearing: DEFAULT_BEARING,
        attributionControl: false,
      });

      // Camera state emitter for GTA HUD & Minimap
      const reportCamera = () => {
        const pitch = map.getPitch();
        const bearing = map.getBearing();
        const center = map.getCenter();
        const zoom = map.getZoom();
        onCameraChange(pitch, bearing);
        onCameraUpdate?.({
          centerLat: center.lat,
          centerLng: center.lng,
          bearing,
          pitch,
          zoom,
        });
      };

      map.on('load', () => {
        setIsMapLoaded(true);
        setupAllGeographicLayers(map);
        reportCamera();
      });

      // Cursor movement telemetry
      map.on('mousemove', (e) => {
        onCursorMove(e.lngLat.lat, e.lngLat.lng);
        handleUserInteraction();
      });

      map.on('pitch', reportCamera);
      map.on('rotate', reportCamera);
      map.on('move', reportCamera);
      map.on('zoom', reportCamera);

      // Handle user interaction to pause ambient drift
      const handleUserInteraction = () => {
        if (driftAnimRef.current) {
          cancelAnimationFrame(driftAnimRef.current);
          driftAnimRef.current = null;
          setIsDriftActive(false);
        }
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (isDriftEnabledRef.current) {
          idleTimerRef.current = setTimeout(() => {
            startAmbientDrift();
          }, 8000);
        }
      };

      map.on('dragstart', handleUserInteraction);
      map.on('zoomstart', handleUserInteraction);
      map.on('rotatestart', handleUserInteraction);
      map.on('pitchstart', handleUserInteraction);

      // GTA Game-Style Keyboard Camera Navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }

        const m = mapRef.current;
        if (!m) return;

        const PAN_STEP = 55;
        const ROTATE_STEP = 6;
        const PITCH_STEP = 6;

        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            e.preventDefault();
            m.panBy([0, -PAN_STEP], { duration: 90 });
            handleUserInteraction();
            break;
          case 'KeyS':
          case 'ArrowDown':
            e.preventDefault();
            m.panBy([0, PAN_STEP], { duration: 90 });
            handleUserInteraction();
            break;
          case 'KeyA':
          case 'ArrowLeft':
            e.preventDefault();
            m.panBy([-PAN_STEP, 0], { duration: 90 });
            handleUserInteraction();
            break;
          case 'KeyD':
          case 'ArrowRight':
            e.preventDefault();
            m.panBy([PAN_STEP, 0], { duration: 90 });
            handleUserInteraction();
            break;
          case 'KeyQ':
            e.preventDefault();
            m.setBearing(m.getBearing() - ROTATE_STEP);
            handleUserInteraction();
            break;
          case 'KeyE':
            e.preventDefault();
            m.setBearing(m.getBearing() + ROTATE_STEP);
            handleUserInteraction();
            break;
          case 'KeyR':
            e.preventDefault();
            m.setPitch(Math.min(75, m.getPitch() + PITCH_STEP));
            handleUserInteraction();
            break;
          case 'KeyF':
            e.preventDefault();
            m.setPitch(Math.max(0, m.getPitch() - PITCH_STEP));
            handleUserInteraction();
            break;
          case 'Space':
            e.preventDefault();
            m.easeTo({
              center: DEFAULT_CENTER,
              zoom: DEFAULT_ZOOM,
              pitch: DEFAULT_PITCH,
              bearing: DEFAULT_BEARING,
              duration: 800,
            });
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      mapRef.current = map;

      return () => {
        window.removeEventListener('keydown', handleKeyDown);

        if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
        if (trailAnimRef.current) cancelAnimationFrame(trailAnimRef.current);
        if (customRouteAnimRef.current) cancelAnimationFrame(customRouteAnimRef.current);
        if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
        if (driftAnimRef.current) cancelAnimationFrame(driftAnimRef.current);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        customWaypointsRef.current.forEach((m) => m.remove());
        customWaypointsRef.current = [];

        if (activeMarkerRef.current) activeMarkerRef.current.remove();
        if (travelerMarkerRef.current) travelerMarkerRef.current.remove();

        map.remove();
        mapRef.current = null;
      };
    }, []);

    // Ambient Slow Cinematic Drift
    const startAmbientDrift = useCallback(() => {
      const map = mapRef.current;
      if (!map || !isDriftEnabledRef.current) return;
      if (driftAnimRef.current) cancelAnimationFrame(driftAnimRef.current);

      setIsDriftActive(true);
      let angle = map.getBearing();

      const driftLoop = () => {
        if (!mapRef.current || !isDriftEnabledRef.current) {
          setIsDriftActive(false);
          return;
        }
        angle = (angle + 0.035) % 360;
        mapRef.current.setBearing(angle);
        driftAnimRef.current = requestAnimationFrame(driftLoop);
      };

      driftAnimRef.current = requestAnimationFrame(driftLoop);
    }, []);

    // 2. Switch Styles Dynamically
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      if (currentStyle === 'satellite') {
        map.setStyle(SATELLITE_HYBRID_STYLE);
      } else if (currentStyle === 'topo') {
        map.setStyle(TOPO_TERRAIN_STYLE);
      } else {
        map.setStyle(DARK_TACTICAL_STYLE);
      }

      map.once('styledata', () => {
        setupAllGeographicLayers(map);
        renderPlaceMarkers();
      });
    }, [currentStyle]);

    // Atmospheric Horizon & Sky Lighting based on time of day
    const updateAtmosphericSky = (map: maplibregl.Map, tod: TimeOfDayKey) => {
      try {
        if (tod === 'morning') {
          map.setSky({
            'sky-color': '#7c3aed',
            'horizon-color': '#f472b6',
            'fog-color': '#a855f7',
            'fog-ground-blend': 0.45,
            'atmosphere-blend': 0.8,
          });
        } else if (tod === 'golden') {
          map.setSky({
            'sky-color': '#ea580c',
            'horizon-color': '#fed7aa',
            'fog-color': '#9a3412',
            'fog-ground-blend': 0.45,
            'atmosphere-blend': 0.85,
          });
        } else if (tod === 'night') {
          map.setSky({
            'sky-color': '#020617',
            'horizon-color': '#0f172a',
            'fog-color': '#1e293b',
            'fog-ground-blend': 0.55,
            'atmosphere-blend': 0.9,
          });
        } else {
          // afternoon / daylight
          map.setSky({
            'sky-color': '#0284c7',
            'horizon-color': '#bae6fd',
            'fog-color': '#64748b',
            'fog-ground-blend': 0.35,
            'atmosphere-blend': 0.75,
          });
        }
      } catch (e) {
        console.warn('[MapLibre] setSky notice:', e);
      }
    };

    // React to timeOfDay prop changes dynamically
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;
      updateAtmosphericSky(map, timeOfDay);
    }, [timeOfDay, isMapLoaded]);

    // 3. Setup All Geographic Vector & Boundaries
    const setupAllGeographicLayers = (map: maplibregl.Map) => {
      // 0. Real 3D DEM Terrain Elevation (AWS Open Data Terrarium Tiles)
      if (!map.getSource('terrarium-dem')) {
        map.addSource('terrarium-dem', {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 15,
        });
      }

      if (is3d) {
        try {
          map.setTerrain({ source: 'terrarium-dem', exaggeration: 1.45 });
        } catch (e) {
          console.warn('[MapLibre] 3D Terrain notice:', e);
        }
      }

      updateAtmosphericSky(map, timeOfDay);

      // A. District Perimeter
      if (!map.getSource('pune-district-source')) {
        map.addSource('pune-district-source', {
          type: 'geojson',
          data: getPuneDistrictBoundaryGeoJson(),
        });

        map.addLayer({
          id: 'pune-district-fill',
          type: 'fill',
          source: 'pune-district-source',
          layout: {
            visibility: layerState.districtBoundary ? 'visible' : 'none',
          },
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.04,
          },
        });

        map.addLayer({
          id: 'pune-district-stroke',
          type: 'line',
          source: 'pune-district-source',
          layout: {
            visibility: layerState.districtBoundary ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 2.5,
            'line-opacity': 0.85,
            'line-dasharray': [4, 2],
          },
        });
      }

      // B. 15 Taluka Boundaries
      if (!map.getSource('pune-talukas-source')) {
        map.addSource('pune-talukas-source', {
          type: 'geojson',
          data: getPuneTalukasGeoJson(),
        });

        map.addLayer({
          id: 'pune-talukas-fill',
          type: 'fill',
          source: 'pune-talukas-source',
          layout: {
            visibility: layerState.talukaBoundaries ? 'visible' : 'none',
          },
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.03,
          },
        });

        map.addLayer({
          id: 'pune-talukas-stroke',
          type: 'line',
          source: 'pune-talukas-source',
          layout: {
            visibility: layerState.talukaBoundaries ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#f59e0b',
            'line-width': 1.2,
            'line-opacity': 0.5,
            'line-dasharray': [3, 2],
          },
        });

        // Highlight selected taluka boundary with Laser Pulse
        map.addLayer({
          id: 'pune-taluka-highlight-fill',
          type: 'fill',
          source: 'pune-talukas-source',
          filter: ['==', 'id', ''],
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.22,
          },
        });

        map.addLayer({
          id: 'pune-taluka-highlight-stroke',
          type: 'line',
          source: 'pune-talukas-source',
          filter: ['==', 'id', ''],
          paint: {
            'line-color': '#f59e0b',
            'line-width': 3.8,
            'line-opacity': 1,
          },
        });
      }

      // C. Rivers & Reservoirs
      if (!map.getSource('pune-rivers-source')) {
        map.addSource('pune-rivers-source', {
          type: 'geojson',
          data: getPuneRiversGeoJson(),
        });

        map.addLayer({
          id: 'pune-rivers-polygons',
          type: 'fill',
          source: 'pune-rivers-source',
          filter: ['==', '$type', 'Polygon'],
          layout: {
            visibility: layerState.rivers ? 'visible' : 'none',
          },
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.5,
          },
        });

        map.addLayer({
          id: 'pune-rivers-lines',
          type: 'line',
          source: 'pune-rivers-source',
          filter: ['==', '$type', 'LineString'],
          layout: {
            visibility: layerState.rivers ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2.8,
            'line-opacity': 0.85,
          },
        });
      }

      // D. Major Highways
      if (!map.getSource('pune-highways-source')) {
        map.addSource('pune-highways-source', {
          type: 'geojson',
          data: getPuneHighwaysGeoJson(),
        });

        map.addLayer({
          id: 'pune-highways-lines',
          type: 'line',
          source: 'pune-highways-source',
          layout: {
            visibility: layerState.highways ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#fbbf24',
            'line-width': 2.2,
            'line-opacity': 0.75,
            'line-dasharray': [4, 1.5],
          },
        });
      }

      // E. Driving Route Line Source
      if (!map.getSource('driving-route-source')) {
        map.addSource('driving-route-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'driving-route-line',
          type: 'line',
          source: 'driving-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#06b6d4',
            'line-width': 4.5,
            'line-opacity': 0.95,
          },
        });
      }

      // F. Story Trail Line Source
      if (!map.getSource('story-trail-source')) {
        map.addSource('story-trail-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'story-trail-line',
          type: 'line',
          source: 'story-trail-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ef4444',
            'line-width': 4.2,
            'line-opacity': 0.95,
            'line-dasharray': [3, 2],
          },
        });
      }

      // G. Custom Multi-Stop Route Line Source
      if (!map.getSource('custom-route-source')) {
        map.addSource('custom-route-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'custom-route-line',
          type: 'line',
          source: 'custom-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 4.5,
            'line-opacity': 0.95,
          },
        });
      }

      // H. GTA GPS Glowing Waypoint Route (Dual-Layered Neon Trail)
      if (!map.getSource('gta-waypoint-source')) {
        map.addSource('gta-waypoint-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // Outer Neon Glow Trail
        map.addLayer({
          id: 'gta-waypoint-glow',
          type: 'line',
          source: 'gta-waypoint-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#06b6d4',
            'line-width': 10,
            'line-opacity': 0.5,
            'line-blur': 4,
          },
        });

        // Inner Laser Core
        map.addLayer({
          id: 'gta-waypoint-core',
          type: 'line',
          source: 'gta-waypoint-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 3.5,
            'line-opacity': 0.95,
          },
        });
      }

      // 3D Building Extrusions for Open-World Mode (if building data is present)
      try {
        const style = map.getStyle();
        const hasBuildingLayer = style.layers?.some((l) => (l as unknown as { 'source-layer'?: string })['source-layer'] === 'building');
        if (hasBuildingLayer && !map.getLayer('3d-buildings-extrusion')) {
          map.addLayer({
            id: '3d-buildings-extrusion',
            source: 'openmaptiles',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': '#1e293b',
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
              'fill-extrusion-opacity': 0.85,
            },
          });
        }
      } catch {}

      renderPlaceMarkers();
    };

    // 4. Update Layer Visibilities based on layerState prop
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      const setVisibility = (layerId: string, visible: boolean) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        }
      };

      setVisibility('pune-district-fill', layerState.districtBoundary);
      setVisibility('pune-district-stroke', layerState.districtBoundary);
      setVisibility('pune-talukas-fill', layerState.talukaBoundaries);
      setVisibility('pune-talukas-stroke', layerState.talukaBoundaries);
      setVisibility('pune-rivers-polygons', layerState.rivers);
      setVisibility('pune-rivers-lines', layerState.rivers);
      setVisibility('pune-highways-lines', layerState.highways);

      // Markers visibility
      markersRef.current.forEach((m) => {
        const el = m.getElement();
        if (el) el.style.display = layerState.markers ? 'flex' : 'none';
      });
    }, [layerState, isMapLoaded]);

    // 5. Update Taluka Highlight Filter
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      const filter: any =
        selectedTaluka && selectedTaluka !== 'all' ? ['==', 'id', selectedTaluka] : ['==', 'id', ''];
      if (map.getLayer('pune-taluka-highlight-fill')) {
        map.setFilter('pune-taluka-highlight-fill', filter);
      }
      if (map.getLayer('pune-taluka-highlight-stroke')) {
        map.setFilter('pune-taluka-highlight-stroke', filter);
      }
    }, [selectedTaluka, isMapLoaded]);

    // 6. Sync 3D Perspective & Camera Pitch when is3d changes
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      setIsTilted(is3d);
      if (is3d) {
        try {
          if (map.getSource('terrarium-dem')) {
            map.setTerrain({ source: 'terrarium-dem', exaggeration: 1.45 });
          }
          map.easeTo({ pitch: 60, bearing: -20, duration: 800 });
        } catch (e) {
          console.warn('Set pitch notice:', e);
        }
      } else {
        try {
          map.setTerrain(null);
          map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
        } catch (e) {
          console.warn('Clear pitch notice:', e);
        }
      }
    }, [is3d, isMapLoaded]);

    // 7. Render All 106 Location Markers with Level of Detail & Hover Cards
    const renderPlaceMarkers = () => {
      const map = mapRef.current;
      if (!map) return;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const allPlaces = getAllPlaces();
      const q = searchQuery.trim().toLowerCase();

      const filtered = allPlaces.filter((p) => {
        if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) return false;
        if (selectedTaluka !== 'all') {
          const taluka = getTalukaOrRegion(p.latitude, p.longitude, p.address);
          if (taluka.id !== selectedTaluka && !taluka.nameEn.toLowerCase().includes(selectedTaluka.toLowerCase())) {
            return false;
          }
        }
        if (q) {
          const matchName = (p.name || '').toLowerCase().includes(q) || (p.name_mr || '').toLowerCase().includes(q);
          const matchCoords = p.latitude.toString().includes(q) || p.longitude.toString().includes(q);
          return matchName || matchCoords;
        }
        return true;
      });

      filtered.forEach((place) => {
        const el = document.createElement('div');
        el.className = 'group relative flex flex-col items-center cursor-pointer select-none';

        // Distinct category color & icon
        let color = '#10b981';
        let icon = '📍';
        if (place.category_slug === 'forts') { color = '#ef4444'; icon = '🏰'; }
        else if (place.category_slug === 'heritage') { color = '#f59e0b'; icon = '🏛️'; }
        else if (place.category_slug === 'temples') { color = '#f97316'; icon = '🛕'; }
        else if (place.category_slug === 'museums') { color = '#8b5cf6'; icon = '🏺'; }
        else if (place.category_slug === 'nature') { color = '#10b981'; icon = '🌲'; }
        else if (place.category_slug === 'parks') { color = '#06b6d4'; icon = '💧'; }
        else if (place.category_slug === 'food') { color = '#ec4899'; icon = '☕'; }

        const coordsStr = `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;
        const placeName = lang === 'mr' ? place.name_mr || place.name : place.name;
        const isFlagship = FLAGSHIP_SLUGS.includes(place.slug);
        const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);
        const dist = calculateDistanceKm(18.5204, 73.8567, place.latitude, place.longitude);
        const elevation = getElevationEstimate(place.latitude, place.longitude, place.category_slug);

        el.innerHTML = `
          <!-- Interactive Floating Hover Card -->
          <div class="pointer-events-none absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-60 p-2.5 rounded-2xl bg-black/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 z-50 text-white">
            <div class="relative h-24 w-full rounded-xl overflow-hidden bg-zinc-900 mb-2">
              <img src="${place.image_url || '/images/hero-shaniwar-wada.webp'}" alt="${placeName}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-wider bg-black/85 text-emerald-300 border border-emerald-500/40">
                ${place.category_slug}
              </span>
              <span class="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono text-white/90 bg-black/80 border border-white/10">
                ${taluka.nameEn.split(' ')[0]}
              </span>
            </div>
            <div class="font-black text-xs text-white truncate px-0.5 leading-snug">${placeName}</div>
            <div class="flex items-center justify-between text-[9px] font-mono text-white/60 mt-1 px-0.5">
              <span class="text-amber-300 font-bold">${coordsStr}</span>
              <span class="text-emerald-400 font-bold">${dist} km</span>
              <span class="text-cyan-300">⛰️ ~${elevation}m</span>
            </div>
            <div class="mt-2 pt-1.5 border-t border-white/10 text-[9px] font-mono text-emerald-300/90 text-center font-bold uppercase tracking-wider">
              Click to Fly & Orbit 3D ↗
            </div>
          </div>

          <!-- Pin Head Badge (Flagships always, others on hover or zoom in) -->
          <div class="marker-title-badge ${isFlagship ? 'flex' : 'hidden group-hover:flex'} items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 text-white border border-white/20 text-[10px] font-mono whitespace-nowrap shadow-2xl mb-1 transition-transform group-hover:scale-105">
            <span>${icon}</span>
            <span class="font-bold text-white text-[10px]">${placeName}</span>
            <span class="text-[9px] text-amber-300 font-bold ml-1">⛰️~${elevation}m</span>
          </div>

          <!-- Pulsing Beacon Pin Point -->
          <div class="relative flex items-center justify-center transition-transform group-hover:scale-125">
            <span class="absolute inline-flex h-7 w-7 rounded-full opacity-60 pin-ripple-anim" style="background-color: ${color};"></span>
            <span class="relative inline-flex items-center justify-center rounded-full h-5 w-5 border-2 border-white/95 shadow-2xl text-[9px]" style="background-color: ${color};">
              <span class="scale-75">${icon}</span>
            </span>
          </div>
        `;

        el.addEventListener('mouseenter', () => {
          ambientAudio.playUiBlip(720, 0.03);
        });

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ambientAudio.playUiBlip(980, 0.06);
          onPlaceSelect(place);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([place.longitude, place.latitude])
          .addTo(map);

        if (!layerState.markers) {
          el.style.display = 'none';
        }

        markersRef.current.push(marker);
      });
    };

    // Update markers when filters or search change
    useEffect(() => {
      if (isMapLoaded) {
        renderPlaceMarkers();
      }
    }, [selectedCategory, selectedTaluka, searchQuery, isMapLoaded, lang]);

    // 8. Active Selected Place Indicator
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !selectedPlace) {
        if (activeMarkerRef.current) {
          activeMarkerRef.current.remove();
          activeMarkerRef.current = null;
        }
        return;
      }

      if (activeMarkerRef.current) {
        activeMarkerRef.current.remove();
      }

      const activeEl = document.createElement('div');
      activeEl.className = 'flex flex-col items-center pointer-events-none z-40 select-none';
      const coordsText = formatCoordinatesDD(selectedPlace.latitude, selectedPlace.longitude, 5);
      const name = lang === 'mr' ? selectedPlace.name_mr || selectedPlace.name : selectedPlace.name;

      activeEl.innerHTML = `
        <div class="px-3.5 py-1.5 rounded-2xl bg-black/95 text-white border-2 border-emerald-400 shadow-2xl backdrop-blur-xl mb-2 text-center animate-bounce">
          <div class="text-xs font-black uppercase tracking-wider text-emerald-400 truncate max-w-[220px]">${name}</div>
          <div class="text-[9px] font-mono text-amber-300 font-bold tracking-tight">${coordsText}</div>
        </div>
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-80"></span>
          <span class="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white shadow-2xl"></span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: activeEl, anchor: 'bottom' })
        .setLngLat([selectedPlace.longitude, selectedPlace.latitude])
        .addTo(map);

      activeMarkerRef.current = marker;
    }, [selectedPlace, lang]);

    // 9. Imperative Handle Methods
    useImperativeHandle(ref, () => ({
      flyToPlace: (place: ExperiencePlace) => {
        const map = mapRef.current;
        if (!map) return;
        map.flyTo({
          center: [place.longitude, place.latitude],
          zoom: 15.2,
          pitch: isTilted ? 54 : 0,
          bearing: -20,
          duration: 1800,
          essential: true,
        });
      },

      flyToCoordinates: (lat: number, lng: number, zoom = 14, pitch = 45, bearing = -15) => {
        const map = mapRef.current;
        if (!map) return;
        map.flyTo({
          center: [lng, lat],
          zoom,
          pitch: isTilted ? pitch : 0,
          bearing,
          duration: 1800,
          essential: true,
        });
      },

      flyToTaluka: (talukaId: string) => {
        const map = mapRef.current;
        if (!map) return;
        if (talukaId === 'all') {
          map.fitBounds(PUNE_DISTRICT_BOUNDS, {
            padding: 60,
            duration: 1800,
            pitch: isTilted ? DEFAULT_PITCH : 0,
          });
          return;
        }
        const taluka = PUNE_TALUKAS.find((t) => t.id === talukaId);
        if (taluka) {
          map.fitBounds(taluka.bounds, { padding: 50, duration: 1800, pitch: isTilted ? 48 : 0 });
        }
      },

      resetDistrictView: () => {
        const map = mapRef.current;
        if (!map) return;
        map.fitBounds(PUNE_DISTRICT_BOUNDS, {
          padding: 60,
          duration: 1600,
          pitch: isTilted ? DEFAULT_PITCH : 0,
        });
      },

      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),

      toggleTilt: () => {
        const map = mapRef.current;
        if (!map) return;
        const nextTilt = !isTilted;
        setIsTilted(nextTilt);
        if (nextTilt) {
          map.easeTo({ pitch: 55, bearing: -15, duration: 800 });
        } else {
          map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
        }
      },

      setStyle: (style: MapStyleKey) => {
        // Handled via prop
      },

      locateUser: () => {
        if (!navigator.geolocation || !mapRef.current) {
          alert(lang === 'mr' ? 'लोकेशन परमिशन उपलब्ध नाही' : 'Geolocation is not supported by your browser.');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 14.5,
              pitch: isTilted ? 45 : 0,
              duration: 1800,
            });

            // Pulse beacon for user location
            const userPin = document.createElement('div');
            userPin.className = 'relative flex items-center justify-center';
            userPin.innerHTML = `
              <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-xl"></span>
            `;
            new maplibregl.Marker({ element: userPin })
              .setLngLat([longitude, latitude])
              .addTo(mapRef.current!);
          },
          (err) => {
            console.warn('Geolocation error:', err.message);
            alert(lang === 'mr' ? 'कृपया ब्राऊझर लोकेशन परमिशन सुरू करा' : 'Please allow location permission to view your location.');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      },

      // Progressive Animated Driving Route Line Drawing with Moving Traveler Beacon
      setDrivingRoute: (start: [number, number], end: [number, number]) => {
        const map = mapRef.current;
        if (!map) return;

        // Cancel prior route animations
        if (routeAnimRef.current) {
          cancelAnimationFrame(routeAnimRef.current);
          routeAnimRef.current = null;
        }
        if (travelerMarkerRef.current) {
          travelerMarkerRef.current.remove();
          travelerMarkerRef.current = null;
        }

        const fullCoords = generateCurvedPath(start, end, 36);

        // Create glowing traveler beacon
        const travelerEl = document.createElement('div');
        travelerEl.className = 'relative flex items-center justify-center pointer-events-none z-30';
        travelerEl.innerHTML = `
          <span class="absolute inline-flex h-8 w-8 rounded-full bg-cyan-400/50 animate-ping"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-7 w-7 bg-cyan-600 border-2 border-white shadow-2xl text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
            </svg>
          </span>
        `;

        const marker = new maplibregl.Marker({ element: travelerEl, anchor: 'center' })
          .setLngLat(start)
          .addTo(map);
        travelerMarkerRef.current = marker;

        // Fit map bounds
        const bounds = new maplibregl.LngLatBounds(start, end);
        map.fitBounds(bounds, { padding: 90, duration: 1600, pitch: isTilted ? 48 : 0 });

        let step = 1;
        const animate = () => {
          if (!mapRef.current) return;
          const currentSlice = fullCoords.slice(0, step);
          const src = mapRef.current.getSource('driving-route-source') as maplibregl.GeoJSONSource;
          if (src) {
            src.setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: currentSlice,
                  },
                  properties: {},
                },
              ],
            });
          }

          const tip = fullCoords[step - 1];
          if (tip && travelerMarkerRef.current) {
            travelerMarkerRef.current.setLngLat(tip);
          }

          if (step < fullCoords.length) {
            step += 1;
            routeAnimRef.current = requestAnimationFrame(animate);
          }
        };

        routeAnimRef.current = requestAnimationFrame(animate);
      },

      clearDrivingRoute: () => {
        const map = mapRef.current;
        if (routeAnimRef.current) {
          cancelAnimationFrame(routeAnimRef.current);
          routeAnimRef.current = null;
        }
        if (travelerMarkerRef.current) {
          travelerMarkerRef.current.remove();
          travelerMarkerRef.current = null;
        }
        if (!map) return;
        const src = map.getSource('driving-route-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({ type: 'FeatureCollection', features: [] });
        }
      },

      // Progressive Animated Story Trail Drawing
      setStoryTrailLine: (coords: [number, number][]) => {
        const map = mapRef.current;
        if (!map || coords.length === 0) return;

        if (trailAnimRef.current) {
          cancelAnimationFrame(trailAnimRef.current);
          trailAnimRef.current = null;
        }

        const interpolated: [number, number][] = [];
        for (let i = 0; i < coords.length - 1; i++) {
          const seg = generateCurvedPath(coords[i], coords[i + 1], 16);
          interpolated.push(...seg);
        }
        if (interpolated.length === 0) interpolated.push(...coords);

        const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
        coords.forEach((pt) => bounds.extend(pt));
        map.fitBounds(bounds, { padding: 80, duration: 1800, pitch: isTilted ? 50 : 0 });

        let step = 1;
        const animateTrail = () => {
          if (!mapRef.current) return;
          const currentSlice = interpolated.slice(0, step);
          const src = mapRef.current.getSource('story-trail-source') as maplibregl.GeoJSONSource;
          if (src) {
            src.setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: currentSlice,
                  },
                  properties: {},
                },
              ],
            });
          }

          if (step < interpolated.length) {
            step += 1;
            trailAnimRef.current = requestAnimationFrame(animateTrail);
          }
        };

        trailAnimRef.current = requestAnimationFrame(animateTrail);
      },

      clearStoryTrailLine: () => {
        const map = mapRef.current;
        if (trailAnimRef.current) {
          cancelAnimationFrame(trailAnimRef.current);
          trailAnimRef.current = null;
        }
        if (!map) return;
        const src = map.getSource('story-trail-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({ type: 'FeatureCollection', features: [] });
        }
      },

      // Custom Multi-Stop Trail Drawing & Numbered Waypoints
      setCustomRouteLine: (coords: [number, number][]) => {
        const map = mapRef.current;
        if (!map || coords.length === 0) return;

        if (customRouteAnimRef.current) {
          cancelAnimationFrame(customRouteAnimRef.current);
          customRouteAnimRef.current = null;
        }
        customWaypointsRef.current.forEach((m) => m.remove());
        customWaypointsRef.current = [];

        // Add numbered waypoint markers
        coords.forEach((coord, idx) => {
          const wpEl = document.createElement('div');
          wpEl.className = 'flex items-center justify-center pointer-events-none z-30';
          wpEl.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-emerald-500 text-black border-2 border-white shadow-xl flex items-center justify-center font-mono font-black text-[11px] animate-pulse">
              ${idx + 1}
            </div>
          `;
          const m = new maplibregl.Marker({ element: wpEl, anchor: 'center' })
            .setLngLat(coord)
            .addTo(map);
          customWaypointsRef.current.push(m);
        });

        // Generate curved path across all waypoints
        const interpolated: [number, number][] = [];
        for (let i = 0; i < coords.length - 1; i++) {
          const seg = generateCurvedPath(coords[i], coords[i + 1], 18);
          interpolated.push(...seg);
        }
        if (interpolated.length === 0) interpolated.push(...coords);

        const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
        coords.forEach((pt) => bounds.extend(pt));
        map.fitBounds(bounds, { padding: 90, duration: 1800, pitch: isTilted ? 48 : 0 });

        let step = 1;
        const animate = () => {
          if (!mapRef.current) return;
          const currentSlice = interpolated.slice(0, step);
          const src = mapRef.current.getSource('custom-route-source') as maplibregl.GeoJSONSource;
          if (src) {
            src.setData({
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: currentSlice,
                  },
                  properties: {},
                },
              ],
            });
          }

          if (step < interpolated.length) {
            step += 1;
            customRouteAnimRef.current = requestAnimationFrame(animate);
          }
        };

        customRouteAnimRef.current = requestAnimationFrame(animate);
      },

      clearCustomRouteLine: () => {
        const map = mapRef.current;
        if (customRouteAnimRef.current) {
          cancelAnimationFrame(customRouteAnimRef.current);
          customRouteAnimRef.current = null;
        }
        customWaypointsRef.current.forEach((m) => m.remove());
        customWaypointsRef.current = [];
        if (!map) return;
        const src = map.getSource('custom-route-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({ type: 'FeatureCollection', features: [] });
        }
      },

      // 3D Cinematic Orbit around a Landmark
      orbitAroundTarget: (lat: number, lng: number) => {
        const map = mapRef.current;
        if (!map) return;
        if (orbitAnimRef.current) {
          cancelAnimationFrame(orbitAnimRef.current);
          orbitAnimRef.current = null;
        }

        let bearing = map.getBearing();
        let frames = 0;
        const maxFrames = 220;
        const bearingStep = 360 / maxFrames;

        const orbit = () => {
          if (!mapRef.current) return;
          bearing += bearingStep;
          mapRef.current.setBearing(bearing);
          frames += 1;
          if (frames < maxFrames) {
            orbitAnimRef.current = requestAnimationFrame(orbit);
          }
        };

        map.flyTo({
          center: [lng, lat],
          zoom: 15.6,
          pitch: 58,
          duration: 1400,
        });

        setTimeout(() => {
          orbitAnimRef.current = requestAnimationFrame(orbit);
        }, 1400);
      },

      // Toggle Ambient 3D Camera Drift
      toggleAmbientDrift: () => {
        isDriftEnabledRef.current = !isDriftEnabledRef.current;
        if (!isDriftEnabledRef.current) {
          if (driftAnimRef.current) {
            cancelAnimationFrame(driftAnimRef.current);
            driftAnimRef.current = null;
          }
          setIsDriftActive(false);
          return false;
        } else {
          startAmbientDrift();
          return true;
        }
      },

      // Fullscreen Mode Toggle
      toggleFullscreen: () => {
        const target = wrapperRef.current || containerRef.current;
        if (!target) return;
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          target.requestFullscreen().catch(() => {});
        }
      },

      // GTA On-Screen & Keyboard Camera Handlers
      rotateLeft: () => {
        const m = mapRef.current;
        if (!m) return;
        m.easeTo({ bearing: m.getBearing() - 25, duration: 250 });
      },

      rotateRight: () => {
        const m = mapRef.current;
        if (!m) return;
        m.easeTo({ bearing: m.getBearing() + 25, duration: 250 });
      },

      pitchUp: () => {
        const m = mapRef.current;
        if (!m) return;
        m.easeTo({ pitch: Math.min(75, m.getPitch() + 15), duration: 250 });
      },

      pitchDown: () => {
        const m = mapRef.current;
        if (!m) return;
        m.easeTo({ pitch: Math.max(0, m.getPitch() - 15), duration: 250 });
      },

      resetNorth: () => {
        const m = mapRef.current;
        if (!m) return;
        m.easeTo({ bearing: 0, duration: 350 });
      },

      // Set Dual-Layered Glowing GPS Waypoint Navigation Line
      setGtaWaypointRoute: (start: [number, number], end: [number, number]) => {
        const m = mapRef.current;
        if (!m) return;
        const curved = generateCurvedPath(start, end, 40);
        const src = m.getSource('gta-waypoint-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: curved,
                },
                properties: {},
              },
            ],
          });
        }
      },

      clearGtaWaypointRoute: () => {
        const m = mapRef.current;
        if (!m) return;
        const src = m.getSource('gta-waypoint-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
      },

      // GTA 5-Mode Camera Director
      setCameraMode: (mode: CameraModeKey, targetPlace?: ExperiencePlace | null) => {
        const m = mapRef.current;
        if (!m) return;

        // Cancel any active orbit loop if leaving cinematic mode
        if (mode !== 'cinematic' && orbitAnimRef.current) {
          cancelAnimationFrame(orbitAnimRef.current);
          orbitAnimRef.current = null;
        }

        switch (mode) {
          case 'world':
            // Wide aerial overview of entire Pune District
            m.flyTo({
              center: DEFAULT_CENTER,
              zoom: 9.3,
              pitch: 42,
              bearing: -15,
              duration: 1600,
              essential: true,
            });
            break;

          case 'explorer':
            // Angled 3D view for open-world exploration
            m.flyTo({
              zoom: 12.4,
              pitch: 62,
              bearing: -25,
              duration: 1200,
              essential: true,
            });
            break;

          case 'destination':
            // Close camera focused on landmark
            if (targetPlace) {
              m.flyTo({
                center: [targetPlace.longitude, targetPlace.latitude],
                zoom: 15.6,
                pitch: 66,
                bearing: -35,
                duration: 1600,
                essential: true,
              });
            } else if (selectedPlace) {
              m.flyTo({
                center: [selectedPlace.longitude, selectedPlace.latitude],
                zoom: 15.6,
                pitch: 66,
                bearing: -35,
                duration: 1600,
                essential: true,
              });
            } else {
              m.flyTo({
                zoom: 14.5,
                pitch: 65,
                bearing: -30,
                duration: 1200,
              });
            }
            break;

          case 'cinematic':
            // Continuous 360° circular orbit flyover
            const lat = targetPlace?.latitude || selectedPlace?.latitude || m.getCenter().lat;
            const lng = targetPlace?.longitude || selectedPlace?.longitude || m.getCenter().lng;
            m.flyTo({
              center: [lng, lat],
              zoom: 15.4,
              pitch: 64,
              duration: 1400,
            });
            setTimeout(() => {
              let curBearing = m.getBearing();
              const loop = () => {
                if (!mapRef.current) return;
                curBearing = (curBearing + 0.18) % 360;
                mapRef.current.setBearing(curBearing);
                orbitAnimRef.current = requestAnimationFrame(loop);
              };
              orbitAnimRef.current = requestAnimationFrame(loop);
            }, 1400);
            break;

          case 'navigation':
            // Route-following camera angled towards destination
            if (targetPlace) {
              const dLat = targetPlace.latitude - m.getCenter().lat;
              const dLng = targetPlace.longitude - m.getCenter().lng;
              const angleRad = Math.atan2(dLng, dLat);
              const bearingDeg = (angleRad * 180) / Math.PI;
              m.flyTo({
                zoom: 14.2,
                pitch: 68,
                bearing: bearingDeg,
                duration: 1500,
                essential: true,
              });
            } else {
              m.flyTo({
                pitch: 68,
                duration: 800,
              });
            }
            break;
        }
      },

      // Opening Cinematic Fly-In from Maharashtra overview to Pune District
      playIntroFlyIn: () => {
        const map = mapRef.current;
        if (!map) return;
        map.jumpTo({
          center: [73.8567, 18.5204],
          zoom: 7.0,
          pitch: 0,
          bearing: 0,
        });

        setTimeout(() => {
          map.flyTo({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            pitch: DEFAULT_PITCH,
            bearing: DEFAULT_BEARING,
            duration: 2400,
            essential: true,
          });
        }, 300);
      },
    }));

    // Time-of-Day atmospheric overlay class
    const todOverlayClass =
      timeOfDay === 'morning'
        ? 'tod-overlay-morning'
        : timeOfDay === 'golden'
        ? 'tod-overlay-golden'
        : timeOfDay === 'night'
        ? 'tod-overlay-night'
        : 'tod-overlay-afternoon';

    return (
      <div ref={wrapperRef} className="relative w-full h-full min-h-[580px] bg-zinc-950 overflow-hidden select-none">
        {/* Real Satellite / Topo / Dark Canvas */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Time-of-Day Atmospheric Filter */}
        <div className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-1000 ${todOverlayClass}`} />

        {/* Subtle Ambient Drift Indicator in bottom corner */}
        {isDriftActive && (
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CINEMATIC 3D DRIFT ACTIVE</span>
          </div>
        )}
      </div>
    );
  }
);

export default LivePuneDistrictMap;
