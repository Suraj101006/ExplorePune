'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getAllPlaces } from '@/lib/experience/selectors';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  getPuneDistrictBoundaryGeoJson,
  getPuneTalukasGeoJson,
  getPuneRiversGeoJson,
  getPuneHighwaysGeoJson,
  PUNE_TALUKAS,
  formatCoordinatesDD,
  MapStyleKey,
} from '@/lib/experience/puneDistrictData';
import { MapLayerState } from './DistrictMapControls';

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
  playIntroFlyIn: () => void;
  orbitAroundTarget?: (lat: number, lng: number) => void;
}

interface LivePuneDistrictMapProps {
  currentStyle: MapStyleKey;
  layerState: MapLayerState;
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedTaluka: string;
  searchQuery: string;
  onPlaceSelect: (place: ExperiencePlace) => void;
  onCursorMove: (lat: number, lng: number) => void;
  onCameraChange: (pitch: number, bearing: number) => void;
  is3d?: boolean;
  lang?: string;
}

// Full district bounds for extent fitting
const PUNE_DISTRICT_BOUNDS: [[number, number], [number, number]] = [
  [73.20, 18.02], // Southwest: Bhor / Velhe / Mahad border
  [75.05, 19.38], // Northeast: Junnar / Shirur / Indapur border
];

const DEFAULT_CENTER: [number, number] = [73.8567, 18.5204];
const DEFAULT_ZOOM = 10.2;
const DEFAULT_PITCH = 45;
const DEFAULT_BEARING = -15;

// AWS Open Data Terrarium DEM Tiles (Free, No Auth Key required)
const AWS_TERRARIUM_DEM_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

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
      selectedPlace,
      selectedCategory,
      selectedTaluka,
      searchQuery,
      onPlaceSelect,
      onCursorMove,
      onCameraChange,
      is3d = true,
      lang = 'en',
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const activeMarkerRef = useRef<maplibregl.Marker | null>(null);
    const travelerMarkerRef = useRef<maplibregl.Marker | null>(null);

    // Animation frames refs
    const routeAnimRef = useRef<number | null>(null);
    const trailAnimRef = useRef<number | null>(null);
    const orbitAnimRef = useRef<number | null>(null);

    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const [isTilted, setIsTilted] = useState<boolean>(is3d);

    // 1. Initialize Map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

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

      map.on('load', () => {
        setIsMapLoaded(true);
        setupAllGeographicLayers(map);
      });

      // Cursor movement telemetry
      map.on('mousemove', (e) => {
        onCursorMove(e.lngLat.lat, e.lngLat.lng);
      });

      // Camera changes telemetry
      const reportCamera = () => {
        onCameraChange(map.getPitch(), map.getBearing());
      };
      map.on('pitch', reportCamera);
      map.on('rotate', reportCamera);

      mapRef.current = map;

      return () => {
        if (routeAnimRef.current) cancelAnimationFrame(routeAnimRef.current);
        if (trailAnimRef.current) cancelAnimationFrame(trailAnimRef.current);
        if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        if (activeMarkerRef.current) activeMarkerRef.current.remove();
        if (travelerMarkerRef.current) travelerMarkerRef.current.remove();

        map.remove();
        mapRef.current = null;
      };
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

    // 3. Setup All Geographic Vector & Terrain Layers
    const setupAllGeographicLayers = (map: maplibregl.Map) => {
      // A. Real 3D Terrain DEM & Hillshading
      if (!map.getSource('terrain-dem')) {
        try {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: [AWS_TERRARIUM_DEM_TILES],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15,
          });

          // Add hillshade layer for Sahyadri slope relief
          if (!map.getLayer('terrain-hillshade')) {
            map.addLayer({
              id: 'terrain-hillshade',
              type: 'hillshade',
              source: 'terrain-dem',
              layout: { visibility: 'visible' },
              paint: {
                'hillshade-shadow-color': '#090d16',
                'hillshade-highlight-color': '#ffffff',
                'hillshade-accent-color': '#0284c7',
                'hillshade-exaggeration': 0.7,
              },
            });
          }

          if (is3d) {
            map.setTerrain({ source: 'terrain-dem', exaggeration: 1.6 });
          }
        } catch (e) {
          console.warn('3D Terrain source notice:', e);
        }
      }

      // B. District Perimeter
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
            'fill-opacity': 0.05,
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

      // C. 15 Taluka Boundaries
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

        // Highlight selected taluka boundary
        map.addLayer({
          id: 'pune-taluka-highlight-fill',
          type: 'fill',
          source: 'pune-talukas-source',
          filter: ['==', 'id', ''],
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.18,
          },
        });

        map.addLayer({
          id: 'pune-taluka-highlight-stroke',
          type: 'line',
          source: 'pune-talukas-source',
          filter: ['==', 'id', ''],
          paint: {
            'line-color': '#f59e0b',
            'line-width': 3.2,
            'line-opacity': 0.95,
          },
        });
      }

      // D. Rivers & Reservoirs
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
            'fill-opacity': 0.45,
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
            'line-width': 2.5,
            'line-opacity': 0.8,
          },
        });
      }

      // E. Major Highways
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
            'line-width': 2,
            'line-opacity': 0.65,
            'line-dasharray': [4, 1.5],
          },
        });
      }

      // F. Driving Route Line Source
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

      // G. Story Trail Line Source
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
            'line-width': 4,
            'line-opacity': 0.9,
            'line-dasharray': [3, 2],
          },
        });
      }

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

    // 6. Sync 3D Terrain & Camera Pitch when is3d changes
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      setIsTilted(is3d);
      if (is3d) {
        try {
          if (map.getSource('terrain-dem')) {
            map.setTerrain({ source: 'terrain-dem', exaggeration: 1.6 });
          }
          map.easeTo({ pitch: 55, bearing: -15, duration: 800 });
        } catch (e) {
          console.warn('Set terrain notice:', e);
        }
      } else {
        try {
          map.setTerrain(null);
          map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
        } catch (e) {
          console.warn('Clear terrain notice:', e);
        }
      }
    }, [is3d, isMapLoaded]);

    // 7. Render All 106 Location Markers
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
        if (q) {
          const matchName = (p.name || '').toLowerCase().includes(q) || (p.name_mr || '').toLowerCase().includes(q);
          const matchCoords = p.latitude.toString().includes(q) || p.longitude.toString().includes(q);
          return matchName || matchCoords;
        }
        return true;
      });

      filtered.forEach((place) => {
        const el = document.createElement('div');
        el.className = 'group relative flex flex-col items-center cursor-pointer';

        // Category color
        let color = '#10b981';
        let icon = '📍';
        if (place.category_slug === 'forts') { color = '#ef4444'; icon = '🏰'; }
        if (place.category_slug === 'heritage') { color = '#f59e0b'; icon = '🏛️'; }
        if (place.category_slug === 'temples') { color = '#f97316'; icon = '🛕'; }
        if (place.category_slug === 'museums') { color = '#06b6d4'; icon = '🏺'; }
        if (place.category_slug === 'nature') { color = '#10b981'; icon = '🌲'; }
        if (place.category_slug === 'parks') { color = '#84cc16'; icon = '💧'; }
        if (place.category_slug === 'food') { color = '#ec4899'; icon = '☕'; }

        const coordsStr = `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;
        const placeName = lang === 'mr' ? place.name_mr || place.name : place.name;

        el.innerHTML = `
          <div class="px-2 py-0.5 rounded-md bg-black/90 text-white border border-white/20 text-[9px] font-mono whitespace-nowrap shadow-xl mb-1 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none flex items-center gap-1">
            <span>${icon}</span>
            <span class="font-bold">${placeName}</span>
            <span class="text-amber-300 font-mono text-[8px] pl-0.5">${coordsStr}</span>
          </div>
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-6 w-6 rounded-full opacity-60 pin-ripple-anim" style="background-color: ${color};"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white shadow-lg" style="background-color: ${color};"></span>
          </div>
        `;

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
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
      activeEl.className = 'flex flex-col items-center pointer-events-none z-30';
      const coordsText = formatCoordinatesDD(selectedPlace.latitude, selectedPlace.longitude, 5);
      const name = lang === 'mr' ? selectedPlace.name_mr || selectedPlace.name : selectedPlace.name;

      activeEl.innerHTML = `
        <div class="px-3 py-1 rounded-xl bg-black/95 text-white border border-emerald-400 shadow-2xl backdrop-blur-md mb-1.5 text-center">
          <div class="text-[11px] font-black uppercase text-emerald-400 truncate max-w-[200px]">${name}</div>
          <div class="text-[9px] font-mono text-amber-300 font-bold">${coordsText}</div>
        </div>
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-80"></span>
          <span class="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white shadow-2xl"></span>
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
          bearing: -15,
          duration: 1800,
          essential: true,
        });
      },

      flyToCoordinates: (lat: number, lng: number, zoom = 15, pitch = 50, bearing = 0) => {
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom,
          pitch: isTilted ? pitch : 0,
          bearing,
          duration: 2000,
          essential: true,
        });
      },

      flyToTaluka: (talukaId: string) => {
        const map = mapRef.current;
        if (!map) return;
        if (talukaId === 'all') {
          map.fitBounds(PUNE_DISTRICT_BOUNDS, { padding: 60, duration: 1600, pitch: isTilted ? DEFAULT_PITCH : 0 });
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
          try {
            if (map.getSource('terrain-dem')) {
              map.setTerrain({ source: 'terrain-dem', exaggeration: 1.6 });
            }
          } catch (e) {}
          map.easeTo({ pitch: 55, bearing: -15, duration: 800 });
        } else {
          try {
            map.setTerrain(null);
          } catch (e) {}
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
              pitch: isTilted ? 50 : 0,
              duration: 1600,
            });

            // Drop user marker
            const userPin = document.createElement('div');
            userPin.className = 'w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-xl animate-pulse';
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
          <span class="absolute inline-flex h-7 w-7 rounded-full bg-cyan-400/40 animate-ping"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-cyan-600 border-2 border-white shadow-xl text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
        const maxFrames = 200;
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
          zoom: 15.5,
          pitch: 58,
          duration: 1200,
        });

        setTimeout(() => {
          orbitAnimRef.current = requestAnimationFrame(orbit);
        }, 1200);
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

    return (
      <div className="relative w-full h-full min-h-[580px] bg-zinc-950 overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    );
  }
);

export default LivePuneDistrictMap;
