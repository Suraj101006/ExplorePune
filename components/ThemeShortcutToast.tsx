'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Theme } from '@/lib/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeShortcutToast() {
  const { isMr } = useLanguage();
  const [activeToast, setActiveToast] = useState<{
    theme: Theme;
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleThemeToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme; shortcut?: string }>;
      const newTheme = customEvent.detail?.theme || 'light';

      setActiveToast({ theme: newTheme, visible: true });

      clearTimeout(timer);
      timer = setTimeout(() => {
        setActiveToast((prev) => (prev ? { ...prev, visible: false } : null));
      }, 1900);
    };

    window.addEventListener('punetrail-theme-toggle', handleThemeToggle);
    return () => {
      window.removeEventListener('punetrail-theme-toggle', handleThemeToggle);
      clearTimeout(timer);
    };
  }, []);

  if (!activeToast || !activeToast.visible) return null;

  const isDark = activeToast.theme === 'dark';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderRadius: 999,
        background: isDark
          ? 'rgba(19, 29, 49, 0.94)'
          : 'rgba(255, 255, 255, 0.95)',
        border: `1.5px solid ${isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(6, 95, 70, 0.25)'}`,
        boxShadow: isDark
          ? '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.25)'
          : '0 10px 30px rgba(15, 23, 42, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: isDark ? '#ffffff' : '#0f172a',
        fontSize: 13.5,
        fontWeight: 700,
        animation: 'themeToastSlideDown 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
          color: isDark ? '#34d399' : '#d97706',
        }}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>
          {isDark
            ? isMr
              ? 'डार्क थीम सुरू'
              : 'Dark Theme Active'
            : isMr
              ? 'लाइट थीम सुरू'
              : 'Light Theme Active'}
        </span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: isDark ? '#94a3b8' : '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isMr ? 'बदलण्यासाठी' : 'Press'}
          <kbd
            style={{
              padding: '1px 6px',
              borderRadius: 5,
              background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 800,
              color: isDark ? '#34d399' : '#065f46',
            }}
          >
            T
          </kbd>
          {isMr ? 'दाबा' : 'to toggle'}
        </span>
      </div>
    </div>
  );
}
