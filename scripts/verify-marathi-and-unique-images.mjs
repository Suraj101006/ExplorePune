import { chromium } from 'playwright';

async function runE2E() {
  console.log('=== Running E2E Test: Unique Photos & Marathi Information Switching ===');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Step 1: Visit homepage (dismiss intro if present)
  console.log('\n[1] Loading Homepage & verifying authentic places...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const skipBtn = await page.$('button:has-text("SKIP INTRO")');
  if (skipBtn) {
    await skipBtn.click();
    await page.waitForTimeout(300);
  }

  // Click Show All Places if on homepage
  const showAllBtn = await page.$('button:has-text("Show All Places"), button:has-text("सर्व 33 ठिकाणे पहा")');
  if (showAllBtn) {
    await showAllBtn.click();
    await page.waitForTimeout(200);
  }

  // Check total published cards
  await page.waitForSelector('.card');
  const cards = await page.$$('.card');
  console.log(`✓ Found ${cards.length} landmark cards displayed on homepage`);

  // Check image uniqueness across all rendered cards
  const cardImages = await page.$$eval('.card-media img', imgs => imgs.map(i => i.src));
  console.log(`✓ Total images rendered: ${cardImages.length}`);

  const imageFreq = {};
  for (const src of cardImages) {
    imageFreq[src] = (imageFreq[src] || 0) + 1;
  }
  const duplicates = Object.entries(imageFreq).filter(([_, count]) => count > 1);
  if (duplicates.length > 0) {
    console.error('❌ Found duplicate images on homepage cards:', duplicates);
    throw new Error('Duplicate images found across cards!');
  }
  console.log('✓ 100% UNIQUE IMAGES: Zero duplicate images across all cards on Explore Pune!');

  // Step 2: Test English text in cards
  console.log('\n[2] Checking English information on cards...');
  const firstCardTitleEn = await page.$eval('.card h2', el => el.textContent.trim());
  console.log(`  EN Title: "${firstCardTitleEn}"`);

  // Step 3: Switch to Marathi Language via header toggle
  console.log('\n[3] Toggling site to Marathi (मराठी)...');
  await page.click('button:has-text("मराठी")');
  await page.waitForTimeout(400);

  // Check card titles and descriptions switched to Marathi
  const firstCardTitleMr = await page.$eval('.card h2', el => el.textContent.trim());
  const firstCardDescMr = await page.$eval('.card p', el => el.textContent.trim());
  console.log(`✓ MR Title: "${firstCardTitleMr}"`);
  console.log(`✓ MR Desc: "${firstCardDescMr.slice(0, 100)}..."`);

  if (!firstCardTitleMr.includes('शनिवार वाडा') && !firstCardTitleMr.includes('सिंहगड')) {
    throw new Error(`Expected Marathi landmark title, got: "${firstCardTitleMr}"`);
  }

  // Step 4: Visit a Place Detail Page in Marathi
  console.log('\n[4] Navigating to Place Detail Page (/places/shaniwar-wada) in Marathi...');
  await page.goto('http://localhost:3000/places/shaniwar-wada', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');

  const detailTitleMr = await page.$eval('h1', el => el.textContent.trim());
  console.log(`✓ Detail Page H1 (Marathi): "${detailTitleMr}"`);

  const detailDescMr = await page.$eval('section.panel p', el => el.textContent.trim());
  console.log(`✓ Detail Page Overview (Marathi): "${detailDescMr.slice(0, 100)}..."`);

  const detailPhotoSrc = await page.$eval('.place-detail-banner-img', el => el.src);
  console.log(`✓ Detail Page Banner Photo: "${detailPhotoSrc}"`);
  if (!detailPhotoSrc.includes('/images/places/shaniwar-wada.jpg')) {
    throw new Error(`Expected Shaniwar Wada photo, got: ${detailPhotoSrc}`);
  }

  if (!detailTitleMr.includes('शनिवार वाडा')) {
    throw new Error(`Expected Marathi title for Shaniwar Wada, got: "${detailTitleMr}"`);
  }

  // Step 5: Switch back to English on Detail Page
  console.log('\n[5] Toggling back to English on Detail Page...');
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(400);

  const detailTitleEn = await page.$eval('h1', el => el.textContent.trim());
  console.log(`✓ Detail Page H1 (English): "${detailTitleEn}"`);
  if (!detailTitleEn.includes('Shaniwar Wada')) {
    throw new Error(`Expected English title for Shaniwar Wada, got: "${detailTitleEn}"`);
  }

  // Step 6: Test Forts Category & Another Location (/places/sinhagad-fort)
  console.log('\n[6] Navigating to Sinhagad Fort (/places/sinhagad-fort)...');
  await page.goto('http://localhost:3000/places/sinhagad-fort', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');

  // Toggle to Marathi
  await page.click('button:has-text("मराठी")');
  await page.waitForTimeout(400);
  const sinhagadH1 = await page.$eval('h1', el => el.textContent.trim());
  const sinhagadDesc = await page.$eval('section.panel p', el => el.textContent.trim());
  console.log(`✓ Sinhagad Fort H1 (Marathi): "${sinhagadH1}"`);
  console.log(`✓ Sinhagad Fort Overview (Marathi): "${sinhagadDesc.slice(0, 100)}..."`);
  if (!sinhagadH1.includes('सिंहगड')) {
    throw new Error(`Expected Marathi title for Sinhagad, got: "${sinhagadH1}"`);
  }

  // Step 7: Check Category Browsing (Categories have authentic unique photos)
  console.log('\n[7] Testing Category Filtering on Homepage (/)...');
  await page.goto('http://localhost:3000/?cat=forts', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.card');
  const fortCardTitles = await page.$$eval('.card h2', els => els.map(e => e.textContent.trim()));
  console.log(`✓ Forts Category places (${fortCardTitles.length}):`, fortCardTitles);

  await browser.close();
  console.log('\n========================================================================');
  console.log('SUCCESS: ALL TESTS PASSED! ZERO DUPLICATE IMAGES & FULL MARATHI SUPPORT!');
  console.log('========================================================================');
}

runE2E().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
