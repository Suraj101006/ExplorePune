import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Methodology & Research Sources',
  description:
    'Methodology, archival sources, GIS coordinates verification, and historical reference materials for Pune destinations, temples, and Sahyadri forts.',
  alternates: {
    canonical: '/data',
  },
  openGraph: {
    title: 'Data Methodology & Research Sources | Explore Pune',
    description:
      'Methodology, archival sources, GIS coordinates verification, and historical reference materials for Pune destinations.',
    url: '/data',
    siteName: 'Explore Pune',
    type: 'website',
  },
};

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
