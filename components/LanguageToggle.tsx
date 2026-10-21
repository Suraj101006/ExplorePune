'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#f1f5f9',
        border: '1px solid var(--line)',
        borderRadius: '999px',
        padding: '2px',
        fontSize: '12px',
        fontWeight: 700,
      }}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        style={{
          border: 'none',
          background: lang === 'en' ? 'var(--primary)' : 'transparent',
          color: lang === 'en' ? '#ffffff' : 'var(--muted)',
          padding: '4px 10px',
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          fontSize: '11px',
          fontWeight: 700,
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('mr')}
        style={{
          border: 'none',
          background: lang === 'mr' ? 'var(--primary)' : 'transparent',
          color: lang === 'mr' ? '#ffffff' : 'var(--muted)',
          padding: '4px 10px',
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: 'var(--deva)',
        }}
      >
        मराठी
      </button>
    </div>
  );
}
