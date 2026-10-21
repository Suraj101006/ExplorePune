import { chromium } from 'playwright';
import path from 'path';

async function testFrames() {
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

  const times = [2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1];
  for (const t of times) {
    await page.evaluate(async (tm) => {
      const v = document.getElementById('v');
      v.currentTime = tm;
      return new Promise((r) => {
        v.onseeked = () => r();
        setTimeout(r, 300);
      });
    }, t);
    const p = path.resolve(`scripts/test_frame_${t}.png`);
    await page.screenshot({ path: p });
    console.log(`Captured test frame at ${t}s -> ${p}`);
  }
  await browser.close();
}

testFrames();
