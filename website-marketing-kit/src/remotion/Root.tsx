import React from "react";
import { Composition } from "remotion";
import {
  COMP_NAME,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { MarketingVideoMain } from "./MarketingVideo/Main";
import { MetroTransitVideoMain } from "./MetroTransitVideo/Main";
import { MetroTransitShortTeaser } from "./MetroTransitVideo/ShortTeaser";
import { NextLogo } from "./MyComp/NextLogo";
import { ShowcaseVideoMain } from "./ShowcaseVideo/Main";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 112-Second Master Promotional Film: English Version */}
      <Composition
        id="PuneMetroTransit-EN"
        component={MetroTransitVideoMain}
        durationInFrames={3360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lang: "en",
        }}
      />

      {/* 112-Second Master Promotional Film: Marathi Version (मराठी आवृत्ती) */}
      <Composition
        id="PuneMetroTransit-MR"
        component={MetroTransitVideoMain}
        durationInFrames={3360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lang: "mr",
        }}
      />

      {/* 25-Second Social Media Teaser Cut */}
      <Composition
        id="PuneMetroTransit-Short"
        component={MetroTransitShortTeaser}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 40-Second Real Website Feature Showcase */}
      <Composition
        id={COMP_NAME}
        component={ShowcaseVideoMain}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      {/* 30-Second Fast Marketing Promo */}
      <Composition
        id="ExplorePuneMarketing"
        component={MarketingVideoMain}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
