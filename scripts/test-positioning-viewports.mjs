import { chromium } from 'playwright';
import path from 'path';

// Video aspect ratio
const VIDEO_ASPECT = 16 / 9;
// Normalized coordinates of Gemini logo center in 1280x720 frame:
const NORM_X = 1160 / 1280; // 0.90625
const NORM_Y = 599.5 / 720; // 0.8326388888888889

function calculateLogoPosition(width, height) {
  const screenAspect = width / height;
  let renderedWidth, renderedHeight, renderedLeft, renderedTop;

  if (screenAspect >= VIDEO_ASPECT) {
    // Screen is wider than 16:9 (crop top/bottom)
    renderedWidth = width;
    renderedHeight = width / VIDEO_ASPECT;
    renderedLeft = 0;
    renderedTop = (height - renderedHeight) / 2;
  } else {
    // Screen is taller than 16:9 (crop left/right)
    renderedHeight = height;
    renderedWidth = height * VIDEO_ASPECT;
    renderedLeft = (width - renderedWidth) / 2;
    renderedTop = 0;
  }

  const centerX = renderedLeft + NORM_X * renderedWidth;
  const centerY = renderedTop + NORM_Y * renderedHeight;

  // Check if center is within viewport (with a margin)
  const isVisible = centerX >= -50 && centerX <= width + 50 && centerY >= -50 && centerY <= height + 50;

  return {
    centerX,
    centerY,
    renderedWidth,
    renderedHeight,
    renderedLeft,
    renderedTop,
    isVisible
  };
}

async function testPositioning() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: '1280x720', width: 1280, height: 720 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '2560x1080_ultrawide', width: 2560, height: 1080 },
    { name: '768x1024_tablet', width: 768, height: 1024 },
    { name: '390x844_mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const pos = calculateLogoPosition(vp.width, vp.height);

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #000; width: 100vw; height: 100vh; overflow: hidden; }
            .container {
              position: relative;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            video {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              display: block;
            }
            .cover-badge {
              position: absolute;
              left: ${pos.centerX}px;
              top: ${pos.centerY}px;
              transform: translate(-50%, -50%);
              width: 52px;
              height: 52px;
              border-radius: 50%;
              background: rgba(6, 95, 70, 0.95);
              border: 2px solid #10b981;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
              display: ${pos.isVisible ? 'flex' : 'none'};
              align-items: center;
              justify-content: center;
              z-index: 100;
              pointer-events: none;
            }
            .cover-badge img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline></video>
            <div class="cover-badge">
              <img src="http://localhost:3000/images/logo.svg" alt="Explore Pune" />
            </div>
          </div>
        </body>
      </html>
    `);

    await page.evaluate(async () => {
      const v = document.getElementById('v');
      v.currentTime = 1.5;
      return new Promise((r) => {
        v.onseeked = () => r();
        setTimeout(r, 400);
      });
    });

    const outPath = path.resolve(`scripts/test_cover_${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Viewport ${vp.name}: visible=${pos.isVisible}, center=(${pos.centerX.toFixed(1)}, ${pos.centerY.toFixed(1)})`);
    await page.close();
  }

  await browser.close();
}

testPositioning();
