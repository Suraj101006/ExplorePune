'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ThemeShortcutToast from '@/components/ThemeShortcutToast';

// Non-critical client-side modals and floating widgets deferred with ssr: false
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const DirectionsModal = dynamic(() => import('@/components/DirectionsModal'), { ssr: false });
const IntroVideoOverlay = dynamic(() => import('@/components/IntroVideoOverlay'), { ssr: false });
const CookieConsentBanner = dynamic(() => import('@/components/CookieConsentBanner'), { ssr: false });

export default function ClientInteractiveOverlays() {
  const [loadDeferred, setLoadDeferred] = useState(false);

  useEffect(() => {
    // Modern Web Guidance (CRP / INP): Defer non-critical floating overlays to idle time to guarantee 0ms TBT
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => setLoadDeferred(true), { timeout: 1200 });
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setLoadDeferred(true), 250);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <IntroVideoOverlay />
      {loadDeferred && (
        <>
          <ChatWidget />
          <DirectionsModal />
        </>
      )}
      <ThemeShortcutToast />
      <CookieConsentBanner />
    </>
  );
}
