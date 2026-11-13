import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Explore Pune | Historic Forts, Wadas & Trip Planner',
    short_name: 'Explore Pune',
    description:
      'Explore 106+ historic Pune destinations, Sahyadri forts, Peshwa wadas, ancient temples, and transit schedules with AI trip planning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ea580c',
    orientation: 'portrait',
    icons: [
      {
        src: '/assets/explore-pune-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/explore-pune-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
