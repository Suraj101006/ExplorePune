'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc, setDoc, deleteDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';

export default function Reviews({ placeId }: { placeId: string }) {
  const { user } = useAuth();
  const { isMr } = useLanguage();
  const [list, setList] = useState<any[]>([]);
  const [mine, setMine] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const reviewsSnap = await getDocs(query(
        collection(db, 'reviews'),
        where('place_id', '==', placeId)
      ));
      const publishedDocs = reviewsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() } as any))
        .filter((r) => r.status === 'published')
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        .slice(0, 30);

      const reviews = await Promise.all(publishedDocs.map(async (data) => {
        const profileSnap = await getDoc(doc(db, 'profiles', data.user_id));
        return { ...data, profile: profileSnap.exists() ? profileSnap.data() : null };
      }));
      setList(reviews);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }

    if (user) {
      try {
        const myReviewId = `${user.uid}_${placeId}`;
        const mySnap = await getDoc(doc(db, 'reviews', myReviewId));
        if (mySnap.exists()) {
          const m = mySnap.data();
          setMine(m);
          setRating(m.rating);
          setText(m.review_text ?? '');
        } else {
          setMine(null);
        }
      } catch (e) {
        console.error('Failed to load user review:', e);
      }
    }
  }, [placeId, user]);

  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    if (text.length < 10 || text.length > 2000) {
      return setErr(isMr ? 'प्रतिक्रिया किमान १० ते कमाल २००० अक्षरांची असावी.' : 'Reviews need 10 to 2000 characters.');
    }
    try {
      const reviewId = `${user!.uid}_${placeId}`;
      await setDoc(doc(db, 'reviews', reviewId), {
        place_id: placeId,
        user_id: user!.uid,
        rating,
        review_text: text,
        status: 'pending',
        created_at: mine?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setMsg(isMr ? 'धन्यवाद! मॉडरेटरने मंजूर केल्यानंतर तुमची प्रतिक्रिया दिसेल.' : 'Thanks. Your review will appear once a moderator approves it.');
      load();
    } catch (error: any) {
      setErr(isMr ? 'जतन करता आले नाही.' : 'Could not save: ' + (error?.message ?? 'unknown error'));
    }
  }

  async function remove() {
    const reviewId = `${user!.uid}_${placeId}`;
    await deleteDoc(doc(db, 'reviews', reviewId));
    setMine(null); setText(''); setRating(5); load();
  }

  async function report(id: string) {
    const reason = prompt(isMr ? 'या प्रतिक्रियेमध्ये काय आक्षेपार्ह आहे?' : 'What is wrong with this review?');
    if (!reason) return;
    try {
      await addDoc(collection(db, 'reports'), {
        reporter_id: user!.uid,
        target_type: 'review',
        target_id: id,
        reason: reason.slice(0, 500),
        status: 'open',
        created_at: new Date().toISOString(),
      });
      alert(isMr ? 'धन्यवाद, मॉडरेटर याची तपासणी करतील.' : 'Thanks, a moderator will take a look.');
    } catch {
      alert(isMr ? 'तक्रार पाठवता आली नाही.' : 'Could not send the report.');
    }
  }

  return (
    <section className="panel" style={{ marginTop: 24 }}>
      <h2 style={{ marginTop: 0 }}>{isMr ? 'पर्यटकांच्या प्रतिक्रिया' : 'Reviews'}</h2>
      {list.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>
          {isMr ? 'अद्याप कोणत्याही प्रतिक्रिया नाहीत. तुमचा अनुभव शेअर करणारे पहिले व्हा!' : 'No reviews yet. Be the first to share what it was like.'}
        </p>
      )}
      {list.map((r) => (
        <article key={r.id} style={{ borderTop: '1px solid var(--line)', padding: '12px 0' }}>
          <strong>⭐ {r.rating}/5</strong> — {r.profile?.display_name ?? (isMr ? 'प्रवासी' : 'a traveller')}
          <p style={{ margin: '6px 0', whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>{r.review_text}</p>
          {user && r.user_id !== user.uid && (
            <button className="chip" style={{ fontSize: 11 }} onClick={() => report(r.id)}>
              {isMr ? 'तक्रार करा' : 'Report'}
            </button>
          )}
        </article>
      ))}

      {user ? (
        <form onSubmit={save} style={{ borderTop: '1px solid var(--line)', paddingTop: 16, marginTop: 12, display: 'grid', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>
            {mine
              ? (isMr ? 'तुमची प्रतिक्रिया' : 'Your review')
              : (isMr ? 'प्रतिक्रिया नोंदवा' : 'Write a review')}
            {mine?.status === 'pending' ? (isMr ? ' (मंजुरीच्या प्रतीक्षेत)' : ' (waiting for approval)') : ''}
          </h3>

          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="rt">{isMr ? 'रेटिंग (गुणवत्ता)' : 'Rating'}</label>
            <select id="rt" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} / 5 ⭐
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="rx">{isMr ? 'तुमचा अनुभव कसा होता? (१० ते २००० अक्षरे)' : 'What was it like? (10 to 2000 characters)'}</label>
            <textarea
              id="rx"
              value={text}
              onChange={(e) => setText(e.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
              placeholder={isMr ? 'उदा. येथील वातावरण अतिशय शांत आहे, सकाळी भेट देणे उत्तम...' : 'e.g. Beautiful view, recommended morning visit...'}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', font: 'inherit' }}
            />
          </div>

          {err && <p className="note err" role="alert">{err}</p>}
          {msg && <p className="note" role="status" style={{ background: 'var(--sage-bg)', color: 'var(--sage-ink)', borderColor: 'var(--sage-border)' }}>{msg}</p>}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">
              {mine ? (isMr ? 'प्रतिक्रिया बदला' : 'Update review') : (isMr ? 'प्रतिक्रिया पाठवा' : 'Submit review')}
            </button>
            {mine && (
              <button type="button" className="chip" onClick={remove}>
                {isMr ? 'हटवा' : 'Delete'}
              </button>
            )}
          </div>
        </form>
      ) : (
        <p style={{ marginTop: 14 }}>
          <Link href="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {isMr ? 'लॉगिन करा' : 'Sign in'}
          </Link>{' '}
          {isMr ? 'प्रतिक्रिया देण्यासाठी.' : 'to write a review.'}
        </p>
      )}
    </section>
  );
}
