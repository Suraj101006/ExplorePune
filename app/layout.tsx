import type { Metadata } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, Rozha_One, Yatra_One } from 'next/font/google';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import DirectionsModal from '@/components/DirectionsModal';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import IntroVideoOverlay from '@/components/IntroVideoOverlay';
import { LanguageProvider } from '@/lib/LanguageContext';
import { TravelPhotoTransitionProvider } from '@/components/TravelPhotoTransition';
import PageTransition from '@/components/PageTransition';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const fontYatra = Yatra_One({
  subsets: ['latin', 'devanagari'],
  weight: ['400'],
  variable: '--font-deva',
  display: 'swap',
});

const fontRozha = Rozha_One({
  subsets: ['latin', 'devanagari'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://explore-pune-eosin.vercel.app'),
  title: { default: 'Explore Pune | Historic Forts, Wadas & Trip Planner', template: '%s | Explore Pune' },
  description: 'Explore Pune: Historic forts, Peshwa wadas, ancient temples, museums, and Sahyadri trails with verified hours, visitor costs, and custom trip planner.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://explore-pune-eosin.vercel.app',
    siteName: 'Explore Pune',
    title: 'Explore Pune | Historic Forts, Wadas & Trip Planner',
    description: 'Explore Pune: Historic forts, Peshwa wadas, ancient temples, museums, and Sahyadri trails with verified hours, visitor costs, and custom trip planner.',
    images: [
      {
        url: '/images/pune-map-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Explore Pune - Heritage, Forts & Travel Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Pune | Historic Forts, Wadas & Trip Planner',
    description: 'Explore Pune: Historic forts, Peshwa wadas, ancient temples, museums, and Sahyadri trails.',
    images: ['/images/pune-map-hero.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-small.png',
  },
  verification: {
    google: 'googleec52a74fd3fa44b1',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontYatra.variable} ${fontRozha.variable}`}
    >
      <head>
        {/* Zero-flash script: ensures all bars and places are 100% hidden while intro video is showing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var s=sessionStorage.getItem('explore_pune_intro_shown');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var b=/bot|googlebot|crawler|spider|robot|crawling|lighthouse|seoptimer|seositecheckup|checkup|sitecheckup|gtmetrix|pingdom|headlesschrome|ptst/i.test(navigator.userAgent);if((p==='/'||p==='')&&s!=='true'&&!r&&!b){document.documentElement.classList.add('intro-active');}else{document.documentElement.classList.add('intro-dismissed');}}catch(e){}})();`,
          }}
        />
        {/* Google Analytics 4 (GA4) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-EXPLOREPUNE1'}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-EXPLOREPUNE1'}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `,
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
