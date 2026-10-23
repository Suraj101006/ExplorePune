/**
 * Explore Pune - Community Safety, Dignity & Content Moderation Engine
 * 
 * Enforces travel-focused, respectful, non-harassing community interactions.
 * Features 3-tier moderation:
 *   - 🟢 allowed: safe, constructive, travel-relevant
 *   - 🟡 review: uncertain or sensitive, held for human moderator review
 *   - 🔴 blocked: privacy leak, slurs, scams, threats, or severe abuse
 *
 * Distinguishes constructive criticism (e.g. "poor parking") from harmful content.
 */

export type ModerationOutcome = 'allowed' | 'review' | 'blocked';

export type ModerationCategory =
  | 'clean'
  | 'privacy_violation'
  | 'contact_info'
  | 'spam_scam'
  | 'abuse_harassment'
  | 'hate_speech'
  | 'sexual_inappropriate'
  | 'dangerous_behavior'
  | 'suspicious_link';

export interface ModerationResult {
  outcome: ModerationOutcome;
  category: ModerationCategory;
  reasonEn: string;
  reasonMr: string;
  flaggedPhrases: string[];
  safeSnippet?: string;
}

// 1. Phone number & Indian mobile patterns
// Matches 10-digit Indian numbers with optional +91, 0, dashes, spaces
const PHONE_REGEXES = [
  /(?:\+91[\s.-]?)?[6-9]\d{4}[\s.-]?\d{5}\b/g,
  /\b\d{5}[\s.-]\d{5}\b/g,
  /\b(?:\+?91)?[6-9]\d{9}\b/g,
  /\b(?:call|whatsapp|contact|phone|ph|mob|call me at|msg on)\s*[:\-]?\s*[\d\s+\-.]{8,15}\b/i,
];

// 2. Email addresses
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// 3. Street/Residence address cues (doxxing protection)
const RESIDENCE_ADDRESS_REGEX = /\b(?:flat\s*no|plot\s*no|room\s*no|bldg|building\s*no|house\s*no|lane\s*no|colony\s*road|behind\s*my\s*house|call\s*my\s*number)\b/i;

// 4. Suspicious links, link shorteners, crypto & scam domains
const SCAM_LINK_REGEX = /\b(?:bit\.ly|tinyurl\.com|t\.me|wa\.me|cutt\.ly|goo\.gl|free-crypto|earn-daily|paytm-cash|loan-instant|telegram\.me)\b/i;

// 5. Spam / Scam / Promotional flooding keywords
const SPAM_KEYWORDS = [
  'earn money online',
  'earn ₹',
  'earn 50000',
  'whatsapp for loan',
  'instant loan approved',
  'guaranteed returns',
  'free crypto',
  'forex trading signal',
  'work from home earn',
  'call girl',
  'dating service',
  'dm for hookup',
  'massage parlour contact',
  'subscribe to my channel',
  'join my telegram',
  'best deals discount promo',
];

// 6. Abusive slurs, personal threats, and severe harassment keywords
const ABUSE_KEYWORDS = [
  'kill you',
  'threat to life',
  'beat you up',
  'bloody idiot',
  'bastard',
  'moron',
  'harass',
  'doxx',
  'expose you',
  'shame on you',
  'loser',
  'scumbag',
];

// 7. Hate speech, communal hatred, and caste/religious attacks
const HATE_KEYWORDS = [
  'hate muslims',
  'hate hindus',
  'hate marathis',
  'hate north indians',
  'casteist slur',
  'destroy temple',
  'destroy mosque',
  'burn down',
  'religious parasite',
  'go back to your state',
  'anti national scum',
];

// 8. Dangerous tourist behavior cues (jumping cliffs at forts, trespassing railings)
const DANGEROUS_BEHAVIOR_KEYWORDS = [
  'jump over railing',
  'bypass forest barricade',
  'sneak past guard at night',
  'climb off the cliff face',
  'forbidden cliff edge',
  'drink alcohol on fort top',
  'smuggle beer into wada',
  'ignite firecracker near monument',
];

// 9. Constructive travel criticism indicators (Negative experience ≠ harmful content)
const CONSTRUCTIVE_CRITICISM_CUES = [
  'parking was poor',
  'parking is chaotic',
  'washrooms were dirty',
  'toilets are poorly maintained',
  'ticket counter queue was long',
  'ticket was overpriced',
  'entry fee increased',
  'poor management',
  'staff was unhelpful',
  'steep climb',
  'avoid during heavy rain',
  'slippery steps',
  'crowded on weekends',
  'not wheelchair accessible',
  'no drinking water facility',
];

/**
 * Strips HTML tags and script attempts from user content
 */
export function sanitizeUserText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
}

/**
 * Evaluates user content and produces a 3-tier moderation verdict
 */
export function moderateCommunityContent(title: string, content: string): ModerationResult {
  const combined = `${title} ${content}`.toLowerCase();
  const rawCombined = `${title} ${content}`;
  const flagged: string[] = [];

  // Check 1: Personal Contact Info / Privacy Violations (🔴 Blocked)
  for (const phoneRegex of PHONE_REGEXES) {
    const matches = rawCombined.match(phoneRegex);
    if (matches && matches.length > 0) {
      flagged.push(...matches);
      return {
        outcome: 'blocked',
        category: 'contact_info',
        reasonEn: 'For your privacy and safety, please do not share personal contact numbers publicly.',
        reasonMr: 'तुमच्या गोपनीयतेसाठी आणि सुरक्षेसाठी, कृपया वैयक्तिक फोन नंबर सार्वजनिकरित्या शेअर करू नका.',
        flaggedPhrases: flagged,
      };
    }
  }

  const emailMatches = rawCombined.match(EMAIL_REGEX);
  if (emailMatches && emailMatches.length > 0) {
    flagged.push(...emailMatches);
    return {
      outcome: 'blocked',
      category: 'privacy_violation',
      reasonEn: 'For your privacy, personal email addresses should not be shared in public discussions.',
      reasonMr: 'गोपनीयतेसाठी, सार्वजनिक चर्चेत वैयक्तिक ईमेल पत्ते शेअर करू नका.',
      flaggedPhrases: flagged,
    };
  }

  if (RESIDENCE_ADDRESS_REGEX.test(combined)) {
    return {
      outcome: 'blocked',
      category: 'privacy_violation',
      reasonEn: 'Sharing residential or private addresses is restricted to prevent privacy violations.',
      reasonMr: 'गोपनीयतेच्या सुरक्षेसाठी खाजगी पत्ता किंवा संपर्क माहिती शेअर करण्यास मनाई आहे.',
      flaggedPhrases: ['private residential address'],
    };
  }

  // Check 2: Scams & Suspicious external links (🔴 Blocked)
  if (SCAM_LINK_REGEX.test(combined)) {
    return {
      outcome: 'blocked',
      category: 'suspicious_link',
      reasonEn: 'Suspicious links, link shorteners, or promotional redirectors are not permitted.',
      reasonMr: 'संशयास्पद लिंक्स, रिडायरेक्टर्स किंवा बाह्य जाहिरात लिंक्सना परवानगी नाही.',
      flaggedPhrases: ['unauthorized link'],
    };
  }

  for (const spamPhrase of SPAM_KEYWORDS) {
    if (combined.includes(spamPhrase)) {
      flagged.push(spamPhrase);
      return {
        outcome: 'blocked',
        category: 'spam_scam',
        reasonEn: 'Promotional spam, fake offers, or commercial advertisements are not allowed.',
        reasonMr: 'व्यावसायिक जाहिराती, फेक ऑफर्स किंवा स्पॅम मजकुराला परवानगी नाही.',
        flaggedPhrases: flagged,
      };
    }
  }

  // Check 3: Hate speech & communal hostility (🔴 Blocked)
  for (const hatePhrase of HATE_KEYWORDS) {
    if (combined.includes(hatePhrase)) {
      flagged.push(hatePhrase);
      return {
        outcome: 'blocked',
        category: 'hate_speech',
        reasonEn: 'Hate speech, religious hostility, or discrimination against any community is strictly prohibited.',
        reasonMr: 'धार्मिक, जातीय किंवा प्रादेशिक द्वेष पसरवणारा मजकूर पूर्णपणे प्रतिबंधित आहे.',
        flaggedPhrases: flagged,
      };
    }
  }

  // Check 4: Abusive threats & personal attacks (🔴 Blocked)
  for (const abusePhrase of ABUSE_KEYWORDS) {
    if (combined.includes(abusePhrase)) {
      flagged.push(abusePhrase);
      return {
        outcome: 'blocked',
        category: 'abuse_harassment',
        reasonEn: 'Personal attacks, threats, or harassment violate Explore Pune Community Guidelines.',
        reasonMr: 'व्यक्तिगत अपमान, धमक्या किंवा गैरवर्तन समुदाय नियमांचे उल्लंघन करते.',
        flaggedPhrases: flagged,
      };
    }
  }

  // Check 5: Dangerous activity encouragement (🟡 Review)
  for (const dangerPhrase of DANGEROUS_BEHAVIOR_KEYWORDS) {
    if (combined.includes(dangerPhrase)) {
      flagged.push(dangerPhrase);
      return {
        outcome: 'review',
        category: 'dangerous_behavior',
        reasonEn: 'This discussion mentions high-risk actions at heritage sites and has been held for moderator safety review.',
        reasonMr: 'या चर्चेमध्ये गडकिल्ल्यांवर धोकादायक कृतींचा उल्लेख असल्याने ती पुनरावलोकनासाठी पाठवली आहे.',
        flaggedPhrases: flagged,
      };
    }
  }

  // Check 6: Constructive criticism check
  // If user is expressing a negative travel review (parking, crowd, toilets), ensure it's explicitly allowed!
  const hasConstructiveCriticism = CONSTRUCTIVE_CRITICISM_CUES.some((cue) => combined.includes(cue));
  if (hasConstructiveCriticism) {
    return {
      outcome: 'allowed',
      category: 'clean',
      reasonEn: 'Constructive travel feedback and honest traveler reviews are welcomed.',
      reasonMr: 'प्रामाणिक व विधायक प्रवास अभिप्राय स्वागतार्ह आहेत.',
      flaggedPhrases: [],
    };
  }

  // Default: Clean and travel-relevant (🟢 Allowed)
  return {
    outcome: 'allowed',
    category: 'clean',
    reasonEn: 'Content meets Explore Pune Community Guidelines.',
    reasonMr: 'मजकूर एक्सप्लोर पुणे समुदाय मार्गदर्शक तत्त्वांचे पालन करतो.',
    flaggedPhrases: [],
  };
}

/**
 * Validates whether an uploaded image meets community guidelines
 */
export function validateCommunityImageUpload(
  file: File | { name: string; size: number; type: string }
): { valid: boolean; errorEn?: string; errorMr?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      errorEn: 'Only JPG, PNG, and WebP images are permitted for community safety.',
      errorMr: 'फक्त JPG, PNG आणि WebP स्वरूपातील छायाचित्रांना परवानगी आहे.',
    };
  }

  // Max 5 MB
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      errorEn: 'Image size must be 5 MB or less.',
      errorMr: 'छायाचित्राचा आकार ५ MB किंवा त्यापेक्षा कमी असावा.',
    };
  }

  return { valid: true };
}
