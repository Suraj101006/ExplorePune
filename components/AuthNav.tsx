'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import ProfileAvatar from '@/components/ProfileAvatar';

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
            fontSize: '12.5px',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Shield size={13} />
          <span>{isMr ? 'प्रशासन' : 'Admin'}</span>
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
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '12.5px',
              border: '1px solid var(--primary-border)',
              textDecoration: 'none',
              maxWidth: '150px',
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
              {user.displayName || user.email?.split('@')[0] || (isMr ? 'माझे खाते' : 'Account')}
            </span>
          </Link>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="auth-logout-pill"
            title={isMr ? 'लॉगआउट' : 'Sign out'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
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
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
          }}
        >
          {isMr ? 'साइन इन' : 'Sign in'}
        </Link>
      )}
    </div>
  );
}
