import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function locateLogo() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const imgBuf = fs.readFileSync(path.resolve('scripts/frame_1.5.png'));
  const dataUrl = `data:image/png;base64,${imgBuf.toString('base64')}`;

  const bbox = await page.evaluate(async (dataUri) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = dataUri;
    await new Promise((r) => (img.onload = r));
    ctx.drawImage(img, 0, 0, 1280, 720);

    const imgData = ctx.getImageData(0, 0, 1280, 720);
    const data = imgData.data;

    let minX = 1280, maxX = 0, minY = 720, maxY = 0;
    let foundCount = 0;

    for (let y = 500; y < 700; y++) {
      for (let x = 1100; x < 1260; x++) {
        const idx = (y * 1280 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        // Star is a distinct light grey shape
        if (brightness > 140 && diff < 15) {
          foundCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;
    return {
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      foundCount,
      centerX,
      centerY,
      percentFromRight: ((1280 - centerX) / 1280 * 100).toFixed(2),
      percentFromBottom: ((720 - centerY) / 720 * 100).toFixed(2)
    };
  }, dataUrl);

  console.log('Gemini logo location:', JSON.stringify(bbox, null, 2));
  await browser.close();
}

locateLogo();
