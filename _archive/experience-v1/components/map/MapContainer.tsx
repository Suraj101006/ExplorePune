'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  getAllPlaces,
  getZones,
  getPlacesGeoJson,
  getZonesGeoJson,
  getPuneBoundaryGeoJson,
} from '@/lib/experience/selectors';
import { ExperiencePlace, ZoneId, ZoneDefinition } from '@/lib/experience/types';
import NoWebGlFallback from './NoWebGlFallback';

export interface MapHandle {
  flyToPlace: (place: ExperiencePlace) => void;
  flyToZone: (zone: ZoneDefinition) => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleTilt: () => void;
  locateUser: () => void;
  runVideoFlyover: (startPlace: ExperiencePlace, endPlace: ExperiencePlace, onComplete?: () => void) => void;
  stopFlyover: () => void;
}

interface MapContainerProps {
  lang?: string;
  selectedPlace: ExperiencePlace | null;
  selectedCategory: string;
  selectedZone: ZoneId | 'all';
  onPlaceSelect: (place: ExperiencePlace) => void;
}

// Fallback CARTO Dark Matter style object in case remote vector style fails
const CARTO_DARK_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'carto-dark-matter': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© CARTO • © OpenStreetMap contributors (ODbL)',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark-matter',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const DEFAULT_CENTER: [number, number] = [73.8567, 18.5204];
const DEFAULT_ZOOM = 11.2;
const DEFAULT_PITCH = 45;
const DEFAULT_BEARING = -15;

const MapContainer = forwardRef<MapHandle, MapContainerProps>(function MapContainer(
  { lang = 'en', selectedPlace, selectedCategory, selectedZone, onPlaceSelect },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const activePinMarkerRef = useRef<maplibregl.Marker | null>(null);
  const planeMarkerRef = useRef<maplibregl.Marker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [hasWebGl, setHasWebGl] = useState<boolean>(true);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isTilted, setIsTilted] = useState<boolean>(true);

  // 1. WebGL capability check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGl(false);
      }
    } catch (e) {
      setHasWebGl(false);
    }
  }, []);

  // 2. Initialize MapLibre GL
  useEffect(() => {
    if (!hasWebGl || !containerRef.current || mapRef.current) return;

    let mapInstance: maplibregl.Map;

    try {
      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://tiles.openfreemap.org/styles/dark',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        bearing: DEFAULT_BEARING,
        attributionControl: false, // Custom attribution pill provided in UI
      });
    } catch (err) {
      console.warn('[MapContainer] OpenFreeMap failed to initialize, falling back to CARTO:', err);
      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: CARTO_DARK_RASTER_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        bearing: DEFAULT_BEARING,
        attributionControl: false,
      });
    }

    mapInstance.on('error', (e: any) => {
      // If remote style fails to load, gracefully fall back to CARTO raster style
      if (e?.error?.message?.includes('Failed to fetch') || e?.error?.message?.includes('style')) {
        console.warn('[MapContainer] Network issue loading vector style; switching to CARTO fallback');
        try {
          mapInstance.setStyle(CARTO_DARK_RASTER_STYLE);
        } catch (styleErr) {}
      }
    });

    mapInstance.on('load', () => {
      setIsMapLoaded(true);
      setupLayers(mapInstance);
    });

    mapRef.current = mapInstance;

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (activePinMarkerRef.current) activePinMarkerRef.current.remove();
      if (planeMarkerRef.current) planeMarkerRef.current.remove();
      mapInstance.remove();
      mapRef.current = null;
    };
  }, [hasWebGl]);

  // 3. Setup Sources & Layers on Map Load
  const setupLayers = (map: maplibregl.Map) => {
    // 3A. Pune Boundary Source & Layer
    const boundaryGeoJson = getPuneBoundaryGeoJson();
    if (!map.getSource('pune-boundary')) {
      map.addSource('pune-boundary', {
        type: 'geojson',
        data: boundaryGeoJson,
      });

      map.addLayer({
        id: 'pune-boundary-line',
        type: 'line',
        source: 'pune-boundary',
        paint: {
          'line-color': '#ffffff',
          'line-opacity': 0.25,
          'line-width': 1.5,
          'line-dasharray': [3, 2],
        },
      });
    }

    // 3B. 5 Zones GeoJSON Source & Layers
    const zonesGeoJson = getZonesGeoJson();
    if (!map.getSource('zones-source')) {
      map.addSource('zones-source', {
        type: 'geojson',
        data: zonesGeoJson,
      });

      // Translucent fill
      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.08,
        },
      });

      // Glowing outer border
      map.addLayer({
        id: 'zones-stroke',
        type: 'line',
        source: 'zones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.5,
          'line-opacity': 0.7,
        },
      });
    }

    // 3C. Animated Flight Route Line Source & Layer (Red #F1293A)
    if (!map.getSource('flight-route-source')) {
      map.addSource('flight-route-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'flight-route-line',
        type: 'line',
        source: 'flight-route-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F1293A', // Route Red from video spec
          'line-width': 4,
          'line-opacity': 0.95,
        },
      });
    }

    // Render initial pins
    updatePins();
  };

  // 4. Update Destination Pins when category, zone or place changes
  const updatePins = () => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const allPlaces = getAllPlaces();
    const filtered = allPlaces.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category_slug === selectedCategory;
      const matchZone = selectedZone === 'all' || p.zoneId === selectedZone;
      return matchCat && matchZone;
    });

    const isMr = lang === 'mr';

    filtered.forEach((place) => {
      // Create custom DOM element for category dot pin
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'exp-map-pin-btn';
      el.setAttribute('aria-label', `${isMr ? place.name_mr || place.name : place.name} (${place.category_slug})`);
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      el.style.border = '2px solid #ffffff';

      // Assign color by category
      let dotColor = '#eab308';
      if (place.category_slug === 'forts') dotColor = '#ea580c';
      if (place.category_slug === 'temples') dotColor = '#f97316';
      if (place.category_slug === 'nature') dotColor = '#10b981';
      if (place.category_slug === 'museums') dotColor = '#06b6d4';
      if (place.category_slug === 'parks') dotColor = '#22c55e';
      if (place.category_slug === 'food') dotColor = '#f43f5e';

      el.style.backgroundColor = dotColor;
      el.style.boxShadow = `0 0 10px ${dotColor}`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.5)';
        el.style.zIndex = '10';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        onPlaceSelect(place);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (isMapLoaded) {
      updatePins();
    }
  }, [selectedCategory, selectedZone, isMapLoaded, lang]);

  // 5. Active Selected Place Indicator (Red Pulsing Pin #F1293A with Label)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace) {
      if (activePinMarkerRef.current) {
        activePinMarkerRef.current.remove();
        activePinMarkerRef.current = null;
      }
      return;
    }

    if (activePinMarkerRef.current) {
      activePinMarkerRef.current.remove();
    }

    const pinEl = document.createElement('div');
    pinEl.className = 'exp-active-pin-wrapper flex flex-col items-center pointer-events-none z-30';

    const labelEl = document.createElement('div');
    labelEl.className = 'px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/85 text-white border border-white/20 shadow-2xl backdrop-blur-md mb-1 whitespace-nowrap';
    labelEl.textContent = lang === 'mr' ? selectedPlace.name_mr || selectedPlace.name : selectedPlace.name;

    const dotEl = document.createElement('div');
    dotEl.className = 'relative flex items-center justify-center';
    dotEl.innerHTML = `
      <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#F1293A] opacity-75"></span>
      <span class="relative inline-flex rounded-full h-5 w-5 bg-[#F1293A] border-2 border-white shadow-lg"></span>
    `;

    pinEl.appendChild(labelEl);
    pinEl.appendChild(dotEl);

    const activeMarker = new maplibregl.Marker({ element: pinEl, anchor: 'bottom' })
      .setLngLat([selectedPlace.longitude, selectedPlace.latitude])
      .addTo(map);

    activePinMarkerRef.current = activeMarker;
  }, [selectedPlace, lang]);

  // 6. Camera Methods & Video Reference Flyover (5.25s Ease-in-Out Cubic)
  useImperativeHandle(ref, () => ({
    flyToPlace: (place: ExperiencePlace) => {
      const map = mapRef.current;
      if (!map) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        map.jumpTo({
          center: [place.longitude, place.latitude],
          zoom: 15.5,
          pitch: 45,
          bearing: -15,
        });
        return;
      }

      map.flyTo({
        center: [place.longitude, place.latitude],
        zoom: 15.5,
        pitch: 45,
        bearing: -15,
        duration: 1800,
        essential: true,
      });
    },

    flyToZone: (zone: ZoneDefinition) => {
      const map = mapRef.current;
      if (!map) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        map.jumpTo({
          center: zone.center,
          zoom: zone.zoom,
          pitch: 40,
        });
        return;
      }

      map.flyTo({
        center: zone.center,
        zoom: zone.zoom,
        pitch: 45,
        bearing: -10,
        duration: 2000,
        essential: true,
      });
    },

    resetView: () => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: DEFAULT_PITCH,
        bearing: DEFAULT_BEARING,
        duration: 1500,
      });
    },

    zoomIn: () => {
      mapRef.current?.zoomIn();
    },

    zoomOut: () => {
      mapRef.current?.zoomOut();
    },

    toggleTilt: () => {
      const map = mapRef.current;
      if (!map) return;
      const nextTilt = !isTilted;
      setIsTilted(nextTilt);
      map.easeTo({
        pitch: nextTilt ? 50 : 0,
        duration: 800,
      });
    },

    locateUser: () => {
      if (!navigator.geolocation || !mapRef.current) {
        alert(lang === 'mr' ? 'आपल्या ब्राऊझरमध्ये स्थान शोधण्याची सुविधा उपलब्ध नाही.' : 'Geolocation is not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { longitude, latitude } = pos.coords;
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            pitch: 45,
            duration: 1500,
          });

          // Drop user blue pulse pin
          const userPin = document.createElement('div');
          userPin.className = 'w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse';
          new maplibregl.Marker({ element: userPin })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current!);
        },
        (err) => {
          console.warn('[MapContainer] Geolocation denied:', err.message);
          alert(lang === 'mr' ? 'कृपया नकाशावर स्थान दर्शवण्यासाठी ब्राऊझरमध्ये लोकेशन परमिशन सुरू करा.' : 'Please allow location permission to view your position on the map.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    },

    // 5.25s Flyover Spec from video:
    // Beat 1 (0-1.0s): Overview + Blue outline on Zone 1 + Red pin on start
    // Beat 2 (1.0-2.0s): Plane marker leaves pin, red route draws behind, camera follows
    // Beat 3 (2.0-3.0s): Camera eases to stop 2, green outline lights up on Zone 2
    // Beat 4 (3.0-5.25s): FitBounds frames both places with padding, detail card opens
    runVideoFlyover: (startPlace: ExperiencePlace, endPlace: ExperiencePlace, onComplete?: () => void) => {
      const map = mapRef.current;
      if (!map) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const startCoord: [number, number] = [startPlace.longitude, startPlace.latitude];
      const endCoord: [number, number] = [endPlace.longitude, endPlace.latitude];

      if (prefersReducedMotion) {
        // Reduced motion: jump instantly to frame both
        const bounds = new maplibregl.LngLatBounds(startCoord, startCoord);
        bounds.extend(endCoord);
        map.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 0 });
        onComplete?.();
        return;
      }

      // Stop any existing animation
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      // Calculate bearing angle
      const dLon = ((endCoord[0] - startCoord[0]) * Math.PI) / 180;
      const lat1 = (startCoord[1] * Math.PI) / 180;
      const lat2 = (endCoord[1] * Math.PI) / 180;
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      const bearingDeg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

      // Create Plane Marker DOM element
      if (!planeMarkerRef.current) {
        const planeEl = document.createElement('div');
        planeEl.className = 'exp-plane-glyph flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-white text-white shadow-xl pointer-events-none z-40 transition-transform duration-75';
        planeEl.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F1293A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        `;
        planeMarkerRef.current = new maplibregl.Marker({ element: planeEl })
          .setLngLat(startCoord)
          .addTo(map);
      } else {
        planeMarkerRef.current.setLngLat(startCoord).addTo(map);
      }

      // -------------------------------------------------------------
      // BEAT 1 (0.0s – 1.0s): Focus on Start Place & Zone
      // -------------------------------------------------------------
      map.flyTo({
        center: startCoord,
        zoom: 13.5,
        pitch: 45,
        bearing: bearingDeg - 15,
        duration: 1000,
        essential: true,
      });

      // -------------------------------------------------------------
      // BEAT 2 (1.0s – 2.0s): Plane takes off & draws red route line
      // -------------------------------------------------------------
      const flightStart = performance.now() + 1000;
      const flightDuration = 1800; // 1.8s flight

      const animateFlight = (now: number) => {
        if (now < flightStart) {
          animFrameIdRef.current = requestAnimationFrame(animateFlight);
          return;
        }

        const elapsed = now - flightStart;
        const t = Math.min(1, elapsed / flightDuration);

        // Ease in-out cubic
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const currentLng = startCoord[0] + (endCoord[0] - startCoord[0]) * easeT;
        const currentLat = startCoord[1] + (endCoord[1] - startCoord[1]) * easeT;
        const currentCoord: [number, number] = [currentLng, currentLat];

        // Update Plane Position
        planeMarkerRef.current?.setLngLat(currentCoord);

        // Update Drawn Route Line
        const routeSource = map.getSource('flight-route-source') as maplibregl.GeoJSONSource | undefined;
        if (routeSource) {
          routeSource.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [startCoord, currentCoord],
                },
                properties: {},
              },
            ],
          });
        }

        // Camera smoothly follows
        if (t < 0.95) {
          map.easeTo({
            center: currentCoord,
            bearing: bearingDeg,
            duration: 50,
          });
        }

        if (t < 1) {
          animFrameIdRef.current = requestAnimationFrame(animateFlight);
        } else {
          // -------------------------------------------------------------
          // BEAT 3 & 4 (3.0s – 5.25s): Arrival at Stop 2 & Pull back frame
          // -------------------------------------------------------------
          setTimeout(() => {
            const bounds = new maplibregl.LngLatBounds(startCoord, startCoord);
            bounds.extend(endCoord);

            map.fitBounds(bounds, {
              padding: { top: 120, bottom: 120, left: 380, right: 420 },
              pitch: 45,
              bearing: -10,
              duration: 2000,
              essential: true,
            });

            setTimeout(() => {
              onComplete?.();
            }, 1200);
          }, 300);
        }
      };

      animFrameIdRef.current = requestAnimationFrame(animateFlight);
    },

    stopFlyover: () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (planeMarkerRef.current) {
        planeMarkerRef.current.remove();
        planeMarkerRef.current = null;
      }
      const routeSource = mapRef.current?.getSource('flight-route-source') as maplibregl.GeoJSONSource | undefined;
      if (routeSource) {
        routeSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    },
  }));

  if (!hasWebGl) {
    return <NoWebGlFallback lang={lang} onSelectPlace={(slug) => {
      const p = getAllPlaces().find((x) => x.slug === slug);
      if (p) onPlaceSelect(p);
    }} />;
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#30333E] overflow-hidden select-none">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
});

export default MapContainer;
