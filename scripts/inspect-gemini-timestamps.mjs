import { chromium } from 'playwright';
import path from 'path';

async function inspectLogoOverTime() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;background:#000;">
        <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline style="width:1280px;height:720px;display:block;"></video>
      </body>
    </html>
  `);

  const timestamps = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
  for (const t of timestamps) {
    await page.evaluate(async (time) => {
      const v = document.getElementById('v');
      v.currentTime = time;
      return new Promise((r) => {
        v.onseeked = () => r();
        setTimeout(r, 400);
      });
    }, t);

    // Crop around bottom-right (x: 1080 to 1240, y: 520 to 660)
    const clip = { x: 1080, y: 520, width: 160, height: 140 };
    await page.screenshot({ path: path.resolve(`scripts/gemini_logo_at_${t}s.png`), clip });
    console.log(`Captured Gemini logo area at ${t}s`);
  }

  await browser.close();
}

inspectLogoOverTime();
