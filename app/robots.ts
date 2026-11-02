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
      {
        // Major search engine crawlers
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
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
      {
        // Generative AI & Answer Engine crawlers (GEO - Generative Engine Optimization)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Amazonbot',
          'OAI-SearchBot',
        ],
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
    sitemap: [
      'https://explore-pune-eosin.vercel.app/sitemap.xml',
      'https://explore-pune-eosin.vercel.app/sitemap_index.xml',
      'https://explore-pune-eosin.vercel.app/video-sitemap.xml',
    ],
    host: 'https://explore-pune-eosin.vercel.app',
  };
}
