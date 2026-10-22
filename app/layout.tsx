import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { LanguageProvider } from '@/lib/LanguageContext';
import { TravelPhotoTransitionProvider } from '@/components/TravelPhotoTransition';

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
      <body>
        <LanguageProvider>
          <TravelPhotoTransitionProvider>
            <AppHeader />
            {children}
            <AppFooter />
            <ChatWidget />
          </TravelPhotoTransitionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
