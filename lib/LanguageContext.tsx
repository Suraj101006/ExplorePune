'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'mr';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isMr: boolean;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.brand': 'Explore Pune',
    'nav.brandSubtitle': 'Historic Forts, Wadas & Sahyadris',
    'nav.explore': 'Explore',
    'nav.journey': 'My Journey',
    'nav.planner': 'Trip Planner',
    'nav.milestones': 'Milestones',
    'nav.blogs': 'Blogs & Stories',
    'nav.about': 'About & Data',
    'nav.account': 'My Account',
    'nav.admin': 'Admin',
    'nav.signin': 'Sign in',
    'nav.signout': 'Sign Out',
    'nav.langToggle': 'मराठी',

    // Hero Section
    'hero.badge': 'Curated Heritage & Travel Guide',
    'hero.title': 'Explore Pune’s Historic Forts, Wadas & Hidden Trails',
    'hero.sub': 'Community-curated landmark directory with verified opening hours, admission costs, and a smart travel itinerary builder.',
    'hero.searchPlaceholder': 'Search forts, wadas, temples, museums (e.g. Sinhagad, Shaniwar Wada)...',
    'hero.searchBtn': 'Search',
    'hero.filterAll': 'All Places',
    'hero.foundPlaces': 'Places Found in Pune',
    'hero.noPlaces': 'No places match your search or filter.',
    'hero.resetFilters': 'Clear Filters',

    // Categories
    'cat.forts': 'Heritage & Forts',
    'cat.heritage': 'Historic Wadas & Palaces',
    'cat.temples': 'Temples & Sacred Sites',
    'cat.museums': 'Museums & Galleries',
    'cat.parks': 'Parks & Botanical Gardens',
    'cat.nature': 'Lakes & Scenic Viewpoints',

    // Cards
    'card.verified': 'Verified Details',
    'card.enriched': 'Public Source Info',
    'card.listed': 'Hours Unverified',
    'card.view': 'View Details →',
    'card.free': 'Free Entry',
    'card.from': 'From ₹',
    'card.minVisit': 'min visit',

    // Milestones
    'milestones.badge': 'Punekar Hall of Fame',
    'milestones.title': 'Pune Heritage Milestones & Explorer Badges',
    'milestones.sub': 'Earn verified badges, conquer Sahyadri fortresses, unearth Peshwa citadels, and claim your place as an authentic Pune legend.',

    // Planner
    'planner.badge': 'Smart Itinerary Builder',
    'planner.title': 'Plan Your Pune Adventure',
    'planner.sub': 'Set your available hours and starting point. Our algorithm links optimal nearby places, estimates travel times across Pune, and checks ticket costs.',
    'planner.params': 'Trip Parameters',
    'planner.startPoint': 'Starting Point in Pune',
    'planner.startTime': 'Trip Start Time',
    'planner.availableTime': 'Available Time',
    'planner.mode': 'Travel Mode',
    'planner.walking': 'Walking',
    'planner.cycling': 'Cycling',
    'planner.driving': 'Driving',
    'planner.publicTransit': '🚇 Public Transit (Metro & Bus)',
    'planner.useGps': '📍 Use Selected Pune Hub',
    'planner.locating': 'Selecting Hub…',
    'planner.gpsDetected': 'Location Set',
    'planner.gpsAccuracy': 'Hub Area',
    'planner.gpsError': 'Location unavailable.',
    'planner.transitDirections': 'Transit Directions (Metro & Bus)',
    'planner.metroRoute': 'Pune Metro Route',
    'planner.busRoute': 'PMPML Bus Route',
    'planner.ticketPass': 'Ticket & Pass Info',
    'planner.budget': 'Max Budget / Person (₹)',
    'planner.includeUnverified': 'Include places with unverified hours',
    'planner.generateBtn': 'Generate Itinerary ✨',
    'planner.calculating': 'Calculating Best Route…',
    'planner.routeAwaits': 'Your Route Awaits',
    'planner.routeAwaitsSub': 'Select your starting location and preferences on the left, then click "Generate Itinerary" to build a custom step-by-step route.',
    'planner.noFeasible': 'No matching itinerary found in this timeframe. Try increasing duration or switching mode.',
    'planner.timePlanned': 'Time Planned',
    'planner.bufferTime': 'Buffer Time',
    'planner.estCost': 'Est. Entry Cost',
    'planner.routeItinerary': 'Route Itinerary',
    'planner.travel': 'travel',
    'planner.visit': 'visit',
    'planner.selectPlan': 'Choose an Itinerary Option (3 Distinct Plans)',
    'planner.plan1Badge': '🏛️ Classic Heritage',
    'planner.plan2Badge': '🌿 Scenic Nature',
    'planner.plan3Badge': '🛕 Spiritual & Arts',
    'planner.downloadPdf': 'Download Plan PDF',
    'planner.pdfSuccess': 'PDF downloaded successfully!',

    // Detail Page
    'place.back': '← Back to Explore',
    'place.overview': 'Overview',
    'place.hours': 'Opening Hours & Days',
    'place.pricing': 'Ticket Pricing',
    'place.location': 'Location & Address',
    'place.openInMaps': 'Open in Google Maps ↗',
    'place.closed': 'Closed',
    'place.open': 'Open',
    'place.freeEntry': 'Free Admission for everyone',
    'place.verifiedNotice': 'This spot has officially verified opening times and admission fees.',
    'place.unverifiedNotice': 'Hours and fees for this spot are sourced from public records and may vary on holidays.',
    'place.reviews': 'Traveller Reviews',
    'place.writeReview': 'Share Your Experience',

    // Chatbot
    'chat.fab': 'Ask Pune Guide',
    'chat.fabClose': 'Close Guide',
    'chat.title': 'Explore Pune AI Guide',
    'chat.subtitle': 'Verified Pune Cultural & Travel Assistant',
    'chat.welcome': 'Namaste! 🙏 I am your Explore Pune digital guide. Ask me anything about forts, wadas, temples, ticket prices, or travel itineraries in Pune.',
    'chat.placeholder': 'Ask about a place (e.g. Sinhagad timings, Shaniwar Wada)...',
    'chat.send': 'Send',
    'chat.suggested': 'Popular questions:',
    'chat.thinking': 'Consulting Pune records…',
    'chat.teaser': '👋 Exploring Pune? Ask me for tips & timings!',
    'chat.clear': 'Clear',
    'chat.shareLocation': '📍 Choose Pune Locality',
    'chat.locating': 'Loading Locality…',
    'chat.copyAnswer': 'Copy',
    'chat.copied': 'Copied!',
    'chat.helpful': 'Helpful',
    'chat.unhelpful': 'Not helpful',
    'chat.thanksFeedback': 'Thanks for feedback!',
    'chat.transitTitle': 'Transit Route & Directions',
    'chat.metroWhatsApp': 'Book Metro Ticket on WhatsApp',
    'home.nearMe': '📍 Near My Locality',
    'home.nearMeActive': 'Showing places nearest to your selected locality',
    'home.clearNearMe': 'Clear Filter',
    'place.publicTransitTitle': 'Public Transit Guide (Pune Metro & PMPML Buses)',
    'place.calcFromGps': '📍 Transit from Selected Locality',
    'place.nearestMetro': 'Nearest Pune Metro Station',
    'place.nearestBus': 'Nearest PMPML Bus Stop & Routes',
    'place.bookMetroWhatsApp': 'Book Pune Metro Ticket on WhatsApp',
    'place.pmpmlPassNote': 'PMPML ₹70 Day Pass (PMC + PCMC) or ₹150 All-Routes Pass gives unlimited rides all day.',
  },
  mr: {
    // Navigation
    'nav.brand': 'एक्सप्लोर पुणे',
    'nav.brandSubtitle': 'पुणे आणि सह्याद्री दर्शन',
    'nav.explore': 'ठिकाणे',
    'nav.journey': 'माझी सफर',
    'nav.planner': 'सहल नियोजन',
    'nav.milestones': 'यशोगाथा व बॅजेस',
    'nav.blogs': 'पर्यटन कथा',
    'nav.about': 'पुण्याबद्दल',
    'nav.account': 'माझे खाते',
    'nav.admin': 'प्रशासन',
    'nav.signin': 'लॉगिन',
    'nav.signout': 'बाहेर पडा',
    'nav.langToggle': 'English',

    // Hero Section
    'hero.badge': 'पुणे आणि सह्याद्रीच्या ऐतिहासिक वाटा',
    'hero.title': 'पुण्यातील ऐतिहासिक किल्ले, वाडे आणि प्रेक्षणीय स्थळे',
    'hero.sub': 'तपासलेले प्रवेश शुल्क, अधिकृत वेळ आणि सहल नियोजनासाठी पुण्याचे सर्वात परिपूर्ण डिजिटल मार्गदर्शक.',
    'hero.searchPlaceholder': 'किल्ले, वाडे, मंदिरे, उद्याने शोधा (उदा. सिंहगड, शनिवार वाडा)...',
    'hero.searchBtn': 'शोधा',
    'hero.filterAll': 'सर्व ठिकाणे',
    'hero.foundPlaces': 'पुण्यातील उपलब्ध ठिकाणे',
    'hero.noPlaces': 'या शोध किंवा वर्गवारीनुसार कोणतीही ठिकाणे सापडली नाहीत.',
    'hero.resetFilters': 'सर्व फिल्टर काढा',

    // Categories
    'cat.forts': 'किल्ले व गड',
    'cat.heritage': 'ऐतिहासिक वाडे व राजवाडे',
    'cat.temples': 'मंदिरे व तीर्थक्षेत्रे',
    'cat.museums': 'वस्तुसंग्रहालये',
    'cat.parks': 'उद्याने व बागा',
    'cat.nature': 'तलाव व निसर्गरम्य स्थळे',

    // Cards
    'card.verified': 'तपासलेले तपशील',
    'card.enriched': 'सार्वजनिक माहिती',
    'card.listed': 'वेळ निश्चित नाही',
    'card.view': 'तपशील पहा →',
    'card.free': 'मोफत प्रवेश',
    'card.from': 'किमान ₹',
    'card.minVisit': 'मि. भेट',

    // Milestones
    'milestones.badge': 'पुणेकर यशोगाथा दालन',
    'milestones.title': 'पुणे वारसा यशोगाथा व मानाची पदके',
    'milestones.sub': 'सह्याद्रीचे गड-किल्ले सर करा, पेशवाई वास्तूंचा वेध घ्या आणि अस्सल पुणेकर भ्रमंतीची मानाची पदके संपादन करा.',

    // Planner
    'planner.badge': 'स्मार्ट सहल नियोजन',
    'planner.title': 'तुमच्या पुणे सफरीचे नियोजन करा',
    'planner.sub': 'तुमच्याकडे उपलब्ध वेळ आणि सुरुवातीचे ठिकाण निवडा. आमची प्रणाली उत्तम जोडमार्ग, अचूक वेळ आणि अंदाजे खर्च दाखवेल.',
    'planner.params': 'सहल तपशील',
    'planner.startPoint': 'सुरुवातीचे ठिकाण',
    'planner.startTime': 'सुरुवात करण्याची वेळ',
    'planner.availableTime': 'उपलब्ध वेळ',
    'planner.mode': 'प्रवास साधन',
    'planner.walking': 'पायी',
    'planner.cycling': 'सायकल',
    'planner.driving': 'गाडी / कॅब',
    'planner.publicTransit': '🚇 सार्वजनिक वाहतूक (मेट्रो व बस)',
    'planner.useGps': '📍 निवडलेले पुणे केंद्र वापरा',
    'planner.locating': 'स्थान निवडत आहे…',
    'planner.gpsDetected': 'स्थान निश्चित झाले',
    'planner.gpsAccuracy': 'परिसर',
    'planner.gpsError': 'स्थान उपलब्ध नाही.',
    'planner.transitDirections': 'मेट्रो व बस प्रवास मार्गदर्शन',
    'planner.metroRoute': 'पुणे मेट्रो मार्ग',
    'planner.busRoute': 'पीएमपीएमएल बस मार्ग',
    'planner.ticketPass': 'तिकीट व पास माहिती',
    'planner.budget': 'कमाल बजेट / व्यक्ती (₹)',
    'planner.includeUnverified': 'अनिश्चित वेळ असलेली ठिकाणेही समाविष्ट करा',
    'planner.generateBtn': 'सहल आखा ✨',
    'planner.calculating': 'मार्ग तयार करत आहे…',
    'planner.routeAwaits': 'तुमचा प्रवास मार्ग तयार करा',
    'planner.routeAwaitsSub': 'डावीकडील तपशील निवडा आणि पायरी-दर-पायरी प्रवासाचा सुंदर मार्ग मिळवण्यासाठी "सहल आखा" वर क्लिक करा.',
    'planner.noFeasible': 'या वेळेत योग्य मार्ग सापडला नाही. कृपया जास्त वेळ द्या किंवा प्रवासाचे साधन बदला.',
    'planner.timePlanned': 'नियोजित वेळ',
    'planner.bufferTime': 'अतिरिक्त वेळ',
    'planner.estCost': 'अंदाजे तिकीट खर्च',
    'planner.routeItinerary': 'नियोजित मार्ग क्रम',
    'planner.travel': 'प्रवास',
    'planner.visit': 'भेट',
    'planner.selectPlan': 'तुमची आवडती सहल निवडा (३ भिन्न पर्याय)',
    'planner.plan1Badge': '🏛️ ऐतिहासिक वारसा',
    'planner.plan2Badge': '🌿 निसर्ग व टेकड्या',
    'planner.plan3Badge': '🛕 मंदिरे व संस्कृती',
    'planner.downloadPdf': 'सहल PDF डाऊनलोड करा',
    'planner.pdfSuccess': 'PDF डाऊनलोड झाली!',

    // Detail Page
    'place.back': '← परत यादीकडे',
    'place.overview': 'विहंगावलोकन व इतिहास',
    'place.hours': 'भेट देण्याची वेळ व दिवस',
    'place.pricing': 'प्रवेश शुल्क',
    'place.location': 'पत्ता व स्थान',
    'place.openInMaps': 'गुगल मॅप्सवर उघडा ↗',
    'place.closed': 'बंद',
    'place.open': 'उघडे',
    'place.freeEntry': 'सर्वांसाठी विनामूल्य प्रवेश',
    'place.verifiedNotice': 'या ठिकाणची वेळ आणि तिकीट दर अधिकृतरीत्या तपासलेले आहेत.',
    'place.unverifiedNotice': 'या ठिकाणचे तपशील सार्वजनिक नोंदींवरून घेतलेले आहेत; सुटीच्या दिवशी बदल असू शकतो.',
    'place.reviews': 'पर्यटकांच्या प्रतिक्रिया',
    'place.writeReview': 'तुमचा अनुभव नोंदवा',

    // Chatbot
    'chat.fab': 'पुणे मार्गदर्शक',
    'chat.fabClose': 'मार्गदर्शक बंद',
    'chat.title': 'एक्सप्लोर पुणे AI मार्गदर्शक',
    'chat.subtitle': 'अस्सल पुणेकर डिजिटल मार्गदर्शक',
    'chat.welcome': 'नमस्कार! 🙏 मी तुमचा एक्सप्लोर पुणे मार्गदर्शक आहे. पुण्यातील गड-किल्ले, वाडे, प्रसिद्ध मंदिरे, तिकीट दर किंवा फिरण्याबद्दल काहीही विचारा.',
    'chat.placeholder': 'ठिकाणाबद्दल विचारा (उदा. शनिवार वाड्याची वेळ, सिंहगड)...',
    'chat.send': 'पाठवा',
    'chat.suggested': 'नेहमी विचारले जाणारे प्रश्न:',
    'chat.thinking': 'पुणे नोंदी तपासत आहे…',
    'chat.teaser': '👋 नमस्कार! पुण्यात कुठे फिरायचे? मला विचारा!',
    'chat.clear': 'साफ करा',
    'chat.shareLocation': '📍 पुणे परिसर निवडा',
    'chat.locating': 'परिसर लोड होत आहे…',
    'chat.copyAnswer': 'कॉपी',
    'chat.copied': 'कॉपी झाले!',
    'chat.helpful': 'उपयुक्त',
    'chat.unhelpful': 'असमाधानकारक',
    'chat.thanksFeedback': 'प्रतिक्रियेबद्दल धन्यवाद!',
    'chat.transitTitle': 'सार्वजनिक वाहतूक मार्ग व मार्गदर्शन',
    'chat.metroWhatsApp': 'व्हॉट्सअॅपवर मेट्रो तिकीट बुक करा',
    'home.nearMe': '📍 माझ्या परिसराजवळ',
    'home.nearMeActive': 'निवडलेल्या परिसरापासून सर्वात जवळची ठिकाणे दाखवत आहे',
    'home.clearNearMe': 'फिल्टर काढा',
    'place.publicTransitTitle': 'सार्वजनिक वाहतूक मार्गदर्शक (पुणे मेट्रो व पीएमपीएमएल बस)',
    'place.calcFromGps': '📍 निवडलेल्या परिसरावरून मार्ग काढा',
    'place.nearestMetro': 'नजीकचे पुणे मेट्रो स्थानक',
    'place.nearestBus': 'नजीकचा पीएमपीएमएल बस थांबा व बस क्रमांक',
    'place.bookMetroWhatsApp': 'व्हॉट्सअॅपवर मेट्रो तिकीट बुक करा',
    'place.pmpmlPassNote': 'पीएमपीएमएल ₹७० दैनिक पास (मनपा + पिंपरी) किंवा ₹१५० ऑल-रूट पाससह दिवसभर अमर्याद बस प्रवास करता येतो.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  isMr: false,
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('punetrail_lang') as Language;
      if (stored === 'en' || stored === 'mr') {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('punetrail_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {}
  };

  const t = (key: string): string => {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isMr: lang === 'mr', t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
