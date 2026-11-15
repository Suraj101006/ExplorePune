/**
 * Explore Pune - Web Audio API Procedural Synthetic Audio Fallback
 * Provides 100% zero-network, royalty-free synthesized audio backup
 * for ambient loops and tactile sound effects.
 */

import { AmbientTrackId, SfxId } from './types';

export class SyntheticAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentTrack: AmbientTrackId | null = null;

  // Active procedural nodes cleanup callbacks
  private activeNodesCleanup: (() => void) | null = null;

  // Dhol tempo dynamic control
  private dholRate: number = 1.0;
  private dholTimer: any = null;

  private isMuted: boolean = false;
  private volume: number = 0.7;

  /**
   * Lazily initialize AudioContext following user gesture (Hard Rule #3)
   */
  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return null;

        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      } catch (err) {
        console.warn('[SyntheticAudioEngine] Web Audio context initialization notice:', err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public setMute(muted: boolean): void {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const targetGain = muted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public pause(): void {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
      this.ctx.resume().catch(() => {});
    }
  }

  public setDholRate(rate: number): void {
    this.dholRate = Math.max(0.7, Math.min(1.8, rate));
  }

  /**
   * Smoothly crossfade into a synthetic ambient stem
   */
  public crossfadeToTrack(trackId: AmbientTrackId, durationSec = 1.2): void {
    if (this.currentTrack === trackId) return;

    const ctx = this.initContext();
    if (!ctx || !this.ambientGain) return;

    // Fade out existing ambient
    this.ambientGain.gain.setTargetAtTime(0.0001, ctx.currentTime, durationSec * 0.4);

    setTimeout(() => {
      this.stopCurrentAmbientNodes();
      this.currentTrack = trackId;

      // Start new procedural generator
      switch (trackId) {
        case 'preloader-drone':
          this.activeNodesCleanup = this.startPreloaderDrone(ctx, this.ambientGain!);
          break;
        case 'sahyadri-wind':
          this.activeNodesCleanup = this.startSahyadriWind(ctx, this.ambientGain!);
          break;
        case 'peshwa-court':
          this.activeNodesCleanup = this.startPeshwaCourt(ctx, this.ambientGain!);
          break;
        case 'market-bustle':
          this.activeNodesCleanup = this.startMarketBustle(ctx, this.ambientGain!);
          break;
        case 'dhol-tasha':
          this.activeNodesCleanup = this.startDholTasha(ctx, this.ambientGain!);
          break;
        case 'monsoon-rain':
          this.activeNodesCleanup = this.startMonsoonRain(ctx, this.ambientGain!);
          break;
      }

      // Fade in new ambient
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0.55, ctx.currentTime, durationSec * 0.5);
      }
    }, durationSec * 400);
  }

  public stopAmbient(durationSec = 0.8): void {
    if (!this.ctx || !this.ambientGain) return;
    this.ambientGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, durationSec * 0.5);
    setTimeout(() => {
      this.stopCurrentAmbientNodes();
      this.currentTrack = null;
    }, durationSec * 800);
  }

  private stopCurrentAmbientNodes(): void {
    if (this.dholTimer) {
      clearInterval(this.dholTimer);
      this.dholTimer = null;
    }
    if (this.activeNodesCleanup) {
      try {
        this.activeNodesCleanup();
      } catch (e) {}
      this.activeNodesCleanup = null;
    }
  }

  // --- Procedural Ambient Generators ---

  /**
   * 1. Preloader Drone: C2 Meditative Tanpura Harmonics
   */
  private startPreloaderDrone(ctx: AudioContext, dest: AudioNode): () => void {
    const freqs = [65.41, 98.0, 130.81, 164.81, 196.0];
    const oscs: OscillatorNode[] = [];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);
    filter.connect(dest);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + (idx % 2 === 0 ? 0.15 : -0.15), ctx.currentTime);
      gain.gain.setValueAtTime(0.2 / (idx + 1), ctx.currentTime);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      oscs.push(osc);
    });

    return () => {
      oscs.forEach((o) => {
        try { o.stop(); o.disconnect(); } catch (e) {}
      });
      filter.disconnect();
    };
  }

  /**
   * 2. Sahyadri Mountain Wind
   */
  private startSahyadriWind(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(540, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

    // LFO for swaying mountain wind
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(windGain);
    windGain.connect(dest);

    whiteNoise.start();
    lfo.start();

    return () => {
      try {
        whiteNoise.stop();
        lfo.stop();
        whiteNoise.disconnect();
        lfo.disconnect();
        bandpass.disconnect();
        windGain.disconnect();
      } catch (e) {}
    };
  }

  /**
   * 3. Peshwa Court Sanai / Sitar Harmonics
   */
  private startPeshwaCourt(ctx: AudioContext, dest: AudioNode): () => void {
    const tanpuraOsc = ctx.createOscillator();
    tanpuraOsc.type = 'sine';
    tanpuraOsc.frequency.setValueAtTime(73.42, ctx.currentTime); // D2

    const shehnaiOsc = ctx.createOscillator();
    shehnaiOsc.type = 'sawtooth';
    shehnaiOsc.frequency.setValueAtTime(293.66, ctx.currentTime); // D4

    // Gamak Vibrato LFO
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(5.2, ctx.currentTime);
    const vibGain = ctx.createGain();
    vibGain.gain.setValueAtTime(4.5, ctx.currentTime);
    vibrato.connect(vibGain);
    vibGain.connect(shehnaiOsc.frequency);

    const shehnaiFilter = ctx.createBiquadFilter();
    shehnaiFilter.type = 'bandpass';
    shehnaiFilter.frequency.setValueAtTime(1150, ctx.currentTime);
    shehnaiFilter.Q.setValueAtTime(3.2, ctx.currentTime);

    const masterCourtGain = ctx.createGain();
    masterCourtGain.gain.setValueAtTime(0.25, ctx.currentTime);

    tanpuraOsc.connect(masterCourtGain);
    shehnaiOsc.connect(shehnaiFilter);
    shehnaiFilter.connect(masterCourtGain);
    masterCourtGain.connect(dest);

    tanpuraOsc.start();
    shehnaiOsc.start();
    vibrato.start();

    return () => {
      try {
        tanpuraOsc.stop();
        shehnaiOsc.stop();
        vibrato.stop();
        tanpuraOsc.disconnect();
        shehnaiOsc.disconnect();
        shehnaiFilter.disconnect();
        masterCourtGain.disconnect();
      } catch (e) {}
    };
  }

  /**
   * 4. Market Bustle: Old Pune Mandai & Bazaar Ambience
   */
  private startMarketBustle(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);
    filter.Q.setValueAtTime(0.9, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start();

    return () => {
      try {
        noise.stop();
        noise.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch (e) {}
    };
  }

  /**
   * 5. Puneri Dhol-Tasha Rhythm Sequencer
   */
  private startDholTasha(ctx: AudioContext, dest: AudioNode): () => void {
    let step = 0;
    const playStep = () => {
      if (!ctx || ctx.state !== 'running') return;

      const isDholHit = step === 0 || step === 3 || step === 6 || step === 8 || step === 10;
      const isTashaHit = true;

      // 1. Dhol kick
      if (isDholHit) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(125, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.5, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(g);
        g.connect(dest);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }

      // 2. Tasha rim snap
      if (isTashaHit) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const isAccent = step % 4 === 0;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isAccent ? 1400 : 980, ctx.currentTime);
        g.gain.setValueAtTime(isAccent ? 0.35 : 0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(g);
        g.connect(dest);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }

      step = (step + 1) % 12;
    };

    const intervalMs = Math.max(70, Math.floor(130 / this.dholRate));
    this.dholTimer = setInterval(playStep, intervalMs);

    return () => {
      if (this.dholTimer) {
        clearInterval(this.dholTimer);
        this.dholTimer = null;
      }
    };
  }

  /**
   * 6. Monsoon Rain & Thunder
   */
  private startMonsoonRain(ctx: AudioContext, dest: AudioNode): () => void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const rain = ctx.createBufferSource();
    rain.buffer = noiseBuffer;
    rain.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(1400, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.24, ctx.currentTime);

    rain.connect(hp);
    hp.connect(rainGain);
    rainGain.connect(dest);
    rain.start();

    return () => {
      try {
        rain.stop();
        rain.disconnect();
        hp.disconnect();
        rainGain.disconnect();
      } catch (e) {}
    };
  }

  // --- Sound Effects Synthesis ---

  public playSfx(id: SfxId): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    switch (id) {
      case 'hammer': {
        // Metallic hammer on copper vessel (Kasba Tambat Ali)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc2.frequency.setValueAtTime(1760, ctx.currentTime);

        gain.gain.setValueAtTime(0.55, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.48);
        osc2.stop(ctx.currentTime + 0.48);
        break;
      }

      case 'coin': {
        // Dropping Peshwa brass/silver coin
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(2950, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
        break;
      }

      case 'sizzle': {
        // Misal Pav tempering sizzle
        const bufferSize = Math.floor(ctx.sampleRate * 0.5);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, ctx.currentTime);

        noise.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        break;
      }

      case 'click': {
        // Subtle tactile click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1150, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
        break;
      }

      case 'fanfare': {
        // Melodic victory chime arpeggio
        const notes = [587.33, 739.99, 880.0, 1174.66];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startT = ctx.currentTime + i * 0.12;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startT);
          gain.gain.setValueAtTime(0.35, startT);
          gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.6);

          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(startT);
          osc.stop(startT + 0.65);
        });
        break;
      }
    }
  }

  public destroy(): void {
    this.stopCurrentAmbientNodes();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
  }
}

// Global synthetic fallback singleton
export const syntheticAudio = new SyntheticAudioEngine();
