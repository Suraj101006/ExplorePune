'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  User as UserIcon,
  LogOut,
  LogIn,
  Shield,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/useAuth';
import AuthNav from '@/components/AuthNav';
import LanguageToggle from '@/components/LanguageToggle';
import SavedPlacesDrawer from '@/components/SavedPlacesDrawer';
import EmergencyHelplineModal from '@/components/EmergencyHelplineModal';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function AppHeader() {
  const { t, isMr } = useLanguage();
  const { user, isStaff, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.explore'), Icon: Compass },
    { href: '/journey', label: t('nav.journey') || (isMr ? 'माझी सफर' : 'My Journey'), Icon: Footprints },
    { href: '/planner', label: t('nav.planner'), Icon: Route },
    { href: '/community', label: isMr ? 'समुदाय' : 'Community', Icon: Users },
    { href: '/milestones', label: t('nav.milestones'), Icon: Award },
    { href: '/blogs', label: t('nav.blogs'), Icon: BookOpen },
    { href: '/about', label: t('nav.about'), Icon: Info },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleMobileLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        {/* Brand Identity */}
        <Link href="/" className="brand">
          <Image
            src="/images/logo.svg"
            alt="Explore Pune Logo"
            width={38}
            height={38}
            className="brand-logo-img"
            priority
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

          {/* Saved Places Wishlist Drawer */}
          <div className="nav-util-item">
            <SavedPlacesDrawer />
          </div>

          {/* Bilingual Language Switcher */}
          <div className="nav-util-item">
            <LanguageToggle />
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
            background: 'rgba(255, 255, 255, 0.98)',
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
          {user ? (
            <div
              style={{
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <ProfileAvatar
                    photoUrl={user.photoURL || (typeof window !== 'undefined' ? localStorage.getItem(`explore_pune_avatar_${user.uid}`) : null)}
                    name={user.displayName}
                    email={user.email}
                    size={36}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isMr ? 'लॉगिन केलेले खाते' : 'Signed In'}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.displayName || user.email?.split('@')[0]}
                    </div>
                  </div>
                </div>
                {isStaff && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--clay)',
                      background: 'rgba(194, 65, 12, 0.1)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Shield size={12} />
                    <span>{isMr ? 'प्रशासन' : 'Admin'}</span>
                  </Link>
                )}
              </div>

              {/* Mobile Profile & Logout Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn outline"
                  style={{
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    justifyContent: 'center',
                    background: '#fff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <UserIcon size={14} />
                  <span>{isMr ? 'माझे खाते' : 'My Account'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleMobileLogout}
                  disabled={isLoggingOut}
                  className="btn outline"
                  style={{
                    padding: '7px 10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    justifyContent: 'center',
                    background: '#fff',
                    borderColor: '#fca5a5',
                    color: '#dc2626',
                    cursor: isLoggingOut ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <LogOut size={14} />
                  <span>{isLoggingOut ? '…' : isMr ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn"
              style={{
                padding: '11px 16px',
                fontSize: '14px',
                fontWeight: 700,
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                marginBottom: 6,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogIn size={16} />
              <span>{isMr ? 'लॉगिन करा / नवीन खाते तयार करा' : 'Sign in / Create Account'}</span>
            </Link>
          )}

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navLinks.map((item) => {
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
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SavedPlacesDrawer />
              <EmergencyHelplineModal />
            </div>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
