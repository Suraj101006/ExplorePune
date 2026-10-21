import { chromium } from 'playwright';

async function testAll() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  console.log('Testing Home Page & Live Features...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Skip intro if visible
  const skipBtn = await page.$('.intro-skip-btn');
  if (skipBtn) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }

  // 2. Weather Widget
  const weatherBadge = await page.$('.weather-widget-badge');
  console.log('Weather Widget present:', weatherBadge !== null);
  if (weatherBadge) {
    console.log('Weather Text:', (await weatherBadge.textContent()).trim());
  }

  // 3. Emergency Helplines Button & Modal
  const helplineBtn = await page.$('button:has-text("Helplines"), button:has-text("मदत")');
  console.log('Helpline trigger button present:', helplineBtn !== null);
  if (helplineBtn) {
    await helplineBtn.click();
    await page.waitForTimeout(400);
    const modalTitle = await page.$('h2:has-text("Pune Tourist & Emergency Helplines"), h2:has-text("पुणे पर्यटक")');
    console.log('Helpline Modal opened:', modalTitle !== null);
    // Close modal
    const closeBtn = await page.$('div[role="dialog"] button:has-text("✕")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 4. Saved Places & Wishlist Action
  const saveHeartBtn = await page.$('.card .card-action-btn:has-text("🤍"), .card .card-action-btn:has-text("❤️")');
  console.log('Card Heart action button present:', saveHeartBtn !== null);
  if (saveHeartBtn) {
    await saveHeartBtn.click();
    await page.waitForTimeout(300);
    const headerSavedBtn = await page.$('button:has-text("Saved"), button:has-text("जतन केलेली")');
    console.log('Header Saved button text after clicking heart:', await headerSavedBtn.textContent());

    // Open Saved Drawer
    await headerSavedBtn.click();
    await page.waitForTimeout(400);
    const drawerTitle = await page.$('h3:has-text("Saved Places"), h3:has-text("आवडती ठिकाणे")');
    console.log('Saved Places Drawer opened:', drawerTitle !== null);
    const drawerClose = await page.$('div[role="dialog"] button:has-text("✕")');
    if (drawerClose) await drawerClose.click();
    await page.waitForTimeout(300);
  }

  // 5. Card Alignment & Operating Hours Status
  const cards = await page.$$('.card');
  console.log(`Found ${cards.length} cards in place grid.`);
  if (cards.length >= 2) {
    const box1 = await cards[0].boundingBox();
    const box2 = await cards[1].boundingBox();
    console.log(`Card 1 dimensions: ${Math.round(box1.width)}x${Math.round(box1.height)}, Card 2 dimensions: ${Math.round(box2.width)}x${Math.round(box2.height)}`);
    console.log('Card heights aligned:', Math.abs(box1.height - box2.height) <= 2);
  }

  const statusBadge = await page.$('.card .status-badge');
  console.log('Card Status Badge present:', statusBadge !== null);
  if (statusBadge) {
    console.log('Sample Card Status:', (await statusBadge.textContent()).trim());
  }

  // 6. Test Place Detail Page & Tools
  console.log('\nTesting Place Detail Page & Action Tools...');
  await page.goto('http://localhost:3000/places/sinhagad-fort', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const detailTitle = await page.textContent('h1');
  console.log('Place Title:', detailTitle.trim());

  const detailStatus = await page.$('.status-badge');
  console.log('Place Detail Operating Hours status:', detailStatus ? (await detailStatus.textContent()).trim() : 'missing');

  const printBtn = await page.$('button:has-text("Print / Save PDF"), button:has-text("ऑफलाइन PDF प्रिंट")');
  console.log('Print / PDF Export button present:', printBtn !== null);

  const whatsappBtn = await page.$('a:has-text("Share on WhatsApp"), a:has-text("WhatsApp वर शेअर")');
  console.log('WhatsApp share link present:', whatsappBtn !== null);

  const listenBtn = await page.$('button:has-text("Listen Pronunciation"), button:has-text("नाव उच्चार ऐका")');
  console.log('Pronunciation button present:', listenBtn !== null);

  // 7. Test Planner Page Print & WhatsApp Toolbar
  console.log('\nTesting Planner Page Export Toolbar...');
  await page.goto('http://localhost:3000/planner', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const generateBtn = await page.$('button:has-text("Generate"), button:has-text("सहल आखा")');
  if (generateBtn) {
    await generateBtn.click();
    try {
      await page.waitForSelector('button:has-text("Print / Save Plan (PDF)"), button:has-text("सहल प्रिंट")', { timeout: 6000 });
      const plannerPrint = await page.$('button:has-text("Print / Save Plan (PDF)"), button:has-text("सहल प्रिंट")');
      console.log('Planner Print / Save PDF button present after generation:', plannerPrint !== null);
      const plannerWa = await page.$('a:has-text("Share Plan on WhatsApp"), a:has-text("WhatsApp वर सहल")');
      console.log('Planner WhatsApp share button present after generation:', plannerWa !== null);
    } catch (e) {
      console.log('Planner generation took longer than timeout or failed:', e.message);
    }
  }

  await browser.close();

  console.log('\nTotal Console Errors:', errors.length);
  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
  }
}

testAll().catch(console.error);
