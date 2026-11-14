/**
 * Explore Pune - Master Destination Verification & Fact-Checking Types
 * Standardizes field-level provenance, authoritative citations, and multi-tier authenticity.
 */

export type VerificationStatus =
  | 'VERIFIED'           // Supported by an authoritative official source or direct confirmation
  | 'CROSS-VERIFIED'     // Supported by multiple independent reliable sources
  | 'NEEDS_VERIFICATION' // Evidence exists but requires seasonal or on-site re-confirmation
  | 'UNVERIFIED'         // No sufficient reliable evidence available
  | 'CONFLICTING';       // Reliable sources disagree on values

export type SourceType =
  | 'central_government'  // ASI, National Archives, Ministry of Culture
  | 'state_government'    // Maharashtra Tourism (MTDC), MahaForest, State Archives
  | 'municipal'           // Pune Municipal Corporation (PMC), PCMC
  | 'district_collector'  // Pune District Administration, Disaster Management
  | 'transport_authority' // PMPML, Maha Metro, Indian Railways
  | 'registered_trust'    // Temple trusts, Non-profit museums (e.g. Dagdusheth Trust)
  | 'academic_gazetteer'  // Poona District Gazetteer, University publications
  | 'field_survey';       // Physical GPS survey & visitor documentation

export interface SourceCitation {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  evidenceExcerpt?: string;
  checkedAt: string; // ISO date
  publicationDate?: string;
  verifiedBy: string;
}

export interface FieldVerificationRecord<T = any> {
  value: T;
  status: VerificationStatus;
  primarySourceUrl?: string;
  sourceType?: SourceType;
  supportingEvidence?: string;
  checkedAt: string;
  reviewedBy: string;
  confidenceScore: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface DestinationVerificationRecord {
  destinationId: string; // Canonical slug (e.g. 'sinhagad-fort')
  name: string;
  nameMr: string;
  aliases: string[];
  category: 'forts' | 'heritage' | 'temples' | 'museums' | 'parks' | 'nature' | 'food';
  categorySlug: string;

  // Geographic Precision
  coordinates: {
    latitude: number;
    longitude: number;
    entranceLatitude?: number;
    entranceLongitude?: number;
    parkingLatitude?: number;
    parkingLongitude?: number;
    mapSource: string;
    status: VerificationStatus;
  };

  // Physical Address
  address: {
    fullAddressEn: string;
    fullAddressMr: string;
    locality: string;
    taluka?: string;
    district: string;
    pincode?: string;
    status: VerificationStatus;
  };

  // Historical & Cultural Provenance
  history: {
    backgroundEn: string;
    backgroundMr: string;
    period?: string;
    founderOrPatron?: string;
    significanceEn: string;
    significanceMr: string;
    architectureTypeEn?: string;
    architectureTypeMr?: string;
    conservationAuthority?: string; // ASI, State Archaeology, Forest Dept, Trust
    status: VerificationStatus;
  };

  // Visitor Operations & Access
  visitorInfo: {
    openingHoursEn: string; // e.g. '06:00 AM - 06:00 PM' or 'Open 24 Hours'
    openingHoursMr: string;
    weeklyClosureEn?: string; // e.g. 'Open all 7 days' or 'Closed on Mondays'
    weeklyClosureMr?: string;
    holidayRestrictionsEn?: string;
    holidayRestrictionsMr?: string;
    entryFee: {
      isFree: boolean;
      inrIndian: number | null;
      inrForeigner: number | null;
      childUnder15Free?: boolean;
      ticketType: 'free' | 'asi_ticketed' | 'trust_ticketed' | 'pmc_ticketed' | 'unconfirmed';
      remarksEn?: string;
      remarksMr?: string;
    };
    vehicleToll?: {
      twoWheelerInr?: number | null;
      fourWheelerInr?: number | null;
      tollAuthority?: string;
    };
    parkingInfoEn?: string;
    parkingInfoMr?: string;
    photographyRestrictionsEn?: string;
    recommendedDurationMinutes: number;
    safetyGuidelinesEn: string[];
    safetyGuidelinesMr: string[];
    status: VerificationStatus;
  };

  // Public Transit & Mobility
  transport: {
    pmpmlDirectBuses: string[];
    nearestBusStopEn: string;
    nearestBusStopMr: string;
    nearestMetroStationEn?: string;
    nearestMetroStationMr?: string;
    metroLineColor?: string;
    isMetroDirectWalk?: boolean;
    walkingMinutesFromStop: number;
    intermodalTransferNotesEn?: string;
    intermodalTransferNotesMr?: string;
    roadAccessNotesEn?: string;
    status: VerificationStatus;
  };

  // Visitor Experience & Seasonality
  experience: {
    bestSeasonEn: string;
    bestSeasonMr: string;
    trekkingDifficulty?: 'easy' | 'moderate' | 'difficult' | 'expert' | 'n/a';
    familySuitability: boolean;
    foodAvailabilityEn: string;
    foodAvailabilityMr: string;
  };

  // Media & Attribution
  media: {
    imageUrl: string;
    imageAltEn: string;
    imageAltMr: string;
    attribution: string;
    license: string;
    sourceUrl?: string;
  };

  // Audit & Governance Metadata
  sources: SourceCitation[];
  overallStatus: VerificationStatus;
  conflicts?: Array<{
    field: string;
    claimA: string;
    sourceA: string;
    claimB: string;
    sourceB: string;
    resolutionDecision: string;
    resolved: boolean;
  }>;
  missingFields: string[];
  lastVerifiedAt: string;
  updatedAt: string;
  adminApproved: boolean;
  reviewedBy: string;
}
