import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function analyzeContent() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const times = [2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1];
  for (const t of times) {
    const file = path.resolve(`scripts/test_frame_${t}.png`);
    if (!fs.existsSync(file)) continue;
    const buf = fs.readFileSync(file);
    const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;

    const analysis = await page.evaluate(async (uri) => {
      const img = new Image();
      img.src = uri;
      await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas');
      canvas.width = 1280; canvas.height = 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, 1280, 720).data;

      // Check center of the screen (x: 400..880, y: 200..500)
      // The browser mock has lots of pure white or browser borders
      let lightPixels = 0;
      let total = 0;
      for (let y = 100; y < 600; y += 4) {
        for (let x = 200; x < 1080; x += 4) {
          total++;
          const idx = (y * 1280 + x) * 4;
          const r = d[idx], g = d[idx+1], b = d[idx+2];
          // Pure white / web background (r > 240, g > 240, b > 240)
          if (r > 240 && g > 240 && b > 240) {
            lightPixels++;
          }
        }
      }
      return { lightPixels, total, lightRatio: lightPixels / total };
    }, dataUrl);

    console.log(`Timestamp ${t}s: lightRatio = ${(analysis.lightRatio * 100).toFixed(2)}% (lightPixels: ${analysis.lightPixels})`);
  }
  await browser.close();
}

analyzeContent();
