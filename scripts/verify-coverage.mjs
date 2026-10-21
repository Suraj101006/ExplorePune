import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verifyCoverage() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // Load test_cover_1280x720.png and check crop
  await page.goto('file:///' + path.resolve('scripts/test_cover_1280x720.png').replace(/\\/g, '/'));
  const clip = { x: 1160 - 40, y: 599.5 - 40, width: 80, height: 80 };
  await page.screenshot({ path: path.resolve('scripts/crop_verified_1280.png'), clip });

  // Load test_cover_1920x1080.png and check crop
  const page2 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page2.goto('file:///' + path.resolve('scripts/test_cover_1920x1080.png').replace(/\\/g, '/'));
  const clip2 = { x: 1740 - 50, y: 899.3 - 50, width: 100, height: 100 };
  await page2.screenshot({ path: path.resolve('scripts/crop_verified_1920.png'), clip2 });

  console.log('Crops generated successfully');
  await browser.close();
}

verifyCoverage();
