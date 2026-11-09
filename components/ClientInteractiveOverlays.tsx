'use client';

import dynamic from 'next/dynamic';
import ThemeShortcutToast from '@/components/ThemeShortcutToast';

// Non-critical client-side modals and floating widgets deferred with ssr: false
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const DirectionsModal = dynamic(() => import('@/components/DirectionsModal'), { ssr: false });
const IntroVideoOverlay = dynamic(() => import('@/components/IntroVideoOverlay'), { ssr: false });

export default function ClientInteractiveOverlays() {
  return (
    <>
      <IntroVideoOverlay />
      <ChatWidget />
      <DirectionsModal />
      <ThemeShortcutToast />
    </>
  );
}
