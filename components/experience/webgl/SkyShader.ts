/**
 * Pune Dynamic Sky Shader
 * Features:
 * - Driven by real-time Pune local hour (Asia/Kolkata) & live Open-Meteo weather
 * - Seamless celestial transition: Dawn Saffron -> Monsoon Azure -> Sunset Terracotta -> Deccan Basalt Void
 * - Procedural cloud drift driven by live wind speed
 * - Starfield twinkling during Pune nighttime hours
 * - Atmospheric fog syncing with terrain
 */

import * as THREE from 'three';
import { palette } from '@/components/experience/tokens/tokens';
import { PuneWeatherData } from './types';

export class PuneSkyDome {
  public mesh: THREE.Mesh;
  public uniforms: {
    uTime: { value: number };
    uHour: { value: number }; // 0.0 to 24.0 in Pune local time
    uSunDir: { value: THREE.Vector3 };
    uCloudCover: { value: number }; // 0.0 to 1.0
    uRainFactor: { value: number }; // 0.0 to 1.0
    uWindSpeed: { value: number };  // km/h scaled
    uDawnColorZenith: { value: THREE.Color };
    uDawnColorHorizon: { value: THREE.Color };
    uDayColorZenith: { value: THREE.Color };
    uDayColorHorizon: { value: THREE.Color };
    uDuskColorZenith: { value: THREE.Color };
    uDuskColorHorizon: { value: THREE.Color };
    uNightColorZenith: { value: THREE.Color };
    uNightColorHorizon: { value: THREE.Color };
  };
  private geometry: THREE.SphereGeometry;
  private material: THREE.ShaderMaterial;

  constructor() {
    this.geometry = new THREE.SphereGeometry(300, 32, 24);

    this.uniforms = {
      uTime: { value: 0 },
      uHour: { value: 14.0 }, // default 2 PM
      uSunDir: { value: new THREE.Vector3(0.3, 0.8, 0.4).normalize() },
      uCloudCover: { value: 0.25 },
      uRainFactor: { value: 0.0 },
      uWindSpeed: { value: 8.0 },
      uDawnColorZenith: { value: new THREE.Color(palette.monsoon[900]) },   // #073b4c
      uDawnColorHorizon: { value: new THREE.Color(palette.saffron[600]) },  // #ea580c
      uDayColorZenith: { value: new THREE.Color(palette.monsoon[700]) },    // #0284c7
      uDayColorHorizon: { value: new THREE.Color(palette.monsoon[300]) },   // #bae6fd
      uDuskColorZenith: { value: new THREE.Color(palette.saffron[900]) },   // #7c2d12
      uDuskColorHorizon: { value: new THREE.Color(palette.copper[500]) },   // #d97706
      uNightColorZenith: { value: new THREE.Color(palette.basalt[950]) },   // #04060a
      uNightColorHorizon: { value: new THREE.Color(palette.basalt[800]) },  // #0f172a
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHour;
        uniform vec3 uSunDir;
        uniform float uCloudCover;
        uniform float uRainFactor;
        uniform float uWindSpeed;

        uniform vec3 uDawnColorZenith;
        uniform vec3 uDawnColorHorizon;
        uniform vec3 uDayColorZenith;
        uniform vec3 uDayColorHorizon;
        uniform vec3 uDuskColorZenith;
        uniform vec3 uDuskColorHorizon;
        uniform vec3 uNightColorZenith;
        uniform vec3 uNightColorHorizon;

        varying vec3 vWorldPosition;
        varying vec2 vUv;

        // Pseudo-random hash for star generation
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        // 2D simplex-style noise for clouds
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float elevation = clamp(dir.y, 0.0, 1.0); // 0 at horizon, 1 at zenith

          // 1. Calculate color blends according to Pune local hour (0.0 to 24.0)
          // 05:00 - 07:30 = Dawn
          // 07:30 - 17:00 = Day
          // 17:00 - 19:30 = Dusk/Sunset
          // 19:30 - 05:00 = Night

          vec3 zenithCol;
          vec3 horizonCol;

          if (uHour >= 5.0 && uHour < 7.5) {
            // Night -> Dawn -> Day transition
            float t = (uHour - 5.0) / 2.5;
            zenithCol = mix(uNightColorZenith, uDawnColorZenith, t);
            horizonCol = mix(uNightColorHorizon, uDawnColorHorizon, t);
          } else if (uHour >= 7.5 && uHour < 17.0) {
            // Day
            float t = clamp((uHour - 7.5) / 9.5, 0.0, 1.0);
            zenithCol = uDayColorZenith;
            horizonCol = uDayColorHorizon;
          } else if (uHour >= 17.0 && uHour < 19.5) {
            // Day -> Dusk transition
            float t = (uHour - 17.0) / 2.5;
            zenithCol = mix(uDayColorZenith, uDuskColorZenith, t);
            horizonCol = mix(uDayColorHorizon, uDuskColorHorizon, t);
          } else {
            // Night
            float t = (uHour >= 19.5) ? ((uHour - 19.5) / 9.5) : ((uHour + 4.5) / 9.5);
            zenithCol = mix(uDuskColorZenith, uNightColorZenith, clamp(t * 1.5, 0.0, 1.0));
            horizonCol = mix(uDuskColorHorizon, uNightColorHorizon, clamp(t * 1.5, 0.0, 1.0));
          }

          // Sky gradient from horizon to zenith
          vec3 skyColor = mix(horizonCol, zenithCol, pow(elevation, 0.65));

          // 2. Nighttime Stars
          float nightFactor = 0.0;
          if (uHour >= 19.5 || uHour < 5.0) {
            nightFactor = 1.0;
          } else if (uHour >= 17.0 && uHour < 19.5) {
            nightFactor = (uHour - 17.0) / 2.5;
          } else if (uHour >= 5.0 && uHour < 7.0) {
            nightFactor = 1.0 - (uHour - 5.0) / 2.0;
          }

          if (nightFactor > 0.05 && elevation > 0.15) {
            vec2 starCoord = dir.xz / (dir.y + 0.3) * 60.0;
            float starVal = hash(floor(starCoord));
            if (starVal > 0.985) {
              float twinkle = sin(uTime * 4.0 + starVal * 20.0) * 0.4 + 0.6;
              skyColor += vec3(0.9, 0.95, 1.0) * twinkle * nightFactor * (1.0 - uCloudCover * 0.85);
            }
          }

          // 3. Procedural Drifting Clouds
          vec2 cloudUv = dir.xz / (dir.y + 0.2);
          float driftSpeed = uWindSpeed * 0.002;
          vec2 windOffset = vec2(uTime * driftSpeed, uTime * driftSpeed * 0.3);
          float c1 = noise(cloudUv * 2.5 + windOffset);
          float c2 = noise(cloudUv * 5.0 - windOffset * 0.5);
          float cloudDensity = (c1 * 0.6 + c2 * 0.4) * uCloudCover;

          vec3 cloudColor = mix(vec3(0.85, 0.9, 0.95), vec3(0.3, 0.35, 0.4), uRainFactor);
          // Tint clouds with sunset / dawn horizon colors
          cloudColor = mix(cloudColor, horizonCol, 0.35);

          skyColor = mix(skyColor, cloudColor, smoothstep(0.4, 0.75, cloudDensity) * (1.0 - elevation * 0.3));

          // 4. Monsoon Rain / Mist Gloom
          if (uRainFactor > 0.0) {
            vec3 rainWash = vec3(0.12, 0.16, 0.22);
            skyColor = mix(skyColor, rainWash, uRainFactor * 0.45);
          }

          gl_FragColor = vec4(skyColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = 'PuneSkyDome';

    // Set initial hour from local Pune time
    this.updateLocalPuneTime();
  }

  /**
   * Computes Pune local hour (Asia/Kolkata timezone)
   */
  public updateLocalPuneTime(): number {
    try {
      const puneDateStr = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      });
      const puneDate = new Date(puneDateStr);
      const hour = puneDate.getHours() + puneDate.getMinutes() / 60;
      this.uniforms.uHour.value = hour;

      // Update Sun direction based on hour
      const sunAngle = ((hour - 6.0) / 12.0) * Math.PI; // 0 at dawn, PI at dusk
      const sunY = Math.sin(sunAngle);
      const sunX = -Math.cos(sunAngle);
      this.uniforms.uSunDir.value.set(sunX, Math.max(-0.2, sunY), 0.3).normalize();

      return hour;
    } catch (e) {
      this.uniforms.uHour.value = 14.0;
      return 14.0;
    }
  }

  /**
   * Updates weather parameters from live weather payload
   */
  public updateWeather(weather: PuneWeatherData): void {
    if (typeof weather.windSpeed === 'number') {
      this.uniforms.uWindSpeed.value = Math.max(3, weather.windSpeed);
    }
    if (typeof weather.humidity === 'number') {
      const rainHint = weather.conditionEn.toLowerCase().includes('rain') ||
                       weather.conditionEn.toLowerCase().includes('monsoon');
      this.uniforms.uRainFactor.value = rainHint ? 0.75 : weather.humidity > 80 ? 0.35 : 0.0;
      this.uniforms.uCloudCover.value = rainHint ? 0.85 : weather.humidity > 65 ? 0.55 : 0.25;
    }
  }

  public update(delta: number): void {
    this.uniforms.uTime.value += delta;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
