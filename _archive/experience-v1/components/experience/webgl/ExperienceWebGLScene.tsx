'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { palette } from '@/components/experience/tokens/tokens';
import { getMapPlacePins, MapPin } from '@/lib/experience/selectors';
import { DeccanTerrain, geoToWorld } from './DeccanTerrain';
import { PuneSkyDome } from './SkyShader';
import { PerformanceMonitor } from './PerformanceMonitor';
import { ExperienceWebGLSceneProps, PuneWeatherData, CameraMode } from './types';
import { Sun, CloudSun, Compass, ShieldCheck } from 'lucide-react';

// Camera Waypoints for different experience modes
const CAMERA_WAYPOINTS: Record<CameraMode, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  arrival: {
    // Over Sahyadri ridge looking toward Sinhagad & Pune basin
    pos: new THREE.Vector3(-48, 28, 62),
    target: new THREE.Vector3(-15, 6, 20),
  },
  epochs: {
    // Close focus stage on central historic grounds
    pos: new THREE.Vector3(-12, 10, 16),
    target: new THREE.Vector3(-0.4, 2.5, 0.3),
  },
  map: {
    // 45° isometric cartographic bird's-eye view over Pune basin
    pos: new THREE.Vector3(0, 48, 48),
    target: new THREE.Vector3(0, 0, 0),
  },
  free: {
    pos: new THREE.Vector3(20, 32, 40),
    target: new THREE.Vector3(0, 2, 0),
  },
  focus: {
    pos: new THREE.Vector3(0, 14, 16),
    target: new THREE.Vector3(0, 2, 0),
  },
};

// Category colors for 3D map pins
const CATEGORY_COLORS: Record<string, number> = {
  forts: 0xea580c,     // Peshwa Saffron
  heritage: 0xf59e0b,  // Paithani Gold
  temples: 0xd97706,   // Teak Ochre
  nature: 0x10b981,    // Sahyadri Emerald
  parks: 0x059669,     // Deep Emerald
  food: 0xf97316,      // Saffron Flame
  museums: 0x38bdf8,   // Monsoon Blue
};

export default function ExperienceWebGLScene({
  activeChapter = 'arrival',
  scrollProgress = 0,
  cameraMode: overrideCameraMode,
  selectedPlaceSlug = null,
  onPlaceSelect,
  className = '',
  isInteractive = true,
  showMapPins = true,
  highlightCategory = null,
}: ExperienceWebGLSceneProps) {
  const { isLiteMode, prefersReducedMotion, lang, isMr } = useExperience();
  const containerRef = useRef<HTMLDivElement>(null);

  // Live Pune Weather state
  const [weather, setWeather] = useState<PuneWeatherData>({
    temp: 28,
    humidity: 48,
    windSpeed: 8,
    conditionEn: 'Clear & Pleasant',
    conditionMr: 'निरभ्र व आल्हाददायक',
    icon: '☀️',
  });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const terrainRef = useRef<DeccanTerrain | null>(null);
  const skyRef = useRef<PuneSkyDome | null>(null);
  const perfMonitorRef = useRef<PerformanceMonitor | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Camera animation target
  const currentCamPos = useRef(new THREE.Vector3(-48, 28, 62));
  const currentCamTarget = useRef(new THREE.Vector3(-15, 6, 20));
  const desiredCamPos = useRef(new THREE.Vector3(-48, 28, 62));
  const desiredCamTarget = useRef(new THREE.Vector3(-15, 6, 20));

  // Determine effective camera mode
  const effectiveMode: CameraMode = useMemo(() => {
    if (overrideCameraMode) return overrideCameraMode;
    if (activeChapter === 'arrival') return 'arrival';
    if (activeChapter === 'epochs') return 'epochs';
    if (activeChapter === 'map') return 'map';
    return 'map';
  }, [overrideCameraMode, activeChapter]);

  // Fetch live Pune weather from internal API
  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        const res = await fetch('/api/v1/weather');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setWeather(data);
            if (skyRef.current) {
              skyRef.current.updateWeather(data);
            }
          }
        }
      } catch (e) {
        // Fallback already pre-set
      }
    }
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update desired camera waypoint when mode or selection changes
  useEffect(() => {
    if (selectedPlaceSlug && pinMeshesRef.current.has(selectedPlaceSlug)) {
      const pinObj = pinMeshesRef.current.get(selectedPlaceSlug);
      if (pinObj) {
        const pinPos = pinObj.position;
        desiredCamTarget.current.copy(pinPos);
        // Position camera in 45° isometric angle relative to selected place
        desiredCamPos.current.set(pinPos.x + 12, pinPos.y + 14, pinPos.z + 14);
        return;
      }
    }

    const waypoint = CAMERA_WAYPOINTS[effectiveMode] || CAMERA_WAYPOINTS.map;
    desiredCamPos.current.copy(waypoint.pos);
    desiredCamTarget.current.copy(waypoint.target);

    // Apply scroll scrub displacement in arrival/map mode
    if (effectiveMode === 'arrival') {
      desiredCamPos.current.y -= scrollProgress * 6;
      desiredCamPos.current.z -= scrollProgress * 10;
    }
  }, [effectiveMode, selectedPlaceSlug, scrollProgress]);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    // Hard Rule #4: In Calm/Lite mode or reduced-motion, DO NOT initialize WebGL
    if (isLiteMode || prefersReducedMotion || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.name = 'ExplorePuneExperienceScene';
    scene.fog = new THREE.FogExp2(0x080b11, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    const initialWaypoint = CAMERA_WAYPOINTS[effectiveMode] || CAMERA_WAYPOINTS.arrival;
    camera.position.copy(initialWaypoint.pos);
    camera.lookAt(initialWaypoint.target);
    currentCamPos.current.copy(initialWaypoint.pos);
    currentCamTarget.current.copy(initialWaypoint.target);
    cameraRef.current = camera;

    // 3. Renderer with Dynamic DPR Cap
    const perf = new PerformanceMonitor({
      onDowngrade: () => {
        if (rendererRef.current) {
          rendererRef.current.setPixelRatio(1.0);
          rendererRef.current.shadowMap.enabled = false;
        }
      },
    });
    perfMonitorRef.current = perf;

    const renderer = new THREE.WebGLRenderer({
      antialias: !perf.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      precision: perf.isMobile ? 'mediump' : 'highp',
    });
    perf.applyToRenderer(renderer);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !perf.isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    sunLight.position.set(40, 80, 50);
    sunLight.castShadow = !perf.isMobile;
    if (sunLight.shadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 250;
      sunLight.shadow.camera.left = -60;
      sunLight.shadow.camera.right = 60;
      sunLight.shadow.camera.top = 60;
      sunLight.shadow.camera.bottom = -60;
    }
    scene.add(sunLight);

    // Warm Shaniwar Wada & Sinhagad beacon lights
    const sinhagadTorch = new THREE.PointLight(0xea580c, 1.2, 45, 1.2);
    sinhagadTorch.position.set(-31, 19, 47);
    scene.add(sinhagadTorch);

    const wadaDiya = new THREE.PointLight(0xf59e0b, 1.0, 30, 1.4);
    wadaDiya.position.set(-0.4, 3.5, 0.3);
    scene.add(wadaDiya);

    // 5. Sky Shader
    const sky = new PuneSkyDome();
    sky.updateWeather(weather);
    scene.add(sky.mesh);
    skyRef.current = sky;

    // 6. Deccan Basalt Terrain
    const terrain = new DeccanTerrain();
    scene.add(terrain.group);
    terrainRef.current = terrain;

    // 7. 3D Map Pins Group
    const pinsGroup = new THREE.Group();
    pinsGroup.name = 'MapPinsGroup';
    pinsGroupRef.current = pinsGroup;
    scene.add(pinsGroup);

    const allPins = getMapPlacePins();
    const pinGeos: THREE.BufferGeometry[] = [];
    const pinMats: THREE.Material[] = [];

    // Reusable pin base geometry & beacon
    const pinHeadGeo = new THREE.OctahedronGeometry(0.38, 0);
    const pinStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6);
    const pinRingGeo = new THREE.RingGeometry(0.3, 0.55, 12);
    pinRingGeo.rotateX(-Math.PI / 2);

    pinGeos.push(pinHeadGeo, pinStemGeo, pinRingGeo);

    allPins.forEach((pin: MapPin) => {
      const [wx, wy, wz] = geoToWorld(pin.latitude, pin.longitude);
      const pinObj = new THREE.Group();
      pinObj.position.set(wx, wy, wz);
      pinObj.userData = { slug: pin.slug, pinData: pin };

      const baseColor = CATEGORY_COLORS[pin.categorySlug] || 0xf59e0b;

      const headMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7,
      });
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ringMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });

      pinMats.push(headMat, stemMat, ringMat);

      // Assemble Pin
      const stemMesh = new THREE.Mesh(pinStemGeo, stemMat);
      stemMesh.position.y = 0.45;
      pinObj.add(stemMesh);

      const headMesh = new THREE.Mesh(pinHeadGeo, headMat);
      headMesh.position.y = 1.1;
      pinObj.add(headMesh);

      const ringMesh = new THREE.Mesh(pinRingGeo, ringMat);
      ringMesh.position.y = 0.05;
      pinObj.add(ringMesh);

      pinsGroup.add(pinObj);
      pinMeshesRef.current.set(pin.slug, pinObj);
    });

    // 8. Raycasting for Pin Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!isInteractive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinsGroup.children, true);

      if (intersects.length > 0) {
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && !hitObject.userData.slug && hitObject.parent) {
          hitObject = hitObject.parent;
        }
        if (hitObject?.userData?.slug) {
          onPlaceSelect?.(hitObject.userData.slug);
        }
      }
    };

    container.addEventListener('click', handlePointerDown);

    // 9. Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Pause when Offscreen Observer
    let isVisible = true;
    const cleanupVisibility = PerformanceMonitor.observeVisibility(
      container,
      (visible) => {
        isVisible = visible;
      }
    );

    // 11. Render Loop
    let clock = new THREE.Clock();

    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause execution offscreen

      perf.tick(timestamp);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update dynamic terrain river Caustics & Sky Shader
      terrain.update(delta);
      sky.update(delta);

      // Flickering torch & diya lights
      sinhagadTorch.intensity = 1.2 + Math.sin(elapsed * 9.0) * 0.25;
      wadaDiya.intensity = 1.0 + Math.cos(elapsed * 7.5) * 0.2;

      // Animate pin heads rotation & floating pulse
      if (pinsGroup.visible) {
        pinsGroup.children.forEach((child, idx) => {
          const head = child.children[1];
          if (head) {
            head.rotation.y = elapsed * 1.5 + idx * 0.1;
            head.position.y = 1.1 + Math.sin(elapsed * 2.5 + idx) * 0.08;
          }
        });
      }

      // Smooth Camera Flight Lerp
      currentCamPos.current.lerp(desiredCamPos.current, 0.045);
      currentCamTarget.current.lerp(desiredCamTarget.current, 0.045);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentCamTarget.current);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // 12. Strict Disposal on Unmount
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      cleanupVisibility();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handlePointerDown);

      // Dispose Terrain & Sky
      terrain.dispose();
      sky.dispose();

      // Dispose Pin geometries & materials
      pinGeos.forEach((g) => g.dispose());
      pinMats.forEach((m) => m.dispose());
      pinMeshesRef.current.clear();

      // Traverse Scene to catch any orphan meshes
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      // Dispose lights, renderer & remove canvas
      ambientLight.dispose();
      sunLight.dispose();
      sinhagadTorch.dispose();
      wadaDiya.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [isLiteMode, prefersReducedMotion, isInteractive, onPlaceSelect]);

  // Update pin visibility and filter highlights dynamically
  useEffect(() => {
    if (!pinsGroupRef.current) return;
    pinsGroupRef.current.visible = showMapPins;

    pinMeshesRef.current.forEach((obj, slug) => {
      const pin = obj.userData.pinData as MapPin | undefined;
      if (!pin) return;

      const matchesCategory =
        !highlightCategory ||
        highlightCategory === 'all' ||
        pin.categorySlug === highlightCategory;
      const isSelected = selectedPlaceSlug === slug;

      obj.visible = matchesCategory;

      // Scale up selected pin
      if (isSelected) {
        obj.scale.set(1.6, 1.6, 1.6);
      } else {
        obj.scale.set(1.0, 1.0, 1.0);
      }
    });
  }, [showMapPins, highlightCategory, selectedPlaceSlug]);

  // CALM / LITE MODE FALLBACK (?lite=1 or reduced motion)
  if (isLiteMode || prefersReducedMotion) {
    return (
      <div
        className={`exp-webgl-lite-fallback ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '480px',
          background: `radial-gradient(circle at 50% 25%, ${palette.basalt[800]} 0%, ${palette.basalt[950]} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.parchment[600],
          overflow: 'hidden',
          padding: '2rem',
          borderRadius: '16px',
          border: `1px solid ${palette.stone[700]}`,
        }}
        aria-label="Deccan Basalt Plateau Static Cartographic View"
      >
        {/* Subtle SVG Deccan Basalt Elevation & River Lines */}
        <svg
          viewBox="0 0 800 400"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.18,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {/* Sahyadri Ridge profile */}
          <path
            d="M 0 280 Q 150 180 300 240 T 600 210 T 800 290 L 800 400 L 0 400 Z"
            fill={palette.stone[800]}
          />
          {/* Sinhagad peak silhouette */}
          <polygon
            points="180,260 220,160 260,160 300,260"
            fill={palette.saffron[900]}
            opacity="0.4"
          />
          {/* Mula-Mutha river ribbon */}
          <path
            d="M 50 350 C 200 320, 350 380, 500 330 S 750 340, 800 360"
            fill="none"
            stroke={palette.monsoon[500]}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* Live Weather Pill HUD */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.5rem 1rem',
            background: 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${palette.saffron[600]}`,
            borderRadius: '999px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>{weather.icon}</span>
          <span>
            {weather.temp}°C • {isMr ? weather.conditionMr : weather.conditionEn}
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ color: palette.saffron[400] }}>
            {isMr ? 'पुणे शांत मोड (Calm Mode)' : 'Pune Calm Mode Active'}
          </span>
        </div>

        <h3
          style={{
            position: 'relative',
            zIndex: 2,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: palette.gold[400],
            textAlign: 'center',
            margin: '0 0 0.5rem 0',
          }}
        >
          {isMr ? 'दख्खनचे पठार व सह्याद्रीच्या रांगा' : 'The Deccan Plateau & Sahyadri Ridges'}
        </h3>

        <p
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '560px',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            textAlign: 'center',
            color: palette.stone[300],
            margin: 0,
          }}
        >
          {isMr
            ? 'सिंहगड, शनिवार वाडा आणि मुळा-मुठा नद्यांच्या खोऱ्यातील १०६ अधिकृत ऐतिहासिक व निसर्गरम्य स्थळांचा नकाशा.'
            : 'Explore 106 verified historical sanctuaries, Sahyadri fortresses, and Peshwa wadas resting upon ancient volcanic basalt.'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`exp-webgl-viewport ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        overflow: 'hidden',
        cursor: isInteractive ? 'grab' : 'default',
      }}
      aria-label="Interactive 3D Deccan Basalt Terrain and Living Map View"
    />
  );
}
