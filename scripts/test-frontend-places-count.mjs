import { chromium } from 'playwright';

async function testFrontend() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    sessionStorage.setItem('explore_pune_intro_shown', 'true');
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click "Show all places" / "सर्व ठिकाणे पहा" if button exists
  const showAllBtn = await page.$('button:has-text("Show All Places"), button:has-text("सर्व ठिकाणे पहा"), button:has-text("Show all")');
  if (showAllBtn) {
    console.log('Clicking "Show all places" button...');
    await showAllBtn.click();
    await page.waitForTimeout(800);
  }

  // Count place cards
  const cards = await page.$$('article, a[href^="/places/"]');
  console.log(`Found ${cards.length} place links/cards on homepage.`);

  // Test category filter
  console.log('Navigating to forts category /?cat=forts...');
  await page.goto('http://localhost:3000/?cat=forts', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const fortCards = await page.$$('a[href^="/places/"]');
  console.log(`Found ${fortCards.length} fort cards in forts category.`);

  // Test Marathi switch
  console.log('Testing Marathi switch on home...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const mrBtn = await page.$('button:has-text("मराठी")');
  if (mrBtn) {
    await mrBtn.click();
    await page.waitForTimeout(500);
    const bodyText = await page.innerText('body');
    const hasMarathi = bodyText.includes('सिंहगड') || bodyText.includes('शनिवार वाडा') || bodyText.includes('दगडूशेठ');
    console.log(`Marathi language switch works: ${hasMarathi}`);
  }

  await browser.close();
  console.log('Frontend verification complete!');
}

testFrontend().catch(console.error);
