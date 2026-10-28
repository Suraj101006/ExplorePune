import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/account',
          '/login',
          '/journey',
          '/blogs/new',
        ],
      },
    ],
    sitemap: 'https://explore-pune-eosin.vercel.app/sitemap.xml',
    host: 'https://explore-pune-eosin.vercel.app',
  };
}
