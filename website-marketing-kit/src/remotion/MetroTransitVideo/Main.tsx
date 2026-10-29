import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { AudioTrack } from "./AudioTrack";
import { Scene1CinematicIntro } from "./Scene1CinematicIntro";
import { Scene2RealWebsite } from "./Scene2RealWebsite";
import { Scene3LiveMap } from "./Scene3LiveMap";
import { Scene4PMPMLBus } from "./Scene4PMPMLBus";
import { Scene5PuneMetro } from "./Scene5PuneMetro";
import { Scene6UserJourney } from "./Scene6UserJourney";
import { Scene7BrandMontage } from "./Scene7BrandMontage";
import { Scene8ClosingCTA } from "./Scene8ClosingCTA";
import { SubtitlesOverlay } from "./SubtitlesOverlay";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface MetroTransitMainProps {
  lang?: SupportedLanguage;
}

export const MetroTransitVideoMain: React.FC<MetroTransitMainProps> = ({
  lang = "en",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_TOKENS.bgDark }}>
      {/* Master Soundtrack and Voiceover in Selected Language */}
      <AudioTrack lang={lang} />

      {/* Scene 1: Cinematic Opening (0 - 10s / Frames 0 - 300) */}
      <Sequence from={0} durationInFrames={300}>
        <Scene1CinematicIntro lang={lang} />
      </Sequence>

      {/* Scene 2: Real Website Homepage (9.6s - 22.3s / Frames 290 - 380) */}
      <Sequence from={290} durationInFrames={380}>
        <Scene2RealWebsite lang={lang} />
      </Sequence>

      {/* Scene 3: Live Location & Map (21.6s - 38.3s / Frames 650 - 500) */}
      <Sequence from={650} durationInFrames={500}>
        <Scene3LiveMap lang={lang} />
      </Sequence>

      {/* Scene 4: PMPML Public Bus Network (37.6s - 55.3s / Frames 1130 - 530) */}
      <Sequence from={1130} durationInFrames={530}>
        <Scene4PMPMLBus lang={lang} />
      </Sequence>

      {/* Scene 5: Pune Metro Rail Network (54.6s - 72.3s / Frames 1640 - 530) */}
      <Sequence from={1640} durationInFrames={530}>
        <Scene5PuneMetro lang={lang} />
      </Sequence>

      {/* Scene 6: Real Multi-Modal User Journey (71.6s - 90.3s / Frames 2150 - 560) */}
      <Sequence from={2150} durationInFrames={560}>
        <Scene6UserJourney lang={lang} />
      </Sequence>

      {/* Scene 7: Benefits & Brand Montage (89.6s - 102.3s / Frames 2690 - 380) */}
      <Sequence from={2690} durationInFrames={380}>
        <Scene7BrandMontage lang={lang} />
      </Sequence>

      {/* Scene 8: Premium Closing CTA (101.6s - 112s / Frames 3050 - 310) */}
      <Sequence from={3050} durationInFrames={310}>
        <Scene8ClosingCTA lang={lang} />
      </Sequence>

      {/* High-Contrast Synchronized Subtitles Overlay */}
      <SubtitlesOverlay lang={lang} />
    </AbsoluteFill>
  );
};
