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
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import AuthNav from '@/components/AuthNav';
import MobileAuthNav from '@/components/MobileAuthNav';
import SavedPlacesDrawer from '@/components/SavedPlacesDrawer';
import EmergencyHelplineModal from '@/components/EmergencyHelplineModal';

export default function AppHeader() {
  const { t, isMr } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.explore'), Icon: Compass },
    { href: '/destinations', label: isMr ? 'सर्व ठिकाणे' : 'Destinations', Icon: MapPin },
    { href: '/journey', label: t('nav.journey') || (isMr ? 'माझी सफर' : 'My Journey'), Icon: Footprints },
    { href: '/planner', label: t('nav.planner'), Icon: Route },
    { href: '/community', label: isMr ? 'समुदाय' : 'Community', Icon: Users },
    { href: '/milestones', label: t('nav.milestones'), Icon: Award },
    { href: '/blogs', label: t('nav.blogs'), Icon: BookOpen },
    { href: '/help/website-guide', label: isMr ? 'मार्गदर्शिका' : 'Guide', Icon: HelpCircle },
    { href: '/about', label: t('nav.about'), Icon: Info },
  ];

  const mobileNavLinks = [...navLinks];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="site-header site-header-two-floor">
      <div className="wrap site-header-inner">
        {/* Brand Identity */}
        <Link href="/" className="brand" aria-label="Explore Pune Home">
          <BrandLogo
            size={52}
            withBadge
            priority
            alt="Explore Pune Logo"
            className="brand-logo-img"
          />
          <div className="brand-text-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.15 }}>
            <span className="brand-title" style={{ fontWeight: 850, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
              Explore<span style={{ color: 'var(--primary)' }}> Pune</span>
            </span>
            <span className="brand-subtitle" style={{ fontWeight: 700, letterSpacing: '0.07em', color: 'var(--clay)', textTransform: 'uppercase' }}>
              {isMr ? 'पुण्यनगरी • सह्याद्री' : 'Heritage & Trails'}
            </span>
          </div>
        </Link>

        {/* Right Side: Two-Floor Navigation & Controls Layer */}
        <div className="header-two-floor-right">
          {/* Floor 1 (Upper Layer): Utility Controls, Helplines & Account Buttons */}
          <div className="header-floor-top">
            <div className="header-floor-top-left hide-on-mobile hide-on-compact-desktop">
              <span className="header-top-tagline">
                <span className="header-tagline-dot" />
                <span>{isMr ? 'पुणे पर्यटन • १०६+ ऐतिहासिक स्थळे व सह्याद्री ट्रेक्स' : 'Official Guide • 106+ Historic Forts, Wadas & Trails'}</span>
              </span>
            </div>

            <div className="header-utilities">
              {/* Emergency Tourist Helpline Modal */}
              <div className="nav-util-item hide-on-mobile">
                <EmergencyHelplineModal />
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

              {/* User Sign-In / Account & Logout */}
              <div className="nav-util-item">
                <AuthNav />
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

          {/* Floor 2 (Lower Layer): Primary Desktop Navigation Links */}
          <div className="header-floor-bottom">
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
          </div>
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
