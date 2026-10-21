import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function scan() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const imgBuf = fs.readFileSync(path.resolve('scripts/frame_1.5.png'));
  const dataUrl = `data:image/png;base64,${imgBuf.toString('base64')}`;

  const info = await page.evaluate(async (uri) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = uri;
    await new Promise((r) => (img.onload = r));
    ctx.drawImage(img, 0, 0, 1280, 720);

    const imgData = ctx.getImageData(0, 0, 1280, 720);
    const d = imgData.data;

    let brightest = { val: 0, x: 0, y: 0 };
    const candidates = [];

    // Scan lower right quadrant: x from 1000 to 1250, y from 500 to 690
    for (let y = 500; y < 690; y += 2) {
      for (let x = 1000; x < 1250; x += 2) {
        const idx = (y * 1280 + x) * 4;
        const b = (d[idx] + d[idx + 1] + d[idx + 2]) / 3;
        if (b > brightest.val) {
          brightest = { val: b, x, y, r: d[idx], g: d[idx + 1], b: d[idx + 2] };
        }
        if (b > 100) {
          candidates.push({ x, y, val: b, r: d[idx], g: d[idx + 1], b: d[idx + 2] });
        }
      }
    }
    return { brightest, totalAbove100: candidates.length, sampleCandidates: candidates.slice(0, 10) };
  }, dataUrl);

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

scan();
