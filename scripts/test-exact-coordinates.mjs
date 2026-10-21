import { chromium } from 'playwright';

async function testExactCoordinates() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Yantramanav:wght@700;900&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .hero-watermark-container {
            width: 540px;
            height: 420px;
            position: relative;
          }
          .hero-watermark-svg {
            width: 100%;
            height: 100%;
          }
          .pune-map-border {
            stroke: #ea580c;
            stroke-width: 2.4;
            filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8));
          }
          .pune-main-calligraphy {
            font-family: 'Yantramanav', sans-serif;
            font-size: 130px;
            font-weight: 900;
            letter-spacing: -1px;
            stroke: none !important;
          }
          .pune-motto-text {
            font-family: 'Yantramanav', sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.12em;
            fill: #065f46;
          }
          .pune-sub-tagline {
            font-family: 'Yantramanav', sans-serif;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            fill: #d97706;
          }
        </style>
      </head>
      <body>
        <div class="hero-watermark-container">
          <svg viewBox="0 0 540 420" fill="none" class="hero-watermark-svg">
            <defs>
              <linearGradient id="puneMapOrangeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ea580c" stop-opacity="0.08" />
                <stop offset="50%" stop-color="#f97316" stop-opacity="0.04" />
                <stop offset="100%" stop-color="#c2410c" stop-opacity="0.015" />
              </linearGradient>
              <linearGradient id="puneTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#065f46" stop-opacity="0.45" />
                <stop offset="50%" stop-color="#047857" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#c2410c" stop-opacity="0.4" />
              </linearGradient>
            </defs>

            <g class="pune-map-group">
              <path
                id="puneMap"
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
                class="pune-map-border"
              />

              <!-- Jiretop Crown watermark -->
              <g id="jiretop" class="pune-jiretop-watermark" transform="translate(270, 68) scale(0.60)">
                <path d="M0 -38 C-6 -22, -8 -8, -3 6 C2 -4, 4 -18, 0 -38 Z" fill="#ea580c" fill-opacity="0.6" />
                <path d="M0 -18 C16 -12, 34 2, 42 22 C22 20, -22 20, -42 22 C-34 2, -16 -12, 0 -18 Z" fill="#065f46" fill-opacity="0.4" />
                <path d="M-40 22 Q0 26 40 22 Q42 28 40 32 Q0 36 -40 32 Z" fill="#d97706" fill-opacity="0.6" />
              </g>

              <!-- Main Pune Text -->
              <text id="puneText" x="270" y="215" text-anchor="middle" fill="url(#puneTextGradient)" class="pune-main-calligraphy">
                पुणे
              </text>

              <!-- Tagline group with proper clearance -->
              <g id="taglineGroup" class="pune-emotional-tagline">
                <path d="M135 304 L190 304 M350 304 L405 304" stroke="#ea580c" stroke-width="1.2" stroke-opacity="0.4" stroke-linecap="round" />
                <circle cx="196" cy="304" r="2.5" fill="#f97316" opacity="0.6" />
                <circle cx="344" cy="304" r="2.5" fill="#f97316" opacity="0.6" />
                <text id="motto" x="270" y="308" text-anchor="middle" class="pune-motto-text">
                  पुण्यनगरी • सह्याद्री • संस्कृती
                </text>
                <text id="subTagline" x="270" y="332" text-anchor="middle" class="pune-sub-tagline">
                  आमचं पुणे, आमचा अभिमान
                </text>
              </g>
            </g>
          </svg>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(600);

  const rects = await page.evaluate(() => {
    const toR = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), height: Math.round(r.height) };
    };
    return {
      map: toR('puneMap'),
      jiretop: toR('jiretop'),
      puneText: toR('puneText'),
      taglineGroup: toR('taglineGroup'),
      motto: toR('motto'),
      subTagline: toR('subTagline')
    };
  });

  const clearance = rects.motto.top - rects.puneText.bottom;
  const bottomGap = rects.map.bottom - rects.subTagline.bottom;
  const crownGap = rects.puneText.top - rects.jiretop.bottom;

  console.log('MEASURED ON SCREEN (Client Rects):', JSON.stringify(rects, null, 2));
  console.log(`Gap above "पुणे" to crown: ${crownGap}px`);
  console.log(`CLEARANCE: Gap between bottom of "पुणे" and "पुण्यनगरी • सह्याद्री • संस्कृती": ${clearance}px`);
  console.log(`Margin from "आमचं पुणे, आमचा अभिमान" to bottom of map border: ${bottomGap}px`);

  await page.screenshot({ path: 'scripts/exact_coordinates_preview.png' });
  console.log('Saved preview to scripts/exact_coordinates_preview.png');
  await browser.close();
}

testExactCoordinates().catch(console.error);
