export interface BrandColors {
  primary: string;
  primaryGlow: string;
  accent: string;
  clay: string;
  bgDark: string;
  bgSurface: string;
  bgSurfaceHover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export const BRAND_COLORS: BrandColors = {
  primary: "#065f46",
  primaryGlow: "#10b981",
  accent: "#f59e0b",
  clay: "#c2410c",
  bgDark: "#06130e",
  bgSurface: "#0c2018",
  bgSurfaceHover: "#123024",
  border: "rgba(16, 185, 129, 0.22)",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

export interface DestinationItem {
  id: string;
  name: string;
  marathiName: string;
  category: string;
  rating: number;
  timeNeeded: string;
  entryFee: string;
  bestTime: string;
  image: string;
}

export const FEATURED_DESTINATIONS: DestinationItem[] = [
  {
    id: "sinhagad-fort",
    name: "Sinhagad Fort",
    marathiName: "सिंहगड किल्ला",
    category: "Heritage & Treks",
    rating: 4.8,
    timeNeeded: "3-4 hrs",
    entryFee: "₹50",
    bestTime: "Monsoon & Winter",
    image: "images/places/sinhagad-fort.jpg",
  },
  {
    id: "shaniwar-wada",
    name: "Shaniwar Wada",
    marathiName: "शनिवार वाडा",
    category: "Heritage",
    rating: 4.6,
    timeNeeded: "1.5 hrs",
    entryFee: "₹25",
    bestTime: "Morning / Evening",
    image: "images/places/shaniwar-wada.jpg",
  },
  {
    id: "aga-khan-palace",
    name: "Aga Khan Palace",
    marathiName: "आगाखान पॅलेस",
    category: "Heritage & Peace",
    rating: 4.7,
    timeNeeded: "2 hrs",
    entryFee: "₹25",
    bestTime: "Year-round",
    image: "images/places/aga-khan-palace.jpg",
  },
  {
    id: "katakirr-misal",
    name: "Katakirr Misal",
    marathiName: "काटाकिर्र मिसळ",
    category: "Food & Misal",
    rating: 4.9,
    timeNeeded: "45 mins",
    entryFee: "₹120",
    bestTime: "Breakfast / Lunch",
    image: "images/places/katakirr-misal.jpg",
  },
];
