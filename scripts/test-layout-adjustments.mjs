import { chromium } from 'playwright';

async function testLayout(fontSize, textY, taglineOffsetY) {
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
            font-size: ${fontSize}px;
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
              <g class="pune-jiretop-watermark" transform="translate(270, 75) scale(0.60)">
                <path d="M0 -38 C-6 -22, -8 -8, -3 6 C2 -4, 4 -18, 0 -38 Z" fill="#ea580c" fill-opacity="0.6" />
                <path d="M0 -18 C16 -12, 34 2, 42 22 C22 20, -22 20, -42 22 C-34 2, -16 -12, 0 -18 Z" fill="#065f46" fill-opacity="0.4" />
                <path d="M-40 22 Q0 26 40 22 Q42 28 40 32 Q0 36 -40 32 Z" fill="#d97706" fill-opacity="0.6" />
              </g>

              <!-- Main Pune Text -->
              <text x="270" y="${textY}" text-anchor="middle" fill="url(#puneTextGradient)" class="pune-main-calligraphy">
                पुणे
              </text>

              <!-- Tagline group -->
              <g class="pune-emotional-tagline" transform="translate(0, ${taglineOffsetY})">
                <path d="M140 292 L195 292 M345 292 L400 292" stroke="#ea580c" stroke-width="1.2" stroke-opacity="0.4" stroke-linecap="round" />
                <circle cx="201" cy="292" r="2.5" fill="#f97316" opacity="0.6" />
                <circle cx="339" cy="292" r="2.5" fill="#f97316" opacity="0.6" />
                <text x="270" y="296" text-anchor="middle" class="pune-motto-text">
                  पुण्यनगरी • सह्याद्री • संस्कृती
                </text>
                <text x="270" y="318" text-anchor="middle" class="pune-sub-tagline">
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
  await page.waitForTimeout(500);

  const bboxes = await page.evaluate(() => {
    const toBox = (el) => {
      if (!el) return null;
      const b = el.getBBox();
      return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height), bottom: Math.round(b.y + b.height) };
    };
    return {
      puneText: toBox(document.querySelector('.pune-main-calligraphy')),
      taglineGroup: toBox(document.querySelector('.pune-emotional-tagline')),
      map: toBox(document.querySelector('.pune-map-border'))
    };
  });

  const clearance = bboxes.taglineGroup.y - bboxes.puneText.bottom;
  const bottomMargin = bboxes.map.bottom - bboxes.taglineGroup.bottom;

  console.log(`Config: fontSize=${fontSize}, textY=${textY}, taglineOffset=${taglineOffsetY}`);
  console.log(`puneText top=${bboxes.puneText.y}, bottom=${bboxes.puneText.bottom}`);
  console.log(`taglineGroup top=${bboxes.taglineGroup.y}, bottom=${bboxes.taglineGroup.bottom}`);
  console.log(`Clearance between text and tagline: ${clearance}px (positive means no overlap)`);
  console.log(`Margin from map bottom: ${bottomMargin}px`);

  await page.screenshot({ path: `scripts/test_layout_${fontSize}_${textY}_${taglineOffsetY}.png` });
  await browser.close();
}

async function run() {
  await testLayout(120, 215, 20); // Test candidate 1
  await testLayout(125, 215, 24); // Test candidate 2
  await testLayout(130, 210, 26); // Test candidate 3
}

run().catch(console.error);
