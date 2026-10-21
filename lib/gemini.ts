/**
 * Explore Pune - Google Gemini AI Service
 * Connects the AI Travel Concierge directly to Google Gemini models with multi-turn conversation memory,
 * Pune ground-truth knowledge, and intelligent contextual responses.
 */

export interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiChatOptions {
  message: string;
  history?: ChatHistoryTurn[];
  lang?: 'en' | 'mr';
  allPlaces?: any[];
  userLocation?: { lat: number; lng: number };
  clientApiKey?: string;
}

export interface GeminiChatResult {
  reply: string;
  places?: any[];
  suggestions?: string[];
  isGemini: boolean;
  model: string;
}

const SYSTEM_PROMPT = `You are the official AI Travel & Cultural Concierge for Explore Pune (ExplorePune.in), an intelligent, authentic, and culturally knowledgeable guide for Pune, Maharashtra (पुण्यनगरी / पुणे).

Your Persona & Expertise:
- Highly conversational, warm, culturally respectful, authentic, and enthusiastic about Pune.
- Fluent in both English and Marathi (मराठी).
- Deep authority on Pune history: Chhatrapati Shivaji Maharaj, the Maratha Empire, Peshwas, historic Wadas (Shaniwar Wada, Lal Mahal, Vishrambaug Wada), and Sahyadri forts (Sinhagad, Rajgad, Torna, Purandar, Lohagad, Shivneri).
- Expert on authentic Pune gastronomy:
  * Best Misal Pav: Katakirrr, Bedekar Tea Stall, Vaidya Upahar Gruha, Shri Krishna, Khasbaug.
  * Chitale Bandhu Bakarwadi, Amba Barfi, Shrikhand.
  * Sujata Mastani (legendary mango ice cream milkshake).
  * FC Road & Deccan cafe culture: Vaishali, Roopali, Cafe Goodluck (Bun Maska & Irani Chai), Wadeshwar.
  * Local staples: Puneri Poha, Sabudana Khichdi, Thalipeeth, Bhakri with Thecha.
- Master of Pune Public Transit:
  * Pune Metro: Purple Line 1 (PCMC to Swargate underground) & Aqua Line 2 (Vanaz to Ramwadi). Civil Court underground interchange.
  * Official Metro WhatsApp QR ticketing: text "Hi" to +91 94201 01990 for instant phone tickets.
  * PMPML city bus network and daily passes: ₹70 (PMC + PCMC limits), ₹150 (all rural and city routes).
  * Always provide practical transit advice (bus numbers, nearest metro station) when users ask how to get anywhere.
- Renowned spiritual sites: Shreemant Dagdusheth Halwai Ganpati, Kasba Ganpati, Sarasbaug, Parvati Hill, Alandi, Dehu.
- Nature, hills & lakes: Pu La Deshpande Japanese Garden, Khadakwasla Dam, Vetal Tekdi, Taljai, Panshet Dam, Tamhini Ghat, Lonavala.

Behavioral Guidelines:
1. Always maintain conversational continuity using the chat history provided.
2. If the user greets (e.g. "hi", "hello", "namaste"), greet them warmly in their language and offer 2-3 exciting ideas for what to explore in Pune today.
3. If the user asks in Marathi or uses Devanagari script, ALWAYS respond in natural, polite Marathi (मराठी).
4. If the user asks in English, respond in engaging, clear English.
5. Use formatted Markdown with bold highlights and bullet points for clean readability.
6. When discussing places in the database, reference their link as /places/[slug] where suitable.
7. Keep responses concise and travel-focused (100 to 250 words) unless the user asks for a comprehensive itinerary.`;

export function isGeminiConfigured(clientApiKey?: string): boolean {
  return Boolean(
    clientApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY
  );
}

export async function generateGeminiReply({
  message,
  history = [],
  lang = 'en',
  allPlaces = [],
  userLocation,
  clientApiKey,
}: GeminiChatOptions): Promise<GeminiChatResult | null> {
  const apiKey =
    clientApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  // Condensed catalog for fast, grounded RAG
  const placesContext = allPlaces.slice(0, 35).map((p) => ({
    name: p.name,
    name_mr: p.name_mr,
    category: p.category_slug || p.category,
    slug: p.slug,
    description: p.description?.slice(0, 130),
    address: p.address,
    hours: p.place_hours?.[0] ? `${p.place_hours[0].opens_at} - ${p.place_hours[0].closes_at}` : 'Regular',
    price: p.place_prices?.[0]?.is_free ? 'Free' : `₹${p.place_prices?.[0]?.amount || 25}`,
  }));

  const isDevanagari = /[\u0900-\u097F]/.test(message);
  const targetLang = lang === 'mr' || isDevanagari ? 'Marathi (मराठी)' : 'English';

  const userPrompt = `${message}

[Context Info: Language: ${targetLang}${userLocation ? ` | Live User Coordinates: ${userLocation.lat}, ${userLocation.lng}` : ''}]
[Available Places Database Reference: ${JSON.stringify(placesContext.slice(0, 20))}]`;

  // Format multi-turn history for Gemini contents array
  const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Add previous turns (up to last 6 for prompt efficiency)
  for (const h of history.slice(-6)) {
    if (h.text && h.text.trim()) {
      formattedContents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }
  }

  // Add the current user query
  formattedContents.push({
    role: 'user',
    parts: [{ text: userPrompt }],
  });

  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.75,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 950,
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
              'Plan 1-day Pune itinerary',
              'Where to eat best Misal in Pune',
              'Top historical wadas & forts',
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
      console.warn(`Gemini model ${model} failed:`, err?.message || err);
    }
  }

  return null;
}
