import { jsPDF } from 'jspdf';
import fs from 'fs';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

let y = 15;
const pageWidth = 210;
const margin = 14;
const contentWidth = pageWidth - margin * 2;

// Header Banner
doc.setFillColor(194, 65, 12); // #c2410c
doc.rect(margin, y, contentWidth, 24, 'F');

doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.text('EXPLORE PUNE — OFFICIAL ITINERARY GUIDE', margin + 8, y + 10);

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.text('Curated Tourism & Public Transit Guide | Pune, Maharashtra', margin + 8, y + 18);

y += 30;

// Plan Title & Theme
doc.setTextColor(30, 41, 59);
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.text('Plan 1: Classic Heritage & Peshwa History', margin, y);

y += 6;
doc.setTextColor(100, 116, 139);
doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.text('Iconic historical landmarks, ancient forts, and cultural wadas.', margin, y);

y += 10;

// Overview Box
doc.setFillColor(248, 250, 252);
doc.setDrawColor(226, 232, 240);
doc.rect(margin, y, contentWidth, 22, 'FD');

doc.setFontSize(9);
doc.setTextColor(71, 85, 105);
doc.text('STARTING POINT:', margin + 4, y + 6);
doc.text('TRAVEL MODE:', margin + 65, y + 6);
doc.text('TOTAL TIME:', margin + 125, y + 6);

doc.setFont('helvetica', 'bold');
doc.setTextColor(30, 41, 59);
doc.text('Shaniwar Wada (Old City)', margin + 4, y + 12);
doc.text('Public Transit (Metro & Bus)', margin + 65, y + 12);
doc.text('180 mins (3.0 hrs)', margin + 125, y + 12);

doc.setFont('helvetica', 'normal');
doc.setTextColor(71, 85, 105);
doc.text('ESTIMATED EXPENSE:', margin + 4, y + 18);
doc.text('BUFFER TIME:', margin + 65, y + 18);
doc.text('DATE GENERATED:', margin + 125, y + 18);

doc.setFont('helvetica', 'bold');
doc.setTextColor(194, 65, 12);
doc.text('INR 125 per person', margin + 4, y + 18);
doc.setTextColor(6, 95, 70);
doc.text('25 mins', margin + 65, y + 18);
doc.setTextColor(30, 41, 59);
doc.text('Today', margin + 125, y + 18);

y += 28;

// Stop Section
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(194, 65, 12);
doc.text('SCHEDULED ITINERARY STOPS', margin, y);

y += 6;

const mockStops = [
  {
    num: 1,
    name: 'Shaniwar Wada',
    time: '09:30 AM - 10:15 AM (45 mins)',
    travel: 'Starting Point',
    cost: 'INR 25',
    transit: 'Near Budhwar Peth / Mandai Metro (Purple Line). Buses: 2, 3, 9, 11 from Swargate & Station.',
  },
  {
    num: 2,
    name: 'Lal Mahal',
    time: '10:25 AM - 10:55 AM (30 mins)',
    travel: '10 mins walk / short transit',
    cost: 'Free Entry',
    transit: 'Opposite Shaniwar Wada. Walk 200m across Shivaji Road.',
  },
  {
    num: 3,
    name: 'Raja Dinkar Kelkar Museum',
    time: '11:10 AM - 12:10 PM (60 mins)',
    travel: '15 mins public transit',
    cost: 'INR 100',
    transit: 'Mandai Metro Station or Shanipar Bus Stop (Buses 9, 11, 24, 42).',
  },
];

for (const stop of mockStops) {
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 24, 'FD');

  // Stop Badge
  doc.setFillColor(194, 65, 12);
  doc.circle(margin + 6, y + 6, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(String(stop.num), margin + 4.8, y + 7.5);

  // Stop Name & Timing
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(stop.name, margin + 14, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(stop.time + ' | Entry: ' + stop.cost, margin + 14, y + 13);

  doc.setTextColor(6, 95, 70);
  doc.text('Transit: ' + stop.transit, margin + 14, y + 19);

  y += 28;
}

// Transit & Helplines Note
if (y > 230) {
  doc.addPage();
  y = 20;
}

doc.setFillColor(240, 253, 244); // light green
doc.setDrawColor(187, 247, 208);
doc.rect(margin, y, contentWidth, 18, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(6, 95, 70);
doc.text('PUNE PUBLIC TRANSIT & HELPLINE INTEL', margin + 4, y + 6);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(22, 101, 52);
doc.text('• Pune Metro WhatsApp QR Ticket: Text "Hi" to +91 94201 01990 (30% off weekends)', margin + 4, y + 11);
doc.text('• PMPML City Day Pass: INR 50 for unlimited city bus rides all day. Emergency: 112 | Tourism: 1363', margin + 4, y + 15);

y += 26;

// Regards Section exactly as requested
doc.setDrawColor(226, 232, 240);
doc.line(margin, y, margin + contentWidth, y);

y += 8;

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.setTextColor(71, 85, 105);
doc.text('Warm regards,', margin, y);

y += 6;
doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(30, 41, 59);
doc.text('Suraj Dhok and Sahil Jadhav', margin, y);

y += 5;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(100, 116, 139);
doc.text('Explore Pune Team | Heritage, Sahyadri & Culture Guide', margin, y);

const pdfBytes = doc.output();
fs.writeFileSync('C:/Users/Suraj/explore-pune/scripts/test-output.pdf', Buffer.from(pdfBytes, 'binary'));
console.log('PDF generated successfully! File size:', pdfBytes.length);
