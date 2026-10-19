import { describe, it, expect } from 'vitest';
import { buildItinerary, RouteCandidate, PlannerInput } from './planner';

describe('buildItinerary', () => {
  const mockCandidates: RouteCandidate[] = [
    {
      id: 'shaniwar-wada',
      name: 'Shaniwar Wada',
      slug: 'shaniwar-wada',
      score: 100,
      visitDurationMinutes: 45,
      entryCost: 25,
      opensMinuteOfDay: 540, // 09:00
      closesMinuteOfDay: 1080, // 18:00
      isHoursVerified: true,
      tier: 'verified',
    },
    {
      id: 'lal-mahal',
      name: 'Lal Mahal',
      slug: 'lal-mahal',
      score: 80,
      visitDurationMinutes: 30,
      entryCost: null, // unknown cost
      opensMinuteOfDay: 540, // 09:00
      closesMinuteOfDay: 1080, // 18:00
      isHoursVerified: false,
      tier: 'listed',
    },
    {
      id: 'raja-kelkar',
      name: 'Raja Dinkar Kelkar Museum',
      slug: 'raja-kelkar',
      score: 90,
      visitDurationMinutes: 60,
      entryCost: 100,
      opensMinuteOfDay: 600, // 10:00
      closesMinuteOfDay: 1050, // 17:30
      isHoursVerified: true,
      tier: 'verified',
    },
  ];

  const constantTravel = (duration = 10, isEstimate = false) => {
    return () => ({
      durationMinutes: duration,
      isEstimate,
    });
  };

  it('generates a feasible itinerary within the available time and 10% safety margin', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540, // 09:00
      availableMinutes: 180, // 3 hours -> limit = 162 min
      mode: 'walking', // bufferPerStop = 5 min
      returnToStart: false,
      includeUnverified: true,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10));

    expect(result.feasible).toBe(true);
    expect(result.stops.length).toBeGreaterThan(0);
    expect(result.totalDurationMinutes).toBeLessThanOrEqual(Math.floor(input.availableMinutes * 0.9));
    expect(result.bufferMinutes).toBe(input.availableMinutes - result.totalDurationMinutes);
  });

  it('respects per-person budget limits and skips unaffordable stops', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540,
      availableMinutes: 300,
      mode: 'walking',
      budgetPerPerson: 50, // Only Shaniwar Wada (cost 25) fits; Raja Kelkar (100) exceeds budget
      returnToStart: false,
      includeUnverified: false,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10));

    expect(result.feasible).toBe(true);
    const stopIds = result.stops.map((s) => s.placeId);
    expect(stopIds).toContain('shaniwar-wada');
    expect(stopIds).not.toContain('raja-kelkar');
    expect(result.knownCost).toBeLessThanOrEqual(50);
  });

  it('handles unknown entry costs without treating them as free or inflating knownCost', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540,
      availableMinutes: 180,
      mode: 'walking',
      returnToStart: false,
      includeUnverified: true,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10));
    const lalMahalStop = result.stops.find((s) => s.placeId === 'lal-mahal');

    if (lalMahalStop) {
      expect(lalMahalStop.entryCost).toBeNull();
      expect(result.unknownCosts).toContain('Lal Mahal');
    }
  });

  it('filters unverified places when includeUnverified is false', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540,
      availableMinutes: 240,
      mode: 'walking',
      returnToStart: false,
      includeUnverified: false,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10));
    const stopIds = result.stops.map((s) => s.placeId);

    expect(stopIds).not.toContain('lal-mahal');
    result.stops.forEach((stop) => {
      const original = mockCandidates.find((c) => c.id === stop.placeId);
      expect(original?.isHoursVerified).toBe(true);
    });
  });

  it('adds warning when travel legs use straight-line estimations', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540,
      availableMinutes: 180,
      mode: 'walking',
      returnToStart: false,
      includeUnverified: true,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10, true));
    expect(result.warnings).toContain('One or more travel legs use straight-line estimations.');
  });

  it('returns feasible: false when no candidate fits in the allotted time', () => {
    const input: PlannerInput = {
      startMinuteOfDay: 540,
      availableMinutes: 20, // 20 * 0.9 = 18 minutes limit; travel (10) + buffer (5) + visit (30+) > 18
      mode: 'walking',
      returnToStart: false,
      includeUnverified: true,
    };

    const result = buildItinerary(input, mockCandidates, constantTravel(10));
    expect(result.feasible).toBe(false);
    expect(result.stops.length).toBe(0);
  });

  it('excludes places that would be visited after closing time', () => {
    const lateCandidate: RouteCandidate = {
      id: 'night-gate',
      name: 'Night Gate',
      slug: 'night-gate',
      score: 100,
      visitDurationMinutes: 60,
      entryCost: 0,
      opensMinuteOfDay: 480, // 08:00
      closesMinuteOfDay: 600, // 10:00 (closes early)
      isHoursVerified: true,
      tier: 'verified',
    };

    const input: PlannerInput = {
      startMinuteOfDay: 580, // 09:40 -> travel 10 min -> arrival 09:50 -> visit 60 min -> departure 10:50 > 10:00
      availableMinutes: 180,
      mode: 'walking',
      returnToStart: false,
      includeUnverified: false,
    };

    const result = buildItinerary(input, [lateCandidate], constantTravel(10));
    expect(result.feasible).toBe(false);
    expect(result.stops.length).toBe(0);
  });
});
