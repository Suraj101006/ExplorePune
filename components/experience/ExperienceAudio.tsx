'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function ExperienceAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode[]>([]);

  const toggleAudio = () => {
    if (isPlaying) {
      // Fade out
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.5);
      }
      setTimeout(() => {
        setIsPlaying(false);
      }, 500);
    } else {
      // Initialize Web Audio API on first user interaction
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);

          // Warm harmonic drone (Root C2 65.41Hz, G2 98.00Hz, E3 164.81Hz, C4 261.63Hz)
          const frequencies = [65.41, 98.0, 164.81, 261.63];
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          const oscillators = frequencies.map((freq) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const oscGain = ctx.createGain();
            oscGain.gain.setValueAtTime(0.06, ctx.currentTime);

            osc.connect(oscGain);
            oscGain.connect(filter);
            osc.start();
            return osc;
          });

          filter.connect(masterGain);
          masterGain.connect(ctx.destination);

          gainNodeRef.current = masterGain;
          oscRef.current = oscillators;
        }

        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        if (gainNodeRef.current && audioCtxRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.18, audioCtxRef.current.currentTime, 1.2);
        }

        setIsPlaying(true);
      } catch (e) {
        console.warn('[ExperienceAudio] Web Audio initialization notice:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      className={`exp-control-btn ${isPlaying ? 'active' : ''}`}
      aria-label={isPlaying ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
      title={isPlaying ? 'Mute ambient audio' : 'Enable ambient cinematic drone'}
    >
      {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span>{isPlaying ? 'Sound On' : 'Sound Off'}</span>
    </button>
  );
}
