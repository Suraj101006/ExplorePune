import { chromium } from 'playwright';
import path from 'path';

async function testPuneMapHero() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Yantramanav:wght@700;900&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #f8fafc;
            font-family: sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
          }
          .hero-watermark-container {
            width: 520px;
            height: 420px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-watermark-svg {
            width: 100%;
            height: 100%;
            overflow: visible;
          }
          /* Continuous glowing orange border animation */
          @keyframes puneMapContinuousGlow {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.8)) drop-shadow(0 0 16px rgba(234, 88, 12, 0.45));
              stroke: #ea580c;
              stroke-width: 2.2px;
            }
            50% {
              filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.95)) drop-shadow(0 0 28px rgba(249, 115, 22, 0.7));
              stroke: #f97316;
              stroke-width: 2.8px;
            }
          }
          .pune-map-border {
            animation: puneMapContinuousGlow 3.6s ease-in-out infinite;
          }
          @keyframes puneMapFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .pune-map-group {
            animation: puneMapFloat 6s ease-in-out infinite;
            transform-origin: 270px 200px;
          }
          /* STRICTLY NO BORDER / NO STROKE ON PUNE TEXT */
          .pune-text-borderless {
            font-family: 'Yantramanav', sans-serif;
            font-size: 130px;
            font-weight: 900;
            letter-spacing: -1.5px;
            stroke: none !important;
            paint-order: fill;
          }
        </style>
      </head>
      <body>
        <div class="hero-watermark-container">
          <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-watermark-svg">
            <defs>
              <linearGradient id="puneMapOrangeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ea580c" stop-opacity="0.09" />
                <stop offset="50%" stop-color="#f97316" stop-opacity="0.05" />
                <stop offset="100%" stop-color="#d97706" stop-opacity="0.02" />
              </linearGradient>

              <linearGradient id="puneTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#065f46" stop-opacity="0.75" />
                <stop offset="50%" stop-color="#047857" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#c2410c" stop-opacity="0.8" />
              </linearGradient>

              <radialGradient id="puneMapAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f97316" stop-opacity="0.14" />
                <stop offset="60%" stop-color="#ea580c" stop-opacity="0.04" />
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
              </radialGradient>
            </defs>

            <g class="pune-map-group">
              <ellipse cx="270" cy="205" rx="190" ry="160" fill="url(#puneMapAura)" />

              <!-- Pune Geographical Map Outline in Orange with Continuous Glowing Border -->
              <path
                d="M230 42
                   C205 48, 175 72, 150 94
                   C130 114, 110 138, 98 172
                   C88 202, 85 235, 96 268
                   C108 300, 132 330, 160 354
                   C190 380, 228 395, 268 396
                   C308 397, 348 380, 384 356
                   C424 328, 460 298, 474 262
                   C486 230, 478 198, 452 168
                   C426 138, 388 108, 348 78
                   C308 48, 265 38, 230 42 Z"
                fill="url(#puneMapOrangeFill)"
                stroke="#ea580c"
                stroke-width="2.4"
                stroke-linejoin="round"
                stroke-linecap="round"
                class="pune-map-border"
              />

              <!-- Mula-Mutha River Flow across Pune Map -->
              <path
                d="M100 215 C160 205, 220 235, 280 220 C340 205, 410 240, 470 230"
                stroke="#f97316"
                stroke-width="1.2"
                stroke-opacity="0.28"
                stroke-dasharray="4 6"
                fill="none"
              />

              <!-- Sahyadri Western Ghats Crest Line hint on the west -->
              <path
                d="M140 100 Q115 180 120 280 Q140 330 180 360"
                stroke="#ea580c"
                stroke-width="1"
                stroke-opacity="0.2"
                stroke-dasharray="2 4"
                fill="none"
              />

              <!-- Devanagari text "पुणे" centered inside the map - STRICTLY NO BORDER -->
              <text
                x="270"
                y="215"
                text-anchor="middle"
                fill="url(#puneTextGradient)"
                class="pune-text-borderless"
              >पुणे</text>

              <!-- Subtle Tagline inside the map with proper clearance -->
              <text
                x="270"
                y="308"
                text-anchor="middle"
                fill="#c2410c"
                opacity="0.8"
                font-family="'Yantramanav', sans-serif"
                font-size="14"
                font-weight="700"
                letter-spacing="1.5"
              >पुण्यनगरी • सह्याद्री • संस्कृती</text>
            </g>
          </svg>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(600);
  const out = path.resolve('scripts/test_pune_map_hero_v2.png');
  await page.screenshot({ path: out });
  console.log('Saved to:', out);
  await browser.close();
}

testPuneMapHero();
