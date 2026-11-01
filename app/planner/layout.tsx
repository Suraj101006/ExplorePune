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

const plannerSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://explore-pune-eosin.vercel.app/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Trip Planner',
          item: 'https://explore-pune-eosin.vercel.app/planner',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      name: 'Explore Pune AI Trip Planner',
      url: 'https://explore-pune-eosin.vercel.app/planner',
      applicationCategory: 'TravelApplication',
      operatingSystem: 'All (Web, Android, iOS)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      description:
        'Custom Pune itinerary generator calculating driving routes, PMPML bus connections, and Pune Metro transit intervals for forts, palaces, and wadas.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does the Explore Pune AI Trip Planner work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The planner uses geospatial routing algorithms combined with verified operating hours, ticket costs, and travel times between 80+ Pune heritage locations. It generates a personalized, time-optimized daily schedule based on your selected interests and pace.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the Pune Trip Planner free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Explore Pune is 100% free and open-access. You can create custom itineraries, view transit recommendations, and export PDF guides without requiring a subscription.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the planner include public transit (PMPML & Pune Metro)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! The planner includes integrated PMPML bus route timetables (like Route 51 to Sinhagad Fort) and Pune Metro Aqua & Purple line connections with interchange stations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I download or share my generated itinerary?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can export your customized itinerary as a formatted PDF, sync it with your mobile calendar, or share it via WhatsApp and social links.',
          },
        },
      ],
    },
  ],
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(plannerSchemas) }}
      />
      {children}
    </>
  );
}
