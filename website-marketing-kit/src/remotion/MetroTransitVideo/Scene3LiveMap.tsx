import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cursor, CursorStep } from "./Cursor";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene3Props {
  lang: SupportedLanguage;
}

export const Scene3LiveMap: React.FC<Scene3Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 650 to 1150
  const enterOpacity = interpolate(frame, [650, 675], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [1125, 1150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Dynamic Camera Zoom across Map
  const mapZoom = interpolate(frame, [660, 850, 1140], [1.0, 1.15, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mapPanX = interpolate(frame, [660, 850, 1140], [0, -40, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mapPanY = interpolate(frame, [660, 850, 1140], [0, -30, -10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Route drawing progress
  const routeProgress = interpolate(frame, [720, 960], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cursor Steps
  const cursorSteps: CursorStep[] = [
    { frame: 670, x: 1400, y: 700 },
    { frame: 740, x: 880, y: 440 }, // Click Shivajinagar pin
    { frame: 750, x: 880, y: 440, click: true },
    { frame: 860, x: 920, y: 560 }, // Inspect Swargate
    { frame: 950, x: 680, y: 720 }, // Follow Sinhagad trail
    { frame: 960, x: 680, y: 720, click: true },
    { frame: 1080, x: 1200, y: 500 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND_TOKENS.bgDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 60px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Map Window Container */}
      <div
        style={{
          width: 1720,
          height: 960,
          borderRadius: 22,
          backgroundColor: "#06130e",
          border: `1.5px solid ${BRAND_TOKENS.border}`,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            height: 52,
            backgroundColor: "rgba(6, 19, 14, 0.98)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>🗺️</span>
            <span style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>
              {lang === "mr" ? "परस्परसंवादी पुणे नकाशा" : "Interactive Geographic Exploration"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: 13, fontWeight: 700 }}>
              MAPLIBRE 3D ENGINE
            </span>
            <span style={{ padding: "4px 12px", borderRadius: 6, backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", fontSize: 13, fontWeight: 700 }}>
              ELEVATION CONTOURS
            </span>
          </div>
        </div>

        {/* Real Map Canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${mapZoom}) translate(${mapPanX}px, ${mapPanY}px)`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile("images/pune-map-hero.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Dynamic Drawn Route Vector Overlay */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              viewBox="0 0 1720 900"
            >
              {/* Route connecting Shivajinagar to Sinhagad */}
              <path
                d="M 880 440 L 920 560 L 800 680 L 680 720"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="800"
                strokeDashoffset={`${800 * (1 - routeProgress)}`}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 14px #10b981)" }}
              />
            </svg>

            {/* Interactive Location Pin 1: Shivajinagar */}
            <div
              style={{
                position: "absolute",
                top: 410,
                left: 850,
                padding: "8px 16px",
                borderRadius: 10,
                backgroundColor: "rgba(6, 19, 14, 0.92)",
                border: "2px solid #10b981",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>📍</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{lang === "mr" ? "शिवाजीनगर हब" : "Shivajinagar Hub"}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>18.5314° N, 73.8446° E • Metro & Bus Interchange</div>
              </div>
            </div>

            {/* Interactive Location Pin 2: Sinhagad Fort */}
            <div
              style={{
                position: "absolute",
                top: 690,
                left: 620,
                padding: "8px 16px",
                borderRadius: 10,
                backgroundColor: "rgba(6, 19, 14, 0.92)",
                border: "2px solid #f59e0b",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>⛰️</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{lang === "mr" ? "सिंहगड किल्ला" : "Sinhagad Fort (1312m)"}</div>
                <div style={{ fontSize: 10, color: "#fbbf24" }}>Trek Trail End • Bus 51 Terminal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Cursor steps={cursorSteps} startFrame={665} endFrame={1135} />
    </AbsoluteFill>
  );
};
