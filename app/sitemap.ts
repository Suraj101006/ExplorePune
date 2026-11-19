import type { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';

export const revalidate = 3600;

function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepune-guide.vercel.app';
  // Stable audit and release timestamp to eliminate Search Console dynamic lastmod churn
  const auditReleaseDate = new Date('2026-11-19T00:00:00.000Z');

  // Core public indexable routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: auditReleaseDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: auditReleaseDate,
      changeFrequency: 'daily',
      priority: 0.95,
      images: [`${baseUrl}/images/hero-shaniwar-wada.webp`],
    },
    {
      url: `${baseUrl}/experience/sinhagad`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/images/places/sinhagad-fort.jpg`],
    },
    {
      url: `${baseUrl}/games`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${baseUrl}/images/places/sinhagad-fort.jpg`],
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: auditReleaseDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/planner`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/play-metro-transit.html`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...['forts', 'heritage', 'temples', 'museums', 'nature', 'parks', 'food', 'free'].map(
      (cat) => ({
        url: `${baseUrl}/destinations/${cat}`,
        lastModified: auditReleaseDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    ),
    {
      url: `${baseUrl}/community`,
      lastModified: auditReleaseDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: auditReleaseDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/help/website-guide`,
      lastModified: auditReleaseDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: auditReleaseDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/data`,
      lastModified: auditReleaseDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/milestones`,
      lastModified: auditReleaseDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: auditReleaseDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: auditReleaseDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: auditReleaseDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Verified destination places
  const placeSlugs = new Set<string>();

  // Try fetching live published places from Firestore
  try {
    const snap = await withTimeout(getDocs(collection(db, 'places')), 1200);
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.status === 'published' && data.slug) {
        placeSlugs.add(data.slug);
      }
    });
  } catch {
    // Graceful fallback to verified structured places
  }

  // Ensure all structured places are covered as baseline
  if (Array.isArray(ALL_STRUCTURED_PLACES)) {
    ALL_STRUCTURED_PLACES.forEach((p) => {
      if (p.slug) placeSlugs.add(p.slug);
      else if (p.id) placeSlugs.add(p.id);
    });
  }

  const destinationRoutes: MetadataRoute.Sitemap = Array.from(placeSlugs).map((slug) => {
    const place = ALL_STRUCTURED_PLACES.find((p) => (p.slug || p.id) === slug);
    const placeDate = place?.verification?.lastChecked
      ? new Date(place.verification.lastChecked)
      : auditReleaseDate;

    return {
      url: `${baseUrl}/places/${encodeURIComponent(slug)}`,
      lastModified: placeDate,
      changeFrequency: 'weekly',
      priority: 0.85,
      images: [`${baseUrl}/images/places/${encodeURIComponent(slug)}.jpg`],
    };
  });

  // Published blog stories
  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogSnap = await withTimeout(
      getDocs(query(collection(db, 'blogs'), where('status', '==', 'published'))),
      1200
    );
    blogSnap.docs.forEach((d) => {
      const data = d.data();
      if (data.slug && !data.is_draft) {
        blogRoutes.push({
          url: `${baseUrl}/blogs/${encodeURIComponent(data.slug)}`,
          lastModified: data.published_at ? new Date(data.published_at) : auditReleaseDate,
          changeFrequency: 'monthly',
          priority: 0.75,
        });
      }
    });
  } catch {
    // Graceful fallback if blogs not fetched during build
  }

  return [...staticRoutes, ...destinationRoutes, ...blogRoutes];
}
