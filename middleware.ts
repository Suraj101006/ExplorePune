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

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const origin = req.headers.get('origin') || '';

  // 1. Guard against source code / sensitive file disclosure and probing
  if (BLOCKED_PATH_REGEX.test(pathname)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 2. Strict CORS & CSRF defense for API endpoints
  if (pathname.startsWith('/api/')) {
    // Handle OPTIONS Preflight
    if (req.method === 'OPTIONS') {
      if (origin && !isOriginAllowed(origin, host)) {
        return new NextResponse('CORS origin forbidden', { status: 403 });
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
