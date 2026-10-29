import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BRAND_TOKENS, SupportedLanguage } from "./types";

interface Scene7Props {
  lang: SupportedLanguage;
}

export const Scene7BrandMontage: React.FC<Scene7Props> = ({ lang }) => {
  const frame = useCurrentFrame();

  // Active during frames 2690 to 3070
  const enterOpacity = interpolate(frame, [2690, 2715], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [3045, 3070], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterOpacity, exitOpacity);

  const PILLARS = [
    {
      titleEn: "Explore Pune.",
      titleMr: "पुणे दर्शन.",
      descEn: "106+ Verified Cultural, Heritage & Trek Destinations",
      descMr: "१०६ हून अधिक ऐतिहासिक, निसर्ग व सांस्कृतिक स्थळे",
      icon: "🏛️",
      color: "#10b981",
    },
    {
      titleEn: "Find Your Route.",
      titleMr: "मार्ग शोधा.",
      descEn: "Pune Metro Line 1 & Line 2 with Civil Court Interchange",
      descMr: "पुणे मेट्रो पर्पल व अक्वा लाईन्स आणि स्थानकांची माहिती",
      icon: "🚇",
      color: "#a855f7",
    },
    {
      titleEn: "Discover Public Transport.",
      titleMr: "सार्वजनिक वाहतूक.",
      descEn: "PMPML Feeder Buses with Verified Route Schedules",
      descMr: "पीएमपीएमएल फिडर बसेस व अधिकृत वेळापत्रके",
      icon: "🚌",
      color: "#f59e0b",
    },
    {
      titleEn: "Plan Your Journey.",
      titleMr: "सहल नियोजन.",
      descEn: "Smart Automated Itineraries with 1-Click PDF Export",
      descMr: "स्मार्ट सहल आयोजक आणि एका क्लिकवर पीडीएफ डाऊनलोड",
      icon: "🧭",
      color: "#06b6d4",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND_TOKENS.bgDark,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2 style={{ color: "#f8fafc", fontSize: 52, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
          {lang === "mr" ? "स्मार्ट शहरासाठी परिपूर्ण डिजिटल मार्गदर्शक" : "Engineered for Seamless Urban Mobility"}
        </h2>
        <p style={{ color: "#10b981", fontSize: 20, fontWeight: 700, margin: "10px 0 0 0" }}>
          {lang === "mr" ? "वेळेची बचत • खात्रीशीर माहिती • १००% विनामूल्य" : "Zero Ads • Sub-Second Speed • 100% Free & Open Platform"}
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 28,
          width: 1400,
        }}
      >
        {PILLARS.map((p, idx) => (
          <div
            key={idx}
            style={{
              padding: "32px 36px",
              borderRadius: 20,
              backgroundColor: "rgba(12, 32, 24, 0.85)",
              border: `1.5px solid ${BRAND_TOKENS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              boxShadow: "0 14px 35px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: "rgba(6, 19, 14, 0.9)",
                border: `2px solid ${p.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              {p.icon}
            </div>
            <div>
              <div style={{ color: p.color, fontSize: 28, fontWeight: 900 }}>
                {lang === "mr" ? p.titleMr : p.titleEn}
              </div>
              <div style={{ color: "#cbd5e1", fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                {lang === "mr" ? p.descMr : p.descEn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
