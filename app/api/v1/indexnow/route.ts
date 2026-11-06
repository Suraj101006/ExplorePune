import { NextResponse, type NextRequest } from 'next/server';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = '404a71b2d7fc4f2b9b7342813589b21e';
const HOST = 'explorepune-guide.vercel.app';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const CORE_STATIC_ROUTES = [
  `https://${HOST}/`,
  `https://${HOST}/destinations`,
  `https://${HOST}/destinations/forts`,
  `https://${HOST}/destinations/heritage`,
  `https://${HOST}/destinations/temples`,
  `https://${HOST}/destinations/museums`,
  `https://${HOST}/destinations/nature`,
  `https://${HOST}/destinations/parks`,
  `https://${HOST}/destinations/food`,
  `https://${HOST}/destinations/free`,
  `https://${HOST}/planner`,
  `https://${HOST}/play-metro-transit.html`,
  `https://${HOST}/community`,
  `https://${HOST}/blogs`,
  `https://${HOST}/about`,
  `https://${HOST}/data`,
  `https://${HOST}/milestones`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
];

async function getAllCatalogUrls(): Promise<string[]> {
  const urlSet = new Set<string>(CORE_STATIC_ROUTES);

  // Try fetching live published places from Firestore
  try {
    const snap = await getDocs(collection(db, 'places'));
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.status === 'published' && data.slug) {
        urlSet.add(`https://${HOST}/places/${encodeURIComponent(data.slug)}`);
      }
    });
  } catch (err) {
    // Fallback cleanly to verified structured places
  }

  // Baseline structured catalog
  if (Array.isArray(ALL_STRUCTURED_PLACES)) {
    for (const place of ALL_STRUCTURED_PLACES) {
      const slug = place.slug || place.id;
      if (slug) {
        urlSet.add(`https://${HOST}/places/${encodeURIComponent(slug)}`);
      }
    }
  }

  return Array.from(urlSet);
}

async function submitToIndexNow(urls: string[]) {
  // IndexNow allows batches up to 10,000 URLs per POST
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const results: Record<string, { status: number; message: string }> = {};

  const endpoints = [
    { name: 'IndexNow (Universal)', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing', url: 'https://www.bing.com/indexnow' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      results[ep.name] = {
        status: res.status,
        message:
          res.status === 200 || res.status === 202
            ? 'URLs submitted successfully for instant indexing.'
            : `Search engine returned HTTP ${res.status}.`,
      };
    } catch (err: any) {
      results[ep.name] = {
        status: 500,
        message: err?.message || 'Submission failed.',
      };
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const singleUrl = searchParams.get('url');

  const urlsToSubmit = singleUrl ? [singleUrl] : await getAllCatalogUrls();
  const results = await submitToIndexNow(urlsToSubmit);

  return NextResponse.json({
    success: true,
    mode: singleUrl ? 'single' : 'full-catalog',
    submittedCount: urlsToSubmit.length,
    sampleUrls: urlsToSubmit.slice(0, 5),
    timestamp: new Date().toISOString(),
    results,
  });
}

export async function POST(request: NextRequest) {
  let urlsToSubmit: string[] = [];

  try {
    const body = await request.json().catch(() => null);
    if (body?.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      urlsToSubmit = body.urls;
    } else if (body?.url && typeof body.url === 'string') {
      urlsToSubmit = [body.url];
    }
  } catch {
    // fallback to full catalog
  }

  if (urlsToSubmit.length === 0) {
    urlsToSubmit = await getAllCatalogUrls();
  }

  const results = await submitToIndexNow(urlsToSubmit);

  return NextResponse.json({
    success: true,
    mode: urlsToSubmit.length === 1 ? 'single' : urlsToSubmit.length < 20 ? 'custom' : 'full-catalog',
    submittedCount: urlsToSubmit.length,
    sampleUrls: urlsToSubmit.slice(0, 5),
    timestamp: new Date().toISOString(),
    results,
  });
}
