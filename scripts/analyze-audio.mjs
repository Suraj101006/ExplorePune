import { chromium } from 'playwright';
import fs from 'fs';

async function analyzeAudioEnergy() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const mp3Path = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/.user_uploaded/uploaded_media_1792502228044.mp3';
  const mp3Buffer = fs.readFileSync(mp3Path);
  const base64Audio = mp3Buffer.toString('base64');

  const energyProfile = await page.evaluate(async (b64) => {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);

    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const windowSize = Math.floor(sampleRate * 0.5); // 0.5s windows
    const totalWindows = Math.floor(channelData.length / windowSize);

    const profile = [];
    for (let w = 0; w < Math.min(totalWindows, 30); w++) { // first 15 seconds
      let sumSquares = 0;
      const start = w * windowSize;
      for (let i = start; i < start + windowSize; i++) {
        sumSquares += channelData[i] * channelData[i];
      }
      const rms = Math.sqrt(sumSquares / windowSize);
      profile.push({ time: (w * 0.5).toFixed(1), rms: rms.toFixed(4) });
    }
    return profile;
  }, base64Audio);

  console.log('Energy Profile (First 15 seconds):');
  console.log(energyProfile);
  await browser.close();
}

analyzeAudioEnergy().catch(console.error);
