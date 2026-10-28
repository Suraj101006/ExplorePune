/**
 * Universal Destination Intelligence System for Explore Pune
 * Analyzes any destination in the database and computes:
 * - Narrative arc (5-act storytelling)
 * - Visual mood, color grading LUT/palettes
 * - Typography and motion style
 * - Rhythm, pacing, beat triggers
 * - Meaningful dual-language poetic captions (English & Marathi)
 */

export interface DestinationProfile {
  categoryKey:
    | 'forts'
    | 'heritage'
    | 'temples'
    | 'nature'
    | 'museums'
    | 'parks'
    | 'food'
    | 'markets'
    | 'city_culture';
  themeNameEn: string;
  themeNameMr: string;
  visualMood: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    overlayGradient: string;
    canvasFilter: string; // CSS canvas filter style
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    subtitleStyle: string;
    accentCase: 'uppercase' | 'capitalize' | 'normal';
  };
  motionStyle: {
    pacingSpeed: 'heroic' | 'regal' | 'meditative' | 'breezy' | 'punchy';
    kenBurnsScale: number; // e.g. 1.15
    transitionEffect: 'crossfade' | 'zoom_punch' | 'wipe_light' | 'cinematic_blur';
    beatDropIntensity: 'high' | 'medium' | 'gentle';
  };
  narrativeCurve: {
    hookTextEn: string;
    hookTextMr: string;
    discoveryTitleEn: string;
    discoveryTitleMr: string;
    immersionFocusEn: string;
    immersionFocusMr: string;
    climaxQuoteEn: string;
    climaxQuoteMr: string;
    outroSignatureEn: string;
    outroSignatureMr: string;
  };
  recommendedMusicMood: 'adventure' | 'heritage' | 'spiritual' | 'nature' | 'food' | 'ambient';
}

// Landmark-specific overrides for top iconic Pune destinations
const ICONIC_LANDMARK_PROFILES: Record<string, Partial<DestinationProfile>> = {
  'sinhagad-fort': {
    themeNameEn: 'Sahyadri Bastion of Valour',
    themeNameMr: 'सह्याद्रीचा अजिंक्य दुर्ग कोंढाणा',
    visualMood: 'Epic mountain mist, rugged basalt battlements, heroic Sahyadri morning sunlight',
    palette: {
      primary: '#d97706', // Sahyadri Ochre
      secondary: '#065f46', // Deep Monsoon Emerald
      accent: '#fbbf24', // Morning Gold
      overlayGradient: 'linear-gradient(180deg, rgba(6,95,70,0.15) 0%, rgba(15,23,42,0.85) 100%)',
      canvasFilter: 'contrast(1.08) saturate(1.15) brightness(0.96)',
    },
    narrativeCurve: {
      hookTextEn: '1,312 Metres High in the Sahyadris',
      hookTextMr: 'समुद्रसपाटीपासून १,३१२ मीटर उंच सह्याद्रीत',
      discoveryTitleEn: 'Standing at the Kalyan Darwaza',
      discoveryTitleMr: 'कल्याण दरवाजा व तानाजी स्मारक',
      immersionFocusEn: 'Echoes of 1670 Maratha Bravery & Misty Valleys',
      immersionFocusMr: '१६७० च्या शौर्याच्या कथा आणि अथांग दऱ्या',
      climaxQuoteEn: '“Where mountain winds carry centuries of Maratha valour.”',
      climaxQuoteMr: '“सह्याद्रीच्या कड्यांवर धुक्याची चादर आणि असीम पराक्रमाची साक्ष.”',
      outroSignatureEn: 'Sinhagad • Forever Majestic in Pune’s Heart',
      outroSignatureMr: 'सिंहगड • पुणेकरांचा अभिमान व सह्याद्रीचे वैभव',
    },
    recommendedMusicMood: 'adventure',
  },
  'shaniwar-wada': {
    themeNameEn: 'Seat of the Maratha Empire',
    themeNameMr: 'पेशवाईचे ऐतिहासिक वैभव शनिवार वाडा',
    visualMood: 'Peshwa royalty, carved teakwood, imposing stone bastions and Dilli Darwaza gates',
    palette: {
      primary: '#b45309', // Royal Amber
      secondary: '#451a03', // Teak Brown
      accent: '#f59e0b', // Peshwa Gold
      overlayGradient: 'linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,5,0.88) 100%)',
      canvasFilter: 'contrast(1.05) sepia(0.18) saturate(1.1)',
    },
    narrativeCurve: {
      hookTextEn: 'Built in 1732 by Peshwa Bajirao I',
      hookTextMr: '१७३२ मधील थोरले बाजीराव पेशव्यांचा वाडा',
      discoveryTitleEn: 'The Mighty Teak Dilli Darwaza',
      discoveryTitleMr: 'भव्य अणकुचीदार खिळ्यांचा दिल्ली दरवाजा',
      immersionFocusEn: 'Courtyards of Royal Assemblies & Lotus Fountains',
      immersionFocusMr: 'हजारी कारंजे आणि पेशवेकालीन दरबाराच्या आठवणी',
      climaxQuoteEn: '“Echoes of the Peshwa court standing tall through the teak gates.”',
      climaxQuoteMr: '“भव्य दिल्ली दरवाजा आणि पेशवेकालीन पराक्रमाच्या जिवंत आठवणी.”',
      outroSignatureEn: 'Shaniwar Wada • The Heart of Historic Pune',
      outroSignatureMr: 'शनिवार वाडा • पुण्याच्या ऐतिहासिक वैभवाची साक्ष',
    },
    recommendedMusicMood: 'heritage',
  },
  'shreemant-dagdusheth-halwai-ganpati': {
    themeNameEn: 'Sanctum of Golden Benevolence',
    themeNameMr: 'पुण्याचे आराध्य दैवत श्रीमंत दगडूशेठ गणपती',
    visualMood: 'Devotional aura, glowing brass lamps, marigold flower garlands, and pure spiritual calm',
    palette: {
      primary: '#ea580c', // Marigold Saffron
      secondary: '#7c2d12', // Deep Temple Wood
      accent: '#facc15', // Sanctum Gold
      overlayGradient: 'linear-gradient(180deg, rgba(124,45,18,0.2) 0%, rgba(26,10,3,0.88) 100%)',
      canvasFilter: 'contrast(1.06) saturate(1.22) brightness(1.02)',
    },
    narrativeCurve: {
      hookTextEn: 'Pune’s Most Revered Deity Since 1893',
      hookTextMr: '१८९३ पासून अवघ्या पुण्याचे श्रद्धेय आराध्य दैवत',
      discoveryTitleEn: 'The Golden Sanctum of Bappa',
      discoveryTitleMr: 'मंगलमूर्तीचे मनःशांती देणारे सुवर्ण दर्शन',
      immersionFocusEn: 'Bells, Aarti Chants & Unbroken Faith',
      immersionFocusMr: 'घंटानाद, आरतीचे सूर आणि अथांग लोकभक्ती',
      climaxQuoteEn: '“Golden benevolence and peaceful darshan in the heart of Pune.”',
      climaxQuoteMr: '“पुण्याच्या हृदयात मंगलमूर्तीचे मनःशांती देणारे सुवर्ण दर्शन.”',
      outroSignatureEn: 'Dagdusheth Ganpati • Infinite Blessings',
      outroSignatureMr: 'श्रीमंत दगडूशेठ • सुखकर्ता आणि विघ्नहर्ता',
    },
    recommendedMusicMood: 'spiritual',
  },
  'aga-khan-palace': {
    themeNameEn: 'Monuments of Freedom & Italian Grace',
    themeNameMr: 'स्वातंत्र्यलढ्याचे मूक साक्षीदार आगा खान पॅलेस',
    visualMood: 'Italian arches, sweeping manicured lawns, serene colonial memorial architecture',
    palette: {
      primary: '#0284c7', // Serene Sky
      secondary: '#064e3b', // Heritage Garden Green
      accent: '#38bdf8', // Morning Sunlight
      overlayGradient: 'linear-gradient(180deg, rgba(6,78,59,0.15) 0%, rgba(15,23,42,0.86) 100%)',
      canvasFilter: 'contrast(1.03) saturate(1.1) brightness(0.98)',
    },
    narrativeCurve: {
      hookTextEn: 'National Monument of India’s Freedom Movement',
      hookTextMr: 'भारतीय स्वातंत्र्य चळवळीचे पवित्र राष्ट्रीय स्मारक',
      discoveryTitleEn: 'Graceful Italian Arches & Corridors',
      discoveryTitleMr: 'इटालियन कमानी आणि विस्तीर्ण शांत दालने',
      immersionFocusEn: 'Quiet Memorials of Mahatma Gandhi & Kasturba',
      immersionFocusMr: 'महात्मा गांधी व कस्तुरबांच्या स्मृतींचे शांत स्मारक',
      climaxQuoteEn: '“Italian arches embracing quiet memories of India’s freedom dawn.”',
      climaxQuoteMr: '“इटालियन कमानी आणि स्वातंत्र्यलढ्याच्या मूक आठवणींचे शांत उद्यान.”',
      outroSignatureEn: 'Aga Khan Palace • Quiet Reverence in Nagar Road',
      outroSignatureMr: 'आगा खान पॅलेस • शांतता, वारसा व राष्ट्रस्मृती',
    },
    recommendedMusicMood: 'heritage',
  },
  'pataleshwar-cave-temple': {
    themeNameEn: '8th-Century Monolithic Basalt Sanctuary',
    themeNameMr: '८व्या शतकातील पाताळेश्वर शैलमंदिर',
    visualMood: 'Ancient carved basalt stone, circular Nandi mandapa, tranquil meditative cool inside the stone',
    palette: {
      primary: '#64748b', // Basalt Slate
      secondary: '#1e293b', // Deep Monolith Shadow
      accent: '#38bdf8', // Cool Chiseled Light
      overlayGradient: 'linear-gradient(180deg, rgba(30,41,59,0.2) 0%, rgba(15,23,42,0.9) 100%)',
      canvasFilter: 'contrast(1.1) grayscale(0.1) brightness(0.95)',
    },
    narrativeCurve: {
      hookTextEn: 'Carved from a Single Rock 1,200 Years Ago',
      hookTextMr: '१,२०० वर्षांपूर्वी एकाच काळ्या पाषाणात कोरलेले शिल्प',
      discoveryTitleEn: 'Circular Nandi Mandapa of Rashtrakuta Era',
      discoveryTitleMr: 'राष्ट्रकूट काळातील वर्तुळाकार नंदी मंडप',
      immersionFocusEn: 'Timeless Monolithic Pillars & Hidden Shivalinga',
      immersionFocusMr: 'अखंड दगडी खांब आणि शांत ध्यानमग्न वातावरण',
      climaxQuoteEn: '“Carved directly from living basalt stone twelve centuries ago.”',
      climaxQuoteMr: '“८व्या शतकातील अखंड काळ्या पाषाणात कोरलेले गूढ व शांत शिवमंदिर.”',
      outroSignatureEn: 'Pataleshwar • Ancient Silence on JM Road',
      outroSignatureMr: 'पाताळेश्वर • गजबजलेल्या शहरात १२ शतकांची गूढ शांतता',
    },
    recommendedMusicMood: 'spiritual',
  },
  'khadakwasla-dam': {
    themeNameEn: 'Sahyadri Lakeside & Evening Breeze',
    themeNameMr: 'खडकवासला संथ लाटा व सह्याद्री वारा',
    visualMood: 'Glistening reservoir waves, cool mountain breezes, golden reflection of evening clouds',
    palette: {
      primary: '#0284c7', // Reservoir Blue
      secondary: '#075985', // Deep Water Blue
      accent: '#38bdf8', // Ripple Shimmer
      overlayGradient: 'linear-gradient(180deg, rgba(7,89,133,0.15) 0%, rgba(12,74,110,0.85) 100%)',
      canvasFilter: 'contrast(1.04) saturate(1.2) brightness(1.0)',
    },
    narrativeCurve: {
      hookTextEn: 'The Lifeline Reservoir of Pune',
      hookTextMr: 'पुणे शहराची जीवनवाहिनी आणि निसर्गरम्य जलाशय',
      discoveryTitleEn: 'Panoramic Shorelines with Sinhagad in View',
      discoveryTitleMr: 'सिंहगडाच्या पायथ्याशी पसरलेला विस्तीर्ण जलाशय',
      immersionFocusEn: 'Cool Evening Ripples & Fresh Roasted Corn',
      immersionFocusMr: 'संथ लाटांचा मंद आवाज आणि गरमागरम भाजलेले कणीस',
      climaxQuoteEn: '“Cool morning ripples reflecting southern Sahyadri ridge lines.”',
      climaxQuoteMr: '“खडकवासल्याच्या संथ लाटा आणि सह्याद्रीच्या टेकड्यांचे सुंदर प्रतिबिंब.”',
      outroSignatureEn: 'Khadakwasla • The City’s Beloved Sunset Escape',
      outroSignatureMr: 'खडकवासला • संध्याकाळच्या मनसोक्त निवांत गप्पांची जागा',
    },
    recommendedMusicMood: 'nature',
  },
  'fc-road-culinary-trail': {
    themeNameEn: 'Fergusson College Road Food Walk',
    themeNameMr: 'एफसी रोड खाद्यसंस्कृती सफर',
    visualMood: 'Youthful energy, sizzling butter dosas, thick mango mastani, lively Pune evening streets',
    palette: {
      primary: '#e11d48', // Spicy Crimson
      secondary: '#881337', // Roasted Cocoa
      accent: '#fbbf24', // Mango Mastani Yellow
      overlayGradient: 'linear-gradient(180deg, rgba(136,19,55,0.15) 0%, rgba(20,5,10,0.88) 100%)',
      canvasFilter: 'contrast(1.1) saturate(1.28) brightness(1.02)',
    },
    narrativeCurve: {
      hookTextEn: 'Pune’s Legendary Student & Culinary Strip',
      hookTextMr: 'पुण्यातील सर्वात गजबजलेला चविष्ट खाद्यमार्ग',
      discoveryTitleEn: 'Vaishali, Roopali & Iconic Cafe Culture',
      discoveryTitleMr: 'वैशाली, रूपाली आणि पुण्याचे कॅफे कट्टे',
      immersionFocusEn: 'Crispy Dosas, Steaming Filter Kaapi & Fresh Mastani',
      immersionFocusMr: 'मस्त सांबार, वाफाळलेली कॉफी आणि पुण्याची प्रसिद्ध मस्तानी',
      climaxQuoteEn: '“Where every street corner smells of crisp dosas and sweet nostalgia.”',
      climaxQuoteMr: '“पुण्याच्या गप्पांचे कट्टे आणि प्रत्येक कोपऱ्यातील चविष्ट आठवणी.”',
      outroSignatureEn: 'FC Road • The Pulsing Heart of Puneri Youth',
      outroSignatureMr: 'एफसी रोड • तरुण उत्साहाची आणि अस्सल स्वादाची ओळख',
    },
    recommendedMusicMood: 'food',
  },
};

/**
 * Universal Fallback Category Intelligence
 * Works for ANY current or future destination in the Explore Pune database!
 */
export function getDestinationProfile(place: {
  placeId?: string;
  placeSlug?: string;
  category?: string;
  category_slug?: string;
  name?: string;
  name_mr?: string;
  description?: string;
  description_mr?: string;
  elevation?: string | number;
  address?: string;
  address_mr?: string;
  best_time?: string;
  latitude?: number;
  longitude?: number;
}): DestinationProfile {
  const slug = (place.placeSlug || place.placeId || '').toLowerCase().trim();

  // 1. Check exact landmark override
  if (ICONIC_LANDMARK_PROFILES[slug]) {
    const override = ICONIC_LANDMARK_PROFILES[slug];
    const cat = resolveCategoryKey(place.category || place.category_slug || '', slug);
    const baseCategoryDefaults = getCategoryDefaults(cat);
    return {
      ...baseCategoryDefaults,
      ...override,
      palette: { ...baseCategoryDefaults.palette, ...(override.palette || {}) },
      narrativeCurve: { ...baseCategoryDefaults.narrativeCurve, ...(override.narrativeCurve || {}) },
    };
  }

  // 2. Resolve category key
  const categoryKey = resolveCategoryKey(
    place.category || place.category_slug || '',
    slug + ' ' + (place.name || '')
  );

  const base = getCategoryDefaults(categoryKey);

  // 3. Adapt text dynamically to the place's actual verified database data
  const placeTitle = place.name || 'Explore Pune Landmark';
  const placeTitleMr = place.name_mr || place.name || 'पुणे प्रेक्षणीय स्थळ';

  // Ground elevation and address in verified fields if present
  let hookEn = `Discovering ${placeTitle}`;
  let hookMr = `${placeTitleMr} चा विलोभनीय प्रवास`;
  if (place.elevation) {
    const elevStr = typeof place.elevation === 'number' ? `${place.elevation}m` : `${place.elevation}`;
    hookEn = `${elevStr} • ${placeTitle}`;
    hookMr = `उंची ${elevStr} • ${placeTitleMr}`;
  } else if (place.address) {
    const shortAddr = place.address.split(',')[0].trim();
    hookEn = `${shortAddr} • ${placeTitle}`;
  }

  // Immersion focus from verified database description
  let immersionEn = base.narrativeCurve.immersionFocusEn;
  let immersionMr = base.narrativeCurve.immersionFocusMr;
  if (place.description && place.description.length > 20) {
    const sentence = place.description.split('.')[0].trim();
    immersionEn = sentence.length > 70 ? sentence.slice(0, 67) + '...' : sentence;
  }
  if (place.description_mr && place.description_mr.length > 20) {
    const sentenceMr = place.description_mr.split('.')[0].trim();
    immersionMr = sentenceMr.length > 60 ? sentenceMr.slice(0, 57) + '...' : sentenceMr;
  }

  return {
    ...base,
    narrativeCurve: {
      hookTextEn: hookEn,
      hookTextMr: hookMr,
      discoveryTitleEn: `Architectural Wonder of ${placeTitle}`,
      discoveryTitleMr: `${placeTitleMr} ची अद्वितीय ओळख`,
      immersionFocusEn: immersionEn,
      immersionFocusMr: immersionMr,
      climaxQuoteEn: base.narrativeCurve.climaxQuoteEn,
      climaxQuoteMr: base.narrativeCurve.climaxQuoteMr,
      outroSignatureEn: `${placeTitle} • Cherished in Memory`,
      outroSignatureMr: `${placeTitleMr} • प्रवासाच्या सुंदर आठवणी`,
    },
  };
}

/**
 * Resolves semantic category key from category text and slug
 */
function resolveCategoryKey(
  category: string,
  hintText: string
): DestinationProfile['categoryKey'] {
  const t = (category + ' ' + hintText).toLowerCase();

  if (t.includes('fort') || t.includes('killa') || t.includes('gad') || t.includes('bastion') || t.includes('trek')) {
    return 'forts';
  }
  if (t.includes('temple') || t.includes('ganpati') || t.includes('mandir') || t.includes('shrine') || t.includes('sacred') || t.includes('spiritual')) {
    return 'temples';
  }
  if (t.includes('food') || t.includes('culinary') || t.includes('misal') || t.includes('bakery') || t.includes('chai') || t.includes('cafe')) {
    return 'food';
  }
  if (t.includes('lake') || t.includes('dam') || t.includes('waterfall') || t.includes('nature') || t.includes('tekdi') || t.includes('hill') || t.includes('ghat')) {
    return 'nature';
  }
  if (t.includes('museum') || t.includes('gallery') || t.includes('archive') || t.includes('memorial') || t.includes('exhibit')) {
    return 'museums';
  }
  if (t.includes('park') || t.includes('garden') || t.includes('baug') || t.includes('botanical') || t.includes('zoo')) {
    return 'parks';
  }
  if (t.includes('market') || t.includes('peth') || t.includes('bazaar') || t.includes('shopping')) {
    return 'markets';
  }
  if (t.includes('wada') || t.includes('palace') || t.includes('heritage') || t.includes('historic') || t.includes('monument')) {
    return 'heritage';
  }
  return 'city_culture';
}

/**
 * Provides production-grade cinematic default profiles per category
 */
function getCategoryDefaults(categoryKey: DestinationProfile['categoryKey']): DestinationProfile {
  switch (categoryKey) {
    case 'forts':
      return {
        categoryKey: 'forts',
        themeNameEn: 'Sahyadri Fortress & Adventure',
        themeNameMr: 'सह्याद्री दुर्ग व साहसी मोहीम',
        visualMood: 'Epic heights, misty ridge lines, stone ramparts and winds of freedom',
        palette: {
          primary: '#d97706',
          secondary: '#1c1917',
          accent: '#f59e0b',
          overlayGradient: 'linear-gradient(180deg, rgba(28,25,23,0.15) 0%, rgba(12,10,9,0.88) 100%)',
          canvasFilter: 'contrast(1.08) saturate(1.15) brightness(0.97)',
        },
        typography: {
          headerFont: 'Cinzel, Georgia, serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-widest uppercase font-semibold text-amber-300',
          accentCase: 'uppercase',
        },
        motionStyle: {
          pacingSpeed: 'heroic',
          kenBurnsScale: 1.18,
          transitionEffect: 'zoom_punch',
          beatDropIntensity: 'high',
        },
        narrativeCurve: {
          hookTextEn: 'Conquering the Historic Bastions',
          hookTextMr: 'सह्याद्रीच्या अजिंक्य दुर्गाची वाटचाल',
          discoveryTitleEn: 'Ramparts Carved in Living Stone',
          discoveryTitleMr: 'काळ्या पाषाणात घडवलेले अभेद्य बुरूज',
          immersionFocusEn: 'Winds Whispering Tales of Maratha Valour',
          immersionFocusMr: 'वारा आणि डोंगरांनी जपलेला स्वाभिमानाचा इतिहास',
          climaxQuoteEn: '“Where every cliff tells a tale of unyielding freedom.”',
          climaxQuoteMr: '“सह्याद्रीच्या प्रत्येक कड्यावर कोरलाय पराक्रमाचा इतिहास.”',
          outroSignatureEn: 'Sahyadri Bastions • Eternal Guardians of the Deccan',
          outroSignatureMr: 'सह्याद्रीचे दुर्ग • महाराष्ट्राची अमर शौर्यगाथा',
        },
        recommendedMusicMood: 'adventure',
      };

    case 'heritage':
      return {
        categoryKey: 'heritage',
        themeNameEn: 'Peshwa Era & Royal Heritage',
        themeNameMr: 'पेशवेकालीन ऐतिहासिक वारसा',
        visualMood: 'Teakwood pillars, antique stone arches, royal courtyards and classical majesty',
        palette: {
          primary: '#b45309',
          secondary: '#292524',
          accent: '#fbbf24',
          overlayGradient: 'linear-gradient(180deg, rgba(41,37,36,0.18) 0%, rgba(18,16,15,0.9) 100%)',
          canvasFilter: 'contrast(1.06) sepia(0.12) saturate(1.1)',
        },
        typography: {
          headerFont: 'Playfair Display, Georgia, serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-wider font-medium text-amber-200',
          accentCase: 'capitalize',
        },
        motionStyle: {
          pacingSpeed: 'regal',
          kenBurnsScale: 1.12,
          transitionEffect: 'crossfade',
          beatDropIntensity: 'medium',
        },
        narrativeCurve: {
          hookTextEn: 'Stepping into 18th-Century Grandeur',
          hookTextMr: '१८व्या शतकातील पेशवाई वैभवाची सफर',
          discoveryTitleEn: 'Carved Courtyards & Historic Corridors',
          discoveryTitleMr: 'ऐतिहासिक कमानी आणि लाकडी कोरीव काम',
          immersionFocusEn: 'Living Chronicles of Royal Maharashtra',
          immersionFocusMr: 'मराठा इतिहासातील वैभवशाली पाने',
          climaxQuoteEn: '“Grandeur that time could never fade.”',
          climaxQuoteMr: '“काळाच्या ओघातही न पुसले गेलेले ऐतिहासिक तेज.”',
          outroSignatureEn: 'Heritage Pune • Living Chronicles of the Deccan',
          outroSignatureMr: 'पुणे वारसा • पेशवाई संस्कृतीचे जिवंत साक्षीदार',
        },
        recommendedMusicMood: 'heritage',
      };

    case 'temples':
      return {
        categoryKey: 'temples',
        themeNameEn: 'Sacred Solace & Spiritual Pune',
        themeNameMr: 'पवित्र मंदिरे व आध्यात्मिक मनःशांती',
        visualMood: 'Golden aarti lamps, fragrant marigold flowers, peaceful chimes, and sacred quietude',
        palette: {
          primary: '#ea580c',
          secondary: '#431407',
          accent: '#facc15',
          overlayGradient: 'linear-gradient(180deg, rgba(67,20,7,0.18) 0%, rgba(20,8,4,0.9) 100%)',
          canvasFilter: 'contrast(1.05) saturate(1.2) brightness(1.01)',
        },
        typography: {
          headerFont: 'Cinzel Decorative, Georgia, serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-widest font-semibold text-orange-200',
          accentCase: 'uppercase',
        },
        motionStyle: {
          pacingSpeed: 'meditative',
          kenBurnsScale: 1.08,
          transitionEffect: 'wipe_light',
          beatDropIntensity: 'gentle',
        },
        narrativeCurve: {
          hookTextEn: 'Finding Tranquility in the Heart of the City',
          hookTextMr: 'गजबजलेल्या शहरात मनःशांती देणारा आध्यात्मिक ओएसिस',
          discoveryTitleEn: 'Sanctum of Devotion & Ancient Chants',
          discoveryTitleMr: 'भक्तीभावाने ओथंबलेला पवित्र परिसर',
          immersionFocusEn: 'Sacred Lamps & Peaceful Chimes',
          immersionFocusMr: 'घंटानाद, उदबत्तीचा सुगंध आणि शांत दर्शन',
          climaxQuoteEn: '“In stillness, devotion reveals its purest light.”',
          climaxQuoteMr: '“जिथे मन एकाग्र होते आणि आत्म्याला खरी शांती लाभते.”',
          outroSignatureEn: 'Spiritual Pune • Blessings That Travel with You',
          outroSignatureMr: 'आध्यात्मिक पुणे • आयुष्यभर सोबत राहणारे मंगलमय आशीर्वाद',
        },
        recommendedMusicMood: 'spiritual',
      };

    case 'nature':
      return {
        categoryKey: 'nature',
        themeNameEn: 'Sahyadri Nature, Hills & Lakes',
        themeNameMr: 'सह्याद्रीच्या डोंगररांगा, तलाव व धरणे',
        visualMood: 'Glistening lake water, cool mountain breeze, lush monsoon foliage and panoramic hill views',
        palette: {
          primary: '#059669',
          secondary: '#064e3b',
          accent: '#34d399',
          overlayGradient: 'linear-gradient(180deg, rgba(6,78,59,0.15) 0%, rgba(6,35,26,0.88) 100%)',
          canvasFilter: 'contrast(1.05) saturate(1.22) brightness(1.0)',
        },
        typography: {
          headerFont: 'Outfit, Inter, sans-serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-wider font-semibold text-emerald-300',
          accentCase: 'capitalize',
        },
        motionStyle: {
          pacingSpeed: 'breezy',
          kenBurnsScale: 1.15,
          transitionEffect: 'crossfade',
          beatDropIntensity: 'medium',
        },
        narrativeCurve: {
          hookTextEn: 'Nature’s Serenade in the Western Ghats',
          hookTextMr: 'पश्चिम घाटातील निसर्गाचे विलोभनीय रूप',
          discoveryTitleEn: 'Tranquil Waters & Emerald Hills',
          discoveryTitleMr: 'हिरवेगार डोंगर आणि नितळ पाण्याचे प्रवाह',
          immersionFocusEn: 'Fresh Breeze & Distant Horizons',
          immersionFocusMr: 'थंडगार झुळूक आणि क्षितिजावर पसरलेला निसर्ग',
          climaxQuoteEn: '“Where the water kisses the clouds and hills breathe peace.”',
          climaxQuoteMr: '“निसर्गाच्या कुशीत विसावलेले मन आणि संथ वाहणाऱ्या लाटा.”',
          outroSignatureEn: 'Sahyadri Nature • Pure Air, Pure Wonder',
          outroSignatureMr: 'सह्याद्री निसर्ग • मनाला ताजेतवाने करणारी शांतता',
        },
        recommendedMusicMood: 'nature',
      };

    case 'food':
      return {
        categoryKey: 'food',
        themeNameEn: 'Puneri Food & Culinary Heritage',
        themeNameMr: 'पुणेरी खाद्यसंस्कृती व अस्सल चव',
        visualMood: 'Spicy misal tarri, crispy bakarwadi, thick mango mastani, and bustling Irani chai corners',
        palette: {
          primary: '#e11d48',
          secondary: '#4c0519',
          accent: '#f59e0b',
          overlayGradient: 'linear-gradient(180deg, rgba(76,5,25,0.15) 0%, rgba(20,5,10,0.88) 100%)',
          canvasFilter: 'contrast(1.1) saturate(1.3) brightness(1.02)',
        },
        typography: {
          headerFont: 'Montserrat, sans-serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-wider font-bold text-amber-300 uppercase',
          accentCase: 'uppercase',
        },
        motionStyle: {
          pacingSpeed: 'punchy',
          kenBurnsScale: 1.16,
          transitionEffect: 'zoom_punch',
          beatDropIntensity: 'high',
        },
        narrativeCurve: {
          hookTextEn: 'Taste the Authentic Flavours of Pune',
          hookTextMr: 'पुण्याच्या चवींचा झणझणीत व गोड प्रवास',
          discoveryTitleEn: 'Iconic Institutions Loved for Generations',
          discoveryTitleMr: 'वर्षानुवर्षे टिकून राहिलेली चविष्ट ठिकाणे',
          immersionFocusEn: 'From Spicy Puneri Misal to Rich Mango Mastani',
          immersionFocusMr: 'झणझणीत मिसळीचा कट ते गोडवा देणारी मस्तानी',
          climaxQuoteEn: '“Food here isn’t just food; it’s an emotion passed down through decades.”',
          climaxQuoteMr: '“पुण्यात जेवण म्हणजे केवळ खाणे नाही, तर एक जिव्हाळ्याची भावना आहे.”',
          outroSignatureEn: 'Pune Culinary Trail • A Feast for the Soul',
          outroSignatureMr: 'पुणे खाद्यसंस्कृती • जिभेवर रेंगाळणारी अविस्मरणीय चव',
        },
        recommendedMusicMood: 'food',
      };

    default: // museums, parks, markets, city_culture
      return {
        categoryKey: 'city_culture',
        themeNameEn: 'Cultural Capital of Maharashtra',
        themeNameMr: 'महाराष्ट्राची सांस्कृतिक राजधानी',
        visualMood: 'Vibrant street scenes, timeless monuments, educational institutes, and modern warmth',
        palette: {
          primary: '#6366f1',
          secondary: '#1e1b4b',
          accent: '#a855f7',
          overlayGradient: 'linear-gradient(180deg, rgba(30,27,75,0.15) 0%, rgba(10,8,25,0.88) 100%)',
          canvasFilter: 'contrast(1.05) saturate(1.15) brightness(1.0)',
        },
        typography: {
          headerFont: 'Plus Jakarta Sans, sans-serif',
          bodyFont: 'Inter, sans-serif',
          subtitleStyle: 'tracking-wider font-medium text-purple-300',
          accentCase: 'capitalize',
        },
        motionStyle: {
          pacingSpeed: 'breezy',
          kenBurnsScale: 1.12,
          transitionEffect: 'crossfade',
          beatDropIntensity: 'medium',
        },
        narrativeCurve: {
          hookTextEn: 'Exploring the Heartbeat of Pune',
          hookTextMr: 'पुण्याच्या सांस्कृतिक स्पंदनांचा शोध',
          discoveryTitleEn: 'Treasures of Art, History & Life',
          discoveryTitleMr: 'कला, संस्कृती आणि समृद्ध जीवनाचा मिलाफ',
          immersionFocusEn: 'Intricate Details of a Historic Metropolis',
          immersionFocusMr: 'पुण्याच्या वैभवाची आणि परंपरेची जिवंत रूपे',
          climaxQuoteEn: '“Every street corner holds a memory, every landmark a soul.”',
          climaxQuoteMr: '“पुण्याच्या प्रत्येक रस्त्यावर आठवणी आणि संस्कृतीचे सुंदर रंग.”',
          outroSignatureEn: 'Pune • Forever Vibrant, Forever Home',
          outroSignatureMr: 'पुणे • आपले शहर, आपला अभिमान',
        },
        recommendedMusicMood: 'ambient',
      };
  }
}
