import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCookie,
  setCookie,
  deleteCookie,
  getDefaultConsent,
  getCookieConsent,
  hasUserConsented,
  saveCookieConsent,
  resetCookieConsent,
  applyConsentToExternalServices,
  EXPLORE_PUNE_COOKIE_CATALOG,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
} from '@/lib/cookies';
import fs from 'fs';
import path from 'path';

// In-memory localStorage mock for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// In-memory document.cookie mock for node environment
const createMockDocument = () => {
  const store = new Map<string, string>();
  return {
    get cookie() {
      return Array.from(store.entries())
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('; ');
    },
    set cookie(val: string) {
      if (!val) return;
      const parts = val.split(';');
      const first = parts[0];
      const eqIdx = first.indexOf('=');
      if (eqIdx === -1) return;
      const rawName = first.substring(0, eqIdx).trim();
      const rawVal = first.substring(eqIdx + 1).trim();
      const name = decodeURIComponent(rawName);
      const value = decodeURIComponent(rawVal);

      const isDelete = parts.some((p) => {
        const lower = p.trim().toLowerCase();
        return lower === 'max-age=0' || lower.includes('expires=thu, 01 jan 1970');
      });

      if (isDelete || value === '') {
        store.delete(name);
      } else {
        store.set(name, value);
      }
    },
    clearCookies() {
      store.clear();
    },
  };
};

describe('Explore Pune - Cookie Engine & Consent Architecture', () => {
  let mockDoc: ReturnType<typeof createMockDocument>;
  let eventListeners: Record<string, ((e: any) => void)[]>;

  beforeEach(() => {
    localStorageMock.clear();
    mockDoc = createMockDocument();
    eventListeners = {};

    const mockWindow = {
      location: { protocol: 'https:' },
      localStorage: localStorageMock,
      addEventListener: vi.fn((event: string, handler: any) => {
        if (!eventListeners[event]) eventListeners[event] = [];
        eventListeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: any) => {
        if (eventListeners[event]) {
          eventListeners[event] = eventListeners[event].filter((h) => h !== handler);
        }
      }),
      dispatchEvent: vi.fn((event: any) => {
        const handlers = eventListeners[event.type] || [];
        handlers.forEach((h) => h(event));
        return true;
      }),
    };

    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('document', mockDoc);
    vi.stubGlobal('window', mockWindow);
    vi.stubGlobal('CustomEvent', class CustomEvent {
      type: string;
      detail: any;
      constructor(type: string, init?: any) {
        this.type = type;
        this.detail = init?.detail;
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('Low-Level Cookie Read / Write / Delete Utilities', () => {
    it('sets and retrieves a standard cookie with proper encoding', () => {
      setCookie('test_city', 'Pune Sahyadri', { maxAge: 3600, sameSite: 'lax' });
      const val = getCookie('test_city');
      expect(val).toBe('Pune Sahyadri');
    });

    it('returns null when querying a nonexistent cookie', () => {
      expect(getCookie('nonexistent_cookie_key')).toBeNull();
    });

    it('deletes an existing cookie by expiring it', () => {
      setCookie('temp_session', 'sample_token', { maxAge: 3600 });
      expect(getCookie('temp_session')).toBe('sample_token');

      deleteCookie('temp_session');
      expect(getCookie('temp_session')).toBeNull();
    });

    it('safely handles special characters and URLs in cookie values', () => {
      const complexValue = JSON.stringify({ fort: 'Sinhagad', elevation: 1312, url: 'https://explorepune-guide.vercel.app' });
      setCookie('complex_cookie', complexValue);
      const retrieved = getCookie('complex_cookie');
      expect(retrieved).toBe(complexValue);
      expect(JSON.parse(retrieved || '{}').fort).toBe('Sinhagad');
    });
  });

  describe('Consent Preferences & Defaults', () => {
    it('returns default consent with essential true and optional false', () => {
      const defaults = getDefaultConsent();
      expect(defaults.essential).toBe(true);
      expect(defaults.functional).toBe(false);
      expect(defaults.analytics).toBe(false);
      expect(defaults.personalization).toBe(false);
      expect(defaults.version).toBe(1);
      expect(typeof defaults.timestamp).toBe('string');
    });

    it('reports hasUserConsented as false before affirmative choice', () => {
      expect(hasUserConsented()).toBe(false);
    });

    it('saves user consent preferences and updates both storage and cookies', () => {
      const saved = saveCookieConsent({
        functional: true,
        analytics: true,
        personalization: false,
      });

      expect(saved.essential).toBe(true);
      expect(saved.functional).toBe(true);
      expect(saved.analytics).toBe(true);
      expect(saved.personalization).toBe(false);

      expect(hasUserConsented()).toBe(true);

      const retrieved = getCookieConsent();
      expect(retrieved.functional).toBe(true);
      expect(retrieved.analytics).toBe(true);
      expect(retrieved.personalization).toBe(false);
    });

    it('dispatches custom event explore_pune_cookie_consent_updated on save', () => {
      const listener = vi.fn();
      window.addEventListener(COOKIE_CONSENT_EVENT, listener);

      saveCookieConsent({ functional: true, analytics: false });

      expect(listener).toHaveBeenCalled();
      const eventDetail = (listener.mock.calls[0][0] as any).detail;
      expect(eventDetail.functional).toBe(true);
      expect(eventDetail.analytics).toBe(false);

      window.removeEventListener(COOKIE_CONSENT_EVENT, listener);
    });

    it('resets cookie consent and restores unconsented state', () => {
      saveCookieConsent({ functional: true, analytics: true });
      expect(hasUserConsented()).toBe(true);

      resetCookieConsent();
      expect(hasUserConsented()).toBe(false);
    });
  });

  describe('Google Consent Mode v2 & Analytics Hygiene', () => {
    it('calls gtag consent update when window.gtag is available', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      applyConsentToExternalServices({
        essential: true,
        functional: true,
        analytics: true,
        personalization: false,
        timestamp: new Date().toISOString(),
        version: 1,
      });

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
      });

      delete (window as any).gtag;
    });

    it('purges analytical cookies when analytics consent is denied', () => {
      setCookie('_ga', 'GA1.1.123456789.1670000000');
      setCookie('_gid', 'GA1.1.987654321.1670000000');
      setCookie('_ga_WNTH6S92', 'GS1.1.1670000000.1.1');

      applyConsentToExternalServices({
        essential: true,
        functional: true,
        analytics: false, // Denied
        personalization: false,
        timestamp: new Date().toISOString(),
        version: 1,
      });

      expect(getCookie('_ga')).toBeFalsy();
      expect(getCookie('_gid')).toBeFalsy();
      expect(getCookie('_ga_WNTH6S92')).toBeFalsy();
    });
  });

  describe('Cookie Master Catalog Completeness & Transparency', () => {
    it('contains all required first-party and auxiliary cookies', () => {
      const names = EXPLORE_PUNE_COOKIE_CATALOG.map((c) => c.name);
      expect(names).toContain('explore_pune_consent');
      expect(names).toContain('punetrail_theme');
      expect(names).toContain('punetrail_lang');
      expect(names).toContain('punetrail_saved_places');
      expect(names).toContain('_ga / _ga_* / _gid');
    });

    it('each catalog entry provides both English and Marathi transparency descriptions', () => {
      for (const item of EXPLORE_PUNE_COOKIE_CATALOG) {
        expect(item.name).toBeTruthy();
        expect(item.category).toMatch(/essential|functional|analytics|personalization/);
        expect(item.purposeEn.length).toBeGreaterThan(15);
        expect(item.purposeMr.length).toBeGreaterThan(15);
        expect(item.expiry).toBeTruthy();
        expect(item.expiryMr).toBeTruthy();
      }
    });
  });

  describe('Integration into Layout, Footer, Privacy Policy & Redirects', () => {
    it('includes Cookie Policy link and Cookie Settings trigger in AppFooter.tsx', () => {
      const footerPath = path.join(process.cwd(), 'components/AppFooter.tsx');
      const content = fs.readFileSync(footerPath, 'utf-8');
      expect(content).toContain('href="/cookies"');
      expect(content).toContain('openCookiePreferencesModal');
      expect(content).toContain('Cookie Settings');
    });

    it('includes Section 6 on Cookies & Storage in app/privacy/page.tsx', () => {
      const privacyPath = path.join(process.cwd(), 'app/privacy/page.tsx');
      const content = fs.readFileSync(privacyPath, 'utf-8');
      expect(content).toContain('Cookies & Storage');
      expect(content).toContain('href="/cookies"');
      expect(content).toContain('openCookiePreferencesModal');
    });

    it('configures redirects from /cookie-policy and /cookie to /cookies in next.config.ts', () => {
      const configPath = path.join(process.cwd(), 'next.config.ts');
      const content = fs.readFileSync(configPath, 'utf-8');
      expect(content).toContain('/cookie-policy');
      expect(content).toContain('/cookies');
    });

    it('includes /cookies in app/sitemap.ts', () => {
      const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      expect(content).toContain('${baseUrl}/cookies');
    });

    it('mounts CookieConsentBanner inside ClientInteractiveOverlays.tsx', () => {
      const overlaysPath = path.join(process.cwd(), 'components/ClientInteractiveOverlays.tsx');
      const content = fs.readFileSync(overlaysPath, 'utf-8');
      expect(content).toContain('CookieConsentBanner');
    });
  });
});
