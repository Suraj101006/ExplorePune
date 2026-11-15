/**
 * Dynamic WebGL Performance Monitor & Adaptive LOD Manager
 * Features:
 * - Dynamic DPR Cap (Max 1.5 on mobile, 2.0 on desktop)
 * - Rolling FPS tracking over 60 frames
 * - Automatic graceful downgrade when FPS < 30
 * - Viewport visibility observer to pause rendering offscreen
 */

import * as THREE from 'three';

export interface PerformanceConfig {
  onDowngrade?: () => void;
  onFpsUpdate?: (fps: number) => void;
}

export class PerformanceMonitor {
  public isMobile: boolean = false;
  public dprCap: number = 2.0;
  public currentDpr: number = 1.0;
  public isLowPerf: boolean = false;
  public avgFps: number = 60;

  private frameTimes: number[] = [];
  private maxSampleCount: number = 60;
  private lastTime: number = 0;
  private lowFpsCounter: number = 0;
  private onDowngrade?: () => void;
  private onFpsUpdate?: (fps: number) => void;

  constructor(config?: PerformanceConfig) {
    this.onDowngrade = config?.onDowngrade;
    this.onFpsUpdate = config?.onFpsUpdate;

    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
      // Hard cap DPR: 1.5 max on mobile, 2.0 max on desktop
      this.dprCap = this.isMobile ? 1.5 : 2.0;
      this.currentDpr = Math.min(window.devicePixelRatio || 1, this.dprCap);
    }
  }

  /**
   * Called on every animation frame with timestamp (ms)
   */
  public tick(timestamp: number): void {
    if (this.lastTime === 0) {
      this.lastTime = timestamp;
      return;
    }

    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (delta > 0 && delta < 500) {
      const instantaneousFps = 1000 / delta;
      this.frameTimes.push(instantaneousFps);
      if (this.frameTimes.length > this.maxSampleCount) {
        this.frameTimes.shift();
      }

      // Calculate rolling average
      const sum = this.frameTimes.reduce((a, b) => a + b, 0);
      this.avgFps = Math.round(sum / this.frameTimes.length);
      this.onFpsUpdate?.(this.avgFps);

      // Check for sustained performance drop below 30 FPS
      if (this.avgFps < 30 && this.frameTimes.length >= 30) {
        this.lowFpsCounter++;
        if (this.lowFpsCounter > 30 && !this.isLowPerf) {
          this.triggerDowngrade();
        }
      } else {
        this.lowFpsCounter = Math.max(0, this.lowFpsCounter - 1);
      }
    }
  }

  /**
   * Downgrades rendering fidelity
   */
  public triggerDowngrade(): void {
    if (this.isLowPerf) return;
    this.isLowPerf = true;
    this.currentDpr = 1.0; // Drop DPR to 1.0
    console.info('[WebGL Performance] Auto-downgrading fidelity: FPS < 30 detected.');
    this.onDowngrade?.();
  }

  /**
   * Applies the current DPR to a WebGLRenderer
   */
  public applyToRenderer(renderer: THREE.WebGLRenderer): void {
    renderer.setPixelRatio(this.currentDpr);
  }

  /**
   * Attaches an IntersectionObserver to pause rendering when canvas is out of viewport
   */
  public static observeVisibility(
    element: HTMLElement,
    onVisibilityChange: (isVisible: boolean) => void
  ): () => void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return () => {};
    }

    let isDocumentVisible = !document.hidden;

    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
      onVisibilityChange(isDocumentVisible);
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        onVisibilityChange(Boolean(entry?.isIntersecting) && isDocumentVisible);
      },
      { threshold: 0.05 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }
}
