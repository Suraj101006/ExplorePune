'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';

export default function AppFooter() {
  const { t, isMr } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div style={{ maxWidth: 540 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Image
              src="/images/logo.svg"
              alt="Explore Pune Logo"
              width={30}
              height={30}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <strong style={{ fontSize: 16, color: 'var(--ink)' }}>Explore Pune</strong>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
            {isMr
              ? 'पुणे आणि सह्याद्री परिसरातील ऐतिहासिक व प्रेक्षणीय स्थळांचे परिपूर्ण डिजिटल मार्गदर्शक.'
              : 'The definitive local guide to historic forts, Peshwa wadas, ancient temples, and Sahyadri trails across Pune.'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-secondary)', fontWeight: 500 }}>
            {isMr ? (
              <>
                <strong style={{ color: 'var(--ink)', fontFamily: 'var(--deva)' }}>सुरज ढोक</strong>,{' '}
                <strong style={{ color: 'var(--ink)', fontFamily: 'var(--deva)' }}>साहिल जाधव</strong> आणि{' '}
                <strong style={{ color: 'var(--ink)', fontFamily: 'var(--deva)' }}>ईशान काकडे</strong> यांनी पुणेकरांसाठी व पर्यटकांसाठी प्रेमाने साकारले ❤️
              </>
            ) : (
              <>
                Crafted with ❤️ by <strong style={{ color: 'var(--ink)' }}>Suraj Dhok</strong>,{' '}
                <strong style={{ color: 'var(--ink)' }}>Sahil Jadhav</strong> &{' '}
                <strong style={{ color: 'var(--ink)' }}>Ishan Kakade</strong> for Pune Explorers.
              </>
            )}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
            Maps powered by <strong style={{ color: 'var(--ink)' }}>Google Maps</strong> & Pune Transit Network.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/">{t('nav.explore')}</Link>
          <Link href="/journey">{t('nav.journey') || (isMr ? 'माझी सफर' : 'My Journey')}</Link>
          <Link href="/planner">{t('nav.planner')}</Link>
          <Link href="/community">{isMr ? 'समुदाय' : 'Community'}</Link>
          <Link href="/milestones">{t('nav.milestones')}</Link>
          <Link href="/blogs">{t('nav.blogs')}</Link>
          <Link href="/about">{t('nav.about') || (isMr ? 'आमच्याबद्दल' : 'About')}</Link>
          <Link href="/data">{isMr ? 'डेटा पद्धत' : 'Data'}</Link>
          <Link href="/privacy">{isMr ? 'गोपनीयता (DPDP)' : 'Privacy'}</Link>
          <Link href="/terms">{isMr ? 'सेवा अटी' : 'Terms'}</Link>
        </div>

        {/* Official Civic & Heritage Portals (Authoritative External References) */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid var(--line)',
            marginTop: 20,
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
            {isMr ? 'अधिकृत पर्यटन व वारसा दुवे' : 'Official Heritage & Tourism Portals'}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12.5 }}>
            <a
              href="https://maharashtratourism.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}
            >
              Maharashtra Tourism (MTDC) ↗
            </a>
            <a
              href="https://asi.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}
            >
              Archaeological Survey of India (ASI) ↗
            </a>
            <a
              href="https://pmc.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}
            >
              Pune Municipal Corporation (PMC) ↗
            </a>
            <a
              href="https://pmpml.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}
            >
              PMPML Public Bus Transit ↗
            </a>
            <a
              href="https://www.punemetrorail.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-secondary)', textDecoration: 'none' }}
            >
              Pune Metro Rail ↗
            </a>
          </div>
        </div>

        {/* Social Sharing Options */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid var(--line)',
            marginTop: 16,
            paddingTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
            {isMr ? 'पुणे वारसा मार्गदर्शक शेअर करा:' : 'Share Explore Pune Guide:'}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://api.whatsapp.com/send?text=Explore%20Pune%20-%20Curated%20Field%20Guide%20to%20Historic%20Forts%2C%20Wadas%20%26%20Trip%20Planner%3A%20https%3A%2F%2Fexplore-pune-eosin.vercel.app%2F"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share Explore Pune on WhatsApp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 999,
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>💬</span> WhatsApp
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=Explore%20Pune%20-%20The%20Curated%20Field%20Guide%20to%20Historic%20Forts%2C%20Wadas%20%26%20Trip%20Planner&url=https%3A%2F%2Fexplore-pune-eosin.vercel.app%2F"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share Explore Pune on X (Twitter)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 999,
                background: '#f8fafc',
                color: '#0f172a',
                border: '1px solid var(--line)',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>𝕏</span> Twitter / X
            </a>
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexplore-pune-eosin.vercel.app%2F"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share Explore Pune on LinkedIn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 999,
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>💼</span> LinkedIn
            </a>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            borderTop: '1px solid var(--line)',
            marginTop: 20,
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12.5,
            color: 'var(--muted)',
          }}
        >
          <div>
            <strong style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>
              @ 2026 right reserved to ExplorePune team
            </strong>{' '}
            • Suraj Dhok, Sahil Jadhav & Ishan Kakade
          </div>
          <div>
            {isMr
              ? 'पुणे सांस्कृतिक वारसा, मेट्रो व सार्वजनिक बस मार्गदर्शक'
              : 'Pune Heritage, Culture & Transit Guide'}
          </div>
        </div>
      </div>
    </footer>
  );
}
