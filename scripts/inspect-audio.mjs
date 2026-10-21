import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function inspectAudio() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const mp3Path = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/.user_uploaded/uploaded_media_1792502228044.mp3';
  const mp3Buffer = fs.readFileSync(mp3Path);
  const base64Audio = mp3Buffer.toString('base64');

  const audioInfo = await page.evaluate(async (b64) => {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);

    return {
      duration: audioBuffer.duration,
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
      length: audioBuffer.length
    };
  }, base64Audio);

  console.log('Audio Info:', audioInfo);
  await browser.close();
}

inspectAudio().catch(console.error);
