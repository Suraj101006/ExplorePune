import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline style="width:100%; height:100%; object-fit:contain;"></video>
      </body>
    </html>
  `);

  const times = [2.0, 2.1, 2.2, 2.3, 2.4, 2.5];
  for (const t of times) {
    await page.evaluate(async (time) => {
      const v = document.getElementById('v');
      v.currentTime = time;
      return new Promise((resolve) => {
        v.onseeked = () => resolve();
        setTimeout(resolve, 400);
      });
    }, t);
    await page.screenshot({ path: path.resolve(`scripts/frame_${t.toFixed(1)}.png`) });
    console.log(`Saved frame_${t.toFixed(1)}.png`);
  }
  await browser.close();
}

capture();
