import { describe, it, expect } from 'vitest';
import {
  calculateGeoDistanceKm,
  getAllJourneys,
  getTodayJourney,
  getJourneyByDate,
  computeOverallStats,
  computeJourneyMilestones,
  generateSpecialJourneyCards,
  generateJourneyStories,
  calculateExplorationStreak,
  TOTAL_PUNE_PLACES_COUNT,
} from '@/lib/journeyStorage';

describe('My Pune Journey Engine', () => {
  it('calculates Haversine distance accurately between Pune coordinates', () => {
    // Shaniwar Wada (18.5195, 73.8553) to Lal Mahal (18.5186, 73.8569) is ~0.2 km
    const dist = calculateGeoDistanceKm(18.5195, 73.8553, 18.5186, 73.8569);
    expect(dist).toBeGreaterThan(0.1);
    expect(dist).toBeLessThan(0.4);
  });

  it('pre-seeds authentic journey dates including 14 June and 20 October', () => {
    const journeys = getAllJourneys();
    expect(journeys.length).toBeGreaterThanOrEqual(6);

    const june14 = journeys.find((j) => j.date === '2026-06-14');
    expect(june14).toBeDefined();
    expect(june14?.title).toBe('First Pune Exploration Journey');
    expect(june14?.places.length).toBe(4);
    expect(june14?.places[0].placeName).toBe('Shaniwar Wada');
    expect(june14?.places[1].placeName).toBe('Lal Mahal');
    expect(june14?.places[2].placeName).toBe('FC Road');
    expect(june14?.places[3].placeName).toContain('Koregaon Park');

    const today = getTodayJourney();
    expect(today).toBeDefined();
    expect(today?.places.length).toBeGreaterThanOrEqual(3);
  });

  it('retrieves single date journey correctly', () => {
    const journey = getJourneyByDate('2026-06-14');
    expect(journey).toBeDefined();
    expect(journey?.date).toBe('2026-06-14');
    expect(journey?.status).toBe('completed');
  });

  it('computes overall stats dynamically', () => {
    const journeys = getAllJourneys();
    const stats = computeOverallStats(journeys);
    expect(stats.totalJourneys).toBe(journeys.length);
    expect(stats.totalPlacesVisited).toBeGreaterThan(0);
    expect(stats.totalDistanceKm).toBeGreaterThan(0);
    expect(stats.totalAreasExplored).toBeGreaterThan(0);
    expect(stats.categoriesExplored.length).toBeGreaterThan(0);
  });

  it('evaluates milestones based on visited places count and areas', () => {
    const journeys = getAllJourneys();
    const stats = computeOverallStats(journeys);
    const milestones = computeJourneyMilestones(stats);
    expect(milestones.length).toBeGreaterThanOrEqual(5);
    const firstStep = milestones.find((m) => m.id === 'first-step');
    expect(firstStep?.isUnlocked).toBe(true);
  });

  it('generates special journey cards from authentic activity', () => {
    const journeys = getAllJourneys();
    const stats = computeOverallStats(journeys);
    const specialCards = generateSpecialJourneyCards(journeys, stats);
    expect(specialCards.length).toBeGreaterThan(0);

    const firstDisc = specialCards.find((c) => c.type === 'first_discovery');
    expect(firstDisc).toBeDefined();
    expect(firstDisc?.titleEn).toBe('Your First Pune Discovery');
  });

  it('generates poetic journey stories from visited landmarks', () => {
    const journeys = getAllJourneys();
    const stories = generateJourneyStories(journeys);
    expect(stories.length).toBeGreaterThan(0);
    expect(stories[0].imageUrl).toBeDefined();
    expect(stories[0].quoteEn).toBeDefined();
    expect(stories[0].placeName).toBeDefined();
  });

  it('calculates healthy exploration streak', () => {
    const journeys = getAllJourneys();
    const streak = calculateExplorationStreak(journeys);
    expect(streak.totalActiveDays).toBeGreaterThan(0);
    expect(streak.currentStreak).toBeGreaterThanOrEqual(1);
    expect(TOTAL_PUNE_PLACES_COUNT).toBe(80);
  });
});
