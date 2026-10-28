import type { Metadata } from 'next';
import MyJourneyClient from '@/components/MyJourneyClient';

export const metadata: Metadata = {
  title: 'My Pune Journey | Interactive Travel Stories & Routes',
  description:
    'Experience your personal story of exploring Pune. Track Today’s Journey, browse date-wise animated routes, and view your complete exploration map.',
  alternates: {
    canonical: '/journey',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function JourneyPage() {
  return <MyJourneyClient />;
}
