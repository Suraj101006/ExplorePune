import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function captureAll() {
  const outDir = 'scripts/captures';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 800 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // 1. Hero
  console.log('1. Navigating to Hero...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '01_hero.png') });

  // 2. Curated Landmarks Cards
  console.log('2. Scrolling to cards...');
  await page.evaluate(() => window.scrollTo({ top: 480, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '02_cards.png') });

  // 3. Marathi view
  console.log('3. Switching to Marathi...');
  const mrBtn = page.locator('button:has-text("मराठी")').first();
  if (await mrBtn.count() > 0) {
    await mrBtn.click();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, '03_marathi_hero.png') });
  }

  // 4. Place Detail (Sinhagad Fort)
  console.log('4. Navigating to Sinhagad Fort place detail...');
  try {
    await page.goto('http://localhost:3000/places/sinhagad-fort', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '04_place_sinhagad.png') });
  } catch (e) {
    console.log('Place detail error:', e.message);
  }

  // 5. My Journey Planner
  console.log('5. Navigating to /my-journey...');
  await page.goto('http://localhost:3000/my-journey', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '05_my_journey.png') });

  await browser.close();
  console.log('All captures done!');
}

captureAll();
