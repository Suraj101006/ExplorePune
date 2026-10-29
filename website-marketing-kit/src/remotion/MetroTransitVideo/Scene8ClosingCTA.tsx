import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene8Props {
  lang: SupportedLanguage;
}

export const Scene8ClosingCTA: React.FC<Scene8Props> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active during frames 3050 to 3360
  const enterOpacity = interpolate(frame, [3050, 3080], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [3325, 3360], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Logo & Card spring
  const cardSpring = spring({
    frame: frame - 3070,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Animated Route Line Progress between bus and metro symbols
  const lineProgress = interpolate(frame, [3090, 3240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer effect on CTA button
  const shimmerX = interpolate(frame, [3140, 3280], [-100, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND_TOKENS.bgDark,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* 3D Horizon Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: "75px 75px",
          transform: "perspective(600px) rotateX(25deg)",
          transformOrigin: "center 70%",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Main Glass Closing Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 1200,
          padding: "54px 72px",
          borderRadius: 32,
          backgroundColor: "rgba(10, 26, 19, 0.94)",
          border: `2px solid ${BRAND_TOKENS.border}`,
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.85), 0 0 80px rgba(16, 185, 129, 0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: cardSpring,
          transform: `translateY(${(1 - cardSpring) * 25}px) scale(${0.96 + 0.04 * cardSpring})`,
        }}
      >
        {/* Animated Connecting Line between Metro and Bus */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>🚇</div>
          <div style={{ width: 140, height: 4, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: `${140 * lineProgress}px`,
                height: "100%",
                background: "linear-gradient(90deg, #9333ea 0%, #10b981 100%)",
              }}
            />
          </div>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 800,
              boxShadow: "0 0 20px #10b981",
            }}
          >
            पु
          </div>
          <div style={{ width: 140, height: 4, backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: `${140 * lineProgress}px`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981 0%, #f59e0b 100%)",
              }}
            />
          </div>
          <div style={{ fontSize: 28 }}>🚌</div>
        </div>

        {/* Closing Title */}
        <h2
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "#f8fafc",
            margin: "0 0 14px 0",
            letterSpacing: "-0.03em",
          }}
        >
          {lang === "mr" ? "तुमचे शहर. तुमचा प्रवास. आपले पुणे." : "Your City. Your Journey. Your Pune."}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            margin: "0 0 36px 0",
            maxWidth: 820,
            lineHeight: 1.5,
          }}
        >
          {lang === "mr"
            ? "पीएमपीएमएल बसेस, पुणे मेट्रो, परस्परसंवादी नकाशे आणि सहल आयोजक — एकाच डिजिटल व्यासपीठावर."
            : "Complete public transit intelligence, bus & metro timetables, and interactive city discovery."}
        </p>

        {/* Primary CTA Button */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "20px 52px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            boxShadow: "0 14px 40px rgba(16, 185, 129, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Shimmer sweep */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 140,
              transform: `translateX(${shimmerX}%) skewX(-25deg)`,
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)",
              pointerEvents: "none",
            }}
          />
          <span>{lang === "mr" ? "सुरु करा —" : "Explore Now —"}</span>
          <span style={{ color: "#fef08a" }}>explore-pune-eosin.vercel.app</span>
          <span style={{ fontSize: 28 }}>→</span>
        </div>

        {/* Badges Footer */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 36,
            paddingTop: 24,
            borderTop: "1px solid rgba(16, 185, 129, 0.15)",
            color: "#cbd5e1",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          <div>⚡ Verified PMPML & Metro GTFS</div>
          <div>•</div>
          <div>📱 100% Free Public Guide</div>
          <div>•</div>
          <div>🇮🇳 Made with Pride for Pune</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
