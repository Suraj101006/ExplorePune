'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import BrandLogo from '@/components/BrandLogo';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Footprints,
  Route,
  Award,
  BookOpen,
  Info,
  Menu,
  X,
  Users,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

// Defer interactive auth & drawer modals so they do not block initial rendering or critical bundle evaluation
const AuthNav = dynamic(() => import('@/components/AuthNav'), {
  ssr: false,
  loading: () => <span style={{ display: 'inline-block', width: 68, height: 32 }} />,
});
const MobileAuthNav = dynamic(() => import('@/components/MobileAuthNav'), { ssr: false });
const SavedPlacesDrawer = dynamic(() => import('@/components/SavedPlacesDrawer'), { ssr: false });
const EmergencyHelplineModal = dynamic(() => import('@/components/EmergencyHelplineModal'), { ssr: false });

export default function AppHeader() {
  const { t, isMr } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.explore'), Icon: Compass },
    { href: '/journey', label: t('nav.journey') || (isMr ? 'माझी सफर' : 'My Journey'), Icon: Footprints },
    { href: '/planner', label: t('nav.planner'), Icon: Route },
    { href: '/community', label: isMr ? 'समुदाय' : 'Community', Icon: Users },
    { href: '/milestones', label: t('nav.milestones'), Icon: Award },
    { href: '/blogs', label: t('nav.blogs'), Icon: BookOpen },
    { href: '/about', label: t('nav.about'), Icon: Info },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { href: '/help/website-guide', label: isMr ? 'मार्गदर्शिका' : 'Website Guide', Icon: HelpCircle },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        {/* Brand Identity */}
        <Link href="/" className="brand" aria-label="Explore Pune Home">
          <BrandLogo
            size={46}
            withBadge
            priority
            alt="Explore Pune Logo"
            className="brand-logo-img"
          />
          <div className="brand-text-col" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span className="brand-title" style={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Explore<span style={{ color: 'var(--primary)' }}> Pune</span>
            </span>
            <span className="brand-subtitle" style={{ fontWeight: 700, letterSpacing: '0.06em', color: 'var(--clay)', textTransform: 'uppercase' }}>
              {isMr ? 'पुण्यनगरी • सह्याद्री' : 'Heritage & Trails'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const active = isLinkActive(item.href);
            const { Icon } = item;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'active-nav-link' : ''}
              >
                <Icon size={14} strokeWidth={2.2} className="desktop-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Global Utilities & Action Controls */}
        <div className="header-utilities">
          {/* Emergency Tourist Helpline Modal */}
          <div className="nav-util-item hide-on-mobile">
            <EmergencyHelplineModal />
          </div>

          {/* User Sign-In / Account & Logout */}
          <div className="nav-util-item hide-on-mobile">
            <AuthNav />
          </div>

          {/* Interactive Website Guide / Handbook Link */}
          <div className="nav-util-item hide-on-mobile hide-on-compact-desktop">
            <Link
              href="/help/website-guide"
              className={`nav-guide-link ${isLinkActive('/help') ? 'active-nav-link' : ''}`}
              title={isMr ? 'वेबसाइट मार्गदर्शिका (Website Guide)' : 'Interactive Website Guide & Explorer Handbook'}
              aria-label="Website Guide"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12.5px',
                fontWeight: 650,
                textDecoration: 'none',
                color: isLinkActive('/help') ? 'var(--primary)' : 'var(--ink-secondary)',
                border: '1px solid var(--line)',
                background: isLinkActive('/help') ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.18s ease',
              }}
            >
              <HelpCircle size={14} strokeWidth={2.2} />
              <span>{isMr ? 'मार्गदर्शिका' : 'Guide'}</span>
            </Link>
          </div>

          {/* Saved Places Wishlist Drawer */}
          <div className="nav-util-item">
            <SavedPlacesDrawer />
          </div>

          {/* Bilingual Language Switcher */}
          <div className="nav-util-item">
            <LanguageToggle />
          </div>

          {/* Dark / Light Theme Toggle Key & Button */}
          <div className="nav-util-item">
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-panel"
          style={{
            borderTop: '1px solid var(--line)',
            background: 'var(--card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Mobile Auth / User Profile Card */}
          <MobileAuthNav onClose={() => setMobileMenuOpen(false)} />

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mobileNavLinks.map((item) => {
              const active = isLinkActive(item.href);
              const { Icon } = item;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '15px',
                    fontWeight: active ? 800 : 600,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--primary-light)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} strokeWidth={2} style={{ color: active ? 'var(--primary)' : 'var(--muted)' }} />
                    <span>{item.label}</span>
                  </span>
                  {active && <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>●</span>}
                </Link>
              );
            })}
          </div>

          {/* Mobile Quick Actions Row */}
          <div
            style={{
              paddingTop: 12,
              marginTop: 6,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SavedPlacesDrawer />
              <EmergencyHelplineModal />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ThemeToggle showShortcutBadge={false} />
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
