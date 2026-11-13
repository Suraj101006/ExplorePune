/**
 * Explore Pune - Cookie Engine, Consent Management & Privacy Compliance Registry
 *
 * Implements strict compliance with:
 *  - India Digital Personal Data Protection (DPDP) Act 2023
 *  - EU GDPR / ePrivacy Directive
 *  - Google Consent Mode v2 (GTM Container: GTM-WNTH6S92)
 *
 * Zero external dependencies. Works across modern browser runtimes and SSR safe.
 */

export type CookieCategory = 'essential' | 'functional' | 'analytics' | 'personalization';

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number; // seconds
  expires?: Date;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  partitioned?: boolean;
}

export interface CookieConsentPreferences {
  essential: true; // Strictly necessary cookies are always active
  functional: boolean;
  analytics: boolean;
  personalization: boolean;
  timestamp: string;
  version: number;
}

export interface CookieItem {
  id: string;
  name: string;
  category: CookieCategory;
  provider: string;
  type: 'Cookie' | 'LocalStorage' | 'SessionStorage';
  expiry: string;
  expiryMr: string;
  purposeEn: string;
  purposeMr: string;
}

export const COOKIE_CONSENT_KEY = 'explore_pune_consent';
export const CURRENT_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_EVENT = 'explore_pune_cookie_consent_updated';
export const OPEN_COOKIE_PREFERENCES_EVENT = 'explore_pune_open_cookie_preferences';

/**
 * Master catalog of all cookies and browser storage used on Explore Pune
 */
export const EXPLORE_PUNE_COOKIE_CATALOG: CookieItem[] = [
  {
    id: 'cookie-consent',
    name: 'explore_pune_consent',
    category: 'essential',
    provider: 'Explore Pune (First-party)',
    type: 'Cookie',
    expiry: '1 year',
    expiryMr: '१ वर्ष',
    purposeEn: 'Stores your affirmative cookie and privacy preferences according to the DPDP Act 2023.',
    purposeMr: 'डीपीडीपी कायदा २०२३ नुसार तुमची कुकी व गोपनीयता पसंती सुरक्षितपणे साठवते.',
  },
  {
    id: 'theme-pref',
    name: 'punetrail_theme',
    category: 'functional',
    provider: 'Explore Pune (First-party)',
    type: 'LocalStorage',
    expiry: 'Persistent',
    expiryMr: 'कायमस्वरूपी',
    purposeEn: 'Remembers your preferred visual theme (Light Mode or Dark Mode) to prevent layout flashes.',
    purposeMr: 'तुमची निवडलेली थीम (लाईट किंवा डार्क मोड) लक्षात ठेवून स्क्रीन चकाकणे टाळते.',
  },
  {
    id: 'lang-pref',
    name: 'punetrail_lang',
    category: 'functional',
    provider: 'Explore Pune (First-party)',
    type: 'LocalStorage',
    expiry: 'Persistent',
    expiryMr: 'कायमस्वरूपी',
    purposeEn: 'Maintains your language preference between Marathi (मराठी) and English across pages.',
    purposeMr: 'मराठी व इंग्रजी भाषा निवडीची पसंती सर्व पानांवर कायम ठेवते.',
  },
  {
    id: 'saved-places',
    name: 'punetrail_saved_places',
    category: 'functional',
    provider: 'Explore Pune (First-party)',
    type: 'LocalStorage',
    expiry: 'Persistent',
    expiryMr: 'कायमस्वरूपी',
    purposeEn: 'Stores bookmarked forts, wadas, and temples locally so you can access them offline.',
    purposeMr: 'बुकमार्क केलेले किल्ले, वाडे आणि मंदिरे स्थानिक साठ्यात सेव्ह ठेवते जेणेकरून ऑफलाइनही पाहता येतील.',
  },
  {
    id: 'geo-coords',
    name: 'explore_pune_user_lat / lng',
    category: 'functional',
    provider: 'Explore Pune (First-party)',
    type: 'LocalStorage',
    expiry: 'Session / 24 hours',
    expiryMr: 'सत्र / २४ तास',
    purposeEn: 'Temporarily caches your approved GPS coordinates to compute real-time distance and PMPML bus routes.',
    purposeMr: 'तुमचे मंजूर केलेले जीपीएस स्थान साठवून अचूक अंतर व पीएमपीएमएल बस मार्ग दाखवते.',
  },
  {
    id: 'intro-video',
    name: 'explore_pune_intro_shown',
    category: 'functional',
    provider: 'Explore Pune (First-party)',
    type: 'SessionStorage',
    expiry: 'Browser Session',
    expiryMr: 'ब्राउझर सत्र',
    purposeEn: 'Ensures the cinematic Pune intro video is only displayed once per browsing session.',
    purposeMr: 'पुणे हेरिटेजचा सिनेमॅटिक व्हिडिओ प्रत्येक सत्रात फक्त एकदाच दिसावा याची खात्री करते.',
  },
  {
    id: 'ga-client',
    name: '_ga / _ga_* / _gid',
    category: 'analytics',
    provider: 'Google Analytics (GTM-WNTH6S92)',
    type: 'Cookie',
    expiry: 'Up to 2 years',
    expiryMr: '२ वर्षांपर्यंत',
    purposeEn: 'Measures aggregated visitor metrics, page load speeds, and popular trekking guides without collecting personal identity.',
    purposeMr: 'वैयक्तिक ओळख उघड न करता पानांची गती व लोकप्रिय किल्ल्यांचे वाचक प्रमाण मोजते.',
  },
  {
    id: 'recommendations-history',
    name: 'explore_pune_recent_destinations',
    category: 'personalization',
    provider: 'Explore Pune (First-party)',
    type: 'LocalStorage',
    expiry: '90 days',
    expiryMr: '९० दिवस',
    purposeEn: 'Provides intelligent personalized suggestions for nearby forts and Peshwa trails based on places you recently explored.',
    purposeMr: 'तुम्ही नुकत्याच पाहिलेल्या स्थळांनुसार जवळचे किल्ले व ऐतिहासिक वाड्यांची हुशार शिफारस करते.',
  },
];

/**
 * Safe client-side document.cookie getter
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const target = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.indexOf(target) === 0) {
      try {
        return decodeURIComponent(c.substring(target.length));
      } catch {
        return c.substring(target.length);
      }
    }
  }
  return null;
}

/**
 * Safe client-side document.cookie setter
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;

  const {
    path = '/',
    domain,
    maxAge,
    expires,
    secure = typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite = 'lax',
    partitioned = false,
  } = options;

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;

  if (domain) {
    cookieStr += `; Domain=${domain}`;
  }

  if (typeof maxAge === 'number') {
    cookieStr += `; Max-Age=${Math.floor(maxAge)}`;
  } else if (expires instanceof Date) {
    cookieStr += `; Expires=${expires.toUTCString()}`;
  }

  if (secure) {
    cookieStr += '; Secure';
  }

  if (partitioned) {
    cookieStr += '; Partitioned';
  }

  document.cookie = cookieStr;
}

/**
 * Delete a cookie by expiring it immediately
 */
export function deleteCookie(name: string, path = '/', domain?: string): void {
  if (typeof document === 'undefined') return;
  let cookieStr = `${encodeURIComponent(name)}=; Path=${path}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=lax`;
  if (domain) {
    cookieStr += `; Domain=${domain}`;
  }
  document.cookie = cookieStr;
}

/**
 * Returns default consent object (Essential enabled, optional pending/false)
 */
export function getDefaultConsent(): CookieConsentPreferences {
  return {
    essential: true,
    functional: false,
    analytics: false,
    personalization: false,
    timestamp: new Date().toISOString(),
    version: CURRENT_CONSENT_VERSION,
  };
}

/**
 * Check if the user has already made an affirmative consent decision
 */
export function hasUserConsented(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const local = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === 'object' && parsed.version === CURRENT_CONSENT_VERSION) {
        return true;
      }
    }
  } catch {}

  const cookieVal = getCookie(COOKIE_CONSENT_KEY);
  if (cookieVal) {
    try {
      const parsed = JSON.parse(cookieVal);
      if (parsed && typeof parsed === 'object' && parsed.version === CURRENT_CONSENT_VERSION) {
        return true;
      }
    } catch {}
  }

  return false;
}

/**
 * Retrieve current cookie consent preferences
 */
export function getCookieConsent(): CookieConsentPreferences {
  const fallback = getDefaultConsent();
  if (typeof window === 'undefined') return fallback;

  // Try localStorage first
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sanitizeConsent(parsed);
    }
  } catch {}

  // Try cookie fallback
  const cookieRaw = getCookie(COOKIE_CONSENT_KEY);
  if (cookieRaw) {
    try {
      const parsed = JSON.parse(cookieRaw);
      return sanitizeConsent(parsed);
    } catch {}
  }

  return fallback;
}

function sanitizeConsent(raw: any): CookieConsentPreferences {
  return {
    essential: true,
    functional: Boolean(raw?.functional),
    analytics: Boolean(raw?.analytics),
    personalization: Boolean(raw?.personalization),
    timestamp: typeof raw?.timestamp === 'string' ? raw.timestamp : new Date().toISOString(),
    version: typeof raw?.version === 'number' ? raw.version : CURRENT_CONSENT_VERSION,
  };
}

/**
 * Save user cookie consent preferences to both cookie and localStorage,
 * dispatch an update event, and update Google Consent Mode v2.
 */
export function saveCookieConsent(prefs: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const complete: CookieConsentPreferences = {
    essential: true,
    functional: Boolean(prefs.functional),
    analytics: Boolean(prefs.analytics),
    personalization: Boolean(prefs.personalization),
    timestamp: new Date().toISOString(),
    version: CURRENT_CONSENT_VERSION,
  };

  const serialized = JSON.stringify(complete);

  // 1. Write to cookie (1 year lifespan, 31536000 seconds)
  setCookie(COOKIE_CONSENT_KEY, serialized, {
    maxAge: 31536000,
    path: '/',
    sameSite: 'lax',
  });

  // 2. Write to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
    } catch {}

    // 3. Update external analytics / Google Consent Mode
    applyConsentToExternalServices(complete);

    // 4. Dispatch custom event for reactive listeners
    try {
      window.dispatchEvent(
        new CustomEvent(COOKIE_CONSENT_EVENT, { detail: complete })
      );
    } catch {}
  }

  return complete;
}

/**
 * Synchronize Google Consent Mode v2 and cleanup unauthorized cookies
 */
export function applyConsentToExternalServices(consent: CookieConsentPreferences): void {
  if (typeof window === 'undefined') return;

  // Google Tag Manager / Analytics Consent Mode v2
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: 'denied', // Explore Pune never serves ads or remarketing
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: consent.functional ? 'granted' : 'denied',
      personalization_storage: consent.personalization ? 'granted' : 'denied',
    });
  }

  // If analytics was revoked, clean up Google Analytics cookies
  if (!consent.analytics && typeof document !== 'undefined') {
    deleteCookie('_ga', '/');
    deleteCookie('_gid', '/');
    deleteCookie('_gat', '/');

    // Remove any measurement-id specific ga cookies (_ga_XXXXXXXX)
    const all = document.cookie ? document.cookie.split(';') : [];
    for (const item of all) {
      const trimmed = item.trim();
      const eqIdx = trimmed.indexOf('=');
      const name = eqIdx > -1 ? trimmed.substring(0, eqIdx) : trimmed;
      if (name.startsWith('_ga_')) {
        deleteCookie(name, '/');
      }
    }
  }
}

/**
 * Open the cookie preferences modal from any link or button
 */
export function openCookiePreferencesModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
  }
}

/**
 * Reset consent decision (e.g. for testing or explicit user revocation)
 */
export function resetCookieConsent(): void {
  deleteCookie(COOKIE_CONSENT_KEY, '/');
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {}
    applyConsentToExternalServices(getDefaultConsent());
    openCookiePreferencesModal();
  }
}
