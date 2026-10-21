import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generatePowerPoint() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Suraj Dhok & Sahil Jadhav';
  pptx.company = 'Explore Pune (PuneTRAIL)';
  pptx.title = 'Explore Pune - Project Presentation';

  const PRIMARY = '065F46'; // Forest Green
  const ACCENT = 'D97706';  // Saffron / Amber
  const DARK = '0F172A';    // Slate Dark
  const LIGHT_BG = 'F8FAFC';// Off-white slate
  const WHITE = 'FFFFFF';
  const MUTED = '64748B';

  const slidesData = [
    {
      title: 'EXPLORE PUNE (पुण्यनगरी • सह्याद्री)',
      subtitle: 'Complete Cultural Heritage, Sahyadri Trails & Smart AI Tourism Platform',
      bullets: [
        'Interactive Pune Tourism Platform with 111+ Verified Landmarks',
        'AI Trip Planner with Live Transit & PMPML/Metro Fare Calculation',
        'Cinematic "My Journey" Travel Storybook with Animated Route Playback',
        'Milestones, Community Photo Gallery & Dual Feedback Notification Engine',
        '\nPresented by: Suraj Dhok & Sahil Jadhav'
      ]
    },
    {
      title: '1. Problem Statement & Opportunity',
      subtitle: 'Addressing fragmented tourism data & lack of intelligent travel guidance',
      bullets: [
        'Fragmented Information: Hours, entry fees, and transit options in Pune are scattered and often outdated.',
        'Sahyadri Heritage Awareness: Young travelers and trekkers need reliable historical context and safety guidance.',
        'Missing Personal Travel Diary: No platform preserves a visitor’s day-by-day exploration journey with interactive route maps.',
        'Opportunity: A unified, authentic, bilingual (English/Marathi) web platform designed specifically for Pune\'s cultural and geographical landscape.'
      ]
    },
    {
      title: '2. System Architecture & Tech Stack',
      subtitle: 'Modern, performant, and scalable full-stack web architecture',
      bullets: [
        'Frontend Framework: Next.js 16.4.2 (App Router with Turbopack) & React 19',
        'Styling & Responsiveness: Tailwind CSS v4 + custom responsive system (0 horizontal overflow)',
        'Backend & Cloud Database: Firebase Cloud Firestore + Firebase Admin SDK',
        'Authentication: Firebase Auth (Email/Password & Google Sign-In)',
        'Artificial Intelligence: Google Gemini API (@google/generative-ai) for itinerary planning & chatbot',
        'Maps & Graphics: MapLibre GL JS + Custom Hand-Crafted SVG Animated Route Engine',
        'Document & Presentation Export: jsPDF for verified itineraries and milestone certificates'
      ]
    },
    {
      title: '3. Key Features Overview',
      subtitle: 'End-to-end capabilities serving tourists, trekkers, and history enthusiasts',
      bullets: [
        'Explore Engine: 111+ published places across Forts, Heritage, Nature, Temples, and Museums.',
        'Real-time Operational Status: Dynamic Open/Closed indicators based on verified visiting hours.',
        'AI Trip Planner: 3 distinct plan options based on budget, travel pace, and start location.',
        'Integrated Public Transit: Live PMPML pass calculations (₹70 PMC/PCMC, ₹150 All-route) & Metro line info.',
        'My Journey Storybook: 3-level travel log (Today, Date-wise Timeline, and Overall Conquer Map).',
        'Community & Milestones: Badges for check-ins, public photo galleries, and printable certificates.'
      ]
    },
    {
      title: '4. "My Journey" Cinematic Travel Experience',
      subtitle: 'Transforming exploration into an interactive digital storybook',
      bullets: [
        'Level 1 — Today’s Journey: Live tracking of current day trips, stop completions, and remaining distance.',
        'Level 2 — Date-Wise History: Calendar & timeline browsing of past explorations (e.g., 14 June, 20 Oct).',
        'Level 3 — Overall Conquest: Combined exploration map of Pune with aggregate km traveled and places conquered.',
        'Animated Route Playback: Smooth Bezier SVG animated curves connecting Pune coordinates with ripple markers.',
        'Native Audio Pronunciation: Marathi native audio assistance for cultural landmarks.'
      ]
    },
    {
      title: '5. AI Trip Planner & Smart Transit Engine',
      subtitle: 'Grounded algorithmic & LLM intelligence for realistic day tours',
      bullets: [
        'Grounded Context: Gemini API receives authentic Firestore data—eliminating hallucinations.',
        'Multi-Modal Routing: Incorporates road travel, PMPML bus numbers, and Pune Metro Aqua/Purple lines.',
        'Cost Estimation: Accurate daily passes (₹70 local / ₹150 full-network) and monument entrance fees.',
        'Guided Tour Mode: Step-by-step navigation allowing real-time place check-ins on active trips.',
        'Exportable PDF: Generates branded PDF itineraries complete with timings, maps, and transit guidance.'
      ]
    },
    {
      title: '6. Gamification, Community & Feedback',
      subtitle: 'Engaging user retention and crowd-sourced verification',
      bullets: [
        'Milestone Badges: Puneri Explorer, Sahyadri Trekker, Peshwa Heritage, and Cultural Sentinel awards.',
        'Photo Verification: Upload visit proof with privacy control (Public community photo vs Private personal log).',
        'Dual-Notification Feedback: Submitting feedback saves to Firestore and triggers dual automated emails:',
        '  • User Confirmation: Personalized polite reply with PuneTRAIL branding.',
        '  • Admin Notification: Instant alert delivered to project leads (Suraj Dhok & Sahil Jadhav).'
      ]
    },
    {
      title: '7. Quality Assurance & Engineering Rigor',
      subtitle: 'Comprehensive audit results ensuring production readiness',
      bullets: [
        'TypeScript Strict Mode: 0 errors across 200+ source files.',
        'ESLint Standard: 0 warnings and 0 errors.',
        'Automated Test Suite: 23/23 tests passing with Vitest (Security, Planner, Journey, Distance math).',
        'Responsive Design: Verified 0 horizontal overflow across all screens (375px mobile to 1920px desktop).',
        'Hydration Stability: Clean SSR hydration with next/script and suppressHydrationWarning compliance.',
        'Safe LocalStorage: Corruption-resistant JSON parsing and array validation guards.'
      ]
    },
    {
      title: '8. Deployment & Hosting',
      subtitle: 'Live links and repository access',
      bullets: [
        'Firebase Hosting Site: https://punetrail.web.app',
        'Alternative Deployment: https://explore-pune.vercel.app (1-Click Vercel GitHub Integration)',
        'GitHub Source Repository: https://github.com/sj176644-maker/ExplorePune',
        'Local Production Server: http://localhost:3000',
        'Continuous Deployment: Auto-build triggers on git push to the main branch.'
      ]
    },
    {
      title: '9. Future Roadmap & Conclusion',
      subtitle: 'Next steps for Pune\'s premier digital tourism guide',
      bullets: [
        'Offline PWA & Sahyadri Topographic GPS: Offline caching for high-altitude fort treks with weak cellular signal.',
        'Augmented Reality (AR) Views: 3D architectural reconstructions of historic structures (Shaniwar Wada, Lal Mahal).',
        'Audio Guide Integration: GPS-triggered audio walking tours narrated in Marathi, English, and Hindi.',
        'Summary: Explore Pune is a fully functional, production-ready, highly localized digital ecosystem.',
        '\nThank You! Questions & Discussion.'
      ]
    }
  ];

  slidesData.forEach((s, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: idx === 0 ? DARK : LIGHT_BG };

    // Slide Header Bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.15,
      fill: { color: ACCENT }
    });

    if (idx === 0) {
      // Title Slide
      slide.addText(s.title, {
        x: 0.8,
        y: 1.8,
        w: 11.5,
        h: 1.2,
        fontSize: 34,
        fontFace: 'Arial',
        bold: true,
        color: ACCENT
      });

      slide.addText(s.subtitle, {
        x: 0.8,
        y: 3.1,
        w: 11.5,
        h: 0.8,
        fontSize: 20,
        fontFace: 'Arial',
        color: WHITE
      });

      slide.addText(s.bullets.join('\n• '), {
        x: 0.8,
        y: 4.2,
        w: 11.5,
        h: 2.2,
        fontSize: 15,
        fontFace: 'Arial',
        color: 'CBD5E1',
        lineSpacing: 26
      });
    } else {
      // Content Slides
      slide.addText(s.title, {
        x: 0.8,
        y: 0.6,
        w: 11.5,
        h: 0.7,
        fontSize: 24,
        fontFace: 'Arial',
        bold: true,
        color: PRIMARY
      });

      slide.addText(s.subtitle, {
        x: 0.8,
        y: 1.3,
        w: 11.5,
        h: 0.5,
        fontSize: 14,
        fontFace: 'Arial',
        italic: true,
        color: ACCENT
      });

      const bodyText = s.bullets.map(b => `• ${b}`).join('\n\n');
      slide.addText(bodyText, {
        x: 0.8,
        y: 2.0,
        w: 11.5,
        h: 4.6,
        fontSize: 15,
        fontFace: 'Arial',
        color: DARK,
        lineSpacing: 24
      });

      // Slide Footer
      slide.addText(`Explore Pune (PuneTRAIL) | Slide ${idx + 1} of ${slidesData.length}`, {
        x: 0.8,
        y: 6.9,
        w: 11.5,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        color: MUTED
      });
    }
  });

  const pptPath = path.resolve('public/Explore_Pune_Project_Presentation.pptx');
  await pptx.writeFile({ fileName: pptPath });
  console.log('✅ Generated PPTX at:', pptPath);
  return slidesData;
}

async function generatePdf(slidesData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [960, 540] // 16:9 aspect ratio
  });

  slidesData.forEach((s, idx) => {
    if (idx > 0) doc.addPage([960, 540], 'landscape');

    const isCover = idx === 0;

    // Background
    if (isCover) {
      doc.setFillColor(15, 23, 42); // Dark slate
      doc.rect(0, 0, 960, 540, 'F');
      doc.setFillColor(217, 119, 6); // Amber top strip
      doc.rect(0, 0, 960, 10, 'F');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(217, 119, 6);
      doc.text(s.title, 50, 160);

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(s.subtitle, 50, 205);

      // Bullets
      doc.setFontSize(13);
      doc.setTextColor(203, 213, 225);
      let y = 260;
      s.bullets.forEach((b) => {
        doc.text(`• ${b}`, 50, y);
        y += 24;
      });
    } else {
      doc.setFillColor(248, 250, 252); // Off white
      doc.rect(0, 0, 960, 540, 'F');
      doc.setFillColor(6, 95, 70); // Forest green top strip
      doc.rect(0, 0, 960, 10, 'F');

      // Slide Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(6, 95, 70);
      doc.text(s.title, 50, 65);

      // Subtitle
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(13);
      doc.setTextColor(217, 119, 6);
      doc.text(s.subtitle, 50, 95);

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.line(50, 110, 910, 110);

      // Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      let y = 145;
      s.bullets.forEach((b) => {
        const lines = doc.splitTextToSize(`• ${b}`, 850);
        lines.forEach((line) => {
          doc.text(line, 50, y);
          y += 22;
        });
        y += 6;
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Explore Pune (PuneTRAIL) | Project Presentation | Slide ${idx + 1} of ${slidesData.length}`, 50, 515);
    }
  });

  const pdfPath = path.resolve('public/Explore_Pune_Project_Presentation.pdf');
  doc.save(pdfPath);
  console.log('✅ Generated PDF at:', pdfPath);
}

async function run() {
  const slides = await generatePowerPoint();
  await generatePdf(slides);
  console.log('🎉 Both Presentation formats successfully created in public directory!');
}

run().catch(console.error);
