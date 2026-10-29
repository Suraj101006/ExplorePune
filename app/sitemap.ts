import type { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://explore-pune-eosin.vercel.app';
  const now = new Date();

  // Core public indexable routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/planner`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/play-metro-transit.html`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    ...['forts', 'heritage', 'temples', 'museums', 'nature', 'parks', 'food', 'free'].map(
      (cat) => ({
        url: `${baseUrl}/destinations/${cat}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    ),
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/data`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/milestones`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Verified destination places
  const placeSlugs = new Set<string>();

  // Try fetching live published places from Firestore
  try {
    const snap = await getDocs(collection(db, 'places'));
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.status === 'published' && data.slug) {
        placeSlugs.add(data.slug);
      }
    });
  } catch (err) {
    console.warn('[sitemap] Firestore fetch fallback to verified structured places', err);
  }

  // Ensure all structured places are covered as baseline
  if (Array.isArray(ALL_STRUCTURED_PLACES)) {
    ALL_STRUCTURED_PLACES.forEach((p) => {
      if (p.slug) placeSlugs.add(p.slug);
      else if (p.id) placeSlugs.add(p.id);
    });
  }

  const destinationRoutes: MetadataRoute.Sitemap = Array.from(placeSlugs).map((slug) => ({
    url: `${baseUrl}/places/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
