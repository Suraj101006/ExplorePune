import { chromium } from 'playwright';
import fs from 'fs';

async function processImage() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

  const jpgBuffer = fs.readFileSync('C:/Users/Suraj/explore-pune/public/images/pune-map-hero.jpg');
  const base64Jpg = jpgBuffer.toString('base64');

  const result = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;

        // Make the surrounding white background transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const minVal = Math.min(r, g, b);
          const maxVal = Math.max(r, g, b);
          const diff = maxVal - minVal;

          // If it's near-white background
          if (r > 238 && g > 238 && b > 238 && diff < 15) {
            const avg = (r + g + b) / 3;
            if (avg >= 250) {
              data[i + 3] = 0;
            } else {
              const alpha = Math.round(((250 - avg) / 12) * 255);
              data[i + 3] = Math.max(0, Math.min(255, alpha));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve({
          width: img.width,
          height: img.height,
          pngDataUrl: canvas.toDataURL('image/png'),
        });
      };
      img.src = 'data:image/jpeg;base64,' + b64;
    });
  }, base64Jpg);

  console.log('Result:', result.width, result.height);

  const base64Data = result.pngDataUrl.replace(/^data:image\/png;base64,/, '');
  const outPath = 'C:/Users/Suraj/explore-pune/public/images/pune-map-hero.png';
  fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
  console.log('Successfully saved transparent PNG to:', outPath);

  await browser.close();
}

processImage().catch(console.error);
