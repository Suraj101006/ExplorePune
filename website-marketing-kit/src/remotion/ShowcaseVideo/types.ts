export interface BrandPalette {
  primary: string;
  primaryGlow: string;
  accent: string;
  clay: string;
  bgDark: string;
  bgSurface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}

export const BRAND: BrandPalette = {
  primary: "#065f46",
  primaryGlow: "#10b981",
  accent: "#f59e0b",
  clay: "#c2410c",
  bgDark: "#06130e",
  bgSurface: "#0c2018",
  border: "rgba(16, 185, 129, 0.25)",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
};

export interface NavTabItem {
  id: string;
  label: string;
  marathiLabel: string;
  icon: string;
}

export const NAV_TABS: NavTabItem[] = [
  { id: "home", label: "Home", marathiLabel: "मुख्यपृष्ठ", icon: "🏛️" },
  { id: "heritage", label: "Heritage & Treks", marathiLabel: "किल्ले व वाडे", icon: "⛰️" },
  { id: "maps", label: "Explore Map", marathiLabel: "नकाशा", icon: "🗺️" },
  { id: "transit", label: "Transit & Metro", marathiLabel: "वाहतूक मार्ग", icon: "🚇" },
  { id: "food", label: "Food & Misal", marathiLabel: "खाद्यसंस्कृती", icon: "🍲" },
  { id: "planner", label: "Trip Planner", marathiLabel: "आयोजक", icon: "🧭" },
];
