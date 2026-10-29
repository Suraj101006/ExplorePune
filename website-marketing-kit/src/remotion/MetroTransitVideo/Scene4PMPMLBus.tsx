import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Cursor, CursorStep } from "./Cursor";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene4Props {
  lang: SupportedLanguage;
}

export const Scene4PMPMLBus: React.FC<Scene4Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 1130 to 1660
  const enterOpacity = interpolate(frame, [1130, 1155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [1635, 1660], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Bus route drawing progress
  const busRouteProgress = interpolate(frame, [1200, 1500], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor Steps
  const cursorSteps: CursorStep[] = [
    { frame: 1150, x: 1350, y: 700 },
    { frame: 1220, x: 480, y: 320 }, // Select Route 51 card
    { frame: 1230, x: 480, y: 320, click: true },
    { frame: 1340, x: 920, y: 480 }, // Inspect Khadakwasla Dam stop
    { frame: 1450, x: 1400, y: 480 }, // Inspect Sinhagad Paytha stop
    { frame: 1560, x: 1200, y: 780 },
  ];

  const BUS_STOPS = [
    { name: "Shanipar (City)", mrName: "शनिवार पेठ", time: "06:00 AM" },
    { name: "Alka Talkies", mrName: "अलका टॉकीज", time: "06:12 AM" },
    { name: "Dandekar Pul", mrName: "दांडेकर पूल", time: "06:22 AM" },
    { name: "Khadakwasla Dam", mrName: "खडकवासला धरण", time: "06:45 AM" },
    { name: "Donje Phata", mrName: "डोंजे फाटा", time: "07:05 AM" },
    { name: "Sinhagad Paytha", mrName: "सिंहगड पायथा", time: "07:20 AM" },
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
      {/* PMPML Dashboard Window */}
      <div
        style={{
          width: 1720,
          height: 960,
          borderRadius: 22,
          backgroundColor: "#081d14",
          border: `1.5px solid ${BRAND_TOKENS.border}`,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(245, 158, 11, 0.15)",
          display: "flex",
          flexDirection: "column",
          padding: "32px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                border: "2px solid #f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🚌
            </div>
            <div>
              <h2 style={{ color: "#f8fafc", fontSize: 32, fontWeight: 800, margin: 0 }}>
                {lang === "mr" ? "पीएमपीएमएल बस सेवा व वेळापत्रक" : "PMPML Public Bus Network & Timetables"}
              </h2>
              <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 600, margin: "4px 0 0 0" }}>
                {lang === "mr" ? "अधिकृत मार्ग व थांबे • खात्रीशीर माहिती" : "Official Scheduled Routes • 150+ Lines Supported"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ padding: "8px 18px", borderRadius: 10, backgroundColor: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fbbf24", fontSize: 14, fontWeight: 700 }}>
              VERIFIED PMPML GTFS DATA
            </span>
          </div>
        </div>

        {/* Selected Route Focus Card: Route 51 */}
        <div
          style={{
            padding: "24px 32px",
            borderRadius: 18,
            backgroundColor: "rgba(12, 32, 24, 0.9)",
            border: "1.5px solid rgba(245, 158, 11, 0.35)",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ padding: "4px 12px", borderRadius: 8, backgroundColor: "#f59e0b", color: "#06130e", fontSize: 16, fontWeight: 900 }}>
                ROUTE 51
              </span>
              <span style={{ color: "#f8fafc", fontSize: 24, fontWeight: 800 }}>
                {lang === "mr" ? "शनिवार पेठ ➔ सिंहगड किल्ला पायथा" : "Shanipar ➔ Sinhagad Fort Paytha"}
              </span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 8 }}>
              {lang === "mr"
                ? "वारसा व ट्रेक विशेष बस • दर २० मिनिटांनी उपलब्ध • अधिकृत तिकीट दर: ₹३५"
                : "Heritage & Trek Express Feeder • Frequency: Every 20 Mins • Standard Adult Fare: ₹35"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ textAlign: "center", padding: "10px 18px", borderRadius: 12, backgroundColor: "rgba(6, 19, 14, 0.8)" }}>
              <div style={{ color: "#10b981", fontSize: 20, fontWeight: 800 }}>06:00 AM</div>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700 }}>FIRST BUS</div>
            </div>
            <div style={{ textAlign: "center", padding: "10px 18px", borderRadius: 12, backgroundColor: "rgba(6, 19, 14, 0.8)" }}>
              <div style={{ color: "#f59e0b", fontSize: 20, fontWeight: 800 }}>09:30 PM</div>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700 }}>LAST BUS</div>
            </div>
          </div>
        </div>

        {/* Dynamic Horizontal Bus Route Stops Sequence */}
        <div
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: "rgba(6, 19, 14, 0.9)",
            borderRadius: 18,
            border: "1px solid rgba(245, 158, 11, 0.2)",
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
            overflow: "hidden",
          }}
        >
          {/* Track Line */}
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
          {/* Animated Green Drawn Line */}
          <div
            style={{
              position: "absolute",
              left: 60,
              width: `${(1720 - 220) * busRouteProgress}px`,
              height: 6,
              borderRadius: 3,
              background: "linear-gradient(90deg, #f59e0b 0%, #10b981 100%)",
              boxShadow: "0 0 12px #10b981",
            }}
          />

          {/* Bus Stops */}
          {BUS_STOPS.map((stn, idx) => {
            const stopPercent = (idx / (BUS_STOPS.length - 1)) * 100;
            const reached = busRouteProgress >= idx / (BUS_STOPS.length - 1);
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${6 + (stopPercent * 0.88)}%`,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: reached ? "#10b981" : "#1e293b",
                    border: `3px solid ${reached ? "#ffffff" : "#64748b"}`,
                    boxShadow: reached ? "0 0 14px #10b981" : "none",
                    transition: "all 0.2s ease",
                  }}
                />
                <span
                  style={{
                    color: reached ? "#f8fafc" : "#64748b",
                    fontSize: 14,
                    fontWeight: 700,
                    marginTop: 12,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lang === "mr" ? stn.mrName : stn.name}
                </span>
                <span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 600, marginTop: 4 }}>
                  {stn.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Cursor steps={cursorSteps} startFrame={1145} endFrame={1640} />
    </AbsoluteFill>
  );
};
