import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => sessionStorage.setItem('explore_pune_intro_shown', 'true'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const bboxes = await page.evaluate(() => {
    const puneText = document.querySelector('.pune-main-calligraphy');
    const motto = document.querySelector('.pune-motto-text');
    const subTagline = document.querySelector('.pune-sub-tagline');
    const taglineGroup = document.querySelector('.pune-emotional-tagline');
    const jiretop = document.querySelector('.pune-jiretop-watermark');
    const map = document.querySelector('.pune-map-border');
    const toBox = (el) => {
      if (!el) return null;
      const b = el.getBBox();
      return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height), bottom: Math.round(b.y + b.height) };
    };
    return {
      puneText: toBox(puneText),
      motto: toBox(motto),
      subTagline: toBox(subTagline),
      taglineGroup: toBox(taglineGroup),
      jiretop: toBox(jiretop),
      map: toBox(map),
    };
  });

  console.log('BBOXES:', JSON.stringify(bboxes, null, 2));
  await browser.close();
}

main().catch(console.error);
