import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

export const AudioTrack: React.FC = () => {
  const frame = useCurrentFrame();

  // Volume curve for 1200 frames (40s):
  const volume = interpolate(
    frame,
    [0, 30, 160, 480, 770, 1000, 1100, 1170, 1200],
    [0.2, 0.7, 0.48, 0.48, 0.52, 0.72, 0.72, 0.4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <Audio
      src={staticFile("audio/explore-pune-intro-bgm.mp3")}
      volume={volume}
    />
  );
};
