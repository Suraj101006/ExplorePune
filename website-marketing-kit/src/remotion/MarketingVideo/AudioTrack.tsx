import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

export const AudioTrack: React.FC = () => {
  const frame = useCurrentFrame();

  // Volume curve:
  // Starts at 0.65 in Act 1
  // Dips to 0.40 during detailed UI walkthrough in Act 2
  // Swells to 0.75 for Act 3 CTA
  // Fades out to 0 from frame 870 to 900
  const volume = interpolate(
    frame,
    [0, 30, 150, 520, 660, 800, 870, 900],
    [0.2, 0.65, 0.45, 0.45, 0.7, 0.7, 0.4, 0],
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
