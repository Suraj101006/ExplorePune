import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Act1Intro } from "./Act1Intro";
import { Act2Walkthrough } from "./Act2Walkthrough";
import { Act3CTA } from "./Act3CTA";
import { AudioTrack } from "./AudioTrack";
import { Background } from "./Background";

export const ShowcaseVideoMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06130e" }}>
      {/* Shared Ambient Background */}
      <Background />

      {/* Soundtrack with automated volume */}
      <AudioTrack />

      {/* Act I: Opening Introduction (0s - 5.6s / Frames 0 - 170) */}
      <Sequence from={0} durationInFrames={170}>
        <Act1Intro />
      </Sequence>

      {/* Act II: Complete Feature Walkthrough (4.8s - 34.6s / Frames 145 - 895 frames) */}
      <Sequence from={145} durationInFrames={895}>
        <Act2Walkthrough />
      </Sequence>

      {/* Act III: Professional CTA Summary (33.3s - 40s / Frames 1000 - 200 frames) */}
      <Sequence from={1000} durationInFrames={200}>
        <Act3CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
