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
  CheckCircle2,
  ShieldCheck,
  Eye,
  X,
  MapPin,
  Flame,
  Droplets,
  Mountain,
} from 'lucide-react';
import { DaruKotharBlueprintModal } from './DaruKotharBlueprintModal';
import { PuneDarwazaBlueprintModal } from './PuneDarwazaBlueprintModal';
import { KalyanDarwazaBlueprintModal } from './KalyanDarwazaBlueprintModal';
import { ZunjarBurujBlueprintModal } from './ZunjarBurujBlueprintModal';
import { DevTakiBlueprintModal } from './DevTakiBlueprintModal';
import { TanajiSamadhiModal } from './TanajiSamadhiModal';
import { KondhaneshwarModal } from './KondhaneshwarModal';

interface LandmarkTrigger {
  id: string;
  name: string;
  nameMr: string;
  x: number;
  y: number;
  radius: number;
  status: 'VERIFIED' | 'DOCUMENTED';
  sourceRef: string;
  category: 'gate' | 'bastion' | 'water' | 'memorial' | 'temple' | 'military';
  dossierKey?:
    | 'daru_kothar'
    | 'pune_darwaza'
    | 'kalyan_darwaza'
    | 'zunjar_buruj'
    | 'dev_taki'
    | 'tanaji_samadhi'
    | 'kondhaneshwar';
}

export const Sinhagad2DGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDossier, setActiveDossier] = useState<
    | 'daru_kothar'
    | 'pune_darwaza'
    | 'kalyan_darwaza'
    | 'zunjar_buruj'
    | 'dev_taki'
    | 'tanaji_samadhi'
    | 'kondhaneshwar'
    | null
  >(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Telemetry state
  const [currentCoord, setCurrentCoord] = useState({
    lat: 18.36952,
    lng: 73.75704,
    elevation: 1285,
    sector: 'Pune Darwaza Gorge',
  });
  const [nearLandmark, setNearLandmark] = useState<LandmarkTrigger | null>(null);

  // Missions
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({
    pune_darwaza: false,
    daru_kothar: false,
    dev_taki: false,
    tanaji_memorial: false,
    zunjar_buruj: false,
    kalyan_darwaza: false,
  });

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Player physics state (in world pixels)
  // Scale: 32 pixels = 1 real-world meter
  // World bounds: 4200 x 3800
  const playerRef = useRef({
    x: 2000, // Outside Pune Darwaza Gate 1
    y: 350,
    vx: 0,
    vy: 0,
    speed: 170, // ~5.3 m/s walking
    runSpeed: 290, // ~9.0 m/s running
    radius: 13,
    angle: Math.PI / 2, // Facing South into the fort
    isRunning: false,
    isInsideDaruKothar: false,
  });

  const keysRef = useRef<Record<string, boolean>>({});

  // Comprehensive Authentic Landmark Triggers
  const landmarks: LandmarkTrigger[] = [
    {
      id: 'pune_darwaza',
      name: 'Pune Darwaza Triple Gate',
      nameMr: 'पुणे दरवाजा',
      x: 2000,
      y: 500,
      radius: 120,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg W-1, S-1',
      category: 'gate',
      dossierKey: 'pune_darwaza',
    },
    {
      id: 'daru_kothar',
      name: 'Daru Kothar Gunpowder Magazine',
      nameMr: 'दारू कोठार',
      x: 2310,
      y: 1500,
      radius: 110,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg W-4',
      category: 'military',
      dossierKey: 'daru_kothar',
    },
    {
      id: 'kondhaneshwar',
      name: 'Kaundinyeshwar Temple (11th C.)',
      nameMr: 'कौंडिण्येश्वर मंदिर',
      x: 2330,
      y: 1720,
      radius: 100,
      status: 'DOCUMENTED',
      sourceRef: 'Bombay Gazetteer 1885',
      category: 'temple',
      dossierKey: 'kondhaneshwar',
    },
    {
      id: 'tanaji_samadhi',
      name: 'Tanaji Malusare Memorial Plinth',
      nameMr: 'नरवीर तानाजी मालुसरे स्मारक',
      x: 1970,
      y: 1840,
      radius: 95,
      status: 'DOCUMENTED',
      sourceRef: 'MTDC Historical Register',
      category: 'memorial',
      dossierKey: 'tanaji_samadhi',
    },
    {
      id: 'dev_taki',
      name: 'Dev Taki Rock-Cut Spring Cistern',
      nameMr: 'देवटाके',
      x: 1900,
      y: 2190,
      radius: 105,
      status: 'DOCUMENTED',
      sourceRef: 'Kimaya 2017 Drg W-14',
      category: 'water',
      dossierKey: 'dev_taki',
    },
    {
      id: 'hathi_taki',
      name: 'Hathi Taki (Elephant Reservoir)',
      nameMr: 'हत्ती टाके',
      x: 2590,
      y: 2000,
      radius: 140,
      status: 'DOCUMENTED',
      sourceRef: 'Kimaya 2017 Drg W-14',
      category: 'water',
    },
    {
      id: 'rajaram_samadhi',
      name: 'Chhatrapati Rajaram Samadhi Chhatri',
      nameMr: 'छत्रपती राजाराम महाराज समाधी',
      x: 2620,
      y: 2300,
      radius: 95,
      status: 'DOCUMENTED',
      sourceRef: 'Drone Frame 07 & Archaelogy Dept',
      category: 'memorial',
    },
    {
      id: 'donagiri_kada',
      name: 'Donagiricha Kada (1670 Escalade Cliff)',
      nameMr: 'डोणागिरीचा कडा',
      x: 560,
      y: 2370,
      radius: 110,
      status: 'VERIFIED',
      sourceRef: 'Sabhasad Bakhar & Drone Frame 14',
      category: 'bastion',
    },
    {
      id: 'kalyan_darwaza',
      name: 'Kalyan Darwaza (Southwest Gate)',
      nameMr: 'कल्याण दरवाजा',
      x: 780,
      y: 2950,
      radius: 120,
      status: 'DOCUMENTED',
      sourceRef: 'Kimaya 2017 Drg W-1',
      category: 'gate',
      dossierKey: 'kalyan_darwaza',
    },
    {
      id: 'kalavanti_buruj',
      name: 'Kalavantinicha Buruj (South Bastion)',
      nameMr: 'कलावंतीणीचा बुरुज',
      x: 1390,
      y: 3420,
      radius: 115,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg S-5 to S-7',
      category: 'bastion',
    },
    {
      id: 'zunjar_buruj',
      name: 'Zunjar Buruj (Eastern Bulwark Prow)',
      nameMr: 'झुंजार बुरुज',
      x: 3750,
      y: 2320,
      radius: 130,
      status: 'VERIFIED',
      sourceRef: 'Kimaya 2017 Drg W-1 & Drone Frame 17',
      category: 'bastion',
      dossierKey: 'zunjar_buruj',
    },
  ];

  // Procedural Sound Effects using Web Audio API
  const playSfx = useCallback(
    (type: 'footstep' | 'discovery' | 'fanfare') => {
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
          // Low stone crunch
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
        } else if (type === 'fanfare') {
          // Maratha Victory Chord
          const freqs = [392.0, 493.88, 587.33, 783.99]; // G Major
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + idx * 0.08);
            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + 0.8);
          });
        }
      } catch {
        // Audio autoplay policy fallback
      }
    },
    [isAudioMuted]
  );

  // Fast Travel teleport to sectors
  const fastTravelTo = (targetX: number, targetY: number) => {
    playerRef.current.x = targetX;
    playerRef.current.y = targetY;
    playSfx('discovery');
  };

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
      if ((e.code === 'KeyE' || e.code === 'Enter') && nearLandmark?.dossierKey) {
        setActiveDossier(nearLandmark.dossierKey);
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
      // Northern Cliff Escarpment (left and right of Pune gorge)
      { x: 0, y: 0, w: 1880, h: 220 },
      { x: 2180, y: 0, w: 2020, h: 220 },

      // Pune Darwaza 90 degree corridor flank walls
      { x: 1910, y: 320, w: 24, h: 260 },
      { x: 2060, y: 320, w: 24, h: 180 },
      { x: 1910, y: 580, w: 174, h: 24 },
      { x: 2100, y: 500, w: 24, h: 200 },

      // Daru Kothar (8.50m x 3.77m = 272 x 121 px, Wall thickness = 26 px ~ 0.80m)
      { x: 2176, y: 1440, w: 272, h: 26 }, // North Wall
      { x: 2176, y: 1535, w: 272, h: 26 }, // South Wall
      { x: 2422, y: 1440, w: 26, h: 121 }, // East Wall
      { x: 2176, y: 1440, w: 26, h: 38 }, // West Wall Top Section
      { x: 2176, y: 1522, w: 26, h: 39 }, // West Wall Bottom Section

      // Kalyan Darwaza Flank Walls
      { x: 640, y: 2820, w: 26, h: 240 },
      { x: 860, y: 2820, w: 26, h: 240 },

      // Zunjar Buruj Knife-Edge Barrier (Drops north and south of ridge)
      { x: 3200, y: 2180, w: 600, h: 40 },
      { x: 3200, y: 2420, w: 600, h: 40 },
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

        // Check if player is inside Daru Kothar interior (2202 to 2422, 1466 to 1535)
        const insideDaru =
          player.x > 2202 && player.x < 2422 && player.y > 1466 && player.y < 1535;
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
            if (lm.id === 'daru_kothar' && !completedMissions.daru_kothar) {
              setCompletedMissions((prev) => ({ ...prev, daru_kothar: true }));
              playSfx('discovery');
            }
            if (lm.id === 'dev_taki' && !completedMissions.dev_taki) {
              setCompletedMissions((prev) => ({ ...prev, dev_taki: true }));
              playSfx('discovery');
            }
            if (
              (lm.id === 'tanaji_samadhi' || lm.id === 'donagiri_kada') &&
              !completedMissions.tanaji_memorial
            ) {
              setCompletedMissions((prev) => ({ ...prev, tanaji_memorial: true }));
              playSfx('discovery');
            }
            if (lm.id === 'zunjar_buruj' && !completedMissions.zunjar_buruj) {
              setCompletedMissions((prev) => ({ ...prev, zunjar_buruj: true }));
              playSfx('fanfare');
            }
            if (lm.id === 'kalyan_darwaza' && !completedMissions.kalyan_darwaza) {
              setCompletedMissions((prev) => ({ ...prev, kalyan_darwaza: true }));
              playSfx('discovery');
            }
            break;
          }
        }

        setNearLandmark(activeNear);

        // Convert world pixels to Sinhagad coordinates
        // 32 px = 1 m => 1 px = 0.03125 m
        const latOffset = (player.y - 350) * 0.03125 * -0.00000904;
        const lngOffset = (player.x - 2000) * 0.03125 * 0.00000946;

        let sector = 'Central Tableland';
        let elevation = 1310;
        if (player.y < 800) {
          sector = 'Pune Darwaza Gorge';
          elevation = 1285;
        } else if (player.x > 3200) {
          sector = 'Zunjar Buruj Ridge';
          elevation = 1280;
        } else if (player.y > 2700 && player.x < 1100) {
          sector = 'Kalyan Darwaza Incline';
          elevation = 1292;
        } else if (player.y > 3100) {
          sector = 'Kalavantinicha Buruj Spur';
          elevation = 1298;
        } else if (player.x < 800 && player.y > 2100) {
          sector = 'Donagiri Kada Precipice';
          elevation = 1290;
        }

        setCurrentCoord({
          lat: Number((18.36952 + latOffset).toFixed(5)),
          lng: Number((73.75704 + lngOffset).toFixed(5)),
          elevation,
          sector,
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

      // Clear Screen (Abyssal Void beyond cliff)
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 1. Draw Massive Basalt Tableland Base (Triangular Fort Contour)
      // Khadakwasla reservoir valley shadow
      ctx.fillStyle = '#091524';
      ctx.fillRect(-500, -500, 5000, 4800);

      // Plateau Main Triangular Basalt Landmass
      ctx.fillStyle = '#1c222e'; // Deccan Basalt Bedrock
      ctx.beginPath();
      // North Apex (Pune Darwaza)
      ctx.moveTo(1800, 200);
      ctx.lineTo(2200, 200);
      // East Spur (Zunjar Buruj)
      ctx.lineTo(3900, 2260);
      ctx.lineTo(3850, 2400);
      // South Promontory (Kalavanti Buruj)
      ctx.lineTo(1500, 3600);
      ctx.lineTo(1300, 3550);
      // Southwest Portal (Kalyan Darwaza)
      ctx.lineTo(600, 3050);
      // West Cliffs (Donagiri Kada)
      ctx.lineTo(450, 2300);
      // Back to North
      ctx.closePath();
      ctx.fill();

      // Plateau Inner Terrain (Dry grass, weathered basalt crust)
      ctx.fillStyle = '#28313e';
      ctx.beginPath();
      ctx.moveTo(1850, 300);
      ctx.lineTo(2150, 300);
      ctx.lineTo(3700, 2280);
      ctx.lineTo(1450, 3450);
      ctx.lineTo(700, 2950);
      ctx.lineTo(550, 2320);
      ctx.closePath();
      ctx.fill();

      // 2. Draw Natural Cobbled Pathway System
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Spine 1: Pune Darwaza to Central Junction (Tanaji/Temple)
      ctx.beginPath();
      ctx.moveTo(2000, 320);
      ctx.lineTo(2000, 600);
      ctx.lineTo(2100, 1000);
      ctx.lineTo(2180, 1440); // branches to Daru Kothar
      ctx.lineTo(2250, 1720); // Kondhaneshwar
      ctx.lineTo(2000, 1840); // Tanaji Samadhi
      ctx.lineTo(1950, 2190); // Dev Taki
      ctx.stroke();

      // Spine 2: Central Junction to Zunjar Buruj (East)
      ctx.beginPath();
      ctx.moveTo(2250, 1720);
      ctx.lineTo(2600, 1950);
      ctx.lineTo(3100, 2150);
      ctx.lineTo(3750, 2320);
      ctx.stroke();

      // Spine 3: Dev Taki to Kalyan Darwaza & Donagiri Kada (Southwest)
      ctx.beginPath();
      ctx.moveTo(1950, 2190);
      ctx.lineTo(1400, 2500);
      ctx.lineTo(820, 2920); // Kalyan Darwaza
      ctx.moveTo(1400, 2500);
      ctx.lineTo(600, 2380); // Donagiri Kada
      ctx.stroke();

      // Spine 4: Central Ridge to Kalavanti Buruj (South)
      ctx.beginPath();
      ctx.moveTo(1950, 2190);
      ctx.lineTo(1700, 2800);
      ctx.lineTo(1400, 3380);
      ctx.stroke();

      // Path inner cobblestone highlight
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 26;
      ctx.stroke();

      // 3. Draw Water Cisterns & Reservoirs
      // Dev Taki (Translucent subterranean blue cavern)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(1820, 2130, 160, 110);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(1820, 2130, 160, 110);
      // Rock pillars inside Dev Taki
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(1860, 2160, 22, 22);
      ctx.fillRect(1920, 2160, 22, 22);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('DEV TAKI (COLD SPRING CISTERN)', 1780, 2120);

      // Hathi Taki (Elephant Open Reservoir)
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(2450, 1900, 280, 180);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(2450, 1900, 280, 180);
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('HATHI TAKI (1.8M L RESERVOIR)', 2480, 1890);

      // 4. Draw Temples & Memorials
      // Kondhaneshwar Temple (Hemadpanthi)
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(2270, 1660, 130, 100);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(2270, 1660, 130, 100);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('KAUNDINYESHWAR TEMPLE (11th C.)', 2230, 1650);

      // Tanaji Malusare Memorial Plinth
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(1930, 1800, 80, 80);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.strokeRect(1930, 1800, 80, 80);
      ctx.fillStyle = '#fdba74';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('VEER TANAJI MALUSARE SMARAK', 1880, 1790);

      // Rajaram Maharaj Samadhi Chhatri
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(2620, 2300, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('RAJARAM MAHARAJ SAMADHI', 2530, 2255);

      // 5. Draw Military Gates & Bastions
      // Pune Darwaza Complex
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(1930, 360, 38, 0, Math.PI * 2);
      ctx.arc(2080, 360, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('PUNE DARWAZA (NORTH)', 1930, 300);

      // Kalyan Darwaza Complex
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(730, 2920, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('KALYAN DARWAZA (SOUTHWEST)', 620, 2860);

      // Zunjar Buruj Eastern Prow & Ramparts
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(3200, 2220);
      ctx.lineTo(3700, 2270);
      ctx.lineTo(3780, 2320);
      ctx.lineTo(3700, 2370);
      ctx.lineTo(3200, 2380);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Saffron Bhagwa Jhenda at Zunjar Prow
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(3780, 2320);
      ctx.lineTo(3780, 2270);
      ctx.stroke();
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(3780, 2270);
      ctx.lineTo(3815, 2282);
      ctx.lineTo(3780, 2294);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fdba74';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ZUNJAR BURUJ (EAST BULWARK)', 3630, 2250);

      // Donagiricha Kada (Tanaji Kada Bastion)
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(560, 2370, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('DONAGIRICHA KADA (300m CLIFF)', 440, 2325);

      // Kalavantinicha Buruj
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(1390, 3420, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('KALAVANTINICHA BURUJ', 1300, 3360);

      // 6. Draw Daru Kothar (Gunpowder Magazine)
      const dkX = 2176;
      const dkY = 1440;
      const dkW = 272;
      const dkH = 121;
      ctx.fillStyle = '#334155';
      ctx.fillRect(dkX, dkY, dkW, dkH);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(dkX + 26, dkY + 26, dkW - 52, dkH - 52);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(dkX, dkY + 38, 26, 44); // West Doorway
      // 4 structural ribs
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      for (let i = 1; i <= 4; i++) {
        const ribX = dkX + 26 + (i * (dkW - 52)) / 5;
        ctx.beginPath();
        ctx.moveTo(ribX, dkY + 26);
        ctx.lineTo(ribX, dkY + dkH - 26);
        ctx.stroke();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('DARU KOTHAR (8.5m x 3.77m)', dkX + 15, dkY - 8);

      // 7. Draw Landmark Trigger Rings
      for (const lm of landmarks) {
        ctx.strokeStyle = lm.id === nearLandmark?.id ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, lm.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pin marker
        ctx.fillStyle = lm.id === nearLandmark?.id ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. Draw Player Avatar (Heritage Explorer)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 5, player.radius + 3, player.radius - 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Explorer Body (Saffron/Ochre Heritage Attire)
      ctx.fillStyle = player.isRunning ? '#ea580c' : '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Directional Head Indicator
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(player.radius - 2, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Restore camera translation

      // 9. MINIMAP RADAR (Top Right)
      const mmW = 160;
      const mmH = 140;
      const mmX = logicalWidth - mmW - 20;
      const mmY = 65;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(mmX, mmY, mmW, mmH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mmX, mmY, mmW, mmH);

      // Minimap Fort Outline (Scaled)
      const scaleMM = (wx: number, wy: number) => ({
        x: mmX + 15 + (wx / 4200) * (mmW - 30),
        y: mmY + 15 + (wy / 3800) * (mmH - 30),
      });

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const p1 = scaleMM(2000, 300);
      const p2 = scaleMM(3800, 2300);
      const p3 = scaleMM(1400, 3500);
      const p4 = scaleMM(700, 2950);
      const p5 = scaleMM(500, 2350);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p5.x, p5.y);
      ctx.closePath();
      ctx.stroke();

      // Landmark Dots on Minimap
      landmarks.forEach((lm) => {
        const pt = scaleMM(lm.x, lm.y);
        ctx.fillStyle =
          lm.category === 'gate'
            ? '#ef4444'
            : lm.category === 'water'
            ? '#38bdf8'
            : lm.category === 'bastion'
            ? '#f97316'
            : '#10b981';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Player Blip on Minimap
      const pPt = scaleMM(player.x, player.y);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(pPt.x, pPt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Minimap Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText('FORT RADAR', mmX + 6, mmY + 12);

      // North Compass Arrow inside Minimap
      ctx.save();
      ctx.translate(mmX + mmW - 14, mmY + 14);
      ctx.rotate((-10 * Math.PI) / 180);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(3, 0);
      ctx.lineTo(-3, 0);
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
      className="relative w-full h-full min-h-[620px] lg:min-h-[760px] bg-slate-950 flex flex-col select-none overflow-hidden font-sans text-slate-100"
    >
      {/* Top Header Navigation & Live Telemetry Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
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
                Sinhagad Fort: Master 2D Exploration
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded">
                Archaeologically Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Scale: 1m = 32px • Sector: {currentCoord.sector}
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif">
              सिंहगड किल्ला: Complete Historical Reconstruction
            </h2>
            <p className="max-w-xl text-sm text-slate-300 mb-6 leading-relaxed">
              Explore the real Sinhagad Fort: the monumental triple-gateway of{' '}
              <strong className="text-amber-400">Pune Darwaza</strong>, the 17th-century{' '}
              <strong className="text-amber-400">Kalyan Darwaza</strong>, the prow of{' '}
              <strong className="text-orange-400">Zunjar Buruj</strong>, the sacred cold spring of{' '}
              <strong className="text-cyan-400">Dev Taki</strong>, and the 1670 battleground of{' '}
              <strong className="text-red-400">Veer Tanaji Malusare</strong>. Reconstructed from measured 2017 Kimaya Architects conservation surveys and 4K aerial photogrammetry.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsPlaying(true);
                  playSfx('fanfare');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" /> START FORT EXPEDITION
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
                {nearLandmark.dossierKey ? (
                  <>
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-bold">
                      E
                    </kbd>{' '}
                    or tap to inspect measured architectural survey
                  </>
                ) : (
                  <span>Verified Historical Landmark ({nearLandmark.sourceRef})</span>
                )}
              </div>
            </div>
            {nearLandmark.dossierKey && (
              <button
                onClick={() => setActiveDossier(nearLandmark.dossierKey!)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Inspect
              </button>
            )}
          </div>
        )}

        {/* Fast Travel Quick Selector (Bottom Center) */}
        {isPlaying && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1 rounded-xl text-[11px]">
            <span className="px-2 text-slate-400 font-mono hidden lg:inline">Fast Travel:</span>
            <button
              onClick={() => fastTravelTo(2000, 350)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 transition-colors"
            >
              Pune Darwaza
            </button>
            <button
              onClick={() => fastTravelTo(2250, 1600)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 transition-colors"
            >
              Central Plateau
            </button>
            <button
              onClick={() => fastTravelTo(1900, 2190)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 transition-colors"
            >
              Dev Taki
            </button>
            <button
              onClick={() => fastTravelTo(3700, 2320)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-slate-950 transition-colors"
            >
              Zunjar Buruj
            </button>
            <button
              onClick={() => fastTravelTo(800, 2900)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 transition-colors"
            >
              Kalyan Darwaza
            </button>
          </div>
        )}

        {/* Mission Objectives HUD (Bottom Left) */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 z-20 max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs shadow-xl hidden md:block">
            <div className="flex items-center justify-between font-bold text-amber-400 mb-2 border-b border-slate-800 pb-1">
              <span>EXPLORATION MISSIONS</span>
              <span className="text-[10px] font-mono text-slate-400">
                {Object.values(completedMissions).filter(Boolean).length}/6 COMPLETED
              </span>
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.pune_darwaza ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.pune_darwaza ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Pass through Pune Darwaza 90° bend
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.daru_kothar ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.daru_kothar ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Locate Daru Kothar (Gunpowder Store)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.dev_taki ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.dev_taki ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Visit Dev Taki Sacred Cold Spring
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.tanaji_memorial ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.tanaji_memorial ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Honor Veer Tanaji Memorial &amp; Kada
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.zunjar_buruj ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.zunjar_buruj ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Ascend Zunjar Buruj Eastern Bulwark
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    completedMissions.kalyan_darwaza ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span
                  className={
                    completedMissions.kalyan_darwaza ? 'line-through text-slate-400' : 'text-slate-200'
                  }
                >
                  Secure Kalyan Darwaza Torna Gate
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
              <h3 className="text-lg font-bold text-amber-400">Controls &amp; Archaeological Guide</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-xs md:text-sm">
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Desktop Controls:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">
                      WASD
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">
                      Arrow Keys
                    </kbd>
                    : Move explorer
                  </li>
                  <li>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">
                      Shift
                    </kbd>
                    : Sprint / Run
                  </li>
                  <li>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">
                      E
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">
                      Enter
                    </kbd>
                    : Inspect landmark architectural blueprint
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Fast Travel:</h4>
                <p className="text-slate-300">
                  Use the quick-travel buttons at the bottom of the screen to jump directly to any major sector of the fort.
                </p>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Archaeological Fidelity:
                </h4>
                <p className="text-slate-400 text-xs">
                  This reconstruction is based directly on the 2017 survey by Kimaya Architects for the Department of Archaeology and Museums, Government of Maharashtra, GIPE-194427 historical map, and 4K aerial photogrammetry.
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
      <KalyanDarwazaBlueprintModal
        isOpen={activeDossier === 'kalyan_darwaza'}
        onClose={() => setActiveDossier(null)}
      />
      <ZunjarBurujBlueprintModal
        isOpen={activeDossier === 'zunjar_buruj'}
        onClose={() => setActiveDossier(null)}
      />
      <DevTakiBlueprintModal
        isOpen={activeDossier === 'dev_taki'}
        onClose={() => setActiveDossier(null)}
      />
      <TanajiSamadhiModal
        isOpen={activeDossier === 'tanaji_samadhi'}
        onClose={() => setActiveDossier(null)}
      />
      <KondhaneshwarModal
        isOpen={activeDossier === 'kondhaneshwar'}
        onClose={() => setActiveDossier(null)}
      />
    </div>
  );
};
