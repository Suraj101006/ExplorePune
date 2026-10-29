import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "./types";

export const Act3CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active during frames 1000 to 1200
  const enterOpacity = interpolate(frame, [1000, 1030], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out to black (Frames 1175-1200)
  const exitOpacity = interpolate(frame, [1175, 1200], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act3Opacity = Math.min(enterOpacity, exitOpacity);

  // Panel Spring
  const panelSpring = spring({
    frame: frame - 1015,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Rolling grid scale & perspective
  const gridScale = interpolate(frame, [1015, 1180], [0.95, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button shimmer sweep
  const shimmerPos = interpolate(frame, [1060, 1170], [-100, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rising metrics
  const spots = Math.floor(
    interpolate(frame, [1025, 1085], [0, 106], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const metroLines = Math.floor(
    interpolate(frame, [1035, 1085], [0, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const busRoutes = Math.floor(
    interpolate(frame, [1040, 1090], [0, 150], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        opacity: act3Opacity,
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      {/* 3D Horizon Perspective Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${gridScale}) perspective(600px) rotateX(25deg)`,
          transformOrigin: "center 70%",
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Main Glass CTA Panel */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 1260,
          padding: "54px 70px",
          borderRadius: 32,
          backgroundColor: "rgba(10, 26, 19, 0.92)",
          border: `2px solid ${BRAND.border}`,
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.85), 0 0 80px rgba(16, 185, 129, 0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: panelSpring,
          transform: `translateY(${(1 - panelSpring) * 30}px) scale(${0.96 + 0.04 * panelSpring})`,
        }}
      >
        {/* Cultural Marathi Motto */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#f59e0b",
            fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif",
            marginBottom: 14,
            letterSpacing: "0.04em",
            textShadow: "0 0 20px rgba(245, 158, 11, 0.45)",
          }}
        >
          ॥ चला, समृद्ध पुणे अनुभवूया ॥
        </div>

        {/* Hero Title */}
        <h2
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "#f8fafc",
            margin: "0 0 16px 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          The Complete Travel & Transit Platform
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            margin: "0 0 36px 0",
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          Explore historical forts, plan seamless metro & bus journeys, and discover Pune’s finest culinary spots in English & मराठी.
        </p>

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            width: "100%",
            marginBottom: 38,
          }}
        >
          {[
            { num: `${spots}+`, label: "Curated Spots", color: "#10b981" },
            { num: `${metroLines}`, label: "Metro Lines", color: "#a855f7" },
            { num: `${busRoutes}+`, label: "PMPML Routes", color: "#f59e0b" },
            { num: "100%", label: "Verified Data", color: "#38bdf8" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                padding: "16px 20px",
                borderRadius: 16,
                backgroundColor: "rgba(6, 19, 14, 0.8)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 900, color: m.color }}>{m.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Shimmering Action CTA Button */}
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
              transform: `translateX(${shimmerPos}%) skewX(-25deg)`,
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)",
              pointerEvents: "none",
            }}
          />
          <span>Launch</span>
          <span style={{ color: "#fef08a" }}>explore-pune-eosin.vercel.app</span>
          <span style={{ fontSize: 28 }}>→</span>
        </div>

        {/* Badges */}
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
          <div>⚡ Next.js 16 Client Speed</div>
          <div>•</div>
          <div>📱 Responsive on Mobile & Desktop</div>
          <div>•</div>
          <div>✨ Free & Zero Ads</div>
          <div>•</div>
          <div>🇮🇳 Built for Pune with Love</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
