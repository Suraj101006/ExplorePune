import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function analyzeBoundingBox() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const buf = fs.readFileSync(path.resolve('scripts/frame_1.5.png'));
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;

  const bbox = await page.evaluate(async (uri) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = uri;
    await new Promise((r) => (img.onload = r));
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, 1280, 720);
    const d = imgData.data;

    let minX = 1280, maxX = 0, minY = 720, maxY = 0;
    let count = 0;

    // Search around known center (1158, 584) radius 60
    for (let y = 584 - 60; y <= 584 + 60; y++) {
      for (let x = 1158 - 60; x <= 1158 + 60; x++) {
        const idx = (y * 1280 + x) * 4;
        const r = d[idx], g = d[idx + 1], b = d[idx + 2];
        const brightness = (r + g + b) / 3;
        // Background mountain/scenery in that area is darker (< 70)
        // Gemini star is translucent white/grey (brightness > 90)
        if (brightness > 85) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          count++;
        }
      }
    }

    return {
      minX, maxX, width: maxX - minX,
      minY, maxY, height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      pixelCount: count
    };
  }, dataUrl);

  console.log('Gemini logo exact bounding box in 1280x720 frame:');
  console.log(JSON.stringify(bbox, null, 2));

  await browser.close();
}

analyzeBoundingBox();
