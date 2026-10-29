import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Cursor, CursorStep } from "./Cursor";
import { AQUA_LINE_STATIONS, BRAND_TOKENS, PURPLE_LINE_STATIONS, SupportedLanguage } from "./types";

interface Scene5Props {
  lang: SupportedLanguage;
}

export const Scene5PuneMetro: React.FC<Scene5Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 1640 to 2170
  const enterOpacity = interpolate(frame, [1640, 1665], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [2145, 2170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  // Train travel progress along Purple Line
  const purpleTrainPos = interpolate(frame, [1700, 2080], [0.1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Train travel progress along Aqua Line
  const aquaTrainPos = interpolate(frame, [1730, 2050], [0.15, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorSteps: CursorStep[] = [
    { frame: 1660, x: 1400, y: 700 },
    { frame: 1740, x: 740, y: 350 }, // Hover over PCMC
    { frame: 1750, x: 740, y: 350, click: true },
    { frame: 1840, x: 1040, y: 440 }, // Click Civil Court Interchange
    { frame: 1850, x: 1040, y: 440, click: true },
    { frame: 1980, x: 1350, y: 350 }, // Inspect Swargate
    { frame: 2080, x: 1200, y: 750 },
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
          backgroundColor: "#081b15",
          border: `1.5px solid ${BRAND_TOKENS.border}`,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(147, 51, 234, 0.2)",
          display: "flex",
          flexDirection: "column",
          padding: "32px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Metro Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "rgba(147, 51, 234, 0.2)",
                border: "2px solid #9333ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              🚇
            </div>
            <div>
              <h2 style={{ color: "#f8fafc", fontSize: 32, fontWeight: 800, margin: 0 }}>
                {lang === "mr" ? "पुणे मेट्रो रेल महामंडळ (महामेट्रो)" : "Pune Metro Rail Network"}
              </h2>
              <p style={{ color: "#c084fc", fontSize: 16, fontWeight: 600, margin: "4px 0 0 0" }}>
                {lang === "mr" ? "पर्पल लाईन • अक्वा लाईन • सिव्हिल कोर्ट इंटरचेंज" : "Line 1 (Purple) & Line 2 (Aqua) • Civil Court Interchange Hub"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ padding: "8px 18px", borderRadius: 10, backgroundColor: "rgba(147, 51, 234, 0.2)", color: "#c084fc", fontWeight: 700, fontSize: 14 }}>
              LINE 1: PCMC ↔ SWARGATE
            </span>
            <span style={{ padding: "8px 18px", borderRadius: 10, backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#22d3ee", fontWeight: 700, fontSize: 14 }}>
              LINE 2: VANAZ ↔ RAMWADI
            </span>
          </div>
        </div>

        {/* Dual Line Schematic Tracks Container */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 19, 14, 0.95)",
            borderRadius: 18,
            border: "1px solid rgba(147, 51, 234, 0.25)",
            position: "relative",
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            overflow: "hidden",
          }}
        >
          {/* Track 1: Purple Line */}
          <div style={{ position: "relative", height: 100, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, top: 2, color: "#c084fc", fontSize: 13, fontWeight: 800 }}>
              PURPLE LINE (NORTH-SOUTH CORRIDOR)
            </div>

            {/* Rail Line */}
            <div
              style={{
                position: "absolute",
                left: 100,
                right: 100,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#9333ea",
                boxShadow: "0 0 16px rgba(147, 51, 234, 0.6)",
              }}
            />

            {/* Stations */}
            {PURPLE_LINE_STATIONS.map((stn, idx) => (
              <div
                key={idx}
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
                    width: stn.isInterchange ? 26 : 18,
                    height: stn.isInterchange ? 26 : 18,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: `4px solid ${stn.isInterchange ? "#f59e0b" : "#9333ea"}`,
                    boxShadow: stn.isInterchange ? "0 0 16px #f59e0b" : "0 0 10px #9333ea",
                  }}
                />
                <span style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginTop: 10 }}>
                  {lang === "mr" ? stn.marathiName : stn.name}
                </span>
                {stn.isInterchange && (
                  <span style={{ color: "#f59e0b", fontSize: 10, fontWeight: 800, marginTop: 2 }}>
                    INTERCHANGE
                  </span>
                )}
              </div>
            ))}

            {/* Moving Purple Line Train */}
            <div
              style={{
                position: "absolute",
                left: `${purpleTrainPos * 100}%`,
                transform: "translateX(-50%)",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#9333ea",
                border: "2px solid #ffffff",
                boxShadow: "0 0 20px #9333ea",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 6,
                zIndex: 20,
              }}
            >
              <span>🚆</span>
              <span>METRO 1</span>
            </div>
          </div>

          {/* Track 2: Aqua Line */}
          <div style={{ position: "relative", height: 100, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, top: 2, color: "#22d3ee", fontSize: 13, fontWeight: 800 }}>
              AQUA LINE (EAST-WEST CORRIDOR)
            </div>

            {/* Rail Line */}
            <div
              style={{
                position: "absolute",
                left: 100,
                right: 100,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#06b6d4",
                boxShadow: "0 0 16px rgba(6, 182, 212, 0.6)",
              }}
            />

            {/* Stations */}
            {AQUA_LINE_STATIONS.map((stn, idx) => (
              <div
                key={idx}
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
                    width: stn.isInterchange ? 26 : 18,
                    height: stn.isInterchange ? 26 : 18,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: `4px solid ${stn.isInterchange ? "#f59e0b" : "#06b6d4"}`,
                    boxShadow: stn.isInterchange ? "0 0 16px #f59e0b" : "0 0 10px #06b6d4",
                  }}
                />
                <span style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginTop: 10 }}>
                  {lang === "mr" ? stn.marathiName : stn.name}
                </span>
              </div>
            ))}

            {/* Moving Aqua Line Train */}
            <div
              style={{
                position: "absolute",
                left: `${aquaTrainPos * 100}%`,
                transform: "translateX(-50%)",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#06b6d4",
                border: "2px solid #ffffff",
                boxShadow: "0 0 20px #06b6d4",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 6,
                zIndex: 20,
              }}
            >
              <span>🚆</span>
              <span>METRO 2</span>
            </div>
          </div>

          {/* Live Metro Metrics Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 16,
              borderTop: "1px solid rgba(147, 51, 234, 0.2)",
              color: "#cbd5e1",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <div>⏱️ {lang === "mr" ? "वारंवारता: दर ७ मिनिटांनी (गर्दीच्या वेळी)" : "Peak Frequency: Every 7 Mins"}</div>
            <div>⚡ {lang === "mr" ? "वेळ: सकाळी ६:०० ते रात्री १०:००" : "Operating Hours: 06:00 AM – 10:00 PM"}</div>
            <div>🎫 {lang === "mr" ? "तिकीट: ₹१० ते ₹३५ (१०% सवलत मेट्रो कार्डवर)" : "Fares: ₹10 to ₹35 • 10% Metro Card Discount"}</div>
          </div>
        </div>
      </div>

      <Cursor steps={cursorSteps} startFrame={1655} endFrame={2150} />
    </AbsoluteFill>
  );
};
