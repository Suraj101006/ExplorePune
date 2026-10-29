import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene1Props {
  lang: SupportedLanguage;
}

export const Scene1CinematicIntro: React.FC<Scene1Props> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera drift
  const scale = interpolate(frame, [0, 300], [1.02, 1.12], { extrapolateRight: "clamp" });

  // Logo Reveal Spring
  const logoSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Headline reveal
  const headlineSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Animated Route Vectors Draw-in
  const vectorProgress = interpolate(frame, [30, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out towards Scene 2
  const exitOpacity = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        backgroundColor: BRAND_TOKENS.bgDark,
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background Cinematic Pune City Map Canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          opacity: 0.35,
        }}
      >
        <Img
          src={staticFile("images/pune-map-hero.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Radial Gradient & Atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(6, 95, 70, 0.4) 0%, transparent 70%),
            linear-gradient(to bottom, rgba(6, 19, 14, 0.8) 0%, rgba(6, 19, 14, 0.95) 100%)
          `,
        }}
      />

      {/* Animated Route Lines connecting Pune Areas */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1920 1080"
        fill="none"
      >
        {/* Route Line 1: Swargate to PCMC */}
        <path
          d="M 960 850 L 960 540 L 640 280"
          stroke="#9333ea"
          strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset={`${1000 * (1 - vectorProgress)}`}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 12px #9333ea)" }}
        />
        {/* Route Line 2: Vanaz to Ramwadi */}
        <path
          d="M 450 540 L 960 540 L 1480 540"
          stroke="#06b6d4"
          strokeWidth="4"
          strokeDasharray="1200"
          strokeDashoffset={`${1200 * (1 - vectorProgress)}`}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 12px #06b6d4)" }}
        />
        {/* Animated Moving Transit Nodes */}
        <circle cx={960 - (1 - vectorProgress) * 320} cy={540} r="7" fill="#10b981" style={{ filter: "drop-shadow(0 0 10px #10b981)" }} />
        <circle cx={960} cy={850 - vectorProgress * 310} r="7" fill="#f59e0b" style={{ filter: "drop-shadow(0 0 10px #f59e0b)" }} />
      </svg>

      {/* Hero Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          padding: "0 100px",
        }}
      >
        {/* Website Logo & Badge */}
        <div
          style={{
            opacity: logoSpring,
            transform: `scale(${0.8 + 0.2 * logoSpring}) translateY(${(1 - logoSpring) * 20}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            padding: "12px 28px",
            borderRadius: 9999,
            backgroundColor: "rgba(12, 32, 24, 0.8)",
            border: `1.5px solid ${BRAND_TOKENS.border}`,
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            पु
          </div>
          <span style={{ color: "#f8fafc", fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em" }}>
            Explore Pune
          </span>
          <span style={{ color: "#10b981", fontSize: 13, fontWeight: 800, background: "rgba(16, 185, 129, 0.2)", padding: "4px 10px", borderRadius: 6 }}>
            TRANSIT 2.0
          </span>
        </div>

        {/* Master Headline */}
        <h1
          style={{
            opacity: headlineSpring,
            transform: `translateY(${(1 - headlineSpring) * 30}px)`,
            fontSize: 78,
            fontWeight: 900,
            color: "#f8fafc",
            margin: "0 0 16px 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          {lang === "mr" ? "पुणे जाणून घ्या. स्मार्ट प्रवास करा." : "Discover Pune. Travel Smarter."}
        </h1>

        {/* Marathi Subtitle */}
        <div
          style={{
            opacity: headlineSpring,
            fontSize: 34,
            fontWeight: 700,
            color: "#fbbf24",
            fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif",
            textShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
            marginBottom: 40,
          }}
        >
          {lang === "mr" ? "पीएमपीएमएल बसेस • पुणे मेट्रो • परस्परसंवादी नकाशे" : "PMPML Buses • Pune Metro • Interactive Maps"}
        </div>

        {/* Connected Infrastructure Badges */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { icon: "🚇", label: lang === "mr" ? "पुणे मेट्रो लाईन्स" : "Purple & Aqua Metro" },
            { icon: "🚌", label: lang === "mr" ? "पीएमपीएमएल वेळापत्रक" : "PMPML Bus Routes" },
            { icon: "🗺️", label: lang === "mr" ? "१०६ ठिकाणे व नकाशे" : "106 Verified Places" },
          ].map((b, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 12,
                backgroundColor: "rgba(12, 32, 24, 0.7)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "#cbd5e1",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
