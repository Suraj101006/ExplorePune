import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_COLORS } from "./types";

export const Act3CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active during frames 650 to 900
  const act3Entry = interpolate(frame, [650, 680], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final fade out to black (Frames 880-900)
  const act3Exit = interpolate(frame, [880, 900], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act3Opacity = Math.min(act3Entry, act3Exit);

  // Card & Panel Spring
  const panelSpring = spring({
    frame: frame - 660,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Rolling Grid Horizon perspective scale
  const gridScale = interpolate(frame, [660, 880], [0.95, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA Button Shimmer progress
  const shimmerProgress = interpolate(frame, [720, 840], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: act3Opacity,
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
      }}
    >
      {/* 3D Horizon Grid Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${gridScale}) perspective(600px) rotateX(25deg)`,
          transformOrigin: "center 70%",
          opacity: 0.25,
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Main Glass CTA Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 1200,
          padding: "64px 80px",
          borderRadius: 32,
          backgroundColor: "rgba(10, 26, 19, 0.88)",
          border: `2px solid ${BRAND_COLORS.border}`,
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.8), 0 0 80px rgba(16, 185, 129, 0.2)",
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
            fontWeight: 700,
            color: "#f59e0b",
            fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif",
            marginBottom: 16,
            letterSpacing: "0.04em",
            textShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
          }}
        >
          ॥ चला, समृद्ध पुणे अनुभवूया ॥
        </div>

        {/* Hero Title */}
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#f8fafc",
            margin: "0 0 20px 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Your Ultimate Pune Discovery Guide
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#94a3b8",
            margin: "0 0 44px 0",
            maxWidth: 820,
            lineHeight: 1.5,
          }}
        >
          106+ Verified Heritage, Nature & Culinary Spots • Interactive Transit & Metro Lines • AI Trip Planner • Free Forever
        </p>

        {/* Primary Interactive CTA Button with Shimmer */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 54px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            boxShadow: "0 12px 36px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3)",
            cursor: "pointer",
          }}
        >
          {/* Shimmer light sweep */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 120,
              transform: `translateX(${shimmerProgress}%) skewX(-25deg)`,
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
              pointerEvents: "none",
            }}
          />
          <span>Visit</span>
          <span style={{ color: "#fef08a" }}>explore-pune-eosin.vercel.app</span>
          <span style={{ fontSize: 30 }}>→</span>
        </div>

        {/* Trust & Tech Badges */}
        <div
          style={{
            display: "flex",
            gap: 36,
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(16, 185, 129, 0.18)",
            color: "#cbd5e1",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <div>⚡ 100% Client-Side Fast</div>
          <div>•</div>
          <div>📱 Fully Responsive</div>
          <div>•</div>
          <div>🇮🇳 Proudly Made for Pune</div>
          <div>•</div>
          <div>✨ Zero Ads</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
