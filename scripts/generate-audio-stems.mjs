import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.resolve('public/experience/audio');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to write 16-bit PCM WAV
function writeWav(filePath, samples, sampleRate = SAMPLE_RATE) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt Subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data Subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Clamp to [-1, 1]
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? Math.floor(s * 32768) : Math.floor(s * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  fs.writeFileSync(filePath, buffer);
}

// Convert WAV to WebM (Opus) and MP3
function encodeAudio(wavPath, baseName) {
  const webmPath = path.join(OUTPUT_DIR, `${baseName}.webm`);
  const mp3Path = path.join(OUTPUT_DIR, `${baseName}.mp3`);

  try {
    execSync(`ffmpeg -y -i "${wavPath}" -c:a libopus -b:a 64k "${webmPath}"`, { stdio: 'pipe' });
    execSync(`ffmpeg -y -i "${wavPath}" -c:a libmp3lame -b:a 96k "${mp3Path}"`, { stdio: 'pipe' });
    console.log(`[Generated] ${baseName}: webm (${fs.statSync(webmPath).size}B), mp3 (${fs.statSync(mp3Path).size}B)`);
  } catch (err) {
    console.warn(`[Warning] ffmpeg encoding failed for ${baseName}, keeping WAV fallback:`, err.message);
  }
}

// Seamless crossfade helper for perfect looping
function applyLoopCrossfade(samples, crossfadeSec = 0.25) {
  const xfSamples = Math.floor(crossfadeSec * SAMPLE_RATE);
  const result = new Float32Array(samples.length - xfSamples);
  const baseLen = result.length;

  for (let i = 0; i < baseLen; i++) {
    result[i] = samples[i];
  }

  // Crossfade tail onto head
  for (let i = 0; i < xfSamples; i++) {
    const fadeOut = (xfSamples - i) / xfSamples;
    const fadeIn = i / xfSamples;
    const tailSample = samples[baseLen + i];
    result[i] = result[i] * fadeIn + tailSample * fadeOut;
  }

  return result;
}

// 1. Preloader Drone (C2 Tanpura / Deep Harmonics)
function generatePreloaderDrone() {
  const duration = 4.25; // 4s loop after 0.25s crossfade
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  // Frequencies: C2 (65.41), G2 (98.0), C3 (130.81), E3 (164.81), G3 (196.0)
  const freqs = [
    { f: 65.41, amp: 0.35, detune: 0.2 },
    { f: 98.00, amp: 0.25, detune: -0.15 },
    { f: 130.81, amp: 0.18, detune: 0.1 },
    { f: 164.81, amp: 0.12, detune: -0.2 },
    { f: 196.00, amp: 0.10, detune: 0.25 },
    { f: 261.63, amp: 0.06, detune: -0.3 },
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let val = 0;

    for (const harmonic of freqs) {
      // Slow beating LFO
      const lfo = 1.0 + 0.15 * Math.sin(2 * Math.PI * 0.25 * t + harmonic.f);
      const wave = Math.sin(2 * Math.PI * (harmonic.f + harmonic.detune) * t) +
                   0.25 * Math.sin(2 * Math.PI * (harmonic.f * 2) * t);
      val += wave * harmonic.amp * lfo;
    }

    // Gentle sub-bass warmth
    val += 0.15 * Math.sin(2 * Math.PI * 32.7 * t);
    samples[i] = val * 0.45;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// 2. Sahyadri Mountain Wind
function generateSahyadriWind() {
  const duration = 4.25;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // White noise source
    const white = Math.random() * 2 - 1;

    // Pink / Brown filter integration
    b0 = 0.992 * b0 + white * 0.05;
    b1 = 0.96 * b1 + white * 0.15;
    b2 = 0.88 * b2 + white * 0.25;
    const brownNoise = b0 * 0.6 + b1 * 0.3 + b2 * 0.1;

    // Resonant wind gust whistling LFOs (around 400 - 750 Hz)
    const gustLfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.35 * t);
    const whistleLfo = Math.sin(2 * Math.PI * (520 + 120 * Math.sin(2 * Math.PI * 0.2 * t)) * t);

    // Deep ridge atmospheric rumble
    const ridgeRumble = Math.sin(2 * Math.PI * 45 * t) * (0.1 + 0.1 * gustLfo);

    samples[i] = (brownNoise * 0.4 + whistleLfo * 0.08 * gustLfo + ridgeRumble) * 0.5;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// 3. Peshwa Court Sanai / Sitar Harmonics
function generatePeshwaCourt() {
  const duration = 4.25;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  // Tanpura in D: D2 (73.42 Hz), A2 (110.0 Hz)
  // Sanai vibrato melody fragments (D, F#, A, B, D)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Tanpura drone base
    const tanpura = 0.28 * Math.sin(2 * Math.PI * 73.42 * t) +
                    0.20 * Math.sin(2 * Math.PI * 110.0 * t) +
                    0.12 * Math.sin(2 * Math.PI * 146.83 * t);

    // Sanai nasal harmonic overtone with 5.2 Hz Indian vibrato (gamak)
    const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5.2 * t);
    const sanaiFreq = (t % 4 < 2 ? 293.66 : 369.99) * vibrato; // D4 to F#4 transition

    // Characteristic rich odd harmonics of the double-reed Shehnai
    const sanai = 0.18 * Math.sin(2 * Math.PI * sanaiFreq * t) +
                  0.14 * Math.sin(2 * Math.PI * sanaiFreq * 3 * t) +
                  0.09 * Math.sin(2 * Math.PI * sanaiFreq * 5 * t) +
                  0.05 * Math.sin(2 * Math.PI * sanaiFreq * 7 * t);

    // Sitar sympathetic string shimmer (taraf)
    const taraf = 0.07 * Math.sin(2 * Math.PI * 587.33 * t) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t));

    samples[i] = (tanpura + sanai + taraf) * 0.4;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// 4. Old Pune Market Bustle (Mandai & Tulshibaug)
function generateMarketBustle() {
  const duration = 4.25;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  let lp = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Crowd murmur: shaped noise in human vocal range (300 - 1800 Hz)
    const white = Math.random() * 2 - 1;
    lp = 0.85 * lp + 0.15 * white;
    const murmurLfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.8 * t) * Math.sin(2 * Math.PI * 1.3 * t);
    const murmur = lp * murmurLfo * 0.35;

    // Distant Mandai brass temple / shop bell chime (e.g. at t = 1.0s and t = 2.8s)
    let bell = 0;
    const b1T = (t - 0.8) % 2.1;
    if (b1T >= 0 && b1T < 0.6) {
      const env = Math.exp(-b1T * 6);
      bell += (Math.sin(2 * Math.PI * 1760 * b1T) + 0.5 * Math.sin(2 * Math.PI * 2640 * b1T)) * env * 0.12;
    }

    // Footfall and street rustle
    const rustle = (Math.random() - 0.5) * 0.05 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 2.5 * t));

    samples[i] = (murmur + bell + rustle) * 0.5;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// 5. Puneri Dhol-Tasha Rhythm Loop
function generateDholTasha() {
  const duration = 3.25; // 3s loop + 0.25s crossfade
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  // Pune Visarjan rhythm: 120 BPM = 0.5s per beat, 6 beats in 3 seconds
  // Dhol strikes: beat 0, beat 1.5, beat 3, beat 4, beat 5
  // Tasha roll: continuous energetic rapid 16th notes with accents
  const dholHits = [0.0, 0.75, 1.5, 2.0, 2.5];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let dhol = 0;

    // Dhol bass hits: pitch bend from 130 Hz down to 55 Hz with punchy transient
    for (const hitTime of dholHits) {
      const dt = t - hitTime;
      if (dt >= 0 && dt < 0.45) {
        const env = Math.exp(-dt * 9);
        const pitch = 55 + 75 * Math.exp(-dt * 25);
        dhol += Math.sin(2 * Math.PI * pitch * dt) * env * 0.65;
        // Sub thud
        dhol += Math.sin(2 * Math.PI * 45 * dt) * env * 0.35;
      }
    }

    // Tasha hits: sharp 16th notes (every 0.125s) with authentic Pune swing & rim accents
    let tasha = 0;
    const tashaIdx = Math.floor(t / 0.125);
    const dtTasha = t - tashaIdx * 0.125;
    if (dtTasha >= 0 && dtTasha < 0.08) {
      const isAccent = (tashaIdx % 4 === 0) || (tashaIdx % 4 === 3);
      const tashaAmp = isAccent ? 0.38 : 0.18;
      const tashaEnv = Math.exp(-dtTasha * 55);
      // Sharp brass rim crack + high skin snap
      const snap = (Math.random() * 2 - 1) * tashaEnv * tashaAmp;
      const shellRing = Math.sin(2 * Math.PI * 980 * dtTasha) * tashaEnv * tashaAmp * 0.4;
      tasha = snap + shellRing;
    }

    samples[i] = (dhol + tasha) * 0.48;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// 6. Monsoon Rain & Distant Thunder
function generateMonsoonRain() {
  const duration = 4.25;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  let hp = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Continuous rain wash (high-passed noise)
    const white = Math.random() * 2 - 1;
    hp = white - (0.88 * hp + 0.12 * white);
    const rainWash = hp * 0.22;

    // Droplet impacts (random micro impulses)
    let drop = 0;
    if (Math.random() < 0.015) {
      const dropFreq = 1400 + Math.random() * 1200;
      drop = Math.sin(2 * Math.PI * dropFreq * (t % 0.05)) * 0.18;
    }

    // Distant rolling Sahyadri thunder around t = 1.8s
    let thunder = 0;
    const thunT = t - 1.6;
    if (thunT >= 0 && thunT < 1.8) {
      const thunEnv = Math.sin((thunT / 1.8) * Math.PI) * (1 + 0.3 * Math.sin(2 * Math.PI * 8 * thunT));
      thunder = Math.sin(2 * Math.PI * 48 * thunT) * thunEnv * 0.28;
    }

    samples[i] = (rainWash + drop + thunder) * 0.55;
  }

  return applyLoopCrossfade(samples, 0.25);
}

// SFX 1: Hammer Strike (Kasba Tambat Copper Vessel)
function generateHammerStrike() {
  const duration = 0.55;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Sharp metallic impact transient (first 15ms)
    const transientEnv = Math.exp(-t * 220);
    const transient = (Math.random() * 2 - 1) * transientEnv * 0.7;

    // Pure red copper bell ring modes (880 Hz, 1760 Hz, 2450 Hz)
    const ringEnv = Math.exp(-t * 8.5);
    const ring = (
      Math.sin(2 * Math.PI * 880 * t) * 0.5 +
      Math.sin(2 * Math.PI * 1760 * t) * 0.35 +
      Math.sin(2 * Math.PI * 2450 * t) * 0.2
    ) * ringEnv;

    samples[i] = (transient + ring) * 0.6;
  }
  return samples;
}

// SFX 2: Coin Drop (Peshwa Shivrai Bronze/Silver Coin)
function generateCoinDrop() {
  const duration = 0.75;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  // Bounces at 0.0s, 0.14s, 0.24s, 0.31s, 0.36s, 0.39s...
  const bounces = [0.0, 0.14, 0.24, 0.31, 0.36, 0.39, 0.41, 0.425];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let clink = 0;

    for (let b = 0; b < bounces.length; b++) {
      const dt = t - bounces[b];
      if (dt >= 0 && dt < 0.12) {
        const decay = 25 + b * 15;
        const env = Math.exp(-dt * decay) * Math.pow(0.72, b);
        const pitch = 2800 + b * 120;
        clink += (
          Math.sin(2 * Math.PI * pitch * dt) * 0.5 +
          Math.sin(2 * Math.PI * (pitch * 1.48) * dt) * 0.35
        ) * env;
      }
    }

    samples[i] = clink * 0.65;
  }
  return samples;
}

// SFX 3: Misal Sizzle (Katakirrr fiery tempering tadka)
function generateMisalSizzle() {
  const duration = 1.15;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const overallEnv = Math.sin((t / duration) * Math.PI);

    // Sizzling oil crackle
    const noise = Math.random() * 2 - 1;
    // Sputtering mustard seed pops
    let pop = 0;
    if (Math.random() < 0.02) {
      pop = (Math.random() * 2 - 1) * 0.6;
    }

    // Warm oil bubbling resonance
    const bubble = Math.sin(2 * Math.PI * (220 + Math.random() * 80) * t) * 0.15;

    samples[i] = (noise * 0.35 + pop + bubble) * overallEnv * 0.5;
  }
  return samples;
}

// SFX 4: UI Click (Tactile Wooden/Mechanical Tap)
function generateUiClick() {
  const duration = 0.08;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 90);
    const click = Math.sin(2 * Math.PI * 1250 * t) * env * 0.7 +
                  (Math.random() * 2 - 1) * env * 0.3;
    samples[i] = click * 0.7;
  }
  return samples;
}

// SFX 5: Game Win Fanfare (Pune Heritage Pentatonic Chime)
function generateWinFanfare() {
  const duration = 1.6;
  const totalSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  // Arpeggiated chime: D5 (587), F#5 (740), A5 (880), D6 (1175)
  const notes = [
    { time: 0.0, freq: 587.33 },
    { time: 0.18, freq: 739.99 },
    { time: 0.36, freq: 880.00 },
    { time: 0.54, freq: 1174.66 },
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let chime = 0;

    for (const note of notes) {
      const dt = t - note.time;
      if (dt >= 0) {
        const env = Math.exp(-dt * 3.5);
        chime += (
          Math.sin(2 * Math.PI * note.freq * dt) * 0.5 +
          Math.sin(2 * Math.PI * (note.freq * 2) * dt) * 0.25 +
          Math.sin(2 * Math.PI * (note.freq * 3) * dt) * 0.1
        ) * env;
      }
    }

    samples[i] = chime * 0.45;
  }
  return samples;
}

// Run generators
const stems = [
  { name: 'preloader-drone', fn: generatePreloaderDrone },
  { name: 'sahyadri-wind', fn: generateSahyadriWind },
  { name: 'peshwa-court', fn: generatePeshwaCourt },
  { name: 'market-bustle', fn: generateMarketBustle },
  { name: 'dhol-tasha', fn: generateDholTasha },
  { name: 'monsoon-rain', fn: generateMonsoonRain },
  { name: 'hammer-strike', fn: generateHammerStrike },
  { name: 'coin-drop', fn: generateCoinDrop },
  { name: 'misal-sizzle', fn: generateMisalSizzle },
  { name: 'ui-click', fn: generateUiClick },
  { name: 'win-fanfare', fn: generateWinFanfare },
];

console.log('Generating Pune Through Time audio stems...');
for (const item of stems) {
  const wavPath = path.join(OUTPUT_DIR, `${item.name}.wav`);
  const data = item.fn();
  writeWav(wavPath, data);
  encodeAudio(wavPath, item.name);
}

console.log('Audio stem generation complete!');
