import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verifyAllTimestamps() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const timestamps = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
  for (const t of timestamps) {
    const buf = fs.readFileSync(path.resolve(`scripts/gemini_logo_at_${t}s.png`));
    // Remember in scripts/inspect-gemini-timestamps.mjs, the crop was:
    // { x: 1080, y: 520, width: 160, height: 140 }
    // Watermark in frame was centerX: 1160, centerY: 599.5
    // In crop coordinates, centerX is 1160 - 1080 = 80, centerY is 599.5 - 520 = 79.5
    const center = await page.evaluate(async (uri) => {
      const img = new Image();
      img.src = uri;
      await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas');
      canvas.width = 160; canvas.height = 140;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, 160, 140).data;
      let minX = 160, maxX = 0, minY = 140, maxY = 0;
      let count = 0;
      for (let y = 0; y < 140; y++) {
        for (let x = 0; x < 160; x++) {
          const idx = (y * 160 + x) * 4;
          const b = (d[idx] + d[idx+1] + d[idx+2]) / 3;
          if (b > 85) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            count++;
          }
        }
      }
      return { minX: minX + 1080, maxX: maxX + 1080, minY: minY + 520, maxY: maxY + 520, count };
    }, `data:image/png;base64,${buf.toString('base64')}`);

    console.log(`Timestamp ${t}s watermark:`, center);
  }

  await browser.close();
}

verifyAllTimestamps();
