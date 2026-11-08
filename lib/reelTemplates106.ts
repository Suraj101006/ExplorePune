/**
 * Explore Pune - 106 Unique Cinematic Journey Reel Templates Master Catalogue
 * Dedicated art-directed templates for each of the 106 destinations in Pune.
 * 
 * Features:
 * - 5-Act narrative storytelling (Hook, Establishing, Immersion, Climax, Hero Ending)
 * - Distinct visual mood, palette, and CSS canvas grading filters
 * - Bespoke typography and motion presets (pacing, Ken Burns, speed ramps)
 * - Cultural music mapping (Powada, Abhang, Classical, Ghazal, Nature, Folk)
 * - Built-in runtime validation engine
 */

export interface ReelActScene {
  actNumber: 1 | 2 | 3 | 4 | 5;
  actName: 'hook' | 'establishing' | 'immersion' | 'climax' | 'heroEnding';
  durationSec: number;
  titleEn: string;
  titleMr: string;
  subtitleEn?: string;
  subtitleMr?: string;
  quoteEn?: string;
  quoteMr?: string;
  motionPreset:
    | 'zoom_punch'
    | 'whip_pan'
    | 'pan_horizontal'
    | 'slow_drift'
    | 'ken_burns_depth'
    | 'texture_macro'
    | 'speed_ramp_climax'
    | 'hero_beat_drop'
    | 'cinematic_vignette_fade';
}

export interface ReelTemplate106 {
  placeId: string;
  slug: string;
  placeName: string;
  placeNameMr: string;
  category: 'forts' | 'heritage' | 'temples' | 'nature' | 'museums' | 'parks' | 'food';
  templateTitle: string;
  templateTitleMr: string;
  conceptTaglineEn: string;
  conceptTaglineMr: string;
  subtitle: string;
  elevationOrEra: string;
  visualMood: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    overlayGradient: string;
    canvasFilter: string;
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    accentCase: 'uppercase' | 'capitalize' | 'normal';
  };
  motionPresets: {
    pacingSpeed: 'heroic' | 'regal' | 'meditative' | 'breezy' | 'punchy';
    kenBurnsScale: number;
    transitionEffect: 'crossfade' | 'zoom_punch' | 'whip_pan' | 'cinematic_blur' | 'light_leak';
    speedRampFactor: number;
  };
  musicMapping: {
    primaryTrackId: string;
    culturalGenre: 'powada_fort' | 'abhang_devotional' | 'peshwa_classical' | 'ghazal_acoustic' | 'folk_celebration' | 'nature_ambient';
    bpm: number;
    dropTimestampSec: number;
    socialAudioAttribution: {
      instagramQuery: string;
      youtubeQuery: string;
      recommendedSoundName: string;
    };
    fallbackTrackId: string;
  };
  acts: [ReelActScene, ReelActScene, ReelActScene, ReelActScene, ReelActScene];
  photoFallbackRules: {
    onePhoto: string;
    twoPhotos: string;
    threePhotos: string;
    fourPhotos: string;
    fivePlusPhotos: string;
  };
}

export const REEL_TEMPLATES_106: Record<string, ReelTemplate106> = {
  "aga-khan-palace": {
    "placeId": "aga-khan-palace",
    "slug": "aga-khan-palace",
    "placeName": "Aga Khan Palace",
    "placeNameMr": "आगा खान पॅलेस",
    "category": "heritage",
    "templateTitle": "Aga Khan Palace — Italian Arches & Memorial of Freedom",
    "templateTitleMr": "आगा खान पॅलेस • इटालियन कमानी व स्वातंत्र्यलढ्याचे शांत स्मारक",
    "conceptTaglineEn": "The monumental Italianate palace built in 1892, sacred ground of the Quit India movement where Mahatma Gandhi, Kasturba, and Sarojini Naidu were interned.",
    "conceptTaglineMr": "१८९२ मधील इटालियन कमानींचा ऐतिहासिक महाल, जिथे भारत छोडो आंदोलनादरम्यान महात्मा गांधी आणि कस्तुरबा गांधींचे वास्तव्य होते.",
    "subtitle": "Nagar Road, Kalyani Nagar • Pune 411006",
    "elevationOrEra": "Built 1892 AD (Sultan Muhammed Shah)",
    "visualMood": "Graceful Italian stone arches, expansive manicured lawns, serene marble samadhis of Kasturba and Mahadev Desai, and quiet freedom echoes.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#064e3b",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(15,23,42,0.9) 100%)",
      "canvasFilter": "contrast(1.04) saturate(1.12) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Aga Khan Palace Pune Gandhi Memorial Italian Arches Reel",
        "youtubeQuery": "Aga Khan Palace Pune 4K Drone Quit India Movement History",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "National Monument of India’s Freedom Dawn",
        "titleMr": "भारतीय स्वातंत्र्यलढ्याचे पवित्र राष्ट्रीय स्मारक",
        "subtitleEn": "Aga Khan Palace, Nagar Road (1892)",
        "subtitleMr": "आगा खान पॅलेस, नगर रस्ता (१८९२)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built as Famine Relief by Sultan Muhammed Shah Aga Khan III",
        "titleMr": "दुष्काळग्रस्तांना रोजगार देण्यासाठी सुलतान आगा खान यांनी उभारलेला महाल",
        "subtitleEn": "Internment Site for Mahatma Gandhi from 1942 to 1944",
        "subtitleMr": "१९४२ च्या भारत छोडो आंदोलनात गांधीजींचे कारावास स्थान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Graceful Italian Arches, Quiet Lawns & Kasturba’s Samadhi",
        "titleMr": "इटालियन कमानी, विस्तीर्ण शांत उद्याने आणि कस्तुरबा गांधींचे स्मारक",
        "subtitleEn": "Personal Belongings, Charkha & Letters of the Mahatma",
        "subtitleMr": "गांधीजींचा चरखा, चपला आणि ऐतिहासिक पत्रांचे संग्रहालय",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Quiet Sacrifice Forged a Sovereign Nation",
        "titleMr": "जिथे मूक त्यागातून स्वतंत्र भारताचा पाया रचला गेला",
        "quoteEn": "“Italian arches embracing quiet memories of India’s freedom dawn.”",
        "quoteMr": "“इटालियन कमानी आणि स्वातंत्र्यलढ्याच्या मूक आठवणींचे शांत उद्यान.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Aga Khan Palace • Light of Freedom",
        "titleMr": "आगा खान पॅलेस • शांतता, वारसा व राष्ट्रस्मृती",
        "subtitleEn": "National Memorial • Explore Pune",
        "subtitleMr": "राष्ट्रीय वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal glide across the grand Italian colonnade arches with manicured lawns in the foreground.",
      "twoPhotos": "Photo 1 captures Italian arches facade (Acts 1-2); Photo 2 shows Kasturba Gandhi marble samadhi (Acts 3-5).",
      "threePhotos": "P1: Grand palace facade; P2: Italian arched corridor; P3: Kasturba Gandhi samadhi garden.",
      "fourPhotos": "P1: Driveway; P2: Arches; P3: Gandhi room; P4: Samadhi.",
      "fivePlusPhotos": "Serene, dignified architectural memorial progression."
    }
  },
  "alandi-dnyaneshwar-mandir": {
    "placeId": "alandi-dnyaneshwar-mandir",
    "slug": "alandi-dnyaneshwar-mandir",
    "placeName": "Alandi (Sant Dnyaneshwar Sanjeevan Samadhi)",
    "placeNameMr": "आळंदी (संत ज्ञानेश्वर महाराज संजीवन समाधी)",
    "category": "temples",
    "templateTitle": "Alandi — Eternal Sanjivan Samadhi of Sant Dnyaneshwar",
    "templateTitleMr": "आळंदी • इंद्रायणी काठ व संत ज्ञानेश्वरांची संजीवन समाधी",
    "conceptTaglineEn": "The spiritual capital of the Varkari tradition on the banks of Indrayani, where 21-year-old Sant Dnyaneshwar entered Sanjivan Samadhi in 1296 AD.",
    "conceptTaglineMr": "वारकरी संप्रदायाचे प्राण, जिथे वयाच्या अवघ्या २१व्या वर्षी १२९६ मध्ये संत ज्ञानेश्वर माऊलींनी संजीवन समाधी घेतली.",
    "subtitle": "Indrayani River, Alandi • Pune 412105",
    "elevationOrEra": "Sanjivan Samadhi 1296 AD",
    "visualMood": "Gentle river ghat steps, white Varkari dhotis, saffron Pataka flags, resonant cymbals (taal), and profound spiritual tears.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#c2410c",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(194,65,12,0.18) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Mauli Mauli Alandi Dnyaneshwar Samadhi Varkari Bhajan Reel",
        "youtubeQuery": "Alandi Sant Dnyaneshwar Samadhi Indrayani Ghat 4K Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Heart of the Varkari Pilgrimage — Mauli Alandi",
        "titleMr": "वारकरी संप्रदायाचे हृदय — माऊलींची पावन आळंदी",
        "subtitleEn": "Sanjivan Samadhi of Sant Dnyaneshwar (1296 AD)",
        "subtitleMr": "संत ज्ञानेश्वर महाराजांची संजीवन समाधी (१२९६)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "On the Sacred Banks of the Holy Indrayani River",
        "titleMr": "पवित्र इंद्रायणी नदीच्या शांत आणि पावन तीरावर",
        "subtitleEn": "Starting Point of the World-Famous Ashadhi Dindi Procession",
        "subtitleMr": "पंढरपूर आषाढी वारीच्या पालखी सोहळ्याचे उगमस्थान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Golden Samadhi Sanctum, Ajan Vriksha & Taal-Mridang Rhythms",
        "titleMr": "सुवर्ण समाधी, अजान वृक्ष आणि टाळ-मृदंगाचा गजर",
        "subtitleEn": "“Dnyanoba Mauli Tukaram” Echoing from Thousands of Lips",
        "subtitleMr": "“ज्ञानोबा माऊली तुकाराम” नामाचा दुमदुमणारा जयघोष",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Ocean of Unconditional Compassion and Bhakti",
        "titleMr": "भूतदयेचा आणि अथांग भक्तीचा अखंड वाहणारा झरा",
        "quoteEn": "“Here under the Ajan tree, the greatest poet-saint of Maharashtra rests in eternal awakeness.”",
        "quoteMr": "“अजान वृक्षाच्या छायेत माऊली आजही संजीवन रूपात प्रत्येकाच्या हृदयात वास करतात.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Alandi • Eternal Abode of Mauli",
        "titleMr": "आळंदी • माऊलींचे पावन तीर्थ",
        "subtitleEn": "Supreme Varkari Sanctuary • Explore Pune",
        "subtitleMr": "वारकरी भक्तीचे माहेरघर • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the waters of Indrayani Ghat up to the golden temple spire of Sant Dnyaneshwar.",
      "twoPhotos": "Photo 1 captures Indrayani river ghat with pilgrims (Acts 1-2); Photo 2 shows Sanjivan Samadhi golden sanctum (Acts 3-5).",
      "threePhotos": "P1: Indrayani ghat steps; P2: Temple courtyard with Ajan tree; P3: Sanjivan Samadhi darshan.",
      "fourPhotos": "P1: River; P2: Ghat; P3: Spire; P4: Samadhi.",
      "fivePlusPhotos": "Deeply emotional devotional montage with taal, pakhawaj, and abhang chanting."
    }
  },
  "arai-tekdi": {
    "placeId": "arai-tekdi",
    "slug": "arai-tekdi",
    "placeName": "ARAI Hill (Kothrud Nature Ridge)",
    "placeNameMr": "एआरएआय टेकडी (कोथरूड निसर्ग पठार)",
    "category": "nature",
    "templateTitle": "ARAI Hill — Nature Ridge of Kothrud & Morning Silence",
    "templateTitleMr": "एआरएआय टेकडी • कोथरूड निसर्ग पठार व शांत मॉर्निंग वॉक",
    "conceptTaglineEn": "The continuous nature ridge connecting Law College Road and Kothrud, famous for the ARAI institute, quiet sunrise walks, and birdwatching.",
    "conceptTaglineMr": "लॉ कॉलेज रस्ता व कोथरूडला जोडणारे विस्तीर्ण निसर्ग पठार, जिथे शांत सूर्योदय आणि निसर्गप्रेमींची गर्दी जमते.",
    "subtitle": "Kothrud • Pune 411038",
    "elevationOrEra": "Scenic City Ridge",
    "visualMood": "Wide windswept grassy plateau, mist clinging to acacia trees, morning joggers, and sweeping sunset over Kothrud.",
    "palette": {
      "primary": "#059669",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.18) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "ARAI Tekdi Kothrud Pune Sunrise Walk Reel",
        "youtubeQuery": "ARAI Hill Pune Kothrud Walking Trail 4K Nature",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Kothrud’s Beloved Morning Sanctuary",
        "titleMr": "कोथरूडकरांचे आवडते शांत निसर्ग पठार",
        "subtitleEn": "ARAI Tekdi, Law College to Kothrud Ridge",
        "subtitleMr": "एआरएआय टेकडी, कोथरूड",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Home of the Automotive Research Association of India",
        "titleMr": "ऑटोमोटिव्ह रिसर्च असोसिएशन ऑफ इंडियाचा निसर्गरम्य परिसर",
        "subtitleEn": "Connecting Pune’s Educational & Cultural Hubs",
        "subtitleMr": "पुण्याच्या विविध पेठा व उपनगरांना जोडणारी टेकडी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Quiet Canopy Trails, Chirping Hornbills & Sunrise Yoga",
        "titleMr": "शांत पायवाटा, दुर्मिळ पक्षी, आणि सकाळचे ध्यान",
        "subtitleEn": "Golden Rays Piercing Through Dense Green Boughs",
        "subtitleMr": "झाडांच्या फांद्यांमधून येणारी कोवळी सोनेरी किरणे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Gentle Breath of Fresh Mountain Air Everyday",
        "titleMr": "रोजच्या धावपळीत शरीराला मिळणारा ताजा प्राणवायू",
        "quoteEn": "“Every morning spent here adds a touch of stillness to the fast-paced city life.”",
        "quoteMr": "“येथील प्रत्येक सकाळ मनाला दिवसभरासाठी सकारात्मक ऊर्जा आणि शांतता देते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "ARAI Tekdi • Everyday Green Solitude",
        "titleMr": "एआरएआय टेकडी • निवांत निसर्गाची गोड भेट",
        "subtitleEn": "Urban Green Haven • Explore Pune",
        "subtitleMr": "शहरी निसर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Gentle horizontal drift across the open plateau with Kothrud cityscape below.",
      "twoPhotos": "Photo 1 captures shaded tree trail (Acts 1-2); Photo 2 shows sunrise over open grassy plateau (Acts 3-5).",
      "threePhotos": "P1: Tree-lined pathway; P2: Open grassy plateau; P3: Sunrise over hills.",
      "fourPhotos": "P1: Gate trail; P2: Woods; P3: Ridge view; P4: Morning light.",
      "fivePlusPhotos": "Crisp, refreshing morning walker progression."
    }
  },
  "balgandharva-ranga-mandir": {
    "placeId": "balgandharva-ranga-mandir",
    "slug": "balgandharva-ranga-mandir",
    "placeName": "Balgandharva Ranga Mandir & Cultural Center",
    "placeNameMr": "बालगंधर्व रंगमंदिर व सांस्कृतिक संकुल (जेएम रस्ता)",
    "category": "heritage",
    "templateTitle": "Balgandharva Ranga Mandir — Cultural Soul of Marathi Theatre",
    "templateTitleMr": "बालगंधर्व रंगमंदिर • मराठी नाट्य आणि संगीताचे मुख्य केंद्र",
    "conceptTaglineEn": "The historic municipal theatre complex on JM Road opened in 1968, dedicated to legendary actor-singer Narayan Shripad Rajhans (Balgandharva), the beating heart of Natyasangeet.",
    "conceptTaglineMr": "जेएम रस्त्यावरील १९६८ मधील बालगंधर्व रंगमंदिर, जिथून मराठी संगीत नाटक, नाट्यसंस्कृती आणि पुण्याचे कलाविश्व बहरले.",
    "subtitle": "JM Road, Shivajinagar • Pune 411005",
    "elevationOrEra": "Inaugurated 1968 (PMC)",
    "visualMood": "Spotlit stage curtains, bronze bust of Balgandharva, ringing interval bells, bustling artist addas, and rich cultural energy.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.18) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Balgandharva Ranga Mandir Pune Marathi Natak Stage Reel",
        "youtubeQuery": "Balgandharva Ranga Mandir JM Road Pune Cultural History",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Sacred Temple of Marathi Theatre & Natyasangeet",
        "titleMr": "मराठी संगीत नाटकाचे आणि रंगभूमीचे पवित्र तीर्थ",
        "subtitleEn": "Balgandharva Ranga Mandir, JM Road (1968)",
        "subtitleMr": "बालगंधर्व रंगमंदिर, जंगली महाराज रस्ता (१९६८)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Named in Honour of Sangeet Natak Legend Narayan Shripad Rajhans",
        "titleMr": "गांधर्व युगाचे प्रवर्तक बालगंधर्व यांच्या स्मृतीस समर्पित",
        "subtitleEn": "Inaugurated by Yashwantrao Chavan in 1968",
        "subtitleMr": "१९६८ मध्ये पुण्याच्या सांस्कृतिक हृदयाचे लोकार्पण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Ringing Three Bells, Art Exhibitions & Veteran Theatre Addas",
        "titleMr": "नाटकाची तिसरी घंटा, कलादालन आणि दिग्गज कलाकारांचे कट्टे",
        "subtitleEn": "Where Pu La Deshpande, Vasantrao Deshpande & Masters Performed",
        "subtitleMr": "पु. ल., वसंतराव आणि भीमसेनजींच्या सुवर्ण उपस्थितीने पावन",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Immortal Applause of Marathi Cultural Pride",
        "titleMr": "रसिक प्रेक्षकांच्या टाळ्यांच्या कडकडाटात गुंजणारा अभिमान",
        "quoteEn": "“When the third bell rings and the red curtain rises, the soul of Marathi culture takes flight.”",
        "quoteMr": "“तिसरी घंटा वाजून पडदा उघडताच अवघा महाराष्ट्र कलेच्या आनंदात रंगून जातो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Balgandharva • Stage of Legends",
        "titleMr": "बालगंधर्व • मराठी रंगभूमीचा मुकुटमणी",
        "subtitleEn": "Theatre Cultural Monument • Explore Pune",
        "subtitleMr": "नाट्य वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the front circular fountain and bronze bust to the illuminated theatre signage.",
      "twoPhotos": "Photo 1 captures the iconic theater facade (Acts 1-2); Photo 2 shows stage curtain or Balgandharva art gallery (Acts 3-5).",
      "threePhotos": "P1: Theatre front facade; P2: Balgandharva bronze statue; P3: Auditorium stage.",
      "fourPhotos": "P1: Drive; P2: Portico; P3: Bust; P4: Stage lights.",
      "fivePlusPhotos": "Cultured, artistic theatrical progression with dramatic stage lighting."
    }
  },
  "banneshwar-temple-nasrapur": {
    "placeId": "banneshwar-temple-nasrapur",
    "slug": "banneshwar-temple-nasrapur",
    "placeName": "Baneshwar Shiva Temple & Forest Sanctuary",
    "placeNameMr": "बाणेश्वर ऐतिहासिक शिवमंदिर व निसर्ग अभयारण्य (नसरापूर)",
    "category": "temples",
    "templateTitle": "Baneshwar Shiva Temple — Sacred Forest Grove & Medieval Shrine",
    "templateTitleMr": "बनेश्वर शिवमंदिर • निसर्गरम्य वनराई व पेशवेकालीन प्राचीन तीर्थ (नसरापूर)",
    "conceptTaglineEn": "The secluded medieval Shiva shrine and protected forest reserve near Nasrapur built by Peshwa Balaji Baji Rao in 1749, famed for its ancient trees and freshwater springs.",
    "conceptTaglineMr": "नसरापूरजवळील १७४९ मधील नानासाहेब पेशव्यांनी बांधलेले बनेश्वर शिवमंदिर, जिथे दाट वनराई, पक्षी आणि पाण्याचे झरे आहेत.",
    "subtitle": "Nasrapur, Bhor Taluka • Pune 412213",
    "elevationOrEra": "Built 1749 AD (Nanasaheb Peshwa)",
    "visualMood": "Dense green canopy shade, ancient stone temple steps, rushing freshwater stream, and chirping forest birds.",
    "palette": {
      "primary": "#15803d",
      "secondary": "#064e3b",
      "accent": "#86efac",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Baneshwar Temple Nasrapur Forest Shiva Shrine Reel",
        "youtubeQuery": "Baneshwar Temple Nasrapur Pune Forest Sanctuary 4K",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Sacred Shiva Shrine Cradled in Virgin Woods",
        "titleMr": "दाट हिरव्यागार वनराईत वसलेले शिवमंदिर — बनेश्वर",
        "subtitleEn": "Baneshwar Shiva Temple, Nasrapur (1749)",
        "subtitleMr": "बनेश्वर शिवमंदिर, नसरापूर, भोर (१७४९)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commissioned by Shrimant Nanasaheb Peshwa in 1749",
        "titleMr": "श्रीमंत नानासाहेब पेशव्यांनी १७४९ मध्ये उभारलेले पावन तीर्थ",
        "subtitleEn": "Surrounded by a Government-Protected Forest & Bird Sanctuary",
        "subtitleMr": "वनविभागाने संरक्षित केलेले समृद्ध पक्षी व वन अभयारण्य",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Natural Freshwater Springs, Rare Birds & Ancient Trees",
        "titleMr": "थंड पाण्याचे झरे, दुर्मिळ पक्ष्यांचा किलबिलाट आणि शतकीय वृक्ष",
        "subtitleEn": "Portuguese Bell from Bassien (Vasai) Captured by Marathas",
        "subtitleMr": "वसईच्या मोहिमेत चिमाजी अप्पांनी आणलेली ऐतिहासिक पोर्तुगीज घंटा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Nature and Divine Worship Are One",
        "titleMr": "निसर्गपूजा आणि शिवभक्तीचा पवित्र सुंदर मेळ",
        "quoteEn": "“In the sacred groves of Baneshwar, every leaf rustles with ancient peace.”",
        "quoteMr": "“बनेश्वराच्या वनराईत वाऱ्याची प्रत्येक झुळूक मनाला ईश्वरी शांतता देते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Baneshwar • The Forest Sanctuary",
        "titleMr": "बनेश्वर • वनराईतील पवित्र शिवतीर्थ",
        "subtitleEn": "Peshwa Forest Shrine • Explore Pune",
        "subtitleMr": "निसर्ग व शिवतीर्थ वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the forest stream to the mossy stone entrance of the Baneshwar temple.",
      "twoPhotos": "Photo 1 captures the lush green forest surrounding the temple (Acts 1-2); Photo 2 shows the historic Shivalinga sanctum (Acts 3-5).",
      "threePhotos": "P1: Forest pathway; P2: Historic temple exterior; P3: Ancient Shivalinga sanctum.",
      "fourPhotos": "P1: Woods; P2: Stream; P3: Bell; P4: Sanctum.",
      "fivePlusPhotos": "Tranquil forest and temple sanctuary progression with rustling leaves and birdsong."
    }
  },
  "baps-swaminarayan-mandir": {
    "placeId": "baps-swaminarayan-mandir",
    "slug": "baps-swaminarayan-mandir",
    "placeName": "BAPS Shri Swaminarayan Mandir",
    "placeNameMr": "श्री स्वामिनारायण मंदिर (आंबेगाव)",
    "category": "temples",
    "templateTitle": "BAPS Swaminarayan Mandir — Stone Symphony of Ambegaon",
    "templateTitleMr": "श्री स्वामिनारायण मंदिर • आंबेगावचे गुलाबी पाषाणातील भव्य शिल्पकाम",
    "conceptTaglineEn": "The magnificent pink sandstone and marble architectural masterpiece in Ambegaon, featuring hundreds of hand-carved pillars, peacocks, and evening illuminated fountains.",
    "conceptTaglineMr": "आंबेगाव येथील गुलाबी पाषाण आणि संगमरवरात घडवलेले, शेकडो कोरीव खांब आणि मोरांच्या शिल्पांचे भव्य कलात्मक मंदिर.",
    "subtitle": "Ambegaon, Katraj Bypass • Pune 411046",
    "elevationOrEra": "Consecrated 2017",
    "visualMood": "Pink Rajasthani sandstone glow, white marble filigree, peaceful manicured lawns, and evening illumination.",
    "palette": {
      "primary": "#f43f5e",
      "secondary": "#881337",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(136,19,55,0.18) 0%, rgba(20,5,10,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "BAPS Swaminarayan Mandir Pune Ambegaon Evening Drone Reel",
        "youtubeQuery": "Swaminarayan Mandir Pune Ambegaon 4K Pink Stone Architecture",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Symphony of Carved Pink Sandstone",
        "titleMr": "गुलाबी पाषाणातील भव्य शिल्पकला — स्वामिनारायण मंदिर",
        "subtitleEn": "BAPS Shri Swaminarayan Mandir, Ambegaon",
        "subtitleMr": "बीएपीएस श्री स्वामिनारायण मंदिर, आंबेगाव, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Crafted According to Ancient Vedic Shilpa Shastras",
        "titleMr": "प्राचीन वैदिक शिल्पशास्त्रानुसार साकारलेली अद्वितीय वास्तू",
        "subtitleEn": "Thousands of Hand-Chiseled Stone Pillars & Domes",
        "subtitleMr": "हजारो कुशल कारागिरांनी हाताने कोरलेले खांब व घुमट",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pure White Italian Marble Sanctum & Peacocks Carvings",
        "titleMr": "इटालियन संगमरवरी गाभारा, मोरांची शिल्पे आणि पवित्र वातावरण",
        "subtitleEn": "Manicured Gardens & Peaceful Meditative Courtyards",
        "subtitleMr": "हिरवेगार बगीचे आणि मनाला शांती देणारी स्वच्छता",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Divine Art Elevates the Human Spirit",
        "titleMr": "कलेच्या आणि भक्तीच्या सर्वोच्च शिखराचा सुखद अनुभव",
        "quoteEn": "“In every carved stone and quiet prayer, the temple reflects pure, timeless beauty.”",
        "quoteMr": "“प्रत्येक कोरीव पाषाणात आणि शांत प्रार्थनेत जाणवतो अलौकिक सौंदर्याचा साक्षात्कार.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Swaminarayan Mandir • The Stone Poem",
        "titleMr": "स्वामिनारायण मंदिर • पाषाणातील भव्य काव्य",
        "subtitleEn": "Architectural Wonder • Explore Pune",
        "subtitleMr": "शिल्प वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward tilt starting from wide stone stairs up to the intricate carved pink sandstone spires.",
      "twoPhotos": "Photo 1 showcases overall temple exterior and lawn (Acts 1-2); Photo 2 focuses on intricately carved marble pillars (Acts 3-5).",
      "threePhotos": "P1: Distant temple facade; P2: Detailed carved pillars; P3: Sanctum deity darshan.",
      "fourPhotos": "P1: Gate; P2: Lawn; P3: Spire; P4: Interior hall.",
      "fivePlusPhotos": "Majestic, brightly lit architectural symphony progression."
    }
  },
  "bedekar-tea-stall-misal": {
    "placeId": "bedekar-tea-stall-misal",
    "slug": "bedekar-tea-stall-misal",
    "placeName": "Bedekar Tea Stall & Misal (Narayan Peth)",
    "placeNameMr": "बेडेकर टी स्टॉल व मिसळ (नारायण पेठ)",
    "category": "food",
    "templateTitle": "Bedekar Misal — Sweet Kokum Heritage of Narayan Peth",
    "templateTitleMr": "बेडेकर मिसळ • नारायण पेठेतील १९४८ ची कोकम-गूळ मिश्रित परंपरा",
    "conceptTaglineEn": "The revered heritage misal characterized by sweet-sour kokum, jaggery, and sliced bread.",
    "conceptTaglineMr": "नारायण पेठेतील ऐतिहासिक मिसळ जिथे गोड कोकम, गूळ आणि स्लाइस ब्रेडचा अनोखा मेळ मिळतो.",
    "subtitle": "Narayan Peth • Pune 411030",
    "elevationOrEra": "Since 1948",
    "visualMood": "Vintage brass counters, earthen warmth, aromatic sweet-sour steam, and heritage alley tranquility.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#f59e0b",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.88) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.12) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Bedekar Misal Pune Heritage Food Reel / Narayan Peth",
        "youtubeQuery": "Bedekar Misal Pune Vintage Tea Stall History",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Since 1948 in Narayan Peth",
        "titleMr": "१९४८ पासूनची नारायण पेठेतील परंपरा",
        "subtitleEn": "The Original Puneri Misal Style",
        "subtitleMr": "पुण्याची मूळ पेठ संस्कृती",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Unique Sweet & Tangy Kokum Rassa",
        "titleMr": "कोकम व गुळाचा मंद आंबट-गोड स्वाद",
        "subtitleEn": "Traditional Bread Slice Accompaniment",
        "subtitleMr": "पावऐवजी मऊ स्लाइस ब्रेडची जुनी रीत",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pohe Base, Fine Shev & Vintage Copper Urns",
        "titleMr": "पोहे, बारीक शेव आणि तांब्याच्या भांड्यातील रस्सा",
        "subtitleEn": "Generations of Peth Regulars Gathering Daily",
        "subtitleMr": "पिढ्यानपिढ्या जपणारी अस्सल पुणेरी ग्राहकी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Taste Unchanged Across Seven Decades",
        "titleMr": "सात दशके अबाधित राहिलेली अस्सल चव",
        "quoteEn": "“Not just a plate of food, but a living piece of Pune’s cultural fabric.”",
        "quoteMr": "“केवळ मिसळ नाही, तर पुणेरी संस्कृतीचा जिवंत ऐतिहासिक ठेवा.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bedekar • The Timeless Peth Classic",
        "titleMr": "बेडेकर • पेठ संस्कृतीची अमर ओळख",
        "subtitleEn": "Heritage Verified • Explore Pune",
        "subtitleMr": "प्रमाणित वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow graceful Ken Burns drifting across the historic signboard down to the iconic misal dish.",
      "twoPhotos": "Photo 1 captures the historic facade (Acts 1-2); Photo 2 focuses on bread dipping into rassa (Acts 3-5).",
      "threePhotos": "P1: Peth street angle; P2: Serving platter with bread; P3: Vintage interior counter.",
      "fourPhotos": "P1: Board; P2: Plating; P3: Pouring rassa; P4: Heritage ambience.",
      "fivePlusPhotos": "Heritage-paced warm cinematic photo progression."
    }
  },
  "bedse-caves": {
    "placeId": "bedse-caves",
    "slug": "bedse-caves",
    "placeName": "Bedse Caves (Ancient Chaitya & Vihara)",
    "placeNameMr": "बेडसे लेणी (शांत व प्राचीन बौद्ध लेणी)",
    "category": "heritage",
    "templateTitle": "Bedse Caves — Secluded Chaitya & Octagonal Pillars",
    "templateTitleMr": "बेडसे लेणी • पवन मावळची शांत, नक्षीदार व निर्जन बौद्ध लेणी",
    "conceptTaglineEn": "The hidden 1st-century BC Buddhist rock-cut sanctuary in Pavana Maval, renowned for its majestic animal-crowned pillars and tranquil seclusion away from crowds.",
    "conceptTaglineMr": "पवना मावळमधील गर्दीपासून दूर असलेली, इसवी सन पूर्व १ल्या शतकातील अत्यंत शांत व देखणी बौद्ध लेणी.",
    "subtitle": "Bedse Village, Maval • Pune 410405",
    "elevationOrEra": "1st Century BC (Hinayana Period)",
    "visualMood": "Deep morning sunrays piercing between colossal octagonal pillars, animal capital sculptures (horses, bulls, elephants), and pristine Sahyadri silence.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Bedse Caves Maval Pune Hidden Buddhist Monastery Reel",
        "youtubeQuery": "Bedse Caves Pune 4K Drone Hidden Rock Cut Chaitya Hall",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Most Peaceful Rock-Cut Sanctuary in Maval",
        "titleMr": "मावळ खोऱ्यातील सर्वात शांत व नक्षीदार बौद्ध लेणी — बेडसे",
        "subtitleEn": "Bedse Caves, Pavana Maval (1st Century BC)",
        "subtitleMr": "बेडसे लेणी, पवना मावळ (इसवी सन पूर्व १ले शतक)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Four Colossal Octagonal Pillars Crowned with Mythical Beasts",
        "titleMr": "घोडे, बैल व हत्तींच्या शिल्पांनी सजलेले चार भव्य अष्टकोनी खांब",
        "subtitleEn": "Hidden in a Quiet Mountain Crevice Facing Morning Light",
        "subtitleMr": "सकाळच्या सूर्यकिरणांनी उजळून निघणारा देखणा पाषाण दर्शनी भाग",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Ribbed Chaitya Hall & Unique Two-Story Monastic Vihara",
        "titleMr": "कमानीदार चैत्यगृह आणि दोन मजली बौद्ध भिक्खूंचा शांत विहार",
        "subtitleEn": "Far from Crowds Where Every Footstep Resonates in Stillness",
        "subtitleMr": "पर्यटकांच्या गर्दीपासून दूर, केवळ वाऱ्याची मंद झुळूक आणि शांतता",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Ancient Stone Still Holds the Fragrance of Peace",
        "titleMr": "जिथे पाषाणही अनुभवतो संपूर्ण मानसिक शांततेचा स्पर्श",
        "quoteEn": "“In the secluded halls of Bedse, silence is not the absence of sound, but the presence of serenity.”",
        "quoteMr": "“बेडसे लेण्यांच्या खांबांखाली बसून अनुभवता येते अंतर्मनाला स्पर्श करणारी खरीखुरी शांतता.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bedse • The Hidden Sanctuary",
        "titleMr": "बेडसे • मावळचा शांत पाषाण ठेवा",
        "subtitleEn": "Secluded Monastic Heritage • Explore Pune",
        "subtitleMr": "शांत लेणी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan between the massive animal-crowned pillars revealing the ribbed Chaitya facade.",
      "twoPhotos": "Photo 1 captures the four grand entrance pillars with morning sunlight (Acts 1-2); Photo 2 shows the Chaitya stupa interior (Acts 3-5).",
      "threePhotos": "P1: Mountain approach trail; P2: Colossal carved pillars; P3: Stupa inside Chaitya hall.",
      "fourPhotos": "P1: Steps; P2: Pillars; P3: Vihara; P4: Stupa.",
      "fivePlusPhotos": "Quiet, sunlit monastic progression celebrating secluded ancient stone beauty."
    }
  },
  "bhaja-caves": {
    "placeId": "bhaja-caves",
    "slug": "bhaja-caves",
    "placeName": "Bhaja Caves (Buddhist Monastic Complex)",
    "placeNameMr": "भाजा लेणी (प्राचीन बौद्ध लेणी व स्तूप समूह)",
    "category": "heritage",
    "templateTitle": "Bhaja Caves — 22 Rock-Cut Monasteries & Stupa Gallery",
    "templateTitleMr": "भाजा लेणी • २२ प्राचीन बौद्ध लेणी व पाषाण स्तूप समूह",
    "conceptTaglineEn": "The tranquil 2nd-century BC Buddhist cave cluster near Malavali, famous for its horseshoe sun-window Chaitya, relief carvings of tabla dancers, and outdoor cluster of 14 stupas.",
    "conceptTaglineMr": "मळवली जवळील इसवी सन पूर्व २ऱ्या शतकातील २२ बौद्ध लेण्यांचा समूह, जिथे घोड्याच्या नालेसारखी खिडकी, तबला वाजवणारी शिल्पे आणि १४ स्तूप आहेत.",
    "subtitle": "Malavali, Maval • Pune 410405",
    "elevationOrEra": "2nd Century BC (Hinayana Caves)",
    "visualMood": "Soft weathered basalt, horseshoe-arched sunlight portal, peaceful outdoor stupa cemetery, and gentle monsoon valley waterfalls.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Bhaja Caves Malavali Pune Ancient Stupa Gallery Reel",
        "youtubeQuery": "Bhaja Buddhist Caves Lonavala 4K Drone 14 Stupas Walkthrough",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "22 Rock-Cut Sanctuaries Dating to the 2nd Century BC",
        "titleMr": "इसवी सन पूर्व २ऱ्या शतकातील २२ प्राचीन पाषाण लेणी",
        "subtitleEn": "Bhaja Caves, Malavali, Maval",
        "subtitleMr": "भाजा लेणी, मळवली, मावळ",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Iconic Horseshoe Chaitya Sun-Window (Kudu)",
        "titleMr": "प्रसिद्ध घोड्याच्या नालेसारखी विलोभनीय पाषाण खिडकी",
        "subtitleEn": "Earliest Recorded Depiction of an Indian Tabla in Carved Relief",
        "subtitleMr": "भारतात तबला वाजवण्याचे सर्वात प्राचीन शिल्प कोरलेले दालन",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Unique Open-Air Gallery of 14 Monolithic Stupas",
        "titleMr": "१४ अखंड पाषाण स्तूपांचा अद्वितीय समूह",
        "subtitleEn": "Relic Stupas Memorializing Ancient Buddhist Teachers & Acharyas",
        "subtitleMr": "प्राचीन बौद्ध भिक्खू आणि आचार्यांच्या स्मृती जपणारे स्तूप",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Two Millennia of Meditative Harmony with Nature",
        "titleMr": "दोन हजार वर्षांपासून निसर्गाशी एकरूप झालेली ध्यानमग्न शांतता",
        "quoteEn": "“Sitting before the stupas of Bhaja, you hear the quiet footsteps of monks who sought pure truth.”",
        "quoteMr": "“भाजा लेण्यांच्या शांततेत आजही ज्ञानाचा शोध घेणाऱ्या प्राचीन भिक्खूंची उपस्थिती जाणवते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bhaja • The Monastic Haven",
        "titleMr": "भाजा • बौद्ध ध्यानाची पावन भूमी",
        "subtitleEn": "Ancient Rock Monastery • Explore Pune",
        "subtitleMr": "प्राचीन लेणी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the cluster of 14 rock stupas up to the arched horseshoe Chaitya entrance.",
      "twoPhotos": "Photo 1 captures the grand horseshoe Chaitya window (Acts 1-2); Photo 2 shows the 14 outdoor stupas gallery (Acts 3-5).",
      "threePhotos": "P1: Chaitya arch facade; P2: Ancient stupa cemetery; P3: Carved tabla dancer relief.",
      "fourPhotos": "P1: Steps; P2: Facade; P3: Stupas; P4: Mountain view.",
      "fivePlusPhotos": "Serene, contemplative Buddhist monastery progression with calming flute notes."
    }
  },
  "bhandarkar-oriental-research-institute": {
    "placeId": "bhandarkar-oriental-research-institute",
    "slug": "bhandarkar-oriental-research-institute",
    "placeName": "Bhandarkar Oriental Research Institute (BORI)",
    "placeNameMr": "भांडारकर प्राच्यविद्या संशोधन मंदिर (बोरी, पुणे)",
    "category": "heritage",
    "templateTitle": "BORI — Living Treasury of Indic Manuscripts & Mahabharata",
    "templateTitleMr": "भांडारकर प्राच्यविद्या संशोधन मंदिर • दुर्मिळ हस्तलिखितांचा खजिना",
    "conceptTaglineEn": "The internationally acclaimed research institute founded in 1917, holding over 29,000 priceless Sanskrit, Prakrit, and Persian manuscripts and the Critical Edition of Mahabharata.",
    "conceptTaglineMr": "१९१७ मध्ये स्थापन झालेले जागतिक कीर्तीचे प्राच्यविद्या संशोधन केंद्र, जिथे २९,००० दुर्मिळ हस्तलिखिते आणि महाभारताची प्रामाणिक आवृत्ती तयार झाली.",
    "subtitle": "Law College Road • Pune 411004",
    "elevationOrEra": "Founded 1917 (BORI)",
    "visualMood": "Stately stone colonial arches, ancient birch-bark and palm-leaf scrolls, teak study desks, and quiet academic scholarly grace.",
    "palette": {
      "primary": "#92400e",
      "secondary": "#1e293b",
      "accent": "#fde68a",
      "overlayGradient": "linear-gradient(180deg, rgba(30,41,59,0.18) 0%, rgba(15,20,30,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.12) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "BORI Pune Bhandarkar Institute Mahabharata Manuscripts Reel",
        "youtubeQuery": "Bhandarkar Oriental Research Institute Pune Rare Manuscripts",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where India’s Ancient Knowledge Is Preserved in Ink",
        "titleMr": "भारताच्या प्राचीन ज्ञानाचा जागतिक खजिना — बोरी",
        "subtitleEn": "Bhandarkar Oriental Research Institute (BORI)",
        "subtitleMr": "भांडारकर प्राच्यविद्या संशोधन मंदिर, लॉ कॉलेज रस्ता (१९१७)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Named in Honour of Indologist Dr. Ramkrishna Gopal Bhandarkar",
        "titleMr": "थोर प्राच्यविद्या संशोधक डॉ. रामकृष्ण गोपाळ भांडारकर यांचे स्मारक",
        "subtitleEn": "Produced the World’s 19-Volume Critical Edition of the Mahabharata",
        "subtitleMr": "महाभारताची संपूर्ण जगात मान्यताप्राप्त १९ खंडांची अधिकृत आवृत्ती",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "29,000 Rare Palm-Leaf, Birch-Bark & Copper Inscriptions",
        "titleMr": "२९,००० दुर्मिळ ताडपत्रे, भूर्जपत्रे आणि सुवर्ण अक्षरे",
        "subtitleEn": "Visited by Scholars and Indologists from Every Continent",
        "subtitleMr": "जगातील सर्व देशांतील विद्वानांचे आकर्षण केंद्र",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Immortal Intellectual Soul of Pune",
        "titleMr": "पुण्याच्या जागतिक संशोधन आणि विद्वत्तेचे अमर केंद्र",
        "quoteEn": "“Within these quiet archives rests the intellectual memory of five thousand years of civilization.”",
        "quoteMr": "“या शांत दालनांमध्ये पाच हजार वर्षांच्या भारतीय संस्कृतीचे विचार जतन आहेत.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "BORI • Treasury of Wisdom",
        "titleMr": "भांडारकर संस्था • ज्ञानाचे जागतिक दालन",
        "subtitleEn": "Oriental Research Heritage • Explore Pune",
        "subtitleMr": "प्राच्यविद्या वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan across the stately stone arches of the BORI facade into shaded academic lawns.",
      "twoPhotos": "Photo 1 captures stone heritage building facade (Acts 1-2); Photo 2 focuses on ancient palm-leaf manuscripts (Acts 3-5).",
      "threePhotos": "P1: BORI stone building exterior; P2: Manuscript library hall; P3: Mahabharata archive room.",
      "fourPhotos": "P1: Gate; P2: Facade; P3: Reading room; P4: Manuscripts.",
      "fivePlusPhotos": "Scholarly, dignified historical progression with gentle acoustic guitar."
    }
  },
  "bharat-itihas-sanshodhak-mandal": {
    "placeId": "bharat-itihas-sanshodhak-mandal",
    "slug": "bharat-itihas-sanshodhak-mandal",
    "placeName": "Bharat Itihas Sanshodhak Mandal (BISM)",
    "placeNameMr": "भारत इतिहास संशोधक मंडळ (सदाशिव पेठ, पुणे)",
    "category": "heritage",
    "templateTitle": "BISM — Custodians of Maratha Historical Archives",
    "templateTitleMr": "भारत इतिहास संशोधक मंडळ • मराठा इतिहासाची मूळ दस्तऐवज संपदा",
    "conceptTaglineEn": "The revered historical research institution founded in 1910 by Itihasacharya V.K. Rajwade, preserving over 1.5 million original Modi-script historical letters, coins, and armory.",
    "conceptTaglineMr": "इतिहासाचार्य वि. का. राजवाडे यांनी १९१० मध्ये स्थापन केलेले मंडळ, जिथे १५ लाखांहून अधिक मोडी लिपीतील अस्सल कागदपत्रे आणि नाणी जतन आहेत.",
    "subtitle": "Sadashiv Peth • Pune 411030",
    "elevationOrEra": "Founded 1910 (V.K. Rajwade)",
    "visualMood": "Sepia Modi script scrolls, vintage wooden cabinets, ancient Maratha copper coins, and dedicated historical research aura.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.18) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Bharat Itihas Sanshodhak Mandal Pune Modi Script Reel",
        "youtubeQuery": "BISM Pune VK Rajwade Maratha History Original Documents",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "1.5 Million Original Documents of Maratha History",
        "titleMr": "मराठा इतिहासाची १५ लाखांहून अधिक अस्सल कागदपत्रे",
        "subtitleEn": "Bharat Itihas Sanshodhak Mandal (BISM), Sadashiv Peth",
        "subtitleMr": "भारत इतिहास संशोधक मंडळ, सदाशिव पेठ (१९१०)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Founded by the Legendary Itihasacharya V.K. Rajwade in 1910",
        "titleMr": "इतिहासाचार्य वि. का. राजवाडे यांनी गावोगावी फिरून जमवलेला खजिना",
        "subtitleEn": "Where Authentic Letters of Shivaji & the Peshwas Rest",
        "subtitleMr": "जिथे शिवकालीन व पेशवेकालीन अस्सल मोडी पत्रे जतन आहेत",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Modi Script Royal Sanads, Ancient Coins & Maratha Arms",
        "titleMr": "मोडी लिपीतील सनदा, दुर्मिळ नाणी, चित्रे आणि ऐतिहासिक शस्त्रे",
        "subtitleEn": "Generations of Historians Uncovering the Truth of Swarajya",
        "subtitleMr": "पुराव्यांवर आधारित खराखुरा मराठा इतिहास मांडणारे केंद्र",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Infallible Backbone of Authentic Indian History",
        "titleMr": "अस्सल कागदपत्रांच्या आधारे इतिहासाचे सत्य उजेडात आणणारा कणा",
        "quoteEn": "“Here, history is not romantic imagination; it is verified, unbending truth written in original ink.”",
        "quoteMr": "“येथे इतिहास केवळ कल्पना नाही, तर अस्सल कागदपत्रांच्या शाईने लिहिलेले सत्य आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "BISM • The Historical Vault",
        "titleMr": "भारत इतिहास संशोधक मंडळ • इतिहासाचा खरा राखणदार",
        "subtitleEn": "Historical Archive Heritage • Explore Pune",
        "subtitleMr": "अभिलेख वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan across the heritage building facade toward the library archives.",
      "twoPhotos": "Photo 1 captures the historic Mandal building exterior (Acts 1-2); Photo 2 shows Modi script manuscripts (Acts 3-5).",
      "threePhotos": "P1: BISM entrance facade; P2: Modi script scrolls display; P3: Rajwade research library.",
      "fourPhotos": "P1: Gate; P2: Facade; P3: Documents; P4: Rare coins.",
      "fivePlusPhotos": "Scholarly, authentic archival progression honoring Maratha documentary heritage."
    }
  },
  "bhide-wada": {
    "placeId": "bhide-wada",
    "slug": "bhide-wada",
    "placeName": "Bhide Wada (India's First Girls' School)",
    "placeNameMr": "भिडे वाडा (भारतातील मुलींची पहिली ऐतिहासिक शाळा)",
    "category": "heritage",
    "templateTitle": "Bhide Wada — Dawn of India’s First Girls’ School (1848)",
    "templateTitleMr": "भिडे वाडा • जोतीराव-सावित्रीबाईंची भारतातील पहिली मुलींची शाळा",
    "conceptTaglineEn": "The hallowed national landmark in Budhwar Peth where Mahatma Jyotirao Phule and Krantijyoti Savitriabai Phule opened India’s first school for girls on January 1, 1848.",
    "conceptTaglineMr": "१ जानेवारी १८४८ रोजी महात्मा जोतीराव फुले आणि क्रांतिज्योती सावित्रीबाई फुले यांनी भारतातील मुलींची पहिली ऐतिहासिक शाळा सुरू केलेले पवित्र स्थान.",
    "subtitle": "Budhwar Peth • Pune 411002",
    "elevationOrEra": "First Girls’ School (1848 AD)",
    "visualMood": "Historic brickwork, vintage slate and chalk slates, warm revolutionary morning sunlight, and profound social reverence.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#7c2d12",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(124,45,18,0.2) 0%, rgba(20,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Bhide Wada Pune Savitribai Phule First Girls School Reel",
        "youtubeQuery": "Bhide Wada Pune National Memorial Savitribai Jyotirao Phule",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "January 1, 1848 — The Dawn of Women’s Education in India",
        "titleMr": "१ जानेवारी १८४८ — भारतातील स्त्री शिक्षणाची पहिली पहाट",
        "subtitleEn": "Bhide Wada, Budhwar Peth, Pune",
        "subtitleMr": "भिडे वाडा, बुधवार पेठ, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Offered by Tatyasaheb Bhide to the Phule Reformers",
        "titleMr": "तात्यासाहेब भिडे यांनी शिक्षणासाठी आनंदाने दिलेला वाडा",
        "subtitleEn": "Where Savitribai Phule Taught the First Eight Girls",
        "subtitleMr": "जिथे सावित्रीबाईंनी पहिली पाटी पुसून शिक्षणाचे दार उघडले",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Defying Cowdung, Stones & Orthodox Taboos with Courage",
        "titleMr": "शेण, दगड आणि समाजाचा विरोध सहन करत घेतलेला शिक्षणाचा वसा",
        "subtitleEn": "Supported by Fatima Sheikh & Jyotirao Phule",
        "subtitleMr": "फातिमा शेख आणि जोतीरावांची अढळ क्रांतिकारी साथ",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Sacred Fountainhead of Every Educated Indian Woman",
        "titleMr": "आज शिकणाऱ्या प्रत्येक भारतीय स्त्रीच्या सन्मानाचे उगमस्थान",
        "quoteEn": "“Here, in this humble courtyard, the chains of centuries were shattered by the power of education.”",
        "quoteMr": "“या पवित्र अंगणात सावित्रीबाईंनी ज्ञानाचा दीप लावून शतकानुशतकांच्या बेड्या तोडल्या.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bhide Wada • Temple of Equality",
        "titleMr": "भिडे वाडा • क्रांती आणि समतेचे राष्ट्रीय तीर्थ",
        "subtitleEn": "National Social Heritage • Explore Pune",
        "subtitleMr": "स्त्री शिक्षण वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the foundation stones of Bhide Wada to the historic facade and memorial plaques.",
      "twoPhotos": "Photo 1 captures the historic exterior street facade (Acts 1-2); Photo 2 focuses on memorial plaque of Savitribai Phule (Acts 3-5).",
      "threePhotos": "P1: Street view of Bhide Wada; P2: Memorial entrance; P3: Savitribai Phule memorial plaque.",
      "fourPhotos": "P1: Lane; P2: Facade; P3: Plaque; P4: National monument view.",
      "fivePlusPhotos": "Deeply inspirational social reform progression with uplifting acoustic melodies."
    }
  },
  "bhimashankar-temple": {
    "placeId": "bhimashankar-temple",
    "slug": "bhimashankar-temple",
    "placeName": "Bhimashankar Jyotirlinga Temple & Wildlife Sanctuary",
    "placeNameMr": "भीमाशंकर ज्योतिर्लिंग मंदिर व वन्यजीव अभयारण्य",
    "category": "temples",
    "templateTitle": "Bhimashankar — Ancient Jyotirlinga in Sacred Forests",
    "templateTitleMr": "भीमाशंकर ज्योतिर्लिंग • दाट अभयारण्य व भीमा नदीचे उगमस्थान",
    "conceptTaglineEn": "One of India’s 12 sacred Jyotirlingas nestled in dense Sahyadri rainforests, originating the holy Bhima river and protecting the giant squirrel (Shekru).",
    "conceptTaglineMr": "भारतातील १२ पवित्र ज्योतिर्लिंगांपैकी एक, जिथे भीमा नदीचा उगम होतो आणि दाट अभयारण्यात शेकरू खार नांदते.",
    "subtitle": "Khed Taluka • Pune 410505",
    "elevationOrEra": "6th of 12 Sacred Jyotirlingas",
    "visualMood": "Lush monsoon mist, damp black basalt Nagara-style stone carvings, sound of forest bells, and sacred river origin springs.",
    "palette": {
      "primary": "#047857",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.2) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "cinematic_blur",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Bhimashankar Jyotirlinga Temple Monsoon Pune Reel",
        "youtubeQuery": "Bhimashankar Jyotirlinga Wildlife Sanctuary 4K Drone Temple",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "One of India’s 12 Sacred Jyotirlingas",
        "titleMr": "भारतातील १२ पवित्र ज्योतिर्लिंगांपैकी एक — भीमाशंकर",
        "subtitleEn": "Bhimashankar Temple & Wildlife Sanctuary",
        "subtitleMr": "भीमाशंकर ज्योतिर्लिंग व वन्यजीव अभयारण्य",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Perched 3,250 Feet High in Western Ghat Rainforests",
        "titleMr": "समुद्रसपाटीपासून ३,२५० फूट उंच घनदाट सह्याद्री जंगलात",
        "subtitleEn": "Origin of the Holy Bhima River (Chandrabhaga)",
        "subtitleMr": "पंढरपूरला जाणाऱ्या पवित्र भीमा (चंद्रभागा) नदीचे उगमस्थान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "13th-Century Nagara Style Basalt Carvings & Chimaji Appa’s Bell",
        "titleMr": "१३व्या शतकातील नागर शैलीतील कोरीव काम आणि चिमाजी अप्पांची घंटा",
        "subtitleEn": "Home to the Giant Squirrel (Shekru) & Rare Forest Flora",
        "subtitleMr": "महाराष्ट्राचा राज्यप्राणी शेकरू आणि जैवविविधतेचे नंदनवन",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Earth’s Purest Springs Meet Divine Fire",
        "titleMr": "निसर्गाची अद्भूत शांतता आणि महादेवाच्या ज्योतिर्लिंगाचे तेज",
        "quoteEn": "“In the misty depths of Bhimashankar’s forest, Shiva resides in the quiet heartbeat of nature.”",
        "quoteMr": "“धुक्यात न्हालेल्या भीमाशंकराच्या अरण्यात निसर्गाच्या प्रत्येक पात्यामध्ये शिवतत्त्व वसते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bhimashankar • The Sacred Forest Sanctum",
        "titleMr": "भीमाशंकर • ज्योतिर्लिंगाचे अलौकिक तेज",
        "subtitleEn": "National Jyotirlinga • Explore Pune",
        "subtitleMr": "पवित्र ज्योतिर्लिंग तीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth downward tilt through monsoon fog canopy to the black stone Nagara temple shikhara.",
      "twoPhotos": "Photo 1 captures temple surrounded by misty forest (Acts 1-2); Photo 2 shows intricately carved sanctum doorway (Acts 3-5).",
      "threePhotos": "P1: Foggy forest canopy; P2: Nagara temple shikhar; P3: Swayambhu Jyotirlinga sanctum.",
      "fourPhotos": "P1: Forest trail; P2: Chimaji bell; P3: Spire; P4: Inner sanctum.",
      "fivePlusPhotos": "Atmospheric mist and forest sanctuary progression with sacred chimes."
    }
  },
  "bhor-rajwada-palace": {
    "placeId": "bhor-rajwada-palace",
    "slug": "bhor-rajwada-palace",
    "placeName": "Bhor Rajwada & Royal Palace",
    "placeNameMr": "भोर राजवाडा (पंत सचिवांचा ऐतिहासिक लाकडी राजमहाल)",
    "category": "heritage",
    "templateTitle": "Bhor Rajwada — Wooden Palace of the Pant Sachivs",
    "templateTitleMr": "भोर राजवाडा • पंत सचिवांचा भव्य लाकडी ऐतिहासिक महाल",
    "conceptTaglineEn": "The magnificent wooden royal palace in Bhor built in 1869 by Chimnaji Raghunathrao, fusing Maratha Peshwa timber architecture with British Victorian flourishes.",
    "conceptTaglineMr": "भोर येथील १८६९ मधील पंत सचिवांचा भव्य लाकडी राजमहाल, जो पेशवेकालीन सागवानी वास्तुकला आणि व्हिक्टोरियन शिल्पकलेचा संगम आहे.",
    "subtitle": "Bhor Town • Pune 412206",
    "elevationOrEra": "Built 1869 AD (Pant Sachiv)",
    "visualMood": "Soaring carved teakwood pillars, sprawling cobblestone courtyards, European grand chandeliers, and royal Maratha throne halls.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#451a03",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.1) sepia(0.12) saturate(1.18)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Bhor Rajwada Palace Bollywood Film Shooting Pune Reel",
        "youtubeQuery": "Bhor Rajwada Royal Wooden Palace 4K Drone Walkthrough",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "One of the Largest Wooden Palaces in Maharashtra",
        "titleMr": "महाराष्ट्रातील सर्वात भव्य लाकडी राजमहाल — भोर राजवाडा",
        "subtitleEn": "Seat of the Pant Sachiv Rulers of Bhor State (1869)",
        "subtitleMr": "भोर संस्थानाचे राजे पंत सचिव यांचे ऐतिहासिक राजवैभव",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built by Raja Chimnaji Raghunathrao at a Cost of ₹2 Lakhs in 1869",
        "titleMr": "राजा चिमणाजी रघुनाथराव यांनी १८६९ मध्ये बांधलेला राजवाडा",
        "subtitleEn": "Historic Venue for Countless Epic Cinema Productions",
        "subtitleMr": "अनेक ऐतिहासिक चित्रपट व मालिकांचे आवडते शूटिंग ठिकाण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Massive Teakwood Pillars, Royal Darbar Hall & Belgian Chandeliers",
        "titleMr": "भव्य सागवानी खांब, राजदरबार आणि बेल्जियन झुंबर",
        "subtitleEn": "Cobblestone Royal Courtyard Surrounded by Intricate Wood Carvings",
        "subtitleMr": "भव्य दगडी चौक आणि लाकडावर कोरलेली सुंदर नक्षीकामे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Living Splendour of 19th-Century Princely Maharashtra",
        "titleMr": "१९व्या शतकातील मराठा संस्थानांच्या राजवैभवाची जिवंत अनुभूती",
        "quoteEn": "“Under these soaring teakwood beams, the regal pomp of princely Bhor comes vividly alive.”",
        "quoteMr": "“भव्य सागवानी छताखाली उभे राहताच संस्थानकालीन राजेशाही थाट डोळ्यांसमोर उभा राहतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bhor Rajwada • Royal Heritage",
        "titleMr": "भोर राजवाडा • संस्थानांचे लाकडी राजवैभव",
        "subtitleEn": "Royal Palace Landmark • Explore Pune",
        "subtitleMr": "राजमहाल वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the cobblestone courtyard up to the three-tiered wooden royal palace balconies.",
      "twoPhotos": "Photo 1 captures expansive courtyard and palace facade (Acts 1-2); Photo 2 focuses on Royal Darbar hall pillars (Acts 3-5).",
      "threePhotos": "P1: Grand courtyard palace front; P2: Carved teakwood corridor; P3: Royal darbar hall.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Balconies; P4: Darbar hall.",
      "fivePlusPhotos": "Cinematic, regal palace tour with rich classical acoustic strings."
    }
  },
  "blades-of-glory-cricket-museum": {
    "placeId": "blades-of-glory-cricket-museum",
    "slug": "blades-of-glory-cricket-museum",
    "placeName": "Blades of Glory Cricket Museum",
    "placeNameMr": "ब्लेड्स ऑफ ग्लोरी क्रिकेट म्युझियम (सहकार नगर, पुणे)",
    "category": "museums",
    "templateTitle": "Blades of Glory — World’s Largest Cricket Memorabilia Treasury",
    "templateTitleMr": "ब्लेड्स ऑफ ग्लोरी • क्रिकेट जगतातील सर्वात मोठे दुर्मिळ संग्रहालय",
    "conceptTaglineEn": "The Guinness World Record holding cricket museum founded by Rohan Pate, housing over 51,000 autographed bats, jerseys, and World Cup artifacts.",
    "conceptTaglineMr": "रोहन पाटे यांनी स्थापन केलेले, ५१,००० हून अधिक स्वाक्षरी केलेल्या बॅटी व विश्वचषक आठवणी जपणारे गिनीज रेकॉर्ड संग्रहालय.",
    "subtitle": "Sahakar Nagar • Pune 411009",
    "elevationOrEra": "Founded 2012",
    "visualMood": "Spotlit willow bats, iconic blue jerseys, gleaming world cup balls, and stadium green grass highlights.",
    "palette": {
      "primary": "#1d4ed8",
      "secondary": "#0f172a",
      "accent": "#60a5fa",
      "overlayGradient": "linear-gradient(180deg, rgba(29,78,216,0.18) 0%, rgba(10,15,30,0.92) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.25) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Blades of Glory Cricket Museum Pune Sachin Tendulkar Reel",
        "youtubeQuery": "Blades of Glory Pune Cricket Museum World Record Walkthrough",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Holy Grail of World Cricket",
        "titleMr": "क्रिकेट जगतातील सर्वात मोठे पवित्र मंदिर",
        "subtitleEn": "Blades of Glory Museum, Sahakar Nagar",
        "subtitleMr": "ब्लेड्स ऑफ ग्लोरी म्युझियम, सहकार नगर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Guinness World Record for Largest Cricket Collection",
        "titleMr": "सर्वात मोठ्या क्रिकेट संग्रहासाठी गिनीज वर्ल्ड रेकॉर्ड",
        "subtitleEn": "Founded by Former Ranji Cricketer Rohan Pate",
        "subtitleMr": "माजी रणजी खेळाडू रोहन पाटे यांची अद्भूत निर्मिती",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Sachin Tendulkar’s 100 Centuries Room & World Cup Kits",
        "titleMr": "सचिन तेंडुलकरचे १०० शतकांचे विशेष दालन व विश्वचषक बॅटी",
        "subtitleEn": "Signed Bats from Bradman to Virat Kohli & MS Dhoni",
        "subtitleMr": "ब्रॅडमनपासून धोनी, कोहलीपर्यंतच्या मूळ स्वाक्षऱ्या",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Every Legend Left Their Signature on History",
        "titleMr": "जिथे प्रत्येक महान खेळाडूने आपल्या पराक्रमाची साक्ष दिली",
        "quoteEn": "“Here, you do not just see bats and balls; you walk through cricket immortality.”",
        "quoteMr": "“येथे केवळ बॅट आणि चेंडू नाहीत, तर क्रिकेटच्या अमर इतिहासाचे दर्शन घडते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Blades of Glory • Cricket Paradise",
        "titleMr": "ब्लेड्स ऑफ ग्लोरी • क्रिकेटप्रेमींचे नंदनवन",
        "subtitleEn": "World Record Treasury • Explore Pune",
        "subtitleMr": "जागतिक विक्रम संग्रहालय • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Sharp plunge zoom focusing onto Sachin Tendulkar autographed bat rack.",
      "twoPhotos": "Photo 1 showcases museum gallery walkway (Acts 1-2); Photo 2 zooms into jersey or bat details (Acts 3-5).",
      "threePhotos": "P1: Museum entrance; P2: Sachin Tendulkar room; P3: World Cup autographed bats gallery.",
      "fourPhotos": "P1: Name wall; P2: Bat array; P3: World cup jerseys; P4: Trophies display.",
      "fivePlusPhotos": "High-energy stadium-style cuts with dramatic spotlights."
    }
  },
  "bund-garden": {
    "placeId": "bund-garden",
    "slug": "bund-garden",
    "placeName": "Bund Garden & Fitzgerald Bridge",
    "placeNameMr": "बंड गार्डन व फिट्झगेराल्ड पूल",
    "category": "heritage",
    "templateTitle": "Bund Garden — Fitzgerald Bridge & Mutha Waters",
    "templateTitleMr": "बंड गार्डन • फिट्झगेराल्ड पूल व मुठा नदीकाठची सायंकाळ",
    "conceptTaglineEn": "The historic municipal pleasure garden on the Mula-Mutha river, built in 1869 by Sir Jamshetji Jeejeebhoy alongside the historic Fitzgerald stone-arch bridge.",
    "conceptTaglineMr": "मुळा-मुठा नदीकाठची १८६९ मधील ऐतिहासिक बाग, जिथे सर जमशेटजी जीजीभॉय यांनी बांधलेले धरण आणि फिट्झगेराल्ड दगडी कमानी पूल आहे.",
    "subtitle": "Yerawada Bridge Road, Sangamvadi • Pune 411001",
    "elevationOrEra": "Built 1869 AD (Fitzgerald Bridge)",
    "visualMood": "Flowing river water rapids, massive stone arches of Fitzgerald bridge, shaded raintrees, evening river breezes, and golden sunset reflections.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,25,45,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Bund Garden Pune Fitzgerald Bridge River Sunset Reel",
        "youtubeQuery": "Bund Garden Pune Fitzgerald Bridge History Mula Mutha 4K",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "155 Years of Riverside Promenades in Pune",
        "titleMr": "मुळा-मुठा नदीकाठची १५५ वर्षे जुनी ऐतिहासिक सायंकाळ",
        "subtitleEn": "Bund Garden (Mahatma Gandhi Udyan) & Fitzgerald Bridge",
        "subtitleMr": "बंड गार्डन व फिट्झगेराल्ड पूल, संगमवाडी (१८६९)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Constructed by Philanthropist Sir Jamshetji Jeejeebhoy in 1869",
        "titleMr": "दानशूर सर जमशेटजी जीजीभॉय यांनी गरिबांच्या पाण्यासाठी उभारलेले धरण",
        "subtitleEn": "Flanked by the Historic Multi-Arched Fitzgerald Stone Bridge",
        "subtitleMr": "नदीवर उभा असलेला भव्य दगडी कमानींचा ऐतिहासिक पूल",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Cascading Dam Rapids, Shaded Jogging Paths & Evening Cool",
        "titleMr": "बंधाऱ्यावरून वाहणारे पाणी, झाडांची सावली आणि नदीचा गार वारा",
        "subtitleEn": "Generations of Pune Families Unwinding by the River Waters",
        "subtitleMr": "पिढ्यान्‌पिढ्या पुणेकरांचे आवडते संध्याकाळचे विरंगुळ्याचे ठिकाण",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Flowing Waters Reflect the Old Soul of the City",
        "titleMr": "वाहत्या पाण्याच्या लाटांवर उमटणारे जुन्या पुण्याचे सोनेरी प्रतिबिंब",
        "quoteEn": "“Under the arches of Fitzgerald Bridge, the waters carry a century and a half of quiet memories.”",
        "quoteMr": "“दगडी कमानींखाली वाहणारे पाणी दीड शतकाच्या आठवणी घेऊन संथ वाहत राहते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bund Garden • The Riverside Vista",
        "titleMr": "बंड गार्डन • नदीकाठचा शांत वारसा",
        "subtitleEn": "Historic Riverfront Promenade • Explore Pune",
        "subtitleMr": "नदीकाठ वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal drift across the river waters toward the stone arches of Fitzgerald bridge.",
      "twoPhotos": "Photo 1 captures Fitzgerald bridge and river dam weir (Acts 1-2); Photo 2 shows shaded garden walking paths (Acts 3-5).",
      "threePhotos": "P1: River dam and bridge view; P2: Garden tree pathway; P3: Sunset over river waters.",
      "fourPhotos": "P1: Park; P2: Bridge arches; P3: River weir; P4: Sunset reflections.",
      "fivePlusPhotos": "Breezy riverside heritage progression with reflective water ripples."
    }
  },
  "bushi-dam": {
    "placeId": "bushi-dam",
    "slug": "bushi-dam",
    "placeName": "Bushi Dam (Lonavala Water Cascades)",
    "placeNameMr": "भुशी धरण (लोणावळा जलप्रपात)",
    "category": "nature",
    "templateTitle": "Bushi Dam — Cascading Steps of Lonavala Monsoon",
    "templateTitleMr": "भुशी धरण • लोणावळ्यातील फेसाळणाऱ्या पाण्याच्या पायऱ्या",
    "conceptTaglineEn": "The world-famous masonry dam on the Indrayani river where visitors sit on cascading stone steps surrounded by rushing monsoon torrents.",
    "conceptTaglineMr": "लोणावळ्यातील प्रसिद्ध चिरेबंदी धरण, जिथल्या पायऱ्यांवरून फेसाळत वाहणाऱ्या पाण्याच्या प्रवाहात हजारो पर्यटक आनंद घेतात.",
    "subtitle": "Lonavala-INS Shivaji Road • Pune 410401",
    "elevationOrEra": "Built 1860s",
    "visualMood": "White foamy water splashing over tiered stone steps, laughing crowds, green misty hill backdrops, and steaming bhutta stalls.",
    "palette": {
      "primary": "#0891b2",
      "secondary": "#155e75",
      "accent": "#67e8f9",
      "overlayGradient": "linear-gradient(180deg, rgba(21,94,117,0.2) 0%, rgba(10,25,35,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.25) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Bushi Dam Lonavala Monsoon Water Splash Reel / Bhushi Dam",
        "youtubeQuery": "Bushi Dam Lonavala Overflow Water Steps Fun 4K",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Most Celebrated Monsoon Steps in India",
        "titleMr": "पावसाळ्यात फेसाळणाऱ्या पायऱ्यांचा महाआनंद — भुशी धरण",
        "subtitleEn": "Bushi Dam, Lonavala • Built in 1860s",
        "subtitleMr": "भुशी धरण, लोणावळा • १८६० चे ऐतिहासिक धरण",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Originally Built for Great Indian Peninsula Railway Steam Trains",
        "titleMr": "जीआयपी रेल्वेच्या वाफेच्या इंजिनांसाठी उभारलेले धरण",
        "subtitleEn": "Surrounded by Western Ghat Waterfalls & Dense Greenery",
        "subtitleMr": "चारही बाजूंनी डोंगर आणि कोसळणाऱ्या जलधारांचा गराडा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Rushing Cold Foam Over Stone Tiers & Warm Roasted Corn",
        "titleMr": "दगडी पायऱ्यांवरून वाहणारे फेसाळ पाणी आणि गरमागरम भाजलेले कणीस",
        "subtitleEn": "Laughter, Monsoon Splashes & Maggi Khattas",
        "subtitleMr": "मित्रांच्या गप्पा, पाण्याचे शिंतोडे आणि वाफाळलेली मॅगी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Undisputed Epicentre of Lonavala’s Rainy Season",
        "titleMr": "लोणावळ्यातील पावसाळी पर्यटनाचा अनभिषिक्त केंद्रबिंदू",
        "quoteEn": "“Sitting on water-washed stone steps with rain falling from above is pure, childlike joy.”",
        "quoteMr": "“फेसाळणाऱ्या पाण्याच्या पायऱ्यांवर बसून पावसाचा मनसोक्त आनंद लुटणे हा निखळ आनंद आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Bushi Dam • The Monsoon Splash",
        "titleMr": "भुशी धरण • पावसाळ्यातील जल्लोष",
        "subtitleEn": "Iconic Water Cascade • Explore Pune",
        "subtitleMr": "पावसाळी पर्यटन • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dynamic downward tilt from overflowing dam wall to the frothing stepped stone cascades.",
      "twoPhotos": "Photo 1 captures dam wall and overflowing waters (Acts 1-2); Photo 2 zooms into frothing water steps (Acts 3-5).",
      "threePhotos": "P1: Distant waterfall steps; P2: People enjoying water cascade; P3: Foaming water detail.",
      "fourPhotos": "P1: Road; P2: Steps; P3: Overflow; P4: Hill view.",
      "fivePlusPhotos": "High-energy, splash-filled monsoon party progression."
    }
  },
  "chaturshringi-temple": {
    "placeId": "chaturshringi-temple",
    "slug": "chaturshringi-temple",
    "placeName": "Chaturshringi Temple",
    "placeNameMr": "चतुःशृंगी देवी मंदिर",
    "category": "temples",
    "templateTitle": "Chaturshringi Temple — Four Peaks of Divine Grace",
    "templateTitleMr": "चतुःशृंगी देवी मंदिर • चार शिखरांवरील आदिशक्तीचे पावन जागरण",
    "conceptTaglineEn": "The historic hill shrine on Senapati Bapat Road dedicated to Goddess Chaturshringi (Amreshwari), ascended by 170 steps into natural rock caves.",
    "conceptTaglineMr": "सेनापती बापट रस्त्यावरील टेकडीवर वसलेले, १७० पायऱ्यांचे आदिशक्ती चतुःशृंगी देवीचे अत्यंत जागृत आणि प्रसिद्ध मंदिर.",
    "subtitle": "Senapati Bapat Road • Pune 411016",
    "elevationOrEra": "Peshwa Era Hill Shrine",
    "visualMood": "Vibrant vermilion kumkum, glowing brass oil lamps, saffron flags atop four hill peaks, and Navratri festivity lights.",
    "palette": {
      "primary": "#dc2626",
      "secondary": "#991b1b",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(153,27,27,0.2) 0%, rgba(25,5,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.24) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Chaturshringi Temple Pune Navratri Aarti Reel",
        "youtubeQuery": "Chaturshringi Devi Mandir Pune Senapati Bapat Road Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Mountain Goddess on Four Sacred Peaks",
        "titleMr": "चार शिखरांवर विराजमान आदिशक्ती — चतुःशृंगी",
        "subtitleEn": "Chaturshringi Temple, Senapati Bapat Road",
        "subtitleMr": "चतुःशृंगी देवी मंदिर, सेनापती बापट रस्ता",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "170 Stone Steps Leading into the Natural Rock Cave",
        "titleMr": "१७० दगडी पायऱ्या चढून नैसर्गिक गुहेतील दर्शन",
        "subtitleEn": "Established During the Peshwa Rule by Durlabhsheth",
        "subtitleMr": "पेशवेकाळात दुर्लभशेठ यांनी स्थापन केलेले जागृत स्थान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Kumkum Offerings, Navratri Fairs & Temple Bells",
        "titleMr": "हळदी-कुंकू, नवरात्रीचा भव्य उत्सव आणि अखंड घंटानाद",
        "subtitleEn": "Overlooking the Bustling Educational Hub of Modern Pune",
        "subtitleMr": "पुण्याच्या शैक्षणिक आणि आधुनिक परिसरावर देवीची कृपाछत्र",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Empowering Millions of Devotees with Divine Strength",
        "titleMr": "लाखो भक्तांना संकटात सामर्थ्य आणि मनःशांती देणारी माता",
        "quoteEn": "“Under the four peaks, the mother’s grace watches silently over the city.”",
        "quoteMr": "“चार शिखरांवरून देवी मातेचा आशीर्वाद संपूर्ण शहरावर अखंड बरसतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Chaturshringi • Sanctuary of Shakti",
        "titleMr": "चतुःशृंगी • आदिशक्तीचा पावन जागर",
        "subtitleEn": "Sacred Hill Temple • Explore Pune",
        "subtitleMr": "जागृत देवीस्थान • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Upward dynamic tilt from the colorful entrance arch up the hillside steps to the golden deity.",
      "twoPhotos": "Photo 1 captures illuminated hillside staircase (Acts 1-2); Photo 2 focuses on glowing goddess idol (Acts 3-5).",
      "threePhotos": "P1: Hillside temple view; P2: 170 steps climb; P3: Sanctum goddess darshan.",
      "fourPhotos": "P1: Entrance; P2: Steps; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "High-energy devotional Shakti montage with bells and rhythmic dholak."
    }
  },
  "chavand-fort": {
    "placeId": "chavand-fort",
    "slug": "chavand-fort",
    "placeName": "Chavand Fort (Prasannagad)",
    "placeNameMr": "चावंड किल्ला (प्रसन्नगड, जुन्नर)",
    "category": "forts",
    "templateTitle": "Chavand Fort — The High Perch of Prasannagad",
    "templateTitleMr": "चावंड • प्रसन्नगड व जुन्नरच्या सात दुर्गांवरील नजर",
    "conceptTaglineEn": "The scenic hill fort overlooking Junnar valley, featuring 200+ rock-hewn steps with modern safety railings, ancient Chamunda Devi temple, and deep cisterns.",
    "conceptTaglineMr": "जुन्नरच्या सात दुर्गात मानाचे स्थान असलेला प्रसन्नगड, जिथे २०० पेक्षा जास्त पाषाण पायऱ्या आणि चामुंडा देवीचे मंदिर आहे.",
    "subtitle": "Chavand Village, Junnar • Pune 410502",
    "elevationOrEra": "Elevation 1,036 m",
    "visualMood": "Open breezy skies, sheer vertical rock walls, green agricultural patchwork of Junnar valley below, and tranquil stone temples.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#065f46",
      "accent": "#fbbf24",
      "overlayGradient": "linear-gradient(180deg, rgba(6,95,70,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Chavand Fort Prasannagad Junnar Trek Reel",
        "youtubeQuery": "Chavand Fort Prasannagad Junnar 4K Drone Views",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Prasannagad — The Serene Guardian of Junnar",
        "titleMr": "प्रसन्नगड — जुन्नरच्या निसर्गातील शांत पहारेकरी",
        "subtitleEn": "Elevation 1,036 m • Chavand Fort",
        "subtitleMr": "उंची १,०३६ मीटर • चावंड किल्ला",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Named Prasannagad by Chhatrapati Shivaji Maharaj",
        "titleMr": "छत्रपती शिवाजी महाराजांनी दिलेले नाव — प्रसन्नगड",
        "subtitleEn": "Overlooking Kukadi River & Manikdoh Dam Waters",
        "subtitleMr": "कुकडी नदी आणि माणिकडोह जलाशयाचे मनमोहक दृश्य",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Chamunda Devi Shrine & Seven Water Tanks (Saptataki)",
        "titleMr": "चामुंडा देवीचे मंदिर आणि सात अखंड पाण्याची टाकी (सप्तटाकी)",
        "subtitleEn": "Steep Rock Steps Leading into Open Windswept Summit",
        "subtitleMr": "पाषाणातील पायऱ्या आणि विस्तीर्ण पठारावरील गार वारा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Panoramic Vision of Junnar’s Seven Forts",
        "titleMr": "एकाच ठिकाणाहून दिसणारा जुन्नरच्या सात दुर्गांचा देखावा",
        "quoteEn": "“Standing on Prasannagad, the mind becomes calm and the soul feels expansive.”",
        "quoteMr": "“प्रसन्नगडाच्या माथ्यावर पोहोचताच मन प्रसन्न होते आणि अथांग शांतता लाभते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Chavand • The Serene Citadel",
        "titleMr": "चावंड • निसर्ग आणि मनाची प्रसन्नता",
        "subtitleEn": "Junnar Fort Glory • Explore Pune",
        "subtitleMr": "ऐतिहासिक दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward tilt tracking the stone stairs cut into the sheer rock up to the summit shrine.",
      "twoPhotos": "Photo 1 captures steep rock cliff and stairs (Acts 1-2); Photo 2 shows plateau view of Manikdoh dam (Acts 3-5).",
      "threePhotos": "P1: Distant fort monolith; P2: Steps cut in stone; P3: Chamunda Devi temple top.",
      "fourPhotos": "P1: Base; P2: Steps; P3: Water tanks; P4: Summit vista.",
      "fivePlusPhotos": "Serene yet dramatic Sahyadri mountain journey."
    }
  },
  "chitale-bandhu-bakarwadi": {
    "placeId": "chitale-bandhu-bakarwadi",
    "slug": "chitale-bandhu-bakarwadi",
    "placeName": "Chitale Bandhu Mithaiwale (Bajirao Road Heritage Branch)",
    "placeNameMr": "चितळे बंधू मिठाईवाले (बाजीराव रस्ता मुख्य शाखा)",
    "category": "food",
    "templateTitle": "Chitale Bandhu — Spiral Crunch of Puneri Bakarwadi",
    "templateTitleMr": "चितळे बंधू • कुरकुरीत बाकरवडी व आंबा बर्फीचा जगप्रसिद्ध स्वाद",
    "conceptTaglineEn": "The global benchmark of Maharashtrian savory snacks, hand-rolled with poppy seeds and secret spices.",
    "conceptTaglineMr": "खसखस, खोबरे आणि गुप्त मसाल्यांनी सजलेली कुरकुरीत बाकरवडी जिने महाराष्ट्राची चव सातासमुद्रापार नेली.",
    "subtitle": "Bajirao Road, Sadashiv Peth • Pune",
    "elevationOrEra": "Founded 1950",
    "visualMood": "Crisp spiral pinwheels, golden roasting tones, brass weighing scales, and bustling Peth crowds.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#92400e",
      "accent": "#fbbf24",
      "overlayGradient": "linear-gradient(180deg, rgba(146,64,14,0.2) 0%, rgba(25,10,3,0.88) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Chitale Bakarwadi Pune Reel / Puneri Food Pride",
        "youtubeQuery": "Chitale Bandhu Bakarwadi History Pune Bajirao Road",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The World’s Most Famous Bakarwadi",
        "titleMr": "जगातील सर्वात प्रसिद्ध बाकरवडी",
        "subtitleEn": "Chitale Bandhu Mithaiwale, Bajirao Road",
        "subtitleMr": "चितळे बंधू मिठाईवाले, बाजीराव रस्ता",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Sacred 1 to 4 PM Afternoon Break",
        "titleMr": "दुपारी १ ते ४ बंदची प्रसिद्ध पुणेरी शिस्त",
        "subtitleEn": "Strict Quality Standards Since 1950",
        "subtitleMr": "१९५० पासून अखंड गुणवत्तेची खरी परंपरा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Perfect Spiral Rolls & Poppy Seed Coating",
        "titleMr": "अचूक वेटोळे, खसखस आणि तिखट-गोड मसाल्यांची भर",
        "subtitleEn": "Mouth-Melting Amba Barfi & Fresh Pedhas",
        "subtitleMr": "जिभेवर विरघळणारी अस्सल आंबा बर्फी व पेढे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Unmistakable Puneri Sound & Crunch",
        "titleMr": "प्रत्येक घासागणिक वाजणारा कुरकुरीत आवाज",
        "quoteEn": "“The unmistakable crunch that defines Pune hospitality across the globe.”",
        "quoteMr": "“पुणेरी पाहुणचाराचा आणि जगभरातील स्वादाचा कुरकुरीत मानबिंदू.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Chitale • The Pride of Pune Kitchens",
        "titleMr": "चितळे • प्रत्येक पुणेकराचा मानाचा स्वाद",
        "subtitleEn": "Culinary Icon • Explore Pune",
        "subtitleMr": "खाद्यसंस्कृतीचे वैभव • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dynamic Ken Burns zoom starting from the brand seal to the spiral layers of the bakarwadi.",
      "twoPhotos": "Photo 1 captures the iconic store counter (Acts 1-2); Photo 2 shows close-up of spiral bakarwadi (Acts 3-5).",
      "threePhotos": "P1: Bajirao Road shop front; P2: Bakarwadi spiral close-up; P3: Amba Barfi box.",
      "fourPhotos": "P1: Board; P2: Counter crowd; P3: Food texture; P4: Packaged bag.",
      "fivePlusPhotos": "Punchy rhythm sync montage with crisp transitions."
    }
  },
  "darshan-museum": {
    "placeId": "darshan-museum",
    "slug": "darshan-museum",
    "placeName": "Darshan Museum (High-Tech Spiritual Museum)",
    "placeNameMr": "दर्शन संग्रहालय (साधू वासवानी मिशन, पुणे)",
    "category": "museums",
    "templateTitle": "Darshan Museum — Immersive Journey into Sadhu Vaswani’s Life",
    "templateTitleMr": "दर्शन संग्रहालय • साधू वासवानींच्या विचारांची हाय-टेक सफर",
    "conceptTaglineEn": "A state-of-the-art interactive biographical museum using 3D holograms, animatronics, and light-and-sound to convey teachings of peace and compassion.",
    "conceptTaglineMr": "साधू वासवानी मिशनमधील आधुनिक थ्रीडी होलोग्राम आणि लाईट-अँड-साऊंड तंत्रज्ञानाने सुसज्ज शांतता व करुणेचे संग्रहालय.",
    "subtitle": "Sadhu Vaswani Mission, Camp • Pune 411001",
    "elevationOrEra": "Opened 2011",
    "visualMood": "Deep tranquil blue lighting, glowing holographic projections, lifelike animatronic sets, and peaceful spiritual ambiance.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0369a1",
      "accent": "#7dd3fc",
      "overlayGradient": "linear-gradient(180deg, rgba(3,105,161,0.2) 0%, rgba(10,20,35,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.15) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.12,
      "transitionEffect": "cinematic_blur",
      "speedRampFactor": 1.1
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Darshan Museum Pune Sadhu Vaswani Hologram Reel",
        "youtubeQuery": "Darshan Museum Pune High Tech Spiritual Experience",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Technology Meets Spiritual Awakening",
        "titleMr": "तंत्रज्ञान आणि अध्यात्माचा सुंदर संगम",
        "subtitleEn": "Darshan Museum, Sadhu Vaswani Mission",
        "subtitleMr": "दर्शन संग्रहालय, साधू वासवानी मिशन, कॅम्प",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Top-Rated Interactive Museum in Pune",
        "titleMr": "पुण्यातील सर्वोच्च तंत्रज्ञानयुक्त आध्यात्मिक अनुभव",
        "subtitleEn": "Conceived to Share Sadhu T.L. Vaswani’s Life",
        "subtitleMr": "साधू टी. एल. वासवानी यांच्या जीवनकार्याची सफर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "3D Holograms, Moving Dioramas & Spatial Sound",
        "titleMr": "थ्रीडी होलोग्राम, हालचाली करणारे पुतळे आणि ध्वनी",
        "subtitleEn": "Stories of Universal Compassion, Non-Violence & Love",
        "subtitleMr": "भूतदया, अहिंसा आणि मानवकल्याणाचा संदेश",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Leaving Every Visitor with Inner Peace and Kindness",
        "titleMr": "प्रत्येक पर्यटकाच्या मनात निर्माण होणारी शांतता",
        "quoteEn": "“Service of the poor and kindness to all living beings is the truest worship.”",
        "quoteMr": "“दीनदुबळ्यांची सेवा आणि मुक्या प्राण्यांवर दया हीच खरी ईश्वरभक्ती.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Darshan Museum • Light of Compassion",
        "titleMr": "दर्शन संग्रहालय • करुणेचा प्रकाशस्तंभ",
        "subtitleEn": "Spiritual Haven • Explore Pune",
        "subtitleMr": "आध्यात्मिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Gentle zoom into the illuminated central statue surrounded by tranquil ambient light.",
      "twoPhotos": "Photo 1 captures the exterior mission sanctuary (Acts 1-2); Photo 2 shows interior holographic lighting hall (Acts 3-5).",
      "threePhotos": "P1: Mission facade; P2: Interactive diorama room; P3: Meditation hall.",
      "fourPhotos": "P1: Entrance; P2: Hall; P3: 3D exhibit; P4: Peace sanctuary.",
      "fivePlusPhotos": "Serene, light-infused spiritual progression with gentle dissolves."
    }
  },
  "dehu-tukaram-mandir": {
    "placeId": "dehu-tukaram-mandir",
    "slug": "dehu-tukaram-mandir",
    "placeName": "Dehu (Sant Tukaram Maharaj Gatha Mandir)",
    "placeNameMr": "देहू (संत तुकाराम महाराज गाथा मंदिर)",
    "category": "temples",
    "templateTitle": "Dehu — Sacred Gatha Mandir of Jagadguru Sant Tukaram",
    "templateTitleMr": "देहू • भक्तीचे माहेरघर व संत तुकाराम महाराज गाथा मंदिर",
    "conceptTaglineEn": "The hallowed birthplace of Sant Tukaram Maharaj on the Indrayani river, housing the monumental glass Gatha Mandir where all 4,000+ abhangas are carved.",
    "conceptTaglineMr": "जगद्गुरू संत तुकाराम महाराजांचे जन्मस्थान, जिथे इंद्रायणीतीरावर ४००० हून अधिक अभंग पाषाणात कोरलेले गाथा मंदिर उभे आहे.",
    "subtitle": "Indrayani River, Dehu • Pune 412109",
    "elevationOrEra": "Birthplace of Sant Tukaram (1608 AD)",
    "visualMood": "Carved stone abhang pillars, sacred Indrayani water reflections, flying saffron flags, and peaceful Varkari fellowship.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#c2410c",
      "accent": "#fed7aa",
      "overlayGradient": "linear-gradient(180deg, rgba(194,65,12,0.18) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Dehu Gatha Mandir Sant Tukaram Abhang Varkari Reel",
        "youtubeQuery": "Dehu Sant Tukaram Maharaj Gatha Mandir 4K Indrayani Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Sant Tukaram’s Abhangas Echo Forever",
        "titleMr": "जिथे आजही दुमदुमतात जगद्गुरू तुकोबांचे अभंग",
        "subtitleEn": "Dehu • Birthplace of Sant Tukaram Maharaj",
        "subtitleMr": "देहू • संत तुकाराम महाराजांचे पवित्र जन्मस्थान",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where the Submerged Gatha Re-Emerged from Indrayani Waters",
        "titleMr": "इंद्रायणीच्या पाण्यात बुडवलेली गाथा जिथे तरून वर आली",
        "subtitleEn": "The Monumental Gatha Mandir on the Riverbank",
        "subtitleMr": "नदीकाठचे भव्य पाषाणातील गाथा मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Over 4,000 Abhangas Inscribed on Temple Marble Walls",
        "titleMr": "मंदिराच्या भिंतींवर कोरलेले ४,००० हून अधिक अमृततुल्य अभंग",
        "subtitleEn": "Vaikuntha Gaman Sthan & Bhamchandra Hill Meditation Caves",
        "subtitleMr": "वैकुंठ गमन स्थान आणि भामचंद्र डोंगरावरील ध्यान गुहा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Purest Wellspring of Equality and Marathi Devotion",
        "titleMr": "समता, बंधुभाव आणि अस्सल मराठी भक्तीचे मूळ उगमस्थान",
        "quoteEn": "“Tuka says, what we give to the world returns as divine grace.”",
        "quoteMr": "“तुका म्हणे जे जे भेटे भूत, ते ते मानिजे भगवंत.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Dehu • The Sanctuary of Truth",
        "titleMr": "देहू • तुकोबांचे पावन माहेरघर",
        "subtitleEn": "Varkari Pilgrim Heritage • Explore Pune",
        "subtitleMr": "संतभूमी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan along the inscribed Gatha marble pillars up to the grand temple dome.",
      "twoPhotos": "Photo 1 captures Indrayani river ghat and temple (Acts 1-2); Photo 2 shows Gatha Mandir interior abhang inscriptions (Acts 3-5).",
      "threePhotos": "P1: Indrayani river view; P2: Gatha Mandir facade; P3: Sant Tukaram idol.",
      "fourPhotos": "P1: Ghat; P2: Dome; P3: Inscribed pillars; P4: Idol.",
      "fivePlusPhotos": "Reverent, uplifting Varkari progression with taal-mridang harmony."
    }
  },
  "empress-botanical-garden": {
    "placeId": "empress-botanical-garden",
    "slug": "empress-botanical-garden",
    "placeName": "Empress Botanical Garden",
    "placeNameMr": "एम्प्रेस बॉटनिकल गार्डन",
    "category": "parks",
    "templateTitle": "Empress Botanical Garden — Century-Old Banyan Canopies",
    "templateTitleMr": "एम्प्रेस बॉटनिकल गार्डन • शतकांहून जुने डेरेदार वटवृक्ष व शांत सावली",
    "conceptTaglineEn": "A sprawling 39-acre historic British-era botanical haven home to exotic flora and majestic heritage trees.",
    "conceptTaglineMr": "पुणे कॅम्पजवळील ३९ एकरांचे ऐतिहासिक उद्यान जिथे दुर्मिळ वनस्पती आणि डेरेदार शतकीय वृक्षांची दाट सावली आहे.",
    "subtitle": "Near Race Course, Camp • Pune 411001",
    "elevationOrEra": "Established 1838",
    "visualMood": "Deep emerald banyan roots, dappled morning sunlight, tranquil lotus ponds, and chirping forest birds.",
    "palette": {
      "primary": "#047857",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(5,25,18,0.88) 100%)",
      "canvasFilter": "contrast(1.05) saturate(1.15) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Empress Garden Pune Botanical Walk Reel / Nature Lovers",
        "youtubeQuery": "Empress Botanical Garden Pune Historic Trees Drone",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "39 Acres of Living Botanical Heritage",
        "titleMr": "३९ एकरांवर पसरलेला हिरवागार ऐतिहासिक वारसा",
        "subtitleEn": "Founded in 1838 Under Queen Victoria",
        "subtitleMr": "१८३८ मधील महाराणी व्हिक्टोरियाकालीन उद्यान",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Ancient Banyan Trees & Rare Tropical Canopies",
        "titleMr": "शंभराहून अधिक वर्षे जुने डेरेदार वटवृक्ष",
        "subtitleEn": "Managed by the Agri-Horticultural Society",
        "subtitleMr": "अॅग्री-हॉर्टिकल्चरल सोसायटीचे जतन केलेले उद्यान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Sunlight Filtering Through Thick Hanging Roots",
        "titleMr": "पारंब्यांमधून पाझरणारी सकाळची कोवळी किरणे",
        "subtitleEn": "Lotus Ponds, Rose Beds & Forest Solitude",
        "subtitleMr": "कमळांचे तळे आणि विविध पक्ष्यांचा किलबिलाट",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Green Lungs of Pune Cantonment",
        "titleMr": "पुणे शहराला शुद्ध प्राणवायू देणारे हिरवेगार फुप्फुस",
        "quoteEn": "“Under these ancient branches, generations of Pune families have found peace.”",
        "quoteMr": "“या डेरेदार वृक्षांच्या छायेत पिढ्यान्‌पिढ्या पुणेकरांनी मनःशांती अनुभवली आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Empress Garden • Pure Botanical Majesty",
        "titleMr": "एम्प्रेस गार्डन • निसर्गाचा अमर हिरवा ठेवा",
        "subtitleEn": "Green Heritage • Explore Pune",
        "subtitleMr": "हरित वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Vertical upward tilt along massive banyan trunk up into sunlight canopy.",
      "twoPhotos": "Photo 1 captures broad tree pathway (Acts 1-2); Photo 2 highlights shaded root canopies (Acts 3-5).",
      "threePhotos": "P1: Historic garden gate; P2: Giant banyan canopy; P3: Shaded picnic lawn.",
      "fourPhotos": "P1: Pathway; P2: Canopy; P3: Nursery flowers; P4: Sunset pond glow.",
      "fivePlusPhotos": "Atmospheric green canopy journey with soft sunlight flares."
    }
  },
  "fc-road-culinary-trail": {
    "placeId": "fc-road-culinary-trail",
    "slug": "fc-road-culinary-trail",
    "placeName": "FC Road & Deccan Food Heritage (Cafe Goodluck, Vaishali & Roopali)",
    "placeNameMr": "एफसी रोड व डेक्कन खाद्यसंस्कृती (कॅफे गडलक, वैशाली व रुपाली)",
    "category": "food",
    "templateTitle": "FC Road Culinary Trail — Sizzling Dosas & Student Nostalgia",
    "templateTitleMr": "एफसी रोड खाद्यसंस्कृती • गडलक, वैशाली व रुपालीचे चविष्ट कट्टे",
    "conceptTaglineEn": "Pune’s most vibrant culinary strip where historic Irani cafes meet student debate khattas.",
    "conceptTaglineMr": "पुण्यातील सर्वात गजबजलेला चविष्ट खाद्यमार्ग जिथे इराणी कॅफे आणि विद्यार्थ्यांच्या गप्पांचे कट्टे रंगतात.",
    "subtitle": "Deccan Gymkhana • Pune 411004",
    "elevationOrEra": "Since 1935",
    "visualMood": "Youthful energy, sizzling butter dosas, streaming filter kaapi, and lively evening street lights.",
    "palette": {
      "primary": "#e11d48",
      "secondary": "#881337",
      "accent": "#fbbf24",
      "overlayGradient": "linear-gradient(180deg, rgba(136,19,55,0.2) 0%, rgba(20,5,10,0.88) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.28) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "FC Road Pune Street Food Reel Audio / Cafe Goodluck",
        "youtubeQuery": "Pune Food Crawl Fast Beat Song Vaishali Goodluck",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Every Corner Smells of Bun Maska",
        "titleMr": "कडक चहा आणि खमंग बन मस्काचा सुगंध",
        "subtitleEn": "Fergusson College Road, Pune",
        "subtitleMr": "फर्ग्युसन कॉलेज रस्ता, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Decades of Irani Bun Maska & Filter Kaapi",
        "titleMr": "१९३५ पासूनचा कॅफे गडलक व वैशालीचा वारसा",
        "subtitleEn": "Cafe Goodluck, Vaishali & Roopali Strip",
        "subtitleMr": "डेक्कन जिमखान्यावरील ऐतिहासिक चवीचे कट्टे",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Sizzling Butter Dosas & Steaming Sambar",
        "titleMr": "खमंग लोणी डोसा, सांबार आणि वाफाळलेली कॉफी",
        "subtitleEn": "Tactile Street Aromas & Fast Table Service",
        "subtitleMr": "चपळ सेवा आणि गजबजलेल्या टेबलांवरील हशा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Immortal Heartbeat of Puneri Youth",
        "titleMr": "पुणेरी तरुणाईच्या गप्पांचा कधी न संपणारा कट्टा",
        "quoteEn": "“Where every street corner smells of crisp dosas and sweet nostalgia.”",
        "quoteMr": "“पुण्याच्या गप्पांचे कट्टे आणि प्रत्येक कोपऱ्यातील चविष्ट आठवणी.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "FC Road • The Pulsing Soul of Pune",
        "titleMr": "एफसी रोड • अस्सल चव आणि अखंड आठवणी",
        "subtitleEn": "Verified Food Heritage • Explore Pune",
        "subtitleMr": "प्रमाणित खाद्यसंस्कृती • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Deep pan from cafe signage down to sizzling plate, zooming into steam ripples.",
      "twoPhotos": "Photo 1 covers buzzing cafe facade (Acts 1-2); Photo 2 focuses on iconic food macro (Acts 3-5).",
      "threePhotos": "P1: Street exterior; P2: Table spread and steaming coffee; P3: Evening crowd ambiance.",
      "fourPhotos": "P1: Signboard hook; P2: Seating aura; P3: Food preparation; P4: Sunset street lights.",
      "fivePlusPhotos": "Sequential 5-act culinary montage synchronized to dholak rhythm."
    }
  },
  "fergusson-college-heritage": {
    "placeId": "fergusson-college-heritage",
    "slug": "fergusson-college-heritage",
    "placeName": "Fergusson College Heritage Campus",
    "placeNameMr": "फर्ग्युसन महाविद्यालय मुख्य हेरिटेज वास्तू",
    "category": "heritage",
    "templateTitle": "Fergusson College — Victorian Gothic Cradle of Leaders",
    "templateTitleMr": "फर्ग्युसन महाविद्यालय • गॉथिक वास्तुकला व राष्ट्रनेत्यांची घडण",
    "conceptTaglineEn": "The historic 1885 institution founded by Tilak and Agarkar under Deccan Education Society, famed for its blue-basalt Gothic main building and astronomical observatory.",
    "conceptTaglineMr": "टिळक, आगरकरांनी १८८५ मध्ये स्थापन केलेले फर्ग्युसन कॉलेज, ज्याच्या गॉथिक इमारतीने भारताला दोन पंतप्रधान आणि अनेक विचारवंत दिले.",
    "subtitle": "FC Road, Deccan • Pune 411004",
    "elevationOrEra": "Founded 1885 AD (DES)",
    "visualMood": "Dark blue-grey basalt stone Gothic arches, grand bell tower, sweeping campus raintrees, amphitheatre steps, and lively student energy.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0f172a",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(2,132,199,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Fergusson College Pune Heritage Gothic Building Reel",
        "youtubeQuery": "Fergusson College Pune Main Building 4K Drone Walkthrough 1885",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "140 Years of Nationalism, Intellect & Youth",
        "titleMr": "१४० वर्षांची राष्ट्रभक्ती, विचार आणि तरुणाईचा वारसा",
        "subtitleEn": "Fergusson College Heritage Campus, FC Road",
        "subtitleMr": "फर्ग्युसन महाविद्यालय मुख्य हेरिटेज वास्तू, एफसी रोड",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Founded in 1885 by Lokmanya Tilak & Gopal Ganesh Agarkar",
        "titleMr": "टिळक आणि आगरकरांनी स्वदेशी शिक्षणासाठी उभारलेली संस्था",
        "subtitleEn": "Magnificent Victorian Gothic Architecture in Blue Basalt Stone",
        "subtitleMr": "काळ्या पाषाणातील भव्य व्हिक्टोरियन गॉथिक वास्तुकला",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Historic Amphitheatre, Kimaya Open-Air Canteen & Old Library",
        "titleMr": "अॅम्फीथिएटर, किमया कट्टा आणि जुनी ग्रंथालय वास्तू",
        "subtitleEn": "Alma Mater to Two Prime Ministers & Countless Freedom Fighters",
        "subtitleMr": "दोन पंतप्रधान आणि स्वातंत्र्यलढ्यातील शेकडो क्रांतिकारकांचे महाविद्यालय",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Modern Maharashtra’s Conscience Was Forged",
        "titleMr": "जिथे आधुनिक महाराष्ट्राच्या वैचारिक जाणिवांची जडणघडण झाली",
        "quoteEn": "“Under these gothic arches, modern India learned to question, debate, and lead.”",
        "quoteMr": "“या गॉथिक कमानींखाली भारताच्या भावी पिढीने विचार करायला आणि नेतृत्व करायला शिकले.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Fergusson College • Pioneer of Thought",
        "titleMr": "फर्ग्युसन कॉलेज • ज्ञानाची आणि नेतृत्वाची पंढरी",
        "subtitleEn": "Historic Academic Monument • Explore Pune",
        "subtitleMr": "शैक्षणिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the front lawns up to the grand Gothic clock tower of the main building.",
      "twoPhotos": "Photo 1 captures main stone building exterior (Acts 1-2); Photo 2 shows amphitheatre or shaded campus paths (Acts 3-5).",
      "threePhotos": "P1: Main building facade; P2: Amphitheatre stairs; P3: Shaded campus trees pathway.",
      "fourPhotos": "P1: Gate; P2: Main building; P3: Kimaya; P4: Sunset campus.",
      "fivePlusPhotos": "Youthful yet majestic historical campus progression."
    }
  },
  "gokhale-institute-heritage": {
    "placeId": "gokhale-institute-heritage",
    "slug": "gokhale-institute-heritage",
    "placeName": "Gokhale Institute of Politics and Economics",
    "placeNameMr": "गोखले अर्थशास्त्र व राज्यशास्त्र संस्था (ऐतिहासिक वारसा)",
    "category": "heritage",
    "templateTitle": "Gokhale Institute — Servants of India & Economic Thought",
    "templateTitleMr": "गोखले अर्थशास्त्र संस्था • भारत सेवक समाज व राष्ट्रीय विचार वारसा",
    "conceptTaglineEn": "The historic academic campus founded in 1930 on the grounds of Gopal Krishna Gokhale’s Servants of India Society, cradle of Indian economic policy and constitutional debates.",
    "conceptTaglineMr": "गोपाळ कृष्ण गोखल्यांच्या भारत सेवक समाजाच्या पावन भूमीवर १९३० मध्ये स्थापन झालेली अर्थशास्त्र व राष्ट्रनिर्माणाची ऐतिहासिक संस्था.",
    "subtitle": "BMCC Road, Deccan • Pune 411004",
    "elevationOrEra": "Founded 1930 (GIPE)",
    "visualMood": "Stately stone heritage halls, towering banyan shade, antique economics libraries, and solemn nationalist intellectual aura.",
    "palette": {
      "primary": "#047857",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.15) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Gokhale Institute Pune Servants of India Society Reel",
        "youtubeQuery": "Gokhale Institute of Politics and Economics Pune Heritage Walk",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Intellectual Cradle of Modern Indian Economics",
        "titleMr": "भारताच्या आर्थिक आणि राष्ट्रीय धोरणांचे जन्मस्थान — गोखले संस्था",
        "subtitleEn": "Gokhale Institute of Politics & Economics, Deccan (1930)",
        "subtitleMr": "गोखले अर्थशास्त्र व राज्यशास्त्र संस्था, डेक्कन (१९३०)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Founded by the Servants of India Society in 1930",
        "titleMr": "गोपाळ कृष्ण गोखले यांच्या भारत सेवक समाजाची पावन भूमी",
        "subtitleEn": "Where Dr. B.R. Ambedkar and National Leaders Debated Policy",
        "subtitleMr": "डॉ. बाबासाहेब आंबेडकर व राष्ट्रीय नेत्यांच्या विचारांनी समृद्ध",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Dhananjayrao Gadgil Library — 280,000 Rare Volumes & British Bluebooks",
        "titleMr": "धनंजयराव गाडगीळ ग्रंथालय — पावणेतीन लाख दुर्मिळ ग्रंथ व सनदा",
        "subtitleEn": "Shaded Banyan Trees Where Gopal Krishna Gokhale Mentored Gandhi",
        "subtitleMr": "जिथे गोखल्यांनी गांधीजींना भारताची सेवा करण्याचा मार्ग दाखवला",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Service of the Motherland Through Integrity and Intellect",
        "titleMr": "विद्वत्ता आणि निस्वार्थी सेवेतून राष्ट्र उभारणीचा आदर्श",
        "quoteEn": "“Public life must be spiritualized; here that noble principle still guides the intellect.”",
        "quoteMr": "“सार्वजनिक जीवन निष्कलंक आणि सेवेने भरलेले असावे हा गोखल्यांचा विचार येथे जिवंत आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Gokhale Institute • Temple of Governance",
        "titleMr": "गोखले संस्था • राष्ट्रसेवेचा बौद्धिक दीपस्तंभ",
        "subtitleEn": "National Thought Heritage • Explore Pune",
        "subtitleMr": "राष्ट्रीय विचार वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan across the stately stone portico to the ancient shaded banyan tree.",
      "twoPhotos": "Photo 1 captures heritage campus building (Acts 1-2); Photo 2 shows Dhananjayrao Gadgil library interior (Acts 3-5).",
      "threePhotos": "P1: Campus entrance stone gate; P2: Historic library building; P3: Gokhale memorial bust.",
      "fourPhotos": "P1: Drive; P2: Facade; P3: Reading hall; P4: Shaded trees.",
      "fivePlusPhotos": "Solemn, intellectual collegiate progression with acoustic guitar tones."
    }
  },
  "gram-sanskruti-udyan": {
    "placeId": "gram-sanskruti-udyan",
    "slug": "gram-sanskruti-udyan",
    "placeName": "Gram Sanskruti Udyan (Village Culture Park, Pashan)",
    "placeNameMr": "ग्राम संस्कृती उद्यान (पाषाण)",
    "category": "parks",
    "templateTitle": "Gram Sanskruti Udyan — Village Heritage of Traditional Maharashtra",
    "templateTitleMr": "ग्राम संस्कृती उद्यान • बलुतेदार व ग्रामीण महाराष्ट्राचे जिवंत दर्शन",
    "conceptTaglineEn": "Maharashtra’s first village culture theme park in Pashan, recreating ancient rural professions and 12 Balutedar traditions.",
    "conceptTaglineMr": "पाषाण येथील महाराष्ट्रातील पहिले ग्राम संस्कृती उद्यान जिथे १२ बलुतेदार आणि ग्रामीण संस्कृतीचे जिवंत देखावे आहेत.",
    "subtitle": "Pashan • Pune 411021",
    "elevationOrEra": "Opened 2016",
    "visualMood": "Earthen mud huts, traditional bronze and clay figurines, rustic bullock carts, and heritage rural scenes.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.88) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.12) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Gram Sanskruti Udyan Pashan Pune Village Reel",
        "youtubeQuery": "Gram Sanskruti Udyan Pune Rural Maharashtra Life",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Experience Rural Maharashtra Without Leaving Pune",
        "titleMr": "शहरातच अनुभवा अस्सल ग्रामीण महाराष्ट्राचे जीवन",
        "subtitleEn": "Gram Sanskruti Udyan, Pashan",
        "subtitleMr": "ग्राम संस्कृती उद्यान, पाषाण",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Maharashtra’s First Village Culture Theme Park",
        "titleMr": "महाराष्ट्रातील पहिले अस्सल ग्रामीण संस्कृती उद्यान",
        "subtitleEn": "Over 700 Realistic Sculptures & Traditional Mud Huts",
        "subtitleMr": "७०० हून अधिक हुबेहूब पुतळे आणि पारंपरिक गावगाडा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The 12 Balutedars — Blacksmiths, Potters & Weavers",
        "titleMr": "१२ बलुतेदार — कुंभार, लोहार, सुतार आणि शेतकरी",
        "subtitleEn": "Panchayat Chaupal, Traditional Gauri Puja & Village Fairs",
        "subtitleMr": "गावचा चावडी कट्टा, शेतीची अवजारे आणि जुन्या चालीरीती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Preserving the Soul of Rural Roots for Generations",
        "titleMr": "पुढील पिढीला आपल्या मातीची आणि मूळ संस्कृतीची ओळख",
        "quoteEn": "“A living walk into the simplicity, warmth, and resilience of Indian village life.”",
        "quoteMr": "“भारतीय खेडेगावातील साधेपणा, कष्ट आणि समृद्ध संस्कृतीचा जिवंत अनुभव.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Gram Sanskruti • Soul of Maharashtra",
        "titleMr": "ग्राम संस्कृती • आपल्या मातीचा गौरव",
        "subtitleEn": "Cultural Village Heritage • Explore Pune",
        "subtitleMr": "ग्रामीण वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow panoramic pan across the village chaupal sculptures with warm terracotta tones.",
      "twoPhotos": "Photo 1 captures village square overview (Acts 1-2); Photo 2 zooms into artisanal sculpture details (Acts 3-5).",
      "threePhotos": "P1: Entrance arch; P2: Balutedar hut sculpture; P3: Village chaupal.",
      "fourPhotos": "P1: Gate; P2: Potter/blacksmith; P3: Bullock cart; P4: Farmer diorama.",
      "fivePlusPhotos": "Rustic folk montage celebrating Maharashtra rural traditions."
    }
  },
  "hadsar-fort": {
    "placeId": "hadsar-fort",
    "slug": "hadsar-fort",
    "placeName": "Hadsar Fort (Parvatgad)",
    "placeNameMr": "हडसर किल्ला (पर्वतगड, जुन्नर)",
    "category": "forts",
    "templateTitle": "Hadsar Fort — Monolithic Tunnel Steps of Junnar",
    "templateTitleMr": "हडसर • पर्वतगड व पाषाणात कोरलेल्या बोगद्याच्या पायऱ्या",
    "conceptTaglineEn": "The unique Satavahana-era hill fort in Junnar famous for its hidden rock-cut tunnel staircase, fortified water tanks, and pristine Shiva sanctum.",
    "conceptTaglineMr": "जुन्नर खोऱ्यातील वैशिष्ट्यपूर्ण किल्ला, जिथे एकाच काळ्या पाषाणात कोरलेल्या बोगद्याच्या पायऱ्या आणि शिवमंदिर आहे.",
    "subtitle": "Hadsar Village, Junnar • Pune 410502",
    "elevationOrEra": "Elevation 1,025 m",
    "visualMood": "Chiseled dark basalt tunnels, echoing stone chambers, cool underground water reservoirs, and windswept grassy plateau.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,6,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.2) brightness(0.96)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Hadsar Fort Tunnel Stairs Junnar Trek Reel",
        "youtubeQuery": "Hadsar Fort Parvatgad Junnar 4K Drone Rock Cut Steps",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Steps Carved Through Living Basalt Stone",
        "titleMr": "अखंड पाषाण फोडून कोरलेल्या बोगद्याच्या पायऱ्या",
        "subtitleEn": "Hadsar Fort (Parvatgad), Junnar",
        "subtitleMr": "हडसर किल्ला (पर्वतगड), जुन्नर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "One of the Famous Seven Forts of Junnar",
        "titleMr": "जुन्नरच्या सात प्रसिद्ध दुर्गांवैकी एक ऐतिहासिक किल्ला",
        "subtitleEn": "Guarding the Trade Passage from Kokan to Desh",
        "subtitleMr": "कोकण ते देश जोडणाऱ्या मार्गाचे रक्षण करणारा दुर्ग",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Magnificent Subterranean Rock-Cut Gateway",
        "titleMr": "अप्रतिम दगडी महादरवाजा आणि गुहांची रचना",
        "subtitleEn": "Shiva Temple, Ganesha Relief & Pristine Cisterns",
        "subtitleMr": "महादेवाचे मंदिर, गणेश शिल्प आणि थंड पाण्याची टाकी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Masterpiece of Ancient Indian Military Stonework",
        "titleMr": "प्राचीन भारतीय पाषाण शिल्पकला आणि युद्धनीतीचा नमुना",
        "quoteEn": "“Entering Hadsar feels like walking through an ancient hidden gate forgotten by time.”",
        "quoteMr": "“हडसरच्या दगडी बोगद्यातून जाताना प्राचीन काळातील गुपिते उलगडल्यासारखा भास होतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Hadsar • The Monolithic Gateway",
        "titleMr": "हडसर • पाषाणातील अभेद्य वैभव",
        "subtitleEn": "Junnar Fort Heritage • Explore Pune",
        "subtitleMr": "जुन्नर दुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth plunge zoom tracking the steep tunnel steps framed by natural solid rock walls.",
      "twoPhotos": "Photo 1 captures the rock tunnel stairway (Acts 1-2); Photo 2 shows the summit Shiva temple and plateau (Acts 3-5).",
      "threePhotos": "P1: Rock tunnel entrance; P2: Interior carved stairs; P3: Plateau Shiva temple.",
      "fourPhotos": "P1: Base; P2: Steps; P3: Gateway; P4: Plateau view.",
      "fivePlusPhotos": "Atmospheric cave-to-sunlight rock architectural montage."
    }
  },
  "iskcon-nvcc-kondhwa": {
    "placeId": "iskcon-nvcc-kondhwa",
    "slug": "iskcon-nvcc-kondhwa",
    "placeName": "ISKCON NVCC Temple (Katraj-Kondhwa)",
    "placeNameMr": "इस्कॉन नवीन वैदिक सांस्कृतिक केंद्र, कोंढवा",
    "category": "temples",
    "templateTitle": "ISKCON NVCC — Vedic Lotus Sanctuary of Katraj-Kondhwa",
    "templateTitleMr": "इस्कॉन नवीन वैदिक सांस्कृतिक केंद्र • कोंढवा व राधा-वृंदावनचंद्र",
    "conceptTaglineEn": "The grand 6-acre New Vedic Cultural Centre in Kondhwa, featuring soaring red sandstone domes, beautiful gold-leaf work, and ecstatic Hare Krishna kirtans.",
    "conceptTaglineMr": "कात्रज-कोंढवा येथील ६ एकरांचे विशाल वैदिक सांस्कृतिक केंद्र, जिथे राधा-वृंदावनचंद्र मंदिर आणि मंत्रमुग्ध करणारे संकीर्तन चालते.",
    "subtitle": "Katraj-Kondhwa Bypass • Pune 411048",
    "elevationOrEra": "Opened 2013",
    "visualMood": "Grand red sandstone domes, intricately painted ceilings, gold-leafed altars, fragrant prasadam, and joyful kirtans.",
    "palette": {
      "primary": "#f97316",
      "secondary": "#9a3412",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(154,52,18,0.2) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.24) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "ISKCON NVCC Pune Kondhwa Hare Krishna Kirtan Reel",
        "youtubeQuery": "ISKCON Temple Pune Kondhwa 4K Drone Walkthrough",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "6 Acres of Vedic Culture & Divine Joy",
        "titleMr": "६ एकरांवर पसरलेले भक्तीचे नंदनवन — इस्कॉन एनव्हीसीसी",
        "subtitleEn": "New Vedic Cultural Centre, Katraj-Kondhwa",
        "subtitleMr": "नवीन वैदिक सांस्कृतिक केंद्र, कात्रज-कोंढवा, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Twin Domes Inspired by Rajasthani & South Indian Temple Architecture",
        "titleMr": "राजस्थानी आणि दाक्षिणात्य मंदिरांचा देखणा संगम",
        "subtitleEn": "Inaugurated by President Pranab Mukherjee in 2013",
        "subtitleMr": "२०१३ मध्ये उभारलेले भव्य आंतरराष्ट्रीय केंद्र",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Ecstatic Kirtans, Hand-Painted Ceilings & Govinda’s Prasadam",
        "titleMr": "आनंददायी संकीर्तन, रंगीबेरंगी छतचित्रे आणि गोविंदाचे प्रसादम",
        "subtitleEn": "Radha Vrindavanchandra, Balaji & Chaitanya Mahaprabhu Altars",
        "subtitleMr": "राधा-वृंदावनचंद्र आणि व्यंकटेश बालाजींचे विलोभनीय रूप",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Music, Devotion, and Love Fill Every Heart",
        "titleMr": "हरिनामाच्या गजरात भान हरपून नाचणारा आनंदोत्सव",
        "quoteEn": "“In the rhythmic chanting of the holy names, every worry transforms into pure spiritual bliss.”",
        "quoteMr": "“हरिनामाच्या मधुर संकीर्तनात जीवनातील सर्व दुःख विरघळून आनंद मिळतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "ISKCON Pune • Sanctuary of Devotion",
        "titleMr": "इस्कॉन पुणे • भक्ती आणि प्रेमाचे केंद्र",
        "subtitleEn": "Vedic Cultural Centre • Explore Pune",
        "subtitleMr": "वैदिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the courtyard fountain to the twin grand stone temple domes.",
      "twoPhotos": "Photo 1 captures illuminated grand domes and facade (Acts 1-2); Photo 2 focuses on Radha-Krishna altar (Acts 3-5).",
      "threePhotos": "P1: Grand temple facade; P2: Hand-painted ceiling; P3: Golden Radha-Vrindavanchandra altar.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Domes; P4: Altar.",
      "fivePlusPhotos": "Joyful, vibrant kirtan-synced progression with rich warm lighting."
    }
  },
  "iucaa-science-park": {
    "placeId": "iucaa-science-park",
    "slug": "iucaa-science-park",
    "placeName": "IUCAA Science Park & Astronomy Centre",
    "placeNameMr": "आयुका विज्ञान उद्यान व खगोलशास्त्र केंद्र",
    "category": "museums",
    "templateTitle": "IUCAA Science Park — Newton’s Apple Tree & Cosmic Wonders",
    "templateTitleMr": "आयुका सायन्स पार्क • न्यूटनचे सफरचंदाचे झाड व खगोलशास्त्र चमत्कार",
    "conceptTaglineEn": "The interactive outdoor science park at Pune University founded under Prof. Jayant Narlikar, featuring working physics pendulums and a graft of Newton’s apple tree.",
    "conceptTaglineMr": "पुणे विद्यापीठातील डॉ. जयंत नारळीकरांनी स्थापन केलेले खगोलशास्त्र केंद्र जिथे प्रत्यक्ष न्यूटनच्या झाडाची फांदी आहे.",
    "subtitle": "Savitribai Phule Pune University • Pune 411007",
    "elevationOrEra": "Founded 1988",
    "visualMood": "Stately red brick colonial lawns, bronze busts of Galileo and Einstein, giant sun dials, and cosmic curiosity.",
    "palette": {
      "primary": "#4338ca",
      "secondary": "#1e1b4b",
      "accent": "#a5b4fc",
      "overlayGradient": "linear-gradient(180deg, rgba(67,56,202,0.18) 0%, rgba(15,10,35,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.15) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "IUCAA Pune Science Park Newtons Apple Tree Reel",
        "youtubeQuery": "IUCAA Pune Astronomy Jayant Narlikar Science Park",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Newton’s Apple Tree Truly Grows",
        "titleMr": "जिथे आजही बहरते न्यूटनच्या सफरचंदाचे झाड",
        "subtitleEn": "IUCAA, Savitribai Phule Pune University",
        "subtitleMr": "आयुका, सावित्रीबाई फुले पुणे विद्यापीठ",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Founded by Renowned Astrophysicist Jayant Narlikar",
        "titleMr": "ज्येष्ठ खगोलशास्त्रज्ञ डॉ. जयंत नारळीकर यांची संकल्पना",
        "subtitleEn": "Inter-University Centre for Astronomy and Astrophysics",
        "subtitleMr": "आंतरविद्यापीठ खगोलशास्त्र आणि खगोलभौतिकी केंद्र",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Statues of Einstein, Galileo, Aryabhata & Sun Dials",
        "titleMr": "गॅलिलिओ, आईनस्टाईन, आर्यभट्ट यांचे पुतळे व सूर्यघड्याळ",
        "subtitleEn": "Interactive Optical Mirrors, Sound Pipes & Pendulums",
        "subtitleMr": "ध्वनी नळ्या, आरसे आणि भौतिकशास्त्राचे जिवंत खेळ",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Inspiring Scientific Curiosity Under Sahyadri Skies",
        "titleMr": "तरुणांच्या मनात विज्ञानाची आणि विश्वाची जिज्ञासा चेतवणारे स्थान",
        "quoteEn": "“Under these trees, students gaze up and wonder about the infinite cosmos.”",
        "quoteMr": "“येथे झाडाखाली बसून विद्यार्थी विश्वाच्या अनंत गूढाचा शोध घेतात.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "IUCAA • Pune’s Gateway to the Stars",
        "titleMr": "आयुका • विज्ञानाची विस्मयकारक पंढरी",
        "subtitleEn": "Scientific Sanctuary • Explore Pune",
        "subtitleMr": "विज्ञान वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Panoramic drift starting from the Newton tree up toward the striking modern IUCAA campus tower.",
      "twoPhotos": "Photo 1 showcases campus courtyard and statues (Acts 1-2); Photo 2 focuses on science models or sun dials (Acts 3-5).",
      "threePhotos": "P1: Campus courtyard; P2: Newton tree and statue; P3: Science park models.",
      "fourPhotos": "P1: Entry; P2: Statues; P3: Apple tree; P4: Sundial.",
      "fivePlusPhotos": "Curiosity-driven intellectual journey with clean architectural framing."
    }
  },
  "jangli-maharaj-temple": {
    "placeId": "jangli-maharaj-temple",
    "slug": "jangli-maharaj-temple",
    "placeName": "Sadguru Jangli Maharaj Temple & Ashram",
    "placeNameMr": "सद्गुरू जंगली महाराज मंदिर व समाधी आश्रम (शिवाजीनगर)",
    "category": "temples",
    "templateTitle": "Jangli Maharaj Ashram — Spiritual Tranquility on JM Road",
    "templateTitleMr": "सद्गुरू जंगली महाराज मंदिर • शिवाजीनगरची शांत ध्यानभूमी",
    "conceptTaglineEn": "The revered 1890 Samadhi temple and spiritual ashram of Sadguru Jangli Maharaj on JM Road, offering an unbroken haven of meditation.",
    "conceptTaglineMr": "जंगली महाराज रस्त्यावरील १८९० मधील सद्गुरू जंगली महाराज समाधी मंदिर व आश्रम, जिथे शांत ध्यानमग्न वातावरण अनुभवता येते.",
    "subtitle": "JM Road, Shivajinagar • Pune 411005",
    "elevationOrEra": "Samadhi Consecrated 1890 AD",
    "visualMood": "White and saffron floral offerings, peaceful circular samadhi sanctum, brass oil lamps, and deep meditative silence.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#c2410c",
      "accent": "#fed7aa",
      "overlayGradient": "linear-gradient(180deg, rgba(194,65,12,0.18) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Jangli Maharaj Temple Pune JM Road Spiritual Samadhi Reel",
        "youtubeQuery": "Sadguru Jangli Maharaj Ashram Pune History Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Haven of Spiritual Silence on Pune’s Busiest Arterial Road",
        "titleMr": "शहराच्या मुख्य रस्त्यावरील अद्भूत शांत ध्यानभूमी",
        "subtitleEn": "Sadguru Jangli Maharaj Mandir, JM Road (1890)",
        "subtitleMr": "सद्गुरू जंगली महाराज समाधी मंदिर, जेएम रस्ता (१८९०)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Samadhi of the Revered 19th-Century Ascetic Saint",
        "titleMr": "१९व्या शतकातील महान सिद्ध संतांचे समाधी स्थान",
        "subtitleEn": "The Landmark That Gave JM Road Its Iconic Name",
        "subtitleMr": "ज्यांच्या नावावरून पुण्याच्या प्रसिद्ध जेएम रस्त्याला नाव मिळाले",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Marble Samadhi Sanctum, Teak Pillars & Fragrant Dhoop Smoke",
        "titleMr": "संगमरवरी समाधी, लाकडी खांब आणि दरवळणारा सुगंधी धूप",
        "subtitleEn": "Devotees Sitting in Deep Silent Meditation for Hours",
        "subtitleMr": "तासनतास शांत ध्यानस्थ बसणारे भाविक आणि आत्मिक समाधान",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Step Outside the Hustle and Reclaim Inner Peace",
        "titleMr": "वाहनांच्या गजबजाटातून थेट आध्यात्मिक शांततेत पाऊल",
        "quoteEn": "“Inside the ashram walls, time slows down and the soul rests in serene grace.”",
        "quoteMr": "“मंदिराच्या आवारात पाऊल टाकताच मनातील सर्व अस्वस्थता दूर होऊन मन शांत होते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Jangli Maharaj • The Ascetic Light",
        "titleMr": "जंगली महाराज • आत्मशांतीची पावन भूमी",
        "subtitleEn": "Spiritual Samadhi Sanctuary • Explore Pune",
        "subtitleMr": "आध्यात्मिक समाधी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan from the incense burner to the marble Samadhi of Sadguru Jangli Maharaj.",
      "twoPhotos": "Photo 1 captures the ashram garden and entrance (Acts 1-2); Photo 2 focuses on marble Samadhi sanctum (Acts 3-5).",
      "threePhotos": "P1: Ashram gate; P2: Courtyard meditation hall; P3: Samadhi sanctum.",
      "fourPhotos": "P1: Gate; P2: Hall; P3: Samadhi; P4: Garden.",
      "fivePlusPhotos": "Serene, contemplative spiritual progression with soft bansuri flute."
    }
  },
  "jejuri-khandoba-temple": {
    "placeId": "jejuri-khandoba-temple",
    "slug": "jejuri-khandoba-temple",
    "placeName": "Khandoba Temple, Jejuri (Golden Jejuri)",
    "placeNameMr": "खंडोबा मंदिर, जेजुरी (सोन्याची जेजुरी)",
    "category": "temples",
    "templateTitle": "Golden Jejuri — Saffron Storm of Lord Khandoba",
    "templateTitleMr": "सोन्याची जेजुरी • येळकोट येळकोट जय मल्हार व भंडाऱ्याची उधळण",
    "conceptTaglineEn": "Maharashtra’s supreme pilgrimage of Lord Khandoba atop Jayadri hill, world-famous for the breathtaking golden blizzard of turmeric (Bhandara).",
    "conceptTaglineMr": "महाराष्ट्राचे कुलदैवत जेजुरीच्या खंडेरायांचे मंदिर, जिथे \"येळकोट येळकोट जय मल्हार\" च्या जयघोषात सोन्यासारख्या भंडाऱ्याची मुक्त उधळण होते.",
    "subtitle": "Purandar Taluka, Jejuri • Pune 412303",
    "elevationOrEra": "Elevation 840 m (Jayadri Hill)",
    "visualMood": "Explosions of golden yellow turmeric powder (bhandara), towering deepamalas, grand stone ramparts, and thunderous Jai Malhar chants.",
    "palette": {
      "primary": "#eab308",
      "secondary": "#ca8a04",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(202,138,4,0.22) 0%, rgba(25,18,3,0.92) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.35) brightness(1.04)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.22,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.4
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Jejuri Khandoba Bhandara Udhallan Reel / Yelkot Yelkot Jai Malhar",
        "youtubeQuery": "Jejuri Golden Temple 4K Drone Turmeric Bhandara Festival",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "“Yelkot Yelkot Jai Malhar!” — Golden Jejuri",
        "titleMr": "“येळकोट येळकोट जय मल्हार!” — सोन्याची जेजुरी",
        "subtitleEn": "Khandoba Temple, Jayadri Hill, Purandar",
        "subtitleMr": "खंडोबा मंदिर, जयाद्री टेकडी, पुरंदर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Maharashtra’s Most Celebrated Kuldaivat Sanctuary",
        "titleMr": "अवघ्या महाराष्ट्राचे कुलदैवत आणि जागृत देवस्थान",
        "subtitleEn": "385 Stone Steps Lined with Magnificent Deepamalas",
        "subtitleMr": "३८५ दगडी पायऱ्या आणि भव्य उंच दीपमाळा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Golden Blizzard of Turmeric (Bhandara) in the Sky",
        "titleMr": "आकाशात उधळणारा सोन्यासारखा पिवळाधमक भंडारा",
        "subtitleEn": "Heavy Swords (Khanda), Dholak Beats & Fervent Chants",
        "subtitleMr": "४२ किलोची ऐतिहासिक तलवार, ढोलकचा ताल आणि अथांग लोकभक्ती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Entire Hill Turned into Solid Gold",
        "titleMr": "भंडाऱ्याने सोन्यासारखी उजळून निघणारी संपूर्ण टेकडी",
        "quoteEn": "“Under the turmeric clouds of Jejuri, every devotee becomes part of the golden legend.”",
        "quoteMr": "“जेजुरीच्या पायऱ्यांवर भंडाऱ्याची उधळण होताच अवघी सृष्टी सोन्यासारखी भासते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Jejuri • The Golden Sanctuary",
        "titleMr": "जेजुरी • खंडेरायाचा सुवर्ण दरबार",
        "subtitleEn": "Supreme Folk Pilgrimage • Explore Pune",
        "subtitleMr": "कुलदैवत वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Explosive zoom through a cloud of yellow turmeric powder up to the temple deepamala and spire.",
      "twoPhotos": "Photo 1 captures staircase with turmeric-covered devotees (Acts 1-2); Photo 2 shows sanctum and Deepamala (Acts 3-5).",
      "threePhotos": "P1: Golden staircase steps; P2: Bhandara explosion in air; P3: Khandoba temple ramparts.",
      "fourPhotos": "P1: Steps; P2: Deepamala; P3: Turmeric cloud; P4: Idol sanctum.",
      "fivePlusPhotos": "High-voltage golden yellow celebration montage with thundering dhol-tasha."
    }
  },
  "jivdhan-fort": {
    "placeId": "jivdhan-fort",
    "slug": "jivdhan-fort",
    "placeName": "Jivdhan Fort (Guardian of Naneghat)",
    "placeNameMr": "जीवधन किल्ला (नाणेघाटाचा पहारेकरी)",
    "category": "forts",
    "templateTitle": "Jivdhan Fort — Guardian Sentinel of Naneghat Pass",
    "templateTitleMr": "जीवधन • नाणेघाटाचा पहारेकरी व वानरलिंगी सुळक्याचा थरारक दुर्ग",
    "conceptTaglineEn": "The formidable sentinel guarding ancient Naneghat trade pass, famous for the towering Vanghoba / Vandarlingi rock pinnacle and rock-cut climbing steps.",
    "conceptTaglineMr": "नाणेघाटाच्या ऐतिहासिक व्यापारी मार्गाचे रक्षण करणारा, प्रसिद्ध वानरलिंगी सुळका व पाषाणातील पायऱ्यांचा दुर्ग.",
    "subtitle": "Ghatghar, Junnar • Pune 410502",
    "elevationOrEra": "Elevation 1,145 m",
    "visualMood": "Vertical basalt needles, misty cloud gaps, dizzying cliff plunges, and ancient trade route echoes.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#1c1917",
      "accent": "#f59e0b",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,6,0.92) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.2) brightness(0.96)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.22,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.4
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Jivdhan Fort Vandarlingi Pinnacle Naneghat Trek Reel",
        "youtubeQuery": "Jivdhan Fort Rock Climbing Vandarlingi Pinnacle 4K",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Sentinel of the Ancient Naneghat Pass",
        "titleMr": "नाणेघाटाचा अभेद्य पहारेकरी — जीवधन",
        "subtitleEn": "Elevation 1,145 m • Junnar Region",
        "subtitleMr": "समुद्रसपाटीपासून १,१४५ मीटर • जुन्नर प्रांत",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Guarding 2,000 Years of Trade from Kalyan to Paithan",
        "titleMr": "कल्याण ते पैठण व्यापारी मार्गाचे २००० वर्षे रक्षण",
        "subtitleEn": "Satavahana Dynasty Defense Outpost",
        "subtitleMr": "सातवाहन काळातील अत्यंत महत्त्वाचा व्यापारी चौकी दुर्ग",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The 350-Foot Vandarlingi Rock Pinnacle Needle",
        "titleMr": "साडेतीनशे फुटांचा उत्तुंग वानरलिंगी सुळका",
        "subtitleEn": "Kalyan Gate, Rock-Cut Steps & Ancient Grain Granaries",
        "subtitleMr": "कल्याण दरवाजा, पाषाणात कोरलेल्या पायऱ्या व धान्य कोठारे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Test of Nerve for Pure Mountaineers",
        "titleMr": "खऱ्या गिर्यारोहकांच्या धैर्याची आणि कौशल्याची कसोटी",
        "quoteEn": "“Standing face to face with Vandarlingi pinnacle, you sense the raw, untamed Sahyadri power.”",
        "quoteMr": "“वानरलिंगी सुळक्यासमोर उभे राहताच सह्याद्रीच्या रौद्र आणि अथांग रूपाची प्रचिती येते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Jivdhan • The Mountain Sentinel",
        "titleMr": "जीवधन • नाणेघाटाचा अमर रक्षक",
        "subtitleEn": "Historic Bastion • Explore Pune",
        "subtitleMr": "साहसी दुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning the sheer vertical rock pillar of Vandarlingi against swirling clouds.",
      "twoPhotos": "Photo 1 captures distant fortress cliff (Acts 1-2); Photo 2 focuses on Vandarlingi pinnacle (Acts 3-5).",
      "threePhotos": "P1: Naneghat valley view; P2: Rock-cut carved stairs; P3: Vandarlingi needle.",
      "fourPhotos": "P1: Base trail; P2: Gateway; P3: Granaries; P4: Pinnacle top.",
      "fivePlusPhotos": "High-adrenaline mountaineering cut sequence."
    }
  },
  "joshi-miniature-railway": {
    "placeId": "joshi-miniature-railway",
    "slug": "joshi-miniature-railway",
    "placeName": "Joshi's Museum of Miniature Railways",
    "placeNameMr": "जोशींचे मिनिएचर रेल्वे संग्रहालय",
    "category": "museums",
    "templateTitle": "Joshi’s Miniature Railway — Marvel of Synchronized Precision",
    "templateTitleMr": "जोशींचे मिनिएचर रेल्वे • अचूक धावणाऱ्या छोट्या आगगाड्यांचे जग",
    "conceptTaglineEn": "The beloved mechanical wonder in Kothrud created by B.S. Joshi, staging fully computerized model trains, steam engines, and night skylines.",
    "conceptTaglineMr": "कोथरूडमधील विस्मयकारक मिनिएचर रेल्वे जिथे आगगाड्या, स्टीम इंजिन आणि रात्रीचे शहर संगणकीय अचूकतेने धावते.",
    "subtitle": "Kothrud • Pune 411038",
    "elevationOrEra": "Founded 1998",
    "visualMood": "Tiny illuminated steam engines, miniature alpine tunnels, switching rail tracks, and mesmerizing night-city glow.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0f172a",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(2,132,199,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Joshi Miniature Railway Pune Toy Train Reel / Kothrud",
        "youtubeQuery": "Joshis Museum of Miniature Railways Pune Complete Show",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Trains Run Like Clockwork in Miniature",
        "titleMr": "छोट्या आगगाड्यांचे अद्भूत आणि अचूक जग",
        "subtitleEn": "Joshi’s Museum of Miniature Railways, Kothrud",
        "subtitleMr": "जोशींचे मिनिएचर रेल्वे संग्रहालय, कोथरूड",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Created by Late B.S. Joshi in 1998",
        "titleMr": "स्व. भाऊ जोशी यांनी साकारलेला स्वप्नवत प्रकल्प",
        "subtitleEn": "HO Scale Model Layout with 65 Signals & 26 Points",
        "subtitleMr": "६५ सिग्नल्स, २६ ट्रॅक पॉइंट्स आणि अचूक वेळापत्रक",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Steam Engines, Mountain Tunnels & Ropeways",
        "titleMr": "वाफेचे इंजिन, बोगदे, रोप-वे आणि रात्रीचे शहर",
        "subtitleEn": "Computer-Controlled Lighting from Dawn to Starlight",
        "subtitleMr": "सकाळच्या प्रकाशापासून रात्रीच्या दिव्यांपर्यंतचे सुंदर सादरीकरण",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Sparking Wonder in Children of Every Age",
        "titleMr": "प्रत्येक वयोगटातील प्रेक्षकांना भुरळ घालणारा चमत्कार",
        "quoteEn": "“A tribute to meticulous engineering and childhood imagination that never fades.”",
        "quoteMr": "“अचूक अभियांत्रिकी आणि बालपणीच्या कल्पकतेला दिलेली सुंदर सलामी.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Joshi Railway • Timeless Mechanical Wonder",
        "titleMr": "जोशीज रेल्वे • कोथरूडची आगळीवेगळी ओळख",
        "subtitleEn": "Iconic Wonder • Explore Pune",
        "subtitleMr": "विस्मयकारक संग्रहालय • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Speed pan along miniature tracks tracking a tiny locomotive into a tunnel.",
      "twoPhotos": "Photo 1 captures the entire miniature layout panorama (Acts 1-2); Photo 2 focuses on night-illuminated train engine (Acts 3-5).",
      "threePhotos": "P1: Museum entrance; P2: Daytime miniature city; P3: Night illuminated train layout.",
      "fourPhotos": "P1: Board; P2: Full layout; P3: Steam engine close-up; P4: Night illumination.",
      "fivePlusPhotos": "Fast, playful model train cuts synced to rhythmic track beats."
    }
  },
  "karla-caves": {
    "placeId": "karla-caves",
    "slug": "karla-caves",
    "placeName": "Karla Caves (Ancient Rock-Cut Chaitya Hall)",
    "placeNameMr": "कार्ला लेणी (भारतातील सर्वात मोठे बौद्ध चैत्यगृह)",
    "category": "heritage",
    "templateTitle": "Karla Caves — Grandest Rock-Cut Chaitya Hall in India",
    "templateTitleMr": "कार्ला लेणी • भारतातील सर्वात मोठे प्राचीन बौद्ध चैत्यगृह",
    "conceptTaglineEn": "The monumental 2nd-century BC rock-cut Buddhist monastery near Lonavala, housing India’s largest and best-preserved Chaitya hall with original teakwood umbrella ribs.",
    "conceptTaglineMr": "लोणावळ्याजवळील इसवी सन पूर्व २ऱ्या शतकातील भारतातील सर्वात मोठे बौद्ध चैत्यगृह, जिथे २००० वर्षे जुने मूळ लाकडी छत आजही टिकून आहे.",
    "subtitle": "Karla, Maval • Pune 410405",
    "elevationOrEra": "2nd Century BC (Satavahana Era)",
    "visualMood": "Towering vaulted stone arches, 2,000-year-old curved teakwood beams, Ashokan lion pillar, and monumental sculpted elephants.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Karla Caves Lonavala Ancient Chaitya Hall 4K Reel",
        "youtubeQuery": "Karla Buddhist Caves Largest Chaitya Hall in India Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "India’s Grandest Rock-Cut Buddhist Chaitya Hall",
        "titleMr": "भारतातील सर्वात मोठे पाषाणात कोरलेले बौद्ध चैत्यगृह",
        "subtitleEn": "Karla Caves, Maval, Lonavala (2nd Century BC)",
        "subtitleMr": "कार्ला लेणी, मावळ, लोणावळा (इसवी सन पूर्व २रे शतक)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Carved Over 2,200 Years Ago Along the Ancient Trade Route",
        "titleMr": "२,२०० वर्षांपूर्वी प्राचीन व्यापारी मार्गावर कोरलेली अद्भूत लेणी",
        "subtitleEn": "Ashoka Lion Pillar & Monumental Sculpted Elephant Facade",
        "subtitleMr": "सिंहस्तंभ आणि प्रवेशद्वारावरील भव्य दगडी हत्तींची शिल्पे",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "37 Octagonal Pillars Adorned with Kneeling Elephants & Riders",
        "titleMr": "३७ अष्टकोनी खांब आणि त्यावर कोरलेली हत्ती-स्वारांची सुरेख शिल्पे",
        "subtitleEn": "Intact 2,000-Year-Old Teakwood Ribbed Barrel Vault Ceiling",
        "subtitleMr": "दोन हजार वर्षे टिकून राहिलेले मूळ सागवानी लाकडाचे छत",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Monolithic Cathedral of Ancient Silence and Light",
        "titleMr": "पाषाणातील भव्य मंदिर जिथे प्रकाश आणि शांततेचा संगम होतो",
        "quoteEn": "“Standing beneath Karla’s soaring wooden ribs, you touch the monumental genius of ancient India.”",
        "quoteMr": "“कार्ल्याच्या भव्य चैत्यगृहात उभे राहताच प्राचीन भारताच्या अद्भूत प्रतिभेचे दर्शन घडते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Karla • The Great Chaitya",
        "titleMr": "कार्ला • पाषाणातील जागतिक महाशिल्प",
        "subtitleEn": "National Rock-Cut Heritage • Explore Pune",
        "subtitleMr": "प्राचीन बौद्ध वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the central stupa following the curved 2,000-year-old teakwood ribbed vault ceiling.",
      "twoPhotos": "Photo 1 captures grand entrance facade with Ashoka pillar (Acts 1-2); Photo 2 shows grand pillared Chaitya hall (Acts 3-5).",
      "threePhotos": "P1: Monumental cave facade; P2: 37 octagonal pillars aisle; P3: Central stupa with wooden umbrella.",
      "fourPhotos": "P1: Steps; P2: Facade; P3: Pillars; P4: Stupa.",
      "fivePlusPhotos": "Majestic, cavernous stone architectural progression with echoing acoustic reverbs."
    }
  },
  "kasba-ganpati": {
    "placeId": "kasba-ganpati",
    "slug": "kasba-ganpati",
    "placeName": "Kasba Ganpati Mandir (Gramdaivat of Pune)",
    "placeNameMr": "कसबा गणपती मंदिर (पुण्याचे ग्रामदैवत)",
    "category": "temples",
    "templateTitle": "Kasba Ganpati — Gramdaivat of Historic Pune",
    "templateTitleMr": "कसबा गणपती • जिजाऊंनी स्थापलेले पुण्याचे ग्रामदैवत",
    "conceptTaglineEn": "The presiding Gramdaivat of Pune established by Rajmata Jijabai in 1630, leading all Ganesh immersion processions as Manacha Pahila Ganpati.",
    "conceptTaglineMr": "१६३० मध्ये राजमाता जिजाऊंनी स्थापन केलेले पुण्याचे ग्रामदैवत, ज्यांना विसर्जन मिरवणुकीत मानाचा पहिला मान आहे.",
    "subtitle": "Kasba Peth • Pune 411011",
    "elevationOrEra": "Consecrated 1630 AD",
    "visualMood": "Deep saffron vermilion idol, ancient brass bell arches, traditional Peshwa wooden sabha mandap, and sacred historic serenity.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#9a3412",
      "accent": "#fed7aa",
      "overlayGradient": "linear-gradient(180deg, rgba(154,52,18,0.2) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Kasba Ganpati Manacha Pahila Ganpati Pune Reel",
        "youtubeQuery": "Kasba Ganpati Gramdaivat Pune History Jijabai 1630",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Manacha Pahila Ganpati — First Deity of Pune",
        "titleMr": "पुण्याचा मानाचा पहिला गणपती — कसबा गणपती",
        "subtitleEn": "Consecrated in 1630 by Rajmata Jijabai",
        "subtitleMr": "१६३० मध्ये राजमाता राष्ट्रमाता जिजाऊंची स्थापना",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Presiding Gramdaivat of the City",
        "titleMr": "पुणे शहराचे मूळ आणि सर्वोच्च ग्रामदैवत",
        "subtitleEn": "Found by Vinayak Bhat Thakar Near Shivaji’s Youth Grounds",
        "subtitleMr": "जिथून शिवरायांनी पुण्याच्या पुनर्निर्माणाची सुरुवात केली",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Intricately Carved Teakwood Sabha Mandap & Silver Throne",
        "titleMr": "कोरीव लाकडी सभामंडप आणि चांदीचे नक्षीदार सिंहासन",
        "subtitleEn": "Leading Every Visarjan Procession for Over a Century",
        "subtitleMr": "शतकानुशतके मानाच्या पहिल्या क्रमांकावरून मिरवणुकीचे नेतृत्व",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Guardian of Pune’s Sovereignty and Blessings",
        "titleMr": "पुण्याच्या सांस्कृतिक अस्मितेचा आणि वैभवाचा संरक्षक",
        "quoteEn": "“Here begins every auspicious journey and celebration in the city of Pune.”",
        "quoteMr": "“पुण्यातील प्रत्येक शुभकार्याची सुरुवात ग्रामदैवताच्या चरणी लीन होऊन होते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Kasba Ganpati • Gramdaivat of Pune",
        "titleMr": "कसबा गणपती • पुण्याचे पहिले वंदनीय आराध्य",
        "subtitleEn": "Historic Gramdaivat • Explore Pune",
        "subtitleMr": "मानाचा पहिला गणपती • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward tilt from brass oil lamps to the silver chhatri of Kasba Ganpati.",
      "twoPhotos": "Photo 1 showcases historic wooden sabha mandap (Acts 1-2); Photo 2 focuses on vermilion idol (Acts 3-5).",
      "threePhotos": "P1: Temple arched entrance; P2: Carved wooden mandap; P3: Sanctum idol darshan.",
      "fourPhotos": "P1: Temple exterior; P2: Peth street; P3: Sabha mandap; P4: Idol silver throne.",
      "fivePlusPhotos": "Regal, reverent devotional progression with traditional pakhawaj rhythms."
    }
  },
  "katakirr-misal-karve-nagar": {
    "placeId": "katakirr-misal-karve-nagar",
    "slug": "katakirr-misal-karve-nagar",
    "placeName": "Katakirr Misal (Karve Nagar / Deccan)",
    "placeNameMr": "काटाकिर्र मिसळ (कर्वे नगर / डेक्कन)",
    "category": "food",
    "templateTitle": "Katakirr Misal — Fiery Tari & Kolhapuri Spice Surge",
    "templateTitleMr": "काटाकिर्र मिसळ • झणझणीत लाल तर्री व अस्सल पुणेरी चव",
    "conceptTaglineEn": "The ultimate Puneri spice challenge with scorching red tari and crunchy farsan.",
    "conceptTaglineMr": "अंगात ऊर्जा आणणारी ठसकेबाज लाल तर्री आणि कुरकुरीत फरसाणची अस्सल पुणेरी मिसळ.",
    "subtitle": "Karve Nagar / Deccan • Pune",
    "elevationOrEra": "Since 2008",
    "visualMood": "Deep crimson chili oil bubbles, golden crisp farsan, raw onions, and fiery spice energy.",
    "palette": {
      "primary": "#dc2626",
      "secondary": "#7f1d1d",
      "accent": "#f59e0b",
      "overlayGradient": "linear-gradient(180deg, rgba(127,29,29,0.25) 0%, rgba(20,5,5,0.9) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.3) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.4
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Katakirr Misal Pune Spicy Food Reel / Misal Pav Lover",
        "youtubeQuery": "Katakirr Misal Pune Fiery Tari Beat",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Not for the Faint of Heart",
        "titleMr": "अस्सल पुणेरी ठसका — काटाकिर्र!",
        "subtitleEn": "The Fiercest Misal in Pune",
        "subtitleMr": "पुण्यातील सर्वात झणझणीत मिसळ",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Bubbling Crimson Tari & Golden Farsan",
        "titleMr": "उकळती लाल तर्री आणि कुरकुरीत फरसाण",
        "subtitleEn": "Three Spice Levels: Teekha, Medium, Light",
        "subtitleMr": "अस्सल कोल्हापुरी तिखटाचा ठसकेबाज रस्सा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Piping Hot Pav, Squeezed Lemon & Curd",
        "titleMr": "गरमागरम मऊ पाव, लिंबाचा रस व थंड ताक",
        "subtitleEn": "Tears of Joy and Fiery Satisfaction",
        "subtitleMr": "जिभेवर रेंगाळणारी अविस्मरणीय चव",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Morning Ritual of Pune Foodies",
        "titleMr": "पुणेकरांच्या सकाळचा अविभाज्य झणझणीत कट्टा",
        "quoteEn": "“One spoonful of fiery tari that awakens every sensory nerve.”",
        "quoteMr": "“पहिल्या घासातच अंगावर रोमांच उभे करणारी अस्सल पुणेरी चव.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Katakirr • Pune’s Spice Benchmark",
        "titleMr": "काटाकिर्र • झणझणीत पुणेरी अभिमान",
        "subtitleEn": "Authentic Misal Legend • Explore Pune",
        "subtitleMr": "अस्सल पुणेरी खाद्यसंस्कृती • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Vigorous slow zoom plunge into the crimson tari oil swirl, pulling out to bowl frame.",
      "twoPhotos": "Photo 1 highlights tari pour (Acts 1-2); Photo 2 shows full table feast with pav and curd (Acts 3-5).",
      "threePhotos": "P1: Storefront crowd; P2: Bubbling tari bowl macro; P3: Complete misal platter.",
      "fourPhotos": "P1: Name board; P2: Spices display; P3: Serving shot; P4: Satisfied empty bowl.",
      "fivePlusPhotos": "High-octane cut-per-beat food action montage."
    }
  },
  "katraj-jain-temple-agam-mandir": {
    "placeId": "katraj-jain-temple-agam-mandir",
    "slug": "katraj-jain-temple-agam-mandir",
    "placeName": "Shree Katraj Tirth (Agam Mandir)",
    "placeNameMr": "श्री कात्रज जैन तीर्थ व आगम मंदिर (कात्रज, पुणे)",
    "category": "temples",
    "templateTitle": "Katraj Jain Temple — Marble Peace of Agam Mandir Tirth",
    "templateTitleMr": "कात्रज आगम मंदिर • संगमरवरी जैन तीर्थ व आगम शास्त्र दालन",
    "conceptTaglineEn": "The serene Jain pilgrimage atop Katraj Hill, renowned for its white marble Mahavira idol and pure copper inscribed Agam scripture halls.",
    "conceptTaglineMr": "कात्रज टेकडीवरील शांत जैन तीर्थ, जिथे संगमरवरी भगवान महावीरांची मूर्ती आणि तांब्याच्या पत्र्यांवर कोरलेले आगम शास्त्र दालन आहे.",
    "subtitle": "Katraj Ghat Ridge • Pune 411046",
    "elevationOrEra": "Jain Agam Tirth",
    "visualMood": "Luminous white Makrana marble, etched sacred copper plaques, panoramic hill views, and profound meditative silence.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#1e293b",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(217,119,6,0.18) 0%, rgba(15,20,30,0.92) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.15) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.12,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.1
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Katraj Jain Temple Agam Mandir Pune Peaceful Reel",
        "youtubeQuery": "Katraj Jain Tirth Agam Mandir Pune White Marble Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Peace Above the City on Katraj Ridge",
        "titleMr": "कात्रजच्या टेकडीवरील शांत संगमरवरी तीर्थ",
        "subtitleEn": "Shree Katraj Tirth (Agam Mandir), Katraj",
        "subtitleMr": "श्री कात्रज जैन तीर्थ व आगम मंदिर, कात्रज",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Dedicated to Lord Mahavira & Ancient Jain Agam Scriptures",
        "titleMr": "भगवान महावीर आणि प्राचीन आगम शास्त्राला समर्पित तीर्थ",
        "subtitleEn": "Sacred Inscriptions Preserved on Pure Copper Plates",
        "subtitleMr": "तांब्याच्या पत्र्यांवर कोरलेले हजारो पवित्र आगम श्लोक",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pure White Makrana Marble & Panoramic Mountain Breezes",
        "titleMr": "शुभ्र संगमरवरी कोरीव काम आणि डोंगरमाथ्यावरील गार वारा",
        "subtitleEn": "Tranquil Meditative Spaces Overlooking Katraj Lake",
        "subtitleMr": "कात्रज तलाव व शहराचे विहंगम दृश्य देणारी शांत जागा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Non-Violence and Silence Awaken the Soul",
        "titleMr": "अहिंसा आणि संपूर्ण शांततेचा अंतर्मनाला स्पर्श करणारा अनुभव",
        "quoteEn": "“In the pristine marble silence of Agam Mandir, every worldly distraction ceases.”",
        "quoteMr": "“शुभ्र संगमरवराच्या शांततेत मनाला खरीखुरी अहिंसा आणि आत्मशांती लाभते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Katraj Tirth • Sanctuary of Ahimsa",
        "titleMr": "कात्रज तीर्थ • अहिंसेचे पावन मंदिर",
        "subtitleEn": "Jain Heritage Sanctuary • Explore Pune",
        "subtitleMr": "पवित्र तीर्थ वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward glide across white marble courtyard toward the gleaming temple shikhar.",
      "twoPhotos": "Photo 1 captures white marble temple exterior with hill vista (Acts 1-2); Photo 2 shows Lord Mahavira idol or Agam plates (Acts 3-5).",
      "threePhotos": "P1: Temple hill approach; P2: White marble facade; P3: Lord Mahavira sanctum.",
      "fourPhotos": "P1: Hill gate; P2: Courtyard; P3: Marble carvings; P4: Deity.",
      "fivePlusPhotos": "Pure, meditative white marble progression with calming flute sounds."
    }
  },
  "kayani-bakery-camp": {
    "placeId": "kayani-bakery-camp",
    "slug": "kayani-bakery-camp",
    "placeName": "Kayani Bakery (East Street, Pune Camp)",
    "placeNameMr": "कयानी बेकरी (ईस्ट स्ट्रीट, पुणे कॅम्प)",
    "category": "food",
    "templateTitle": "Kayani Bakery — Golden Mawa Cakes of East Street",
    "templateTitleMr": "कयानी बेकरी • ईस्ट स्ट्रीटवरील १९५५ चे सुवर्ण मावा केक",
    "conceptTaglineEn": "The iconic Parsi bakery whose warm cardamom aroma has drawn queues to Pune Camp since 1955.",
    "conceptTaglineMr": "पुणे कॅम्पमधील प्रसिद्ध पारसी बेकरी जिथल्या वेलचीयुक्त मावा केकला १९५५ पासून अखंड रांगा लागतात.",
    "subtitle": "East Street, Camp • Pune 411001",
    "elevationOrEra": "Established 1955",
    "visualMood": "Warm golden butter crusts, dusted flour, vintage glass showcases, and nostalgic cantonment architecture.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fde68a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.18) 0%, rgba(25,12,5,0.88) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.18) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Kayani Bakery Pune Mawa Cake Reel / Pune Camp Food",
        "youtubeQuery": "Kayani Bakery East Street Pune Iconic Food Story",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Legendary Aroma of East Street",
        "titleMr": "ईस्ट स्ट्रीटवर दरवळणारा मावा केकचा सुगंध",
        "subtitleEn": "Pune Camp’s Most Celebrated Bakery",
        "subtitleMr": "पुणे कॅम्पची सर्वात प्रसिद्ध बेकरी",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Baked Fresh Twice Daily Since 1955",
        "titleMr": "१९५५ पासून दिवसातून दोनदा ताज्या भट्टीतून बाहेर",
        "subtitleEn": "Founded by the Kayani Brothers",
        "subtitleMr": "कयानी बंधूंची अस्सल पारसी बेकिंग परंपरा",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Cardamom Infusion & Golden Sponge Texture",
        "titleMr": "वेलचीचा हलका गंध आणि मऊ लोणीदार सुवर्ण स्पंज",
        "subtitleEn": "Shrewsbury Biscuits & Brazil Nut Crunch",
        "subtitleMr": "शूज्युबरी बिस्किटे आणि ब्राझिल नट कुकीज",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Must-Have Souvenir of Every Pune Visit",
        "titleMr": "पुण्याला आलेल्या प्रत्येकाची पहिली आठवण",
        "quoteEn": "“One bite of warm mawa cake dissolves seven decades of Pune history.”",
        "quoteMr": "“मावा केकच्या एका मऊ तुकड्यात विरघळतो सात दशकांचा गोड इतिहास.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Kayani Bakery • Timeless Sweet Tradition",
        "titleMr": "कयानी बेकरी • कॅम्पचा सुवर्ण गोडवा",
        "subtitleEn": "Cantonment Heritage • Explore Pune",
        "subtitleMr": "कॅम्प वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Centred slow zoom into the iconic blue and yellow box opening up to golden sliced cake.",
      "twoPhotos": "Photo 1 showcases historic bakery storefront (Acts 1-2); Photo 2 shows close-up of cake slice texture (Acts 3-5).",
      "threePhotos": "P1: East street exterior; P2: Classic bakery counter; P3: Fresh mawa cake box.",
      "fourPhotos": "P1: Signboard; P2: Waiting queue; P3: Cake slice; P4: Shrewsbury biscuit box.",
      "fivePlusPhotos": "Gentle nostalgic montage with buttery warm tones."
    }
  },
  "kesari-wada": {
    "placeId": "kesari-wada",
    "slug": "kesari-wada",
    "placeName": "Kesari Wada (Tilak Smarak)",
    "placeNameMr": "केसरी वाडा (टिळक स्मारक)",
    "category": "heritage",
    "templateTitle": "Kesari Wada — Tilak’s Lion Roar of Indian Independence",
    "templateTitleMr": "केसरी वाडा • लोकमान्य टिळकांचे सिंहगर्जना केंद्र व केसरी प्रेस",
    "conceptTaglineEn": "The historic headquarters of Lokmanya Bal Gangadhar Tilak in Narayan Peth, where the Kesari newspaper was printed and the public Ganeshotsav was born.",
    "conceptTaglineMr": "नारायण पेठेतील लोकमान्य बाळ गंगाधर टिळकांचे निवासस्थान, जिथून केसरी वृत्तपत्राची सिंहगर्जना आणि सार्वजनिक गणेशोत्सवाची सुरुवात झाली.",
    "subtitle": "Narayan Peth • Pune 411030",
    "elevationOrEra": "Acquired by Tilak 1905",
    "visualMood": "Grand carved wooden gateway, historic printing press machinery, bronze lion emblem, and historic Marathi journalism archives.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.12) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Kesari Wada Pune Lokmanya Tilak Ganeshotsav History Reel",
        "youtubeQuery": "Kesari Wada Narayan Peth Pune Lokmanya Tilak Museum Walkthrough",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "“Swaraj is My Birthright” — Born in Kesari Wada",
        "titleMr": "“स्वराज्य हा माझा जन्मसिद्ध हक्क आहे!” — केसरी वाड्याची गर्जना",
        "subtitleEn": "Historic Residence of Lokmanya Tilak, Narayan Peth",
        "subtitleMr": "लोकमान्य बाळ गंगाधर टिळकांचे ऐतिहासिक केंद्र",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Originally Gaikwad Wada Built by the Maharaja of Baroda",
        "titleMr": "बडोद्याच्या सयाजीराव गायकवाडांनी उभारलेला मूळ वाडा",
        "subtitleEn": "Purchased by Tilak in 1905 as Freedom Movement Headquarters",
        "subtitleMr": "१९०५ मध्ये टिळकांनी घेतलेले स्वातंत्र्यलढ्याचे मुख्य कार्यालय",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Original Hand-Operated Printing Press & Tilak’s Study",
        "titleMr": "केसरीची मूळ ऐतिहासिक छपाई यंत्रे आणि टिळकांची अभ्यासिका",
        "subtitleEn": "First Public Ganeshotsav Celebration Courtyard",
        "subtitleMr": "सार्वजनिक गणेशोत्सवाची मुहूर्तमेढ रोवणारा पवित्र चौक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Flame of Mass Awakening That Shook the British Empire",
        "titleMr": "ब्रिटिश साम्राज्याला हादरवून सोडणारी लोकजागृतीची अखंड मशाल",
        "quoteEn": "“From these wooden balconies, Tilak awakened a sleeping nation to claim its freedom.”",
        "quoteMr": "“या वाड्याच्या बाल्कनीतून लोकमान्यांनी अवघ्या देशाला स्वातंत्र्यासाठी जागे केले.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Kesari Wada • The Lion’s Roar",
        "titleMr": "केसरी वाडा • स्वातंत्र्याचा सिंहनाद",
        "subtitleEn": "Freedom Struggle Heritage • Explore Pune",
        "subtitleMr": "स्वातंत्र्य वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the carved wooden gateway doors to the bronze lion emblem of Kesari.",
      "twoPhotos": "Photo 1 captures historic wada courtyard and gate (Acts 1-2); Photo 2 focuses on Tilak study room or original press (Acts 3-5).",
      "threePhotos": "P1: Kesari Wada entrance; P2: Central Ganeshotsav courtyard; P3: Tilak museum and press.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Printing press; P4: Tilak statue.",
      "fivePlusPhotos": "Heroic, patriotic documentary progression with deep cultural pride."
    }
  },
  "khadakwasla-dam": {
    "placeId": "khadakwasla-dam",
    "slug": "khadakwasla-dam",
    "placeName": "Khadakwasla Dam & Lake",
    "placeNameMr": "खडकवासला धरण आणि तलाव",
    "category": "nature",
    "templateTitle": "Khadakwasla Dam — Sunset Ripples & Sinhagad Horizon",
    "templateTitleMr": "खडकवासला धरण • संथ लाटा, गार वारा आणि भाजलेले कणीस",
    "conceptTaglineEn": "The historic lifeline reservoir of Pune, providing water since 1879, where city dwellers gather for cool evening breezes, corn, and Sinhagad views.",
    "conceptTaglineMr": "१८७९ पासून पुणे शहराची जीवनवाहिनी असलेला विस्तीर्ण जलाशय, जिथे संध्याकाळचा गार वारा आणि गरमागरम कणसाचा आनंद मिळतो.",
    "subtitle": "Sinhagad Road • Pune 411024",
    "elevationOrEra": "Built 1879",
    "visualMood": "Sunlight glistening on reservoir ripples, silhouette of Sinhagad on the horizon, sizzling roadside corn stalls, and golden hour calm.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,35,55,0.9) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Khadakwasla Dam Pune Sunset Reel / Bhutta Corn Chai",
        "youtubeQuery": "Khadakwasla Dam Sunset 4K Drone View Sinhagad Foothills",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Lifeline Reservoir of Pune Since 1879",
        "titleMr": "१८७९ पासून अवघ्या पुण्याची जीवनवाहिनी — खडकवासला",
        "subtitleEn": "Khadakwasla Dam & Mutha River Basin",
        "subtitleMr": "खडकवासला धरण व मुठा नदी जलाशय",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Sprawling Waters Cradled by Sinhagad Foothills",
        "titleMr": "सिंहगडाच्या पायथ्याशी पसरलेला विस्तीर्ण जलाशय",
        "subtitleEn": "Built by British Chief Engineer Col. Fife",
        "subtitleMr": "कर्नल फाईफ यांच्या देखरेखीखाली बांधलेले ऐतिहासिक धरण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Cool Evening Ripples, Fresh Roasted Bhutta & Hot Chai",
        "titleMr": "संथ लाटांचा मंद आवाज, भाजलेले कणीस आणि गरमागरम चहा",
        "subtitleEn": "Friends & Families Unwinding by the Water’s Edge",
        "subtitleMr": "पाण्याकाठच्या कट्ट्यांवर रंगणाऱ्या निवांत संध्याकाळच्या गप्पा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Golden Hour Melting Over the Sahyadri Ridges",
        "titleMr": "सह्याद्रीच्या डोंगररांगांवर विरघळणारा सोनेरी सूर्यास्त",
        "quoteEn": "“Cool evening breezes reflecting southern Sahyadri ridge lines in amber gold.”",
        "quoteMr": "“खडकवासल्याच्या संथ लाटा आणि सह्याद्रीच्या टेकड्यांचे सुंदर प्रतिबिंब.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Khadakwasla • The City’s Sunset Heart",
        "titleMr": "खडकवासला • प्रत्येक पुणेकराची आवडती सायंकाळ",
        "subtitleEn": "Beloved Lakeside • Explore Pune",
        "subtitleMr": "निसर्गरम्य जलाशय • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal drift across the reservoir water surface reflecting the evening orange sky.",
      "twoPhotos": "Photo 1 captures broad water expanse with Sinhagad hill in distance (Acts 1-2); Photo 2 shows close-up water ripples at sunset (Acts 3-5).",
      "threePhotos": "P1: Dam water shoreline; P2: Corn and tea promenade; P3: Sunset over lake hills.",
      "fourPhotos": "P1: Reservoir; P2: Hills; P3: Water edge; P4: Sunset gold.",
      "fivePlusPhotos": "Warm, peaceful golden hour lakeside montage."
    }
  },
  "khunya-murlidhar-temple": {
    "placeId": "khunya-murlidhar-temple",
    "slug": "khunya-murlidhar-temple",
    "placeName": "Khunya Murlidhar Temple (Historic Krishna Shrine)",
    "placeNameMr": "खुन्या मुरलीधर मंदिर (पेशवेकालीन ऐतिहासिक मंदिर, सदाशिव पेठ)",
    "category": "temples",
    "templateTitle": "Khunya Murlidhar — White Marble Krishna of Sadashiv Peth",
    "templateTitleMr": "खुन्या मुरलीधर मंदिर • संगमरवरी राधाकृष्ण व ऐतिहासिक इतिहास",
    "conceptTaglineEn": "The historic 1797 temple consecrated by Dada Gadre, named after the tragic battle fought outside its gates to protect the pure white marble Krishna idol.",
    "conceptTaglineMr": "१७९७ मध्ये दादा गद्रे यांनी संगमरवरी राधाकृष्णाची प्राणप्रतिष्ठा करताना झालेल्या ऐतिहासिक संघर्षाची साक्ष देणारे मंदिर.",
    "subtitle": "Sadashiv Peth • Pune 411030",
    "elevationOrEra": "Built 1797 AD (Dada Gadre)",
    "visualMood": "Pure white Makrana marble idols, traditional Peshwa courtyard, evening oil lamps, and profound spiritual stillness.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,20,35,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.18) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Khunya Murlidhar Temple Sadashiv Peth Pune Heritage Reel",
        "youtubeQuery": "Khunya Murlidhar Temple History Pune Dada Gadre 1797",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Divine Idol Protected at the Cost of Blood",
        "titleMr": "रक्ताचे बलिदान देऊन रक्षण केलेली अलौकिक मूर्ती",
        "subtitleEn": "Khunya Murlidhar Mandir, Sadashiv Peth (1797)",
        "subtitleMr": "खुन्या मुरलीधर मंदिर, सदाशिव पेठ (१७९७)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commissioned by Royal Merchant Sadashiv Narayan Dada Gadre",
        "titleMr": "पेशव्यांचे सावकार सदाशिव नारायण उर्फ दादा गद्रे यांची निर्मिती",
        "subtitleEn": "Sculpted in Pure Makrana Marble by Artist Bakhatram of Jaipur",
        "subtitleMr": "जयपूरच्या बखतराम कलाकाराने मकराना संगमरवरात घडवलेली मूर्ती",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Gleaming Marble Radha-Krishna Playing the Divine Flute",
        "titleMr": "मंजुळ बासरी वाजवणारे तेजस्वी संगमरवरी राधाकृष्ण",
        "subtitleEn": "Peshwa Courtyard, Teak Arches & Janmashtami Festivities",
        "subtitleMr": "पेशवेकालीन लाकडी कमानी आणि भव्य गोकुळाष्टमी उत्सव",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Past Sacrifices Transmute into Divine Peace",
        "titleMr": "संघर्षातून जन्माला आलेली चिरंतन शांतता आणि भक्ती",
        "quoteEn": "“Before the calm gaze of Murlidhar, the turbulence of history dissolves into pure devotion.”",
        "quoteMr": "“मुरलीधराच्या शांत दर्शनाने इतिहासातील सर्व संघर्ष विरघळून भक्तीचा वर्षाव होतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Khunya Murlidhar • Melody of Grace",
        "titleMr": "खुन्या मुरलीधर • भक्ती आणि कलेचा संगम",
        "subtitleEn": "Historic Krishna Sanctuary • Explore Pune",
        "subtitleMr": "ऐतिहासिक मंदिर • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the brass oil lamps to the serene white marble face of Lord Krishna.",
      "twoPhotos": "Photo 1 captures historic temple courtyard entrance (Acts 1-2); Photo 2 focuses on marble Krishna-Radha idol (Acts 3-5).",
      "threePhotos": "P1: Courtyard facade; P2: Carved wooden mandap; P3: Marble Krishna-Radha darshan.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Serene, peaceful Krishna flute progression with soft lighting."
    }
  },
  "korigad-fort": {
    "placeId": "korigad-fort",
    "slug": "korigad-fort",
    "placeName": "Korigad Fort",
    "placeNameMr": "कोरीगड किल्ला",
    "category": "forts",
    "templateTitle": "Korigad Fort — Plateau Bastion of Amby Valley",
    "templateTitleMr": "कोरीगड • विस्तीर्ण पठार, दोन अखंड तलाव व तटबंदीचा दुर्ग",
    "conceptTaglineEn": "The majestic hill fort near Lonavala featuring a pristine 2-km uninterrupted circular wall, two perennial freshwater lakes, and grand plateau views.",
    "conceptTaglineMr": "लोणावळ्याजवळील विस्तीर्ण पठाराचा किल्ला, जिथे २ किमी अखंड तटबंदी आणि पठारावर बारमाही दोन गोड पाण्याचे तलाव आहेत.",
    "subtitle": "Aamby Valley, Lonavala • Pune 410401",
    "elevationOrEra": "Elevation 923 m",
    "visualMood": "Wide flat grasslands, reflective mountain ponds, intact walkable stone ramparts, and rolling monsoon mist.",
    "palette": {
      "primary": "#059669",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,30,18,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Korigad Fort Trek Reel / Lonavala Aamby Valley Lake",
        "youtubeQuery": "Korigad Fort Lonavala 4K Drone Walkable Ramparts",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Two Kilometres of Intact Walkable Ramparts",
        "titleMr": "दोन किलोमीटर लांबीची अखंड चालण्याजोगी तटबंदी",
        "subtitleEn": "Korigad Fort • Elevation 923 m",
        "subtitleMr": "कोरीगड किल्ला • लोणावळा-अॅम्बी व्हॅली",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Incorporated into Swarajya by Shivaji Maharaj in 1657",
        "titleMr": "१६५७ मध्ये शिवरायांनी स्वराज्यात समाविष्ट केलेला किल्ला",
        "subtitleEn": "A Rare Sprawling High-Altitude Tableland",
        "subtitleMr": "सह्याद्रीच्या कुशीतील विस्तीर्ण सपाट पठार",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Two Fresh Lakes, Koraidevi Temple & Intact Cannons",
        "titleMr": "दोन बारमाही तलाव, कोराईदेवीचे मंदिर आणि ऐतिहासिक तोफा",
        "subtitleEn": "Gentle Stone Steps Making it Ideal for All Trekkers",
        "subtitleMr": "सुंदर दगडी पायऱ्या आणि शांत हिरवेगार वातावरण",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Walking the Continuous Edge of the Sky",
        "titleMr": "आकाशाला भिडणाऱ्या कड्यांवरून मनसोक्त फिरण्याचा आनंद",
        "quoteEn": "“Here, you can walk uninterrupted around an entire mountaintop wrapped in ancient stone.”",
        "quoteMr": "“अखंड तटबंदीवरून चालत संपूर्ण डोंगराची प्रदक्षिणा घालण्याचा अद्वितीय अनुभव.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Korigad • The Plateau Fortress",
        "titleMr": "कोरीगड • निसर्ग आणि तटबंदीचा सुंदर मेळ",
        "subtitleEn": "Pristine Fort • Explore Pune",
        "subtitleMr": "निसर्गरम्य दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth continuous pan along the perimeter rampart with the lake reflecting sky in the centre.",
      "twoPhotos": "Photo 1 captures lake with stone temple (Acts 1-2); Photo 2 follows perimeter wall line (Acts 3-5).",
      "threePhotos": "P1: Gateway stairs; P2: High altitude lake; P3: Perimeter wall walk.",
      "fourPhotos": "P1: Trail; P2: Steps; P3: Lake; P4: Bastions.",
      "fivePlusPhotos": "Breezy green plateau montage with tranquil piano harmonics."
    }
  },
  "kune-falls-viewpoint": {
    "placeId": "kune-falls-viewpoint",
    "slug": "kune-falls-viewpoint",
    "placeName": "Kune Waterfalls Viewpoint (Lonavala-Khandala)",
    "placeNameMr": "कुणे धबधबा व्ह्यूपॉइंट (लोणावळा-खंडाळा दरी)",
    "category": "nature",
    "templateTitle": "Kune Waterfalls — Three-Tiered Cascades of Khandala Valley",
    "templateTitleMr": "कुणे धबधबा • २०० मीटर उंचीवरून कोसळणारा लोणावळ्यातील तिहेरी जलप्रपात",
    "conceptTaglineEn": "The 14th highest waterfall in India (200 m drop), cascading down three breathtaking tiers against the lush backdrop of Khandala Ghat.",
    "conceptTaglineMr": "भारतातील १४ व्या क्रमांकाचा सर्वोच्च धबधबा (२०० मीटर), जो खंडाळा दरीत तीन टप्प्यांत फेसाळत कोसळतो.",
    "subtitle": "Old Mumbai-Pune Highway, Khandala • Pune 410401",
    "elevationOrEra": "200-Metre Drop",
    "visualMood": "Roaring white water curtains against dark basalt rock faces, emerald moss, rainbow mists, and majestic Khandala cliffs.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.2) 0%, rgba(10,25,45,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.24) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Kune Waterfalls Khandala Pune 4K Monsoon Reel",
        "youtubeQuery": "Kune Falls Lonavala 14th Highest Waterfall India Drone",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "200 Metres — 14th Highest Waterfall in India",
        "titleMr": "भारतातील १४ व्या क्रमांकाचा सर्वोच्च जलप्रपात — २०० मीटर",
        "subtitleEn": "Kune Waterfalls, Khandala Valley",
        "subtitleMr": "कुणे धबधबा, खंडाळा दरी",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "A Magnificent Three-Tiered Cascading Wonder",
        "titleMr": "तीन विलोभनीय टप्प्यांत काळ्या पाषाणावरून कोसळणाऱ्या धारा",
        "subtitleEn": "Framed by the Historic Sahyadri Ghat Escarpment",
        "subtitleMr": "सह्याद्रीच्या कड्यांवरून फेसाळत वाहणारे निसर्गसौंदर्य",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Thundering Roar Echoing Across Khandala Hills",
        "titleMr": "दरीभर घुमणारा पाण्याचा प्रचंड नाद आणि पाण्याचे तुषार",
        "subtitleEn": "Pristine Greenery, Natural Rainbows & Cool Monsoon Spray",
        "subtitleMr": "दाट हिरवळ, तुषारांवर उमटणारे इंद्रधनुष्य आणि गार वारे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Nature’s Raw Power Unleashed in Pure White Water",
        "titleMr": "निसर्गाची अद्भूत ताकद आणि फेसाळणाऱ्या पांढऱ्या धारांचे वैभव",
        "quoteEn": "“Standing before Kune Falls, one realizes how grand and alive the Sahyadris truly are.”",
        "quoteMr": "“कुणे धबधब्यासमोर उभे राहताच सह्याद्रीच्या जिवंत आणि भव्य रूपाची प्रचिती येते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Kune Falls • The Giant of Khandala",
        "titleMr": "कुणे धबधबा • सह्याद्रीचा भव्य जलप्रपात",
        "subtitleEn": "Natural Spectacle • Explore Pune",
        "subtitleMr": "जलप्रपात वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth vertical tilt tracking the full 200m drop from top cliff down to the bottom pool.",
      "twoPhotos": "Photo 1 captures the three-tiered waterfall profile in full (Acts 1-2); Photo 2 zooms into cascading middle tier (Acts 3-5).",
      "threePhotos": "P1: Distant waterfall and valley; P2: Mid-tier water spray; P3: Bottom basin.",
      "fourPhotos": "P1: Viewpoint; P2: Upper drop; P3: Middle fall; P4: Lower mist.",
      "fivePlusPhotos": "Majestic vertical waterfall power montage with ambient water roar."
    }
  },
  "lal-mahal": {
    "placeId": "lal-mahal",
    "slug": "lal-mahal",
    "placeName": "Lal Mahal (Red Palace)",
    "placeNameMr": "लाल महाल",
    "category": "heritage",
    "templateTitle": "Lal Mahal — Red Citadel of Shivaji Maharaj’s Youth",
    "templateTitleMr": "लाल महाल • छत्रपती शिवरायांच्या बालपणाची पावन भूमी",
    "conceptTaglineEn": "The historic red palace reconstructed where young Shivaji lived with Rajmata Jijabai from 1630, famous for the legendary defeat of Mughal general Shaista Khan in 1663.",
    "conceptTaglineMr": "१६३० मध्ये शहाजीराजांनी जिजाऊ व बाल शिवबांसाठी बांधलेला, आणि १६६३ मध्ये शाहिस्तेखानाची बोटे छाटलेला ऐतिहासिक लाल महाल.",
    "subtitle": "Kasba Peth • Pune 411011",
    "elevationOrEra": "Historic Site 1630 / Rebuilt 1988",
    "visualMood": "Deep terracotta red masonry, bronze statue of Jijamata and young Shivaji plowing Pune with a golden plow, and royal saffron flags.",
    "palette": {
      "primary": "#b91c1c",
      "secondary": "#7f1d1d",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(127,29,29,0.2) 0%, rgba(20,5,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.25) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Lal Mahal Pune Shaista Khan Shivaji Maharaj Powada Reel",
        "youtubeQuery": "Lal Mahal Pune Kasba Peth History Shivaji Maharaj Childhood",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Young Shivaji Maharaj Grew to Greatness",
        "titleMr": "जिथे बाल शिवबांनी स्वराज्याचे पहिले धडे गिरवले",
        "subtitleEn": "Lal Mahal (Red Palace), Kasba Peth, Pune",
        "subtitleMr": "लाल महाल, कसबा पेठ, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built by Shahaji Raje in 1630 for Rajmata Jijabai and Shivaji",
        "titleMr": "१६३० मध्ये शहाजीराजे भोसले यांनी बांधलेला पावन महाल",
        "subtitleEn": "Where Jijabai Plowed Pune’s Soil with a Golden Plow",
        "subtitleMr": "जिथे जिजाऊंनी सोन्याचा नांगर फिरवून पुण्याचे पुनरुज्जीवन केले",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Daring 1663 Midnight Raid on Shaista Khan",
        "titleMr": "१६६३ मधील शाहिस्तेखानावरील थरारक मध्यरात्रीचा छापा",
        "subtitleEn": "Historic Oil Paintings & Life-Sized Bronze Statues",
        "subtitleMr": "शिवरायांच्या जीवनावरील अप्रतिम तैलचित्रे आणि स्मारक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Soil That Nurtured Swarajya’s Greatest Vision",
        "titleMr": "हिंदवी स्वराज्याची स्वप्ने सत्यात उतरवणारी माती",
        "quoteEn": "“Sacred grounds where Shivaji Maharaj spent his formative youth under Jijau’s guidance.”",
        "quoteMr": "“छत्रपती शिवरायांच्या बालपणीच्या पाऊलखुणा आणि जिजाऊंचे संस्कार जपणारी भूमी.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Lal Mahal • Cradle of Courage",
        "titleMr": "लाल महाल • शौर्याची पावन जन्मभूमी",
        "subtitleEn": "Swarajya Heritage • Explore Pune",
        "subtitleMr": "शिवकालीन वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan across the red brick fortress facade to the bronze statue of young Shivaji and Jijabai.",
      "twoPhotos": "Photo 1 captures the striking red facade (Acts 1-2); Photo 2 focuses on interior bronze statues or paintings (Acts 3-5).",
      "threePhotos": "P1: Red exterior arch; P2: Jijabai & Shivaji statue; P3: Shaista Khan raid painting gallery.",
      "fourPhotos": "P1: Facade; P2: Golden plow statue; P3: Hall; P4: Sunset dome.",
      "fivePlusPhotos": "Heroic, red-and-gold historical narrative progression."
    }
  },
  "lavasa-lakeside": {
    "placeId": "lavasa-lakeside",
    "slug": "lavasa-lakeside",
    "placeName": "Lavasa Lakeside Promenade (Warasgaon Lake)",
    "placeNameMr": "लवासा लेकसाइड प्रोमेनाड (वरसगाव जलाशय)",
    "category": "nature",
    "templateTitle": "Lavasa Lakeside — Italianate Promenade on Warasgaon Shore",
    "templateTitleMr": "लवासा लेकसाइड • वरसगाव काठचे रंगीबेरंगी शहर व जलपर्यटन",
    "conceptTaglineEn": "The planned hill city modeled on the Italian fishing village of Portofino, featuring colourful pastel waterfront facades and scenic lake promenades.",
    "conceptTaglineMr": "इटलीच्या पोर्टोफिनो शहराच्या धर्तीवर वसलेले, वरसगाव तलावाकाठचे रंगीबेरंगी इमारतींचे निसर्गरम्य शहर.",
    "subtitle": "Dasve Village, Mose Valley • Pune 412112",
    "elevationOrEra": "Planned Hill City",
    "visualMood": "Pastel terracotta and mustard yellow Italian facades, sparkling blue lake promenade, European street lamps, and quiet mountain reflections.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#0284c7",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(234,88,12,0.18) 0%, rgba(10,25,45,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Lavasa City Pune Italian Promenade Weekend Drive Reel",
        "youtubeQuery": "Lavasa Hill City Drone 4K Dasve Lake Promenade",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "An Italian Village in the Heart of the Sahyadris",
        "titleMr": "सह्याद्रीच्या कुशीत इटालियन शैलीचे रंगीबेरंगी शहर",
        "subtitleEn": "Dasve Lakeside Promenade, Lavasa",
        "subtitleMr": "दासवे लेकसाइड प्रोमेनाड, लवासा",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Inspired by the Coastal Italian Town of Portofino",
        "titleMr": "इटलीतील प्रसिद्ध पोर्टोफिनो शहराच्या वास्तुकलेचा प्रभाव",
        "subtitleEn": "Winding Mountain Drives from Temghar Dam",
        "subtitleMr": "टेमघर धरणावरून जाणारा सुंदर घाटरस्ता",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pastel Waterfront Architecture & Watersports Cruises",
        "titleMr": "रंगीबेरंगी इमारती, बोटिंग आणि तलावाकाठची शांत सायंकाळ",
        "subtitleEn": "Bridges, Cobbled Streets & Open-Air Promenade Cafes",
        "subtitleMr": "पूल, फिरण्यासाठी सुंदर मार्ग आणि लेकसाइड कॅफे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "European Charm Merged with Sahyadri Majesty",
        "titleMr": "युरोपियन सौंदर्य आणि सह्याद्रीच्या डोंगरांचा अनोखा मेळ",
        "quoteEn": "“Walking along the lake as evening lights reflect on the water feels like a European dream.”",
        "quoteMr": "“पाण्यात पडणारे रंगीबेरंगी दिवे आणि गार वाऱ्यात फिरण्याचा आनंद युरोपची आठवण करून देतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Lavasa • The Lakeside Vista",
        "titleMr": "लवासा • लेकसाइडची देखणी सफर",
        "subtitleEn": "Scenic Promenade • Explore Pune",
        "subtitleMr": "निसर्गरम्य शहर • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal glide across the colorful pastel waterfront buildings reflected in the lake.",
      "twoPhotos": "Photo 1 showcases overall lake promenade with pastel architecture (Acts 1-2); Photo 2 shows close-up walkway or bridge (Acts 3-5).",
      "threePhotos": "P1: Wide lake view; P2: Promenade buildings; P3: Evening bridge lights.",
      "fourPhotos": "P1: Drive; P2: Facade; P3: Boats; P4: Sunset reflections.",
      "fivePlusPhotos": "Vibrant, colourful architectural and waterfront progression."
    }
  },
  "lenyadri-caves-ganpati": {
    "placeId": "lenyadri-caves-ganpati",
    "slug": "lenyadri-caves-ganpati",
    "placeName": "Lenyadri Buddhist Caves & Girijatmaj Ganpati",
    "placeNameMr": "लेण्याद्री लेणी व श्री गिरिजात्मज गणपती (अष्टविनायक, जुन्नर)",
    "category": "temples",
    "templateTitle": "Lenyadri Girijatmaj — Rock-Cut Cave Sanctum of Junnar",
    "templateTitleMr": "लेण्याद्री गिरिजात्मज • बौद्ध लेणीतील एकमेव अष्टविनायक",
    "conceptTaglineEn": "The unique sixth Ashtavinayaka shrine carved directly inside Cave 7 of a 1st-century Buddhist rock-cut monastery, reached by 307 cliff-side stone steps.",
    "conceptTaglineMr": "१ल्या शतकातील बौद्ध लेणी समूहातील गुहा क्रमांक ७ मध्ये कोरलेले, ३०७ पायऱ्या चढून जावे लागणारे एकमेव वैशिष्ट्यपूर्ण अष्टविनायक स्थान.",
    "subtitle": "Lenyadri Hill, Junnar • Pune 410502",
    "elevationOrEra": "Ashtavinayak #6 (Cave 7)",
    "visualMood": "Dramatic rock cliff face, 307 stone staircase climbing mountain, dark monolithic prayer hall, and panoramic Junnar valley view.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Lenyadri Girijatmaj Ashtavinayak 6 Junnar 307 Steps Reel",
        "youtubeQuery": "Lenyadri Buddhist Caves Girijatmaj Ganpati Drone 4K",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #6 — The Only Ganesha in a Cave",
        "titleMr": "अष्टविनायक #६ — लेणीमध्ये वसलेले एकमेव गणपती",
        "subtitleEn": "Girijatmaj Ganpati, Cave 7, Lenyadri",
        "subtitleMr": "श्री गिरिजात्मज, गुहा क्र. ७, लेण्याद्री टेकडी",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "307 Stone Steps Carved into the Sheer Mountain Cliff",
        "titleMr": "कड्यावर कोरलेल्या ३०७ पायऱ्यांची विहंगम चढाई",
        "subtitleEn": "Part of a 30-Cave Buddhist Monastic Complex (1st Century AD)",
        "subtitleMr": "१ल्या शतकातील ३० प्राचीन बौद्ध लेण्यांचा समूह",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "A Pillarless Monolithic Hall with 18 Meditation Cells",
        "titleMr": "खांब नसलेला भव्य पाषाण सभामंडप आणि १८ ध्यान गुहा",
        "subtitleEn": "Carved Directly into the Living Basalt Rock Wall",
        "subtitleMr": "काळ्या कातळातच कोरलेली स्वयंभू गिरिजात्मज मूर्ती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Mother Parvati Did Penance to Bear Ganesha",
        "titleMr": "जिथे माता पार्वतीने गणपती पुत्रासाठी तपश्चर्या केली",
        "quoteEn": "“Inside the ancient stone cave, prayers resound with the purity of two thousand years.”",
        "quoteMr": "“दोन हजार वर्षे जुन्या पाषाण गुहेत घुमणाऱ्या मंत्रांमध्ये अद्भूत शांतता जाणवते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Girijatmaj • The Son of the Mountain",
        "titleMr": "गिरिजात्मज • गिरीकन्या पार्वतीचे लाडके सुपुत्र",
        "subtitleEn": "Rock-Cut Ashtavinayak • Explore Pune",
        "subtitleMr": "लेणी अष्टविनायक • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning the 307 stone steps climbing the sheer cliff up to Cave 7.",
      "twoPhotos": "Photo 1 captures the cliff face staircase with valley (Acts 1-2); Photo 2 shows interior cave hall and idol (Acts 3-5).",
      "threePhotos": "P1: Cliff face with cave openings; P2: 307 steps trail; P3: Monolithic cave hall and idol.",
      "fourPhotos": "P1: Base steps; P2: Mid-way view; P3: Cave pillars; P4: Girijatmaj idol.",
      "fivePlusPhotos": "Adventurous mountain-cave pilgrim progression with sweeping valley vistas."
    }
  },
  "lohagad-fort": {
    "placeId": "lohagad-fort",
    "slug": "lohagad-fort",
    "placeName": "Lohagad Fort (Iron Fort)",
    "placeNameMr": "लोहगड किल्ला (लोहदुर्ग)",
    "category": "forts",
    "templateTitle": "Lohagad Fort — The Iron Fortress of Vinchukata & Pavana",
    "templateTitleMr": "लोहगड • विंचूकाटा माची व पवना खोऱ्याचा अजिंक्य लोहदुर्ग",
    "conceptTaglineEn": "The historic Iron Fort commanding ancient Sahyadri trade routes, famous for its scorpion-tail bastion jutting into empty skies.",
    "conceptTaglineMr": "प्राचीन व्यापारी मार्गांवर पहारा देणारा, विंचवाच्या नांगीसारख्या विंचूकाटा माचीने ओळखला जाणारा अजिंक्य लोहदुर्ग.",
    "subtitle": "Maval Taluka, Lonavala • Pune 410401",
    "elevationOrEra": "Elevation 1,033 m",
    "visualMood": "Deep moss-covered stone gateways, sweeping Pavana lake vistas, misty scorpion-tail ridge, and heavy monsoon rains.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#1e293b",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(2,132,199,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Lohagad Fort Monsoon Trek Reel / Vinchukata Pavana Lake",
        "youtubeQuery": "Lohagad Fort Lonavala 4K Drone Iron Fortress",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Iron Bastion Above Pavana Waters",
        "titleMr": "पवना जलाशयावर पहारा देणारा अजिंक्य लोहदुर्ग",
        "subtitleEn": "Elevation 1,033 m • Maval",
        "subtitleMr": "उंची १,०३३ मीटर • ऐतिहासिक मावळ प्रांत",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Four Imposing Gates — Ganesh, Narayan, Hanuman & Maha Darwaza",
        "titleMr": "गणेश, नारायण, हनुमान आणि भव्य महादरवाजा",
        "subtitleEn": "Treasury Fort of Chhatrapati Shivaji Maharaj & Nana Phadnavis",
        "subtitleMr": "सुरतेची लूट आणि पेशवाई खजिना सुरक्षित ठेवणारा दुर्ग",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Iconic Vinchukata — 1,500 Metres of Sheer Cliff Ridge",
        "titleMr": "प्रसिद्ध विंचूकाटा — दीड किलोमीटर लांब खडकाळ नांगी",
        "subtitleEn": "Panoramic Views of Visapur, Tikona & Pawna Lake",
        "subtitleMr": "विसापूर, तिकोना आणि पवना धरणाचा विहंगम देखावा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Standing Impregnable Through Centuries of War",
        "titleMr": "शेकडो वर्षे अभेद्य राहिलेला सह्याद्रीचा पोलादी पहारेकरी",
        "quoteEn": "“Vinchukata fortification guarding the historic trade routes with unbroken iron will.”",
        "quoteMr": "“पवना खोऱ्यावर नजर ठेवणारा आणि सह्याद्रीच्या इतिहासाची साक्ष देणारा लोहदुर्ग.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Lohagad • The Iron Fortress",
        "titleMr": "लोहगड • मावळचा अभेद्य मानबिंदू",
        "subtitleEn": "Iconic Fort • Explore Pune",
        "subtitleMr": "ऐतिहासिक दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Sweeping horizontal pan following the narrow curved scorpion tail ridge of Vinchukata.",
      "twoPhotos": "Photo 1 captures Maha Darwaza stairs (Acts 1-2); Photo 2 shows Vinchukata ridge jutting into valley (Acts 3-5).",
      "threePhotos": "P1: Distant fort outline; P2: Massive stone gate stairs; P3: Vinchukata ridge view.",
      "fourPhotos": "P1: Base steps; P2: Gateway; P3: Top plateau; P4: Vinchukata point.",
      "fivePlusPhotos": "Dramatic cloud and stone fortress montage."
    }
  },
  "mahad-varadvinayak-temple": {
    "placeId": "mahad-varadvinayak-temple",
    "slug": "mahad-varadvinayak-temple",
    "placeName": "Varadvinayak Temple & Sacred Pond (Mahad)",
    "placeNameMr": "श्री वरदविनायक गणपती मंदिर (अष्टविनायक, महड)",
    "category": "temples",
    "templateTitle": "Mahad Varadvinayak — Undying Nandadeep in Karjat Valley",
    "templateTitleMr": "वरदविनायक महड • १८९२ पासून अखंड तेवणारा नंदादीप",
    "conceptTaglineEn": "The beloved fourth Ashtavinayaka temple near Khopoli, celebrated for its sacred pond, east-facing idol with left trunk, and a brass oil lamp burning continuously since 1892.",
    "conceptTaglineMr": "खोपोलीजवळील चौथे अष्टविनायक स्थान, जिथे १८९२ पासून अखंड तेवणारा नंदादीप आणि भक्तांच्या मनोकामना पूर्ण करणारे वरदविनायक आहेत.",
    "subtitle": "Khalapur Taluka, Mahad • Near Pune-Mumbai Expressway",
    "elevationOrEra": "Ashtavinayak #4 (Nandadeep 1892)",
    "visualMood": "Reflective temple pond, green coconut groves, warm flickering brass oil lamp (nandadeep), and peaceful rural serenity.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.18) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Mahad Varadvinayak Ashtavinayak 4 Nandadeep Reel",
        "youtubeQuery": "Varadvinayak Temple Mahad 4K Drone Sacred Pond",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #4 — The Granter of Wishes",
        "titleMr": "अष्टविनायक #४ — सर्व मनोकामना पूर्ण करणारे वरदविनायक",
        "subtitleEn": "Varadvinayak Temple, Mahad, Khalapur",
        "subtitleMr": "वरदविनायक मंदिर, महड, खालापूर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "A Sacred Oil Lamp (Nandadeep) Burning Unbroken Since 1892",
        "titleMr": "१८९२ पासून सलग १३० वर्षांहून अधिक काळ अखंड तेवणारा नंदादीप",
        "subtitleEn": "Nestled by a Scenic Lotus Pond & Green Coconut Palms",
        "subtitleMr": "निसर्गरम्य तलावाकाठी नारळी-सुपारीच्या बागेत वसलेले मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Only Ashtavinayaka Where Devotees Can Touch the Deity",
        "titleMr": "भाविकांना स्वतः गाभाऱ्यात जाऊन मूर्तीला स्पर्श करण्याचे भाग्य",
        "subtitleEn": "Ancient Stone Elephants Guarding the Four Corners",
        "subtitleMr": "चारही कोपऱ्यांवर मंदिराचे रक्षण करणारे दगडी हत्ती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Every Prayer Finds Its Blessed Fulfillment",
        "titleMr": "मनातील प्रत्येक शुद्ध इच्छेला वरदान देणारे मंगलमूर्ती",
        "quoteEn": "“Like the unbroken flame of the Nandadeep, faith burns eternal at Varadvinayak.”",
        "quoteMr": "“अखंड तेवणाऱ्या नंदादीपासारखीच भक्तांची श्रद्धा येथे सदैव प्रकाशमान राहते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Varadvinayak • The Giver of Grace",
        "titleMr": "वरदविनायक • मनोकामना पूर्ण करणारे बाप्पा",
        "subtitleEn": "Ashtavinayak Pilgrimage • Explore Pune",
        "subtitleMr": "अष्टविनायक तीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the calm waters of the temple pond to the tiled spire and flickering brass lamp.",
      "twoPhotos": "Photo 1 captures the sacred pond and temple exterior (Acts 1-2); Photo 2 focuses on Varadvinayak idol and Nandadeep (Acts 3-5).",
      "threePhotos": "P1: Temple pond reflection; P2: Stone elephant entrance; P3: Sanctum idol with Nandadeep.",
      "fourPhotos": "P1: Pond; P2: Elephants; P3: Lamp; P4: Idol.",
      "fivePlusPhotos": "Tranquil, warm devotional progression with soft golden lantern glow."
    }
  },
  "mahatma-phule-museum": {
    "placeId": "mahatma-phule-museum",
    "slug": "mahatma-phule-museum",
    "placeName": "Mahatma Phule Museum",
    "placeNameMr": "महात्मा फुले वस्तुसंग्रहालय",
    "category": "museums",
    "templateTitle": "Mahatma Phule Museum — 1890 Industrial & Natural Relics",
    "templateTitleMr": "महात्मा फुले वस्तुसंग्रहालय • १८९० मधील उद्योग, शेती व शस्त्र संग्रहालय",
    "conceptTaglineEn": "One of Maharashtra’s oldest public museums on Ghole Road, showcasing 19th-century industrial models, armor, taxidermy, and agricultural crafts.",
    "conceptTaglineMr": "घोले रस्त्यावरील १८९० चे ऐतिहासिक संग्रहालय जिथे १९व्या शतकातील उद्योग, शेती, शस्त्रे आणि प्राण्यांचे नमुने जतन केले आहेत.",
    "subtitle": "Ghole Road, Shivajinagar • Pune 411005",
    "elevationOrEra": "Founded 1890",
    "visualMood": "Victorian glass cases, antique brass scales, historical Maratha swords, and preserved natural specimens.",
    "palette": {
      "primary": "#92400e",
      "secondary": "#451a03",
      "accent": "#fde68a",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,3,0.9) 100%)",
      "canvasFilter": "contrast(1.06) sepia(0.18) saturate(1.1)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Mahatma Phule Museum Pune Ghole Road Historic Relics Reel",
        "youtubeQuery": "Mahatma Phule Museum Pune 1890 Industrial Exhibition",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "135 Years of Maharashtra’s Industrial Dawn",
        "titleMr": "महाराष्ट्राच्या औद्योगिक प्रगतीचा १३५ वर्षे जुना वारसा",
        "subtitleEn": "Mahatma Phule Museum, Ghole Road",
        "subtitleMr": "महात्मा फुले वस्तुसंग्रहालय, घोले रस्ता",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Established in 1890 as Lord Ray Museum",
        "titleMr": "१८९० मध्ये लॉर्ड रे संग्रहालय म्हणून स्थापना",
        "subtitleEn": "Renamed to Honour Social Reformer Jyotirao Phule",
        "subtitleMr": "क्रांतिसूर्य जोतीराव फुले यांच्या नावाने ओळख",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Maratha Armory, Forestry Relics & Brass Machines",
        "titleMr": "मराठ्यांची ऐतिहासिक शस्त्रे, शेती अवजारे व पितळी यंत्रे",
        "subtitleEn": "Geology, Taxidermy & 19th-Century Handicrafts",
        "subtitleMr": "भूगर्भशास्त्र, दुर्मिळ प्राण्यांचे नमुने आणि कारागिरी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Preserving the Intellectual Awakening of Modern Pune",
        "titleMr": "आधुनिक पुण्याच्या औद्योगिक आणि वैज्ञानिक जाणिवांचे केंद्र",
        "quoteEn": "“A vintage window into how Maharashtra stepped boldly into modern science and industry.”",
        "quoteMr": "“महाराष्ट्राने विज्ञान आणि उद्योगात टाकलेल्या पहिल्या पावलांचा मौल्यवान दस्तावेज.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Phule Museum • Pioneer of Knowledge",
        "titleMr": "फुले संग्रहालय • ज्ञान आणि उद्योगाचा दीपस्तंभ",
        "subtitleEn": "Heritage Treasury • Explore Pune",
        "subtitleMr": "ऐतिहासिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward tilt revealing the vintage stone building facade and archways.",
      "twoPhotos": "Photo 1 captures exterior heritage building (Acts 1-2); Photo 2 focuses on antique armory or model showcases (Acts 3-5).",
      "threePhotos": "P1: Stone facade; P2: Armory gallery; P3: Historic industrial models.",
      "fourPhotos": "P1: Gate; P2: Building; P3: Weapons; P4: Exhibit halls.",
      "fivePlusPhotos": "Warm antique-toned museum exploration with sepia notes."
    }
  },
  "mahatma-phule-wada": {
    "placeId": "mahatma-phule-wada",
    "slug": "mahatma-phule-wada",
    "placeName": "Mahatma Jyotirao Phule Wada",
    "placeNameMr": "महात्मा जोतीराव फुले वाडा (राष्ट्रीय सामाजिक क्रांती स्मारक)",
    "category": "heritage",
    "templateTitle": "Mahatma Phule Wada — Cradle of Social Revolution & Satyashodhak Samaj",
    "templateTitleMr": "महात्मा जोतीराव फुले वाडा • सत्यशोधक चळवळ व सामाजिक क्रांतीचे तीर्थ",
    "conceptTaglineEn": "The historic residence of Mahatma Jyotirao Phule and Savitribai Phule in Ganj Peth, where the historic well was opened to all and Satyashodhak Samaj was founded in 1873.",
    "conceptTaglineMr": "गंज पेठेतील जोतीराव आणि सावित्रीबाईंचे निवासस्थान, जिथे अस्पृश्यांसाठी पाण्याचा हौद खुला केला आणि १८७३ मध्ये सत्यशोधक समाज स्थापन झाला.",
    "subtitle": "Ganj Peth • Pune 411042",
    "elevationOrEra": "National Social Monument (1873)",
    "visualMood": "Warm ochre courtyards, historic stone well (Haud), life-sized bronze statues of Jyotirao and Savitribai, and inspirational freedom quotes.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.18) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Mahatma Phule Wada Ganj Peth Pune Social Revolution Reel",
        "youtubeQuery": "Mahatma Jyotirao Phule Wada Pune National Memorial 4K",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Modern Social Justice in India Was Born",
        "titleMr": "भारतातील सामाजिक समतेची क्रांतीभूमी — फुले वाडा",
        "subtitleEn": "Mahatma Jyotirao Phule Wada, Ganj Peth",
        "subtitleMr": "महात्मा जोतीराव फुले वाडा, गंज पेठ, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Foundation of the Satyashodhak Samaj in 1873",
        "titleMr": "१८७३ मधील ऐतिहासिक सत्यशोधक समाजाची स्थापना",
        "subtitleEn": "Home to Mahatma Phule, Savitribai, and Yashwant",
        "subtitleMr": "महात्मा फुले आणि सावित्रीबाईंच्या संघर्षाची कर्मभूमी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Historic Well Opened to All Regardless of Caste",
        "titleMr": "अस्पृश्यांसाठी पाण्याचा हौद खुला करणारा क्रांतीचा पाषाण",
        "subtitleEn": "Original Study Room, Manuscripts & Gulamgiri History",
        "subtitleMr": "गुलामगिरी, शेतकऱ्यांचा आसूड या ग्रंथांची निर्मिती भूमी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "“Vidyevina Mati Geli” — The Eternal Call for Knowledge",
        "titleMr": "“विद्येविना मती गेली...” — शिक्षणाचा अमर संदेश",
        "quoteEn": "“Without education wisdom was lost, without wisdom morals were lost — here, that tide was turned forever.”",
        "quoteMr": "“विद्येचे महत्त्व पटवून देऊन संपूर्ण समाजाला सन्मानाने जगायला शिकवणारे युगपुरुष.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Phule Wada • Beacon of Human Rights",
        "titleMr": "फुले वाडा • समता आणि मानवतेचे पवित्र तीर्थ",
        "subtitleEn": "National Memorial • Explore Pune",
        "subtitleMr": "सामाजिक क्रांती वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the historic open well (haud) up to the bronze statues of Jyotirao and Savitribai.",
      "twoPhotos": "Photo 1 captures wada courtyard and well (Acts 1-2); Photo 2 focuses on bronze statues and study room (Acts 3-5).",
      "threePhotos": "P1: Wada entrance; P2: Historic drinking well; P3: Phule couple bronze statues.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Well; P4: Statues.",
      "fivePlusPhotos": "Profoundly moving social justice progression with reflective acoustic tones."
    }
  },
  "malhargad-fort": {
    "placeId": "malhargad-fort",
    "slug": "malhargad-fort",
    "placeName": "Malhargad Fort (Sonori Fort)",
    "placeNameMr": "मल्हारगड (सोनोरी किल्ला)",
    "category": "forts",
    "templateTitle": "Malhargad Fort — The Last Citadel of the Maratha Empire",
    "templateTitleMr": "मल्हारगड • सोनोरी किल्ला आणि मराठा साम्राज्याचा अखेरचा दुर्ग",
    "conceptTaglineEn": "The last hill fort built in Maharashtra (1775 AD) by the Panse family, featuring a unique triangular double fortification and temples of Khandoba.",
    "conceptTaglineMr": "१७७५ मध्ये पेशव्यांचे तोफखान्याचे प्रमुख पानसे यांनी बांधलेला, महाराष्ट्रातील सर्वात शेवटचा ऐतिहासिक दुर्ग.",
    "subtitle": "Sonori, Saswad • Pune 412301",
    "elevationOrEra": "Built 1775 AD",
    "visualMood": "Double concentric stone walls, golden dry grass plateau, pristine Khandoba shrine, and quiet panoramic plains of Saswad.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Malhargad Fort Sonori Saswad Sunset Trek Reel",
        "youtubeQuery": "Malhargad Fort Last Fort of Maharashtra Drone 4K",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Very Last Fort Built by the Marathas",
        "titleMr": "मराठा साम्राज्याने बांधलेला सर्वात शेवटचा किल्ला",
        "subtitleEn": "Built in 1775 AD by the Panse Family",
        "subtitleMr": "१७७५ मधील पेशव्यांच्या तोफखाना प्रमुखांचा दुर्ग",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Unique Double Concentric Fortification",
        "titleMr": "अनोखी दुहेरी तटबंदी आणि त्रिकोणी रचना",
        "subtitleEn": "Built to Watch Over The Dive Ghat Trade Route",
        "subtitleMr": "दिवे घाटातील वाहतुकीवर नजर ठेवणारा पहारेकरी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Lord Khandoba & Lord Shiva Temples on the Plateau",
        "titleMr": "पठारावरील खंडोबा व महादेवाचे सुंदर मंदिर",
        "subtitleEn": "Well-Preserved Water Cisterns & Bastions Over Sonori Village",
        "subtitleMr": "सोनोरी गाव आणि विस्तीर्ण सासवड पठाराचे शांत दृश्य",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Final Twilight of Peshwa Fort Architecture",
        "titleMr": "पेशवेकालीन दुर्गबांधणीचा अखेरचा सोनेरी अध्याय",
        "quoteEn": "“The concluding chapter of a magnificent two-century era of hill fort construction.”",
        "quoteMr": "“महाराष्ट्रातील दोन शतकांच्या भव्य दुर्गबांधणीची अखेरची देखणी स्वाक्षरी.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Malhargad • The Final Bastion",
        "titleMr": "मल्हारगड • इतिहासाचा शांत साक्षीदार",
        "subtitleEn": "Peshwa Era Fort • Explore Pune",
        "subtitleMr": "अखेरचा मराठा दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal scan along the double concentric ramparts glowing in afternoon gold.",
      "twoPhotos": "Photo 1 showcases the outer fort walls (Acts 1-2); Photo 2 focuses on Khandoba temple on top (Acts 3-5).",
      "threePhotos": "P1: Fort silhouette from base; P2: Concentric gate wall; P3: Khandoba temple top.",
      "fourPhotos": "P1: Trail; P2: Outer wall; P3: Inner wall; P4: Temple sunset.",
      "fivePlusPhotos": "Golden hour peaceful fort documentary montage."
    }
  },
  "manmodi-caves-junnar": {
    "placeId": "manmodi-caves-junnar",
    "slug": "manmodi-caves-junnar",
    "placeName": "Manmodi Buddhist Caves & Amba-Ambika Complex",
    "placeNameMr": "मानमोडी लेणी (अंबा-अंबिका बौद्ध समूह, जुन्नर)",
    "category": "heritage",
    "templateTitle": "Manmodi Caves — Ancient Rock Facades of Junnar",
    "templateTitleMr": "मानमोडी लेणी • अंबा-अंबिका टेकडीवरील प्राचीन बौद्ध लेणी (जुन्नर)",
    "conceptTaglineEn": "The extensive multi-tiered Buddhist and Jain cave cluster on Manmodi hill in Junnar, renowned for its ornate round Chaitya facade and donor inscriptions.",
    "conceptTaglineMr": "जुन्नरच्या मानमोडी टेकडीवरील तीन गटांत विभागलेला प्राचीन बौद्ध-जैन लेणी समूह, जिथे सुंदर वर्तुळाकार चैत्य आणि शिलालेख आहेत.",
    "subtitle": "Manmodi Hill, Junnar • Pune 410502",
    "elevationOrEra": "2nd Century BC - 3rd Century AD",
    "visualMood": "Multi-tiered hillside caves, weathered rock-cut floral gateways, tranquil Junnar plain vistas, and quiet ancient monastic life.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Manmodi Caves Junnar Ancient Rock Cut Architecture Reel",
        "youtubeQuery": "Manmodi Buddhist Caves Junnar Amba Ambika Complex 4K",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "40 Rock-Cut Chambers Carved Across Manmodi Hill",
        "titleMr": "मानमोडी टेकडीवर कोरलेली ४० प्राचीन पाषाण दालने",
        "subtitleEn": "Manmodi Buddhist & Jain Caves, Junnar",
        "subtitleMr": "मानमोडी लेणी समूह (अंबा-अंबिका), जुन्नर",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Three Groups: Bhimasankar, Amba-Ambika, and Bhutalinga",
        "titleMr": "भीमाशंकर, अंबा-अंबिका आणि भूतलिंग अशा तीन गटांत विभागणी",
        "subtitleEn": "Inscriptions from Western Satrap Rulers of the 2nd Century AD",
        "subtitleMr": "२ऱ्या शतकातील पश्चिम क्षत्रप राजांचे ऐतिहासिक शिलालेख",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Lotus Medallions, Ornate Chaitya Facades & Monastic Cells",
        "titleMr": "कमळांची नक्षीकामे, चैत्य खिडक्या आणि भिक्खूंच्या ध्यान गुहा",
        "subtitleEn": "Later Jain Tirthankara Carvings Co-Existing in Peace",
        "subtitleMr": "नंतरच्या काळातील जैन तीर्थंकरांची सुंदर पाषाण शिल्पे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Sanctuary Where Diverse Ancient Faiths Harmonized",
        "titleMr": "विविध प्राचीन विचारधारांचा शांततेने नांदणारा पवित्र वारसा",
        "quoteEn": "“Across these hillside caves, Buddhist and Jain seekers meditated above the fertile Junnar plains.”",
        "quoteMr": "“या उंच टेकडीवरील गुहांमध्ये ज्ञानाचा शोध घेणाऱ्या साधकांनी शतकानुशतके तपश्चर्या केली.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Manmodi Caves • Ancient Heights",
        "titleMr": "मानमोडी लेणी • पाषाणातील शांत साधना",
        "subtitleEn": "Junnar Rock-Cut Heritage • Explore Pune",
        "subtitleMr": "जुन्नर लेणी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal pan across the multi-tiered cave openings overlooking the Junnar green valley.",
      "twoPhotos": "Photo 1 captures the hillside cave row (Acts 1-2); Photo 2 focuses on ornate circular Chaitya entrance (Acts 3-5).",
      "threePhotos": "P1: Hillside cave overview; P2: Ornate Chaitya window facade; P3: Interior carved stupa chamber.",
      "fourPhotos": "P1: Trail; P2: Facade; P3: Carvings; P4: Valley vista.",
      "fivePlusPhotos": "Quiet archaeological study progression with expansive hillside breezes."
    }
  },
  "morgaon-mayureshwar-ganpati": {
    "placeId": "morgaon-mayureshwar-ganpati",
    "slug": "morgaon-mayureshwar-ganpati",
    "placeName": "Mayureshwar Ganpati Mandir, Morgaon (Ashtavinayak #1)",
    "placeNameMr": "मयूरेश्वर गणपती मंदिर, मोरगाव (आद्य अष्टविनायक)",
    "category": "temples",
    "templateTitle": "Morgaon Mayureshwar — First Among the Ashtavinayakas",
    "templateTitleMr": "मयूरेश्वर मोरगाव • आद्य अष्टविनायक व मयूरेश्वर महाक्षेत्र",
    "conceptTaglineEn": "The foremost of the eight sacred Ashtavinayaka temples on the Karha river, built like a medieval fortress with four minarets, where Lord Ganesha defeated Sindhu.",
    "conceptTaglineMr": "कऱ्हा नदीतीरावरील आद्य अष्टविनायक महाक्षेत्र, जिथे चार बुरूज असलेल्या भुईकोट किल्ल्यासारख्या मंदिरात मयूरेश्वर गणपती विराजमान आहेत.",
    "subtitle": "Karha River, Morgaon • Pune 412304",
    "elevationOrEra": "Ashtavinayak #1 (Adya Peeth)",
    "visualMood": "Fortress-like black stone ramparts, four tall minarets, peacock feathers, deep stone lamps, and revered Varkari peace.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#7c2d12",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(124,45,18,0.2) 0%, rgba(26,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Morgaon Mayureshwar Ashtavinayak 1 Pune Reel",
        "youtubeQuery": "Mayureshwar Ganpati Morgaon Ashtavinayak Drone 4K",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #1 — The Supreme Adya Peetha",
        "titleMr": "आद्य अष्टविनायक #१ — मयूरेश्वर मोरगाव",
        "subtitleEn": "Mayureshwar Ganpati, Karha River, Baramati",
        "subtitleMr": "मयूरेश्वर गणपती, कऱ्हा नदीतीर, बारामती",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Every Sacred Ashtavinayaka Yatra Begins and Ends",
        "titleMr": "जिथून अष्टविनायक यात्रेची सुरुवात होते आणि समाप्तीही",
        "subtitleEn": "Unique Fortress Architecture with Four Minarets (Buruj)",
        "subtitleMr": "किल्ल्यासारखी ५० फूट उंच तटबंदी आणि चार बुरूज",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Mounted upon a Peacock with Diamonds in Navel and Eyes",
        "titleMr": "मोरावर आरूढ झालेली आणि डोळ्यांत हिरे असलेली तेजस्वी मूर्ती",
        "subtitleEn": "Nandi Bull Guarding the Gateway Facing Lord Ganesha",
        "subtitleMr": "गणपतीच्या समोर बसलेला भव्य पाषाणातील नंदी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Primordial Destroyer of All Worldly Obstacles",
        "titleMr": "सर्व संकटांचा नाश करून सिद्धी देणारा आद्य ओंकार",
        "quoteEn": "“At Morgaon, devotion begins with the first bow and completes the circle of grace.”",
        "quoteMr": "“मोरगावात मस्तक टेकवताच जीवनातील सर्व विघ्ने दूर होऊन मनाला शांती लाभते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Mayureshwar • The First of Eight",
        "titleMr": "मयूरेश्वर • अष्टविनायकांचे आद्य तीर्थ",
        "subtitleEn": "Ashtavinayak Sanctuary • Explore Pune",
        "subtitleMr": "आद्य अष्टविनायक • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the black stone fortress ramparts up to the golden temple shikhar.",
      "twoPhotos": "Photo 1 captures fortress-like temple outer walls (Acts 1-2); Photo 2 focuses on Mayureshwar sanctum idol (Acts 3-5).",
      "threePhotos": "P1: Stone fortress entrance; P2: Nandi bull statue; P3: Mayureshwar idol darshan.",
      "fourPhotos": "P1: Ramparts; P2: Minarets; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Regal, sacred pilgrim journey with resonant conch and bell chimes."
    }
  },
  "mulshi-dam": {
    "placeId": "mulshi-dam",
    "slug": "mulshi-dam",
    "placeName": "Mulshi Dam & Lake",
    "placeNameMr": "मुळशी धरण आणि निसर्ग परिसर",
    "category": "nature",
    "templateTitle": "Mulshi Dam — Forest Valleys & Deep Emerald Waters",
    "templateTitleMr": "मुळशी धरण • हिरवेगार मावळ खोरे आणि निसर्गाची शांतता",
    "conceptTaglineEn": "The scenic Tata Power reservoir on the Mula river, encircled by dense monsoon forests, luxury eco-resorts, and mist-laden Ghat trails.",
    "conceptTaglineMr": "मुळा नदीवरील विस्तीर्ण जलाशय, जो दाट जंगले, इको-रिसॉर्ट्स आणि निसर्गरम्य घाटांनी वेढलेला पर्यटकांचा आवडता परिसर आहे.",
    "subtitle": "Mulshi Taluka • Pune 412108",
    "elevationOrEra": "Built 1927",
    "visualMood": "Deep emerald green waters, monsoon clouds kissing hilltops, misty forest roads, and cozy lakeside verandahs.",
    "palette": {
      "primary": "#047857",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.24) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Mulshi Dam Monsoon Resort Weekend Pune Reel",
        "youtubeQuery": "Mulshi Dam Lake 4K Drone View Maharashtra Monsoon",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Deep Emerald Waters of the Sahyadris",
        "titleMr": "सह्याद्रीच्या कुशीतील हिरवागार पाचू — मुळशी",
        "subtitleEn": "Mulshi Dam & Lake • Pune District",
        "subtitleMr": "मुळशी धरण व जलाशय • पुणे जिल्हा",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Constructed in the 1920s on the Mula River",
        "titleMr": "१९२० च्या दशकात मुळा नदीवर बांधलेला महत्त्वाचा जलविद्युत प्रकल्प",
        "subtitleEn": "Historic Site of Senapati Bapat’s Mulshi Satyagraha",
        "subtitleMr": "सेनापती बापटांच्या प्रसिद्ध मुळशी सत्याग्रहाची ऐतिहासिक भूमी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Dense Forest Canopies, Cozy Lakeside Verandahs & Fog",
        "titleMr": "दाट हिरवीगार वनराई, निसर्गरम्य रिसॉर्ट्स आणि धुक्याची दुलई",
        "subtitleEn": "Gateway to Tamhini Ghat & Kundalika River Passages",
        "subtitleMr": "ताम्हिणी घाटाचे प्रवेशद्वार आणि खळाळणारे ओहोळ",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Nature Heals and the Mind Reconnects",
        "titleMr": "निसर्गाच्या सान्निध्यात मनाला मिळणारी नवी ऊर्जा",
        "quoteEn": "“Sitting by Mulshi lake with warm tea as the fog rolls in is pure monsoon bliss.”",
        "quoteMr": "“मुळशीच्या काठावर धुक्याची चादर पाहताना मिळणारा सुखद आणि शांत अनुभव.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Mulshi • Emerald of the Western Ghats",
        "titleMr": "मुळशी • सह्याद्रीचा हिरवागार निसर्ग ठेवा",
        "subtitleEn": "Ecological Sanctuary • Explore Pune",
        "subtitleMr": "निसर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the emerald water surface to misty green hilltops.",
      "twoPhotos": "Photo 1 captures vast lake expanse with mist (Acts 1-2); Photo 2 focuses on lush green lakeside vegetation (Acts 3-5).",
      "threePhotos": "P1: Lake overview; P2: Winding road with trees; P3: Mist touching water.",
      "fourPhotos": "P1: Dam view; P2: Forest; P3: Resort lawn; P4: Sunset mist.",
      "fivePlusPhotos": "Rich green atmospheric nature progression."
    }
  },
  "nana-wada": {
    "placeId": "nana-wada",
    "slug": "nana-wada",
    "placeName": "Nana Wada (Historic Residence of Nana Phadnavis)",
    "placeNameMr": "नाना वाडा (नाना फडणवीस ऐतिहासिक वाडा, बुधवार पेठ)",
    "category": "heritage",
    "templateTitle": "Nana Wada — Timber Balconies of Nana Phadnavis",
    "templateTitleMr": "नाना वाडा • मुत्सद्दी नाना फडणवीसांचा सागवानी वाडा",
    "conceptTaglineEn": "The magnificent 1780 Peshwa mansion built by chief diplomat Nana Phadnavis in Budhwar Peth, celebrated for its carved wooden Diwankhana and cypress pillars.",
    "conceptTaglineMr": "बुधवार पेठेतील १७८० मधील मुत्सद्दी नाना फडणवीस यांचा वाडा, जिथे कोरीव सागवानी दिवाणखाना आणि सुरुचे खांब आजही वैभवाची साक्ष देतात.",
    "subtitle": "Budhwar Peth • Pune 411002",
    "elevationOrEra": "Built 1780 AD (Nana Phadnavis)",
    "visualMood": "Deep teakwood cypress pillars (suru), historic arcaded balconies, stone courtyards, and echoes of 18th-century diplomatic diplomacy.",
    "palette": {
      "primary": "#92400e",
      "secondary": "#451a03",
      "accent": "#fde68a",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.15) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Nana Wada Pune Budhwar Peth Nana Phadnavis History Reel",
        "youtubeQuery": "Nana Wada Pune 1780 Teakwood Diwankhana Architecture",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Residence of the Maratha Empire’s Greatest Diplomat",
        "titleMr": "मराठा साम्राज्याचे मुत्सद्दी नाना फडणवीसांचा वाडा",
        "subtitleEn": "Nana Wada, Budhwar Peth (Built 1780)",
        "subtitleMr": "नाना वाडा, बुधवार पेठ (१७८०)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Nana Phadnavis Outsmarted the British for 25 Years",
        "titleMr": "जिथून नानांनी २५ वर्षे ब्रिटिशांना मुत्सद्देगिरीने रोखून धरले",
        "subtitleEn": "Surviving Architectural Jewel of the Barbhai Council Era",
        "subtitleMr": "बारभाई कारभार काळातील भव्य आणि देखणी ऐतिहासिक वास्तू",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Exquisite Cypress-Shaped Teak Pillars & Ornate Diwankhana",
        "titleMr": "सुरुच्या आकाराचे सागवानी खांब आणि भव्य दिवाणखाना",
        "subtitleEn": "Escape Staircases & Secret Vaults of Peshwa Intelligence",
        "subtitleMr": "गुप्त भुयारी वाटा आणि मुत्सद्दी बैठकींचे गुप्त दालन",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Silent Brilliance That Kept Pune Sovereign",
        "titleMr": "पुण्याचे स्वातंत्र्य टिकवून ठेवणारी अचाट बुद्धिमत्ता",
        "quoteEn": "“Within these timber walls, Nana Phadnavis played the high-stakes chess of Indian history.”",
        "quoteMr": "“या सागवानी दिवाणखान्यातून नानांनी भारताच्या इतिहासाची बुद्धीबळाची पटावरची बाजी चालवली.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Nana Wada • Seat of Diplomacy",
        "titleMr": "नाना वाडा • मुत्सद्देगिरीचे ऐतिहासिक प्रतीक",
        "subtitleEn": "Peshwa Administrative Heritage • Explore Pune",
        "subtitleMr": "पेशवेकालीन वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan across the cypress-shaped teakwood columns up to the timber ceiling brackets.",
      "twoPhotos": "Photo 1 captures the exterior stone and wood facade (Acts 1-2); Photo 2 shows the ornate Diwankhana hall (Acts 3-5).",
      "threePhotos": "P1: Outer stone gateway; P2: Courtyard with timber columns; P3: Upper Diwankhana gallery.",
      "fourPhotos": "P1: Gate; P2: Courtyard; P3: Pillars; P4: Diwankhana.",
      "fivePlusPhotos": "Detailed architectural study of 18th-century Maratha timber craftsmanship."
    }
  },
  "naneghat-pass-caves": {
    "placeId": "naneghat-pass-caves",
    "slug": "naneghat-pass-caves",
    "placeName": "Naneghat Ancient Mountain Pass & Inscriptions",
    "placeNameMr": "नाणेघाट ऐतिहासिक व्यापारी मार्ग व शिलालेख",
    "category": "heritage",
    "templateTitle": "Naneghat Pass — Satavahana Inscriptions & Stone Toll Jar",
    "templateTitleMr": "नाणेघाट • सातवाहनकालीन व्यापारी मार्ग व शिलालेख गुहा",
    "conceptTaglineEn": "The historic 2,000-year-old mountain pass connecting the Deccan to the Konkan coast, famous for Queen Nayanika’s Brahmi inscriptions and the massive stone toll jar.",
    "conceptTaglineMr": "दख्खन ते कोकण जोडणारा २००० वर्षे जुना व्यापारी घाट, जिथे सातवाहन महाराणी नागनिकांचे ब्राह्मी शिलालेख आणि जकातीची दगडी रांजण आहे.",
    "subtitle": "Ghatghar, Junnar • Pune 410502",
    "elevationOrEra": "1st Century BC (Satavahana Dynasty)",
    "visualMood": "Deep chiseled rock-cut mountain trench pass, giant hollowed stone toll vessel, ancient Brahmi script inscriptions, and sweeping Konkan cliff drop.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.14) saturate(1.2) brightness(0.96)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Naneghat Ancient Pass Toll Pot Brahmi Inscription Reel",
        "youtubeQuery": "Naneghat 2000 Year Old Mountain Pass 4K Drone Junnar",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A 2,000-Year-Old Toll Pass Carved Through the Mountain",
        "titleMr": "डोंगर फोडून काढलेला २,००० वर्षे जुना जकात मार्ग",
        "subtitleEn": "Naneghat Pass, Junnar Region (1st Century BC)",
        "subtitleMr": "नाणेघाट, जुन्नर (इसवी सन पूर्व १ले शतक)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Caravans Traveled from the Arabian Sea to Paithan",
        "titleMr": "अरबी समुद्रावरून थेट प्रतिष्ठान (पैठण) राजधानीकडे जाणारा व्यापारी मार्ग",
        "subtitleEn": "The Giant Monolithic Stone Toll Jar (Nanyacha Ranjan)",
        "subtitleMr": "व्यापाऱ्यांकडून जकात जमा करण्यासाठी ठेवलेला भव्य दगडी रांजण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Queen Nayanika’s Rare Brahmi Inscriptions in the Cave",
        "titleMr": "गुहेतील भिंतींवर कोरलेले महाराणी नागनिकांचे दुर्मिळ ब्राह्मी शिलालेख",
        "subtitleEn": "Carved Royal Statues of Satakarni & Ancient Numerical Zero",
        "subtitleMr": "सातवाहन राजांचे पुतळे आणि प्राचीन भारतीय अंकांचे पुरावे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Walking Where Empires Traded Across the Centuries",
        "titleMr": "जिथून दोन सहस्रके भारताचा समृद्ध व्यापार अखंड वाहत राहिला",
        "quoteEn": "“Under these stone walls, you step directly onto the paving stones worn smooth by two thousand years of caravans.”",
        "quoteMr": "“नाणेघाटाच्या कातळात पाऊल टाकताच दोन हजार वर्षांचा देदीप्यमान व्यापारी इतिहास जागा होतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Naneghat • The Ancient Pass",
        "titleMr": "नाणेघाट • सातवाहनांचा सुवर्ण मार्ग",
        "subtitleEn": "World Trade Heritage • Explore Pune",
        "subtitleMr": "प्राचीन व्यापारी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning along the narrow carved rock trench walls of Naneghat looking down into the Konkan.",
      "twoPhotos": "Photo 1 captures narrow cut-rock pass and stone toll pot (Acts 1-2); Photo 2 shows Brahmi inscription cave (Acts 3-5).",
      "threePhotos": "P1: Deep rock-cut pass; P2: Giant stone toll jar; P3: Inscribed cave chamber.",
      "fourPhotos": "P1: Approach; P2: Trench; P3: Toll pot; P4: Konkan view.",
      "fivePlusPhotos": "Ancient mountain-pass expedition progression with epic Sahyadri drums."
    }
  },
  "national-war-memorial": {
    "placeId": "national-war-memorial",
    "slug": "national-war-memorial",
    "placeName": "National War Memorial Southern Command",
    "placeNameMr": "राष्ट्रीय युद्ध स्मारक (सदर्न कमांड)",
    "category": "heritage",
    "templateTitle": "National War Memorial — Eternal Flame of Southern Command",
    "templateTitleMr": "राष्ट्रीय युद्ध स्मारक • हुतात्म्यांची अमर ज्योत व वीरगाथा (सदर्न कमांड)",
    "conceptTaglineEn": "The solemn 25-metre granite memorial pillar in Pune Cantonment honoring fallen Indian armed forces martyrs of post-independence conflicts, raised by citizen contributions.",
    "conceptTaglineMr": "पुणे कॅन्टोन्मेंटमधील २५ मीटर उंच ग्रॅनाइट स्मारक, जिथे स्वातंत्र्योत्तर युद्धांतील हुतात्म्यांची अमर ज्योत, मिग-२३ लढाऊ विमान आणि टी-५५ रणगाडा आहे.",
    "subtitle": "Ghorpadi, Pune Camp • Pune 411001",
    "elevationOrEra": "Dedicated 1998 (Citizens of Pune)",
    "visualMood": "Tall black granite pillar, leaping orange Amar Jawan Jyoti eternal flame, green lawns, MiG-23 aircraft, and military solemnity.",
    "palette": {
      "primary": "#b91c1c",
      "secondary": "#0f172a",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(185,28,28,0.18) 0%, rgba(15,20,30,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "National War Memorial Southern Command Pune Amar Jawan Reel",
        "youtubeQuery": "National War Memorial Pune Southern Command Drone 4K",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Only War Memorial in South Asia Built by Citizens",
        "titleMr": "नागरिकांच्या योगदानातून उभे राहिलेले आशियातील एकमेव युद्ध स्मारक",
        "subtitleEn": "National War Memorial Southern Command, Pune Camp",
        "subtitleMr": "राष्ट्रीय युद्ध स्मारक, सदर्न कमांड, घोरपडी, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "25-Metre Soaring Black Granite Pillar of Valour",
        "titleMr": "२५ मीटर उंच काळ्या ग्रॅनाइटचा भव्य विजयस्तंभ",
        "subtitleEn": "Dedicated in 1998 to Fallen Soldiers of Post-Independence Wars",
        "subtitleMr": "स्वातंत्र्योत्तर काळातील हुतात्मा जवानांना समर्पित राष्ट्रीय तीर्थ",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Amar Jawan Jyoti, MiG-23 Fighter Jet & T-55 Battle Tank",
        "titleMr": "अखंड तेवणारी अमर जवान ज्योत, मिग-२३ विमान आणि टी-५५ रणगाडा",
        "subtitleEn": "Roll of Honour Inscribing Thousands of Bravehearts’ Names",
        "subtitleMr": "सुवर्णाक्षरांनी कोरलेली हजारो शूर हुतात्म्यांची अमर नावे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "“When You Go Home, Tell Them of Us and Say, For Your Tomorrow We Gave Our Today”",
        "titleMr": "“तुमच्या उद्यासाठी आम्ही आमचा आज दिला — हुतात्म्यांची अमर शिकवण”",
        "quoteEn": "“Before this eternal flame, an entire nation bows in profound gratitude.”",
        "quoteMr": "“अमर ज्योतीसमोर उभे राहताच प्रत्येक भारतीयाची मान कृतज्ञतेने झुकते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "National War Memorial • Flame of Valour",
        "titleMr": "राष्ट्रीय युद्ध स्मारक • हुतात्म्यांचे अमर स्मरण",
        "subtitleEn": "Sacred Military Heritage • Explore Pune",
        "subtitleMr": "शौर्य आणि बलिदान वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward tilt from the burning Amar Jawan Jyoti up the 25m black granite pillar.",
      "twoPhotos": "Photo 1 captures the granite pillar and eternal flame (Acts 1-2); Photo 2 shows the MiG-23 fighter jet or tank exhibit (Acts 3-5).",
      "threePhotos": "P1: Grand memorial gate; P2: 25-metre granite column; P3: Amar Jawan Jyoti flame.",
      "fourPhotos": "P1: Entrance; P2: Pillar; P3: MiG-23; P4: Roll of honour.",
      "fivePlusPhotos": "Heroic, patriotic progression with bugle and ceremonial drum resonance."
    }
  },
  "ohel-david-synagogue": {
    "placeId": "ohel-david-synagogue",
    "slug": "ohel-david-synagogue",
    "placeName": "Ohel David Synagogue (Lal Deval)",
    "placeNameMr": "ओहेल डेव्हिड सिनेगॉग (लाल देऊळ, पुणे कॅम्प)",
    "category": "heritage",
    "templateTitle": "Ohel David Synagogue — Red Brick Spire of Lal Deval",
    "templateTitleMr": "ओहेल डेव्हिड सिनेगॉग • लाल देऊळ व पुणे कॅम्पचा ज्यू वारसा",
    "conceptTaglineEn": "The majestic English Gothic red-brick synagogue built in 1867 by philanthropist David Sassoon, featuring a 90-foot clock tower, known affectionately across Pune as Lal Deval.",
    "conceptTaglineMr": "पुणे कॅम्पमधील १८६७ चे डेव्हिड ससून यांनी बांधलेले भव्य गॉथिक लाल विटांचे सिनेगॉग, ज्याला पुणेकर प्रेमाने \"लाल देऊळ\" म्हणतात.",
    "subtitle": "Moledina Road, Camp • Pune 411001",
    "elevationOrEra": "Built 1867 AD (David Sassoon)",
    "visualMood": "Deep red brick Victorian Gothic facades, 90-foot spire with imported clock, stained glass windows, and quiet sacred courtyards.",
    "palette": {
      "primary": "#b91c1c",
      "secondary": "#451a03",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(185,28,28,0.2) 0%, rgba(20,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Ohel David Synagogue Lal Deval Pune Camp Heritage Reel",
        "youtubeQuery": "Lal Deval Pune Ohel David Synagogue 1867 English Gothic 4K",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Lal Deval — Asia’s Largest Synagogue Outside Israel",
        "titleMr": "इस्त्रायलबाहेर आशियातील सर्वात मोठे सिनेगॉग — लाल देऊळ",
        "subtitleEn": "Ohel David Synagogue, Moledina Road, Pune Camp (1867)",
        "subtitleMr": "ओहेल डेव्हिड सिनेगॉग, मोलेदिना रस्ता, पुणे कॅम्प (१८६७)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Constructed by Philanthropist David Sassoon in English Gothic Style",
        "titleMr": "दानशूर डेव्हिड ससून यांनी गॉथिक शैलीत उभारलेली देखणी वास्तू",
        "subtitleEn": "90-Foot Towering Spire with a Historic Chiming Clock",
        "subtitleMr": "९० फूट उंच लाल विटांचा मनोरा आणि ऐतिहासिक घड्याळ",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Hand-Carved Wooden Torah Ark & Polished Brass Chandeliers",
        "titleMr": "कोरीव लाकडी तोराह कपाट आणि पितळी झुंबरांची मंद रोषणाई",
        "subtitleEn": "Mausoleum of David Sassoon Resting Peacefully in the Garden Courtyard",
        "subtitleMr": "उद्यानात शांत विसावलेले संस्थापक डेव्हिड ससून यांचे समाधी स्मारक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Living Testament to Pune’s Cosmopolitan Soul",
        "titleMr": "पुण्याच्या सर्वसमावेशक आणि वैश्विक संस्कृतीचे जिवंत प्रतीक",
        "quoteEn": "“Under the red spire, Jewish faith and Puneri warmth have co-existed for over a century and a half.”",
        "quoteMr": "“लाल देवळाच्या छायेत दीड शतकाहून अधिक काळ ज्यू संस्कृती आणि पुणेरी जिव्हाळा एकत्र नांदत आहेत.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Lal Deval • The Gothic Sanctuary",
        "titleMr": "लाल देऊळ • कॅम्पचा ऐतिहासिक वारसा",
        "subtitleEn": "Cantonment Heritage • Explore Pune",
        "subtitleMr": "वैश्विक वास्तू वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan along the red brick clock tower from the green garden lawn to the 90-foot spire cross.",
      "twoPhotos": "Photo 1 captures the striking red brick facade and spire (Acts 1-2); Photo 2 shows interior prayer hall with brass chandeliers (Acts 3-5).",
      "threePhotos": "P1: Distant view of 90-foot red spire; P2: Detailed red brick gothic archway; P3: David Sassoon garden mausoleum.",
      "fourPhotos": "P1: Gate; P2: Spire; P3: Windows; P4: Mausoleum.",
      "fivePlusPhotos": "Stately, red-brick Victorian architectural progression with acoustic warmth."
    }
  },
  "ojas-ganpati-ozar": {
    "placeId": "ojas-ganpati-ozar",
    "slug": "ojas-ganpati-ozar",
    "placeName": "Vighnahar Ganpati Mandir, Ozar (Ashtavinayak #7)",
    "placeNameMr": "विघ्नहर गणपती मंदिर, ओझर (अष्टविनायक)",
    "category": "temples",
    "templateTitle": "Ozar Vighnahar — Deepamala Shimmer on Kukadi Waters",
    "templateTitleMr": "विघ्नहर ओझर • कुकडी नदीतीर, सोनेरी कळस व भव्य दीपमाळा",
    "conceptTaglineEn": "The seventh Ashtavinayaka temple situated on the banks of Kukadi river, celebrated for its golden spire (shikhar), massive deepamalas, and gemstone eyes.",
    "conceptTaglineMr": "कुकडी नदीकाठचे सातवे अष्टविनायक स्थान, जिथे विघ्नहर्त्याचा सुवर्ण कळस, भव्य दीपमाळा आणि हिरेजडित डोळे भाविकांना आकर्षित करतात.",
    "subtitle": "Kukadi River, Junnar • Pune 410504",
    "elevationOrEra": "Ashtavinayak #7 (Yedgaon Basin)",
    "visualMood": "Gleaming golden temple dome, stone entrance ramparts, reflective Kukadi river waters, and evening oil lamp flickers.",
    "palette": {
      "primary": "#eab308",
      "secondary": "#a16207",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(161,98,7,0.18) 0%, rgba(20,12,3,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.25) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Ozar Vighnahar Ashtavinayak 7 Junnar Kukadi River Reel",
        "youtubeQuery": "Vighnahar Ganpati Ozar Pune 4K Drone Golden Shikhar",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #7 — Destroyer of All Obstacles",
        "titleMr": "अष्टविनायक #७ — सर्व विघ्नांचा संहारक विघ्नहर",
        "subtitleEn": "Vighnahar Ganpati, Kukadi River, Ozar",
        "subtitleMr": "विघ्नहर गणपती, कुकडी नदीतीर, ओझर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Lord Ganesha Defeated the Demon Vighnasura",
        "titleMr": "जिथे गणरायाने विघ्नासुर राक्षसाचा पराभव करून अभय दिले",
        "subtitleEn": "Fortress Enclosure with Two Towering Stone Deepamalas",
        "subtitleMr": "दगडी तटबंदी आणि आवारातील दोन भव्य दीपमाळा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pure Gold Shikhar Crowning the Majestic Marble Mandap",
        "titleMr": "सुवर्ण कळस, संगमरवरी सभामंडप आणि हिरेजडित डोळे",
        "subtitleEn": "Flanked by Riddhi and Siddhi on Either Side",
        "subtitleMr": "दोन्ही बाजूला रिद्धी-सिद्धी आणि तेजस्वी प्रभा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Assurance That No Obstacle Can Stand in Your Path",
        "titleMr": "जीवनातील कोणतेही विघ्न अडथळा ठरणार नाही हा विश्वास",
        "quoteEn": "“Before Vighnahar, every mountain of difficulty dissolves into a pathway of light.”",
        "quoteMr": "“विघ्नहर्त्याचे दर्शन घडताच संकटांचे डोंगर विरघळून यशाचा मार्ग खुला होतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Vighnahar • The Victorious Lord",
        "titleMr": "विघ्नहर • अष्टविनायकांचे सुवर्ण तेज",
        "subtitleEn": "Ashtavinayak Glory • Explore Pune",
        "subtitleMr": "अष्टविनायक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the Kukadi river water across the stone gates up to the shining gold shikhar.",
      "twoPhotos": "Photo 1 captures fortress gate and towering deepamala (Acts 1-2); Photo 2 focuses on Vighnahar golden idol (Acts 3-5).",
      "threePhotos": "P1: Kukadi river reflection; P2: Outer stone gates and deepamala; P3: Sanctum idol darshan.",
      "fourPhotos": "P1: River; P2: Deepamala; P3: Gold dome; P4: Idol.",
      "fivePlusPhotos": "Golden, radiant pilgrim progression with reflective waters."
    }
  },
  "okayama-friendship-garden": {
    "placeId": "okayama-friendship-garden",
    "slug": "okayama-friendship-garden",
    "placeName": "Pu La Deshpande Garden (Okayama Friendship Garden)",
    "placeNameMr": "पु. ल. देशपांडे उद्यान (जपानी मैत्री बाग)",
    "category": "parks",
    "templateTitle": "Okayama Friendship Garden — Japanese Zen Bridges of Pu La Deshpande",
    "templateTitleMr": "पु. ल. देशपांडे उद्यान • जपानी मैत्री बाग, झेन ओहोळ व शांत बांबू",
    "conceptTaglineEn": "A tranquil Japanese garden inspired by Okayama’s 300-year-old Koraku-en, honouring literary maestro Pu La Deshpande.",
    "conceptTaglineMr": "ओकायामाच्या ३०० वर्षे जुन्या कोराकु-एन बागेवर आधारित, साहित्यसम्राट पु. ल. देशपांडे यांच्या स्मृतीस समर्पित निसर्गरम्य जपानी बाग.",
    "subtitle": "Sinhagad Road • Pune 411030",
    "elevationOrEra": "Opened 2004",
    "visualMood": "Lush green moss, arched wooden bridges, cascading rock brooks, peaceful bamboo groves, and shimmering koi ponds.",
    "palette": {
      "primary": "#15803d",
      "secondary": "#064e3b",
      "accent": "#86efac",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,30,20,0.88) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.12,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.1
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Okayama Friendship Garden Pune Japanese Garden Reel",
        "youtubeQuery": "Pu La Deshpande Garden Pune Peaceful Nature Walk",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Slice of Japan in the Heart of Pune",
        "titleMr": "पुण्याच्या कुशीत जपानी सौंदर्याची अनुभूती",
        "subtitleEn": "Okayama Friendship Garden, Sinhagad Road",
        "subtitleMr": "पु. ल. देशपांडे उद्यान, सिंहगड रस्ता",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Inspired by the 300-Year-Old Koraku-en Garden",
        "titleMr": "ओकायामाच्या ३०० वर्षे जुन्या कोराकु-एनचे प्रतिबिंब",
        "subtitleEn": "Curved Wooden Bridges & Shimmering Canals",
        "subtitleMr": "कमानीदार लाकडी पूल आणि शांत पाण्याचे प्रवाह",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Gentle Waterfalls, Bonsai Lawns & Whispering Bamboo",
        "titleMr": "खळाळणारे छोटे धबधबे आणि बांबूच्या झाडांची सळसळ",
        "subtitleEn": "Carefully Sculpted Rocks and Zen Pathways",
        "subtitleMr": "मन शांत करणारी निसर्गाची देखणी रचना",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Nature and Solitude Become One",
        "titleMr": "निसर्ग, शांतता आणि साहित्याची सुरेख सांगड",
        "quoteEn": "“In the gentle sound of flowing water, the soul finds complete stillness.”",
        "quoteMr": "“वाहत्या पाण्याच्या मंजुळ नादात मनाला मिळते खरीखुरी शांतता.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pu La Garden • Pune’s Zen Oasis",
        "titleMr": "पु. ल. बाग • मनाला शांती देणारे हिरवेगार उद्यान",
        "subtitleEn": "Botanical Sanctuary • Explore Pune",
        "subtitleMr": "निसर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow horizontal drift across the wooden bridge with reflections in the koi pond.",
      "twoPhotos": "Photo 1 showcases wooden bridge vista (Acts 1-2); Photo 2 explores stone lantern pathway (Acts 3-5).",
      "threePhotos": "P1: Entrance lawn; P2: Central Japanese bridge; P3: Shaded rock canal.",
      "fourPhotos": "P1: Gate; P2: Bridge; P3: Bamboo trail; P4: Water pond reflection.",
      "fivePlusPhotos": "Serene meditative progression synced to calming flute melody."
    }
  },
  "omkareshwar-temple": {
    "placeId": "omkareshwar-temple",
    "slug": "omkareshwar-temple",
    "placeName": "Omkareshwar Temple (Peshwa-Era Shiva Shrine)",
    "placeNameMr": "ओंकारेश्वर मंदिर (पेशवेकालीन ऐतिहासिक शिवमंदिर, शनिवार पेठ)",
    "category": "temples",
    "templateTitle": "Omkareshwar Temple — Riverbank Shiva Sanctum of Shaniwar Peth",
    "templateTitleMr": "ओंकारेश्वर मंदिर • मुठा नदीकाठचे भव्य पेशवेकालीन शिवमंदिर",
    "conceptTaglineEn": "The majestic 18th-century Shiva temple on the banks of Mutha river, built by Chimaji Appa’s spiritual advisor with fortress-like stone ramparts.",
    "conceptTaglineMr": "मुठा नदीकाठी १७३८ मध्ये बांधलेले, तटबंदीसारख्या भव्य दगडी भिंती व उंच नक्षीदार कळस असलेले पेशवेकालीन शिवमंदिर.",
    "subtitle": "Shaniwar Peth • Pune 411030",
    "elevationOrEra": "Built 1738 AD (Chimaji Appa Era)",
    "visualMood": "Imposing black stone bastions, river ghat steps, white and gold tiered shikhars, and meditative bell chimes.",
    "palette": {
      "primary": "#64748b",
      "secondary": "#1e293b",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(30,41,59,0.2) 0%, rgba(15,20,30,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Omkareshwar Temple Pune Mutha River Ghat Heritage Reel",
        "youtubeQuery": "Omkareshwar Mandir Shaniwar Peth Pune 1738 Drone",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Fortress-Temple on the Banks of the Mutha",
        "titleMr": "मुठा नदीतीरावरील अभेद्य तटबंदीचे शिवमंदिर",
        "subtitleEn": "Omkareshwar Mandir, Shaniwar Peth (1738)",
        "subtitleMr": "ओंकारेश्वर मंदिर, शनिवार पेठ (१७३८)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built by Shivaram Bhat Chitrav, Guru to Chimaji Appa",
        "titleMr": "चिमाजी अप्पांचे गुरू शिवराम भट चित्राव यांनी बांधलेले मंदिर",
        "subtitleEn": "Fortified with Stone Parapets to Withstand River Floods",
        "subtitleMr": "नदीच्या पुराला तोंड देणारी भक्कम पाषाण तटबंदी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "White Tiered Spire, Ancient Shivalinga & River Ghats",
        "titleMr": "नक्षीदार पांढरा कळस, स्वयंभू शिवलिंग आणि जुने नदीघाट",
        "subtitleEn": "Samadhis of Chimaji Appa & Historic Peshwa Dignitaries",
        "subtitleMr": "महान योद्धे चिमाजी अप्पा यांची समाधी व ऐतिहासिक परिसर",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Echoes of Maratha Glory Along the Sacred Waters",
        "titleMr": "पवित्र नदीकाठी घुमणारा मराठा शौर्याचा आणि भक्तीचा इतिहास",
        "quoteEn": "“Where the waters of the Mutha wash the feet of three centuries of Peshwa memory.”",
        "quoteMr": "“मुठा नदीच्या प्रवाहासोबत वाहतात पेशवेकालीन शौर्य आणि भक्तीच्या स्मृती.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Omkareshwar • Riverbank Sentinel",
        "titleMr": "ओंकारेश्वर • नदीकाठचे पावन शिवतीर्थ",
        "subtitleEn": "Historic Ghat Temple • Explore Pune",
        "subtitleMr": "ऐतिहासिक शिवतीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the river stone steps up to the fortified black stone bastion gates.",
      "twoPhotos": "Photo 1 captures river ghat and stone walls (Acts 1-2); Photo 2 shows ornate temple spire and Shivalinga (Acts 3-5).",
      "threePhotos": "P1: Riverbank ghat; P2: Fortified stone gates; P3: Shivalinga sanctum.",
      "fourPhotos": "P1: River; P2: Ramparts; P3: Spire; P4: Inner sanctum.",
      "fivePlusPhotos": "Atmospheric riverbank heritage progression with classical strings."
    }
  },
  "osho-teerth-park": {
    "placeId": "osho-teerth-park",
    "slug": "osho-teerth-park",
    "placeName": "Osho Teerth Park & Ashram (Koregaon Park)",
    "placeNameMr": "ओशो तीर्थ पार्क व ध्यान आश्रम (कोरेगाव पार्क)",
    "category": "heritage",
    "templateTitle": "Osho Teerth Park — Zen Stream of Koregaon Park",
    "templateTitleMr": "ओशो तीर्थ पार्क • निसर्गाशी संवाद साधणारा झेन ध्यान बगीचा",
    "conceptTaglineEn": "The internationally acclaimed 12-acre Zen garden created by converting a degraded municipal nala into a crystal stream, lush bamboo glades, and meditative ponds.",
    "conceptTaglineMr": "कोरेगाव पार्क येथील १२ एकरांचा निसर्गरम्य झेन बगीचा, जिथे प्रदूषित ओढ्याचे रूपांतर स्वच्छ धबधबे आणि बांबूच्या शांत वनात केले गेले.",
    "subtitle": "Koregaon Park • Pune 411001",
    "elevationOrEra": "Ecological Restoration 1989",
    "visualMood": "Soothing stream ripples over river rocks, dense green bamboo canopies, black swan ponds, and peaceful zen stone bridges.",
    "palette": {
      "primary": "#15803d",
      "secondary": "#064e3b",
      "accent": "#86efac",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.9) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.12,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.1
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Osho Teerth Park Koregaon Park Pune Zen Nature Walk Reel",
        "youtubeQuery": "Osho Teerth Park Pune Ecological Transformation 4K Walk",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "From Wasteland to an International Zen Sanctuary",
        "titleMr": "एका प्रदूषित ओढ्यातून साकारलेला जागतिक झेन बगीचा",
        "subtitleEn": "Osho Teerth Park, Koregaon Park (1989)",
        "subtitleMr": "ओशो तीर्थ पार्क, कोरेगाव पार्क (१९८९)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "12-Acre Masterpiece of Ecological Regeneration",
        "titleMr": "पर्यावरण पुनरुज्जीवनाचा १२ एकरांचा आदर्श प्रकल्प",
        "subtitleEn": "Designed in Collaboration with Japanese Zen Garden Masters",
        "subtitleMr": "जपानी झेन पद्धतीनुसार नैसर्गिक पाषाण व झाडांची रचना",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Whispering Bamboo Groves, Flowing Brooks & Black Swans",
        "titleMr": "बांबूचे दाट वन, खळाळणारे स्वच्छ पाण्याचे प्रवाह आणि काळे हंस",
        "subtitleEn": "Stone Pathways Where Conversation Yields to Natural Harmony",
        "subtitleMr": "जिथे पाऊल टाकताच मनातील सर्व गोंधळ शांत होतो",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Living Proof That Nature Can Always Be Healed",
        "titleMr": "निसर्गाला पुन्हा संजीवनी देता येते याचे जिवंत उदाहरण",
        "quoteEn": "“In the sound of water trickling over mossy stones, you rediscover your inner stillness.”",
        "quoteMr": "“दगडांवरून वाहणाऱ्या पाण्याच्या शांत लयीत सापडते खरीखुरी आत्मशांती.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Osho Teerth • The Zen Stream",
        "titleMr": "ओशो तीर्थ • निसर्गाचा शांत प्रवाह",
        "subtitleEn": "Ecological Zen Sanctuary • Explore Pune",
        "subtitleMr": "पर्यावरण वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal glide across the rock brook with gentle ripples and overhanging bamboo branches.",
      "twoPhotos": "Photo 1 captures shaded bamboo bridge pathway (Acts 1-2); Photo 2 shows crystal stream and koi pond (Acts 3-5).",
      "threePhotos": "P1: Park bamboo gateway; P2: Stream with wooden bridge; P3: Reflective water pond.",
      "fourPhotos": "P1: Path; P2: Bamboo; P3: Stream; P4: Swans.",
      "fivePlusPhotos": "Deeply calming, meditative zen nature progression with flowing water sounds."
    }
  },
  "panshet-dam": {
    "placeId": "panshet-dam",
    "slug": "panshet-dam",
    "placeName": "Panshet Dam (Tanajisagar)",
    "placeNameMr": "पानशेत धरण (तानाजीसागर)",
    "category": "nature",
    "templateTitle": "Panshet Dam — Tanajisagar’s Sprawling Waters & Green Hills",
    "templateTitleMr": "पानशेत धरण • तानाजीसागर जलाशय व हिरवेगार डोंगर",
    "conceptTaglineEn": "The expansive Tanajisagar reservoir in Velhe valley, offering watersports, boat rides, rural tranquility, and lush Sahyadri surrounding hills.",
    "conceptTaglineMr": "वेल्हे तालुक्यातील तानाजीसागर जलाशय, जिथे बोटिंग, जलक्रीडा आणि शांत हिरवेगार डोंगर पर्यटकांना आकर्षित करतात.",
    "subtitle": "Velhe Taluka • Pune 412107",
    "elevationOrEra": "Built 1961 (Tanajisagar)",
    "visualMood": "Deep blue water expanse, speeding motorboat wakes, forested green slopes, and peaceful lakeside cottages.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0369a1",
      "accent": "#7dd3fc",
      "overlayGradient": "linear-gradient(180deg, rgba(3,105,161,0.18) 0%, rgba(10,25,45,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Panshet Dam Boating Water Sports Pune Reel",
        "youtubeQuery": "Panshet Dam Tanajisagar Water Sports 4K Drone",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Tanajisagar — Pune’s Vast Watersports Haven",
        "titleMr": "तानाजीसागर — निसर्गाच्या कुशीतील विशाल जलाशय",
        "subtitleEn": "Panshet Dam, Velhe Valley",
        "subtitleMr": "पानशेत धरण, वेल्हे खोरे",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built on the Ambi River in the Deep Western Ghats",
        "titleMr": "आंबी नदीवर उभारलेला विस्तीर्ण पाण्याचा साठा",
        "subtitleEn": "50 km from Pune • Pristine Countryside Drive",
        "subtitleMr": "पुण्यापासून ५० किमीचा निसर्गरम्य शांत प्रवास",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Speedboats, Kayaking, Water Scooters & Rural Peace",
        "titleMr": "स्पीडबोट्स, कयाकिंग, वॉटर स्कूटर आणि शांत ग्रामीण जीवन",
        "subtitleEn": "Surrounded by Sahyadri Mountain Ridges & Green Woods",
        "subtitleMr": "चारही बाजूंनी वेढलेल्या हिरव्यागार डोंगररांगा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Cool Waters Wash Away City Exhaustion",
        "titleMr": "शहराचा सारा थकवा दूर करणारे थंडगार निळेशार पाणी",
        "quoteEn": "“Cutting across Tanajisagar’s waters under open skies is the ultimate weekend rejuvenation.”",
        "quoteMr": "“विस्तीर्ण जलाशयाच्या लाटांवरून विहार करताना मनाला मिळते संपूर्ण ताजेतवानेपण.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Panshet • Lake of Adventure",
        "titleMr": "पानशेत • जलपर्यटनाचा खरा आनंद",
        "subtitleEn": "Lakeside Escape • Explore Pune",
        "subtitleMr": "निसर्ग जलाशय • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth forward zoom following boat ripples across the deep blue reservoir.",
      "twoPhotos": "Photo 1 showcases reservoir landscape with mountains (Acts 1-2); Photo 2 focuses on boat rides or water splash (Acts 3-5).",
      "threePhotos": "P1: Expansive dam view; P2: Boating jetty; P3: Surrounding forested hills.",
      "fourPhotos": "P1: Dam wall; P2: Water; P3: Boats; P4: Sunset reflections.",
      "fivePlusPhotos": "Breezy, lively water recreation progression."
    }
  },
  "parvati-hill": {
    "placeId": "parvati-hill",
    "slug": "parvati-hill",
    "placeName": "Parvati Hill & Devdeveshwar Temple",
    "placeNameMr": "पार्वती टेकडी व देवदेवेश्वर मंदिर",
    "category": "temples",
    "templateTitle": "Parvati Hill — Devdeveshwar & Peshwa Skyline",
    "templateTitleMr": "पार्वती टेकडी • पेशवेकालीन देवदेवेश्वर व पुण्याचा विहंगम देखावा",
    "conceptTaglineEn": "The historic hill rising 640 m crowned by Devdeveshwar temple built by Peshwa Balaji Baji Rao in 1749, ascended by 103 gentle basalt stone steps.",
    "conceptTaglineMr": "नानासाहेब पेशव्यांनी १७४९ मध्ये बांधलेले देवदेवेश्वर मंदिर, १०३ दगडी पायऱ्या आणि संपूर्ण पुण्याचा विहंगम देखावा देणारी पार्वती टेकडी.",
    "subtitle": "Parvati, Swargate • Pune 411009",
    "elevationOrEra": "Elevation 640 m (Built 1749 AD)",
    "visualMood": "Broad stone staircases, red-and-white temple spires, morning breeze, and breathtaking 360-degree Pune panorama.",
    "palette": {
      "primary": "#dc2626",
      "secondary": "#7f1d1d",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(127,29,29,0.2) 0%, rgba(25,8,8,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Parvati Hill Pune 103 Steps Morning Sunrise View Reel",
        "youtubeQuery": "Parvati Hill Pune Devdeveshwar Temple Drone 4K Peshwa",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "103 Wide Steps Climbing Above Pune",
        "titleMr": "१०३ रुंद दगडी पायऱ्या चढून पुण्याच्या माथ्यावर",
        "subtitleEn": "Parvati Hill & Devdeveshwar Temple (1749)",
        "subtitleMr": "पार्वती टेकडी व देवदेवेश्वर मंदिर (१७४९)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commissioned by Shrimant Nanasaheb Peshwa",
        "titleMr": "श्रीमंत नानासाहेब पेशव्यांनी उभारलेले पवित्र तीर्थ",
        "subtitleEn": "Where the Peshwa Watched the Battle of Khadki in 1817",
        "subtitleMr": "जिथून पेशव्यांनी खडकीच्या ऐतिहासिक लढाईचे निरीक्षण केले",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Devdeveshwar Shiva Sanctum, Peshwa Museum & Sunset View",
        "titleMr": "देवदेवेश्वर शिवमंदिर, पेशवे संग्रहालय आणि सूर्यास्त देखावा",
        "subtitleEn": "Panoramic 360-Degree Views Across Sinhagad to Sarasbaug",
        "subtitleMr": "सिंहगडापासून सारसबागेपर्यंत पसरलेला संपूर्ण पुण्याचा देखावा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Heritage and Daily Devotion Meet the Horizon",
        "titleMr": "पेशवाई वारसा आणि पुणेकरांच्या रोजच्या श्रद्धेचा संगम",
        "quoteEn": "“Standing atop Parvati as the temple bells ring, the entire historic city bows before you.”",
        "quoteMr": "“मंदिराच्या घंटांच्या नादात पार्वतीवरून संपूर्ण पुणे शहर डोळ्यांत साठवता येते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Parvati • The Crown of Pune",
        "titleMr": "पार्वती • पुण्याचा ऐतिहासिक मुकुट",
        "subtitleEn": "Peshwa Hill Sanctuary • Explore Pune",
        "subtitleMr": "पेशवेकालीन तीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan climbing the wide stone steps toward the red temple shikhar.",
      "twoPhotos": "Photo 1 captures 103 stone staircase steps (Acts 1-2); Photo 2 shows Devdeveshwar temple and city skyline (Acts 3-5).",
      "threePhotos": "P1: Wide staircase; P2: Devdeveshwar temple courtyard; P3: Panoramic Pune skyline vista.",
      "fourPhotos": "P1: Stairs; P2: Peshwa museum; P3: Shivalinga; P4: Sunset city view.",
      "fivePlusPhotos": "Regal, uplifting staircase climbing progression with classical sitar notes."
    }
  },
  "pashan-lake": {
    "placeId": "pashan-lake",
    "slug": "pashan-lake",
    "placeName": "Pashan Lake & Bird Sanctuary",
    "placeNameMr": "पाषाण तलाव व पक्षी अभयारण्य",
    "category": "nature",
    "templateTitle": "Pashan Lake — Wetland Haven of Migratory Birds",
    "templateTitleMr": "पाषाण तलाव • रामनदीचा निसर्गरम्य पाणथळ भाग व पक्षी अभयारण्य",
    "conceptTaglineEn": "The historic man-made water reservoir on the Ramnadi river, established in the British era, serving as an essential wetland for migratory aquatic birds.",
    "conceptTaglineMr": "रामनदीवरील ऐतिहासिक ब्रिटिशकालीन तलाव, जो हिवाळ्यात देश-विदेशातील स्थलांतरित पक्ष्यांचे आवडते आश्रयस्थान बनतो.",
    "subtitle": "Pashan • Pune 411021",
    "elevationOrEra": "British Era Reservoir",
    "visualMood": "Mirror water reflecting grey morning skies, floating water lilies, silhouetted cranes and egrets, and peaceful bamboo bamboo groves.",
    "palette": {
      "primary": "#0891b2",
      "secondary": "#164e63",
      "accent": "#67e8f9",
      "overlayGradient": "linear-gradient(180deg, rgba(22,78,99,0.18) 0%, rgba(10,25,35,0.9) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Pashan Lake Pune Bird Watching Sunrise Nature Reel",
        "youtubeQuery": "Pashan Lake Pune Migratory Birds 4K Drone Ramnadi",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Migratory Wings Touch Pune Waters",
        "titleMr": "हजारो मैलांचा प्रवास करून येणाऱ्या पक्ष्यांचे घर",
        "subtitleEn": "Pashan Lake & Bird Sanctuary, Ramnadi",
        "subtitleMr": "पाषाण तलाव व पक्षी अभयारण्य, रामनदी",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Constructed in the British Era as a Vital Water Reserve",
        "titleMr": "ब्रिटिश काळात रामनदीवर उभारलेला महत्त्वाचा जलाशय",
        "subtitleEn": "Surrounded by Wetlands, Reeds & Shaded Walking Tracks",
        "subtitleMr": "पाणथळ जागा, वेत आणि सुंदर बांबूचे पदपथ",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Spotting Painted Storks, Egrets, Kingfishers & Coots",
        "titleMr": "पेंटेड स्टॉर्क, बगळे, खंड्या आणि पाणकोंबड्यांचे दर्शन",
        "subtitleEn": "Quiet Morning Photography Hides & Gentle Water Reflections",
        "subtitleMr": "शांत सकाळी छायाचित्रकारांसाठी नंदनवन आणि संथ लाटा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Indispensable Wetland Giving Life to the City",
        "titleMr": "पुण्याच्या पर्यावरणाचा समतोल राखणारा मौल्यवान पाणथळ भाग",
        "quoteEn": "“Here, the beating of avian wings tells the story of our delicate living world.”",
        "quoteMr": "“पाण्यावर तरंगणाऱ्या पक्ष्यांच्या किलबिलाटात ऐकू येतो निसर्गाचा खरा संवाद.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pashan Lake • The Wetland Sanctuary",
        "titleMr": "पाषाण तलाव • पक्ष्यांचे नंदनवन",
        "subtitleEn": "Avian Wetland Heritage • Explore Pune",
        "subtitleMr": "जैवविविधता वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow horizontal glide across the wetland lake with birds skimming the water surface.",
      "twoPhotos": "Photo 1 captures broad lake panorama with hills (Acts 1-2); Photo 2 focuses on aquatic birds or lily pads (Acts 3-5).",
      "threePhotos": "P1: Lake panorama; P2: Bird watching track; P3: Aquatic birds on water.",
      "fourPhotos": "P1: Shoreline; P2: Water reeds; P3: Birds; P4: Sunset reflections.",
      "fivePlusPhotos": "Tranquil birdwatching and wetland nature progression."
    }
  },
  "pataleshwar-cave-temple": {
    "placeId": "pataleshwar-cave-temple",
    "slug": "pataleshwar-cave-temple",
    "placeName": "Pataleshwar Cave Temple",
    "placeNameMr": "पाताळेश्वर लेणी मंदिर",
    "category": "temples",
    "templateTitle": "Pataleshwar Cave Temple — 8th-Century Monolithic Basalt Sanctuary",
    "templateTitleMr": "पाताळेश्वर शैलमंदिर • १२ शतकांची गूढ पाषाण शांतता",
    "conceptTaglineEn": "The remarkable 8th-century Rashtrakuta rock-cut monolithic Shiva shrine on JM Road, carved entirely out of a single subterranean basalt bedrock.",
    "conceptTaglineMr": "८व्या शतकातील राष्ट्रकूटकालीन अखंड काळ्या पाषाणात कोरलेले, वर्तुळाकार नंदीमंडप असलेले गूढ व शांत पाताळेश्वर शिवमंदिर.",
    "subtitle": "Jangli Maharaj Road, Shivajinagar • Pune 411005",
    "elevationOrEra": "Rashtrakuta Dynasty (8th Century AD)",
    "visualMood": "Dark chiseled subterranean basalt, circular Nandi canopy, cool stone shadows, and timeless meditative stillness.",
    "palette": {
      "primary": "#64748b",
      "secondary": "#1e293b",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(30,41,59,0.2) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.1) grayscale(0.1) brightness(0.95)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.12,
      "transitionEffect": "cinematic_blur",
      "speedRampFactor": 1.1
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Pataleshwar Cave Temple Pune 8th Century Monolith Reel",
        "youtubeQuery": "Pataleshwar Caves JM Road Pune Ancient Rock Cut Architecture",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Carved from a Single Basalt Rock 1,200 Years Ago",
        "titleMr": "१,२०० वर्षांपूर्वी एकाच काळ्या पाषाणात कोरलेले शिल्प",
        "subtitleEn": "Pataleshwar Cave Temple, JM Road",
        "subtitleMr": "पाताळेश्वर लेणी मंदिर, जंगली महाराज रस्ता",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Crafted in the 8th Century During the Rashtrakuta Empire",
        "titleMr": "८व्या शतकातील राष्ट्रकूट साम्राज्याची अद्वितीय वास्तुकला",
        "subtitleEn": "Contemporaneous with the Great Caves of Ellora",
        "subtitleMr": "वेरूळच्या जगप्रसिद्ध लेण्यांच्या काळातील अद्भुत रचना",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Circular Monolithic Nandi Mandapa & Massive Pillared Hall",
        "titleMr": "अखंड पाषाणातील वर्तुळाकार नंदी मंडप आणि भव्य दगडी खांब",
        "subtitleEn": "Subterranean Sanctum Where City Noise Vanishes Completely",
        "subtitleMr": "जमीन पातळीखाली असलेली थंडगार गूढ शांतता",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Twelve Centuries of Unbroken Meditative Silence",
        "titleMr": "बारा शतकांपासून अखंड तेवणारी ध्यानमग्न शांतता",
        "quoteEn": "“Carved directly from living basalt stone twelve centuries ago, breathing timeless calm.”",
        "quoteMr": "“गजबजलेल्या शहराच्या हृदयात १२ शतकांची गूढ पाषाण शांतता सामावली आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pataleshwar • Ancient Silence",
        "titleMr": "पाताळेश्वर • प्राचीन पाषाण वैभव",
        "subtitleEn": "Monolithic Rock-Cut Sanctuary • Explore Pune",
        "subtitleMr": "प्राचीन शैलमंदिर • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow meditative pan starting from circular Nandi canopy moving into dark pillared sanctum.",
      "twoPhotos": "Photo 1 captures circular Nandi mandapa (Acts 1-2); Photo 2 shows pillared cave interior (Acts 3-5).",
      "threePhotos": "P1: Sunken courtyard; P2: Monolithic Nandi mandap; P3: Shivalinga cave sanctum.",
      "fourPhotos": "P1: Steps down; P2: Nandi; P3: Pillars; P4: Shivalinga.",
      "fivePlusPhotos": "Deep, contemplative stone and shadow progression."
    }
  },
  "pawna-lake": {
    "placeId": "pawna-lake",
    "slug": "pawna-lake",
    "placeName": "Pawna Lake & Dam (Lonavala-Kamshet)",
    "placeNameMr": "पवना धरण व जलाशय (कॅम्पिंग व निसर्ग पर्यटन)",
    "category": "nature",
    "templateTitle": "Pawna Lake — Camping Waters Beneath Tikona & Lohagad",
    "templateTitleMr": "पवना जलाशय • किल्ल्यांच्या सावलीतील निळेशार पाणी व कॅम्पिंग",
    "conceptTaglineEn": "Pune’s most popular lakeside camping destination, framed by historic citadels Tikona, Lohagad, Visapur, and Tung.",
    "conceptTaglineMr": "तिकोना, लोहगड आणि तुंग किल्ल्यांच्या सावलीत वसलेला, कॅम्पिंग, तंबू आणि रात्रीच्या शेकोटीसाठी प्रसिद्ध जलाशय.",
    "subtitle": "Kamshet, Maval • Pune 410405",
    "elevationOrEra": "Built 1972 (Pavana Dam)",
    "visualMood": "Glowing evening camping bonfires, twinkling stars above water, silhouettes of mountain forts, and golden sunset reflections.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,25,45,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Pawna Lake Camping Night Bonfire Pune Reel / Lonavala",
        "youtubeQuery": "Pawna Lake Camping Drone 4K Sunset Barbecue Tent",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Camping Under Millions of Stars by Pawna Lake",
        "titleMr": "लाखो ताऱ्यांच्या प्रकाशात पवना काठी कॅम्पिंगचा थरार",
        "subtitleEn": "Pawna Lake, Maval Valley",
        "subtitleMr": "पवना जलाशय, मावळ खोरे",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Framed by Four Majestic Forts — Tikona, Tung, Lohagad & Visapur",
        "titleMr": "तिकोना, तुंग, लोहगड व विसापूरच्या पहार्‍यात वसलेला तलाव",
        "subtitleEn": "Constructed Across the Pavana River in 1972",
        "subtitleMr": "१९७२ मधील पवना नदीवरील भव्य जलाशय",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Bonfire Acoustics, Sizzling Barbecue & Lakeside Tents",
        "titleMr": "शेकोटी, गिटारचे सूर, बार्बेक्यू आणि पाण्याकाठचे रंगीबेरंगी तंबू",
        "subtitleEn": "Kayaking in Clear Waters & Chilly Night Breezes",
        "subtitleMr": "स्वच्छ पाण्यात कयाकिंग आणि गार वाऱ्याची प्रसन्न झुळूक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Ultimate Starlit Escape from Pune City Lights",
        "titleMr": "शहराच्या धावपळीपासून दूर, निसर्गाच्या कुशीतली अविस्मरणीय रात्र",
        "quoteEn": "“Under the towering shadow of ancient forts, campfires tell stories that linger forever.”",
        "quoteMr": "“किल्ल्यांच्या सावलीत पेटलेली शेकोटी आणि ताऱ्यांखाली रंगलेल्या गप्पांची रात्र.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pawna Lake • Starlit Horizon",
        "titleMr": "पवना • ताऱ्यांखालील सुंदर कॅम्पिंग सफर",
        "subtitleEn": "Lakeside Camping Hub • Explore Pune",
        "subtitleMr": "कॅम्पिंग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from lakeside camping tents to the mountain peak of Tikona.",
      "twoPhotos": "Photo 1 showcases vast lake with fort silhouette (Acts 1-2); Photo 2 highlights bonfire or tents by the water (Acts 3-5).",
      "threePhotos": "P1: Sunset over Pawna waters; P2: Tents on grassy bank; P3: Evening campfire glow.",
      "fourPhotos": "P1: Lake; P2: Fort silhouette; P3: Tents; P4: Night sky.",
      "fivePlusPhotos": "Cozy, vibrant camping adventure progression with warm firelight."
    }
  },
  "pune-rail-museum": {
    "placeId": "pune-rail-museum",
    "slug": "pune-rail-museum",
    "placeName": "Pune Railway Heritage Museum & Art Gallery",
    "placeNameMr": "पुणे रेल्वे वारसा संग्रहालय व आर्ट गॅलरी (पुणे स्टेशन)",
    "category": "museums",
    "templateTitle": "Pune Rail Museum — Vintage Steam Locomotives & Carriage Lore",
    "templateTitleMr": "पुणे रेल्वे वारसा संग्रहालय • ऐतिहासिक वाफेचे इंजिन व रेल्वे प्रवास",
    "conceptTaglineEn": "The railway heritage museum near Pune Station exhibiting vintage narrow-gauge locomotives, antique signal lamps, and British-era rail memorabilia.",
    "conceptTaglineMr": "पुणे स्टेशनजवळील रेल्वे वारसा संग्रहालय जिथे वाफेचे जुने इंजिन, ऐतिहासिक सिग्नल आणि रेल्वेचा रंजक इतिहास आहे.",
    "subtitle": "Near Pune Station • Pune 411001",
    "elevationOrEra": "Rail Heritage Hub",
    "visualMood": "Polished black iron locomotives, red brass whistle fixtures, vintage semaphore arms, and sepia rail tickets.",
    "palette": {
      "primary": "#b91c1c",
      "secondary": "#18181b",
      "accent": "#fca5a5",
      "overlayGradient": "linear-gradient(180deg, rgba(185,28,28,0.18) 0%, rgba(15,15,20,0.9) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Pune Railway Museum Steam Engine Vintage Heritage Reel",
        "youtubeQuery": "Pune Rail Museum Station Narrow Gauge Locomotives",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "When Steam Iron Ruled the Deccan Tracks",
        "titleMr": "जेव्हा सह्याद्रीच्या घाटात वाफेचे इंजिन धावायचे",
        "subtitleEn": "Pune Railway Heritage Museum, Pune Station",
        "subtitleMr": "पुणे रेल्वे वारसा संग्रहालय, पुणे स्टेशन",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Chronicling 170+ Years of Great Indian Peninsula Railway",
        "titleMr": "जीआयपी रेल्वेचा १७० वर्षांहून जुना देदीप्यमान इतिहास",
        "subtitleEn": "Restored Vintage Steam Locomotives & Carriages",
        "subtitleMr": "सुशोभित केलेली वाफेची खरीखुरी जुनी इंजिने",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Antique Brass Bells, Token Balls & Oil Signal Lamps",
        "titleMr": "पितळी घंटा, टोकन बॉल्स आणि जुने कंदिलाचे सिग्नल",
        "subtitleEn": "Deccan Queen History & The Bhor Ghat Incline Stories",
        "subtitleMr": "डेक्कन क्वीन आणि बोरघाटाच्या थरारक चढाचा इतिहास",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Lifeline That Connected Pune to the World",
        "titleMr": "पुण्याला संपूर्ण देशाशी जोडणारी जीवनवाहिनी",
        "quoteEn": "“Each whistle echoed with the dreams and journeys of millions across a century.”",
        "quoteMr": "“प्रत्येक शिट्टीच्या आवाजात सामावल्या होत्या कोट्यवधी प्रवाशांच्या स्वप्नवत आठवणी.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pune Rail Museum • Iron Tracks of Glory",
        "titleMr": "रेल्वे संग्रहालय • रुळांवरील सुवर्ण इतिहास",
        "subtitleEn": "Industrial Heritage • Explore Pune",
        "subtitleMr": "रेल्वे वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic diagonal zoom along the black locomotive boiler toward the front lantern.",
      "twoPhotos": "Photo 1 showcases full steam locomotive profile (Acts 1-2); Photo 2 details signal lamp or brass wheel fittings (Acts 3-5).",
      "threePhotos": "P1: Museum entrance track; P2: Full steam engine; P3: Antique signaling equipment.",
      "fourPhotos": "P1: Engine; P2: Wheels; P3: Signals; P4: Historic coaches.",
      "fivePlusPhotos": "Rhythmic, industrial locomotive cuts with mechanical motion energy."
    }
  },
  "pune-university-heritage-building": {
    "placeId": "pune-university-heritage-building",
    "slug": "pune-university-heritage-building",
    "placeName": "Savitribai Phule Pune University Heritage Main Building",
    "placeNameMr": "सावित्रीबाई फुले पुणे विद्यापीठ मुख्य हेरिटेज इमारत",
    "category": "heritage",
    "templateTitle": "SPPU Main Building — Italianate Clock Tower & Forest Campus",
    "templateTitleMr": "सावित्रीबाई फुले पुणे विद्यापीठ मुख्य इमारत • इटालियन टॉवर व विस्तीर्ण परिसर",
    "conceptTaglineEn": "The iconic 1864 Italianate-Gothic mansion designed by James Trubshawe as the British Governor’s Monsoon Residence, now the revered heart of Pune University.",
    "conceptTaglineMr": "१८६४ मधील ब्रिटिश गव्हर्नरचा भव्य इटालियन महाल, १०० फूट उंच घड्याळाचा टॉवर आणि सावित्रीबाई फुले पुणे विद्यापीठाची मुख्य इमारत.",
    "subtitle": "Ganeshkhind Road • Pune 411007",
    "elevationOrEra": "Built 1864 (Government House)",
    "visualMood": "100-foot Italianate clock tower, grand sweeping portico, polished teakwood ballroom, and sprawling 411-acre forested estate.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#7dd3fc",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,25,45,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "SPPU Pune University Main Building Clock Tower Drone Reel",
        "youtubeQuery": "Savitribai Phule Pune University Main Heritage Building 4K",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The 100-Foot Clock Tower of the Oxford of the East",
        "titleMr": "‘विद्येचे माहेरघर’ असणाऱ्या पुणे विद्यापीठाचा १०० फूट उंच टॉवर",
        "subtitleEn": "SPPU Main Heritage Building, Ganeshkhind (1864)",
        "subtitleMr": "सावित्रीबाई फुले पुणे विद्यापीठ मुख्य इमारत (१८६४)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built in 1864 as the Monsoon Residence of the Governor of Bombay",
        "titleMr": "१८६४ मध्ये ब्रिटिश गव्हर्नरचा मान्सून राजमहाल म्हणून उभारणी",
        "subtitleEn": "Designed by Architect James Trubshawe in Italianate Style",
        "subtitleMr": "जेम्स ट्रबशॉ यांनी इटालियन शैलीत साकारलेली भव्य वास्तू",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "411-Acre Forested Estate, Teak Ballroom & Quiet Lake Lawns",
        "titleMr": "४११ एकरांचे विस्तीर्ण वन, सागवानी बॉलरूम आणि शांत तलाव",
        "subtitleEn": "Where Hundreds of Thousands of Global Scholars Have Graduated",
        "subtitleMr": "जगभरातील लाखो विद्यार्थ्यांनी ज्ञानार्जन केलेले पवित्र दालन",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Living Crown of Pune’s Academic Prestige",
        "titleMr": "पुण्याच्या शैक्षणिक सन्मानाचा आणि बौद्धिक परंपरेचा मुकुटमणी",
        "quoteEn": "“Under this timeless clock tower, the intellect of Pune has guided India for generations.”",
        "quoteMr": "“या ऐतिहासिक घड्याळाच्या छायेत घडल्या आहेत भारताच्या ज्ञानाचा मार्ग उजळणाऱ्या पिढ्या.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "SPPU Main Building • Temple of Knowledge",
        "titleMr": "पुणे विद्यापीठ • ज्ञानाचे जागतिक अधिष्ठान",
        "subtitleEn": "Educational Heritage • Explore Pune",
        "subtitleMr": "शैक्षणिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the front circular lawn up to the 100-foot Italianate clock tower against the sky.",
      "twoPhotos": "Photo 1 captures the majestic main building portico and clock tower (Acts 1-2); Photo 2 shows lush tree-lined campus road (Acts 3-5).",
      "threePhotos": "P1: Main building front lawn; P2: 100-foot clock tower; P3: Interior ballroom archways.",
      "fourPhotos": "P1: Gate; P2: Portico; P3: Clock tower; P4: Campus lake.",
      "fivePlusPhotos": "Majestic, expansive collegiate architectural progression."
    }
  },
  "purandar-fort": {
    "placeId": "purandar-fort",
    "slug": "purandar-fort",
    "placeName": "Purandar Fort (Birthplace of Sambhaji Maharaj)",
    "placeNameMr": "पुरंदर किल्ला (छत्रपती संभाजी महाराजांचे जन्मस्थान)",
    "category": "forts",
    "templateTitle": "Purandar Fort — Birthplace of Sambhaji Maharaj & Vajragad Sentinel",
    "templateTitleMr": "पुरंदर • छत्रपती संभाजी महाराजांचे जन्मस्थान व वज्रगडाचा अजिंक्य पहारा",
    "conceptTaglineEn": "The formidable twin fortress where Chhatrapati Sambhaji Maharaj was born in 1657, immortalized by Murarbaji Deshpande’s legendary defense.",
    "conceptTaglineMr": "१६५७ मध्ये छत्रपती संभाजी महाराजांचे जन्मस्थान आणि मुरारबाजी देशपांड्यांच्या अतुलनीय शौर्याने पावन झालेला भव्य पुरंदर.",
    "subtitle": "Saswad, Purandar • Pune 412205",
    "elevationOrEra": "Elevation 1,387 m",
    "visualMood": "Twin hill peaks, sweeping Saswad plains, soaring eagle perches, historic church ruins, and heroic Maratha ramparts.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#451a03",
      "accent": "#fbbf24",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(15,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.22) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Murarbaji Deshpande Purandar Fort Powada Reel",
        "youtubeQuery": "Purandar Fort Drone 4K Birthplace of Sambhaji Maharaj",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "1,387 Metres — The Twin Bulwarks of Purandar & Vajragad",
        "titleMr": "पुरंदर आणि वज्रगड — सह्याद्रीचे दोन अभेद्य पहारेकरी",
        "subtitleEn": "Birthplace of Chhatrapati Sambhaji Maharaj (1657)",
        "subtitleMr": "छत्रपती संभाजी महाराजांचे पवित्र जन्मस्थान",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Site of the Historic Treaty of Purandar (1665)",
        "titleMr": "१६६५ मधील ऐतिहासिक पुरंदरचा तह",
        "subtitleEn": "Where Murarbaji Deshpande Fought to His Dying Breath",
        "subtitleMr": "मुरारबाजी देशपांड्यांचे अतुलनीय बलिदान आणि पराक्रम",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Dilli Darwaza, Kedareshwar Temple & Royal Bastions",
        "titleMr": "दिल्ली दरवाजा, केदारेश्वर मंदिर आणि बालेकिल्ल्याची तटबंदी",
        "subtitleEn": "Statue of Murarbaji & Sweeping Views Over Saswad Valley",
        "subtitleMr": "मुरारबाजींचा पुतळा आणि सासवड खोऱ्याचे विहंगम दृश्य",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Epic of Loyalty Written in Steel and Sacrifice",
        "titleMr": "मातृभूमीसाठी प्राणांची आहुती देणाऱ्या निष्ठेची गाथा",
        "quoteEn": "“Murarbaji fell with sword in hand, leaving his name immortal on these stones.”",
        "quoteMr": "“मुरारबाजींच्या रक्ताने पावन झालेली ही भूमी पराक्रमाची अखंड साक्ष देते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Purandar • Citadel of the Brave",
        "titleMr": "पुरंदर • शौर्य आणि बलिदानाची अमर भूमी",
        "subtitleEn": "Heroic Heritage • Explore Pune",
        "subtitleMr": "ऐतिहासिक दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning along the massive stone walls up to the Kedareshwar peak.",
      "twoPhotos": "Photo 1 showcases twin peak horizon (Acts 1-2); Photo 2 focuses on Murarbaji memorial and stone gates (Acts 3-5).",
      "threePhotos": "P1: Twin fort profile; P2: Dilli Darwaza gate; P3: Murarbaji statue summit.",
      "fourPhotos": "P1: Fort road; P2: Gate; P3: Church ruins; P4: Kedareshwar top.",
      "fivePlusPhotos": "Heroic cinematic montage honoring the Maratha warriors."
    }
  },
  "raja-dinkar-kelkar-museum": {
    "placeId": "raja-dinkar-kelkar-museum",
    "slug": "raja-dinkar-kelkar-museum",
    "placeName": "Raja Dinkar Kelkar Museum",
    "placeNameMr": "राजा दिनकर केळकर वस्तुसंग्रहालय",
    "category": "museums",
    "templateTitle": "Raja Dinkar Kelkar Museum — Mastani Mahal & 20,000 Treasures",
    "templateTitleMr": "राजा दिनकर केळकर संग्रहालय • मस्तानी महाल व २०,००० दुर्मिळ कलाकृती",
    "conceptTaglineEn": "The monumental life work of Dr. D.G. Kelkar housing 20,000 priceless artifacts of everyday Indian craftsmanship and the rebuilt Mastani Mahal.",
    "conceptTaglineMr": "डॉ. दिनकर गंगाधर केळकर यांनी आयुष्यभरात जमवलेला २०,००० दुर्मिळ वस्तूंचा खजिना आणि पुनर्निर्मित मस्तानी महाल.",
    "subtitle": "Shukrawar Peth • Pune 411002",
    "elevationOrEra": "Founded 1962",
    "visualMood": "Intricate carved teakwood, brass lamps, ornate chandeliers, musical veenas, and regal Peshwa mirrors.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.22) 0%, rgba(20,10,3,0.9) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.15) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "cinematic_blur",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Kelkar Museum Pune Mastani Mahal Classical Reel",
        "youtubeQuery": "Raja Dinkar Kelkar Museum Pune Indian Artifacts Sitar",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "One Man’s 60-Year Obsession with Indian Art",
        "titleMr": "एका अवलियाने ६० वर्षे जपलेला भारतीय कलेचा खजिना",
        "subtitleEn": "Raja Dinkar Kelkar Museum, Shukrawar Peth",
        "subtitleMr": "राजा दिनकर केळकर संग्रहालय, शुक्रवार पेठ",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "20,000 Rare Artifacts Dedicated to a Lost Son",
        "titleMr": "अल्पायुषी पुत्राच्या स्मृतीस समर्पित २०,००० दुर्मिळ वस्तू",
        "subtitleEn": "Craftsmanship from Every Corner of India",
        "subtitleMr": "काश्मीरपासून कन्याकुमारीपर्यंतची अद्वितीय शिल्पे",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Recreated Splendour of Mastani Mahal",
        "titleMr": "हुबेहूब उभा केलेला मस्तानी महालाचा राजदरबार",
        "subtitleEn": "Carved Teakwood Doors, Ancient Sitar & Royal Hookahs",
        "subtitleMr": "कोरीव सागवानी दारे, वाद्ये, दिवे आणि पेशवेकालीन वैभव",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Ordinary Daily Objects Become Timeless Art",
        "titleMr": "रोजच्या वापरातील वस्तूंनाही जिथे अमर कलेचे रूप मिळाले",
        "quoteEn": "“An extraordinary tribute to the anonymous artisans whose hands shaped India’s beauty.”",
        "quoteMr": "“भारतीय कारागिरांच्या सुवर्ण बोटांना डॉ. केळकरांनी अर्पण केलेले त्रिवार वंदन.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Kelkar Museum • The Jewel of Pune",
        "titleMr": "केळकर संग्रहालय • पुण्याचा जागतिक कला ठेवा",
        "subtitleEn": "Museum of Excellence • Explore Pune",
        "subtitleMr": "अद्वितीय कला वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan revealing the Mastani Mahal chandeliers and ornate carved wood ceilings.",
      "twoPhotos": "Photo 1 showcases grand carved entrance doors (Acts 1-2); Photo 2 focuses on Mastani Mahal court interior (Acts 3-5).",
      "threePhotos": "P1: Heritage building exterior; P2: Mastani Mahal hall; P3: Vintage musical instruments gallery.",
      "fourPhotos": "P1: Facade; P2: Wood carvings; P3: Mastani court; P4: Brass lamps.",
      "fivePlusPhotos": "Regal classical museum walkthrough with golden ambient grading."
    }
  },
  "rajgad-fort": {
    "placeId": "rajgad-fort",
    "slug": "rajgad-fort",
    "placeName": "Rajgad Fort (King of Forts)",
    "placeNameMr": "राजगड किल्ला (राजांचा राजा)",
    "category": "forts",
    "templateTitle": "Rajgad Fort — The Unconquered King of Forts & Swarajya Capital",
    "templateTitleMr": "राजगड • राजांचा राजा, दुर्गांचा दुर्ग आणि स्वराज्याची पहिली राजधानी",
    "conceptTaglineEn": "The supreme royal capital of Chhatrapati Shivaji Maharaj for 26 unbroken years, crowned by Balekilla and three formidable Machis.",
    "conceptTaglineMr": "छत्रपती शिवाजी महाराजांची सलग २६ वर्षे राजधानी राहिलेला, बालेकिल्ला आणि तीन प्रचंड माच्यांनी वेढलेला राजांचा राजा.",
    "subtitle": "Gunjawane, Velhe • Pune 412213",
    "elevationOrEra": "Elevation 1,376 m",
    "visualMood": "Towering triangular pyramid summit, sheer vertical cliff drop, ancient stone cisterns, and royal Maratha sovereignty.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#1c1917",
      "accent": "#f59e0b",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.18) 0%, rgba(10,8,6,0.92) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.22) brightness(0.96)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.22,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.4
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Rajgad Fort Balekilla Trek Reel / King of Forts",
        "youtubeQuery": "Rajgad Fort Drone 4K King of Forts Shivaji Maharaj",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The King of Forts & Capital of Swarajya",
        "titleMr": "राजांचा राजा आणि हिंदवी स्वराज्याची पहिली राजधानी",
        "subtitleEn": "1,376 Metres Above Sea Level",
        "subtitleMr": "समुद्रसपाटीपासून १,३७६ मीटर उंच अद्वितीय दुर्ग",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "26 Glorious Years of Chhatrapati Shivaji Maharaj",
        "titleMr": "शिवरायांच्या राजधानीचा सलग २६ वर्षांचा गौरवशाली काळ",
        "subtitleEn": "Padmavati, Suvela & Sanjivani Machis",
        "subtitleMr": "पद्मावती, सुवेळा आणि संजिवनी माचींची अभेद्य तटबंदी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Needle’s Eye (Nedhe) & Steeper Balekilla Climb",
        "titleMr": "सुवेळा माचीचे प्रसिद्ध नेढे आणि बालेकिल्ल्याची सरळ चढण",
        "subtitleEn": "Where Plans to Free the Maratha Homeland Were Forged",
        "subtitleMr": "जिथे स्वतंत्र भारताचे स्वप्न प्रत्यक्ष सत्यात उतरले",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "An Unvanquished Giant in the Sahyadri Skies",
        "titleMr": "सह्याद्रीच्या नभात उभा असलेला अजिंक्य महामेरू",
        "quoteEn": "“To stand on Balekilla is to touch the very soul of Swarajya.”",
        "quoteMr": "“राजगडाच्या बालेकिल्ल्यावर उभे राहणे म्हणजे साक्षात स्वराज्याच्या आत्म्याला स्पर्श करणे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Rajgad • The Supreme Citadel of Kings",
        "titleMr": "राजगड • दुर्गराज आणि सह्याद्रीचा मुकुटमणी",
        "subtitleEn": "Swarajya Capital • Explore Pune",
        "subtitleMr": "राजधानी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Upward dynamic tilt from Sanjivani Machi ridges climbing to the Balekilla apex.",
      "twoPhotos": "Photo 1 captures the three Machis panorama (Acts 1-2); Photo 2 zooms into Balekilla ascent (Acts 3-5).",
      "threePhotos": "P1: Distant pyramid profile; P2: Suvela Nedhe rock formation; P3: Balekilla stone steps.",
      "fourPhotos": "P1: Base trek; P2: Machi wall; P3: Nedhe hole; P4: Balekilla summit.",
      "fivePlusPhotos": "Epic cinematic journey montage with thunderous dhol drops."
    }
  },
  "rajiv-gandhi-zoological-park": {
    "placeId": "rajiv-gandhi-zoological-park",
    "slug": "rajiv-gandhi-zoological-park",
    "placeName": "Rajiv Gandhi Zoological Park (Katraj Zoo)",
    "placeNameMr": "राजीव गांधी प्राणीसंग्रहालय व कात्रज सर्पोद्यान",
    "category": "parks",
    "templateTitle": "Rajiv Gandhi Zoological Park — Wildlife Sanctuary & Katraj Lake",
    "templateTitleMr": "राजीव गांधी प्राणीसंग्रहालय • कात्रज सर्पोद्यान व वन्यजीव संवर्धन",
    "conceptTaglineEn": "A vast 130-acre conservation reserve flanking Katraj Lake, renowned for Bengal tigers and its famous snake park.",
    "conceptTaglineMr": "कात्रज तलावाकाठचे १३० एकरांचे विशाल प्राणीसंग्रहालय जिथे पांढरे वाघ, बिबटे आणि प्रसिद्ध सर्पोद्यान आहे.",
    "subtitle": "Katraj • Pune 411046",
    "elevationOrEra": "Established 1999",
    "visualMood": "Deep forest enclosures, shimmering lake waters, alert leopard gazes, and family exploration pathways.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#713f12",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(113,63,18,0.2) 0%, rgba(20,12,3,0.88) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Katraj Zoo Pune Reel / Rajiv Gandhi Zoological Park White Tiger",
        "youtubeQuery": "Katraj Snake Park Pune Wildlife Documentary",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "130 Acres of Wildlife by Katraj Lake",
        "titleMr": "कात्रज तलावाकाठचे १३० एकरांचे वन्यजीव साम्राज्य",
        "subtitleEn": "Rajiv Gandhi Zoological Park, Katraj",
        "subtitleMr": "राजीव गांधी प्राणीसंग्रहालय, कात्रज",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Home of the Royal Bengal Tiger & Leopards",
        "titleMr": "रॉयल बंगाल टायगर आणि चपळ बिबट्यांचे दर्शन",
        "subtitleEn": "Pioneered by Herpetologist Neelam Kumar Khaire",
        "subtitleMr": "नीलम कुमार खैरे यांच्या सर्पोद्यानाचा वारसा",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Katraj Snake Park & King Cobra Sanctuary",
        "titleMr": "प्रसिद्ध कात्रज सर्पोद्यान व किंग कोब्रा संवर्धन",
        "subtitleEn": "Spotted Deer, Elephants & Native Sahyadri Reptiles",
        "subtitleMr": "चितळ, हत्ती, पक्षी आणि सह्याद्रीतील दुर्मिळ सरपटणारे प्राणी",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Connecting Pune’s Next Generation to Nature",
        "titleMr": "नवीन पिढीला निसर्ग आणि प्राण्यांशी जोडणारा सेतू",
        "quoteEn": "“Protecting the wild wonders of the Western Ghats for tomorrow.”",
        "quoteMr": "“पश्चिम घाटातील समृद्ध वन्यजीव संपदेचे रक्षण व संवर्धन.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Katraj Zoo • Pune’s Wild Horizon",
        "titleMr": "कात्रज प्राणीसंग्रहालय • वन्यजीव संवर्धनाचा अभिमान",
        "subtitleEn": "Conservation Haven • Explore Pune",
        "subtitleMr": "वन्यजीव वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Deep dynamic push-in toward the wildlife enclosure framed by lush green trees.",
      "twoPhotos": "Photo 1 highlights lake view and park pathway (Acts 1-2); Photo 2 shows tiger/leopard enclosure (Acts 3-5).",
      "threePhotos": "P1: Grand entrance; P2: Katraj Lake panoramic view; P3: Animal enclosure.",
      "fourPhotos": "P1: Gate; P2: Safari path; P3: Snake park; P4: Tiger habitat.",
      "fivePlusPhotos": "Adventurous high-energy wildlife progression."
    }
  },
  "rajmachi-fort": {
    "placeId": "rajmachi-fort",
    "slug": "rajmachi-fort",
    "placeName": "Rajmachi Fort (Shrivardhan & Manaranjan)",
    "placeNameMr": "राजमाची किल्ला (श्रीवर्धन व मनरंजन बालेकिल्ले)",
    "category": "forts",
    "templateTitle": "Rajmachi Fort — Twin Citadels of Shrivardhan & Manaranjan",
    "templateTitleMr": "राजमाची • श्रीवर्धन-मनरंजन बालेकिल्ले व बोरघाटाची अभेद्य राखण",
    "conceptTaglineEn": "The legendary strategic outpost guarding Bor Ghat, renowned for its twin fortified peaks, Udhewadi village, and spectacular monsoon firefly trails.",
    "conceptTaglineMr": "बोरघाटाच्या व्यापारी मार्गावर पहारा देणारा, श्रीवर्धन व मनरंजन या जुळ्या बालेकिल्ल्यांचा निसर्गरम्य ऐतिहासिक दुर्ग.",
    "subtitle": "Lonavala-Khandala • Pune 410401",
    "elevationOrEra": "Elevation 829 m",
    "visualMood": "Deep dense forest trails, rushing mountain streams, twin stone crowns rising from mist, and mystical evening firefly glows.",
    "palette": {
      "primary": "#15803d",
      "secondary": "#064e3b",
      "accent": "#86efac",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.2) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.25) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Rajmachi Fort Fireflies Festival Trek Reel / Lonavala",
        "youtubeQuery": "Rajmachi Fort Twin Peaks 4K Drone Shrivardhan Manaranjan",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Guardians of the Historic Bor Ghat",
        "titleMr": "ऐतिहासिक बोरघाटाचे दोन अभेद्य पहारेकरी",
        "subtitleEn": "Shrivardhan & Manaranjan Citadels",
        "subtitleMr": "श्रीवर्धन आणि मनरंजन बालेकिल्ले",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commanding Ancient Trade Routes from Mumbai to Pune",
        "titleMr": "मुंबई-पुणे व्यापारी मार्गावर शतकानुशतके पहारा",
        "subtitleEn": "Fortified by the Satvahanas, Bahmanis & Shivaji Maharaj",
        "subtitleMr": "सातवाहनांपासून शिवरायांपर्यंतचा समृद्ध इतिहास",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Udhewadi Village, Kalbhairav Temple & Firefly Forests",
        "titleMr": "उधेवाडी गाव, कालभैरव मंदिर आणि काजव्यांचे जंगल",
        "subtitleEn": "Steep Climbing Bastions Above Dense Sahyadri Valleys",
        "subtitleMr": "दाट जंगलातून जाणारी पायवाट आणि खळाळणारे ओहोळ",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Cloud Castles Rise from the Jungle Canopy",
        "titleMr": "हिरव्यागार जंगलातून आकाशात झेपावणारे पाषाण किल्ले",
        "quoteEn": "“Twin crowns watching over the misty valleys where trade once carried empires.”",
        "quoteMr": "“व्यापाराची समृद्धी आणि सैन्याच्या हालचालींवर नजर ठेवणारा राजमाची.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Rajmachi • The Twin Crown",
        "titleMr": "राजमाची • बोरघाटाचा निसर्गरम्य मुकुट",
        "subtitleEn": "Historic Outpost • Explore Pune",
        "subtitleMr": "निसर्ग व दुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan starting in misty forest canopy rising up to Shrivardhan citadel peak.",
      "twoPhotos": "Photo 1 showcases twin peak landscape panorama (Acts 1-2); Photo 2 focuses on Shrivardhan stone bastions (Acts 3-5).",
      "threePhotos": "P1: Twin peaks view from trail; P2: Udhewadi village path; P3: Shrivardhan flag top.",
      "fourPhotos": "P1: Forest trek; P2: Waterfall; P3: Gate; P4: Summit vista.",
      "fivePlusPhotos": "Lush green trekking montage with ambient nature flutes."
    }
  },
  "ranjangaon-mahaganpati": {
    "placeId": "ranjangaon-mahaganpati",
    "slug": "ranjangaon-mahaganpati",
    "placeName": "Mahaganpati Mandir, Ranjangaon (Ashtavinayak)",
    "placeNameMr": "महागणपती मंदिर, रांजणगाव (अष्टविनायक)",
    "category": "temples",
    "templateTitle": "Ranjangaon Mahaganpati — The Ten-Trunk Destroyer of Evil",
    "templateTitleMr": "महागणपती रांजणगाव • त्रिपुरासुर वधकारी महापराक्रमी गणपती",
    "conceptTaglineEn": "The eighth Ashtavinayaka temple on the Pune-Ahmednagar highway, where Lord Shiva worshipped Mahaganpati with ten trunks and twenty arms before slaying Tripurasura.",
    "conceptTaglineMr": "पुणे-नगर रस्त्यावरील आठवे अष्टविनायक स्थान, जिथे त्रिपुरासुराचा वध करण्यापूर्वी साक्षात भगवान शंकरांनी महागणपतीची आराधना केली होती.",
    "subtitle": "Shirur Taluka, Ranjangaon • Pune 412209",
    "elevationOrEra": "Ashtavinayak #8 (Tripurasura Legend)",
    "visualMood": "Majestic entrance archway, morning sun shining directly into the sanctum, glowing brass pillars, and colossal temple gates.",
    "palette": {
      "primary": "#dc2626",
      "secondary": "#7f1d1d",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(127,29,29,0.2) 0%, rgba(25,5,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.25) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Ranjangaon Mahaganpati Ashtavinayak 8 Pune Reel",
        "youtubeQuery": "Ranjangaon Mahaganpati Temple 4K Drone Tripurasur Legend",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #8 — The Mighty Mahaganpati",
        "titleMr": "अष्टविनायक #८ — पराक्रमी महागणपती रांजणगाव",
        "subtitleEn": "Mahaganpati Temple, Shirur Taluka, Pune",
        "subtitleMr": "महागणपती मंदिर, शिरूर, पुणे-नगर महामार्ग",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Worshipped by Lord Shiva Himself to Vanquish Tripurasura",
        "titleMr": "त्रिपुरासुराच्या विनाशासाठी भगवान शंकरांनी केलेली महापूजा",
        "subtitleEn": "Constructed by the Peshwas in 1790 with East-Facing Sanctum",
        "subtitleMr": "१७९० मध्ये पेशव्यांनी उभारलेला पूर्वाभिमुख भव्य सभामंडप",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Sunlight Illuminating the Deity Directly on Equinox Days",
        "titleMr": "सूर्याची किरणे थेट चरणांवर पडणारा अद्भुत वास्तू चमत्कार",
        "subtitleEn": "Secret Underlying Vault with 10-Trunk Mahotkat Idol",
        "subtitleMr": "तळघरात असलेली १० सोंडांची व २० हातांची दुर्मिळ महोत्कट मूर्ती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Ultimate Radiance of Supreme Victorious Power",
        "titleMr": "सर्व नकारात्मक शक्तींचा नाश करणारी पराक्रमी दैवी शक्ती",
        "quoteEn": "“Before Mahaganpati, even the gods bowed to discover their inner strength.”",
        "quoteMr": "“महागणपतीच्या चरणी नतमस्तक होताच मनात असीम आत्मबळ निर्माण होते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Mahaganpati • The Cosmic Ruler",
        "titleMr": "महागणपती • पराक्रम आणि विजयाचे प्रतीक",
        "subtitleEn": "Ashtavinayak Sovereign • Explore Pune",
        "subtitleMr": "अष्टविनायक महातीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Deep dramatic plunge zoom through the grand arched portal toward the east-facing sanctum.",
      "twoPhotos": "Photo 1 captures the grand stone temple archway (Acts 1-2); Photo 2 focuses on Mahaganpati idol (Acts 3-5).",
      "threePhotos": "P1: Temple entrance gate; P2: Stone pillar mandap; P3: Mahaganpati sanctum idol.",
      "fourPhotos": "P1: Road gate; P2: Courtyard; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Heroic, radiant devotional progression with temple drums."
    }
  },
  "rohida-fort": {
    "placeId": "rohida-fort",
    "slug": "rohida-fort",
    "placeName": "Rohida Fort (Vichitragad)",
    "placeNameMr": "रोहिडा किल्ला (विचित्रगड)",
    "category": "forts",
    "templateTitle": "Rohida Fort — The Wind-Swept Bastion of Bhor & Vichitragad",
    "templateTitleMr": "रोहिडा • विचित्रगड व भोर खोऱ्यातील प्रचंड वाऱ्याचा दुर्ग",
    "conceptTaglineEn": "The dramatically wind-swept fortress near Bhor, famous for its roaring gale winds, three magnificent gateways, and deep subterranean water tanks.",
    "conceptTaglineMr": "भोरजवळील वादळी वाऱ्यांचा दुर्ग जिथे तीन भव्य दरवाजे आणि पाषाणातील थंड पाण्याची टाके आजही अखंड उभी आहेत.",
    "subtitle": "Bhor Taluka • Pune 412206",
    "elevationOrEra": "Elevation 1,116 m",
    "visualMood": "Roaring gale winds bending yellow grass, heavy stone gateway arches, deep rock-cut cisterns, and expansive Bhor valley.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#451a03",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Rohida Fort Vichitragad Bhor Wind Trek Reel",
        "youtubeQuery": "Rohida Fort Drone 4K Bhor Vichitragad Gale Winds",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where the Sahyadri Wind Roars Unbroken",
        "titleMr": "अंगावर सोसाट्याचा वारा झेलणारा — रोहिडा",
        "subtitleEn": "Elevation 1,116 m • Also Known as Vichitragad",
        "subtitleMr": "समुद्रसपाटीपासून १,११६ मीटर • विचित्रगड",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Three Intact Historical Gates Carved with Inscriptions",
        "titleMr": "फारसी व देवनागरी शिलालेख असलेले तीन भव्य दरवाजे",
        "subtitleEn": "Held by the Yadavas, Nizamshahi, and Shivaji Maharaj",
        "subtitleMr": "१६५६ मध्ये शिवरायांनी जिंकून मजबूत केलेला किल्ला",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Rohidamalla Temple & Seven Pure Water Cisterns",
        "titleMr": "रोहिडमल्ला देवीचे मंदिर आणि सात गोड्या पाण्याचे टाके",
        "subtitleEn": "Chhatrapati Buruj Bastion Standing Guard Over Bhor",
        "subtitleMr": "छत्रपती बुरूज आणि भोर खोऱ्याचे अथांग दृश्य",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Standing Against the Might of Western Ghat Storms",
        "titleMr": "वादळी वाऱ्यांशी दोन हात करणारी पाषाण तटबंदी",
        "quoteEn": "“The ferocious wind tries to push you back, but the stone gates welcome you into history.”",
        "quoteMr": "“वादळी वारा अडवतो, पण भक्कम दरवाजे तुम्हाला इतिहासात घेऊन जातात.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Rohida • The Wind-Borne Sentinel",
        "titleMr": "रोहिडा • भोरचा शूर पहारेकरी",
        "subtitleEn": "Fort of Vichitragad • Explore Pune",
        "subtitleMr": "ऐतिहासिक दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Speed pan across the massive third gateway with fluttering saffron flag in the wind.",
      "twoPhotos": "Photo 1 showcases stone gate archway (Acts 1-2); Photo 2 shows summit temple and water cisterns (Acts 3-5).",
      "threePhotos": "P1: Distant fort hill; P2: Historic gate staircase; P3: Rohidamalla temple plateau.",
      "fourPhotos": "P1: Trail; P2: First gate; P3: Second gate; P4: Top bastion.",
      "fivePlusPhotos": "Wind-driven high mountain progression with rapid cuts."
    }
  },
  "sambhaji-park": {
    "placeId": "sambhaji-park",
    "slug": "sambhaji-park",
    "placeName": "Chhatrapati Sambhaji Garden",
    "placeNameMr": "छत्रपती संभाजी महाराज उद्यान",
    "category": "parks",
    "templateTitle": "Chhatrapati Sambhaji Garden — JM Road’s Rose Shaded Walk",
    "templateTitleMr": "छत्रपती संभाजी महाराज उद्यान • जेएम रस्त्यावरील सुंदर गुलाब बाग व मत्स्यालय",
    "conceptTaglineEn": "A lush civic sanctuary on Jangli Maharaj Road featuring award-winning rose gardens, open-air walking trails, and an aquarium.",
    "conceptTaglineMr": "जंगली महाराज रस्त्यावरील हिरवेगार शांत उद्यान जिथे रंगीबेरंगी गुलाब बाग, मत्स्यालय आणि निसर्गरम्य वॉकिंग ट्रेल आहे.",
    "subtitle": "JM Road, Shivajinagar • Pune 411005",
    "elevationOrEra": "Civic Heritage Garden",
    "visualMood": "Blooming crimson and yellow roses, paved walking paths under raintrees, fountain ripples, and afternoon serenity.",
    "palette": {
      "primary": "#e11d48",
      "secondary": "#047857",
      "accent": "#fecdd3",
      "overlayGradient": "linear-gradient(180deg, rgba(4,120,87,0.18) 0%, rgba(10,25,15,0.88) 100%)",
      "canvasFilter": "contrast(1.06) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Sambhaji Park Pune JM Road Rose Garden Reel",
        "youtubeQuery": "Sambhaji Garden Pune Morning Walk Nature",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Peace Amidst the Buzz of JM Road",
        "titleMr": "गजबजलेल्या जेएम रस्त्यावर निसर्गाचा शांत कट्टा",
        "subtitleEn": "Chhatrapati Sambhaji Maharaj Garden",
        "subtitleMr": "छत्रपती संभाजी महाराज उद्यान, शिवाजीनगर",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Award-Winning Rose Varieties & Shaded Raintrees",
        "titleMr": "रंगीबेरंगी सुगंधित गुलाब आणि डेरेदार वृक्ष",
        "subtitleEn": "Pune Municipal Corporation’s Showcase Park",
        "subtitleMr": "पुणेकरांचे आवडते सकाळचे फिरण्याचे ठिकाण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Fountain Spray, Kids Aquarium & Walking Trails",
        "titleMr": "कारंजे, लहान मुलांचे मत्स्यालय आणि निसर्गरम्य मार्ग",
        "subtitleEn": "Senior Citizen Khattas & Morning Yoga Solitude",
        "subtitleMr": "ज्येष्ठ नागरिकांच्या गप्पा आणि सकाळचा प्रसन्न योग",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Green Oasis Breathing Life into Shivajinagar",
        "titleMr": "शहराच्या धावपळीत मन ताजेतवाने करणारी हिरवळ",
        "quoteEn": "“Just footsteps from bustling traffic lies an island of complete natural calm.”",
        "quoteMr": "“वाहनांच्या गजबजाटापासून अवघ्या काही पावलांवर अनुभवा संपूर्ण शांतता.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sambhaji Park • Pune’s Blooming Haven",
        "titleMr": "संभाजी उद्यान • प्रसन्न सकाळची गोड भेट",
        "subtitleEn": "Urban Garden Sanctuary • Explore Pune",
        "subtitleMr": "शहरी उद्यान • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow lateral drift across the rose beds toward the central walking canopy.",
      "twoPhotos": "Photo 1 showcases main arched walkway (Acts 1-2); Photo 2 focuses on rose blossoms (Acts 3-5).",
      "threePhotos": "P1: Entrance signage; P2: Rose garden beds; P3: Tree-canopied walking track.",
      "fourPhotos": "P1: Gate; P2: Roses; P3: Aquarium facade; P4: Sunset benches.",
      "fivePlusPhotos": "Fresh, bright botanical montage with soft pastel grading."
    }
  },
  "sangam-ghat-sangameshwar-temple": {
    "placeId": "sangam-ghat-sangameshwar-temple",
    "slug": "sangam-ghat-sangameshwar-temple",
    "placeName": "Sangam Ghat & Sangameshwar Temple",
    "placeNameMr": "संगम घाट व संगमेश्वर ऐतिहासिक शिवमंदिर (पुणे)",
    "category": "heritage",
    "templateTitle": "Sangam Ghat — Confluence of Mula and Mutha",
    "templateTitleMr": "संगम घाट व संगमेश्वर ऐतिहासिक शिवमंदिर • पुण्याचा पवित्र संगम",
    "conceptTaglineEn": "The historic river confluence of Mula and Mutha, where 18th-century stone ghats, ancient Shiva shrines, and British Residency treaty grounds converge.",
    "conceptTaglineMr": "मुळा आणि मुठा नद्यांच्या पवित्र संगमावर वसलेले, पेशवेकालीन दगडी घाट आणि ऐतिहासिक संगमेश्वर शिवमंदिर.",
    "subtitle": "Sangamvadi • Pune 411001",
    "elevationOrEra": "Peshwa Era Confluence & Ghats",
    "visualMood": "Merging twin river currents, ancient dark basalt flight of ghat steps, white temple spire, and historical treaty resonance.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,25,45,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Sangam Ghat Pune Mula Mutha Confluence Heritage Reel",
        "youtubeQuery": "Sangam Ghat Sangameshwar Temple Pune 4K Drone History",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Mula Meets Mutha — The Sacred Sangam of Pune",
        "titleMr": "मुळा आणि मुठा नद्यांचा पवित्र संगम — संगम घाट",
        "subtitleEn": "Sangam Ghat & Sangameshwar Mandir, Sangamvadi",
        "subtitleMr": "संगम घाट व संगमेश्वर मंदिर, संगमवाडी, पुणे",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Historic Confluence Where Maratha Diplomats Met the British",
        "titleMr": "जिथे पेशव्यांचे मुत्सद्दी आणि ब्रिटिश रेसिडेंट यांच्या वाटाघाटी झाल्या",
        "subtitleEn": "Stone Bathing Ghats Built by the Peshwas in 18th Century",
        "subtitleMr": "१८व्या शतकात पेशव्यांनी बांधलेले विस्तीर्ण दगडी स्नान घाट",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Ancient Shivalinga, Old Banyan Trees & Merging Currents",
        "titleMr": "प्राचीन संगमेश्वर शिवलिंग, जुने वटवृक्ष आणि संगमाच्या लाटा",
        "subtitleEn": "Site of the Historic British Residency and Mountstuart Elphinstone",
        "subtitleMr": "माऊंटस्टुअर्ट एल्फिन्स्टन यांच्या रेसिडेन्सीचा ऐतिहासिक परिसर",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where the Pulse of Pune’s Waters and History Merge",
        "titleMr": "पुण्याच्या जीवनवाहिन्यांचा आणि इतिहासाचा एकत्र येणारा संगम",
        "quoteEn": "“Standing at the sangam, one feels the timeless flow of water that has washed centuries of Pune’s destiny.”",
        "quoteMr": "“संगमाच्या पायऱ्यांवर उभे राहताच पुण्याच्या नशिबाला आकार देणारा इतिहास डोळ्यांसमोर उभा राहतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sangam Ghat • The Confluence of Ages",
        "titleMr": "संगम घाट • इतिहासाचा पावन संगम",
        "subtitleEn": "Riverfront Heritage • Explore Pune",
        "subtitleMr": "नदीतीर्थ वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the merging river waters up the stone ghat steps to the Sangameshwar temple spire.",
      "twoPhotos": "Photo 1 captures the river confluence and stone bathing steps (Acts 1-2); Photo 2 shows Sangameshwar temple sanctum (Acts 3-5).",
      "threePhotos": "P1: Confluence of Mula-Mutha; P2: Stone ghat steps; P3: Sangameshwar temple entrance.",
      "fourPhotos": "P1: River; P2: Ghat; P3: Spire; P4: Shivalinga.",
      "fivePlusPhotos": "Serene, historically grounded river confluence progression with classical sitar tones."
    }
  },
  "sangvi-sangameshwar-temple": {
    "placeId": "sangvi-sangameshwar-temple",
    "slug": "sangvi-sangameshwar-temple",
    "placeName": "Sangameshwar Mahadev Temple (Old Sangvi)",
    "placeNameMr": "संगमेश्वर महादेव मंदिर (जुनी सांगवी, पवना-मुळा संगम)",
    "category": "temples",
    "templateTitle": "Sangvi Sangameshwar — Confluence of Pavana and Mula",
    "templateTitleMr": "संगमेश्वर महादेव मंदिर जुनी सांगवी • पवना-मुळा संगम शिवमंदिर",
    "conceptTaglineEn": "The historic river-confluence Shiva temple in Old Sangvi, situated at the sacred meeting of Pavana and Mula rivers, dating back to the Yadava era.",
    "conceptTaglineMr": "जुनी सांगवी येथील पवना आणि मुळा नद्यांच्या पवित्र संगमावर वसलेले, यादवकालीन ऐतिहासिक संगमेश्वर शिवमंदिर.",
    "subtitle": "Old Sangvi, PCMC • Pune 411027",
    "elevationOrEra": "Yadava / Peshwa Era Confluence",
    "visualMood": "Two merging river currents, broad stone bathing ghats, whitewashed temple shikhara, and tranquil river breezes.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#075985",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(7,89,133,0.18) 0%, rgba(10,25,45,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Sangameshwar Temple Sangvi Pune River Confluence Reel",
        "youtubeQuery": "Sangvi Sangameshwar Temple Mula Pavana Sangam 4K Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Pavana Meets Mula at the Holy Sangam",
        "titleMr": "पवना आणि मुळा नद्यांच्या पवित्र संगमावर",
        "subtitleEn": "Sangameshwar Mahadev Mandir, Old Sangvi",
        "subtitleMr": "संगमेश्वर महादेव मंदिर, जुनी सांगवी",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "An Ancient River Confluence Shrine of the Yadava Era",
        "titleMr": "यादवकाळापासून चालत आलेले पवित्र नदी संगम तीर्थ",
        "subtitleEn": "Surrounded by Wide Stone Bathing Ghats",
        "subtitleMr": "विस्तीर्ण दगडी घाट आणि संथ पाण्याचे प्रवाह",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Ancient Shivalinga, Nandi Mandapa & Gentle River Breezes",
        "titleMr": "प्राचीन शिवलिंग, नंदी मंडप आणि नदीवरून येणारा गार वारा",
        "subtitleEn": "Quiet Evening Prayers with Waters Merging on Both Sides",
        "subtitleMr": "दोन्ही बाजूंनी वाहणाऱ्या पाण्याच्या साक्षीने होणारी आरती",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Two Rivers Merge into a Single Sacred Current",
        "titleMr": "दोन नद्यांच्या मिलनासारखीच भक्ताची ईश्वराशी होणारी एकरूपता",
        "quoteEn": "“At the meeting of waters, the soul finds its quietest reflection.”",
        "quoteMr": "“नद्यांच्या संगमावर उभे राहताच मनाला मिळते अथांग तृप्ती आणि शांती.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sangameshwar • The Sacred Sangam",
        "titleMr": "संगमेश्वर • नद्यांच्या संगमावरील पावन तीर्थ",
        "subtitleEn": "River Confluence Sanctuary • Explore Pune",
        "subtitleMr": "संगम तीर्थ वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth horizontal pan across the merging river waters up to the white temple spire on the bank.",
      "twoPhotos": "Photo 1 captures the river confluence and stone ghats (Acts 1-2); Photo 2 shows Shivalinga sanctum (Acts 3-5).",
      "threePhotos": "P1: Confluence water view; P2: Stone river ghat steps; P3: Sangameshwar temple entrance.",
      "fourPhotos": "P1: River; P2: Ghat; P3: Spire; P4: Sanctum.",
      "fivePlusPhotos": "Tranquil river water progression with soft evening reflections."
    }
  },
  "sarasbaug": {
    "placeId": "sarasbaug",
    "slug": "sarasbaug",
    "placeName": "Saras Baug & Talyatla Ganpati",
    "placeNameMr": "सारसबाग व तळ्यातला गणपती",
    "category": "parks",
    "templateTitle": "Sarasbaug — Island Ganpati in Historic Lotus Waters",
    "templateTitleMr": "सारसबाग • तळ्यातला गणपती, हिरवेगार लॉन्स व भेळ कट्टा",
    "conceptTaglineEn": "The beloved 18th-century Peshwa park featuring the revered Talyatla Ganpati temple and family evening promenades.",
    "conceptTaglineMr": "सवाई माधवराव पेशव्यांच्या काळातील ऐतिहासिक बाग जिथे तळ्यातील गणपतीचे दर्शन आणि कुटुंबियांची सायंकाळ रंगते.",
    "subtitle": "Near Swargate • Pune 411030",
    "elevationOrEra": "Built 1784 AD",
    "visualMood": "Reflective moat waters, golden sunset over temple spires, lush manicured lawns, and bustling bhel stalls.",
    "palette": {
      "primary": "#f59e0b",
      "secondary": "#b45309",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(180,83,9,0.18) 0%, rgba(25,12,3,0.88) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Sarasbaug Pune Sunset Reel / Talyatla Ganpati Mandir",
        "youtubeQuery": "Sarasbaug Pune History Talyatla Ganpati Peshwa",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Pune’s Cherished Sunset Sanctuary",
        "titleMr": "पुणेकरांची आवडती सायंकाळची विरंगुळा जागा",
        "subtitleEn": "Sarasbaug & Talyatla Ganpati",
        "subtitleMr": "सारसबाग व ऐतिहासिक तळ्यातला गणपती",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commissioned in 1784 by Sawai Madhavrao Peshwa",
        "titleMr": "१७८४ मध्ये सवाई माधवराव पेशव्यांनी उभारलेले उद्यान",
        "subtitleEn": "Built as an Island Shrine in a Historic Lake",
        "subtitleMr": "तलावाच्या मध्यभागी वसलेले देखणे शिव-गणेश मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Evening Bells, Water Fountains & Fresh Bhel",
        "titleMr": "संध्याकाळच्या आरत्या, कारंजे आणि प्रसिद्ध पुणेरी भेळ",
        "subtitleEn": "Parvati Hill Standing Guard on the Horizon",
        "subtitleMr": "क्षितिजावर दिसणारा पार्वती टेकडीचा सुंदर देखावा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Landmark Tied to Every Punekar’s Childhood",
        "titleMr": "प्रत्येक पुणेकराच्या बालपणाशी जोडलेली अनमोल जागा",
        "quoteEn": "“Where prayers at the water temple dissolve into laughter over paper-cone bhel.”",
        "quoteMr": "“तळ्यातल्या बाप्पाचे मनःशांती देणारे दर्शन आणि भेळेच्या कट्ट्यावरील गप्पा.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sarasbaug • Forever in Pune’s Heart",
        "titleMr": "सारसबाग • पुणेकरांच्या आठवणींचे सोनेरी पान",
        "subtitleEn": "Historic Park Icon • Explore Pune",
        "subtitleMr": "ऐतिहासिक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth pan over the temple moat waters rising toward the white and gold shikhar.",
      "twoPhotos": "Photo 1 captures water reflection of the temple (Acts 1-2); Photo 2 shows sunset over lush green lawns (Acts 3-5).",
      "threePhotos": "P1: Temple on moat; P2: Green park lawns; P3: Sunset skyline.",
      "fourPhotos": "P1: Lake; P2: Shikhar; P3: Fountains; P4: Evening lights.",
      "fivePlusPhotos": "Warm golden sunset montage synchronized to devotional bansuri notes."
    }
  },
  "shaniwar-wada": {
    "placeId": "shaniwar-wada",
    "slug": "shaniwar-wada",
    "placeName": "Shaniwar Wada",
    "placeNameMr": "शनिवार वाडा",
    "category": "heritage",
    "templateTitle": "Shaniwar Wada — Imperial Seat of the Maratha Empire",
    "templateTitleMr": "शनिवार वाडा • पेशवाईचे ऐतिहासिक राजवैभव व दिल्ली दरवाजा",
    "conceptTaglineEn": "The imperial headquarters of the Peshwas built in 1732 by Peshwa Bajirao I, witnessing the zenith of Maratha power across the subcontinent.",
    "conceptTaglineMr": "१७३२ मध्ये थोरले बाजीराव पेशव्यांनी उभारलेले मराठा साम्राज्याचे सत्ताकेंद्र, ज्याने भारतावर मराठ्यांच्या पराक्रमाचा सुवर्णकाळ पाहिला.",
    "subtitle": "Shaniwar Peth • Pune 411030",
    "elevationOrEra": "Built 1732 AD (Peshwa Bajirao I)",
    "visualMood": "Regal carved teakwood, imposing stone bastions, massive iron-spiked Dilli Darwaza, and lotus fountain reflections.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#451a03",
      "accent": "#f59e0b",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.18) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Shaniwar Wada Pune History Dilli Darwaza Reel",
        "youtubeQuery": "Shaniwar Wada Pune 4K Drone Walkthrough Bajirao Peshwa",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Seat of the Supreme Peshwas Since 1732",
        "titleMr": "१७३२ मधील थोरले बाजीराव पेशव्यांचे सत्ताकेंद्र",
        "subtitleEn": "Shaniwar Wada • Capital of the Maratha Empire",
        "subtitleMr": "शनिवार वाडा • पेशवाईचे ऐतिहासिक राजवैभव",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Mighty Teak Dilli Darwaza with Iron Elephant Spikes",
        "titleMr": "अणकुचीदार हत्तीप्रतिबंधक खिळ्यांचा भव्य दिल्ली दरवाजा",
        "subtitleEn": "Facing Northward Towards Delhi — The Symbol of Conquest",
        "subtitleMr": "दिल्लीच्या दिशेने उघडणारे मराठ्यांच्या विजयाचे महाद्वार",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Hazari Karanje, Royal Bastions & The Seven-Story Palace Ruins",
        "titleMr": "हजारी कारंजे, ऐतिहासिक बुरूज आणि सात मजली महालाचे अवशेष",
        "subtitleEn": "Courtyards Where Rulers Decided the Fate of India",
        "subtitleMr": "जिथून अटकेपार झेंडे लावणाऱ्या पेशव्यांनी भारत घडवला",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Echoes of Glory Standing Defiant in Living Stone",
        "titleMr": "काळाच्या ओघातही ताठ मानेने उभी असलेली ऐतिहासिक तटबंदी",
        "quoteEn": "“Through these spiked gates once rode the armies that planted the saffron flag in Delhi.”",
        "quoteMr": "“या भव्य दिल्ली दरवाजातून निघालेल्या मराठा सैन्याने अटकेपार भगवा फडकवला होता.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Shaniwar Wada • Heart of Historic Pune",
        "titleMr": "शनिवार वाडा • पुण्याच्या वैभवाची अमर साक्ष",
        "subtitleEn": "Imperial Maratha Monument • Explore Pune",
        "subtitleMr": "मराठा साम्राज्य वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning from the iron spikes of Dilli Darwaza up to the saffron flag on the ramparts.",
      "twoPhotos": "Photo 1 captures Dilli Darwaza stone gates (Acts 1-2); Photo 2 shows Hazari Karanje fountain garden (Acts 3-5).",
      "threePhotos": "P1: Dilli Darwaza facade; P2: Rampart walls and garden; P3: Hazari Karanje fountain court.",
      "fourPhotos": "P1: Gate; P2: Spikes; P3: Fountain; P4: Sunset bastions.",
      "fivePlusPhotos": "Regal, epic historical progression with classical sitar and tanpura drones."
    }
  },
  "shinde-chhatri": {
    "placeId": "shinde-chhatri",
    "slug": "shinde-chhatri",
    "placeName": "Shinde Chhatri (Mahadji Shinde Memorial)",
    "placeNameMr": "शिंदे छत्री (महादजी शिंदे स्मारक)",
    "category": "heritage",
    "templateTitle": "Shinde Chhatri — Rajasthani-Anglo Splendour of Mahadji Shinde",
    "templateTitleMr": "शिंदे छत्री • महादजी शिंद्यांची राजस्थानी-अँग्लो कोरीव वास्तू",
    "conceptTaglineEn": "The majestic 18th-century memorial in Wanowrie honouring Maratha general Mahadji Shinde, celebrated for its intricate yellow-and-orange stone carvings and stained glass.",
    "conceptTaglineMr": "वानवडी येथील १८व्या शतकातील मराठा सेनापती महादजी शिंद्यांचे स्मारक, जे राजस्थानी पाषाण शिल्पे आणि रंगीबेरंगी काचांच्या खिडक्यांसाठी प्रसिद्ध आहे.",
    "subtitle": "Wanowrie • Pune 411040",
    "elevationOrEra": "Built 1794 AD (Shinde Dynasty)",
    "visualMood": "Warm orange and golden stone carvings, European stained-glass windows, multi-tiered Shiva shikhara, and tranquil aristocratic courtyards.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fef08a",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Shinde Chhatri Pune Wanowrie Rajasthani Architecture Reel",
        "youtubeQuery": "Shinde Chhatri Pune Mahadji Shinde Memorial Drone 4K",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Memorial to the Great Maratha General Mahadji Shinde",
        "titleMr": "महान मराठा मुत्सद्दी व सेनापती महादजी शिंद्यांचे स्मारक",
        "subtitleEn": "Shinde Chhatri, Wanowrie (1794)",
        "subtitleMr": "शिंदे छत्री, वानवडी, पुणे (१७९४)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "A Stunning Fusion of Rajasthani & Anglo-Gothic Stonework",
        "titleMr": "राजस्थानी आणि अँग्लो-गॉथिक वास्तुकलेचा विस्मयकारक संगम",
        "subtitleEn": "Built in Yellow Sandstone by the Scindia Dynasty of Gwalior",
        "subtitleMr": "ग्वाल्हेरच्या शिंदे घराण्याने पिवळ्या पाषाणात साकारलेली वास्तू",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "European Stained Glass, Intricate Stone Jali & Shiva Sanctum",
        "titleMr": "रंगीबेरंगी युरोपियन काचा, बारीक दगडी जाळी आणि शिवमंदिर",
        "subtitleEn": "Statue of the Commander Who Re-Established Maratha Rule in Delhi",
        "subtitleMr": "दिल्लीवर पुन्हा मराठ्यांचा दबदबा निर्माण करणाऱ्या महायोद्ध्याचे स्मारक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Military Might Is Honoured in Exquisite Stone",
        "titleMr": "शौर्य आणि पाषाणकलेचा भारतामधील अद्वितीय संगम",
        "quoteEn": "“In every carved pillar and coloured beam of light, Mahadji’s imperial legacy shines.”",
        "quoteMr": "“कोरीव खांब आणि काचांमधून येणाऱ्या प्रकाशात महादजींचा देदीप्यमान इतिहास उजळून निघतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Shinde Chhatri • The General’s Cenotaph",
        "titleMr": "शिंदे छत्री • मराठा शौर्याचे सुवर्ण स्मारक",
        "subtitleEn": "Architectural Gem • Explore Pune",
        "subtitleMr": "अद्वितीय स्मारक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the carved yellow sandstone entrance up to the multi-tiered spire and stained glass windows.",
      "twoPhotos": "Photo 1 captures exterior yellow stone carvings (Acts 1-2); Photo 2 shows interior hall with stained glass reflections (Acts 3-5).",
      "threePhotos": "P1: Exterior courtyard; P2: Detailed stone carvings; P3: Stained glass illuminated hall.",
      "fourPhotos": "P1: Gate; P2: Facade; P3: Jali carvings; P4: Inner sanctum.",
      "fivePlusPhotos": "Aristocratic, richly carved stone and stained-glass progression with regal sitar accompaniment."
    }
  },
  "shivneri-fort": {
    "placeId": "shivneri-fort",
    "slug": "shivneri-fort",
    "placeName": "Shivneri Fort (Birthplace of Shivaji Maharaj)",
    "placeNameMr": "शिवनेरी किल्ला (शिवजन्माचे पवित्र स्थान)",
    "category": "forts",
    "templateTitle": "Shivneri Fort — Cradle of Chhatrapati Shivaji Maharaj",
    "templateTitleMr": "शिवनेरी • शिवजन्माचे पावन तीर्थ आणि हिंदवी स्वराज्याची मातृभूमी",
    "conceptTaglineEn": "The revered triangular citadel of Junnar where Chhatrapati Shivaji Maharaj was born on February 19, 1630 under the blessings of Goddess Shivai.",
    "conceptTaglineMr": "१९ फेब्रुवारी १६३० रोजी जिथे छत्रपती शिवाजी महाराजांचा जन्म झाला, ते जुन्नरचे पवित्र दुर्गतीर्थ शिवनेरी.",
    "subtitle": "Junnar Taluka • Pune 410502",
    "elevationOrEra": "Elevation 1,067 m",
    "visualMood": "Sacred saffron flags fluttering against blue skies, grand carved seven-tier stone gates, and serene royal court birth halls.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#7c2d12",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(124,45,18,0.2) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.25) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Shiv Janmotsav Shivneri Fort Powada / 19 February Reel",
        "youtubeQuery": "Shivneri Fort Birthplace of Shivaji Maharaj 4K Documentary",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Sacred Birthplace of the Chhatrapati",
        "titleMr": "जिथे जन्मला युगपुरुष — पवित्र शिवनेरी",
        "subtitleEn": "February 19, 1630 • Junnar, Pune",
        "subtitleMr": "१९ फेब्रुवारी १६३० • जुन्नर, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Seven Formidable Stone Gates of Defense",
        "titleMr": "अभेद्य सात महादरवाजे आणि नैसर्गिक पाषाण कडे",
        "subtitleEn": "Maha Darwaza, Pir, Parwangi, Hathi, Fatak, Kulabkar & Shivaicha",
        "subtitleMr": "शत्रूला रोखणारी अद्वितीय पाषाण वास्तुकला",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Shivai Devi Temple, Badami Talav & Shiv Janmasthan",
        "titleMr": "शिवाई देवीचे मंदिर, बादामी तलाव आणि शिवजन्मस्थान दालन",
        "subtitleEn": "Where Jijau Nurtured the Virtues of Swarajya",
        "subtitleMr": "जिजाऊंनी बाल शिवबावर केलेले हिंदवी स्वराज्याचे संस्कार",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Eternal Holy Shrine of Every Marathi Heart",
        "titleMr": "प्रत्येक मराठी मनाचे अढळ आणि पवित्र तीर्थक्षेत्र",
        "quoteEn": "“On this sacred rock, India’s greatest epoch of freedom and justice began.”",
        "quoteMr": "“या पावन भूमीत पेटली रयतेच्या स्वराज्याची आणि न्यायाची सुवर्ण पहाट.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Shivneri • The Cradle of Glory",
        "titleMr": "शिवनेरी • युगप्रवर्तक शिवरायांचे जन्मस्थान",
        "subtitleEn": "National Heritage • Explore Pune",
        "subtitleMr": "राष्ट्रीय पावन वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow upward pan climbing the grand seven gates up to the saffron flag on the citadel summit.",
      "twoPhotos": "Photo 1 showcases grand arched stone gates (Acts 1-2); Photo 2 focuses on Shiv Janmasthan hall or Jijau-Shivaji statue (Acts 3-5).",
      "threePhotos": "P1: Seven gates staircase; P2: Shivai temple; P3: Shiv Janmasthan two-story hall.",
      "fourPhotos": "P1: Outer gate; P2: Hathi gate; P3: Badami pond; P4: Janmasthan cradle room.",
      "fivePlusPhotos": "Heroic devotional narrative montage with tutari crescendos."
    }
  },
  "shreemant-dagdusheth-halwai-ganpati": {
    "placeId": "shreemant-dagdusheth-halwai-ganpati",
    "slug": "shreemant-dagdusheth-halwai-ganpati",
    "placeName": "Shreemant Dagdusheth Halwai Ganpati Mandir",
    "placeNameMr": "श्रीमंत दगडूशेठ हलवाई गणपती मंदिर",
    "category": "temples",
    "templateTitle": "Shreemant Dagdusheth Ganpati — Sanctum of Golden Benevolence",
    "templateTitleMr": "श्रीमंत दगडूशेठ गणपती • अवघ्या पुण्याचे आराध्य दैवत व सुवर्ण दर्शन",
    "conceptTaglineEn": "Pune’s most revered city deity since 1893, established by sweetmaker Dagdusheth Gadve, radiating golden grace and unshakeable public devotion.",
    "conceptTaglineMr": "१८९३ पासून अवघ्या पुण्याचे श्रद्धेय आराध्य दैवत, ज्यांच्या सुवर्ण दर्शनाने लाखो भाविकांचे मनोरथ पूर्ण होतात.",
    "subtitle": "Budhwar Peth • Pune 411002",
    "elevationOrEra": "Established 1893",
    "visualMood": "Glowing sanctum gold, fragrant orange marigolds, brass oil lamps (samai), and resonant morning aartis.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#7c2d12",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(124,45,18,0.2) 0%, rgba(26,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.25) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Dagdusheth Halwai Ganpati Aarti Pune Reel / Sukhkarta Dukhhearta",
        "youtubeQuery": "Dagdusheth Ganpati Pune Live Darshan Aarti 4K",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Pune’s Most Revered Deity Since 1893",
        "titleMr": "१८९३ पासून अवघ्या पुण्याचे श्रद्धेय आराध्य दैवत",
        "subtitleEn": "Shreemant Dagdusheth Halwai Ganpati Mandir",
        "subtitleMr": "श्रीमंत दगडूशेठ हलवाई गणपती मंदिर, बुधवार पेठ",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Founded by Halwai Dagdusheth Gadve & Supported by Lokmanya Tilak",
        "titleMr": "हलवाई दगडूशेठ गाडवे व लोकमान्य टिळकांच्या प्रेरणेने स्थापना",
        "subtitleEn": "The Historic Anchor of Ganeshotsav Celebrations",
        "subtitleMr": "पुण्यातील सार्वजनिक गणेशोत्सवाचा मुख्य आधारस्तंभ",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Pure Gold Crown, Marigold Garlands & Glowing Brass Lamps",
        "titleMr": "सुवर्ण मुकुट, झेंडूच्या फुलांचे हार आणि तेवणारी समई",
        "subtitleEn": "Resonant Chants of Atharvashirsha & Devotional Aartis",
        "subtitleMr": "अथर्वशीर्षाचे मंगल सूर आणि हजारो भाविकांची अथांग श्रद्धा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Moment of Absolute Peace in the Heart of the City",
        "titleMr": "पुण्याच्या गर्दीच्या मध्यभागी मिळणारी अलौकिक मनःशांती",
        "quoteEn": "“Golden benevolence and peaceful darshan that dispels every worldly anxiety.”",
        "quoteMr": "“मंगलमूर्तीचे दर्शन घडताच मनातील सर्व चिंता दूर होऊन मन शांत होते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Dagdusheth Bappa • Infinite Blessings",
        "titleMr": "दगडूशेठ बाप्पा • सुखकर्ता आणि विघ्नहर्ता",
        "subtitleEn": "Sacred Icon of Faith • Explore Pune",
        "subtitleMr": "पुण्याचे आराध्य दैवत • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Centred slow zoom into the divine golden Ganesha idol framed by warm marigolds.",
      "twoPhotos": "Photo 1 captures illuminated temple facade (Acts 1-2); Photo 2 focuses on golden Bappa idol (Acts 3-5).",
      "threePhotos": "P1: Temple exterior on Budhwar Peth; P2: Sanctum entry; P3: Close-up idol darshan.",
      "fourPhotos": "P1: Spire; P2: Sabha mandap; P3: Aarti bells; P4: Golden idol.",
      "fivePlusPhotos": "Devotional rhythmic montage with bells and abhang crescendo."
    }
  },
  "siddhatek-siddhivinayak-ganpati": {
    "placeId": "siddhatek-siddhivinayak-ganpati",
    "slug": "siddhatek-siddhivinayak-ganpati",
    "placeName": "Siddhivinayak Ganpati Mandir, Siddhatek (Ashtavinayak #2)",
    "placeNameMr": "सिद्धिविनायक गणपती मंदिर, सिद्धटेक (अष्टविनायक)",
    "category": "temples",
    "templateTitle": "Siddhatek Siddhivinayak — Right-Trunk Giver of Supreme Siddhi",
    "templateTitleMr": "सिद्धिविनायक सिद्धटेक • भीमा नदीतीरावरील सिद्धी प्रदाता",
    "conceptTaglineEn": "The second Ashtavinayaka shrine on a hillock overlooking the Bhima river, famed for the rare right-turned trunk idol where Lord Vishnu attained Siddhi.",
    "conceptTaglineMr": "भीमा नदीकाठच्या टेकडीवर वसलेले दुसरे अष्टविनायक स्थान, जिथे उजव्या सोंडेचे सिद्धिविनायक भक्तांना कार्यसिद्धी देतात.",
    "subtitle": "Bhima River, Daund • Pune District",
    "elevationOrEra": "Ashtavinayak #2",
    "visualMood": "Wide flowing Bhima river waters, hilltop temple silhouette, orange vermilion right-trunk Ganesha, and sacred pradakshina trails.",
    "palette": {
      "primary": "#ea580c",
      "secondary": "#c2410c",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(194,65,12,0.18) 0%, rgba(25,8,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.22) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Siddhatek Siddhivinayak Ashtavinayak 2 Bhima River Reel",
        "youtubeQuery": "Siddhatek Siddhivinayak Temple Daund 4K Drone View",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #2 — The Only Right-Trunk Ganesha",
        "titleMr": "अष्टविनायक #२ — एकमेव उजव्या सोंडेचे सिद्धिविनायक",
        "subtitleEn": "Siddhatek Siddhivinayak, Bhima River",
        "subtitleMr": "सिद्धिविनायक, भीमा नदीतीर, दौंड",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Lord Vishnu Meditated and Defeated Madhu-Kaitabha",
        "titleMr": "जिथे भगवान विष्णूंनी ध्यानस्थ होऊन मधू-कैटभाचा वध केला",
        "subtitleEn": "Rebuilt by the Legendary Ahilyabai Holkar in Late 18th Century",
        "subtitleMr": "पुण्यश्लोक अहिल्याबाई होळकर यांनी बांधलेले देखणे मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Hillock Pradakshina Path Encircling the Sacred Mountain",
        "titleMr": "डोंगराला प्रदक्षिणा घालणारा पवित्र आणि शांत मार्ग",
        "subtitleEn": "Brass Sabha Mandap Built by Peshwa General Haripant Phadke",
        "subtitleMr": "पेशव्यांचे सेनापती हरिपंत फडके यांनी उभारलेला भव्य सभामंडप",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Granting Unfailing Success in All Great Undertakings",
        "titleMr": "सच्च्या भक्तांच्या सर्व कार्यात यश देणारा सिद्धीदाता",
        "quoteEn": "“A single circumambulation of Siddhatek bestows the divine blessings of Siddhi.”",
        "quoteMr": "“सिद्धतेकाच्या डोंगराची प्रदक्षिणा पूर्ण करताच कार्यात यश आणि सिद्धी प्राप्त होते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Siddhivinayak • Bestower of Siddhi",
        "titleMr": "सिद्धिविनायक • कार्यसिद्धीचा आशीर्वाद",
        "subtitleEn": "Ashtavinayak Sanctum • Explore Pune",
        "subtitleMr": "अष्टविनायक तीर्थ • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the Bhima river water across the hill to the Ahilyabai-built temple spire.",
      "twoPhotos": "Photo 1 captures hill temple overlooking river (Acts 1-2); Photo 2 focuses on right-trunk idol (Acts 3-5).",
      "threePhotos": "P1: Bhima river bridge view; P2: Hilltop temple approach; P3: Sanctum idol darshan.",
      "fourPhotos": "P1: River; P2: Steps; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Peaceful pilgrim journey with river reflections and sacred chimes."
    }
  },
  "sinhagad-fort": {
    "placeId": "sinhagad-fort",
    "slug": "sinhagad-fort",
    "placeName": "Sinhagad Fort (Lion's Fort)",
    "placeNameMr": "सिंहगड किल्ला (कोंढाणा)",
    "category": "forts",
    "templateTitle": "Sinhagad Fort — Bastion of Tanaji’s Valour & Sahyadri Mist",
    "templateTitleMr": "सिंहगड • तानाजींच्या असीम पराक्रमाचा सुवर्ण इतिहास व सह्याद्रीचे वैभव",
    "conceptTaglineEn": "The legendary Lion Fortress where Subedar Tanaji Malusare wrote immortal history in 1670 amidst soaring mountain mists.",
    "conceptTaglineMr": "१६७० मध्ये सुभेदार तानाजी मालुसरे यांनी आपल्या बलिदानाने अमर केलेला, सह्याद्रीच्या धुक्यात वसलेला अजिंक्य कोंढाणा.",
    "subtitle": "Haveli Taluka • Pune 411025",
    "elevationOrEra": "Elevation 1,312 m",
    "visualMood": "Swirling monsoon cloud blankets, rugged basalt battlements, golden morning sunrise, and steep Sahyadri cliffs.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#065f46",
      "accent": "#fbbf24",
      "overlayGradient": "linear-gradient(180deg, rgba(6,95,70,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.2) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Shivrajyabhishek Geet / Garja Maharashtra Majha",
        "youtubeQuery": "Sinhagad Fort Drone Dhol Tasha Powada",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "1,312 Metres High in the Sahyadris",
        "titleMr": "समुद्रसपाटीपासून १,३१२ मीटर उंच सह्याद्रीत",
        "subtitleEn": "The Immortal Bastion of Kondhana",
        "subtitleMr": "तानाजी मालुसरेंचा अजिंक्य कोंढाणा",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Kalyan Darwaza & The Sheer Dronagiri Cliff",
        "titleMr": "कल्याण दरवाजा आणि द्रोणागिरीचा अभेद्य कडा",
        "subtitleEn": "Standing Watch Over Pune for Over a Millennium",
        "subtitleMr": "हजार वर्षांहून अधिक काळ पुण्याचा राखणदार",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Tanaji Malusare Samadhi & Hot Pithla-Bhakri Aromas",
        "titleMr": "सुभेदार तानाजींचे स्मारक आणि मातीच्या चुलीवरील पिठलं-भाकरी",
        "subtitleEn": "Misty Treks & Cool Mountain Winds of Pune",
        "subtitleMr": "धुक्याची दाट चादर आणि खडकवासल्याचे विहंगम दृश्य",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "“Gad Aala Pan Sinh Gela” — Immortal Maratha Pride",
        "titleMr": "“गड आला पण सिंह गेला” — पराक्रमाचा अढळ मानबिंदू",
        "quoteEn": "“Where mountain winds whisper centuries of Maratha valour.”",
        "quoteMr": "“सह्याद्रीच्या कड्यांवर धुक्याची चादर आणि असीम पराक्रमाची साक्ष.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sinhagad • Forever Majestic in Pune’s Heart",
        "titleMr": "सिंहगड • पुणेकरांचा चिरंतन स्वाभिमान",
        "subtitleEn": "Verified Fort Heritage • Explore Pune",
        "subtitleMr": "प्रमाणित दुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Deep dramatic plunge zoom starting from the clouds down to the stone bastions.",
      "twoPhotos": "Photo 1 captures panoramic mountain ridgeline (Acts 1-2); Photo 2 focuses on historic bastions/gates (Acts 3-5).",
      "threePhotos": "P1: Distant fortress silhouette; P2: Kalyan Darwaza arch; P3: Tanaji memorial summit view.",
      "fourPhotos": "P1: Trek trail; P2: Gate; P3: Bastion; P4: Sunset cloud valley.",
      "fivePlusPhotos": "Heroic 5-act epic fort cut synced to tutari and dhol beats."
    }
  },
  "someshwar-temple-pashan": {
    "placeId": "someshwar-temple-pashan",
    "slug": "someshwar-temple-pashan",
    "placeName": "Someshwar Temple & Ramnadi Ghats (Pashan)",
    "placeNameMr": "सोमेश्वर मंदिर व रामनदी घाट (सोमेश्वरवाडी, पाषाण)",
    "category": "temples",
    "templateTitle": "Someshwar Temple — Ancient Ramnadi River Ghats of Pashan",
    "templateTitleMr": "सोमेश्वर मंदिर पाषाण • प्राचीन शिवमंदिर व रामनदीचे शांत घाट",
    "conceptTaglineEn": "The 700-year-old Hemadpanthi stone Shiva shrine in Someshwarwadi, endowed by Shivaji Maharaj’s mother Jijabai, famous for its sacred river ghats and tank.",
    "conceptTaglineMr": "सोमेश्वरवाडी येथील ७०० वर्षे जुने हेमाडपंथी शिवमंदिर, ज्याचा जीर्णोद्धार राजमाता जिजाऊंनी केला होता, ते रामनदी काठचे शांत तीर्थ.",
    "subtitle": "Someshwarwadi, Pashan • Pune 411008",
    "elevationOrEra": "700-Year-Old (Jijabai Patronage)",
    "visualMood": "Ancient dark basalt stones, sacred Ramnadi river ghat steps, shaded peepal trees, brass bells, and tranquil morning prayers.",
    "palette": {
      "primary": "#64748b",
      "secondary": "#1e293b",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(30,41,59,0.2) 0%, rgba(15,20,30,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Someshwar Temple Pashan Pune Ramnadi Heritage Reel",
        "youtubeQuery": "Someshwar Mandir Pashan Pune 700 Year Old Shiva Temple",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A 700-Year-Old Shiva Shrine on the Ramnadi",
        "titleMr": "रामनदी तीरावरील ७०० वर्षे जुने प्राचीन शिवमंदिर",
        "subtitleEn": "Someshwar Temple, Someshwarwadi, Pashan",
        "subtitleMr": "सोमेश्वर मंदिर, सोमेश्वरवाडी, पाषाण",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Patronized by Rajmata Jijabai During Shivaji’s Childhood",
        "titleMr": "शिवरायांच्या बालपणात राजमाता जिजाऊंनी जीर्णोद्धार केलेले मंदिर",
        "subtitleEn": "Ancient Hemadpanthi Basalt Masonry & Deep Pushkarini Tank",
        "subtitleMr": "प्राचीन हेमाडपंथी दगडी बांधकाम आणि पवित्र पाषाण कुंड",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Shaded River Ghat Steps, Peepal Trees & Swayambhu Shivalinga",
        "titleMr": "नदीघाटावरील पायऱ्या, पिंपळाची सावली आणि स्वयंभू शिवलिंग",
        "subtitleEn": "Tranquil Bells Echoing Across the Green Valley of Pashan",
        "subtitleMr": "पाषाणच्या निसर्गरम्य दरीत घुमणारा शांत घंटानाद",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Centuries of Devotion Flow with the River",
        "titleMr": "नदीच्या संथ प्रवाहासारखी अखंड वाहणारी भक्ती",
        "quoteEn": "“Under the sacred peepal branches, seven centuries of prayer remain deeply alive.”",
        "quoteMr": "“पिंपळाच्या डेरेदार छायेत सात शतकांचा पवित्र भक्तिवारसा आजही जिवंत आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Someshwar • The Ancient River Sanctum",
        "titleMr": "सोमेश्वर • रामनदीचे पावन तीर्थ",
        "subtitleEn": "Hemadpanthi Heritage • Explore Pune",
        "subtitleMr": "हेमाडपंथी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the river ghat steps to the ancient black stone temple dome.",
      "twoPhotos": "Photo 1 captures river ghat and ancient tree shade (Acts 1-2); Photo 2 focuses on black basalt Shivalinga sanctum (Acts 3-5).",
      "threePhotos": "P1: Ancient stone temple exterior; P2: Sacred pushkarini tank; P3: Shivalinga sanctum.",
      "fourPhotos": "P1: Ghat; P2: Tank; P3: Spire; P4: Sanctum.",
      "fivePlusPhotos": "Serene, contemplative riverside stone temple progression."
    }
  },
  "st-marys-church": {
    "placeId": "st-marys-church",
    "slug": "st-marys-church",
    "placeName": "St. Mary's Church (Pune's Oldest Church)",
    "placeNameMr": "सेंट मेरीज चर्च (पुण्यातील सर्वात जुने चर्च, कॅम्प)",
    "category": "heritage",
    "templateTitle": "St. Mary’s Church — British Cantonment’s Oldest Sanctuary",
    "templateTitleMr": "सेंट मेरीज चर्च • १८२५ मधील पुणे कॅन्टोन्मेंटचे सर्वात जुने चर्च",
    "conceptTaglineEn": "The mother church of Deccan consecrated in 1825, renowned for its British garrison heritage, magnificent stained glass windows, and pipe organ.",
    "conceptTaglineMr": "पुणे कॅम्पमधील १८२५ चे सर्वात जुने चर्च, जिथे ब्रिटिश सैनिकांचा इतिहास, रंगीत काचांच्या खिडक्या आणि ऐतिहासिक पाईप ऑर्गन आहे.",
    "subtitle": "Sholapur Road, Camp • Pune 411001",
    "elevationOrEra": "Consecrated 1825 AD (Bishop Heber)",
    "visualMood": "Towering colonial spire, dappled light filtering through vibrant stained-glass Biblical scenes, dark wood pews, and solemn cantonment peace.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0f172a",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(2,132,199,0.18) 0%, rgba(15,23,42,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "St Marys Church Pune Camp 1825 Stained Glass Reel",
        "youtubeQuery": "St Marys Church Pune Oldest Church in Deccan 4K Drone",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "200 Years of Heritage — The Mother Church of the Deccan",
        "titleMr": "दोन शतकांचा वारसा — दख्खनचे सर्वात जुने चर्च",
        "subtitleEn": "St. Mary’s Church, Pune Camp (Consecrated 1825)",
        "subtitleMr": "सेंट मेरीज चर्च, पुणे कॅम्प (१८२५)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Consecrated by Bishop Reginald Heber in 1825",
        "titleMr": "१८२५ मध्ये बिशप रेजिनाल्ड हेबर यांनी प्रतिष्ठापना केली",
        "subtitleEn": "Built for British Soldiers Stationed at the New Pune Cantonment",
        "subtitleMr": "पुणे कॅन्टोन्मेंटमधील सैनिकांसाठी उभारलेली देखणी वास्तू",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Vibrant Stained-Glass Windows, Historic Pipe Organ & Battle Flags",
        "titleMr": "रंगीबेरंगी काचांच्या खिडक्या, ऐतिहासिक पाईप ऑर्गन आणि रेजिमेंटचे ध्वज",
        "subtitleEn": "Memorial Tablets Chronicling Wars Across the 19th-Century Subcontinent",
        "subtitleMr": "१९व्या शतकातील युद्धांच्या आठवणी जपणारे संगमरवरी फलक",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Afternoon Sunlight Turns into Sacred Colour",
        "titleMr": "खिडक्यांतून येणारा दुपारचा सूर्यप्रकाश जिथे पवित्र रंगांत बदलतो",
        "quoteEn": "“Under these vaulted ceilings, two hundred years of prayers echo in serene stillness.”",
        "quoteMr": "“दोन शतकांच्या प्रार्थनेचा आणि संगीताचा पवित्र नाद येथे आजही घुमतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "St. Mary’s • The Cantonment Sanctuary",
        "titleMr": "सेंट मेरीज चर्च • कॅम्पचा ऐतिहासिक दीपस्तंभ",
        "subtitleEn": "Colonial Gothic Heritage • Explore Pune",
        "subtitleMr": "कॅन्टोन्मेंट वास्तू वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the wooden pews toward the colourful stained-glass altar window.",
      "twoPhotos": "Photo 1 captures church spire and stone exterior (Acts 1-2); Photo 2 focuses on backlit stained-glass windows (Acts 3-5).",
      "threePhotos": "P1: Church garden exterior; P2: Gothic church hall with pews; P3: Stained glass window detail.",
      "fourPhotos": "P1: Gate; P2: Spire; P3: Organ; P4: Stained glass.",
      "fivePlusPhotos": "Serene, light-infused sacred Gothic progression with gentle organ tones."
    }
  },
  "sujata-mastani-sadashiv-peth": {
    "placeId": "sujata-mastani-sadashiv-peth",
    "slug": "sujata-mastani-sadashiv-peth",
    "placeName": "Sujata Mastani (Sadashiv Peth - Original 1968 Branch)",
    "placeNameMr": "सुजाता मस्तानी (सदाशिव पेठ - मूळ शाखा १९६८)",
    "category": "food",
    "templateTitle": "Sujata Mastani — Thick Mango Royalty of Sadashiv Peth",
    "templateTitleMr": "सुजाता मस्तानी • सदाशिव पेठेतील १९६८ ची मलईदार मँगो मस्तानी",
    "conceptTaglineEn": "Pune’s signature dessert drink combining thick fruit-flavoured milk and velvety ice cream scoops.",
    "conceptTaglineMr": "घट्ट सुगंधी दूध आणि आईस्क्रीमच्या गोळ्यांचे संगम असलेले पुण्याचे राजेशाही गोड पेय.",
    "subtitle": "Sadashiv Peth • Pune 411030",
    "elevationOrEra": "Founded 1968",
    "visualMood": "Rich mango yellow nectar, chopped pistachios, glazed cherries, and cool evening indulgence.",
    "palette": {
      "primary": "#eab308",
      "secondary": "#ca8a04",
      "accent": "#ef4444",
      "overlayGradient": "linear-gradient(180deg, rgba(202,138,4,0.18) 0%, rgba(20,15,5,0.88) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.25) brightness(1.04)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Sujata Mastani Pune Reel / Mango Mastani Sadashiv Peth",
        "youtubeQuery": "Original Sujata Mastani Pune History 1968",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Named After the Queen Herself",
        "titleMr": "मस्तानी बाईंच्या सौंदर्याची गोड आठवण",
        "subtitleEn": "The Original 1968 Sadashiv Peth Branch",
        "subtitleMr": "सदाशिव पेठेतील मूळ १९६८ ची शाखा",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Thick Alphono Puree & Creamy Milk Shake",
        "titleMr": "अस्सल हापूस आंब्याचा घट्ट रस व दुधाचा संगम",
        "subtitleEn": "Crafted by the Kondhalkar Family",
        "subtitleMr": "कोंढळकर कुटुंबीयांची अस्सल निर्मिती",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Crowned with Velvety Ice Cream & Dry Fruits",
        "titleMr": "आईस्क्रीमचा गोळा, काजू, बदाम व चेरीचा साज",
        "subtitleEn": "Eaten with a Spoon, Sipped with Joy",
        "subtitleMr": "चमच्याने खाऊन तृप्ती देणारे पुण्याचे पेय",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Sweetest Climax to Every Pune Trail",
        "titleMr": "पुणे भ्रमंतीचा सर्वात गोड व तृप्त करणारा शेवट",
        "quoteEn": "“Thick, royal, and overflowing with generous Puneri indulgence.”",
        "quoteMr": "“घट्ट, राजेशाही आणि प्रत्येक घोटात पुण्याचा मनसोक्त गोडवा.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Sujata Mastani • Forever Pune’s Treat",
        "titleMr": "सुजाता मस्तानी • पुण्याचा आवडता गोडवा",
        "subtitleEn": "Iconic Dessert Legend • Explore Pune",
        "subtitleMr": "पुणेरी मिष्टान्न वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward Ken Burns drift from chilled glass base to colorful ice-cream crown.",
      "twoPhotos": "Photo 1 showcases storefront neon and crowd (Acts 1-2); Photo 2 focuses on top-down glass view (Acts 3-5).",
      "threePhotos": "P1: Exterior board; P2: Mastani glass close-up; P3: Enjoying the dessert.",
      "fourPhotos": "P1: Shop front; P2: Preparation; P3: Glass detail; P4: Dry fruit topping.",
      "fivePlusPhotos": "Breezy and vibrant dessert montage with warm golden grading."
    }
  },
  "taljai-hills": {
    "placeId": "taljai-hills",
    "slug": "taljai-hills",
    "placeName": "Taljai Hills & Forest Reserve",
    "placeNameMr": "तळजाई टेकडी व वन उद्यान",
    "category": "nature",
    "templateTitle": "Taljai Hills — Forest Reserve & Dancing Peacocks of Sahakar Nagar",
    "templateTitleMr": "तळजाई टेकडी • मोरांचा अधिवास आणि दाट हिरवा वन परिसर",
    "conceptTaglineEn": "The dense southern forest reserve of Pune, famed for its ancient Taljai Mata shrine, peacock habitats, shaded walking tracks, and wildlife calm.",
    "conceptTaglineMr": "पुण्याच्या दक्षिणेकडील दाट वनराई, जिथे तळजाई मातेचे मंदिर, मोरांचे थवे आणि शांत वॉकिंग ट्रॅक पर्यटकांना भुरळ घालतात.",
    "subtitle": "Sahakar Nagar • Pune 411009",
    "elevationOrEra": "Protected Forest Reserve",
    "visualMood": "Deep woodland shade, emerald canopy tunnels, calls of wild peacocks, winding paved jogger tracks, and cool fresh oxygen.",
    "palette": {
      "primary": "#15803d",
      "secondary": "#064e3b",
      "accent": "#86efac",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.18) 0%, rgba(10,25,18,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Taljai Hills Pune Peacock Nature Forest Trail Reel",
        "youtubeQuery": "Taljai Hills Sahakar Nagar Pune Protected Forest 4K",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Peacocks Dance in Natural Woods",
        "titleMr": "जिथे आजही जंगलात स्वच्छंद नाचतात मोर",
        "subtitleEn": "Taljai Hills & Forest Reserve, Sahakar Nagar",
        "subtitleMr": "तळजाई टेकडी व वन अभयारण्य, सहकार नगर",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "A Protected Natural Forest in the City’s South",
        "titleMr": "पुण्याच्या दक्षिणेकडील संरक्षित दाट वनराई",
        "subtitleEn": "Centred Around the Sacred Taljai Mata Temple",
        "subtitleMr": "टेकडीवरील जागृत तळजाई मातेचे प्राचीन मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Kilometres of Shaded Walking Loops & Chirping Birds",
        "titleMr": "झाडांच्या सावलीतील लांबलचक वॉकिंग ट्रॅक व पक्ष्यांची गाणी",
        "subtitleEn": "Spotted Peafowl, Migratory Birds & Dense Teak Canopies",
        "subtitleMr": "मोरांचे थवे, सागाची झाडे आणि शांत शुद्ध वातावरण",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Living Sanctuary Where Nature Still Reigns",
        "titleMr": "शहरात राहूनही थेट घनदाट जंगलात आल्याचा अनुभव",
        "quoteEn": "“Under these canopies, Pune still breathes with the heartbeat of wild forests.”",
        "quoteMr": "“या दाट झाडीत अनुभवता येतो पुण्याच्या मूळ निसर्गाचा पवित्र श्वास.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Taljai • The Forest Crown",
        "titleMr": "तळजाई • निसर्गाचे हिरवेगार नंदनवन",
        "subtitleEn": "Forest Reserve • Explore Pune",
        "subtitleMr": "वन्यजीव वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan following the forested walking track into thick green canopies.",
      "twoPhotos": "Photo 1 captures forest tree trail (Acts 1-2); Photo 2 shows Taljai Mata temple or peacock sighting (Acts 3-5).",
      "threePhotos": "P1: Forest road entrance; P2: Shaded jogger path; P3: Taljai temple pond.",
      "fourPhotos": "P1: Trail; P2: Forest canopy; P3: Temple; P4: Sunset light.",
      "fivePlusPhotos": "Peaceful woodland and birdwatcher progression."
    }
  },
  "tambat-ali-craft-quarter": {
    "placeId": "tambat-ali-craft-quarter",
    "slug": "tambat-ali-craft-quarter",
    "placeName": "Tambat Ali (Heritage Coppersmiths Quarter)",
    "placeNameMr": "तांबट आळी (कसबा पेठेतील ४०० वर्षे जुनी तांब्या-पितळेची कारागिरी)",
    "category": "heritage",
    "templateTitle": "Tambat Ali — 400 Years of Hand-Beaten Copper Craft",
    "templateTitleMr": "तांबट आळी • कसबा पेठेतील ४०० वर्षे जुनी तांब्या-पितळेची कारागिरी",
    "conceptTaglineEn": "The vibrant historic coppersmiths’ guild quarter in Kasba Peth since Shivaji’s era, resounding with the musical hammer chimes of handmade matharkaam copperware.",
    "conceptTaglineMr": "कसबा पेठेतील ४०० वर्षे जुनी तांबट कारागिरांची गल्ली, जिथे हाताने तांब्या-पितळेच्या भांड्यांवर होणारे माथारकाम आजही अखंड सुरू आहे.",
    "subtitle": "Kasba Peth • Pune 411011",
    "elevationOrEra": "Craft Heritage Since 1600s",
    "visualMood": "Gleaming red-orange copper pots, flying sparks from blacksmith furnaces, rhythmic metallic hammer chimes, and narrow heritage Peth lanes.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#9a3412",
      "accent": "#fed7aa",
      "overlayGradient": "linear-gradient(180deg, rgba(154,52,18,0.2) 0%, rgba(25,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.15) saturate(1.28) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-puneri-khadya-jingle",
      "culturalGenre": "folk_celebration",
      "bpm": 124,
      "dropTimestampSec": 12,
      "socialAudioAttribution": {
        "instagramQuery": "Tambat Ali Pune Coppersmiths Hand beaten Craft Reel / Kasba Peth",
        "youtubeQuery": "Tambat Ali Pune 400 Year Old Copper Craft Documentary Matharkaam",
        "recommendedSoundName": "Puneri Chawad • Spicy Food Crawl Anthem"
      },
      "fallbackTrackId": "food_trail"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "400 Years of Beating Red Copper into Art",
        "titleMr": "चार शतकांपासून खणखणणारे तांब्याचे सूर — तांबट आळी",
        "subtitleEn": "Tambat Ali, Kasba Peth, Pune",
        "subtitleMr": "तांबट आळी, कसबा पेठ, पुणे",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Settled by Chhatrapati Shivaji Maharaj to Forge Arms & Royal Utensils",
        "titleMr": "शिवकाळात तोफांचे गोळे व भांडी घडवण्यासाठी वसवलेली आळी",
        "subtitleEn": "Master Artisans Practicing the Ancient Art of Matharkaam",
        "subtitleMr": "हाताने ठोकून नक्षीकाम (माथारकाम) करणारे कसबी कारागीर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Furnace Flames, Red Copper Vessels & Rhythmic Hammer Cadence",
        "titleMr": "भट्टीची धग, तांब्या-पितळेची चकचकीत भांडी आणि हातोडीचा ताल",
        "subtitleEn": "Water Pots (Handa), Samai Lamps & Modern Global Culinary Ware",
        "subtitleMr": "पारंपरिक हंडे, समया आणि जागतिक ख्यातीची तांब्याची उत्पादने",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Musical Pulse That Shaped Pune’s Industrial Identity",
        "titleMr": "पुण्याच्या कष्टकरी आणि कलात्मक अस्मितेचा अखंड नाद",
        "quoteEn": "“Each hammer strike is not just shaping metal; it is keeping four centuries of living heritage alive.”",
        "quoteMr": "“हातोडीचा प्रत्येक घाव धातू घडवण्यासोबतच चारशे वर्षांचा समृद्ध वारसा जिवंत ठेवतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tambat Ali • Symphony of Copper",
        "titleMr": "तांबट आळी • अस्सल कारागिरीचा गौरव",
        "subtitleEn": "Living Artisanal Guild • Explore Pune",
        "subtitleMr": "हस्तकला वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Centred zoom plunging into a shining, hand-beaten copper pot showing the hundreds of tiny hammer indentations.",
      "twoPhotos": "Photo 1 showcases artisans hammering copper in narrow lane (Acts 1-2); Photo 2 zooms into glowing copper surface (Acts 3-5).",
      "threePhotos": "P1: Kasba Peth lane with artisans; P2: Artisan hammering copper vessel; P3: Gleaming copper vessels display.",
      "fourPhotos": "P1: Lane; P2: Furnace; P3: Hammering; P4: Finished vessel.",
      "fivePlusPhotos": "Fast, rhythmic, percussive craft montage synced to lively beats."
    }
  },
  "tamhini-ghat": {
    "placeId": "tamhini-ghat",
    "slug": "tamhini-ghat",
    "placeName": "Tamhini Ghat & Waterfalls",
    "placeNameMr": "ताम्हिणी घाट व धबधबे",
    "category": "nature",
    "templateTitle": "Tamhini Ghat — Monsoon Mists & Roaring Sahyadri Cascades",
    "templateTitleMr": "ताम्हिणी घाट • धुक्याची दाट चादर आणि खळाळणारे पांढरे धबधबे",
    "conceptTaglineEn": "Maharashtra’s premier monsoon mountain pass connecting Mulshi to Konkan, wrapped in perpetual cloud, emerald valleys, and roaring roadside cascades.",
    "conceptTaglineMr": "मुळशी ते कोकण जोडणारा महाराष्ट्रातील सर्वात प्रसिद्ध पावसाळी घाट, जिथे दाट धुके आणि फेसाळणाऱ्या पांढऱ्या धबधब्यांचा उत्सव असतो.",
    "subtitle": "Mulshi to Mangaon Road • Pune District",
    "elevationOrEra": "Western Ghats Monsoon Hub",
    "visualMood": "Swirling thick white mountain mist, roaring roadside waterfalls, deep lush green mountain ravines, and monsoon rain drops.",
    "palette": {
      "primary": "#059669",
      "secondary": "#064e3b",
      "accent": "#6ee7b7",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.2) 0%, rgba(10,25,18,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.28) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Tamhini Ghat Monsoon Drive Reel / Pune Waterfalls Rain",
        "youtubeQuery": "Tamhini Ghat Monsoon 4K Drone Drive Heavy Rain Waterfalls",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Where Clouds Descend on Sahyadri Valleys",
        "titleMr": "सह्याद्रीच्या कुशीत उतरलेली धुक्याची पांढरी चादर",
        "subtitleEn": "Tamhini Ghat • Monsoon Wonder of Pune",
        "subtitleMr": "ताम्हिणी घाट • पावसाळ्यातील नंदनवन",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Connecting the High Deccan Plateau to the Konkan Coast",
        "titleMr": "दख्खनच्या पठारावरून थेट कोकणात उतरणारा नागमोडी रस्ता",
        "subtitleEn": "Endless Emerald Slopes & Glistening Roads",
        "subtitleMr": "हिरवेगार डोंगर आणि पावसाने न्हाऊन निघालेले रस्ते",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Scores of Roaring Natural Waterfalls & Fresh Roasted Corn",
        "titleMr": "रस्त्याच्या दुतर्फा कोसळणारे पांढरे धबधबे आणि गरमागरम कणीस",
        "subtitleEn": "Cool Monsoon Spray on Winding Mountain Drives",
        "subtitleMr": "वाऱ्यासोबत येणारे पाण्याचे तुषार आणि शुद्ध निसर्ग",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Pure Drama of the Western Ghats Rains",
        "titleMr": "पश्चिम घाटातील रौद्र आणि विलोभनीय पावसाचे दर्शन",
        "quoteEn": "“In Tamhini, rain is not just weather; it is an unforgettable living festival.”",
        "quoteMr": "“ताम्हिणीत पाऊस केवळ ऋतू नसून, निसर्गाचा डोळे दिपवणारा उत्सव आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tamhini • The Monsoon Crown",
        "titleMr": "ताम्हिणी • सह्याद्रीचा पावसाळी मुकुट",
        "subtitleEn": "Natural Paradise • Explore Pune",
        "subtitleMr": "निसर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic diagonal zoom through misty road leading straight into a roadside waterfall spray.",
      "twoPhotos": "Photo 1 captures winding misty mountain road (Acts 1-2); Photo 2 focuses on rushing waterfall cascade (Acts 3-5).",
      "threePhotos": "P1: Cloud-covered valley vista; P2: Winding road with waterfalls; P3: Close-up of cascading water spray.",
      "fourPhotos": "P1: Road; P2: Valley; P3: Waterfall; P4: Sunset mist.",
      "fivePlusPhotos": "Atmospheric mist and rainfall progression with rich emerald grading."
    }
  },
  "theur-chintamani-ganpati": {
    "placeId": "theur-chintamani-ganpati",
    "slug": "theur-chintamani-ganpati",
    "placeName": "Chintamani Ganpati Mandir, Theur (Ashtavinayak)",
    "placeNameMr": "चिंतामणी गणपती मंदिर, थेऊर (अष्टविनायक)",
    "category": "temples",
    "templateTitle": "Theur Chintamani — Sacred Lake of Mind’s Peace & Madhavrao Peshwa",
    "templateTitleMr": "चिंतामणी थेऊर • माधवराव पेशव्यांचे ध्यानस्थान व कदंबतीर्थ",
    "conceptTaglineEn": "The fifth Ashtavinayaka shrine situated at the confluence of Mula, Mutha, and Bhima, celebrated as the peaceful meditation abode of Peshwa Madhavrao I.",
    "conceptTaglineMr": "मुळा, मुठा आणि भीमा नद्यांच्या संगमाजवळील पाचवे अष्टविनायक स्थान, जिथे माधवराव पेशव्यांनी मनःशांती अनुभवली आणि समाधी घेतली.",
    "subtitle": "Mula-Mutha Confluence, Theur • Pune 412110",
    "elevationOrEra": "Ashtavinayak #5 (Kadambteerth)",
    "visualMood": "Reflective temple lake waters, massive teakwood sabha mandap, glowing brass lamps, and serene historic courtyards.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Theur Chintamani Ashtavinayak 5 Pune Madhavrao Peshwa Reel",
        "youtubeQuery": "Chintamani Ganpati Theur Pune 4K Drone Confluence",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Ashtavinayak #5 — The Reliever of All Worries",
        "titleMr": "अष्टविनायक #५ — सर्व चिंता हरणारा चिंतामणी",
        "subtitleEn": "Chintamani Ganpati, Kadambteerth, Theur",
        "subtitleMr": "चिंतामणी गणपती, कदंबतीर्थ, थेऊर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Where Lord Brahma Meditated to Calm His Restless Mind",
        "titleMr": "जिथे ब्रह्मदेवांनी मन शांत करण्यासाठी तपश्चर्या केली",
        "subtitleEn": "Beloved Meditation Retreat of Shrimant Madhavrao Peshwa",
        "subtitleMr": "थोरले माधवराव पेशव्यांचे अत्यंत लाडके ध्यानस्थान",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Majestic Teakwood Sabha Mandap Built by Madhavrao Peshwa",
        "titleMr": "माधवराव पेशव्यांनी उभारलेला देखणा लाकडी सभामंडप",
        "subtitleEn": "Ramabai Peshwa Samadhi by the Quiet Riverbank Waters",
        "subtitleMr": "नदीकाठचे रमाबाई पेशव्यांचे सती स्मारक व पवित्र परिसर",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Every Anxiety Melts into Stillness",
        "titleMr": "मनातील सर्व काळजी आणि तणाव दूर करणारा मंगल क्षण",
        "quoteEn": "“Before Chintamani, every storm of the mind settles into tranquil peace.”",
        "quoteMr": "“चिंतामणीच्या चरणी लीन होताच मनातील सर्व चिंता शांत होतात.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Chintamani • The Calming Light",
        "titleMr": "चिंतामणी • मनःशांती देणारा चिंताहारक",
        "subtitleEn": "Peshwa Ashtavinayak Heritage • Explore Pune",
        "subtitleMr": "अष्टविनायक वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from the calm lake ripples to the teakwood sabha mandap and golden spire.",
      "twoPhotos": "Photo 1 showcases wooden courtyard and temple front (Acts 1-2); Photo 2 focuses on east-facing Chintamani idol (Acts 3-5).",
      "threePhotos": "P1: Temple exterior and lake; P2: Wooden sabha mandap; P3: Chintamani idol darshan.",
      "fourPhotos": "P1: Lake; P2: Gate; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Regal, serene Peshwa devotional progression with gentle sitar melodies."
    }
  },
  "tiger-point-lonavala": {
    "placeId": "tiger-point-lonavala",
    "slug": "tiger-point-lonavala",
    "placeName": "Tiger Point & Lion's Point (Lonavala)",
    "placeNameMr": "टायगर पॉईंट व लायन्स पॉईंट (लोणावळा)",
    "category": "nature",
    "templateTitle": "Tiger Point — Sheer Cliff Drops of Khandala Valley",
    "templateTitleMr": "टायगर पॉईंट • अथांग खोल दऱ्या, हवेत उडणारे ढग व लायन्स पॉईंट",
    "conceptTaglineEn": "The dramatic 650-metre cliff drop in Kurvande village near Lonavala resembling a leaping tiger, famed for cloud inversions, reversing waterfalls, and spicy corn pakodas.",
    "conceptTaglineMr": "लोणावळ्याजवळील ६५० मीटर खोल दरीचा कडा, जिथून दरीतून उलट उडणारे पाणी, ढगांची चादर आणि गरमागरम भजीचा आस्वाद मिळतो.",
    "subtitle": "Kurvande, Lonavala • Pune 410401",
    "elevationOrEra": "Elevation 650 m Cliff Drop",
    "visualMood": "Swirling updrafts carrying mist upward, steep vertical cliff drops, warm roadside tea stalls, and boundless valley horizons.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#451a03",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(15,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Tiger Point Lonavala Sunset Valley Cloud Reel / Lions Point",
        "youtubeQuery": "Tiger Point Lonavala 4K Drone Reverse Waterfall Valley",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A 650-Metre Sheer Drop into the Clouds",
        "titleMr": "६५० मीटर खोल अथांग दरी आणि आकाशात झेपावणारे ढग",
        "subtitleEn": "Tiger’s Leap (Vaghdari) & Lion’s Point, Lonavala",
        "subtitleMr": "टायगर पॉईंट (वाघाची उडी) व लायन्स पॉईंट",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Resembling a Tiger Leaping Across the Sahyadri Chasm",
        "titleMr": "दरी ओलांडणाऱ्या वाघाच्या झेपेसारखा दिसणारा कडा",
        "subtitleEn": "Unobstructed Panoramic Views of Kurvande Valleys",
        "subtitleMr": "सह्याद्रीच्या खोल दऱ्या आणि दूरवर दिसणारे धरण",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Reverse Waterfalls Defying Gravity & Crispy Onion Kanda Bhaji",
        "titleMr": "उलट वाहणारे धबधबे, वाफाळलेला चहा आणि कुरकुरीत कांदा भजी",
        "subtitleEn": "Powerful Updraft Winds Blowing Rain Directly into the Sky",
        "subtitleMr": "दरीतून वर येणारा प्रचंड वारा आणि उडणारे पाण्याचे तुषार",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "The Raw Magnificence of Sahyadri Vertigo",
        "titleMr": "डोळे दिपवून टाकणारा सह्याद्रीच्या कड्यांचा थरार",
        "quoteEn": "“Standing at the railing where the earth falls away and the sky rushes up to greet you.”",
        "quoteMr": "“कड्याच्या काठावर उभे राहून अथांग दरी आणि ढगांचा थरारक संगम अनुभवणे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tiger Point • The Cliff Edge of Wonder",
        "titleMr": "टायगर पॉईंट • लोणावळ्याचा थरारक मानबिंदू",
        "subtitleEn": "Epic Viewpoint • Explore Pune",
        "subtitleMr": "विहंगम कडा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Dramatic upward tilt scanning from the bottomless ravine fog up to the observation railing.",
      "twoPhotos": "Photo 1 showcases sheer cliff edge with valley panorama (Acts 1-2); Photo 2 focuses on swirling clouds over railing (Acts 3-5).",
      "threePhotos": "P1: Distant cliff shape; P2: Valley overlook railing; P3: Reverse waterfall or cloud inversion.",
      "fourPhotos": "P1: Drive; P2: Viewpoint; P3: Mist; P4: Sunset glow.",
      "fivePlusPhotos": "Breathtaking vertigo-inducing mountain cliff progression."
    }
  },
  "tikona-fort": {
    "placeId": "tikona-fort",
    "slug": "tikona-fort",
    "placeName": "Tikona Fort (Vitandgad)",
    "placeNameMr": "तिकोना किल्ला (वितंडगड)",
    "category": "forts",
    "templateTitle": "Tikona Fort — Triangular Watchtower of Pavana Valley",
    "templateTitleMr": "तिकोना • वितंडगड व पवना खोऱ्याचा त्रिकोणी पहारेकरी",
    "conceptTaglineEn": "The iconic triangular pyramidal hill fort rising 1,061 m above Pavana Dam, featuring steep rock-cut stairs and sweeping 360-degree vistas.",
    "conceptTaglineMr": "पवना धरणावर पहारा देणारा, त्रिकोणी सुळक्यासारखा उभा असलेला, पाषाणात कोरलेल्या पायऱ्यांचा ऐतिहासिक वितंडगड.",
    "subtitle": "Kamshet, Maval • Pune 410405",
    "elevationOrEra": "Elevation 1,061 m",
    "visualMood": "Sheer triangular rock face, glistening azure Pavana lake below, steep handrail-carved steps, and panoramic mountain serenity.",
    "palette": {
      "primary": "#0284c7",
      "secondary": "#0369a1",
      "accent": "#38bdf8",
      "overlayGradient": "linear-gradient(180deg, rgba(3,105,161,0.2) 0%, rgba(10,20,35,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.22) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.18,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.3
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Tikona Fort Trek Reel / Pavana Lake View Lonavala",
        "youtubeQuery": "Tikona Fort Drone 4K Vitandgad Pavana Dam Trek",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Pyramidal Watchtower of Maval",
        "titleMr": "पवना खोऱ्यातील त्रिकोणी सुळका — वितंडगड",
        "subtitleEn": "Elevation 1,061 m • Tikona Fort",
        "subtitleMr": "समुद्रसपाटीपासून १,०६१ मीटर उंच पहारेकरी",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Commanding Watch Over Pavana Trade Passages",
        "titleMr": "पवना आणि मावळच्या व्यापारी मार्गांवर अखंड नजर",
        "subtitleEn": "Controlled by Malik Ahmad Nizam Shah in 1585",
        "subtitleMr": "१६५७ मध्ये शिवरायांनी जिंकून स्वराज्यात आणलेला दुर्ग",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Steep Rock-Cut Steps, Trimbakeshwar Mahadev & Caves",
        "titleMr": "काळ्या पाषाणातील उभ्या पायऱ्या आणि त्र्यंबकेश्वर शिवमंदिर",
        "subtitleEn": "Satvahan-Era Buddhist Caves & Huge Water Cisterns",
        "subtitleMr": "प्राचीन बौद्ध लेणी आणि पाण्याचे अखंड टाके",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Breathtaking 360° Panorama of Sahyadri Waters",
        "titleMr": "पवना जलाशय, तुंग, लोहगड आणि विसापूरचा ३६०° देखावा",
        "quoteEn": "“Standing upon Tikona’s pinnacle, the entire Sahyadri world unfurls at your feet.”",
        "quoteMr": "“तिकोनाच्या शिखरावर उभे राहताच निसर्गाचे विहंगम सौंदर्य डोळ्यांत साठवता येते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tikona • The Pyramid Sentinel",
        "titleMr": "तिकोना • पवना खोऱ्याचा गौरव",
        "subtitleEn": "Scenic Fort Trek • Explore Pune",
        "subtitleMr": "निसर्गरम्य दुर्ग • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan following the steep rock-cut steps up to the triangular peak.",
      "twoPhotos": "Photo 1 captures the striking triangular pyramid silhouette (Acts 1-2); Photo 2 shows top view of Pavana lake (Acts 3-5).",
      "threePhotos": "P1: Pyramid outline; P2: Steep rock-cut stairs; P3: Summit temple flag view.",
      "fourPhotos": "P1: Trail; P2: Caves; P3: Steps; P4: Lake panorama.",
      "fivePlusPhotos": "Crisp scenic climbing montage with expansive blue lake grading."
    }
  },
  "torna-fort": {
    "placeId": "torna-fort",
    "slug": "torna-fort",
    "placeName": "Torna Fort (Prachandagad)",
    "placeNameMr": "तोरणा किल्ला (प्रचंडगड)",
    "category": "forts",
    "templateTitle": "Torna Fort — Prachandagad & The First Garland of Swarajya",
    "templateTitleMr": "तोरणा • प्रचंडगड आणि हिंदवी स्वराज्याचे पहिले तोरण",
    "conceptTaglineEn": "The highest fort in Pune district captured by 16-year-old Shivaji Maharaj in 1646, initiating the sacred dawn of Swarajya.",
    "conceptTaglineMr": "१६४६ मध्ये अवघ्या १६ व्या वर्षी शिवरायांनी जिंकून स्वराज्याची मुहूर्तमेढ रोवलेला पुणे जिल्ह्यातील सर्वोच्च दुर्ग.",
    "subtitle": "Velhe Taluka • Pune 412212",
    "elevationOrEra": "Elevation 1,403 m",
    "visualMood": "Wild mountain gusts, endless Sahyadri horizon, sheer Zunjar Machi knife-edge ridge, and emerald monsoon valleys.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#064e3b",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(6,78,59,0.2) 0%, rgba(10,20,12,0.92) 100%)",
      "canvasFilter": "contrast(1.14) saturate(1.22) brightness(0.96)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Torna Fort Prachandagad Trek Reel / Swarajyache Toran",
        "youtubeQuery": "Torna Fort Highest Fort Pune Trekking 4K Drone",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "1,403 Metres — Pune’s Highest Mountain Fort",
        "titleMr": "पुणे जिल्ह्यातील सर्वात उंच दुर्गशिखर — १,४०३ मीटर",
        "subtitleEn": "The Immortal Prachandagad",
        "subtitleMr": "हिंदवी स्वराज्याचे पहिले तोरण",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Captured in 1646 by 16-Year-Old Shivaji Maharaj",
        "titleMr": "१६४६ मध्ये अवघ्या १६व्या वर्षी शिवरायांचा पहिला विजय",
        "subtitleEn": "The Sacred Birthplace of Maratha Independence",
        "subtitleMr": "जिथून सुरू झाली हिंदवी स्वराज्याची दैदिप्यमान क्रांती",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "The Thrilling Zunjar Machi & Budhla Machi Ridges",
        "titleMr": "थरारक झुंजार माची, बुधला माची आणि अथांग खोल दऱ्या",
        "subtitleEn": "Menghai Devi Shrine & Fierce Sahyadri Gale Winds",
        "subtitleMr": "मेंगाई देवीचे मंदिर आणि अंगावर शहारे आणणारा सोसाट्याचा वारा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where the Flame of Freedom Was First Lit",
        "titleMr": "जिथे पेटली स्वातंत्र्याची पहिली अखंड मशाल",
        "quoteEn": "“Here, an empire was dared by a teenager whose vision shook the subcontinent.”",
        "quoteMr": "“या प्रचंड कड्यांवरून सुरू झाला एका स्वतंत्र साम्राज्याचा सुवर्ण प्रवास.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Torna • Prachandagad of Swarajya",
        "titleMr": "तोरणा • शौर्य आणि क्रांतीचे अमर प्रतीक",
        "subtitleEn": "Highest Fort Glory • Explore Pune",
        "subtitleMr": "सर्वोच्च दुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Sweeping horizontal pan across the razor-sharp Zunjar Machi knife-edge cliff.",
      "twoPhotos": "Photo 1 captures cloud-covered summit panorama (Acts 1-2); Photo 2 shows stone bastion staircase (Acts 3-5).",
      "threePhotos": "P1: Distant Prachandagad mass; P2: Mengai temple ridge; P3: Zunjar machi cliff face.",
      "fourPhotos": "P1: Base trail; P2: Rocky climb; P3: Machi wall; P4: Summit sunset.",
      "fivePlusPhotos": "Fierce, wind-swept high mountain progression."
    }
  },
  "tribal-museum": {
    "placeId": "tribal-museum",
    "slug": "tribal-museum",
    "placeName": "Tribal Cultural Museum",
    "placeNameMr": "आदिवासी सांस्कृतिक वस्तुसंग्रहालय",
    "category": "museums",
    "templateTitle": "Tribal Cultural Museum — Living Arts of Maharashtra’s Tribes",
    "templateTitleMr": "आदिवासी सांस्कृतिक संग्रहालय • वारली चित्रकला, मुखवटे व जीवनशैली",
    "conceptTaglineEn": "The state tribal research repository celebrating the rich indigenous cultures, Warli paintings, masks, and jewelry of Sahyadri and Gond tribes.",
    "conceptTaglineMr": "सह्याद्री, सातपुडा आणि गोंडवनातील ४७ हून अधिक आदिवासी जमातींची कला, वारली चित्रे आणि संस्कृती जपणारे संग्रहालय.",
    "subtitle": "Queen’s Garden Road, Camp • Pune 411001",
    "elevationOrEra": "Established 1962",
    "visualMood": "White rice-paste Warli motifs on red mud walls, wooden tribal masks, hunting weapons, and indigenous metal ornaments.",
    "palette": {
      "primary": "#9a3412",
      "secondary": "#451a03",
      "accent": "#fed7aa",
      "overlayGradient": "linear-gradient(180deg, rgba(69,26,3,0.2) 0%, rgba(20,8,3,0.9) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "punchy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.25
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-powada",
      "culturalGenre": "powada_fort",
      "bpm": 116,
      "dropTimestampSec": 18,
      "socialAudioAttribution": {
        "instagramQuery": "Warli Art Tribal Museum Pune Indigenous Culture Reel",
        "youtubeQuery": "Tribal Cultural Museum Pune Maharashtra Folk Heritage",
        "recommendedSoundName": "Garja Sahyadri • Dhol Tasha & Powada Chant"
      },
      "fallbackTrackId": "fort_adventure"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Voices of Maharashtra’s Indigenous Tribes",
        "titleMr": "महाराष्ट्राच्या मूळ भूमीपुत्रांची प्राचीन कला संस्कृती",
        "subtitleEn": "Tribal Cultural Museum, Pune Camp",
        "subtitleMr": "आदिवासी सांस्कृतिक संग्रहालय, पुणे कॅम्प",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "47 Indigenous Communities Across Sahyadri & Vidarbha",
        "titleMr": "सह्याद्री ते सातपुड्यापर्यंतच्या ४७ जमातींचा वारसा",
        "subtitleEn": "Maintained by Tribal Research & Training Institute (TRTI)",
        "subtitleMr": "आदिवासी संशोधन व प्रशिक्षण संस्था (टीआरटीआय)",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Intricate Warli Paintings, Bohada Masks & Silver Jewelry",
        "titleMr": "अस्सल वारली चित्रे, बोहाड्याचे लाकडी मुखवटे व दागिने",
        "subtitleEn": "Bamboo Musical Instruments, Hunting Gear & Huts",
        "subtitleMr": "पारंपरिक बांबूची वाद्ये, शेती अवजारे आणि कुडाची घरे",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Sacred Harmony Between Man and the Forest",
        "titleMr": "निसर्ग, जंगल आणि मानवाचे अनादी नाते",
        "quoteEn": "“Here, art is not decorative; it is a sacred prayer of harmony with nature.”",
        "quoteMr": "“येथे कला केवळ सजावट नाही, तर निसर्गाशी कृतज्ञ राहण्याची जीवनशैली आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tribal Museum • Indigenous Pride",
        "titleMr": "आदिवासी संग्रहालय • आपल्या मूळ संस्कृतीचा गौरव",
        "subtitleEn": "Living Heritage • Explore Pune",
        "subtitleMr": "आदिवासी वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Centred pan scanning Warli wall murals before zooming into painted circular dance figures.",
      "twoPhotos": "Photo 1 showcases exterior museum gallery (Acts 1-2); Photo 2 focuses on Warli mural or tribal mask (Acts 3-5).",
      "threePhotos": "P1: Museum entrance; P2: Warli artwork wall; P3: Bohada wooden masks exhibit.",
      "fourPhotos": "P1: Gate; P2: Warli art; P3: Musical instruments; P4: Tribal jewelry.",
      "fivePlusPhotos": "Vibrant earthy montage highlighting red-ochre textures and tribal rhythms."
    }
  },
  "trishund-ganpati-temple": {
    "placeId": "trishund-ganpati-temple",
    "slug": "trishund-ganpati-temple",
    "placeName": "Trishund Mayureshwar Ganpati Temple",
    "placeNameMr": "त्रिशुंड मयूरेश्वर गणपती मंदिर (सोमवार पेठ)",
    "category": "temples",
    "templateTitle": "Trishund Ganpati — The Three-Headed Basalt Mystery",
    "templateTitleMr": "त्रिशुंड मयूरेश्वर गणपती • तीन तोंडांची मूर्ती व गूढ पाषाण शिल्पे",
    "conceptTaglineEn": "The rare 1770 AD temple in Somwar Peth featuring a unique three-headed, six-armed Ganesha seated on a peacock, with enigmatic carvings of British soldiers and rhinos.",
    "conceptTaglineMr": "सोमवार पेठेतील १७७० मधील अद्वितीय मंदिर, जिथे मोरावर आरूढ झालेली तीन तोंडांची गणपती मूर्ती आणि गूढ कोरीव शिल्पे आहेत.",
    "subtitle": "Somwar Peth • Pune 411011",
    "elevationOrEra": "Built 1770 AD (Bhimjigir Gosavi)",
    "visualMood": "Dark mysterious carved basalt, unique hybrid stone sculptures, underground cellar water chamber, and rare tantric iconography.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(15,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.12) saturate(1.15) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "cinematic_blur",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Trishund Ganpati Temple Pune Somwar Peth Unique Carvings Reel",
        "youtubeQuery": "Trishund Mayureshwar Ganpati Pune Mysterious Stone Temple 1770",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Only Three-Headed Peacock Ganesha in Pune",
        "titleMr": "पुण्यातील एकमेव तीन तोंडांची मोरावर बसलेली गणपती मूर्ती",
        "subtitleEn": "Trishund Mayureshwar Mandir, Somwar Peth (1770)",
        "subtitleMr": "त्रिशुंड मयूरेश्वर मंदिर, सोमवार पेठ (१७७०)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built by Mahant Bhimjigir Gosavi in 1770 AD",
        "titleMr": "महंत भीमजीगीर गोसावी यांनी १७७० मध्ये बांधलेले मंदिर",
        "subtitleEn": "A Fusion of Rajasthani, Malwa & South Indian Stonework",
        "subtitleMr": "राजस्थानी, माळवा आणि दाक्षिणात्य पाषाणकलेचा सुरेख संगम",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Intriguing Facade Carvings: British Soldiers, Rhinos & Ships",
        "titleMr": "ब्रिटिश सैनिक, गेंडा आणि जहाजांची दुर्मिळ ऐतिहासिक शिल्पे",
        "subtitleEn": "Secret Subterranean Vault (Bhuikot) Filled with Water",
        "subtitleMr": "मंदिराखालील गूढ भुयारी पाण्याचे तळघर (भुईकोट)",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Mystical Marvel Hidden in Pune’s Old Quarters",
        "titleMr": "पुण्याच्या जुन्या पेठेतील एक गूढ आणि विस्मयकारक चमत्कार",
        "quoteEn": "“Every stone carving here guards a secret, told through forgotten centuries of art.”",
        "quoteMr": "“येथील प्रत्येक पाषाण शिल्पामध्ये इतिहासाचे आणि गूढ विद्येचे रहस्य सामावले आहे.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Trishund Ganpati • The Basalt Mystery",
        "titleMr": "त्रिशुंड गणपती • पाषाणातील अद्भूत रहस्य",
        "subtitleEn": "Unique Architectural Marvel • Explore Pune",
        "subtitleMr": "अद्वितीय पाषाण वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow creeping zoom examining the intricate basalt facade carvings of soldiers and rhinos.",
      "twoPhotos": "Photo 1 captures exterior temple facade carvings (Acts 1-2); Photo 2 focuses on three-headed Ganesha idol (Acts 3-5).",
      "threePhotos": "P1: Temple stone entrance; P2: Detailed wall carvings; P3: Trishund idol sanctum.",
      "fourPhotos": "P1: Facade; P2: Relief carvings; P3: Inscriptions; P4: Idol.",
      "fivePlusPhotos": "Mysterious, slow-paced stone sculpture exploration with temple chimes."
    }
  },
  "tulja-caves-junnar": {
    "placeId": "tulja-caves-junnar",
    "slug": "tulja-caves-junnar",
    "placeName": "Tulja Buddhist Caves (Junnar)",
    "placeNameMr": "तुळजा लेणी (बौद्ध चैत्य व विहार, जुन्नर)",
    "category": "heritage",
    "templateTitle": "Tulja Caves Junnar — Circular Chaitya of Padmapani",
    "templateTitleMr": "तुळजा लेणी जुन्नर • वर्तुळाकार बौद्ध चैत्य व विहार समूह",
    "conceptTaglineEn": "The fascinating 1st-century BC Buddhist cave cluster on Tuljabai hill near Junnar, famous for its unique circular Chaitya hall encircled by 12 octagonal pillars.",
    "conceptTaglineMr": "जुन्नरच्या पश्चिमेकडील तुळजा टेकडीवरील बौद्ध लेणी, जिथे १२ अष्टकोनी खांबांनी वेढलेले अत्यंत दुर्मिळ वर्तुळाकार चैत्यगृह आहे.",
    "subtitle": "Tuljabai Hill, Junnar • Pune 410502",
    "elevationOrEra": "1st Century BC (Hinayana Caves)",
    "visualMood": "Rare circular dome ceiling carved in rock, weathered octagonal stone pillars, secluded mountain cliffs, and sacred silence.",
    "palette": {
      "primary": "#ca8a04",
      "secondary": "#1c1917",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(28,25,23,0.2) 0%, rgba(10,8,5,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Tulja Caves Junnar Circular Chaitya Buddhist Architecture Reel",
        "youtubeQuery": "Tulja Caves Junnar Rare Circular Chaitya Hall 4K Drone",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "One of the Rarest Circular Chaitya Halls in the World",
        "titleMr": "जगातील सर्वात दुर्मिळ वर्तुळाकार बौद्ध चैत्यगृहांपैकी एक",
        "subtitleEn": "Tulja Buddhist Caves, Tuljabai Hill, Junnar",
        "subtitleMr": "तुळजा लेणी, जुन्नर (इसवी सन पूर्व १ले शतक)",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "11 Rock-Cut Caves Overlooking the Winding River Valley",
        "titleMr": "नदीच्या खोऱ्यावर नजर ठेवणारा ११ लेण्यांचा प्राचीन समूह",
        "subtitleEn": "Later Consecrated to Goddess Tulja Bhavani",
        "subtitleMr": "नंतरच्या काळात तुळजाभवानी देवीचे स्थान म्हणून पूजले गेलेले तीर्थ",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "12 Octagonal Pillars Encircling the Central Monolithic Stupa",
        "titleMr": "मध्यवर्ती स्तूपाभोवती असलेले १२ अष्टकोनी खांब आणि घुमट",
        "subtitleEn": "Dome Ceiling Echoing Ancient Chants Across Millennia",
        "subtitleMr": "पाषाणातील गोलाकार छत जिथे मंत्रोच्चाराचे नाद घुमतात",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Geometry of Enlightenment Carved in Stone",
        "titleMr": "पाषाणात कोरलेली बुद्धिमत्तेची आणि भूमितीची भव्य रचना",
        "quoteEn": "“Inside the circular sanctuary of Tulja, the wheel of Dhamma feels frozen in timeless stone.”",
        "quoteMr": "“वर्तुळाकार दालनात उभे राहताच धम्मचक्राच्या अखंड गतीची प्रचिती पाषाणात येते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tulja Caves • The Circular Stupa",
        "titleMr": "तुळजा लेणी • वर्तुळाकार पाषाण चमत्कार",
        "subtitleEn": "Unique Buddhist Architecture • Explore Pune",
        "subtitleMr": "प्राचीन वास्तू वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth circular pan inside Cave 3 following the 12 octagonal pillars around the central stupa.",
      "twoPhotos": "Photo 1 captures the exterior cliff caves (Acts 1-2); Photo 2 shows circular interior Chaitya with dome (Acts 3-5).",
      "threePhotos": "P1: Hillside cliff approach; P2: Circular Chaitya hall; P3: Central monolithic stupa.",
      "fourPhotos": "P1: Path; P2: Facade; P3: Pillars; P4: Stupa.",
      "fivePlusPhotos": "Tranquil geometric and architectural exploration with serene meditation chords."
    }
  },
  "tulshibaug-temple": {
    "placeId": "tulshibaug-temple",
    "slug": "tulshibaug-temple",
    "placeName": "Tulshibaug Ram Mandir",
    "placeNameMr": "तुळशीबाग राम मंदिर",
    "category": "temples",
    "templateTitle": "Tulshibaug Ram Mandir — Sacred Spires of the Old Peth",
    "templateTitleMr": "तुळशीबाग राम मंदिर • गजबजलेल्या पेठेतील शांत कळस",
    "conceptTaglineEn": "The historic 18th-century Peshwa temple complex hidden inside the bustling Tulshibaug market, featuring a 140-foot stone spire and exquisite marble idols.",
    "conceptTaglineMr": "गजबजलेल्या तुळशीबागेच्या मध्यभागी वसलेले, १७६१ मधील १४० फूट उंच कळस असलेले पेशवेकालीन ऐतिहासिक राम मंदिर.",
    "subtitle": "Budhwar Peth, Tulshibaug • Pune 411002",
    "elevationOrEra": "Built 1761 AD (Naro Appaji Khire)",
    "visualMood": "Towering stucco spire, quiet courtyard escape from street bazaars, smooth white marble idols, and brass bells.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,3,0.92) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-dagdusheth-aarti",
      "culturalGenre": "abhang_devotional",
      "bpm": 92,
      "dropTimestampSec": 16,
      "socialAudioAttribution": {
        "instagramQuery": "Tulshibaug Ram Mandir Pune Old Peth Heritage Reel",
        "youtubeQuery": "Tulshibaug Ram Mandir Pune 1761 Peshwa Spire History",
        "recommendedSoundName": "Majha Ganaraya • Dagdusheth Sanctum Aarti"
      },
      "fallbackTrackId": "peaceful_flute"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "A Sanctuary Hidden Inside Pune’s Busiest Bazaar",
        "titleMr": "पुण्याच्या सर्वात गजबजलेल्या पेठेत लपलेली शांतता",
        "subtitleEn": "Tulshibaug Ram Mandir • Consecrated 1761",
        "subtitleMr": "तुळशीबाग राम मंदिर • १७६१ मधील पेशवेकालीन रचना",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "140-Foot Towering Spire (Shikhar) Carved with Sculptures",
        "titleMr": "१४० फूट उंच नक्षीदार कळस आणि शेकडो पाषाण मूर्ती",
        "subtitleEn": "Built by Naro Appaji Khire, Subedar of Pune",
        "subtitleMr": "पुण्याचे सुभेदार नारो आप्पाजी खिरे यांनी उभारलेले मंदिर",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "White Marble Idols of Ram, Sita, Lakshman & Hanuman",
        "titleMr": "श्रीराम, सीता, लक्ष्मण व मारुती यांच्या संगमरवरी मूर्ती",
        "subtitleEn": "Carved Teakwood Hall Echoing with Devotional Chants",
        "subtitleMr": "सागवानी सभामंडप आणि भाविकांची अखंड रामनाम नामजप",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Step from Modern Chaos into 18th-Century Devotion",
        "titleMr": "बाजारातील धावपळीतून थेट अडीचशे वर्षे जुन्या शांततेत प्रवेश",
        "quoteEn": "“Cross the threshold from Tulshibaug’s bustling lanes and time instantly stands still.”",
        "quoteMr": "“तुळशीबागेच्या गल्लीतून मंदिरात पाऊल टाकताच काळाची गती जणू थांबून जाते.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Tulshibaug • The Serene Sanctum",
        "titleMr": "तुळशीबाग • पेठ संस्कृतीचे शांत हृदय",
        "subtitleEn": "Historic Temple Sanctuary • Explore Pune",
        "subtitleMr": "ऐतिहासिक राममंदिर • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Upward vertical tilt revealing the towering 140-foot ornate spire rising above the marketplace roofs.",
      "twoPhotos": "Photo 1 showcases historic temple courtyard and spire (Acts 1-2); Photo 2 focuses on marble Ram-Sita idols (Acts 3-5).",
      "threePhotos": "P1: Market gateway; P2: Towering shikhar; P3: Marble sanctum darshan.",
      "fourPhotos": "P1: Bazar; P2: Courtyard; P3: Mandap; P4: Idol.",
      "fivePlusPhotos": "Breezy contrast progression from bustling market into temple peace."
    }
  },
  "varasgaon-dam": {
    "placeId": "varasgaon-dam",
    "slug": "varasgaon-dam",
    "placeName": "Varasgaon Dam & Reservoir (Veer Baji Pasalkar)",
    "placeNameMr": "वरसगाव धरण (वीर बाजी पासलकर जलाशय)",
    "category": "nature",
    "templateTitle": "Varasgaon Dam — Serene Waters of Veer Baji Pasalkar",
    "templateTitleMr": "वरसगाव धरण • वीर बाजी पासलकर जलाशय व शांत निसर्ग परिसर",
    "conceptTaglineEn": "The tranquil reservoir on the Mose river sharing borders with Lavasa, dedicated to Maratha warrior Veer Baji Pasalkar.",
    "conceptTaglineMr": "मोसे नदीवरील वीर बाजी पासलकर जलाशय, जिथल्या शांत पाण्याने आणि निसर्गाने वेढलेला परिसर पर्यटकांना भुरळ घालतो.",
    "subtitle": "Mose River, Velhe • Pune 412107",
    "elevationOrEra": "Built 1970s (Veer Baji Pasalkar)",
    "visualMood": "Mirror-like calm water, forested hill reflections, gentle ripples, and remote Sahyadri tranquility.",
    "palette": {
      "primary": "#0891b2",
      "secondary": "#164e63",
      "accent": "#67e8f9",
      "overlayGradient": "linear-gradient(180deg, rgba(22,78,99,0.18) 0%, rgba(10,25,35,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "meditative",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.15
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Varasgaon Dam Pune Peaceful Nature Water Reel",
        "youtubeQuery": "Varasgaon Dam Veer Baji Pasalkar 4K Drone View",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Named in Honour of Braveheart Veer Baji Pasalkar",
        "titleMr": "वीर बाजी पासलकरांच्या शौर्याचे स्मारक — वरसगाव",
        "subtitleEn": "Varasgaon Dam, Mose River Basin",
        "subtitleMr": "वरसगाव धरण, मोसे नदी खोरे",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Twin Reservoir Adjacent to Panshet",
        "titleMr": "पानशेत धरणाला लागून असलेला शांत जुळा जलाशय",
        "subtitleEn": "Supplying Drinking Water & Power to Pune Region",
        "subtitleMr": "पुणे शहराला पाणी व वीज पुरवणारा महत्त्वाचा प्रकल्प",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Mirror Reflections of Surrounding Sahyadri Ridges",
        "titleMr": "हिरव्यागार टेकड्यांचे पाण्यात पडलेले विलोभनीय प्रतिबिंब",
        "subtitleEn": "Quiet Camping Spots, Fresh Country Air & Village Simplicity",
        "subtitleMr": "कॅम्पिंगसाठी आदर्श शांत ठिकाण आणि ताजी शुद्ध हवा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Sanctuary of Unbroken Mountain Silence",
        "titleMr": "शहराच्या गोंगाटापासून दूर, संपूर्ण शांततेचा अनुभव",
        "quoteEn": "“Here, the only sound is the gentle lapping of ripples against mountain shores.”",
        "quoteMr": "“येथे केवळ डोंगरांच्या काठाशी खेळणाऱ्या संथ लाटांचा मंद आवाज ऐकू येतो.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Varasgaon • Mirror of the Hills",
        "titleMr": "वरसगाव • निसर्गाचा शांत आरसा",
        "subtitleEn": "Peaceful Reservoir • Explore Pune",
        "subtitleMr": "शांत जलाशय • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Slow panoramic drift across the glassy mountain reflections on the water surface.",
      "twoPhotos": "Photo 1 showcases dam structure and valley (Acts 1-2); Photo 2 shows calm reservoir waters (Acts 3-5).",
      "threePhotos": "P1: Dam overview; P2: Waterside ridge; P3: Sunset lake reflection.",
      "fourPhotos": "P1: Drive; P2: Dam; P3: Water; P4: Mountain reflection.",
      "fivePlusPhotos": "Meditative, reflective nature progression."
    }
  },
  "vetal-tekdi": {
    "placeId": "vetal-tekdi",
    "slug": "vetal-tekdi",
    "placeName": "Vetal Tekdi (Highest Peak of Pune City)",
    "placeNameMr": "वेताळ टेकडी (पुण्यातील सर्वोच्च टेकडी)",
    "category": "nature",
    "templateTitle": "Vetal Tekdi — Highest Crown of Pune City & Morning Silence",
    "templateTitleMr": "वेताळ टेकडी • २,६०० फूट उंचीवरून दिसणारे संपूर्ण पुणे शहर",
    "conceptTaglineEn": "The highest natural summit within Pune municipal limits (2,600 ft / 792 m), cherished by generations for sunrise jogs, peacocks, and pristine panoramic views.",
    "conceptTaglineMr": "पुणे शहरातील सर्वोच्च नैसर्गिक टेकडी (२,६०० फूट), जिथून संपूर्ण पुण्याचा विहंगम देखावा, मोरांचे दर्शन आणि शांत सूर्योदय मिळतो.",
    "subtitle": "Kothrud-Shivajinagar Ridge • Pune 411038",
    "elevationOrEra": "Highest Peak (792 m / 2,600 ft)",
    "visualMood": "Crisp morning orange sunrise, dancing wild peacocks, gravel running trails through acacia trees, and Pune city skyline stretching below.",
    "palette": {
      "primary": "#d97706",
      "secondary": "#047857",
      "accent": "#facc15",
      "overlayGradient": "linear-gradient(180deg, rgba(4,120,87,0.18) 0%, rgba(15,25,18,0.9) 100%)",
      "canvasFilter": "contrast(1.08) saturate(1.2) brightness(1.02)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Vetal Tekdi Pune Morning Sunrise Run Peacock Reel",
        "youtubeQuery": "Vetal Tekdi Highest Point in Pune 4K Drone View",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "2,600 Feet — The Highest Point in Pune City",
        "titleMr": "पुणे शहरातील सर्वोच्च शिखर — २,६०० फूट",
        "subtitleEn": "Vetal Tekdi (Mitra Mandal Hill)",
        "subtitleMr": "वेताळ टेकडी • पुण्याचा हिरवा मुकुट",
        "motionPreset": "slow_drift"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "The Natural Green Lung of Modern Pune",
        "titleMr": "पुणेकरांना शुद्ध प्राणवायू देणारे निसर्गरम्य हिरवेगार फुप्फुस",
        "subtitleEn": "Home to Wetalam Temple & Rich Sahyadri Flora",
        "subtitleMr": "वेताळोबाचे मंदिर आणि समृद्ध जैवविविधता",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Dancing Peacocks, Migratory Birds & Running Trails",
        "titleMr": "सकाळच्या वेळी नाचणारे मोर आणि व्यायामप्रेमींची पायवाट",
        "subtitleEn": "Crisp Morning Air & The Fragrance of Wet Red Soil",
        "subtitleMr": "कोवळे ऊन, गार वारा आणि तांबड्या मातीचा सुवास",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Watching the City Wake Up Beneath Your Feet",
        "titleMr": "आपल्या पायाखाली जागे होणारे संपूर्ण पुणे शहर पाहण्याचा आनंद",
        "quoteEn": "“On Vetal Tekdi, you stand above the chaos and breathe the true soul of Pune.”",
        "quoteMr": "“शहराच्या धावपळीपासून उंचावर उभे राहून अनुभवता येतो पुण्याचा खराखुरा शांत श्वास.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Vetal Tekdi • Pune’s High Sanctuary",
        "titleMr": "वेताळ टेकडी • पुणेकरांचा अभिमान",
        "subtitleEn": "Highest Natural Landmark • Explore Pune",
        "subtitleMr": "सर्वोच्च निसर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan from gravel running path rising to panoramic view of Pune city skyline.",
      "twoPhotos": "Photo 1 captures city skyline from tekdi summit (Acts 1-2); Photo 2 shows morning sunrise on nature trail (Acts 3-5).",
      "threePhotos": "P1: Trail with trees; P2: Summit Vetaloba temple; P3: Panoramic city skyline.",
      "fourPhotos": "P1: Path; P2: Birds/trees; P3: Ridge; P4: Sunrise skyline.",
      "fivePlusPhotos": "Fresh, energizing morning runner montage with warm golden light."
    }
  },
  "vikram-pendse-cycles-museum": {
    "placeId": "vikram-pendse-cycles-museum",
    "slug": "vikram-pendse-cycles-museum",
    "placeName": "Vikram Pendse Cycles & Vintage Museum",
    "placeNameMr": "विक्रम पेंडसे सायकल व विंटेज म्युझियम (कर्वे नगर, पुणे)",
    "category": "museums",
    "templateTitle": "Vikram Pendse Cycles — Century of Vintage Bicycles & Curios",
    "templateTitleMr": "विक्रम पेंडसे सायकल संग्रहालय • १०० वर्षांहून जुन्या सायकलींचे जग",
    "conceptTaglineEn": "A unique private museum in Karve Nagar showcasing over 150 vintage cycles dating back to 1914, world war paratrooper bicycles, and childhood relics.",
    "conceptTaglineMr": "कर्वे नगरमधील आगळेवेगळे संग्रहालय जिथे १९१४ पासूनच्या १५० हून अधिक जुन्या सायकली, दुसऱ्या महायुद्धातील सायकली आणि खेळणी आहेत.",
    "subtitle": "Karve Nagar • Pune 411052",
    "elevationOrEra": "Founded 2012",
    "visualMood": "Polished chrome handlebars, vintage leather saddles, carbide lamps, and nostalgic three-story retro interiors.",
    "palette": {
      "primary": "#059669",
      "secondary": "#1e293b",
      "accent": "#a7f3d0",
      "overlayGradient": "linear-gradient(180deg, rgba(5,150,105,0.18) 0%, rgba(15,20,30,0.9) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.18) brightness(1.0)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "breezy",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-roohani-pune",
      "culturalGenre": "ghazal_acoustic",
      "bpm": 88,
      "dropTimestampSec": 15,
      "socialAudioAttribution": {
        "instagramQuery": "Vikram Pendse Cycle Museum Pune Vintage Bicycle Reel",
        "youtubeQuery": "Vikram Pendse Cycle Museum Karve Nagar Rare Collection",
        "recommendedSoundName": "Roohani Pune • Nostalgic Sunset Walk"
      },
      "fallbackTrackId": "pune_ambient"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "When Pune Was Truly the Cycle Capital of India",
        "titleMr": "जेव्हा पुणे खरोखर भारताची सायकल राजधानी होते",
        "subtitleEn": "Vikram Pendse Cycles Museum, Karve Nagar",
        "subtitleMr": "विक्रम पेंडसे सायकल संग्रहालय, कर्वे नगर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Over 150 Rare Bicycles Spanning a Entire Century",
        "titleMr": "१९१४ पासूनच्या १५० हून अधिक दुर्मिळ सायकलींचा खजिना",
        "subtitleEn": "Curated Passionately by Vikram Pendse",
        "subtitleMr": "विक्रम पेंडसे यांनी स्वतः जपलेला विलोभनीय संग्रह",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "WWII Paratrooper Folding Cycles & Golden Sunbeam",
        "titleMr": "दुसऱ्या महायुद्धातील पॅराट्रूपर सायकल व ब्रिटिश सनबीम",
        "subtitleEn": "Vintage Dynamo Lamps, Bells, Scales & Gramophones",
        "subtitleMr": "जुने डायनामो दिवे, घंटा, वजन काटे आणि ग्रामोफोन",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Reliving the Pure Joy of Pune’s Golden Pedaling Days",
        "titleMr": "पुण्याच्या शांत आणि निवांत सायकल युगाची गोड आठवण",
        "quoteEn": "“Two wheels that carried the dreams, independence, and daily rhythm of old Pune.”",
        "quoteMr": "“जुन्या पुण्याचे स्वातंत्र्य, साधेपणा आणि जगणे चालवणारी दोन चाके.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Pendse Museum • Wheels of Nostalgia",
        "titleMr": "पेंडसे सायकल संग्रहालय • आठवणींची सुंदर सफर",
        "subtitleEn": "Unique Specialty Museum • Explore Pune",
        "subtitleMr": "अनोखा सायकल वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan scanning from spokes and chain-guard up to the classic curved handlebar.",
      "twoPhotos": "Photo 1 showcases multi-tiered museum bicycle wall (Acts 1-2); Photo 2 zooms into vintage leather saddle and bell (Acts 3-5).",
      "threePhotos": "P1: Museum facade; P2: Hanging bicycle array; P3: WWII paratrooper cycle.",
      "fourPhotos": "P1: Room view; P2: Cycle wall; P3: Dynamo lamps; P4: Sunbeam vintage bike.",
      "fivePlusPhotos": "Breezy, nostalgic cuts accompanied by gentle acoustic guitar."
    }
  },
  "visapur-fort": {
    "placeId": "visapur-fort",
    "slug": "visapur-fort",
    "placeName": "Visapur Fort (Twin Fort of Lohagad)",
    "placeNameMr": "विसापूर किल्ला (लोहगडाचा जुळा किल्ला)",
    "category": "forts",
    "templateTitle": "Visapur Fort — Water Cascades & Twin Bastions of Lohagad",
    "templateTitleMr": "विसापूर • लोहगडाचा जुळा दुर्ग, पावसाळी धबधब्यांच्या पाषाण पायऱ्या",
    "conceptTaglineEn": "The expansive twin fort of Lohagad, celebrated for its monsoon waterfall staircase trek, ancient stone carvings, and Peshwa ruins.",
    "conceptTaglineMr": "लोहगडाचा जुळा किल्ला, जिथे पावसाळ्यात पायऱ्यांवरून वाहणाऱ्या धबधब्यातून वाट काढत विस्तीर्ण पठारावर चढाई होते.",
    "subtitle": "Maval Taluka, Lonavala • Pune 410401",
    "elevationOrEra": "Elevation 1,084 m",
    "visualMood": "White rushing waterfall steps underfoot, sprawling stone ramparts, cool fog shrouds, and expansive plateau greenery.",
    "palette": {
      "primary": "#0891b2",
      "secondary": "#0e7490",
      "accent": "#67e8f9",
      "overlayGradient": "linear-gradient(180deg, rgba(8,145,178,0.2) 0%, rgba(10,25,35,0.92) 100%)",
      "canvasFilter": "contrast(1.1) saturate(1.22) brightness(0.98)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "heroic",
      "kenBurnsScale": 1.2,
      "transitionEffect": "zoom_punch",
      "speedRampFactor": 1.35
    },
    "musicMapping": {
      "primaryTrackId": "song-sahyadri-breeze",
      "culturalGenre": "nature_ambient",
      "bpm": 80,
      "dropTimestampSec": 14,
      "socialAudioAttribution": {
        "instagramQuery": "Visapur Fort Waterfall Trek Reel / Monsoon Trek Lonavala",
        "youtubeQuery": "Visapur Fort Waterfall Stairs Trek 4K Drone",
        "recommendedSoundName": "Sahyadri Lakeside Bliss • Water Ripples"
      },
      "fallbackTrackId": "lakeside_chill"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "Trekking Through Living Waterfalls",
        "titleMr": "पावसाळी धबधब्यातून पायऱ्यांची थरारक चढाई",
        "subtitleEn": "Visapur Fort • Elevation 1,084 m",
        "subtitleMr": "विसापूर किल्ला • समुद्रसपाटीपासून १,०८४ मीटर",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Higher and Larger Than Its Twin Lohagad",
        "titleMr": "जुळ्या लोहगडापेक्षाही उंच आणि विस्तीर्ण पठार",
        "subtitleEn": "Built by Peshwa Balaji Vishwanath in 1713",
        "subtitleMr": "१७१३ मध्ये पेशवे बाळाजी विश्वनाथ यांनी बांधलेली तटबंदी",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Giant Hanuman Relief Carving & Peshwa Palace Ruins",
        "titleMr": "भव्य पाषाणातील मारुती मूर्ती आणि पेशवे वाड्याचे अवशेष",
        "subtitleEn": "Endless Stone Bastions Wrapping the Entire Plateau",
        "subtitleMr": "संपूर्ण पठाराला वेढलेली अखंड दगडी तटबंदी व तोफा",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "Where Rain, Stone, and Sahyadri Become One",
        "titleMr": "पाऊस, काळा पाषाण आणि सह्याद्रीच्या धुक्याचा संगम",
        "quoteEn": "“Climbing against rushing mountain torrents onto the clouds of Visapur.”",
        "quoteMr": "“खळाळणाऱ्या पाण्याच्या पाषाण पायऱ्यांवरून विसापूरच्या ढगांत पोहोचण्याचा थरार.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Visapur • The Monsoon King",
        "titleMr": "विसापूर • पावसाळी दुर्गभ्रमंतीचा अनभिषिक्त राजा",
        "subtitleEn": "Waterfall Fort Legend • Explore Pune",
        "subtitleMr": "जलदुर्ग वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Vertical upward tilt along waterfall cascade stairs rising toward the bastion wall.",
      "twoPhotos": "Photo 1 shows hikers climbing water stairs (Acts 1-2); Photo 2 showcases grand plateau ramparts (Acts 3-5).",
      "threePhotos": "P1: Waterfall stairs; P2: Stone ramparts overlooking Lohagad; P3: Plateau Hanuman carving.",
      "fourPhotos": "P1: Water trail; P2: Bastion; P3: Mist plateau; P4: Distant Lohagad vista.",
      "fivePlusPhotos": "High-energy splash and mist-filled mountain adventure progression."
    }
  },
  "vishrambaug-wada": {
    "placeId": "vishrambaug-wada",
    "slug": "vishrambaug-wada",
    "placeName": "Vishrambaug Wada",
    "placeNameMr": "विश्रामबाग वाडा",
    "category": "heritage",
    "templateTitle": "Vishrambaug Wada — Carved Teakwood & Bajirao II’s Court",
    "templateTitleMr": "विश्रामबाग वाडा • कोरीव सागवानी खांब व पेशवेकालीन वास्तुकला",
    "conceptTaglineEn": "The luxurious three-storied mansion built in 1807 by Peshwa Bajirao II, renowned for its exquisitely carved teakwood facade and Meghdambari balconies.",
    "conceptTaglineMr": "१८०७ मध्ये दुसऱ्या बाजीराव पेशव्यांनी बांधलेला तीन मजली वाडा, जो कोरीव सागवानी मेघडंबरी आणि कमानीदार चौक यासाठी प्रसिद्ध आहे.",
    "subtitle": "Thorale Bajirao Road, Sadashiv Peth • Pune 411030",
    "elevationOrEra": "Built 1807 AD (Peshwa Bajirao II)",
    "visualMood": "Polished teakwood columns, terracotta brickwork, intricate wooden brackets, and tranquil central chowk courtyards.",
    "palette": {
      "primary": "#b45309",
      "secondary": "#78350f",
      "accent": "#fde047",
      "overlayGradient": "linear-gradient(180deg, rgba(120,53,15,0.2) 0%, rgba(20,10,5,0.92) 100%)",
      "canvasFilter": "contrast(1.08) sepia(0.15) saturate(1.15)"
    },
    "typography": {
      "headerFont": "Cinzel, Georgia, serif",
      "bodyFont": "Plus Jakarta Sans, sans-serif",
      "accentCase": "uppercase"
    },
    "motionPresets": {
      "pacingSpeed": "regal",
      "kenBurnsScale": 1.15,
      "transitionEffect": "crossfade",
      "speedRampFactor": 1.2
    },
    "musicMapping": {
      "primaryTrackId": "song-peshwa-tarana",
      "culturalGenre": "peshwa_classical",
      "bpm": 104,
      "dropTimestampSec": 20,
      "socialAudioAttribution": {
        "instagramQuery": "Vishrambaug Wada Pune Teakwood Architecture Reel",
        "youtubeQuery": "Vishrambaug Wada Bajirao Road Pune 1807 Drone Walkthrough",
        "recommendedSoundName": "Peshwa Royal Tarana • 18th Century Darbar"
      },
      "fallbackTrackId": "heritage_classical"
    },
    "acts": [
      {
        "actNumber": 1,
        "actName": "hook",
        "durationSec": 3.5,
        "titleEn": "The Pinnacle of Peshwa Wooden Craftsmanship",
        "titleMr": "पेशवेकालीन लाकडी कोरीव कलेचा सर्वोच्च नमुना",
        "subtitleEn": "Vishrambaug Wada, Thorale Bajirao Road (1807)",
        "subtitleMr": "विश्रामबाग वाडा, थोरले बाजीराव रस्ता (१८०७)",
        "motionPreset": "zoom_punch"
      },
      {
        "actNumber": 2,
        "actName": "establishing",
        "durationSec": 6,
        "titleEn": "Built as the Luxury Residence of Peshwa Bajirao II",
        "titleMr": "दुसऱ्या बाजीराव पेशव्यांचा विलास आणि विश्रांती महाल",
        "subtitleEn": "Spanning Three Courtyards (Chowks) in Sadashiv Peth",
        "subtitleMr": "सदाशिव पेठेतील तीन मजली आणि तीन विस्तीर्ण चौकांची वास्तू",
        "motionPreset": "pan_horizontal"
      },
      {
        "actNumber": 3,
        "actName": "immersion",
        "durationSec": 7.5,
        "titleEn": "Meghdambari Balconies, Suru Columns & Carved Cypress Arches",
        "titleMr": "सागवानी मेघडंबरी, सुरुचे खांब आणि नक्षीदार लाकडी कमानी",
        "subtitleEn": "Historic Venue Where Sanskrit College & SPPU Took Root",
        "subtitleMr": "जिथे संस्कृत महाविद्यालय आणि पुणे विद्यापीठाची मुहूर्तमेढ रोवली",
        "motionPreset": "texture_macro"
      },
      {
        "actNumber": 4,
        "actName": "climax",
        "durationSec": 9,
        "titleEn": "A Symphony in Aged Teakwood and Terracotta",
        "titleMr": "सागवान आणि विटांच्या कलाकुसरीत जिवंत झालेला इतिहास",
        "quoteEn": "“Carved teakwood that whispers the grandeur, poetry, and tragedy of late Peshwa rule.”",
        "quoteMr": "“कोरीव सागवानी खांबांवर कोरलेला पेशवाईचा दिमाखदार आणि भावुक इतिहास.”",
        "motionPreset": "speed_ramp_climax"
      },
      {
        "actNumber": 5,
        "actName": "heroEnding",
        "durationSec": 6,
        "titleEn": "Vishrambaug • Masterpiece of Wood",
        "titleMr": "विश्रामबाग • पेशवे वास्तुकलेचे भूषण",
        "subtitleEn": "Peshwa Heritage Icon • Explore Pune",
        "subtitleMr": "ऐतिहासिक वाडा वारसा • एक्सप्लोर पुणे",
        "motionPreset": "cinematic_vignette_fade"
      }
    ],
    "photoFallbackRules": {
      "onePhoto": "Smooth upward pan along the carved teakwood facade from the entrance doors to the Meghdambari balcony.",
      "twoPhotos": "Photo 1 showcases historic exterior wood facade (Acts 1-2); Photo 2 zooms into inner courtyard teak pillars (Acts 3-5).",
      "threePhotos": "P1: Street exterior facade; P2: Carved Meghdambari; P3: Inner central chowk.",
      "fourPhotos": "P1: Facade; P2: Columns; P3: Balcony; P4: Inner courtyard.",
      "fivePlusPhotos": "Detailed architectural walkthrough highlighting timber craft and classical ambience."
    }
  }
};

const SLUG_ALIASES: Record<string, string> = {
  'fc-road': 'fc-road-culinary-trail',
  'fergusson-college-road': 'fc-road-culinary-trail',
  'koregaon-park': 'osho-teerth-park',
  'pu-la-deshpande-garden': 'okayama-friendship-garden',
  'pul-deshpande-garden': 'okayama-friendship-garden',
  'phule-wada': 'mahatma-phule-wada',
  'jyotirao-phule-wada': 'mahatma-phule-wada',
  'bhandarkar-institute': 'bhandarkar-oriental-research-institute',
  'bori': 'bhandarkar-oriental-research-institute',
  'bism': 'bharat-itihas-sanshodhak-mandal',
  'blades-of-glory': 'blades-of-glory-cricket-museum',
  'joshi-railway': 'joshi-miniature-railway',
  'joshis-museum-of-miniature-railways': 'joshi-miniature-railway',
  'dagdusheth': 'shreemant-dagdusheth-halwai-ganpati',
  'dagdusheth-ganpati': 'shreemant-dagdusheth-halwai-ganpati',
  'parvati': 'parvati-hill',
  'pataleshwar': 'pataleshwar-cave-temple',
  'jejuri': 'jejuri-khandoba-temple',
  'bhimashankar': 'bhimashankar-temple',
  'morgaon': 'morgaon-mayureshwar-ganpati',
  'siddhatek': 'siddhatek-siddhivinayak-ganpati',
  'theur': 'theur-chintamani-ganpati',
  'lenyadri': 'lenyadri-caves-ganpati',
  'ozar': 'ojas-ganpati-ozar',
  'ranjangaon': 'ranjangaon-mahaganpati',
  'mahad': 'mahad-varadvinayak-temple',
  'sinhagad': 'sinhagad-fort',
  'rajgad': 'rajgad-fort',
  'torna': 'torna-fort',
  'lohagad': 'lohagad-fort',
  'visapur': 'visapur-fort',
  'shivneri': 'shivneri-fort',
  'tikona': 'tikona-fort',
  'purandar': 'purandar-fort',
  'malhargad': 'malhargad-fort',
  'rajmachi': 'rajmachi-fort',
  'rohida': 'rohida-fort',
  'korigad': 'korigad-fort',
  'jivdhan': 'jivdhan-fort',
  'hadsar': 'hadsar-fort',
  'chavand': 'chavand-fort',
  'tamhini': 'tamhini-ghat',
  'khadakwasla': 'khadakwasla-dam',
  'panshet': 'panshet-dam',
  'varasgaon': 'varasgaon-dam',
  'mulshi': 'mulshi-dam',
  'pawna': 'pawna-lake',
  'bushi': 'bushi-dam',
  'tiger-point': 'tiger-point-lonavala',
  'kune-falls': 'kune-falls-viewpoint',
  'lavasa': 'lavasa-lakeside',
  'vetal': 'vetal-tekdi',
  'arai': 'arai-tekdi',
  'taljai': 'taljai-hills',
  'pashan': 'pashan-lake',
  'bedekar-tea-stall': 'bedekar-tea-stall-misal',
  'bedekar-misal': 'bedekar-tea-stall-misal',
  'katakirr': 'katakirr-misal-karve-nagar',
  'katakirr-misal': 'katakirr-misal-karve-nagar',
  'kayani': 'kayani-bakery-camp',
  'kayani-bakery': 'kayani-bakery-camp',
  'chitale': 'chitale-bandhu-bakarwadi',
  'chitale-bandhu': 'chitale-bandhu-bakarwadi',
  'sujata': 'sujata-mastani-sadashiv-peth',
  'sujata-mastani': 'sujata-mastani-sadashiv-peth',
};

/**
 * Finds a dedicated template if the place is published/known, or null if unknown
 */
export function findReelTemplate(placeIdOrSlug?: string | null): ReelTemplate106 | null {
  if (!placeIdOrSlug) return null;

  const raw = String(placeIdOrSlug).toLowerCase().trim();
  const clean = raw.replace(/^place-/, '');

  // 1. Direct match
  if (REEL_TEMPLATES_106[clean]) return REEL_TEMPLATES_106[clean];
  if (REEL_TEMPLATES_106[raw]) return REEL_TEMPLATES_106[raw];

  // 2. Direct ID match
  for (const t of Object.values(REEL_TEMPLATES_106)) {
    if (t.placeId === raw || t.placeId === clean) return t;
  }

  // 3. Known Aliases
  if (SLUG_ALIASES[clean] && REEL_TEMPLATES_106[SLUG_ALIASES[clean]]) {
    return REEL_TEMPLATES_106[SLUG_ALIASES[clean]];
  }

  return null;
}

/**
 * Retrieves the dedicated cinematic reel template for any place in Pune
 */
export function getReelTemplateForPlace(placeIdOrSlug?: string | null): ReelTemplate106 {
  const found = findReelTemplate(placeIdOrSlug);
  if (found) return found;
  return REEL_TEMPLATES_106['sinhagad-fort'];
}

/**
 * Returns all 106 unique cinematic templates
 */
export function getAllReelTemplates106(): ReelTemplate106[] {
  return Object.values(REEL_TEMPLATES_106);
}

/**
 * Returns all templates within a specific category
 */
export function getReelTemplatesByCategory(category: string): ReelTemplate106[] {
  const norm = category.toLowerCase().trim();
  return Object.values(REEL_TEMPLATES_106).filter(
    (t) => t.category.toLowerCase() === norm || norm.includes(t.category.toLowerCase())
  );
}

/**
 * Programmatic Validation Engine for the 106 Reel Templates
 */
export function validateReelTemplates106(): { valid: boolean; errors: string[]; count: number } {
  const errors: string[] = [];
  const entries = Object.entries(REEL_TEMPLATES_106);
  const titles = new Set<string>();
  const titlesMr = new Set<string>();

  if (entries.length !== 106) {
    errors.push(`Expected exactly 106 templates, found ${entries.length}`);
  }

  for (const [slug, t] of entries) {
    if (!t.placeId) errors.push(`[${slug}] Missing placeId`);
    if (!t.placeName) errors.push(`[${slug}] Missing placeName`);
    if (!t.templateTitle) errors.push(`[${slug}] Missing templateTitle`);
    if (!t.conceptTaglineEn) errors.push(`[${slug}] Missing conceptTaglineEn`);
    if (!t.visualMood) errors.push(`[${slug}] Missing visualMood`);

    if (titles.has(t.templateTitle)) {
      errors.push(`[${slug}] Duplicate templateTitle: "${t.templateTitle}"`);
    }
    titles.add(t.templateTitle);

    if (titlesMr.has(t.templateTitleMr)) {
      errors.push(`[${slug}] Duplicate templateTitleMr: "${t.templateTitleMr}"`);
    }
    titlesMr.add(t.templateTitleMr);

    if (!Array.isArray(t.acts) || t.acts.length !== 5) {
      errors.push(`[${slug}] Must contain exactly 5 narrative acts, found ${t.acts ? t.acts.length : 0}`);
    }

    if (!t.palette || !t.palette.canvasFilter) {
      errors.push(`[${slug}] Missing canvasFilter in palette`);
    }

    if (!t.musicMapping || !t.musicMapping.primaryTrackId) {
      errors.push(`[${slug}] Missing primaryTrackId in musicMapping`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    count: entries.length,
  };
}