/**
 * Explore Pune - Experience v2 Type Definitions
 */

export interface ExperiencePlace {
  id: string;
  slug: string;
  name: string;
  name_mr?: string;
  category_slug: string;
  category: string;
  image_url: string;
  description: string;
  description_mr?: string;
  address: string;
  address_mr?: string;
  best_time?: string;
  best_time_mr?: string;
  latitude: number;
  longitude: number;
  popularity_score?: number;
  recommended_duration_minutes?: number;
  entry_fee?: number;
  fee_status?: string;
  fee_details?: {
    admission?: number;
    adult?: number;
    child?: number;
    foreigner?: number;
    vehicle_toll?: string;
    parking?: string;
    camera?: number;
    notes?: string;
    notes_mr?: string;
  };
  opening_hours?: string;
  opening_hours_mr?: string;
  weekly_closure?: string;
  weekly_closure_mr?: string;
  location?: {
    nearby_metro?: string;
    nearest_bus_stop?: string;
  };
  zoneId?: ZoneId;
}

export type ZoneId =
  | 'historic-peths'
  | 'deccan-kothrud'
  | 'camp-cantonment'
  | 'kp-nagar-rd'
  | 'sahyadri-forts';

export interface ZoneDefinition {
  id: ZoneId;
  nameEn: string;
  nameMr: string;
  taglineEn: string;
  taglineMr: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  accentColor: string; // e.g. blue #3880FF, green #00B77F
  descriptionEn: string;
  descriptionMr: string;
  approxPolygonCoordinates: [number, number][][]; // GeoJSON Polygon coordinates
}

export interface CategorySummary {
  slug: string;
  nameEn: string;
  nameMr: string;
  color: string;
  iconName: string;
  count: number;
  descriptionEn: string;
  descriptionMr: string;
  coverImage: string;
}

export interface FeatureShowcase {
  id: string;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  route: string;
  actionTextEn: string;
  actionTextMr: string;
  badgeEn: string;
  badgeMr: string;
  iconName: string;
  imageUrl: string;
  statNumber: string;
  statLabelEn: string;
  statLabelMr: string;
}

export interface MarqueeItem {
  id: string;
  textEn: string;
  textMr: string;
  type: 'hours' | 'transit' | 'tickets' | 'verified';
  badge: string;
}

export interface StoryItem {
  id: string;
  titleEn: string;
  titleMr: string;
  authorNoteEn: string;
  authorNoteMr: string;
  readingMinutes: number;
  coverImage: string;
  excerptEn: string;
  excerptMr: string;
  featuredSlugs: string[];
  route: string;
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionMr: string;
  answerEn: string;
  answerMr: string;
  category: string;
}
