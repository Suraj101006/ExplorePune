import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cursor, CursorStep } from "./Cursor";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene2Props {
  lang: SupportedLanguage;
}

export const Scene2RealWebsite: React.FC<Scene2Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 290 to 670
  const enterOpacity = interpolate(frame, [290, 315], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [645, 670], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Smooth camera zoom
  const zoom = interpolate(frame, [300, 480, 660], [1.0, 1.05, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scrollY = interpolate(frame, [300, 450, 660], [0, -60, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cursor glide path across homepage
  const cursorSteps: CursorStep[] = [
    { frame: 310, x: 1500, y: 780 },
    { frame: 370, x: 960, y: 195 }, // Hover over search input
    { frame: 380, x: 960, y: 195, click: true },
    { frame: 450, x: 650, y: 260 }, // Hover over Forts category
    { frame: 460, x: 650, y: 260, click: true },
    { frame: 540, x: 1220, y: 140 }, // Hover over verified 106 places pill
    { frame: 620, x: 1680, y: 140 }, // Hover over language toggle
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 60px",
        backgroundColor: BRAND_TOKENS.bgDark,
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Real Website Browser Chrome Frame */}
      <div
        style={{
          width: 1720,
          height: 960,
          borderRadius: 22,
          backgroundColor: "rgba(10, 25, 18, 0.96)",
          border: `1.5px solid ${BRAND_TOKENS.border}`,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Browser Top Navigation Bar */}
        <div
          style={{
            height: 52,
            backgroundColor: "rgba(6, 19, 14, 0.98)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "rgba(12, 32, 24, 0.85)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 8,
              padding: "6px 30px",
              color: "#94a3b8",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ color: "#10b981" }}>🔒</span>
            <span>https://explore-pune-eosin.vercel.app/</span>
            <span style={{ color: "#10b981", fontSize: 11, background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
              LIVE
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#10b981", fontSize: 14, fontWeight: 700 }}>
              {lang === "mr" ? "मराठी आवृत्ती" : "Official Guide"}
            </span>
          </div>
        </div>

        {/* Real Website Screen Viewport */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoom}) translateY(${scrollY}px)`,
              transformOrigin: "top center",
            }}
          >
            <Img
              src={
                lang === "mr"
                  ? staticFile("images/real-site/interaction_marathi_language.png")
                  : staticFile("images/real-site/01_homepage_desktop_.png")
              }
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          </div>
        </div>
      </div>

      {/* Feature Callout Tag */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 90,
          padding: "10px 22px",
          borderRadius: 12,
          backgroundColor: "rgba(6, 19, 14, 0.95)",
          border: "1.5px solid #10b981",
          boxShadow: "0 0 24px rgba(16, 185, 129, 0.4)",
          color: "#f8fafc",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 20 }}>🏛️</span>
        <div>
          <div style={{ color: "#10b981", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em" }}>
            ACTUAL PLATFORM
          </div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>
            {lang === "mr" ? "१०६ हून अधिक अधिकृत पर्यटन स्थळे" : "106+ Curated Destinations Live"}
          </div>
        </div>
      </div>

      {/* Cursor Animation */}
      <Cursor steps={cursorSteps} startFrame={305} endFrame={660} />
    </AbsoluteFill>
  );
};
