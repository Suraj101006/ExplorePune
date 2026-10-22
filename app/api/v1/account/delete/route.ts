import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { isLimited } from '@/lib/rateLimit';

// Deletes the signed-in user's auth account and their Firestore data.
export async function POST(req: NextRequest) {
  // Rate limit: 5 deletion attempts per hour per IP
  if (isLimited(req, 'account-delete', 5, 3600_000)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many account operations. Please try again later.' } },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer /i, '');
  if (!token) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Delete user data from Firestore collections
    const collections = ['profiles', 'favorites', 'visits', 'reviews', 'blogs', 'user_milestones', 'reports'];
    const batch = adminDb.batch();

    for (const col of collections) {
      const field = col === 'blogs' ? 'author_id' : col === 'reports' ? 'reporter_id' : 'user_id';
      const fieldToQuery = col === 'profiles' ? null : field;

      if (col === 'profiles') {
        // Profile doc is keyed by uid
        batch.delete(adminDb.collection('profiles').doc(uid));
      } else {
        const snap = await adminDb.collection(col).where(fieldToQuery!, '==', uid).get();
        snap.forEach((d) => batch.delete(d.ref));
      }
    }

    await batch.commit();

    // Delete the auth user
    await adminAuth.deleteUser(uid);

    return NextResponse.json({ data: { deleted: true } });
  } catch (error: any) {
    console.error('Account deletion failed:', error?.message);
    return NextResponse.json({ error: { code: 'DELETE_FAILED', message: 'Could not delete the account. Please try again.' } }, { status: 500 });
  }
}
