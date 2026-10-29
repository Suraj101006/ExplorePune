import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SupportedLanguage } from "./types";

interface AudioTrackProps {
  lang: SupportedLanguage;
}

const SCENE_AUDIO_MAPPING = [
  { scene: "scene1_intro", from: 0, duration: 300 },
  { scene: "scene2_website", from: 300, duration: 360 },
  { scene: "scene3_map", from: 660, duration: 480 },
  { scene: "scene4_pmpml", from: 1140, duration: 510 },
  { scene: "scene5_metro", from: 1650, duration: 510 },
  { scene: "scene6_journey", from: 2160, duration: 540 },
  { scene: "scene7_brand", from: 2700, duration: 360 },
  { scene: "scene8_closing", from: 3060, duration: 300 },
];

export const AudioTrack: React.FC<AudioTrackProps> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Background music volume automation
  // Swells during intro (0-15f), ducks during voiceover (0.32), swells during closing CTA (0.75), fades to 0 (3330-3360)
  const bgmVolume = interpolate(
    frame,
    [0, 20, 100, 3000, 3150, 3320, 3360],
    [0.15, 0.65, 0.30, 0.30, 0.70, 0.50, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Background Cinematic Soundtrack */}
      <Audio
        src={staticFile("audio/explore-pune-intro-bgm.mp3")}
        volume={bgmVolume}
        loop
      />

      {/* Voiceover Segments in Selected Language */}
      {SCENE_AUDIO_MAPPING.map((item) => (
        <Sequence key={item.scene} from={item.from} durationInFrames={item.duration}>
          <Audio
            src={staticFile(`audio/${lang}/${item.scene}.mp3`)}
            volume={0.92}
          />
        </Sequence>
      ))}
    </>
  );
};
