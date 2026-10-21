import fs from 'fs';
import path from 'path';

// Generate a 16-bit 44.1kHz Stereo PCM WAV file
function generateHeritageBgm() {
  const sampleRate = 44100;
  const durationSeconds = 3.6;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Musical parameters: Raga Bhupali / Heritage Pune Chords (Db / Ab / Eb / F)
  // Base frequencies:
  const rootSa = 138.59; // C#3 / Db3
  const pa = 207.65;    // G#3 / Ab3
  const highSa = 277.18;// C#4
  const ga = 349.23;    // F4
  const dha = 415.30;   // G#4 / Ab4

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Envelope: 0.3s attack, steady, 0.8s smooth release
    let env = 1.0;
    if (t < 0.3) {
      env = (t / 0.3);
    } else if (t > 2.7) {
      env = Math.max(0, (durationSeconds - t) / 0.9);
    }

    // 1. Resonant Tanpura Drone (Sa + Pa + Octaves with subtle beating)
    const drone =
      0.35 * Math.sin(2 * Math.PI * rootSa * t) +
      0.22 * Math.sin(2 * Math.PI * pa * t + 0.5) +
      0.15 * Math.sin(2 * Math.PI * (rootSa * 2) * t) +
      0.08 * Math.sin(2 * Math.PI * (pa * 2) * t);

    // 2. Bansuri Flute melody swell (Gentle glide from Sa -> Ga -> Pa)
    let fluteFreq = highSa;
    let fluteEnv = 0;
    if (t > 0.2 && t < 1.1) {
      fluteFreq = highSa + (ga - highSa) * ((t - 0.2) / 0.9);
      fluteEnv = Math.sin(((t - 0.2) / 0.9) * Math.PI) * 0.28;
    } else if (t >= 1.1 && t < 2.6) {
      fluteFreq = ga + (pa - ga) * ((t - 1.1) / 1.5);
      fluteEnv = Math.sin(((t - 1.1) / 1.5) * Math.PI) * 0.32;
    }
    // Flute breath + vibrato
    const vibrato = Math.sin(2 * Math.PI * 5.2 * t) * 2.5;
    const flute = fluteEnv * (
      Math.sin(2 * Math.PI * (fluteFreq + vibrato) * t) +
      0.25 * Math.sin(2 * Math.PI * 2 * (fluteFreq + vibrato) * t) +
      0.05 * (Math.random() - 0.5) // gentle breath air
    );

    // 3. Temple Bell / Sitar Chime pluck at t = 0.1s
    const bellT = Math.max(0, t - 0.1);
    const bellEnv = Math.exp(-bellT * 1.8) * 0.35;
    const bell = bellEnv * (
      Math.sin(2 * Math.PI * highSa * 2 * bellT) +
      0.6 * Math.sin(2 * Math.PI * ga * 2 * bellT) +
      0.4 * Math.sin(2 * Math.PI * dha * 2 * bellT) +
      0.2 * Math.sin(2 * Math.PI * highSa * 4 * bellT)
    );

    // 4. Subtle stereo ambient reverb shimmer
    const leftSample = env * (drone * 0.85 + flute * 0.95 + bell * 0.85);
    const rightSample = env * (drone * 0.85 + flute * 0.85 + bell * 0.95);

    // Clamp to 16-bit signed integer (-32768 to 32767)
    const intL = Math.max(-32767, Math.min(32767, Math.floor(leftSample * 26000)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(rightSample * 26000)));

    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }

  const outDir = path.resolve('public/audio');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'explore-pune-intro-bgm.wav');
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated authentic heritage BGM WAV: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

generateHeritageBgm();
