'use client';

/**
 * Web Audio API Music & Ambient Engine for Explore Pune Journey Reels
 * Provides 100% royalty-free, legal, zero-network, authentic musical ambient synthesis.
 */

export type AudioTrackStyle =
  | 'fort_adventure'
  | 'heritage_classical'
  | 'peaceful_flute'
  | 'lakeside_chill'
  | 'pune_ambient'
  | 'food_trail';

class ReelAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private activeNodes: Array<{ stop: () => void; disconnect: () => void }> = [];
  private sequenceTimer: NodeJS.Timeout | null = null;
  private currentStyle: AudioTrackStyle = 'pune_ambient';

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0.0001 : 0.35;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.sequenceTimer) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    for (const node of this.activeNodes) {
      try {
        node.stop();
        node.disconnect();
      } catch {}
    }
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public pause() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public start(style: AudioTrackStyle = 'pune_ambient') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentStyle = style;
    this.isPlaying = true;

    // Ensure audio context is running
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      switch (style) {
        case 'fort_adventure':
          this.playFortAdventure();
          break;
        case 'heritage_classical':
          this.playHeritageClassical();
          break;
        case 'peaceful_flute':
          this.playPeacefulFlute();
          break;
        case 'lakeside_chill':
          this.playLakesideChill();
          break;
        case 'food_trail':
          this.playFoodTrail();
          break;
        case 'pune_ambient':
        default:
          this.playPuneAmbient();
          break;
      }
    } catch (err) {
      console.warn('Reel audio synth note failed:', err);
    }
  }

  /**
   * 1. Fort Adventure: Deep atmospheric drone, mountain wind resonance, and heroic rhythmic pulse
   */
  private playFortAdventure() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // D minor drone: D2 (73.42Hz) & A2 (110.00Hz)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const droneGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(73.42, now); // D2
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110.0, now); // A2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.exponentialRampToValueAtTime(0.2, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    this.activeNodes.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          osc1.disconnect();
          osc2.disconnect();
          droneGain.disconnect();
        } catch {}
      },
    });

    // Heroic rhythmic pulses every 1.4s
    const notes = [146.83, 174.61, 220.0, 196.0]; // D3, F3, A3, G3
    let noteIdx = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const pulseOsc = this.ctx.createOscillator();
      const pulseGain = this.ctx.createGain();

      pulseOsc.type = 'triangle';
      pulseOsc.frequency.setValueAtTime(notes[noteIdx % notes.length], t);
      noteIdx++;

      pulseGain.gain.setValueAtTime(0.12, t);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(this.masterGain);

      pulseOsc.start(t);
      pulseOsc.stop(t + 1.2);
    }, 1400);
  }

  /**
   * 2. Heritage Classical: Tanpura drone & sitar-like acoustic plucked intervals
   */
  private playHeritageClassical() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Tanpura drone in C# (138.59 Hz and 207.65 Hz)
    const droneOsc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(138.59, now); // C#3
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(207.65, now); // G#3

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);

    droneOsc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    droneOsc.start(now);
    subOsc.start(now);

    this.activeNodes.push({
      stop: () => {
        try {
          droneOsc.stop();
          subOsc.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          droneOsc.disconnect();
          subOsc.disconnect();
          gain.disconnect();
        } catch {}
      },
    });

    // Indian Raga melodic plucked tones (Raag Bhupali notes: C#, D#, F, G#, A#)
    const ragaNotes = [277.18, 311.13, 349.23, 415.3, 466.16, 554.37];
    let step = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const sitarOsc = this.ctx.createOscillator();
      const sitarGain = this.ctx.createGain();

      sitarOsc.type = 'sawtooth';
      sitarOsc.frequency.setValueAtTime(ragaNotes[step % ragaNotes.length], t);
      step++;

      // Sitar acoustic pluck envelope (fast attack, bright release)
      sitarGain.gain.setValueAtTime(0.14, t);
      sitarGain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

      const sitarFilter = this.ctx.createBiquadFilter();
      sitarFilter.type = 'bandpass';
      sitarFilter.frequency.setValueAtTime(1200, t);
      sitarFilter.Q.setValueAtTime(3, t);

      sitarOsc.connect(sitarFilter);
      sitarFilter.connect(sitarGain);
      sitarGain.connect(this.masterGain);

      sitarOsc.start(t);
      sitarOsc.stop(t + 1.4);
    }, 1200);
  }

  /**
   * 3. Peaceful Flute: Pure meditative bansuri sine waves and soothing temple chime harmonics
   */
  private playPeacefulFlute() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Ambient Singing Bowl resonance in F (174.61Hz)
    const bowlOsc = this.ctx.createOscillator();
    const bowlGain = this.ctx.createGain();

    bowlOsc.type = 'sine';
    bowlOsc.frequency.setValueAtTime(174.61, now);
    bowlGain.gain.setValueAtTime(0.01, now);
    bowlGain.gain.exponentialRampToValueAtTime(0.12, now + 2.0);

    bowlOsc.connect(bowlGain);
    bowlGain.connect(this.masterGain);

    bowlOsc.start(now);
    this.activeNodes.push({
      stop: () => {
        try {
          bowlOsc.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          bowlOsc.disconnect();
          bowlGain.disconnect();
        } catch {}
      },
    });

    // Meditative bansuri flute phrases (F, G, A, C, D)
    const fluteNotes = [349.23, 392.0, 440.0, 523.25, 587.33, 440.0];
    let noteIdx = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;

      const flute = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator(); // vibrato
      const lfoGain = this.ctx.createGain();
      const fluteGain = this.ctx.createGain();

      flute.type = 'sine';
      const baseFreq = fluteNotes[noteIdx % fluteNotes.length];
      noteIdx++;
      flute.frequency.setValueAtTime(baseFreq, t);

      // Flute vibrato (5Hz)
      lfo.frequency.setValueAtTime(5, t);
      lfoGain.gain.setValueAtTime(3.5, t);
      lfo.connect(flute.frequency);

      // Flute envelope: gentle swell and breathy fade
      fluteGain.gain.setValueAtTime(0.001, t);
      fluteGain.gain.linearRampToValueAtTime(0.13, t + 0.4);
      fluteGain.gain.exponentialRampToValueAtTime(0.001, t + 1.9);

      flute.connect(fluteGain);
      fluteGain.connect(this.masterGain);

      lfo.start(t);
      flute.start(t);
      lfo.stop(t + 2.0);
      flute.stop(t + 2.0);
    }, 1800);
  }

  /**
   * 4. Lakeside Chill: Acoustic chord shimmers & tranquil nature flow
   */
  private playLakesideChill() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Warm chord pad in G major
    const pad1 = this.ctx.createOscillator();
    const pad2 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();

    pad1.type = 'triangle';
    pad1.frequency.setValueAtTime(196.0, now); // G3
    pad2.type = 'sine';
    pad2.frequency.setValueAtTime(293.66, now); // D4

    padGain.gain.setValueAtTime(0.01, now);
    padGain.gain.exponentialRampToValueAtTime(0.15, now + 1.0);

    pad1.connect(padGain);
    pad2.connect(padGain);
    padGain.connect(this.masterGain);

    pad1.start(now);
    pad2.start(now);

    this.activeNodes.push({
      stop: () => {
        try {
          pad1.stop();
          pad2.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          pad1.disconnect();
          pad2.disconnect();
          padGain.disconnect();
        } catch {}
      },
    });

    // Acoustic guitar arpeggio notes (G, B, D, F#)
    const arp = [196.0, 246.94, 293.66, 369.99, 293.66, 246.94];
    let i = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      noteOsc.type = 'triangle';
      noteOsc.frequency.setValueAtTime(arp[i % arp.length], t);
      i++;

      noteGain.gain.setValueAtTime(0.11, t);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      noteOsc.connect(noteGain);
      noteGain.connect(this.masterGain);

      noteOsc.start(t);
      noteOsc.stop(t + 0.95);
    }, 750);
  }

  /**
   * 5. Pune Ambient: Morning dawn melodic synth pads
   */
  private playPuneAmbient() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220.0, now); // A3
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);

    this.activeNodes.push({
      stop: () => {
        try {
          osc.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      },
    });

    const chords = [220.0, 277.18, 329.63, 440.0];
    let idx = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chime.type = 'sine';
      chime.frequency.setValueAtTime(chords[idx % chords.length], t);
      idx++;

      chimeGain.gain.setValueAtTime(0.09, t);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

      chime.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chime.start(t);
      chime.stop(t + 1.5);
    }, 1100);
  }

  /**
   * 6. Food Trail: Upbeat Puneri street food percussion & playful acoustic guitar rhythm
   */
  private playFoodTrail() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const baseOsc = this.ctx.createOscillator();
    const baseGain = this.ctx.createGain();
    baseOsc.type = 'triangle';
    baseOsc.frequency.setValueAtTime(130.81, now); // C3
    baseGain.gain.setValueAtTime(0.01, now);
    baseGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);

    baseOsc.connect(baseGain);
    baseGain.connect(this.masterGain);
    baseOsc.start(now);

    this.activeNodes.push({
      stop: () => {
        try {
          baseOsc.stop();
        } catch {}
      },
      disconnect: () => {
        try {
          baseOsc.disconnect();
          baseGain.disconnect();
        } catch {}
      },
    });

    // Puneri Dholak & street beats (BPM ~124)
    const foodNotes = [261.63, 329.63, 392.0, 523.25, 392.0]; // C4, E4, G4, C5, G4
    let fIdx = 0;

    this.sequenceTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      const beat = this.ctx.createOscillator();
      const beatGain = this.ctx.createGain();

      beat.type = 'sawtooth';
      beat.frequency.setValueAtTime(foodNotes[fIdx % foodNotes.length], t);
      fIdx++;

      beatGain.gain.setValueAtTime(0.12, t);
      beatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      beat.connect(beatGain);
      beatGain.connect(this.masterGain);

      beat.start(t);
      beat.stop(t + 0.45);
    }, 480);
  }
}

/**
 * Offline Audio Renderer
 * Synthesizes high-fidelity synchronized stereo audio faster than real-time (in <100ms)
 * for seamless integration into MP4 video export!
 */
export async function renderOfflineReelAudio(
  style: AudioTrackStyle,
  durationSec: number = 20,
  sampleRate: number = 44100
): Promise<AudioBuffer | null> {
  if (typeof window === 'undefined') return null;
  const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtx) return null;

  try {
    const totalSamples = Math.ceil(sampleRate * durationSec);
    const offline = new OfflineCtx(2, totalSamples, sampleRate);
    const master = offline.createGain();
    master.gain.setValueAtTime(0.4, 0);
    master.connect(offline.destination);

    // 1. Base ambient drone / harmonic foundation
    const drone1 = offline.createOscillator();
    const drone2 = offline.createOscillator();
    const droneGain = offline.createGain();

    if (style === 'fort_adventure') {
      drone1.type = 'sawtooth';
      drone1.frequency.setValueAtTime(73.42, 0); // D2
      drone2.type = 'triangle';
      drone2.frequency.setValueAtTime(110.0, 0); // A2
      droneGain.gain.setValueAtTime(0.25, 0);
    } else if (style === 'peaceful_flute') {
      drone1.type = 'sine';
      drone1.frequency.setValueAtTime(146.83, 0); // D3
      drone2.type = 'sine';
      drone2.frequency.setValueAtTime(220.0, 0); // A3
      droneGain.gain.setValueAtTime(0.2, 0);
    } else if (style === 'heritage_classical') {
      drone1.type = 'triangle';
      drone1.frequency.setValueAtTime(130.81, 0); // C3
      drone2.type = 'sine';
      drone2.frequency.setValueAtTime(196.0, 0); // G3
      droneGain.gain.setValueAtTime(0.22, 0);
    } else if (style === 'food_trail') {
      drone1.type = 'triangle';
      drone1.frequency.setValueAtTime(130.81, 0); // C3
      drone2.type = 'sawtooth';
      drone2.frequency.setValueAtTime(261.63, 0); // C4
      droneGain.gain.setValueAtTime(0.18, 0);
    } else {
      drone1.type = 'sine';
      drone1.frequency.setValueAtTime(220.0, 0); // A3
      drone2.type = 'sine';
      drone2.frequency.setValueAtTime(329.63, 0); // E4
      droneGain.gain.setValueAtTime(0.2, 0);
    }

    drone1.connect(droneGain);
    drone2.connect(droneGain);
    droneGain.connect(master);
    drone1.start(0);
    drone2.start(0);
    drone1.stop(durationSec);
    drone2.stop(durationSec);

    // 2. Program melodic and rhythmic sequence over the entire duration
    const intervalSec =
      style === 'food_trail'
        ? 0.48
        : style === 'fort_adventure'
        ? 1.2
        : style === 'peaceful_flute'
        ? 1.5
        : 0.9;

    const notes =
      style === 'fort_adventure'
        ? [146.83, 174.61, 220.0, 196.0, 146.83]
        : style === 'peaceful_flute'
        ? [293.66, 329.63, 392.0, 440.0, 523.25]
        : style === 'heritage_classical'
        ? [261.63, 293.66, 329.63, 392.0, 440.0]
        : style === 'food_trail'
        ? [261.63, 329.63, 392.0, 523.25, 392.0]
        : [220.0, 277.18, 329.63, 440.0];

    let t = 0.4;
    let nIdx = 0;
    while (t < durationSec - 0.5) {
      const noteOsc = offline.createOscillator();
      const noteGain = offline.createGain();

      noteOsc.type = style === 'peaceful_flute' ? 'sine' : 'triangle';
      noteOsc.frequency.setValueAtTime(notes[nIdx % notes.length], t);
      nIdx++;

      noteGain.gain.setValueAtTime(0.14, t);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + intervalSec * 0.9);

      noteOsc.connect(noteGain);
      noteGain.connect(master);

      noteOsc.start(t);
      noteOsc.stop(t + intervalSec);

      t += intervalSec;
    }

    return await offline.startRendering();
  } catch (err) {
    console.warn('Offline audio render failed:', err);
    return null;
  }
}

// Global Singleton
let audioInstance: ReelAudioEngine | null = null;

export function getReelAudioEngine(): ReelAudioEngine {
  if (!audioInstance) {
    audioInstance = new ReelAudioEngine();
  }
  return audioInstance;
}
