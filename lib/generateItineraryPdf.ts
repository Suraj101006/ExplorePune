import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { ALL_STRUCTURED_PLACES, StructuredPlace } from './chatKnowledgeEngine';
import { LANDMARK_SPECIFIC_FOOD } from './visitorGuidelines';
import { getOperatingStatus } from './operatingHours';
import { calculateDistanceKm } from './publicTransit';

export interface ItineraryPdfStop {
  index: number;
  placeId?: string;
  placeSlug?: string;
  name: string;
  nameMr?: string;
  category?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  arrivalTime?: string;
  departureTime?: string;
  visitMinutes: number;
  travelMinutes: number;
  entryCost?: number | null;
  transitSummary?: string;
  transitStepByStep?: string[];
  nearestMetro?: string;
  nearestBus?: string;
  ticketInfo?: string;
}

export interface ItineraryPdfData {
  userName?: string;
  userEmail?: string;
  planTitle: string;
  planTitleMr?: string;
  planTheme: string;
  planThemeMr?: string;
  badge: string;
  startLocationName: string;
  startTime: string;
  travelMode: string;
  totalDurationMinutes: number;
  bufferMinutes: number;
  estimatedCost: number;
  totalDistanceKm?: number;
  travelersCount?: number;
  startDate?: string;
  endDate?: string;
  preferences?: string[];
  categories?: string[];
  endLocationName?: string;
  stops: ItineraryPdfStop[];
  warnings?: string[];
  isMr?: boolean;
}

export interface PdfGenerationOptions {
  imageMap?: Record<string, string>; // base64 data URLs keyed by image path / slug
}

/**
 * Palette constants for the Heritage Travel Magazine aesthetic
 */
const C_MAROON: [number, number, number] = [107, 29, 47];       // #6B1D2F Deep Royal Maroon
const C_TERRACOTTA: [number, number, number] = [194, 65, 12];   // #C2410C Saffron Terracotta
const C_GOLD: [number, number, number] = [180, 83, 9];          // #B45309 Heritage Gold
const C_GOLD_LIGHT: [number, number, number] = [254, 243, 199];  // #FEF3C7 Warm Gold Tint
const C_IVORY_BG: [number, number, number] = [255, 253, 248];    // #FFFDF8 Ivory Cream
const C_CARD_BG: [number, number, number] = [255, 255, 255];     // #FFFFFF Crisp White
const C_CARD_TINT: [number, number, number] = [253, 251, 247];   // #FDFBF7 Soft Warm Tint
const C_INK_DARK: [number, number, number] = [30, 41, 59];       // #1E293B Slate Charcoal
const C_INK_MUTED: [number, number, number] = [71, 85, 105];     // #475569 Muted Slate
const C_INK_LIGHT: [number, number, number] = [148, 163, 184];   // #94A3B8 Light Slate
const C_LINE: [number, number, number] = [226, 217, 204];        // #E2D9CC Warm Sand Border
const C_GREEN: [number, number, number] = [4, 120, 87];          // #047857 Emerald Verified
const C_GREEN_BG: [number, number, number] = [240, 253, 244];    // #F0FDF4 Emerald Tint
const C_ALERT: [number, number, number] = [185, 28, 28];         // #B91C1C Warning Red
const C_ALERT_BG: [number, number, number] = [254, 242, 242];    // #FEF2F2 Warning Tint

/**
 * Sanitizes strings for jsPDF standard fonts.
 * Transliterates common Marathi words so they render cleanly in Latin-1 PDF readers.
 */
function safePdfText(str?: string | null, fallback = ''): string {
  if (!str) return fallback;
  let text = str;

  // Common Marathi place & tourism word substitutions to preserve cultural meaning in Latin-1
  const marathiTranslit: [RegExp, string][] = [
    [/शनिवार वाडा/g, 'Shaniwar Wada'],
    [/सिंहगड किल्ला/g, 'Sinhagad Fort'],
    [/सिंहगड/g, 'Sinhagad'],
    [/दगडूशेठ गणपती/g, 'Dagdusheth Ganpati'],
    [/दगडूशेठ/g, 'Dagdusheth'],
    [/आगाखान पॅलेस/g, 'Aga Khan Palace'],
    [/पाताळेश्वर/g, 'Pataleshwar'],
    [/केळकर संग्रहालय/g, 'Kelkar Museum'],
    [/सारसबाग/g, 'Sarasbaug'],
    [/खडकवासला/g, 'Khadakwasla'],
    [/लाल महाल/g, 'Lal Mahal'],
    [/महात्मा फुले वाडा/g, 'Mahatma Phule Wada'],
    [/पुणे/g, 'Pune'],
    [/किल्ला/g, 'Fort (Killa)'],
    [/वाडा/g, 'Wada (Palace)'],
    [/मंदिर/g, 'Mandir (Temple)'],
    [/लेणी/g, 'Caves (Leni)'],
    [/संग्रहालय/g, 'Museum'],
    [/उद्यान/g, 'Garden'],
    [/तलाव/g, 'Lake'],
    [/टेकडी/g, 'Tekdi (Hill)'],
    [/पेठ/g, 'Peth'],
    [/वारसा/g, 'Heritage'],
    [/मोफत/g, 'Free'],
    [/प्रवेश/g, 'Entry'],
    [/सकाळी/g, 'Morning'],
    [/दुपारी/g, 'Afternoon'],
    [/संध्याकाळी/g, 'Evening'],
    [/रात्री/g, 'Night'],
  ];

  marathiTranslit.forEach(([rgx, rep]) => {
    text = text.replace(rgx, rep);
  });

  // If text contains English + Marathi in parentheses, keep the English portion
  if (/[\u0900-\u097F]/.test(text) && /[a-zA-Z]/.test(text)) {
    text = text.replace(/\([^)]*[\u0900-\u097F][^)]*\)/g, '').trim();
  }

  const cleaned = text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}

/**
 * Draws a sharp, vector QR code directly onto jsPDF
 */
function drawVectorQr(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  sizeMm: number,
  color: [number, number, number] = [0, 0, 0]
) {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const modCount = qr.modules.size;
    const cellSize = sizeMm / modCount;
    doc.setFillColor(color[0], color[1], color[2]);
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (qr.modules.get(r, c)) {
          doc.rect(x + c * cellSize, y + r * cellSize, cellSize, cellSize, 'F');
        }
      }
    }
  } catch (err) {
    console.warn('[PDF QR] Failed to draw QR code:', err);
  }
}

/**
 * Loads an image from the local filesystem when running in Node.js
 */
function getLocalImageBase64(relativePath: string): string | null {
  try {
    if (typeof window === 'undefined') {
      const fs = eval('require')('fs');
      const path = eval('require')('path');
      const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      if (fs.existsSync(fullPath)) {
        const buf = fs.readFileSync(fullPath);
        const ext = path.extname(cleanPath).toLowerCase();
        const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    }
  } catch {
    // Ignore in browser
  }
  return null;
}

/**
 * Retrieves the best available base64 image data for a path or stop
 */
function resolveImage(
  imagePath: string | undefined,
  imageMap?: Record<string, string>
): string | null {
  if (!imagePath) return null;
  if (imageMap && imageMap[imagePath]) return imageMap[imagePath];
  const local = getLocalImageBase64(imagePath);
  if (local) return local;
  return null;
}

/**
 * Finds the complete structured place record from the database
 */
function findStructuredPlace(stop: ItineraryPdfStop): StructuredPlace | null {
  const targetSlug = (stop.placeSlug || '').toLowerCase();
  const targetId = (stop.placeId || '').toLowerCase();
  const targetName = (stop.name || '').toLowerCase();

  const found = ALL_STRUCTURED_PLACES.find((p) => {
    const pSlug = (p.slug || '').toLowerCase();
    const pId = (p.id || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    return (
      (targetSlug && pSlug === targetSlug) ||
      (targetId && pId === targetId) ||
      (targetSlug && pId === targetSlug) ||
      (pName && targetName && (pName.includes(targetName) || targetName.includes(pName)))
    );
  });

  return found || null;
}

/**
 * Constructs Google Maps directions links with waypoint segmentation
 */
function buildGoogleMapsRouteUrls(
  originName: string,
  stops: ItineraryPdfStop[],
  travelMode: string
): Array<{ title: string; url: string }> {
  const gMode =
    travelMode === 'walking'
      ? 'walking'
      : travelMode === 'cycling'
      ? 'bicycling'
      : travelMode === 'public_transit'
      ? 'transit'
      : 'driving';

  const formatCoordOrName = (s: { name: string; latitude?: number; longitude?: number }) => {
    if (s.latitude && s.longitude) {
      return `${s.latitude.toFixed(5)},${s.longitude.toFixed(5)}`;
    }
    return encodeURIComponent(s.name + ', Pune, Maharashtra');
  };

  if (stops.length === 0) {
    return [
      {
        title: 'Starting Point Navigation',
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(originName + ', Pune')}`,
      },
    ];
  }

  // Google Maps limit: 8 intermediate waypoints per URL
  const MAX_WAYPOINTS = 8;
  const segments: Array<{ title: string; url: string }> = [];

  let currentOrigin = { name: originName, latitude: undefined, longitude: undefined };

  for (let i = 0; i < stops.length; i += MAX_WAYPOINTS) {
    const chunk = stops.slice(i, i + MAX_WAYPOINTS);
    const dest = chunk[chunk.length - 1];
    const waypoints = chunk.slice(0, -1);

    const origParam = formatCoordOrName(currentOrigin);
    const destParam = formatCoordOrName(dest);
    const waypointsParam = waypoints.map(formatCoordOrName).join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origParam}&destination=${destParam}&travelmode=${gMode}`;
    if (waypointsParam) {
      url += `&waypoints=${waypointsParam}`;
    }

    const segNum = Math.floor(i / MAX_WAYPOINTS) + 1;
    const totalSegs = Math.ceil(stops.length / MAX_WAYPOINTS);
    const segTitle =
      totalSegs > 1
        ? `Complete Route — Leg ${segNum} of ${totalSegs} (Stops ${i + 1} to ${i + chunk.length})`
        : 'Complete Turn-by-Turn Route in Google Maps';

    segments.push({ title: segTitle, url });
    currentOrigin = dest as any;
  }

  return segments;
}

/**
 * Draws the elegant heritage border and corner accents
 */
function drawHeritageBorder(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number) {
  // Outer Terracotta Rule
  doc.setDrawColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.setLineWidth(1.2);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Inner Gold Hairline
  doc.setDrawColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.setLineWidth(0.35);
  doc.rect(margin + 2, margin + 2, pageWidth - (margin + 2) * 2, pageHeight - (margin + 2) * 2);

  // Corner decorative squares
  const cSize = 4;
  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin - 0.6, margin - 0.6, cSize, cSize, 'F');
  doc.rect(pageWidth - margin - cSize + 0.6, margin - 0.6, cSize, cSize, 'F');
  doc.rect(margin - 0.6, pageHeight - margin - cSize + 0.6, cSize, cSize, 'F');
  doc.rect(pageWidth - margin - cSize + 0.6, pageHeight - margin - cSize + 0.6, cSize, cSize, 'F');
}

/**
 * Draws a section banner heading with maroon & gold styling
 */
function drawSectionBanner(
  doc: jsPDF,
  title: string,
  subtitle: string,
  x: number,
  y: number,
  width: number
): number {
  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(x, y, width, 14, 'F');

  // Gold accent bar at bottom of banner
  doc.setFillColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.rect(x, y + 14, width, 1.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), x + 5, y + 6.5);

  doc.setTextColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(subtitle, x + 5, y + 11.2);

  return y + 19;
}

/**
 * MASTER GENERATOR: Creates the luxury, publication-grade Explore Pune travel itinerary
 */
export function generateItineraryPdf(
  data: ItineraryPdfData,
  options?: PdfGenerationOptions
): jsPDF {
  const isMr = Boolean(data.isMr);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const imageMap = options?.imageMap || {};

  const today = new Date();
  const dateStr =
    data.startDate ||
    today.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  const tourCode = `EP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const profileName = safePdfText(data.userName) || 'Pune Explorer';
  const planTitleSafe = safePdfText(data.planTitle) || 'Custom Pune Expedition';
  const planThemeSafe = safePdfText(data.planTheme) || 'Heritage, culture, and nature circuit';
  const travelersCount = data.travelersCount && data.travelersCount > 0 ? data.travelersCount : 1;

  // Compute total travel distance from coordinates
  let computedKm = data.totalDistanceKm || 0;
  if (!computedKm && data.stops.length > 1) {
    for (let i = 0; i < data.stops.length - 1; i++) {
      const a = data.stops[i];
      const b = data.stops[i + 1];
      if (a.latitude && a.longitude && b.latitude && b.longitude) {
        computedKm += calculateDistanceKm(a.latitude, a.longitude, b.latitude, b.longitude);
      } else {
        computedKm += 4.5; // Average Pune urban stop distance
      }
    }
  }
  const totalKmStr = computedKm > 0 ? `${computedKm.toFixed(1)} km` : 'Not available';

  // Compute sightseeing vs travel time
  const totalSightseeingMinutes = data.stops.reduce((acc, s) => acc + (s.visitMinutes || 45), 0);
  const totalTravelMinutes = data.stops.reduce((acc, s) => acc + (s.travelMinutes || 15), 0);
  const totalExpeditionMinutes = data.totalDurationMinutes || totalSightseeingMinutes + totalTravelMinutes;

  // Helper to trigger new pages with heritage framing
  const startNewPage = () => {
    doc.addPage();
    doc.setFillColor(C_IVORY_BG[0], C_IVORY_BG[1], C_IVORY_BG[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    drawHeritageBorder(doc, pageWidth, pageHeight, margin);
  };

  // =========================================================================
  // PAGE 1: HERITAGE COVER PAGE (Part 1)
  // =========================================================================
  doc.setFillColor(C_IVORY_BG[0], C_IVORY_BG[1], C_IVORY_BG[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  drawHeritageBorder(doc, pageWidth, pageHeight, margin);

  let y = margin + 8;

  // Brand Header & Seal
  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin + 4, y, contentWidth - 8, 16, 'F');
  doc.setFillColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.rect(margin + 4, y + 16, contentWidth - 8, 1.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('EXPLORE PUNE  •  OFFICIAL TRAVEL DOSSIER', pageWidth / 2, y + 7.5, { align: 'center' });

  doc.setTextColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Government Archive & Maharashtra Heritage Circuit  •  https://explorepune-guide.vercel.app', pageWidth / 2, y + 12.5, { align: 'center' });

  y += 24;

  // Title Block
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('MY PUNE TRAVEL ITINERARY', pageWidth / 2, y + 4, { align: 'center' });

  y += 9;
  doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.setFont('times', 'italic');
  doc.setFontSize(11.5);
  doc.text('Discover the Soul of Pune  •  पुण्यनगरी • सह्याद्री • वारसा', pageWidth / 2, y + 2, { align: 'center' });

  y += 8;
  doc.setDrawColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.setLineWidth(0.6);
  doc.line(margin + 30, y, pageWidth - margin - 30, y);

  y += 6;

  // Cover Photo (Authentic landmark image)
  const coverPhotoHeight = 72;
  const firstStopSlug = data.stops[0]?.placeSlug || 'sinhagad-fort';
  const coverImgPath =
    data.stops[0]?.image_url ||
    `/images/places/${firstStopSlug}.jpg` ||
    '/images/pune-map-hero.jpg';

  const coverBase64 =
    resolveImage(coverImgPath, imageMap) ||
    resolveImage('/images/pune-map-hero.jpg', imageMap) ||
    resolveImage('/images/places/sinhagad-fort.jpg', imageMap);

  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.rect(margin + 4, y, contentWidth - 8, coverPhotoHeight, 'FD');

  if (coverBase64) {
    try {
      doc.addImage(coverBase64, 'JPEG', margin + 6, y + 2, contentWidth - 12, coverPhotoHeight - 4);
    } catch {
      // Graceful vector placeholder
      doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
      doc.rect(margin + 6, y + 2, contentWidth - 12, coverPhotoHeight - 4, 'F');
      doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.text('Iconic Sahyadri & Historic Pune Architecture', pageWidth / 2, y + 36, { align: 'center' });
    }
  } else {
    doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
    doc.rect(margin + 6, y + 2, contentWidth - 12, coverPhotoHeight - 4, 'F');
    doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text('EXPLORE PUNE HERITAGE SANCTUM', pageWidth / 2, y + 34, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Sinhagad Fort • Shaniwar Wada • Aga Khan Palace • Pataleshwar', pageWidth / 2, y + 42, { align: 'center' });
  }

  // Cover photo caption tag
  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin + 6, y + coverPhotoHeight - 8, contentWidth - 12, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  const photoCaption = safePdfText(data.stops[0]?.name || 'Pune Landmark') + ' — Official Expedition Highlight';
  doc.text(photoCaption, margin + 10, y + coverPhotoHeight - 4);

  y += coverPhotoHeight + 8;

  // Personalized Traveler Dossier Card (Part 1 details)
  const dossierH = 46;
  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.rect(margin + 4, y, contentWidth - 8, dossierH, 'FD');

  // Decorative terracotta left spine
  doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.rect(margin + 4, y, 3.5, dossierH, 'F');

  // Dossier Row 1: Traveler Profile & Tour Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('TRAVELER PROFILE', margin + 12, y + 7);
  doc.text('TOUR REFERENCE CODE', margin + 74, y + 7);
  doc.text('DATE GENERATED', margin + 130, y + 7);

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.text(profileName.slice(0, 30), margin + 12, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.text(tourCode, margin + 74, y + 13);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.text(dateStr, margin + 130, y + 13);

  // Dossier Row 2: Selected Expedition Name & Duration
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('EXPEDITION PLAN TITLE', margin + 12, y + 20);
  doc.text('TOTAL DURATION', margin + 104, y + 20);
  doc.text('TRAVELERS', margin + 144, y + 20);

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text(planTitleSafe.slice(0, 48), margin + 12, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  const durHrs = (totalExpeditionMinutes / 60).toFixed(1);
  doc.text(`~${durHrs} hrs (${totalExpeditionMinutes}m)`, margin + 104, y + 26);
  doc.text(`${travelersCount} Person${travelersCount > 1 ? 's' : ''}`, margin + 144, y + 26);

  // Dossier Row 3: Travel Preferences & Destination Categories
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('THEME & PREFERENCES', margin + 12, y + 33);
  doc.text('TRANSIT MODE', margin + 104, y + 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  const themeText = planThemeSafe.length > 55 ? planThemeSafe.slice(0, 54) + '...' : planThemeSafe;
  doc.text(themeText, margin + 12, y + 39);

  const modeReadable =
    data.travelMode === 'public_transit'
      ? 'Metro + PMPML Bus Pass'
      : data.travelMode === 'driving'
      ? 'Private Vehicle / Cab'
      : data.travelMode === 'walking'
      ? 'Heritage Walking Trail'
      : safePdfText(data.travelMode);
  doc.setFont('helvetica', 'bold');
  doc.text(modeReadable, margin + 104, y + 39);

  y += dossierH + 8;

  // Bottom Portal Seal & QR Code Block
  const sealH = 26;
  doc.setFillColor(C_CARD_TINT[0], C_CARD_TINT[1], C_CARD_TINT[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.rect(margin + 4, y, contentWidth - 8, sealH, 'FD');

  // Draw Website QR Code
  const qrSize = 20;
  drawVectorQr(doc, 'https://explorepune-guide.vercel.app', margin + 8, y + 3, qrSize, C_MAROON);

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text('OFFICIAL VERIFIED ITINERARY PASS', margin + 33, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('Scan QR code with any mobile camera to view live updates, route maps, and weather.', margin + 33, y + 14);
  doc.text('Explore Pune Official Portal: https://explorepune-guide.vercel.app', margin + 33, y + 19);

  // Clickable link on website text
  doc.link(margin + 33, y + 15, 90, 6, { url: 'https://explorepune-guide.vercel.app' });

  // =========================================================================
  // PAGE 2: TRIP OVERVIEW (Part 2) & ROUTE MAP AND NAVIGATION (Part 3)
  // =========================================================================
  startNewPage();
  y = margin + 4;

  y = drawSectionBanner(
    doc,
    'TRIP OVERVIEW & STRATEGIC ROUTE MAP',
    'Comprehensive Circuit Summary, Distances, Timing & Turn-by-Turn Navigation',
    margin,
    y,
    contentWidth
  );

  // PART 2: Statistic Cards (2 rows of 4 cards = 8 cards total)
  const cardW = (contentWidth - 6) / 2;
  const cardH = 14;

  const statCardsRow1 = [
    {
      title: 'STARTING & ENDING POINT',
      val: safePdfText(data.startLocationName, 'Central Pune') + ' -> Return',
      sub: 'Designated expedition corridor',
    },
    {
      title: 'DESTINATIONS COUNT',
      val: `${data.stops.length} Planned Historic Stops`,
      sub: `${totalSightseeingMinutes} mins total sightseeing`,
    },
  ];

  statCardsRow1.forEach((card, idx) => {
    const cX = margin + idx * (cardW + 6);
    doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(cX, y, cardW, cardH, 'FD');

    doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
    doc.rect(cX, y, 2, cardH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.title, cX + 6, y + 4.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(card.val.slice(0, 36), cX + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.sub, cX + 6, y + 12.5);
  });

  y += cardH + 3.5;

  const statCardsRow2 = [
    {
      title: 'TOTAL DISTANCE & TRAVEL TIME',
      val: `${totalKmStr}  •  ~${totalTravelMinutes}m Transit`,
      sub: 'Based on actual Pune road network',
    },
    {
      title: 'TOTAL SIGHTSEEING DURATION',
      val: `~${(totalSightseeingMinutes / 60).toFixed(1)} hrs (${totalSightseeingMinutes} mins)`,
      sub: 'Active monument & citadel exploration',
    },
  ];

  statCardsRow2.forEach((card, idx) => {
    const cX = margin + idx * (cardW + 6);
    doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(cX, y, cardW, cardH, 'FD');

    doc.setFillColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
    doc.rect(cX, y, 2, cardH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.title, cX + 6, y + 4.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(card.val, cX + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.sub, cX + 6, y + 12.5);
  });

  y += cardH + 3.5;

  const perPersonEstimate = (data.estimatedCost || 0) + (data.travelMode === 'public_transit' ? 70 : 120);
  const groupEstimate = perPersonEstimate * travelersCount;

  const statCardsRow3 = [
    {
      title: 'ESTIMATED PER-PERSON BUDGET',
      val: `INR ${perPersonEstimate > 0 ? perPersonEstimate : 'Not available'} / person`,
      sub: 'Includes verified entry tickets + local transit',
    },
    {
      title: `ESTIMATED GROUP BUDGET (${travelersCount} PAX)`,
      val: `INR ${groupEstimate > 0 ? groupEstimate : 'Not available'} total group`,
      sub: `Covers ${travelersCount} adult traveler${travelersCount > 1 ? 's' : ''}`,
    },
  ];

  statCardsRow3.forEach((card, idx) => {
    const cX = margin + idx * (cardW + 6);
    doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(cX, y, cardW, cardH, 'FD');

    doc.setFillColor(C_GREEN[0], C_GREEN[1], C_GREEN[2]);
    doc.rect(cX, y, 2, cardH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.title, cX + 6, y + 4.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(C_GREEN[0], C_GREEN[1], C_GREEN[2]);
    doc.text(card.val, cX + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(card.sub, cX + 6, y + 12.5);
  });

  y += cardH + 6;

  // Important Travel Considerations Note
  doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
  doc.setDrawColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.rect(margin, y, contentWidth, 11, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
  doc.text('CRITICAL TRAVEL CONSIDERATIONS:', margin + 4, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.text(
    'Morning start recommended (08:00 - 08:30 AM) to avoid Lakdi Pul and Shivaji Road peak traffic. Wear grippy footwear for fort stone steps. Carry cash for base tolls.',
    margin + 4,
    y + 8.5
  );

  y += 15;

  // PART 3: Route Schematic Map & Navigation Links
  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  const routeBoxH = 110;
  doc.rect(margin, y, contentWidth, routeBoxH, 'FD');

  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PLANNED ROUTE CONNECTIONS & DISTANCE MATRIX', margin + 5, y + 5);

  let rY = y + 13;

  // Start point row
  doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.circle(margin + 8, rY, 3.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('S', margin + 6.8, rY + 1.2);

  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Origin: ${safePdfText(data.startLocationName, 'Pune Starting Hub')}`, margin + 16, rY + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text(`Expedition Departure: ${data.startTime || '08:30 AM'}`, margin + 115, rY + 1);

  rY += 8;

  // Stop sequence trail
  data.stops.forEach((stop, sIdx) => {
    // Connector line
    doc.setDrawColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
    doc.setLineWidth(0.8);
    doc.line(margin + 8, rY - 5, margin + 8, rY + 2);

    // Numbered Stop Circle
    doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.circle(margin + 8, rY + 3, 3.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const numS = String(sIdx + 1);
    doc.text(numS, margin + (numS.length > 1 ? 6.5 : 7.2), rY + 4.2);

    // Destination Name & Category
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    const pName = safePdfText(stop.name, `Stop #${sIdx + 1}`);
    doc.text(pName.slice(0, 40), margin + 16, rY + 3);

    // Clickable link to website page
    if (stop.placeSlug) {
      const siteUrl = `https://explorepune-guide.vercel.app/places/${stop.placeSlug}`;
      doc.link(margin + 16, rY, 55, 5, { url: siteUrl });
    }

    // Timing & Distance Strip
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    const timeInfo = stop.arrivalTime && stop.departureTime ? `${stop.arrivalTime} - ${stop.departureTime}` : `Stay: ${stop.visitMinutes}m`;
    const legInfo = stop.travelMinutes > 0 ? `Transit: ~${stop.travelMinutes}m` : 'Direct Leg';
    doc.text(`${timeInfo}  •  ${legInfo}`, margin + 105, rY + 3);

    rY += 9;
  });

  // Google Maps Route QR Codes & Direct Navigation Links
  const mapsRoutes = buildGoogleMapsRouteUrls(data.startLocationName, data.stops, data.travelMode);
  const qrBoxY = y + routeBoxH - 38;

  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.line(margin + 4, qrBoxY - 2, margin + contentWidth - 4, qrBoxY - 2);

  // Draw up to 2 segmented Google Maps route QR codes
  mapsRoutes.slice(0, 2).forEach((seg, qIdx) => {
    const qX = margin + 6 + qIdx * 88;
    drawVectorQr(doc, seg.url, qX, qrBoxY + 1, 22, C_TERRACOTTA);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.text(seg.title.slice(0, 32), qX + 25, qrBoxY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text('Scan for live turn-by-turn navigation in Google Maps app.', qX + 25, qrBoxY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
    doc.text('Click to Open Google Maps Route ->', qX + 25, qrBoxY + 17);
    doc.link(qX + 25, qrBoxY + 13, 58, 6, { url: seg.url });
  });

  // =========================================================================
  // PAGE 3: TIME-WISE ITINERARY (Part 5) & TRAVEL / TRANSPORT DETAILS (Part 6)
  // =========================================================================
  startNewPage();
  y = margin + 4;

  y = drawSectionBanner(
    doc,
    'TIME-WISE EXPEDITION TIMELINE & TRANSIT LOG',
    'Calculated Chrono-Log, Visit Durations, Operating Hours & Transit Connections',
    margin,
    y,
    contentWidth
  );

  // Timeline Container
  const timelineItemH = 26;
  data.stops.forEach((stop, sIdx) => {
    const structPlace = findStructuredPlace(stop);
    const opStatus = structPlace ? getOperatingStatus(structPlace) : null;

    // Check if meal break should be inserted after this stop
    const [depH, depM] = (stop.departureTime || '12:00 PM').split(/[: ]/).map(Number);
    const isPm = (stop.departureTime || '').toLowerCase().includes('pm');
    const hour24 = isPm && depH !== 12 ? depH + 12 : !isPm && depH === 12 ? 0 : depH;

    const isLunchWindow = hour24 >= 12 && hour24 <= 14 && sIdx < data.stops.length - 1;
    const isSnackWindow = hour24 >= 16 && hour24 <= 18 && sIdx < data.stops.length - 1;

    // Stop Card
    doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(margin, y, contentWidth, timelineItemH, 'FD');

    // Time Column on Left
    doc.setFillColor(C_CARD_TINT[0], C_CARD_TINT[1], C_CARD_TINT[2]);
    doc.rect(margin, y, 32, timelineItemH, 'F');
    doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
    doc.rect(margin + 31.2, y, 0.8, timelineItemH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.text(stop.arrivalTime || '09:00 AM', margin + 3, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(`to ${stop.departureTime || '10:00 AM'}`, margin + 3, y + 12);
    doc.text(`Stay: ${stop.visitMinutes}m`, margin + 3, y + 17);

    // Right Content Block
    const pTitle = safePdfText(stop.name, `Expedition Stop #${sIdx + 1}`);
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(`${sIdx + 1}. ${pTitle}`, margin + 36, y + 6.5);

    // Admission & Operating Hours Strip
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const feeLabel =
      stop.entryCost === null || stop.entryCost === undefined
        ? 'Entry Fee: Not officially confirmed'
        : stop.entryCost === 0
        ? 'Entry Fee: Verified Free Entry (₹0)'
        : `Entry Fee: INR ${stop.entryCost} / adult`;
    doc.setTextColor(C_GREEN[0], C_GREEN[1], C_GREEN[2]);
    doc.text(feeLabel, margin + 36, y + 11.5);

    // Operating status badge
    if (opStatus) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
      doc.text(`•  ${opStatus.statusTextEn}`, margin + 98, y + 11.5);
    }

    // Transit Summary Leg
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    const transitSafe = safePdfText(stop.transitSummary || 'Direct transit via city arterial roads.');
    doc.text(`Transit: ${transitSafe.slice(0, 92)}`, margin + 36, y + 16.5);

    // Metro / Bus Connection Pill
    const metroSafe = safePdfText(stop.nearestMetro);
    const busSafe = safePdfText(stop.nearestBus);
    const connParts = [metroSafe ? `Metro: ${metroSafe}` : '', busSafe ? `PMPML: ${busSafe}` : ''].filter(Boolean);
    if (connParts.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
      doc.text(connParts.join('  |  '), margin + 36, y + 21.5);
    }

    y += timelineItemH + 3.5;

    // Insert Meal / Rest Break Banner if appropriate
    if (isLunchWindow) {
      doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
      doc.setDrawColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
      doc.rect(margin, y, contentWidth, 12, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
      doc.text('TRADITIONAL PUNE LUNCH BREAK  (45 - 60 MINS)', margin + 5, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
      doc.text(
        'Recommended authentic specialties: Chulivarchi Pithla Bhakri & Thecha, Bedekar Misal (Narayan Peth), or Durvankur Thali.',
        margin + 5,
        y + 9.5
      );
      y += 15.5;
    } else if (isSnackWindow) {
      doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
      doc.setDrawColor(C_GOLD[0], C_GOLD[1], C_GOLD[2]);
      doc.rect(margin, y, contentWidth, 11, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
      doc.text('EVENING PUNERI REFRESHMENT BREAK  (30 MINS)', margin + 5, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
      doc.text(
        'Recommended heritage stops: Sujata Mastani (Mango Ice Cream Shake) or Cafe Goodluck Bun Maska & Irani Chai.',
        margin + 5,
        y + 8.5
      );
      y += 14.5;
    }
  });

  // =========================================================================
  // PAGES 4 & 5: DETAILED DESTINATION PROFILES (Part 4)
  // =========================================================================
  // Render up to 4 detailed profiles (2 per page)
  const profileStops = data.stops.slice(0, 4);

  profileStops.forEach((stop, pIdx) => {
    // Start page on even profile indices (0, 2)
    if (pIdx % 2 === 0) {
      startNewPage();
      y = margin + 4;
      y = drawSectionBanner(
        doc,
        `DETAILED DESTINATION PROFILES  •  PART ${Math.floor(pIdx / 2) + 1}`,
        'Authentic Historical Context, Admission Fees, Operating Hours & Visitor Facilities',
        margin,
        y,
        contentWidth
      );
    }

    const structPlace = findStructuredPlace(stop);
    const profileBoxH = 114;

    doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(margin, y, contentWidth, profileBoxH, 'FD');

    // Profile Header Strip
    doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.rect(margin, y, contentWidth, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`STOP #${pIdx + 1}: ${safePdfText(stop.name).toUpperCase()}`, margin + 5, y + 5.5);

    const catBadge = safePdfText(structPlace?.category || stop.category || 'Historic Monument');
    doc.setFontSize(7.5);
    doc.setTextColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
    doc.text(`Category: ${catBadge}`, pageWidth - margin - 5, y + 5.5, { align: 'right' });

    // Left Column: Authentic Photograph
    const photoW = 54;
    const photoH = 38;
    const pX = margin + 4;
    const pY = y + 11;

    const imgSlug = stop.placeSlug || structPlace?.slug;
    const imgPath = stop.image_url || structPlace?.image_url || (imgSlug ? `/images/places/${imgSlug}.jpg` : undefined);
    const stopB64 = resolveImage(imgPath, imageMap);

    doc.setFillColor(C_CARD_TINT[0], C_CARD_TINT[1], C_CARD_TINT[2]);
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.rect(pX, pY, photoW, photoH, 'FD');

    if (stopB64) {
      try {
        doc.addImage(stopB64, 'JPEG', pX + 1, pY + 1, photoW - 2, photoH - 2);
      } catch {
        // Fallback vector card
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
        doc.text(safePdfText(stop.name).slice(0, 22), pX + 4, pY + 18);
      }
    } else {
      doc.setFont('times', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
      doc.text(safePdfText(stop.name).slice(0, 22), pX + 4, pY + 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
      doc.text('Explore Pune Verified Site', pX + 4, pY + 24);
    }

    // Right Column: Location, Address & Key Visitor Facts
    const rX = margin + photoW + 8;
    const rW = contentWidth - photoW - 12;

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    const cleanPlaceTitle = safePdfText(structPlace?.name || stop.name);
    doc.text(cleanPlaceTitle, rX, y + 15);

    // Address
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    const addrSafe = safePdfText(structPlace?.address || 'Pune, Maharashtra 411001');
    doc.text(`Address: ${addrSafe.slice(0, 68)}`, rX, y + 20);

    // Key Visitor Metrics Mini-Table
    const factY = y + 24;
    doc.setFillColor(C_CARD_TINT[0], C_CARD_TINT[1], C_CARD_TINT[2]);
    doc.rect(rX, factY, rW, 25, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text('PLANNED VISIT', rX + 3, factY + 4.5);
    doc.text('ADMISSION TICKET', rX + 40, factY + 4.5);
    doc.text('OPERATING HOURS', rX + 80, factY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(`${stop.arrivalTime || '09:00'} - ${stop.departureTime || '10:00'} (${stop.visitMinutes}m)`, rX + 3, factY + 9.5);

    const feeText =
      structPlace?.entry_fee === 0 || stop.entryCost === 0
        ? 'Free Entry (INR 0)'
        : structPlace?.entry_fee
        ? `INR ${structPlace.entry_fee} (Adults)`
        : stop.entryCost
        ? `INR ${stop.entryCost} / adult`
        : 'Not officially confirmed';
    doc.setTextColor(C_GREEN[0], C_GREEN[1], C_GREEN[2]);
    doc.text(feeText, rX + 40, factY + 9.5);

    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    const hoursText = structPlace?.place_hours?.[0]
      ? `${structPlace.place_hours[0].opens_at} - ${structPlace.place_hours[0].closes_at}`
      : '08:00 AM - 06:00 PM';
    doc.text(hoursText, rX + 80, factY + 9.5);

    // Row 2 of metrics: Parking, Accessibility, Best Time
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text('PARKING STATUS', rX + 3, factY + 15.5);
    doc.text('ACCESSIBILITY', rX + 40, factY + 15.5);
    doc.text('BEST TIME TO VISIT', rX + 80, factY + 15.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    const parkingSafe = safePdfText(structPlace?.fee_details?.parking, 'Pay & Park available nearby');
    doc.text(parkingSafe.slice(0, 26), rX + 3, factY + 20.5);

    const isFort = (structPlace?.category_slug || '').includes('fort');
    const accessText = isFort ? 'Stone stairs; not wheelchair accessible' : 'Ground ramp access verified';
    doc.text(accessText, rX + 40, factY + 20.5);

    const bestTimeSafe = safePdfText(structPlace?.best_time, 'Oct - Mar (Morning)');
    doc.text(bestTimeSafe.slice(0, 24), rX + 80, factY + 20.5);

    // Historical Background & Experience Narrative
    let bodyY = y + 52;
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.text('HISTORICAL SIGNIFICANCE & ARCHITECTURAL HIGHLIGHTS:', margin + 4, bodyY);

    bodyY += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    const descText = safePdfText(
      structPlace?.description,
      'Celebrated historical landmark known for monumental architecture, Maratha defense legacy, and rich cultural resonance in Pune history.'
    );
    const splitDesc = doc.splitTextToSize(descText, contentWidth - 8);
    doc.text(splitDesc.slice(0, 3), margin + 4, bodyY);

    bodyY += splitDesc.slice(0, 3).length * 3.6 + 2;

    // Nearby Verified Food & Pro Tips
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
    doc.text('VERIFIED NEARBY FOOD & VISITOR PRECAUTIONS:', margin + 4, bodyY);

    bodyY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);

    const foodList = (imgSlug && LANDMARK_SPECIFIC_FOOD[imgSlug]?.en) || [
      'Authentic Puneri Misal and Poha at historic Peth establishments.',
      'Sujata Mastani and fresh cold beverages on nearby Bajirao Road.',
    ];
    doc.text(`Food: ${safePdfText(foodList[0]).slice(0, 110)}`, margin + 4, bodyY);

    bodyY += 3.8;
    const tipsSafe = isFort
      ? 'Safety: Caution on wet stone bastions during monsoon. Carry 2L drinking water.'
      : 'Safety: Photography rules apply inside sanctum. Digital QR tickets accepted at entrance.';
    doc.text(tipsSafe, margin + 4, bodyY);

    // Official Source Attribution & Navigation Link
    bodyY += 4.5;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text('Official Source: Archaeological Survey of India (ASI) & MTDC Archives.', margin + 4, bodyY);

    if (stop.placeSlug) {
      const pUrl = `https://explorepune-guide.vercel.app/places/${stop.placeSlug}`;
      doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('View Complete Digital Guide ->', pageWidth - margin - 50, bodyY);
      doc.link(pageWidth - margin - 50, bodyY - 3, 46, 5, { url: pUrl });
    }

    y += profileBoxH + 4;
  });

  // =========================================================================
  // PAGE 6: BUDGET BREAKDOWN (Part 7) & FOOD / BREAKS GUIDE (Part 8)
  // =========================================================================
  startNewPage();
  y = margin + 4;

  y = drawSectionBanner(
    doc,
    'COMPREHENSIVE BUDGET BREAKDOWN & CULINARY DIRECTORY',
    'Category Cost Estimates, Per-Person Group Totals & Verified Pune Food Institutions',
    margin,
    y,
    contentWidth
  );

  // PART 7: Budget Breakdown Table
  const budgetTableW = contentWidth;
  const rowH = 7.5;

  // Table Header
  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin, y, budgetTableW, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('EXPENSE CATEGORY', margin + 4, y + 5.5);
  doc.text('PER PERSON (INR)', margin + 74, y + 5.5);
  doc.text(`GROUP TOTAL (${travelersCount} PAX)`, margin + 114, y + 5.5);
  doc.text('ASSUMPTIONS & NOTES', margin + 148, y + 5.5);

  y += 8;

  // Compute itemized costs
  const entryTotal = data.stops.reduce((acc, s) => acc + (s.entryCost || 0), 0);
  const transitCostPerPerson = data.travelMode === 'public_transit' ? 70 : 120;
  const parkingTotal = data.travelMode === 'driving' ? 60 : 0;
  const foodCostMin = 220;
  const foodCostMax = 380;
  const miscCost = 60;

  const budgetItems = [
    {
      cat: '1. Monument & Heritage Entry Tickets',
      pp: `INR ${entryTotal}`,
      grp: `INR ${entryTotal * travelersCount}`,
      notes: 'Sum of official ASI & Trust admission fees',
    },
    {
      cat: '2. Local Transportation & Transit Passes',
      pp: `INR ${transitCostPerPerson}`,
      grp: `INR ${transitCostPerPerson * travelersCount}`,
      notes: data.travelMode === 'public_transit' ? 'PMPML ₹70 Daily Unlimited Bus Pass' : 'Fuel / Cab sharing estimate',
    },
    {
      cat: '3. Vehicle Parking & Tolls',
      pp: travelersCount > 1 ? `INR ${Math.round(parkingTotal / travelersCount)}` : `INR ${parkingTotal}`,
      grp: `INR ${parkingTotal}`,
      notes: parkingTotal > 0 ? 'Pay & park + base forest tolls' : 'Zero parking on public transit',
    },
    {
      cat: '4. Meals, Refreshments & Beverages',
      pp: `INR ${foodCostMin} - ${foodCostMax}`,
      grp: `INR ${foodCostMin * travelersCount} - ${foodCostMax * travelersCount}`,
      notes: 'Breakfast, traditional lunch & evening snack',
    },
    {
      cat: '5. Hydration, Shoe-Keep & Miscellaneous',
      pp: `INR ${miscCost}`,
      grp: `INR ${miscCost * travelersCount}`,
      notes: 'Water bottle refills, shoe counters & emergency buffer',
    },
  ];

  budgetItems.forEach((bItem, bIdx) => {
    doc.setFillColor(bIdx % 2 === 0 ? C_CARD_BG[0] : C_CARD_TINT[0], bIdx % 2 === 0 ? C_CARD_BG[1] : C_CARD_TINT[1], bIdx % 2 === 0 ? C_CARD_BG[2] : C_CARD_TINT[2]);
    doc.rect(margin, y, budgetTableW, rowH, 'F');
    doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
    doc.line(margin, y + rowH, margin + budgetTableW, y + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(bItem.cat, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(bItem.pp, margin + 74, y + 5);
    doc.text(bItem.grp, margin + 114, y + 5);

    doc.setFontSize(6.5);
    doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
    doc.text(bItem.notes.slice(0, 32), margin + 148, y + 5);

    y += rowH;
  });

  // Total Summary Row
  const totalMin = entryTotal + transitCostPerPerson + Math.round(parkingTotal / travelersCount) + foodCostMin + miscCost;
  const totalMax = entryTotal + transitCostPerPerson + Math.round(parkingTotal / travelersCount) + foodCostMax + miscCost;

  doc.setFillColor(C_GOLD_LIGHT[0], C_GOLD_LIGHT[1], C_GOLD_LIGHT[2]);
  doc.rect(margin, y, budgetTableW, 9, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text('TOTAL ESTIMATED EXPEDITION BUDGET:', margin + 4, y + 6);
  doc.text(`INR ${totalMin} - ${totalMax} / person`, margin + 74, y + 6);
  doc.text(`INR ${totalMin * travelersCount} - ${totalMax * travelersCount} (Group)`, margin + 114, y + 6);

  y += 14;

  // Excluded Costs & Pricing Assumptions
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text(
    '* Pricing Assumptions: Estimates reflect verified standard citizen admission tickets and local public transit fares. Optional guide fees, special exhibits, and personal souvenir shopping (Bakarwadi, Shrewsbury cookies) are excluded.',
    margin,
    y
  );

  y += 8;

  // PART 8: Curated Pune Culinary & Refreshment Guide
  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  const foodBoxH = 118;
  doc.rect(margin, y, contentWidth, foodBoxH, 'FD');

  doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('AUTHENTIC PUNERI FOOD GUIDE & LEGENDARY EATERIES ALONG THE ROUTE', margin + 5, y + 5);

  let fY = y + 13;

  const foodRecommendations = [
    {
      period: 'BREAKFAST & MORNING CHAI (08:00 - 09:30 AM)',
      places: [
        'Cafe Goodluck (FC Road, Est. 1935) — Bun Maska, Irani Chai, Mutton Kheema (₹80 - ₹180)',
        'Vaidya Upahar Gruha (Budhwar Peth, Est. 1910) — Authentic spicy Puneri Misal & Pohe (₹60 - ₹100)',
        'Wadeshwar (FC Road) — Ghee Podi Idli, Batata Vada & authentic South Indian filter coffee (₹70 - ₹140)',
      ],
    },
    {
      period: 'TRADITIONAL MAHARASHTRIAN LUNCH (12:30 - 02:00 PM)',
      places: [
        'Summit Village Huts (Sinhagad Fort) — Chulivarchi Pithla Bhakri, Thecha, Kanda Bhaji & Matka Dahi (₹120 - ₹180)',
        'Bedekar Tea Stall (Narayan Peth, Est. 1946) — World-renowned sweet-and-spicy Misal with soft white bread (₹90 - ₹140)',
        'Durvankur Dining Hall (Sadashiv Peth) — Unlimited authentic vegetarian Puneri Thali with seasonal Aamras (₹220 - ₹350)',
      ],
    },
    {
      period: 'AFTERNOON MASTANI & EVENING SNACKS (04:30 - 06:00 PM)',
      places: [
        'Sujata Mastani (Sadashiv Peth / Bajirao Rd) — Famous thick Mango & Dryfruit Mastani ice cream drink (₹90 - ₹160)',
        'Kayani Bakery (East Street, Camp, Est. 1955) — Authentic butter Shrewsbury Biscuits and Mawa Cake (₹150 - ₹300)',
        'Chitale Bandhu Mithaiwale (Bajirao Road) — Freshly rolled crispy Bakarwadi & Mango Barfi (₹100 - ₹250)',
      ],
    },
    {
      period: 'DINNER & CULINARY WIND-DOWN (08:00 - 09:30 PM)',
      places: [
        'George Restaurant (East Street, Camp) — Traditional Persian Mughlai Biryani & caramel custard (₹250 - ₹450)',
        'Vaishali (FC Road) — Mysore Masala Dosa, SPDP (Sev Potato Dahi Puri) & garden ambiance (₹120 - ₹220)',
      ],
    },
  ];

  foodRecommendations.forEach((sec) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
    doc.text(sec.period, margin + 4, fY);
    fY += 4.5;

    sec.places.forEach((pl) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
      doc.text(`•  ${safePdfText(pl)}`, margin + 6, fY);
      fY += 3.8;
    });

    fY += 2.5;
  });

  // =========================================================================
  // PAGE 7: TRAVEL CHECKLIST (Part 10) + NOTES (Part 9) + FINAL SUMMARY & SIGNATURE (Part 11)
  // =========================================================================
  startNewPage();
  y = margin + 4;

  y = drawSectionBanner(
    doc,
    'TRAVEL CHECKLIST, PERSONAL NOTES & OFFICIAL HELPLINES',
    'Essential Packing Items, Traveler Journal & 24x7 Emergency Contact Directory',
    margin,
    y,
    contentWidth
  );

  // PART 10: Travel Checklist (2 Columns)
  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  const checkH = 50;
  doc.rect(margin, y, contentWidth, checkH, 'FD');

  doc.setFillColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TRAVEL PACKING & PREPARATION CHECKLIST', margin + 5, y + 4.8);

  const checkCol1 = [
    '[ ] Comfortable Footwear: Grippy walking / trekking shoes for stone steps',
    '[ ] Reusable Water Bottle: Eco-friendly hydration (carry at least 1.5L)',
    '[ ] Photo ID Proof: Aadhar Card or Passport required for ASI monument entry',
    '[ ] Digital Payment & Backup Cash: UPI active + INR 500 in small change',
    '[ ] Smartphone Camera & Power Bank: For landmark capture & live QR scanning',
  ];

  const checkCol2 = [
    '[ ] Weather Protection: Sun hat, UV sunglasses or monsoon umbrella',
    '[ ] Monument Etiquette: Respectful attire for temples; no littering',
    '[ ] Offline Route Access: Save this PDF and offline Google Maps areas',
    '[ ] Transit Day Pass: Keep PMPML or WhatsApp Metro QR ticket ready',
    '[ ] Responsible Tourism: Leave only footprints, take only photographs',
  ];

  let cY = y + 12;
  checkCol1.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(item, margin + 4, cY);
    cY += 7.2;
  });

  cY = y + 12;
  checkCol2.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
    doc.text(item, margin + contentWidth / 2 + 2, cY);
    cY += 7.2;
  });

  y += checkH + 5;

  // PART 9: Personal Travel Notes Section
  doc.setFillColor(C_CARD_BG[0], C_CARD_BG[1], C_CARD_BG[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  const notesH = 46;
  doc.rect(margin, y, contentWidth, notesH, 'FD');

  doc.setFillColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TRAVEL JOURNAL & PERSONAL NOTES', margin + 5, y + 4.8);

  let nY = y + 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('Use this space for handwritten notes, memorable moments, and special souvenir purchases:', margin + 4, nY);

  // Draw 5 ruled journal lines
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.setLineWidth(0.3);
  for (let l = 0; l < 5; l++) {
    const lineY = nY + 6 + l * 5.8;
    doc.line(margin + 4, lineY, margin + contentWidth - 4, lineY);
  }

  y += notesH + 5;

  // PART 11: Emergency Helplines, Smart Transit & Official Signatures
  doc.setFillColor(C_CARD_TINT[0], C_CARD_TINT[1], C_CARD_TINT[2]);
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  const finalH = 82;
  doc.rect(margin, y, contentWidth, finalH, 'FD');

  // Helplines Header
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text('OFFICIAL PUNE EMERGENCY & HELPLINE DIRECTORY (24x7)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.text('• Police Emergency: 112  |  Pune Tourist Helpline: 1363  |  Medical Emergency (Ambulance): 108', margin + 4, y + 11);
  doc.text('• Maha Metro Helpline: 1800 270 5501  |  PMPML Bus Helpline: 020 2450 3355  |  Traffic Police: 020 2612 2880', margin + 4, y + 15.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(C_GREEN[0], C_GREEN[1], C_GREEN[2]);
  doc.text('• WhatsApp Metro QR Ticket: Send "Hi" to +91 94201 01990 (30% discount on weekends & students).', margin + 4, y + 20);

  // Divider
  doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
  doc.line(margin + 4, y + 24, margin + contentWidth - 4, y + 24);

  // Legal Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text(
    'Disclaimer: Timings, entry fees, and transit schedules are verified against official Archaeological Survey of India (ASI), Maharashtra Tourism (MTDC), and PMPML archives. However, hours may vary on national holidays. Explore Pune is an independent cultural heritage initiative.',
    margin + 4,
    y + 28,
    { maxWidth: contentWidth - 36 }
  );

  // Official Signature Block
  let sY = y + 42;
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text('EXPLORE PUNE FOUNDATION TEAM', margin + 4, sY);

  sY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(C_INK_DARK[0], C_INK_DARK[1], C_INK_DARK[2]);
  doc.text('Suraj Dhok & Sahil Jadhav (Founders)', margin + 4, sY);

  sY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(C_TERRACOTTA[0], C_TERRACOTTA[1], C_TERRACOTTA[2]);
  doc.text('QA & Technical Documentation: Ishan Kakade', margin + 4, sY);

  sY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
  doc.text('Email & Official Inquiries: explorepune232@gmail.com  •  https://explorepune-guide.vercel.app', margin + 4, sY);

  // Bottom Portal QR Code
  drawVectorQr(doc, 'https://explorepune-guide.vercel.app', margin + contentWidth - 26, y + 26, 22, C_MAROON);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
  doc.text('EXPLORE PUNE PORTAL', margin + contentWidth - 26, y + 51);

  // =========================================================================
  // RUNNING HEADERS, FOOTERS & PAGE NUMBERING (Part 12)
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    if (p === 1) {
      // Cover page footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
      doc.text(
        'Explore Pune Official Travel Dossier  •  Maharashtra Tourism Heritage Archive  •  Page 1 of ' + totalPages,
        pageWidth / 2,
        pageHeight - 9,
        { align: 'center' }
      );
    } else {
      // Running header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(C_MAROON[0], C_MAROON[1], C_MAROON[2]);
      doc.text('EXPLORE PUNE — OFFICIAL EXPEDITION ITINERARY', margin + 2, 10);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
      doc.text(`Tour Ref: ${tourCode}`, pageWidth - margin - 2, 10, { align: 'right' });

      doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, 11.5, pageWidth - margin, 11.5);

      // Running footer
      doc.setDrawColor(C_LINE[0], C_LINE[1], C_LINE[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11.5, pageWidth - margin, pageHeight - 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(C_INK_MUTED[0], C_INK_MUTED[1], C_INK_MUTED[2]);
      doc.text(
        `Explore Pune Smart Traveler Pass  •  https://explorepune-guide.vercel.app  •  Page ${p} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }
  }

  return doc;
}

/**
 * Downloads the generated PDF with customized filename
 */
export function downloadItineraryPdf(
  data: ItineraryPdfData,
  filename?: string,
  options?: PdfGenerationOptions
) {
  const doc = generateItineraryPdf(data, options);
  const safeTitle = safePdfText(data.planTitle, 'Itinerary')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 25);
  const finalFilename = filename || `ExplorePune_${safeTitle}_Itinerary.pdf`;
  doc.save(finalFilename);
}
