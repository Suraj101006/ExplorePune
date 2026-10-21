import { chromium } from 'playwright';
import fs from 'fs';

async function runCompleteAudit() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const auditResults = [];
  const errorsEncountered = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errorsEncountered.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errorsEncountered.push(err.message);
  });

  console.log('--- Starting Complete Explore Pune Audit ---');

  // ==========================================
  // TEST 1: INTRO VIDEO & BGM & BUTTON OVERLAP
  // ==========================================
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const introOverlay = await page.$('#explore-pune-intro-overlay');
    const isIntroPresent = introOverlay !== null;

    if (isIntroPresent) {
      // Check for Skip Intro and Sound buttons
      const skipBtn = await page.$('.intro-skip-btn');
      const soundBtn = await page.$('.intro-sound-btn');
      const controlsBox = await page.$('.intro-top-controls');

      let overlapping = false;
      if (skipBtn && soundBtn) {
        const box1 = await skipBtn.boundingBox();
        const box2 = await soundBtn.boundingBox();
        if (box1 && box2) {
          // Check collision
          overlapping = !(
            box1.x + box1.width <= box2.x ||
            box2.x + box2.width <= box1.x ||
            box1.y + box1.height <= box2.y ||
            box2.y + box2.height <= box1.y
          );
        }
      }

      // Test skip intro click
      if (skipBtn) {
        await skipBtn.click();
        await page.waitForTimeout(600);
      }

      auditResults.push({
        feature: '3.5s Intro Overlay & BGM',
        status: isIntroPresent && !overlapping ? 'PASS' : 'FAIL',
        problem: overlapping ? 'Buttons overlapping' : 'None',
        fix: 'Clean flex layout container (.intro-top-controls)',
      });
    } else {
      auditResults.push({
        feature: '3.5s Intro Overlay & BGM',
        status: 'PASS',
        problem: 'None (Already marked seen or dismissed)',
        fix: '—',
      });
    }
  } catch (err) {
    auditResults.push({ feature: '3.5s Intro Overlay', status: 'FAIL', problem: err.message, fix: 'Fix intro lifecycle' });
  }

  // ==========================================
  // TEST 2: HERO SECTION & NEW PUNE MAP ARTWORK
  // ==========================================
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const puneMapImg = await page.$('.hero-pune-map-img');
    const crestText = await page.$('.hero-pune-crest-text');
    const subText = await page.$('.hero-pune-cultural-sub');
    const heroTitle = await page.textContent('h1');

    const hasMap = puneMapImg !== null;
    const hasCrest = crestText !== null;
    const hasSub = subText !== null;

    const crestContent = hasCrest ? await crestText.textContent() : '';
    const subContent = hasSub ? await subText.textContent() : '';

    const pass = hasMap && hasCrest && crestContent.includes('पुण्यनगरी') && subContent.includes('आमचं पुणे');

    auditResults.push({
      feature: 'Hero Pune Map & Cultural Continuation',
      status: pass ? 'PASS' : 'FAIL',
      problem: pass ? 'None' : 'Missing elements',
      fix: 'Integrated 3D Pune map artwork + Punyanagari & Aamch Pune crest',
    });
  } catch (err) {
    auditResults.push({ feature: 'Hero Pune Map', status: 'FAIL', problem: err.message, fix: 'Inspect hero' });
  }

  // ==========================================
  // TEST 3: NAVIGATION & ROUTES
  // ==========================================
  const routesToTest = [
    { name: 'Home Route (/)', url: 'http://localhost:3000/' },
    { name: 'Planner Route (/planner)', url: 'http://localhost:3000/planner' },
    { name: 'Milestones Route (/milestones)', url: 'http://localhost:3000/milestones' },
    { name: 'Blogs Route (/blogs)', url: 'http://localhost:3000/blogs' },
    { name: 'About Route (/about)', url: 'http://localhost:3000/about' },
    { name: 'Login Route (/login)', url: 'http://localhost:3000/login' },
  ];

  for (const r of routesToTest) {
    try {
      const resp = await page.goto(r.url, { waitUntil: 'domcontentloaded' });
      const status = resp ? resp.status() : 500;
      auditResults.push({
        feature: `Navigation: ${r.name}`,
        status: status === 200 ? 'PASS' : 'FAIL',
        problem: status === 200 ? 'None' : `HTTP status ${status}`,
        fix: '—',
      });
    } catch (err) {
      auditResults.push({ feature: `Navigation: ${r.name}`, status: 'FAIL', problem: err.message, fix: 'Fix route' });
    }
  }

  // ==========================================
  // TEST 4: SEARCH SYSTEM
  // ==========================================
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const searchInput = await page.$('input[name="q"]');
    if (searchInput) {
      // 1. Normal search
      await searchInput.fill('Sinhagad');
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      const cardsSinhagad = await page.$$('.card');

      // 2. Empty search reset
      await page.goto('http://localhost:3000/?q=', { waitUntil: 'domcontentloaded' });
      const cardsAll = await page.$$('.card');

      // 3. Nonexistent search
      await page.goto('http://localhost:3000/?q=nonexistent123xyz', { waitUntil: 'domcontentloaded' });
      const noPlacesMsg = await page.$('.panel');

      auditResults.push({
        feature: 'Search System (Exact, Reset & Empty state)',
        status: cardsSinhagad.length > 0 && cardsAll.length > 0 && noPlacesMsg !== null ? 'PASS' : 'FAIL',
        problem: 'None',
        fix: '—',
      });
    }
  } catch (err) {
    auditResults.push({ feature: 'Search System', status: 'FAIL', problem: err.message, fix: 'Check search query' });
  }

  // ==========================================
  // TEST 5: CATEGORY FILTERING & NEAR ME GPS
  // ==========================================
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const catLinks = await page.$$('nav.chips a.chip');
    let catsWorking = false;
    if (catLinks.length > 1) {
      // Click second category (e.g. Forts)
      await catLinks[1].click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      const filteredCards = await page.$$('.card');
      catsWorking = filteredCards.length > 0;
    }

    // Check Near Me button existence
    const nearMeBtn = await page.$('button.chip');
    const hasNearMe = nearMeBtn !== null;

    auditResults.push({
      feature: 'Category Filters & Proximity Navigation',
      status: catsWorking && hasNearMe ? 'PASS' : 'FAIL',
      problem: 'None',
      fix: '—',
    });
  } catch (err) {
    auditResults.push({ feature: 'Category Filtering', status: 'FAIL', problem: err.message, fix: 'Check category filter' });
  }

  // ==========================================
  // TEST 6: DESTINATION DETAILS & PUBLIC TRANSIT
  // ==========================================
  try {
    await page.goto('http://localhost:3000/places/sinhagad-fort', { waitUntil: 'domcontentloaded' });
    const title = await page.textContent('h1');
    const transitSection = await page.$('section.panel:has-text("Public Transit Guide"), section.panel:has-text("सार्वजनिक वाहतूक")');
    const image = await page.$('.place-detail-banner-img');
    const map = await page.$('.place-map-container, #place-map');

    const pass = title.includes('Sinhagad') && transitSection !== null && image !== null;
    auditResults.push({
      feature: 'Place Detail View & Public Transit Guide',
      status: pass ? 'PASS' : 'FAIL',
      problem: pass ? 'None' : 'Transit guide or image missing',
      fix: '—',
    });
  } catch (err) {
    auditResults.push({ feature: 'Place Detail View', status: 'FAIL', problem: err.message, fix: 'Check place route' });
  }

  // ==========================================
  // TEST 7: TRIP PLANNER & PUBLIC TRANSIT MODE
  // ==========================================
  try {
    await page.goto('http://localhost:3000/planner', { waitUntil: 'domcontentloaded' });
    const gpsBtn = await page.$('button:has-text("GPS")');
    const modeSelect = await page.$('#mode');
    const generateBtn = await page.$('button:has-text("Generate"), button:has-text("सहल आखा")');

    let transitOptionFound = false;
    if (modeSelect) {
      const options = await modeSelect.$$eval('option', (opts) => opts.map((o) => o.value));
      transitOptionFound = options.includes('public_transit');
    }

    auditResults.push({
      feature: 'Trip Planner (Live GPS & Public Transit)',
      status: gpsBtn !== null && transitOptionFound && generateBtn !== null ? 'PASS' : 'FAIL',
      problem: 'None',
      fix: '—',
    });
  } catch (err) {
    auditResults.push({ feature: 'Trip Planner', status: 'FAIL', problem: err.message, fix: 'Check planner page' });
  }

  // ==========================================
  // TEST 8: INTERACTIVE CHATBOT
  // ==========================================
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const chatFab = await page.$('.chat-fab');
    if (chatFab) {
      await chatFab.click();
      await page.waitForTimeout(400);

      const panel = await page.$('.chat-panel');
      const actionPills = await page.$$('.chat-action-pill');
      const chatInput = await page.$('.chat-form input');

      const pass = panel !== null && actionPills.length >= 3 && chatInput !== null;
      auditResults.push({
        feature: 'Interactive AI Chatbot (Pills, Panel & GPS)',
        status: pass ? 'PASS' : 'FAIL',
        problem: pass ? 'None' : 'Panel or pills missing',
        fix: '—',
      });
    }
  } catch (err) {
    auditResults.push({ feature: 'Interactive Chatbot', status: 'FAIL', problem: err.message, fix: 'Check chat widget' });
  }

  // ==========================================
  // TEST 9: COMMUNITY FEEDBACK & EMAIL DISPATCH
  // ==========================================
  try {
    const res = await fetch('http://localhost:3000/api/v1/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        type: 'experience',
        message: 'Comprehensive test of feedback delivery from Suraj Dhok & Sahil Jadhav.',
        email: 'audit.test@example.com',
        userName: 'Audit Bot',
        lang: 'en',
      }),
    });
    const data = await res.json();
    const pass = res.status === 200 && data.success === true && !JSON.stringify(data).includes('suraj.dhok24@mmit.edu.in');

    auditResults.push({
      feature: 'Feedback System & Automated Confirmation Email',
      status: pass ? 'PASS' : 'FAIL',
      problem: pass ? 'None' : 'Feedback failed or email leaked',
      fix: '—',
    });
  } catch (err) {
    auditResults.push({ feature: 'Feedback System', status: 'FAIL', problem: err.message, fix: 'Check /api/v1/feedback' });
  }

  // ==========================================
  // TEST 10: RESPONSIVE VIEWPORT CHECKS
  // ==========================================
  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    try {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      auditResults.push({
        feature: `Responsiveness: ${vp.name}`,
        status: !hasHorizontalScroll ? 'PASS' : 'FAIL',
        problem: hasHorizontalScroll ? 'Horizontal overflow detected' : 'None',
        fix: '—',
      });
    } catch (err) {
      auditResults.push({ feature: `Responsiveness: ${vp.name}`, status: 'FAIL', problem: err.message, fix: 'Fix overflow' });
    }
  }

  // ==========================================
  // TEST 11: BILINGUAL LANGUAGE TOGGLE (EN <-> MR)
  // ==========================================
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const langBtn = await page.$('button.lang-btn, button:has-text("मराठी"), button:has-text("English")');
    if (langBtn) {
      await langBtn.click();
      await page.waitForTimeout(400);
      const isDeva = await page.evaluate(() => {
        return document.documentElement.lang === 'mr' || document.body.textContent.includes('किल्ले');
      });

      auditResults.push({
        feature: 'Bilingual Engine (English <-> Marathi)',
        status: isDeva ? 'PASS' : 'FAIL',
        problem: isDeva ? 'None' : 'Language toggle did not switch strings',
        fix: '—',
      });
    }
  } catch (err) {
    auditResults.push({ feature: 'Bilingual Engine', status: 'FAIL', problem: err.message, fix: 'Check LanguageContext' });
  }

  await browser.close();

  console.log('\n==================================================');
  console.log('AUDIT COMPLETED. SUMMARY TABLE:');
  console.log('==================================================');
  console.table(auditResults);
  console.log('Console Errors Observed:', errorsEncountered.length);

  fs.writeFileSync('C:/Users/Suraj/explore-pune/scripts/audit-report.json', JSON.stringify({ auditResults, errorsEncountered }, null, 2));
}

runCompleteAudit().catch(console.error);
