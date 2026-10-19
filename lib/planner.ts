export type TravelMode = 'walking' | 'cycling' | 'driving';

export interface RouteCandidate {
  id: string;
  name: string;
  slug: string;
  score: number;
  visitDurationMinutes: number;
  entryCost: number | null;
  opensMinuteOfDay?: number;
  closesMinuteOfDay?: number;
  isHoursVerified: boolean;
  tier: 'listed' | 'enriched' | 'verified';
}

export interface PlannerInput {
  startMinuteOfDay: number;
  availableMinutes: number;
  mode: TravelMode;
  budgetPerPerson?: number;
  returnToStart: boolean;
  includeUnverified: boolean;
}

export interface TravelEstimator {
  (fromId: string, toId: string): { durationMinutes: number; isEstimate: boolean } | null;
}

export interface ItineraryStop {
  placeId: string;
  placeName: string;
  placeSlug: string;
  travelMinutes: number;
  visitMinutes: number;
  entryCost: number | null;
  tier: string;
}

export interface PlannerResult {
  feasible: boolean;
  totalDurationMinutes: number;
  bufferMinutes: number;
  knownCost: number;
  unknownCosts: string[];
  warnings: string[];
  stops: ItineraryStop[];
}

export function buildItinerary(
  input: PlannerInput,
  candidates: RouteCandidate[],
  getTravel: TravelEstimator
): PlannerResult {
  const warnings = new Set<string>();
  const unknownCosts: string[] = [];
  const stops: ItineraryStop[] = [];

  const bufferPerStop = input.mode === 'driving' ? 10 : 5;
  const timeLimit = Math.floor(input.availableMinutes * 0.9);

  const candidatePool = input.includeUnverified
    ? [...candidates]
    : candidates.filter((c) => c.isHoursVerified);

  let currentClock = input.startMinuteOfDay;
  let totalTimeSpent = 0;
  let accumulatedCost = 0;
  let currentLocationId = 'START';

  while (candidatePool.length > 0) {
    let bestPick: {
      candidate: RouteCandidate;
      travel: { durationMinutes: number; isEstimate: boolean };
      arrival: number;
      departure: number;
      addedTime: number;
      ratio: number;
    } | null = null;

    for (const cand of candidatePool) {
      const travel = getTravel(currentLocationId, cand.id);
      if (!travel) continue;

      const arrivalTime = currentClock + travel.durationMinutes;
      const startTime = cand.opensMinuteOfDay !== undefined
        ? Math.max(arrivalTime, cand.opensMinuteOfDay)
        : arrivalTime;
      const departureTime = startTime + cand.visitDurationMinutes;

      if (cand.closesMinuteOfDay !== undefined && departureTime > cand.closesMinuteOfDay) {
        continue;
      }

      const returnTravelMinutes = input.returnToStart
        ? (getTravel(cand.id, 'START')?.durationMinutes ?? 0)
        : 0;

      const legTime = travel.durationMinutes + (startTime - arrivalTime) + cand.visitDurationMinutes + bufferPerStop;

      if (totalTimeSpent + legTime + returnTravelMinutes > timeLimit) {
        continue;
      }

      if (
        input.budgetPerPerson !== undefined &&
        cand.entryCost !== null &&
        accumulatedCost + cand.entryCost > input.budgetPerPerson
      ) {
        continue;
      }

      const efficiencyRatio = cand.score / Math.max(1, legTime);
      if (!bestPick || efficiencyRatio > bestPick.ratio) {
        bestPick = {
          candidate: cand,
          travel,
          arrival: arrivalTime,
          departure: departureTime,
          addedTime: legTime,
          ratio: efficiencyRatio,
        };
      }
    }

    if (!bestPick) break;

    const { candidate, travel, addedTime } = bestPick;

    stops.push({
      placeId: candidate.id,
      placeName: candidate.name,
      placeSlug: candidate.slug,
      travelMinutes: travel.durationMinutes,
      visitMinutes: candidate.visitDurationMinutes,
      entryCost: candidate.entryCost,
      tier: candidate.tier,
    });

    if (candidate.entryCost === null) {
      unknownCosts.push(candidate.name);
    } else {
      accumulatedCost += candidate.entryCost;
    }

    if (!candidate.isHoursVerified) {
      warnings.add(`Visiting hours for ${candidate.name} are unverified.`);
    }
    if (travel.isEstimate) {
      warnings.add('One or more travel legs use straight-line estimations.');
    }

    currentClock += addedTime;
    totalTimeSpent += addedTime;
    currentLocationId = candidate.id;
    candidatePool.splice(candidatePool.indexOf(candidate), 1);
  }

  return {
    feasible: stops.length > 0,
    totalDurationMinutes: totalTimeSpent,
    bufferMinutes: input.availableMinutes - totalTimeSpent,
    knownCost: accumulatedCost,
    unknownCosts,
    warnings: Array.from(warnings),
    stops,
  };
}