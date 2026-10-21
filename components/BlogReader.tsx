'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';

export default function BlogReader({ content }: { content: string }) {
  const { user, ready } = useAuth();
  const { isMr } = useLanguage();

  if (!ready) {
    return <div style={{ color: 'var(--muted)', padding: '20px 0' }}>Loading story…</div>;
  }

  // If user is logged in, show full story
  if (user) {
    return (
      <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-secondary)' }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {content || '*No content provided.*'}
        </ReactMarkdown>
      </div>
    );
  }

  // If NOT logged in: Show opening snippet then a locked box
  const snippet = content ? content.slice(0, 220) + '…' : '';

  return (
    <div>
      {/* Blurred preview snippet */}
      <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--ink-secondary)', marginBottom: 20 }}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {snippet}
        </ReactMarkdown>
      </div>

      {/* Locked Content Card */}
      <div
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, var(--primary-light) 100%)',
          border: '1.5px dashed var(--primary-border)',
          borderRadius: 16,
          boxShadow: '0 8px 24px -6px rgba(0,0,0,0.06)',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: 42, display: 'block', marginBottom: 12 }}>🔒</span>
        <h3 style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--ink)' }}>
          {isMr ? 'संपूर्ण कथा वाचण्यासाठी कृपया लॉगिन करा' : 'Sign In to Read the Full Story'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: '44ch', margin: '0 auto 22px', lineHeight: 1.6 }}>
          {isMr
            ? 'ही संपूर्ण पर्यटन कथा, सह्याद्री ट्रेकचे नकाशे आणि स्थानिक सूचना वाचण्यासाठी विनामूल्य Explore Pune खात्यात लॉगिन करा.'
            : 'Access complete Sahyadri trek tales, photography, itinerary notes, and traveler recommendations with a free Explore Pune account.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" className="btn clay" style={{ padding: '10px 26px', fontSize: 14 }}>
            {isMr ? 'लॉगिन करा' : 'Sign In Now'}
          </Link>
          <Link href="/blogs" className="btn outline" style={{ padding: '10px 20px', fontSize: 14 }}>
            {isMr ? 'इतर कथा पहा' : 'Browse Other Stories'}
          </Link>
        </div>
      </div>
    </div>
  );
}
