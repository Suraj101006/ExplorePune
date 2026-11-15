/**
 * Experience Platform - Chapter Registration API
 * Enables modular lifecycle management for Chapters 0 to 8:
 * Each chapter exports { id, titleEn, titleMr, order, enter, exit, scrub }
 */

import { ChapterId, ChapterRegistration } from './types';

export class ChapterRegistry {
  private chapters = new Map<ChapterId, ChapterRegistration>();
  private activeChapterId: ChapterId = 'preloader';
  private listeners = new Set<(activeId: ChapterId, chapters: ChapterRegistration[]) => void>();

  public register(chapter: ChapterRegistration): void {
    this.chapters.set(chapter.id, chapter);
    this.notify();
  }

  public unregister(id: ChapterId): void {
    this.chapters.delete(id);
    this.notify();
  }

  public getChapters(): ChapterRegistration[] {
    return Array.from(this.chapters.values()).sort((a, b) => a.order - b.order);
  }

  public getChapter(id: ChapterId): ChapterRegistration | undefined {
    return this.chapters.get(id);
  }

  public setActiveChapter(id: ChapterId, direction: 'forward' | 'backward' = 'forward'): void {
    if (this.activeChapterId === id) return;

    const oldChapter = this.chapters.get(this.activeChapterId);
    const newChapter = this.chapters.get(id);

    if (oldChapter?.exit) {
      oldChapter.exit(direction);
    }

    this.activeChapterId = id;

    if (newChapter?.enter) {
      newChapter.enter(direction);
    }

    this.notify();
  }

  public scrubChapter(id: ChapterId, progress: number): void {
    const chapter = this.chapters.get(id);
    if (chapter?.scrub) {
      chapter.scrub(Math.max(0, Math.min(1, progress)));
    }
  }

  public getActiveChapterId(): ChapterId {
    return this.activeChapterId;
  }

  public subscribe(listener: (activeId: ChapterId, chapters: ChapterRegistration[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const ordered = this.getChapters();
    this.listeners.forEach((fn) => fn(this.activeChapterId, ordered));
  }
}

// Global registry instance for the experience session
export const globalChapterRegistry = new ChapterRegistry();
