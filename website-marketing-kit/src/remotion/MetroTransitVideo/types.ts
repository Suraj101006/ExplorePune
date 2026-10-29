export type SupportedLanguage = "en" | "mr";

export interface MetroStation {
  name: string;
  marathiName: string;
  pos: string; // percentage along track
  isInterchange?: boolean;
}

export const PURPLE_LINE_STATIONS: MetroStation[] = [
  { name: "PCMC", marathiName: "पिंपरी-चिंचवड", pos: "10%" },
  { name: "Bhosari", marathiName: "भोसरी", pos: "28%" },
  { name: "Shivajinagar", marathiName: "शिवाजीनगर", pos: "48%" },
  { name: "Civil Court", marathiName: "सिव्हिल कोर्ट", pos: "68%", isInterchange: true },
  { name: "Swargate", marathiName: "स्वारगेट", pos: "90%" },
];

export const AQUA_LINE_STATIONS: MetroStation[] = [
  { name: "Vanaz", marathiName: "वनाझ", pos: "15%" },
  { name: "Garware College", marathiName: "गरवारे कॉलेज", pos: "40%" },
  { name: "Civil Court", marathiName: "सिव्हिल कोर्ट", pos: "65%", isInterchange: true },
  { name: "Ramwadi", marathiName: "रामवाडी", pos: "88%" },
];

export const BRAND_TOKENS = {
  primary: "#065f46",
  primaryGlow: "#10b981",
  accent: "#f59e0b",
  metroPurple: "#9333ea",
  metroAqua: "#06b6d4",
  busAmber: "#f59e0b",
  bgDark: "#06130e",
  bgSurface: "#0c2018",
  border: "rgba(16, 185, 129, 0.25)",
  textLight: "#f8fafc",
  textMuted: "#94a3b8",
};
