import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepune-guide.vercel.app';

  const commonAllow = [
    '/',
    '/_next/static/',
    '/_next/image',
    '/assets/',
    '/images/',
    '/videos/',
    '/favicon.ico',
    '/favicon-48x48.png',
    '/favicon-96x96.png',
    '/favicon-144x144.png',
    '/favicon-192x192.png',
    '/favicon-512x512.png',
    '/apple-touch-icon.png',
    '/apple-icon.png',
    '/icon.png',
    '/manifest.webmanifest',
    '/feed.xml',
    '/rss.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/video-sitemap.xml',
  ];

  const commonDisallow = [
    '/api/',
    '/admin',
    '/admin/',
    '/account',
    '/account/',
    '/login',
    '/login/',
    '/journey',
    '/journey/',
    '/blogs/new',
    '/blogs/new/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: commonAllow,
        disallow: commonDisallow,
      },
      {
        // Major search engine crawlers: Google, Bing, Applebot, DuckDuckGo, Baidu, Yandex
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-News',
          'Googlebot-Video',
          'Bingbot',
          'Applebot',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: commonAllow,
        disallow: commonDisallow,
      },
      {
        // Generative AI & Answer Engine crawlers (GEO - Generative Engine Optimization for ChatGPT, Perplexity, Gemini, Claude, Apple Intelligence)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'cohere-ai',
          'Bytespider',
          'Meta-ExternalAgent',
        ],
        allow: commonAllow,
        disallow: commonDisallow,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/video-sitemap.xml`,
    ],
    host: baseUrl,
  };
}
