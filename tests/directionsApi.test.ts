import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/v1/directions/route';

describe('/api/v1/directions API route', () => {
  it('calculates driving route between two verified Pune locations', async () => {
    // Shaniwar Wada to Sinhagad Fort
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.5196,
        originLng: 73.8553,
        originName: 'Shaniwar Wada',
        destLat: 18.3663,
        destLng: 73.7558,
        destName: 'Sinhagad Fort',
        travelMode: 'driving',
        lang: 'en',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.distanceKm).toBeGreaterThan(15);
    expect(json.durationMinutes).toBeGreaterThan(20);
    expect(json.travelMode).toBe('driving');
    expect(json.gmapsUrl).toContain('18.51960');
    expect(json.gmapsUrl).toContain('18.36630');
    expect(json.gmapsUrl).toContain('travelmode=driving');
    expect(json.steps).toBeDefined();
    expect(json.steps.length).toBeGreaterThan(0);
  });

  it('calculates transit route returning scheduled public transit details', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.5284,
        originLng: 73.8739,
        originName: 'Pune Railway Station',
        destLat: 18.5196,
        destLng: 73.8553,
        destName: 'Shaniwar Wada',
        travelMode: 'transit',
        lang: 'en',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.travelMode).toBe('transit');
    expect(json.durationMinutes).toBeGreaterThan(0);
    expect(json.summary).toBeDefined();
  });

  it('calculates walking route between nearby landmarks', async () => {
    // Shaniwar Wada to Lal Mahal (~300m)
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.5186,
        destLng: 73.8569,
        destName: 'Lal Mahal',
        travelMode: 'walking',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.travelMode).toBe('walking');
    expect(json.gmapsUrl).toContain('travelmode=walking');
  });

  it('returns 400 Bad Request on invalid coordinates', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 'invalid_string',
        originLng: 73.8567,
        destLat: 18.5204,
        destLng: 73.8567,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error.code).toBe('INVALID_INPUT');
  });

  it('formats Marathi responses naturally when lang is mr', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.5196,
        originLng: 73.8553,
        destLat: 18.3663,
        destLng: 73.7558,
        destName: 'सिंहगड किल्ला',
        travelMode: 'driving',
        lang: 'mr',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.distanceText).toContain('किमी');
  });

  it('handles distant or edge coordinates gracefully without crashing', async () => {
    // Outer edge Pune boundary coordinates
    const req = new NextRequest('http://localhost:3000/api/v1/directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originLat: 18.7500,
        originLng: 73.4000,
        destLat: 18.5196,
        destLng: 73.8553,
        travelMode: 'driving',
        lang: 'en',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.distanceKm).toBeGreaterThan(0);
  });
});
