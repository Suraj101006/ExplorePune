'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showShortcutBadge?: boolean;
}

export default function ThemeToggle({
  className = '',
  showShortcutBadge = true,
}: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { isMr } = useLanguage();

  const titleTooltip = isMr
    ? isDark
      ? "लाइट थीममध्ये बदला (शॉर्टकट: 'T' दाबा)"
      : "डार्क थीममध्ये बदला (शॉर्टकट: 'T' दाबा)"
    : isDark
      ? "Switch to Light Theme (Press 'T')"
      : "Switch to Dark Theme (Press 'T')";

  const ariaLabel = isDark
    ? isMr
      ? 'लाइट थीम चालू करा'
      : 'Switch to light theme'
    : isMr
      ? 'डार्क थीम चालू करा'
      : 'Switch to dark theme';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`${ariaLabel} (Shortcut: T)`}
      title={titleTooltip}
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 999,
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
        border: '1px solid var(--line)',
        color: isDark ? '#fbbf24' : '#065f46',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        minHeight: 32,
        userSelect: 'none',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? (
          <Sun size={15} strokeWidth={2.4} style={{ color: '#fbbf24' }} />
        ) : (
          <Moon size={15} strokeWidth={2.4} style={{ color: '#065f46' }} />
        )}
      </span>

      <span
        style={{
          fontSize: 11.5,
          color: 'var(--ink)',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {isDark ? (isMr ? 'डार्क' : 'Dark') : (isMr ? 'लाइट' : 'Light')}
      </span>

      {showShortcutBadge && (
        <kbd
          style={{
            fontSize: 9.5,
            fontFamily: 'monospace',
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: 4,
            background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: isDark ? '#34d399' : '#065f46',
            lineHeight: 1.2,
          }}
          title="Press 'T' on your keyboard to toggle theme"
        >
          T
        </kbd>
      )}
    </button>
  );
}
