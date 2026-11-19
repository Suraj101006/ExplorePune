'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Compass,
  ArrowLeft,
  Info,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Footprints,
  X,
} from 'lucide-react';
import { DaruKotharBlueprintModal } from './DaruKotharBlueprintModal';
import { PuneDarwazaBlueprintModal } from './PuneDarwazaBlueprintModal';

interface LandmarkTrigger {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  status: 'VERIFIED' | 'DOCUMENTED';
  sourceRef: string;
}

export const Sinhagad2DGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDossier, setActiveDossier] = useState<'daru_kothar' | 'pune_darwaza' | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Telemetry state
  const [currentCoord, setCurrentCoord] = useState({ lat: 18.3695, lng: 73.7570, elevation: 1312 });
  const [nearLandmark, setNearLandmark] = useState<LandmarkTrigger | null>(null);

  // Missions
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({
    pune_darwaza: false,
    daru_kothar_exterior: false,
    daru_kothar_interior: false,
  });

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Player physics state (in world pixels)
  // Scale: 32 pixels = 1 real-world meter
  const playerRef = useRef({
    x: 580, // Spawns outside Gate 1
    y: 120,
    vx: 0,
    vy: 0,
    speed: 160, // ~5.0 m/s walking
    runSpeed: 280, // ~8.75 m/s running
    radius: 12,
    angle: Math.PI / 2, // Facing South into the fort
    isRunning: false,
    isInsideDaruKothar: false,
  });

  const keysRef = useRef<Record<string, boolean>>({});

  // Landmark triggers
  const landmarks: LandmarkTrigger[] = [
    {
      id: 'pune_darwaza',
      name: 'Pune Darwaza Triple Gate',
      x: 580,
      y: 280,
      radius: 90,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg W-1',
    },
    {
      id: 'daru_kothar',
      name: 'Daru Kothar (8.5m × 3.77m)',
      x: 1160,
      y: 860,
      radius: 110,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg W-4',
    },
  ];

  // Procedural Sound Effects
  const playSfx = useCallback((type: 'footstep' | 'discovery' | 'door') => {
    if (isAudioMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      if (type === 'footstep') {
        // Low crunch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'discovery') {
        // Two-tone bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.1); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isAudioMuted]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;

      // Interaction Key 'E' or 'Enter'
      if ((e.code === 'KeyE' || e.code === 'Enter') && nearLandmark) {
        if (nearLandmark.id === 'daru_kothar') {
          setActiveDossier('daru_kothar');
        } else if (nearLandmark.id === 'pune_darwaza') {
          setActiveDossier('pune_darwaza');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleBlur = () => {
      keysRef.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [nearLandmark]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let stepTimer = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.imageSmoothingEnabled = false;
    };

    window.addEventListener('resize', resize);
    resize();

    // Solid Wall Bounding Boxes (Collision geometry in world space)
    // 32 pixels = 1 meter
    const solidColliders = [
      // Cliff drop left & right of Pune Darwaza
      { x: 0, y: 0, w: 460, h: 100 },
      { x: 670, y: 0, w: 1400, h: 100 },

      // Pune Darwaza 90 degree corridor flank walls
      { x: 490, y: 100, w: 20, h: 220 },
      { x: 640, y: 100, w: 20, h: 160 },
      { x: 490, y: 320, w: 150, h: 20 },
      { x: 680, y: 260, w: 20, h: 180 },

      // Daru Kothar (8.50m x 3.77m = 272 x 121 px, Wall thickness = 26 px ~ 0.80m)
      // Top (North) Wall
      { x: 1024, y: 800, w: 272, h: 26 },
      // Bottom (South) Wall
      { x: 1024, y: 895, w: 272, h: 26 },
      // East Wall
      { x: 1270, y: 800, w: 26, h: 121 },
      // West Wall Top Section
      { x: 1024, y: 800, w: 26, h: 38 },
      // West Wall Bottom Section (leaves 45px doorway opening)
      { x: 1024, y: 882, w: 26, h: 39 },
    ];

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const player = playerRef.current;

      if (isPlaying) {
        // Handle input
        let dx = 0;
        let dy = 0;

        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) dy -= 1;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) dy += 1;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) dx -= 1;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) dx += 1;

        const isRunning = !!keysRef.current['ShiftLeft'] || !!keysRef.current['ShiftRight'];
        player.isRunning = isRunning;
        const currentSpeed = isRunning ? player.runSpeed : player.speed;

        if (dx !== 0 && dy !== 0) {
          dx *= Math.SQRT1_2;
          dy *= Math.SQRT1_2;
        }

        if (dx !== 0 || dy !== 0) {
          player.angle = Math.atan2(dy, dx);
          const nextX = player.x + dx * currentSpeed * dt;
          const nextY = player.y + dy * currentSpeed * dt;

          // AABB Collision check against solid basalt structures
          let canMoveX = true;
          let canMoveY = true;

          for (const box of solidColliders) {
            // Check X collision
            if (
              nextX + player.radius > box.x &&
              nextX - player.radius < box.x + box.w &&
              player.y + player.radius > box.y &&
              player.y - player.radius < box.y + box.h
            ) {
              canMoveX = false;
            }
            // Check Y collision
            if (
              player.x + player.radius > box.x &&
              player.x - player.radius < box.x + box.w &&
              nextY + player.radius > box.y &&
              nextY - player.radius < box.y + box.h
            ) {
              canMoveY = false;
            }
          }

          if (canMoveX) player.x = nextX;
          if (canMoveY) player.y = nextY;

          // Footstep audio pulse
          stepTimer += dt;
          if (stepTimer > (isRunning ? 0.22 : 0.35)) {
            stepTimer = 0;
            playSfx('footstep');
          }
        }

        // Check if player is inside Daru Kothar interior (1050 to 1270, 826 to 895)
        const insideDaru =
          player.x > 1050 && player.x < 1270 && player.y > 826 && player.y < 895;
        player.isInsideDaruKothar = insideDaru;

        // Proximity detection to landmarks
        let activeNear: LandmarkTrigger | null = null;
        for (const lm of landmarks) {
          const dist = Math.hypot(player.x - lm.x, player.y - lm.y);
          if (dist < lm.radius) {
            activeNear = lm;
            // Mark mission progress
            if (lm.id === 'pune_darwaza' && !completedMissions.pune_darwaza) {
              setCompletedMissions((prev) => ({ ...prev, pune_darwaza: true }));
              playSfx('discovery');
            }
            if (lm.id === 'daru_kothar' && !completedMissions.daru_kothar_exterior) {
              setCompletedMissions((prev) => ({ ...prev, daru_kothar_exterior: true }));
              playSfx('discovery');
            }
            break;
          }
        }
        if (insideDaru && !completedMissions.daru_kothar_interior) {
          setCompletedMissions((prev) => ({ ...prev, daru_kothar_interior: true }));
          playSfx('discovery');
        }

        setNearLandmark(activeNear);

        // Convert world pixels to Sinhagad coordinates
        // 32 px = 1 m => 1 px = 0.03125 m
        // 1 m North = +0.00000904 degrees lat
        // 1 m East = +0.00000946 degrees lng
        const latOffset = (player.y - 120) * 0.03125 * -0.00000904;
        const lngOffset = (player.x - 580) * 0.03125 * 0.00000946;
        setCurrentCoord({
          lat: Number((18.3695 + latOffset).toFixed(5)),
          lng: Number((73.7570 + lngOffset).toFixed(5)),
          elevation: insideDaru ? 1310 : 1312,
        });
      }

      // CAMERA & RENDERING
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;

      // Camera smoothly centers on player
      const cameraX = player.x - logicalWidth / 2;
      const cameraY = player.y - logicalHeight / 2;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear Screen
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 1. Draw Deccan Basalt Bedrock & Mountain Plateau Ground
      ctx.fillStyle = '#1e1b4b'; // Deep Sahyadri shadow base
      ctx.fillRect(0, 0, 2000, 2000);

      // Natural plateau grass and laterite stone patches
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(300, 60, 1400, 1200);

      // Ancient Cobbled Basalt Path connecting Pune Darwaza to Daru Kothar
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 48;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      // Start at Gate 1
      ctx.moveTo(580, 100);
      // Down through Gate 2 & 3
      ctx.lineTo(580, 240);
      ctx.lineTo(670, 240);
      ctx.lineTo(670, 480);
      // Turn East across the plateau to Daru Kothar
      ctx.lineTo(820, 650);
      ctx.lineTo(1020, 840);
      ctx.stroke();

      // Path inner cobblestone detail
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 36;
      ctx.stroke();

      // 2. Draw North Precipice (Cliff Edge Drop)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 460, 90);
      ctx.fillRect(670, 0, 1400, 90);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 90, 460, 2);
      ctx.strokeRect(670, 90, 1400, 2);

      // Cliff edge warning markings
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('▼ SHEER BASALT PRECIPICE (950m DROP)', 60, 80);
      ctx.fillText('▼ SHEER BASALT PRECIPICE (950m DROP)', 750, 80);

      // 3. Draw Pune Darwaza Complex
      // Watch Bastions
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(490, 140, 42, 0, Math.PI * 2);
      ctx.arc(670, 140, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Gate 1 Portal Arch
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(530, 90, 100, 24);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('PUNE DARWAZA (GATE 1)', 515, 80);

      // 90° Tactical Bend Corridor
      ctx.fillStyle = '#334155';
      ctx.fillRect(490, 114, 20, 210); // West wall
      ctx.fillRect(640, 114, 20, 150); // East inner wall
      ctx.fillRect(490, 324, 150, 20); // South bend wall
      ctx.fillRect(680, 264, 20, 180); // East outer wall

      // Gate 2 (Middle Gate with Devdis)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(640, 264, 40, 14);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText('GATE 2 (DEVDIS)', 695, 275);

      // Gate 3 (Inner Citadel Arch)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(640, 444, 40, 14);
      ctx.fillText('GATE 3 (INNER ARCH)', 695, 455);

      // 4. Draw Daru Kothar (Gunpowder Magazine)
      // Exact metric footprint: 8.50m x 3.77m = 272 x 121 px, Wall thickness = 26 px
      const dkX = 1024;
      const dkY = 800;
      const dkW = 272;
      const dkH = 121;

      // Outer Basalt Walls
      ctx.fillStyle = '#334155';
      ctx.fillRect(dkX, dkY, dkW, dkH);

      // Interior Chamber (6.90m x 2.17m = 220 x 69 px)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(dkX + 26, dkY + 26, dkW - 52, dkH - 52);

      // Western Entrance Doorway (Left Opening: width ~44px)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(dkX, dkY + 38, 26, 44);

      // Four Vaulted Ceiling Structural Ribs
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      for (let i = 1; i <= 4; i++) {
        const ribX = dkX + 26 + (i * ((dkW - 52) / 5));
        ctx.beginPath();
        ctx.moveTo(ribX, dkY + 26);
        ctx.lineTo(ribX, dkY + dkH - 26);
        ctx.stroke();
      }

      // Roof & Structure Labels
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('DARU KOTHAR (8.50m × 3.77m)', dkX + 20, dkY - 14);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('POINTED BARREL VAULT (4 RIBS) • 0.80m BASALT WALLS', dkX - 10, dkY + dkH + 20);

      // 5. Draw Landmark Trigger Rings
      for (const lm of landmarks) {
        ctx.strokeStyle = lm.id === nearLandmark?.id ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, lm.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label Pin
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Player Avatar (Heritage Explorer)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 4, player.radius + 2, player.radius - 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Explorer Body (Saffron/Ochre Heritage Jacket)
      ctx.fillStyle = player.isRunning ? '#ea580c' : '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Directional Vision Cone / Head
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(player.radius - 2, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Restore camera translation

      // 7. HUD & On-Screen Minimap Radar
      // North Arrow Compass (Top Right)
      ctx.save();
      ctx.translate(logicalWidth - 50, 50);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.stroke();

      // Compass needle (True North 350°)
      ctx.rotate((-10 * Math.PI) / 180);
      ctx.fillStyle = '#ef4444'; // Red North
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(6, 0);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#cbd5e1'; // Silver South
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(6, 0);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore(); // Restore main scale

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, isAudioMuted, playSfx, completedMissions]);

  // Mobile virtual joystick touch handler
  const handleMobileDpad = (direction: 'up' | 'down' | 'left' | 'right' | 'stop') => {
    if (!isPlaying) setIsPlaying(true);
    keysRef.current['KeyW'] = direction === 'up';
    keysRef.current['KeyS'] = direction === 'down';
    keysRef.current['KeyA'] = direction === 'left';
    keysRef.current['KeyD'] = direction === 'right';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] lg:min-h-[720px] bg-slate-950 flex flex-col select-none overflow-hidden font-sans text-slate-100"
    >
      {/* Top Header Navigation & Live Telemetry Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/experience"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">District 3D Map</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm md:text-base font-bold text-amber-400">
                Sinhagad Fort 2D Exploration
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded">
                Archaeologically Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Scale: 1m = 32px • North Sector: Pune Darwaza &amp; Daru Kothar
            </p>
          </div>
        </div>

        {/* Real-Time GIS Telemetry Coordinates */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex flex-col items-end text-right text-xs font-mono bg-slate-950/70 px-3 py-1 rounded border border-slate-800">
            <span className="text-amber-300 font-semibold">
              {currentCoord.lat.toFixed(5)}° N, {currentCoord.lng.toFixed(5)}° E
            </span>
            <span className="text-slate-400 text-[10px]">
              MSL ELEVATION: {currentCoord.elevation}m
            </span>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            title="How to Play"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Game Canvas */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Start / Loading Screen Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
              <Compass className="w-9 h-9" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Sinhagad Fort: Northern Citadel
            </h2>
            <p className="max-w-md text-sm text-slate-300 mb-6 leading-relaxed">
              Explore the authentic 17th-century Maratha fortifications: the triple-gateway of{' '}
              <strong className="text-amber-400">Pune Darwaza</strong> and the bomb-proof vaulted{' '}
              <strong className="text-amber-400">Daru Kothar</strong> gunpowder magazine. Reconstructed directly from measured archaeological surveys.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsPlaying(true);
                  playSfx('discovery');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" /> START EXPLORATION
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Controls &amp; Guide
              </button>
            </div>
          </div>
        )}

        {/* Proximity Interaction Prompt Banner */}
        {isPlaying && nearLandmark && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-amber-500/50 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Eye className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>{nearLandmark.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 rounded font-mono">
                  {nearLandmark.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">E</kbd> or tap to inspect measured architectural blueprint
              </div>
            </div>
            <button
              onClick={() => {
                if (nearLandmark.id === 'daru_kothar') setActiveDossier('daru_kothar');
                if (nearLandmark.id === 'pune_darwaza') setActiveDossier('pune_darwaza');
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
            >
              Inspect
            </button>
          </div>
        )}

        {/* Mission Objectives HUD (Bottom Left) */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 z-20 max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs shadow-xl hidden md:block">
            <div className="flex items-center justify-between font-bold text-amber-400 mb-2 border-b border-slate-800 pb-1">
              <span>EXPLORATION MISSIONS</span>
              <span className="text-[10px] font-mono text-slate-400">PHASE 1</span>
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.pune_darwaza ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={completedMissions.pune_darwaza ? 'line-through text-slate-400' : 'text-slate-200'}>
                  Traverse Pune Darwaza 90° bend
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.daru_kothar_exterior ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={completedMissions.daru_kothar_exterior ? 'line-through text-slate-400' : 'text-slate-200'}>
                  Locate Daru Kothar (Gunpowder Store)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.daru_kothar_interior ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span className={completedMissions.daru_kothar_interior ? 'line-through text-slate-400' : 'text-slate-200'}>
                  Step inside vaulted chamber (4 ribs)
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Mobile On-Screen D-Pad Controls (Bottom Right on Touch Devices) */}
        {isPlaying && (
          <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 md:hidden">
            <button
              onPointerDown={() => handleMobileDpad('up')}
              onPointerUp={() => handleMobileDpad('stop')}
              className="w-12 h-12 bg-slate-800/90 active:bg-amber-500 active:text-slate-950 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg"
            >
              ▲
            </button>
            <div className="flex gap-2">
              <button
                onPointerDown={() => handleMobileDpad('left')}
                onPointerUp={() => handleMobileDpad('stop')}
                className="w-12 h-12 bg-slate-800/90 active:bg-amber-500 active:text-slate-950 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg"
              >
                ◀
              </button>
              <button
                onPointerDown={() => handleMobileDpad('down')}
                onPointerUp={() => handleMobileDpad('stop')}
                className="w-12 h-12 bg-slate-800/90 active:bg-amber-500 active:text-slate-950 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg"
              >
                ▼
              </button>
              <button
                onPointerDown={() => handleMobileDpad('right')}
                onPointerUp={() => handleMobileDpad('stop')}
                className="w-12 h-12 bg-slate-800/90 active:bg-amber-500 active:text-slate-950 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg"
              >
                ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-amber-400">Controls &amp; Architectural Guide</h3>
              <button onClick={() => setShowInstructions(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-xs md:text-sm">
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Desktop Controls:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">Arrow Keys</kbd>: Move explorer</li>
                  <li><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">Shift</kbd>: Sprint / Run</li>
                  <li><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">E</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">Enter</kbd>: Inspect landmark architectural blueprint</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Mobile Controls:</h4>
                <p className="text-slate-300">Use the on-screen virtual directional pad in the bottom-right corner. Tap the interactive banner when in range of a structure.</p>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Archaeological Fidelity:
                </h4>
                <p className="text-slate-400 text-xs">
                  This reconstruction is based directly on the 2017 survey by Kimaya Architects for the Department of Archaeology and Museums, Government of Maharashtra.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Architectural Blueprint Modals */}
      <DaruKotharBlueprintModal
        isOpen={activeDossier === 'daru_kothar'}
        onClose={() => setActiveDossier(null)}
      />
      <PuneDarwazaBlueprintModal
        isOpen={activeDossier === 'pune_darwaza'}
        onClose={() => setActiveDossier(null)}
      />
    </div>
  );
};
