import { jsPDF } from 'jspdf';

export interface ItineraryPdfStop {
  index: number;
  name: string;
  nameMr?: string;
  arrivalTime?: string;
  departureTime?: string;
  visitMinutes: number;
  travelMinutes: number;
  entryCost: number | null;
  transitSummary?: string;
  transitStepByStep?: string[];
  nearestMetro?: string;
  nearestBus?: string;
  ticketInfo?: string;
}

export interface ItineraryPdfData {
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
      // Repeat small header line on new pages
      doc.setFillColor(194, 65, 12);
      doc.rect(margin, y, contentWidth, 2, 'F');
      y += 8;
    }
  };

  // 1. TOP HEADER BANNER
  doc.setFillColor(194, 65, 12); // saffron/clay #c2410c
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('EXPLORE PUNE — OFFICIAL ITINERARY GUIDE', margin + 8, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'Pune Heritage, Sahyadri Trails & Public Transit Portal | pune-trail.web.app',
    margin + 8,
    y + 16
  );

  y += 28;

  // 2. PLAN TITLE & THEME
  const displayTitle = data.planTitle;
  const displayTheme = data.planTheme;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${data.badge} ${displayTitle}`, margin, y);

  y += 6;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const themeLines = doc.splitTextToSize(displayTheme, contentWidth);
  doc.text(themeLines, margin, y);
  y += themeLines.length * 4.5 + 4;

  // 3. OVERVIEW METRICS BOX
  checkPageBreak(26);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('STARTING POINT', margin + 4, y + 6);
  doc.text('START TIME', margin + 58, y + 6);
  doc.text('TRAVEL MODE', margin + 98, y + 6);
  doc.text('TOTAL TIME', margin + 148, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const startLoc = data.startLocationName.length > 24 ? data.startLocationName.slice(0, 23) + '…' : data.startLocationName;
  doc.text(startLoc, margin + 4, y + 11);
  doc.text(data.startTime, margin + 58, y + 11);
  const modeText = data.travelMode === 'public_transit' ? 'Metro + PMPML Bus' : data.travelMode;
  doc.text(modeText, margin + 98, y + 11);
  doc.text(`${data.totalDurationMinutes} mins`, margin + 148, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('EST. ENTRY EXPENSE', margin + 4, y + 17);
  doc.text('BUFFER TIME', margin + 58, y + 17);
  doc.text('TRANSIT DAY PASS', margin + 98, y + 17);
  doc.text('DATE GENERATED', margin + 148, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(194, 65, 12);
  doc.text(`INR ${data.estimatedCost} / person`, margin + 4, y + 21);
  doc.setTextColor(6, 95, 70);
  doc.text(`${data.bufferMinutes} mins`, margin + 58, y + 21);
  doc.setTextColor(15, 118, 110);
  doc.text('INR 70 Day Pass', margin + 98, y + 21);
  doc.setTextColor(71, 85, 105);
  const todayStr = new Date().toISOString().split('T')[0];
  doc.text(todayStr, margin + 148, y + 21);

  y += 28;

  // 4. ITINERARY SCHEDULE & STOPS
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(194, 65, 12);
  doc.text('SCHEDULED ITINERARY STOPS & DETAILED TIMELINE', margin, y);
  y += 6;

  data.stops.forEach((stop, idx) => {
    // Estimate box height
    const transitLines = stop.transitSummary ? doc.splitTextToSize(stop.transitSummary, contentWidth - 20) : [];
    const stepLines = (stop.transitStepByStep || []).slice(0, 3);
    const boxHeight = 22 + transitLines.length * 3.5 + stepLines.length * 4;

    checkPageBreak(boxHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, boxHeight, 'FD');

    // Number Badge Circle
    doc.setFillColor(194, 65, 12);
    doc.circle(margin + 6, y + 6, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(String(idx + 1), margin + 4.9, y + 7.5);

    // Stop Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    const placeName = stop.name;
    doc.text(placeName, margin + 14, y + 7.5);

    // Timing & Cost bar
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const scheduleStr = stop.arrivalTime && stop.departureTime
      ? `${stop.arrivalTime} - ${stop.departureTime} • ${stop.visitMinutes} mins visit • ${stop.travelMinutes} mins travel`
      : `${stop.visitMinutes} mins visit • ${stop.travelMinutes} mins travel`;
    const costStr = stop.entryCost === null
      ? 'Entry: Nominal/Free'
      : stop.entryCost === 0
      ? 'Entry: Free Admission'
      : `Entry: INR ${stop.entryCost}`;
    doc.text(`${scheduleStr}  |  ${costStr}`, margin + 14, y + 13);

    // Transit details
    let currentY = y + 18;
    if (stop.transitSummary) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(6, 95, 70);
      doc.text('Transit Route: ', margin + 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(transitLines, margin + 35, currentY);
      currentY += transitLines.length * 3.8;
    }

    if (stop.nearestMetro || stop.nearestBus) {
      doc.setFontSize(7.5);
      doc.setTextColor(15, 118, 110);
      const metroPart = stop.nearestMetro ? `Metro: ${stop.nearestMetro}` : '';
      const busPart = stop.nearestBus ? `Bus: ${stop.nearestBus}` : '';
      const connectStr = [metroPart, busPart].filter(Boolean).join('  |  ');
      doc.text(connectStr, margin + 14, currentY);
      currentY += 4;
    }

    if (stepLines.length > 0) {
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      stepLines.forEach((st, _sIdx) => {
        const cleanSt = st.replace(/\*\*/g, '').slice(0, 110);
        doc.text(`• ${cleanSt}`, margin + 14, currentY);
        currentY += 3.8;
      });
    }

    y += boxHeight + 4;
  });

  // 5. PUBLIC TRANSIT SMART CARD & BOT INFO
  checkPageBreak(24);
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.rect(margin, y, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text('PUNE PUBLIC TRANSIT GUIDE & HELPLINE NUMBERS', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text(
    '• Pune Metro WhatsApp QR Ticket: Send "Hi" to +91 94201 01990 (30% discount on weekends & students).',
    margin + 4,
    y + 10.5
  );
  doc.text(
    '• PMPML Bus Daily Pass: INR 70 (PMC + PCMC limits) | INR 150 (All routes & PMRDA network).',
    margin + 4,
    y + 14.5
  );
  doc.text(
    '• Emergency Contacts: Police: 112 | Pune Tourist Helpline: 1363 | Maha Metro Helpline: 1800 270 5501',
    margin + 4,
    y + 18.5
  );

  y += 26;

  // 6. CLOSING SIGNATURE & REGARDS (EXACTLY AS REQUESTED)
  checkPageBreak(24);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(isMr ? 'Warm regards / सस्नेह नमस्कार,' : 'Warm regards,', margin, y);

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(194, 65, 12);
  doc.text('Suraj Dhok and Sahil Jadhav', margin, y);

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isMr
      ? 'Explore Pune Team | अस्सल पुणे भ्रमंती व डिजिटल मार्गदर्शक'
      : 'Explore Pune Team | Heritage, Sahyadri & Culture Tourism Portal',
    margin,
    y
  );

  return doc;
}

export function downloadItineraryPdf(data: ItineraryPdfData, filename?: string) {
  const doc = generateItineraryPdf(data);
  const safeTitle = data.planTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25);
  const finalFilename = filename || `ExplorePune_${safeTitle}.pdf`;
  doc.save(finalFilename);
}
