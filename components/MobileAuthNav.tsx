'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import ProfileAvatar from '@/components/ProfileAvatar';

export default function MobileAuthNav({ onClose }: { onClose: () => void }) {
  const { user, isStaff, logout } = useAuth();
  const { isMr } = useLanguage();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMobileLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Mobile logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (user) {
    return (
      <div
        className="mobile-auth-card"
        style={{
          background: 'var(--card)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
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
              onClick={onClose}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link
            href="/account"
            onClick={onClose}
            className="btn outline"
            style={{
              padding: '7px 10px',
              fontSize: '12.5px',
              fontWeight: 700,
              justifyContent: 'center',
              background: 'var(--card)',
              color: 'var(--ink)',
              borderColor: 'var(--line)',
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
              background: 'var(--card)',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
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
    );
  }

  return (
    <Link
      href="/login"
      onClick={onClose}
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
  );
}
