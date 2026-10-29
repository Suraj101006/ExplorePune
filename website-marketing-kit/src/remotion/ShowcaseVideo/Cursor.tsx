import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CursorStep {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface CursorProps {
  steps: CursorStep[];
  startFrame?: number;
  endFrame?: number;
}

export const Cursor: React.FC<CursorProps> = ({
  steps,
  startFrame = 0,
  endFrame = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // Find step segment
  let currentStep = steps[0];
  let nextStep = steps[steps.length - 1];

  for (let i = 0; i < steps.length - 1; i++) {
    if (frame >= steps[i].frame && frame <= steps[i + 1].frame) {
      currentStep = steps[i];
      nextStep = steps[i + 1];
      break;
    }
  }

  const duration = nextStep.frame - currentStep.frame;
  const progress =
    duration === 0
      ? 1
      : interpolate(frame, [currentStep.frame, nextStep.frame], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // Smooth ease-in-out curve
  const eased =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const currentX = currentStep.x + (nextStep.x - currentStep.x) * eased;
  const currentY = currentStep.y + (nextStep.y - currentStep.y) * eased;

  // Click animation
  const clickStep = steps.find(
    (s) => s.click && Math.abs(frame - s.frame) <= 8
  );
  const isClicking = Boolean(clickStep);

  const clickScale = isClicking
    ? spring({
        frame: frame - (clickStep ? clickStep.frame : frame),
        fps,
        config: { damping: 14, stiffness: 220 },
      })
    : 1;

  const rippleProgress = clickStep
    ? interpolate(frame - clickStep.frame, [0, 16], [0, 1], {
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
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.86 + 0.14 * (1 - clickScale) : 1})`,
        transformOrigin: "top left",
      }}
    >
      {/* Click ripple circle */}
      {clickStep && rippleProgress > 0 && rippleProgress < 1 && (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: 48,
            height: 48,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${rippleProgress * 2})`,
            border: `2px solid rgba(16, 185, 129, ${1 - rippleProgress})`,
            backgroundColor: `rgba(16, 185, 129, ${(1 - rippleProgress) * 0.3})`,
          }}
        />
      )}

      {/* Modern Cursor Pointer */}
      <svg
        width="30"
        height="34"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.55))",
        }}
      >
        <path
          d="M2 2L11.5 28L15.8 17.5L26 13.8L2 2Z"
          fill="#10B981"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
