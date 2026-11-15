'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { palette } from '@/components/experience/tokens/tokens';
import { PerformanceMonitor } from '@/components/experience/webgl/PerformanceMonitor';

export interface EpochSceneMorphProps {
  activeEpoch?: number; // 0: Pataleshwar, 1: Sinhagad, 2: Shaniwar Wada, 3: Modern Freedom
  progress?: number;    // Continuous scroll progress 0.0 to 1.0
  className?: string;
  isInteractive?: boolean;
}

export default function EpochSceneMorph({
  activeEpoch = 0,
  progress,
  className = '',
  isInteractive = true,
}: EpochSceneMorphProps) {
  const { isLiteMode, prefersReducedMotion, isMr } = useExperience();
  const containerRef = useRef<HTMLDivElement>(null);

  // Computed epoch index (0 to 3)
  const currentEpochIndex = Math.max(
    0,
    Math.min(
      3,
      typeof progress === 'number'
        ? Math.floor(progress * 3.99)
        : activeEpoch
    )
  );

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 4 Epoch Object Groups
  const epochGroupsRef = useRef<THREE.Group[]>([]);
  const targetEpochRef = useRef<number>(currentEpochIndex);
  const blendWeightsRef = useRef<number[]>([1, 0, 0, 0]);

  // Keep targetEpoch updated
  useEffect(() => {
    targetEpochRef.current = currentEpochIndex;
  }, [currentEpochIndex]);

  useEffect(() => {
    if (isLiteMode || prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer & Performance Cap
    const perf = new PerformanceMonitor({
      onDowngrade: () => {
        if (rendererRef.current) {
          rendererRef.current.setPixelRatio(1.0);
        }
      },
    });

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !perf.isMobile,
      powerPreference: 'high-performance',
    });
    perf.applyToRenderer(renderer);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(palette.monsoon[500], 0.8);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // Dynamic flickering focal point light (Diya / Torch)
    const focalPointLight = new THREE.PointLight(palette.saffron[500], 2.0, 12, 1.2);
    focalPointLight.position.set(0, 0.5, 2);
    scene.add(focalPointLight);

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    // =========================================================================
    // EPOCH 1: 8th Century — Pataleshwar Monolithic Basalt Pillar & Diya
    // =========================================================================
    const g1 = new THREE.Group();
    g1.name = 'Epoch1_Pataleshwar';

    // Massive circular monolithic stone plinth (Nandi Mandapa plinth)
    const plinthGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.5, 16);
    const basaltMat = new THREE.MeshStandardMaterial({
      color: palette.stone[800],
      roughness: 0.9,
      flatShading: true,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, basaltMat);
    plinthMesh.position.y = -1.2;
    g1.add(plinthMesh);

    // Chiseled monolithic basalt pillar
    const pillarGeo = new THREE.CylinderGeometry(0.55, 0.65, 3.2, 8);
    const pillarMesh = new THREE.Mesh(pillarGeo, basaltMat);
    pillarMesh.position.y = 0.5;
    g1.add(pillarMesh);

    // Ornate rock-cut capital bracket
    const capitalGeo = new THREE.BoxGeometry(1.6, 0.45, 1.6);
    const capitalMesh = new THREE.Mesh(capitalGeo, basaltMat);
    capitalMesh.position.y = 2.2;
    g1.add(capitalMesh);

    // Terracotta Diya with flickering warm flame
    const diyaGeo = new THREE.CylinderGeometry(0.35, 0.15, 0.18, 12);
    const diyaMat = new THREE.MeshStandardMaterial({
      color: palette.copper[700],
      roughness: 0.8,
    });
    const diyaMesh = new THREE.Mesh(diyaGeo, diyaMat);
    diyaMesh.position.set(0.9, -0.85, 0.8);
    g1.add(diyaMesh);

    const flameGeo = new THREE.ConeGeometry(0.1, 0.35, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: palette.gold[400] });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0.9, -0.65, 0.8);
    g1.add(flameMesh);

    disposables.push(
      plinthGeo,
      basaltMat,
      pillarGeo,
      capitalGeo,
      diyaGeo,
      diyaMat,
      flameGeo,
      flameMat
    );
    scene.add(g1);

    // =========================================================================
    // EPOCH 2: 17th Century — Sinhagad Maratha Warrior Shield (Dhal) & Talwar
    // =========================================================================
    const g2 = new THREE.Group();
    g2.name = 'Epoch2_SinhagadSwarajya';

    // Convex circular Maratha hide shield (Dhal)
    const shieldGeo = new THREE.SphereGeometry(1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x1a1816,
      roughness: 0.5,
      metalness: 0.6,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.rotation.x = Math.PI / 2;
    g2.add(shieldMesh);

    // Four Brass Bosses on Shield
    const bossGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.12, 12);
    const bossMat = new THREE.MeshStandardMaterial({
      color: palette.gold[500],
      metalness: 0.85,
      roughness: 0.25,
    });
    disposables.push(shieldGeo, shieldMat, bossGeo, bossMat);

    const bossOffsets = [
      [0.6, 0.6],
      [-0.6, 0.6],
      [0.6, -0.6],
      [-0.6, -0.6],
    ];
    bossOffsets.forEach(([bx, by]) => {
      const b = new THREE.Mesh(bossGeo, bossMat);
      b.position.set(bx, by, 0.35);
      g2.add(b);
    });

    // Curved Maratha Steel Talwar blade
    const swordBladeGeo = new THREE.BoxGeometry(0.15, 3.8, 0.05);
    const swordBladeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15,
    });
    const swordMesh = new THREE.Mesh(swordBladeGeo, swordBladeMat);
    swordMesh.rotation.z = Math.PI / 4;
    swordMesh.position.set(0, 0, -0.2);
    g2.add(swordMesh);
    disposables.push(swordBladeGeo, swordBladeMat);

    scene.add(g2);

    // =========================================================================
    // EPOCH 3: 18th Century — Peshwa Wada Carved Teakwood Pillar & Karanje
    // =========================================================================
    const g3 = new THREE.Group();
    g3.name = 'Epoch3_PeshwaZenith';

    // Heavy dark teakwood column with cypress (Suru) contour
    const teakGeo = new THREE.CylinderGeometry(0.4, 0.5, 3.6, 12);
    const teakMat = new THREE.MeshStandardMaterial({
      color: palette.teak[800],
      roughness: 0.7,
      metalness: 0.1,
    });
    const teakMesh = new THREE.Mesh(teakGeo, teakMat);
    teakMesh.position.y = 0.2;
    g3.add(teakMesh);

    // Carved timber bracket capital with gold leaf inlay
    const timberCapitalGeo = new THREE.BoxGeometry(1.8, 0.4, 1.8);
    const timberCapitalMat = new THREE.MeshStandardMaterial({
      color: palette.teak[700],
      roughness: 0.6,
    });
    const timberCapitalMesh = new THREE.Mesh(timberCapitalGeo, timberCapitalMat);
    timberCapitalMesh.position.y = 2.1;
    g3.add(timberCapitalMesh);

    // Gold trim band
    const goldBandGeo = new THREE.TorusGeometry(0.52, 0.06, 8, 24);
    const goldBandMat = new THREE.MeshStandardMaterial({
      color: palette.gold[500],
      metalness: 0.9,
      roughness: 0.2,
    });
    const goldBandMesh = new THREE.Mesh(goldBandGeo, goldBandMat);
    goldBandMesh.rotation.x = Math.PI / 2;
    goldBandMesh.position.y = 1.8;
    g3.add(goldBandMesh);

    // Hazari Karanje octagonal water ripple basin
    const basinGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.4, 8);
    const basinMat = new THREE.MeshStandardMaterial({
      color: palette.stone[700],
      roughness: 0.7,
    });
    const basinMesh = new THREE.Mesh(basinGeo, basinMat);
    basinMesh.position.y = -1.4;
    g3.add(basinMesh);

    disposables.push(
      teakGeo,
      teakMat,
      timberCapitalGeo,
      timberCapitalMat,
      goldBandGeo,
      goldBandMat,
      basinGeo,
      basinMat
    );
    scene.add(g3);

    // =========================================================================
    // EPOCH 4: 19th-21st Century — Social Reform & Modern Freedom Light
    // =========================================================================
    const g4 = new THREE.Group();
    g4.name = 'Epoch4_ModernFreedom';

    // Italianate arch silhouette (Aga Khan Palace style)
    const archCurve = new THREE.EllipseCurve(0, 0, 1.5, 2.2, 0, Math.PI, false, 0);
    const archPoints = archCurve.getPoints(24);
    const archGeo = new THREE.BufferGeometry().setFromPoints(
      archPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const archMat = new THREE.LineBasicMaterial({
      color: palette.gold[400],
      linewidth: 2,
    });
    const archLine = new THREE.Line(archGeo, archMat);
    archLine.position.y = -0.5;
    g4.add(archLine);

    // Open Study Manuscript (Phule Wada education symbol)
    const bookGeo = new THREE.BoxGeometry(1.6, 0.15, 1.1);
    const bookMat = new THREE.MeshStandardMaterial({
      color: palette.parchment[600],
      roughness: 0.9,
    });
    const bookMesh = new THREE.Mesh(bookGeo, bookMat);
    bookMesh.position.set(0, -0.6, 0.4);
    g4.add(bookMesh);

    // Glowing Knowledge & Cyber Beam (Icosahedron Freedom Core)
    const beaconCoreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const beaconCoreMat = new THREE.MeshStandardMaterial({
      color: palette.monsoon[500],
      emissive: palette.monsoon[600],
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const beaconCoreMesh = new THREE.Mesh(beaconCoreGeo, beaconCoreMat);
    beaconCoreMesh.position.y = 1.0;
    g4.add(beaconCoreMesh);

    disposables.push(archGeo, archMat, bookGeo, bookMat, beaconCoreGeo, beaconCoreMat);
    scene.add(g4);

    epochGroupsRef.current = [g1, g2, g3, g4];

    // 4. Ambient Epoch Particle Clouds
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: palette.gold[400],
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    disposables.push(particleGeo, particleMat);

    // 5. Render & Morph Transition Loop
    let clock = new THREE.Clock();
    let isVisible = true;

    const cleanupVisibility = PerformanceMonitor.observeVisibility(
      container,
      (visible) => {
        isVisible = visible;
      }
    );

    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;

      perf.tick(timestamp);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smoothly blend weights toward active epoch index
      const targetIdx = targetEpochRef.current;
      for (let i = 0; i < 4; i++) {
        const targetVal = i === targetIdx ? 1 : 0;
        blendWeightsRef.current[i] = THREE.MathUtils.lerp(
          blendWeightsRef.current[i],
          targetVal,
          delta * 4.5
        );
      }

      // Apply morph transforms to the 4 epoch groups
      epochGroupsRef.current.forEach((grp, idx) => {
        const weight = blendWeightsRef.current[idx];
        grp.visible = weight > 0.01;
        grp.scale.setScalar(0.7 + weight * 0.3);
        grp.position.y = (1.0 - weight) * -1.5;
        grp.rotation.y = elapsed * 0.35 + idx * (Math.PI / 2);
      });

      // Animate Beacon Core & Particles
      beaconCoreMesh.rotation.x = elapsed * 0.8;
      beaconCoreMesh.rotation.y = elapsed * 1.2;
      particleSystem.rotation.y = elapsed * 0.08;

      // Diya & Torch light modulation
      focalPointLight.intensity = 1.8 + Math.sin(elapsed * 10) * 0.35;
      if (targetIdx === 0) {
        focalPointLight.color.setHex(0xf59e0b); // Diya gold
      } else if (targetIdx === 1) {
        focalPointLight.color.setHex(0xea580c); // Torch saffron
      } else if (targetIdx === 2) {
        focalPointLight.color.setHex(0xd97706); // Wada lantern
      } else {
        focalPointLight.color.setHex(0x38bdf8); // Freedom cyan
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || 600;
      const h = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Strict Cleanup & Disposal
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      cleanupVisibility();
      window.removeEventListener('resize', handleResize);

      disposables.forEach((item) => {
        if ('dispose' in item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });

      ambientLight.dispose();
      keyLight.dispose();
      rimLight.dispose();
      focalPointLight.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      epochGroupsRef.current = [];
    };
  }, [isLiteMode, prefersReducedMotion]);

  // CALM / LITE MODE FALLBACK (?lite=1 or reduced motion)
  if (isLiteMode || prefersReducedMotion) {
    const epochTitles = [
      {
        en: '8th c. Pataleshwar Monolithic Basalt Shrines',
        mr: '८वे शतक • पाताळेश्वर कातळ-खोदीव लेणी',
        color: palette.gold[500],
      },
      {
        en: '1670 CE Sinhagad Swarajya Bastions & Valor',
        mr: '१६७० • सिंहगड स्वराज्य व तान्हाजींचा पराक्रम',
        color: palette.saffron[500],
      },
      {
        en: '1732 CE Peshwa Shaniwar Wada & Teak Palaces',
        mr: '१७३२ • शनिवार वाडा आणि पेशवाई वैभव',
        color: palette.copper[500],
      },
      {
        en: '1848–Present Social Reform & Modern Freedom',
        mr: '१८४८ ते आज • सामाजिक क्रांती व ज्ञानदीक्षा',
        color: palette.monsoon[500],
      },
    ];

    const cur = epochTitles[currentEpochIndex] || epochTitles[0];

    return (
      <div
        className={`exp-epoch-lite-fallback ${className}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.08) 0%, ${palette.basalt[900]} 100%)`,
          border: `1px solid ${palette.stone[700]}`,
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${cur.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: '1rem',
          }}
        >
          {currentEpochIndex === 0 && '🪨'}
          {currentEpochIndex === 1 && '⚔️'}
          {currentEpochIndex === 2 && '🏛️'}
          {currentEpochIndex === 3 && '🕊️'}
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: cur.color,
            margin: '0 0 0.5rem 0',
          }}
        >
          {isMr ? cur.mr : cur.en}
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: palette.stone[400],
            maxWidth: '380px',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {isMr
            ? 'ऐतिहासिक कालखंडाचे सचित्र दर्शन शांत मोडमध्ये उपलब्ध आहे.'
            : 'Static visual artifact representation active in Calm/Lite mode.'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`exp-epoch-scene-morph ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        overflow: 'hidden',
        cursor: isInteractive ? 'grab' : 'default',
      }}
      aria-label="3D Morphing Historical Epoch Visual Anchor"
    />
  );
}
