import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function checkSparkleLeak() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const bufCovered = fs.readFileSync(path.resolve('scripts/test_cover_1280x720.png'));
  const bufOrig = fs.readFileSync(path.resolve('scripts/frame_1.5.png'));

  const result = await page.evaluate(async ({ covUri, origUri }) => {
    function loadImg(u) {
      return new Promise((r) => {
        const img = new Image();
        img.onload = () => r(img);
        img.src = u;
      });
    }

    const cImg = await loadImg(covUri);
    const oImg = await loadImg(origUri);

    const canvas = document.createElement('canvas');
    canvas.width = 1280; canvas.height = 720;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(oImg, 0, 0);
    const origData = ctx.getImageData(0, 0, 1280, 720).data;

    ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(cImg, 0, 0);
    const covData = ctx.getImageData(0, 0, 1280, 720).data;

    // The Gemini sparkle bounding box was [1137..1183], [576..623]
    // Any sparkle pixel that is UNCHANGED in covData would mean it leaked out!
    let unchangedSparklePixels = 0;
    let coveredSparklePixels = 0;

    for (let y = 576; y <= 623; y++) {
      for (let x = 1137; x <= 1183; x++) {
        const idx = (y * 1280 + x) * 4;
        const oR = origData[idx], oG = origData[idx+1], oB = origData[idx+2];
        const isSparkle = (oR + oG + oB)/3 > 85;

        if (isSparkle) {
          const cR = covData[idx], cG = covData[idx+1], cB = covData[idx+2];
          // If cov pixel is identical to orig pixel, the sparkle was not covered
          if (cR === oR && cG === oG && cB === oB) {
            unchangedSparklePixels++;
          } else {
            coveredSparklePixels++;
          }
        }
      }
    }

    return { unchangedSparklePixels, coveredSparklePixels, coveragePercent: (coveredSparklePixels / (coveredSparklePixels + unchangedSparklePixels)) * 100 };
  }, {
    covUri: `data:image/png;base64,${bufCovered.toString('base64')}`,
    origUri: `data:image/png;base64,${bufOrig.toString('base64')}`
  });

  console.log('Sparkle Coverage Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

checkSparkleLeak();
