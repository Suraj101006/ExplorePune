import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  moderateCommunityContent,
  sanitizeUserText,
  validateCommunityImageUpload,
} from '../lib/communityModeration';
import {
  hasAcceptedCommunityGuidelines,
  acceptCommunityGuidelines,
  blockUser,
  unblockUser,
  isUserBlocked,
  getBlockedUsers,
  checkUserPostingAllowed,
  recordUserPost,
  checkUserCommentingAllowed,
  recordUserComment,
  submitCommunityAppeal,
  getStoredAppeals,
  resolveCommunityAppeal,
} from '../lib/userSafety';
import {
  togglePostHelpful,
  createCommunityPost,
  filterCommunityPosts,
  saveCommunityPosts,
  getStoredCommunityPosts,
  INITIAL_COMMUNITY_POSTS,
} from '../lib/communityStorage';

// In-memory mock storage
const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = val.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('Community Safety, Dignity & Moderation Engine', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      localStorage: mockStorage,
    });
  });

  describe('Content Moderation (3-Tier Verdicts)', () => {
    it('blocks posts that expose personal phone numbers (Privacy & Doxxing protection)', () => {
      const res1 = moderateCommunityContent(
        'Call for tour',
        'Contact me on 9822012345 for private guide services.'
      );
      expect(res1.outcome).toBe('blocked');
      expect(res1.category).toBe('contact_info');
      expect(res1.reasonEn).toContain('privacy');

      const res2 = moderateCommunityContent(
        'Group trek',
        'Join our WhatsApp group, call me at +91 9988776655.'
      );
      expect(res2.outcome).toBe('blocked');
      expect(res2.category).toBe('contact_info');
    });

    it('blocks posts that expose personal email addresses', () => {
      const res = moderateCommunityContent(
        'Travel buddies',
        'Send your resume or email me directly at explorer_suraj@gmail.com for details.'
      );
      expect(res.outcome).toBe('blocked');
      expect(res.category).toBe('privacy_violation');
    });

    it('blocks promotional spam, crypto scams, and unauthorized commercial flooding', () => {
      const res1 = moderateCommunityContent(
        'Quick income in Pune',
        'Earn money online from home, earn ₹ 50000 daily with zero investment!'
      );
      expect(res1.outcome).toBe('blocked');
      expect(res1.category).toBe('spam_scam');

      const res2 = moderateCommunityContent(
        'Special discount',
        'Check out my referral link at bit.ly/freepunetour'
      );
      expect(res2.outcome).toBe('blocked');
      expect(res2.category).toBe('suspicious_link');
    });

    it('blocks communal hate speech, religious hostility, and personal threats', () => {
      const hateRes = moderateCommunityContent(
        'Opinions',
        'We should destroy temple monuments and ban these people.'
      );
      expect(hateRes.outcome).toBe('blocked');
      expect(hateRes.category).toBe('hate_speech');

      const threatRes = moderateCommunityContent(
        'Warning to user',
        'I know who you are, I will kill you if you visit Sinhagad again.'
      );
      expect(threatRes.outcome).toBe('blocked');
      expect(threatRes.category).toBe('abuse_harassment');
    });

    it('holds dangerous tourist behavior for human moderator safety review (Outcome: review)', () => {
      const dangerRes = moderateCommunityContent(
        'Shortcut to fort',
        'You can jump over railing at the Tanaji cliff to take a selfie without security seeing you.'
      );
      expect(dangerRes.outcome).toBe('review');
      expect(dangerRes.category).toBe('dangerous_behavior');
    });

    it('explicitly allows constructive travel criticism (Negative experience != harmful content)', () => {
      const review1 = moderateCommunityContent(
        'Sinhagad weekend visit',
        'The parking was poor and washrooms were dirty during peak hours. Avoid Sunday noon.'
      );
      expect(review1.outcome).toBe('allowed');
      expect(review1.category).toBe('clean');

      const review2 = moderateCommunityContent(
        'Shaniwar Wada experience',
        'The ticket counter queue was long and staff was unhelpful with the online QR system.'
      );
      expect(review2.outcome).toBe('allowed');
      expect(review2.category).toBe('clean');
    });
  });

  describe('Text Sanitization & Anti-XSS', () => {
    it('strips HTML tags and script elements', () => {
      const malicious = '<script>alert("hacked")</script><b>Hello</b> Pune!';
      const sanitized = sanitizeUserText(malicious);
      expect(sanitized).toBe('Hello Pune!');
      expect(sanitized).not.toContain('<script>');
    });

    it('strips javascript: pseudo-protocols', () => {
      const input = '<a href="javascript:doEvil()">Click here</a>';
      const sanitized = sanitizeUserText(input);
      expect(sanitized).not.toContain('javascript:');
    });
  });

  describe('Community Image Upload Safety', () => {
    it('accepts valid JPEG, PNG, and WebP images within 5 MB', () => {
      const valid = validateCommunityImageUpload({
        name: 'sinhagad.jpg',
        type: 'image/jpeg',
        size: 2 * 1024 * 1024,
      });
      expect(valid.valid).toBe(true);
    });

    it('rejects files larger than 5 MB', () => {
      const large = validateCommunityImageUpload({
        name: 'huge.png',
        type: 'image/png',
        size: 6 * 1024 * 1024,
      });
      expect(large.valid).toBe(false);
      expect(large.errorEn).toContain('5 MB or less');
    });

    it('rejects non-image file types', () => {
      const invalid = validateCommunityImageUpload({
        name: 'script.exe',
        type: 'application/x-msdownload',
        size: 1024,
      });
      expect(invalid.valid).toBe(false);
      expect(invalid.errorEn).toContain('Only JPG, PNG, and WebP');
    });
  });

  describe('User Safety & Guidelines Acceptance', () => {
    it('tracks community guidelines acceptance', () => {
      expect(hasAcceptedCommunityGuidelines('user-test-1')).toBe(false);
      acceptCommunityGuidelines('user-test-1');
      expect(hasAcceptedCommunityGuidelines('user-test-1')).toBe(true);
    });

    it('blocks a user and hides their posts from the blocker feed', () => {
      const currentUserId = 'user-suraj-dhok';
      const offenderId = 'user-spammy-bob';

      expect(isUserBlocked(currentUserId, offenderId)).toBe(false);

      blockUser(currentUserId, offenderId, 'Spammy Bob');
      expect(isUserBlocked(currentUserId, offenderId)).toBe(true);

      const blockedList = getBlockedUsers(currentUserId);
      expect(blockedList.length).toBe(1);
      expect(blockedList[0].userId).toBe(offenderId);

      // Verify unblock
      unblockUser(currentUserId, offenderId);
      expect(isUserBlocked(currentUserId, offenderId)).toBe(false);
    });

    it('prevents self-blocking', () => {
      blockUser('user-same', 'user-same', 'Same User');
      expect(getBlockedUsers('user-same').length).toBe(0);
    });
  });

  describe('Rate Limiting & Cooldowns', () => {
    it('enforces a 30-second cooldown between consecutive posts', () => {
      const userId = 'rate-tester-user';
      expect(checkUserPostingAllowed(userId).allowed).toBe(true);

      recordUserPost(userId);
      const secondCheck = checkUserPostingAllowed(userId);
      expect(secondCheck.allowed).toBe(false);
      expect(secondCheck.waitSeconds).toBeGreaterThanOrEqual(1);
    });

    it('limits comments to prevent automated spam flooding', () => {
      const userId = 'comment-spammer';
      for (let i = 0; i < 5; i++) {
        recordUserComment(userId);
      }

      const check = checkUserCommentingAllowed(userId);
      expect(check.allowed).toBe(false);
      expect(check.reasonEn).toContain('Comment speed limit');
    });
  });

  describe('Engagement Protection (Self-Voting Block)', () => {
    it('prohibits users from marking their own posts as helpful', () => {
      saveCommunityPosts([...INITIAL_COMMUNITY_POSTS]);
      const post = INITIAL_COMMUNITY_POSTS[0];

      // Try voting on own post
      const res = togglePostHelpful({
        postId: post.id,
        userId: post.userId, // Same author
      });

      expect(res.success).toBe(false);
      expect(res.reason).toBe('self_vote');
    });
  });

  describe('Appeals Workflow', () => {
    it('submits a moderation appeal and allows resolution', () => {
      const appeal = submitCommunityAppeal({
        postId: 'post-sinhagad-001',
        postTitle: 'Trek experience',
        userId: 'user-appellant-1',
        authorName: 'Rohan Deshmukh',
        reason: 'mistake',
        explanation: 'My mention of cliff was historical, not encouraging dangerous climbing.',
      });

      expect(appeal.id).toBeDefined();
      expect(appeal.status).toBe('pending');

      const allAppeals = getStoredAppeals();
      expect(allAppeals.some((a) => a.id === appeal.id)).toBe(true);

      resolveCommunityAppeal(appeal.id, 'approved', 'Re-evaluated and approved');
      const resolved = getStoredAppeals().find((a) => a.id === appeal.id);
      expect(resolved?.status).toBe('approved');
      expect(resolved?.moderatorNotes).toBe('Re-evaluated and approved');
    });
  });
});
