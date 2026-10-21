'use client';

export interface SavedPlaceSummary {
  id: string;
  slug: string;
  name: string;
  name_mr?: string;
  image_url?: string;
  category_slug?: string;
  category?: string;
  data_tier?: string;
}

const STORAGE_KEY = 'explore_pune_saved_places_v1';

export function getSavedPlaces(): SavedPlaceSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read saved places:', e);
    return [];
  }
}

export function isPlaceSaved(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getSavedPlaces();
  return list.some((p) => p.id === id);
}

export function toggleSavedPlace(place: SavedPlaceSummary): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getSavedPlaces();
    const exists = current.some((p) => p.id === place.id);
    let updated: SavedPlaceSummary[];

    if (exists) {
      updated = current.filter((p) => p.id !== place.id);
    } else {
      updated = [place, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('explore-pune-saved-changed', { detail: updated }));
    return !exists;
  } catch (e) {
    console.error('Failed to update saved places:', e);
    return false;
  }
}

export function clearSavedPlaces(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('explore-pune-saved-changed', { detail: [] }));
  } catch (e) {
    console.error('Failed to clear saved places:', e);
  }
}
