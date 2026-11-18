/**
 * Explore Pune - Ambient Audio & Micro-Interaction Soundscape Engine
 * 100% Web Audio API synthesized — zero external bandwidth, zero copyright.
 * Always muted by default; user-activated only.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Generates a soft, pleasant mountain breeze ambience using bandpass-filtered noise and sinusoidal modulation
   */
  public startAmbientWind(): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;
      if (this.isPlaying) return true;

      // 4 seconds of brown/pink noise buffer
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.8; // boost brown noise
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to mimic mountain wind resonance across Sahyadri ghats
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      // Low frequency oscillator for gentle gusting breeze
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // ~5.5 sec swell
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(90, this.ctx.currentTime);
      lfo.connect(filter.frequency);

      // Master ambient volume (very gentle, quiet background: 0.08)
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2.5);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      whiteNoise.start();
      lfo.start();

      this.noiseNode = whiteNoise;
      this.gainNode = masterGain;
      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Ambient audio notice:', e);
      return false;
    }
  }

  public stopAmbientWind(): void {
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          if (this.noiseNode) {
            (this.noiseNode as AudioBufferSourceNode).stop();
            this.noiseNode.disconnect();
            this.noiseNode = null;
          }
          this.isPlaying = false;
        }, 1300);
      } else {
        this.isPlaying = false;
      }
    } catch {
      this.isPlaying = false;
    }
  }

  public toggleAmbientWind(): boolean {
    if (this.isPlaying) {
      this.stopAmbientWind();
      return false;
    } else {
      return this.startAmbientWind();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Tactile audio feedback on button clicks / landmark selection
   */
  public playUiBlip(freq: number = 880, duration: number = 0.06): void {
    try {
      this.initContext();
      if (!this.ctx || !this.isPlaying) return; // Only play if user has enabled sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }
}

export const ambientAudio = new AmbientSoundEngine();
