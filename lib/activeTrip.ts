'use client';

export interface ActiveTripStop {
  index: number;
  placeId: string;
  placeSlug: string;
  placeName: string;
  placeNameMr?: string;
  arrivalTime?: string;
  departureTime?: string;
  visitMinutes: number;
  travelMinutes: number;
  entryCost: number | null;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  isVisited?: boolean;
  visitedAt?: string;
  transitDetails?: any;
}

export interface ActiveTrip {
  id: string;
  planIndex: number;
  titleEn: string;
  titleMr?: string;
  themeEn?: string;
  themeMr?: string;
  badge?: string;
  startLocation: string;
  startTime: string;
  travelMode: string;
  totalDurationMinutes: number;
  knownCost: number;
  stops: ActiveTripStop[];
  currentStopIndex: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}

const STORAGE_KEY_ACTIVE = 'explore_pune_active_trip';
const STORAGE_KEY_HISTORY = 'explore_pune_trip_history';

export function getActiveTrip(): ActiveTrip | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.stops)) {
      return null;
    }
    return parsed as ActiveTrip;
  } catch (err) {
    console.error('Failed to read active trip from storage:', err);
    return null;
  }
}

export function saveActiveTrip(trip: ActiveTrip): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...trip,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('explore-pune-active-trip-changed', { detail: payload }));
  } catch (err) {
    console.error('Failed to save active trip:', err);
  }
}

export function updateActiveTripCurrentStop(index: number): ActiveTrip | null {
  const current = getActiveTrip();
  if (!current) return null;

  current.currentStopIndex = Math.max(0, Math.min(index, current.stops.length - 1));
  saveActiveTrip(current);
  return current;
}

export function markStopVisited(placeId: string, visited = true): ActiveTrip | null {
  const current = getActiveTrip();
  if (!current) return null;

  let allVisited = true;
  current.stops = current.stops.map((s) => {
    if (s.placeId === placeId || s.placeSlug === placeId) {
      return {
        ...s,
        isVisited: visited,
        visitedAt: visited ? new Date().toISOString() : undefined,
      };
    }
    if (!s.isVisited) {
      allVisited = false;
    }
    return s;
  });

  // Re-verify if all are visited
  allVisited = current.stops.every((s) => Boolean(s.isVisited));
  if (allVisited && !current.isCompleted) {
    current.isCompleted = true;
    current.completedAt = new Date().toISOString();
    saveToHistory(current);
  }

  saveActiveTrip(current);
  return current;
}

export function clearActiveTrip(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
    window.dispatchEvent(new CustomEvent('explore-pune-active-trip-changed', { detail: null }));
  } catch (err) {
    console.error('Failed to clear active trip:', err);
  }
}

export function getTripHistory(): ActiveTrip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ActiveTrip[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(trip: ActiveTrip): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getTripHistory();
    const existingIdx = list.findIndex((t) => t.id === trip.id);
    if (existingIdx >= 0) {
      list[existingIdx] = trip;
    } else {
      list.unshift(trip);
    }
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new CustomEvent('explore-pune-trip-history-changed', { detail: list }));
  } catch (err) {
    console.error('Failed to save trip history:', err);
  }
}
