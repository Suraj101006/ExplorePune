/**
 * Explore Pune - Pune District Geospatial & Coordinate Engine
 * Real Pune District boundary, 15 official talukas, rivers & reservoirs,
 * major highways, and multi-taluka mapping.
 */

export interface CoordinateDMS {
  latDMS: string;
  lngDMS: string;
  fullDMS: string;
}

export interface TalukaDefinition {
  id: string;
  nameEn: string;
  nameMr: string;
  headquartersEn: string;
  headquartersMr: string;
  centroid: [number, number]; // [lng, lat]
  bounds: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
  areaSqKm: number;
  significanceEn: string;
  significanceMr: string;
}

export interface StoryTrailStop {
  slug: string;
  nameEn: string;
  nameMr: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  significanceEn: string;
  significanceMr: string;
}

export interface StoryTrail {
  id: string;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  color: string;
  icon: string;
  stops: StoryTrailStop[];
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
 * 15 Official Talukas of Pune District with Verified Geographic Centers & Bounds
 */
export const PUNE_TALUKAS: TalukaDefinition[] = [
  {
    id: 'pune-city',
    nameEn: 'Pune City',
    nameMr: 'पुणे शहर',
    headquartersEn: 'Pune',
    headquartersMr: 'पुणे',
    centroid: [73.8567, 18.5204],
    bounds: [[73.81, 18.48], [73.91, 18.56]],
    areaSqKm: 331,
    significanceEn: 'Historic core of Pune: Shaniwar Wada, Peshwa peths, Deccan Gymkhana, and educational institutions.',
    significanceMr: 'पुण्याचे ऐतिहासिक हृदय: शनिवार वाडा, पेशवेकालीन पेठा, डेक्कन आणि विद्यापीठे.',
  },
  {
    id: 'haveli',
    nameEn: 'Haveli',
    nameMr: 'हवेली',
    headquartersEn: 'Pune',
    headquartersMr: 'पुणे',
    centroid: [73.8100, 18.4200],
    bounds: [[73.68, 18.32], [73.98, 18.58]],
    areaSqKm: 1385,
    significanceEn: 'Home to the mighty Sinhagad Fort, Khadakwasla reservoir, and metropolitan periphery.',
    significanceMr: 'ऐतिहासिक सिंहगड किल्ला, खडकवासला धरण आणि पुणे महानगर परिसर.',
  },
  {
    id: 'pcmc',
    nameEn: 'Pimpri-Chinchwad',
    nameMr: 'पिंपरी-चिंचवड',
    headquartersEn: 'Pimpri',
    headquartersMr: 'पिंपरी',
    centroid: [73.7997, 18.6298],
    bounds: [[73.72, 18.58], [73.88, 18.70]],
    areaSqKm: 181,
    significanceEn: 'Industrial automotive hub, Moraya Gosavi temple, and modern urban infrastructure.',
    significanceMr: 'उद्योगनगरी, श्री मोरया गोसावी समाधी मंदिर आणि आधुनिक शहर परिसर.',
  },
  {
    id: 'maval',
    nameEn: 'Maval',
    nameMr: 'मावळ',
    headquartersEn: 'Wadgaon Maval',
    headquartersMr: 'वडगाव मावळ',
    centroid: [73.5300, 18.7300],
    bounds: [[73.35, 18.62], [73.72, 18.88]],
    areaSqKm: 1131,
    significanceEn: 'Historic cradle of Shivaji Maharaj’s Mavala warriors, Lohagad, Visapur, Tikona, Karla & Bhaja caves.',
    significanceMr: 'शिवरायांच्या शूर मावळ्यांची जन्मभूमी, लोहगड, विसापूर, तिकोना आणि प्राचीन कार्ले-भाजे लेणी.',
  },
  {
    id: 'mulshi',
    nameEn: 'Mulshi',
    nameMr: 'मुळशी',
    headquartersEn: 'Paud',
    headquartersMr: 'पौड',
    centroid: [73.5100, 18.5500],
    bounds: [[73.30, 18.42], [73.72, 18.65]],
    areaSqKm: 1029,
    significanceEn: 'Western Ghats wilderness, Tamhini Ghat cloud forests, Mulshi Dam, and Sahyadri crests.',
    significanceMr: 'सह्याद्रीच्या पश्चिम रांगा, मुळशी जलाशय, ताम्हिणी घाट आणि निसर्गरम्य दऱ्या.',
  },
  {
    id: 'bhor',
    nameEn: 'Bhor',
    nameMr: 'भोर',
    headquartersEn: 'Bhor',
    headquartersMr: 'भोर',
    centroid: [73.8500, 18.1500],
    bounds: [[73.55, 18.02], [74.10, 18.25]],
    areaSqKm: 892,
    significanceEn: 'Southern gateway to Satara, historic Bhor Rajwada, Bhatghar Dam, and Rohida Fort.',
    significanceMr: 'ऐतिहासिक भोर संस्थान राजवाडा, भाटघर धरण आणि रोहिडा किल्ला.',
  },
  {
    id: 'velhe',
    nameEn: 'Velhe (Rajgad)',
    nameMr: 'वेल्हे (राजगड)',
    headquartersEn: 'Velhe',
    headquartersMr: 'वेल्हे',
    centroid: [73.6300, 18.2900],
    bounds: [[73.40, 18.15], [73.78, 18.42]],
    areaSqKm: 544,
    significanceEn: 'Highland fortress sanctuary: Rajgad (first capital of Swarajya), Torna (first fort captured in 1646), and Madhe Ghat.',
    significanceMr: 'स्वराज्याची पहिली राजधानी राजगड, पहिला जिंकलेला किल्ला तोरणा आणि मढे घाट.',
  },
  {
    id: 'purandar',
    nameEn: 'Purandar',
    nameMr: 'पुरंदर',
    headquartersEn: 'Saswad',
    headquartersMr: 'सासवड',
    centroid: [74.0200, 18.3100],
    bounds: [[73.88, 18.18], [74.22, 18.45]],
    areaSqKm: 1105,
    significanceEn: 'Purandar & Vajragad forts, golden pilgrimage town of Jejuri Khandoba, and Sant Sopandev Saswad.',
    significanceMr: 'पुरंदर-वज्रगड किल्ले, सोन्याची जेजुरी आणि संत सोपानदेव महाराज समाधी सासवड.',
  },
  {
    id: 'baramati',
    nameEn: 'Baramati',
    nameMr: 'बारामती',
    headquartersEn: 'Baramati',
    headquartersMr: 'बारामती',
    centroid: [74.5800, 18.1500],
    bounds: [[74.35, 18.02], [74.82, 18.35]],
    areaSqKm: 1382,
    significanceEn: 'Agricultural innovation powerhouse, Morgaon Mayureshwar (first Ashta Vinayak), and Nira river valley.',
    significanceMr: 'आधुनिक कृषी-तंत्रज्ञान केंद्र, अष्टविनायकांचे पहिले स्थान श्री मयूरेश्वर मोरगाव आणि निरा खोरे.',
  },
  {
    id: 'indapur',
    nameEn: 'Indapur',
    nameMr: 'इंदापूर',
    headquartersEn: 'Indapur',
    headquartersMr: 'इंदापूर',
    centroid: [75.0300, 18.1100],
    bounds: [[74.75, 17.98], [75.15, 18.35]],
    areaSqKm: 1475,
    significanceEn: 'Eastern boundary with Solapur, Ujani dam backwaters, and Bhigwan flamingos bird sanctuary.',
    significanceMr: 'उजनी जलाशय, भीगवण फ्लेमिंगो पक्षी अभयारण्य आणि जिल्ह्याची पूर्व सीमा.',
  },
  {
    id: 'daund',
    nameEn: 'Daund',
    nameMr: 'दौंड',
    headquartersEn: 'Daund',
    headquartersMr: 'दौंड',
    centroid: [74.5800, 18.4600],
    bounds: [[74.35, 18.32], [74.85, 18.68]],
    areaSqKm: 1290,
    significanceEn: 'Strategic rail junction on the Bhima river, sugar country, and historic transit corridor.',
    significanceMr: 'भीमा नदीकाठचे रेल्वे जंक्शन आणि कृषी-उद्योग पट्टा.',
  },
  {
    id: 'shirur',
    nameEn: 'Shirur',
    nameMr: 'शिरूर',
    headquartersEn: 'Shirur',
    headquartersMr: 'शिरूर',
    centroid: [74.3800, 18.8200],
    bounds: [[74.15, 18.62], [74.65, 19.05]],
    areaSqKm: 1558,
    significanceEn: 'Ranjangaon Mahaganapati, Vadhu Budruk memorial of Chhatrapati Sambhaji Maharaj, and Ghod river valley.',
    significanceMr: 'रांजणगाव महागणपती, छत्रपती संभाजी महाराज समाधी स्थळ वढू बुद्रुक आणि घोड नदी खोरे.',
  },
  {
    id: 'khed',
    nameEn: 'Khed (Rajgurunagar)',
    nameMr: 'खेड (राजगुरुनगर)',
    headquartersEn: 'Rajgurunagar',
    headquartersMr: 'राजगुरुनगर',
    centroid: [73.9100, 18.8600],
    bounds: [[73.68, 18.70], [74.15, 19.05]],
    areaSqKm: 1400,
    significanceEn: 'Birthplace of martyr Shivram Rajguru, historic Alandi Dnyaneshwar samadhi, and Chakan industrial zone.',
    significanceMr: 'हुतात्मा शिवराम राजगुरू यांचे जन्मस्थान, संत ज्ञानेश्वर महाराज समाधी आळंदी आणि चाकण.',
  },
  {
    id: 'junnar',
    nameEn: 'Junnar',
    nameMr: 'जुन्नर',
    headquartersEn: 'Junnar',
    headquartersMr: 'जुन्नर',
    centroid: [73.8800, 19.2000],
    bounds: [[73.60, 19.05], [74.20, 19.38]],
    areaSqKm: 1384,
    significanceEn: 'Ancient historic capital: Shivneri Fort (birthplace of Shivaji Maharaj), Naneghat trade pass, Lenyadri & Ozar Ganapati.',
    significanceMr: 'शिवनेरी किल्ला (छत्रपती शिवरायांचे जन्मस्थान), नाणेघाट व्यापारी खिंड, लेण्याद्री व ओझर गणपती.',
  },
  {
    id: 'ambegaon',
    nameEn: 'Ambegaon',
    nameMr: 'आंबेगाव',
    headquartersEn: 'Ghodegaon',
    headquartersMr: 'घोडेगाव',
    centroid: [73.8300, 19.0400],
    bounds: [[73.48, 18.95], [74.05, 19.20]],
    areaSqKm: 1047,
    significanceEn: 'Bhimashankar Jyotirlinga in sacred cloud forest reserve, source of Bhima river, and Dimbhe Dam.',
    significanceMr: 'श्री क्षेत्र भीमाशंकर ज्योतिर्लिंग, भीमा नदीचे उगमस्थान आणि डिंभे धरण.',
  },
];

/**
 * Determines the Taluka of Pune District for any coordinates
 */
export function getTalukaOrRegion(
  lat: number,
  lng: number,
  address: string = ''
): { id: string; nameEn: string; nameMr: string } {
  const addr = address.toLowerCase();

  // 1. Junnar
  if (lat > 19.12 || addr.includes('junnar') || addr.includes('shivneri') || addr.includes('lenyadri') || addr.includes('ozar') || addr.includes('naneghat')) {
    return { id: 'junnar', nameEn: 'Junnar Taluka', nameMr: 'जुन्नर तालुका' };
  }

  // 2. Ambegaon
  if ((lat > 18.98 && lng < 73.88) || addr.includes('ambegaon') || addr.includes('bhimashankar') || addr.includes('dimbhe') || addr.includes('ghodegaon')) {
    return { id: 'ambegaon', nameEn: 'Ambegaon Taluka', nameMr: 'आंबेगाव तालुका' };
  }

  // 3. Maval
  if ((lng < 73.68 && lat > 18.66) || addr.includes('maval') || addr.includes('lonavala') || addr.includes('khandala') || addr.includes('karla') || addr.includes('bhaja') || addr.includes('lohagad') || addr.includes('visapur') || addr.includes('kamshet') || addr.includes('talegaon')) {
    return { id: 'maval', nameEn: 'Maval Taluka', nameMr: 'मावळ तालुका' };
  }

  // 4. Mulshi
  if ((lng < 73.68 && lat <= 18.66 && lat > 18.38) || addr.includes('mulshi') || addr.includes('tamhini') || addr.includes('paud') || addr.includes('lavasa') || addr.includes('hadshi')) {
    return { id: 'mulshi', nameEn: 'Mulshi Taluka', nameMr: 'मुळशी तालुका' };
  }

  // 5. Velhe
  if ((lat <= 18.35 && lng < 73.74) || addr.includes('velhe') || addr.includes('rajgad') || addr.includes('torna') || addr.includes('madhe')) {
    return { id: 'velhe', nameEn: 'Velhe Taluka', nameMr: 'वेल्हे तालुका' };
  }

  // 6. Bhor
  if ((lat <= 18.22 && lng < 74.05) || addr.includes('bhor') || addr.includes('bhatghar') || addr.includes('rohida')) {
    return { id: 'bhor', nameEn: 'Bhor Taluka', nameMr: 'भोर तालुका' };
  }

  // 7. Purandar
  if ((lat < 18.42 && lng >= 73.90 && lng <= 74.25) || addr.includes('purandar') || addr.includes('saswad') || addr.includes('jejuri')) {
    return { id: 'purandar', nameEn: 'Purandar Taluka', nameMr: 'पुरंदर तालुका' };
  }

  // 8. Baramati
  if ((lat < 18.36 && lng > 74.35) || addr.includes('baramati') || addr.includes('morgaon')) {
    return { id: 'baramati', nameEn: 'Baramati Taluka', nameMr: 'बारामती तालुका' };
  }

  // 9. Indapur
  if (lng > 74.75 || addr.includes('indapur') || addr.includes('bhigwan') || addr.includes('ujani')) {
    return { id: 'indapur', nameEn: 'Indapur Taluka', nameMr: 'इंदापूर तालुका' };
  }

  // 10. Daund
  if ((lat >= 18.36 && lat < 18.68 && lng > 74.30) || addr.includes('daund')) {
    return { id: 'daund', nameEn: 'Daund Taluka', nameMr: 'दौंड तालुका' };
  }

  // 11. Shirur
  if ((lat >= 18.68 && lng > 74.15) || addr.includes('shirur') || addr.includes('ranjangaon') || addr.includes('vadhu')) {
    return { id: 'shirur', nameEn: 'Shirur Taluka', nameMr: 'शिरूर तालुका' };
  }

  // 12. Khed
  if ((lat >= 18.70 && lat <= 19.00 && lng >= 73.75 && lng <= 74.15) || addr.includes('khed') || addr.includes('rajgurunagar') || addr.includes('alandi') || addr.includes('chakan')) {
    return { id: 'khed', nameEn: 'Khed Taluka', nameMr: 'खेड तालुका' };
  }

  // 13. Pimpri-Chinchwad
  if (addr.includes('pimpri') || addr.includes('chinchwad') || addr.includes('nigdi') || addr.includes('bhosari') || addr.includes('pcmc') || addr.includes('dehu')) {
    return { id: 'pcmc', nameEn: 'Pimpri-Chinchwad', nameMr: 'पिंपरी-चिंचवड' };
  }

  // 14. Haveli
  if (addr.includes('haveli') || addr.includes('sinhagad') || addr.includes('khadakwasla') || addr.includes('hadapsar') || addr.includes('wagholi') || addr.includes('panshet') || addr.includes('varasgaon')) {
    return { id: 'haveli', nameEn: 'Haveli Taluka', nameMr: 'हवेली तालुका' };
  }

  // 15. Pune City Core
  return { id: 'pune-city', nameEn: 'Pune City', nameMr: 'पुणे शहर' };
}

/**
 * Returns estimated elevation above Mean Sea Level (MSL) based on geography
 */
export function getElevationEstimate(lat: number, lng: number, categorySlug: string = ''): number {
  if (categorySlug === 'forts') {
    if (lat > 19.1) return 1040; // Shivneri
    if (lat < 18.3) return 1376; // Rajgad / Torna
    if (lat < 18.4) return 1312; // Sinhagad
    if (lng < 73.55) return 1033; // Lohagad
    return 1150;
  }
  if (lat > 18.51 && lat < 18.55 && lng > 73.81 && lng < 73.84) return 792;
  if (lng < 73.65) return 620;
  return 560;
}

/**
 * Realistic GeoJSON boundary for the entire Pune District (15 Talukas)
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
              [73.58, 19.38],
              [73.82, 19.36],
              [74.12, 19.18],
              [74.38, 19.02],
              [74.62, 18.82],
              [74.88, 18.55],
              [75.05, 18.28],
              [74.92, 18.12],
              [74.62, 18.06],
              [74.22, 18.02],
              [73.88, 18.05],
              [73.62, 18.10],
              [73.48, 18.16],
              [73.34, 18.42],
              [73.22, 18.72],
              [73.28, 18.96],
              [73.42, 19.18],
              [73.58, 19.38],
            ],
          ],
        },
        properties: {
          name: 'Pune District Official Perimeter',
          nameMr: 'पुणे जिल्हा अधिकृत सीमा',
          totalAreaSqKm: 15643,
          talukasCount: 15,
        },
      },
    ],
  };
}

/**
 * GeoJSON FeatureCollection of all 15 Talukas of Pune District
 */
export function getPuneTalukasGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: PUNE_TALUKAS.map((t) => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [t.bounds[0][0], t.bounds[0][1]],
            [t.bounds[1][0], t.bounds[0][1]],
            [t.bounds[1][0], t.bounds[1][1]],
            [t.bounds[0][0], t.bounds[1][1]],
            [t.bounds[0][0], t.bounds[0][1]],
          ],
        ],
      },
      properties: {
        id: t.id,
        name: t.nameEn,
        nameMr: t.nameMr,
        centerLng: t.centroid[0],
        centerLat: t.centroid[1],
        areaSqKm: t.areaSqKm,
      },
    })),
  };
}

/**
 * GeoJSON FeatureCollection of Major Rivers & Reservoirs in Pune District
 */
export function getPuneRiversGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      // Mula-Mutha Confluence & Mula River
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.48, 18.54], // Mulshi outflow
            [73.62, 18.57], // Paud
            [73.74, 18.58], // Wakad
            [73.83, 18.56], // Aundh
            [73.865, 18.532], // Sangam Confluence
            [73.93, 18.54], // Yerwada / Mundhwa
            [74.05, 18.56], // Theur confluence with Bhima
          ],
        },
        properties: {
          name: 'Mula River',
          nameMr: 'मुळा नदी',
          type: 'river',
        },
      },
      // Mutha River (from Khadakwasla)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.65, 18.38], // Panshet / Varasgaon convergence
            [73.76, 18.43], // Khadakwasla Dam
            [73.82, 18.49], // Dhayari / Karve Road
            [73.85, 18.515], // Deccan / Shaniwar Wada
            [73.865, 18.532], // Sangam Confluence
          ],
        },
        properties: {
          name: 'Mutha River',
          nameMr: 'मुठा नदी',
          type: 'river',
        },
      },
      // Pavana River (through PCMC)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.48, 18.66], // Pawna Dam
            [73.64, 18.67], // Dehu Road
            [73.78, 18.62], // Chinchwad
            [73.82, 18.58], // Pimple Saudagar
            [73.84, 18.57], // Confluence into Mula
          ],
        },
        properties: {
          name: 'Pavana River',
          nameMr: 'पवना नदी',
          type: 'river',
        },
      },
      // Indrayani River (through Dehu & Alandi)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.42, 18.75], // Lonavala hills
            [73.58, 18.72], // Kamshet
            [73.72, 18.71], // Dehu Sant Tukaram
            [73.89, 18.67], // Alandi Sant Dnyaneshwar
            [74.05, 18.65], // Tulapur confluence with Bhima
          ],
        },
        properties: {
          name: 'Indrayani Sacred River',
          nameMr: 'पवित्र इंद्रायणी नदी',
          type: 'river',
        },
      },
      // Bhima River (Major lifeline)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.53, 19.07], // Bhimashankar Jyotirlinga origin
            [73.75, 18.98], // Khed / Rajgurunagar
            [74.05, 18.65], // Tulapur Sangam
            [74.35, 18.58], // Daund
            [74.88, 18.28], // Bhigwan / Ujani
          ],
        },
        properties: {
          name: 'Bhima River',
          nameMr: 'भीमा नदी',
          type: 'river',
        },
      },
      // Khadakwasla Reservoir Polygon
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.72, 18.41],
              [73.77, 18.44],
              [73.79, 18.43],
              [73.75, 18.40],
              [73.72, 18.41],
            ],
          ],
        },
        properties: {
          name: 'Khadakwasla Dam Reservoir',
          nameMr: 'खडकवासला जलाशय',
          type: 'reservoir',
        },
      },
      // Mulshi Lake Polygon
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.42, 18.50],
              [73.52, 18.54],
              [73.54, 18.48],
              [73.44, 18.46],
              [73.42, 18.50],
            ],
          ],
        },
        properties: {
          name: 'Mulshi Lake & Dam',
          nameMr: 'मुळशी जलाशय',
          type: 'reservoir',
        },
      },
      // Pawna Lake Polygon
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.46, 18.65],
              [73.52, 18.68],
              [73.54, 18.64],
              [73.48, 18.62],
              [73.46, 18.65],
            ],
          ],
        },
        properties: {
          name: 'Pawna Dam Reservoir',
          nameMr: 'पवना जलाशय',
          type: 'reservoir',
        },
      },
    ],
  };
}

/**
 * GeoJSON FeatureCollection of Major Highway Corridors across Pune District
 */
export function getPuneHighwaysGeoJson(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      // NH-48 (Mumbai - Pune Expressway & Bangalore Highway)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.40, 18.76], // Khandala / Lonavala
            [73.56, 18.72], // Kamshet
            [73.68, 18.68], // Dehu Road
            [73.74, 18.60], // Wakad / Hinjawadi
            [73.78, 18.52], // Chandani Chowk / Kothrud
            [73.84, 18.46], // Katraj Tunnel
            [73.96, 18.28], // Shirwal / Satara border
          ],
        },
        properties: {
          name: 'NH-48 (Mumbai - Pune - Bengaluru Highway)',
          nameMr: 'रा.मा. ४८ (मुंबई - पुणे - बंगळुरू महामार्ग)',
          ref: 'NH-48',
        },
      },
      // NH-65 (Pune - Solapur Highway)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.88, 18.50], // Swargate / Camp
            [73.94, 18.49], // Hadapsar
            [74.15, 18.46], // Loni Kalbhor / Uruli Kanchan
            [74.58, 18.44], // Daund bypass
            [74.88, 18.28], // Bhigwan
            [75.05, 18.15], // Indapur towards Solapur
          ],
        },
        properties: {
          name: 'NH-65 (Pune - Solapur Highway)',
          nameMr: 'रा.मा. ६५ (पुणे - सोलापूर महामार्ग)',
          ref: 'NH-65',
        },
      },
      // NH-60 (Pune - Nashik Highway)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.85, 18.58], // Shivajinagar / Bhosari
            [73.86, 18.74], // Chakan
            [73.89, 18.88], // Rajgurunagar (Khed)
            [73.92, 19.04], // Manchar
            [73.88, 19.20], // Narayangaon / Junnar bypass
            [73.85, 19.35], // Alephata towards Nashik
          ],
        },
        properties: {
          name: 'NH-60 (Pune - Nashik Highway)',
          nameMr: 'रा.मा. ६० (पुणे - नाशिक महामार्ग)',
          ref: 'NH-60',
        },
      },
      // SH-27 (Pune - Ahmednagar Highway)
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.89, 18.56], // Yerwada
            [73.98, 18.58], // Wagholi
            [74.12, 18.66], // Shikrapur
            [74.38, 18.82], // Shirur
          ],
        },
        properties: {
          name: 'SH-27 (Pune - Ahmednagar Highway)',
          nameMr: 'रा.मा. २७ (पुणे - अहमदनगर महामार्ग)',
          ref: 'SH-27',
        },
      },
    ],
  };
}

/**
 * 5 Curated Geographical Storytelling Trails
 */
export const STORY_TRAILS: StoryTrail[] = [
  {
    id: 'sahyadri-forts',
    titleEn: 'Sahyadri Forts of Swarajya',
    titleMr: 'स्वराज्याचे सह्याद्री दुर्ग',
    subtitleEn: 'The impenetrable mountain bastions of Chhatrapati Shivaji Maharaj',
    subtitleMr: 'छत्रपती शिवाजी महाराजांचे अजेय गिरिदुर्ग व बालेकिल्ले',
    descriptionEn: 'Traverse the rugged crest of the Sahyadri Western Ghats connecting the birthplace, first conquest, and royal capital of Hindavi Swarajya.',
    descriptionMr: 'शिवजन्मभूमी शिवनेरी, स्वराज्याची पहिली राजधानी राजगड आणि शौर्यपीठ सिंहगड यांना जोडणारा ऐतिहासिक दुर्गमार्ग.',
    color: '#ef4444',
    icon: '🏰',
    stops: [
      {
        slug: 'shivneri-fort',
        nameEn: 'Shivneri Fort (Junnar)',
        nameMr: 'शिवनेरी किल्ला (जुन्नर)',
        latitude: 19.1983,
        longitude: 73.8617,
        elevationMeters: 1040,
        significanceEn: 'Sacred birthplace of Chhatrapati Shivaji Maharaj (1630 CE), standing guard over northern Pune district.',
        significanceMr: 'छत्रपती शिवाजी महाराज यांचे पावन जन्मस्थान (१६३०), उत्तर पुण्याचे ऐतिहासिक भूषण.',
      },
      {
        slug: 'lohagad-fort',
        nameEn: 'Lohagad Fort (Iron Fort)',
        nameMr: 'लोहगड किल्ला (मावळ)',
        latitude: 18.7083,
        longitude: 73.4792,
        elevationMeters: 1033,
        significanceEn: 'Formidable iron fort commanding the Sahyadri trade routes, famous for its Vinchu Kata spur.',
        significanceMr: 'सह्याद्रीच्या घाटमाथ्यावरील बळकट लोहदुर्ग आणि प्रसिद्ध विंचू काटा माची.',
      },
      {
        slug: 'tikona-fort',
        nameEn: 'Tikona Fort (Vitandgad)',
        nameMr: 'तिकोना किल्ला (वितंडगड)',
        latitude: 18.6319,
        longitude: 73.5186,
        elevationMeters: 1090,
        significanceEn: 'Pyramidal triangular peak overlooking Pawna reservoir with ancient Buddhist caves.',
        significanceMr: 'पवना जलाशयावर टेहळणी करणारा त्रिकोणी आकाराचा गिरिदुर्ग.',
      },
      {
        slug: 'sinhagad-fort',
        nameEn: 'Sinhagad Fort (Kondhana)',
        nameMr: 'सिंहगड किल्ला (कोंढाणा)',
        latitude: 18.3664,
        longitude: 73.7558,
        elevationMeters: 1312,
        significanceEn: 'Legendary 1670 battle site of Subedar Tanaji Malusare perched high at 1,312 meters.',
        significanceMr: 'सुभेदार तानाजी मालुसरे यांच्या पराक्रमाचे साक्षीदार असणारे १,३१२ मीटर उंचीवरील शौर्यपीठ.',
      },
      {
        slug: 'torna-fort',
        nameEn: 'Torna Fort (Prachandagad)',
        nameMr: 'तोरणा किल्ला (प्रचंडगड)',
        latitude: 18.2761,
        longitude: 73.6214,
        elevationMeters: 1403,
        significanceEn: 'Highest fort in Pune district, first fort captured by Shivaji Maharaj in 1646 at age 16.',
        significanceMr: 'पुणे जिल्ह्यातील सर्वोच्च किल्ला (१,४०३ मी.), वयाच्या अवघ्या १६व्या वर्षी शिवरायांनी स्वराज्याची पहिली गुढी उभारली.',
      },
      {
        slug: 'rajgad-fort',
        nameEn: 'Rajgad Fort (King of Forts)',
        nameMr: 'राजगड किल्ला (किल्ल्यांचा राजा)',
        latitude: 18.2581,
        longitude: 73.6822,
        elevationMeters: 1376,
        significanceEn: 'Royal capital of Hindavi Swarajya for 26 unbroken years with the formidable Sanjeevani Machi.',
        significanceMr: '२६ वर्षे हिंदवी स्वराज्याची पहिली राजधानी, बालेकिल्ला व संजीवनी माचीने नटलेला दुर्गराज.',
      },
      {
        slug: 'purandar-fort',
        nameEn: 'Purandar Fort',
        nameMr: 'पुरंदर किल्ला (सासवड)',
        latitude: 18.2833,
        longitude: 73.9667,
        elevationMeters: 1398,
        significanceEn: 'Birthplace of Chhatrapati Sambhaji Maharaj (1657 CE) and site of the historic 1665 Treaty of Purandar.',
        significanceMr: 'छत्रपती संभाजी महाराज यांचे जन्मस्थान (१६५७) आणि ऐतिहासिक पुरंदरचा तह स्थळ.',
      },
    ],
  },
  {
    id: 'sacred-temples',
    titleEn: 'Sacred Temples & Pilgrimages',
    titleMr: 'पवित्र तीर्थक्षेत्रे व देवस्थाने',
    subtitleEn: 'Centuries of saintly bhakti and sacred Sahyadri Jyotirlinga heritage',
    subtitleMr: 'संतभूमी आणि सह्याद्रीतील प्राचीन तीर्थक्षेत्रे',
    descriptionEn: 'From the sacred cloud forest of Bhimashankar Jyotirlinga to the Warkari bhakti capitals of Alandi and Dehu, explore Pune’s spiritual landmarks.',
    descriptionMr: 'भीमाशंकर ज्योतिर्लिंगापासून वारकरी संतांची पावन भूमी आळंदी, देहू आणि जेजुरीपर्यंतचा भक्तिमार्ग.',
    color: '#f97316',
    icon: '🛕',
    stops: [
      {
        slug: 'bhimashankar-temple',
        nameEn: 'Bhimashankar Jyotirlinga',
        nameMr: 'भीमाशंकर ज्योतिर्लिंग',
        latitude: 19.0722,
        longitude: 73.5358,
        elevationMeters: 1005,
        significanceEn: 'One of the 12 sacred Jyotirlingas of Lord Shiva and protected wildlife sanctuary.',
        significanceMr: 'बारा ज्योतिर्लिंगांपैकी सहावे पावन ज्योतिर्लिंग आणि भीमा नदीचे उगमस्थान.',
      },
      {
        slug: 'alandi-dnyaneshwar-mandir',
        nameEn: 'Alandi (Sant Dnyaneshwar Samadhi)',
        nameMr: 'आळंदी (संत ज्ञानेश्वर महाराज संजीवन समाधी)',
        latitude: 18.6756,
        longitude: 73.8967,
        elevationMeters: 580,
        significanceEn: 'Hallowed Sanjeevan Samadhi temple of Sant Dnyaneshwar on the banks of Indrayani (1296 CE).',
        significanceMr: 'इंद्रायणी काठचे पावन तीर्थ आणि माउली संत ज्ञानेश्वर महाराज यांचे संजीवन समाधी मंदिर.',
      },
      {
        slug: 'dehu-gatha-mandir',
        nameEn: 'Dehu (Sant Tukaram Gatha Mandir)',
        nameMr: 'देहू (संत तुकाराम गाथा मंदिर)',
        latitude: 18.7183,
        longitude: 73.7683,
        elevationMeters: 575,
        significanceEn: 'Birthplace of Jagadguru Sant Tukaram Maharaj and the monumental Abhang Gatha temple.',
        significanceMr: 'जगद्गुरू संत तुकाराम महाराज यांची जन्मभूमी आणि ४,००० अभंगांचे भव्य गाथा मंदिर.',
      },
      {
        slug: 'shreemant-dagdusheth-halwai-ganpati',
        nameEn: 'Dagdusheth Halwai Ganpati',
        nameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती',
        latitude: 18.5165,
        longitude: 73.8561,
        elevationMeters: 560,
        significanceEn: 'Pune’s most venerated deity temple founded in 1893 CE, center of Ganeshotsav grandeur.',
        significanceMr: 'पुणेकरांचे आराध्य दैवत आणि भव्य गणेशोत्सवाचे केंद्रबिंदू असणारे जागृत देवस्थान.',
      },
      {
        slug: 'jejuri-khandoba-mandir',
        nameEn: 'Jejuri Khandoba Mandir',
        nameMr: 'जेजुरी खंडोबा देवस्थान',
        latitude: 18.2758,
        longitude: 74.1593,
        elevationMeters: 745,
        significanceEn: 'Golden pilgrimage hill bathed in turmeric (Bhandara) honoring Lord Khandoba with historic Deepmalas.',
        significanceMr: 'भंडाऱ्याची सोन्यासारखी उधळण होणारे कुलदैवत श्री खंडोबाचे जागृत देवस्थान व भव्य दीपमाळा.',
      },
    ],
  },
  {
    id: 'rivers-dams',
    titleEn: 'Rivers, Dams & Reservoirs',
    titleMr: 'नद्या, धरणे आणि सह्याद्री जलाशय',
    subtitleEn: 'The lifelines of Pune carved through the Western Ghats',
    subtitleMr: 'पुण्याचे जीवनवाहिन्या ठरणारे विहंगम जलाशय',
    descriptionEn: 'Follow the crystalline runoff of the Sahyadri mountains through the interconnected dams providing drinking water and hydroelectric energy to the district.',
    descriptionMr: 'सह्याद्रीतून उगम पावून पुणे शहराला व जिल्ह्याला पाणीपुरवठा करणाऱ्या विस्तीर्ण धरणांची जलसफर.',
    color: '#06b6d4',
    icon: '💧',
    stops: [
      {
        slug: 'khadakwasla-dam',
        nameEn: 'Khadakwasla Dam',
        nameMr: 'खडकवासला धरण',
        latitude: 18.4417,
        longitude: 73.7667,
        elevationMeters: 582,
        significanceEn: 'Historic masonry dam on Mutha River built in 1879 CE, primary drinking water reservoir of Pune.',
        significanceMr: 'पुणे शहराची मुख्य जीवनवाहिनी आणि १८७९ मधील ऐतिहासिक दगडी धरण.',
      },
      {
        slug: 'panshet-dam',
        nameEn: 'Panshet Dam (Tanajisagar)',
        nameMr: 'पानशेत धरण (तानाजीसागर)',
        latitude: 18.3750,
        longitude: 73.6167,
        elevationMeters: 635,
        significanceEn: 'Spectacular reservoir surrounded by Sahyadri ridges on Ambi River.',
        significanceMr: 'आंबी नदीवरील सह्याद्रीच्या कुशीतील विशाल जलाशय आणि जलक्रीडा केंद्र.',
      },
      {
        slug: 'varasgaon-dam',
        nameEn: 'Varasgaon Dam (Veer Baaji Pasalkar)',
        nameMr: 'वरसगाव धरण (वीर बाजी पासलकर जलाशय)',
        latitude: 18.3917,
        longitude: 73.5833,
        elevationMeters: 640,
        significanceEn: 'Twin reservoir alongside Panshet on Mose River with dramatic mountain backdrops.',
        significanceMr: 'मोसे नदीवरील विहंगम जलाशय आणि निसर्गरम्य सह्याद्री डोंगररांगा.',
      },
      {
        slug: 'mulshi-dam',
        nameEn: 'Mulshi Dam & Lake',
        nameMr: 'मुळशी धरण व जलाशय',
        latitude: 18.5083,
        longitude: 73.5167,
        elevationMeters: 625,
        significanceEn: 'Tata Hydroelectric reservoir on Mula River surrounded by dense Western Ghats monsoon forests.',
        significanceMr: 'मुळा नदीवरील जलविद्युत निर्मिती करणारे निसर्गरम्य जलाशय आणि धुक्याची दरी.',
      },
      {
        slug: 'pawna-lake',
        nameEn: 'Pawna Lake & Dam',
        nameMr: 'पवना जलाशय व धरण',
        latitude: 18.6667,
        longitude: 73.4833,
        elevationMeters: 615,
        significanceEn: 'Scenic artificial lake ringed by Lohagad, Tikona, and Tung forts in Maval.',
        significanceMr: 'लोहगड आणि तिकोना किल्ल्यांच्या साक्षीने वसलेला विस्तीर्ण निसर्गरम्य जलाशय.',
      },
    ],
  },
  {
    id: 'peshwa-heritage',
    titleEn: 'Peshwa Heritage & Historic Peths',
    titleMr: 'पेशवेकालीन वारसा व ऐतिहासिक पेठा',
    subtitleEn: 'The 18th-century administrative center of the Maratha Empire',
    subtitleMr: 'मराठा साम्राज्याची राजधानी आणि पेशवेकालीन वास्तू',
    descriptionEn: 'Discover the residential citadels, subterranean rock-cut sanctuaries, and historic wadas in the ancient heart of Pune city.',
    descriptionMr: 'शनिवार वाडा, विश्रामबाग वाडा आणि पाताळेश्वर लेण्यांमधून अनुभवा पुण्याचा ऐतिहासिक वैभवशाली प्रवास.',
    color: '#f59e0b',
    icon: '🏛️',
    stops: [
      {
        slug: 'shaniwar-wada',
        nameEn: 'Shaniwar Wada (Peshwa Citadel)',
        nameMr: 'शनिवार वाडा (पेशवे राजधानी)',
        latitude: 18.5195,
        longitude: 73.8553,
        elevationMeters: 560,
        significanceEn: 'Palatial seat of the Maratha Peshwa rulers constructed in 1732 CE with its legendary spiked Dilli Darwaza.',
        significanceMr: '१७३२ मध्ये बाजीराव पेशवे यांनी उभारलेला मराठा साम्राज्याचा सत्ताकेंद्र असणारा ऐतिहासिक राजवाडा.',
      },
      {
        slug: 'lal-mahal',
        nameEn: 'Lal Mahal',
        nameMr: 'लाल महाल',
        latitude: 18.5186,
        longitude: 73.8572,
        elevationMeters: 560,
        significanceEn: 'Historic red palace where Shivaji Maharaj spent his childhood and defeated Shaista Khan in 1663.',
        significanceMr: 'शिवरायांचे बालपण गेलेली ऐतिहासिक वास्तू आणि १६६३ मधील शास्ताखानाची खोड मोडलेले ठिकाण.',
      },
      {
        slug: 'nana-wada',
        nameEn: 'Nana Wada',
        nameMr: 'नाना वाडा',
        latitude: 18.5181,
        longitude: 73.8542,
        elevationMeters: 560,
        significanceEn: '18th-century timber wada built in 1780 CE by Peshwa Prime Minister Nana Phadnavis.',
        significanceMr: '१७८० मध्ये नाना फडणवीस यांनी बांधलेला सागवानी लाकडी कोरीव कामाचा देखणा वाडा.',
      },
      {
        slug: 'vishrambaug-wada',
        nameEn: 'Vishrambaug Wada',
        nameMr: 'विश्रामबाग वाडा',
        latitude: 18.5147,
        longitude: 73.8539,
        elevationMeters: 560,
        significanceEn: 'Lavish mansion of Peshwa Bajirao II built in 1807 CE with hand-carved teakwood columns.',
        significanceMr: 'दुसरे बाजीराव पेशवे यांचा १८०७ मधील सुंदर सागवानी खांब व नक्षीकाम असलेला भव्य वाडा.',
      },
      {
        slug: 'pataleshwar-cave-temple',
        nameEn: 'Pataleshwar Rock-Cut Caves',
        nameMr: 'पाताळेश्वर लेणी (शिवाजीनगर)',
        latitude: 18.5274,
        longitude: 73.8504,
        elevationMeters: 558,
        significanceEn: '8th-century Rashtrakuta monolithic basalt cave temple carved into the Pune urban bedrock.',
        significanceMr: '८व्या शतकातील राष्ट्रकूटकालीन काळ्या पाषाणात खोदलेले भूमिगत शिवमंदिर.',
      },
    ],
  },
  {
    id: 'nature-waterfalls',
    titleEn: 'Sahyadri Waterfalls & Nature',
    titleMr: 'सह्याद्री धबधबे व निसर्गसंपदा',
    subtitleEn: 'Lush cloud forests, monsoon cascades, and biodiversity hotspots',
    subtitleMr: 'दाट अरण्ये, पावसाळी धबधबे आणि सह्याद्रीची जैवविविधता',
    descriptionEn: 'Explore the mist-laden Western Ghats mountain passes, roaring monsoon cataracts, and high-altitude tekdis of Pune.',
    descriptionMr: 'ताम्हिणी घाटातील धुक्याच्या दऱ्या, मढे घाटातील धबधबे आणि पुण्याच्या हिरव्यागार टेकड्यांची सफर.',
    color: '#10b981',
    icon: '🌊',
    stops: [
      {
        slug: 'tamhini-ghat',
        nameEn: 'Tamhini Ghat',
        nameMr: 'ताम्हिणी घाट',
        latitude: 18.4833,
        longitude: 73.4167,
        elevationMeters: 650,
        significanceEn: 'Renowned monsoon mountain pass famed for countless roaring roadside waterfalls.',
        significanceMr: 'पावसाळ्यात शेकडो धबधब्यांनी नटलेला सह्याद्रीचा प्रसिद्ध नयनरम्य घाट.',
      },
      {
        slug: 'madhe-ghat-waterfall',
        nameEn: 'Madhe Ghat Waterfall',
        nameMr: 'मढे घाट धबधबा',
        latitude: 18.2500,
        longitude: 73.5667,
        elevationMeters: 850,
        significanceEn: 'Historic cliff pass in Velhe where Tanaji Malusare’s mortal remains were carried to Umrathe.',
        significanceMr: 'सुभेदार तानाजी मालुसरे यांचे पार्थिव ज्या मार्गाने नेले तो ऐतिहासिक मढे घाट आणि प्रचंड धबधबा.',
      },
      {
        slug: 'tiger-point-lonavala',
        nameEn: 'Tiger’s Leap (Lonavala)',
        nameMr: 'टायगर्स लीप (लोणावळा)',
        latitude: 18.7167,
        longitude: 73.3667,
        elevationMeters: 650,
        significanceEn: 'Sheer 650-meter drop cliff offering panoramic views of Western Ghats valleys.',
        significanceMr: 'सह्याद्रीच्या दऱ्याखोऱ्यांचे विहंगम दृश्य दाखवणारा ६५० मीटर खोल कड्याचा व्ह्यूपॉईंट.',
      },
      {
        slug: 'vetal-tekdi',
        nameEn: 'Vetal Tekdi (Highest City Peak)',
        nameMr: 'वेताळ टेकडी (शहरातील सर्वोच्च टेकडी)',
        latitude: 18.5283,
        longitude: 73.8167,
        elevationMeters: 792,
        significanceEn: 'Highest natural point within Pune municipal limits (792 meters) and cherished birdwatching lung.',
        significanceMr: 'पुणे शहर हद्दीतील सर्वोच्च नैसर्गिक टेकडी (७९२ मी.) आणि मॉर्निंग वॉकर्सचे आवडते ठिकाण.',
      },
    ],
  },
];

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
    latitude: 18.2581,
    longitude: 73.6822,
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
