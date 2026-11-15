'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once on module evaluation if in browser
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standard Easing Curves from docs/experience/motion-spec.md
 */
export const MOTION_EASINGS = {
  expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  peshwaEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
  cinematicPeshwa: 'cubic-bezier(0.19, 1, 0.22, 1)',
  springGentle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  sahyadriMist: 'cubic-bezier(0.4, 0, 0.2, 1)',
  monsoonSurge: 'cubic-bezier(0.77, 0, 0.175, 1)',
  linear: 'linear',
} as const;

/**
 * GSAP Easing strings
 */
export const GSAP_EASINGS = {
  expoOut: 'power3.out',
  peshwaEase: 'power2.out',
  cinematicPeshwa: 'power4.out',
  springGentle: 'back.out(1.7)',
  sahyadriMist: 'sine.inOut',
  monsoonSurge: 'power2.inOut',
  linear: 'none',
} as const;

/**
 * Mathematical formulas for WebGL / Canvas / RAF loops
 * From docs/experience/motion-spec.md Section 2
 */
export function easeExpoOut(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easePeshwa(t: number): number {
  const p = t - 1;
  return p * p * p * p * p + 1;
}

export function easeSpringGentle(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Converts Western digits 0-9 into authentic Devanagari numerals ०-९
 */
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toDevanagariDigits(value: number | string): string {
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[parseInt(digit, 10)] ?? digit);
}

/**
 * Formats a percentage number (0-100) according to locale (English or Marathi)
 */
export function formatPercentage(val: number, isMr: boolean): string {
  const rounded = Math.round(Math.max(0, Math.min(100, val)));
  if (isMr) {
    return `${toDevanagariDigits(rounded)}%`;
  }
  return `${rounded}%`;
}

/**
 * Hook to manage GSAP ScrollTrigger instances with guaranteed cleanup on unmount
 */
export function useScrollTriggerManager() {
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const addTrigger = (trigger: ScrollTrigger): ScrollTrigger => {
    triggersRef.current.push(trigger);
    return trigger;
  };

  const killAll = () => {
    triggersRef.current.forEach((t) => {
      try {
        t.kill(true);
      } catch (e) {
        // Safe kill
      }
    });
    triggersRef.current = [];
  };

  useEffect(() => {
    return () => {
      killAll();
    };
  }, []);

  return { addTrigger, killAll };
}
