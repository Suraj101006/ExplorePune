'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function AuthNav() {
  const { user, isStaff, ready, logout } = useAuth();
  const { isMr } = useLanguage();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!ready) {
    return (
      <div className="auth-nav-container">
        <div className="auth-desktop-view">
          <Link
            href="/login"
            className="btn auth-signin-btn"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {isMr ? 'साइन इन' : 'Sign in'}
          </Link>
        </div>
        <div className="auth-mobile-view">
          <Link
            href="/login"
            className="mobile-auth-icon-btn"
            title={isMr ? 'साइन इन' : 'Sign in'}
            aria-label={isMr ? 'साइन इन' : 'Sign in'}
          >
            <UserIcon size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || (isMr ? 'माझे खाते' : 'Account');

  return (
    <div className="auth-nav-container">
      {/* 1. Desktop & Tablet View (> 768px) */}
      <div className="auth-desktop-view">
        {isStaff && (
          <Link
            href="/admin"
            className="auth-admin-link"
            style={{
              color: 'var(--clay)',
              fontWeight: 700,
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(194, 65, 12, 0.08)',
              border: '1px solid rgba(194, 65, 12, 0.2)',
            }}
          >
            <Shield size={12} />
            <span>{isMr ? 'प्रशासन' : 'Admin'}</span>
          </Link>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* User Profile Pill */}
            <Link
              href="/account"
              className="auth-user-pill"
              title={user.email || displayName}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '4px 10px 4px 6px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '12.5px',
                border: '1px solid var(--primary-border)',
                textDecoration: 'none',
                maxWidth: '120px',
                transition: 'all 0.15s ease',
              }}
            >
              <ProfileAvatar
                photoUrl={user.photoURL || (typeof window !== 'undefined' ? localStorage.getItem(`explore_pune_avatar_${user.uid}`) : null)}
                name={user.displayName}
                email={user.email}
                size={22}
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </span>
            </Link>

            {/* Quick Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="auth-logout-pill"
              title={isMr ? 'लॉगआउट' : 'Sign out'}
              aria-label={isMr ? 'लॉगआउट' : 'Sign out'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--card)',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-full)',
                width: 30,
                height: 30,
                cursor: isLoggingOut ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="btn auth-signin-btn"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {isMr ? 'साइन इन' : 'Sign in'}
          </Link>
        )}
      </div>

      {/* 2. Mobile Compact View (<= 768px) */}
      <div className="auth-mobile-view">
        {user ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Link
              href="/account"
              className="mobile-auth-avatar-btn"
              title={displayName}
              aria-label={`${isMr ? 'माझे खाते' : 'My Account'} (${displayName})`}
            >
              <ProfileAvatar
                photoUrl={user.photoURL || (typeof window !== 'undefined' ? localStorage.getItem(`explore_pune_avatar_${user.uid}`) : null)}
                name={user.displayName}
                email={user.email}
                size={24}
              />
              <span className="mobile-auth-online-dot" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mobile-auth-logout-btn"
              title={isMr ? 'लॉगआउट' : 'Sign out'}
              aria-label={isMr ? 'लॉगआउट' : 'Sign out'}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="mobile-auth-icon-btn"
            title={isMr ? 'साइन इन' : 'Sign in'}
            aria-label={isMr ? 'साइन इन' : 'Sign in'}
          >
            <UserIcon size={16} strokeWidth={2.2} />
          </Link>
        )}
      </div>
    </div>
  );
}
