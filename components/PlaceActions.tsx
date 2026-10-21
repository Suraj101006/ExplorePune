'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import { compressImageFile } from '@/lib/imageUtils';

export default function PlaceActions({
  placeId,
  placeSlug,
  placeName,
}: {
  placeId: string;
  placeSlug?: string;
  placeName?: string;
}) {
  const { user, ready } = useAuth();
  const { isMr } = useLanguage();
  const [fav, setFav] = useState(false);
  const [visits, setVisits] = useState(0);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [isPublic, setIsPublic] = useState(false); // DEFAULT TO PRIVATE AS REQUESTED
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const favDoc = await getDoc(doc(db, 'favorites', `${user.uid}_${placeId}`));
        setFav(favDoc.exists());
        const visitsSnap = await getDocs(
          query(collection(db, 'visits'), where('place_id', '==', placeId), where('user_id', '==', user.uid))
        );
        setVisits(visitsSnap.size);
      } catch (e) {
        console.error('Error checking actions:', e);
      }
    })();
  }, [user, placeId]);

  if (!ready) return null;
  if (!user) {
    return (
      <div
        className="note"
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span>
          💡{' '}
          <Link href="/login" style={{ fontWeight: 700 }}>
            {isMr ? 'लॉगिन करा' : 'Sign in'}
          </Link>{' '}
          {isMr
            ? 'हे ठिकाण जतन करण्यासाठी, छायाचित्र जोडून यशोगाथा पदके मिळवण्यासाठी.'
            : 'to save this spot, upload place photos, and earn Pune Explorer milestone badges.'}
        </span>
        <Link href="/login" className="btn" style={{ padding: '6px 14px', fontSize: 13 }}>
          {isMr ? 'लॉगिन करा' : 'Sign In'}
        </Link>
      </div>
    );
  }

  async function toggleFav() {
    const favId = `${user!.uid}_${placeId}`;
    try {
      if (fav) {
        await deleteDoc(doc(db, 'favorites', favId));
      } else {
        await setDoc(doc(db, 'favorites', favId), {
          place_id: placeId,
          place_slug: placeSlug || placeId,
          place_name: placeName || 'Pune Spot',
          user_id: user!.uid,
          created_at: new Date().toISOString(),
        });
      }
      setFav(!fav);
    } catch {
      setMsg(isMr ? 'जतन करता आले नाही.' : 'Could not update your saved places.');
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    try {
      setUploading(true);
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  async function visit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!imagePreview) {
      setErrorMsg(
        isMr
          ? '⚠️ यशोगाथा पदक पूर्ण करण्यासाठी कृपया या ठिकाणाचे छायाचित्र (फोटो) जोडा.'
          : '⚠️ To complete the milestone check-in, please add a photo of this place.'
      );
      return;
    }

    try {
      setUploading(true);
      const visitId = `${user!.uid}_${placeId}_${Date.now()}`;
      await setDoc(doc(db, 'visits', visitId), {
        place_id: placeId,
        place_slug: placeSlug || placeId,
        place_name: placeName || 'Pune Spot',
        user_id: user!.uid,
        user_name: user!.displayName || user!.email?.split('@')[0] || 'Pune Explorer',
        user_avatar: user!.photoURL || null,
        visited_at: date,
        notes: note || null,
        image_url: imagePreview,
        is_public: isPublic, // STRICT PRIVACY OPTION (DEFAULT FALSE / PRIVATE)
        created_at: new Date().toISOString(),
      });

      setVisits((n) => n + 1);
      setOpen(false);
      setNote('');
      setImagePreview(null);
      setIsPublic(false); // Reset to default private
      setMsg(
        isMr
          ? (isPublic ? '🎉 छायाचित्र जोडले! सार्वजनिक गॅलरी व यशोगाथा अपडेट झाली.' : '🔒 भेट व खाजगी छायाचित्र यशस्वीरीत्या जतन केले!')
          : (isPublic ? '🎉 Photo posted to Community Gallery! Milestone updated.' : '🔒 Visit & private photo verified for milestone!')
      );

      // Trigger custom events so other components (e.g. Community Gallery) refresh live
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('explore-pune-visit-logged', { detail: { placeId, isPublic } }));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(isMr ? 'नोंद करता आली नाही. कृपया पुन्हा प्रयत्न करा.' : 'Could not record the visit. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ margin: '0 0 24px' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className={fav ? 'btn' : 'btn outline'}
          onClick={toggleFav}
          aria-pressed={fav}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          {fav
            ? (isMr ? '❤️ जतन केलेले' : '❤️ Saved to Places')
            : (isMr ? '🤍 जतन करा' : '🤍 Save Place')}
        </button>

        <button
          className="btn clay"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <span>📸</span>
          <span>{isMr ? 'भेट नोंदवा व फोटो जोडा' : "I've Been Here (Photo Proof)"}</span>
          {visits > 0 && <span style={{ opacity: 0.85 }}>({visits}x)</span>}
        </button>

        {msg && <span style={{ fontSize: 13, fontWeight: 700, color: '#047857' }}>{msg}</span>}
      </div>

      {open && (
        <form
          onSubmit={visit}
          className="panel"
          style={{
            marginTop: 14,
            display: 'grid',
            gap: 14,
            maxWidth: 520,
            border: '2px solid var(--primary-border)',
            background: 'linear-gradient(to bottom, var(--primary-light) 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📸</span>
              <span>{isMr ? 'यशोगाथा पूर्तता व भेट नोंदणी' : 'Log Visit & Complete Milestone'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--muted)' }}
            >
              ✕
            </button>
          </div>

          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
            {isMr
              ? 'हे ठिकाण पूर्ण म्हणून चिन्हांकित करण्यासाठी आणि आपले यशोगाथा पदक अनलॉक करण्यासाठी या ठिकाणचे छायाचित्र जोडा.'
              : 'To mark this place as completed and earn explorer milestones, upload a photo taken at this location.'}
          </p>

          {/* Date of Visit */}
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="vd">{isMr ? 'भेटीची तारीख' : 'Date of Visit'}</label>
            <input
              id="vd"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Photo Upload (REQUIRED FOR MILESTONE COMPLETION) */}
          <div className="field" style={{ margin: 0 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{isMr ? 'ठिकाणाचे छायाचित्र (आवश्यक)' : 'Place Photo Proof (Required)'}</span>
              <span style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700 }}>
                {imagePreview ? (isMr ? '✓ फोटो निवडला' : '✓ Photo Selected') : (isMr ? '* आवश्यक' : '* Required')}
              </span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="place-photo-input"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '20px',
                  border: '2px dashed var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 28 }}>📷</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                  {uploading
                    ? (isMr ? 'फोटो प्रोसेस होत आहे…' : 'Processing photo…')
                    : (isMr ? 'गॅलरीतून फोटो निवडा किंवा कॅमेरा वापरा' : 'Upload photo or take picture')}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  {isMr ? 'पीएनजी, जेपीईजी (आपोआप कॉम्प्रेस केले जाईल)' : 'PNG, JPEG up to 10MB (auto-compressed)'}
                </span>
              </button>
            ) : (
              <div
                style={{
                  position: 'relative',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#000',
                  maxHeight: 200,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Visit proof"
                  style={{ maxHeight: 200, width: 'auto', objectFit: 'contain' }}
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Privacy Option (DEFAULT: PRIVATE AS REQUESTED) */}
          <div
            style={{
              padding: '12px 14px',
              background: isPublic ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${isPublic ? '#86efac' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
              {isMr ? 'छायाचित्र गोपनीयता (Privacy Settings):' : 'Photo Visibility & Privacy:'}
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {/* Private Option (Default) */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 12.5,
                  color: !isPublic ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: !isPublic ? 600 : 400,
                }}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  style={{ width: 'auto', marginTop: 2 }}
                />
                <div>
                  <strong>🔒 {isMr ? 'खाजगी (Private - डीफॉल्ट)' : 'Private (Only Me - Default)'}</strong>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                    {isMr
                      ? 'केवळ तुमच्या वैयक्तिक खात्यात व यशोगाथा प्रगतीमध्ये दिसेल.'
                      : 'Only visible in your personal account and milestone progress.'}
                  </div>
                </div>
              </label>

              {/* Public Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 12.5,
                  color: isPublic ? '#047857' : 'var(--muted)',
                  fontWeight: isPublic ? 600 : 400,
                }}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  style={{ width: 'auto', marginTop: 2 }}
                />
                <div>
                  <strong>🌐 {isMr ? 'सार्वजनिक (Public Community Gallery)' : 'Public (Community Gallery)'}</strong>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                    {isMr
                      ? 'इतर सर्व प्रवाशांना या ठिकाणाच्या सार्वजनिक गॅलरीमध्ये तुमचे फोटो दिसेल.'
                      : 'Show on this place page in the Community Gallery for fellow travelers to see.'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Optional Note */}
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="vn">{isMr ? 'टीप किंवा अनुभव (ऐच्छिक)' : 'Note or Caption (optional)'}</label>
            <input
              id="vn"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              placeholder={isMr ? 'उदा. सकाळी ७ वाजताचा सूर्योदय अप्रतिम होता!' : 'e.g. Stunning sunrise view from the summit!'}
            />
          </div>

          {errorMsg && (
            <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button
            className="btn"
            disabled={uploading}
            style={{ width: '100%', padding: '10px', fontSize: 13, fontWeight: 700 }}
          >
            {uploading
              ? (isMr ? 'अपलोड करत आहे…' : 'Uploading visit…')
              : (isMr ? '✓ भेट निश्चित करा व यशोगाथा मिळवा' : '✓ Confirm Check-in & Complete Milestone')}
          </button>
        </form>
      )}
    </div>
  );
}
