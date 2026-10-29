import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BRAND, NAV_TABS } from "./types";

interface RealWebsiteFrameProps {
  activeTab: string;
  isMarathi?: boolean;
}

export const RealWebsiteFrame: React.FC<RealWebsiteFrameProps> = ({
  activeTab,
  isMarathi = false,
}) => {
  const frame = useCurrentFrame();

  // Dynamic Camera motion & Pan across phases
  // Frame 150-320 (Home & Search): Focus on hero search
  // Frame 320-470 (Heritage): Zoom into Sinhagad Fort detail
  // Frame 470-620 (Map): Zoom into Pune Geographic Map
  // Frame 620-770 (Transit): Zoom into Metro line & bus route
  // Frame 770-900 (Food): Zoom into Katakirr Misal & food cards
  // Frame 900-1010 (Planner): Zoom into Itinerary steps & Marathi toggle
  const zoomScale = interpolate(
    frame,
    [150, 200, 320, 360, 470, 510, 620, 660, 770, 810, 900, 940, 1010],
    [1.0, 1.04, 1.0, 1.12, 1.0, 1.08, 1.0, 1.1, 1.0, 1.08, 1.0, 1.06, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const panY = interpolate(
    frame,
    [150, 200, 320, 360, 470, 510, 620, 660, 770, 810, 900, 940, 1010],
    [0, -20, 0, -80, 0, -50, 0, -40, 0, -70, 0, -30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cross-fade opacity between captures
  const opacHome = interpolate(frame, [150, 170, 250, 260], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacSearch = interpolate(frame, [250, 265, 320, 335], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacHeritage = interpolate(frame, [320, 335, 470, 485], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacMap = interpolate(frame, [470, 485, 620, 635], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacTransit = interpolate(frame, [620, 635, 770, 785], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacFood = interpolate(frame, [770, 785, 900, 915], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacPlanner = interpolate(frame, [900, 915, 1020, 1035], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Train animation progress across the transit phase (620 to 770)
  const trainPos = interpolate(frame, [630, 760], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1740,
        height: 960,
        borderRadius: 24,
        backgroundColor: "rgba(10, 25, 18, 0.96)",
        border: `1.5px solid ${BRAND.border}`,
        boxShadow: "0 28px 70px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(16, 185, 129, 0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Browser Chrome Header */}
      <div
        style={{
          height: 52,
          backgroundColor: "rgba(6, 19, 14, 0.98)",
          borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 40,
        }}
      >
        {/* macOS Traffic Lights */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
        </div>

        {/* URL Capsule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "rgba(12, 32, 24, 0.85)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: 8,
            padding: "6px 28px",
            color: "#94a3b8",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#10b981" }}>🔒</span>
          <span>https://explore-pune-eosin.vercel.app/</span>
          <span style={{ color: "#10b981", fontSize: 11, background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
            VERIFIED LIVE
          </span>
        </div>

        {/* Right Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 8px #10b981" }} />
          <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>
            {isMarathi ? "मराठी आवृत्ती" : "English (EN)"}
          </span>
        </div>
      </div>

      {/* Website Navigation Tabs Bar */}
      <div
        style={{
          height: 64,
          backgroundColor: "rgba(12, 32, 24, 0.85)",
          borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          zIndex: 35,
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            पु
          </div>
          <div>
            <div style={{ color: "#f8fafc", fontSize: 20, fontWeight: 800 }}>
              {isMarathi ? "पुणे दर्शन" : "Explore Pune"}
            </div>
          </div>
        </div>

        {/* Dynamic Feature Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {NAV_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <div
                key={tab.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: isActive ? "#10b981" : "transparent",
                  color: isActive ? "#06130e" : "#94a3b8",
                  border: `1px solid ${isActive ? "#10b981" : "transparent"}`,
                  boxShadow: isActive ? "0 0 16px rgba(16, 185, 129, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{tab.icon}</span>
                <span>{isMarathi ? tab.marathiLabel : tab.label}</span>
              </div>
            );
          })}
        </div>

        {/* Live Badge */}
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 9999,
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#10b981",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          106 Places Live
        </div>
      </div>

      {/* Real Website Screen Viewport */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#06130e",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoomScale}) translateY(${panY}px)`,
            transformOrigin: "center center",
            position: "relative",
          }}
        >
          {/* Phase 1: Real Homepage Desktop */}
          {opacHome > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacHome }}>
              <Img
                src={staticFile("images/real-site/01_homepage_desktop_.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Phase 1-B: Real Autocomplete Search */}
          {opacSearch > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacSearch }}>
              <Img
                src={staticFile("images/real-site/interaction_search_sinhagad.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Phase 2: Real Historical Sites (Sinhagad & Shaniwar Wada) */}
          {opacHeritage > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacHeritage }}>
              <Img
                src={staticFile("images/real-site/07_destination_detail_sinhagad_fort.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Phase 3: Real Interactive Geographic Map */}
          {opacMap > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacMap }}>
              <Img
                src={staticFile("images/pune-map-hero.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
              />
              {/* Interactive Pin Highlights */}
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "48%",
                  padding: "8px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(6, 19, 14, 0.9)",
                  border: "2px solid #10b981",
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>📍</span>
                <span>Shivajinagar & Old City (34 Spots)</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "28%",
                  left: "38%",
                  padding: "8px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(6, 19, 14, 0.9)",
                  border: "2px solid #f59e0b",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>⛰️</span>
                <span>Sinhagad Fort Trek Trail</span>
              </div>
            </div>
          )}

          {/* Phase 4: Real Local Transit (Metro & Bus) */}
          {opacTransit > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: opacTransit,
                backgroundColor: "#081b13",
                padding: "36px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Transit Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ color: "#f8fafc", fontSize: 32, fontWeight: 800, margin: 0 }}>
                    🚇 Pune Integrated Public Transit Network
                  </h2>
                  <p style={{ color: "#10b981", fontSize: 16, fontWeight: 600, margin: "6px 0 0 0" }}>
                    Purple Line • Aqua Line • PMPML Feeder Buses • 100% Verified Timetables
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgba(168, 85, 247, 0.25)", color: "#c084fc", fontWeight: 700 }}>
                    PURPLE LINE: PCMC ↔ SWARGATE
                  </span>
                  <span style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#22d3ee", fontWeight: 700 }}>
                    AQUA LINE: VANAZ ↔ RAMWADI
                  </span>
                </div>
              </div>

              {/* Dynamic Animated Metro Vector Map */}
              <div
                style={{
                  height: 180,
                  borderRadius: 16,
                  backgroundColor: "rgba(6, 19, 14, 0.95)",
                  border: "1.5px solid rgba(168, 85, 247, 0.3)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 60px",
                }}
              >
                {/* Purple Line Track */}
                <div
                  style={{
                    position: "absolute",
                    left: 60,
                    right: 60,
                    height: 8,
                    borderRadius: 4,
                    background: "linear-gradient(90deg, #9333ea 0%, #a855f7 50%, #06b6d4 100%)",
                  }}
                />

                {/* Stations */}
                {[
                  { name: "PCMC", pos: "8%" },
                  { name: "Bhosari", pos: "24%" },
                  { name: "Shivajinagar", pos: "44%" },
                  { name: "Civil Court (Interchange)", pos: "64%" },
                  { name: "Swargate", pos: "88%" },
                ].map((stn, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: stn.pos,
                      transform: "translateX(-50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        border: "4px solid #9333ea",
                        boxShadow: "0 0 10px #9333ea",
                      }}
                    />
                    <span style={{ color: "#f8fafc", fontSize: 13, fontWeight: 700, marginTop: 10, whiteSpace: "nowrap" }}>
                      {stn.name}
                    </span>
                  </div>
                ))}

                {/* Moving Train Capsule */}
                <div
                  style={{
                    position: "absolute",
                    left: `${8 + trainPos * 80}%`,
                    transform: "translateX(-50%)",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    border: "3px solid #ffffff",
                    boxShadow: "0 0 24px #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: 14,
                    zIndex: 20,
                  }}
                >
                  🚆
                </div>
              </div>

              {/* PMPML Feeder Bus Connect */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    padding: "16px 22px",
                    borderRadius: 14,
                    backgroundColor: "rgba(12, 32, 24, 0.9)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div style={{ fontSize: 32 }}>🚌</div>
                  <div>
                    <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: 800 }}>PMPML Route 51</div>
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 600 }}>Shanipar to Sinhagad Paytha</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Every 20 mins • Fare ₹35 • 100% Verified</div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px 22px",
                    borderRadius: 14,
                    backgroundColor: "rgba(12, 32, 24, 0.9)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div style={{ fontSize: 32 }}>🧭</div>
                  <div>
                    <div style={{ color: "#10b981", fontSize: 18, fontWeight: 800 }}>Live Directions Engine</div>
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 600 }}>Multi-Modal Transit Router</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Step-by-step guidance across all 106 destinations</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase 5: Real Food & Misal Recommendations */}
          {opacFood > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacFood }}>
              <Img
                src={staticFile("images/real-site/06_category_food_cuisine.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}

          {/* Phase 6: Real AI Trip Planner & Marathi Interface */}
          {opacPlanner > 0 && (
            <div style={{ position: "absolute", inset: 0, opacity: opacPlanner }}>
              <Img
                src={
                  isMarathi
                    ? staticFile("images/real-site/interaction_marathi_language.png")
                    : staticFile("images/real-site/09_trip_planner.png")
                }
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
