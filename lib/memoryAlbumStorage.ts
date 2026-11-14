'use client';

/**
 * MemoryAlbumStorage: Unified Data Engine for Personal Travel Memories,
 * Multi-Visit History, Photo/Video Albums, and Reel Project Drafts.
 */

export interface MemoryMediaItem {
  id: string;
  userId?: string | null;
  placeId: string;
  placeName?: string;
  placeSlug?: string;
  mediaUrl: string;
  url?: string;
  mediaType: 'photo' | 'video';
  type?: 'photo' | 'video';
  thumbnailUrl?: string;
  caption?: string;
  isFavorite: boolean;
  visitDate: string; // YYYY-MM-DD
  capturedDate?: string;
  uploadedAt: string; // ISO
  width?: number;
  height?: number;
  durationSec?: number;
  albumId?: string;
}

export interface MemoryAlbum {
  id: string;
  userId?: string | null;
  title: string;
  description?: string;
  coverUrl?: string;
  placeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationVisitRecord {
  id: string;
  userId?: string | null;
  placeId: string;
  placeName: string;
  placeSlug?: string;
  visitDate: string; // YYYY-MM-DD
  visitedDate?: string;
  notes?: string;
  rating?: number; // 1-5
  createdAt: string;
}

export interface ReelProjectDraft {
  id: string;
  userId?: string | null;
  title: string;
  destinationId?: string;
  placeId?: string;
  destinationName?: string;
  placeName?: string;
  creationMode: 'auto' | 'assisted' | 'manual';
  templateId?: string;
  songId?: string;
  musicTrackId?: string;
  scenes: any[];
  durationSec: number;
  aspectRatio: '9:16';
  quality: '720p' | '1080p';
  updatedAt: string;
  createdAt: string;
}

export interface RenderedExportRecord {
  id: string;
  userId?: string | null;
  projectId?: string;
  title: string;
  destinationName?: string;
  placeName?: string;
  videoUrl: string;
  downloadUrl?: string;
  filename?: string;
  resolution?: string;
  blobSize?: number;
  durationSec: number;
  format: 'mp4' | 'webm';
  createdAt: string;
}

// LocalStorage Keys
export const STORAGE_KEY_MEMORIES = 'explore_pune_memories_v2';
export const STORAGE_KEY_ALBUMS = 'explore_pune_albums_v2';
export const STORAGE_KEY_VISIT_RECORDS = 'explore_pune_destination_visits_v2';
export const STORAGE_KEY_PROJECT_DRAFTS = 'explore_pune_reel_drafts_v2';
export const STORAGE_KEY_RENDERED_EXPORTS = 'explore_pune_rendered_exports_v2';

function getKey(base: string, userId?: string | null): string {
  return userId ? `${base}_${userId}` : base;
}

function safeGet<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Failed to read from localStorage (${key}):`, e);
    return [];
  }
}

function safeSet<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to write to localStorage (${key}):`, e);
  }
}

/* =========================================================================
   1. MEMORY MEDIA (PHOTOS & VIDEOS)
   ========================================================================= */

export function getAllMemories(userId?: string | null): MemoryMediaItem[] {
  const list = safeGet<MemoryMediaItem>(getKey(STORAGE_KEY_MEMORIES, userId));
  return list.sort((a, b) => b.visitDate.localeCompare(a.visitDate));
}

export function getMemoriesForPlace(placeId: string, userId?: string | null): MemoryMediaItem[] {
  const all = getAllMemories(userId);
  return all.filter((m) => m.placeId === placeId || m.placeSlug === placeId);
}

export function saveMemoryItem(item: Partial<MemoryMediaItem> & { placeId: string }): MemoryMediaItem {
  const mediaUrl = item.mediaUrl || item.url || '';
  const mediaType = item.mediaType || item.type || 'photo';
  const visitDate = item.visitDate || item.capturedDate || new Date().toISOString().slice(0, 10);

  const full: MemoryMediaItem = {
    ...item,
    id: item.id || `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    mediaUrl,
    url: mediaUrl,
    mediaType,
    type: mediaType,
    visitDate,
    capturedDate: visitDate,
    isFavorite: item.isFavorite ?? false,
    uploadedAt: item.uploadedAt || new Date().toISOString(),
  };

  const key = getKey(STORAGE_KEY_MEMORIES, full.userId);
  const list = safeGet<MemoryMediaItem>(key);
  const idx = list.findIndex((m) => m.id === full.id);
  if (idx >= 0) {
    list[idx] = full;
  } else {
    list.unshift(full);
  }
  safeSet(key, list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-memories-changed', { detail: full }));
  }
  return full;
}

export function updateMemoryItem(id: string, updates: Partial<MemoryMediaItem>, userId?: string | null): MemoryMediaItem | null {
  const key = getKey(STORAGE_KEY_MEMORIES, userId);
  const list = safeGet<MemoryMediaItem>(key);
  const idx = list.findIndex((m) => m.id === id);
  if (idx < 0) return null;

  const updated: MemoryMediaItem = {
    ...list[idx],
    ...updates,
  };
  list[idx] = updated;
  safeSet(key, list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-memories-changed', { detail: updated }));
  }
  return updated;
}

export function deleteMemoryItem(id: string, userId?: string | null): boolean {
  const key = getKey(STORAGE_KEY_MEMORIES, userId);
  const list = safeGet<MemoryMediaItem>(key);
  const filtered = list.filter((m) => m.id !== id);
  if (filtered.length === list.length) return false;

  safeSet(key, filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-memories-changed', { detail: { id } }));
  }
  return true;
}

export function toggleFavoriteMemory(id: string, userId?: string | null): boolean {
  const key = getKey(STORAGE_KEY_MEMORIES, userId);
  const list = safeGet<MemoryMediaItem>(key);
  const item = list.find((m) => m.id === id);
  if (!item) return false;

  item.isFavorite = !item.isFavorite;
  safeSet(key, list);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-memories-changed', { detail: item }));
  }
  return item.isFavorite;
}

/* =========================================================================
   2. DESTINATION MULTI-VISIT HISTORY
   ========================================================================= */

export function getDestinationVisits(placeId: string, userId?: string | null): DestinationVisitRecord[] {
  const all = getAllDestinationVisits(userId);
  return all.filter((v) => v.placeId === placeId || v.placeSlug === placeId);
}

export function getAllDestinationVisits(userId?: string | null): DestinationVisitRecord[] {
  const list = safeGet<DestinationVisitRecord>(getKey(STORAGE_KEY_VISIT_RECORDS, userId));
  return list.sort((a, b) => (b.visitDate || b.visitedDate || '').localeCompare(a.visitDate || a.visitedDate || ''));
}

export function addDestinationVisit(
  visit: Partial<DestinationVisitRecord> & { placeId: string; placeName: string }
): DestinationVisitRecord {
  const vDate = visit.visitDate || visit.visitedDate || new Date().toISOString().slice(0, 10);
  const full: DestinationVisitRecord = {
    ...visit,
    id: visit.id || `visit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    visitDate: vDate,
    visitedDate: vDate,
    createdAt: visit.createdAt || new Date().toISOString(),
  };

  const key = getKey(STORAGE_KEY_VISIT_RECORDS, full.userId);
  const list = safeGet<DestinationVisitRecord>(key);
  list.unshift(full);
  safeSet(key, list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-visit-logged', { detail: full }));
  }
  return full;
}

export function deleteDestinationVisit(id: string, userId?: string | null): boolean {
  const key = getKey(STORAGE_KEY_VISIT_RECORDS, userId);
  const list = safeGet<DestinationVisitRecord>(key);
  const filtered = list.filter((v) => v.id !== id);
  if (filtered.length === list.length) return false;

  safeSet(key, filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-visit-logged', { detail: { id } }));
  }
  return true;
}

/* =========================================================================
   3. REEL PROJECT DRAFTS
   ========================================================================= */

export function getAllProjectDrafts(userId?: string | null): ReelProjectDraft[] {
  const list = safeGet<ReelProjectDraft>(getKey(STORAGE_KEY_PROJECT_DRAFTS, userId));
  return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProjectDraft(id: string, userId?: string | null): ReelProjectDraft | null {
  const all = getAllProjectDrafts(userId);
  return all.find((d) => d.id === id) || null;
}

export function saveProjectDraft(
  project: Partial<ReelProjectDraft> & { title: string }
): ReelProjectDraft {
  const full: ReelProjectDraft = {
    creationMode: 'auto',
    durationSec: 15,
    scenes: [],
    ...project,
    aspectRatio: '9:16',
    quality: project.quality || '720p',
    id: project.id || `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    destinationId: project.destinationId || project.placeId,
    placeId: project.placeId || project.destinationId,
    destinationName: project.destinationName || project.placeName,
    placeName: project.placeName || project.destinationName,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const key = getKey(STORAGE_KEY_PROJECT_DRAFTS, full.userId);
  const list = safeGet<ReelProjectDraft>(key);
  const idx = list.findIndex((d) => d.id === full.id);
  if (idx >= 0) {
    list[idx] = full;
  } else {
    list.unshift(full);
  }
  safeSet(key, list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-drafts-changed', { detail: full }));
  }
  return full;
}

export function duplicateProjectDraft(id: string, userId?: string | null): ReelProjectDraft | null {
  const original = getProjectDraft(id, userId);
  if (!original) return null;

  return saveProjectDraft({
    ...original,
    id: undefined,
    title: `${original.title} (Copy)`,
  });
}

export function deleteProjectDraft(id: string, userId?: string | null): boolean {
  const key = getKey(STORAGE_KEY_PROJECT_DRAFTS, userId);
  const list = safeGet<ReelProjectDraft>(key);
  const filtered = list.filter((d) => d.id !== id);
  if (filtered.length === list.length) return false;

  safeSet(key, filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-drafts-changed', { detail: { id } }));
  }
  return true;
}

/* =========================================================================
   4. RENDERED REEL EXPORTS (COMPLETED MP4s)
   ========================================================================= */

export function getAllRenderedExports(userId?: string | null): RenderedExportRecord[] {
  const list = safeGet<RenderedExportRecord>(getKey(STORAGE_KEY_RENDERED_EXPORTS, userId));
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveRenderedExport(
  record: Partial<RenderedExportRecord> & { title: string }
): RenderedExportRecord {
  const vUrl = record.videoUrl || record.downloadUrl || '';
  const full: RenderedExportRecord = {
    format: 'mp4',
    durationSec: 15,
    ...record,
    id: record.id || `export_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    videoUrl: vUrl,
    downloadUrl: vUrl,
    placeName: record.placeName || record.destinationName,
    destinationName: record.destinationName || record.placeName,
    createdAt: record.createdAt || new Date().toISOString(),
  };

  const key = getKey(STORAGE_KEY_RENDERED_EXPORTS, full.userId);
  const list = safeGet<RenderedExportRecord>(key);
  list.unshift(full);
  safeSet(key, list);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-exports-changed', { detail: full }));
  }
  return full;
}

export function deleteRenderedExport(id: string, userId?: string | null): boolean {
  const key = getKey(STORAGE_KEY_RENDERED_EXPORTS, userId);
  const list = safeGet<RenderedExportRecord>(key);
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;

  safeSet(key, filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('explore-pune-exports-changed', { detail: { id } }));
  }
  return true;
}
