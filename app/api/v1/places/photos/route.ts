import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface PlacePhotoItem {
  url: string;
  title: string;
  isPrimary?: boolean;
}

// In-memory cache with 6-hour TTL
interface CacheEntry {
  timestamp: number;
  photos: PlacePhotoItem[];
}
const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function cleanPhotoTitle(title: string): string {
  return title
    .replace(/^File:/i, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchCommons(query: string, maxResults: number): Promise<PlacePhotoItem[]> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=${maxResults}&gsrnamespace=6&prop=imageinfo&iiprop=url|size&iiurlwidth=1080&format=json`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ExplorePuneApp/1.0 (contact: suraj10.pp@gmail.com; Maharashtra Tourism Portal)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages || {};

    const items: PlacePhotoItem[] = [];
    for (const key of Object.keys(pages)) {
      const page = pages[key];
      const info = page.imageinfo?.[0];
      if (!info) continue;

      const rawTitle = page.title || '';
      // Exclude SVGs, audio, video, PDFs and non-photo icons/maps
      if (
        rawTitle.match(/\.(svg|pdf|webm|ogg|ogv|tif|tiff)$/i) ||
        rawTitle.match(/(logo|icon|flag|map|diagram|stamp|locator|banner|plan|route|coat_of_arms)/i)
      ) {
        continue;
      }

      const imgUrl = info.thumburl || info.url;
      if (!imgUrl) continue;

      items.push({
        url: imgUrl,
        title: cleanPhotoTitle(rawTitle),
        isPrimary: false,
      });
    }

    return items;
  } catch (err) {
    console.warn(`Commons query failed for "${query}":`, err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get('slug') || '').trim().toLowerCase();
  const name = (searchParams.get('name') || '').trim();
  const limitParam = parseInt(searchParams.get('limit') || '8', 10);
  const limit = Math.max(3, Math.min(limitParam, 16));

  if (!slug && !name) {
    return NextResponse.json(
      { error: 'Missing slug or name query parameter' },
      { status: 400 }
    );
  }

  const cacheKey = `${slug || name}_${limit}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      slug,
      photos: cached.photos,
      cached: true,
    });
  }

  const photos: PlacePhotoItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Check if local authentic image exists for this slug
  if (slug) {
    const localRelPath = `/images/places/${slug}.jpg`;
    const localDiskPath = path.join(process.cwd(), 'public', 'images', 'places', `${slug}.jpg`);
    if (fs.existsSync(localDiskPath)) {
      photos.push({
        url: localRelPath,
        title: name ? `${name} (Featured Photograph)` : 'Featured Landmark Photo',
        isPrimary: true,
      });
      seenUrls.add(localRelPath);
    }
  }

  // 2. Generate search terms in priority order
  const searchQueries: string[] = [];

  // A. Specific core landmark keyword
  if (slug.includes('dagdusheth')) {
    searchQueries.push('Dagdusheth Ganpati Pune', 'Dagdusheth Halwai');
  } else if (slug.includes('phule-wada')) {
    searchQueries.push('Phule Wada Pune', 'Mahatma Jyotirao Phule Wada');
  } else if (slug.includes('bhide-wada')) {
    searchQueries.push('Bhide Wada Pune', 'Savitribai Phule Pune');
  } else if (slug.includes('lenyadri')) {
    searchQueries.push('Lenyadri Caves Junnar', 'Lenyadri Ganpati');
  } else if (slug.includes('bhor-rajwada')) {
    searchQueries.push('Bhor Rajwada Palace', 'Bhor Palace');
  } else if (slug.includes('omkareshwar')) {
    searchQueries.push('Omkareshwar Temple Pune', 'Omkareshwar Shaniwar Peth');
  } else if (slug.includes('trishund')) {
    searchQueries.push('Trishund Ganpati Temple Pune', 'Trishund Mayureshwar');
  } else if (slug.includes('balgandharva')) {
    searchQueries.push('Bal Gandharva Ranga Mandir Pune', 'Balgandharva Pune');
  } else if (slug.includes('chitale')) {
    searchQueries.push('Bakarwadi', 'Chitale Bandhu Pune');
  } else if (slug.includes('kayani')) {
    searchQueries.push('Shrewsbury biscuits', 'Kayani Bakery Pune');
  } else if (slug.includes('sujata-mastani')) {
    searchQueries.push('Mastani drink Pune', 'Mastani ice cream');
  } else if (slug.includes('someshwar')) {
    searchQueries.push('Someshwar Temple Pashan', 'Pashan Lake Pune');
  } else if (slug.includes('sinhagad')) {
    searchQueries.push('Sinhagad Fort Pune', 'Kalyan Darwaza Sinhagad');
  } else if (slug.includes('shaniwar-wada')) {
    searchQueries.push('Shaniwar Wada Pune', 'Dilli Darwaza Shaniwar Wada');
  }

  // B. Clean Name
  if (name) {
    const cleanName = name.replace(/\([^)]*\)/g, '').trim();
    if (!cleanName.toLowerCase().includes('pune') && !cleanName.toLowerCase().includes('fort')) {
      searchQueries.push(`${cleanName} Pune`);
    } else {
      searchQueries.push(cleanName);
    }
  }

  // C. Slug with spaces
  if (slug) {
    const slugQuery = slug.replace(/-/g, ' ');
    if (!slugQuery.includes('pune')) {
      searchQueries.push(`${slugQuery} Pune`);
    } else {
      searchQueries.push(slugQuery);
    }
  }

  // Deduplicate search queries
  const uniqueQueries = [...new Set(searchQueries)];

  // 3. Fetch from Wikimedia Commons until we hit the requested limit
  for (const q of uniqueQueries) {
    if (photos.length >= limit) break;
    const fetched = await searchCommons(q, limit * 2);
    for (const item of fetched) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        photos.push(item);
        if (photos.length >= limit) break;
      }
    }
  }

  // 4. Save to cache
  CACHE.set(cacheKey, {
    timestamp: Date.now(),
    photos,
  });

  return NextResponse.json({
    success: true,
    slug,
    count: photos.length,
    photos,
  });
}
