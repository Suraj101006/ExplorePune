'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';

export default function AuthNav() {
  const { user, isStaff, ready, logout } = useAuth();
  const { isMr } = useLanguage();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!ready) {
    return <span style={{ display: 'inline-block', width: 68, height: 32 }} />;
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

  return (
    <div className="auth-nav-container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {isStaff && (
        <Link
          href="/admin"
          className="auth-admin-link"
          style={{
            color: 'var(--clay)',
            fontWeight: 700,
            fontSize: '13px',
            padding: '4px 8px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          {isMr ? 'प्रशासन' : 'Admin'}
        </Link>
      )}

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* User Profile Pill */}
          <Link
            href="/account"
            className="auth-user-pill"
            title={user.email || ''}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '6px 12px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '13px',
              border: '1px solid var(--primary-border)',
              textDecoration: 'none',
              maxWidth: '140px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>👤</span>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.displayName || user.email?.split('@')[0] || (isMr ? 'माझे खाते' : 'Account')}
            </span>
          </Link>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="auth-logout-pill"
            aria-label={isMr ? 'खात्यातून बाहेर पडा' : 'Sign out / Logout'}
            title={isMr ? 'खात्यातून बाहेर पडा (लॉगआउट)' : 'Sign out of your account'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#fff',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              padding: '6px 11px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: isLoggingOut ? 'wait' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '13px' }}>{isLoggingOut ? '⏳' : '🚪'}</span>
            <span className="auth-logout-label">
              {isLoggingOut
                ? (isMr ? 'बाहेर पडत आहे…' : 'Logging out…')
                : (isMr ? 'लॉगआउट' : 'Logout')}
            </span>
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="btn"
          style={{
            padding: '7px 16px',
            fontSize: '13px',
            borderRadius: '999px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🔑</span>
          <span>{isMr ? 'लॉगिन' : 'Sign in'}</span>
        </Link>
      )}
    </div>
  );
}
