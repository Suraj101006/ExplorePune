'use client';
/* eslint-disable @next/next/no-img-element */

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface FlightState {
  src: string;
  alt: string;
  startRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  targetSlug: string;
}

interface TravelPhotoTransitionContextType {
  startTransition: (params: {
    src: string;
    alt: string;
    element: HTMLElement;
    targetHref: string;
    slug: string;
  }) => void;
  isTransitioning: boolean;
}

const TravelPhotoTransitionContext = createContext<TravelPhotoTransitionContextType>({
  startTransition: () => {},
  isTransitioning: false,
});

export const useTravelPhotoTransition = () => useContext(TravelPhotoTransitionContext);

export function TravelPhotoTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [flightState, setFlightState] = useState<FlightState | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const startTransition = useCallback(
    ({
      src,
      alt,
      element,
      targetHref,
      slug,
    }: {
      src: string;
      alt: string;
      element: HTMLElement;
      targetHref: string;
      slug: string;
    }) => {
      // If user prefers reduced motion, navigate immediately without flight
      if (prefersReducedMotion) {
        router.push(targetHref);
        return;
      }

      const rect = element.getBoundingClientRect();
      const startRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };

      setFlightState({ src, alt, startRect, targetSlug: slug });
      setIsExpanding(false);

      // Trigger animation frame so browser renders starting rect before expanding
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsExpanding(true);
        });
      });

      // Route immediately so Next.js begins loading in background
      router.push(targetHref);

      // Clean up after expansion completes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsExpanding(false);
        setFlightState(null);
      }, 700);
    },
    [router, prefersReducedMotion]
  );

  return (
    <TravelPhotoTransitionContext.Provider
      value={{
        startTransition,
        isTransitioning: Boolean(flightState),
      }}
    >
      {children}

      {/* Flight Overlay Animation */}
      {flightState && (
        <>
          <div className={`travel-photo-flight-overlay ${isExpanding ? 'is-active' : ''}`} />
          <img
            src={flightState.src}
            alt={flightState.alt}
            className="travel-photo-flight-clone"
            style={{
              top: isExpanding ? 0 : flightState.startRect.top,
              left: isExpanding ? 0 : flightState.startRect.left,
              width: isExpanding ? '100vw' : flightState.startRect.width,
              height: isExpanding ? Math.min(520, Math.max(360, window.innerHeight * 0.48)) : flightState.startRect.height,
              borderRadius: isExpanding ? 0 : 'var(--radius-md)',
              opacity: isExpanding ? 0.95 : 1,
            }}
          />
        </>
      )}
    </TravelPhotoTransitionContext.Provider>
  );
}
