import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function check1920Coverage() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Render raw video frame at 1.5s on 1920x1080
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;background:#000;">
        <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline style="width:1920px;height:1080px;display:block;"></video>
      </body>
    </html>
  `);
  await page.evaluate(async () => {
    const v = document.getElementById('v');
    v.currentTime = 1.5;
    return new Promise(r => { v.onseeked = () => r(); setTimeout(r, 400); });
  });

  const rawPath = path.resolve('scripts/test_raw_1920.png');
  await page.screenshot({ path: rawPath });

  // Now compare raw 1920 frame with test_dyn_1920x1080_full.png
  const rawBuf = fs.readFileSync(rawPath);
  const coveredBuf = fs.readFileSync(path.resolve('scripts/test_dyn_1920x1080_full.png'));

  const result = await page.evaluate(async ({ rawUri, covUri }) => {
    function load(u) {
      return new Promise(r => {
        const img = new Image();
        img.onload = () => r(img);
        img.src = u;
      });
    }
    const rImg = await load(rawUri);
    const cImg = await load(covUri);

    const canvas = document.createElement('canvas');
    canvas.width = 1920; canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(rImg, 0, 0);
    const rData = ctx.getImageData(0, 0, 1920, 1080).data;

    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(cImg, 0, 0);
    const cData = ctx.getImageData(0, 0, 1920, 1080).data;

    // Watermark bounding box in 1920x1080 is:
    // minX = 1137 * 1.5 = 1705.5
    // maxX = 1183 * 1.5 = 1774.5
    // minY = 576 * 1.5 = 864
    // maxY = 623 * 1.5 = 934.5
    let uncov = 0, cov = 0;
    for (let y = 864; y <= 935; y++) {
      for (let x = 1705; x <= 1775; x++) {
        const idx = (y * 1920 + x) * 4;
        const b = (rData[idx] + rData[idx+1] + rData[idx+2]) / 3;
        if (b > 85) {
          if (rData[idx] === cData[idx] && rData[idx+1] === cData[idx+1] && rData[idx+2] === cData[idx+2]) {
            uncov++;
          } else {
            cov++;
          }
        }
      }
    }
    return { uncov, cov, percent: (cov / (cov + uncov)) * 100 };
  }, {
    rawUri: `data:image/png;base64,${rawBuf.toString('base64')}`,
    covUri: `data:image/png;base64,${coveredBuf.toString('base64')}`
  });

  console.log('1920x1080 Coverage Result:', result);
  await browser.close();
}

check1920Coverage();
