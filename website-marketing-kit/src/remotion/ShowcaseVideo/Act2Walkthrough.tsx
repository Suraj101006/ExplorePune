import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cursor, CursorStep } from "./Cursor";
import { RealWebsiteFrame } from "./RealWebsiteFrame";
import { BRAND } from "./types";

export const Act2Walkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active from frame 145 to 1040
  const enterOpacity = interpolate(frame, [145, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [1020, 1045], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const act2Opacity = Math.min(enterOpacity, exitOpacity);

  // Active Tab determination based on frame
  let activeTab = "home";
  if (frame >= 320 && frame < 470) activeTab = "heritage";
  else if (frame >= 470 && frame < 620) activeTab = "maps";
  else if (frame >= 620 && frame < 770) activeTab = "transit";
  else if (frame >= 770 && frame < 900) activeTab = "food";
  else if (frame >= 900) activeTab = "planner";

  // Language switch to Marathi triggered at frame 970
  const isMarathi = frame >= 970;

  // Feature spotlight info
  let spotlightBadge = "01 / SMART SEARCH";
  let spotlightTitle = "Instant Autocomplete & Category Filters";
  let spotlightDesc = "Fuzzy bilingual search indexing 106 verified destinations across Pune.";

  if (frame >= 320 && frame < 470) {
    spotlightBadge = "02 / HERITAGE & TREKS";
    spotlightTitle = "Comprehensive Destination Dossiers";
    spotlightDesc = "Verified timings, entry fees (₹50), parking, seasonal forecasts & audio guides.";
  } else if (frame >= 470 && frame < 620) {
    spotlightBadge = "03 / GEOGRAPHIC MAPS";
    spotlightTitle = "Interactive MapLibre Exploration";
    spotlightDesc = "High-precision coordinate pins, elevation contours & regional locality clustering.";
  } else if (frame >= 620 && frame < 770) {
    spotlightBadge = "04 / LOCAL TRANSIT";
    spotlightTitle = "Metro Purple/Aqua Lines & PMPML Bus Schedules";
    spotlightDesc = "Live station vector tracks with PMPML Route 51 (Shanipar to Sinhagad Paytha).";
  } else if (frame >= 770 && frame < 900) {
    spotlightBadge = "05 / FOOD & MISAL";
    spotlightTitle = "Iconic Puneri Dining Recommendations";
    spotlightDesc = "Curated misal hotspots (Katakirr, Bedekar) and historic heritage bakeries.";
  } else if (frame >= 900) {
    spotlightBadge = isMarathi ? "०६ / स्मार्ट आयोजक व मराठी" : "06 / SMART TRIP PLANNER";
    spotlightTitle = isMarathi ? "१-दिवसाची सहल व संपूर्ण मराठी भाषांतर" : "AI Trip Planner & Instant Marathi Toggle";
    spotlightDesc = isMarathi
      ? "एका क्लिकवर संपूर्ण दिवसाचे नियोजन आणि 'पुणे दर्शन' मराठी आवृत्ती."
      : "Automated itinerary sequencing with instant 1-click Marathi language localization.";
  }

  // Spotlight card reveal spring
  const cardSpring = spring({
    frame: (frame % 150),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Comprehensive Cursor Steps navigating through ALL tabs
  const cursorSteps: CursorStep[] = [
    { frame: 160, x: 1500, y: 800 },
    { frame: 195, x: 960, y: 185 }, // Hover on search bar
    { frame: 200, x: 960, y: 185, click: true }, // Click search
    { frame: 250, x: 960, y: 185 }, // Type Sinhagad
    { frame: 310, x: 620, y: 90 }, // Move to 'Heritage & Treks' Tab
    { frame: 320, x: 620, y: 90, click: true }, // Click Heritage Tab
    { frame: 380, x: 750, y: 460 }, // Inspect Sinhagad Fort details
    { frame: 460, x: 800, y: 90 }, // Move to 'Explore Map' Tab
    { frame: 470, x: 800, y: 90, click: true }, // Click Map Tab
    { frame: 530, x: 1050, y: 520 }, // Hover over Shivajinagar pin
    { frame: 610, x: 980, y: 90 }, // Move to 'Transit & Metro' Tab
    { frame: 620, x: 980, y: 90, click: true }, // Click Transit Tab
    { frame: 680, x: 1100, y: 380 }, // Follow moving metro train
    { frame: 760, x: 1160, y: 90 }, // Move to 'Food & Misal' Tab
    { frame: 770, x: 1160, y: 90, click: true }, // Click Food Tab
    { frame: 830, x: 850, y: 450 }, // Inspect Katakirr Misal card
    { frame: 890, x: 1340, y: 90 }, // Move to 'Trip Planner' Tab
    { frame: 900, x: 1340, y: 90, click: true }, // Click Planner Tab
    { frame: 940, x: 1250, y: 420 }, // Generate Itinerary
    { frame: 965, x: 1680, y: 90 }, // Move to language toggle
    { frame: 970, x: 1680, y: 90, click: true }, // Click 'मराठी'
    { frame: 1010, x: 1400, y: 600 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: act2Opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 60px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Real Website Browser Frame */}
      <RealWebsiteFrame activeTab={activeTab} isMarathi={isMarathi} />

      {/* Dynamic Feature Spotlight Card at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 46,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "16px 32px",
          borderRadius: 20,
          backgroundColor: "rgba(6, 19, 14, 0.94)",
          border: `1.5px solid ${BRAND.border}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.2)",
          zIndex: 50,
          maxWidth: 1200,
          width: "90%",
        }}
      >
        {/* Step Badge */}
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            border: "1px solid #10b981",
            color: "#10b981",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          {spotlightBadge}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 800 }}>
            {spotlightTitle}
          </div>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 2 }}>
            {spotlightDesc}
          </div>
        </div>

        {/* Live Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 10px #10b981",
            }}
          />
          <span style={{ color: "#10b981", fontSize: 13, fontWeight: 700 }}>
            REAL PLATFORM DATA
          </span>
        </div>
      </div>

      {/* Fluid Cursor Overlay */}
      <Cursor steps={cursorSteps} startFrame={155} endFrame={1025} />
    </AbsoluteFill>
  );
};
