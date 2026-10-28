import { NextRequest, NextResponse } from 'next/server';

// Blocklist for sensitive files, source control metadata, debug and backup paths
const BLOCKED_PATH_REGEX =
  /(?:^\/(?:\.env|\.git|\.svn|\.hg|\.well-known\/(?:debug|admin)|debug|test|admin-debug|backup|database\.sql|dump\.sql|scripts\/|data\/.*\.json)(?:\/|$))|(?:\.(?:env|git|sql|bak|backup|key|pem|log|sqlite|db|ts|tsx|map)$)/i;

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(?::\d+)?$/,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.firebaseapp\.com$/,
  /^https:\/\/[a-z0-9-]+\.web\.app$/,
  /^https:\/\/punetrail\.com$/,
  /^https:\/\/www\.punetrail\.com$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
];

function isOriginAllowed(origin: string, host: string): boolean {
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    if (originUrl.host === host) return true;
    return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
  } catch {
    return false;
  }
}

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "worker-src 'self' blob:",
  "child-src 'self' blob: https://*.firebaseapp.com",
  "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://*.tile.openstreetmap.org https://*.openstreetmap.org https://commons.wikimedia.org https://upload.wikimedia.org https://api.open-meteo.com https://www.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net",
  "frame-src 'self' https://*.firebaseapp.com https://*.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), screen-wake-lock=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=(), midi=(), browsing-topics=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  res.headers.set('Origin-Agent-Cluster', '?1');
  res.headers.set('X-XSS-Protection', '0');
  res.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const origin = req.headers.get('origin') || '';

  // 1. Guard against source code / sensitive file disclosure and probing
  if (BLOCKED_PATH_REGEX.test(pathname)) {
    return applySecurityHeaders(new NextResponse('Not Found', { status: 404 }));
  }

  // 2. Strict CORS & CSRF defense for API endpoints
  if (pathname.startsWith('/api/')) {
    // Handle OPTIONS Preflight
    if (req.method === 'OPTIONS') {
      if (origin && !isOriginAllowed(origin, host)) {
        return applySecurityHeaders(new NextResponse('CORS origin forbidden', { status: 403 }));
      }
      const preflightRes = new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || `https://${host}`,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-key, x-requested-with',
          'Access-Control-Max-Age': '86400',
        },
      });
      return applySecurityHeaders(preflightRes);
    }

    // For state-changing operations (POST, PUT, DELETE, PATCH), verify Origin
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && origin) {
      if (!isOriginAllowed(origin, host)) {
        const forbiddenRes = NextResponse.json(
          { error: { code: 'FORBIDDEN_ORIGIN', message: 'Cross-origin requests from this origin are not permitted.' } },
          { status: 403 }
        );
        return applySecurityHeaders(forbiddenRes);
      }
    }

    const response = NextResponse.next();
    if (origin && isOriginAllowed(origin, host)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Vary', 'Origin');
    }
    return applySecurityHeaders(response);
  }

  const res = NextResponse.next();
  return applySecurityHeaders(res);
}

export const config = {
  matcher: [
    // Match all request paths except static files (_next/static, _next/image, favicon, public images)
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
