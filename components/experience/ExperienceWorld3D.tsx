'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import {
  Sparkles,
  Compass,
  Eye,
  RotateCcw,
  Maximize2,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Navigation,
  X,
  Play,
  Pause,
} from 'lucide-react';
import { PLACES_BY_SLUG, ExperiencePlace } from '@/lib/experienceData';

interface ExperienceWorld3DProps {
  isMr: boolean;
}

interface Landmark3D {
  id: string;
  slug: string;
  name: string;
  nameMr: string;
  tagline: string;
  taglineMr: string;
  position: [number, number, number]; // x, y, z in 3D world space
  color: number;
  beaconHeight: number;
  highlightYear: string;
}

const LANDMARKS_3D: Landmark3D[] = [
  {
    id: 'shaniwar-wada',
    slug: 'shaniwar-wada',
    name: 'Shaniwar Wada',
    nameMr: 'शनिवार वाडा',
    tagline: 'Imperial Citadel of the Peshwas (1732 CE)',
    taglineMr: 'पेशवेकालीन imperial राजधानी (१७३२)',
    position: [0, 2.5, 0],
    color: 0xf59e0b, // Amber Gold
    beaconHeight: 8,
    highlightYear: '1732 CE',
  },
  {
    id: 'sinhagad-fort',
    slug: 'sinhagad-fort',
    name: 'Sinhagad Fort',
    nameMr: 'सिंहगड किल्ला',
    tagline: 'Sahyadri Cloud Peak of Tanaji Malusare (1312m)',
    taglineMr: 'नरवीर तानाजी मालुसरे यांचा अजिंक्य गड',
    position: [-22, 11, -16],
    color: 0x10b981, // Emerald Forest
    beaconHeight: 14,
    highlightYear: '1670 CE',
  },
  {
    id: 'aga-khan-palace',
    slug: 'aga-khan-palace',
    name: 'Aga Khan Palace',
    nameMr: 'आगाखान पॅलेस',
    tagline: 'Italianate Freedom Sanctuary & Gandhi Memorial',
    taglineMr: 'स्वातंत्र्यलढ्याची पावन भूमी व गांधी स्मारक',
    position: [18, 3.5, -8],
    color: 0x38bdf8, // Sky Blue
    beaconHeight: 9,
    highlightYear: '1892 CE',
  },
  {
    id: 'pataleshwar-cave-temple',
    slug: 'pataleshwar-cave-temple',
    name: 'Pataleshwar Cave Temple',
    nameMr: 'पाताळेश्वर लेणी',
    tagline: '8th-Century Monolithic Rock-Cut Basalt Shrine',
    taglineMr: '८व्या शतकातील राष्ट्रकूटकालीन अखंड पाषाण लेणी',
    position: [-4, 1.8, 6],
    color: 0xd97706, // Deep Ochre
    beaconHeight: 7,
    highlightYear: '8th Century',
  },
  {
    id: 'parvati-hill',
    slug: 'parvati-hill',
    name: 'Parvati Hill Summit',
    nameMr: 'पार्वती टेकडी',
    tagline: 'Historic Peshwa Devdeveshwar Shrine & 360° Vista',
    taglineMr: 'पुण्याच्या विहंगम दृश्यांसह पेशवेकालीन देवदेवेश्वर',
    position: [-8, 7.5, 12],
    color: 0xec4899, // Rose Gold
    beaconHeight: 11,
    highlightYear: '1749 CE',
  },
  {
    id: 'khadakwasla-dam',
    slug: 'khadakwasla-dam',
    name: 'Khadakwasla Dam',
    nameMr: 'खडकवासला धरण',
    tagline: 'The Lifeline Reservoir at the Foothills of Sinhagad',
    taglineMr: 'पुण्याची जीवनवाहिनी व निसर्गरम्य जलाशय',
    position: [-16, 2, -4],
    color: 0x06b6d4, // Cyan Lake
    beaconHeight: 8,
    highlightYear: '1879 CE',
  },
];

export default function ExperienceWorld3D({ isMr }: ExperienceWorld3DProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark3D | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<Landmark3D | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [cameraView, setCameraView] = useState<'overview' | 'citadel' | 'fortress' | 'palace'>('overview');

  // Three.js instances ref
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    terrainGroup: THREE.Group;
    beaconMeshes: Map<string, THREE.Mesh>;
    controls: {
      targetPosition: THREE.Vector3;
      targetLookAt: THREE.Vector3;
      currentLookAt: THREE.Vector3;
      isUserInteracting: boolean;
    };
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect mobile for LOD budgeting
    const isMobile = window.innerWidth <= 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(24, 28, 42);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    sunLight.position.set(40, 50, 30);
    sunLight.castShadow = !isMobile;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-35, 20, -40);
    scene.add(rimLight);

    // 3. Terrain & Geographic Architecture
    const terrainGroup = new THREE.Group();

    // Stylized Deccan Basalt Plateau Terrain Mesh
    const terrainSegments = isMobile ? 40 : 80;
    const terrainGeo = new THREE.PlaneGeometry(80, 80, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Elevated Sahyadri ridge towards west (negative X)
      let elevation = 0;
      if (vx < -5) {
        elevation += Math.pow(Math.abs(vx + 5) / 10, 1.8) * 3.5;
      }
      // Sinhagad peak mound around [-22, -16]
      const distSinhagad = Math.hypot(vx - (-22), vz - (-16));
      if (distSinhagad < 12) {
        elevation += Math.cos((distSinhagad / 12) * (Math.PI / 2)) * 10;
      }
      // Parvati hill mound around [-8, 12]
      const distParvati = Math.hypot(vx - (-8), vz - 12);
      if (distParvati < 8) {
        elevation += Math.cos((distParvati / 8) * (Math.PI / 2)) * 6.5;
      }
      // Mula-Mutha river trench
      const riverDist = Math.abs(vz - (vx * 0.2 - 2));
      if (riverDist < 3.5) {
        elevation -= (1 - riverDist / 3.5) * 1.5;
      }

      pos.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x131d2e,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isMobile;
    terrainGroup.add(terrainMesh);

    // Wireframe Grid Overlay for futuristic topological depth
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
    terrainGroup.add(wireMesh);

    // Mula-Mutha Confluence Water Ribbon
    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-35, 0.4, -9),
      new THREE.Vector3(-18, 0.5, -4),
      new THREE.Vector3(0, 0.6, -2),
      new THREE.Vector3(18, 0.5, 2),
      new THREE.Vector3(38, 0.4, 6),
    ]);
    const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 1.6, 8, false);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    terrainGroup.add(riverMesh);

    scene.add(terrainGroup);

    // 4. Interactive 3D Landmark Beacons & Citadels
    const beaconMeshes = new Map<string, THREE.Mesh>();

    LANDMARKS_3D.forEach((l) => {
      const landmarkGroup = new THREE.Group();
      landmarkGroup.position.set(...l.position);

      // Base Pillar / Architectural Symbol
      const baseGeo = new THREE.CylinderGeometry(1.4, 1.8, 1.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({
        color: l.color,
        roughness: 0.3,
        metalness: 0.7,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      landmarkGroup.add(baseMesh);

      // Glowing Vertical Beacon Beam
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.3, l.beaconHeight, 8);
      beamGeo.translate(0, l.beaconHeight / 2, 0);
      const beamMat = new THREE.MeshBasicMaterial({
        color: l.color,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      landmarkGroup.add(beamMesh);

      // Crown Floating Jewel / Octahedron
      const crownGeo = new THREE.OctahedronGeometry(1.1, 0);
      const crownMat = new THREE.MeshStandardMaterial({
        color: l.color,
        emissive: l.color,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
      });
      const crownMesh = new THREE.Mesh(crownGeo, crownMat);
      crownMesh.position.y = l.beaconHeight;
      crownMesh.name = l.id; // Raycaster target
      landmarkGroup.add(crownMesh);

      // Pulsing Ground Pulse Ring
      const ringGeo = new THREE.RingGeometry(2, 2.6, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: l.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.05;
      landmarkGroup.add(ringMesh);

      scene.add(landmarkGroup);
      beaconMeshes.set(l.id, crownMesh);
    });

    // 5. Ambient Atmospheric Dust / Particles
    const dustCount = isMobile ? 300 : 900;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 80;
      dustPos[i * 3 + 1] = Math.random() * 25 + 1;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: isMobile ? 0.8 : 1.2,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // 6. Camera Animation & Controls State
    const controls = {
      targetPosition: new THREE.Vector3(24, 28, 42),
      targetLookAt: new THREE.Vector3(0, 4, 0),
      currentLookAt: new THREE.Vector3(0, 4, 0),
      isUserInteracting: false,
    };

    threeRef.current = {
      scene,
      camera,
      renderer,
      terrainGroup,
      beaconMeshes,
      controls,
    };

    // 7. Raycaster Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown && !('touches' in e && e.touches.length > 1)) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        prevMouseX = clientX;
        prevMouseY = clientY;

        // Manual orbit orbit yaw/pitch
        const radius = camera.position.distanceTo(controls.currentLookAt);
        const theta = Math.atan2(camera.position.x - controls.currentLookAt.x, camera.position.z - controls.currentLookAt.z) - deltaX * 0.005;
        let phi = Math.asin((camera.position.y - controls.currentLookAt.y) / radius) + deltaY * 0.005;
        phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, phi));

        camera.position.x = controls.currentLookAt.x + radius * Math.cos(phi) * Math.sin(theta);
        camera.position.y = controls.currentLookAt.y + radius * Math.sin(phi);
        camera.position.z = controls.currentLookAt.z + radius * Math.cos(phi) * Math.cos(theta);
        controls.targetPosition.copy(camera.position);
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isMouseDown = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const interactiveTargets = Array.from(beaconMeshes.values());
      const intersects = raycaster.intersectObjects(interactiveTargets);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const landmark = LANDMARKS_3D.find((l) => l.id === hit.name);
        if (landmark) {
          handleFlyTo(landmark);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove, { passive: true });
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('click', onClick);

    // 8. Render Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera position and target lerping
      camera.position.lerp(controls.targetPosition, 0.045);
      controls.currentLookAt.lerp(controls.targetLookAt, 0.045);
      camera.lookAt(controls.currentLookAt);

      // Auto-rotation around current lookAt center
      if (isAutoRotate && !isMouseDown) {
        const radius = Math.hypot(
          camera.position.x - controls.currentLookAt.x,
          camera.position.z - controls.currentLookAt.z
        );
        const currentAngle = Math.atan2(
          camera.position.z - controls.currentLookAt.z,
          camera.position.x - controls.currentLookAt.x
        );
        const newAngle = currentAngle + 0.002;
        camera.position.x = controls.currentLookAt.x + radius * Math.cos(newAngle);
        camera.position.z = controls.currentLookAt.z + radius * Math.sin(newAngle);
        controls.targetPosition.copy(camera.position);
      }

      // Rotate beacon jewels & bob vertical heights
      beaconMeshes.forEach((mesh) => {
        mesh.rotation.y = elapsedTime * 1.5;
        mesh.rotation.x = Math.sin(elapsedTime * 2) * 0.2;
      });

      // Hover Raycasting Check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(beaconMeshes.values()));
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const l = LANDMARKS_3D.find((x) => x.id === hit.name) || null;
        setHoveredLandmark(l);
        container.style.cursor = 'pointer';
      } else {
        setHoveredLandmark(null);
        container.style.cursor = isMouseDown ? 'grabbing' : 'grab';
      }

      // Subtle atmospheric dust rotation
      dustSystem.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);

      terrainGeo.dispose();
      terrainMat.dispose();
      wireMat.dispose();
      riverGeo.dispose();
      riverMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAutoRotate]);

  // Camera Fly-To action
  const handleFlyTo = (landmark: Landmark3D) => {
    setSelectedLandmark(landmark);
    if (!threeRef.current) return;
    const { controls } = threeRef.current;

    // Position camera slightly offset from the landmark
    const [lx, ly, lz] = landmark.position;
    controls.targetLookAt.set(lx, ly + 2, lz);
    controls.targetPosition.set(lx + 10, ly + 9, lz + 14);
  };

  const handleResetOverview = () => {
    setSelectedLandmark(null);
    setCameraView('overview');
    if (!threeRef.current) return;
    const { controls } = threeRef.current;
    controls.targetLookAt.set(0, 4, 0);
    controls.targetPosition.set(24, 28, 42);
  };

  const selectedPlaceData: ExperiencePlace | undefined = selectedLandmark
    ? PLACES_BY_SLUG[selectedLandmark.slug]
    : undefined;

  return (
    <section id="world3d" className="exp-section exp-world3d-section" aria-label="3D Digital Pune Landscape">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Sparkles size={14} />
            <span>{isMr ? 'स्वाक्षरी ३डी अनुभव • डिजिटल पुणे' : 'SIGNATURE 3D EXPERIENCE • DIGITAL WORLD'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्याचा डिजिटल भूगोल अनुभवा' : 'Explore Pune as a Digital World'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'सह्याद्रीच्या डोंगररांगा, ऐतिहासिक शनिवार वाडा, सिंहगड आणि आगाखान पॅलेसचा त्रिमितीय (3D) डिजिटल प्रवास.'
              : 'Fly through an artistic 3D representation of Pune’s Deccan plateau. Rotate the terrain, discover architectural beacons, and delve into verified landmark dossiers.'}
          </p>
        </div>

        {/* 3D Viewport Stage */}
        <div className="exp-3d-stage-card">
          {/* Top Control Bar */}
          <div className="exp-3d-topbar">
            {/* Camera Presets */}
            <div className="exp-3d-presets">
              <button
                type="button"
                onClick={handleResetOverview}
                className={`exp-preset-btn ${!selectedLandmark ? 'active' : ''}`}
              >
                <Compass size={14} />
                <span>{isMr ? 'संपूर्ण देखावा' : 'Deccan Overview'}</span>
              </button>

              {LANDMARKS_3D.slice(0, 4).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleFlyTo(l)}
                  className={`exp-preset-btn ${selectedLandmark?.id === l.id ? 'active' : ''}`}
                >
                  <span className="dot" style={{ backgroundColor: `#${l.color.toString(16)}` }} />
                  <span>{isMr ? l.nameMr : l.name}</span>
                </button>
              ))}
            </div>

            {/* Orbit / Play Controls */}
            <div className="exp-3d-controls-right">
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`exp-tool-btn ${isAutoRotate ? 'active' : ''}`}
                title={isAutoRotate ? 'Pause 3D orbit' : 'Start 3D auto orbit'}
                aria-label={isAutoRotate ? 'Pause 3D auto orbit' : 'Start 3D auto orbit'}
              >
                {isAutoRotate ? <Pause size={15} /> : <Play size={15} />}
              </button>

              <button
                type="button"
                onClick={handleResetOverview}
                className="exp-tool-btn"
                title="Reset Camera"
                aria-label="Reset camera view"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Three.js Canvas Container */}
          <div ref={canvasRef} className="exp-3d-viewport">
            {/* Instruction Overlay */}
            <div className="exp-3d-hint-pill" aria-hidden="true">
              <span>{isMr ? '३डी फिरवण्यासाठी ड्रॅग करा • क्लिक करून माहिती उघडा' : 'Drag to Orbit 3D Terrain • Click Landmark to Fly In'}</span>
            </div>

            {/* Hover Tooltip Card */}
            {hoveredLandmark && !selectedLandmark && (
              <div className="exp-3d-hover-tooltip">
                <span className="year">{hoveredLandmark.highlightYear}</span>
                <h4 className="title">{isMr ? hoveredLandmark.nameMr : hoveredLandmark.name}</h4>
                <p className="sub">{isMr ? hoveredLandmark.taglineMr : hoveredLandmark.tagline}</p>
                <span className="action">{isMr ? 'क्लिक करून जवळ जा →' : 'Click to fly in →'}</span>
              </div>
            )}
          </div>

          {/* Bottom Active Landmark Floating Drawer */}
          {selectedLandmark && selectedPlaceData && (
            <div className="exp-3d-dossier-card">
              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                className="exp-dossier-close"
                aria-label="Close dossier"
              >
                <X size={18} />
              </button>

              <div className="exp-dossier-media">
                <Image
                  src={selectedPlaceData.image_url}
                  alt={selectedLandmark.name}
                  fill
                  sizes="260px"
                  className="img"
                />
                <div className="badge">
                  {selectedLandmark.highlightYear}
                </div>
              </div>

              <div className="exp-dossier-body">
                <div className="kicker">
                  <ShieldCheck size={13} style={{ color: '#10b981' }} />
                  <span>{selectedPlaceData.category} • Verified Monument</span>
                </div>

                <h3 className="name">
                  {isMr ? selectedLandmark.nameMr : selectedLandmark.name}
                </h3>

                <p className="tagline">
                  {isMr ? selectedLandmark.taglineMr : selectedLandmark.tagline}
                </p>

                <p className="desc">
                  {selectedPlaceData.description.slice(0, 160)}…
                </p>

                <div className="meta-row">
                  <div className="meta-item">
                    <MapPin size={12} />
                    <span>{selectedPlaceData.address.split(',')[0]}</span>
                  </div>
                  {selectedPlaceData.opening_hours && (
                    <div className="meta-item">
                      <Clock size={12} />
                      <span>{selectedPlaceData.opening_hours}</span>
                    </div>
                  )}
                </div>

                <div className="actions">
                  <Link
                    href={`/places/${selectedLandmark.slug}`}
                    className="exp-btn-primary mini"
                  >
                    <span>{isMr ? 'संपूर्ण वारसा माहिती' : 'Explore Monument'}</span>
                    <ExternalLink size={14} />
                  </Link>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlaceData.latitude},${selectedPlaceData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="exp-btn-secondary mini"
                  >
                    <Navigation size={14} />
                    <span>{isMr ? 'मार्गदर्शन' : 'Directions'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
