import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Act1Hook } from "./Act1Hook";
import { Act2Walkthrough } from "./Act2Walkthrough";
import { Act3CTA } from "./Act3CTA";
import { AudioTrack } from "./AudioTrack";
import { Background } from "./Background";

export const MarketingVideoMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06130e" }}>
      {/* Dynamic Ambient Background */}
      <Background />

      {/* Automated Soundtrack */}
      <AudioTrack />

      {/* Act I: The Localized Hook (0s - 5.3s / Frames 0 - 160) */}
      <Sequence from={0} durationInFrames={160}>
        <Act1Hook />
      </Sequence>

      {/* Act II: Seamless Walkthrough (4.6s - 22.5s / Frames 140 - 535 frames) */}
      <Sequence from={140} durationInFrames={535}>
        <Act2Walkthrough />
      </Sequence>

      {/* Act III: High-Impact Call-to-Action (21.8s - 30s / Frames 655 - 245 frames) */}
      <Sequence from={655} durationInFrames={245}>
        <Act3CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
