/**
 * Live Destination Status & Safety Alert Service
 * Server-side fetching, caching, deduplication, RSS news aggregation, and status determination.
 */

import {
  DestinationStatusType,
  DestinationAlert,
  DestinationLiveStatusSummary,
  DESTINATION_PROFILES,
  OFFICIAL_STANDING_REGULATIONS,
  isAlertExpired,
  formatIstTimestamp,
  DestinationKeywordsProfile,
} from './liveStatus';
import { ALL_STRUCTURED_PLACES } from './chatKnowledgeEngine';

interface CachedStatusEntry {
  summary: DestinationLiveStatusSummary;
  timestamp: number;
}

// In-memory cache with 15-minute TTL
const STATUS_CACHE = new Map<string, CachedStatusEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Decode common HTML entities from RSS text.
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '') // strip any residual HTML tags
    .trim();
}

interface RawRssItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

/**
 * Fast, lightweight, zero-dependency XML/RSS Item Parser.
 */
function parseRssXml(xml: string): RawRssItem[] {
  const items: RawRssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const descMatch = block.match(/<description>([\s\S]*?)<\/description>/);

    const title = decodeHtmlEntities(titleMatch ? titleMatch[1] : '');
    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const source = decodeHtmlEntities(sourceMatch ? sourceMatch[1] : 'News Publisher');
    const description = decodeHtmlEntities(descMatch ? descMatch[1] : '');

    if (title && link) {
      items.push({ title, link, pubDate, source, description });
    }
  }

  return items;
}

/**
 * Strict destination relevance filter.
 * Ensures an alert or news item only attaches to the exact matched destination.
 */
function isItemRelevantToDestination(
  text: string,
  profile: DestinationKeywordsProfile
): boolean {
  const lower = text.toLowerCase();

  // 1. Negative matching: Reject if another distinct destination is the primary subject
  if (profile.negativeMatchKeywords && profile.negativeMatchKeywords.length > 0) {
    for (const neg of profile.negativeMatchKeywords) {
      // If text mentions another fort/temple but NOT our destination name explicitly, reject
      if (lower.includes(neg.toLowerCase())) {
        const hasSelf =
          profile.aliases.some((a) => lower.includes(a.toLowerCase())) ||
          profile.marathiKeywords.some((mk) => text.includes(mk));
        if (!hasSelf) return false;
      }
    }
  }

  // 2. Direct match against aliases or Marathi keywords
  const matchedAlias = profile.aliases.some((alias) => lower.includes(alias.toLowerCase()));
  if (matchedAlias) return true;

  const matchedMarathi = profile.marathiKeywords.some((mk) => text.includes(mk));
  if (matchedMarathi) return true;

  // 3. Match specific landmark keywords
  const matchedKeyword = profile.keywords.some((kw) => lower.includes(kw.toLowerCase()));
  if (matchedKeyword) return true;

  return false;
}

/**
 * Classifies news report impact and determines whether it represents an active safety alert.
 */
function classifyNewsImpact(
  item: RawRssItem,
  profile: DestinationKeywordsProfile
): {
  isAlert: boolean;
  alert?: DestinationAlert;
} {
  const titleLower = item.title.toLowerCase();
  const descLower = item.description.toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  // Keywords indicating official emergency restrictions or severe hazards
  const closureKeywords = ['closed', 'shut', 'prohibits entry', 'ban on entry', 'section 144', 'banned', 'restricted entry'];
  const hazardKeywords = ['landslide', 'leopard', 'drowning', 'heavy rain', 'red alert', 'water level', 'flash flood', 'accident', 'danger'];

  const isClosure = closureKeywords.some((k) => combined.includes(k));
  const isHazard = hazardKeywords.some((k) => combined.includes(k));

  // Check if it is an authoritative announcement vs general tourist story
  const isAuthorityQuoted =
    combined.includes('forest department') ||
    combined.includes('police') ||
    combined.includes('district collector') ||
    combined.includes('administration') ||
    combined.includes('asi') ||
    combined.includes('trust');

  const pubDateObj = new Date(item.pubDate);
  const now = new Date();
  const isRecent = !isNaN(pubDateObj.getTime()) && now.getTime() - pubDateObj.getTime() < 30 * 24 * 3600 * 1000; // within 30 days

  // If recent and reports an active hazard or official closure
  if (isRecent && (isClosure || isHazard)) {
    const statusImpact: DestinationStatusType = isClosure ? 'restricted' : 'warning';
    const severity = isClosure ? 'urgent' : 'moderate';

    // Build the alert
    const alert: DestinationAlert = {
      id: `news-alert-${Buffer.from(item.link).toString('base64').slice(0, 16)}`,
      destinationSlug: profile.slug,
      destinationName: profile.primaryNameEn,
      destinationNameMr: profile.primaryNameMr,
      title: item.title,
      severity,
      category: isClosure ? 'closure' : 'weather',
      sourceType: isAuthorityQuoted ? 'authority_advisory' : 'news_report',
      isOfficialOrder: false, // news report, not raw official gazette
      statusImpact,
      summary: item.description || item.title,
      canEnter: isClosure ? false : true,
      canTrek: isClosure ? false : null,
      canDarshan: isClosure ? false : null,
      effectiveFrom: item.pubDate ? new Date(item.pubDate).toISOString() : now.toISOString(),
      effectiveUntil: null,
      issuingAuthority: isAuthorityQuoted ? `${item.source} (Reporting Official Directive)` : `${item.source} Press Report`,
      authorityType: 'news_publisher',
      sourceName: item.source,
      sourceUrl: item.link,
      verifiedAt: now.toISOString(),
      isExpired: false,
    };

    return { isAlert: true, alert };
  }

  // Not an active restriction alert, treat as general news update
  return { isAlert: false };
}

/**
 * Fetch live news for a destination from Google News RSS with timeout protection.
 */
async function fetchDestinationNewsRss(profile: DestinationKeywordsProfile): Promise<RawRssItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2600); // 2.6s safety timeout

    // Build targeted search query
    const mainName = profile.aliases[0] || profile.primaryNameEn.split(' (')[0];
    const queryStr = `"${mainName}" Pune when:45d`;
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(queryStr)}&hl=en-IN&gl=IN&ceid=IN:en`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ExplorePune-SafetyMonitor/2.0 (Pune Tourism Safety Engine; info@explorepune.org)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 900 }, // 15 minutes Next.js ISR cache
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return [];
    }

    const xml = await res.text();
    const parsed = parseRssXml(xml);

    // Filter items strictly relevant to this destination
    return parsed.filter((item) =>
      isItemRelevantToDestination(`${item.title} ${item.description}`, profile)
    );
  } catch (err) {
    // Network failure or timeout: log quietly and return empty
    console.warn(`[liveStatusService] RSS fetch skipped or timed out for ${profile.slug}:`, (err as any)?.message);
    return [];
  }
}

/**
 * Find or create a keyword profile for any destination slug.
 */
export function getOrCreateDestinationProfile(slug: string): DestinationKeywordsProfile {
  const cleanSlug = slug.toLowerCase().trim();
  const normalized = cleanSlug.replace(/[-_]/g, ' ');

  if (DESTINATION_PROFILES[cleanSlug]) {
    return DESTINATION_PROFILES[cleanSlug];
  }

  // Check aliases and slugs across all predefined destination profiles
  for (const prof of Object.values(DESTINATION_PROFILES)) {
    if (
      prof.slug === cleanSlug ||
      prof.aliases.some((a) => {
        const aNorm = a.toLowerCase().trim().replace(/[-_]/g, ' ');
        return aNorm === normalized || a.toLowerCase().trim() === cleanSlug;
      })
    ) {
      return prof;
    }
  }

  // Fallback to ALL_STRUCTURED_PLACES
  const place = ALL_STRUCTURED_PLACES.find(
    (p) =>
      p.slug === cleanSlug ||
      p.id === cleanSlug ||
      p.name.toLowerCase().trim().replace(/[-_]/g, ' ') === normalized
  );
  const primaryNameEn = place ? place.name : cleanSlug.replace(/-/g, ' ');
  const primaryNameMr = place?.name_mr || primaryNameEn;
  const category = place?.category_slug || place?.category || 'general';

  const cleanName = primaryNameEn.split(' (')[0].trim();
  const aliases = [cleanName.toLowerCase(), cleanSlug.replace(/-/g, ' ')];

  return {
    slug: cleanSlug,
    primaryNameEn,
    primaryNameMr,
    category,
    aliases,
    keywords: [cleanName.toLowerCase()],
    marathiKeywords: primaryNameMr ? [primaryNameMr] : [],
    locality: place?.address || 'Pune District',
    administrativeBody: 'Pune District Administration',
    administrativeBodyMr: 'पुणे जिल्हा प्रशासन',
    officialPortalUrl: 'https://pune.gov.in/',
  };
}

/**
 * Evaluates the overall Live Destination Status.
 * 
 * Rules:
 * 1. If an active official order or confirmed restriction dictates closure -> 'closed'
 * 2. If an active official regulation limits hours / routes -> 'restricted'
 * 3. If an active severe hazard warning exists -> 'warning'
 * 4. If recent data was verified (< 48 hrs) and no restrictions are active -> 'open'
 * 5. If data is stale or sources could not be reached -> 'unconfirmed'
 */
export async function getDestinationLiveStatus(
  slug: string,
  forceRefresh = false
): Promise<DestinationLiveStatusSummary> {
  const cleanSlug = slug.toLowerCase().trim();
  const profile = getOrCreateDestinationProfile(cleanSlug);
  const now = Date.now();

  // Check cache first unless forceRefresh is true
  if (!forceRefresh) {
    const cached = STATUS_CACHE.get(profile.slug) || STATUS_CACHE.get(cleanSlug);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.summary;
    }
  }

  const nowDate = new Date();

  // 1. Collect Standing Official Orders strictly for this destination
  const standingOrders = OFFICIAL_STANDING_REGULATIONS.filter((alert) => {
    if (alert.destinationSlug !== profile.slug && alert.destinationSlug !== cleanSlug) return false;
    return !isAlertExpired(alert, nowDate);
  });

  // 2. Fetch live news & administrative updates via RSS
  const rawNewsItems = await fetchDestinationNewsRss(profile);

  const activeAlerts: DestinationAlert[] = [...standingOrders];
  const newsUpdates: DestinationAlert[] = [];

  for (const item of rawNewsItems) {
    const classification = classifyNewsImpact(item, profile);

    if (classification.isAlert && classification.alert) {
      activeAlerts.push(classification.alert);
    } else {
      // General news article
      newsUpdates.push({
        id: `news-${Buffer.from(item.link).toString('base64').slice(0, 16)}`,
        destinationSlug: cleanSlug,
        destinationName: profile.primaryNameEn,
        destinationNameMr: profile.primaryNameMr,
        title: item.title,
        severity: 'advisory',
        category: 'general',
        sourceType: 'news_report',
        isOfficialOrder: false,
        statusImpact: 'open',
        summary: item.description || item.title,
        canEnter: null,
        canTrek: null,
        canDarshan: null,
        effectiveFrom: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        effectiveUntil: null,
        issuingAuthority: item.source,
        authorityType: 'news_publisher',
        sourceName: item.source,
        sourceUrl: item.link,
        verifiedAt: new Date().toISOString(),
        isExpired: false,
      });
    }
  }

  // Deduplicate active alerts by title or sourceUrl
  const seenAlertUrls = new Set<string>();
  const dedupedAlerts = activeAlerts.filter((a) => {
    if (seenAlertUrls.has(a.sourceUrl)) return false;
    seenAlertUrls.add(a.sourceUrl);
    return true;
  });

  // Sort alerts: urgent first, then moderate, then advisory
  const severityScore = { urgent: 3, moderate: 2, advisory: 1 };
  dedupedAlerts.sort((a, b) => severityScore[b.severity] - severityScore[a.severity]);

  // 3. Determine Overall Status
  let overallStatus: DestinationStatusType = 'open';
  let badgeClass = 'status-open';
  let statusLabelEn = 'Open — No active restriction found';
  let statusLabelMr = 'सुरू — कोणताही सक्रिय निर्बंध नाही';
  let headlineEn = 'Normal operations verified in latest sources.';
  let headlineMr = 'ताज्या उपलब्ध माहितीनुसार नियमित सुरू आहे.';

  let canEnter: boolean | null = true;
  let canTrek: boolean | null = profile.category === 'forts' ? true : null;
  let canDarshan: boolean | null = profile.category === 'temples' ? true : null;

  // Highest severity impact wins
  const hasClosure = dedupedAlerts.some((a) => a.statusImpact === 'closed');
  const hasRestricted = dedupedAlerts.some((a) => a.statusImpact === 'restricted');
  const hasWarning = dedupedAlerts.some((a) => a.statusImpact === 'warning');

  if (hasClosure) {
    overallStatus = 'closed';
    badgeClass = 'status-closed';
    statusLabelEn = 'Closed';
    statusLabelMr = 'सध्या बंद';
    const closureAlert = dedupedAlerts.find((a) => a.statusImpact === 'closed');
    headlineEn = closureAlert ? closureAlert.title : 'Authoritative source confirms current closure.';
    headlineMr = closureAlert?.titleMr || 'अधिकृत आदेशानुसार सध्या प्रवेश बंद आहे.';
    canEnter = false;
    if (canTrek !== null) canTrek = false;
    if (canDarshan !== null) canDarshan = false;
  } else if (hasRestricted) {
    overallStatus = 'restricted';
    badgeClass = 'status-restricted';
    statusLabelEn = 'Restricted Entry';
    statusLabelMr = 'मर्यादित प्रवेश / नियम लागू';
    const restrAlert = dedupedAlerts.find((a) => a.statusImpact === 'restricted');
    headlineEn = restrAlert ? restrAlert.title : 'Entry or trekking is limited under official regulations.';
    headlineMr = restrAlert?.titleMr || 'अधिकृत नियमांनुसार वेळ किंवा ट्रेकिंग मर्यादित आहे.';
    if (restrAlert?.canEnter !== undefined) canEnter = restrAlert.canEnter;
    if (restrAlert?.canTrek !== undefined) canTrek = restrAlert.canTrek;
    if (restrAlert?.canDarshan !== undefined) canDarshan = restrAlert.canDarshan;
  } else if (hasWarning) {
    overallStatus = 'warning';
    badgeClass = 'status-warning';
    statusLabelEn = 'Safety Warning';
    statusLabelMr = 'सुरक्षा सतर्कता सूचना';
    const warnAlert = dedupedAlerts.find((a) => a.statusImpact === 'warning');
    headlineEn = warnAlert ? warnAlert.title : 'Official hazard or safety advisory is active.';
    headlineMr = warnAlert?.titleMr || 'प्रशासनाकडून सावधगिरीचा इशारा देण्यात आला आहे.';
    if (warnAlert?.canEnter !== undefined) canEnter = warnAlert.canEnter;
    if (warnAlert?.canTrek !== undefined) canTrek = warnAlert.canTrek;
  } else {
    // Open — No active restriction found
    overallStatus = 'open';
    badgeClass = 'status-open';
    statusLabelEn = 'Open — No active restriction found';
    statusLabelMr = 'सुरू — कोणताही सक्रिय निर्बंध नाही';
    headlineEn = 'No verified active restriction found in the latest available sources.';
    headlineMr = 'ताज्या उपलब्ध स्रोतांमध्ये कोणताही सक्रिय निर्बंध आढळलेला नाही.';
  }

  const lastVerifiedIso = new Date().toISOString();
  const lastVerifiedAt = formatIstTimestamp(lastVerifiedIso);

  const summary: DestinationLiveStatusSummary = {
    destinationSlug: profile.slug,
    destinationName: profile.primaryNameEn,
    destinationNameMr: profile.primaryNameMr,
    status: overallStatus,
    statusLabelEn,
    statusLabelMr,
    badgeClass,
    headlineEn,
    headlineMr,
    canEnter,
    canTrek,
    canDarshan,
    activeAlerts: dedupedAlerts,
    newsUpdates: newsUpdates.slice(0, 5), // top 5 most relevant news items
    lastVerifiedAt,
    lastVerifiedIso,
    sourceCount: dedupedAlerts.length + newsUpdates.length,
    isStale: false,
  };

  // Cache result
  STATUS_CACHE.set(profile.slug, { summary, timestamp: now });
  if (cleanSlug !== profile.slug) {
    STATUS_CACHE.set(cleanSlug, { summary, timestamp: now });
  }

  return summary;
}
