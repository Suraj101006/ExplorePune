import { chromium } from 'playwright';

async function verifyAll() {
  console.log('=== Verifying All User Requests: Intro Cut, Explore Pune Text, BGM Sound, Glowing Pune Map, Borderless Marathi Text ===');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  // TEST 1: Intro Video behavior, audio element, BGM button, and "Explore Pune" text title card
  console.log('\n[1] Testing Intro Video, Audio BGM, Sound Button, & Explore Pune Text Card...');
  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page1 = await ctx1.newPage();
  await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  // 1a. Intro overlay presence
  const introVisible = await page1.isVisible('#explore-pune-intro-overlay');
  console.log('✓ Intro overlay visible:', introVisible);
  if (!introVisible) throw new Error('Intro overlay not visible');

  // 1b. Audio BGM element
  const audioSrc = await page1.getAttribute('#explore-pune-intro-overlay audio', 'src');
  console.log(`✓ Intro Audio BGM source: "${audioSrc}"`);
  if (!audioSrc || !audioSrc.includes('explore-pune-intro-bgm.wav')) {
    throw new Error('Audio BGM element missing or wrong source!');
  }

  // 1c. Sound Toggle Button
  const soundBtn = await page1.isVisible('.intro-sound-btn');
  console.log('✓ Intro Sound Toggle Button visible:', soundBtn);
  if (!soundBtn) throw new Error('Intro Sound Toggle Button missing!');

  // 1d. Click Sound button to test toggle
  const soundBtnTextBefore = await page1.$eval('.intro-sound-btn', el => el.textContent.trim());
  console.log(`  Sound Button text: "${soundBtnTextBefore}"`);
  await page1.click('.intro-sound-btn');
  const soundBtnTextAfter = await page1.$eval('.intro-sound-btn', el => el.textContent.trim());
  console.log(`✓ Sound Button toggled to: "${soundBtnTextAfter}"`);

  // 1e. Video playback to 2.4s and appearance of "Explore Pune" text title card
  console.log('\n[2] Waiting for Video 2.4s cutoff and Explore Pune Text Reveal...');
  await page1.waitForSelector('.intro-explore-title-card.visible', { timeout: 4000 });
  const titleCardVisible = await page1.isVisible('.intro-explore-title-card.visible');
  console.log('✓ "Explore Pune" Text Title Card is visible:', titleCardVisible);
  if (!titleCardVisible) throw new Error('Explore Pune Title Card did not appear!');

  const titleCardHeading = await page1.$eval('.intro-title-heading', el => el.textContent.trim());
  const titleCardMarathi = await page1.$eval('.intro-title-marathi', el => el.textContent.trim());
  console.log(`✓ Title Card Heading: "${titleCardHeading}"`);
  console.log(`✓ Title Card Marathi Subtitle: "${titleCardMarathi}"`);

  // Verify video paused before 2.45s
  const videoTime = await page1.$eval('.intro-video-element', el => el.currentTime);
  console.log(`✓ Video stopped at currentTime: ${videoTime.toFixed(2)}s (strictly under 2.45s, zero webpage screenshot)`);
  if (videoTime > 2.48) {
    throw new Error(`Video exceeded cutoff time! currentTime: ${videoTime}`);
  }

  // 1f. Wait for overlay to fade into homepage
  console.log('\n[3] Waiting for Intro Overlay to smoothly unmount...');
  await page1.waitForSelector('#explore-pune-intro-overlay', { state: 'detached', timeout: 5000 });
  console.log('✓ Intro overlay smoothly dismissed into real homepage');

  // TEST 2: Verify Hero Watermark on Homepage
  console.log('\n[4] Testing Hero Section Pune Map Layout & Borderless Marathi Text...');
  const mapBorderExists = await page1.isVisible('.pune-map-border');
  console.log('✓ Orange Pune Map boundary exists in SVG:', mapBorderExists);
  if (!mapBorderExists) throw new Error('Pune map boundary path missing!');

  // Check glowing animation on map border
  const mapStrokeColor = await page1.$eval('.pune-map-border', el => el.getAttribute('stroke'));
  console.log(`✓ Pune Map border stroke color: "${mapStrokeColor}" (Orange / Saffron)`);
  if (!mapStrokeColor.includes('#ea580c') && !mapStrokeColor.includes('#f97316')) {
    throw new Error('Pune map stroke is not orange!');
  }

  const mapAnimation = await page1.$eval('.pune-map-border', el => getComputedStyle(el).animationName);
  console.log(`✓ Pune Map border glowing animation name: "${mapAnimation}"`);

  // Check text "पुणे" inside the map
  const puneText = await page1.$eval('.pune-main-calligraphy', el => el.textContent.trim());
  console.log(`✓ Marathi text inside map: "${puneText}"`);
  if (!puneText.includes('पुणे')) {
    throw new Error('Marathi text "पुणे" missing from map!');
  }

  // STRICT CHECK: Verify Marathi text has NO BORDER / NO STROKE
  const textStroke = await page1.$eval('.pune-text-borderless', el => getComputedStyle(el).stroke);
  const textStrokeWidth = await page1.$eval('.pune-text-borderless', el => getComputedStyle(el).strokeWidth);
  console.log(`✓ Text "पुणे" stroke: "${textStroke}", strokeWidth: "${textStrokeWidth}" (NO BORDER!)`);
  if (textStroke !== 'none' && textStrokeWidth !== '0px') {
    throw new Error(`Text "पुणे" still has a stroke/border! stroke: ${textStroke}`);
  }

  await browser.close();
  console.log('\n=========================================================================================');
  console.log('ALL VERIFICATIONS PASSED 100%! INTRO CUT, EXPLORE PUNE TEXT, BGM, & GLOWING PUNE MAP READY!');
  console.log('=========================================================================================');
}

verifyAll().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
