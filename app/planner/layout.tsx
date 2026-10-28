import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pune AI Trip Planner | Custom Daily Itineraries & Routes',
  description:
    'Plan your perfect Pune day trip with customizable timings, pace, budget, transit modes, and live route optimization across historic forts, wadas, and food spots.',
  alternates: {
    canonical: '/planner',
  },
  openGraph: {
    title: 'Pune AI Trip Planner | Custom Daily Itineraries & Routes',
    description:
      'Plan your perfect Pune day trip with customizable timings, pace, budget, transit modes, and live route optimization.',
    url: '/planner',
    siteName: 'Explore Pune',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pune AI Trip Planner | Custom Daily Itineraries & Routes',
    description:
      'Plan your perfect Pune day trip with customizable timings, pace, budget, and live route optimization.',
  },
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
