/**
 * WebGL & 3D Engine Types for Explore Pune Experience ("Pune Through Time")
 */

import { ChapterId } from '@/lib/experience/types';

export type CameraMode = 'arrival' | 'epochs' | 'map' | 'free' | 'focus';

export interface PuneWeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  conditionEn: string;
  conditionMr: string;
  icon: string;
  adviceEn?: string;
  adviceMr?: string;
  isDay?: boolean;
  localHour?: number;
}

export interface TerrainPlaceMarker {
  id: string;
  slug: string;
  name: string;
  nameMr: string;
  categorySlug: string;
  position: [number, number, number]; // 3D world space coordinates
  isFort: boolean;
  popularityScore: number;
  distanceFromCenterKm: number;
}

export interface WebGLPerformanceTier {
  dprCap: number;
  shadows: boolean;
  particleBudget: number;
  terrainSubdivisions: number;
  isLowPerf: boolean;
  avgFps: number;
}

export interface ExperienceWebGLSceneProps {
  activeChapter?: ChapterId;
  scrollProgress?: number;
  cameraMode?: CameraMode;
  selectedPlaceSlug?: string | null;
  onPlaceSelect?: (slug: string) => void;
  className?: string;
  isInteractive?: boolean;
  showMapPins?: boolean;
  highlightCategory?: string | null;
}
