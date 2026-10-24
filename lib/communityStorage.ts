/**
 * Explore Pune - Unified Community Knowledge & Discussion Engine
 * Manages place-based user discussions, experiences, travel tips, questions, and recommendations.
 * Connected directly to authentic place database via unique placeId.
 */

import rawPlaces from '@/data/backup_places_pre_audit_20261023.json';
import {
  moderateCommunityContent,
  sanitizeUserText,
} from './communityModeration';
import {
  checkUserPostingAllowed,
  recordUserPost,
  checkUserCommentingAllowed,
  recordUserComment,
  getBlockedUserIds,
} from './userSafety';

export type CommunityPostType =
  | 'experience'
  | 'tip'
  | 'question'
  | 'recommendation'
  | 'photo'
  | 'update';

export type CommunitySortOption = 'latest' | 'helpful' | 'discussed' | 'trending';

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string; // ISO date
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  isVerifiedUser?: boolean;
  isExplorePuneVerified?: boolean;
  placeId: string;
  placeSlug: string;
  placeName: string;
  placeNameMr?: string;
  categorySlug: string;
  categoryName: string;
  categoryNameMr?: string;
  postType: CommunityPostType;
  title: string;
  content: string;
  images?: string[];
  helpfulCount: number;
  helpfulUserIds: string[];
  commentCount: number;
  comments: CommunityComment[];
  tags: string[];
  status: 'published' | 'review' | 'reported' | 'hidden';
  createdAt: string; // ISO date
  updatedAt: string;
}

export interface CommunityReport {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'account';
  targetId: string;
  targetTitle?: string;
  authorName?: string;
  reporterUserId: string;
  reason:
    | 'spam'
    | 'harassment'
    | 'hate'
    | 'false_info'
    | 'inappropriate'
    | 'privacy'
    | 'scam'
    | 'other';
  details?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

const STORAGE_POSTS_KEY = 'explore_pune_community_posts_v1';
const STORAGE_REPORTS_KEY = 'explore_pune_community_reports_v1';

export const POST_TYPE_META: Record<
  CommunityPostType,
  { labelEn: string; labelMr: string; icon: string; color: string; bg: string }
> = {
  experience: {
    labelEn: 'Experience',
    labelMr: 'अनुभव',
    icon: '📝',
    color: '#047857',
    bg: '#ecfdf5',
  },
  tip: {
    labelEn: 'Travel Tip',
    labelMr: 'प्रवास सल्ला',
    icon: '💡',
    color: '#b45309',
    bg: '#fef3c7',
  },
  question: {
    labelEn: 'Question',
    labelMr: 'प्रश्न',
    icon: '❓',
    color: '#0369a1',
    bg: '#e0f2fe',
  },
  recommendation: {
    labelEn: 'Recommendation',
    labelMr: 'शिफारस',
    icon: '🌟',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  photo: {
    labelEn: 'Photos',
    labelMr: 'छायाचित्रे',
    icon: '📸',
    color: '#be185d',
    bg: '#fdf2f8',
  },
  update: {
    labelEn: 'Place Update',
    labelMr: 'ताजी माहिती',
    icon: '📢',
    color: '#c2410c',
    bg: '#fff7ed',
  },
};

/**
 * Authentic Initial Community Seed Posts (Rich, practical, place-grounded)
 */
export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-sinhagad-001',
    userId: 'user-pune-local-1',
    authorName: 'Rohan Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'sinhagad-fort',
    placeSlug: 'sinhagad-fort',
    placeName: 'Sinhagad Fort',
    placeNameMr: 'सिंहगड किल्ला',
    categorySlug: 'forts',
    categoryName: 'Forts & Sahyadri Trails',
    categoryNameMr: 'किल्ले व सह्याद्री ट्रेक',
    postType: 'tip',
    title: 'Sinhagad Parking & Weekend Early Morning Advice',
    content:
      'If you are driving to Sinhagad Fort on weekends, please reach the Donje toll point before 6:30 AM! The ghat road fills up quickly and Forest Department restricts vehicle ascent at the top parking lot once full. Trekking from Donje base takes around 1.5 to 2 hours and is well-shaded in the morning. Do try the authentic hot Pithla Bhakri and Matka Dahi at the top near Tanaji Malusare memorial.',
    images: ['/images/places/sinhagad-fort.jpg'],
    helpfulCount: 48,
    helpfulUserIds: ['user-sample-1', 'user-sample-2'],
    commentCount: 3,
    comments: [
      {
        id: 'c-sin-1',
        postId: 'post-sinhagad-001',
        userId: 'user-trekker-9',
        authorName: 'Priya Kulkarni',
        content: 'Totally agree on reaching before 6:30 AM. We reached at 8 AM last Sunday and had to wait 45 mins at the forest checkpoint.',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'c-sin-2',
        postId: 'post-sinhagad-001',
        userId: 'user-amit-4',
        authorName: 'Amit Joshi',
        content: 'Is UPI accepted for the ₹50 forest entry toll and parking at the top?',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'c-sin-3',
        postId: 'post-sinhagad-001',
        userId: 'user-pune-local-1',
        authorName: 'Rohan Deshmukh',
        content: 'Yes Amit! QR code UPI is accepted at both the Donje toll booth and most food stalls at the top.',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
    tags: ['Sinhagad', 'Parking', 'Trek', 'PithlaBhakri', 'Monsoon'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(), // ~1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'post-shaniwar-002',
    userId: 'user-history-buff',
    authorName: 'Aditi Joshi',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'shaniwar-wada',
    placeSlug: 'shaniwar-wada',
    placeName: 'Shaniwar Wada',
    placeNameMr: 'शनिवार वाडा',
    categorySlug: 'heritage',
    categoryName: 'Heritage & Wadas',
    categoryNameMr: 'ऐतिहासिक वाडे',
    postType: 'experience',
    title: 'A Walk Through Peshwa Grandeur & Audio Guide Insights',
    content:
      'Visited Shaniwar Wada on a pleasant weekday morning. Entering through the massive Dilli Darwaza with its iron anti-elephant spikes really gives goosebumps! Take the time to walk around the foundations of the 7-storied palace and the Hazari Karanje (thousand-jet fountain). The gardens are well-maintained by ASI. Entry is ₹25 per person and you can book tickets online via ASI or at the QR counter near the gate.',
    images: ['/images/places/shaniwar-wada.jpg'],
    helpfulCount: 39,
    helpfulUserIds: ['user-sample-1'],
    commentCount: 2,
    comments: [
      {
        id: 'c-sw-1',
        postId: 'post-shaniwar-002',
        userId: 'user-traveler-x',
        authorName: 'Vikram Shinde',
        content: 'Where is the best place to park nearby? Bajirao road is usually packed.',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
      {
        id: 'c-sw-2',
        postId: 'post-shaniwar-002',
        userId: 'user-history-buff',
        authorName: 'Aditi Joshi',
        content: 'There is PMC Pay & Park opposite the riverbed road (Shaniwar Peth ghats), about 3 minutes walk from Delhi Darwaza.',
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
    ],
    tags: ['ShaniwarWada', 'Peshwa', 'History', 'ASI', 'Heritage'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'post-aga-khan-003',
    userId: 'user-nikhil-s',
    authorName: 'Nikhil Salunke',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: false,
    isExplorePuneVerified: true,
    placeId: 'aga-khan-palace',
    placeSlug: 'aga-khan-palace',
    placeName: 'Aga Khan Palace',
    placeNameMr: 'आगाखान पॅलेस',
    categorySlug: 'heritage',
    categoryName: 'Heritage & Wadas',
    categoryNameMr: 'ऐतिहासिक वाडे',
    postType: 'experience',
    title: 'Serene Gardens & Deep Freedom Struggle Reflection',
    content:
      'Aga Khan Palace in Kalyani Nagar is one of the most peaceful places in the city. The Italian arches and Italian marble floors are majestic, while the memorials dedicated to Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai evoke deep reverence. Beautiful Italian architecture surrounded by lush green lawns. Highly recommended for families and history lovers.',
    images: ['/images/places/aga-khan-palace.jpg'],
    helpfulCount: 31,
    helpfulUserIds: [],
    commentCount: 2,
    comments: [
      {
        id: 'c-ak-1',
        postId: 'post-aga-khan-003',
        userId: 'user-heritage-11',
        authorName: 'Sanjay Thorat',
        content: 'Is photography allowed inside the museum rooms?',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'c-ak-2',
        postId: 'post-aga-khan-003',
        userId: 'user-nikhil-s',
        authorName: 'Nikhil Salunke',
        content: 'Mobile phone photography is permitted in the gardens, but flash photography inside the memorial rooms is restricted.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    tags: ['AgaKhanPalace', 'GandhiMemorial', 'KalyaniNagar', 'Peaceful'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'post-dagdusheth-004',
    userId: 'user-devotee-7',
    authorName: 'Tanvi Gokhale',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'shreemant-dagdusheth-halwai-ganpati',
    placeSlug: 'shreemant-dagdusheth-halwai-ganpati',
    placeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    placeNameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती मंदिर',
    categorySlug: 'temples',
    categoryName: 'Temples & Sacred Sites',
    categoryNameMr: 'प्रसिद्ध मंदिरे व देवस्थान',
    postType: 'tip',
    title: 'Best Time for Quick Darshan & Metro Access',
    content:
      'For peaceful darshan at Dagdusheth Ganpati without 1-hour queues, visit either early morning between 6:00 AM - 7:30 AM or mid-afternoon around 2:00 PM - 3:30 PM. The newly opened Pune Metro Purple Line (Budhwar Peth / Mandai station) is just 300 meters away, making travel hassle-free without parking stress!',
    images: ['/images/places/shreemant-dagdusheth-halwai-ganpati.jpg'],
    helpfulCount: 56,
    helpfulUserIds: [],
    commentCount: 1,
    comments: [
      {
        id: 'c-dag-1',
        postId: 'post-dagdusheth-004',
        userId: 'user-manish-p',
        authorName: 'Manish Patil',
        content: 'Pune Metro Mandai station is truly a game changer for visiting Old Peth temples.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    tags: ['Dagdusheth', 'Ganpati', 'Darshan', 'PuneMetro', 'BudhwarPeth'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post-vetal-005',
    userId: 'user-nature-trekker',
    authorName: 'Kunal Bhagat',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: false,
    isExplorePuneVerified: true,
    placeId: 'vetal-tekdi',
    placeSlug: 'vetal-tekdi',
    placeName: 'Vetal Tekdi',
    placeNameMr: 'वेताळ टेकडी',
    categorySlug: 'nature',
    categoryName: 'Nature, Lakes & Hills',
    categoryNameMr: 'तलाव व निसर्गरम्य स्थळे',
    postType: 'recommendation',
    title: 'Highest Hilltop in Pune & Best Sunrise Trail',
    content:
      'Vetal Tekdi (also known as ARAI hill) stands at 2,600 feet and offers panoramic 360° views across the entire Pune cityscape! Enter from Paud Road or Senapati Bapat Road. Great spot for morning running, bird photography (peacocks and tailorbirds are abundant), and quiet sunset contemplation. Free entry (₹0) and lots of fresh air.',
    images: ['/images/places/vetal-tekdi.jpg'],
    helpfulCount: 42,
    helpfulUserIds: [],
    commentCount: 2,
    comments: [
      {
        id: 'c-vet-1',
        postId: 'post-vetal-005',
        userId: 'user-swati-m',
        authorName: 'Swati More',
        content: 'Are two-wheelers allowed till the ARAI top parking?',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'c-vet-2',
        postId: 'post-vetal-005',
        userId: 'user-nature-trekker',
        authorName: 'Kunal Bhagat',
        content: 'Yes, there is parking near the ARAI gate on Paud Road side, and you can walk up through the wooded path.',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
    tags: ['VetalTekdi', 'ARAI', 'Sunrise', 'Running', 'Nature'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'post-rajgad-006',
    userId: 'user-sahil-trek',
    authorName: 'Sahil Jadhav',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'rajgad-fort',
    placeSlug: 'rajgad-fort',
    placeName: 'Rajgad Fort',
    placeNameMr: 'राजगड किल्ला',
    categorySlug: 'forts',
    categoryName: 'Forts & Sahyadri Trails',
    categoryNameMr: 'किल्ले व सह्याद्री ट्रेक',
    postType: 'question',
    title: 'Water Potability & Night Stay on Padmavati Machi?',
    content:
      'Planning a weekend trek to Rajgad via Gunjawane route. Can someone who visited recently confirm if the water in the natural rock cisterns on Padmavati Machi is currently drinkable, or is it better to carry 4 liters from the base village? Also, is the Padmavati temple open for night shelter?',
    images: ['/images/places/rajgad-fort.jpg'],
    helpfulCount: 27,
    helpfulUserIds: [],
    commentCount: 2,
    comments: [
      {
        id: 'c-raj-1',
        postId: 'post-rajgad-006',
        userId: 'user-guide-ramesh',
        authorName: 'Ramesh Pawar (Trek Guide)',
        content: 'Water in the main Padmavati cistern is clean, but carrying chlorine purification tablets or a portable filter is strictly recommended. Local villagers also sell packaged water at Padmavati Machi during weekends.',
        createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
      },
      {
        id: 'c-raj-2',
        postId: 'post-rajgad-006',
        userId: 'user-sahil-trek',
        authorName: 'Sahil Jadhav',
        content: 'Thank you Ramesh! That really helps. We will carry 3L per person and purification drops.',
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
    ],
    tags: ['Rajgad', 'TrekQuestion', 'PadmavatiMachi', 'SanjeevaniMachi'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'post-pataleshwar-007',
    userId: 'user-archaeo-fan',
    authorName: 'Ishan Kakade',
    authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'pataleshwar-cave-temple',
    placeSlug: 'pataleshwar-cave-temple',
    placeName: 'Pataleshwar Cave Temple',
    placeNameMr: 'पाताळेश्वर लेणी मंदिर',
    categorySlug: 'temples',
    categoryName: 'Temples & Sacred Sites',
    categoryNameMr: 'प्रसिद्ध मंदिरे व देवस्थान',
    postType: 'experience',
    title: '8th-Century Monolithic Marvel Hidden on Busy JM Road',
    content:
      'Step just 20 meters off the bustling Jangali Maharaj Road, and you find complete serenity in an 8th-century rock-cut basalt cave temple carved during the Rashtrakuta period! The circular Nandi mandapa supported by massive pillars is an architectural masterpiece. General entry is 100% verified free (₹0). Perfect for a short 45-minute visit before lunch on FC Road.',
    images: ['/images/places/pataleshwar-cave-temple.jpg'],
    helpfulCount: 35,
    helpfulUserIds: [],
    commentCount: 1,
    comments: [
      {
        id: 'c-pat-1',
        postId: 'post-pataleshwar-007',
        userId: 'user-archi-student',
        authorName: 'Neha Deshpande',
        content: 'The acoustic resonance inside the inner sanctum is remarkable! Stand silently for two minutes to feel the natural cool temperature.',
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      },
    ],
    tags: ['Pataleshwar', 'RockCutArchitecture', 'Rashtrakuta', 'JMRoad'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 55).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 'post-kelkar-008',
    userId: 'user-art-collector',
    authorName: 'Suraj Dhok',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isVerifiedUser: true,
    isExplorePuneVerified: true,
    placeId: 'raja-dinkar-kelkar-museum',
    placeSlug: 'raja-dinkar-kelkar-museum',
    placeName: 'Raja Dinkar Kelkar Museum',
    placeNameMr: 'राजा दिनकर केळकर वस्तुसंग्रहालय',
    categorySlug: 'museums',
    categoryName: 'Museums & Art',
    categoryNameMr: 'वस्तुसंग्रहालये व कला',
    postType: 'recommendation',
    title: 'Must-Visit 3-Story Museum with 20,000+ Indian Artifacts',
    content:
      'Dr. D.G. Kelkar spent 60 years curating this awe-inspiring personal collection! The Mastani Mahal reconstructed chamber, musical instruments from 18th century, carved wooden temple doors, and ancient weaponry are extraordinary. Located in Shukrawar Peth. Admission fee is ₹100 per adult (₹30 for children). Plan at least 1.5 to 2 hours here.',
    images: ['/images/places/raja-dinkar-kelkar-museum.jpg'],
    helpfulCount: 44,
    helpfulUserIds: [],
    commentCount: 2,
    comments: [
      {
        id: 'c-kel-1',
        postId: 'post-kelkar-008',
        userId: 'user-tourist-k',
        authorName: 'Gaurav Sen',
        content: 'Is photography permitted with mobile phone inside the museum?',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'c-kel-2',
        postId: 'post-kelkar-008',
        userId: 'user-art-collector',
        authorName: 'Suraj Dhok',
        content: 'Yes! There is a nominal camera/phone photography ticket fee of ₹50 at the entry counter.',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
    ],
    tags: ['KelkarMuseum', 'MastaniMahal', 'PeshwaArt', 'ShukrawarPeth'],
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 64).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

/**
 * Retrieve all community posts from storage with seed fallback
 */
export function getStoredCommunityPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return INITIAL_COMMUNITY_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COMMUNITY_POSTS;
  } catch {
    return INITIAL_COMMUNITY_POSTS;
  }
}

/**
 * Save posts to storage and broadcast change
 */
export function saveCommunityPosts(posts: CommunityPost[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent('explore-pune-community-updated', { detail: posts }));
  } catch (err) {
    console.error('Failed to save community posts:', err);
  }
}

/**
 * Filter and sort posts dynamically
 */
export function filterCommunityPosts({
  posts,
  searchQuery,
  placeId,
  categorySlug,
  postType,
  sortOption = 'latest',
  currentUserId,
  blockedUserIds,
}: {
  posts: CommunityPost[];
  searchQuery?: string;
  placeId?: string;
  categorySlug?: string;
  postType?: CommunityPostType | 'all';
  sortOption?: CommunitySortOption;
  currentUserId?: string;
  blockedUserIds?: string[];
}): CommunityPost[] {
  // Resolve blocked user IDs if not provided
  const blocked = blockedUserIds || (currentUserId ? getBlockedUserIds(currentUserId) : []);

  let filtered = posts.filter((p) => {
    // Hide hidden posts
    if (p.status === 'hidden') return false;

    // Filter out posts from blocked users (Rule 8: Block User)
    if (blocked.length > 0 && blocked.includes(p.userId)) return false;

    // Posts under review are visible only to their author until approved by moderators
    if (p.status === 'review') {
      return Boolean(currentUserId && p.userId === currentUserId);
    }

    return true;
  });

  // 1. Place filter
  if (placeId && placeId !== 'all') {
    filtered = filtered.filter(
      (p) => p.placeId === placeId || p.placeSlug === placeId
    );
  }

  // 2. Category filter
  if (categorySlug && categorySlug !== 'all') {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  // 3. Post Type filter
  if (postType && postType !== 'all') {
    filtered = filtered.filter((p) => p.postType === postType);
  }

  // 4. Search query
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      const matchPlace =
        p.placeName.toLowerCase().includes(q) ||
        (p.placeNameMr && p.placeNameMr.toLowerCase().includes(q));
      const matchAuthor = p.authorName.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchContent || matchPlace || matchAuthor || matchTags;
    });
  }

  // 5. Sorting
  return [...filtered].sort((a, b) => {
    if (sortOption === 'helpful') {
      return b.helpfulCount - a.helpfulCount;
    }
    if (sortOption === 'discussed') {
      return b.commentCount - a.commentCount;
    }
    if (sortOption === 'trending') {
      // Trending = Engagement (Helpful + Comments*2) divided by age factor
      const ageHoursA = Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000);
      const ageHoursB = Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000);
      const scoreA = (a.helpfulCount * 1.5 + a.commentCount * 2.5) / Math.pow(ageHoursA, 0.4);
      const scoreB = (b.helpfulCount * 1.5 + b.commentCount * 2.5) / Math.pow(ageHoursB, 0.4);
      return scoreB - scoreA;
    }
    // Default: 'latest'
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Toggle Helpful on a post (1 vote per user, self-voting prohibited)
 */
export function togglePostHelpful({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): { success: boolean; helpfulCount: number; hasVoted: boolean; reason?: string } {
  const posts = getStoredCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return { success: false, helpfulCount: 0, hasVoted: false, reason: 'not_found' };

  // Rule 11: Prevent Fake Engagement - No self-voting
  if (post.userId === userId && userId !== 'guest-user') {
    return {
      success: false,
      helpfulCount: post.helpfulCount,
      hasVoted: false,
      reason: 'self_vote',
    };
  }

  const userIds = post.helpfulUserIds || [];
  const existingIdx = userIds.indexOf(userId);

  let hasVoted = false;
  if (existingIdx > -1) {
    // Un-vote
    userIds.splice(existingIdx, 1);
    post.helpfulCount = Math.max(0, post.helpfulCount - 1);
    hasVoted = false;
  } else {
    // Vote
    userIds.push(userId);
    post.helpfulCount = (post.helpfulCount || 0) + 1;
    hasVoted = true;
  }

  post.helpfulUserIds = userIds;
  saveCommunityPosts(posts);

  return { success: true, helpfulCount: post.helpfulCount, hasVoted };
}

/**
 * Add comment to a post with rate limits & moderation
 */
export function addCommentToPost({
  postId,
  userId,
  authorName,
  authorAvatar,
  content,
}: {
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
}): CommunityComment | null {
  const posts = getStoredCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  // Rule 3: No Anonymous Posting
  const sanitizedAuthor = sanitizeUserText(authorName) || 'Pune Explorer';
  const sanitizedContent = sanitizeUserText(content);
  if (!sanitizedContent) return null;

  // Rule 9: Commenting rate limits
  const rateCheck = checkUserCommentingAllowed(userId);
  if (!rateCheck.allowed) {
    throw new Error(rateCheck.reasonEn || 'Rate limit reached');
  }

  // Rule 4: Content Moderation
  const moderation = moderateCommunityContent('', sanitizedContent);
  if (moderation.outcome === 'blocked') {
    throw new Error(moderation.reasonEn);
  }

  const newComment: CommunityComment = {
    id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    postId,
    userId,
    authorName: sanitizedAuthor,
    authorAvatar,
    content: sanitizedContent,
    createdAt: new Date().toISOString(),
  };

  post.comments = post.comments || [];
  post.comments.push(newComment);
  post.commentCount = post.comments.length;
  post.updatedAt = new Date().toISOString();

  recordUserComment(userId);
  saveCommunityPosts(posts);
  return newComment;
}

/**
 * Create a new community post with 3-tier moderation & rate limiting
 */
export function createCommunityPost(
  newPost: Omit<
    CommunityPost,
    'id' | 'helpfulCount' | 'helpfulUserIds' | 'commentCount' | 'comments' | 'status' | 'createdAt' | 'updatedAt'
  > & {
    status?: 'published' | 'review' | 'reported' | 'hidden';
  }
): CommunityPost {
  const posts = getStoredCommunityPosts();

  // Rule 3: No Anonymous Posting
  const sanitizedAuthor = sanitizeUserText(newPost.authorName);
  if (!sanitizedAuthor) {
    throw new Error('A display name is required to participate in the community.');
  }

  const cleanTitle = sanitizeUserText(newPost.title);
  const cleanContent = sanitizeUserText(newPost.content);
  if (!cleanTitle || !cleanContent) {
    throw new Error('Title and content are required.');
  }

  // Rule 9: Rate limiting & cooldowns
  const rateCheck = checkUserPostingAllowed(newPost.userId);
  if (!rateCheck.allowed) {
    throw new Error(rateCheck.reasonEn || 'Posting limit reached.');
  }

  // Rule 4 & 5: Three-tier moderation
  const modResult = moderateCommunityContent(cleanTitle, cleanContent);
  if (modResult.outcome === 'blocked') {
    throw new Error(modResult.reasonEn);
  }

  // Determine initial status based on moderation outcome
  const initialStatus =
    newPost.status || (modResult.outcome === 'review' ? 'review' : 'published');

  const post: CommunityPost = {
    ...newPost,
    title: cleanTitle,
    content: cleanContent,
    authorName: sanitizedAuthor,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    helpfulCount: 0,
    helpfulUserIds: [],
    commentCount: 0,
    comments: [],
    status: initialStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  recordUserPost(newPost.userId);
  posts.unshift(post);
  saveCommunityPosts(posts);
  return post;
}

/**
 * Report a post or comment
 */
export function submitCommunityReport(
  report: Omit<CommunityReport, 'id' | 'createdAt' | 'status'>
): CommunityReport {
  let reports: CommunityReport[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    if (raw) reports = JSON.parse(raw);
  } catch {}

  const fullReport: CommunityReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  reports.push(fullReport);
  try {
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent('explore-pune-report-submitted', { detail: fullReport }));
  } catch {}

  return fullReport;
}

/**
 * Retrieve all reports for moderator dashboard
 */
export function getStoredCommunityReports(): CommunityReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Resolve report in moderator dashboard
 */
export function resolveCommunityReport(
  reportId: string,
  action: 'keep' | 'remove' | 'dismiss'
): void {
  const reports = getStoredCommunityReports();
  const report = reports.find((r) => r.id === reportId);
  if (!report) return;

  report.status = action === 'dismiss' ? 'dismissed' : 'resolved';
  try {
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch {}

  // If removing target post
  if (action === 'remove' && report.targetType === 'post') {
    updatePostStatus(report.targetId, 'hidden');
  }
}

/**
 * Update post status (e.g. approve held review post, or hide violating post)
 */
export function updatePostStatus(postId: string, status: CommunityPost['status']): void {
  const posts = getStoredCommunityPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  post.status = status;
  post.updatedAt = new Date().toISOString();
  saveCommunityPosts(posts);
}

/**
 * Convert numbers to Marathi/Devanagari numeral characters
 */
function toDevanagariDigits(n: number | string): string {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(n).replace(/\d/g, (d) => devanagariDigits[Number(d)]);
}

/**
 * Format relative time display (e.g., "Reported 2 hours ago", "Reported yesterday")
 */
export function formatCommunityTime(isoString: string, isMr: boolean = false): string {
  if (!isoString) return isMr ? 'माहिती नाही' : 'Unknown';

  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.max(1, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return isMr ? 'आत्ताच' : 'Just now';
  }
  if (diffMin < 60) {
    return isMr ? `${toDevanagariDigits(diffMin)} मिनिटांपूर्वी` : `${diffMin} min ago`;
  }
  if (diffHours === 1) {
    return isMr ? '१ तासापूर्वी' : 'Reported 1 hour ago';
  }
  if (diffHours < 24) {
    return isMr ? `${toDevanagariDigits(diffHours)} तासांपूर्वी` : `Reported ${diffHours} hours ago`;
  }
  if (diffDays === 1) {
    return isMr ? 'काल' : 'Reported yesterday';
  }
  if (diffDays < 7) {
    return isMr ? `${toDevanagariDigits(diffDays)} दिवसांपूर्वी` : `Reported ${diffDays} days ago`;
  }
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) {
    return isMr ? '१ आठवड्यापूर्वी' : 'Reported 1 week ago';
  }
  if (weeks < 4) {
    return isMr ? `${toDevanagariDigits(weeks)} आठवड्यांपूर्वी` : `Reported ${weeks} weeks ago`;
  }
  const months = Math.floor(diffDays / 30);
  return isMr ? `${toDevanagariDigits(months)} महिन्यांपूर्वी` : `Reported ${months} months ago`;
}
