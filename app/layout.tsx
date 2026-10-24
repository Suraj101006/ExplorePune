import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import DirectionsModal from '@/components/DirectionsModal';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import IntroVideoOverlay from '@/components/IntroVideoOverlay';
import { LanguageProvider } from '@/lib/LanguageContext';
import { TravelPhotoTransitionProvider } from '@/components/TravelPhotoTransition';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: { default: 'Explore Pune | Historic Forts, Wadas & Trip Planner', template: '%s | Explore Pune' },
  description: 'Explore Pune: Historic forts, Peshwa wadas, ancient temples, museums, and Sahyadri trails with verified hours, visitor costs, and custom trip planner.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Zero-flash script: ensures all bars and places are 100% hidden while intro video is showing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var s=sessionStorage.getItem('explore_pune_intro_shown');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if((p==='/'||p==='')&&s!=='true'&&!r){document.documentElement.classList.add('intro-active');}else{document.documentElement.classList.add('intro-dismissed');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <TravelPhotoTransitionProvider>
            <IntroVideoOverlay />
            <AppHeader />
            <PageTransition>{children}</PageTransition>
            <AppFooter />
            <ChatWidget />
            <DirectionsModal />
          </TravelPhotoTransitionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
