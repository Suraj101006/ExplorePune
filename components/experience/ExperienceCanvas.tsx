'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ExperienceCanvasProps {
  currentScene?: number;
}

export default function ExperienceCanvas({ currentScene = 1 }: ExperienceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Detect mobile for particle LOD budgeting
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 800 : 2500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040406, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Cosmic Particulate Galaxy
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color(0xd4af37);
    const amberColor = new THREE.Color(0xf59e0b);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical / spherical cosmic field
      const r = 40 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi) * 1.5;
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? goldColor : Math.random() > 0.3 ? amberColor : cyanColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.4 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 3. Central Sculptural 3D Geometry (Scene 5 Focus: Golden Icosahedron & Ring)
    const sculptureGroup = new THREE.Group();

    // Geometric Core: Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(14, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true,
      emissive: 0x3d2800,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sculptureGroup.add(coreMesh);

    // Orbital Ring: Torus
    const ringGeometry = new THREE.TorusGeometry(22, 0.6, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x1f1400,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    sculptureGroup.add(ringMesh);

    sculptureGroup.position.set(0, 0, -20);
    scene.add(sculptureGroup);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3, 200);
    amberLight.position.set(40, 50, 40);
    scene.add(amberLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 2, 200);
    cyanLight.position.set(-40, -30, 20);
    scene.add(cyanLight);

    // 5. Mouse & Scroll Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.0008;
        mouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.0008;
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate cosmic particles
      particleSystem.rotation.y = elapsedTime * 0.04 + targetX;
      particleSystem.rotation.x = elapsedTime * 0.02 + targetY;

      // Sculpture dynamic motion
      coreMesh.rotation.x = elapsedTime * 0.15;
      coreMesh.rotation.y = elapsedTime * 0.25;
      ringMesh.rotation.z = elapsedTime * 0.2;
      ringMesh.rotation.y = elapsedTime * 0.1;

      // Scroll-driven camera parallax
      const scrollProgress = Math.min(scrollY / 4000, 1);
      camera.position.z = 80 - scrollProgress * 50;
      camera.position.y = -scrollProgress * 20 + targetY * 15;
      camera.position.x = targetX * 20;
      camera.lookAt(0, -scrollProgress * 10, -20);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="exp-canvas-container" aria-hidden="true" />;
}
