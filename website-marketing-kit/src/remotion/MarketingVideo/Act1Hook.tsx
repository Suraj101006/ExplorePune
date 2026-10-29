import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_COLORS } from "./types";

export const Act1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge animation (Frames 10-30)
  const badgeSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Main Headline words staggered reveal (Frames 20-55)
  const word1Progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const word2Progress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const word3Progress = spring({
    frame: frame - 36,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  // Marathi Subtitle reveal (Frames 45-75)
  const marathiOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const marathiY = interpolate(frame, [45, 65], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Feature pills (Frames 70-100)
  const pillsProgress = spring({
    frame: frame - 70,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  // Overall Act 1 Out-transition (Frames 135-150)
  const act1FadeOut = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act1ScaleOut = interpolate(frame, [135, 150], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: act1FadeOut,
        transform: `scale(${act1ScaleOut})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Brand Badge */}
      <div
        style={{
          opacity: badgeSpring,
          transform: `translateY(${(1 - badgeSpring) * 16}px)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 22px",
          borderRadius: 9999,
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          border: `1px solid ${BRAND_COLORS.border}`,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: BRAND_COLORS.primaryGlow,
            boxShadow: "0 0 12px #10b981",
          }}
        />
        <span
          style={{
            color: BRAND_COLORS.primaryGlow,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Explore Pune 2.0 • Official Showcase
        </span>
      </div>

      {/* Main Headline */}
      <h1
        style={{
          display: "flex",
          gap: 18,
          fontSize: 84,
          fontWeight: 800,
          color: BRAND_COLORS.textPrimary,
          margin: "0 0 16px 0",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            opacity: word1Progress,
            transform: `translateY(${(1 - word1Progress) * 30}px)`,
          }}
        >
          Discover
        </span>
        <span
          style={{
            display: "inline-block",
            opacity: word2Progress,
            transform: `translateY(${(1 - word2Progress) * 30}px)`,
            background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Pune’s
        </span>
        <span
          style={{
            display: "inline-block",
            opacity: word3Progress,
            transform: `translateY(${(1 - word3Progress) * 30}px)`,
          }}
        >
          Soul
        </span>
      </h1>

      {/* Marathi Tagline */}
      <div
        style={{
          opacity: marathiOpacity,
          transform: `translateY(${marathiY}px)`,
          fontSize: 38,
          fontWeight: 600,
          color: "#fbbf24", // Warm golden amber
          fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif",
          marginBottom: 36,
          letterSpacing: "0.02em",
          textShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
        }}
      >
        ऐतिहासिक वारसा ते आधुनिक पुणे
      </div>

      {/* Feature Value Badges */}
      <div
        style={{
          opacity: pillsProgress,
          transform: `translateY(${(1 - pillsProgress) * 20}px)`,
          display: "flex",
          gap: 20,
        }}
      >
        {[
          { icon: "🏛️", text: "106 Curated Places" },
          { icon: "🚇", text: "Purple & Aqua Metro Lines" },
          { icon: "🤖", text: "Smart AI Trip Planner" },
          { icon: "⚡", text: "Bilingual English & मराठी" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 24px",
              borderRadius: 14,
              backgroundColor: "rgba(12, 32, 24, 0.75)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              backdropFilter: "blur(12px)",
              color: BRAND_COLORS.textPrimary,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
