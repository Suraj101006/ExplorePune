import { jsPDF } from 'jspdf';

export interface CertificateData {
  explorerName: string;
  milestoneTitle: string;
  milestoneTitleMr?: string;
  milestoneBadge: string;
  milestoneDesc: string;
  dateUnlocked: string;
  isMr?: boolean;
}

export function generateCertificatePdf(data: CertificateData): jsPDF {
  const isMr = Boolean(data.isMr);
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Outer Border & Margins
  doc.setDrawColor(194, 65, 12); // Saffron / Clay
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.8);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner decorations
  doc.setFillColor(194, 65, 12);
  doc.rect(10, 10, 8, 8, 'F');
  doc.rect(pageWidth - 18, 10, 8, 8, 'F');
  doc.rect(10, pageHeight - 18, 8, 8, 'F');
  doc.rect(pageWidth - 18, pageHeight - 18, 8, 8, 'F');

  let y = 32;

  // Top Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(194, 65, 12);
  doc.text('EXPLORE PUNE — MAHARASHTRA TOURISM INITIATIVE', pageWidth / 2, y, { align: 'center' });

  y += 12;
  doc.setFontSize(24);
  doc.setTextColor(30, 41, 59);
  doc.text('CERTIFICATE OF EXPLORATION ACHIEVEMENT', pageWidth / 2, y, { align: 'center' });

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This official digital credential certifies authentic landmark expeditions across Pune & Sahyadri.',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  y += 14;
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('PROUDLY PRESENTED TO', pageWidth / 2, y, { align: 'center' });

  y += 13;
  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(194, 65, 12);
  doc.text(data.explorerName || 'Pune Explorer', pageWidth / 2, y, { align: 'center' });

  // Underline for name
  doc.setDrawColor(194, 65, 12);
  doc.setLineWidth(0.8);
  const nameWidth = doc.getTextWidth(data.explorerName || 'Pune Explorer');
  doc.line((pageWidth - nameWidth) / 2 - 8, y + 2, (pageWidth + nameWidth) / 2 + 8, y + 2);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('for successfully completing verified photo check-in expeditions and unlocking:', pageWidth / 2, y, { align: 'center' });

  y += 10;
  // Milestone Badge & Title Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(pageWidth / 2 - 90, y, 180, 22, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  doc.text(`${data.milestoneBadge} ${data.milestoneTitle}`, pageWidth / 2, y + 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(data.milestoneDesc, pageWidth / 2, y + 16, { align: 'center' });

  y += 38;

  // Signatures & Date
  const leftX = 40;
  const rightX = pageWidth - 40;

  // Left side: Date & Certificate ID
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('DATE OF CONQUEST:', leftX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dateUnlocked || new Date().toISOString().slice(0, 10), leftX, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('AUTHENTICATION:', leftX, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(6, 95, 70);
  doc.text('✓ Verified Landmark Photo Check-in', leftX, y + 20);

  // Right side: Official Regards Signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Warm regards,', rightX, y, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(194, 65, 12);
  doc.text('Suraj Dhok and Sahil Jadhav', rightX, y + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    isMr
      ? 'Explore Pune Team • अस्सल पुणे भ्रमंती व वारसा'
      : 'Explore Pune Team • Heritage & Culture Guide',
    rightX,
    y + 14,
    { align: 'right' }
  );

  return doc;
}

export function downloadCertificatePdf(data: CertificateData) {
  const doc = generateCertificatePdf(data);
  const safeName = data.milestoneTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  doc.save(`ExplorePune_Certificate_${safeName}.pdf`);
}
