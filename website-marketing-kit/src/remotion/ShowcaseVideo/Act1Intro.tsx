import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND } from "./types";

export const Act1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge Spring (Frames 10-35)
  const badgeSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Headline words staggered reveal
  const w1 = spring({ frame: frame - 22, fps, config: { damping: 15, stiffness: 110 } });
  const w2 = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 110 } });
  const w3 = spring({ frame: frame - 38, fps, config: { damping: 15, stiffness: 110 } });
  const w4 = spring({ frame: frame - 46, fps, config: { damping: 15, stiffness: 110 } });

  // Marathi Subtitle reveal (Frames 55-80)
  const marathiOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const marathiY = interpolate(frame, [55, 75], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Feature pills (Frames 75-110)
  const pillsSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Act 1 exit transition (Frames 140-165)
  const exitOpacity = interpolate(frame, [140, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [140, 165], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Platform Badge */}
      <div
        style={{
          opacity: badgeSpring,
          transform: `translateY(${(1 - badgeSpring) * 16}px)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 24px",
          borderRadius: 9999,
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          border: `1px solid ${BRAND.border}`,
          marginBottom: 30,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: BRAND.primaryGlow,
            boxShadow: "0 0 12px #10b981",
          }}
        />
        <span
          style={{
            color: BRAND.primaryGlow,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Explore Pune • Official Platform Showcase
        </span>
      </div>

      {/* Main Headline */}
      <h1
        style={{
          display: "flex",
          gap: 20,
          fontSize: 88,
          fontWeight: 900,
          color: BRAND.textPrimary,
          margin: "0 0 16px 0",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        <span style={{ display: "inline-block", opacity: w1, transform: `translateY(${(1 - w1) * 30}px)` }}>
          Experience
        </span>
        <span
          style={{
            display: "inline-block",
            opacity: w2,
            transform: `translateY(${(1 - w2) * 30}px)`,
            background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Pune
        </span>
        <span style={{ display: "inline-block", opacity: w3, transform: `translateY(${(1 - w3) * 30}px)` }}>
          Like
        </span>
        <span style={{ display: "inline-block", opacity: w4, transform: `translateY(${(1 - w4) * 30}px)` }}>
          Never Before
        </span>
      </h1>

      {/* Marathi Subheadline */}
      <div
        style={{
          opacity: marathiOpacity,
          transform: `translateY(${marathiY}px)`,
          fontSize: 36,
          fontWeight: 700,
          color: "#fbbf24",
          fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif",
          marginBottom: 44,
          letterSpacing: "0.02em",
          textShadow: "0 4px 18px rgba(245, 158, 11, 0.35)",
        }}
      >
        ऐतिहासिक वारसा • निसर्ग • वाहतूक • खाद्यसंस्कृती
      </div>

      {/* Pillars of the platform */}
      <div
        style={{
          opacity: pillsSpring,
          transform: `translateY(${(1 - pillsSpring) * 20}px)`,
          display: "flex",
          gap: 20,
        }}
      >
        {[
          { icon: "🏛️", title: "106 Verified Sites" },
          { icon: "🚇", title: "Metro & PMPML Transit" },
          { icon: "🗺️", title: "Interactive Geo Maps" },
          { icon: "🍲", title: "Iconic Puneri Food" },
          { icon: "🧭", title: "Smart AI Planner" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 26px",
              borderRadius: 16,
              backgroundColor: "rgba(12, 32, 24, 0.8)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: BRAND.textPrimary,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
