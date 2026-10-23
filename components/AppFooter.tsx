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
