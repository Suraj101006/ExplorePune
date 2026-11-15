'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, Compass, Volume2, ArrowRight, Play, X, ShieldCheck } from 'lucide-react';

interface ExperienceCinematicIntroProps {
  onComplete: () => void;
  isMr: boolean;
  onEnableAudio?: () => void;
}

export default function ExperienceCinematicIntro({
  onComplete,
  isMr,
  onEnableAudio,
}: ExperienceCinematicIntroProps) {
  // Phase 0: 0s - 1.8s (Black void + telemetry stream)
  // Phase 1: 1.8s - 4.5s (Kinetic typography split reveal + cultural quote)
  // Phase 2: 4.5s - 7.5s (Asset calibration + percentage counter)
  // Phase 3: 7.5s - 10.0s (Portal reveal + Enter CTA + auto-dissolve countdown)
  // Phase 4: Shutter wipe exit
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [typedTelemetry, setTypedTelemetry] = useState<string>('');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fullTelemetry = 'COORDINATES: 18.5204° N, 73.8567° E • ELEVATION: 560M • DECCAN VOLCANIC BASALT • 106 DESTINATIONS VERIFIED';

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        onComplete();
        return;
      }
    }
  }, [onComplete]);

  // Particle Canvas for the intro void
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 80 golden ambient sparks
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      size: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      color: Math.random() > 0.4 ? '#f59e0b' : '#38bdf8',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.75);
      grad.addColorStop(0, 'rgba(10, 14, 23, 0.4)');
      grad.addColorStop(1, 'rgba(4, 6, 10, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle rotating coordinate circle
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(Date.now() * 0.0001);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12;
        const r1 = Math.min(width, height) * 0.34;
        const r2 = Math.min(width, height) * 0.36;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.stroke();
      }
      ctx.restore();

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const alpha = Math.max(0.1, Math.min(0.9, p.opacity));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Telemetry typewriter effect during Phase 0 & 1
  useEffect(() => {
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= fullTelemetry.length) {
        setTypedTelemetry(fullTelemetry.slice(0, charIdx));
        charIdx += 2;
      } else {
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  // Orchestrated Phase Transitions across the 10 seconds
  useEffect(() => {
    // 0s: Phase 0 starts
    // 1.8s: Switch to Phase 1 (Kinetic Typography)
    const t1 = setTimeout(() => setPhase(1), 1800);

    // 4.5s: Switch to Phase 2 (Asset calibration & loader)
    const t2 = setTimeout(() => setPhase(2), 4500);

    // 7.5s: Switch to Phase 3 (Portal ready & CTA invitation)
    const t3 = setTimeout(() => setPhase(3), 7500);

    // Progressive counter from 0 to 100% between 2.0s and 7.2s
    const startTime = Date.now() + 2000;
    const duration = 5200;
    const progressTimer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed > 0) {
        const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
        setProgress(pct);
        if (pct >= 100) clearInterval(progressTimer);
      }
    }, 35);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(progressTimer);
    };
  }, []);

  // Countdown timer in Phase 3 before auto-entering
  useEffect(() => {
    if (phase !== 3) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEnter(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Handle enter trigger
  const handleEnter = (withAudio: boolean = false) => {
    if (isExiting) return;
    if (withAudio && onEnableAudio) {
      onEnableAudio();
    }
    setIsExiting(true);
    // 850ms shutter curtain wipe animation before unmounting
    setTimeout(() => {
      onComplete();
    }, 850);
  };

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnter(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className={`exp-intro-curtain ${isExiting ? 'exp-intro-exit' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Experience Overture"
    >
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="exp-intro-canvas" aria-hidden="true" />

      {/* Atmospheric Overlays */}
      <div className="exp-intro-vignette" aria-hidden="true" />
      <div className="exp-intro-scanline" aria-hidden="true" />

      {/* Top Header Telemetry HUD */}
      <header className="exp-intro-hud">
        <div className="exp-intro-telemetry">
          <span className="exp-telemetry-beacon" />
          <span className="exp-telemetry-mono">{typedTelemetry}</span>
        </div>
        <button
          type="button"
          onClick={() => handleEnter(false)}
          className="exp-intro-skip-btn"
          aria-label="Skip cinematic overture"
        >
          <span>{isMr ? 'वगळा (ESC)' : 'SKIP INTRO (ESC)'}</span>
          <X size={14} />
        </button>
      </header>

      {/* Central Choreographed Stage */}
      <div className="exp-intro-stage">
        {/* Phase 0 & 1: Letter-by-Letter Kinetic Reveal */}
        <div className={`exp-intro-typography ${phase >= 1 ? 'is-visible' : ''}`}>
          <div className="exp-intro-kicker">
            <span className="exp-intro-kicker-bar" />
            <span className="exp-intro-kicker-text">
              {isMr ? 'पुण्यविषय • सह्याद्रीची ऐतिहासिक राजधानी' : 'PUNYAVISHAYA • HISTORIC HEART OF THE DECCAN'}
            </span>
            <span className="exp-intro-kicker-bar" />
          </div>

          <h1 className="exp-intro-title">
            <span className="exp-split-word">
              <span className="exp-split-char" style={{ animationDelay: '0.1s' }}>E</span>
              <span className="exp-split-char" style={{ animationDelay: '0.18s' }}>X</span>
              <span className="exp-split-char" style={{ animationDelay: '0.26s' }}>P</span>
              <span className="exp-split-char" style={{ animationDelay: '0.34s' }}>L</span>
              <span className="exp-split-char" style={{ animationDelay: '0.42s' }}>O</span>
              <span className="exp-split-char" style={{ animationDelay: '0.50s' }}>R</span>
              <span className="exp-split-char" style={{ animationDelay: '0.58s' }}>E</span>
            </span>
            <span className="exp-split-word exp-split-gold">
              <span className="exp-split-char" style={{ animationDelay: '0.66s' }}>P</span>
              <span className="exp-split-char" style={{ animationDelay: '0.74s' }}>U</span>
              <span className="exp-split-char" style={{ animationDelay: '0.82s' }}>N</span>
              <span className="exp-split-char" style={{ animationDelay: '0.90s' }}>E</span>
            </span>
          </h1>

          <p className="exp-intro-quote">
            {isMr
              ? '“जिथे सह्याद्रीचे कडे आभाळाला टेकतात, तिथे इतिहास जिवंत पाषाणांत श्वास घेतो.”'
              : '“Where basalt meets the clouds, history breathes in every stone.”'}
          </p>
        </div>

        {/* Phase 2: Asset Calibration & Progress Gauge */}
        <div className={`exp-intro-calibration ${phase >= 2 ? 'is-active' : ''}`}>
          <div className="exp-intro-dial-wrapper">
            <svg className="exp-intro-dial-svg" viewBox="0 0 120 120" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r="52"
                className="exp-dial-track"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                className="exp-dial-indicator"
                strokeWidth="3"
                fill="none"
                strokeDasharray={326.7}
                strokeDashoffset={326.7 - (326.7 * progress) / 100}
              />
            </svg>
            <div className="exp-dial-inner">
              <span className="exp-dial-percent">{progress}%</span>
              <span className="exp-dial-label">
                {progress < 40
                  ? (isMr ? 'पाषाण नकाशा' : 'Basalt Mesh')
                  : progress < 80
                  ? (isMr ? '१०६ गंतव्ये' : '106 Places')
                  : (isMr ? 'सिद्ध' : 'Synchronized')}
              </span>
            </div>
          </div>

          <div className="exp-intro-preview-pills">
            <div className="exp-preview-pill">
              <span className="exp-pill-dot" />
              <span>{isMr ? 'शनिवार वाडा १७३२' : 'Shaniwar Wada 1732 CE'}</span>
            </div>
            <div className="exp-preview-pill">
              <span className="exp-pill-dot" />
              <span>{isMr ? 'सिंहगड १३१२ मी' : 'Sinhagad 1312m'}</span>
            </div>
            <div className="exp-preview-pill">
              <span className="exp-pill-dot" />
              <span>{isMr ? 'पातळेश्वर ८ वे शतक' : 'Pataleshwar 8th C.'}</span>
            </div>
          </div>
        </div>

        {/* Phase 3: Portal Ready & Invitation Action */}
        <div className={`exp-intro-actions ${phase >= 3 ? 'is-ready' : ''}`}>
          <div className="exp-ready-badge">
            <Sparkles size={14} className="text-amber-400" />
            <span>{isMr ? '३डी विश्व आणि कथा तयार आहेत' : '3D Spatial World & Stories Calibrated'}</span>
          </div>

          <div className="exp-intro-btn-group">
            <button
              type="button"
              onClick={() => handleEnter(true)}
              className="exp-intro-enter-btn exp-btn-glow"
              autoFocus
            >
              <Volume2 size={18} />
              <span>{isMr ? 'संगीतासह प्रवेश करा' : 'Enter with Soundscape'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleEnter(false)}
              className="exp-intro-silent-btn"
            >
              <Play size={16} />
              <span>{isMr ? 'शांततापूर्वक प्रवेश करा' : 'Enter Experience (Silent)'}</span>
            </button>
          </div>

          <p className="exp-intro-autocount">
            {isMr
              ? `${countdown} सेकंदांत आपोआप सुरू होईल...`
              : `Auto-dissolving in ${countdown}s...`}
          </p>
        </div>
      </div>

      {/* Shutter Blade Exit Curtains */}
      <div className="exp-shutter-blade exp-shutter-top" aria-hidden="true" />
      <div className="exp-shutter-blade exp-shutter-bottom" aria-hidden="true" />
    </div>
  );
}
