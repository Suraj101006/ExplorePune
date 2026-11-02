'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="lang-toggle-wrap"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`lang-btn ${lang === 'en' ? 'lang-btn-active' : ''}`}
        style={{
          background: lang === 'en' ? 'var(--primary)' : 'transparent',
          color: lang === 'en' ? '#ffffff' : '#334155',
          fontWeight: 700,
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('mr')}
        className={`lang-btn ${lang === 'mr' ? 'lang-btn-active' : ''}`}
        style={{
          background: lang === 'mr' ? 'var(--primary)' : 'transparent',
          color: lang === 'mr' ? '#ffffff' : '#334155',
          fontWeight: 700,
          fontFamily: 'var(--deva)',
        }}
      >
        मराठी
      </button>
    </div>
  );
}
