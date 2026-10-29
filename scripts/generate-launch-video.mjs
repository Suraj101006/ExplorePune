import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';

async function generateLaunchVideo() {
  console.log('--- EXPLORE PUNE CINEMATIC LAUNCH VIDEO GENERATOR ---');

  // Verify necessary captures and assets exist
  const captures = [
    'scripts/captures/01_hero.png',
    'scripts/captures/02_cards.png',
    'scripts/captures/03_forts_filter.png',
    'scripts/captures/03_marathi_hero.png',
    'scripts/captures/04_modal_details.png',
    'scripts/captures/05_my_journey.png'
  ];

  for (const c of captures) {
    if (!fs.existsSync(c)) {
      throw new Error(`Missing capture: ${c}`);
    }
  }

  const bgmPath = 'public/audio/explore-pune-intro-bgm.wav';
  if (!fs.existsSync(bgmPath)) {
    throw new Error(`Missing audio: ${bgmPath}`);
  }

  // Read images and audio as base64 to inject into browser canvas
  console.log('Loading captures and audio into memory...');
  const assetData = {};
  for (const c of captures) {
    const key = path.basename(c);
    assetData[key] = `data:image/png;base64,${fs.readFileSync(c).toString('base64')}`;
  }

  // Also include iconic photo of Sinhagad and Shaniwar Wada
  if (fs.existsSync('public/images/places/sinhagad-fort.jpg')) {
    assetData['sinhagad.jpg'] = `data:image/jpeg;base64,${fs.readFileSync('public/images/places/sinhagad-fort.jpg').toString('base64')}`;
  }
  if (fs.existsSync('public/images/places/shaniwar-wada.jpg')) {
    assetData['shaniwar.jpg'] = `data:image/jpeg;base64,${fs.readFileSync('public/images/places/shaniwar-wada.jpg').toString('base64')}`;
  }

  const audioBase64 = `data:audio/wav;base64,${fs.readFileSync(bgmPath).toString('base64')}`;
  const muxerJs = fs.readFileSync('node_modules/mp4-muxer/build/mp4-muxer.js', 'utf8');

  // Start internal static server on 127.0.0.1 for SecureContext
  const server = http.createServer((req, res) => {
    if (req.url === '/mp4-muxer.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(muxerJs);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="/mp4-muxer.js"></script>
  <style>
    body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    canvas { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <div id="status" style="padding: 10px; font-family: monospace;">Ready for render</div>
  <canvas id="renderCanvas" width="720" height="1280"></canvas>
</body>
</html>`);
  });

  const PORT = 4579;
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Render server running at http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--enable-features=WebCodecs', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'load' });

  console.log('Rendering 600 frames (20 seconds @ 30fps) with WebCodecs VideoEncoder & AudioEncoder...');

  const startTime = Date.now();

  const base64Mp4 = await page.evaluate(async ({ assetData, audioBase64 }) => {
    const { Muxer, ArrayBufferTarget } = Mp4Muxer;
    const canvas = document.getElementById('renderCanvas');
    const ctx = canvas.getContext('2d');
    const statusEl = document.getElementById('status');

    const WIDTH = 720;
    const HEIGHT = 1280;
    const FPS = 30;
    const DURATION_SEC = 20;
    const TOTAL_FRAMES = FPS * DURATION_SEC; // 600 frames

    // Preload all images
    const images = {};
    for (const [key, src] of Object.entries(assetData)) {
      const img = new Image();
      img.src = src;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = () => {
          console.warn('Failed loading image:', key);
          res();
        };
      });
      images[key] = img;
    }

    // Decode Audio Data
    let audioBuffer = null;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
      const resp = await fetch(audioBase64);
      const ab = await resp.arrayBuffer();
      audioBuffer = await audioCtx.decodeAudioData(ab);
      console.log('Audio decoded successfully, duration:', audioBuffer.duration);
    } catch (e) {
      console.warn('Audio decoding failed:', e);
    }

    const target = new ArrayBufferTarget();
    const muxerOptions = {
      target,
      video: {
        codec: 'avc',
        width: WIDTH,
        height: HEIGHT,
        frameRate: FPS
      },
      fastStart: 'in-memory'
    };

    if (audioBuffer && typeof AudioEncoder !== 'undefined') {
      muxerOptions.audio = {
        codec: 'aac',
        numberOfChannels: Math.min(2, audioBuffer.numberOfChannels),
        sampleRate: 44100
      };
    }

    const muxer = new Muxer(muxerOptions);

    // Setup Video Encoder
    const videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error('VideoEncoder error:', e)
    });

    videoEncoder.configure({
      codec: 'avc1.42001f',
      width: WIDTH,
      height: HEIGHT,
      bitrate: 4_500_000, // 4.5 Mbps high bitrate for crisp video
      framerate: FPS
    });

    // Helper: draw rounded phone bezel with screen content
    function drawPhoneMockup(img, x, y, w, h, scrollY = 0, zoom = 1) {
      ctx.save();
      
      // Outer drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;

      // Phone titanium border
      const radius = 38;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x - 8, y - 8, w + 16, h + 16, radius + 4);
      ctx.fill();

      // Outer bezel trim
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Clip screen area
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.clip();

      // Draw screen background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, w, h);

      // Draw image inside phone screen with scroll / zoom
      if (img && img.width > 0) {
        const aspect = img.width / img.height;
        const drawW = w * zoom;
        const drawH = (w / aspect) * zoom;
        const offsetX = x + (w - drawW) / 2;
        const offsetY = y - scrollY;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      }

      // Top Dynamic Island / speaker notch
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.roundRect(x + (w - 110) / 2, y + 10, 110, 26, 13);
      ctx.fill();

      // Glass reflection diagonal overlay
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);

      ctx.restore();
    }

    // Helper: draw floating badge card
    function drawFeatureBadge(icon, title, subtitle, cx, cy, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;

      const cardW = 580;
      const cardH = 92;
      const x = cx - cardW / 2;
      const y = cy - cardH / 2;

      // Card gradient
      const bg = ctx.createLinearGradient(x, y, x + cardW, y + cardH);
      bg.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
      bg.addColorStop(1, 'rgba(30, 41, 59, 0.92)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 20);
      ctx.fill();

      // Golden orange accent border
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Icon circle
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
      ctx.beginPath();
      ctx.arc(x + 50, y + 46, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, x + 50, y + 47);

      // Title & Subtitle
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(title, x + 96, y + 40);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(subtitle, x + 96, y + 68);

      ctx.restore();
    }

    // Particle field for cinematic atmosphere
    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        r: Math.random() * 2.5 + 0.5,
        speedY: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    // Animation Loop
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const timeSec = f / FPS;
      statusEl.textContent = `Rendering frame ${f + 1} / ${TOTAL_FRAMES} (${Math.round((f / TOTAL_FRAMES) * 100)}%)`;

      // Background canvas fill: deep rich obsidian with saffron glow
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Radial saffron gradient glow
      const radialGlow = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 80, WIDTH / 2, HEIGHT / 2, 700);
      radialGlow.addColorStop(0, 'rgba(234, 88, 12, 0.16)');
      radialGlow.addColorStop(0.5, 'rgba(194, 65, 12, 0.08)');
      radialGlow.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Update & draw subtle floating golden particles
      ctx.fillStyle = '#f59e0b';
      for (const p of particles) {
        p.y -= p.speedY;
        if (p.y < 0) p.y = HEIGHT;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(f * 0.05 + p.x));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ==========================================
      // SCENE 1: CINEMATIC HOOK & TITLE (0.0s - 3.8s | Frames 0 - 114)
      // ==========================================
      if (f < 115) {
        const progress = f / 114;
        const fadeIn = Math.min(1, f / 25);
        const fadeOut = f > 90 ? (115 - f) / 25 : 1;
        const sceneAlpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = sceneAlpha;

        // Central Saffron Emblem Ring
        const ringScale = 1 + progress * 0.08;
        ctx.save();
        ctx.translate(WIDTH / 2, 420);
        ctx.scale(ringScale, ringScale);

        // Circular glow
        const emblemGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
        emblemGrad.addColorStop(0, 'rgba(234, 88, 12, 0.35)');
        emblemGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = emblemGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI * 2);
        ctx.fill();

        // Decorative outer circular dashed track
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, 95, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner solid badge
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.fill();

        // Shivaji Maharaj Saffron Crest Icon / Fortress Glyph
        ctx.fillStyle = '#ffffff';
        ctx.font = '54px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️', 0, 2);
        ctx.restore();

        // Marathi Headline
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fdba74';
        ctx.font = 'bold 36px "Nirmala UI", sans-serif';
        ctx.fillText('पुण्याची ऐतिहासिक सफर', WIDTH / 2, 600);

        // English Main Title
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('EXPLORE PUNE', WIDTH / 2, 665);

        // Subtitle badge
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('80+ Verified Landmarks • Hours • Transit', WIDTH / 2, 715);

        // Tech tag pill
        ctx.fillStyle = 'rgba(234, 88, 12, 0.15)';
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.5)';
        ctx.lineWidth = 1.5;
        const pillW = 340;
        const pillH = 46;
        ctx.beginPath();
        ctx.roundRect((WIDTH - pillW) / 2, 765, pillW, pillH, 23);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('✨ OFFICIAL 2026 EDITION', WIDTH / 2, 794);

        ctx.restore();
      }

      // ==========================================
      // SCENE 2: REAL HOMEPAGE & VERIFIED ADMISSION (3.8s - 8.0s | Frames 115 - 240)
      // ==========================================
      else if (f < 241) {
        const localF = f - 115;
        const totalF = 126;
        const progress = localF / totalF;
        const fadeIn = Math.min(1, localF / 15);
        const fadeOut = localF > (totalF - 15) ? (totalF - localF) / 15 : 1;
        const alpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Section header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('REAL PLATFORM PREVIEW', WIDTH / 2, 85);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('Interactive Heritage Explorer', WIDTH / 2, 125);

        // Phone mockup with real hero & cards screenshot
        // Phone dims: 420 x 820
        const phoneW = 440;
        const phoneH = 800;
        const phoneX = (WIDTH - phoneW) / 2;
        const phoneY = 160;

        // Smooth scroll effect from hero down through the destination cards
        const maxScroll = 400;
        const scrollY = progress < 0.3 ? 0 : (progress - 0.3) / 0.7 * maxScroll;
        const currentImg = progress > 0.5 ? images['02_cards.png'] : images['01_hero.png'];

        drawPhoneMockup(currentImg, phoneX, phoneY, phoneW, phoneH, scrollY, 1.0);

        // Floating feature badges
        const badge1Alpha = Math.min(1, Math.max(0, (progress - 0.2) * 4));
        drawFeatureBadge('🎟️', '100% Verified Entry Fees', '₹0 Free Entry & Timings Audited', WIDTH / 2, 1030, badge1Alpha);

        const badge2Alpha = Math.min(1, Math.max(0, (progress - 0.55) * 4));
        drawFeatureBadge('📍', 'Live Status & Route Timings', 'Sinhagad, Shaniwar Wada & 80+ Spots', WIDTH / 2, 1145, badge2Alpha);

        ctx.restore();
      }

      // ==========================================
      // SCENE 3: DEEP-DIVE MODAL & BILINGUAL MARATHI (8.0s - 12.5s | Frames 241 - 375)
      // ==========================================
      else if (f < 376) {
        const localF = f - 241;
        const totalF = 135;
        const progress = localF / totalF;
        const fadeIn = Math.min(1, localF / 15);
        const fadeOut = localF > (totalF - 15) ? (totalF - localF) / 15 : 1;
        const alpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Section header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('NATIVE LOCALIZATION & INTELLIGENCE', WIDTH / 2, 85);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('Sinhagad Fort • सिंहगड किल्ला', WIDTH / 2, 125);

        const phoneW = 440;
        const phoneH = 800;
        const phoneX = (WIDTH - phoneW) / 2;
        const phoneY = 160;

        // Show Marathi view initially, then transition to Modal details
        const activeImg = progress < 0.45 ? images['03_marathi_hero.png'] : images['04_modal_details.png'];
        const scrollY = progress < 0.45 ? (progress / 0.45) * 150 : ((progress - 0.45) / 0.55) * 220;

        drawPhoneMockup(activeImg, phoneX, phoneY, phoneW, phoneH, scrollY, 1.0);

        // Feature badges for Transit and Bilingual audio
        const badge1Alpha = Math.min(1, Math.max(0, (progress - 0.15) * 4));
        drawFeatureBadge('🗣️', 'Dual-Language Marathi & English', 'Authentic pronunciation & heritage context', WIDTH / 2, 1030, badge1Alpha);

        const badge2Alpha = Math.min(1, Math.max(0, (progress - 0.5) * 4));
        drawFeatureBadge('🚌', 'PMPML & Pune Metro Transit', 'Direct bus lines & Swargate connections', WIDTH / 2, 1145, badge2Alpha);

        ctx.restore();
      }

      // ==========================================
      // SCENE 4: SMART ITINERARY & REEL STUDIO (12.5s - 16.5s | Frames 376 - 495)
      // ==========================================
      else if (f < 496) {
        const localF = f - 376;
        const totalF = 120;
        const progress = localF / totalF;
        const fadeIn = Math.min(1, localF / 15);
        const fadeOut = localF > (totalF - 15) ? (totalF - localF) / 15 : 1;
        const alpha = fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('MY JOURNEY & REEL CREATOR', WIDTH / 2, 85);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('AI Travel Planner & Video Studio', WIDTH / 2, 125);

        const phoneW = 440;
        const phoneH = 800;
        const phoneX = (WIDTH - phoneW) / 2;
        const phoneY = 160;

        drawPhoneMockup(images['05_my_journey.png'], phoneX, phoneY, phoneW, phoneH, progress * 180, 1.0);

        // Feature Badges
        const badge1Alpha = Math.min(1, Math.max(0, (progress - 0.15) * 4));
        drawFeatureBadge('🎬', '1-Click Social Reel Export', 'Instant 9:16 video generation with audio', WIDTH / 2, 1030, badge1Alpha);

        const badge2Alpha = Math.min(1, Math.max(0, (progress - 0.5) * 4));
        drawFeatureBadge('🔒', 'Enterprise Zero-Trust Security', 'COOP, CORP & Strict CSP Hardened', WIDTH / 2, 1145, badge2Alpha);

        ctx.restore();
      }

      // ==========================================
      // SCENE 5: GRAND FINALE & CALL TO ACTION (16.5s - 20.0s | Frames 496 - 599)
      // ==========================================
      else {
        const localF = f - 496;
        const totalF = 104;
        const progress = localF / totalF;
        const fadeIn = Math.min(1, localF / 20);

        ctx.save();
        ctx.globalAlpha = fadeIn;

        // Background hero image with warm amber overlay
        if (images['sinhagad.jpg']) {
          ctx.save();
          ctx.globalAlpha = fadeIn * 0.22;
          const bgImg = images['sinhagad.jpg'];
          const scale = 1.0 + progress * 0.05;
          ctx.translate(WIDTH / 2, HEIGHT / 2);
          ctx.scale(scale, scale);
          ctx.drawImage(bgImg, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
          ctx.restore();
        }

        // Top Saffron Crest
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 20px sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillText('DISCOVER MAHARASHTRA’S CROWN', WIDTH / 2, 280);

        // Main Title
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 58px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('EXPLORE PUNE', WIDTH / 2, 350);

        // Marathi Tagline
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 32px "Nirmala UI", sans-serif';
        ctx.fillText('पुण्याची खरी ओळख, एकाच क्लिकवर!', WIDTH / 2, 405);

        // Core value grid
        const gridItems = [
          { icon: '🏰', label: '80+ Verified Spots' },
          { icon: '₹0', label: '100% Free Access' },
          { icon: '🚌', label: 'PMPML Transit' },
          { icon: '⚡', label: 'Sub-Second Speed' }
        ];

        const gridStartY = 480;
        for (let i = 0; i < 4; i++) {
          const gx = (i % 2 === 0) ? WIDTH / 2 - 150 : WIDTH / 2 + 150;
          const gy = gridStartY + Math.floor(i / 2) * 110;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(gx - 130, gy - 40, 260, 80, 16);
          ctx.fill();
          ctx.stroke();

          ctx.font = '26px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(gridItems[i].icon, gx - 80, gy);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(gridItems[i].label, gx - 50, gy);
        }

        // Launch Call to Action Pill
        const ctaY = 780;
        const pulse = 1 + 0.02 * Math.sin(f * 0.15);
        ctx.save();
        ctx.translate(WIDTH / 2, ctaY);
        ctx.scale(pulse, pulse);

        ctx.shadowColor = 'rgba(234, 88, 12, 0.6)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 6;

        const ctaGrad = ctx.createLinearGradient(-260, -35, 260, 35);
        ctaGrad.addColorStop(0, '#ea580c');
        ctaGrad.addColorStop(1, '#c2410c');
        ctx.fillStyle = ctaGrad;
        ctx.beginPath();
        ctx.roundRect(-260, -35, 520, 70, 35);
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Start Exploring Now ➔', 0, 0);
        ctx.restore();

        // Website URL Card
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('explore-pune-eosin.vercel.app', WIDTH / 2, 900);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText('Open Source • Production Ready • Free for Everyone', WIDTH / 2, 940);

        ctx.restore();
      }

      // Encode VideoFrame into VideoEncoder
      const videoFrame = new VideoFrame(canvas, {
        timestamp: (f * 1_000_000) / FPS, // microseconds
        duration: 1_000_000 / FPS
      });
      videoEncoder.encode(videoFrame, { keyFrame: f % 30 === 0 });
      videoFrame.close();
    }

    statusEl.textContent = 'Flushing video encoder...';
    await videoEncoder.flush();
    videoEncoder.close();

    // Encode Audio if available
    if (audioBuffer && typeof AudioEncoder !== 'undefined') {
      statusEl.textContent = 'Encoding synchronized soundtrack...';
      const audioEncoder = new AudioEncoder({
        output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
        error: (e) => console.error('AudioEncoder error:', e)
      });

      const numChannels = Math.min(2, audioBuffer.numberOfChannels);
      audioEncoder.configure({
        codec: 'mp4a.40.2',
        numberOfChannels: numChannels,
        sampleRate: 44100,
        bitrate: 128_000
      });

      const left = audioBuffer.getChannelData(0);
      const right = numChannels > 1 ? audioBuffer.getChannelData(1) : left;
      const targetDurationSamples = Math.floor(DURATION_SEC * 44100);
      const chunkSize = 2048;

      for (let offset = 0; offset < targetDurationSamples; offset += chunkSize) {
        const frameCount = Math.min(chunkSize, targetDurationSamples - offset);
        const planar = new Float32Array(frameCount * numChannels);

        // Copy left channel
        for (let i = 0; i < frameCount; i++) {
          const sampleIdx = (offset + i) % left.length; // loop if shorter
          planar[i] = left[sampleIdx];
        }

        // Copy right channel
        if (numChannels > 1) {
          for (let i = 0; i < frameCount; i++) {
            const sampleIdx = (offset + i) % right.length;
            planar[frameCount + i] = right[sampleIdx];
          }
        }

        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate: 44100,
          numberOfFrames: frameCount,
          numberOfChannels: numChannels,
          timestamp: Math.round((offset / 44100) * 1_000_000),
          data: planar
        });

        audioEncoder.encode(audioData);
        audioData.close();
      }

      await audioEncoder.flush();
      audioEncoder.close();
    }

    statusEl.textContent = 'Finalizing MP4 muxing...';
    muxer.finalize();

    statusEl.textContent = 'Converting buffer to Base64...';
    const buffer = target.buffer;
    const uint8 = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }, { assetData, audioBase64 });

  console.log('Rendering finished in', ((Date.now() - startTime) / 1000).toFixed(1), 'seconds!');

  const videoBuffer = Buffer.from(base64Mp4, 'base64');
  const outPath = 'public/videos/explore-pune-launch.mp4';
  fs.writeFileSync(outPath, videoBuffer);
  console.log(`SUCCESS! Saved cinematic launch video to: ${outPath} (${(videoBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

  // Also save a copy to artifacts directory if available
  const artifactPath = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/explore-pune-launch.mp4';
  try {
    fs.writeFileSync(artifactPath, videoBuffer);
    console.log(`Saved artifact copy to: ${artifactPath}`);
  } catch (e) {
    console.warn('Artifact write notice:', e.message);
  }

  await browser.close();
  server.close();
}

generateLaunchVideo().catch(err => {
  console.error('Fatal error in video generation:', err);
  process.exit(1);
});
