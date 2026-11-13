import type { Metadata } from 'next';
import WebsiteGuideClient from '@/components/WebsiteGuideClient';

export const metadata: Metadata = {
  title: 'Website Guide & Explorer’s Handbook | Explore Pune',
  description:
    'The official interactive handbook for Explore Pune. Master the 106-destination master registry, AI trip planner, Pune Metro Lines 1 & 2 transit guides, Sinhagad night safety rules, and Sahyadri trail itineraries through a digital notebook experience.',
  alternates: {
    canonical: '/help/website-guide',
  },
  openGraph: {
    title: 'Website Guide & Explorer’s Handbook | Explore Pune',
    description:
      'Learn how to navigate Pune like a local: 106 verified destinations, AI trip planning, public transit guides, interactive travel checklists, and achievement medals.',
    url: '/help/website-guide',
    siteName: 'Explore Pune',
    type: 'article',
    images: [
      {
        url: '/assets/explore-pune-logo.png',
        width: 1024,
        height: 1024,
        alt: 'Explore Pune Website Guide & Explorer Handbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Guide & Explorer’s Handbook | Explore Pune',
    description:
      'Comprehensive interactive handbook for Explore Pune. 10 authentic chapters covering AI planner, Metro routes, offline PWA, and safety advisories.',
    images: ['/assets/explore-pune-logo.png'],
  },
};

const guideJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Explore Pune Interactive Website Guide & Explorer Handbook',
  description:
    'Comprehensive interactive guide and digital notebook for travelers using Explore Pune to discover 106 heritage sites, forts, and trails.',
  inLanguage: ['en-IN', 'mr-IN'],
  author: [
    { '@type': 'Person', name: 'Suraj Dhok' },
    { '@type': 'Person', name: 'Sahil Jadhav' },
    { '@type': 'Person', name: 'Ishan Kakade' },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Explore Pune',
    url: 'https://explore-pune-guide.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://explore-pune-guide.vercel.app/assets/explore-pune-logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://explore-pune-guide.vercel.app/help/website-guide',
  },
};

export default function WebsiteGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <WebsiteGuideClient />
      </main>
    </>
  );
}
