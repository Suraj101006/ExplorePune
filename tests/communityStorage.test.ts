import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  INITIAL_COMMUNITY_POSTS,
  filterCommunityPosts,
  togglePostHelpful,
  addCommentToPost,
  createCommunityPost,
  submitCommunityReport,
  formatCommunityTime,
  getStoredCommunityPosts,
  saveCommunityPosts,
  CommunityPost,
} from '../lib/communityStorage';

// In-memory localStorage mock for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('Community Knowledge & Discussion Engine', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Setup window/localStorage environment
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      localStorage: localStorageMock,
    });
  });

  describe('INITIAL_COMMUNITY_POSTS & Seeding', () => {
    it('provides authentic, non-empty default community posts for key Pune places', () => {
      expect(INITIAL_COMMUNITY_POSTS.length).toBeGreaterThanOrEqual(8);

      const placeSlugs = INITIAL_COMMUNITY_POSTS.map((p) => p.placeSlug);
      expect(placeSlugs).toContain('sinhagad-fort');
      expect(placeSlugs).toContain('shaniwar-wada');
      expect(placeSlugs).toContain('aga-khan-palace');
      expect(placeSlugs).toContain('shreemant-dagdusheth-halwai-ganpati');
      expect(placeSlugs).toContain('rajgad-fort');
    });

    it('ensures every seeded post satisfies the CommunityPost schema', () => {
      for (const post of INITIAL_COMMUNITY_POSTS) {
        expect(post.id).toBeDefined();
        expect(post.authorName.length).toBeGreaterThan(0);
        expect(post.placeId.length).toBeGreaterThan(0);
        expect(post.placeName.length).toBeGreaterThan(0);
        expect(post.title.length).toBeGreaterThan(0);
        expect(post.content.length).toBeGreaterThan(0);
        expect(['experience', 'tip', 'question', 'recommendation', 'photo', 'update']).toContain(
          post.postType
        );
        expect(typeof post.helpfulCount).toBe('number');
        expect(Array.isArray(post.comments)).toBe(true);
        expect(post.status).toBe('published');
      }
    });

    it('retrieves initial posts when local storage is empty', () => {
      const posts = getStoredCommunityPosts();
      expect(posts.length).toBe(INITIAL_COMMUNITY_POSTS.length);
      expect(posts[0].id).toBe(INITIAL_COMMUNITY_POSTS[0].id);
    });
  });

  describe('filterCommunityPosts', () => {
    it('filters discussions by specific place ID or place Slug', () => {
      const sinhagadPosts = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        placeId: 'sinhagad-fort',
      });

      expect(sinhagadPosts.length).toBeGreaterThan(0);
      for (const p of sinhagadPosts) {
        expect(p.placeId === 'sinhagad-fort' || p.placeSlug === 'sinhagad-fort').toBe(true);
      }
    });

    it('filters discussions by category slug', () => {
      const fortPosts = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        categorySlug: 'forts',
      });

      expect(fortPosts.length).toBeGreaterThan(0);
      for (const p of fortPosts) {
        expect(p.categorySlug).toBe('forts');
      }
    });

    it('filters discussions by post type', () => {
      const tips = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        postType: 'tip',
      });

      expect(tips.length).toBeGreaterThan(0);
      for (const p of tips) {
        expect(p.postType).toBe('tip');
      }
    });

    it('searches by keyword matching title, content, or place name', () => {
      const parkingSearch = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        searchQuery: 'parking',
      });
      expect(parkingSearch.length).toBeGreaterThan(0);

      const wadaSearch = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        searchQuery: 'Shaniwar',
      });
      expect(wadaSearch.length).toBeGreaterThan(0);
      expect(wadaSearch[0].placeName).toContain('Shaniwar');
    });

    it('sorts discussions by helpfulness in descending order', () => {
      const sortedByHelpful = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        sortOption: 'helpful',
      });

      for (let i = 0; i < sortedByHelpful.length - 1; i++) {
        expect(sortedByHelpful[i].helpfulCount).toBeGreaterThanOrEqual(
          sortedByHelpful[i + 1].helpfulCount
        );
      }
    });

    it('sorts discussions by discussion comments count in descending order', () => {
      const sortedByDiscussed = filterCommunityPosts({
        posts: INITIAL_COMMUNITY_POSTS,
        sortOption: 'discussed',
      });

      for (let i = 0; i < sortedByDiscussed.length - 1; i++) {
        expect(sortedByDiscussed[i].commentCount).toBeGreaterThanOrEqual(
          sortedByDiscussed[i + 1].commentCount
        );
      }
    });
  });

  describe('togglePostHelpful (1 vote per user rule)', () => {
    it('allows a user to mark a post helpful and increments the count', () => {
      saveCommunityPosts([...INITIAL_COMMUNITY_POSTS]);
      const targetId = INITIAL_COMMUNITY_POSTS[0].id;
      const initialCount = INITIAL_COMMUNITY_POSTS[0].helpfulCount;

      const res = togglePostHelpful({ postId: targetId, userId: 'user-suraj-01' });
      expect(res.success).toBe(true);
      expect(res.hasVoted).toBe(true);
      expect(res.helpfulCount).toBe(initialCount + 1);

      // Verify persistence in storage
      const refreshed = getStoredCommunityPosts().find((p) => p.id === targetId);
      expect(refreshed?.helpfulCount).toBe(initialCount + 1);
      expect(refreshed?.helpfulUserIds).toContain('user-suraj-01');
    });

    it('allows a user to un-vote when clicking helpful again (toggling)', () => {
      saveCommunityPosts([...INITIAL_COMMUNITY_POSTS]);
      const targetId = INITIAL_COMMUNITY_POSTS[0].id;
      const initialCount = INITIAL_COMMUNITY_POSTS[0].helpfulCount;

      // 1st vote
      togglePostHelpful({ postId: targetId, userId: 'user-sahil-02' });
      // 2nd click -> un-vote
      const unvoteRes = togglePostHelpful({ postId: targetId, userId: 'user-sahil-02' });

      expect(unvoteRes.success).toBe(true);
      expect(unvoteRes.hasVoted).toBe(false);
      expect(unvoteRes.helpfulCount).toBe(initialCount);

      const refreshed = getStoredCommunityPosts().find((p) => p.id === targetId);
      expect(refreshed?.helpfulUserIds).not.toContain('user-sahil-02');
    });
  });

  describe('addCommentToPost', () => {
    it('appends a comment to the post and increments commentCount', () => {
      saveCommunityPosts([...INITIAL_COMMUNITY_POSTS]);
      const targetId = INITIAL_COMMUNITY_POSTS[0].id;
      const initialCommentCount = INITIAL_COMMUNITY_POSTS[0].commentCount;

      const comment = addCommentToPost({
        postId: targetId,
        userId: 'user-ishan-03',
        authorName: 'Ishan Kakade',
        content: 'Very insightful tip! Will follow this route tomorrow morning.',
      });

      expect(comment).not.toBeNull();
      expect(comment?.authorName).toBe('Ishan Kakade');
      expect(comment?.content).toContain('Very insightful tip!');

      const refreshed = getStoredCommunityPosts().find((p) => p.id === targetId);
      expect(refreshed?.commentCount).toBe(initialCommentCount + 1);
      expect(refreshed?.comments.some((c) => c.authorName === 'Ishan Kakade')).toBe(true);
    });
  });

  describe('createCommunityPost', () => {
    it('creates a new community post and adds it to the top of storage', () => {
      saveCommunityPosts([...INITIAL_COMMUNITY_POSTS]);

      const newPost = createCommunityPost({
        userId: 'user-suraj-01',
        authorName: 'Suraj Dhok',
        placeId: 'parvati-hill',
        placeSlug: 'parvati-hill',
        placeName: 'Parvati Hill Temple',
        placeNameMr: 'पार्वती टेकडी',
        categorySlug: 'temples',
        categoryName: 'Religious & Temples',
        categoryNameMr: 'मंदिरे व तीर्थ',
        postType: 'tip',
        title: 'Morning 108 steps climb for best sunrise view',
        content: 'Climb early at 6 AM before the sun gets harsh. The Peshwa museum at the top opens at 8 AM.',
        tags: ['parvati', 'steps', 'sunrise', 'peshwa'],
      });

      expect(newPost.id).toBeDefined();
      expect(newPost.helpfulCount).toBe(0);
      expect(newPost.commentCount).toBe(0);
      expect(newPost.status).toBe('published');

      const all = getStoredCommunityPosts();
      expect(all[0].id).toBe(newPost.id);
      expect(all[0].title).toBe('Morning 108 steps climb for best sunrise view');
    });
  });

  describe('submitCommunityReport', () => {
    it('records a moderation report with pending status', () => {
      const report = submitCommunityReport({
        targetType: 'post',
        targetId: 'post-test-123',
        reporterUserId: 'user-reporter-99',
        reason: 'false_info',
        details: 'The opening hours mentioned have changed after renovation.',
      });

      expect(report.id).toBeDefined();
      expect(report.status).toBe('pending');
      expect(report.reason).toBe('false_info');
    });
  });

  describe('formatCommunityTime', () => {
    it('formats relative timestamps accurately in English and Marathi', () => {
      const now = new Date().toISOString();
      expect(formatCommunityTime(now, false)).toBe('Just now');
      expect(formatCommunityTime(now, true)).toBe('आत्ताच');

      const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
      expect(formatCommunityTime(twoHoursAgo, false)).toBe('Reported 2 hours ago');
      expect(formatCommunityTime(twoHoursAgo, true)).toBe('२ तासांपूर्वी');

      const oneDayAgo = new Date(Date.now() - 26 * 3600 * 1000).toISOString();
      expect(formatCommunityTime(oneDayAgo, false)).toBe('Reported yesterday');
      expect(formatCommunityTime(oneDayAgo, true)).toBe('काल');
    });
  });
});
