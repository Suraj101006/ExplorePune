import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Set sessionStorage to mark intro as already shown
  await page.addInitScript(() => {
    sessionStorage.setItem('explore_pune_intro_shown', 'true');
  });

  const outDir = 'public/navbar-test-shots';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(800);

  // Initial shot at top
  await page.screenshot({ path: path.join(outDir, 'navbar_at_top.jpg') });
  console.log('Captured top shot');

  // Scroll down 800px ("slide")
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const headerBox = await page.locator('.site-header').boundingBox();
  console.log('Header bounding box after 800px scroll:', headerBox);

  await page.screenshot({ path: path.join(outDir, 'navbar_after_scroll_800px.jpg') });
  console.log('Captured scrolled shot');

  if (!headerBox || headerBox.y !== 0) {
    throw new Error(`Expected header y to be 0 (sticky at top), but got ${headerBox?.y}`);
  }

  // Scroll further down 1800px
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const headerBox2 = await page.locator('.site-header').boundingBox();
  console.log('Header bounding box after 1800px scroll:', headerBox2);

  await page.screenshot({ path: path.join(outDir, 'navbar_after_scroll_1800px.jpg') });

  if (!headerBox2 || headerBox2.y !== 0) {
    throw new Error(`Expected header y to be 0 after 1800px scroll, but got ${headerBox2?.y}`);
  }

  await browser.close();
  console.log('Sticky navbar verification PASSED! Header stays fixed at top when sliding/scrolling!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
