import { chromium } from 'playwright';
import path from 'path';

const VIDEO_ASPECT = 16 / 9;
const NORM_X = 1160 / 1280; // 0.90625
const NORM_Y = 599.5 / 720; // 0.8326388888888889

function calculateBadge(w, h) {
  const screenAspect = w / h;
  let renderedWidth, renderedHeight, renderedLeft, renderedTop;

  if (screenAspect >= VIDEO_ASPECT) {
    renderedWidth = w;
    renderedHeight = w / VIDEO_ASPECT;
    renderedLeft = 0;
    renderedTop = (h - renderedHeight) / 2;
  } else {
    renderedHeight = h;
    renderedWidth = h * VIDEO_ASPECT;
    renderedLeft = (w - renderedWidth) / 2;
    renderedTop = 0;
  }

  const scale = renderedWidth / 1280;
  const centerX = renderedLeft + NORM_X * renderedWidth;
  const centerY = renderedTop + NORM_Y * renderedHeight;
  const badgeSize = Math.max(38, Math.round(52 * scale));

  const visible = centerX + badgeSize / 2 >= 0 &&
                  centerX - badgeSize / 2 <= w &&
                  centerY + badgeSize / 2 >= 0 &&
                  centerY - badgeSize / 2 <= h;

  return { centerX, centerY, badgeSize, visible };
}

async function testDynamicScale() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const viewports = [
    { name: '1280x720', width: 1280, height: 720 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '2560x1440', width: 2560, height: 1440 },
    { name: '1366x768', width: 1366, height: 768 }
  ];

  for (const vp of viewports) {
    const b = calculateBadge(vp.width, vp.height);
    console.log(`Viewport ${vp.name}: center=(${b.centerX.toFixed(1)}, ${b.centerY.toFixed(1)}), badgeSize=${b.badgeSize}px`);

    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0;overflow:hidden;background:#000;">
          <div style="position:relative;width:100vw;height:100vh;">
            <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline style="width:100%;height:100%;object-fit:cover;object-position:center;display:block;"></video>
            <div style="position:absolute;left:${b.centerX}px;top:${b.centerY}px;transform:translate(-50%,-50%);width:${b.badgeSize}px;height:${b.badgeSize}px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #065f46 0%, #022c22 100%);border:1.5px solid rgba(52,211,153,0.8);box-shadow:0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:center;z-index:100;">
              <img src="http://localhost:3000/images/logo.svg" alt="Explore Pune" style="width:100%;height:100%;border-radius:50%;display:block;" />
            </div>
          </div>
        </body>
      </html>
    `);

    await page.evaluate(async () => {
      const v = document.getElementById('v');
      v.currentTime = 1.5;
      return new Promise(r => { v.onseeked = () => r(); setTimeout(r, 400); });
    });

    const cropRadius = Math.round(b.badgeSize / 2 + 30);
    const clip = {
      x: Math.max(0, Math.round(b.centerX - cropRadius)),
      y: Math.max(0, Math.round(b.centerY - cropRadius)),
      width: cropRadius * 2,
      height: cropRadius * 2
    };

    await page.screenshot({ path: path.resolve(`scripts/test_dyn_${vp.name}_crop.png`), clip });
    await page.screenshot({ path: path.resolve(`scripts/test_dyn_${vp.name}_full.png`) });
    await page.close();
  }

  await browser.close();
}

testDynamicScale();
