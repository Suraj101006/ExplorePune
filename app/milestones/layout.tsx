import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Punekar Explorer Milestones & Badges | Explore Pune',
  description:
    'Track your personal exploration milestones across Sinhagad, Rajgad, Shaniwar Wada, and ancient temples. Unlock certificates and Punekar badges.',
  alternates: {
    canonical: '/milestones',
  },
  openGraph: {
    title: 'Punekar Explorer Milestones & Badges | Explore Pune',
    description:
      'Track your personal exploration milestones across Pune. Unlock certificates and Punekar badges.',
    url: '/milestones',
    siteName: 'Explore Pune',
    type: 'website',
  },
};

export default function MilestonesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
