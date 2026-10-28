import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Explore Pune | Mission, Team & Heritage Preservation',
  description:
    'Discover the vision behind Explore Pune: authentic Sahyadri trail preservation, verified Peshwa history documentation, and open community travel guides.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Explore Pune | Mission, Team & Heritage Preservation',
    description:
      'Discover the vision behind Explore Pune: authentic Sahyadri trail preservation, verified Peshwa history documentation, and open community travel guides.',
    url: '/about',
    siteName: 'Explore Pune',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Explore Pune | Mission & Heritage Preservation',
    description:
      'Authentic Sahyadri trail preservation, verified Peshwa history documentation, and open community travel guides.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
