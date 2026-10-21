/**
 * Explore Pune - Unified User Location & Locality Directory
 * Manages device GPS, IP boundary detection, and comprehensive 50+ Pune neighborhood coordinates.
 * Dispatches 'explore-pune-location-changed' events for instant cross-component synchronization.
 */

import { calculateDistanceKm } from './publicTransit';

export interface UserSavedLocation {
  id: string;
  nameEn: string;
  nameMr: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  isGps: boolean;
  distanceFromPuneKm?: number;
  accuracyRadiusMeters?: number;
  timestamp: number;
  addressDetails?: {
    suburb?: string;
    road?: string;
    city?: string;
    postcode?: string;
    formattedAddress?: string;
  };
}

export interface ReverseGeocodeResult {
  suburb?: string;
  road?: string;
  city?: string;
  postcode?: string;
  formattedAddress?: string;
}

export interface PuneLocality {
  id: string;
  nameEn: string;
  nameMr: string;
  zoneEn: string;
  zoneMr: string;
  latitude: number;
  longitude: number;
  popularTransitHubEn: string;
  popularTransitHubMr: string;
}

export const PUNE_ALL_LOCALITIES: PuneLocality[] = [
  // West Pune
  { id: 'kothrud', nameEn: 'Kothrud / Karve Road', nameMr: 'कोथरूड / कर्वे रस्ता', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.5074, longitude: 73.8077, popularTransitHubEn: 'Vanaz Metro & Paud Phata', popularTransitHubMr: 'वनाज मेट्रो व पौड फाटा' },
  { id: 'baner', nameEn: 'Baner / Balewadi High Street', nameMr: 'बाणेर / बालेवाडी हाय स्ट्रीट', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.5590, longitude: 73.7868, popularTransitHubEn: 'Baner Phata & Balewadi Stadium', popularTransitHubMr: 'बाणेर फाटा व बालेवाडी स्टेडियम' },
  { id: 'aundh', nameEn: 'Aundh / Parihar Chowk', nameMr: 'औंध / परिहार चौक', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.5580, longitude: 73.8075, popularTransitHubEn: 'Bremen Chowk & Parihar Chowk', popularTransitHubMr: 'ब्रेमेन चौक व परिहार चौक' },
  { id: 'bavdhan', nameEn: 'Bavdhan / Chandani Chowk', nameMr: 'बावधन / चांदणी चौक', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.5126, longitude: 73.7741, popularTransitHubEn: 'Chandani Chowk & Vanaz Metro (3 km)', popularTransitHubMr: 'चांदणी चौक व वनाज मेट्रो' },
  { id: 'pashan', nameEn: 'Pashan / Sus Road', nameMr: 'पाषाण / सुस रस्ता', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.5447, longitude: 73.7850, popularTransitHubEn: 'Pashan Circle / Sus Phata', popularTransitHubMr: 'पाषाण सर्कल / सुस फाटा' },
  { id: 'karve-nagar', nameEn: 'Karve Nagar / Cummins College', nameMr: 'कर्वे नगर / कमिन्स कॉलेज', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.4900, longitude: 73.8180, popularTransitHubEn: 'Karve Nagar Bus Stand', popularTransitHubMr: 'कर्वे नगर बस स्टँड' },
  { id: 'warje', nameEn: 'Warje / Malwadi', nameMr: 'वारजे / माळवाडी', zoneEn: 'West', zoneMr: 'पश्चिम', latitude: 18.4857, longitude: 73.7992, popularTransitHubEn: 'Warje Flyover Stand', popularTransitHubMr: 'वारजे उड्डाणपूल थांबा' },
  { id: 'deccan', nameEn: 'Deccan Gymkhana / JM Road / FC Road', nameMr: 'डेक्कन जिमखाना / जेएम व एफसी रस्ता', zoneEn: 'Central', zoneMr: 'मध्यवर्ती', latitude: 18.5175, longitude: 73.8423, popularTransitHubEn: 'Deccan Gymkhana Metro & Bus Terminal', popularTransitHubMr: 'डेक्कन जिमखाना मेट्रो व बस स्थानक' },

  // IT Corridors & PCMC North-West
  { id: 'hinjewadi-p1', nameEn: 'Hinjawadi Phase 1 / Shivaji Chowk', nameMr: 'हिंजवडी फेज १ / शिवाजी चौक', zoneEn: 'IT Park', zoneMr: 'आयटी पार्क', latitude: 18.5913, longitude: 73.7389, popularTransitHubEn: 'Hinjawadi Shivaji Chowk', popularTransitHubMr: 'हिंजवडी शिवाजी चौक' },
  { id: 'hinjewadi-p2', nameEn: 'Hinjawadi Phase 2 & 3', nameMr: 'हिंजवडी फेज २ व ३', zoneEn: 'IT Park', zoneMr: 'आयटी पार्क', latitude: 18.5830, longitude: 73.6980, popularTransitHubEn: 'Megapolis & Wipro Circle', popularTransitHubMr: 'मेगापोलीस व विप्रो सर्कल' },
  { id: 'wakad', nameEn: 'Wakad / Dange Chowk', nameMr: 'वाकड / डांगे चौक', zoneEn: 'PCMC / West', zoneMr: 'पिंपरी / पश्चिम', latitude: 18.5987, longitude: 73.7667, popularTransitHubEn: 'Wakad Bridge & Dange Chowk', popularTransitHubMr: 'वाकड पूल व डांगे चौक' },
  { id: 'pimpri', nameEn: 'Pimpri / PCMC Bhavan', nameMr: 'पिंपरी / मनपा भवन', zoneEn: 'PCMC', zoneMr: 'पिंपरी चिंचवड', latitude: 18.6279, longitude: 73.8009, popularTransitHubEn: 'PCMC Metro Station (Purple Line)', popularTransitHubMr: 'पिंपरी मनपा मेट्रो स्थानक' },
  { id: 'chinchwad', nameEn: 'Chinchwad / Chapekar Chowk', nameMr: 'चिंचवड / चापेकर चौक', zoneEn: 'PCMC', zoneMr: 'पिंपरी चिंचवड', latitude: 18.6298, longitude: 73.7997, popularTransitHubEn: 'Chinchwad Railway Station & Mahavir Chowk', popularTransitHubMr: 'चिंचवड रेल्वे स्टेशन व महावीर चौक' },
  { id: 'nigdi', nameEn: 'Nigdi / Pradhikaran', nameMr: 'निगडी / प्राधिकरण', zoneEn: 'PCMC', zoneMr: 'पिंपरी चिंचवड', latitude: 18.6540, longitude: 73.7745, popularTransitHubEn: 'Bhakti Shakti Nigdi Bus Terminal', popularTransitHubMr: 'भक्ती शक्ती निगडी बस टर्मिनल' },
  { id: 'bhosari', nameEn: 'Bhosari / Nashik Phata', nameMr: 'भोसरी / नाशिक फाटा', zoneEn: 'PCMC', zoneMr: 'पिंपरी चिंचवड', latitude: 18.6042, longitude: 73.8242, popularTransitHubEn: 'Bhosari Metro (Nashik Phata)', popularTransitHubMr: 'भोसरी मेट्रो (नाशिक फाटा)' },
  { id: 'ravet', nameEn: 'Ravet / Kiwale (Expressway Start)', nameMr: 'रावेत / किवळे (द्रुतगती मार्ग सुरु)', zoneEn: 'PCMC', zoneMr: 'पिंपरी चिंचवड', latitude: 18.6520, longitude: 73.7380, popularTransitHubEn: 'Mukaddar Chowk & BRT Stand', popularTransitHubMr: 'मुकद्दर चौक व बीआरटी थांबा' },

  // Central Pune & Old Peths
  { id: 'central', nameEn: 'Central PMC / Shaniwar Peth', nameMr: 'मध्यवर्ती पुणे (मनपा / शनिवार पेठ)', zoneEn: 'Central', zoneMr: 'मध्यवर्ती', latitude: 18.5204, longitude: 73.8567, popularTransitHubEn: 'Budhwar Peth Metro & Shaniwar Wada Stop', popularTransitHubMr: 'बुधवार पेठ मेट्रो व शनिवार वाडा थांबा' },
  { id: 'shivajinagar', nameEn: 'Shivajinagar / University / COEP', nameMr: 'शिवाजीनगर / विद्यापीठ / सीओईपी', zoneEn: 'Central', zoneMr: 'मध्यवर्ती', latitude: 18.5314, longitude: 73.8446, popularTransitHubEn: 'Shivajinagar Metro Station & ST Depot', popularTransitHubMr: 'शिवाजीनगर मेट्रो स्थानक व एसटी डेपो' },
  { id: 'swargate', nameEn: 'Swargate / Mukund Nagar', nameMr: 'स्वारगेट / मुकुंद नगर', zoneEn: 'South', zoneMr: 'दक्षिण', latitude: 18.5018, longitude: 73.8576, popularTransitHubEn: 'Swargate Metro Station (Line 1) & Bus Terminal', popularTransitHubMr: 'स्वारगेट मेट्रो स्थानक व मध्यवर्ती डेपो' },
  { id: 'pune-station', nameEn: 'Pune Railway Station / Camp / Sassoon', nameMr: 'पुणे रेल्वे स्टेशन / कॅम्प / ससून', zoneEn: 'Central', zoneMr: 'मध्यवर्ती', latitude: 18.5284, longitude: 73.8739, popularTransitHubEn: 'Pune Station Metro (Aqua Line) & Central Bus Stand', popularTransitHubMr: 'पुणे स्टेशन मेट्रो स्थानक व बस डेपो' },
  { id: 'mg-road-camp', nameEn: 'Camp / MG Road / East Street', nameMr: 'कॅम्प / एमजी रस्ता / ईस्ट स्ट्रीट', zoneEn: 'Central', zoneMr: 'मध्यवर्ती', latitude: 18.5167, longitude: 73.8789, popularTransitHubEn: 'Poolgate Bus Stand / Westend Stand', popularTransitHubMr: 'पूलगेट बस स्थानक' },

  // East Pune & Airport Belt
  { id: 'viman-nagar', nameEn: 'Viman Nagar / Airport Road', nameMr: 'विमान नगर / विमानतळ रस्ता', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5679, longitude: 73.9143, popularTransitHubEn: 'Ramwadi Metro Station (Aqua Line)', popularTransitHubMr: 'रामवाडी मेट्रो स्थानक' },
  { id: 'kalyani-nagar', nameEn: 'Kalyani Nagar / Koregaon Park', nameMr: 'कल्याणी नगर / कोरेगाव पार्क', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5463, longitude: 73.9033, popularTransitHubEn: 'Kalyani Nagar Metro Station', popularTransitHubMr: 'कल्याणी नगर मेट्रो स्थानक' },
  { id: 'hadapsar', nameEn: 'Hadapsar / Magarpatta City', nameMr: 'हडपसर / मगरपट्टा सिटी', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5089, longitude: 73.9259, popularTransitHubEn: 'Hadapsar Gadital PMPML Bus Hub', popularTransitHubMr: 'हडपसर गाडीतळ बस डेपो' },
  { id: 'kharadi', nameEn: 'Kharadi / EON IT Park / World Trade Center', nameMr: 'खराडी / ईऑन आयटी पार्क / डब्ल्यूटीसी', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5520, longitude: 73.9480, popularTransitHubEn: 'Kharadi Bypass & EON IT Park Stand', popularTransitHubMr: 'खराडी बायपास व ईऑन बस स्टँड' },
  { id: 'yerawada', nameEn: 'Yerawada / Vishrantwadi', nameMr: 'येरवडा / विश्रांतवाडी', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5529, longitude: 73.8831, popularTransitHubEn: 'Yerawada Metro Station (Aqua Line)', popularTransitHubMr: 'येरवडा मेट्रो स्थानक' },
  { id: 'wagholi', nameEn: 'Wagholi / Nagar Road', nameMr: 'वाघोली / नगर रस्ता', zoneEn: 'East', zoneMr: 'पूर्व', latitude: 18.5790, longitude: 73.9810, popularTransitHubEn: 'Wagholi PMPML Depot', popularTransitHubMr: 'वाघोली पीएमपीएमएल डेपो' },

  // South Pune & Fort Corridors
  { id: 'katraj', nameEn: 'Katraj / Dhankawadi / Bharati Vidyapeeth', nameMr: 'कात्रज / धनकवडी / भारती विद्यापीठ', zoneEn: 'South', zoneMr: 'दक्षिण', latitude: 18.4575, longitude: 73.8587, popularTransitHubEn: 'Katraj Bus Depot & Snake Park Chowk', popularTransitHubMr: 'कात्रज बस डेपो व सर्पोद्यान चौक' },
  { id: 'sinhagad-road', nameEn: 'Sinhagad Road / Hingne / Manik Baug', nameMr: 'सिंहगड रस्ता / हिंगणे / माणिक बाग', zoneEn: 'South-West', zoneMr: 'दक्षिण-पश्चिम', latitude: 18.4850, longitude: 73.8210, popularTransitHubEn: 'Anand Nagar Metro (2 km) & Manik Baug Stand', popularTransitHubMr: 'आनंद नगर मेट्रो व माणिक बाग थांबा' },
  { id: 'donje-sinhagad', nameEn: 'Sinhagad Foothills / Donje / Khadakwasla', nameMr: 'सिंहगड पायथा / डोणजे / खडकवासला', zoneEn: 'South-West', zoneMr: 'दक्षिण-पश्चिम', latitude: 18.4020, longitude: 73.7660, popularTransitHubEn: 'Donje Phata / Paytha Jeep Stand', popularTransitHubMr: 'डोणजे फाटा / पायथा जीप स्टँड' },
  { id: 'kondhwa', nameEn: 'Kondhwa / NIBM Road / Salunke Vihar', nameMr: 'कोंढवा / एनआयबीएम रस्ता / साळुंखे विहार', zoneEn: 'South-East', zoneMr: 'दक्षिण-पूर्व', latitude: 18.4720, longitude: 73.8960, popularTransitHubEn: 'NIBM Chowk / Jyoti Chowk Stand', popularTransitHubMr: 'एनआयबीएम चौक / ज्योती चौक' },
  { id: 'bibwewadi', nameEn: 'Bibwewadi / Market Yard / Gangadham', nameMr: 'बिबवेवाडी / मार्केट यार्ड / गंगाधाम', zoneEn: 'South', zoneMr: 'दक्षिण', latitude: 18.4780, longitude: 73.8640, popularTransitHubEn: 'Market Yard Bus Terminal', popularTransitHubMr: 'मार्केट यार्ड बस टर्मिनल' },
];

const STORAGE_KEY = 'explore-pune-user-location';

/**
 * Retrieve saved user location from browser storage.
 */
export function getStoredUserLocation(): UserSavedLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.latitude === 'number') {
      return {
        ...parsed,
        lat: parsed.lat ?? parsed.latitude,
        lng: parsed.lng ?? parsed.longitude,
      };
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persist user location and broadcast change to all components.
 */
export function setStoredUserLocation(loc: UserSavedLocation): void {
  if (typeof window === 'undefined') return;
  try {
    const fullLoc = {
      ...loc,
      lat: loc.lat ?? loc.latitude,
      lng: loc.lng ?? loc.longitude,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullLoc));
    window.dispatchEvent(new CustomEvent('explore-pune-location-changed', { detail: fullLoc }));
  } catch (e) {
    console.error('Failed to store location:', e);
  }
}

/**
 * Set user location by selecting an official Pune locality.
 */
export function setLocationFromLocality(localityId: string): UserSavedLocation | null {
  const loc = PUNE_ALL_LOCALITIES.find((l) => l.id === localityId);
  if (!loc) return null;

  const saved: UserSavedLocation = {
    id: loc.id,
    nameEn: loc.nameEn.split('/')[0].trim(),
    nameMr: loc.nameMr.split('/')[0].trim(),
    latitude: loc.latitude,
    longitude: loc.longitude,
    lat: loc.latitude,
    lng: loc.longitude,
    isGps: false,
    timestamp: Date.now(),
  };

  setStoredUserLocation(saved);
  return saved;
}

/**
 * Search Pune localities with fuzzy match.
 */
export function searchPuneLocalities(query: string): PuneLocality[] {
  const q = query.toLowerCase().trim();
  if (!q) return PUNE_ALL_LOCALITIES.slice(0, 8);

  return PUNE_ALL_LOCALITIES.filter(
    (l) =>
      l.nameEn.toLowerCase().includes(q) ||
      l.nameMr.toLowerCase().includes(q) ||
      l.zoneEn.toLowerCase().includes(q) ||
      l.popularTransitHubEn.toLowerCase().includes(q)
  );
}

/**
 * Identify closest Pune locality to any coordinates.
 */
export function findClosestPuneLocality(lat: number, lng: number): { locality: PuneLocality; distanceKm: number } {
  let closest = PUNE_ALL_LOCALITIES[0];
  let min = 9999;

  for (const l of PUNE_ALL_LOCALITIES) {
    const d = calculateDistanceKm(lat, lng, l.latitude, l.longitude);
    if (d < min) {
      min = d;
      closest = l;
    }
  }

  return { locality: closest, distanceKm: min };
}

/**
 * 1. Free Reverse Geocoding API via OpenStreetMap Nominatim with BigDataCloud fallback.
 * Resolves exact street, suburb, neighborhood, postal code, and city from coordinates with ZERO API key cost!
 */
export async function fetchReverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  // Attempt OpenStreetMap Nominatim (high precision for Pune streets and suburbs)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { 'User-Agent': 'ExplorePune-Guide/1.0 (https://punetrail.web.app)' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const suburb =
        addr.suburb ||
        addr.residential ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.village ||
        addr.city_district;
      const road = addr.road || addr.pedestrian || addr.footway;
      const city = addr.city || addr.town || addr.county || addr.state_district || 'Pune';
      const postcode = addr.postcode || '';

      return {
        suburb,
        road,
        city,
        postcode,
        formattedAddress: data.display_name,
      };
    }
  } catch {
    // Continue to fallback
  }

  // Fallback: BigDataCloud Free Client Reverse Geocoding API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        suburb: data.locality || data.principalSubdivision,
        city: data.city || 'Pune',
        postcode: data.postcode || '',
        formattedAddress: `${data.locality || ''}, ${data.city || ''}, ${data.principalSubdivision || ''}`.replace(/^, /, ''),
      };
    }
  } catch {
    // Graceful fallback
  }

  return null;
}

/**
 * 2. Free IP Geolocation Fallback
 * Used when device lacks GPS hardware or user denies browser location permission.
 */
export async function fetchFreeIpGeolocation(): Promise<{
  lat: number;
  lng: number;
  city: string;
  region: string;
  isp?: string;
} | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('http://ip-api.com/json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && typeof data.lat === 'number') {
        return {
          lat: data.lat,
          lng: data.lon,
          city: data.city || 'Pune',
          region: data.regionName || 'Maharashtra',
          isp: data.isp,
        };
      }
    }
  } catch {
    // Fallback
  }

  return null;
}

/**
 * 3. Search Pune landmarks & streets live using OpenStreetMap Nominatim bounded to Pune Metropolitan Area.
 */
export async function searchPuneLivePlaces(query: string): Promise<PuneLocality[]> {
  const localResults = searchPuneLocalities(query);
  const q = query.trim();
  if (q.length < 3) return localResults;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3200);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' Pune')}&format=json&bounded=1&viewbox=73.65,18.75,74.05,18.35&limit=5`,
      {
        headers: { 'User-Agent': 'ExplorePune-Guide/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const liveData = await res.json();
      const livePlaces: PuneLocality[] = liveData
        .filter((item: any) => item.lat && item.lon)
        .map((item: any, idx: number) => {
          const shortName = item.display_name.split(',')[0].trim();
          const areaName = item.display_name.split(',').slice(0, 3).join(', ').trim();
          return {
            id: `osm-${idx}-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            nameEn: areaName,
            nameMr: areaName,
            zoneEn: 'Live Landmark',
            zoneMr: 'थेट लँडमार्क',
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            popularTransitHubEn: 'Near ' + shortName,
            popularTransitHubMr: shortName + ' जवळ',
          };
        });

      return [...localResults, ...livePlaces];
    }
  } catch {
    // Fallback to local
  }

  return localResults;
}

/**
 * Request device GPS with high accuracy attempt, live reverse geocoding, and Pune proximity detection.
 */
export async function detectPreciseGps(): Promise<{
  success: boolean;
  location?: UserSavedLocation;
  isOutsidePune?: boolean;
  distanceFromPuneKm?: number;
  accuracyMeters?: number;
  reverseGeocode?: ReverseGeocodeResult | null;
  error?: string;
}> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return { success: false, error: 'Geolocation is not supported by your browser.' };
  }

  return new Promise((resolve) => {
    // Attempt high accuracy first with 5.5s timeout
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5500,
      maximumAge: 30000,
    };

    const handleSuccess = async (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy);

      const distFromPune = calculateDistanceKm(lat, lng, 18.5204, 73.8567);
      const isOutsidePune = distFromPune > 45;

      const closest = findClosestPuneLocality(lat, lng);

      // Perform free reverse geocoding via Nominatim/BigDataCloud
      const geoResult = await fetchReverseGeocode(lat, lng).catch(() => null);

      let locationLabelEn = closest.locality.nameEn.split('/')[0].trim();
      let locationLabelMr = closest.locality.nameMr.split('/')[0].trim();

      if (geoResult?.suburb || geoResult?.road) {
        const parts = [geoResult.road, geoResult.suburb].filter(Boolean);
        locationLabelEn = parts.join(', ');
        locationLabelMr = parts.join(', ');
      }

      const savedLoc: UserSavedLocation = {
        id: isOutsidePune ? 'remote-gps' : closest.locality.id,
        nameEn: isOutsidePune
          ? `${geoResult?.city || 'GPS'} (${Math.round(distFromPune)} km from Pune)`
          : `Live GPS: ${locationLabelEn}`,
        nameMr: isOutsidePune
          ? `${geoResult?.city || 'GPS'} (पुण्यापासून ${Math.round(distFromPune)} किमी)`
          : `थेट GPS: ${locationLabelMr}`,
        latitude: lat,
        longitude: lng,
        lat,
        lng,
        isGps: true,
        distanceFromPuneKm: distFromPune,
        accuracyRadiusMeters: accuracy,
        timestamp: Date.now(),
        addressDetails: geoResult || undefined,
      };

      setStoredUserLocation(savedLoc);

      resolve({
        success: true,
        location: savedLoc,
        isOutsidePune,
        distanceFromPuneKm: distFromPune,
        accuracyMeters: accuracy,
        reverseGeocode: geoResult,
      });
    };

    const handleFallback = () => {
      // Fallback to coarse position with 6s timeout
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        async (err) => {
          // If GPS fails, try free IP Geolocation
          const ipLoc = await fetchFreeIpGeolocation().catch(() => null);
          if (ipLoc && typeof ipLoc.lat === 'number') {
            const distFromPune = calculateDistanceKm(ipLoc.lat, ipLoc.lng, 18.5204, 73.8567);
            const isOutside = distFromPune > 45;
            const closest = findClosestPuneLocality(ipLoc.lat, ipLoc.lng);

            const savedLoc: UserSavedLocation = {
              id: isOutside ? 'remote-ip' : closest.locality.id,
              nameEn: isOutside
                ? `Network IP (${ipLoc.city}, ${Math.round(distFromPune)} km from Pune)`
                : `Network Location (${ipLoc.city})`,
              nameMr: isOutside
                ? `नेटवर्क IP (${ipLoc.city}, ${Math.round(distFromPune)} किमी)`
                : `नेटवर्क स्थान (${ipLoc.city})`,
              latitude: ipLoc.lat,
              longitude: ipLoc.lng,
              lat: ipLoc.lat,
              lng: ipLoc.lng,
              isGps: false,
              distanceFromPuneKm: distFromPune,
              timestamp: Date.now(),
            };

            setStoredUserLocation(savedLoc);

            resolve({
              success: true,
              location: savedLoc,
              isOutsidePune: isOutside,
              distanceFromPuneKm: distFromPune,
            });
            return;
          }

          resolve({
            success: false,
            error:
              err.code === err.PERMISSION_DENIED
                ? 'Location permission was denied. Please allow location access in your browser or select your Pune area below.'
                : 'Could not acquire precise GPS signal. Please select your Pune locality from the list below.',
          });
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleFallback, options);
  });
}
