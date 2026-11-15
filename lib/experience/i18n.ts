/**
 * Pune Through Time — Bilingual Experience Platform Dictionary (English & Marathi)
 * Comprehensive localized copy for all 9 chapters (Ch 0 to Ch 8) and global interactive controls.
 */

export interface ExperienceI18nDictionary {
  meta: {
    title: string;
    description: string;
    tagline: string;
    langName: string;
  };
  common: {
    audioOn: string;
    audioOff: string;
    audioMutedNotice: string;
    liteModeOn: string;
    liteModeOff: string;
    liteModeNotice: string;
    jumpToChapter: string;
    nextChapter: string;
    prevChapter: string;
    scrollDown: string;
    backToTop: string;
    shareExperience: string;
    linkCopied: string;
    viewDetails: string;
    getDirections: string;
    openMap: string;
    close: string;
    loading: string;
    verifiedBadge: string;
    exploreMore: string;
    saveToPassport: string;
  };
  chapters: {
    ch0_preloader: {
      badge: string;
      title: string;
      devanagariHero: string;
      subtitle: string;
      enterCta: string;
      skipCta: string;
      loadingStats: string;
      placesCount: string;
      fortsCount: string;
      centuriesCount: string;
    };
    ch1_arrival: {
      badge: string;
      title: string;
      subtitle: string;
      altitudeLabel: string;
      distanceLabel: string;
      battleYearLabel: string;
      keyFeature: string;
      weatherCardTitle: string;
      weatherNotice: string;
      exploreCta: string;
    };
    ch2_epochs: {
      badge: string;
      title: string;
      subtitle: string;
      instructions: string;
      epoch1: {
        name: string;
        timeframe: string;
        headline: string;
        narrative: string;
        style: string;
      };
      epoch2: {
        name: string;
        timeframe: string;
        headline: string;
        narrative: string;
        style: string;
      };
      epoch3: {
        name: string;
        timeframe: string;
        headline: string;
        narrative: string;
        style: string;
      };
      epoch4: {
        name: string;
        timeframe: string;
        headline: string;
        narrative: string;
        style: string;
      };
    };
    ch3_pathways: {
      badge: string;
      title: string;
      subtitle: string;
      dragInstruction: string;
      viewPathway: string;
      stopsLabel: string;
    };
    ch4_map: {
      badge: string;
      title: string;
      subtitle: string;
      todaysPethBadge: string;
      todaysPethTitle: string;
      establishedLabel: string;
      specialtyLabel: string;
      visitorTipLabel: string;
      allPethsHeading: string;
      filterAll: string;
      filterForts: string;
      filterHeritage: string;
      filterTemples: string;
      filterNature: string;
      filterFood: string;
      pinsFound: string;
    };
    ch5_playground: {
      badge: string;
      title: string;
      subtitle: string;
      game1Misal: {
        title: string;
        desc: string;
        actionLabel: string;
        completeMsg: string;
      };
      game2Tambat: {
        title: string;
        desc: string;
        actionLabel: string;
        completeMsg: string;
      };
      game3Tanaji: {
        title: string;
        desc: string;
        actionLabel: string;
        completeMsg: string;
      };
      game4Relic: {
        title: string;
        desc: string;
        actionLabel: string;
        completeMsg: string;
      };
      game5Dhol: {
        title: string;
        desc: string;
        actionLabel: string;
        completeMsg: string;
      };
    };
    ch6_seasons: {
      badge: string;
      title: string;
      subtitle: string;
      monsoon: {
        title: string;
        months: string;
        temp: string;
        atmosphere: string;
      };
      winter: {
        title: string;
        months: string;
        temp: string;
        atmosphere: string;
      };
      summer: {
        title: string;
        months: string;
        temp: string;
        atmosphere: string;
      };
      festive: {
        title: string;
        months: string;
        temp: string;
        atmosphere: string;
      };
    };
    ch7_plan: {
      badge: string;
      title: string;
      subtitle: string;
      templatesTitle: string;
      customBuilderTitle: string;
      finderTitle: string;
      estimatedTimeLabel: string;
      stopsCountLabel: string;
      addStopBtn: string;
      sharePlanBtn: string;
      savePlanBtn: string;
      gatingNotice: string;
      hoursSuffix: string;
    };
    ch8_outro: {
      badge: string;
      title: string;
      subtitle: string;
      passportHeading: string;
      passportSub: string;
      stampsEarned: string;
      sharePassportBtn: string;
      restartJourneyBtn: string;
      catalogSummaryTitle: string;
      totalPlacesVerified: string;
      totalFortsVerified: string;
      kelkarArtifactsVerified: string;
      shaniwarWadaHoursVerified: string;
      credits: string;
      puneriSignature: string;
    };
  };
}

export const EXPERIENCE_I18N: Record<'en' | 'mr', ExperienceI18nDictionary> = {
  en: {
    meta: {
      title: 'Pune Through Time — An Immersive Journey Across Centuries',
      description: 'Step into Pune’s living heritage: from 8th-century rock-cut monoliths and Chhatrapati Shivaji Maharaj’s Sahyadri bastions to Peshwa wadas and the modern cyber city.',
      tagline: '13 Centuries • 15 Forts • 106 Curated Landmarks',
      langName: 'English',
    },
    common: {
      audioOn: 'Sound: On',
      audioOff: 'Sound: Muted',
      audioMutedNotice: 'Audio muted by default (Strict rule). Click anytime to enable atmospheric soundscapes.',
      liteModeOn: 'Calm Lite Mode (Active)',
      liteModeOff: '3D WebGL Mode',
      liteModeNotice: 'Calm mode reduces motion and simplifies graphics for low bandwidth or battery preservation.',
      jumpToChapter: 'Jump to Chapter',
      nextChapter: 'Next Chapter',
      prevChapter: 'Previous Chapter',
      scrollDown: 'Scroll to Journey',
      backToTop: 'Back to Top',
      shareExperience: 'Share Experience',
      linkCopied: 'Link copied to clipboard!',
      viewDetails: 'View Landmark Details →',
      getDirections: 'Get Turn-by-Turn Directions',
      openMap: 'Explore on Living Map',
      close: 'Close',
      loading: 'Loading experience assets...',
      verifiedBadge: 'ASI & Trust Verified',
      exploreMore: 'Explore More',
      saveToPassport: 'Collect Digital Stamp',
    },
    chapters: {
      ch0_preloader: {
        badge: 'CHAPTER 0 • OVERTURE',
        title: 'Pune Through Time',
        devanagariHero: 'पुणे',
        subtitle: 'An interactive voyage through 13 centuries of Maratha valor, rock-cut architecture, scholarly revolutions, and culinary craft.',
        enterCta: 'Enter Experience',
        skipCta: 'Skip Intro',
        loadingStats: 'Calibrating geospatial layers & historic epochs',
        placesCount: '106 Places',
        fortsCount: '15 Historic Forts',
        centuriesCount: '13 Centuries',
      },
      ch1_arrival: {
        badge: 'CHAPTER 1 • SAHYADRI SENTINEL',
        title: 'The Bastion Above the Clouds: Sinhagad',
        subtitle: 'Rising 1,312 meters above sea level, Sinhagad Fort stands as the timeless guardian of Pune, etched in history by Tanaji Malusare’s 1670 night escalade.',
        altitudeLabel: '1,312 m (4,304 ft) Elevation',
        distanceLabel: '30 km South of Pune',
        battleYearLabel: '1670 CE Iconic Conquest',
        keyFeature: 'Monolithic basalt precipice overlooking Khadakwasla backwaters and the Torna ridge.',
        weatherCardTitle: 'Live Sahyadri Climate',
        weatherNotice: 'Forest Department gate curfew enforced: 06:00 PM – 06:00 AM.',
        exploreCta: 'Descend to Historical Epochs ↓',
      },
      ch2_epochs: {
        badge: 'CHAPTER 2 • TIMELINE MORPH',
        title: 'Four Epochs That Forged Pune',
        subtitle: 'Scrub through time to witness how subterranean basalt caves gave way to Shivaji’s swarajya, Peshwa teak palaces, and the freedom struggle.',
        instructions: 'Scroll slowly to scrub through the 4 transformative historical eras.',
        epoch1: {
          name: 'Rashtrakuta & Early Rock-Cut Era',
          timeframe: '8th Century CE (c. 750–900 CE)',
          headline: 'Subterranean Basalt Shrines & Ancient Crossroads',
          narrative: 'Carved contemporaneously with Ellora from a single basalt bed, Pataleshwar Cave Temple establishes Punyavishaya as an ancient sacred trading stop.',
          style: 'Monolithic Rock-Cut Basalt Architecture',
        },
        epoch2: {
          name: 'Chhatrapati Shivaji Maharaj & Hindavi Swarajya',
          timeframe: '17th Century CE (1630–1680 CE)',
          headline: 'The Cradle of Swarajya & Mountain Strongholds',
          narrative: 'From childhood in Lal Mahal under Rajmata Jijau to capturing Torna at 16, establishing Sinhagad as the southern shield, and founding sovereign Maratha rule.',
          style: 'Dry-Stone Bastions, Machis & Fortress Gateways',
        },
        epoch3: {
          name: 'Peshwa Era & The Wada Capital',
          timeframe: '18th to Early 19th Century (1714–1818 CE)',
          headline: 'Imperial Governance, Teak Palaces & 18 Bazaars',
          narrative: 'Peshwa Bajirao I turns Pune into the political capital of India. The massive 7-storey Shaniwar Wada, ornate Vishrambaug facades, and 18 weekday peths flourish.',
          style: 'Maratha Teak Wood Wada Architecture & Stone Plinths',
        },
        epoch4: {
          name: 'Social Renaissance & Freedom Struggle',
          timeframe: 'Mid-19th to 20th Century (1848–1947 CE)',
          headline: 'First Girls\' School, Swarajya Drums & Gandhi\'s Sanctuary',
          narrative: 'Jyotirao & Savitribai Phule ignite girls\' education at Bhide Wada (1848). Tilak mobilizes at Kesari Wada. Mahatma Gandhi interned at Aga Khan Palace.',
          style: 'Indo-Saracenic, Italianate Arches & Colonial Brick Palaces',
        },
      },
      ch3_pathways: {
        badge: 'CHAPTER 3 • 16 THEMATIC PATHWAYS',
        title: 'Choose Your Pune Discovery Pathway',
        subtitle: 'From Sahyadri ridge treks and heritage wadas to misal culinary crawls and coppersmith quarters: 16 curated lenses into the city.',
        dragInstruction: 'Drag or swipe horizontally to discover all 16 thematic pathways.',
        viewPathway: 'Explore Pathway Places',
        stopsLabel: 'Destinations',
      },
      ch4_map: {
        badge: 'CHAPTER 4 • LIVING MAP & TODAY’S PETH',
        title: 'Spatial Living Map of 106 Landmarks',
        subtitle: 'Navigate Pune’s geographic heart: explore 106 verified destinations and delve into the historic Pune Peth matching today’s day of the week.',
        todaysPethBadge: 'PETH OF THE DAY',
        todaysPethTitle: 'Today’s Historic Bazaar & Heritage Quarter',
        establishedLabel: 'Established & Origins',
        specialtyLabel: 'Specialty Bazaar',
        visitorTipLabel: 'Insider Walking Tip',
        allPethsHeading: 'The 7 Historic Day-of-the-Week Peths of Pune',
        filterAll: 'All 106',
        filterForts: '15 Forts',
        filterHeritage: '29 Heritage',
        filterTemples: '27 Temples',
        filterNature: '20 Nature & Parks',
        filterFood: '6 Culinary Gems',
        pinsFound: 'Landmarks Displayed',
      },
      ch5_playground: {
        badge: 'CHAPTER 5 • TACTILE PLAYGROUND',
        title: 'Interactive Pune Mini-Experiences',
        subtitle: 'Five hands-on tactile micro-games celebrating Pune’s distinct living traditions: culinary mastery, craft rhythms, and legendary courage.',
        game1Misal: {
          title: 'Puneri Misal Master',
          desc: 'Layer spicy usal, crisp farsan, fiery tarri, fine onions, and fresh lemon to balance authentic Puneri flavors.',
          actionLabel: 'Assemble Misal Bowl',
          completeMsg: 'Zanzanit! Authentic Puneri misal perfected.',
        },
        game2Tambat: {
          title: 'Matharkaam Beat Rhythm',
          desc: 'Match the rhythmic hammering beats of Kasba Peth’s 400-year-old coppersmith quarter (Tambat Ali).',
          actionLabel: 'Strike Copper Vessel',
          completeMsg: 'Flawless dimple pattern hand-hammered!',
        },
        game3Tanaji: {
          title: 'Tanaji’s Night Escalade (1670)',
          desc: 'Guide the Maratha night assault up the sheer vertical Dronagiri cliff of Sinhagad.',
          actionLabel: 'Ascend the Cliff',
          completeMsg: 'The bastion is taken: “Gad aala, pan Sinha gela!”',
        },
        game4Relic: {
          title: 'Kelkar Museum Relic Vault',
          desc: 'Unearth everyday masterpieces from Dr. Kelkar’s verified collection of 20,000+ Indian artifacts.',
          actionLabel: 'Inspect Medieval Artifact',
          completeMsg: 'Priceless artifact cataloged with museum records.',
        },
        game5Dhol: {
          title: 'Ganeshotsav Dhol-Tasha Pulse',
          desc: 'Tap along to the soaring dhol-tasha rhythms echoing through the 5 Manache Ganpati processions.',
          actionLabel: 'Play the Dhol Beat',
          completeMsg: 'Ganpati Bappa Morya! Street resonance maximum.',
        },
      },
      ch6_seasons: {
        badge: 'CHAPTER 6 • FOUR SEASONS OF PUNE',
        title: 'Pune’s Changing Weather & Atmosphere',
        subtitle: 'Experience how Pune’s spirit transforms across the four seasons: misty monsoon ghats, crisp winter tekdi walks, summer shaded wadas, and festive Ganeshotsav.',
        monsoon: {
          title: 'Monsoon Magic (Varsha Ritu)',
          months: 'June to September',
          temp: '22°C – 27°C • Fresh Showers & Mountain Clouds',
          atmosphere: 'Emerald green Sahyadris, gushing cascades at Tamhini and Bushi, and steaming pithla-bhakri at Sinhagad.',
        },
        winter: {
          title: 'Crisp Winter (Hemant & Shishir)',
          months: 'October to February',
          temp: '12°C – 28°C • Pleasant Chilly Mornings',
          atmosphere: 'Misty morning walks on Vetal Tekdi, cycling university tree avenues, and pleasant heritage exploration through the Peths.',
        },
        summer: {
          title: 'Golden Summer (Grishma Ritu)',
          months: 'March to May',
          temp: '24°C – 38°C • Warm Days & Breezy Evenings',
          atmosphere: 'Chilled mango mastani at Sujata, shaded teak courtyards of Vishrambaug Wada, and evening breeze at Khadakwasla Lake.',
        },
        festive: {
          title: 'Ganeshotsav Fervor (Bhadrapada)',
          months: 'August – September (10 Days)',
          temp: '23°C – 29°C • Electric Citywide Celebration',
          atmosphere: 'Booming dhol-tasha beats, 5 Manache Ganpati processions, magnificent Dagdusheth lighting, and fragrant steamed modaks.',
        },
      },
      ch7_plan: {
        badge: 'CHAPTER 7 • TRIP BUILDER & SMART FINDER',
        title: 'Plan Your Personalized Pune Expedition',
        subtitle: 'Select from 8 field-tested itinerary templates or tailor your custom sequence with realistic dwell & transit calculations and radius gating.',
        templatesTitle: '8 Curated Itinerary Templates',
        customBuilderTitle: 'Interactive Route Builder',
        finderTitle: 'Smart Personalized Trip Finder',
        estimatedTimeLabel: 'Realistic Total Duration',
        stopsCountLabel: 'Curated Stops',
        addStopBtn: 'Add Destination',
        sharePlanBtn: 'Share Custom Route',
        savePlanBtn: 'Save to My Journey',
        gatingNotice: 'Note: Short / Half-Day trips strictly filter places within 25 km of Pune center. Outlying getaways (like Karla Caves ~60 km) appear on Full-Day or Weekend journeys.',
        hoursSuffix: 'Hours',
      },
      ch8_outro: {
        badge: 'CHAPTER 8 • DIGITAL PASSPORT & FINALE',
        title: 'Your Pune Through Time Passport',
        subtitle: 'You have traversed 13 centuries of Pune’s living story. Carry your verified digital stamps and set forth to explore the city in person.',
        passportHeading: 'Official Heritage Exploration Passport',
        passportSub: 'Grounded in Pune’s verified 106-destination open catalog',
        stampsEarned: 'Collectible Badges Earned',
        sharePassportBtn: 'Share My Heritage Passport',
        restartJourneyBtn: 'Return to Preloader',
        catalogSummaryTitle: 'Verified Catalog Completeness',
        totalPlacesVerified: '106 Places (100% Geo-located)',
        totalFortsVerified: '15 Cataloged Forts • 7 Featured High-Altitude Forts',
        kelkarArtifactsVerified: '20,000+ Verified Museum Artifacts',
        shaniwarWadaHoursVerified: 'Official ASI Hours: 09:30 AM – 05:30 PM',
        credits: 'Curated with historical rigor by the Explore Pune Open Heritage Collective.',
        puneriSignature: 'पुणे तिथे काय उणे! (What could Pune possibly lack!)',
      },
    },
  },
  mr: {
    meta: {
      title: 'काळाच्या पडद्यावर पुणे — शतकांची जिवंत भ्रमंती',
      description: '८ व्या शतकातील पाताळेश्वर लेणी, छत्रपती शिवाजी महाराजांचे सह्याद्री किल्ले, पेशव्यांचे वाडे ते आधुनिक सायबर सिटीपर्यंतचा पुण्याचा भव्य वारसा.',
      tagline: '१३ शतके • १५ गड-किल्ले • १०६ पडताळलेली ऐतिहासिक ठिकाणे',
      langName: 'मराठी',
    },
    common: {
      audioOn: 'आवाज: सुरू',
      audioOff: 'आवाज: मूक (शांत मोड)',
      audioMutedNotice: 'कठोर नियम: आवाज सुरुवातीला बंद आहे. हवे असल्यास कधीही सुरू करा.',
      liteModeOn: 'शांत/लाईट मोड (सक्रिय)',
      liteModeOff: '३डी वेब-जीएल मोड',
      liteModeNotice: 'शांत मोड कमी डेटा आणि बॅटरी संवर्धनासाठी हालचाली मर्यादित ठेवतो.',
      jumpToChapter: 'प्रकरणाकडे जा',
      nextChapter: 'पुढील प्रकरण',
      prevChapter: 'मागील प्रकरण',
      scrollDown: 'खाली स्क्रोल करा',
      backToTop: 'सुरुवातीला जा',
      shareExperience: 'अनुभव शेअर करा',
      linkCopied: 'लिंक क्लिपबोर्डवर कॉपी झाली!',
      viewDetails: 'सविस्तर माहिती पहा →',
      getDirections: 'रस्ता व नकाशे मिळवा',
      openMap: 'जिवंत नकाशावर पहा',
      close: 'बंद करा',
      loading: 'माहिती व नकाशे लोड होत आहेत...',
      verifiedBadge: 'पुरातत्व व ट्रस्ट प्रमाणित',
      exploreMore: 'अधिक जाणून घ्या',
      saveToPassport: 'डिजिटल शिक्का मिळवा',
    },
    chapters: {
      ch0_preloader: {
        badge: 'प्रकरण ० • प्रस्तावना',
        title: 'काळाच्या पडद्यावर पुणे',
        devanagariHero: 'पुणे',
        subtitle: '१३ शतकांचा मराठा पराक्रम, एकाश्म पाषाण शिल्पकला, प्रबोधन चळवळी आणि अस्सल खाद्यसंस्कृतीची डिजिटल सफर.',
        enterCta: 'अनुभवात प्रवेश करा',
        skipCta: 'थेट सुरू करा',
        loadingStats: 'ऐतिहासिक कालखंड व नकाशे जोडले जात आहेत',
        placesCount: '१०६ ठिकाणे',
        fortsCount: '१५ ऐतिहासिक किल्ले',
        centuriesCount: '१३ शतके',
      },
      ch1_arrival: {
        badge: 'प्रकरण १ • सह्याद्रीचा रक्षक',
        title: 'ढगांच्या पलीकडला सिंहगड किल्ला',
        subtitle: 'समुद्रसपाटीपासून १,३१२ मीटर उंचीवर दिमाखात उभा असलेला सिंहगड — १६७० मध्ये नरवीर तानाजी मालुसरेंच्या पराक्रमाने पावन झालेली ऐतिहासिक भूमी.',
        altitudeLabel: '१,३१२ मीटर (४,३०४ फूट) उंची',
        distanceLabel: 'पुण्यापासून ३० किमी अंतरावर',
        battleYearLabel: 'इ.स. १६७० ची ऐतिहासिक लढाई',
        keyFeature: 'खडकवासला धरणाचा विहंगम जलाशय आणि तोरणा-राजगडाच्या डोंगररांगांचा पहारा देणारा कातळकडा.',
        weatherCardTitle: 'सध्याचे सह्याद्रीचे हवामान',
        weatherNotice: 'वन विभागाचा प्रवेश नियम: संध्याकाळी ६:०० ते सकाळी ६:०० पर्यंत गडावर प्रवेश बंद असतो.',
        exploreCta: 'ऐतिहासिक कालखंडाकडे चला ↓',
      },
      ch2_epochs: {
        badge: 'प्रकरण २ • कालखंड संक्रमण',
        title: 'पुण्याला घडवणारे चार ऐतिहासिक कालखंड',
        subtitle: 'हळूहळू स्क्रोल करत अनुभवा — पाताळेश्वरच्या काळ्या कातळापासून शिवरायांचे स्वराज्य, पेशव्यांचे वाडे आणि स्वातंत्र्यलढ्याचा इतिहास.',
        instructions: 'चारही ऐतिहासिक कालखंड अनुभवण्यासाठी सावकाश खाली स्क्रोल करा.',
        epoch1: {
          name: 'राष्ट्रकूट व प्राचीन शैलोत्कीर्ण काळ',
          timeframe: 'इ.स. ८ वे शतक (सुमारे ७५०–९००)',
          headline: 'जमीन खोदून कोरलेली भव्य बेसाल्ट लेणी व प्राचीन वस्ती',
          narrative: 'वेरूळच्या लेण्यांच्या समकालीन एकाच काळ्या कातळात कोरलेले पाताळेश्वर मंदिर. शिवकालीन पुण्याच्या शतकोन्-शतके आधी हे क्षेत्र पुण्यविषय म्हणून प्रसिद्ध होते.',
          style: 'एकाश्म कातळ-खोदीव बेसाल्ट शिल्पकला',
        },
        epoch2: {
          name: 'छत्रपती शिवाजी महाराज व हिंदवी स्वराज्य',
          timeframe: 'इ.स. १७ वे शतक (१६३०–१६८०)',
          headline: 'स्वराज्याची जननी आणि सह्याद्रीचे अजिंक्य गड-किल्ले',
          narrative: 'राजमाता जिजाऊंच्या संस्कारांत लाल महालात बालपण, वयाच्या अवघ्या १६ व्या वर्षी तोरणा जिंकून स्वराज्याची उभारणी, आणि सिंहगडावरून सह्याद्रीचे रक्षण.',
          style: 'चिरेबंदी तटबंदी, माच्या आणि गोमुखी प्रवेशद्वारे',
        },
        epoch3: {
          name: 'पेशवे काळ आणि शनिवार वाड्याची राजधानी',
          timeframe: 'इ.स. १८ वे ते १९ वे शतक (१७१४–१८१८)',
          headline: 'साम्राज्याची राजधानी, लाकडी वाडे आणि १८ पेठांचा विस्तार',
          narrative: 'थोरले बाजीराव पेशव्यांनी शनिवार वाडा बांधून पुण्याला राजधानी केले. अष्टकोनी कारंजे, सागवानी खांबांचे वाडे आणि आठवड्याच्या वारांनुसार १८ पेठांची स्थापना झाली.',
          style: 'सुरेख लाकडी कोरीव काम, मेघडंबरी व दगडी जोते',
        },
        epoch4: {
          name: 'सामाजिक प्रबोधन व स्वातंत्र्य लढा',
          timeframe: 'इ.स. १९ वे ते २० वे शतक (१८४८–१९४७)',
          headline: 'पहिली मुलींची शाळा, टिळकांचे केसरी आणि गांधीजींचा मुक्काम',
          narrative: 'महात्मा जोतीराव व क्रांतीज्योती सावित्रीबाई फुले यांनी भिडे वाड्यात मुलींची पहिली शाळा काढली. टिळकांनी केसरी वाड्यातून जनजागृती केली आणि आगाखान पॅलेस स्वातंत्र्यलढ्याचे साक्षीदार ठरले.',
          style: 'इंडो-सारासेनिक, इटालियन कमानी आणि वसाहतकालीन स्थापत्य',
        },
      },
      ch3_pathways: {
        badge: 'प्रकरण ३ • १६ शोध मार्ग',
        title: 'पुणे दर्शनाचे १६ अनमोल पैलू',
        subtitle: 'सह्याद्रीच्या डोंगरवाटा, ऐतिहासिक वाडे, अस्सल पुणेरी मिसळ ते तांबट आळीतील कारागिरी — पुण्याचा प्रत्येक रंग उलगडणारे १६ मार्ग.',
        dragInstruction: 'सर्व १६ मार्ग पाहण्यासाठी डावीकडे किंवा उजवीकडे स्वाइप करा.',
        viewPathway: 'मार्गातील ठिकाणे पहा',
        stopsLabel: 'ठिकाणे',
      },
      ch4_map: {
        badge: 'प्रकरण ४ • जिवंत नकाशा व आजची पेठ',
        title: '१०६ ठिकाणांचा त्रिमितीय नकाशा',
        subtitle: 'पुण्याचा भूगोलीय नकाशा अनुभवा: १०६ प्रमाणित ठिकाणे एक्सप्लोर करा आणि आजच्या वारानुसार जुन्या पुण्यातील ऐतिहासिक पेठेची सफर करा.',
        todaysPethBadge: 'आजचा वार • आजची पेठ',
        todaysPethTitle: 'वारानुसार आजची ऐतिहासिक पेठ व बाजार',
        establishedLabel: 'स्थापना व इतिहास',
        specialtyLabel: 'प्रसिद्ध बाजारपेठ',
        visitorTipLabel: 'भ्रमंतीसाठी खास टीप',
        allPethsHeading: 'पुण्यातील वारांनुसार वसलेल्या ७ ऐतिहासिक पेठा',
        filterAll: 'सर्व १०६',
        filterForts: '१५ किल्ले',
        filterHeritage: '२९ वाडे व स्मारके',
        filterTemples: '२७ मंदिरे',
        filterNature: '२० निसर्ग व उद्याने',
        filterFood: '६ खाद्य वारसा',
        pinsFound: 'दिसणारी ठिकाणे',
      },
      ch5_playground: {
        badge: 'प्रकरण ५ • परस्परसंवादी खेळघर',
        title: 'पुण्याशी नाते जोडणारे ५ खेळ',
        subtitle: 'पुण्याच्या जिवंत परंपरेचा थेट अनुभव घ्या: मिसळ बनवणे, तांबट काम, सिंहगड चढाई, अमूल्य वस्तूंचा खजिना आणि ढोल-ताशा ताल.',
        game1Misal: {
          title: 'अस्सल पुणेरी मिसळ मेकर',
          desc: 'मटकी उसळ, कुरकुरीत फरसाण, झणझणीत तर्री, कांदा आणि लिंबू पिळून अस्सल पुणेरी मिसळ तयार करा.',
          actionLabel: 'मिसळ वाटी बनवा',
          completeMsg: 'झणझणीत! अस्सल पुणेरी चव तयार झाली.',
        },
        game2Tambat: {
          title: 'तांबट आळी — माथारकाम ताल',
          desc: 'कसबा पेठेतील ४०० वर्षे जुन्या तांबट आळीतील तांब्याच्या भांड्यांवर हाताने घण मारण्याचा ताल जुळवा.',
          actionLabel: 'तांब्यावर घण मारा',
          completeMsg: 'उत्कृष्ट! सुंदर माथारकाम नक्षी कोरली गेली.',
        },
        game3Tanaji: {
          title: 'नरवीर तानाजी मालुसरे — सिंहगड मोहीम (१६७०)',
          desc: 'सिंहगडाच्या सरळसोट द्रोणागिरी कड्यावरून रात्रीच्या अंधारात मावळ्यांची धाडसी चढाई पूर्ण करा.',
          actionLabel: 'कडा चढून जा',
          completeMsg: 'गड आला पण सिंह गेला! सिंहगडावर स्वराज्याचा भगवा फडकला.',
        },
        game4Relic: {
          title: 'राजा केळकर संग्रहालय — अमूल्य खजिना',
          desc: 'डॉ. केळकरांनी भारतभरातून गोळा केलेल्या २०,०००+ दुर्मिळ ऐतिहासिक वस्तू आणि मस्तानी महालाचे दर्शन घ्या.',
          actionLabel: 'दुर्मिळ वस्तू तपासा',
          completeMsg: 'ऐतिहासिक ठेवा संग्रहालयात जतन केला गेला.',
        },
        game5Dhol: {
          title: 'पुणेरी ढोल-ताशा गजर',
          desc: '५ मानाच्या गणपतींच्या मिरवणुकीतील दुमदुमणाऱ्या ढोल-ताशांच्या तालावर ठेका धरा.',
          actionLabel: 'ढोलावर काठी मारा',
          completeMsg: 'गणपती बाप्पा मोरया! वातावरणात जल्लोष संचारला.',
        },
      },
      ch6_seasons: {
        badge: 'प्रकरण ६ • पुण्याचे चार ऋतू',
        title: 'ऋतुमानानुसार बदलणारे पुण्याचे रूप',
        subtitle: 'पुण्याचा निसर्ग आणि उत्सव चारही ऋतूंमध्ये कसा बहरतो ते पहा — पावसाळ्यातील धुक्याचे किल्ले, गुलाबी हिवाळा, सावलीचे वाडे आणि गणेशोत्सव.',
        monsoon: {
          title: 'पावसाळा (वर्षा ऋतूची मोहिनी)',
          months: 'जून ते सप्टेंबर',
          temp: '२२°से ते २७°से • रिमझिम पाऊस व दाट धुके',
          atmosphere: 'हिरवेगार सह्याद्री, ताम्हिणीचे फेसाळणारे धबधबे आणि सिंहगड पायथ्याशी गरमागरम कांदा भजी व पिठलं-भाकरी.',
        },
        winter: {
          title: 'गुलाबी हिवाळा (हेमंत व शिशिर)',
          months: 'ऑक्टोबर ते फेब्रुवारी',
          temp: '१२°से ते २८°से • आल्हाददायक सकाळ व रात्रीची थंडी',
          atmosphere: 'वेताळ टेकडीवरील मॉर्निंग वॉक, विद्यापीठातील झाडींचे रस्ते आणि जुन्या पेठांमधील सुखद हेरिटेज वॉक.',
        },
        summer: {
          title: 'सोनेरी उन्हाळा (ग्रीष्म ऋतू)',
          months: 'मार्च ते मे',
          temp: '२४°से ते ३८°से • सोनेरी दुपार व गार सायंकाळ',
          atmosphere: 'सुजाता मस्तानीची थंडगार चव, विश्रामबाग वाड्याची शांत सावली आणि खडकवासला धरणावरील झुळूक.',
        },
        festive: {
          title: 'गणेशोत्सव (भाद्रपद महापर्व)',
          months: 'ऑगस्ट – सप्टेंबर (१० दिवस)',
          temp: '२३°से ते २९°से • अभूतपूर्व जल्लोष व भक्तिभाव',
          atmosphere: 'दुमदुमणारे ढोल-ताशा पथक, ५ मानाचे गणपती दर्शन, श्रीमंत दगडूशेठचा नेत्रदीपक देखावा आणि उकडीचे मोदक.',
        },
      },
      ch7_plan: {
        badge: 'प्रकरण ७ • प्रवास योजना व फाइंडर',
        title: 'तुमची स्वतःची पुणे भ्रमंती योजना आखा',
        subtitle: '८ पूर्वनिर्मित आदर्श यात्रांमधून निवडा किंवा स्वतःची ठिकाणे जोडून वास्तववादी वेळ व अंतराच्या नियमांसह योजना तयार करा.',
        templatesTitle: '८ पूर्वनिर्मित प्रवास योजना',
        customBuilderTitle: 'स्वतःची योजना तयार करा',
        finderTitle: 'स्मार्ट वैयक्तिक अनुभव फाइंडर',
        estimatedTimeLabel: 'अंदाजे वास्तववादी वेळ',
        stopsCountLabel: 'निवडलेले थांबे',
        addStopBtn: 'नवीन ठिकाण जोडा',
        sharePlanBtn: 'योजना शेअर करा',
        savePlanBtn: 'माझ्या यात्रेत जतन करा',
        gatingNotice: 'टीप: २ तास किंवा अर्ध्या दिवसाच्या सहलीसाठी पुण्याच्या मध्यवर्ती भागापासून २५ किमी अंतरावरील ठिकाणेच येतात. कार्ला लेणी (~६० किमी) सारखी दूरची ठिकाणे पूर्ण दिवस किंवा वीकेंडला दिसतात.',
        hoursSuffix: 'तास',
      },
      ch8_outro: {
        badge: 'प्रकरण ८ • डिजिटल पासपोर्ट व समारोप',
        title: 'तुमचा पुणे हेरिटेज पासपोर्ट',
        subtitle: 'तुम्ही पुण्याचा १३ शतकांचा वारसा अनुभवला आहे. तुमचे डिजिटल शिक्के सोबत बाळगा आणि पुण्याची प्रत्यक्ष भ्रमंती सुरू करा.',
        passportHeading: 'अधिकृत पुणे वारसा शोध पासपोर्ट',
        passportSub: '१०६ पडताळलेल्या ऐतिहासिक स्थळांवर आधारित',
        stampsEarned: 'मिळालेले ऐतिहासिक डिजिटल शिक्के',
        sharePassportBtn: 'माझा हेरिटेज पासपोर्ट शेअर करा',
        restartJourneyBtn: 'पुन्हा पहिल्या प्रकरणाकडे जा',
        catalogSummaryTitle: 'प्रमाणित माहितीचा आढावा',
        totalPlacesVerified: '१०६ ठिकाणे (१००% अचूक स्थान)',
        totalFortsVerified: '१५ नोंदणीकृत किल्ले • ७ प्रमुख सह्याद्री किल्ले',
        kelkarArtifactsVerified: '२०,०००+ प्रमाणित ऐतिहासिक वस्तू',
        shaniwarWadaHoursVerified: 'एएसआय अधिकृत वेळ: सकाळी ०९:३० ते संध्याकाळी ०५:३०',
        credits: 'Explore Pune ओपन हेरिटेज प्रकल्पाद्वारे ऐतिहासिक सत्याधारित निर्मिती.',
        puneriSignature: 'पुणे तिथे काय उणे!',
      },
    },
  },
};

/**
 * Returns the complete i18n dictionary for the requested language
 */
export function getExperienceI18n(lang: 'en' | 'mr'): ExperienceI18nDictionary {
  return EXPERIENCE_I18N[lang] || EXPERIENCE_I18N.en;
}
