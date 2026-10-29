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

interface Scene6Props {
  lang: SupportedLanguage;
}

export const Scene6UserJourney: React.FC<Scene6Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 2150 to 2710
  const enterOpacity = interpolate(frame, [2150, 2175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [2685, 2710], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Crossfade between Planner UI and Generated Journey
  const plannerOpacity = interpolate(frame, [2160, 2380, 2400], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const journeyOpacity = interpolate(frame, [2380, 2410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursorSteps: CursorStep[] = [
    { frame: 2170, x: 1300, y: 700 },
    { frame: 2240, x: 800, y: 380 }, // Select origin (Shivajinagar)
    { frame: 2250, x: 800, y: 380, click: true },
    { frame: 2320, x: 1100, y: 380 }, // Select destination (Sinhagad)
    { frame: 2330, x: 1100, y: 380, click: true },
    { frame: 2380, x: 960, y: 520 }, // Click "Generate Multi-Modal Route"
    { frame: 2390, x: 960, y: 520, click: true },
    { frame: 2520, x: 1450, y: 300 }, // Click "Export Itinerary PDF"
    { frame: 2530, x: 1450, y: 300, click: true },
    { frame: 2650, x: 1200, y: 700 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND_TOKENS.bgDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 60px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 1720,
          height: 960,
          borderRadius: 22,
          backgroundColor: "#081d14",
          border: `1.5px solid ${BRAND_TOKENS.border}`,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.15)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Browser Header */}
        <div
          style={{
            height: 52,
            backgroundColor: "rgba(6, 19, 14, 0.98)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>🧭</span>
            <span style={{ color: "#f8fafc", fontSize: 16, fontWeight: 800 }}>
              {lang === "mr" ? "स्मार्ट सहल आयोजक व मल्टी-मॉडल मार्गदर्शक" : "Smart Multi-Modal Trip Planner & Directions"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ padding: "4px 14px", borderRadius: 6, backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10b981", fontSize: 13, fontWeight: 700 }}>
              VERIFIED WORKFLOW
            </span>
          </div>
        </div>

        {/* Viewport: Crossfade between Planner & My Journey */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Real Trip Planner Screenshot */}
          {plannerOpacity > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: plannerOpacity }}>
              <Img
                src={staticFile("images/real-site/09_trip_planner.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Real Generated Journey Screenshot */}
          {journeyOpacity > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: journeyOpacity }}>
              <Img
                src={staticFile("images/real-site/10_my_journey.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />

              {/* Verified Multi-Modal Transfer Callout Overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  right: 50,
                  width: 580,
                  padding: "20px 24px",
                  borderRadius: 16,
                  backgroundColor: "rgba(6, 19, 14, 0.95)",
                  border: "1.5px solid #10b981",
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.9)",
                }}
              >
                <div style={{ color: "#10b981", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em" }}>
                  CURATED REAL-WORLD TRANSIT ROUTE
                </div>
                <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                  Shivajinagar ➔ Swargate (Metro) ➔ Sinhagad (Bus 51)
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 12, color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
                  <div>⏱️ 1 hr 45 mins</div>
                  <div>•</div>
                  <div>🎫 Total Fare: ₹55</div>
                  <div>•</div>
                  <div>📄 PDF Export Ready</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Cursor steps={cursorSteps} startFrame={2165} endFrame={2695} />
    </AbsoluteFill>
  );
};
