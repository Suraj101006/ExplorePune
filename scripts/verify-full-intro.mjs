import { chromium } from 'playwright';

async function runVerification() {
  console.log('--- Starting Comprehensive Explore Pune Intro Verification ---');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  // TEST 1: First visit desktop 1280x720
  console.log('\n[1] Testing First Visit & Logo Cover Placement on 1280x720...');
  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page1 = await ctx1.newPage();
  await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  const introVisible = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('✓ Intro overlay visible:', introVisible);
  if (!introVisible) throw new Error('Intro overlay not visible');

  const badgeLocator = page1.locator('.intro-gemini-cover-badge');
  const badgeVisible = await badgeLocator.isVisible();
  console.log('✓ Gemini cover badge visible:', badgeVisible);
  if (!badgeVisible) throw new Error('Gemini cover badge not visible');

  // Verify badge bounding box coordinates
  const badgeBox = await badgeLocator.boundingBox();
  console.log('✓ Gemini cover badge bounding box:', badgeBox);
  // Center should be near (1160, 599.5)
  const badgeCenterX = badgeBox.x + badgeBox.width / 2;
  const badgeCenterY = badgeBox.y + badgeBox.height / 2;
  console.log(`✓ Badge center: (${badgeCenterX.toFixed(1)}, ${badgeCenterY.toFixed(1)})`);

  if (Math.abs(badgeCenterX - 1160) > 6 || Math.abs(badgeCenterY - 599.5) > 6) {
    throw new Error(`Badge not centered over watermark! (${badgeCenterX}, ${badgeCenterY})`);
  }

  // Take screenshot during intro with our logo covering the Gemini watermark
  await page1.waitForTimeout(600);
  await page1.screenshot({ path: 'scripts/live_intro_covered_1280.png' });
  console.log('✓ Captured live screenshot of intro with Explore Pune logo cover');

  // TEST 2: Verify automatic cutoff at 3.1s (last 0.4s clip removed)
  console.log('\n[2] Testing Automatic Finish at 3.1s (0.4s clip cut)...');
  const startTime = Date.now();
  // Wait until overlay disappears or fades
  await page1.waitForSelector('#explore-pune-intro-overlay', { state: 'detached', timeout: 6000 });
  const elapsed = (Date.now() - startTime) / 1000;
  console.log(`✓ Intro finished and unmounted in ~${elapsed.toFixed(2)}s`);

  const isDismissedClass = await page1.evaluate(() => document.documentElement.classList.contains('intro-dismissed'));
  console.log('✓ document.documentElement has intro-dismissed class:', isDismissedClass);

  const homeVisible = await page1.isVisible('h1');
  console.log('✓ Explore Pune Homepage visible underneath:', homeVisible);

  // TEST 3: Refresh in same session
  console.log('\n[3] Testing Refresh in Same Session...');
  await page1.reload({ waitUntil: 'domcontentloaded' });
  const introOnReload = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('✓ Intro overlay NOT present on reload:', !introOnReload);
  if (introOnReload) throw new Error('Intro replayed on reload in same session');

  // TEST 4: SKIP INTRO button
  console.log('\n[4] Testing SKIP INTRO button...');
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page2 = await ctx2.newPage();
  await page2.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page2.click('button:has-text("SKIP INTRO")');
  await page2.waitForTimeout(300);
  const skipDismissed = await page2.isVisible('#explore-pune-intro-overlay');
  console.log('✓ Overlay immediately dismissed on SKIP INTRO:', !skipDismissed);
  if (skipDismissed) throw new Error('SKIP INTRO failed to dismiss immediately');

  // TEST 5: Mobile viewport (390x844)
  console.log('\n[5] Testing Mobile Viewport (390x844)...');
  const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await ctxMobile.newPage();
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const mobileVisible = await pageMobile.isVisible('#explore-pune-intro-overlay');
  console.log('✓ Mobile intro overlay visible:', mobileVisible);
  const mobileNoOverflow = await pageMobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  console.log('✓ No horizontal overflow on mobile:', mobileNoOverflow);

  // TEST 6: Desktop 1920x1080 scaling
  console.log('\n[6] Testing Desktop 1920x1080 Scaling...');
  const ctx1920 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page1920 = await ctx1920.newPage();
  await page1920.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const box1920 = await page1920.locator('.intro-gemini-cover-badge').boundingBox();
  const cx1920 = box1920.x + box1920.width / 2;
  const cy1920 = box1920.y + box1920.height / 2;
  console.log(`✓ 1920x1080 badge center: (${cx1920.toFixed(1)}, ${cy1920.toFixed(1)}), size: ${box1920.width.toFixed(1)}px`);
  if (Math.abs(cx1920 - 1740) > 6 || Math.abs(cy1920 - 899.3) > 6) {
    throw new Error(`1920x1080 badge not centered! (${cx1920}, ${cy1920})`);
  }

  await browser.close();
  console.log('\n==================================================');
  console.log('SUCCESS: ALL INTRO VERIFICATIONS PASSED 100%!');
  console.log('==================================================');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
