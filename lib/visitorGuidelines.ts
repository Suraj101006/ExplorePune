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

export const LANDMARK_SPECIFIC_FOOD: Record<string, { en: string[]; mr: string[] }> = {
  'sinhagad-fort': {
    en: [
      'Piping hot Chulivarchi Pitla Bhakri (Jowar/Bajra) with fiery green chili Thecha & sliced onions at summit village huts',
      'Matka Dahi (thick, naturally set buffalo curd served in earthen pots) and chilled spiced Tak (buttermilk)',
      'Crisp Kanda Bhaji (golden onion fritters) with adrak masala chai overlooking Kalyan Darwaza',
      'Fresh Solkadhi and Gaoran chicken rassa at Donje base village dhabas',
    ],
    mr: [
      'गडावरील चुलीवरचे गरमागरम पिठलं-भाकरी, झणझणीत हिरव्या मिरचीचा ठेचा व कांदा',
      'मातीच्या मडक्यातील घट्ट म्हशीचे दही व थंडगार पाचक ताक',
      'कल्याण दरवाजा वाटेवरील कुरकुरीत कांदा भजी व वाफाळलेला आल्याचा चहा',
      'डोणजे पायथ्याशी मिळणारी सोलकढी व अस्सल गावरान ताट',
    ],
  },
  'shaniwar-wada': {
    en: [
      'Bedekar Tea Stall (Narayan Peth, 400m away) — legendary Puneri Misal served with fresh bread slice & kokum dip',
      'Sujata Mastani (Bajirao Road branch, 350m away) — iconic thick Mango Mastani ice cream drink',
      'Vaidya Upahar Gruha (Budhwar Peth, 1910 establishment) — authentic historic Sanzi Misal',
      'Gujjar Cold Drink House (Budhwar Peth) — historic rose falooda and mastani since 1932',
    ],
    mr: [
      'बेडेकर टी स्टॉल (नारायण पेठ) — पुण्याची जगप्रसिद्ध अस्सल मिसळ (ब्रेड स्लाईस व कोकम उसळ)',
      'सुजाता मस्तानी (बाजीराव रस्ता शाखा) — प्रसिद्ध मॅंगो मस्तानी आणि ड्रायफ्रूट मस्तानी',
      'वैद्य उपहार गृह (बुधवार पेठ, १९१० ची स्थापना) — पारंपारिक सांजा व झणझणीत मिसळ',
      'गुज्जर कोल्ड्रिंक हाऊस (बुधवार पेठ) — १९३२ पासूनचे प्रसिद्ध फालुदा आणि मस्तानी',
    ],
  },
  'shreemant-dagdusheth-halwai-ganpati': {
    en: [
      'Chitale Bandhu Mithaiwale (Bajirao Road head branch) — legendary crispy Bakarwadi & melt-in-mouth Amba Barfi',
      'Kawre Ice Cream (Tulshibaug / Laxmi Road) — heritage cassata, fresh Sitaphal ice cream & Mastani',
      'Murthy Snacks & Ganesh Bhel (Tulshibaug) — authentic Puneri SPDP (Sev Potato Dahi Puri) & Kolhapuri Bhel',
      'Kaka Halwai (Budhwar Peth) — warm authentic Ukdiche Modak and Peda prasad',
    ],
    mr: [
      'चितळे बंधू मिठाईवाले (बाजीराव रस्ता) — जगप्रसिद्ध कुरकुरीत बाकरवडी व आंबा बर्फी',
      'कावरे आईस्क्रीम (तुळशीबाग / लक्ष्मी रस्ता) — पारंपारिक कसाटा व सिताफळ आईस्क्रीम',
      'मूर्ती स्नॅक्स व गणेश भेळ (तुळशीबाग) — खास पुणेरी एसपीडीपी (शेव बटाटा दही पुरी) व भेळ',
      'काका हलवाई (बुधवार पेठ) — शुद्ध तुपातील उकडीचे मोदक व पेढे प्रसाद',
    ],
  },
  'raja-dinkar-kelkar-museum': {
    en: [
      'Badshahi Boarding House (Tilak Road / Shukrawar Peth) — authentic Maharashtrian vegetarian Thali served since 1933',
      'New Sweet Home (Kumthekar Road) — crispy Sabudana Vada, Thalipeeth with white butter & Kokum Sarbat',
      'Tilak Road Chitale Bandhu — fresh Shrikhand, Chirote, and Puran Poli snacks',
      'Appa Balwant Chowk Pohe & Misal hubs',
    ],
    mr: [
      'बादशाही बोर्डिंग हाऊस (टिळक रस्ता, १९३३ ची स्थापना) — सात्विक अस्सल महाराष्ट्रीयन शाकाहारी थाळी',
      'न्यू स्वीट होम (कुंटेकर रस्ता) — साबुदाणा वडा, लोण्यासह थालीपीठ व कोकम सरबत',
      'चितळे बंधू (टिळक रस्ता) — शुद्ध तुपातील पुरणपोळी, चिरोटे व श्रीखंड',
      'आप्पा बळवंत चौक — पारंपरिक पुणेरी कांदे पोहे आणि बटाटा वडा',
    ],
  },
  'pataleshwar-cave-temple': {
    en: [
      'Wadeshwar (JM Road, 100m away) — iconic Ghee Podi Idli, Sabudana Wada with sweet curd & Filter Coffee',
      'Cafe Goodluck (FC Road Deccan corner) — historic 1935 Irani cafe famous for Bun Maska, Irani Chai & Mutton Kheema',
      'Vaishali (FC Road) — celebrated SPDP, Mysore Masala Dosa, and South Indian coffee',
      'Roopali (FC Road) — open-air garden breakfast: Upma, Sheera & Medu Vada',
    ],
    mr: [
      'वादेश्वर (जंगली महाराज रस्ता) — गरमागरम तूप सांडलेली पोडी इडली, साबुदाणा वडा व फिल्टर कॉफी',
      'कॅफे गडलक (डेक्कन कॉर्नर, १९३५ ची स्थापना) — प्रसिद्ध इराणी चहा, मस्क्याचं बन आणि खिमा पाव',
      'वैशाली (एफसी रस्ता) — सुप्रसिद्ध म्हैसूर मसाला डोसा, एसपीडीपी व कडक फिल्टर कॉफी',
      'रूपाली (एफसी रस्ता) — शांत प्रांगणातील उपमा, मऊ शिरा आणि मेदू वडा',
    ],
  },
  'aga-khan-palace': {
    en: [
      'Vohuman Cafe (near Pune Station / Sasoon) — legendary Cheese Omelette, Bun Maska & hot Chai since 1978',
      'German Bakery (Koregaon Park, 1.5 km away) — Apple Crumble, German cakes & herbal teas',
      'Marz-O-Rin style sandwiches & bakery treats on nearby Pune Camp road',
      'Blue Diamond / Koregaon Park specialty artisanal coffee & continental cafes',
    ],
    mr: [
      'व्होहुमान कॅफे (पुणे स्टेशन जवळ) — प्रसिद्ध चीज आमलेट, बटर बन मस्का व कडक चहा',
      'जर्मन बेकरी (कोरेगाव पार्क) — सफरचंद क्रंबल केक व हर्बल टी',
      'कॅम्प भागातील पारंपारिक मकरोनी, चीज सँडविच व मफिन्स',
      'कोरेगाव पार्क परिसरातील नामांकित बेकरी व कॉफी हाऊसेस',
    ],
  },
  'kasba-ganpati': {
    en: [
      'Joshi Vadewale & Kasba snacks — authentic piping hot Batata Vada with garlic thecha chutney',
      'Kasba Ganpati Gramdaivat sweet shops — fresh Malai Peda & Motichoor Laddoo',
      'Tambat Ali traditional copper-pot brewed chai stalls',
      'Budhwar Peth Poona Cold Drink House — mango falooda',
    ],
    mr: [
      'जोशी वडेवाले व कसबा स्नॅक्स — गरमागरम पुणेरी बटाटा वडा व लसणीचा सुका ठेचा',
      'कसबा गणपती मंदिर परिसर — ताजे मलई पेढे व मोतीचूर लाडू प्रसाद',
      'तांबट आळी परिसरातील पारंपारिक तांब्याच्या भांड्यातील फक्कड चहा',
      'बुधवार पेठेतील प्रसिद्ध मँगो फालुदा',
    ],
  },
  'lal-mahal': {
    en: [
      'Shri Krishna Bhuvan (Tulshibaug, 1941) — award-winning traditional spicy Poha-Misal with Shev & rassa',
      'Tulshibaug Murthy Kachi Bhel & SPDP — famous street chaat institution',
      'Kaka Halwai sweet house — Puran Poli and warm Kesari Jalebi',
      'Rawat Misal & Snacks nearby in Kasba Peth',
    ],
    mr: [
      'श्रीकृष्ण भुवन (तुळशीबाग, १९४१) — राष्ट्रपती पुरस्कारप्राप्त अस्सल पोहा मिसळ',
      'तुळशीबाग मूर्ती भेळ — पारंपरिक कच्ची भेळ व तिखट-गोड पाणी पुरी',
      'काका हलवाई — शुद्ध तुपातील गरम जिलेबी व पुरणपोळी',
      'कसबा पेठेतील पारंपारिक मिसळ व फरसाण दुकाने',
    ],
  },
  'parvati-hill': {
    en: [
      'Sarasbaug Chowpatty stalls — hot Pav Bhaji with generous Amul butter, Kolhapuri Bhel, and Kacchi Kairi',
      'Sujata Mastani (Mitramandal Chowk branch) — thick mango & dry-fruit ice cream mastani',
      'Bajirao Road / Swargate sweet marts — warm Khawa Jalebi and Milk Peda',
      'Parvati foothills tea stalls — piping hot ginger tea after climbing the 103 stone steps',
    ],
    mr: [
      'सारसबाग चौपाटी — भरपूर लोणी असलेली अमूल पावभाजी, कोल्हापुरी भेळ आणि कच्ची कैरी',
      'सुजाता मस्तानी (मित्रमंडळ चौक शाखा) — प्रसिद्ध थंडगार मस्तानी',
      'स्वारगेट परिसर — गरमागरम खवा जिलेबी व दुधाचे पेढे',
      'पार्वती पायथ्याशी — १०३ पायऱ्या चढून झाल्यावर मिळणारा वाफाळलेला आल्याचा चहा',
    ],
  },
  'alandi': {
    en: [
      'Indrayani Ghat Warakari Mahaprasad — traditional Satvik Khichdi, Amti, and Poli distributed with devotion',
      'Alandi Kandi Peda — traditional brown roasted milk pedas prepared by historic Alandi halwais',
      'Sant Dnyaneshwar Samadhi temple trust fresh Boondi Laddoo prasad',
      'Village jowar bhakri with fresh methi bhaji and pitla at river ghat Bhojanalayas',
    ],
    mr: [
      'इंद्रायणी घाट वारकरी महाप्रसाद — सात्विक वारकरी खिचडी, आमटी आणि भाकरी',
      'आळंदीचे प्रसिद्ध खमंग कांडी पेढे — शतकानुशतके चालत आलेली दुधाची मिठाई',
      'संत ज्ञानेश्वर महाराज संस्थान — शुद्ध तुपातील बुंदी लाडू प्रसाद',
      'नदीकाठच्या खानावळीतील गरमागरम ज्वारीची भाकरी व मेथीची भाजी',
    ],
  },
  'dehu': {
    en: [
      'Dehu Gatha Mandir village Bhojanalayas — traditional Chulivarchi Jowar Bhakri with Shengdana Thecha & curd',
      'Sant Tukaram Maharaj Temple prasad — pure ghee Malai Peda & dry fruit prasad',
      'Indrayani riverside morning hot Poha and spicy Batata Vada with ginger tea',
      'Dehu Gaon jaggery sweets & organic sugarcane juice from surrounding farms',
    ],
    mr: [
      'गाथा मंदिर परिसर — चुलीवरची गरम ज्वारीची भाकरी, शेंगदाणा ठेचा व गावरान दही',
      'संत तुकाराम महाराज मंदिर प्रसाद — अस्सल मलई पेढा व लाडू प्रसाद',
      'इंद्रायणी काठावरील पोहे, गरमागरम बटाटा वडे व फक्कड चहा',
      'देहू परिसरातील ताज्या उसाचा रस व सेंद्रिय गुळाची मिठाई',
    ],
  },
  'khadakwasla-dam': {
    en: [
      'Freshly roasted Sweet Corn (Garam Bhutta) rubbed with tangy lime, rock salt, and chili powder along the promenade',
      'Crispy Kanda Bhaji & piping hot Masala Chai served with panoramic lake breeze views',
      'Village Pitla-Bhakri & Thecha at small rustic shacks towards Kudje and Donje roads',
      'Fresh tender coconut water (Shahala) along the dam embankment',
    ],
    mr: [
      'धरणाच्या कडेला मिळणारे लिंबू-मीठ लावलेले गरमागरम भाजलेले मक्याचे कणीस',
      'पावसाळी हवेत धरणाच्या काठावर कुरकुरीत कांदा भजी आणि मसाला चहा',
      'कुडजे-डोणजे रस्त्यावरील चुलीवरचे पिठलं-भाकरी व ठेचा',
      'धरणाच्या पायथ्याशी थंडगार शहाळ्याचे पाणी',
    ],
  },
  'lohagad-fort': {
    en: [
      'Malavli base village hot Kanda Bhaji & steaming chai served right at the Vinchukata trail entry',
      'Authentic village Pitla Bhakri with Hirvi Mirchi Thecha at local home-stays in Lohagadwadi',
      'Maganlal Chikki (Lonavala heritage chikki) — crunchy peanut, kaju & dry fruit chikki nearby',
      'Fresh roasted corn & wild mountain berries along the Bhaja Caves turn-off',
    ],
    mr: [
      'मळवली पायथ्याशी व विंचूकाट्याकडे जाताना मिळणारी कुरकुरीत कांदा भजी व चहा',
      'लोहगडवाडीतील घरगुती चुलीवरचे पिठलं-भाकरी आणि हिरव्या मिरचीचा ठेचा',
      'लोणावळ्याची प्रसिद्ध मगनलाल चक्की — शेंगदाणा, काजू व गुलकंद चिक्की',
      'भाजे लेणी फाट्यावरील भाजलेली कणसे व ताजी रानमेवा फळे',
    ],
  },
  'rajgad-fort': {
    en: [
      'Gunjavane base village authentic Maratha Bhojan — Chulivarchi Bhakri, Thecha, Gavran chicken / Pithla thali prepared by local families',
      'Padmavati Machi temple shelters — hot tea, Poha, and glucose biscuits carried up by villagers',
      'Wild Sahyadri Karwand berries (in summer) and fresh spring water at Padmavati lake',
      'Sakhar village authentic jaggery tea & Maharashtrian breakfast',
    ],
    mr: [
      'गुंजवणे पायथ्याशी स्थानिक कुटुंबांनी चुलीवर बनवलेले गावरान जेवण — भाकरी, झणझणीत ठेचा व गावरान रस्सा',
      'पद्मावती माचीवर मिळणारा ताजेतवाना चहा, पोहे आणि लिंबू सरबत',
      'सह्याद्रीतील रानटी करवंदे आणि पद्मावती तलावाचे थंडगार पाणी',
      'साखर गावातील गुळाचा चहा व अस्सल पुणेरी नाश्ता',
    ],
  },
  'torna-fort': {
    en: [
      'Velhe village home-run mess — stone-ground Hirva Thecha, hot Jowar Bhakri, Shengdana Chutney, and rustic Pitla',
      'Zunjar Machi ridge trail — hot tea and lemon water served by hardy local trekker guides',
      'Velhe bazaar fresh cow milk tea and crunchy Batata Vada',
      'Local mountain honey collected from Torna valley cliffs',
    ],
    mr: [
      'वेल्हे गावातील घरगुती खानावळ — पाटा-वरवंट्यावर वाटलेला हिरवा ठेचा, ज्वारीची भाकरी व पिठलं',
      'झुंजार माची मार्गावरील चहा व लिंबू पाणी',
      'वेल्हे बाजारपेठेतील चहा आणि गरमागरम बटाटा वडे',
      'तोरण्याच्या डोंगरकड्यांवरून गोळा केलेले शुद्ध रानटी मध',
    ],
  },
  'shivneri-fort': {
    en: [
      'Famous Junnar Khawa Peda — melt-in-mouth brown pedas crafted with pure reduced milk from Junnar dairy cattle',
      'Junnar market Batata Bhaji, Poori, and spicy Misal with distinct rural spices',
      'Fresh sugarcane juice from surrounding organic sugarcane farms along Kukadi river',
      'Shivneri foothill stalls — Kokum Sarbat, fresh Amla candy, and roasted gram',
    ],
    mr: [
      'जुन्नरचे प्रसिद्ध खवा पेढे — अस्सल दुधाचे तोंडात विरघळणारे खमंग पेढे',
      'जुन्नर बाजारपेठेतील पुरी-भाजी आणि गावरान मसाल्याची झणझणीत मिसळ',
      'कुकाडी नदीकाठच्या शेतातील ताज्या उसाचा थंडगार रस',
      'शिवनेरी पायथ्याशी मिळणारे कोकम सरबत व आवळा कँडी',
    ],
  },
  'mahatma-phule-wada': {
    en: [
      'Ganj Peth & Bhavani Peth traditional sweet marts — fresh Motichoor Laddoo, Jalebi, and Peda',
      'Timber Market authentic Maharashtrian snack joints — spicy Misal Pav & Kanda Poha',
      'Timber Market / Quarter Gate Irani cafes — Bun Maska and classic Irani Chai',
      'Traditional stone-ground spice and Bhakri shops of eastern peths',
    ],
    mr: [
      'गंज पेठ व भवानी पेठ परिसरातील प्रसिद्ध मिठाई दुकाने — ताजे मोतीचूर लाडू व पेढे',
      'टिंबर मार्केट भागातील झणझणीत मिसळ पाव आणि कांदे पोहे',
      'क्वार्टर गेट जवळील इराणी कॅफे — बन मस्का आणि इराणी चहा',
      'पूर्व पेठांमधील पारंपरिक मसाले व घरगुती खानावळी',
    ],
  },
  'bhide-wada': {
    en: [
      'Appa Balwant Chowk legendary Pohe & Sabudana Wada stalls — quick student favorites since decades',
      'Prabhat Snacks (Narayan Peth, 300m away) — legendary Sabudana Wada, Batata Wada & Thalipeeth',
      'Bedekar Misal (Narayan Peth, 400m away) — classic Puneri Misal',
      'Tilak Road Chitale Bandhu — Bakarwadi and Amba Barfi',
    ],
    mr: [
      'आप्पा बळवंत चौक परिसरातील प्रसिद्ध कांदे पोहे व साबुदाणा वडा',
      'प्रभात स्नॅक्स (नारायण पेठ) — पुण्याचा सुप्रसिद्ध साबुदाणा वडा व थालीपीठ',
      'बेडेकर मिसळ (नारायण पेठ) — पारंपारिक पुणेरी मिसळ',
      'चितळे बंधू — बाकरवडी आणि आंबा बर्फी',
    ],
  },
  'vishrambaug-wada': {
    en: [
      'Sujata Mastani (Bajirao Road head branch right opposite) — signature Mango Mastani and Rose Mastani',
      'Shri Krishna Bhuvan (Tulshibaug, 150m away) — legendary Poha Misal since 1941',
      'Chitale Bandhu Mithaiwale (Bajirao Road, 200m away) — authentic Bakarwadi and Mango Barfi',
      'Gujjar Cold Drink House & Laxmi Road street food joints',
    ],
    mr: [
      'सुजाता मस्तानी (समोरच बाजीराव रस्ता मुख्यालय) — सुप्रसिद्ध मॅंगो मस्तानी व ड्रायफ्रूट मस्तानी',
      'श्रीकृष्ण भुवन (तुळशीबाग) — १९४१ ची जुनी पुरस्कारप्राप्त पोहा मिसळ',
      'चितळे बंधू (बाजीराव रस्ता) — अस्सल कुरकुरीत बाकरवडी व आंबा बर्फी',
      'लक्ष्मी रस्त्यावरील पारंपारिक चाट आणि फालुदा',
    ],
  },
  'jejuri-khandoba-temple': {
    en: [
      'Jejuri famous Haldi Bhandara Peda — golden saffron-tinted milk pedas offered as sacred prasad',
      'Dhangari rustic Bhojanalayas on Saswad-Jejuri highway — hot Bajra Bhakri, Gavran mutton/chicken rassa & Thecha',
      'Jejuri temple foothill sweet shops — fresh Khaja, Revdi, and Kadak Peda',
      'Rustic sugarcane juice and fresh guava from Purandar orchards',
    ],
    mr: [
      'जेजुरीचा मानाचा पिवळाधमक हळदी-भंडारा पेढा — कुलदैवताचा पवित्र प्रसाद',
      'सासवड-जेजुरी मार्गावरील धनगरी खानावळी — बाजरीची भाकरी, गावरान रस्सा व ठेचा',
      'गडाच्या पायथ्याशी मिळणारा खमंग खाजा, रेवडी आणि कडक पेढे',
      'पुरंदर परिसरातील गोड पेरू आणि ताज्या उसाचा रस',
    ],
  },
  'shinde-chhatri': {
    en: [
      'Kayani Bakery (East Street, Camp, 2 km away) — world-famous Shrewsbury Biscuits, Mawa Cake & Brazil Nut Biscuits',
      'Dorabjee & Sons (Camp, established 1878) — Pune’s oldest Parsi restaurant: Chicken Dhansak, Mutton Biryani & Berry Pulao',
      'Marz-O-Rin (MG Road, Camp) — historic 1944 bakery famous for green chutney sandwich, macaroni & cold coffee',
      'George Restaurant & 11 East Street Cafe for heritage Camp dining',
    ],
    mr: [
      'कयानी बेकरी (कॅम्प) — जगप्रसिद्ध श्रुजबरी बिस्किटे, मावा केक आणि ब्राझील नट बिस्किटे',
      'दोराबजी अँड सन्स (कॅम्प, १८७८ ची स्थापना) — पुण्याचे सर्वात जुने पारशी हॉटेल: धनसाक आणि बिर्याणी',
      'मारझो-रीन (एम.जी. रस्ता, १९४४ ची स्थापना) — प्रसिद्ध ग्रीन चटणी सँडविच, मकरोनी व कोल्ड कॉफी',
      'कॅम्प परिसरातील ऐतिहासिक जॉर्ज रेस्टॉरंट व इराणी कॅफे',
    ],
  },
  'okayama-friendship-garden': {
    en: [
      'Sinhagad Road street food promenade — fresh Pav Bhaji, Sev Puri, and Pani Puri at Anand Bhuvan corner',
      'Matka Kulfi stalls & Falooda opposite the garden gate',
      'Ganesh Bhel (Sinhagad Road branch) — authentic Kolhapuri bhel & Oli Bhel',
      'Chitale Bandhu Express branch on Sinhagad Road for evening Bakarwadi',
    ],
    mr: [
      'सिंहगड रस्ता स्ट्रीट फूड कॉर्नर — गरमागरम पावभाजी, शेवपुरी आणि पाणीपुरी',
      'उद्यानाच्या प्रवेशद्वारासमोरील मटका कुल्फी व थंडगार फालुदा',
      'गणेश भेळ (सिंहगड रस्ता) — कोल्हापुरी भेळ व ओली भेळ',
      'चितळे बंधू एक्सप्रेस शाखा — ताजी बाकरवडी व मिठाई',
    ],
  },
  'pashan-lake': {
    en: [
      'Someshwar Temple wada food corner — traditional Poha, Sabudana Wada & Masala Chai',
      'Pashan-Sus Road cafes — artisanal bakery treats, filter coffee, and sandwiches',
      'Bavdhan & Pashan circle breakfast eateries — authentic Thalipeeth and Misal Pav',
      'Fresh tender coconut water along the scenic lake promenade',
    ],
    mr: [
      'सोमेश्वर मंदिर परिसर — गरमागरम कांदे पोहे, साबुदाणा वडा व मसाला चहा',
      'पाषाण-सुस रस्ता — बेकरी स्नॅक्स, फिल्टर कॉफी व सँडविच',
      'पाषाण सर्कल — पारंपरिक थालीपीठ, पांढरे लोणी आणि मिसळ पाव',
      'तलावाच्या काठावरील थंडगार शहाळ्याचे पाणी',
    ],
  },
  'chaturshringi-temple': {
    en: [
      'Senapati Bapat Road fair food stalls — hot Jalebi with Fafda, Sabudana Khichdi & Upvas Batata Vada for devotees',
      'Chaturshringi foothill juice bars — sugarcane juice, Mosambi juice, and fresh coconut water',
      'JW Marriott / SB Road specialty food joints (from local Maharashtrian to global dining)',
      'Gokhale Road sweet shops — authentic Saffron Peda & Kaju Katli',
    ],
    mr: [
      'सेनापती बापट रस्ता — उपवासाची गरमागरम साबुदाणा खिचडी, वडा आणि जिलेबी-फाफडा',
      'चतुःशृंगी पायथा — ताज्या उसाचा रस, मोसंबी ज्यूस व नारळ पाणी',
      'एस.बी. रस्ता फूड स्ट्रीट — पारंपारिक नाश्ता आणि आधुनिक कॅफेज',
      'गोखले रस्त्यावरील नामांकित मिठाई दुकानांमधील केशर पेढे',
    ],
  },
  'bhor-rajwada-palace': {
    en: [
      'Bhor town traditional Maratha dining — Chulivarchi Bajra Bhakri, Pithla, Thecha & fresh Gavran chicken rassa',
      'Bhor market historic sweet makers — pure sugarcane jaggery (Gul) sweets, Chikki & Peda',
      'Bhatghar Dam viewpoint stalls — hot onion pakoras with spiced tea',
      'Local farm-fresh strawberries & guava in winter season',
    ],
    mr: [
      'भोर बाजारपेठेतील पारंपारिक मराठा खानावळ — बाजरीची भाकरी, पिठलं-ठेचा व गावरान रस्सा',
      'भोरचे अस्सल सेंद्रिय गुळाचे लाडू, चिक्की आणि ताजे खवा पेढे',
      'भातघर धरण परिसरातील गरमागरम कांदा भजी व चहा',
      'हिवाळ्यात परिसरातील शेतातून मिळणारे ताजे स्ट्रॉबेरी व पेरू',
    ],
  },
  'trishund-ganpati-temple': {
    en: [
      'Somwar Peth & Rasta Peth specialty eateries — Apollo Cafe classic Irani Chai & Bun Maska since 1960s',
      'Kolsa Galli authentic Puneri Poha & Sabudana Wada joints',
      'Rasta Peth sweet shops — fresh Balushahi, Pedas, and warm Jalebis',
      'Nagarkar sweets in nearby Somwar Peth',
    ],
    mr: [
      'सोमवार पेठ व रास्ता पेठ — अपोलो कॅफेचा प्रसिद्ध इराणी चहा व बन मस्का',
      'कोळसा गल्ली — पारंपारिक कांदे पोहे आणि बटाटा वडा',
      'रास्ता पेठेतील जुनी मिठाई दुकाने — बालूशाही, पेढे आणि गरमागरम जिलेबी',
      'नागरकर मिठाई भंडारमधील पारंपरिक गोडधोड',
    ],
  },
  'omkareshwar-temple': {
    en: [
      'Bedekar Misal (Narayan Peth, 250m walking distance) — Pune’s most celebrated Puneri Misal',
      'Shaniwar Peth riverfront tea stalls — ginger chai with Khari & Butter biscuits',
      'Alka Talkies Chowk / Tilak Bridge food stalls — authentic SPDP and Pani Puri',
      'Prabhat Snacks (Narayan Peth) — Sabudana Wada with sweet curd chutney',
    ],
    mr: [
      'बेडेकर मिसळ (नारायण पेठ, अवघ्या २५० मीटर अंतरावर) — पुण्याची सर्वात मानाची मिसळ',
      'शनिवार पेठ नदीकाठचे चहा स्टॉल्स — खारी-बटर आणि आल्याचा फक्कड चहा',
      'अलका टॉकीज चौक — प्रसिद्ध एसपीडीपी आणि पाणीपुरी',
      'प्रभात स्नॅक्स — गोड दह्याच्या चटणीसह मिळणारा खमंग साबुदाणा वडा',
    ],
  },
  'lenyadri-caves-ganpati': {
    en: [
      'Lenyadri foothills rustic Bhojanalayas — hot Jowar Bhakri, Pitla with Thecha & Shenga Chutney after climbing 283 steps',
      'Junnar authentic Khawa Peda sold at temple trust foothill stalls',
      'Fresh Kukadi river sugarcane juice and tender coconut water along the highway',
      'Local Junnari wild honey and seasonal farm produce',
    ],
    mr: [
      'लेण्याद्री पायथा (२८३ पायऱ्या उतरल्यानंतर) — गरमागरम ज्वारीची भाकरी, पिठलं आणि झणझणीत ठेचा',
      'जुन्नरचे प्रसिद्ध खवा पेढे — पायथ्याशी मिळणारा अस्सल प्रसाद',
      'कुकाडी नदीकाठचा ताजा उसाचा रस आणि थंडगार शहाळे',
      'परिसरातील डोंगरकड्यांवरील शुद्ध रानटी मध',
    ],
  },
  'ozar-vighnahar-ganpati': {
    en: [
      'Kukadi riverfront temple trust dining hall — Satvik Brahmin Mahaprasad with Puri, Shrikhand, and traditional Amti',
      'Ozar village Halwai stalls — fresh warm Mawa Peda & Motichoor Laddoo prasad',
      'Local sugarcane juice and farm-picked fresh vegetables from surrounding Otur & Junnar plains',
      'Riverfront tea and fresh Batata Vada stalls',
    ],
    mr: [
      'ओझर कुकडी नदीकाठचे भक्तनिवास — सात्विक महाप्रसाद: पुरी, श्रीखंड, भात व पारंपारिक आमटी',
      'ओझर गाव बाजारपेठ — ताजे मावा पेढे व मोतीचूर लाडू प्रसाद',
      'ओतूर-जुन्नर परिसरातील ताज्या उसाचा रस व फळे',
      'नदीकाठावरील फक्कड चहा आणि गरमागरम बटाटा वडे',
    ],
  },
  'fergusson-college-heritage': {
    en: [
      'Vaishali (FC Road) — celebrated SPDP, Mysore Masala Dosa, and South Indian coffee',
      'Roopali (FC Road) — classic open-air garden cafe for Upma, Sheera & Medu Vada',
      'Cafe Goodluck (FC Road Deccan corner) — historic 1935 Irani cafe for Bun Maska, Irani Chai & Mutton Kheema',
      'Wadeshwar (FC Road branch) — Ghee Podi Idli, Thalipeeth & Kothimbir Vadi',
    ],
    mr: [
      'वैशाली (एफसी रस्ता) — सुप्रसिद्ध म्हैसूर मसाला डोसा, एसपीडीपी व कडक फिल्टर कॉफी',
      'रूपाली (एफसी रस्ता) — शांत प्रांगणातील उपमा, मऊ शिरा आणि मेदू वडा',
      'कॅफे गडलक (एफसी रस्ता कॉर्नर) — प्रसिद्ध इराणी चहा, मस्क्याचं बन आणि खिमा पाव',
      'वादेश्वर (एफसी रस्ता) — साजूक तुपातील पोडी इडली, थालीपीठ आणि कोथिंबीर वडी',
    ],
  },
  'balgandharva-ranga-mandir': {
    en: [
      'Balgandharva Canteen — legendary theatrical Sabudana Wada, Batata Vada, Kanda Poha & cutting chai loved by Marathi artists',
      'JM Road Wadeshwar & Shiv Sagar — South Indian delicacies & Pav Bhaji',
      'Panchali Restaurant (JM Road) — authentic Maharashtrian Thali and snacks',
      'Deccan Gymkhana Cafe Goodluck (500m across river)',
    ],
    mr: [
      'बालगंधर्व कॅन्टीन — नाटक रसिकांचा व कलाकारांचा लाडका साबुदाणा वडा, कांदे पोहे व कटिंग चहा',
      'जंगली महाराज रस्ता — वादेश्वर व शिवसागरचे डोसा, इडली आणि पावभाजी',
      'पांचली रेस्टॉरंट — अस्सल महाराष्ट्रीयन जेवणाची थाळी',
      'डेक्कन कॅफे गडलक — इराणी चहा व बन मस्का',
    ],
  },
  'tambat-ali-craft-quarter': {
    en: [
      'Kasba Peth authentic Misal & Batata Vada stalls served with spicy dry garlic chutney',
      'Traditional tea cooked in handmade copper Samovars (copper boilers) right inside the artisans’ alley',
      'Kasba Ganpati sweet shops for Malai Peda',
      'Nearby Phadke Haud sweet and farsan stores',
    ],
    mr: [
      'कसबा पेठ परिसरातील झणझणीत मिसळ आणि लसूण चटणीसह बटाटा वडे',
      'कारागिरांच्या गल्लीत हाताने घडवलेल्या तांब्याच्या समोवारात उकळलेला खास चहा',
      'कसबा गणपती परिसर — मलई पेढे',
      'फडके हौद जवळील प्रसिद्ध मिठाई व फरसाण दुकाने',
    ],
  },
  'someshwar-temple-pashan': {
    en: [
      'Someshwar temple courtyard snacks — hot Sabudana Khichdi, Batata Vada, and ginger tea',
      'Pashan Circle Maharashtrian breakfast eateries — Thalipeeth with white butter and Poha',
      'Bavdhan highway dhabas for authentic rural Pithla Bhakri',
      'Chilled tender coconut water by the Ramnadi stream',
    ],
    mr: [
      'सोमेश्वर मंदिर प्रांगण — गरमागरम साबुदाणा खिचडी, बटाटा वडा आणि आल्याचा चहा',
      'पाषाण सर्कल — पांढऱ्या लोण्यासह खमंग थालीपीठ आणि कांदे पोहे',
      'बावधन महामार्ग ढाबे — अस्सल ग्रामीण पिठलं-भाकरी',
      'रामनदी काठावरील थंडगार शहाळ्याचे पाणी',
    ],
  },
  'khunya-murlidhar-temple': {
    en: [
      'Sadashiv Peth traditional mess & dining halls — Poona Boarding / Badshahi style vegetarian Brahmin Thali',
      'Suvarnarekha sweet mart (Sadashiv Peth) — authentic Ukdiche Modak, Peda, and Basundi',
      'Appa Balwant Chowk Pohe and Batata Vada',
      'Tilak Road Chitale Bandhu Bakarwadi',
    ],
    mr: [
      'सदाशिव पेठ — पारंपारिक खानावळींमधील सात्विक ब्राह्मण थाळी व पोळी-भाजी',
      'सुवर्णरेखा मिठाई (सदाशिव पेठ) — उकडीचे मोदक, पेढे आणि बासुंदी',
      'आप्पा बळवंत चौक — कांदे पोहे आणि बटाटा वडा',
      'टिळक रस्ता चितळे बंधू — बाकरवडी',
    ],
  },
  'ohel-david-synagogue': {
    en: [
      'Dorabjee & Sons (Dastur Meher Road, Camp, 700m away) — legendary Parsi Dhansak, Chicken Farcha, and Mutton Cutlets since 1878',
      'Marz-O-Rin (MG Road, Camp, 600m away) — iconic green chutney sandwich, chicken burger & cold coffee in a heritage bakery building',
      'Pasteur Bakery & Ice Cream (MG Road, Camp) — historic softy ice creams, pastries & rolls',
      'Kayani Bakery (East Street, Camp, 800m away) — historic Shrewsbury biscuits and mawa cake',
    ],
    mr: [
      'दोराबजी अँड सन्स (दस्तुरी मेहेर रस्ता, कॅम्प, १८७८ ची स्थापना) — प्रसिद्ध अस्सल पारशी धनसाक, मटन कटलेट व चिकन फरचा',
      'मारझो-रीन (एम.जी. रस्ता, कॅम्प, १९४४) — हेरिटेज वास्तूतील प्रसिद्ध ग्रीन चटणी सँडविच, मॅकरोनी व कोल्ड कॉफी',
      'पाश्चर बेकरी व आईस्क्रीम (एम.जी. रस्ता) — पारंपारिक मऊ आईस्क्रीम व रोल्स',
      'कयानी बेकरी (ईस्ट स्ट्रीट, कॅम्प) — सुप्रसिद्ध श्रुजबरी बिस्किटे व मावा केक',
    ],
  },
  'st-marys-church': {
    en: [
      'George Restaurant (East Street, Camp, 300m away) — celebrated Biryani, Irani Kheema Pav, and Caramel Custard',
      'Marz-O-Rin & Pasteur Bakery (MG Road, Camp, 500m away) — heritage bakery snacks, sandwiches & coffee',
      'Dorabjee & Sons (Dastur Meher Road, Camp) — legendary 1878 Parsi cuisine (Dhansak and Sali Boti)',
      'Cafe Yezdan (Sharbatwala Chowk) — authentic Irani chai and bun maska',
    ],
    mr: [
      'जॉर्ज रेस्टॉरंट (ईस्ट स्ट्रीट, कॅम्प) — प्रसिद्ध दम बिर्याणी, इराणी खिमा पाव आणि कॅरॅमल कस्टर्ड',
      'मारझो-रीन व पाश्चर (एम.जी. रस्ता, कॅम्प) — हेरिटेज बेकरी स्नॅक्स, सँडविच आणि कॉफी',
      'दोराबजी अँड सन्स (कॅम्प) — १८७८ पासूनचे पारंपारिक पारशी जेवण',
      'कॅफे येझदान (शरबतवाला चौक) — कडक इराणी चहा व मस्का पाव',
    ],
  },
  'darshan-museum': {
    en: [
      'Sadhu Vaswani Mission Canteen (Adjacent to museum) — pristine, hygienic vegetarian sattvic refreshments & herbal tea',
      'Dorabjee & Sons (Camp, 1 km away) — authentic historic Parsi thali and dhansak since 1878',
      'George Restaurant & Kayani Bakery (East Street, 1.2 km away) — historic Camp delicacies and Shrewsbury cookies',
      'Marz-O-Rin (MG Road, 1.3 km away) — famous cold coffee and chutney sandwiches',
    ],
    mr: [
      'साधू वासवानी मिशन कॅन्टीन (म्युझियम शेजारी) — अत्यंत स्वच्छ सात्विक शाकाहारी नाश्ता आणि हर्बल चहा',
      'दोराबजी अँड सन्स (कॅम्प) — १८७८ ची ऐतिहासिक पारशी थाळी व धनसाक',
      'जॉर्ज रेस्टॉरंट व कयानी बेकरी (ईस्ट स्ट्रीट) — कॅम्पमधील प्रसिद्ध बिर्याणी व श्रुजबरी बिस्किटे',
      'मारझो-रीन (एम.जी. रस्ता) — प्रसिद्ध कोल्ड कॉफी आणि चटणी सँडविच',
    ],
  },
  'malhargad-fort': {
    en: [
      'Sonori village rustic Maratha mess — stone-ground Hirva Thecha, warm Bajra Bhakri, and Pitla',
      'Saswad town famous Purandari fresh figs (Anjeer) and Anjeer Barfi along the highway',
      'Dhangari village dhabas — authentic spicy Gavran rassa and hot tea',
      'Fresh sugarcane juice from surrounding Karha river orchards',
    ],
    mr: [
      'सोनोरी गावातील अस्सल मराठा खानावळ — पाटा-वरवंट्यावर वाटलेला ठेचा, बाजरीची भाकरी व पिठलं',
      'सासवडचे प्रसिद्ध ताजे पुरंदरी अंजीर आणि अस्सल अंजीर बर्फी',
      'सासवड मार्गावरील धनगरी धाबे — झणझणीत गावरान रस्सा आणि फक्कड चहा',
      'कऱ्हा नदीकाठच्या शेतातील ताज्या उसाचा रस',
    ],
  },
  'tikona-fort': {
    en: [
      'Tikona Peth base village shacks — piping hot Pitla Bhakri, raw spring onion & spicy Hirvi Mirchi Thecha',
      'Pawna dam lakeside tea stalls — crispy Kanda Bhaji & steaming ginger chai overlooking the lake',
      'Freshly roasted corn (Bhutta) with chili and lemon along the hill trail',
      'Rustic earthen-pot curd and cold buttermilk served by village families',
    ],
    mr: [
      'तिकोना पेठ पायथ्याशी — गरमागरम चुलीवरचे पिठलं-भाकरी, कांदा आणि झणझणीत हिरवा ठेचा',
      'पवना काठचे चहा स्टॉल्स — कुरकुरीत कांदा भजी व वाफाळलेला आल्याचा चहा',
      'टेकडीच्या मार्गावर लिंबू-मसाला लावलेले भाजलेले मक्याचे कणीस',
      'स्थानिक शेतकऱ्यांचे मातीच्या मडक्यातील घट्ट दही आणि ताजे ताक',
    ],
  },
  'visapur-fort': {
    en: [
      'Malavli station & Bhaja trail stalls — hot golden Kanda Bhaji with green chili chutney after descending waterfalls',
      'Maganlal Heritage Chikki (Malavli-Lonavala) — crunchy peanut, cashewnut, and dry-fruit chikki',
      'Local waterfall stalls — piping hot Poha, boiled sweet corn, and masala chai',
      'Village wood-fired Jowar Bhakri with Shengdana Thecha at Malavli village homestays',
    ],
    mr: [
      'मळवली स्टेशन व भाजे रस्ता — धबधब्यावरून उतरल्यावर मिळणारी गरमागरम कांदा भजी व तिखट चटणी',
      'मगनलाल चिक्की (मळवली-लोणावळा) — शेंगदाणा, काजू व गुलकंद चिक्की',
      'धबधब्याकाठचे स्टॉल्स — वाफाळलेले कांदे पोहे, उकडलेले कणीस व मसाला चहा',
      'मळवली गावातील घरगुती चुलीवरची ज्वारीची भाकरी व शेंगदाणा ठेचा',
    ],
  },
  'purandar-fort': {
    en: [
      'Purandar foothills & Saswad — world-renowned Purandari Anjeer (fresh GI-tagged figs) and sweet Anjeer Halwa / Barfi',
      'Saswad historic Maratha Bhojanalayas — traditional Chulivarchi Bajra Bhakri with Shengdana Thecha & Gavran chicken/pithla',
      'Kedareshwar foothill stalls — refreshing lemon water, spiced buttermilk, and hot tea for trekkers',
      'Local organic custard apples (Sitaphal) in autumn season',
    ],
    mr: [
      'पुरंदर पायथा व सासवड — भौगोलिक मानांकन (GI) मिळालेले जगप्रसिद्ध ताजे अंजीर आणि अंजीर हलवा/बर्फी',
      'सासवडची मराठा खानावळ — चुलीवरची बाजरीची भाकरी, शेंगदाणा ठेचा व गावरान रस्सा/पिठलं',
      'केदारेश्वर पायथा — ट्रेकर्ससाठी लिंबू सरबत, पाचक ताक आणि आल्याचा फक्कड चहा',
      'शरद ऋतूत मिळणारी स्थानिक गोड सिताफळे',
    ],
  },
  'rajmachi-fort': {
    en: [
      'Udhewadi village rustic homestays — authentic wood-fired Pitla Bhakri with freshly pounded Thecha and Gavran chicken curry',
      'Lonavala Tungarli hill trail — hot cutting chai, Maggi, and crispy Batata Vada before the trek',
      'Natural sweet spring water from Rajmachi mountain springs',
      'Wild Sahyadri Karwand berries sold by local Thakar tribal children in early summer',
    ],
    mr: [
      'उधेवाडी गावातील घरगुती खानावळ — चुलीवरचे गरमागरम पिठलं-भाकरी, झणझणीत ठेचा व अस्सल गावरान चिकन थाळी',
      'तुंगार्ली ट्रेक प्रारंभ — कडक कटिंग चहा आणि गरमागरम बटाटा वडा',
      'राजमाचीच्या नैसर्गिक झऱ्यांचे थंडगार गोड पाणी',
      'उन्हाळ्यात स्थानिक आदिवासी मुलांकडून मिळणारी ताजी काळी करवंदे',
    ],
  },
  'korigad-fort': {
    en: [
      'Peth Shahpur village local stalls — authentic Kanda Poha, hot tea, and village-style Pithla Bhakri',
      'Aamby Valley road Punjabi & Maharashtrian dhabas — piping hot parathas, Misal Pav, and lassi',
      'Lonavala bazaar chikki & fudge on the connecting drive',
      'Fresh tender coconut water along the scenic ghat road',
    ],
    mr: [
      'पेठ शहापूर पायथा — खमंग कांदे पोहे, फक्कड चहा आणि चुलीवरचे पिठलं-भाकरी',
      'अॅम्बी व्हॅली रस्ता — गरमागरम मिसळ पाव, पराठे आणि लस्सी',
      'लोणावळा बाजारपेठेतील प्रसिद्ध चिक्की व चॉकलेट फज',
      'घाटातील थंडगार शहाळ्याचे पाणी',
    ],
  },
  'rohida-fort': {
    en: [
      'Bajarwadi base village rustic huts — authentic Bajra Bhakri, thick garlic Thecha, and soothing Solkadhi',
      'Bhor town famous pure organic jaggery (Gul) and Gul-chi Chikki from local sugarcane presses',
      'Bhor market traditional vegetarian thali with Amti and fresh seasonal vegetables',
      'Fort trail fresh lemon sarbat and mountain tea',
    ],
    mr: [
      'बाजारवाडी पायथ्याशी — बाजरीची भाकरी, लसणाचा खमंग ठेचा आणि सोलकढी',
      'भोरचा प्रसिद्ध सेंद्रिय गूळ आणि गुळाची चिक्की',
      'भोर बाजारपेठेतील पारंपारिक शाकाहारी जेवण — गोड आमटी व पोळी-भाजी',
      'गडाच्या वाटेवरील ताजे लिंबू सरबत व चहा',
    ],
  },
  'kesari-wada': {
    en: [
      'Bedekar Tea Stall (Narayan Peth, 200m away) — celebrated authentic Puneri Misal and spiced tea',
      'Prabhat Snacks (Narayan Peth, 250m away) — legendary Sabudana Wada with sweet dahi chutney & Thalipeeth',
      'Tilak Road Badshahi Boarding House — historic 1933 vegetarian Maharashtrian Thali',
      'Chitale Bandhu Mithaiwale (Bajirao Road, 400m away) — fresh Bakarwadi & Amba Barfi',
    ],
    mr: [
      'बेडेकर टी स्टॉल (नारायण पेठ, अवघ्या २०० मी.) — पुण्याची मानाची पारंपारिक मिसळ',
      'प्रभात स्नॅक्स (नारायण पेठ) — पुण्याचा सुप्रसिद्ध साबुदाणा वडा व थालीपीठ',
      'बादशाही बोर्डिंग हाऊस (टिळक रस्ता) — १९३३ पासूनची सात्विक पुणेरी थाळी',
      'चितळे बंधू (बाजीराव रस्ता) — ताजी कुरकुरीत बाकरवडी व आंबा बर्फी',
    ],
  },
  'national-war-memorial': {
    en: [
      'Kayani Bakery (East Street, Camp, 1.2 km away) — iconic Shrewsbury Biscuits & Mawa Cake',
      'Marz-O-Rin (MG Road, Camp) — legendary 1944 green chutney sandwich, macaroni & cold coffee',
      'Dorabjee & Sons (Dastur Meher Road, Camp) — historic 1878 Parsi Chicken Dhansak & Mutton Cutlet',
      'George Restaurant (East Street) — classic Camp Biryani & Persian tea',
    ],
    mr: [
      'कयानी बेकरी (ईस्ट स्ट्रीट, कॅम्प) — जगप्रसिद्ध श्रुजबरी बिस्किटे व मावा केक',
      'मारझो-रीन (एम.जी. रस्ता, कॅम्प) — १९४४ चे प्रसिद्ध चटणी सँडविच, मकरोनी व कोल्ड कॉफी',
      'दोराबजी अँड सन्स (कॅम्प) — १८७८ चे पारशी चिकन धनसाक आणि मटन कटलेट',
      'जॉर्ज रेस्टॉरंट (ईस्ट स्ट्रीट) — प्रसिद्ध दम बिर्याणी व इराणी चहा',
    ],
  },
  'pune-university-heritage-building': {
    en: [
      'University Canteen & Anand Veg (Ganeshkhind) — classic Puneri Kanda Poha, Upma, and filter coffee',
      'Senapati Bapat Road street food strip — frankies, dosas, and cold juices',
      'Range Hills traditional tea stalls — ginger cutting chai with bun maska',
      'Chaturshringi foothill fruit juice stalls & tender coconut water',
    ],
    mr: [
      'विद्यापीठ कॅन्टीन व आनंद व्हेज — पारंपारिक पुणेरी कांदे पोहे, उपमा व फिल्टर कॉफी',
      'सेनापती बापट रस्ता — विविध प्रकारच्या चाट व फळांचे ताजे ज्यूस',
      'रेंज हिल्स परिसरातील फक्कड आल्याचा चहा आणि बन मस्का',
      'चतुःशृंगी पायथ्याशी मिळणारे थंडगार शहाळे व उसाचा रस',
    ],
  },
  'bund-garden': {
    en: [
      'Vohuman Cafe (near Pune Station, 1.5 km away) — legendary Cheese Omelette, Bun Maska & sweet Irani Chai',
      'Dhole Patil Road cafes — freshly baked pastries, artisanal sandwiches, and cappuccino',
      'Riverside chaat stalls — Pani Puri, Bhel, and sweet roasted corn along the bridge promenade',
      'Koregaon Park German Bakery treats on the opposite riverbank',
    ],
    mr: [
      'व्होहुमान कॅफे (पुणे स्टेशन जवळ) — प्रसिद्ध चीज ऑम्लेट, बटर बन मस्का व इराणी चहा',
      'ढोले पाटील रस्ता — ताजी बेकरी उत्पादने, सँडविच आणि कॅपुचिनो',
      'नदीकाठची चौपाटी — पाणीपुरी, भेळ आणि भाजलेले मक्याचे कणीस',
      'नदी पलीकडील कोरेगाव पार्क जर्मन बेकरीचे केक व बेकरी आयटम्स',
    ],
  },
  'osho-teerth-park': {
    en: [
      'German Bakery (Koregaon Park, Lane 1) — iconic Apple Crumble, Carrot Cake, quiches & organic herbal tea',
      'Sante Spa Cuisine (Lane 1) — healthy organic salads, gluten-free pizza, and wholesome green smoothies',
      'Darius Cafe & French Bakeries — fresh butter croissants, sourdough sandwiches, and specialty brews',
      'Nature\'s Basket & artisanal gelato parlors along North Main Road',
    ],
    mr: [
      'जर्मन बेकरी (कोरेगाव पार्क) — प्रसिद्ध सफरचंद क्रंबल केक, क्विश आणि ऑरगॅनिक हर्बल टी',
      'सांत्या स्पा कुझीन — पौष्टिक सॅलड्स, ग्लूटेन-फ्री पिझ्झा आणि ग्रीन स्मूदीज',
      'फ्रेंच बेकरी व कॅफेज — बटर क्रोसाँ, सोरडो सँडविच आणि खास फिल्टर कॉफी',
      'नॉर्थ मेन रोडवरील इटालियन जिलाटो आईस्क्रीम',
    ],
  },
  'karla-caves': {
    en: [
      'Ekvira Aai foothill temple prasad stalls — fresh warm Peda, Boondi Laddoo, and coconut prasad',
      'Karla Phata highway dhabas — authentic Maharashtrian Pitla Bhakri with spicy Thecha & Solkadhi',
      'Maganlal Chikki (Lonavala heritage chikki) — crunchy peanut, cashewnut, and dry-fruit chikki',
      'Fresh sweet sugarcane juice and tender coconut water along Karla road',
    ],
    mr: [
      'एकवीरा आई पायथा — ताज्या खव्याचे पेढे, बुंदी लाडू आणि नारळ प्रसाद',
      'कार्ला फाटा महामार्ग धाबे — गरमागरम पिठलं-भाकरी, झणझणीत ठेचा आणि सोलकढी',
      'मगनलाल चिक्की (लोणावळा) — शेंगदाणा, काजू व मिक्स ड्रायफ्रूट चिक्की',
      'कार्ला रस्त्यावरील थंडगार उसाचा रस आणि शहाळ्याचे पाणी',
    ],
  },
  'bhaja-caves': {
    en: [
      'Bhaja village foothill stalls — piping hot Kanda Bhaji with tangy green thecha right beside the waterfall stream',
      'Malavli village homestays — authentic wood-fired Jowar Bhakri with Shengdana Thecha & Pitla',
      'Heritage Lonavala Chikki & chocolate fudge from local Malavli confectioners',
      'Fresh mountain corn rubbed with rock salt and lemon',
    ],
    mr: [
      'भाजे गाव पायथा — धबधब्याच्या प्रवाहाजवळ कुरकुरीत कांदा भजी व हिरव्या मिरचीचा ठेचा',
      'मळवली गावातील घरगुती चुलीवरची भाकरी, शेंगदाणा चटणी व पिठलं',
      'लोणावळ्याची अस्सल चिक्की आणि चॉकलेट फज',
      'लिंबू-मीठ लावलेले भाजलेले मक्याचे कणीस',
    ],
  },
  'bedse-caves': {
    en: [
      'Bedse village rustic tea huts — hot ginger chai with freshly prepared Batata Vada & Pohe',
      'Kamshet market traditional Maharashtrian Bhojanalayas — Jowar Bhakri with seasonal Shenga Amti',
      'Pawna dam-bound highway dhabas — rustic Maratha chicken/pithla thali',
      'Fresh tender coconut water along the quiet Kamshet countryside',
    ],
    mr: [
      'बेडसे गाव पायथा — वाफाळलेला आल्याचा चहा, गरमागरम बटाटा वडा आणि पोहे',
      'कामशेत बाजारपेठ — ज्वारीची भाकरी व शेंगदाण्याची आमटी असणारे पारंपरिक जेवण',
      'पवना मार्गावरील धाबे — अस्सल मराठा चिकन व पिठलं थाळी',
      'कामशेत परिसरातील निसर्गरम्य रस्त्यावरील ताजे शहाळे',
    ],
  },
  'baps-swaminarayan-mandir': {
    en: [
      'Premvati Food Court (inside Mandir premises) — 100% Satvik vegetarian delicacies: fresh Khichdi-Kadhi, Dhokla, Samosa & Swaminarayan sweets',
      'Ambegaon highway sweet marts — pure milk Pedas, Rabdi, and Kaju Katli',
      'Katraj dairy flagship parlour (2 km away) — famous Katraj Ice Cream, Shrikhand, and flavoured milk',
      'Mumbai-Bangalore bypass roadside dhabas for hot parathas',
    ],
    mr: [
      'मंदिरातील प्रेमवती फूड कोर्ट — १००% शुद्ध सात्विक अन्न: गरमागरम खिचडी-कढी, ढोकळा, समोसा व स्वामिनारायण मिठाई',
      'आंबेगाव महामार्ग — दुधाचे ताजे पेढे, बासुंदी, रबडी आणि काजू कतली',
      'कात्रज डेअरी मुख्य केंद्र — कात्रज आईस्क्रीम, मलाईदार श्रीखंड व फ्लेवर्ड दूध',
      'हायवेवरील गरमागरम पराठे व चहा',
    ],
  },
  'tulshibaug-temple': {
    en: [
      'Shri Krishna Bhuvan (Tulshibaug, established 1941) — legendary award-winning spicy Poha-Misal',
      'Murthy Snacks & Ganesh Bhel (Tulshibaug market) — authentic Puneri SPDP (Sev Potato Dahi Puri) & Oli Bhel',
      'Kawre Ice Cream (Tulshibaug / Laxmi Road) — heritage cassata, Mastani, and fresh Sitaphal ice cream',
      'Chitale Bandhu Mithaiwale (Bajirao Road, 250m) — crispy Bakarwadi & Amba Barfi',
    ],
    mr: [
      'श्रीकृष्ण भुवन (तुळशीबाग, १९४१) — राष्ट्रपती पुरस्कारप्राप्त अस्सल चवदार पोहा मिसळ',
      'मूर्ती स्नॅक्स व गणेश भेळ — प्रसिद्ध पुणेरी एसपीडीपी (शेव बटाटा दही पुरी) व ओली भेळ',
      'कावरे आईस्क्रीम (तुळशीबाग कॉर्नर) — ऐतिहासिक कसाटा, मस्तानी आणि सिताफळ आईस्क्रीम',
      'चितळे बंधू (बाजीराव रस्ता, २५० मी.) — ताजी बाकरवडी व आंबा बर्फी',
    ],
  },
  'alandi-dnyaneshwar-mandir': {
    en: [
      'Indrayani Ghat Warakari Mahaprasad — traditional Satvik Khichdi, Amti, and Poli distributed with devotion',
      'Alandi Kandi Peda — traditional brown roasted milk pedas prepared by historic Alandi halwais',
      'Sant Dnyaneshwar Samadhi temple trust fresh Boondi Laddoo prasad',
      'Village jowar bhakri with fresh methi bhaji and pitla at river ghat Bhojanalayas',
    ],
    mr: [
      'इंद्रायणी घाट वारकरी महाप्रसाद — सात्विक वारकरी खिचडी, आमटी आणि भाकरी',
      'आळंदीचे प्रसिद्ध खमंग कांडी पेढे — शतकानुशतके चालत आलेली दुधाची मिठाई',
      'संत ज्ञानेश्वर महाराज संस्थान — शुद्ध तुपातील बुंदी लाडू प्रसाद',
      'नदीकाठच्या खानावळीतील गरमागरम ज्वारीची भाकरी व मेथीची भाजी',
    ],
  },
  'dehu-tukaram-mandir': {
    en: [
      'Dehu Gatha Mandir village Bhojanalayas — traditional Chulivarchi Jowar Bhakri with Shengdana Thecha & curd',
      'Sant Tukaram Maharaj Temple prasad — pure ghee Malai Peda & dry fruit prasad',
      'Indrayani riverside morning hot Poha and spicy Batata Vada with ginger tea',
      'Dehu Gaon jaggery sweets & organic sugarcane juice from surrounding farms',
    ],
    mr: [
      'गाथा मंदिर परिसर — चुलीवरची गरम ज्वारीची भाकरी, शेंगदाणा ठेचा व गावरान दही',
      'संत तुकाराम महाराज मंदिर प्रसाद — अस्सल मलई पेढा व लाडू प्रसाद',
      'इंद्रायणी काठावरील पोहे, गरमागरम बटाटा वडे व फक्कड चहा',
      'देहू परिसरातील ताज्या उसाचा रस व सेंद्रिय गुळाची मिठाई',
    ],
  },
  'morgaon-mayureshwar-ganpati': {
    en: [
      'Morgaon temple trust Satvik Mahaprasad — pure ghee Puran Poli, Varan Bhat, and seasonal Amti',
      'Morgaon market sweet stalls — authentic Ukdiche Modak, fresh Mawa Peda, and Motichoor Laddoos',
      'Karha riverbank village eateries — wood-fired Jowar Bhakri with green chili Thecha',
      'Baramati road fresh organic sugarcane juice and farm fruits',
    ],
    mr: [
      'मयूरेश्वर संस्थान सात्विक महाप्रसाद — साजूक तुपातील पुरणपोळी, वरण-भात आणि आमटी',
      'मोरगाव बाजारपेठ — उकडीचे मोदक, ताजे मावा पेढे आणि मोतीचूर लाडू',
      'कऱ्हा नदीकाठच्या खानावळी — चुलीवरची ज्वारीची भाकरी आणि मिरचीचा ठेचा',
      'बारामती रस्त्यावरील सेंद्रिय उसाचा रस आणि ताजी फळे',
    ],
  },
  'ranjangaon-mahaganpati': {
    en: [
      'Mahaganpati Temple Trust Dining Hall — traditional Mahaprasad served daily to visiting pilgrims',
      'Ranjangaon highway halwai shops — pure milk Khawa Peda, Besan Laddoo, and Chikki',
      'Pune-Nagar highway Maharashtrian dhabas — spicy Misal Pav, Batata Vada, and ginger tea',
      'Fresh sugarcane juice from surrounding Shirur sugarcane fields',
    ],
    mr: [
      'महागणपती संस्थान अन्नछत्र — भाविकांसाठी दररोज दिला जाणारा सात्विक महाप्रसाद',
      'रांजणगाव बाजार — अस्सल खवा पेढे, बेसन लाडू आणि चिक्की',
      'पुणे-नगर महामार्ग धाबे — झणझणीत मिसळ पाव, गरमागरम बटाटा वडा आणि चहा',
      'शिरूर परिसरातील शेतातील ताज्या उसाचा थंडगार रस',
    ],
  },
  'theur-chintamani-ganpati': {
    en: [
      'Theur temple street prasad counters — warm Kesari Peda, Motichoor Laddoo, and dried coconut prasad',
      'Mula-Mutha river confluence eateries — traditional Jowar Bhakri with Shengdana Chutney and Pitla',
      'Solapur road breakfast joints — hot Kanda Poha, Sabudana Wada, and filter coffee',
      'Local farm-fresh guavas and sweet limes from surrounding Haveli orchards',
    ],
    mr: [
      'चिंतामणी मंदिर परिसर — केशर पेढे, मोतीचूर लाडू आणि खोबऱ्याचा प्रसाद',
      'नदीकाठची खानावळ — गरम ज्वारीची भाकरी, शेंगदाणा चटणी व पिठलं',
      'सोलापूर रस्ता — कांदे पोहे, साबुदाणा वडा आणि गरमागरम चहा',
      'हवेली परिसरातील ताजे पेरू आणि मोसंबी',
    ],
  },
  'iskcon-nvcc-kondhwa': {
    en: [
      'Govinda\'s Restaurant (inside ISKCON NVCC) — legendary pure Satvik vegetarian multi-cuisine buffet, Krishna Mahaprasad, Paneer Makhanwala, and Malai Kofta',
      'Govinda\'s Bakery & Sweet Shop — fresh eggless cakes, samosas, Kachori, and Rasgulla',
      'Katraj-Kondhwa road traditional dairy outlets — thick Rabdi, Basundi, and fresh paneer',
      'Tilekar Nagar juice corners — chilled seasonal fruit juices and tender coconut',
    ],
    mr: [
      'गोविंदाज् रेस्टॉरंट (इस्कॉन संकुल) — शुद्ध सात्विक शाकाहारी बुफे, कृष्ण महाप्रसाद, पनीर माखनवाला आणि मलाई कोफ्ता',
      'गोविंदाज् बेकरी — एगलेस केक, खमंग कचोरी, समोसा आणि रसगुल्ला',
      'कात्रज-कोंढवा रस्ता — घट्ट बासुंदी, रबडी आणि ताजे पनीर',
      'टिळेकर नगर — मोसंबी ज्यूस आणि ताजे शहाळ्याचे पाणी',
    ],
  },
  'bhimashankar-temple': {
    en: [
      'Bhimashankar forest trail rustic Bhojanalayas — piping hot Chulivarchi Bhakri, Hirva Thecha, and wild herbal tea',
      'Temple trust Mahaprasad — simple Satvik rice, dal, and Sheera distributed to devotees',
      'Bhimashankar tribal stalls — authentic wild forest honey (Ran Mohol Madh), dried Amla, and organic mountain berries',
      'Manchar-Ghodegaon route — famous Khawa Peda and fresh cow milk tea',
    ],
    mr: [
      'भीमाशंकर जंगल वाटेवरील खानावळी — चुलीवरची गरम भाकरी, ठेचा आणि रानटी काढ्याचा चहा',
      'संस्थान महाप्रसाद — सात्विक वरण-भात आणि शिरा प्रसाद',
      'स्थानिक आदिवासी स्टॉल्स — शुद्ध रानटी मध, सुका आवळा आणि रानमेवा',
      'मंचर-घोडेगाव रस्ता — प्रसिद्ध खवा पेढे आणि ताज्या दुधाचा चहा',
    ],
  },
  'tribal-museum': {
    en: [
      'Vohuman Cafe (near Pune Station, 1.2 km away) — world-famous Cheese Omelette, Bun Maska & sweet Irani Chai',
      'Queens Garden military canteen bakery treats and filter coffee',
      'Dhole Patil Road dining — upscale artisanal bakeries and Maharashtrian breakfast stops',
      'Station road historic Parsi and Irani cafes',
    ],
    mr: [
      'व्होहुमान कॅफे (स्टेशन जवळ) — प्रसिद्ध चीज ऑम्लेट, बटर बन मस्का व इराणी चहा',
      'क्वीन्स गार्डन परिसर — ताजे बेकरी स्नॅक्स आणि फिल्टर कॉफी',
      'ढोले पाटील रस्ता — विविध प्रकारचे कॅफे आणि नाश्त्याची ठिकाणे',
      'स्टेशन परिसरातील जुनी पारशी व इराणी हॉटेल्स',
    ],
  },
  'joshi-miniature-railway': {
    en: [
      'Kothrud Karve Road culinary hub — Joshi Vadewale (original branch) for authentic Batata Vada with thecha',
      'Wadeshwar (Kothrud branch) — Ghee Podi Idli, Thalipeeth with white butter, and Filter Coffee',
      'Katakirrr Misal (Karve Statue branch) — fiery spicy Kolhapuri-Puneri Tarri Misal',
      'Sujata Mastani (Karve Road) — Mango & Kesar Pista Mastani',
    ],
    mr: [
      'कोथरूड कर्वे रस्ता — जोशी वडेवाले (मूळ शाखा) अस्सल बटाटा वडा व लसणीचा ठेचा',
      'वादेश्वर (कोथरूड) — साजूक तुपातील पोडी इडली, लोण्यासह थालीपीठ व कॉफी',
      'काटाकिर्रर मिसळ (कर्वे पुतळा) — पुण्याची प्रसिद्ध झणझणीत कट मिसळ',
      'सुजाता मस्तानी (कर्वे रस्ता) — मँगो व केशर पिस्ता मस्तानी',
    ],
  },
  'mahatma-phule-museum': {
    en: [
      'FC Road Vaishali & Roopali (500m away) — celebrated SPDP, Mysore Masala Dosa & open-air coffee',
      'Ghole Road Maharashtrian snack corners — piping hot Sabudana Khichdi and Batata Vada',
      'Cafe Goodluck (Deccan Gymkhana, 600m away) — Bun Maska and Irani Chai since 1935',
      'JM Road Wadeshwar for evening Thalipeeth and Kothimbir Vadi',
    ],
    mr: [
      'एफसी रस्ता वैशाली व रूपाली — म्हैसूर मसाला डोसा, एसपीडीपी व फिल्टर कॉफी',
      'घोले रस्ता — गरमागरम साबुदाणा खिचडी आणि बटाटा वडा',
      'कॅफे गडलक (डेक्कन, १९३५ ची स्थापना) — प्रसिद्ध बन मस्का व इराणी चहा',
      'जेएम रस्ता वादेश्वर — खमंग थालीपीठ आणि कोथिंबीर वडी',
    ],
  },
  'iucaa-science-park': {
    en: [
      'SPPU Campus Refectory & Anand Veg — traditional student-favorite Pohe, Sheera, and South Indian snacks',
      'Senapati Bapat Road cafes — artisanal sandwiches, fresh salads, and cold brew coffees',
      'Chaturshringi foothill juice bars — fresh sugarcane juice and coconut water',
      'Ganeshkhind road classic Irani chai stalls',
    ],
    mr: [
      'पुणे विद्यापीठ कँटीन व आनंद व्हेज — गरमागरम पोहे, शिरा आणि डोसा-इडली',
      'सेनापती बापट रस्ता — आधुनिक कॅफेज, सँडविच आणि कोल्ड ब्रू कॉफी',
      'चतुःशृंगी पायथा — ताज्या उसाचा रस आणि थंडगार शहाळे',
      'गणेशखिंड रस्ता — कडक इराणी चहा आणि बिस्किटे',
    ],
  },
  'sarasbaug': {
    en: [
      'Sarasbaug Chowpatty — world-famous butter Pav Bhaji, Kolhapuri Bhel, SPDP, and raw mango with rock salt & chili',
      'Sujata Mastani (Mitramandal Chowk branch, 200m) — signature thick Mango Mastani',
      'Kawre Ice Cream (Laxmi Road / Bajirao Road) — cassata ice cream and falooda',
      'Peshwa Museum food strip — fresh sugarcane juice and sweet corn',
    ],
    mr: [
      'सारसबाग चौपाटी — भरपूर अमूल लोणी घातलेली पावभाजी, कोल्हापुरी भेळ, एसपीडीपी आणि मसाला कैरी',
      'सुजाता मस्तानी (मित्रमंडळ चौक, २०० मी.) — सुप्रसिद्ध मँगो मस्तानी',
      'कावरे आईस्क्रीम — पारंपारिक कसाटा आणि थंडगार फालुदा',
      'पेशवे संग्रहालय परिसर — ताज्या उसाचा रस आणि भाजलेले कणीस',
    ],
  },
  'empress-botanical-garden': {
    en: [
      'Camp & Fatima Nagar border bakeries — fresh cream rolls, walnut cakes, and savory patties',
      'Cantonment tea stalls near Race Course — ginger cutting chai with Bun Maska',
      'Kayani Bakery & Marz-O-Rin (Camp, 2.5 km away) — Shrewsbury biscuits and chutney sandwiches',
      'Garden gate coconut water stalls for natural post-walk refreshment',
    ],
    mr: [
      'कॅम्प व फातिमा नगर परिसरातील बेकऱ्या — क्रीम रोल्स, वॉलनट केक आणि पॅटीस',
      'रेसकोर्स जवळील कॅन्टोन्मेंट चहा स्टॉल्स — आल्याचा चहा आणि बन मस्का',
      'कयानी बेकरी व मारझो-रीन (कॅम्प) — प्रसिद्ध श्रुजबरी बिस्किटे आणि सँडविच',
      'उद्यानाच्या प्रवेशद्वारावरील ताजे थंडगार शहाळ्याचे पाणी',
    ],
  },
  'rajiv-gandhi-zoological-park': {
    en: [
      'Katraj Dairy flagship parlor (opposite Lake) — fresh Katraj Kulfi, Matka Kulfi, Shrikhand, and Chass',
      'Katraj lakefront snacks — hot Batata Vada, Misal Pav, and sweet corn',
      'Pune-Satara road family restaurants — authentic Maharashtrian vegetarian and non-vegetarian thalis',
      'Zoo entrance fresh fruit stalls — seasonal guavas, watermelons, and fresh sugarcane juice',
    ],
    mr: [
      'कात्रज डेअरी मुख्य विक्री केंद्र (तलावाच्या समोर) — ताजी कात्रज कुल्फी, मटका कुल्फी, श्रीखंड आणि ताक',
      'कात्रज तलाव चौपाटी — गरमागरम बटाटा वडा, मिसळ पाव आणि कणीस',
      'पुणे-सातारा रस्ता — अस्सल महाराष्ट्रीयन जेवणाची शाकाहारी व मांसाहारी थाळी',
      'प्राणीसंग्रहालय प्रवेशद्वार — ताजी फळे, पेरू आणि उसाचा थंडगार रस',
    ],
  },
  'sambhaji-park': {
    en: [
      'Wadeshwar (JM Road, 100m away) — iconic Ghee Podi Idli, Sabudana Wada with sweet curd & Filter Coffee',
      'Shiv Sagar (JM Road) — rich Pav Bhaji, Tava Pulao, and fresh fruit juices',
      'Balgandharva Canteen (adjacent) — legendary theatrical Sabudana Wada & cutting chai',
      'JM Road street food corners — steamed sweet corn and Pani Puri',
    ],
    mr: [
      'वादेश्वर (जेएम रस्ता) — साजूक तुपातील पोडी इडली, साबुदाणा वडा आणि फिल्टर कॉफी',
      'शिवसागर (जेएम रस्ता) — प्रसिद्ध बटर पावभाजी, तवा पुलाव आणि फ्रूट ज्यूस',
      'बालगंधर्व कॅन्टीन (शेजारीच) — नाटक रसिकांचा लाडका साबुदाणा वडा व कटिंग चहा',
      'जेएम रस्ता — उकडलेले कणीस आणि पाणीपुरी स्टॉल्स',
    ],
  },
  'gram-sanskruti-udyan': {
    en: [
      'Someshwar Temple food kiosks — traditional warm Poha, Sabudana Khichdi, and Batata Vada',
      'Pashan Circle breakfast joints — authentic Thalipeeth with white butter and Misal Pav',
      'Bavdhan rural dhabas — wood-fired Pithla Bhakri, Thecha, and Gavran chicken curry',
      'Pashan Lake promenade — tender coconut water and roasted sweet corn',
    ],
    mr: [
      'सोमेश्वर मंदिर प्रांगण — गरमागरम कांदे पोहे, साबुदाणा खिचडी आणि बटाटा वडा',
      'पाषाण सर्कल — पांढऱ्या लोण्यासह थालीपीठ आणि झणझणीत मिसळ पाव',
      'बावधन ग्रामीण धाबे — चुलीवरचे पिठलं-भाकरी, ठेचा आणि गावरान रस्सा',
      'पाषाण तलाव परिसर — थंडगार शहाळे आणि भाजलेले कणीस',
    ],
  },
  'vetal-tekdi': {
    en: [
      'Law College Road & ARAI base — Wadeshwar Ghee Podi Idli, Joshi Vadewale Batata Vada & hot Filter Coffee',
      'Vetal Tekdi summit herbal tea sellers — early morning ginger-jaggery detox tea after your sunrise climb',
      'Senapati Bapat Road juice bars — fresh ABC (Apple-Beet-Carrot) and sugarcane juices',
      'BMCC Road breakfast joints — traditional Puneri Pohe and Upma',
    ],
    mr: [
      'लॉ कॉलेज रस्ता व एआरएआय पायथा — वादेश्वरची पोडी इडली, जोशी वडेवाले आणि फिल्टर कॉफी',
      'टेकडी माथा — सूर्योदयानंतर मिळणारा गुळाचा व आल्याचा औषधी आयुर्वेदिक काढा व चहा',
      'सेनापती बापट रस्ता — ताज्या फळांचे ज्यूस आणि उसाचा रस',
      'बीएमसीसी रस्ता — अस्सल पुणेरी कांदे पोहे आणि मऊ उपमा',
    ],
  },
  'mulshi-dam': {
    en: [
      'Mulshi lakefront rustic dhabas — hot Chulivarchi Jowar/Bajra Bhakri with Hirva Thecha, Pitla, and fresh local lake fish fry',
      'Tamhini Ghat misty viewpoints — piping hot Kanda Bhaji and ginger masala chai overlooking waterfalls',
      'Pirangut road sweet shops — hot Jalebi with milk and crunchy Fafda',
      'Fresh tender coconut water along the scenic ghat turns',
    ],
    mr: [
      'मुळशी काठचे ग्रामीण धाबे — चुलीवरची गरम बाजरीची भाकरी, हिरवा ठेचा, पिठलं आणि तलावातील ताजे मासे फ्राय',
      'ताम्हिणी घाट — धुक्यात गरमागरम कांदा भजी आणि वाफाळलेला आल्याचा चहा',
      'पिरंगुट रस्ता — दुधासोबत जिलेबी आणि कुरकुरीत फाफडा',
      'घाटातील नयनरम्य वळणांवरील ताजे थंडगार शहाळे',
    ],
  },
  'panshet-dam': {
    en: [
      'Panshet MTDC resort & lakeview shacks — traditional village Pitla Bhakri with garlic thecha and fresh buttermilk',
      'Donje & Khanapur road dhabas — authentic spicy Gavran chicken rassa and wood-fired bhakri',
      'Dam promenade stalls — roasted corn cob (Bhutta) with lime and red chili salt',
      'Village tea stalls with fresh cow milk and butter biscuits',
    ],
    mr: [
      'पानशेत एमटीडीसी व लेकव्ह्यू स्टॉल्स — अस्सल ग्रामीण पिठलं-भाकरी, लसूण ठेचा आणि ताक',
      'डोणजे व खानापूर रस्ता धाबे — झणझणीत गावरान चिकन रस्सा आणि चुलीवरची भाकरी',
      'धरण चौपाटी — लिंबू-मीठ लावलेले भाजलेले मक्याचे कणीस',
      'गावातील चहाच्या टपऱ्यांवरील ताज्या दुधाचा चहा आणि खारी-बटर',
    ],
  },
  'pawna-lake': {
    en: [
      'Pawna campsite rustic kitchens — evening lakeside barbecue, campfire-grilled corn, and hot village Chicken/Paneer Thali with Chulivarchi Bhakri',
      'Kamshet-Pawna highway dhabas — piping hot Kanda Bhaji, Poha, and masala tea overlooking the waters',
      'Tikona base village dhabas — spicy Pitla with Shengdana Thecha and earthen-pot curd',
      'Fresh coconut water and sugarcane juice along the Maval countryside',
    ],
    mr: [
      'पवना कॅम्पसाईट — संध्याकाळी शेकोटीवरील बार्बेक्यू, भाजलेली कणसे आणि चुलीवरची पिठलं-भाकरी किंवा चिकन थाळी',
      'कामशेत-पवना रस्ता — कुरकुरीत कांदा भजी, पोहे आणि वाफाळलेला चहा',
      'तिकोना पायथा — झणझणीत शेंगदाणा ठेचा, पिठलं आणि मातीच्या मडक्यातील दही',
      'मावळ परिसरातील ताज्या उसाचा रस आणि शहाळ्याचे पाणी',
    ],
  },
  'tiger-point-lonavala': {
    en: [
      'Tiger Point cliff stalls — famous spicy roasted Sweet Corn (Garam Bhutta) with lime and chili, eaten amidst flying clouds',
      'Steaming hot Maggi and Masala Chai perched above the 650-meter Sahyadri gorge',
      'Golden crunchy Kanda Bhaji and Batata Vada served with spicy green chutney',
      'Lonavala market Maganlal Chikki, Walnut Fudge & Cooper\'s Fudge on the return route',
    ],
    mr: [
      'टायगर पॉईंट कडा — उडणाऱ्या ढगांमध्ये लिंबू-मसाला लावून खाल्लेले गरमागरम भाजलेले मक्याचे कणीस',
      '६५० मीटर खोल दरीकाठी बसून खाल्लेली वाफाळलेली मॅगी आणि मसाला चहा',
      'कुरकुरीत कांदा भजी आणि तिखट हिरव्या चटणीसह बटाटा वडे',
      'परतीच्या मार्गावर लोणावळ्याची प्रसिद्ध मगनलाल चिक्की व कूपर्स फज',
    ],
  },
  'bushi-dam': {
    en: [
      'Bushi Dam waterfall steps stalls — piping hot Kanda Bhaji and sweet cutting chai right in the middle of water sprays',
      'Steaming Maggi noodles, hot Poha, and roasted corn cob (Bhutta)',
      'Lonavala town heritage confectioners — Cooper\'s Chocolate Walnut Fudge & Maganlal Chikki',
      'Chilled coconut water along INS Shivaji road',
    ],
    mr: [
      'पाण्याच्या पायऱ्यांवरील स्टॉल्स — फेसाळणाऱ्या पाण्याच्या तुषारात गरमागरम कांदा भजी व चहा',
      'वाफाळलेली मॅगी, कांदे पोहे आणि भाजलेले मक्याचे कणीस',
      'लोणावळा शहर — कूपर्सचे प्रसिद्ध चॉकलेट वॉलनट फज आणि मगनलाल चिक्की',
      'आयएनएस शिवाजी रस्त्यावरील थंडगार शहाळ्याचे पाणी',
    ],
  },
  'tamhini-ghat': {
    en: [
      'Roadside waterfall shacks — steaming hot Kanda Bhaji with fiery green chili thecha enjoyed under roaring cascades',
      'Piping hot Masala Chai and roasted bhutta overlooking the misty Sahyadri canyons',
      'Mulshi-Kolad highway dhabas — traditional rural Maratha Bhojan: Jowar Bhakri, Thecha & Gavran chicken rassa',
      'Rustic village tender coconut water and wild honey',
    ],
    mr: [
      'धबधब्याकाठच्या टपऱ्या — कोसळणाऱ्या धबधब्याखाली गरमागरम कुरकुरीत कांदा भजी व झणझणीत मिरचीचा ठेचा',
      'धुक्यात वाफाळलेला मसाला चहा आणि भाजलेले मक्याचे कणीस',
      'मुळशी-कोलाड रस्ता — अस्सल मराठा जेवण: ज्वारीची भाकरी, ठेचा व गावरान रस्सा',
      'गावठी शहाळ्याचे पाणी आणि शुद्ध रानटी मध',
    ],
  },
  'taljai-hills': {
    en: [
      'Sahakarnagar breakfast joints — authentic Puneri Misal at nearby Katakirrr (Mukund Nagar), hot Sabudana Vada & Poha',
      'Taljai foothill juice bars — cold-pressed sugar-free juices, detox green smoothies & tender coconut water',
      'Padmavati & Aranyeshwar sweet shops — warm Jalebi and Malai Peda',
      'Traditional tea stalls with fresh cow milk and Khari biscuits',
    ],
    mr: [
      'सहकारनगर — मुकुंद नगरमधील सुप्रसिद्ध काटाकिर्रर मिसळ, गरमागरम साबुदाणा वडा व पोहे',
      'तळजाई पायथा — ताज्या फळांचे ज्यूस, डिटॉक्स ग्रीन स्मूदी आणि शहाळ्याचे पाणी',
      'पद्मावती व अरण्येश्वर — गरमागरम जिलेबी आणि मलाई पेढे',
      'पायथ्याशी मिळणारा ताज्या दुधाचा चहा आणि खारी बिस्कीट',
    ],
  },
  'arai-tekdi': {
    en: [
      'Law College Road & Kothrud — Wadeshwar (Ghee Podi Idli & Filter Coffee), Joshi Vadewale Batata Vada',
      'ARAI plateau trail — herbal detox tea and lemon sarbat served by local vendors at sunrise',
      'Paud Road breakfast outlets — hot Thalipeeth with white butter, Kanda Poha, and Misal',
      'Karve Road Sujata Mastani for afternoon treat',
    ],
    mr: [
      'लॉ कॉलेज रस्ता व कोथरूड — वादेश्वरची पोडी इडली व कॉफी, जोशी वडेवाले',
      'पठारावर पहाटे मिळणारा आयुर्वेदिक हर्बल चहा आणि ताजे लिंबू सरबत',
      'पौड रस्ता — पांढऱ्या लोण्यासह खमंग थालीपीठ, कांदे पोहे आणि मिसळ',
      'कर्वे रस्त्यावरील सुजाता मस्तानी',
    ],
  },
  'lavasa-lakeside': {
    en: [
      'Portofino waterfront promenade — European-style lakeside cafes serving thin-crust pizza, pasta, and cappuccino',
      'Dasve village authentic local dhabas — rustic wood-fired Pitla Bhakri with Thecha and local lake fish curry',
      'Lakeside gelato parlors and fresh waffle counters',
      'Warasgaon dam viewpoint stalls — roasted corn and spiced tea',
    ],
    mr: [
      'पोर्टोफिनो प्रोमेनाड — युरोपियन शैलीतील कॅफे: थिन क्रस्ट पिझ्झा, पास्ता आणि कॅपुचिनो',
      'दासवे गाव ग्रामीण धाबे — चुलीवरचे पिठलं-भाकरी, ठेचा आणि तलावातील ताजे मासे कालवण',
      'लेकसाइड जिलाटो आईस्क्रीम आणि बेल्जियन वॅफल्स',
      'वरसगाव व्ह्यूपॉईंट — भाजलेले कणीस आणि वाफाळलेला चहा',
    ],
  },
  'mahad-varadvinayak-temple': {
    en: [
      'Mahad temple prasad counters — sacred Ukdiche Modak with pure ghee, fresh Boondi Laddoo, and coconut prasad',
      'Mahad village rustic dining — traditional Konkan-Maratha Bhojan: Jowar/Rice Bhakri with Pitla and Solkadhi',
      'Khopoli-Expressway dhabas — piping hot Batata Vada, Misal Pav, and sweet tea',
      'Fresh sugarcane juice from surrounding Karjat-Khalapur fields',
    ],
    mr: [
      'वरदविनायक मंदिर प्रसाद — साजूक तुपातील उकडीचे मोदक, बुंदी लाडू आणि नारळ प्रसाद',
      'महड गाव खानावळ — कोकणी-मराठा जेवण: तांदळाची/ज्वारीची भाकरी, पिठलं आणि सोलकढी',
      'खोपोली-एक्सप्रेसवे धाबे — गरमागरम बटाटा वडा, मिसळ पाव आणि चहा',
      'परिसरातील ताज्या उसाचा थंडगार रस',
    ],
  },
  'gokhale-institute-heritage': {
    en: [
      'BMCC Road & FC Road corner — Vaishali (Mysore Masala Dosa & Filter Coffee), Roopali (Medu Vada & Sheera)',
      'Cafe Goodluck (FC Road Deccan corner) — iconic Bun Maska and Irani Chai since 1935',
      'Wadeshwar (FC Road) — Ghee Podi Idli, Thalipeeth with white butter, and Kothimbir Vadi',
      'Deccan Gymkhana traditional sweet and snacks shops',
    ],
    mr: [
      'बीएमसीसी व एफसी रस्ता — वैशालीचा म्हैसूर मसाला डोसा व फिल्टर कॉफी, रूपालीचा मऊ मेदू वडा',
      'कॅफे गडलक (डेक्कन कॉर्नर) — १९३५ ची प्रसिद्ध बन मस्का व कडक इराणी चहा',
      'वादेश्वर (एफसी रस्ता) — साजूक तुपातील पोडी इडली, थालीपीठ आणि कोथिंबीर वडी',
      'डेक्कन जिमखाना परिसरातील नामांकित मिठाई व नाश्ता दुकाने',
    ],
  },
  'jangli-maharaj-temple': {
    en: [
      'JM Road Wadeshwar (200m away) — iconic Ghee Podi Idli, Sabudana Wada with sweet curd & Filter Coffee',
      'Panchali Restaurant (JM Road) — authentic Maharashtrian vegetarian Thali with Varan-Bhat and Poli',
      'Shiv Sagar (JM Road) — rich buttery Pav Bhaji and seasonal fruit juices',
      'Balgandharva Canteen (across the road) — legendary Sabudana Wada and cutting chai',
    ],
    mr: [
      'जेएम रस्ता वादेश्वर — साजूक तुपातील पोडी इडली, साबुदाणा वडा आणि फिल्टर कॉफी',
      'पांचाली रेस्टॉरंट (जेएम रस्ता) — अस्सल महाराष्ट्रीयन शाकाहारी जेवणाची थाळी',
      'शिवसागर — प्रसिद्ध बटर पावभाजी आणि मोसंबी ज्यूस',
      'बालगंधर्व कॅन्टीन — नाटक रसिकांचा लाडका साबुदाणा वडा व कटिंग चहा',
    ],
  },
  'chavand-fort': {
    en: [
      'Chavandwadi base village mess — hot Bajra Bhakri, Shengdana Thecha & Pithla with sliced onions',
      'Junnar town famous fresh sugarcane juice and Peda prasad',
      'Kukadi riverfront dhabas — authentic Maharashtrian rural thali',
    ],
    mr: [
      'चावंडवाडी पायथ्याशी चुलीवरचे गरमागरम बाजरीची भाकरी, शेंगदाणा ठेचा व पिठलं',
      'जुन्नर परिसरातील प्रसिद्ध ताजा उसाचा रस आणि खव्याचे पेढे',
      'कुकडी नदीकाठचे अस्सल ग्रामीण शाकाहारी जेवण',
    ],
  },
  'hadsar-fort': {
    en: [
      'Hadsar village rustic snacks — freshly fried Kanda Bhaji and ginger chai',
      'Junnar highway dhabas — spicy Shev Bhaji and hot Jowar Bhakri',
      'Local farm-fresh guavas and seasonal figs',
    ],
    mr: [
      'हडसर गावातील गरमागरम कांदा भजी व आल्याचा चहा',
      'जुन्नर महामार्गावरील झणझणीत शेवभाजी व ज्वारीची भाकरी',
      'परिसरातील ताजी पेरू व अंजीर फळे',
    ],
  },
  'jivdhan-fort': {
    en: [
      'Ghatghar village trekker huts — stone-ground Thecha, warm Pitla Bhakri and fresh buttermilk',
      'Naneghat plateau tea stalls — hot cutting chai and poha',
      'Local wild honey and seasonal berries',
    ],
    mr: [
      'घाटघर पायथ्याशी पाटा-वरवंट्यावरचा हिरवा ठेचा, गरमागरम पिठलं-भाकरी व ताक',
      'नाणेघाट पठारावरील वाफाळलेला चहा आणि कांदे पोहे',
      'स्थानिक शुद्ध मध व रानमेवा',
    ],
  },
  'naneghat-pass-caves': {
    en: [
      'Ghatghar mountain dhabas — Pithla Bhakri with freshly pounded green chili Thecha',
      'Plateau viewpoint stalls — piping hot Maggie, Kanda Bhaji and adrak masala chai',
      'Authentic village jaggery tea and spiced buttermilk',
    ],
    mr: [
      'घाटघर ढाब्यांवरील अस्सल चुलीवरची पिठलं-भाकरी आणि मिरचीचा ठेचा',
      'पठारावरील गरमागरम कांदा भजी व आल्याचा चहा',
      'गावरान गुळाचा चहा आणि पाचक ताक',
    ],
  },
  'nana-wada': {
    en: [
      'Vaidya Upahar Gruha (Budhwar Peth, 150m) — historic 1910 Sanzi Misal',
      'Shri Krishna Bhuvan (Tulshibaug) — authentic 1941 Poha Misal with spicy sample',
      'Chitale Bandhu Mithaiwale (Bajirao Road, 300m) — crispy Bakarwadi & Amba Barfi',
      'Tulshibaug famous SPDP and Sev Puri',
    ],
    mr: [
      'वैद्य उपहार गृह (बुधवार पेठ) — ११० वर्षांची जुनी सांजा मिसळ',
      'श्रीकृष्ण भुवन (तुळशीबाग) — १९४१ ची प्रसिद्ध पोहा मिसळ व झणझणीत कट',
      'चितळे बंधू (बाजीराव रस्ता) — बाकरवडी व आंबा बर्फी',
      'तुळशीबाग — प्रसिद्ध पुणेरी एसपीडीपी आणि भेळ',
    ],
  },
  'bhandarkar-oriental-research-institute': {
    en: [
      'Cafe Goodluck (FC Road Deccan, 800m) — iconic 1935 Bun Maska & Irani Chai',
      'Wadeshwar (Law College Road branch, 300m) — Ghee Podi Idli & Filter Coffee',
      'Vaishali (FC Road) — celebrated Mysore Masala Dosa and SPDP',
      'Roopali (FC Road) — peaceful garden breakfast: Upma & Sheera',
    ],
    mr: [
      'कॅफे गडलक (डेक्कन, १९३५) — प्रसिद्ध बन मस्का व कडक इराणी चहा',
      'वादेश्वर (लॉ कॉलेज रस्ता) — साजूक तुपातील पोडी इडली व फिल्टर कॉफी',
      'वैशाली (एफसी रस्ता) — म्हैसूर मसाला डोसा आणि एसपीडीपी',
      'रूपाली (एफसी रस्ता) — हिरवळीतील गरमागरम उपमा आणि मऊ शिरा',
    ],
  },
  'bharat-itihas-sanshodhak-mandal': {
    en: [
      'Badshahi Boarding House (Tilak Road, 350m) — authentic Maharashtrian Thali since 1933',
      'New Sweet Home (Kumthekar Road) — Sabudana Vada and Thalipeeth with white butter',
      'Sujata Mastani (Sadashiv Peth branch) — iconic Mango Mastani',
      'Appa Balwant Chowk authentic Pohe and Batata Vada',
    ],
    mr: [
      'बादशाही बोर्डिंग (टिळक रस्ता, १९३३) — सात्विक अस्सल महाराष्ट्रीयन शाकाहारी थाळी',
      'न्यू स्वीट होम (कुंटेकर रस्ता) — साबुदाणा वडा आणि लोण्यासह थालीपीठ',
      'सुजाता मस्तानी (सदाशिव पेठ) — प्रसिद्ध मॅंगो मस्तानी',
      'आप्पा बळवंत चौक — कांदे पोहे आणि बटाटा वडा',
    ],
  },
  'ojas-ganpati-ozar': {
    en: [
      'Ozar Temple Trust Prasad — fresh sweet Boondi Ladoo and pedas',
      'Kukadi riverbank eateries — pure vegetarian Maharashtrian meals',
      'Sugarcane juice stalls with lemon and ginger',
    ],
    mr: [
      'ओझर देवस्थान महाप्रसाद — ताजे बुंदी लाडू व पेढे',
      'कुकडी नदीकाठची सात्विक शाकाहारी भोजनालये',
      'ताजा गव्हाचा व उसाचा रस',
    ],
  },
  'siddhatek-siddhivinayak-ganpati': {
    en: [
      'Siddhatek Devasthan Bhojanalaya — consecrated noon Mahaprasad',
      'Bhima riverfront stalls — warm Peda prasad and tea',
      'Daund junction local snacks and fresh milk sweets',
    ],
    mr: [
      'सिद्धटेक देवस्थान अन्नछत्र — दुपारचा महाप्रसाद',
      'भीमा नदीकाठचे पेढे व चहाचे स्टॉल्स',
      'दौंड परिसरातील पारंपरिक नाश्ता व दुग्धजन्य पदार्थ',
    ],
  },
  'banneshwar-temple-nasrapur': {
    en: [
      'Nasrapur highway dhabas — Chulivarchi Pitla Bhakri, Shengdana Thecha & Solkadhi',
      'Bhor royal sweets — authentic authentic Puran Poli with pure ghee',
      'Fresh tender coconut and spiced buttermilk',
    ],
    mr: [
      'नसरापूर महामार्गावरील चुलीवरचे पिठलं-भाकरी, शेंगदाणा ठेचा व सोलकढी',
      'भोर परिसरातील साजूक तुपातील अस्सल पुरणपोळी',
      'ताजे शहाळे पाणी व मसाला ताक',
    ],
  },
  'katraj-jain-temple-agam-mandir': {
    en: [
      'Katraj Dairy Parlor (Ghat road) — fresh Basundi, Shrikhand & Matka Kulfi',
      'Katraj Tirth Bhojanalaya — pure, hygienic Sattvic Jain lunch and dinner',
      'Kondhwa-Katraj road South Indian breakfast hubs',
    ],
    mr: [
      'कात्रज डेअरी पार्लर — ताजी बासुंदी, श्रीखंड आणि मटका कुल्फी',
      'कात्रज तीर्थ सात्विक जैन भोजनालय — शुद्ध सात्विक भोजन',
      'कात्रज परिसरातील पारंपरिक नाश्ता केंद्र',
    ],
  },
  'blades-of-glory-cricket-museum': {
    en: [
      'Katakirr Misal (Satara Road, 800m away) — legendary fiery Puneri Kolhapuri Misal with extra tarri',
      'Padmavati Bhel & Chaat hubs — authentic Puneri Matki Bhel and SPDP',
      'Marz-O-Rin & Kayani Camp (2.5 km away) — sandwiches and Shrewsbury cookies',
    ],
    mr: [
      'काटाकिर्र मिसळ (सातारा रस्ता) — अत्यंत प्रसिद्ध झणझणीत पुणेरी मिसळ व कट',
      'पद्मावती भेळ — अस्सल पुणेरी मटकी भेळ आणि शेवपुरी',
      'कॅम्प परिसर — सँडविच व श्रुजबरी बिस्किटे',
    ],
  },
  'vikram-pendse-cycles-museum': {
    en: [
      'Karve Nagar Wadeshwar (Cummins College road) — Ghee Podi Idli and Filter Coffee',
      'Kothrud Bhel & Chaat stalls — sweet and spicy SPDP',
      'Chitale Bandhu (Karve Road branch) — fresh Bakarwadi and Shrikhand',
    ],
    mr: [
      'कर्वे नगर वादेश्वर — साजूक तुपातील पोडी इडली व फिल्टर कॉफी',
      'कोथरूड भेळ — प्रसिद्ध एसपीडीपी व पाणीपुरी',
      'चितळे बंधू (कर्वे रस्ता) — कुरकुरीत बाकरवडी व श्रीखंड',
    ],
  },
  'pune-rail-museum': {
    en: [
      'Dorabjee & Sons (Camp, 1 km away) — legendary 1878 Parsi cuisine (Dhansak and Mutton Cutlets)',
      'Marz-O-Rin (MG Road, 1.2 km away) — famous cold coffee and chutney sandwiches',
      'George Restaurant (East Street) — authentic Biryani and Caramel Custard',
    ],
    mr: [
      'दोराबजी अँड सन्स (कॅम्प) — १८७८ पासूनचे प्रसिद्ध पारशी जेवण (धनसाक व मटन कटलेट)',
      'मारझो-रीन (एम.जी. रस्ता) — प्रसिद्ध कोल्ड कॉफी आणि चटणी सँडविच',
      'जॉर्ज रेस्टॉरंट (ईस्ट स्ट्रीट) — दम बिर्याणी व कॅरॅमल कस्टर्ड',
    ],
  },
  'kune-falls-viewpoint': {
    en: [
      'Maganlal Chikki (Lonavala) — authentic crushed peanut, cashew, and dry fruit chikki',
      'Golden Vada Pav (Old Mumbai-Pune Highway) — piping hot spicy Vada Pav with green chutney',
      'German Bakery Wunderbar (Khandala) — hot cappuccino and bakery desserts',
    ],
    mr: [
      'मगनलाल चिक्की (लोणावळा) — प्रसिद्ध शेंगदाणा, काजू व ड्रायफ्रूट चिक्की',
      'गोल्डन वडापाव (जुना महामार्ग) — गरमागरम झणझणीत वडापाव व हिरवी चटणी',
      'जर्मन बेकरी वंडरबार (खंडाळा) — ताजी पेस्ट्री व कॉफी',
    ],
  },
  'varasgaon-dam': {
    en: [
      'Varasgaon & Panshet lakeside village huts — piping hot Kanda Bhaji with adrak chai',
      'Rustic farmer mess — Chulivarchi Pitla Bhakri with freshly ground thecha',
      'Locally caught fresh freshwater fish rassa and rice bhakri',
    ],
    mr: [
      'वरसगाव व पानशेत जलाशय काठचे कुरकुरीत कांदा भजी व आल्याचा चहा',
      'ग्रामीण चुलीवरचे पिठलं भाकरी व मिरचीचा ठेचा',
      'ताजे गोड्या पाण्यातील माशांचे कालवण व तांदळाची भाकरी',
    ],
  },
};

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
  nearby_food?: string[] | string;
  nearby_food_mr?: string[] | string;
}): PlaceGuidelines {
  const slug = (place.slug || place.id || '').toLowerCase().trim();
  const cat = place.category_slug || place.category || 'heritage';
  const isFree = place.place_prices?.some((p) => p.is_free || p.amount === 0) ?? false;
  const basePrice = place.place_prices?.[0]?.amount || (isFree ? 0 : 25);

  const durationMins = place.recommended_duration_minutes || 60;
  const durationTextEn = durationMins >= 120 ? `${Math.round(durationMins / 60)} to ${Math.round(durationMins / 60) + 1} hours` : `${durationMins} minutes`;
  const durationTextMr = durationMins >= 120 ? `${Math.round(durationMins / 60)} ते ${Math.round(durationMins / 60) + 1} तास` : `${durationMins} मिनिटे`;

  // 1. Resolve authentic food recommendations specifically for this landmark
  let culinaryEn: string[] = [];
  let culinaryMr: string[] = [];

  if (Array.isArray(place.nearby_food) && place.nearby_food.length > 0) {
    culinaryEn = place.nearby_food;
  } else if (typeof place.nearby_food === 'string' && place.nearby_food.trim()) {
    culinaryEn = place.nearby_food.split('\n').map((s) => s.trim()).filter(Boolean);
  }

  if (Array.isArray(place.nearby_food_mr) && place.nearby_food_mr.length > 0) {
    culinaryMr = place.nearby_food_mr;
  } else if (typeof place.nearby_food_mr === 'string' && place.nearby_food_mr.trim()) {
    culinaryMr = place.nearby_food_mr.split('\n').map((s) => s.trim()).filter(Boolean);
  }

  if (culinaryEn.length === 0) {
    if (LANDMARK_SPECIFIC_FOOD[slug]) {
      culinaryEn = LANDMARK_SPECIFIC_FOOD[slug].en;
      culinaryMr = LANDMARK_SPECIFIC_FOOD[slug].mr;
    } else {
      const matchedKey = Object.keys(LANDMARK_SPECIFIC_FOOD).find(
        (k) => slug === k || slug.includes(k) || k.includes(slug)
      );
      if (matchedKey && LANDMARK_SPECIFIC_FOOD[matchedKey]) {
        culinaryEn = LANDMARK_SPECIFIC_FOOD[matchedKey].en;
        culinaryMr = LANDMARK_SPECIFIC_FOOD[matchedKey].mr;
      }
    }
  }

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
      nearbyCulinaryEn: culinaryEn.length > 0 ? culinaryEn : [
        'Piping hot Pitla Bhakri with Thecha (spicy garlic-chili paste) and fresh spring onion',
        'Traditional Mattha (spiced buttermilk) & thick earthen-pot dahi (curd)',
        'Kanda Bhajji (crispy onion pakoras) enjoyed with hot masala chai in the mist',
      ],
      nearbyCulinaryMr: culinaryMr.length > 0 ? culinaryMr : [
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
      nearbyCulinaryEn: culinaryEn.length > 0 ? culinaryEn : [
        'Fresh Ukadiche Modak (steamed coconut-jaggery dumplings with pure ghee)',
        'Traditional Puneri Misal at Vaidya Upahar Gruha / Bedekar Tea Stall',
        'Authentic Chitale Bandhu Bakarwadi at nearby Bajirao Road branch',
      ],
      nearbyCulinaryMr: culinaryMr.length > 0 ? culinaryMr : [
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
      nearbyCulinaryEn: culinaryEn.length > 0 ? culinaryEn : [
        'Iconic Puneri Misal at Katakirrr, Bedekar or Vaidya Upahar Gruha',
        'Chitale Bandhu Bakarwadi & sweet Mango Barfi on Bajirao Road',
        'Refreshing Mastani (mango ice cream milkshake) at Sujata Mastani Sadashiv Peth',
      ],
      nearbyCulinaryMr: culinaryMr.length > 0 ? culinaryMr : [
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
    nearbyCulinaryEn: culinaryEn.length > 0 ? culinaryEn : [
      'Fresh tender coconut water & sugarcane juice at garden entrances',
      'Puneri Poha, Upma, and filter coffee at neighborhood cafes',
    ],
    nearbyCulinaryMr: culinaryMr.length > 0 ? culinaryMr : [
      'प्रवेशद्वाराजवळ मिळणारे ताजे शहाळ्याचे पाणी व उसाचा रस',
      'नजीकच्या कॅफेमधील गरमागरम पोहे, उपमा आणि फिल्टर कॉफी',
    ],
  };
}
