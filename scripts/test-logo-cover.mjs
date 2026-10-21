import { chromium } from 'playwright';
import path from 'path';

async function testCover() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  // Test desktop 1280x720 (native video aspect ratio)
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #000; width: 100vw; height: 100vh; overflow: hidden; }
          .video-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .our-logo-cover {
            position: absolute;
            right: 8.5%;
            bottom: 17%;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(6, 95, 70, 0.95);
            border: 2px solid #10b981;
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          }
          .our-logo-cover img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <video id="v" src="http://localhost:3000/videos/explore-pune-intro.mp4" muted playsinline></video>
          <div class="our-logo-cover">
            <img src="http://localhost:3000/images/logo.svg" alt="Explore Pune" />
          </div>
        </div>
      </body>
    </html>
  `);

  await page.evaluate(async () => {
    const v = document.getElementById('v');
    v.currentTime = 1.5;
    return new Promise((resolve) => {
      v.onseeked = () => resolve();
      setTimeout(resolve, 500);
    });
  });

  const outPath = path.resolve('scripts/test_logo_cover_1280x720.png');
  await page.screenshot({ path: outPath });
  console.log('Saved test screenshot to:', outPath);

  await browser.close();
}

testCover();
