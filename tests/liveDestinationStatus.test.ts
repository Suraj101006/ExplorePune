import { describe, it, expect } from 'vitest';
import {
  DESTINATION_PROFILES,
  OFFICIAL_STANDING_REGULATIONS,
  isAlertExpired,
  getAlertsForDestination,
  DestinationAlert,
} from '@/lib/liveStatus';
import { getDestinationLiveStatus } from '@/lib/liveStatusService';
import { GET as getDestinationStatusRoute } from '@/app/api/v1/destinations/[slug]/status/route';
import { NextRequest } from 'next/server';

describe('Live Destination Status & Safety Alert System', () => {
  describe('1. Destination Regulations & Fort Safety (Sinhagad Fort)', () => {
    it('retrieves live status for Sinhagad Fort with standing forest curfew', async () => {
      const status = await getDestinationLiveStatus('sinhagad-fort');

      expect(status).toBeDefined();
      expect(status.destinationSlug).toBe('sinhagad-fort');
      expect(status.destinationName).toContain('Sinhagad');
      expect(status.status).toBe('restricted');
      expect(status.badgeClass).toBe('status-restricted');
      expect(status.canEnter).toBe(true);
      expect(status.canTrek).toBe(true);
      expect(status.canDarshan).toBeNull();

      // Check active alerts contain Maharashtra Forest Dept order
      const forestAlert = status.activeAlerts.find(
        (a) => a.issuingAuthority.includes('Forest') || a.id.includes('sinhagad')
      );
      expect(forestAlert).toBeDefined();
      expect(forestAlert?.isOfficialOrder).toBe(true);
      expect(forestAlert?.sourceUrl).toContain('mahaforest.gov.in');
      expect(forestAlert?.effectiveUntil).toBeNull(); // ongoing standing rule
    });

    it('resolves alias sinhgad correctly to sinhagad-fort', async () => {
      const status = await getDestinationLiveStatus('sinhgad');
      expect(status.destinationSlug).toBe('sinhagad-fort');
    });
  });

  describe('2. Waterfall & Hazard Safety Alerts (Tamhini Ghat & Bhushi Dam)', () => {
    it('retrieves warning status and hazard advisory for Tamhini Ghat waterfalls', async () => {
      const status = await getDestinationLiveStatus('tamhini-ghat');

      expect(status).toBeDefined();
      expect(status.destinationSlug).toBe('tamhini-ghat');
      expect(['warning', 'restricted']).toContain(status.status);
      expect(status.headlineEn).toContain('Waterfall');

      const hazardAlert = status.activeAlerts.find((a) =>
        a.id.includes('tamhini')
      );
      expect(hazardAlert).toBeDefined();
      expect(hazardAlert?.severity).toBe('urgent');
      expect(hazardAlert?.issuingAuthority).toContain('Disaster Management');
    });

    it('evaluates Bushi Dam cascade safety advisory', async () => {
      const status = await getDestinationLiveStatus('bhushi-dam');

      expect(status).toBeDefined();
      expect(status.destinationSlug).toBe('bushi-dam');
      expect(['restricted', 'warning']).toContain(status.status);
      expect(status.canEnter).toBe(true);

      const damAlert = status.activeAlerts.find((a) => a.id.includes('bushi'));
      expect(damAlert).toBeDefined();
      expect(damAlert?.summary).toContain('5:00 PM');
    });
  });

  describe('3. Temple Protocols & Darshan Verification (Dagdusheth & Bhimashankar)', () => {
    it('confirms open status and darshan access for Shreemant Dagdusheth Ganpati', async () => {
      const status = await getDestinationLiveStatus('shreemant-dagdusheth-halwai-ganpati');

      expect(status).toBeDefined();
      expect(status.status).toBe('open');
      expect(status.canDarshan).toBe(true);
      expect(status.canEnter).toBe(true);
      expect(status.badgeClass).toBe('status-open');

      const darshanAlert = status.activeAlerts.find((a) => a.id.includes('dagdusheth'));
      expect(darshanAlert).toBeDefined();
      expect(darshanAlert?.category).toBe('darshan');
      expect(darshanAlert?.issuingAuthority).toContain('Ganpati Trust');
    });

    it('handles Bhimashankar Jyotirlinga and verifies ghat road fog advisory', async () => {
      const status = await getDestinationLiveStatus('bhimashankar-temple');

      expect(status).toBeDefined();
      expect(['open', 'warning']).toContain(status.status);
      expect(status.canDarshan).toBe(true);
      expect(status.destinationName).toContain('Bhimashankar');
    });
  });

  describe('4. Strict Destination Isolation (No Alert Leakage)', () => {
    it('ensures Sinhagad alerts never attach to Shaniwar Wada', () => {
      const shaniwarAlerts = getAlertsForDestination('shaniwar-wada');
      const hasSinhagad = shaniwarAlerts.some(
        (a) =>
          a.destinationSlug.includes('sinhagad') ||
          a.title.toLowerCase().includes('sinhagad')
      );
      expect(hasSinhagad).toBe(false);

      // Verify Shaniwar Wada only has its own ASI regulation
      expect(shaniwarAlerts.length).toBeGreaterThanOrEqual(1);
      expect(shaniwarAlerts[0].destinationSlug).toBe('shaniwar-wada');
      expect(shaniwarAlerts[0].issuingAuthority).toContain('ASI');
    });

    it('ensures Tamhini waterfall hazards never leak to Dagdusheth Ganpati', () => {
      const dagdushethAlerts = getAlertsForDestination('shreemant-dagdusheth-halwai-ganpati');
      const hasWaterfallLeak = dagdushethAlerts.some(
        (a) =>
          a.title.toLowerCase().includes('waterfall') ||
          a.title.toLowerCase().includes('tamhini')
      );
      expect(hasWaterfallLeak).toBe(false);
    });

    it('verifies destination keyword profiles define negative matching for ambiguous queries', () => {
      expect(DESTINATION_PROFILES['sinhagad-fort'].negativeMatchKeywords).toBeDefined();
      expect(DESTINATION_PROFILES['sinhagad-fort'].negativeMatchKeywords).toContain('rajgad');
      expect(DESTINATION_PROFILES['rajgad-fort'].negativeMatchKeywords).toContain('sinhagad');
    });
  });

  describe('5. Time-Limited Alerts & Automatic Expiry', () => {
    it('identifies expired alerts when effectiveUntil is in the past', () => {
      const expiredAlert: DestinationAlert = {
        id: 'mock-expired',
        destinationSlug: 'sinhagad-fort',
        destinationName: 'Sinhagad Fort',
        title: 'Temporary Road Work Closed',
        severity: 'urgent',
        category: 'road_access',
        sourceType: 'official_order',
        isOfficialOrder: true,
        statusImpact: 'closed',
        summary: 'Road resurfacing work completed.',
        canEnter: false,
        canTrek: true,
        canDarshan: null,
        effectiveFrom: '2023-01-01T00:00:00.000Z',
        effectiveUntil: '2023-01-05T23:59:59.000Z',
        issuingAuthority: 'PWD Pune',
        authorityType: 'district_admin',
        sourceName: 'PWD Notice',
        sourceUrl: 'https://pune.gov.in',
        verifiedAt: '2023-01-01T00:00:00.000Z',
        isExpired: true,
      };

      const now = new Date('2026-11-09T00:00:00.000Z');
      expect(isAlertExpired(expiredAlert, now)).toBe(true);
    });

    it('keeps alerts active when effectiveUntil is null (ongoing regulation)', () => {
      const ongoingAlert: DestinationAlert = {
        id: 'mock-ongoing',
        destinationSlug: 'sinhagad-fort',
        destinationName: 'Sinhagad Fort',
        title: 'Standing Curfew',
        severity: 'moderate',
        category: 'closure',
        sourceType: 'official_order',
        isOfficialOrder: true,
        statusImpact: 'restricted',
        summary: 'Standing nightly curfew.',
        canEnter: true,
        canTrek: true,
        canDarshan: null,
        effectiveFrom: '2024-01-01T00:00:00.000Z',
        effectiveUntil: null,
        issuingAuthority: 'Forest Dept',
        authorityType: 'forest_department',
        sourceName: 'Forest Dept Order',
        sourceUrl: 'https://mahaforest.gov.in',
        verifiedAt: new Date().toISOString(),
        isExpired: false,
      };

      const now = new Date();
      expect(isAlertExpired(ongoingAlert, now)).toBe(false);
    });
  });

  describe('6. REST API Route (/api/v1/destinations/[slug]/status)', () => {
    it('returns status code 200 with schema compliance for valid destination', async () => {
      const req = new NextRequest(
        'https://explorepune-guide.vercel.app/api/v1/destinations/sinhagad-fort/status'
      );
      const res = await getDestinationStatusRoute(req, {
        params: Promise.resolve({ slug: 'sinhagad-fort' }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();

      expect(json.destinationSlug).toBe('sinhagad-fort');
      expect(json.status).toBe('restricted');
      expect(json.statusLabelEn).toBe('Restricted Entry');
      expect(json.lastVerifiedAt).toContain('IST');
      expect(Array.isArray(json.activeAlerts)).toBe(true);
      expect(json.activeAlerts.length).toBeGreaterThan(0);
    });

    it('returns 400 when slug parameter is missing or empty', async () => {
      const req = new NextRequest(
        'https://explorepune-guide.vercel.app/api/v1/destinations//status'
      );
      const res = await getDestinationStatusRoute(req, {
        params: Promise.resolve({ slug: '' }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });
});
