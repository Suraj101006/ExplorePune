import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // Load an HTML page with the video element
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; width:100vw; height:100vh;">
        <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline style="width:100%; height:100%; object-fit:contain;"></video>
      </body>
    </html>
  `);

  const timestamps = [0.5, 1.5, 2.5, 3.0, 3.1, 3.4];
  for (const t of timestamps) {
    await page.evaluate(async (time) => {
      const v = document.getElementById('v');
      v.currentTime = time;
      return new Promise((resolve) => {
        v.onseeked = () => resolve();
        setTimeout(resolve, 500);
      });
    }, t);

    const outPath = path.resolve(`scripts/frame_${t.toFixed(1)}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot at ${t}s to ${outPath}`);
  }

  await browser.close();
}

capture().catch(console.error);
