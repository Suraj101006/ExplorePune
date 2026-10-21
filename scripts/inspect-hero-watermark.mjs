import { chromium } from 'playwright';

async function captureHero() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Set sessionStorage to skip intro video
  await page.addInitScript(() => {
    sessionStorage.setItem('explore_pune_intro_shown', 'true');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroContainer = await page.$('.hero-watermark-container');
  if (heroContainer) {
    await heroContainer.screenshot({ path: 'scripts/hero-watermark-live.png' });
    console.log('Saved scripts/hero-watermark-live.png');
  } else {
    console.log('hero-watermark-container not found');
  }

  const heroSection = await page.$('section');
  if (heroSection) {
    await heroSection.screenshot({ path: 'scripts/hero-section-live.png' });
    console.log('Saved scripts/hero-section-live.png');
  }

  await browser.close();
}

captureHero().catch(console.error);
