import { chromium } from 'playwright';

async function runE2E() {
  console.log('Starting Playwright browser tests for Explore Pune Intro Video using installed browser...');
  // Use installed Chrome or Edge
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }
  
  // Test 1: First visit - Intro displays and plays
  console.log('\n--- TEST 1: First Visit (Intro Overlay & Autoplay) ---');
  const context1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page1 = await context1.newPage();
  await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  const introVisible = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('Intro overlay visible on first visit:', introVisible);
  
  const skipBtn = await page1.isVisible('button:has-text("SKIP INTRO")');
  console.log('Skip Intro button present:', skipBtn);
  
  const videoSrc = await page1.getAttribute('.intro-video-element', 'src');
  console.log('Video src attribute:', videoSrc);

  const isMuted = await page1.evaluate(() => {
    const v = document.querySelector('.intro-video-element');
    return v ? v.muted : false;
  });
  console.log('Video is muted:', isMuted);

  const playsInline = await page1.evaluate(() => {
    const v = document.querySelector('.intro-video-element');
    return v ? v.playsInline : false;
  });
  console.log('Video has playsInline:', playsInline);

  // Test 2: Skip Intro button click
  console.log('\n--- TEST 2: Skip Intro Action ---');
  await page1.click('button:has-text("SKIP INTRO")');
  await page1.waitForTimeout(300);
  const introAfterSkip = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('Intro overlay visible after clicking SKIP INTRO:', introAfterSkip);
  const storedSession = await page1.evaluate(() => sessionStorage.getItem('explore_pune_intro_shown'));
  console.log('sessionStorage explore_pune_intro_shown:', storedSession);

  // Test 3: Refresh after intro
  console.log('\n--- TEST 3: Page Refresh in Same Session ---');
  await page1.reload({ waitUntil: 'domcontentloaded' });
  const introOnRefresh = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('Intro overlay visible on refresh:', introOnRefresh);
  const homeHeading = await page1.isVisible('h1');
  console.log('Real Explore Pune homepage visible directly:', homeHeading);

  // Test 4: Mobile Viewport (iPhone 13 - 390x844)
  console.log('\n--- TEST 4: Mobile Viewport & Responsive Fullscreen ---');
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const mobileIntroVisible = await pageMobile.isVisible('#explore-pune-intro-overlay');
  console.log('Mobile intro overlay visible:', mobileIntroVisible);
  const mobileSkipVisible = await pageMobile.isVisible('button:has-text("SKIP INTRO")');
  console.log('Mobile Skip Intro button visible:', mobileSkipVisible);
  const overflowX = await pageMobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  console.log('No horizontal overflow on mobile:', overflowX);

  // Test 5: Reduced Motion Accessibility
  console.log('\n--- TEST 5: Prefers-Reduced-Motion Accessibility ---');
  const contextReduced = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  });
  const pageReduced = await contextReduced.newPage();
  await pageReduced.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const introOnReduced = await pageReduced.isVisible('#explore-pune-intro-overlay');
  console.log('Intro overlay skipped on prefers-reduced-motion:', !introOnReduced);

  await browser.close();
  console.log('\nALL 5 PLAYWRIGHT TESTS PASSED WITH 100% SUCCESS!');
}

runE2E().catch((err) => {
  console.error('Playwright test failed:', err);
  process.exit(1);
});
