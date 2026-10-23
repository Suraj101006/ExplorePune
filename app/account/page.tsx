'use client';
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updatePassword, signOut, updateProfile } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import ProfileAvatar from '@/components/ProfileAvatar';
import ProfileAvatarModal from '@/components/ProfileAvatarModal';
import { getBlockedUsers, unblockUser, hasAcceptedCommunityGuidelines } from '@/lib/userSafety';

const STATUS: Record<string, string> = {
  pending: 'Waiting for review',
  published: 'Published',
  rejected: 'Not approved',
  removed: 'Removed',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { isMr } = useLanguage();
  const [d, setD] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);
  const [blockedUsersList, setBlockedUsersList] = useState<any[]>([]);

  const refreshBlockedUsers = useCallback(() => {
    if (user) {
      setBlockedUsersList(getBlockedUsers(user.uid));
    }
  }, [user]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      // Load profile
      const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
      const profile = profileSnap.exists() ? profileSnap.data() : null;

      // Fallback to locally cached avatar if available
      if (typeof window !== 'undefined' && profile && !profile.photo_url) {
        const cached = localStorage.getItem(`explore_pune_avatar_${user.uid}`);
        if (cached) {
          profile.photo_url = cached;
        }
      }

      // Load favorites
      const favsSnap = await getDocs(
        query(collection(db, 'favorites'), where('user_id', '==', user.uid))
      );
      const favs = favsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Load visits
      const visitsSnap = await getDocs(
        query(collection(db, 'visits'), where('user_id', '==', user.uid))
      );
      const visits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Load badges
      const badgesSnap = await getDocs(
        query(collection(db, 'user_milestones'), where('user_id', '==', user.uid))
      );
      const badgePromises = badgesSnap.docs.map(async (d) => {
        const data = d.data();
        const milestoneSnap = data.milestone_id
          ? await getDoc(doc(db, 'milestones', data.milestone_id))
          : null;
        return { ...data, milestone: milestoneSnap?.exists() ? milestoneSnap.data() : null };
      });
      const badges = await Promise.all(badgePromises);

      // Load reviews
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('user_id', '==', user.uid))
      );
      const reviews = reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Load blogs
      const blogsSnap = await getDocs(
        query(collection(db, 'blogs'), where('author_id', '==', user.uid))
      );
      const blogs = blogsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setD({ profile, favs, visits, badges, reviews, blogs });
    } catch (e) {
      console.error('Error loading account:', e);
    }
  }, [user]);

  useEffect(() => {
    load();
    refreshBlockedUsers();

    const handleBlockedUpdated = () => refreshBlockedUsers();
    window.addEventListener('explore-pune-blocked-users-updated', handleBlockedUpdated);
    return () => {
      window.removeEventListener('explore-pune-blocked-users-updated', handleBlockedUpdated);
    };
  }, [load, refreshBlockedUsers]);

  if (!ready) {
    return (
      <main className="wrap" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading account details…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="wrap" style={{ paddingTop: 60, maxWidth: 500 }}>
        <div className="panel" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🔒</span>
          <h2>Sign in Required</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 20px' }}>
            Please sign in to view your saved places, recorded visits, and blogs.
          </p>
          <Link href="/login" className="btn">
            Sign In to Account
          </Link>
        </div>
      </main>
    );
  }

  if (!d) {
    return (
      <main className="wrap" style={{ paddingTop: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading your profile data…</p>
      </main>
    );
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setErr('');
    setMsg('');
    setBusy(true);
    try {
      await updateDoc(doc(db, 'profiles', user!.uid), {
        display_name: String(f.get('n')),
        bio: String(f.get('b')) || null,
        profile_visibility: String(f.get('v')),
        updated_at: new Date().toISOString(),
      });
      setMsg('✅ Profile updated successfully.');
    } catch (error: any) {
      setErr('Could not save: ' + (error?.message ?? 'unknown error'));
    } finally {
      setBusy(false);
    }
  }

  async function changePw(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (pw.length < 8) {
      setErr('For security, password must be at least 8 characters long.');
      return;
    }
    try {
      await updatePassword(user!, pw);
      setMsg('✅ Password updated successfully.');
      setPw('');
    } catch (error: any) {
      setErr(error?.message ?? 'Could not change password.');
    }
  }

  async function removeVisit(id: string) {
    await deleteDoc(doc(db, 'visits', id));
    load();
  }

  async function removeFavorite(id: string) {
    await deleteDoc(doc(db, 'favorites', id));
    load();
  }

  async function handleSavePhoto(dataUrl: string) {
    if (!user) return;
    try {
      // 1. Update Firestore profile document
      await updateDoc(doc(db, 'profiles', user.uid), {
        photo_url: dataUrl,
        updated_at: new Date().toISOString(),
      });

      // 2. Cache locally for instant loading across tabs/sessions
      try {
        localStorage.setItem(`explore_pune_avatar_${user.uid}`, dataUrl);
      } catch (storageErr) {
        console.warn('LocalStorage avatar cache error:', storageErr);
      }

      // 3. Update Firebase Auth user if supported
      try {
        await updateProfile(user, { photoURL: dataUrl });
      } catch (authErr) {
        console.info('Auth profile photoURL update:', authErr);
      }

      // 4. Update in-memory state
      setD((prev: any) => ({
        ...prev,
        profile: {
          ...(prev?.profile || {}),
          photo_url: dataUrl,
        },
      }));

      setIsPhotoUpdated(true);
      setTimeout(() => setIsPhotoUpdated(false), 700);
      setMsg(isMr ? '✅ प्रोफाईल फोटो यशस्वीरित्या अपडेट केला.' : '✅ Profile photo updated successfully.');
    } catch (error: any) {
      setErr('Could not save photo: ' + (error?.message ?? 'unknown error'));
      throw error;
    }
  }

  async function handleRemovePhoto() {
    if (!user) return;
    try {
      // 1. Update Firestore profile document
      await updateDoc(doc(db, 'profiles', user.uid), {
        photo_url: null,
        updated_at: new Date().toISOString(),
      });

      // 2. Clear localStorage cache
      try {
        localStorage.removeItem(`explore_pune_avatar_${user.uid}`);
      } catch (storageErr) {
        console.warn('LocalStorage error:', storageErr);
      }

      // 3. Clear Firebase Auth photoURL
      try {
        await updateProfile(user, { photoURL: '' });
      } catch (authErr) {
        console.info('Auth profile photoURL clear:', authErr);
      }

      // 4. Update in-memory state
      setD((prev: any) => ({
        ...prev,
        profile: {
          ...(prev?.profile || {}),
          photo_url: null,
        },
      }));

      setMsg(isMr ? '✅ प्रोफाईल फोटो काढण्यात आला.' : '✅ Profile photo removed.');
    } catch (error: any) {
      setErr('Could not remove photo: ' + (error?.message ?? 'unknown error'));
      throw error;
    }
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60, display: 'grid', gap: 24 }}>
      {/* Account Header */}
      <div
        className="panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Circular Profile Avatar with Camera Trigger */}
          <ProfileAvatar
            photoUrl={d.profile?.photo_url || user.photoURL || null}
            name={d.profile?.display_name || user.displayName}
            email={user.email}
            size={88}
            editable={true}
            onEditClick={() => setIsAvatarModalOpen(true)}
            isUpdated={isPhotoUpdated}
            altText={d.profile?.display_name || user.displayName || 'Profile Avatar'}
          />

          <div>
            <div className="hero-pill" style={{ marginBottom: 6 }}>
              <span>👤</span> {isMr ? 'सदस्य डॅशबोर्ड' : 'Member Dashboard'}
            </div>
            <h1 style={{ fontSize: 28, margin: '2px 0 4px', fontWeight: 800 }}>
              {d.profile?.display_name || user.displayName || 'Pune Explorer'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: 0 }}>
              {user.email} • {isMr ? 'सदस्यत्व:' : 'Member since'}{' '}
              {new Date(user.metadata.creationTime || '').toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById('edit-profile-form');
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const inputEl = document.getElementById('n');
                    inputEl?.focus();
                  }
                }}
                className="chip"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '5px 12px',
                  background: 'var(--line-light)',
                  color: 'var(--ink)',
                  border: '1px solid var(--line)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>✏️</span>
                <span>{isMr ? 'प्रोफाईल संपादित करा' : 'Edit Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="chip"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '5px 12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>📷</span>
                <span>{isMr ? 'फोटो बदला' : 'Change Photo'}</span>
              </button>
            </div>
          </div>
        </div>

        <button
          className="btn outline"
          onClick={async () => {
            await signOut(auth);
            router.push('/');
          }}
        >
          {isMr ? 'साइन आउट करा' : 'Sign Out'}
        </button>
      </div>

      {err && <p className="note err" role="alert">{err}</p>}
      {msg && <p className="note" role="status" style={{ background: 'var(--sage-bg)', color: 'var(--sage-ink)', borderColor: 'var(--sage-border)' }}>{msg}</p>}

      {/* Profile & Password Cards */}
      <div className="two" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <form id="edit-profile-form" className="panel" onSubmit={saveProfile}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 10,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <h2 style={{ fontSize: 18, margin: 0 }}>
              {isMr ? 'प्रोफाईल माहिती संपादित करा' : 'Edit Profile'}
            </h2>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>📷</span>
              <span>{isMr ? 'फोटो बदला' : 'Change Photo'}</span>
            </button>
          </div>
          <div className="field">
            <label htmlFor="n">Display Name</label>
            <input
              id="n"
              name="n"
              defaultValue={d.profile?.display_name ?? user.displayName ?? ''}
              minLength={2}
              maxLength={50}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="b">Bio</label>
            <input
              id="b"
              name="b"
              defaultValue={d.profile?.bio ?? ''}
              maxLength={500}
              placeholder="e.g. History enthusiast, Sahyadri weekend trekker"
            />
          </div>
          <div className="field">
            <label htmlFor="v">Profile Visibility</label>
            <select id="v" name="v" defaultValue={d.profile?.profile_visibility ?? 'public'}>
              <option value="public">Public (visible to community)</option>
              <option value="private">Private (only visible to you)</option>
            </select>
          </div>
          <button className="btn" disabled={busy}>
            Save Profile
          </button>
        </form>

        <form className="panel" onSubmit={changePw}>
          <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
            Security
          </h2>
          <div className="field">
            <label htmlFor="pw">New Password (8+ characters)</label>
            <input
              id="pw"
              type="password"
              minLength={8}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <button className="btn outline">Update Password</button>
        </form>
      </div>

      {/* Explorer Badges */}
      <section className="panel">
        <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 12 }}>
          Sahyadri & Pune Badges ({d.badges.length})
        </h2>
        {d.badges.length === 0 ? (
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
            No badges unlocked yet. Mark a place as visited or write a blog to earn your first badge!
          </p>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {d.badges.map((b: any, i: number) => (
              <span
                key={i}
                className="tier verified"
                style={{ padding: '6px 14px', fontSize: 13 }}
                title={b.milestone?.description}
              >
                🏆 {b.milestone?.name || 'Explorer'}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Saved Places */}
      <section className="panel">
        <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 14 }}>
          Saved Places ({d.favs.length})
        </h2>
        {d.favs.length === 0 ? (
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
            Nothing saved yet. Click &quot;Save Place&quot; on any destination page to bookmark it here.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {d.favs.map((f: any, i: number) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Link
                  href={`/places/${f.place_slug || f.place_id}`}
                  style={{ fontWeight: 600, color: 'var(--ink)' }}
                >
                  📍 {f.place_name || f.place_slug || 'Place'}
                </Link>
                <button
                  className="chip"
                  style={{ padding: '2px 8px', fontSize: 11 }}
                  onClick={() => removeFavorite(f.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Places Visited */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>
            Places Visited ({d.visits.length})
          </h2>
          <Link
            href="/journey"
            className="btn outline"
            style={{ padding: '6px 14px', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            🧭 View in My Journey →
          </Link>
        </div>
        {d.visits.length === 0 ? (
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
            No visits recorded yet. When you visit a Pune attraction, mark &quot;I&apos;ve Been Here&quot;!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {d.visits.map((v: any) => (
              <div
                key={v.id}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {v.image_url && (
                    <img
                      src={v.image_url}
                      alt={v.place_name || 'Proof'}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 6,
                        objectFit: 'cover',
                        border: '1px solid var(--line)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Link
                        href={`/places/${v.place_slug || v.place_id}`}
                        style={{ fontWeight: 700, color: 'var(--ink)' }}
                      >
                        🚩 {v.place_name || v.place_slug || 'Place'}
                      </Link>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: v.is_public ? '#ecfdf5' : '#f1f5f9',
                          color: v.is_public ? '#065f46' : '#64748b',
                          border: `1px solid ${v.is_public ? '#a7f3d0' : '#cbd5e1'}`,
                        }}
                      >
                        {v.is_public ? '🌐 Public (Community)' : '🔒 Private (Only Me)'}
                      </span>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: 13, display: 'block', marginTop: 2 }}>
                      Visited on {v.visited_at}
                    </span>
                    {v.notes && (
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-secondary)' }}>
                        Note: {v.notes}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="chip"
                  style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => removeVisit(v.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Your Blogs */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Your Blogs & Stories ({d.blogs.length})</h2>
          <Link className="btn" href="/blogs/new" style={{ padding: '6px 14px', fontSize: 13 }}>
            Write New Blog
          </Link>
        </div>
        {d.blogs.length === 0 ? (
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
            You haven&apos;t written any blog posts yet. Share your Pune memories with the world!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {d.blogs.map((b: any) => (
              <div
                key={b.id}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  {b.status === 'published' ? (
                    <Link href={`/blogs/${b.slug}`} style={{ fontWeight: 700, color: 'var(--ink)' }}>
                      {b.title}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{b.title}</span>
                  )}
                  <span style={{ marginLeft: 10, fontSize: 12 }} className={`tier ${b.status === 'published' ? 'verified' : ''}`}>
                    {b.is_draft ? 'Draft' : STATUS[b.status] ?? b.status}
                  </span>
                </div>
                {b.status === 'published' && (
                  <Link href={`/blogs/${b.slug}`} className="chip" style={{ fontSize: 12 }}>
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Community Safety & Privacy Settings (Rule 25) */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>
            🛡️ {isMr ? 'समुदाय सुरक्षितता व गोपनीयता सेटिंग्ज' : 'Community Safety & Privacy Settings'}
          </h2>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 999,
              background: '#ecfdf5',
              color: '#065f46',
            }}
          >
            ✓ {isMr ? 'मार्गदर्शक तत्त्वे मान्य' : 'Guidelines Compliant'}
          </span>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: '0 0 16px' }}>
          {isMr
            ? 'एक्सप्लोर पुणे समुदाय हा पर्यटनासाठी सुरक्षित, आदरयुक्त व जबाबदार मंच आहे. येथे तुम्ही ब्लॉक केलेल्या वापरकर्त्यांचे व्यवस्थापन करू शकता.'
            : 'Explore Pune Community is a travel-focused, respectful platform. You have full control over who can interact with you.'}
        </p>

        {/* Blocked Users Sub-panel */}
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
            🚫 {isMr ? 'ब्लॉक केलेले वापरकर्ते' : 'Blocked Users'} ({blockedUsersList.length})
          </h3>

          {blockedUsersList.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
              {isMr
                ? 'तुम्ही कोणत्याही वापरकर्त्याला ब्लॉक केलेले नाही.'
                : 'You have not blocked any users. If someone is harassing or posting spam, you can block them directly from their discussion card.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {blockedUsersList.map((blocked) => (
                <div
                  key={blocked.userId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {blocked.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        unblockUser(user.uid, blocked.userId);
                        refreshBlockedUsers();
                      }
                    }}
                    className="chip"
                    style={{ fontSize: 11.5, padding: '3px 10px', color: '#047857' }}
                  >
                    {isMr ? 'अनब्लॉक करा' : 'Unblock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Profile Avatar Upload & Crop Modal */}
      <ProfileAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentPhotoUrl={d.profile?.photo_url || user.photoURL || null}
        name={d.profile?.display_name || user.displayName}
        email={user.email}
        onSavePhoto={handleSavePhoto}
        onRemovePhoto={handleRemovePhoto}
      />
    </main>
  );
}
