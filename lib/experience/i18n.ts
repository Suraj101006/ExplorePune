/**
 * Explore Pune - Experience v2 Bilingual Internationalization Engine
 * Complete localized copy for Part A (Editorial Intro) and Part B (Interactive Map).
 */

export interface ExperienceV2Dictionary {
  meta: {
    title: string;
    description: string;
    tagline: string;
  };
  intro: {
    preloader: {
      title: string;
      subtitle: string;
      skip: string;
      progressLabel: string;
    };
    hero: {
      badge: string;
      headlineL1: string;
      headlineL2: string;
      subtitle: string;
      ctaFly: string;
      ctaBrowse: string;
      scrollHint: string;
      verifiedTag: string;
    };
    marquee: {
      liveUpdateBadge: string;
    };
    categoriesSlider: {
      badge: string;
      title: string;
      subtitle: string;
      prevBtn: string;
      nextBtn: string;
      exploreInMap: string;
      destinationsCount: string;
    };
    featureGuide: {
      badge: string;
      title: string;
      subtitle: string;
      scrollInstruction: string;
      tryItBtn: string;
    };
    numbers: {
      placesLabel: string;
      categoriesLabel: string;
      zonesLabel: string;
      itinerariesLabel: string;
      statSubtext: string;
    };
    stories: {
      badge: string;
      title: string;
      subtitle: string;
      readStoryBtn: string;
      viewAllBlogs: string;
    };
    faq: {
      badge: string;
      title: string;
      subtitle: string;
    };
    bridge: {
      badge: string;
      headline: string;
      subtext: string;
      enterMapBtn: string;
    };
  };
  map: {
    searchPlaceholder: string;
    allCategories: string;
    allZones: string;
    flyTrailBtn: string;
    pauseTour: string;
    resumeTour: string;
    skipStop: string;
    stopTour: string;
    tourProgress: string;
    tourHeading: string;
    trailNotice: string;
    zonesHeading: string;
    categoriesHeading: string;
    placesCount: string;
    noResults: string;
    openNow: string;
    closed: string;
    freeEntry: string;
    entryFeeLabel: string;
    hoursLabel: string;
    bestTimeLabel: string;
    transitLabel: string;
    addressLabel: string;
    approxZoneLabel: string;
    btnNavigate: string;
    btnSaveJourney: string;
    btnSaved: string;
    btnFullGuide: string;
    btnAddTrip: string;
    ctrlZoomIn: string;
    ctrlZoomOut: string;
    ctrlLocation: string;
    ctrlReset: string;
    ctrlTilt2d: string;
    ctrlTilt3d: string;
    attributionPrefix: string;
    directoryHeading: string;
    directorySubtext: string;
    showOnMap: string;
    noWebGlNotice: string;
    closeDrawer: string;
  };
}

const enDictionary: ExperienceV2Dictionary = {
  meta: {
    title: 'Experience Pune — Bold Discovery & Full-Screen 3D Map',
    description: 'Explore 106 verified destinations in Pune. A cinematic scroll intro meeting a full-screen interactive MapLibre vector map with animated flight trails and 5 geographic zones.',
    tagline: 'Discover More. Experience Pune.',
  },
  intro: {
    preloader: {
      title: 'Mapping Pune',
      subtitle: 'Calibrating 106 verified destinations and 5 geographic zones...',
      skip: 'Skip to Experience',
      progressLabel: 'Loading assets',
    },
    hero: {
      badge: 'EXPLORE PUNE 2.0 • OFFICIAL DISCOVERY PLATFORM',
      headlineL1: 'EXPLORE PUNE.',
      headlineL2: 'YOUR WAY.',
      subtitle: 'Every fortress rampart, Peshwa courtyard, sacred temple, and legendary food institution — mapped with verified municipal hours and cinematic spatial flights.',
      ctaFly: 'Fly Over Pune',
      ctaBrowse: 'Explore Features',
      scrollHint: 'Scroll to explore the guide',
      verifiedTag: '106 Places • 0 Guesswork',
    },
    marquee: {
      liveUpdateBadge: 'VERIFIED TELEMETRY',
    },
    categoriesSlider: {
      badge: 'EXPLORE BY INTEREST',
      title: 'Choose What Moves You',
      subtitle: 'From cloud-veiled Sahyadri citadels to 400-year-old artisanal quarters, explore our largest verified categories.',
      prevBtn: 'Previous Category',
      nextBtn: 'Next Category',
      exploreInMap: 'View on Interactive Map',
      destinationsCount: 'Destinations',
    },
    featureGuide: {
      badge: 'COMPREHENSIVE ECOSYSTEM',
      title: 'Everything You Need in One Guide',
      subtitle: 'Explore Pune is not an ordinary listing. It is a live travel utility built with real transit routes, offline expedition passes, and community-verified tips.',
      scrollInstruction: 'Scroll to explore verified features',
      tryItBtn: 'Try it now',
    },
    numbers: {
      placesLabel: 'Verified Places',
      categoriesLabel: 'Curated Categories',
      zonesLabel: 'Geographic Zones',
      itinerariesLabel: 'Ready Itineraries',
      statSubtext: '100% verified against ASI, Forest Department, and PMC municipal records.',
    },
    stories: {
      badge: 'FIELD DISPATCHES',
      title: 'First-Hand Travel Stories',
      subtitle: 'Real chronicles from Pune’s morning tekdis, rain-drenched fort ramparts, and historic Peth corridors.',
      readStoryBtn: 'Read full story',
      viewAllBlogs: 'Explore all travel blogs',
    },
    faq: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Real Answers for Real Travelers',
      subtitle: 'Everything you need to know about tickets, Sinhagad night curfews, metro stations, and offline trekking.',
    },
    bridge: {
      badge: 'THE MAP AWAITS',
      headline: 'Now See Pune in Motion.',
      subtext: 'Leave the editorial behind. Take flight across the volcanic basalt terrain of the Deccan Traps.',
      enterMapBtn: 'Launch Full Map',
    },
  },
  map: {
    searchPlaceholder: 'Search 106 verified destinations by name or street...',
    allCategories: 'All Categories',
    allZones: 'All Zones (Pune & Ghats)',
    flyTrailBtn: 'Fly the Trail',
    pauseTour: 'Pause Flight',
    resumeTour: 'Resume Flight',
    skipStop: 'Next Stop',
    stopTour: 'Exit Flight',
    tourProgress: 'Stop',
    tourHeading: 'Scenic Trail Flight',
    trailNotice: 'Animated flight trail uses straight-line vector bearings. Road navigation links out directly to Google Maps.',
    zonesHeading: 'Explore by Zone',
    categoriesHeading: 'Filter by Category',
    placesCount: 'Places Found',
    noResults: 'No destinations match your search or filter. Try clearing filters.',
    openNow: 'Open Now',
    closed: 'Closed Today',
    freeEntry: 'Free Entry (₹0)',
    entryFeeLabel: 'Entry Ticket',
    hoursLabel: 'Verified Timings',
    bestTimeLabel: 'Best Season',
    transitLabel: 'Nearby Transit',
    addressLabel: 'Address & Locality',
    approxZoneLabel: 'Zone (Approximate)',
    btnNavigate: 'Navigate via Google Maps',
    btnSaveJourney: 'Save to My Journey',
    btnSaved: 'Saved in Journey',
    btnFullGuide: 'View Full Guide',
    btnAddTrip: 'Add to Trip Planner',
    ctrlZoomIn: 'Zoom in',
    ctrlZoomOut: 'Zoom out',
    ctrlLocation: 'Locate me in Pune',
    ctrlReset: 'Reset to Pune Overview',
    ctrlTilt2d: 'Switch to 2D Top View',
    ctrlTilt3d: 'Switch to 3D Tilted View',
    attributionPrefix: 'Basemap © OpenFreeMap • Data © OpenStreetMap contributors (ODbL)',
    directoryHeading: 'Browse Destinations by Category',
    directorySubtext: 'The complete crawlable and accessible directory of all 106 verified places.',
    showOnMap: 'Show on Map',
    noWebGlNotice: 'WebGL is disabled or unsupported in your browser. You can explore all destinations through the verified directory below.',
    closeDrawer: 'Close place details',
  },
};

const mrDictionary: ExperienceV2Dictionary = {
  meta: {
    title: 'पुणे अनुभव — नवीन दृष्टिकोन आणि ३डी नकाशा',
    description: 'पुण्यातील १०६ पडताळलेली ठिकाणे. सिनेमॅटिक स्क्रोल प्रस्तावना आणि संपूर्ण स्क्रीनवर फिरणारा परस्परसंवादी मॅपलिबरे नकाशा.',
    tagline: 'अधिक शोधा. पुणे अनुभवा.',
  },
  intro: {
    preloader: {
      title: 'पुणे नकाशा सज्ज होत आहे',
      subtitle: '१०६ ठिकाणे आणि ५ भौगोलिक विभागांची मांडणी सुरू आहे...',
      skip: 'थेट सुरू करा',
      progressLabel: 'माहिती लोड होत आहे',
    },
    hero: {
      badge: 'एक्सप्लोर पुणे २.० • अधिकृत पर्यटन व्यासपीठ',
      headlineL1: 'पुणे अनुभवा.',
      headlineL2: 'तुमच्या पद्धतीने.',
      subtitle: 'शिवकालीन गड-किल्ले, पेशवेकालीन वाडे, पवित्र मंदिरे आणि अस्सल पुणेरी खाऊगल्ल्या — सर्व काही अचूक वेळा आणि विहंगम हवाई सफारीसह.',
      ctaFly: 'पुण्याची हवाई सफर',
      ctaBrowse: 'वैशिष्ट्ये पहा',
      scrollHint: 'खाली स्क्रोल करा',
      verifiedTag: '१०६ ठिकाणे • १००% पडताळणी',
    },
    marquee: {
      liveUpdateBadge: 'थेट माहिती',
    },
    categoriesSlider: {
      badge: 'आवडीनुसार निवडा',
      title: 'तुम्हाला काय आवडते?',
      subtitle: 'सह्याद्रीच्या उंच कड्यांपासून ते ४०० वर्षांच्या तांबट कारागिरीपर्यंत, सर्व प्रमुख श्रेणींचा शोध घ्या.',
      prevBtn: 'मागील श्रेणी',
      nextBtn: 'पुढील श्रेणी',
      exploreInMap: 'नकाशावर पहा',
      destinationsCount: 'ठिकाणे',
    },
    featureGuide: {
      badge: 'सर्वसमावेशक सुविधा',
      title: 'एकाच ठिकाणी संपूर्ण पुणे मार्गदर्शक',
      subtitle: 'एक्सप्लोर पुणे हे केवळ यादी नाही. हे मेट्रो, पीएमपीएमएल, ऑफलाइन पास आणि सुरक्षा सूचनांनी युक्त थेट पर्यटन साधन आहे.',
      scrollInstruction: 'सुविधा जाणून घेण्यासाठी खाली स्क्रोल करा',
      tryItBtn: 'आता वापरा',
    },
    numbers: {
      placesLabel: 'प्रमाणित ठिकाणे',
      categoriesLabel: 'निवडक श्रेणी',
      zonesLabel: 'भौगोलिक विभाग',
      itinerariesLabel: 'तयार प्रवास योजना',
      statSubtext: 'पुरातत्व विभाग, वन विभाग आणि पुणे महानगरपालिकेच्या अधिकृत नोंदींवर आधारित.',
    },
    stories: {
      badge: 'अनुभव आणि कथा',
      title: 'प्रवाशांचे थेट अनुभव',
      subtitle: 'पुण्याच्या टेकड्या, पावसाळ्यातील सिंहगड आणि ऐतिहासिक पेठांमधील सफारीचे वेधक लेख.',
      readStoryBtn: 'संपूर्ण कथा वाचा',
      viewAllBlogs: 'सर्व ब्लॉग्स पहा',
    },
    faq: {
      badge: 'वारंवार विचारले जाणारे प्रश्न',
      title: 'प्रवाशांच्या शंका आणि अचूक उत्तरे',
      subtitle: 'तिकीट दर, सिंहगडावरील नियम, मेट्रो स्थानके आणि ऑफलाइन माहितीबद्दल संपूर्ण मार्गदर्शन.',
    },
    bridge: {
      badge: 'नकाशा सज्ज आहे',
      headline: 'आता पुणे प्रत्यक्ष नकाशावर पहा.',
      subtext: 'शब्दांच्या पलीकडे जाऊन दख्खनच्या ज्वालामुखी खडकांवरून पुण्याचा विहंगम नकाशा अनुभवा.',
      enterMapBtn: 'नकाशा उघडा',
    },
  },
  map: {
    searchPlaceholder: '१०६ ठिकाणांमधून नाव किंवा पत्ता शोधा...',
    allCategories: 'सर्व श्रेणी',
    allZones: 'सर्व विभाग (पुणे व घाट)',
    flyTrailBtn: 'हवाई सफर सुरू करा',
    pauseTour: 'सफर थांबवा',
    resumeTour: 'सफर पुढे चालू ठेवा',
    skipStop: 'पुढील थांबा',
    stopTour: 'सफर बंद करा',
    tourProgress: 'थांबा',
    tourHeading: 'नयनरम्य हवाई सफर',
    trailNotice: 'हवाई मार्ग सरळ रेषेत दर्शवला आहे. रस्ते वाहतुकीसाठी गुगल मॅप्सचा वापर करा.',
    zonesHeading: 'विभागानुसार पहा',
    categoriesHeading: 'श्रेणीनुसार फिल्टर करा',
    placesCount: 'ठिकाणे सापडली',
    noResults: 'या निकषात कोणतेही ठिकाण सापडले नाही. कृपया फिल्टर बदला.',
    openNow: 'सुरू आहे',
    closed: 'आज बंद',
    freeEntry: 'मोफत प्रवेश (₹०)',
    entryFeeLabel: 'प्रवेश तिकीट',
    hoursLabel: 'अधिकृत वेळ',
    bestTimeLabel: 'सर्वोत्तम ऋतू',
    transitLabel: 'जवळचे वाहतूक साधन',
    addressLabel: 'पत्ता आणि परिसर',
    approxZoneLabel: 'विभाग (अंदाजे)',
    btnNavigate: 'गुगल मॅप्सद्वारे दिशा मिळवा',
    btnSaveJourney: 'माझ्या यात्रेत सेव्ह करा',
    btnSaved: 'यात्रेत सेव्ह केले',
    btnFullGuide: 'संपूर्ण माहिती पहा',
    btnAddTrip: 'प्रवास नियोजनात जोडा',
    ctrlZoomIn: 'मोठे करा (+)',
    ctrlZoomOut: 'लहान करा (-)',
    ctrlLocation: 'माझे सध्याचे स्थान',
    ctrlReset: 'पुणे पूर्ण दृश्य',
    ctrlTilt2d: '२डी सपाट दृश्य',
    ctrlTilt3d: '३डी तिरपे दृश्य',
    attributionPrefix: 'नकाशा © OpenFreeMap • माहिती © OpenStreetMap contributors (ODbL)',
    directoryHeading: 'श्रेणीनुसार सर्व ठिकाणे',
    directorySubtext: 'सर्व १०६ प्रमाणित पर्यटन स्थळांची सुलभ व वाचनक्षम यादी.',
    showOnMap: 'नकाशावर दाखवा',
    noWebGlNotice: 'आपल्या ब्राऊझरमध्ये WebGL उपलब्ध नाही. आपण खालील यादीतून सर्व ठिकाणे पाहू शकता.',
    closeDrawer: 'माहिती बंद करा',
  },
};

export function getExperienceV2I18n(lang: string = 'en'): ExperienceV2Dictionary {
  return lang === 'mr' ? mrDictionary : enDictionary;
}

export const getExperienceDictionary = getExperienceV2I18n;
