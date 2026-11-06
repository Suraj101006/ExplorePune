import { describe, it, expect, vi } from 'vitest';
import robots from '@/app/robots';
import { ALL_STRUCTURED_PLACES } from '@/lib/chatKnowledgeEngine';
import { GET as indexNowGet, POST as indexNowPost } from '@/app/api/v1/indexnow/route';
import { NextRequest } from 'next/server';

describe('SEO Robots.txt & Crawl Optimization', () => {
  it('generates compliant robots rules allowing critical static assets and media', () => {
    const config = robots();
    expect(config).toBeDefined();
    expect(Array.isArray(config.rules)).toBe(true);

    const rules = config.rules as Array<{
      userAgent: string | string[];
      allow?: string | string[];
      disallow?: string | string[];
    }>;

    const wildcardRule = rules.find((r) => r.userAgent === '*');
    expect(wildcardRule).toBeDefined();

    const allowed = Array.isArray(wildcardRule?.allow) ? wildcardRule.allow : [wildcardRule?.allow];
    expect(allowed).toContain('/');
    expect(allowed).toContain('/_next/static/');
    expect(allowed).toContain('/_next/image');
    expect(allowed).toContain('/images/');
    expect(allowed).toContain('/videos/');
    expect(allowed).toContain('/manifest.webmanifest');
    expect(allowed).toContain('/llms.txt');

    const disallowed = Array.isArray(wildcardRule?.disallow) ? wildcardRule.disallow : [wildcardRule?.disallow];
    expect(disallowed).toContain('/api/');
    expect(disallowed).toContain('/admin');
    expect(disallowed).toContain('/account');
    expect(disallowed).toContain('/login');
    expect(disallowed).toContain('/journey');
  });

  it('includes dedicated permissions for major search bots and GEO AI answer engines', () => {
    const config = robots();
    const rules = config.rules as Array<{
      userAgent: string | string[];
      allow?: string | string[];
      disallow?: string | string[];
    }>;

    // Search engines
    const searchRule = rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes('Googlebot'));
    expect(searchRule).toBeDefined();
    expect(searchRule?.userAgent).toContain('Bingbot');
    expect(searchRule?.userAgent).toContain('Applebot');
    expect(searchRule?.userAgent).toContain('DuckDuckBot');

    // AI & GEO bots
    const aiRule = rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes('OAI-SearchBot'));
    expect(aiRule).toBeDefined();
    expect(aiRule?.userAgent).toContain('GPTBot');
    expect(aiRule?.userAgent).toContain('ChatGPT-User');
    expect(aiRule?.userAgent).toContain('PerplexityBot');
    expect(aiRule?.userAgent).toContain('ClaudeBot');
    expect(aiRule?.userAgent).toContain('Google-Extended');
    expect(aiRule?.userAgent).toContain('Applebot-Extended');
  });

  it('declares all sitemaps and site host', () => {
    const config = robots();
    expect(config.sitemap).toBeDefined();

    const sitemaps = Array.isArray(config.sitemap) ? config.sitemap : [config.sitemap];
    expect(sitemaps).toContain('https://explorepune-guide.vercel.app/sitemap.xml');
    expect(sitemaps).toContain('https://explorepune-guide.vercel.app/sitemap_index.xml');
    expect(sitemaps).toContain('https://explorepune-guide.vercel.app/video-sitemap.xml');
    expect(config.host).toBe('https://explorepune-guide.vercel.app');
  });
});

describe('IndexNow Instant Crawl & Indexing Pipeline', () => {
  it('covers all 106+ structured destination places in the indexing submission catalog', async () => {
    // Mock global fetch so external IndexNow API is not called during unit test
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const req = new NextRequest('https://explorepune-guide.vercel.app/api/v1/indexnow');
    const response = await indexNowGet(req);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.mode).toBe('full-catalog');
    // Must submit static routes + structured places (>= 90 URLs baseline, expands with live places)
    expect(data.submittedCount).toBeGreaterThanOrEqual(95);
    expect(data.submittedCount).toBeGreaterThanOrEqual(ALL_STRUCTURED_PLACES.length);

    // Verify mockFetch received the payload with urlList
    expect(mockFetch).toHaveBeenCalled();
    const firstCallArgs = mockFetch.mock.calls[0];
    const sentBody = JSON.parse(firstCallArgs[1].body);
    expect(sentBody.host).toBe('explorepune-guide.vercel.app');
    expect(sentBody.urlList.length).toBe(data.submittedCount);
    expect(sentBody.urlList).toContain('https://explorepune-guide.vercel.app/places/sinhagad-fort');
    expect(sentBody.urlList).toContain('https://explorepune-guide.vercel.app/places/shaniwar-wada');

    vi.unstubAllGlobals();
  });

  it('supports single URL indexing trigger on demand', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 202,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const singleUrl = 'https://explorepune-guide.vercel.app/places/aga-khan-palace';
    const req = new NextRequest(`https://explorepune-guide.vercel.app/api/v1/indexnow?url=${encodeURIComponent(singleUrl)}`);
    const response = await indexNowGet(req);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.mode).toBe('single');
    expect(data.submittedCount).toBe(1);

    const firstCallArgs = mockFetch.mock.calls[0];
    const sentBody = JSON.parse(firstCallArgs[1].body);
    expect(sentBody.urlList).toEqual([singleUrl]);

    vi.unstubAllGlobals();
  });
});
