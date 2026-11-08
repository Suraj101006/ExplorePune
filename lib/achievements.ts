/**
 * Explore Pune — Milestones & Achievements System
 * Centralized Definitions, Evaluation Logic, Explorer Ranks, and Metadata.
 */

import { ALL_STRUCTURED_PLACES, StructuredPlace } from './chatKnowledgeEngine';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AchievementCategory =
  | 'getting_started'
  | 'fort_explorer'
  | 'heritage_culture'
  | 'adventure'
  | 'special_challenges';

export interface MedalDesign {
  metal: 'bronze' | 'silver' | 'gold' | 'platinum';
  accentColor: string;
  glowColor: string;
  ribbonColor: string;
  symbol:
    | 'footstep'
    | 'compass'
    | 'map'
    | 'crown'
    | 'fortress'
    | 'crossed_swords'
    | 'rampart'
    | 'temple'
    | 'wada'
    | 'scroll'
    | 'mountain'
    | 'boot'
    | 'gem'
    | 'calendar'
    | 'globe'
    | 'camera';
}

export interface AchievementEvaluationContext {
  distinctPlaceIds: Set<string>;
  visitedPlaces: StructuredPlace[];
  rawVisits: any[];
  blogsCount: number;
  visitedFortCount: number;
  visitedTempleCount: number;
  visitedHeritageCount: number;
  visitedHistoryCount: number;
  verifiedTrekCount: number;
  hiddenGemCount: number;
  distinctWeekendCount: number;
  distinctDistrictsCount: number;
  memoriesWithPhotosCount: number;
}

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  categoryLabelEn: string;
  categoryLabelMr: string;
  nameEn: string;
  nameMr: string;
  descEn: string;
  descMr: string;
  rarity: BadgeRarity;
  target: number;
  unitEn: string;
  unitMr: string;
  medalDesign: MedalDesign;
  actionLink: string;
  actionTextEn: string;
  actionTextMr: string;
  shareCaption: (explorerName: string, placeCount: number) => string;
  evaluate: (ctx: AchievementEvaluationContext) => { current: number; isUnlocked: boolean };
}

export interface UserAchievementState {
  id: string;
  definition: AchievementDefinition;
  current: number;
  target: number;
  isUnlocked: boolean;
  percentage: number;
  unlockedAt: string | null;
  isFavorite: boolean;
  nextStepHintEn: string;
  nextStepHintMr: string;
}

export interface ExplorerRank {
  level: number;
  titleEn: string;
  titleMr: string;
  badgeSymbol: string;
  minBadges: number;
  maxBadges: number;
  themeColor: string;
}

export const EXPLORER_RANKS: ExplorerRank[] = [
  {
    level: 1,
    titleEn: 'Novice Explorer',
    titleMr: 'प्रारंभिक भ्रमंतीवीर',
    badgeSymbol: '🧭',
    minBadges: 0,
    maxBadges: 2,
    themeColor: '#b45309',
  },
  {
    level: 2,
    titleEn: 'Sahyadri Scout',
    titleMr: 'सह्याद्री शोधक',
    badgeSymbol: '🥾',
    minBadges: 3,
    maxBadges: 5,
    themeColor: '#0284c7',
  },
  {
    level: 3,
    titleEn: 'Pune Pioneer',
    titleMr: 'पुणे पायोनिअर',
    badgeSymbol: '⚔️',
    minBadges: 6,
    maxBadges: 9,
    themeColor: '#d97706',
  },
  {
    level: 4,
    titleEn: 'Heritage Champion',
    titleMr: 'वारसा शिलेदार',
    badgeSymbol: '🏛️',
    minBadges: 10,
    maxBadges: 14,
    themeColor: '#7c3aed',
  },
  {
    level: 5,
    titleEn: 'Grandmaster Punekar',
    titleMr: 'मानाचा पहिला पुणेकर सम्राट',
    badgeSymbol: '👑',
    minBadges: 15,
    maxBadges: 999,
    themeColor: '#e11d48',
  },
];

/**
 * List of recognized lesser-known / hidden gems in Pune.
 */
export const KNOWN_HIDDEN_GEMS = new Set([
  'pataleshwar-cave-temple',
  'trishund-ganpati-temple',
  'bedse-caves',
  'shinde-chhatri',
  'malhargad-fort',
  'bhaja-caves',
  'gram-sanskruti-udyan',
  'karla-caves',
  'lenyadri-caves-ganpati',
  'banneshwar-temple-nasrapur',
  'plus-valley',
]);

/**
 * Recognizes if a place qualifies as a historical destination (forts, heritage, caves, museums).
 */
function isHistoricalPlace(p: StructuredPlace): boolean {
  const cat = (p.category_slug || p.category || '').toLowerCase();
  const slug = (p.slug || p.id || '').toLowerCase();
  return (
    cat === 'forts' ||
    cat === 'heritage' ||
    cat === 'museums' ||
    slug.includes('cave') ||
    slug.includes('wada') ||
    slug.includes('palace') ||
    slug.includes('memorial')
  );
}

/**
 * Recognizes if a place involves an authentic trek or hill climb.
 */
function isTrekPlace(p: StructuredPlace): boolean {
  const cat = (p.category_slug || p.category || '').toLowerCase();
  const slug = (p.slug || p.id || '').toLowerCase();
  const name = (p.name || '').toLowerCase();

  return (
    cat === 'forts' ||
    slug.includes('fort') ||
    slug.includes('tekdi') ||
    slug.includes('ghat') ||
    slug.includes('caves') ||
    name.includes('fort') ||
    name.includes('tekdi') ||
    name.includes('trek')
  );
}

/**
 * Extract broad Pune geographic regions / talukas from address.
 */
function extractRegion(p: StructuredPlace): string {
  const addr = (p.address || '').toLowerCase();
  if (addr.includes('velhe') || addr.includes('gunjavane')) return 'Velhe';
  if (addr.includes('mulshi') || addr.includes('tamhini') || addr.includes('paud')) return 'Mulshi';
  if (addr.includes('junnar') || addr.includes('lenyadri') || addr.includes('ozar')) return 'Junnar';
  if (addr.includes('maval') || addr.includes('lonavala') || addr.includes('khandala') || addr.includes('kamshet')) return 'Maval';
  if (addr.includes('haveli') || addr.includes('sinhagad') || addr.includes('khadakwasla')) return 'Haveli';
  if (addr.includes('purandar') || addr.includes('jejuri') || addr.includes('saswad')) return 'Purandar';
  if (addr.includes('khed') || addr.includes('bhimashankar') || addr.includes('rajgurunagar')) return 'Khed';
  if (addr.includes('pimpri') || addr.includes('chinchwad') || addr.includes('nigdi')) return 'PCMC';
  if (addr.includes('daund') || addr.includes('baramati') || addr.includes('shirur')) return 'Outer Pune';
  return 'Pune Urban / Core City';
}

/**
 * Master Achievement Definitions Catalog.
 * All criteria thresholds are cleanly configurable here.
 */
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // ==========================================
  // 1. GETTING STARTED
  // ==========================================
  {
    id: 'first-footstep',
    category: 'getting_started',
    categoryLabelEn: 'Getting Started',
    categoryLabelMr: 'सुरुवात',
    nameEn: 'First Footstep',
    nameMr: 'पहिलं पाऊल',
    descEn: 'Take your first step into Pune’s living heritage by visiting 1 destination.',
    descMr: 'पुण्याच्या समृद्ध वारशात तुमचं पहिलं पाऊल! कोणत्याही एका ऐतिहासिक किंवा निसर्गरम्य स्थळाला भेट द्या.',
    rarity: 'common',
    target: 1,
    unitEn: 'destination',
    unitMr: 'ठिकाण',
    medalDesign: {
      metal: 'bronze',
      accentColor: '#c2410c',
      glowColor: 'rgba(194, 65, 12, 0.4)',
      ribbonColor: '#9a3412',
      symbol: 'footstep',
    },
    actionLink: '/places/shaniwar-wada',
    actionTextEn: 'Explore Shaniwar Wada',
    actionTextMr: 'शनिवार वाडा पहा',
    shareCaption: (name, count) =>
      `I just took my First Footstep on Explore Pune! 🚶‍♂️ Checked in at my first landmark across this historic city. Explore Pune with me: https://explorepune-guide.vercel.app/milestones #ExplorePune #FirstFootstep #PuneHeritage`,
    evaluate: (ctx) => ({
      current: ctx.distinctPlaceIds.size,
      isUnlocked: ctx.distinctPlaceIds.size >= 1,
    }),
  },
  {
    id: 'pune-explorer',
    category: 'getting_started',
    categoryLabelEn: 'Getting Started',
    categoryLabelMr: 'सुरुवात',
    nameEn: 'Pune Explorer',
    nameMr: 'पुणे भ्रमंतीवीर',
    descEn: 'Venture beyond the familiar by exploring 5 distinct destinations.',
    descMr: 'पुण्यातील ५ वैविध्यपूर्ण ऐतिहासिक व पर्यटन स्थळांना भेट देऊन अस्सल भ्रमंतीचा शुभारंभ करा.',
    rarity: 'rare',
    target: 5,
    unitEn: 'destinations',
    unitMr: 'ठिकाणे',
    medalDesign: {
      metal: 'silver',
      accentColor: '#0284c7',
      glowColor: 'rgba(2, 132, 199, 0.4)',
      ribbonColor: '#0369a1',
      symbol: 'compass',
    },
    actionLink: '/destinations',
    actionTextEn: 'Browse Destinations',
    actionTextMr: 'सर्व ठिकाणे पहा',
    shareCaption: (name, count) =>
      `I just unlocked the Pune Explorer medal on Explore Pune! 🧭 Explored 5 distinct spots across the cultural capital. Check out the guide: https://explorepune-guide.vercel.app/milestones #ExplorePune #PuneExplorer`,
    evaluate: (ctx) => ({
      current: ctx.distinctPlaceIds.size,
      isUnlocked: ctx.distinctPlaceIds.size >= 5,
    }),
  },
  {
    id: 'local-adventurer',
    category: 'getting_started',
    categoryLabelEn: 'Getting Started',
    categoryLabelMr: 'सुरुवात',
    nameEn: 'Local Adventurer',
    nameMr: 'स्थानिक साहसी',
    descEn: 'Master the city trails by checking in at 10 distinct Pune destinations.',
    descMr: 'पुण्याच्या विविध कोपऱ्यांतील १० वेगवेगळ्या प्रेक्षणीय स्थळांचा शोध घेऊन साहसी पदक मिळवा.',
    rarity: 'rare',
    target: 10,
    unitEn: 'destinations',
    unitMr: 'ठिकाणे',
    medalDesign: {
      metal: 'silver',
      accentColor: '#2563eb',
      glowColor: 'rgba(37, 99, 235, 0.4)',
      ribbonColor: '#1d4ed8',
      symbol: 'map',
    },
    actionLink: '/destinations/nature',
    actionTextEn: 'Discover Nature Spots',
    actionTextMr: 'निसर्गरम्य स्थळे',
    shareCaption: (name, count) =>
      `Proud to unlock the Local Adventurer badge on Explore Pune! 🗺️ Reached 10 incredible destinations across the Sahyadri. Join the journey: https://explorepune-guide.vercel.app/milestones #ExplorePune #LocalAdventurer`,
    evaluate: (ctx) => ({
      current: ctx.distinctPlaceIds.size,
      isUnlocked: ctx.distinctPlaceIds.size >= 10,
    }),
  },
  {
    id: 'pune-legend',
    category: 'getting_started',
    categoryLabelEn: 'Getting Started',
    categoryLabelMr: 'सुरुवात',
    nameEn: 'Pune Legend',
    nameMr: 'पुणे लेजंड',
    descEn: 'Achieve legendary status by conquering 25 destinations across Pune district.',
    descMr: 'पुणे जिल्ह्यातील तब्बल २५ विख्यात पर्यटन स्थळे सर करून पुणे लेजंड सन्मान प्राप्त करा.',
    rarity: 'epic',
    target: 25,
    unitEn: 'destinations',
    unitMr: 'ठिकाणे',
    medalDesign: {
      metal: 'gold',
      accentColor: '#d97706',
      glowColor: 'rgba(217, 119, 6, 0.45)',
      ribbonColor: '#b45309',
      symbol: 'crown',
    },
    actionLink: '/destinations',
    actionTextEn: 'Discover More Spots',
    actionTextMr: 'नवीन ठिकाणे शोधा',
    shareCaption: (name, count) =>
      `Monumental milestone! 🌟 I just unlocked the Pune Legend achievement on Explore Pune after exploring 25 destinations! #ExplorePune #PuneLegend #Sahyadri`,
    evaluate: (ctx) => ({
      current: ctx.distinctPlaceIds.size,
      isUnlocked: ctx.distinctPlaceIds.size >= 25,
    }),
  },
  {
    id: 'ultimate-punekar',
    category: 'getting_started',
    categoryLabelEn: 'Getting Started',
    categoryLabelMr: 'सुरुवात',
    nameEn: 'Ultimate Punekar',
    nameMr: 'सर्वोच्च पुणेकर सम्राट',
    descEn: 'The supreme crown of exploration! Visit 50 verified destinations across the district.',
    descMr: 'पुणे भ्रमंतीचा सर्वोच्च मुकुट! संपूर्ण जिल्ह्यातील ५० अधिकृत स्थळांना यशस्वी भेट देऊन इतिहास रचा.',
    rarity: 'legendary',
    target: 50,
    unitEn: 'destinations',
    unitMr: 'ठिकाणे',
    medalDesign: {
      metal: 'platinum',
      accentColor: '#e11d48',
      glowColor: 'rgba(225, 29, 72, 0.5)',
      ribbonColor: '#be123c',
      symbol: 'crown',
    },
    actionLink: '/destinations',
    actionTextEn: 'View All 106+ Places',
    actionTextMr: 'सर्व १०६+ ठिकाणे पहा',
    shareCaption: (name, count) =>
      `👑 Hail the Ultimate Punekar! I have visited 50 magnificent destinations on Explore Pune. Unlocked the rarest travel medal: https://explorepune-guide.vercel.app/milestones #ExplorePune #UltimatePunekar`,
    evaluate: (ctx) => ({
      current: ctx.distinctPlaceIds.size,
      isUnlocked: ctx.distinctPlaceIds.size >= 50,
    }),
  },

  // ==========================================
  // 2. FORT EXPLORER
  // ==========================================
  {
    id: 'fort-beginner',
    category: 'fort_explorer',
    categoryLabelEn: 'Fort Explorer',
    categoryLabelMr: 'गडकोट शिलेदार',
    nameEn: 'Fort Beginner',
    nameMr: 'गडकोट प्रारंभ',
    descEn: 'Scale the bastions of history! Visit 3 magnificent Sahyadri forts.',
    descMr: 'छत्रपती शिवरायांच्या पदस्पर्शाने पावन झालेले सह्याद्रीचे ३ अभेद्य किल्ले सर करा.',
    rarity: 'common',
    target: 3,
    unitEn: 'forts',
    unitMr: 'किल्ले',
    medalDesign: {
      metal: 'bronze',
      accentColor: '#ea580c',
      glowColor: 'rgba(234, 88, 12, 0.4)',
      ribbonColor: '#c2410c',
      symbol: 'fortress',
    },
    actionLink: '/destinations/forts',
    actionTextEn: 'Explore Sahyadri Forts',
    actionTextMr: 'सह्याद्री गडकोट पहा',
    shareCaption: (name, count) =>
      `Stepped onto the mountain citadels! 🏰 Unlocked the Fort Beginner medal on Explore Pune by scaling 3 Sahyadri forts. #ExplorePune #SahyadriForts #MaharashtraTrek`,
    evaluate: (ctx) => ({
      current: ctx.visitedFortCount,
      isUnlocked: ctx.visitedFortCount >= 3,
    }),
  },
  {
    id: 'fort-conqueror',
    category: 'fort_explorer',
    categoryLabelEn: 'Fort Explorer',
    categoryLabelMr: 'गडकोट शिलेदार',
    nameEn: 'Fort Conqueror',
    nameMr: 'दुर्ग विजेता',
    descEn: 'Climb 5 historic fortresses across the rugged Sahyadri mountain ranges.',
    descMr: 'सिंहगड, राजगड, तोरणा अशा ५ पराक्रमी दुर्ग-शिखरांवर चढाई करून दुर्ग विजेता बना.',
    rarity: 'rare',
    target: 5,
    unitEn: 'forts',
    unitMr: 'किल्ले',
    medalDesign: {
      metal: 'silver',
      accentColor: '#f97316',
      glowColor: 'rgba(249, 115, 22, 0.4)',
      ribbonColor: '#ea580c',
      symbol: 'crossed_swords',
    },
    actionLink: '/places/rajgad-fort',
    actionTextEn: 'Scale Rajgad Fort',
    actionTextMr: 'राजगड किल्ला चढा',
    shareCaption: (name, count) =>
      `I just unlocked the Fort Conqueror badge on Explore Pune! 🏰 I've explored 5 incredible forts around Pune. More adventures await! #ExplorePune #PuneExplorer #TravelAchievements`,
    evaluate: (ctx) => ({
      current: ctx.visitedFortCount,
      isUnlocked: ctx.visitedFortCount >= 5,
    }),
  },
  {
    id: 'fort-master',
    category: 'fort_explorer',
    categoryLabelEn: 'Fort Explorer',
    categoryLabelMr: 'गडकोट शिलेदार',
    nameEn: 'Fort Master',
    nameMr: 'दुर्गपती सम्राट',
    descEn: 'The pinnacle of mountain fortitude! Conquer 10 fortified battlegrounds of the Maratha Empire.',
    descMr: '१० ऐतिहासिक दुर्गकोट सर करून सह्याद्रीच्या दुर्गपती पदाचा बहुमान मिळवा.',
    rarity: 'epic',
    target: 10,
    unitEn: 'forts',
    unitMr: 'किल्ले',
    medalDesign: {
      metal: 'gold',
      accentColor: '#eab308',
      glowColor: 'rgba(234, 179, 8, 0.45)',
      ribbonColor: '#ca8a04',
      symbol: 'rampart',
    },
    actionLink: '/destinations/forts',
    actionTextEn: 'Conquer More Forts',
    actionTextMr: 'आणखी किल्ले शोधा',
    shareCaption: (name, count) =>
      `⚔️ Unlocked the prestigious Fort Master medal on Explore Pune! 10 Sahyadri fortresses conquered. Jai Shivrai! #ExplorePune #FortMaster #Sahyadri`,
    evaluate: (ctx) => ({
      current: ctx.visitedFortCount,
      isUnlocked: ctx.visitedFortCount >= 10,
    }),
  },

  // ==========================================
  // 3. HERITAGE & CULTURE
  // ==========================================
  {
    id: 'temple-trail',
    category: 'heritage_culture',
    categoryLabelEn: 'Heritage & Culture',
    categoryLabelMr: 'वारसा व संस्कृती',
    nameEn: 'Temple Trail',
    nameMr: 'तीर्थक्षेत्र परिक्रमा',
    descEn: 'Seek blessings and marvel at sacred architecture across 5 historic temples.',
    descMr: 'दगडूशेठ, पाताळेश्वर, आळंदी, जेजुरी अशा ५ पावन देवस्थानांचे दर्शन घेऊन पुण्य परिक्रमा पूर्ण करा.',
    rarity: 'rare',
    target: 5,
    unitEn: 'temples',
    unitMr: 'मंदिरे',
    medalDesign: {
      metal: 'silver',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      ribbonColor: '#d97706',
      symbol: 'temple',
    },
    actionLink: '/destinations/temples',
    actionTextEn: 'View Sacred Temples',
    actionTextMr: 'पवित्र मंदिरे पहा',
    shareCaption: (name, count) =>
      `🛕 Unlocked the Temple Trail achievement on Explore Pune! Completed darshan at 5 sacred heritage shrines. #ExplorePune #TempleTrail #PuneSpirituality`,
    evaluate: (ctx) => ({
      current: ctx.visitedTempleCount,
      isUnlocked: ctx.visitedTempleCount >= 5,
    }),
  },
  {
    id: 'heritage-guardian',
    category: 'heritage_culture',
    categoryLabelEn: 'Heritage & Culture',
    categoryLabelMr: 'वारसा व संस्कृती',
    nameEn: 'Heritage Guardian',
    nameMr: 'वारसा रक्षक',
    descEn: 'Walk the imperial paths of the Peshwas! Visit 10 historic heritage sites and wadas.',
    descMr: 'शनिवार वाडा, विश्रामबाग वाडा, आगाखान पॅलेस अशा १० ऐतिहासिक वास्तू व दालनांना भेट द्या.',
    rarity: 'epic',
    target: 10,
    unitEn: 'heritage sites',
    unitMr: 'वारसा स्थळे',
    medalDesign: {
      metal: 'gold',
      accentColor: '#b45309',
      glowColor: 'rgba(180, 83, 9, 0.45)',
      ribbonColor: '#92400e',
      symbol: 'wada',
    },
    actionLink: '/destinations/heritage',
    actionTextEn: 'Explore Heritage Sites',
    actionTextMr: 'ऐतिहासिक वास्तू पहा',
    shareCaption: (name, count) =>
      `🏛️ Proud to be a certified Heritage Guardian on Explore Pune! Explored 10 magnificent historical monuments and royal mansions. #ExplorePune #HeritageGuardian`,
    evaluate: (ctx) => ({
      current: ctx.visitedHeritageCount,
      isUnlocked: ctx.visitedHeritageCount >= 10,
    }),
  },
  {
    id: 'history-hunter',
    category: 'heritage_culture',
    categoryLabelEn: 'Heritage & Culture',
    categoryLabelMr: 'वारसा व संस्कृती',
    nameEn: 'History Hunter',
    nameMr: 'इतिहास संशोधक',
    descEn: 'Immerse deep into living history! Visit 15 historical destinations across forts, palaces & museums.',
    descMr: 'किल्ले, वाडे, संग्रहालये व प्राचीन लेण्या अशा १५ ऐतिहासिक दालनांची मुशाफिरी करून इतिहास संशोधक सन्मान मिळवा.',
    rarity: 'legendary',
    target: 15,
    unitEn: 'historical destinations',
    unitMr: 'इतिहास स्थळे',
    medalDesign: {
      metal: 'platinum',
      accentColor: '#854d0e',
      glowColor: 'rgba(133, 77, 14, 0.5)',
      ribbonColor: '#713f12',
      symbol: 'scroll',
    },
    actionLink: '/destinations/museums',
    actionTextEn: 'Discover Pune Museums',
    actionTextMr: 'पुण्यातील संग्रहालये',
    shareCaption: (name, count) =>
      `📜 History Hunter unlocked! 15 historical monuments and archaeological wonders verified on Explore Pune. Living history unveiled! #ExplorePune #HistoryHunter`,
    evaluate: (ctx) => ({
      current: ctx.visitedHistoryCount,
      isUnlocked: ctx.visitedHistoryCount >= 15,
    }),
  },

  // ==========================================
  // 4. ADVENTURE
  // ==========================================
  {
    id: 'trek-beginner',
    category: 'adventure',
    categoryLabelEn: 'Adventure',
    categoryLabelMr: 'साहस व निसर्ग',
    nameEn: 'Trek Beginner',
    nameMr: 'ट्रेक प्रारंभ',
    descEn: 'Lace up your hiking boots! Complete your first verified mountain trek in Pune.',
    descMr: 'वेताळ टेकडी, तळजाई अथवा सिंहगड अशा कोणत्याही एका निसर्गरम्य ट्रेकवर शिखर गाठा.',
    rarity: 'common',
    target: 1,
    unitEn: 'verified trek',
    unitMr: 'ट्रेक',
    medalDesign: {
      metal: 'bronze',
      accentColor: '#16a34a',
      glowColor: 'rgba(22, 163, 74, 0.4)',
      ribbonColor: '#15803d',
      symbol: 'boot',
    },
    actionLink: '/places/vetal-tekdi',
    actionTextEn: 'Trek Vetal Tekdi',
    actionTextMr: 'वेताळ टेकडी ट्रेक',
    shareCaption: (name, count) =>
      `Laced up and summited! 🥾 Unlocked the Trek Beginner badge on Explore Pune. The Sahyadri trail begins! #ExplorePune #SahyadriTrek #PuneTrekkers`,
    evaluate: (ctx) => ({
      current: ctx.verifiedTrekCount,
      isUnlocked: ctx.verifiedTrekCount >= 1,
    }),
  },
  {
    id: 'trek-master',
    category: 'adventure',
    categoryLabelEn: 'Adventure',
    categoryLabelMr: 'साहस व निसर्ग',
    nameEn: 'Trek Master',
    nameMr: 'ट्रेक मास्टर',
    descEn: 'Master the steep ascents! Complete 5 authenticated mountain treks and hill trails.',
    descMr: 'सह्याद्रीच्या ५ आव्हानात्मक ट्रेक मार्गांवर पायपीट करून निसर्गावर अधिराज्य गाजवा.',
    rarity: 'epic',
    target: 5,
    unitEn: 'verified treks',
    unitMr: 'ट्रेक मार्ग',
    medalDesign: {
      metal: 'gold',
      accentColor: '#059669',
      glowColor: 'rgba(5, 150, 105, 0.45)',
      ribbonColor: '#047857',
      symbol: 'mountain',
    },
    actionLink: '/destinations/nature',
    actionTextEn: 'Explore Mountain Trails',
    actionTextMr: 'ट्रेक वाटा शोधा',
    shareCaption: (name, count) =>
      `🏔️ Conqueror of the Sahyadri trails! Unlocked the Trek Master medal on Explore Pune with 5 mountain summits completed. #ExplorePune #TrekMaster #Sahyadri`,
    evaluate: (ctx) => ({
      current: ctx.verifiedTrekCount,
      isUnlocked: ctx.verifiedTrekCount >= 5,
    }),
  },
  {
    id: 'hidden-gem-finder',
    category: 'adventure',
    categoryLabelEn: 'Adventure',
    categoryLabelMr: 'साहस व निसर्ग',
    nameEn: 'Hidden Gem Finder',
    nameMr: 'गूढ वारसा शोधक',
    descEn: 'Venture off the beaten track! Discover 5 lesser-known caves, secluded shrines & secret trails.',
    descMr: 'त्रिशुंड गणपती, पाताळेश्वर, बेडसे लेणी यांसारखी ५ दुर्लक्षित पण थक्क करणारी अप्रसिद्ध ठिकाणे शोधा.',
    rarity: 'rare',
    target: 5,
    unitEn: 'hidden gems',
    unitMr: 'गूढ ठिकाणे',
    medalDesign: {
      metal: 'silver',
      accentColor: '#9333ea',
      glowColor: 'rgba(147, 51, 234, 0.4)',
      ribbonColor: '#7e22ce',
      symbol: 'gem',
    },
    actionLink: '/places/pataleshwar-cave-temple',
    actionTextEn: 'Find Pataleshwar Caves',
    actionTextMr: 'पाताळेश्वर लेणी पहा',
    shareCaption: (name, count) =>
      `💎 Unlocked the Hidden Gem Finder achievement on Explore Pune! Discovered 5 secret offbeat treasures around Pune. #ExplorePune #HiddenGems #PuneOffbeat`,
    evaluate: (ctx) => ({
      current: ctx.hiddenGemCount,
      isUnlocked: ctx.hiddenGemCount >= 5,
    }),
  },

  // ==========================================
  // 5. SPECIAL CHALLENGES
  // ==========================================
  {
    id: 'weekend-wanderer',
    category: 'special_challenges',
    categoryLabelEn: 'Special Challenges',
    categoryLabelMr: 'विशेष आव्हाने',
    nameEn: 'Weekend Wanderer',
    nameMr: 'वीकेंड भटका',
    descEn: 'Ditch the couch and embrace the wild! Explore Pune on 4 different calendar weekends.',
    descMr: 'शनिवार-रविवारच्या सुट्ट्यांमध्ये निसर्गाचा आनंद घ्या! ४ वेगवेगळ्या वीकेंड्सना फिरंती नोंदवा.',
    rarity: 'rare',
    target: 4,
    unitEn: 'weekends',
    unitMr: 'वीकेंड्स',
    medalDesign: {
      metal: 'silver',
      accentColor: '#0ea5e9',
      glowColor: 'rgba(14, 165, 233, 0.4)',
      ribbonColor: '#0284c7',
      symbol: 'calendar',
    },
    actionLink: '/planner',
    actionTextEn: 'Plan Next Weekend Trip',
    actionTextMr: 'वीकेंड ट्रिप प्लॅन करा',
    shareCaption: (name, count) =>
      `Every weekend is an adventure! 📅 Unlocked the Weekend Wanderer medal on Explore Pune across 4 active weekends. #ExplorePune #WeekendWanderer`,
    evaluate: (ctx) => ({
      current: ctx.distinctWeekendCount,
      isUnlocked: ctx.distinctWeekendCount >= 4,
    }),
  },
  {
    id: 'district-discoverer',
    category: 'special_challenges',
    categoryLabelEn: 'Special Challenges',
    categoryLabelMr: 'विशेष आव्हाने',
    nameEn: 'District Discoverer',
    nameMr: 'जिल्हा भ्रमंती सम्राट',
    descEn: 'Cover the length and breadth of Pune district! Visit spots across 4 distinct tehsils/regions.',
    descMr: 'हवेली, वेल्हे, मुळशी, जुन्नर अथवा मावळ अशा ४ वेगवेगळ्या तालुक्यांतील स्थळांना भेट देऊन जिल्हा परिक्रमा करा.',
    rarity: 'epic',
    target: 4,
    unitEn: 'regions / tehsils',
    unitMr: 'तालुके / भाग',
    medalDesign: {
      metal: 'gold',
      accentColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      ribbonColor: '#059669',
      symbol: 'globe',
    },
    actionLink: '/destinations',
    actionTextEn: 'Explore All Talukas',
    actionTextMr: 'सर्व तालुके पहा',
    shareCaption: (name, count) =>
      `🌍 District Discoverer unlocked! Journeyed across 4 distinct regions of Pune District on Explore Pune. #ExplorePune #DistrictDiscoverer`,
    evaluate: (ctx) => ({
      current: ctx.distinctDistrictsCount,
      isUnlocked: ctx.distinctDistrictsCount >= 4,
    }),
  },
  {
    id: 'memory-collector',
    category: 'special_challenges',
    categoryLabelEn: 'Special Challenges',
    categoryLabelMr: 'विशेष आव्हाने',
    nameEn: 'Memory Collector',
    nameMr: 'स्मृती संग्रहक',
    descEn: 'Capture the soul of your expeditions! Attach travel memories and photos to 10 visited destinations.',
    descMr: 'तुमच्या प्रवासाचे छायाचित्र व अनुभव जोडून १० स्थळांचा वैयक्तिक आठवणींचा संग्रह तयार करा.',
    rarity: 'epic',
    target: 10,
    unitEn: 'destination memories',
    unitMr: 'स्मृती नोंदी',
    medalDesign: {
      metal: 'gold',
      accentColor: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.45)',
      ribbonColor: '#db2777',
      symbol: 'camera',
    },
    actionLink: '/journey',
    actionTextEn: 'View My Journey Memories',
    actionTextMr: 'माझे प्रवास अनुभव',
    shareCaption: (name, count) =>
      `📸 Memory Collector unlocked! Captured authentic photo chronicles and stories at 10 Pune destinations on Explore Pune. #ExplorePune #TravelMemories`,
    evaluate: (ctx) => ({
      current: ctx.memoriesWithPhotosCount,
      isUnlocked: ctx.memoriesWithPhotosCount >= 10,
    }),
  },
];

/**
 * Builds the full evaluation context from raw user records.
 * Ensures strict deduplication so visiting the same place twice never inflates count.
 */
export function buildEvaluationContext(
  visits: any[],
  blogsCount = 0,
  placesPool?: StructuredPlace[]
): AchievementEvaluationContext {
  const dataset = placesPool && placesPool.length > 0 ? placesPool : ALL_STRUCTURED_PLACES;
  const placesMap = new Map<string, StructuredPlace>();
  dataset.forEach((p) => {
    placesMap.set(p.id, p);
    if (p.slug) placesMap.set(p.slug, p);
  });

  const distinctPlaceIds = new Set<string>();
  const visitedPlaces: StructuredPlace[] = [];
  const weekendKeys = new Set<string>();
  const regionsSet = new Set<string>();
  let memoriesWithPhotosCount = 0;

  for (const v of visits) {
    const rawId = v.place_id || v.place_slug;
    if (!rawId) continue;

    // Distinct place resolution
    const place = placesMap.get(rawId) || placesMap.get(v.place_slug || '');
    const canonicalId = place ? place.id : rawId;

    if (!distinctPlaceIds.has(canonicalId)) {
      distinctPlaceIds.add(canonicalId);
      if (place) {
        visitedPlaces.push(place);
        regionsSet.add(extractRegion(place));
      } else {
        visitedPlaces.push({
          id: canonicalId,
          slug: canonicalId,
          name: v.place_name || canonicalId,
          category: 'nature',
          latitude: 18.52,
          longitude: 73.85,
        });
      }
    }

    // Memories with photo proof
    if (v.image_url && v.image_url.length > 10) {
      memoriesWithPhotosCount += 1;
    }

    // Weekend evaluation
    if (v.visited_at) {
      const d = new Date(v.visited_at);
      if (!isNaN(d.getTime())) {
        const day = d.getDay(); // 0 is Sunday, 6 is Saturday
        if (day === 0 || day === 6) {
          // Compute a unique key for this weekend (e.g. Year-WeekNumber)
          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const weekNo = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
          weekendKeys.add(`${d.getFullYear()}-W${weekNo}`);
        }
      }
    }
  }

  // Count by categories across distinct visited places
  let visitedFortCount = 0;
  let visitedTempleCount = 0;
  let visitedHeritageCount = 0;
  let visitedHistoryCount = 0;
  let verifiedTrekCount = 0;
  let hiddenGemCount = 0;

  for (const p of visitedPlaces) {
    const cat = (p.category_slug || p.category || '').toLowerCase();
    const slug = (p.slug || p.id || '').toLowerCase();

    if (cat === 'forts' || slug.includes('fort') || (p.name && p.name.toLowerCase().includes('fort'))) {
      visitedFortCount += 1;
    }

    if (cat === 'temples' || slug.includes('temple') || slug.includes('mandir') || slug.includes('ganpati')) {
      visitedTempleCount += 1;
    }

    if (cat === 'heritage' || cat === 'museums' || slug.includes('wada') || slug.includes('palace')) {
      visitedHeritageCount += 1;
    }

    if (isHistoricalPlace(p)) {
      visitedHistoryCount += 1;
    }

    if (isTrekPlace(p)) {
      verifiedTrekCount += 1;
    }

    if (KNOWN_HIDDEN_GEMS.has(slug) || KNOWN_HIDDEN_GEMS.has(p.id)) {
      hiddenGemCount += 1;
    }
  }

  return {
    distinctPlaceIds,
    visitedPlaces,
    rawVisits: visits,
    blogsCount,
    visitedFortCount,
    visitedTempleCount,
    visitedHeritageCount,
    visitedHistoryCount,
    verifiedTrekCount,
    hiddenGemCount,
    distinctWeekendCount: weekendKeys.size,
    distinctDistrictsCount: regionsSet.size,
    memoriesWithPhotosCount,
  };
}

/**
 * Evaluates all achievements and returns progress states.
 */
export function evaluateUserAchievements(
  visits: any[],
  blogsCount = 0,
  placesPool?: StructuredPlace[],
  favoriteBadgeIds: string[] = []
): UserAchievementState[] {
  const ctx = buildEvaluationContext(visits, blogsCount, placesPool);
  const favSet = new Set(favoriteBadgeIds);

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const { current, isUnlocked } = def.evaluate(ctx);
    const cappedCurrent = Math.min(current, def.target);
    const percentage = Math.min(100, Math.round((cappedCurrent / def.target) * 100));

    const remaining = Math.max(0, def.target - current);
    const nextStepHintEn = isUnlocked
      ? 'Achievement Unlocked & Verified!'
      : `Visit ${remaining} more ${def.unitEn} to unlock this medal.`;
    const nextStepHintMr = isUnlocked
      ? 'यशोगाथा पदक प्राप्त झाले!'
      : `हे पदक अनलॉक करण्यासाठी आणखी ${remaining} ${def.unitMr} भेट द्या.`;

    return {
      id: def.id,
      definition: def,
      current: cappedCurrent,
      target: def.target,
      isUnlocked,
      percentage,
      unlockedAt: isUnlocked ? new Date().toISOString() : null,
      isFavorite: favSet.has(def.id),
      nextStepHintEn,
      nextStepHintMr,
    };
  });
}

/**
 * Summary stats for user achievements.
 */
export interface AchievementsSummary {
  unlockedCount: number;
  totalCount: number;
  completionPercentage: number;
  rarityCounts: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  totalRarityUnlocked: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  currentRank: ExplorerRank;
  nextRank: ExplorerRank | null;
  badgesNeededForNextRank: number;
  favoriteBadges: UserAchievementState[];
  recentlyUnlocked: UserAchievementState[];
}

export function computeAchievementsSummary(states: UserAchievementState[]): AchievementsSummary {
  const totalCount = states.length;
  const unlocked = states.filter((s) => s.isUnlocked);
  const unlockedCount = unlocked.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const rarityCounts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  const totalRarityUnlocked = { common: 0, rare: 0, epic: 0, legendary: 0 };

  states.forEach((s) => {
    rarityCounts[s.definition.rarity] += 1;
    if (s.isUnlocked) {
      totalRarityUnlocked[s.definition.rarity] += 1;
    }
  });

  // Calculate current and next rank
  let currentRank = EXPLORER_RANKS[0];
  let nextRank: ExplorerRank | null = EXPLORER_RANKS[1];

  for (let i = 0; i < EXPLORER_RANKS.length; i++) {
    const rank = EXPLORER_RANKS[i];
    if (unlockedCount >= rank.minBadges) {
      currentRank = rank;
      nextRank = i + 1 < EXPLORER_RANKS.length ? EXPLORER_RANKS[i + 1] : null;
    }
  }

  const badgesNeededForNextRank = nextRank ? Math.max(0, nextRank.minBadges - unlockedCount) : 0;

  const favoriteBadges = states.filter((s) => s.isUnlocked && s.isFavorite);

  // Recently unlocked: unlocked badges sorted by ID or unlock state
  const recentlyUnlocked = [...unlocked].reverse().slice(0, 4);

  return {
    unlockedCount,
    totalCount,
    completionPercentage,
    rarityCounts,
    totalRarityUnlocked,
    currentRank,
    nextRank,
    badgesNeededForNextRank,
    favoriteBadges,
    recentlyUnlocked,
  };
}

/**
 * Idempotent check for celebration modal.
 */
export function getCelebratedBadgeIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('explore_pune_celebrated_badges');
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markBadgeAsCelebrated(badgeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getCelebratedBadgeIds();
    set.add(badgeId);
    localStorage.setItem('explore_pune_celebrated_badges', JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Could not save celebrated badge ID:', err);
  }
}
