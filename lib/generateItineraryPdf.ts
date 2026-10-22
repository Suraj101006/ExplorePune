import { jsPDF } from 'jspdf';

export interface ItineraryPdfStop {
  index: number;
  name: string;
  nameMr?: string;
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
  stops: ItineraryPdfStop[];
  warnings?: string[];
  isMr?: boolean;
}

/**
 * Sanitizes strings for jsPDF helvetica core font (Latin-1 / ASCII safe).
 * Strips raw emojis or characters that would render as broken '???' in standard PDF readers.
 */
function safePdfText(str?: string | null, fallback = ''): string {
  if (!str) return fallback;
  // If text contains English + Marathi in parentheses, prioritize the English portion for crisp PDF rendering
  let text = str;
  if (/[\u0900-\u097F]/.test(text) && /[a-zA-Z]/.test(text)) {
    text = text.replace(/\([^)]*[\u0900-\u097F][^)]*\)/g, '').trim();
  }
  const cleaned = text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // emoji symbols
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // variation selectors
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')  // restrict to Latin-1 range
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

export function generateItineraryPdf(data: ItineraryPdfData): jsPDF {
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
  let y = 14;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // Header accent line on continuation pages
      doc.setFillColor(194, 65, 12);
      doc.rect(margin, y, contentWidth, 2, 'F');
      doc.setFillColor(217, 119, 6);
      doc.rect(margin, y + 2, contentWidth, 0.8, 'F');
      y += 8;
    }
  };

  // 1. TOP HEADER BANNER (Explore Pune Emerald & Amber)
  doc.setFillColor(6, 78, 59); // deep emerald #064e3b
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setFillColor(217, 119, 6); // amber accent line
  doc.rect(margin, y + 22, contentWidth, 1.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.text('EXPLORE PUNE -- OFFICIAL EXPEDITION TRAVEL PASS', margin + 7, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(254, 240, 138); // light amber text
  doc.text(
    'Heritage Citadels, Sahyadri Trails & PMPML / Metro Transit Guide | ExplorePune',
    margin + 7,
    y + 16
  );

  // Top-Right Verified Pass Pill
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin + contentWidth - 36, y + 6, 30, 8, 2, 2, 'F');
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('OFFICIAL PASS', margin + contentWidth - 21, y + 11.2, { align: 'center' });

  y += 30;

  // 2. PERSONALIZED TRAVELER DOSSIER & PROFILE BOX
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const tourCode = `EP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const profileName = safePdfText(data.userName) || 'Pune Explorer';
  const planTitleSafe = safePdfText(data.planTitle) || 'Custom Pune Expedition';
  const planThemeSafe = safePdfText(data.planTheme) || 'Heritage, culture, and nature circuit';

  checkPageBreak(28);
  const dossierHeight = 27;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, dossierHeight, 'FD');

  // Orange accent spine on left edge of dossier
  doc.setFillColor(194, 65, 12);
  doc.rect(margin, y, 3.5, dossierHeight, 'F');

  // Row 1: Traveler Profile Name & Tour ID
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TRAVELER PROFILE / EXPLORER', margin + 8, y + 6);
  doc.text('TOUR REFERENCE CODE', margin + 90, y + 6);
  doc.text('DATE ISSUED', margin + 145, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(profileName.slice(0, 32), margin + 8, y + 11.5);

  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(tourCode, margin + 90, y + 11.5);
  doc.text(dateStr, margin + 145, y + 11.5);

  // Row 2: Itinerary Plan Title & Theme
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SELECTED EXPEDITION PLAN', margin + 8, y + 17.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70);
  doc.text(planTitleSafe.slice(0, 45), margin + 8, y + 22.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const themeBrief = planThemeSafe.length > 55 ? planThemeSafe.slice(0, 54) + '...' : planThemeSafe;
  doc.text(`Theme: ${themeBrief}`, margin + 90, y + 22.5);

  y += dossierHeight + 5;

  // 3. TRIP OVERVIEW METRICS GRID (4-column card)
  checkPageBreak(24);
  const metricsHeight = 22;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, metricsHeight, 'FD');

  // Column headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('STARTING POINT', margin + 5, y + 6);
  doc.text('START TIME', margin + 56, y + 6);
  doc.text('TRANSIT MODE', margin + 94, y + 6);
  doc.text('TOTAL DURATION', margin + 142, y + 6);

  // Values row 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const startLoc = safePdfText(data.startLocationName, 'Pune Station');
  doc.text(startLoc.length > 22 ? startLoc.slice(0, 21) + '...' : startLoc, margin + 5, y + 11);
  doc.text(data.startTime || '08:30 AM', margin + 56, y + 11);

  const modeText =
    data.travelMode === 'public_transit'
      ? 'Metro + PMPML Bus'
      : safePdfText(data.travelMode, 'Public Transit');
  doc.text(modeText, margin + 94, y + 11);

  const durationHours = (data.totalDurationMinutes / 60).toFixed(1);
  doc.text(`~${durationHours} hrs (${data.totalDurationMinutes}m)`, margin + 142, y + 11);

  // Row 2 headers & values
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('EST. ENTRY EXPENSE', margin + 5, y + 16.5);
  doc.text('SAFETY BUFFER', margin + 56, y + 16.5);
  doc.text('DAILY BUS PASS', margin + 94, y + 16.5);
  doc.text('METRO QR TICKET', margin + 142, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text(`INR ${data.estimatedCost} / person`, margin + 5, y + 20.5);

  doc.setTextColor(6, 95, 70);
  doc.text(`${data.bufferMinutes || 0} mins`, margin + 56, y + 20.5);

  doc.setTextColor(15, 118, 110);
  doc.text('INR 70 (PMPML)', margin + 94, y + 20.5);

  doc.setTextColor(67, 56, 202);
  doc.text('WhatsApp Active', margin + 142, y + 20.5);

  y += metricsHeight + 6;

  // 4. DETAILED ITINERARY STOPS & PUBLIC TRANSIT CONNECTIONS
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(6, 95, 70);
  doc.text('SCHEDULED ITINERARY STOPS & PUBLIC TRANSIT CONNECTIONS', margin, y);

  doc.setDrawColor(253, 186, 116); // light orange divider
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  y += 6;

  data.stops.forEach((stop, idx) => {
    const transitSummarySafe = safePdfText(stop.transitSummary);
    const transitLines = transitSummarySafe
      ? doc.splitTextToSize(`Transit: ${transitSummarySafe}`, contentWidth - 22)
      : [];

    const stepLines: string[] = [];
    if (stop.transitStepByStep && stop.transitStepByStep.length > 0) {
      stop.transitStepByStep.slice(0, 2).forEach((step) => {
        const cleanStep = safePdfText(step.replace(/\*\*/g, ''));
        if (cleanStep) stepLines.push(cleanStep.slice(0, 105));
      });
    }

    const hasTransitBox = transitLines.length > 0 || stop.nearestMetro || stop.nearestBus || stepLines.length > 0;
    const transitBoxHeight = hasTransitBox
      ? 9 + transitLines.length * 3.5 + stepLines.length * 3.5 + (stop.nearestMetro || stop.nearestBus ? 4 : 0)
      : 0;

    const stopCardHeight = 17 + transitBoxHeight;

    checkPageBreak(stopCardHeight + 4);

    // Stop Card Background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, stopCardHeight, 'FD');

    // Number Badge Circle (Saffron Pin)
    doc.setFillColor(194, 65, 12);
    doc.circle(margin + 6, y + 6.5, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const numStr = String(idx + 1);
    doc.text(numStr, margin + (numStr.length > 1 ? 4.3 : 5.1), y + 8);

    // Place Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    const placeNameSafe = safePdfText(stop.name, `Expedition Stop #${idx + 1}`);
    doc.text(placeNameSafe, margin + 14, y + 7.5);

    // Schedule, Duration & Cost Strip
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    const timingStr =
      stop.arrivalTime && stop.departureTime
        ? `${stop.arrivalTime} - ${stop.departureTime}`
        : 'Flexible Timing';

    const costStr =
      stop.entryCost === null || stop.entryCost === undefined
        ? 'Entry: Free / Nominal'
        : stop.entryCost === 0
        ? 'Entry: Free Admission'
        : `Entry: INR ${stop.entryCost}`;

    doc.text(
      `Schedule: ${timingStr}  |  Stay: ${stop.visitMinutes}m  |  Travel: ${stop.travelMinutes}m  |  ${costStr}`,
      margin + 14,
      y + 12.5
    );

    // Transit details sub-container
    if (hasTransitBox) {
      let subY = y + 15.5;

      // Subtle light-green fill for transit block
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.rect(margin + 14, subY, contentWidth - 16, transitBoxHeight - 2, 'FD');

      subY += 4;

      if (transitLines.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(6, 95, 70);
        doc.text(transitLines, margin + 17, subY);
        subY += transitLines.length * 3.5;
      }

      if (stop.nearestMetro || stop.nearestBus) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 118, 110);
        const metroSafe = safePdfText(stop.nearestMetro);
        const busSafe = safePdfText(stop.nearestBus);
        const metroPart = metroSafe ? `Metro Station: ${metroSafe}` : '';
        const busPart = busSafe ? `PMPML Bus Stop: ${busSafe}` : '';
        const connectionStr = [metroPart, busPart].filter(Boolean).join('  |  ');
        doc.text(connectionStr, margin + 17, subY);
        subY += 4;
      }

      if (stepLines.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        stepLines.forEach((st) => {
          doc.text(`> ${st}`, margin + 17, subY);
          subY += 3.3;
        });
      }
    }

    y += stopCardHeight + 3.5;
  });

  // 5. PUBLIC TRANSIT SMART PASS TIPS & EMERGENCY HELPLINES
  checkPageBreak(24);
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.rect(margin, y, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text('PUNE PUBLIC TRANSIT SMART TIPS & EMERGENCY HELPLINE CONTACTS', margin + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text(
    '1. Pune Metro WhatsApp QR Ticket: Send "Hi" to +91 94201 01990 (30% discount on weekends & students).',
    margin + 5,
    y + 9.5
  );
  doc.text(
    '2. PMPML Bus Daily Pass: INR 70 (PMC + PCMC limits) | INR 150 (All routes & PMRDA network). Available on bus.',
    margin + 5,
    y + 13.5
  );
  doc.text(
    '3. Helplines: Police: 112 | Pune Tourist Helpline: 1363 | Maha Metro Helpline: 1800 270 5501 | Medical: 108',
    margin + 5,
    y + 17.5
  );

  y += 25;

  // 6. CLOSING SIGNATURE & WARM REGARDS (EXACTLY AS SPECIFIED BY USER)
  checkPageBreak(26);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Warm regards,', margin, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(6, 95, 70);
  doc.text('Suraj Dhok and Sahil Jadhav', margin, y);

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('ExplorePune Team', margin, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Sahyadri Trails, Heritage Citadels & Public Transit Portal | https://punetrail.web.app',
    margin,
    y
  );

  y += 3.5;
  doc.text('Email & Inquiries: explorepune232@gmail.com', margin, y);

  // 7. MULTI-PAGE NUMBERING FOOTERS
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Explore Pune Smart Traveler Pass  •  https://punetrail.web.app  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadItineraryPdf(data: ItineraryPdfData, filename?: string) {
  const doc = generateItineraryPdf(data);
  const safeTitle = safePdfText(data.planTitle, 'Itinerary')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 25);
  const finalFilename = filename || `ExplorePune_${safeTitle}.pdf`;
  doc.save(finalFilename);
}
