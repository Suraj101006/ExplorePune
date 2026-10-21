import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function trimAudio() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const mp3Path = 'C:/Users/Suraj/.gemini/antigravity/brain/423c92e7-93f0-43f0-b5f3-a18653c595ae/.user_uploaded/uploaded_media_1792502228044.mp3';
  const mp3Buffer = fs.readFileSync(mp3Path);
  const base64Audio = mp3Buffer.toString('base64');

  const trimmedWavBase64 = await page.evaluate(async (b64) => {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
    const decodedBuffer = await audioCtx.decodeAudioData(bytes.buffer);

    // Trim duration: 3.65 seconds (covers video 2.4s + title card 0.85s + transition 0.4s)
    const targetDuration = 3.65;
    const sampleRate = decodedBuffer.sampleRate;
    const totalSamples = Math.floor(targetDuration * sampleRate);

    // Create trimmed buffer
    const trimmed = audioCtx.createBuffer(2, totalSamples, sampleRate);
    const fadeOutSamples = Math.floor(sampleRate * 0.4); // 0.4s smooth fade out
    const fadeOutStart = totalSamples - fadeOutSamples;

    for (let ch = 0; ch < 2; ch++) {
      const srcData = decodedBuffer.getChannelData(ch);
      const dstData = trimmed.getChannelData(ch);

      for (let i = 0; i < totalSamples; i++) {
        let val = i < srcData.length ? srcData[i] : 0;
        // Apply smooth exponential/cosine fade-out at the end
        if (i >= fadeOutStart) {
          const fadeFactor = 0.5 * (1 + Math.cos(Math.PI * (i - fadeOutStart) / fadeOutSamples));
          val *= fadeFactor;
        }
        dstData[i] = val;
      }
    }

    // Helper: encode AudioBuffer to 16-bit PCM WAV
    function audioBufferToWav(buffer) {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      const dataLength = buffer.length * blockAlign;
      const bufferLength = 44 + dataLength;

      const arrayBuffer = new ArrayBuffer(bufferLength);
      const view = new DataView(arrayBuffer);

      // Write RIFF header
      function writeString(offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataLength, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, dataLength, true);

      // Write interleaved 16-bit samples
      let offset = 44;
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      for (let i = 0; i < buffer.length; i++) {
        // Left
        let sampleL = Math.max(-1, Math.min(1, left[i]));
        view.setInt16(offset, sampleL < 0 ? sampleL * 0x8000 : sampleL * 0x7FFF, true);
        offset += 2;

        // Right
        let sampleR = Math.max(-1, Math.min(1, right[i]));
        view.setInt16(offset, sampleR < 0 ? sampleR * 0x8000 : sampleR * 0x7FFF, true);
        offset += 2;
      }

      // Convert to base64
      let binary = '';
      const u8 = new Uint8Array(arrayBuffer);
      const chunkSize = 8192;
      for (let i = 0; i < u8.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, u8.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }

    return audioBufferToWav(trimmed);
  }, base64Audio);

  const audioDir = 'C:/Users/Suraj/explore-pune/public/audio';
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Write out to explore-pune-intro-bgm.wav
  const wavPath = path.join(audioDir, 'explore-pune-intro-bgm.wav');
  const buffer = Buffer.from(trimmedWavBase64, 'base64');
  fs.writeFileSync(wavPath, buffer);
  console.log(`Successfully trimmed and saved intro BGM WAV (${buffer.length} bytes) to: ${wavPath}`);

  // Also save copy of original full uploaded audio to public/audio/explore-pune-intro-bgm.mp3
  fs.copyFileSync(mp3Path, path.join(audioDir, 'explore-pune-intro-bgm.mp3'));
  console.log('Saved explore-pune-intro-bgm.mp3');

  await browser.close();
}

trimAudio().catch(console.error);
