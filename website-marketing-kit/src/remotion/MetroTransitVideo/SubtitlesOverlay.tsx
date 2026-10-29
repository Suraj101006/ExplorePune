import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SupportedLanguage } from "./types";

interface SubtitlesOverlayProps {
  lang: SupportedLanguage;
}

interface SubtitleLine {
  startFrame: number;
  endFrame: number;
  en: string;
  mr: string;
}

const SUBTITLES: SubtitleLine[] = [
  {
    startFrame: 15,
    endFrame: 290,
    en: "Welcome to Pune, Maharashtra's historic cultural capital and a vibrant modern metropolis. Navigating this dynamic city just got smarter, faster, and completely effortless.",
    mr: "महाराष्ट्राची ऐतिहासिक सांस्कृतिक राजधानी आणि आधुनिक शहर, आपले पुणे. या शहरात प्रवास करणे आता झाले आहे अधिक सोपे, वेगवान आणि स्मार्ट."
  },
  {
    startFrame: 310,
    endFrame: 650,
    en: "Introducing Explore Pune, your all-in-one public transit and city discovery platform. Built with a clean, responsive interface, it puts the entire city at your fingertips—with instant search across 106 verified locations.",
    mr: "सादर करत आहोत एक्सप्लोर पुणे, सार्वजनिक वाहतूक आणि शहर दर्शनाचे अधिकृत डिजिटल व्यासपीठ. स्वच्छ आणि जलद इंटरफेसद्वारे १०६ हून अधिक ऐतिहासिक व पर्यटन स्थळे आता आपल्या बोटांवर."
  },
  {
    startFrame: 670,
    endFrame: 1125,
    en: "Explore Pune with high-precision interactive geographic maps. Locate every heritage fort, serene lake, and cultural hub with verified coordinates, elevation contours, and neighborhood clusters—from Shivajinagar to the Sahyadri trails.",
    mr: "अचूक परस्परसंवादी नकाशांद्वारे पुणे एक्सप्लोर करा. शिवाजीनगरपासून सिंहगडाच्या पायथ्यापर्यंत प्रत्येक किल्ला, तलाव आणि सांस्कृतिक स्थळाचे अचूक स्थान व माहिती एका क्लिकवर मिळवा."
  },
  {
    startFrame: 1150,
    endFrame: 1635,
    en: "Mastering Pune's bus network is now simple. With verified PMPML bus schedules and route timetables, plan journeys effortlessly—like Bus Route 51 connecting Shanipar directly to Sinhagad Fort, running every 20 minutes.",
    mr: "पीएमपीएमएल बस प्रवास आता अत्यंत सुलभ. अधिकृत बस वेळापत्रक आणि मार्गांची खात्रीशीर माहिती, जसे की शनिवार पेठ ते सिंहगड पायथा जोडणारी बस क्रमांक ५१, जी दर २० मिनिटांनी धावते."
  },
  {
    startFrame: 1660,
    endFrame: 2145,
    en: "Experience the speed of Pune Metro. Seamlessly navigate the Purple Line from PCMC to Swargate, and the Aqua Line from Vanaz to Ramwadi. Check interchange connections at Civil Court, live station nodes, and exact fares.",
    mr: "पुणे मेट्रोच्या गतीचा अनुभव घ्या. पिंपरी चिंचवड ते स्वारगेट पर्पल लाईन आणि वनाझ ते रामवाडी अक्वा लाईन. सिव्हिल कोर्ट इंटरचेंज, प्रत्येक मेट्रो स्टेशन आणि अधिकृत तिकीट दरांची सविस्तर माहिती."
  },
  {
    startFrame: 2170,
    endFrame: 2685,
    en: "Plan complete multi-stop journeys across the city. Select your origin, pick your destination, and let the smart directions engine curate a step-by-step route combining metro, feeder buses, and walking trails with exportable itineraries.",
    mr: "संपूर्ण शहर प्रवासाचे परिपूर्ण नियोजन करा. तुमचे ठिकाण निवडा आणि स्मार्ट मार्गदर्शकाद्वारे मेट्रो, पीएमपीएमएल बस आणि चालण्याचे मार्ग यांचा सुरेख समन्वय साधा. एका क्लिकवर सहल आयोजक वापरा."
  },
  {
    startFrame: 2710,
    endFrame: 3045,
    en: "Explore Pune. Find your route. Discover public transport. Built with zero ads, lightning-fast client performance, and complete respect for Pune's cultural soul.",
    mr: "पुणे जाणून घ्या. तुमचा मार्ग शोधा. सार्वजनिक वाहतुकीचा लाभ घ्या. विना जाहिरात, अतिशय जलद आणि अस्सल पुणेरी संस्कृतीचा आदर करणारे डिजिटल मार्गदर्शक."
  },
  {
    startFrame: 3070,
    endFrame: 3340,
    en: "Your City. Your Journey. Your Pune. Start exploring today at explore-pune-eosin.vercel.app.",
    mr: "तुमचे शहर. तुमचा प्रवास. आपले पुणे. आजच भेट द्या: एक्सप्लोर पुणे डॉट व्हर्सल डॉट ॲप."
  }
];

export const SubtitlesOverlay: React.FC<SubtitlesOverlayProps> = ({ lang }) => {
  const frame = useCurrentFrame();

  const current = SUBTITLES.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );

  if (!current) return null;

  // Gentle fade-in and fade-out for subtitle box
  const fadeIn = interpolate(frame, [current.startFrame, current.startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [current.endFrame - 8, current.endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const text = lang === "mr" ? current.mr : current.en;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 1280,
        zIndex: 9000,
        pointerEvents: "none",
        opacity,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(6, 19, 14, 0.9)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          backdropFilter: "blur(16px)",
          borderRadius: 14,
          padding: "12px 28px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
        }}
      >
        <span
          style={{
            color: "#f8fafc",
            fontSize: lang === "mr" ? 22 : 20,
            fontWeight: 700,
            lineHeight: 1.45,
            letterSpacing: lang === "mr" ? "0.01em" : "-0.01em",
            fontFamily:
              lang === "mr"
                ? "'Rozha One', 'Noto Serif Devanagari', 'Yatra One', serif"
                : "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
