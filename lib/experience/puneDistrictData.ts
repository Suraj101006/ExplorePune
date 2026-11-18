/**
 * Explore Pune - Pune District Geospatial & Coordinate Engine
 * Real Pune District boundary, coordinate utilities, and multi-taluka mapping.
 */

export interface CoordinateDMS {
  latDMS: string;
  lngDMS: string;
  fullDMS: string;
}

export interface DistrictTourStop {
  id: string;
  slug: string;
  nameEn: string;
  nameMr: string;
  talukaEn: string;
  talukaMr: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  zoom: number;
  pitch: number;
  bearing: number;
  significanceEn: string;
  significanceMr: string;
}

/**
 * Formats decimal degree coordinates into a clean string (e.g. "18.5204° N, 73.8567° E")
 */
export function formatCoordinatesDD(lat: number, lng: number, precision: number = 4): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(precision)}° ${latDir}, ${Math.abs(lng).toFixed(precision)}° ${lngDir}`;
}

/**
 * Converts decimal degrees to Degrees, Minutes, Seconds (DMS)
 */
export function formatCoordinatesDMS(lat: number, lng: number): CoordinateDMS {
  const toDms = (deg: number, isLat: boolean) => {
    const dir = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const minFloat = (abs - d) * 60;
    const m = Math.floor(minFloat);
    const s = Math.round((minFloat - m) * 60);
    return `${d}° ${m}' ${s}" ${dir}`;
  };

  const latDMS = toDms(lat, true);
  const lngDMS = toDms(lng, false);

  return {
    latDMS,
    lngDMS,
    fullDMS: `${latDMS}  ${lngDMS}`,
  };
}

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Determines the Taluka / Administrative Region of Pune District
 */
export function getTalukaOrRegion(
  lat: number,
  lng: number,
  address: string = ''
): { nameEn: string; nameMr: string } {
  const addr = address.toLowerCase();

  // 1. Junnar (North District)
  if (lat > 19.1 || addr.includes('junnar') || addr.includes('shivneri') || addr.includes('otur')) {
    return { nameEn: 'Junnar Taluka (North District)', nameMr: 'जुन्नर तालुका (उत्तर जिल्हा)' };
  }

  // 2. Ambegaon & Khed (North-Central)
  if (lat > 18.9 || addr.includes('ambegaon') || addr.includes('bhimashankar') || addr.includes('khed') || addr.includes('rajgurunagar') || addr.includes('chakan')) {
    return { nameEn: 'Ambegaon / Khed Taluka', nameMr: 'आंबेगाव / खेड तालुका' };
  }

  // 3. Maval (Lonavala, Khandala, Talegaon, Western Ghats)
  if (lng < 73.65 && lat > 18.65 || addr.includes('maval') || addr.includes('lonavala') || addr.includes('khandala') || addr.includes('karla') || addr.includes('talegaon')) {
    return { nameEn: 'Maval Taluka (Western Ghats)', nameMr: 'मावळ तालुका (सह्याद्री घाट)' };
  }

  // 4. Mulshi (Tamhini, Paud, Lavasa, Western Crests)
  if (lng < 73.65 && lat <= 18.65 && lat > 18.4 || addr.includes('mulshi') || addr.includes('tamhini') || addr.includes('paud') || addr.includes('lavasa')) {
    return { nameEn: 'Mulshi Taluka (Western Ridges)', nameMr: 'मुळशी तालुका (सह्याद्री रांगा)' };
  }

  // 5. Velhe (Torna, Rajgad, Sahyadri Highlands)
  if (lat <= 18.35 && lng < 73.75 || addr.includes('velhe') || addr.includes('rajgad') || addr.includes('torna') || addr.includes('madhe')) {
    return { nameEn: 'Velhe Taluka (Sahyadri Highlands)', nameMr: 'वेल्हे तालुका (किल्ले बालेकिल्ला)' };
  }

  // 6. Bhor (South District)
  if (lat <= 18.2 || addr.includes('bhor') || addr.includes('bhatghar')) {
    return { nameEn: 'Bhor Taluka (South District)', nameMr: 'भोर तालुका (दक्षिण जिल्हा)' };
  }

  // 7. Purandar (Saswad, Jejuri, Purandar Fort)
  if (lat < 18.4 && lng >= 73.85 && lng <= 74.3 || addr.includes('purandar') || addr.includes('saswad') || addr.includes('jejuri')) {
    return { nameEn: 'Purandar Taluka (Saswad / Jejuri)', nameMr: 'पुरंदर तालुका (सासवड / जेजुरी)' };
  }

  // 8. Haveli (Sinhagad, Khadakwasla, PCMC outskirts)
  if (addr.includes('haveli') || addr.includes('sinhagad') || addr.includes('khadakwasla') || addr.includes('hadapsar') || addr.includes('wagholi')) {
    return { nameEn: 'Haveli Taluka (Metro Periphery)', nameMr: 'हवेली तालुका (महानगर परिसर)' };
  }

  // 9. Shirur / Daund / Baramati (East District)
  if (lng > 74.2 || addr.includes('shirur') || addr.includes('daund') || addr.includes('baramati') || addr.includes('morgaon')) {
    return { nameEn: 'Shirur / Baramati (East District)', nameMr: 'शिरूर / बारामती (पूर्व जिल्हा)' };
  }

  // 10. Pune City / Core Peths
  return { nameEn: 'Pune City Core (Historic Peths & Deccan)', nameMr: 'पुणे शहर मध्यवर्ती (पेठा व डेक्कन)' };
}

/**
 * Returns estimated elevation above Mean Sea Level (MSL) based on geography
 */
export function getElevationEstimate(lat: number, lng: number, categorySlug: string = ''): number {
  // Forts perched high on the Sahyadri crest
  if (categorySlug === 'forts') {
    if (lat > 19.1) return 1040; // Shivneri / Junnar
    if (lat < 18.3) return 1376; // Rajgad / Torna
    if (lat < 18.4) return 1312; // Sinhagad
    if (lng < 73.55) return 1033; // Lohagad / Visapur
    return 1150;
  }

  // Tekdis (Vetal, ARAI, Taljai)
  if (lat > 18.51 && lat < 18.55 && lng > 73.81 && lng < 73.84) return 792;

  // Western Ghats & Reservoirs
  if (lng < 73.65) return 620;

  // Pune Central Plain
  return 560;
}

/**
 * Realistic GeoJSON boundary for the entire Pune District (14 Talukas)
 */
export function getPuneDistrictBoundaryGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              // North (Junnar / Harishchandragad border with Ahmednagar & Thane)
              [73.58, 19.38],
              [73.82, 19.36],
              [74.12, 19.18],
              // North-East (Shirur / Ahmednagar border)
              [74.38, 19.02],
              [74.62, 18.82],
              // East (Daund / Bhigwan / Indapur border with Solapur)
              [74.88, 18.55],
              [75.05, 18.28],
              [74.92, 18.12],
              // South-East (Baramati border)
              [74.62, 18.06],
              // South (Bhor / Purandar border with Satara)
              [74.22, 18.02],
              [73.88, 18.05],
              [73.62, 18.10],
              // South-West (Velhe / Varandha Ghat ridge with Raigad)
              [73.48, 18.16],
              [73.34, 18.42],
              // West (Tamhini Ghat / Mulshi / Lonavala Sahyadri crest)
              [73.22, 18.72],
              [73.28, 18.96],
              // North-West (Naneghat / Bhimashankar ridge)
              [73.42, 19.18],
              [73.58, 19.38],
            ],
          ],
        },
        properties: {
          name: 'Pune District Official Perimeter',
          nameMr: 'पुणे जिल्हा अधिकृत सीमा',
          totalAreaSqKm: 15643,
          talukasCount: 14,
        },
      },
    ],
  };
}

/**
 * Curated 8-Stop Flight Tour across Pune District
 */
export const DISTRICT_TOUR_STOPS: DistrictTourStop[] = [
  {
    id: 'stop-1-shivneri',
    slug: 'shivneri-fort',
    nameEn: 'Shivneri Fort (Junnar)',
    nameMr: 'शिवनेरी किल्ला (जुन्नर)',
    talukaEn: 'Junnar (Northern District)',
    talukaMr: 'जुन्नर (उत्तर जिल्हा)',
    latitude: 19.1983,
    longitude: 73.8617,
    elevationMeters: 1040,
    zoom: 14.5,
    pitch: 55,
    bearing: -20,
    significanceEn: 'Sacred birthplace of Chhatrapati Shivaji Maharaj (1630 CE), standing guard over northern Pune district.',
    significanceMr: 'छत्रपती शिवाजी महाराज यांचे पावन जन्मस्थान (१६३०), उत्तर पुण्याचे ऐतिहासिक भूषण.',
  },
  {
    id: 'stop-2-pataleshwar',
    slug: 'pataleshwar-cave-temple',
    nameEn: 'Pataleshwar Rock-Cut Caves',
    nameMr: 'पाताळेश्वर लेणी (शिवाजीनगर)',
    talukaEn: 'Pune City Core',
    talukaMr: 'पुणे शहर मध्यवर्ती',
    latitude: 18.5274,
    longitude: 73.8504,
    elevationMeters: 558,
    zoom: 15.5,
    pitch: 50,
    bearing: 15,
    significanceEn: '8th-century Rashtrakuta monolithic basalt cave temple carved into the Pune urban bedrock.',
    significanceMr: '८व्या शतकातील राष्ट्रकूटकालीन काळ्या पाषाणात खोदलेले भूमिगत शिवमंदिर.',
  },
  {
    id: 'stop-3-shaniwar-wada',
    slug: 'shaniwar-wada',
    nameEn: 'Shaniwar Wada (Peshwa Citadel)',
    nameMr: 'शनिवार वाडा (पेशवे राजधानी)',
    talukaEn: 'Historic Peths',
    talukaMr: 'ऐतिहासिक पेठा',
    latitude: 18.5195,
    longitude: 73.8553,
    elevationMeters: 560,
    zoom: 16.0,
    pitch: 52,
    bearing: -10,
    significanceEn: 'Palatial seat of the Maratha Peshwa rulers constructed in 1732 CE with its legendary spiked Dilli Darwaza.',
    significanceMr: '१७३२ मध्ये बाजीराव पेशवे यांनी उभारलेला मराठा साम्राज्याचा सत्ताकेंद्र असणारा ऐतिहासिक राजवाडा.',
  },
  {
    id: 'stop-4-aga-khan',
    slug: 'aga-khan-palace',
    nameEn: 'Aga Khan Palace (Yerwada)',
    nameMr: 'आगाखान पॅलेस (येरवडा)',
    talukaEn: 'Kalyani Nagar / Nagar Rd',
    talukaMr: 'कल्याणी नगर / नगर रस्ता',
    latitude: 18.5524,
    longitude: 73.9015,
    elevationMeters: 565,
    zoom: 15.2,
    pitch: 45,
    bearing: 30,
    significanceEn: 'Italian-arched Italianate monument where Mahatma Gandhi, Kasturba Gandhi and Sarojini Naidu were held during 1942 Quit India.',
    significanceMr: '१९४२ च्या भारत छोडो आंदोलनात महात्मा गांधीजींचा मुक्काम राहिलेले राष्ट्रीय स्मारक.',
  },
  {
    id: 'stop-5-sinhagad',
    slug: 'sinhagad-fort',
    nameEn: 'Sinhagad Fort (Kondhana)',
    nameMr: 'सिंहगड किल्ला (कोंढाणा)',
    talukaEn: 'Haveli (Sahyadri Crest)',
    talukaMr: 'हवेली (सह्याद्री कडा)',
    latitude: 18.3664,
    longitude: 73.7558,
    elevationMeters: 1312,
    zoom: 14.8,
    pitch: 58,
    bearing: -35,
    significanceEn: 'Legendary 1670 battle site of Subedar Tanaji Malusare perched high at 1,312 meters overlooking Khadakwasla.',
    significanceMr: 'सुभेदार तानाजी मालुसरे यांच्या पराक्रमाने पावन झालेला १,३१२ मीटर उंचीवरील बालेकिल्ला.',
  },
  {
    id: 'stop-6-rajgad',
    slug: 'rajgad-fort',
    nameEn: 'Rajgad Fort (King of Forts)',
    nameMr: 'राजगड किल्ला (किल्ल्यांचा राजा)',
    talukaEn: 'Velhe (Highlands)',
    talukaMr: 'वेल्हे (सह्याद्री रांगा)',
    latitude: 18.2464,
    longitude: 73.6828,
    elevationMeters: 1376,
    zoom: 14.5,
    pitch: 58,
    bearing: 40,
    significanceEn: 'Royal capital of Chhatrapati Shivaji Maharaj for 26 unbroken years with the formidable Sanjeevani Machi.',
    significanceMr: '२६ वर्षे हिंदवी स्वराज्याची पहिली राजधानी, संजीवनी माची आणि पद्मावती माचीने वेढलेला दुर्गराज.',
  },
  {
    id: 'stop-7-jejuri',
    slug: 'jejuri-khandoba-mandir',
    nameEn: 'Jejuri Khandoba Mandir',
    nameMr: 'जेजुरी खंडोबा देवस्थान',
    talukaEn: 'Purandar (South-East)',
    talukaMr: 'पुरंदर (दक्षिण-पूर्व)',
    latitude: 18.2758,
    longitude: 74.1593,
    elevationMeters: 745,
    zoom: 15.0,
    pitch: 48,
    bearing: -15,
    significanceEn: 'The golden pilgrimage hill bathed in turmeric (Bhandara) honoring Lord Khandoba with historic Deepmalas.',
    significanceMr: 'भंडाऱ्याची सोन्यासारखी उधळण होणारे कुलदैवत श्री खंडोबाचे जागृत देवस्थान व भव्य दीपमाळा.',
  },
  {
    id: 'stop-8-karla',
    slug: 'karla-caves',
    nameEn: 'Karla Rock-Cut Buddhist Caves',
    nameMr: 'कार्ले लेणी (मावळ घाट)',
    talukaEn: 'Maval (Western Ghats)',
    talukaMr: 'मावळ (सह्याद्री घाट)',
    latitude: 18.7828,
    longitude: 73.4706,
    elevationMeters: 720,
    zoom: 14.8,
    pitch: 52,
    bearing: 25,
    significanceEn: '2nd-century BCE rock-cut Buddhist Chaitya featuring the grandest vaulted wooden-ribbed cathedral hall in Asia.',
    significanceMr: 'इ.स.पूर्व दुसऱ्या शतकातील विशाल चैत्यगृह, भव्य सिंहस्तंभ आणि आशियातील सर्वात मोठी लाकडी छताची लेणी.',
  },
];

/**
 * Three Realistic Map Styles
 */
export type MapStyleKey = 'satellite' | 'topo' | 'dark';

export interface MapStyleOption {
  key: MapStyleKey;
  labelEn: string;
  labelMr: string;
  icon: string;
  descriptionEn: string;
}

export const MAP_STYLE_OPTIONS: MapStyleOption[] = [
  {
    key: 'satellite',
    labelEn: 'Real Satellite',
    labelMr: 'वास्तविक सॅटेलाइट',
    icon: '🛰️',
    descriptionEn: 'High-res photorealistic aerial photography & terrain hybrid',
  },
  {
    key: 'topo',
    labelEn: 'Real Topo / Terrain',
    labelMr: 'भूरूप व टेकड्या',
    icon: '🗺️',
    descriptionEn: 'Physical contours, elevation hillshades, ghats & reservoirs',
  },
  {
    key: 'dark',
    labelEn: 'Tactical Dark',
    labelMr: 'नाईट व्ह्यू',
    icon: '🌌',
    descriptionEn: 'Vector night style with high-contrast glowing coordinates',
  },
];
