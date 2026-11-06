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
  metadataBase: new URL('https://explorepune-guide.vercel.app'),
  title: { default: 'Explore Pune | Historic Forts, Wadas & Trip Planner', template: '%s | Explore Pune' },
  description: 'Explore 106+ historic Pune destinations with verified visiting hours, ticket entry fees, Sahyadri trekking trails, local cuisine guides, and custom AI trip planning.',
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'mr-IN': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://explorepune-guide.vercel.app',
    siteName: 'Explore Pune',
    title: 'Explore Pune | Historic Forts, Wadas & Trip Planner',
    description: 'Explore 106+ historic Pune destinations with verified visiting hours, ticket entry fees, Sahyadri trekking trails, local cuisine guides, and custom AI trip planning.',
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
    description: 'Explore 106+ historic Pune destinations with verified visiting hours, ticket entry fees, Sahyadri trekking trails, local cuisine guides, and custom AI trip planning.',
    images: ['/images/pune-map-hero.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-small.png',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ['googleec52a74fd3fa44b1', 'google9bda85abb7a0ba4d'],
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
        {/* Google Search Console Site Verification */}
        <meta name="google-site-verification" content="googleec52a74fd3fa44b1" />
        <meta name="google-site-verification" content="google9bda85abb7a0ba4d" />

        {/* Zero-flash script: ensures smooth load without blocking mobile devices or crawlers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var s=sessionStorage.getItem('explore_pune_intro_shown');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var b=navigator.webdriver||/bot|googlebot|crawler|spider|robot|crawling|lighthouse|seoptimer|seositecheckup|checkup|sitecheckup|gtmetrix|pingdom|headlesschrome|ptst/i.test(navigator.userAgent);var m=/mobi|android|iphone|ipad|touch/i.test(navigator.userAgent)||(window.innerWidth&&window.innerWidth<768);if((p==='/'||p==='')&&s!=='true'&&!r&&!b&&!m){document.documentElement.classList.add('intro-active');}else{document.documentElement.classList.add('intro-dismissed');}}catch(e){}})();`,
          }}
        />
        {/* Google Analytics 4 (GA4) */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-EXPLOREPUNE1'}`}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
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
