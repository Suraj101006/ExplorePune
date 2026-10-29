import { z } from "zod";

export const COMP_NAME = "ExplorePuneShowcase";

export const CompositionProps = z.object({
  title: z.string().default("Explore Pune"),
  subtitle: z.string().default("Official Platform Showcase Film"),
  siteUrl: z.string().default("explore-pune-eosin.vercel.app"),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Explore Pune",
  subtitle: "Official Platform Showcase Film",
  siteUrl: "explore-pune-eosin.vercel.app",
};

// 40 seconds @ 30 FPS = 1200 frames
export const DURATION_IN_FRAMES = 1200;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;
