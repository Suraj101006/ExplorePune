import React from 'react';

/**
 * SiteJsonLd: Global Entity Optimization Schema for Explore Pune
 * Provides Organization and WebSite JSON-LD structured data with SearchAction
 * to establish Explore Pune's identity across Google Search, Bing, and AI Search Engines.
 */
export default function SiteJsonLd() {
  const siteUrl = 'https://explorepune-guide.vercel.app';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    '@id': `${siteUrl}/#organization`,
    name: 'Explore Pune',
    alternateName: ['एक्सप्लोर पुणे', 'ExplorePune Guide', 'Explore Pune Heritage Initiative'],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/assets/explore-pune-logo.png`,
      width: 1024,
      height: 1024,
      caption: 'Explore Pune Official Insignia',
    },
    image: `${siteUrl}/images/pune-map-hero.jpg`,
    description:
      'The authoritative, field-verified digital guide and itinerary planner for Pune, Maharashtra — covering 106+ Maratha hill forts, Peshwa-era wadas, ancient Hemadpanthi temples, and Sahyadri nature trails.',
    areaServed: [
      {
        '@type': 'City',
        name: 'Pune',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Maharashtra',
          containedInPlace: {
            '@type': 'Country',
            name: 'India',
          },
        },
      },
    ],
    knowsAbout: [
      'Pune Tourism',
      'Maratha Empire History',
      'Peshwa Architecture',
      'Sahyadri Hill Forts',
      'Sinhagad Fort',
      'Shaniwar Wada',
      'Pune Metro Transit',
      'PMPML Bus Routes',
      'Maharashtra Trekking Trails',
      'Punekar Food Heritage',
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Suraj Dhok',
      },
      {
        '@type': 'Person',
        name: 'Sahil Jadhav',
      },
      {
        '@type': 'Person',
        name: 'Ishan Kakade',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial & field guide inquiries',
      email: 'surajdhok1010@gmail.com',
      availableLanguage: ['English', 'Marathi', 'Hindi'],
    },
    sameAs: [
      'https://github.com/sj176644-maker/ExplorePune',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Explore Pune',
    alternateName: 'एक्सप्लोर पुणे',
    url: siteUrl,
    inLanguage: ['en-IN', 'mr-IN'],
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/destinations?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
