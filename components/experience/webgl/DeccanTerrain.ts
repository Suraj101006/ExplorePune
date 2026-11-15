/**
 * Deccan Basalt Low-Poly Terrain Generator
 * Features:
 * - Sahyadri western mountain ridge with stepped volcanic basalt traps
 * - Sinhagad fort table-top peak (1312m relative summit) with ramparts
 * - Shaniwar Wada central river basin courtyard plinth with bastions
 * - Mula-Mutha river ribbon with shimmering wave displacement
 * - Instanced Deccan boulders & native acacia/teak vegetation
 * - Precise Geo-to-World coordinate projection for all 106 Pune places
 */

import * as THREE from 'three';
import { palette } from '@/components/experience/tokens/tokens';

// Reference anchor: Zero Stone Pune (City Center)
export const PUNE_CENTER_GEO = {
  lat: 18.5204,
  lng: 73.8567,
};

// Coordinate scaling: 1 deg lat ~ 111 km, 1 deg lng ~ 105 km
// In our 3D world, scale factor maps ~35 km to ~50-60 world units.
const SCALE_X = 280; // Longitude (West -> East)
const SCALE_Z = 300; // Latitude (North -> South, inverted Z)

/**
 * Converts real-world GPS coordinates into 3D world space (X, Y, Z)
 */
export function geoToWorld(lat: number, lng: number): [number, number, number] {
  const x = (lng - PUNE_CENTER_GEO.lng) * SCALE_X;
  const z = -(lat - PUNE_CENTER_GEO.lat) * SCALE_Z;
  const y = getTerrainHeightAt(x, z);
  return [x, y, z];
}

/**
 * Calculates elevation at any (x, z) world point
 */
export function getTerrainHeightAt(x: number, z: number): number {
  let elevation = 1.0;

  // 1. Sahyadri Ridge in the West (x < -15)
  if (x < -10) {
    const ridgeDist = Math.abs(x + 10);
    // Stepped basalt traps profile (terraced slopes)
    const rawStep = Math.sin(ridgeDist * 0.4) * 1.5 + ridgeDist * 0.65;
    const terrace = Math.floor(rawStep / 2.2) * 2.2 + (rawStep % 2.2) * 0.3;
    elevation += Math.min(22, terrace);
  }

  // 2. Sinhagad Fort Mound: table-top mountain around (-32, 46)
  const distToSinhagad = Math.hypot(x - (-31), z - 47);
  if (distToSinhagad < 14) {
    const peakHeight = Math.max(0, 1 - distToSinhagad / 14);
    // Flat top mesa profile with steep cliffs
    const steepFactor = Math.pow(peakHeight, 0.45);
    elevation += steepFactor * 16.5;
  }

  // 3. Purandar & Southern Ghats (further south-east: x ~ 10..25, z ~ 55..75)
  const distToPurandar = Math.hypot(x - 18, z - 68);
  if (distToPurandar < 16) {
    const purandarPeak = Math.max(0, 1 - distToPurandar / 16);
    elevation += Math.pow(purandarPeak, 0.5) * 14.0;
  }

  // 4. Parvati Hill (x: -2.5, z: 7.5)
  const distToParvati = Math.hypot(x - (-2.5), z - 7.5);
  if (distToParvati < 5.5) {
    elevation += Math.max(0, 1 - distToParvati / 5.5) * 4.5;
  }

  // 5. Vetal Tekdi / ARAI hills in west-central (x: -8.5, z: -2.5)
  const distToVetal = Math.hypot(x - (-8.5), z - (-2.5));
  if (distToVetal < 7.0) {
    elevation += Math.max(0, 1 - distToVetal / 7.0) * 5.0;
  }

  // 6. Mula-Mutha River Valley depression
  // River curve approximate spline: passes near (-12, 12) -> (-1, 0.5) -> (3, -2) -> (15, -4) -> (35, -2)
  const riverTrough = getDistanceToRiver(x, z);
  if (riverTrough < 4.0) {
    const riverDepth = (1.0 - riverTrough / 4.0) * 1.8;
    elevation -= riverDepth;
  }

  // 7. Shaniwar Wada Courtyard Plinth (x: -0.4, z: 0.3)
  const distToWada = Math.hypot(x - (-0.4), z - 0.3);
  if (distToWada < 2.8) {
    // Flattened raised court plinth
    elevation = Math.max(elevation, 1.8);
  }

  // Procedural low-poly ripple noise
  const lowNoise = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 0.6;
  return Math.max(0.2, elevation + lowNoise);
}

/**
 * Distance to the serpentine Mula-Mutha river path
 */
function getDistanceToRiver(x: number, z: number): number {
  // Approximate river polyline nodes
  const riverNodes = [
    [-30, 36],
    [-20, 22],
    [-10, 10],
    [-3, 3],
    [0, 0.5],
    [3.5, -2.5], // Sangam confluence
    [12, -4],
    [24, -3],
    [38, -1],
    [52, 2],
  ];

  let minDist = 999;
  for (let i = 0; i < riverNodes.length - 1; i++) {
    const p1 = riverNodes[i];
    const p2 = riverNodes[i + 1];
    const d = distToSegment(x, z, p1[0], p1[1], p2[0], p2[1]);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function distToSegment(
  px: number,
  pz: number,
  x1: number,
  z1: number,
  x2: number,
  z2: number
): number {
  const l2 = (x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1);
  if (l2 === 0) return Math.hypot(px - x1, pz - z1);
  let t = ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), pz - (z1 + t * (z2 - z1)));
}

export class DeccanTerrain {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];
  private riverMesh: THREE.Mesh | null = null;
  private riverMaterial: THREE.ShaderMaterial | null = null;
  private waterUniforms = {
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color(palette.monsoon[800]) },
    uColorShimmer: { value: new THREE.Color(palette.monsoon[500]) },
    uColorFoam: { value: new THREE.Color(palette.monsoon[200]) },
  };

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'DeccanTerrain';
    this.buildTerrain();
    this.buildRiverRibbon();
    this.buildSinhagadFortDetails();
    this.buildShaniwarWadaPlinth();
    this.buildInstancedBouldersAndTrees();
  }

  /**
   * Builds the primary low-poly Deccan basalt plateau
   */
  private buildTerrain(): void {
    const width = 140;
    const depth = 160;
    const segmentsX = 70;
    const segmentsZ = 80;

    const geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    geometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const basaltDark = new THREE.Color(palette.stone[900]);   // #1c1917
    const basaltMid = new THREE.Color(palette.stone[800]);    // #292524
    const weatheredStone = new THREE.Color(palette.basalt[600]); // #334155
    const mossEmerald = new THREE.Color(palette.emerald[800]); // #065f46
    const ridgeGold = new THREE.Color(palette.gold[900]);     // #713f12

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const height = getTerrainHeightAt(x, z);

      // Low-poly faceted stepping
      const steppedY = Math.round(height * 2.8) / 2.8;
      pos.setY(i, steppedY);

      // Procedural color mixing based on height & slope
      let vertexColor = basaltDark.clone();
      if (steppedY > 12) {
        // High Sahyadri ridge / Sinhagad summit: sun-baked basalt & dry grass
        vertexColor.lerp(ridgeGold, 0.35);
      } else if (steppedY > 5) {
        // Mid-altitude ramparts
        vertexColor.lerp(weatheredStone, 0.45);
      } else if (steppedY < 1.2) {
        // Riverbed / low valley: monsoon moss & deep fertile silt
        vertexColor.lerp(mossEmerald, 0.3);
      } else {
        vertexColor.lerp(basaltMid, 0.5);
      }

      colors[i * 3] = vertexColor.r;
      colors[i * 3 + 1] = vertexColor.g;
      colors[i * 3 + 2] = vertexColor.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = false;
    this.group.add(terrainMesh);

    this.disposables.push(geometry, material);
  }

  /**
   * Builds the shimmering Mula-Mutha river ribbon
   */
  private buildRiverRibbon(): void {
    const curvePoints = [
      new THREE.Vector3(-32, 0.3, 38),
      new THREE.Vector3(-22, 0.3, 24),
      new THREE.Vector3(-12, 0.3, 11),
      new THREE.Vector3(-4, 0.3, 3),
      new THREE.Vector3(0, 0.3, 0.5),
      new THREE.Vector3(3.5, 0.3, -2.5),
      new THREE.Vector3(12, 0.3, -4),
      new THREE.Vector3(25, 0.3, -3),
      new THREE.Vector3(38, 0.3, -1),
      new THREE.Vector3(55, 0.3, 2),
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const riverGeometry = new THREE.TubeGeometry(curve, 64, 1.4, 8, false);

    // Flatten tube into a ribbon
    const pos = riverGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) * 0.18 + 0.25);
    }
    riverGeometry.computeVertexNormals();

    // Custom dynamic river water shader
    this.riverMaterial = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms,
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normal;
          vec3 transformed = position;
          // Subtle vertex ripple
          transformed.y += sin(transformed.x * 0.8 + uTime * 2.5) * 0.05
                         + cos(transformed.z * 0.8 + uTime * 2.0) * 0.04;
          vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorDeep;
        uniform vec3 uColorShimmer;
        uniform vec3 uColorFoam;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          // Flowing caustic waves
          float wave1 = sin(vUv.x * 25.0 - uTime * 3.0) * 0.5 + 0.5;
          float wave2 = cos(vUv.y * 18.0 + uTime * 2.0) * 0.5 + 0.5;
          float flow = wave1 * wave2;

          vec3 baseColor = mix(uColorDeep, uColorShimmer, vUv.y * 0.6 + flow * 0.4);

          // Shimmering edge highlight & foam glint
          float edge = smoothstep(0.0, 0.25, abs(vUv.y - 0.5));
          vec3 finalColor = mix(baseColor, uColorFoam, flow * 0.35 + edge * 0.2);

          gl_FragColor = vec4(finalColor, 0.88);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.riverMesh = new THREE.Mesh(riverGeometry, this.riverMaterial);
    this.group.add(this.riverMesh);

    this.disposables.push(riverGeometry, this.riverMaterial);
  }

  /**
   * Sinhagad Fort table-top ramparts and Tanaji's bastion
   */
  private buildSinhagadFortDetails(): void {
    const sinhagadGroup = new THREE.Group();
    sinhagadGroup.position.set(-31, 16.5, 47);

    // Stone rampart perimeter
    const wallGeo = new THREE.CylinderGeometry(4.2, 4.8, 1.2, 12, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      color: palette.stone[700],
      roughness: 0.9,
      flatShading: true,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = 0.6;
    sinhagadGroup.add(wallMesh);

    // Maratha Saffron pennant mast (भगवा ध्वज)
    const mastGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.5, 6);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const mastMesh = new THREE.Mesh(mastGeo, mastMat);
    mastMesh.position.set(0, 2.0, 0);
    sinhagadGroup.add(mastMesh);

    // Saffron triangular flag
    const flagGeo = new THREE.ConeGeometry(0.7, 1.4, 3);
    flagGeo.rotateZ(Math.PI / 2);
    const flagMat = new THREE.MeshBasicMaterial({
      color: palette.saffron[600],
      side: THREE.DoubleSide,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.65, 3.2, 0);
    sinhagadGroup.add(flagMesh);

    this.group.add(sinhagadGroup);
    this.disposables.push(wallGeo, wallMat, mastGeo, mastMat, flagGeo, flagMat);
  }

  /**
   * Shaniwar Wada stone plinth, bastions, and Delhi Darwaza gate silhouette
   */
  private buildShaniwarWadaPlinth(): void {
    const wadaGroup = new THREE.Group();
    wadaGroup.position.set(-0.4, 1.8, 0.3);

    // Fortified base plinth
    const plinthGeo = new THREE.BoxGeometry(3.6, 0.5, 3.6);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: palette.stone[800],
      roughness: 0.8,
      flatShading: true,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = 0.25;
    wadaGroup.add(plinthMesh);

    // Octagonal Hazari Karanje fountain footprint in the center
    const fountainGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.15, 8);
    const fountainMat = new THREE.MeshStandardMaterial({
      color: palette.gold[700],
      metalness: 0.6,
      roughness: 0.3,
    });
    const fountainMesh = new THREE.Mesh(fountainGeo, fountainMat);
    fountainMesh.position.y = 0.55;
    wadaGroup.add(fountainMesh);

    // Delhi Darwaza gate towers
    const bastionGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.1, 7);
    const bastionMat = new THREE.MeshStandardMaterial({
      color: palette.stone[700],
      roughness: 0.85,
    });

    const leftBastion = new THREE.Mesh(bastionGeo, bastionMat);
    leftBastion.position.set(-1.1, 0.8, 1.8);
    wadaGroup.add(leftBastion);

    const rightBastion = new THREE.Mesh(bastionGeo, bastionMat);
    rightBastion.position.set(1.1, 0.8, 1.8);
    wadaGroup.add(rightBastion);

    this.group.add(wadaGroup);
    this.disposables.push(
      plinthGeo,
      plinthMat,
      fountainGeo,
      fountainMat,
      bastionGeo,
      bastionMat
    );
  }

  /**
   * Instanced Deccan basalt boulders & Acacia trees for high performance (< 2 draw calls)
   */
  private buildInstancedBouldersAndTrees(): void {
    // 1. Instanced Boulders (70 boulders)
    const boulderCount = 70;
    const boulderGeo = new THREE.DodecahedronGeometry(0.55, 0);
    const boulderMat = new THREE.MeshStandardMaterial({
      color: palette.stone[700],
      roughness: 0.95,
      flatShading: true,
    });
    const boulderMesh = new THREE.InstancedMesh(boulderGeo, boulderMat, boulderCount);
    boulderMesh.castShadow = false;
    boulderMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < boulderCount; i++) {
      // Scatter predominantly on Sahyadri western slope and hills
      const x = -50 + Math.random() * 80;
      const z = -60 + Math.random() * 120;
      const y = getTerrainHeightAt(x, z);

      dummy.position.set(x, y + 0.2, z);
      const scale = 0.6 + Math.random() * 1.2;
      dummy.scale.set(scale, scale * (0.6 + Math.random() * 0.6), scale);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.updateMatrix();
      boulderMesh.setMatrixAt(i, dummy.matrix);
    }
    boulderMesh.instanceMatrix.needsUpdate = true;
    this.group.add(boulderMesh);
    this.disposables.push(boulderGeo, boulderMat);

    // 2. Instanced Native Trees (Acacia / Teak silhouettes, 80 trees)
    const treeCount = 80;
    const treeGeo = new THREE.ConeGeometry(0.7, 1.8, 5);
    const treeMat = new THREE.MeshStandardMaterial({
      color: palette.emerald[900],
      roughness: 0.9,
      flatShading: true,
    });
    const treeMesh = new THREE.InstancedMesh(treeGeo, treeMat, treeCount);
    treeMesh.castShadow = false;

    for (let i = 0; i < treeCount; i++) {
      const x = -35 + Math.random() * 65;
      const z = -45 + Math.random() * 85;
      // Skip river center
      if (getDistanceToRiver(x, z) < 3.0) continue;

      const y = getTerrainHeightAt(x, z);
      dummy.position.set(x, y + 0.85, z);
      const scale = 0.5 + Math.random() * 0.8;
      dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
      dummy.updateMatrix();
      treeMesh.setMatrixAt(i, dummy.matrix);
    }
    treeMesh.instanceMatrix.needsUpdate = true;
    this.group.add(treeMesh);
    this.disposables.push(treeGeo, treeMat);
  }

  /**
   * Updates dynamic river flow animation
   */
  public update(delta: number): void {
    if (this.riverMaterial) {
      this.waterUniforms.uTime.value += delta;
    }
  }

  /**
   * Strict disposal of all WebGL geometries and materials
   */
  public dispose(): void {
    this.disposables.forEach((item) => {
      if ('dispose' in item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });
    this.disposables = [];
    this.group.clear();
  }
}
