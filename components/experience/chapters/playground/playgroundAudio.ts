'use client';

/**
 * Explore Pune: Playground Web Audio Synthesizer
 * Zero-dependency procedural sound engine for tactile mini-games:
 * - Copper Hammer (Matharkaam)
 * - Misal Sizzle & Spice Fanfare
 * - Mountain Wind & Scree
 * - Maratha Tutari Fanfare
 * - Pune Dhol, Tasha, Jhanj & Shankh
 */

class PlaygroundAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      return null;
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * 1. Copper Hammer Strike (Tambat Ali Matharkaam)
   * High-metallic harmonic ringing (1200Hz fundamental + 2400Hz overtone) with fast damping.
   */
  public playCopperHammer(pitchMultiplier: number = 1.0): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fundamental = 1350 * pitchMultiplier;

      // Resonant metallic oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(fundamental, now);
      osc1.frequency.exponentialRampToValueAtTime(fundamental * 0.94, now + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fundamental * 2.18, now); // Anharmonic brass bell ratio
      osc2.frequency.exponentialRampToValueAtTime(fundamental * 1.95, now + 0.25);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  /**
   * 2. Misal Sizzle (Simmering Kat & Tadka)
   * Bandpass filtered white noise burst mimicking hot sizzling mustard oil.
   */
  public playMisalSizzle(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.55);
    } catch (e) {}
  }

  /**
   * 3. Zanzanit Spice Fanfare
   */
  public playZanzanitChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  /**
   * 4. Mountain Wind Gust
   */
  public playWindGust(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.9;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.08;
        b2 = 0.92 * b2 + white * 0.12;
        data[i] = b0 + b1 + b2;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
      filter.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.85);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.85);
    } catch (e) {}
  }

  /**
   * 5. Rope Creak
   */
  public playRopeCreak(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.12);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  /**
   * 6. Maratha Tutari Fanfare (Victory on Sinhagad)
   * Characteristic brass ascending flourish: Low C -> E -> G -> High C
   */
  public playTutariFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [293.66, 369.99, 440.0, 587.33]; // D4, F#4, A4, D5 (Royal Bhupali/Kalyan vibe)
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.14;
        const dur = idx === notes.length - 1 ? 0.7 : 0.22;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        // Filter to add warm brass body
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, start);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {}
  }

  /**
   * 7. Pune Dhol (धूम) - Deep 55Hz Bass Drum Thud
   */
  public playDholBeat(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.12);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch (e) {}
  }

  /**
   * 8. Tasha (ताशा) - Crisp 2,200Hz Rim Roll
   */
  public playTashaBeat(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // High pitched rim tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2150, now);
      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      // Snappy noise click
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3000, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
      noise.start(now);
      noise.stop(now + 0.12);
    } catch (e) {}
  }

  /**
   * 9. Jhanj (झांज) - Brass Cymbal Clash
   */
  public playJhanjBeat(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(6500, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.35);
    } catch (e) {}
  }

  /**
   * 10. Shankh (शंख) - Sacred Conch Shell
   */
  public playShankhFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(370, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.9);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {}
  }

  /**
   * 11. Relic Examination Chime
   */
  public playRelicChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  /**
   * 12. Success Celebration Chime
   */
  public playSuccessChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch (e) {}
  }
}

export const playgroundAudio = new PlaygroundAudioEngine();
