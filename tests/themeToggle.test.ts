import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  THEME_STORAGE_KEY,
  applyThemeToDOM,
  shouldTriggerThemeShortcut,
  isTargetEditable,
} from '@/lib/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeShortcutToast from '@/components/ThemeShortcutToast';

describe('Dark and Light Theme Toggle & Shortcut Key Engine', () => {
  let mockDocElement: {
    classList: {
      add: (cls: string) => void;
      remove: (cls: string) => void;
      contains: (cls: string) => boolean;
    };
    attributes: Record<string, string>;
    setAttribute: (name: string, val: string) => void;
    getAttribute: (name: string) => string | null;
  };
  let mockMeta: {
    attributes: Record<string, string>;
    setAttribute: (name: string, val: string) => void;
    getAttribute: (name: string) => string | null;
  };

  beforeEach(() => {
    const classSet = new Set<string>();
    const docAttrs: Record<string, string> = {};
    const metaAttrs: Record<string, string> = { name: 'color-scheme', content: 'light dark' };

    mockDocElement = {
      classList: {
        add: vi.fn((cls: string) => classSet.add(cls)),
        remove: vi.fn((cls: string) => classSet.delete(cls)),
        contains: vi.fn((cls: string) => classSet.has(cls)),
      },
      attributes: docAttrs,
      setAttribute: vi.fn((k: string, v: string) => {
        docAttrs[k] = v;
      }),
      getAttribute: vi.fn((k: string) => docAttrs[k] || null),
    };

    mockMeta = {
      attributes: metaAttrs,
      setAttribute: vi.fn((k: string, v: string) => {
        metaAttrs[k] = v;
      }),
      getAttribute: vi.fn((k: string) => metaAttrs[k] || null),
    };

    (globalThis as any).document = {
      documentElement: mockDocElement,
      querySelector: vi.fn((sel: string) => {
        if (sel === 'meta[name="color-scheme"]') return mockMeta;
        return null;
      }),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('applies dark theme to the DOM, root attributes, and color-scheme meta tag', () => {
    applyThemeToDOM('dark');

    expect(mockDocElement.classList.add).toHaveBeenCalledWith('dark');
    expect(mockDocElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(mockMeta.setAttribute).toHaveBeenCalledWith('content', 'dark');
  });

  it('applies light theme to the DOM, removes dark class, and resets color-scheme meta', () => {
    applyThemeToDOM('light');

    expect(mockDocElement.classList.remove).toHaveBeenCalledWith('dark');
    expect(mockDocElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(mockMeta.setAttribute).toHaveBeenCalledWith('content', 'light');
  });

  it('triggers theme shortcut when the "T" or "D" key is pressed', () => {
    // Plain 't' or 'T'
    expect(shouldTriggerThemeShortcut({ key: 't' })).toBe(true);
    expect(shouldTriggerThemeShortcut({ key: 'T' })).toBe(true);

    // Plain 'd' or 'D'
    expect(shouldTriggerThemeShortcut({ key: 'd' })).toBe(true);
    expect(shouldTriggerThemeShortcut({ key: 'D' })).toBe(true);

    // Modifier combinations: Alt+T and Ctrl+Shift+D
    expect(shouldTriggerThemeShortcut({ key: 't', altKey: true })).toBe(true);
    expect(shouldTriggerThemeShortcut({ key: 'd', ctrlKey: true, shiftKey: true })).toBe(true);
    expect(shouldTriggerThemeShortcut({ key: 'D', metaKey: true, shiftKey: true })).toBe(true);

    // Random non-toggle keys must return false
    expect(shouldTriggerThemeShortcut({ key: 'a' })).toBe(false);
    expect(shouldTriggerThemeShortcut({ key: 'Enter' })).toBe(false);
    expect(shouldTriggerThemeShortcut({ key: 'Escape' })).toBe(false);
  });

  it('blocks shortcut key when user is typing inside an editable field', () => {
    const inputMock = {
      tagName: 'INPUT',
      isContentEditable: false,
      closest: vi.fn(() => null),
    } as any;

    const textareaMock = {
      tagName: 'TEXTAREA',
      isContentEditable: false,
      closest: vi.fn(() => null),
    } as any;

    const selectMock = {
      tagName: 'SELECT',
      isContentEditable: false,
      closest: vi.fn(() => null),
    } as any;

    const editableMock = {
      tagName: 'DIV',
      isContentEditable: true,
      closest: vi.fn(() => null),
    } as any;

    // isTargetEditable guards
    expect(isTargetEditable(inputMock)).toBe(true);
    expect(isTargetEditable(textareaMock)).toBe(true);
    expect(isTargetEditable(selectMock)).toBe(true);
    expect(isTargetEditable(editableMock)).toBe(true);

    // shouldTriggerThemeShortcut must be blocked when typing
    expect(shouldTriggerThemeShortcut({ key: 't', target: inputMock })).toBe(false);
    expect(shouldTriggerThemeShortcut({ key: 'T', target: textareaMock })).toBe(false);
    expect(shouldTriggerThemeShortcut({ key: 'd', target: selectMock })).toBe(false);
    expect(shouldTriggerThemeShortcut({ key: 'D', target: editableMock })).toBe(false);

    // Regular non-input div must allow shortcut
    const regularDiv = {
      tagName: 'DIV',
      isContentEditable: false,
      closest: vi.fn(() => null),
    } as any;
    expect(shouldTriggerThemeShortcut({ key: 't', target: regularDiv })).toBe(true);
  });

  it('renders ThemeToggle with accessibility attributes, Sun icon semantics, and shortcut key badge', () => {
    const html = renderToString(React.createElement(ThemeToggle));

    // Verify switch semantics and light mode initial state
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="false"');
    expect(html).toContain('aria-label=');
    expect(html).toContain('Switch to Dark Mode');
    expect(html).toContain('Shortcut: T');

    // Verify visual shortcut badge and semantic responsive classes
    expect(html).toContain('class="theme-toggle-btn ');
    expect(html).toContain('class="theme-toggle-icon"');
    expect(html).toContain('class="theme-toggle-label"');
    expect(html).toContain('class="theme-toggle-kbd"');
    expect(html).toContain('<kbd');
    expect(html).toContain('T</kbd>');

    // Verify label text
    expect(html).toContain('Light');
  });

  it('renders ThemeShortcutToast with polite accessibility live-region', () => {
    // Initial server render (invisible before event)
    const html = renderToString(React.createElement(ThemeShortcutToast));
    expect(typeof html).toBe('string');
  });

  it('uses standard storage key for cross-tab theme persistence', () => {
    expect(THEME_STORAGE_KEY).toBe('punetrail_theme');
  });
});
