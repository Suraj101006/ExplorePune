import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cursor, CursorKeyframe } from "./Cursor";
import { BRAND_COLORS } from "./types";

export const Act2Walkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active during frames 140 to 670 (with smooth blend)
  const act2Entry = interpolate(frame, [140, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act2Exit = interpolate(frame, [650, 675], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const act2Opacity = Math.min(act2Entry, act2Exit);

  // Camera Zoom & Pan between phases
  // Phase A (150-315): Normal scale 1.0
  // Phase B (315-495): Zoom in to 1.08, pan slightly left
  // Phase C (495-660): Zoom to 1.05, pan to right
  const cameraScale = interpolate(
    frame,
    [150, 315, 345, 495, 520],
    [1, 1, 1.07, 1.07, 1.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cameraX = interpolate(
    frame,
    [150, 315, 345, 495, 520],
    [0, 0, -40, -40, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Search typing simulation (Frames 205-245)
  const fullSearchText = "Sinhagad Fort";
  const typedLength = Math.floor(
    interpolate(frame, [205, 235], [0, fullSearchText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const currentSearchQuery = fullSearchText.slice(0, typedLength);

  // Autocomplete dropdown reveal (Frames 235-310)
  const dropdownSpring = spring({
    frame: frame - 235,
    fps,
    config: { damping: 15, stiffness: 140 },
  });
  const showDropdown = frame >= 235 && frame <= 315;

  // Category selection state (Frames 280+)
  const isHeritageSelected = frame >= 280;

  // Metro animated train position (Frames 360-495)
  const trainProgress = interpolate(frame, [360, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rising metrics counter (Frames 350-420)
  const countSpots = Math.floor(
    interpolate(frame, [350, 410], [0, 106], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const countMetro = Math.floor(
    interpolate(frame, [360, 410], [0, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // AI Itinerary Generation (Frames 520+)
  const itineraryGenerated = frame >= 520;
  const item1Spring = spring({
    frame: frame - 525,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const item2Spring = spring({
    frame: frame - 535,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const item3Spring = spring({
    frame: frame - 545,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Marathi Language switch state (Frames 600+)
  const isMarathi = frame >= 600;

  // Cursor Keyframes
  const cursorKeyframes: CursorKeyframe[] = [
    { frame: 160, x: 1400, y: 780 },
    { frame: 195, x: 960, y: 135 }, // Hover on search
    { frame: 202, x: 960, y: 135, click: true }, // Click search
    { frame: 245, x: 960, y: 135 },
    { frame: 275, x: 440, y: 195 }, // Move to 'Heritage' chip
    { frame: 280, x: 440, y: 195, click: true }, // Click 'Heritage'
    { frame: 320, x: 650, y: 450 }, // Move over destination card
    { frame: 370, x: 1480, y: 460 }, // Inspect metro transit
    { frame: 515, x: 1260, y: 310 }, // Move to 'Generate Itinerary'
    { frame: 520, x: 1260, y: 310, click: true }, // Click Generate
    { frame: 595, x: 1680, y: 135 }, // Move to language toggle 'MR'
    { frame: 600, x: 1680, y: 135, click: true }, // Click MR
    { frame: 640, x: 1350, y: 550 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: act2Opacity,
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Dynamic Camera Wrapper */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale}) translate(${cameraX}px, 0px)`,
          transformOrigin: "center center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 80px",
        }}
      >
        {/* Mock Browser & Website Frame */}
        <div
          style={{
            width: 1720,
            height: 960,
            borderRadius: 24,
            backgroundColor: "rgba(10, 25, 18, 0.94)",
            border: `1.5px solid ${BRAND_COLORS.border}`,
            boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 40px rgba(16, 185, 129, 0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Browser Chrome Bar */}
          <div
            style={{
              height: 52,
              backgroundColor: "rgba(6, 19, 14, 0.95)",
              borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              justifyContent: "space-between",
            }}
          >
            {/* Traffic Light Dots */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
            </div>

            {/* Address Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(12, 32, 24, 0.8)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: 8,
                padding: "6px 24px",
                color: "#94a3b8",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span style={{ color: "#10b981" }}>🔒</span>
              <span>https://explore-pune-eosin.vercel.app/</span>
            </div>

            <div style={{ width: 50 }} />
          </div>

          {/* Website Header & Navigation */}
          <div
            style={{
              height: 74,
              backgroundColor: "rgba(12, 32, 24, 0.6)",
              borderBottom: "1px solid rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 36px",
            }}
          >
            {/* Brand Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 20,
                  boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)",
                }}
              >
                पु
              </div>
              <div>
                <div style={{ color: "#f8fafc", fontSize: 22, fontWeight: 700 }}>
                  {isMarathi ? "पुणे दर्शन" : "Explore Pune"}
                </div>
                <div style={{ color: "#10b981", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>
                  {isMarathi ? "अधिकृत मार्गदर्शक" : "CURATED CITY GUIDE"}
                </div>
              </div>
            </div>

            {/* Global Search Bar */}
            <div
              style={{
                position: "relative",
                width: 480,
                height: 44,
                borderRadius: 9999,
                backgroundColor: "rgba(6, 19, 14, 0.9)",
                border: `1.5px solid ${frame >= 200 && frame <= 245 ? "#10b981" : "rgba(16, 185, 129, 0.3)"}`,
                boxShadow: frame >= 200 && frame <= 245 ? "0 0 16px rgba(16, 185, 129, 0.3)" : "none",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 16 }}>🔍</span>
              <span
                style={{
                  color: currentSearchQuery ? "#f8fafc" : "#64748b",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {currentSearchQuery || (isMarathi ? "किल्ले, मंदिरे, खाद्यसंस्कृती शोधा..." : "Search 106 destinations, forts, food...")}
              </span>
              {frame >= 200 && frame <= 240 && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 18,
                    backgroundColor: "#10b981",
                    marginLeft: -8,
                  }}
                />
              )}

              {/* Autocomplete Dropdown Popup */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: 52,
                    left: 0,
                    right: 0,
                    borderRadius: 16,
                    backgroundColor: "rgba(10, 28, 20, 0.98)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    boxShadow: "0 16px 36px rgba(0, 0, 0, 0.8)",
                    padding: 12,
                    opacity: dropdownSpring,
                    transform: `translateY(${(1 - dropdownSpring) * 10}px)`,
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 14px",
                      borderRadius: 10,
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        overflow: "hidden",
                        backgroundColor: "#065f46",
                      }}
                    >
                      <Img
                        src={staticFile("images/places/sinhagad-fort.jpg")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>
                        Sinhagad Fort (सिंहगड किल्ला)
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 13 }}>
                        Haveli • Heritage & Treks • ⭐ 4.8 (3-4 hrs)
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        backgroundColor: "#10b981",
                        color: "#06130e",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      MATCH
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Language & CTA Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Language Switcher */}
              <div
                style={{
                  display: "flex",
                  borderRadius: 9999,
                  backgroundColor: "rgba(6, 19, 14, 0.8)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  padding: 3,
                }}
              >
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    backgroundColor: isMarathi ? "transparent" : "#10b981",
                    color: isMarathi ? "#94a3b8" : "#06130e",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  EN
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    backgroundColor: isMarathi ? "#10b981" : "transparent",
                    color: isMarathi ? "#06130e" : "#94a3b8",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  मराठी
                </div>
              </div>

              {/* Verified Count Badge */}
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#10b981",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                ✓ 106 Places Live
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div
            style={{
              padding: "16px 36px",
              display: "flex",
              gap: 12,
              borderBottom: "1px solid rgba(16, 185, 129, 0.08)",
              backgroundColor: "rgba(6, 19, 14, 0.4)",
            }}
          >
            {[
              { id: "all", label: isMarathi ? "सर्व ठिकाणे" : "All Places" },
              { id: "heritage", label: isMarathi ? "ऐतिहासिक किल्ले व वाडे" : "Heritage & Forts" },
              { id: "nature", label: isMarathi ? "निसर्ग व तलाव" : "Nature & Lakes" },
              { id: "food", label: isMarathi ? "पुणेरी मिसळ व खाद्य" : "Food & Misal" },
              { id: "spiritual", label: isMarathi ? "धार्मिक व मंदिरे" : "Spiritual & Temples" },
            ].map((cat) => {
              const isActive = cat.id === (isHeritageSelected ? "heritage" : "all");
              return (
                <div
                  key={cat.id}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: isActive ? "#10b981" : "rgba(12, 32, 24, 0.6)",
                    color: isActive ? "#06130e" : "#94a3b8",
                    border: `1px solid ${isActive ? "#10b981" : "rgba(16, 185, 129, 0.15)"}`,
                    boxShadow: isActive ? "0 0 14px rgba(16, 185, 129, 0.35)" : "none",
                  }}
                >
                  {cat.label}
                </div>
              );
            })}
          </div>

          {/* Main Content Area (Split Grid) */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 28,
              padding: "24px 36px",
              overflow: "hidden",
            }}
          >
            {/* Left Column: Featured Destination Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Primary Card: Sinhagad Fort */}
              <div
                style={{
                  borderRadius: 18,
                  backgroundColor: "rgba(12, 32, 24, 0.8)",
                  border: "1.5px solid rgba(16, 185, 129, 0.3)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  overflow: "hidden",
                  display: "flex",
                  height: 250,
                }}
              >
                {/* Photo */}
                <div style={{ width: 280, position: "relative" }}>
                  <Img
                    src={staticFile("images/places/sinhagad-fort.jpg")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      backgroundColor: "rgba(6, 19, 14, 0.85)",
                      border: "1px solid #f59e0b",
                      color: "#fbbf24",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ⭐ 4.8 (14.2k)
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ color: "#f8fafc", fontSize: 24, fontWeight: 700, margin: 0 }}>
                          {isMarathi ? "सिंहगड किल्ला" : "Sinhagad Fort"}
                        </h3>
                        <p style={{ color: "#10b981", fontSize: 13, fontWeight: 600, margin: "4px 0 0 0" }}>
                          {isMarathi ? "हवेली • ऐतिहासिक ट्रेक" : "Haveli Region • Historic Maratha Fort"}
                        </p>
                      </div>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 9999,
                          backgroundColor: "rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {isMarathi ? "प्रवेश: ₹५०" : "Entry: ₹50"}
                      </span>
                    </div>

                    <p style={{ color: "#94a3b8", fontSize: 14, margin: "14px 0 0 0", lineHeight: 1.5 }}>
                      {isMarathi
                        ? "तानाजी मालुसरे यांच्या पराक्रमाची साक्ष देणारा ऐतिहासिक किल्ला. पावसाळा आणि हिवाळ्यात अप्रतिम दृश्य."
                        : "Famous 17th-century fortress situated on the Sahyadri ranges with breathtaking plateau vistas and famous Kanda Bhaji."}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ color: "#cbd5e1", fontSize: 13 }}>⏱️ <strong>{isMarathi ? "वेळ:" : "Duration:"}</strong> 3–4 hrs</div>
                    <div style={{ color: "#cbd5e1", fontSize: 13 }}>🌤️ <strong>{isMarathi ? "उत्तम काळ:" : "Best:"}</strong> Monsoon / Winter</div>
                  </div>
                </div>
              </div>

              {/* Secondary Card: Shaniwar Wada & Katakirr Misal row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  {
                    name: isMarathi ? "शनिवार वाडा" : "Shaniwar Wada",
                    cat: isMarathi ? "पेशावेकालीन वास्तू" : "Peshwa Citadel",
                    rating: 4.6,
                    image: "images/places/shaniwar-wada.jpg",
                  },
                  {
                    name: isMarathi ? "काटाकिर्र मिसळ" : "Katakirr Misal",
                    cat: isMarathi ? "पुणेरी प्रसिद्ध खाद्य" : "Authentic Puneri Misal",
                    rating: 4.9,
                    image: "images/places/katakirr-misal.jpg",
                  },
                ].map((spot, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 14,
                      backgroundColor: "rgba(12, 32, 24, 0.6)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      padding: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                      <Img src={staticFile(spot.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>{spot.name}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>{spot.cat}</div>
                      <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginTop: 4 }}>⭐ {spot.rating}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Metrics Counter Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  padding: "16px 20px",
                  borderRadius: 14,
                  backgroundColor: "rgba(6, 19, 14, 0.7)",
                  border: "1px solid rgba(16, 185, 129, 0.18)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#10b981", fontSize: 28, fontWeight: 800 }}>{countSpots}+</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{isMarathi ? "नोंदणीकृत ठिकाणे" : "Curated Spots"}</div>
                </div>
                <div style={{ width: 1, backgroundColor: "rgba(16, 185, 129, 0.2)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#a855f7", fontSize: 28, fontWeight: 800 }}>{countMetro}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{isMarathi ? "मेट्रो लाईन्स" : "Metro Lines"}</div>
                </div>
                <div style={{ width: 1, backgroundColor: "rgba(16, 185, 129, 0.2)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#f59e0b", fontSize: 28, fontWeight: 800 }}>100%</div>
                  <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{isMarathi ? "सत्यापित माहिती" : "Verified Timings"}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Transit Map & AI Itinerary Generator */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Pune Metro & Bus Route Card */}
              <div
                style={{
                  borderRadius: 18,
                  backgroundColor: "rgba(12, 32, 24, 0.8)",
                  border: "1.5px solid rgba(168, 85, 247, 0.35)",
                  padding: 20,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🚇</span>
                    <span style={{ color: "#f8fafc", fontSize: 18, fontWeight: 700 }}>
                      {isMarathi ? "पुणे मेट्रो व पीएमपीएमएल मार्ग" : "Pune Metro & Transit Map"}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      backgroundColor: "rgba(168, 85, 247, 0.2)",
                      color: "#c084fc",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    PURPLE & AQUA
                  </span>
                </div>

                {/* Animated Metro Vector Track */}
                <div
                  style={{
                    position: "relative",
                    height: 54,
                    borderRadius: 10,
                    backgroundColor: "rgba(6, 19, 14, 0.9)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                    overflow: "hidden",
                  }}
                >
                  {/* Track Line */}
                  <div
                    style={{
                      position: "absolute",
                      left: 24,
                      right: 24,
                      height: 6,
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #9333ea 0%, #06b6d4 100%)",
                    }}
                  />

                  {/* Stations */}
                  {["PCMC", "Shivajinagar", "Civil Court", "Swargate"].map((stn, i) => (
                    <div
                      key={stn}
                      style={{
                        position: "absolute",
                        left: `${20 + i * 25}%`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: "#f8fafc",
                          border: "3px solid #9333ea",
                        }}
                      />
                      <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 600, marginTop: 4 }}>
                        {stn}
                      </span>
                    </div>
                  ))}

                  {/* Animated Train Marker */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${20 + trainProgress * 75}%`,
                      transform: "translateX(-50%)",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      border: "2px solid #ffffff",
                      boxShadow: "0 0 16px #10b981",
                      zIndex: 10,
                    }}
                  />
                </div>

                {/* Bus Connect Info */}
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 8,
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    color: "#fbbf24",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span>🚌</span>
                  <span>
                    {isMarathi
                      ? "बस ५१: शनिवार वाडा ते सिंहगड पायथा • दर २० मिनिटांनी"
                      : "PMPML Bus 51: Shanipar to Sinhagad Paytha • Every 20 mins"}
                  </span>
                </div>
              </div>

              {/* 1-Click AI Trip Planner & Itinerary Output */}
              <div
                style={{
                  borderRadius: 18,
                  backgroundColor: "rgba(12, 32, 24, 0.8)",
                  border: "1.5px solid rgba(16, 185, 129, 0.35)",
                  padding: 20,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header & Trigger Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🧭</span>
                    <span style={{ color: "#f8fafc", fontSize: 18, fontWeight: 700 }}>
                      {isMarathi ? "स्मार्ट सहल आयोजक" : "Smart AI Trip Planner"}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      backgroundColor: itineraryGenerated ? "#10b981" : "rgba(16, 185, 129, 0.2)",
                      color: itineraryGenerated ? "#06130e" : "#10b981",
                      fontSize: 13,
                      fontWeight: 700,
                      boxShadow: itineraryGenerated ? "0 0 16px rgba(16, 185, 129, 0.4)" : "none",
                    }}
                  >
                    {isMarathi ? "१-दिवसाची सफर तयार" : "1-Day Itinerary"}
                  </div>
                </div>

                {/* Staggered Timeline Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {[
                    {
                      time: "09:00 AM",
                      title: isMarathi ? "शनिवार वाडा दर्शन" : "Shaniwar Wada Heritage Walk",
                      sub: isMarathi ? "पेशावेकालीन इतिहास व वास्तुकला" : "Historic Peshwa Architecture",
                      springVal: item1Spring,
                    },
                    {
                      time: "12:30 PM",
                      title: isMarathi ? "काटाकिर्र मिसळ (कर्वे रोड)" : "Authentic Misal at Katakirr",
                      sub: isMarathi ? "पुणेरी झणझणीत मिसळ आस्वाद" : "Legendary Puneri Lunch",
                      springVal: item2Spring,
                    },
                    {
                      time: "04:30 PM",
                      title: isMarathi ? "सिंहगड किल्ला सूर्यास्त" : "Sinhagad Sunset Vista",
                      sub: isMarathi ? "सह्याद्रीच्या कुशीत सूर्यास्त" : "Sahyadri Golden Hour Trek",
                      springVal: item3Spring,
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        opacity: itineraryGenerated ? step.springVal : 0.35,
                        transform: `translateY(${itineraryGenerated ? (1 - step.springVal) * 14 : 0}px)`,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        borderRadius: 10,
                        backgroundColor: "rgba(6, 19, 14, 0.8)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          backgroundColor: "#10b981",
                          color: "#06130e",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {step.time}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700 }}>{step.title}</div>
                        <div style={{ color: "#94a3b8", fontSize: 12 }}>{step.sub}</div>
                      </div>
                      <span style={{ color: "#10b981", fontSize: 14 }}>✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fluid Cursor Overlay */}
      <Cursor keyframes={cursorKeyframes} visibleFrom={155} visibleUntil={660} />
    </AbsoluteFill>
  );
};
