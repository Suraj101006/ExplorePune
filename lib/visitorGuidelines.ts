/**
 * Explore Pune - Comprehensive Visitor Guidelines Engine
 * Generates structured, authentic, actionable visitor guidelines for any Pune landmark:
 * How to Reach (Metro, Bus, Cab/Car), Ideal Hours, Entry Tickets, Do's & Don'ts, and Local Food Tips.
 */

export interface VisitorGuidelineSection {
  titleEn: string;
  titleMr: string;
  icon: string;
  items: Array<{
    labelEn: string;
    labelMr: string;
    descEn: string;
    descMr: string;
    tag?: string;
  }>;
}

export interface PlaceGuidelines {
  summaryEn: string;
  summaryMr: string;
  difficultyOrTypeEn?: string;
  difficultyOrTypeMr?: string;
  sections: VisitorGuidelineSection[];
  proTipsEn: string[];
  proTipsMr: string[];
  nearbyCulinaryEn: string[];
  nearbyCulinaryMr: string[];
}

export function getPlaceVisitorGuidelines(place: {
  id: string;
  slug?: string;
  name: string;
  name_mr?: string;
  category_slug?: string;
  category?: string;
  address?: string;
  address_mr?: string;
  latitude?: number;
  longitude?: number;
  place_prices?: Array<{ amount?: number; is_free?: boolean; visitor_category?: string }>;
  place_hours?: Array<{ opens_at?: string; closes_at?: string; is_closed?: boolean }>;
  recommended_duration_minutes?: number;
  best_time?: string;
  best_time_mr?: string;
}): PlaceGuidelines {
  const slug = place.slug || place.id;
  const cat = place.category_slug || place.category || 'heritage';
  const isFree = place.place_prices?.some((p) => p.is_free || p.amount === 0) ?? false;
  const basePrice = place.place_prices?.[0]?.amount || (isFree ? 0 : 25);

  const durationMins = place.recommended_duration_minutes || 60;
  const durationTextEn = durationMins >= 120 ? `${Math.round(durationMins / 60)} to ${Math.round(durationMins / 60) + 1} hours` : `${durationMins} minutes`;
  const durationTextMr = durationMins >= 120 ? `${Math.round(durationMins / 60)} ते ${Math.round(durationMins / 60) + 1} तास` : `${durationMins} मिनिटे`;

  // 1. FORTS & SAHYADRI TREKS
  if (cat === 'forts' || slug.includes('fort') || slug.includes('gad')) {
    return {
      summaryEn: `Perched on the Sahyadri ridges, visiting ${place.name} requires comfortable footwear and modest physical effort. Early mornings or monsoons offer the most breathtaking views.`,
      summaryMr: `${place.name_mr || place.name} सह्याद्रीच्या डोंगररांगेवर वसलेला असून येथे भेट देण्यासाठी आरामदायक शूज आणि पूर्वतयारी आवश्यक आहे. पहाटे किंवा पावसाळ्यात येथील निसर्ग नयनरम्य असतो.`,
      difficultyOrTypeEn: 'Moderate Mountain Trek / Heritage Walk',
      difficultyOrTypeMr: 'मध्यम डोंगरी ट्रेक / ऐतिहासिक भ्रमंती',
      sections: [
        {
          titleEn: 'How to Reach & Commute',
          titleMr: 'कसे पोहोचावे आणि प्रवास पर्याय',
          icon: '🧭',
          items: [
            {
              labelEn: 'By Public Bus (PMPML / MSRTC)',
              labelMr: 'सार्वजनिक बस सेवा (पीएमपीएमएल / एसटी)',
              descEn: 'Take Metro Line 1 to Swargate, then board PMPML Bus 50 (to Sinhagad Paytha/Donje) or MSRTC ST bus towards base village. Shared Jeeps run from foothills to top for ₹70-₹100.',
              descMr: 'स्वारगेट मेट्रो स्थानकावरून पीएमपीएमएल बस क्र. ५० (सिंहगड पायथा/डोणजे) किंवा एसटी बस पकडा. पायथ्यावरून गडावर जाण्यासाठी शेअर जीप (₹७० ते ₹१००) उपलब्ध आहेत.',
              tag: 'Recommended Budget Option',
            },
            {
              labelEn: 'By Private Car / Bike',
              labelMr: 'खाजगी कार किंवा दुचाकीने',
              descEn: 'Well-paved ghat roads lead to base village. Forest Department toll (approx ₹50-₹100) applies for vehicles driving up to the summit parking lot during open hours.',
              descMr: 'पायथ्यापर्यंत चांगला पक्का रस्ता आहे. गडावरील वाहनतळापर्यंत जाण्यासाठी वनविभागाचे नाममात्र शुल्क (₹५०-₹१००) आकारले जाते.',
            },
            {
              labelEn: 'Hiking / Trekking Trail',
              labelMr: 'पायी ट्रेकिंग मार्ग',
              descEn: 'Marked stone trails start from base villages (e.g. Donje, Gunjavane, Velhe). Average ascent time is 1.5 to 2.5 hours with stone steps and shaded resting stalls.',
              descMr: 'पायथ्याच्या गावातून दगडी पायऱ्यांचा मार्ग सुरू होतो. चढाईसाठी अंदाजे १.५ ते २.५ तास लागतात. वाटेत ताक, पाणी आणि लिंबू सरबत मिळते.',
            },
          ],
        },
        {
          titleEn: 'Timing, Entry & Tickets',
          titleMr: 'वेळ, प्रवेश आणि तिकीट नियम',
          icon: '🎟️',
          items: [
            {
              labelEn: 'Operating Hours',
              labelMr: 'भेट देण्याची वेळ',
              descEn: 'Gates open early morning around 06:00 AM and close by 06:00 PM for security and forest protection. Night camping without forest permission is strictly prohibited.',
              descMr: 'सकाळी ६:०० वाजता प्रवेश खुला होतो व संध्याकाळी ६:०० वाजता बंद होतो. रात्री मुक्काम करण्यास वनविभागाची बंदी आहे.',
            },
            {
              labelEn: 'Entry Fee & Forest Pass',
              labelMr: 'प्रवेश शुल्क',
              descEn: isFree ? 'Entry is free. Nominal vehicle parking and forest conservation cess applies.' : `Forest entry fee: approx ₹${basePrice} per person. Keep digital UPI or cash handy.`,
              descMr: isFree ? 'प्रवेश विनामूल्य आहे. वाहनांसाठी नाममात्र पार्किंग शुल्क लागते.' : `वनविभाग प्रवेश शुल्क: अंदाजे ₹${basePrice} प्रति व्यक्ती. रोख किंवा यूपीआय पेमेंट चालू शकते.`,
            },
            {
              labelEn: 'Recommended Duration',
              labelMr: 'अपेक्षित वेळ',
              descEn: `Plan at least ${durationTextEn} to explore bastions, water cisterns (tanks), memorials, and scenic cliffs.`,
              descMr: `बुरुज, ऐतिहासिक अवशेष, पाण्याची टाकी आणि कडे पाहण्यासाठी किमान ${durationTextMr} वेळ हाताशी ठेवा.`,
            },
          ],
        },
        {
          titleEn: 'Visitor Guidelines & Rules (Do’s and Don’ts)',
          titleMr: 'पर्यटक आचारसंहिता व नियम (काय करावे / काय करू नये)',
          icon: '📋',
          items: [
            {
              labelEn: 'Footwear & Clothing',
              labelMr: 'पादत्राणे आणि कपडे',
              descEn: 'Wear sports or trekking shoes with reliable grip on wet rock. Loose breathable cotton clothes or rainwear in monsoon are highly recommended.',
              descMr: 'खडकांवर घसरू नये म्हणून ग्रीप असणारे ट्रेकिंग किंवा स्पोर्ट्स शूज घाला. पावसाळ्यात रेनकोट किंवा विंडरचीटर सोबत ठेवा.',
              tag: 'Important',
            },
            {
              labelEn: 'Cleanliness & Plastic Ban',
              labelMr: 'स्वच्छता आणि प्लास्टिक बंदी',
              descEn: 'Historic forts are revered heritage monuments. Do not litter single-use plastic bottles or wrappers. Alcohol consumption and loud speakers are legally banned.',
              descMr: 'किल्ले ही आपली पवित्र ऐतिहासिक स्मारके आहेत. प्लास्टिक कचरा करू नका. मद्यपान, धूम्रपान आणि मोठ्या आवाजात स्पीकर वाजवण्यास सक्त मनाई आहे.',
              tag: 'Strict Law',
            },
            {
              labelEn: 'Drinking Water & Essentials',
              labelMr: 'पिण्याचे पाणी व प्रथमोपचार',
              descEn: 'Natural cold mountain spring water tanks are available at historic cisterns, but carrying at least 1 litre of your own drinking water and a small towel is recommended.',
              descMr: 'गडावर नैसर्गिक पाण्याची टाकी आहेत, तरीही किमान १ लिटर पिण्याचे पाणी आणि लहान टॉवेल सोबत बाळगणे उत्तम.',
            },
          ],
        },
      ],
      proTipsEn: [
        'Start your hike before 07:30 AM to beat the midday sun and catch clouds drifting over the Sahyadri valleys.',
        'Carry a power bank as mobile network signal can be intermittent along mountain ridges.',
        'Support local villagers who manage authentic stone resting stalls along the path.',
      ],
      proTipsMr: [
        'सकाळी ७:३० च्या आधी चढाई सुरू करा जेणेकरून दुपारचे ऊन लागणार नाही आणि सुंदर धुक्याचा आनंद घेता येईल.',
        'डोंगरावर नेटवर्क कमी-जास्त होत असल्याने फोनची बॅटरी जपून वापरा आणि पॉवर बँक सोबत ठेवा.',
        'स्थानिक शेतकऱ्यांच्या घरगुती स्टॉल्सना पाठबळ द्या.',
      ],
      nearbyCulinaryEn: [
        'Piping hot Pitla Bhakri with Thecha (spicy garlic-chili paste) and fresh spring onion',
        'Traditional Mattha (spiced buttermilk) & thick earthen-pot dahi (curd)',
        'Kanda Bhajji (crispy onion pakoras) enjoyed with hot masala chai in the mist',
      ],
      nearbyCulinaryMr: [
        'गरमागरम पिठलं-भाकरी, झणझणीत ठेचा आणि कांदा',
        'मातीच्या मडक्यातील घट्ट दही व थंडगार मसालेदार ताक',
        'धुक्यात गरमागरम कांदा भजी आणि वाफाळलेला फक्कड चहा',
      ],
    };
  }

  // 2. TEMPLES & SACRED SITES
  if (cat === 'temples' || slug.includes('ganpati') || slug.includes('temple') || slug.includes('mandir')) {
    return {
      summaryEn: `As one of Pune's deeply revered spiritual sanctuaries, visiting ${place.name} requires modest attire and respectful decorum. Devotees experience peaceful darshan and vibrant cultural rituals.`,
      summaryMr: `${place.name_mr || place.name} हे पुण्यातील अत्यंत श्रद्धेचे व पवित्र स्थान आहे. येथे दर्शनासाठी शांतता, शिस्त आणि पारंपारिक आदर बाळगणे आवश्यक आहे.`,
      difficultyOrTypeEn: 'Sacred Pilgrimage & Cultural Visit',
      difficultyOrTypeMr: 'पवित्र तीर्थक्षेत्र व धार्मिक दर्शन',
      sections: [
        {
          titleEn: 'How to Reach & Commute',
          titleMr: 'कसे पोहोचावे आणि प्रवास पर्याय',
          icon: '🧭',
          items: [
            {
              labelEn: 'By Pune Metro',
              labelMr: 'पुणे मेट्रोने',
              descEn: 'Take Purple Line to Budhwar Peth / Mandai Station or Aqua Line to PMC / Civil Court. Stations are within 5 to 10 minutes walking distance through the traditional Peths.',
              descMr: 'मेट्रो लाईन १ ने बुधवार पेठ / मंडई स्थानकावर किंवा लाईन २ ने मनपा स्थानकावर उतरा. तिथून ५-१० मिनिटे पायी अंतर आहे.',
              tag: 'Easiest & Fastest',
            },
            {
              labelEn: 'By PMPML Bus',
              labelMr: 'पीएमपीएमएल बसने',
              descEn: 'Buses 2, 9, 11, 24, 36, and 100 drop you at Appa Balwant Chowk, Shaniwar Wada, or Mandai stops directly adjacent to the temple precincts.',
              descMr: 'बस क्र. २, ९, ११, २४, ३६, १०० थेट आप्पा बळवंत चौक, शनिवार वाडा किंवा मंडई थांब्यावर सोडतात.',
            },
            {
              labelEn: 'Vehicle Parking Advisory',
              labelMr: 'वाहन पार्किंग सूचना',
              descEn: 'Central Peth lanes are narrow and heavily pedestrianized. Avoid driving 4-wheeler cars; use dedicated two-wheeler parking or park cars at PMC Multilevel Parking (Shaniwar Wada / Mandai).',
              descMr: 'पेठांमधील रस्ते अरुंद असल्याने चारचाकी आणणे टाळावे. मनपाच्या बहुमजली वाहनतळात (शनिवार वाडा / मंडई) गाडी पार्क करावी.',
            },
          ],
        },
        {
          titleEn: 'Darshan Timings, Aarti & Entry',
          titleMr: 'दर्शन वेळ, आरती व प्रवेश नियम',
          icon: '🛕',
          items: [
            {
              labelEn: 'Daily Temple Hours',
              labelMr: 'दैनंदिन दर्शन वेळ',
              descEn: 'Open from 05:30 AM to 10:30 PM continuously. Prominent Aartis take place at 07:30 AM (Morning Aarti) and 08:00 PM (Maha Aarti).',
              descMr: 'सकाळी ५:३० ते रात्री १०:३० पर्यंत खुले असते. सकाळी ७:३० ची सकाळची आरती आणि रात्री ८:०० ची महाआरती अत्यंत मनमोहक असते.',
            },
            {
              labelEn: 'Free Darshan & Prasad',
              labelMr: 'विनामूल्य दर्शन व प्रसाद',
              descEn: 'Darshan is completely free for all devotees. No VIP ticket is mandatory. Official Trust prasad counters offer fresh Modaks and Laddoos.',
              descMr: 'दर्शन सर्वांसाठी पूर्णपणे मोफत आहे. ट्रस्टच्या अधिकृत काऊंटरवर शुद्ध तुपातील मोदक व लाडू प्रसाद उपलब्ध असतो.',
            },
            {
              labelEn: 'Peak Hours & Festivals',
              labelMr: 'गर्दीचे दिवस व उत्सव',
              descEn: 'Tuesdays (Angarki / Sankashti Chaturthi) and Ganeshotsav witness heavy footfall. Early morning 06:00-08:00 AM offers the calmest darshan.',
              descMr: 'मंगळवार, संकष्टी चतुर्थी आणि गणेशोत्सवात मोठी गर्दी असते. शांत दर्शनासाठी सकाळी ६ ते ८ ही वेळ सर्वोत्तम आहे.',
            },
          ],
        },
        {
          titleEn: 'Visitor Guidelines & Etiquette',
          titleMr: 'दर्शन आचारसंहिता व नियम',
          icon: '📋',
          items: [
            {
              labelEn: 'Footwear Deposit Counters',
              labelMr: 'पादत्राणे ठेवण्याची सोय',
              descEn: 'Free, token-based footwear stands (मोफत चप्पल स्टँड) are located right beside the entrance. Please deposit shoes before entering the sanctum.',
              descMr: 'मंदिराच्या प्रवेशद्वाराजवळ मोफत चप्पल-स्टँड उपलब्ध आहे. दर्शन रांगेत जाण्यापूर्वी पादत्राणे जमा करावीत.',
            },
            {
              labelEn: 'Dress Code & Photography',
              labelMr: 'पोशाख व छायाचित्रण',
              descEn: 'Modest traditional or casual attire covering shoulders and knees is appreciated. Photography inside the inner sanctum (Gabhara) is restricted; courtyard photos are allowed.',
              descMr: 'पारंपारिक व सभ्य पोशाख परिधान करावा. गर्भागातील गाभाऱ्यात थेट छायाचित्रणास मनाई असते; प्रांगणात फोटो काढता येतात.',
            },
          ],
        },
      ],
      proTipsEn: [
        'Witnessing the evening Deepotsav (thousands of oil lamps) during festivals is an unforgettable spiritual visual.',
        'Deposit mobile phones on silent mode while in the darshan queue.',
        'Combine with visits to nearby Kasba Ganpati and Lal Mahal (both within 300 meters).',
      ],
      proTipsMr: [
        'सणासुदीच्या दिवशी होणारा दीपोत्सव आणि फुलांची आरास डोळ्यांचे पारणे फेडणारी असते.',
        'दर्शन रांगेत असताना मोबाईल सायलेंटवर ठेवावा.',
        'जवळच असलेल्या कसबा गणपती व लाल महालला याच फेरीत भेट द्या (३०० मीटर अंतर).',
      ],
      nearbyCulinaryEn: [
        'Fresh Ukadiche Modak (steamed coconut-jaggery dumplings with pure ghee)',
        'Traditional Puneri Misal at Vaidya Upahar Gruha / Bedekar Tea Stall',
        'Authentic Chitale Bandhu Bakarwadi at nearby Bajirao Road branch',
      ],
      nearbyCulinaryMr: [
        'साजूक तुपातील गरमागरम उकडीचे मोदक',
        'वैद्य उपहार गृह किंवा बेडेकर चहा कॅन्टीनची अस्सल पुणेरी मिसळ',
        'बाजीराव रस्त्यावरील चितळे बंधूंची ताजी बाकरवडी व आंबा बर्फी',
      ],
    };
  }

  // 3. HERITAGE WADAS, PALACES & MONUMENTS (Shaniwar Wada, Lal Mahal, Aga Khan, etc.)
  if (cat === 'heritage' || cat === 'museums' || slug.includes('wada') || slug.includes('palace') || slug.includes('mahal')) {
    return {
      summaryEn: `Stepping into ${place.name} takes you deep into the Maratha Empire and India's freedom movement. Marvel at 18th-century stone fortification, teakwood pillars, and sprawling manicured gardens.`,
      summaryMr: `${place.name_mr || place.name} ही वास्तू मराठा साम्राज्य आणि स्वातंत्र्य चळवळीच्या गौरवशाली इतिहासाची साक्ष देते. येथील लाकडी कोरीव काम, दगडी बुरुज आणि प्रांगण पर्यटकांना मंत्रमुग्ध करतात.`,
      difficultyOrTypeEn: 'Heritage Architecture & Historical Exploration',
      difficultyOrTypeMr: 'ऐतिहासिक वास्तुकला व वारसा दर्शन',
      sections: [
        {
          titleEn: 'How to Reach & Commute',
          titleMr: 'कसे पोहोचावे आणि प्रवास पर्याय',
          icon: '🧭',
          items: [
            {
              labelEn: 'By Pune Metro',
              labelMr: 'पुणे मेट्रोने',
              descEn: 'Purple Line: alight at Budhwar Peth / Phadke Haud Station (300m walk). Aqua Line: alight at Civil Court or PMC Station (~600m walk).',
              descMr: 'जांभळी मार्गिका: बुधवार पेठ स्थानकावरून फक्त ३०० मीटर चालत जावे. अक्वा मार्गिका: मनपा किंवा सिव्हिल कोर्ट स्थानकावरून चालत ५-८ मिनिटे.',
              tag: 'Fastest Route',
            },
            {
              labelEn: 'By PMPML Bus',
              labelMr: 'पीएमपीएमएल बसने',
              descEn: 'Direct buses from Swargate (Bus 2, 24), Pune Station (Bus 3), Deccan (Bus 9, 11), and Kothrud (Bus 36) halt right at Shaniwar Wada / Appa Balwant Chowk.',
              descMr: 'स्वारगेट (बस २, २४), पुणे स्टेशन (बस ३), डेक्कन (बस ९, ११) आणि कोथरूड (बस ३६) वरून थेट बसेस शनिवार वाड्यासमोर थांबतात.',
            },
            {
              labelEn: 'Parking Facilities',
              labelMr: 'पार्किंग सुविधा',
              descEn: 'PMC multi-level paid parking is located right opposite the main gate on Shaniwar Peth road for both 2-wheelers and 4-wheelers.',
              descMr: 'मुख्य दरवाजासमोर मनपाचे अधिकृत पे-अँड-पार्क वाहनतळ उपलब्ध आहे.',
            },
          ],
        },
        {
          titleEn: 'Visiting Hours, Tickets & Sound Show',
          titleMr: 'वेळ, तिकीट दर आणि ध्वनी-प्रकाश शो',
          icon: '🎟️',
          items: [
            {
              labelEn: 'Visiting Hours',
              labelMr: 'भेट देण्याची वेळ',
              descEn: 'Open daily from 09:30 AM to 05:30 PM. Gardens remain open till 06:00 PM.',
              descMr: 'दररोज सकाळी ९:३० ते संध्याकाळी ५:३० पर्यंत सुरू असते. बगीचा संध्याकाळी ६:०० पर्यंत खुला असतो.',
            },
            {
              labelEn: 'Entry Ticket Pricing',
              labelMr: 'प्रवेश शुल्क',
              descEn: isFree ? 'Entry is free.' : `Indian citizens: ₹${basePrice} per person. Foreign visitors: ₹300. Children below 15 years enter free (with valid school ID). Digital ASI QR ticketing available at gate.`,
              descMr: isFree ? 'प्रवेश विनामूल्य आहे.' : `भारतीय नागरिक: ₹${basePrice} प्रति व्यक्ती. परदेशी पर्यटक: ₹३००. १५ वर्षांखालील मुलांना मोफत प्रवेश. गेटवर क्यूआर कोडने तिकीट घेता येते.`,
            },
            {
              labelEn: 'Light & Sound Show (Evening)',
              labelMr: 'संध्याकाळचा ध्वनी आणि प्रकाश शो',
              descEn: 'Narrates the saga of the Maratha Peshwas. Shows run in Marathi at 07:15 PM and English at 08:15 PM (subject to seasonal weather and ticket counter).',
              descMr: 'पेशवेकालीन इतिहासावर आधारित भव्य शो: मराठी शो संध्याकाळी ७:१५ वाजता आणि इंग्रजी शो रात्री ८:१५ वाजता सुरू होतो.',
            },
          ],
        },
        {
          titleEn: 'Visitor Guidelines & Facilities',
          titleMr: 'पर्यटक नियम आणि सुविधा',
          icon: '📋',
          items: [
            {
              labelEn: 'Photography & Videography',
              labelMr: 'छायाचित्रण नियम',
              descEn: 'Mobile phone photography is permitted free of charge. Commercial tripod and drone videography require prior written ASI approval.',
              descMr: 'मोबाईलने फोटो काढण्यास विनामूल्य परवानगी आहे. ट्रायपॉड, व्यावसायिक चित्रीकरण व ड्रोनसाठी पुरातत्व विभागाची पूर्वपरवानगी आवश्यक आहे.',
            },
            {
              labelEn: 'Accessibility & Restrooms',
              labelMr: 'पिण्याचे पाणी व प्रसाधनगृह',
              descEn: 'RO drinking water fountains and clean restrooms are situated inside the palace complex. The ground courtyard is wheelchair-accessible; bastions require stair climbing.',
              descMr: 'परिसरात पिण्याचे पाणी व प्रसाधनगृहाची सोय आहे. मुख्य प्रांगण व्हीलचेअर-सुलभ आहे, मात्र बुरुजांवर जाण्यासाठी पायऱ्या आहेत.',
            },
          ],
        },
      ],
      proTipsEn: [
        'Visit between 09:30 AM and 11:30 AM or after 04:00 PM to avoid midday afternoon heat.',
        'Read the detailed historical plaques situated next to the Dilli Darwaza and Hazari Karanje fountain.',
        'Combine this walk with Lal Mahal (200m away) and Kasba Ganpati for a full 3-hour Old Pune heritage trail.',
      ],
      proTipsMr: [
        'सकाळी ९:३० ते ११:३० किंवा दुपारी ४:०० नंतर भेट दिल्यास उन्हाचा त्रास होत नाही आणि मनसोक्त फिरता येते.',
        'दिल्ली दरवाजा, बुरुज आणि हजारी कारंज्याशेजारील माहिती फलक जरूर वाचावेत.',
        'शनिवार वाड्यासोबतच २०० मीटर अंतरावरील लाल महाल आणि कसबा गणपतीला एकाच फेरीत भेट द्या.',
      ],
      nearbyCulinaryEn: [
        'Iconic Puneri Misal at Katakirrr, Bedekar or Vaidya Upahar Gruha',
        'Chitale Bandhu Bakarwadi & sweet Mango Barfi on Bajirao Road',
        'Refreshing Mastani (mango ice cream milkshake) at Sujata Mastani Sadashiv Peth',
      ],
      nearbyCulinaryMr: [
        'काटाकिर्रर किंवा बेडेकर चहाची झणझणीत अस्सल पुणेरी मिसळ',
        'बाजीराव रस्त्यावरील चितळे बंधूंची प्रसिद्ध बाकरवडी व आंबा बर्फी',
        'सदाशिव पेठेतील सुजाता मस्तानीचे प्रसिद्ध मँगो मस्तानी आईस्क्रीम',
      ],
    };
  }

  // 4. PARKS, LAKES & NATURE VIEWPOINTS
  return {
    summaryEn: `Surrounded by lush greenery and serene environments, visiting ${place.name} is an ideal escape to relax, breathe fresh Sahyadri air, and enjoy morning walks or evening sunsets.`,
    summaryMr: `${place.name_mr || place.name} हे पुण्यातील निसर्गरम्य आणि शांत ठिकाण असून सकाळचा फेरफटका, मनःशांती आणि निसर्गाचा आनंद घेण्यासाठी अतिशय उत्तम आहे.`,
    difficultyOrTypeEn: 'Scenic Nature Walk & Leisure Garden',
    difficultyOrTypeMr: 'निसर्गरम्य पर्यटन व शांत उद्यान',
    sections: [
      {
        titleEn: 'How to Reach & Commute',
        titleMr: 'कसे पोहोचावे आणि प्रवास पर्याय',
        icon: '🧭',
        items: [
          {
            labelEn: 'By Public Bus & Metro',
            labelMr: 'सार्वजनिक बस व मेट्रोने',
            descEn: 'Connected via major city corridors. Use PMPML buses towards nearest bus stop or take Metro to nearest connecting station with an e-rickshaw or auto.',
            descMr: 'शहरातील मुख्य रस्त्यांवरून थेट बस सेवा उपलब्ध आहे. जवळच्या मेट्रो स्थानकावरून रिक्षाने सहज पोहोचता येते.',
          },
          {
            labelEn: 'Vehicle Parking',
            labelMr: 'वाहनतळ सोय',
            descEn: 'Dedicated two-wheeler and four-wheeler parking lots are available near the entrance gates.',
            descMr: 'प्रवेशद्वाराजवळ दुचाकी व चारचाकी वाहनांसाठी वाहनतळ उपलब्ध आहे.',
          },
        ],
      },
      {
        titleEn: 'Timings, Entry & Best Hours',
        titleMr: 'वेळ, प्रवेश आणि सर्वोत्तम वेळ',
        icon: '🎟️',
        items: [
          {
            labelEn: 'Operating Timings',
            labelMr: 'उद्यान वेळ',
            descEn: 'Typically open during morning hours (06:00 AM - 10:30 AM) and evening hours (04:00 PM - 08:00 PM).',
            descMr: 'सामान्यतः सकाळी ६:०० ते १०:३० आणि संध्याकाळी ४:०० ते रात्री ८:०० या वेळेत खुले असते.',
          },
          {
            labelEn: 'Entry Pricing',
            labelMr: 'प्रवेश शुल्क',
            descEn: isFree ? 'Entry is completely free.' : `Nominal entry fee: approx ₹${basePrice} per person.`,
            descMr: isFree ? 'प्रवेश पूर्णपणे मोफत आहे.' : `नाममात्र प्रवेश शुल्क: अंदाजे ₹${basePrice} प्रति व्यक्ती.`,
          },
          {
            labelEn: 'Best Time to Visit',
            labelMr: 'उत्तम भेट काळ',
            descEn: 'Early morning for bird-watching and crisp fresh air, or late afternoon around 05:00 PM for sunset views.',
            descMr: 'सकाळच्या वेळी पक्षांचा किलबिलाट आणि ताजी हवा अनुभवता येते, तर संध्याकाळी ५:०० वाजता सूर्यास्ताचा देखावा विलोभनीय दिसतो.',
          },
        ],
      },
      {
        titleEn: 'Visitor Guidelines & Garden Etiquette',
        titleMr: 'पर्यटक आचारसंहिता व स्वच्छता नियम',
        icon: '📋',
        items: [
          {
            labelEn: 'Cleanliness & Green Policy',
            labelMr: 'स्वच्छता व पर्यावरण रक्षण',
            descEn: 'No plastic littering. Plucking flowers, stepping on ornamental lawns, and outdoor cooking are prohibited.',
            descMr: 'प्लास्टिक कचरा करण्यास सक्त मनाई आहे. झाडांची फुले तोडू नयेत व बागेतील शांतता राखावी.',
          },
          {
            labelEn: 'Walking & Fitness',
            labelMr: 'चालणे व व्यायाम',
            descEn: 'Jogging tracks, stone benches, and drinking water taps are provided for visitors.',
            descMr: 'चालण्यासाठी ट्रॅक, बसण्यासाठी बाकडे आणि पिण्याच्या पाण्याची व्यवस्था आहे.',
          },
        ],
      },
    ],
    proTipsEn: [
      'Carry your own reusable water bottle to stay hydrated.',
      'Wear comfortable walking shoes for taking full advantage of the scenic trails.',
    ],
    proTipsMr: [
      'सोबत पाण्याची पुनर्वापरयोग्य बाटली बाळगावी.',
      'बागेत फेरफटका मारताना आरामदायक शूज वापरावेत.',
    ],
    nearbyCulinaryEn: [
      'Fresh tender coconut water & sugarcane juice at garden entrances',
      'Puneri Poha, Upma, and filter coffee at neighborhood cafes',
    ],
    nearbyCulinaryMr: [
      'प्रवेशद्वाराजवळ मिळणारे ताजे शहाळ्याचे पाणी व उसाचा रस',
      'नजीकच्या कॅफेमधील गरमागरम पोहे, उपमा आणि फिल्टर कॉफी',
    ],
  };
}
