import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1CinematicIntro } from "./Scene1CinematicIntro";
import { Scene4PMPMLBus } from "./Scene4PMPMLBus";
import { Scene5PuneMetro } from "./Scene5PuneMetro";
import { Scene8ClosingCTA } from "./Scene8ClosingCTA";
import { SubtitlesOverlay } from "./SubtitlesOverlay";
import { BRAND_TOKENS } from "./types";

export const MetroTransitShortTeaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_TOKENS.bgDark }}>
      {/* 25-second Social Media Cut (750 frames) */}
      <Sequence from={0} durationInFrames={180}>
        <Scene1CinematicIntro lang="en" />
      </Sequence>
      <Sequence from={170} durationInFrames={200}>
        <Scene4PMPMLBus lang="en" />
      </Sequence>
      <Sequence from={360} durationInFrames={220}>
        <Scene5PuneMetro lang="en" />
      </Sequence>
      <Sequence from={570} durationInFrames={180}>
        <Scene8ClosingCTA lang="en" />
      </Sequence>
      <SubtitlesOverlay lang="en" />
    </AbsoluteFill>
  );
};
