/**
 * Explore Pune - User Safety, Privacy & Dignity Controls
 * 
 * Manages:
 * 1. Community Guidelines Acceptance state
 * 2. User Blocking (mutual privacy without alerting blocked users)
 * 3. Client & Server Rate Limit Cooldowns
 * 4. Moderation Appeals Workflow
 */

export interface BlockedUserRecord {
  userId: string;
  displayName: string;
  blockedAt: string; // ISO date
}

export interface CommunityAppeal {
  id: string;
  postId: string;
  postTitle?: string;
  userId: string;
  authorName: string;
  reason: string;
  explanation: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  moderatorNotes?: string;
}

const STORAGE_GUIDELINES_KEY = 'explore_pune_guidelines_accepted_v1';
const STORAGE_BLOCKED_USERS_KEY = 'explore_pune_blocked_users_v1';
const STORAGE_APPEALS_KEY = 'explore_pune_community_appeals_v1';
const STORAGE_USER_POST_TIMESTAMPS_KEY = 'explore_pune_post_rate_v1';
const STORAGE_USER_COMMENT_TIMESTAMPS_KEY = 'explore_pune_comment_rate_v1';

/**
 * 1. Community Guidelines Acceptance
 */
export function hasAcceptedCommunityGuidelines(userId?: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const acceptedGlobally = localStorage.getItem(STORAGE_GUIDELINES_KEY) === 'true';
    if (acceptedGlobally) return true;
    if (userId) {
      return localStorage.getItem(`${STORAGE_GUIDELINES_KEY}_${userId}`) === 'true';
    }
    return false;
  } catch {
    return false;
  }
}

export function acceptCommunityGuidelines(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_GUIDELINES_KEY, 'true');
    if (userId) {
      localStorage.setItem(`${STORAGE_GUIDELINES_KEY}_${userId}`, 'true');
    }
    window.dispatchEvent(new CustomEvent('explore-pune-guidelines-accepted'));
  } catch (err) {
    console.error('Failed to save guidelines acceptance:', err);
  }
}

/**
 * 2. Block User Management
 */
export function getBlockedUsers(currentUserId?: string): BlockedUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = currentUserId
      ? `${STORAGE_BLOCKED_USERS_KEY}_${currentUserId}`
      : STORAGE_BLOCKED_USERS_KEY;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBlockedUserIds(currentUserId?: string): string[] {
  return getBlockedUsers(currentUserId).map((b) => b.userId);
}

export function blockUser(
  currentUserId: string,
  targetUserId: string,
  targetDisplayName: string
): void {
  if (typeof window === 'undefined' || !currentUserId || !targetUserId) return;
  if (currentUserId === targetUserId) return; // Cannot block self

  try {
    const list = getBlockedUsers(currentUserId);
    if (!list.some((u) => u.userId === targetUserId)) {
      list.push({
        userId: targetUserId,
        displayName: targetDisplayName || 'Pune Explorer',
        blockedAt: new Date().toISOString(),
      });
      const key = `${STORAGE_BLOCKED_USERS_KEY}_${currentUserId}`;
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('explore-pune-blocked-users-updated', { detail: list }));
    }
  } catch (err) {
    console.error('Failed to block user:', err);
  }
}

export function unblockUser(currentUserId: string, targetUserId: string): void {
  if (typeof window === 'undefined' || !currentUserId || !targetUserId) return;

  try {
    const list = getBlockedUsers(currentUserId).filter((u) => u.userId !== targetUserId);
    const key = `${STORAGE_BLOCKED_USERS_KEY}_${currentUserId}`;
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('explore-pune-blocked-users-updated', { detail: list }));
  } catch (err) {
    console.error('Failed to unblock user:', err);
  }
}

export function isUserBlocked(currentUserId: string, targetUserId: string): boolean {
  if (!currentUserId || !targetUserId) return false;
  return getBlockedUserIds(currentUserId).includes(targetUserId);
}

/**
 * 3. Rate Limits & Anti-Flooding Controls
 * 
 * Rules:
 * - Max 5 posts per day per account
 * - Minimum 30 seconds cooldown between consecutive posts
 * - Max 5 comments per 2 minutes
 */
export function checkUserPostingAllowed(userId: string): {
  allowed: boolean;
  waitSeconds?: number;
  reasonEn?: string;
  reasonMr?: string;
} {
  if (typeof window === 'undefined') return { allowed: true };
  try {
    const key = `${STORAGE_USER_POST_TIMESTAMPS_KEY}_${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    const now = Date.now();
    // Filter timestamps within last 24 hours
    const recent24h = timestamps.filter((t) => now - t < 24 * 3600 * 1000);

    // Rule A: Daily limit
    if (recent24h.length >= 5) {
      return {
        allowed: false,
        reasonEn: 'Daily community posting limit reached (5 posts/day). Please try again tomorrow.',
        reasonMr: 'दैनंदिन पोस्ट मर्यादा गाठली आहे (५ पोस्ट/दिवस). कृपया उद्या पुन्हा प्रयत्न करा.',
      };
    }

    // Rule B: Cooldown between consecutive posts (30s)
    if (recent24h.length > 0) {
      const lastPostTime = recent24h[recent24h.length - 1];
      const elapsed = Math.floor((now - lastPostTime) / 1000);
      if (elapsed < 30) {
        const remaining = 30 - elapsed;
        return {
          allowed: false,
          waitSeconds: remaining,
          reasonEn: `Please wait ${remaining} seconds before sharing another post.`,
          reasonMr: `दुसरी पोस्ट शेअर करण्यापूर्वी कृपया ${remaining} सेकंद प्रतीक्षा करा.`,
        };
      }
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordUserPost(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_USER_POST_TIMESTAMPS_KEY}_${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    timestamps.push(Date.now());
    localStorage.setItem(key, JSON.stringify(timestamps.slice(-10)));
  } catch {}
}

export function checkUserCommentingAllowed(userId: string): {
  allowed: boolean;
  waitSeconds?: number;
  reasonEn?: string;
  reasonMr?: string;
} {
  if (typeof window === 'undefined') return { allowed: true };
  try {
    const key = `${STORAGE_USER_COMMENT_TIMESTAMPS_KEY}_${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];

    const now = Date.now();
    // Comments within 2 minutes
    const recent2m = timestamps.filter((t) => now - t < 120 * 1000);

    if (recent2m.length >= 5) {
      return {
        allowed: false,
        waitSeconds: 60,
        reasonEn: 'Comment speed limit reached. Please pause a moment before replying.',
        reasonMr: 'टिप्पणी मर्यादा गाठली आहे. कृपया थोडे थांबा.',
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordUserComment(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_USER_COMMENT_TIMESTAMPS_KEY}_${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    timestamps.push(Date.now());
    localStorage.setItem(key, JSON.stringify(timestamps.slice(-10)));
  } catch {}
}

/**
 * 4. Appeals System
 */
export function getStoredAppeals(): CommunityAppeal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_APPEALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function submitCommunityAppeal(
  appeal: Omit<CommunityAppeal, 'id' | 'createdAt' | 'status'>
): CommunityAppeal {
  const appeals = getStoredAppeals();
  const fullAppeal: CommunityAppeal = {
    ...appeal,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  appeals.unshift(fullAppeal);
  try {
    localStorage.setItem(STORAGE_APPEALS_KEY, JSON.stringify(appeals));
    window.dispatchEvent(new CustomEvent('explore-pune-appeal-submitted', { detail: fullAppeal }));
  } catch {}

  return fullAppeal;
}

export function resolveCommunityAppeal(
  appealId: string,
  resolution: 'approved' | 'rejected',
  notes?: string
): void {
  const appeals = getStoredAppeals();
  const item = appeals.find((a) => a.id === appealId);
  if (!item) return;

  item.status = resolution;
  item.resolvedAt = new Date().toISOString();
  item.moderatorNotes = notes;

  try {
    localStorage.setItem(STORAGE_APPEALS_KEY, JSON.stringify(appeals));
    window.dispatchEvent(new CustomEvent('explore-pune-appeal-updated', { detail: item }));
  } catch {}
}
