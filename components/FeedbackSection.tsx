'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';

export default function FeedbackSection() {
  const { user, ready } = useAuth();
  const { lang, isMr } = useLanguage();
  const [rating, setRating] = useState(5);
  const [type, setType] = useState('experience');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);

  // Sync user email & name when signed in
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user, email, name]);

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || message.length < 5) {
      setErr(
        isMr
          ? 'कृपया किमान ५ अक्षरांचा अभिप्राय लिहा.'
          : 'Please enter feedback of at least 5 characters.'
      );
      return;
    }

    const targetEmail = email.trim() || user?.email || '';
    if (!targetEmail || !targetEmail.includes('@')) {
      setErr(
        isMr
          ? 'कृपया आभार ईमेल प्राप्त करण्यासाठी वैध ईमेल पत्ता टाका.'
          : 'Please enter a valid email address to receive your confirmation.'
      );
      return;
    }

    setBusy(true);
    setErr('');
    setMsg('');

    const profileName = name.trim() || user?.displayName || user?.email?.split('@')[0] || 'Explorer';

    try {
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          type,
          message: message.trim(),
          email: targetEmail,
          userName: profileName,
          userId: user?.uid || 'anonymous',
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit feedback');
      }

      setMessage('');
      setRating(5);
      const successText =
        data.message ||
        (isMr
          ? '🙏 आपले बहुमोल मत आणि अभिप्राय नोंदवल्याबद्दल मनःपूर्वक धन्यवाद! एक्सप्लोर पुणे अधिक समृद्ध करण्यासाठी आपल्या सूचनेचा आम्ही मनापासून आदर करतो.'
          : 'Thank you for sharing your valuable opinion! We truly appreciate your thoughtful feedback and support in making Explore Pune better for everyone.');

      setMsg(successText);
      setPopupOpen(true); // POP UP THE POLITE CONFIRMATION MESSAGE AS REQUESTED
    } catch (submitErr: any) {
      setErr(
        submitErr?.message ||
          (isMr
            ? 'अभिप्राय पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा.'
            : 'Could not send feedback. Please try again.')
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="wrap" style={{ margin: '48px auto 32px' }}>
      <div
        className="panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: '1.5px solid var(--primary-border)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ maxWidth: 640, marginBottom: 24 }}>
          <div className="hero-pill" style={{ marginBottom: 10 }}>
            <span>💬</span> {isMr ? 'अभिप्राय व सूचना' : 'Community Feedback & Suggestions'}
          </div>
          <h2 style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--ink)' }}>
            {isMr ? 'तुमचा मौल्यवान अभिप्राय नोंदवा' : 'Help Us Improve Explore Pune'}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            {isMr
              ? 'एक्सप्लोर पुणे अधिक समृद्ध व उपयुक्त बनवण्यासाठी आपल्या सूचना, अनुभव किंवा नवीन ठिकाणे नक्की सुचवा.'
              : 'Share your travel insights, suggest new hidden spots, or report transit and ticket updates to help keep Explore Pune accurate for everyone.'}
          </p>
        </div>

        {/* Account Status / Sign In prompt */}
        {ready && !user ? (
          <div
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 13,
              color: '#475569',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span>
              ℹ️ {isMr
                ? 'तुम्ही थेट नाव व ईमेल टाकून अभिप्राय पाठवू शकता किंवा आपल्या खात्याशी जोडण्यासाठी लॉगिन करू शकता.'
                : 'You can submit feedback directly below, or sign in to link with your account profile.'}
            </span>
            <Link
              href="/login"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: '#c2410c',
                textDecoration: 'underline',
              }}
            >
              {isMr ? 'लॉगिन करा →' : 'Sign In →'}
            </Link>
          </div>
        ) : ready && user ? (
          <div
            style={{
              padding: '10px 14px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              fontSize: 13,
              color: '#065f46',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>✓</span>
            <span>
              {isMr
                ? `लॉगिन केले आहे: ${user.displayName || user.email}`
                : `Signed in as ${user.displayName || user.email}`}
            </span>
          </div>
        ) : null}

        {/* Feedback Submission Form */}
        <form onSubmit={submitFeedback} style={{ display: 'grid', gap: 16 }}>
            {msg && (
              <div
                className="note"
                style={{
                  background: 'var(--sage-bg)',
                  color: 'var(--sage-ink)',
                  borderColor: 'var(--sage-border)',
                  padding: '14px 18px',
                  borderRadius: 10,
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                {msg}
              </div>
            )}
            {err && <div className="note err">{err}</div>}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
              }}
            >
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="fb-rating">
                  {isMr ? 'पुणे भ्रमंती अनुभव (रेटिंग)' : 'Your Overall Experience'}
                </label>
                <select
                  id="fb-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5/5 - {isMr ? 'उत्कृष्ट' : 'Excellent'}</option>
                  <option value={4}>⭐⭐⭐⭐ 4/5 - {isMr ? 'खूप छान' : 'Very Good'}</option>
                  <option value={3}>⭐⭐⭐ 3/5 - {isMr ? 'चांगला' : 'Average'}</option>
                  <option value={2}>⭐⭐ 2/5 - {isMr ? 'सुधारणा हवी' : 'Needs Work'}</option>
                  <option value={1}>⭐ 1/5 - {isMr ? 'कमी' : 'Poor'}</option>
                </select>
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="fb-type">{isMr ? 'अभिप्राय प्रकार' : 'Feedback Category'}</label>
                <select id="fb-type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="experience">
                    {isMr ? 'प्रवास अनुभव' : 'Travel Experience'}
                  </option>
                  <option value="new_spot">
                    {isMr ? 'नवीन ठिकाणाची शिफारस' : 'Suggest a New Spot'}
                  </option>
                  <option value="correction">
                    {isMr ? 'वेळ / तिकीट दुरुस्ती' : 'Hours / Ticket Correction'}
                  </option>
                  <option value="feature">
                    {isMr ? 'नवीन फीचरची कल्पना' : 'Feature Suggestion'}
                  </option>
                </select>
              </div>
            </div>

            {/* User Profile Name & Email */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="fb-name">
                  {isMr ? 'आपले नाव (Profile Name)' : 'Your Profile Name'}
                </label>
                <input
                  id="fb-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                />
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="fb-email">
                  {isMr ? 'ईमेल पत्ता' : 'Email Address'}
                </label>
                <input
                  id="fb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="fb-msg">
                {isMr ? 'तुमचा संदेश किंवा सूचना' : 'Your Detailed Feedback or Suggestion'}
              </label>
              <textarea
                id="fb-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                maxLength={1000}
                placeholder={
                  isMr
                    ? 'उदा. सिंहगड किंवा शनिवार वाड्याबद्दल तुमची सूचना येथे लिहा...'
                    : 'Share what you loved, recommend a spot, or tell us how to make this guide better...'
                }
              />
            </div>

            <div>
              <button
                className="btn"
                disabled={busy}
                style={{ padding: '11px 26px', fontSize: 14, fontWeight: 700 }}
              >
                {busy
                  ? isMr
                    ? 'पाठवत आहे…'
                    : 'Sending…'
                  : isMr
                  ? 'अभिप्राय पाठवा ✨'
                  : 'Submit Feedback ✨'}
              </button>
            </div>
          </form>
      </div>

      {/* POLITE & GRAMMATICALLY STRUCTURED SUCCESS POPUP AS REQUESTED */}
      {popupOpen && (
        <div
          onClick={() => setPopupOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius)',
              maxWidth: 480,
              width: '100%',
              padding: 28,
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '2px solid #10b981',
              animation: 'fadeScaleIn 0.25s ease-out',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'grid',
                placeItems: 'center',
                fontSize: 28,
                margin: '0 auto 14px',
                border: '2px solid #a7f3d0',
              }}
            >
              ✓
            </div>

            <h3 style={{ margin: '0 0 10px', fontSize: 20, color: '#065f46', fontWeight: 800 }}>
              {isMr ? 'आपल्या बहुमोल मतासाठी मनःपूर्वक धन्यवाद! 🙏' : 'Thank You for Your Valuable Feedback! 🙏'}
            </h3>

            <p style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.6, margin: '0 0 16px' }}>
              {isMr
                ? 'एक्सप्लोर पुणे अधिक समृद्ध आणि परिपूर्ण बनवण्यासाठी आपल्या विचारपूर्वक दिलेल्या सूचनेचा आम्ही मनापासून आदर करतो. आपली नोंद सुरक्षितपणे जतन करण्यात आली आहे.'
                : 'We truly appreciate you taking the time to share your feedback and suggestions. Your input is vital in making Explore Pune better and more verified for everyone visiting Pune.'}
            </p>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#065f46', textAlign: 'left' }}>
              <strong>✉️ {isMr ? 'पुष्टीकरण ईमेल:' : 'Confirmation Email:'}</strong>{' '}
              {isMr
                ? 'एक्सप्लोर पुणे टीमकडून (explorepune232@gmail.com) आपल्या ईमेलवर आभार संदेश पाठवला गेला आहे.'
                : 'A Thank-You confirmation has been recorded and dispatched from explorepune232@gmail.com (ExplorePune Team).'}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, marginBottom: 18, fontSize: 12.5, color: '#64748b' }}>
              {isMr ? 'सस्नेह धन्यवाद,' : 'With sincere appreciation,'}
              <div style={{ fontWeight: 800, color: '#c2410c', fontSize: 14, marginTop: 2 }}>
                {isMr ? 'एक्सप्लोर पुणे टीम' : 'Explore Pune Team'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              className="btn"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: 14,
                fontWeight: 700,
                background: '#047857',
              }}
            >
              {isMr ? 'समजले / बंद करा' : 'Got It / Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
