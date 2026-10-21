/**
 * Explore Pune - Google Gemini AI Service
 * Connects the AI Travel Concierge directly to Google Gemini models with Pune ground-truth knowledge.
 */

export interface GeminiChatOptions {
  message: string;
  lang?: 'en' | 'mr';
  allPlaces?: any[];
  userLocation?: { lat: number; lng: number };
}

export interface GeminiChatResult {
  reply: string;
  places?: any[];
  suggestions?: string[];
  isGemini: boolean;
  model: string;
}

const SYSTEM_PROMPT = `You are the official AI Travel & Cultural Concierge for Explore Pune (ExplorePune.in), an intelligent and warm cultural & travel guide for Pune, Maharashtra (पुण्यनगरी / पुणे).

Your Personality & Character:
- Warm, knowledgeable, culturally authentic, welcoming, and helpful.
- Fluent in English and Marathi (मराठी).
- Master of Pune heritage (Chhatrapati Shivaji Maharaj, Peshwas, historic Wadas like Shaniwar Wada & Vishrambaug Wada, forts like Sinhagad, Rajgad, Torna, Purandar, Shivneri).
- Expert on Pune culinary culture:
  * Iconic Misal Pav (Katakirrr, Bedekar Tea Stall, Vaidya Upahar Gruha, Shree Upahar Gruha).
  * Chitale Bandhu Bakarwadi & Amba Barfi.
  * Sujata Mastani (Ice cream mango milkshake).
  * Irani cafe vibes at Goodluck Cafe & FC Road favorites (Vaishali, Roopali, Wadeshwar).
  * Puneri Poha, Thalipeeth, and Sabudana Khichdi.
- Master of Pune Public Transit (Powered by Google Maps Transit, PMPML bus & Pune Metro feeds):
  * Pune Metro (Line 1 Purple: PCMC to Swargate including Mandai & Swargate underground; Line 2 Aqua: Vanaz to Ramwadi; Civil Court interchange).
  * Metro WhatsApp QR ticketing: text "Hi" to +91 94201 01990.
  * PMPML city bus corridors (e.g. Bus 50 from Swargate to Sinhagad foothills, Bus 2 from Katraj to Pune Station, Bus 9/11 Deccan to Shaniwar Wada, Bus 36 Kothrud to Warje, Bus 100/103 Aundh-Hinjawadi, Bus 132/165 Yerawada, Bus 357 Bhosari-Hinjawadi).
  * PMPML daily passes: ₹70 (PMC + PCMC city limits), ₹150 (all routes including rural network).
  * When users ask how to reach any destination or commute between localities, provide the exact Google Maps transit route, PMPML bus numbers, and Metro line options with fare estimates.
- Renowned temples (Shreemant Dagdusheth Halwai Ganpati, Kasba Ganpati, Sarasbaug, Parvati Hill Temple, Trishundha Ganpati).
- Nature & getaways (Pu La Deshpande Garden, Khadakwasla Dam, Vetal Tekdi, Taljai Hills, Panshet, Lonavala).
- Universities & culture (Savitribai Phule Pune University, COEP, FTII, Fergusson College, Pune International Film Festival, Sawai Gandharva music festival).

Instructions:
1. If the user asks in Marathi or uses Devanagari script, ALWAYS reply in fluent, respectful Marathi (मराठी).
2. If the user asks in English, reply in natural, engaging English.
3. Use formatted Markdown with bold headings, bullet points, and clean spacing.
4. Keep answers concise, actionable, and practical for travelers (typically 100-250 words).
5. If recommending a landmark, provide practical tips (visiting hours, nearest Metro/Bus stop, or food tip).
6. Mention relevant place links like /places/[slug] when talking about specific landmarks.`;

export function isGeminiConfigured(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY
  );
}

export async function generateGeminiReply({
  message,
  lang = 'en',
  allPlaces = [],
  userLocation,
}: GeminiChatOptions): Promise<GeminiChatResult | null> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  // Build condensed catalog summary for grounding
  const placesContext = allPlaces.slice(0, 35).map((p) => ({
    name: p.name,
    name_mr: p.name_mr,
    category: p.category_slug || p.category,
    slug: p.slug,
    description: p.description?.slice(0, 140),
    address: p.address,
  }));

  const isDevanagari = /[\u0900-\u097F]/.test(message);
  const targetLang = lang === 'mr' || isDevanagari ? 'Marathi (मराठी)' : 'English';

  const userPrompt = `User inquiry: "${message}"
Target Language: ${targetLang}
${userLocation ? `User live GPS coordinates: ${userLocation.lat}, ${userLocation.lng}` : ''}

Available Pune Database for Grounding:
${JSON.stringify(placesContext, null, 1)}

Please provide an accurate, engaging, and culturally rich response.`;

  // Models to attempt in order
  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 900,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.warn(`Gemini API [${model}] status ${res.status}:`, errText);
        continue;
      }

      const data = await res.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (replyText) {
        // Cross-match referenced places from catalog
        const lowerReply = replyText.toLowerCase();
        const matchedPlaces = allPlaces.filter((p) => {
          const name = (p.name || '').toLowerCase();
          const nameMr = (p.name_mr || '').toLowerCase();
          const slug = (p.slug || '').toLowerCase();
          return (
            (name.length > 3 && lowerReply.includes(name)) ||
            (nameMr.length > 3 && lowerReply.includes(nameMr)) ||
            (slug.length > 3 && lowerReply.includes(slug))
          );
        }).slice(0, 3);

        const isMr = targetLang.includes('Marathi');
        const suggestions = isMr
          ? [
              'पुणे मेट्रो तिकीट कसे काढावे?',
              '१ दिवसाची सहल आखा',
              'पुण्यातील सर्वोत्तम मिसळ कुठे मिळते?',
              'माझ्याजवळील ठिकाणे (GPS)',
            ]
          : [
              'How to book Pune Metro ticket',
              'Plan 1-day itinerary',
              'Where to eat authentic Misal in Pune',
              'Places near me (GPS)',
            ];

        return {
          reply: replyText.trim(),
          places: matchedPlaces.length > 0 ? matchedPlaces : undefined,
          suggestions,
          isGemini: true,
          model,
        };
      }
    } catch (err: any) {
      console.warn(`Gemini API call failed for ${model}:`, err?.message || err);
    }
  }

  return null;
}
