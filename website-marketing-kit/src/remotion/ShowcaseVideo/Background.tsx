import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND } from "./types";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Floating ambient glow orbs across 1200 frames
  const orb1X = interpolate(frame, [0, 1200], [20, 35], { extrapolateRight: "clamp" });
  const orb1Y = interpolate(frame, [0, 1200], [25, 45], { extrapolateRight: "clamp" });
  const orb2X = interpolate(frame, [0, 1200], [80, 65], { extrapolateRight: "clamp" });
  const orb2Y = interpolate(frame, [0, 1200], [70, 50], { extrapolateRight: "clamp" });

  const gridOpacity = interpolate(frame, [0, 60], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bgDark,
        overflow: "hidden",
      }}
    >
      {/* Radial Gradient Base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at ${orb1X}% ${orb1Y}%, rgba(16, 185, 129, 0.22) 0%, transparent 55%),
            radial-gradient(circle at ${orb2X}% ${orb2Y}%, rgba(245, 158, 11, 0.14) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(6, 95, 70, 0.35) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle Perspective Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};
