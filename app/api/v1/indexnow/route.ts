import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = '404a71b2d7fc4f2b9b7342813589b21e';
const HOST = 'explore-pune-eosin.vercel.app';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const PRIORITY_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/destinations`,
  `https://${HOST}/planner`,
  `https://${HOST}/destinations/forts`,
  `https://${HOST}/destinations/heritage`,
  `https://${HOST}/destinations/temples`,
  `https://${HOST}/destinations/museums`,
  `https://${HOST}/destinations/food`,
  `https://${HOST}/destinations/nature`,
  `https://${HOST}/destinations/parks`,
  `https://${HOST}/destinations/free`,
  `https://${HOST}/play-metro-transit.html`,
  `https://${HOST}/about`,
  `https://${HOST}/community`,
  `https://${HOST}/blogs`,
  `https://${HOST}/places/shaniwar-wada`,
  `https://${HOST}/places/sinhagad-fort`,
  `https://${HOST}/places/aga-khan-palace`,
  `https://${HOST}/places/shreemant-dagdusheth-halwai-ganpati`,
  `https://${HOST}/places/pataleshwar-cave-temple`,
];

export async function GET() {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: PRIORITY_URLS,
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

  return NextResponse.json({
    success: true,
    submittedCount: PRIORITY_URLS.length,
    timestamp: new Date().toISOString(),
    results,
  });
}

export async function POST() {
  return GET();
}
