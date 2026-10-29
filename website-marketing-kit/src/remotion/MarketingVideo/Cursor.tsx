import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface CursorProps {
  keyframes: CursorKeyframe[];
  visibleFrom?: number;
  visibleUntil?: number;
}

export const Cursor: React.FC<CursorProps> = ({
  keyframes,
  visibleFrom = 0,
  visibleUntil = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < visibleFrom || frame > visibleUntil) {
    return null;
  }

  // Find surrounding keyframes
  let currentKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
      currentKeyframe = keyframes[i];
      nextKeyframe = keyframes[i + 1];
      break;
    }
  }

  const progress =
    nextKeyframe.frame === currentKeyframe.frame
      ? 1
      : interpolate(
          frame,
          [currentKeyframe.frame, nextKeyframe.frame],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  // Smooth easing for natural movement
  const eased =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const currentX = currentKeyframe.x + (nextKeyframe.x - currentKeyframe.x) * eased;
  const currentY = currentKeyframe.y + (nextKeyframe.y - currentKeyframe.y) * eased;

  // Determine if currently clicking
  const clickKeyframe = keyframes.find(
    (k) => k.click && Math.abs(frame - k.frame) <= 8
  );
  const isClicking = Boolean(clickKeyframe);

  const clickScale = isClicking
    ? spring({
        frame: frame - (clickKeyframe ? clickKeyframe.frame : frame),
        fps,
        config: { damping: 15, stiffness: 200 },
      })
    : 1;

  // Ripple effect on click
  const rippleProgress = clickKeyframe
    ? interpolate(frame - clickKeyframe.frame, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: currentX,
        top: currentY,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.88 + 0.12 * (1 - clickScale) : 1})`,
        transformOrigin: "top left",
        transition: "filter 0.1s ease",
      }}
    >
      {/* Click Ripple Wave */}
      {clickKeyframe && rippleProgress > 0 && rippleProgress < 1 && (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: 44,
            height: 44,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${rippleProgress * 1.8})`,
            border: `2px solid rgba(16, 185, 129, ${1 - rippleProgress})`,
            backgroundColor: `rgba(16, 185, 129, ${(1 - rippleProgress) * 0.35})`,
          }}
        />
      )}

      {/* SVG Pointer Cursor */}
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))",
        }}
      >
        <path
          d="M2 2L11.5 28L15.8 17.5L26 13.8L2 2Z"
          fill="#10B981"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
