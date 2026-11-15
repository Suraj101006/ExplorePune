/**
 * Explore Pune - Experience v2 Design Tokens
 * Harmonizes Dialed-style bold editorial Part A with 5.25s camera flyover Part B.
 */

export const palette = {
  // Basalt Void (Part A Dark Canvas & Part B Deep Surface)
  basalt: {
    950: '#04060a',
    900: '#080b11',
    800: '#121620',
    700: '#1e2430',
    600: '#2d3748',
    500: '#4a5568',
    400: '#718096',
    300: '#a0aec0',
    200: '#cbd5e0',
    100: '#edf2f7',
    50: '#f7fafc',
  },

  // MapLibre Reference Video Palette (Part B Core)
  map: {
    basemapDark: '#30333E',    // Dark slate ground
    surfaceCard: 'rgba(24, 26, 32, 0.92)', // Glass panel background
    outlineBlue: '#3880FF',    // Beat 1 glowing blue outline
    outlineGreen: '#00B77F',   // Beat 3 glowing green outline
    routeRed: '#F1293A',       // Beat 2 animated route line & pin red
    pinRed: '#F1293A',
    labelWhite: '#FFFFFF',
    labelGlow: '0 2px 8px rgba(0, 0, 0, 0.8)',
  },

  // Peshwa Saffron (Maratha Bhagwa & Royal Seal)
  saffron: {
    900: '#7c2d12',
    800: '#9a3412',
    700: '#c2410c',
    600: '#ea580c',
    500: '#f97316',
    400: '#fb923c',
    300: '#fdba74',
    200: '#fed7aa',
    100: '#ffedd5',
    50: '#fff7ed',
  },

  // Paithani Gold & Editorial Accents
  gold: {
    700: '#a16207',
    600: '#ca8a04',
    500: '#eab308',
    400: '#facc15',
    300: '#fde047',
  },

  // Wari Parchment (Part A Light Theme Canvas)
  parchment: {
    900: '#d7c7af',
    800: '#ebdcc8',
    700: '#f4ece1',
    600: '#f6efe0',
    500: '#fbf8f2',
    400: '#ffffff',
  },
} as const;

export const themeTokens = {
  dark: {
    bg: {
      canvas: palette.basalt[900],        // #080b11
      surface: 'rgba(18, 22, 32, 0.88)',
      surfaceElevated: '#1a202c',
      border: 'rgba(255, 255, 255, 0.1)',
      borderActive: palette.saffron[500],
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
      accent: palette.saffron[500],
    },
  },
  light: {
    bg: {
      canvas: palette.parchment[600],     // #f6efe0
      surface: 'rgba(255, 255, 255, 0.92)',
      surfaceElevated: '#ffffff',
      border: 'rgba(68, 64, 60, 0.15)',
      borderActive: palette.saffron[600],
    },
    text: {
      primary: '#1c1917',
      secondary: '#44403c',
      muted: '#78716c',
      accent: palette.saffron[600],
    },
  },
} as const;

export const motionCurves = {
  // Dialed bold scroll ease
  dialedOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Video reference camera flyover (5.25s ease-in-out cubic)
  flyoverCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  durations: {
    flyoverTotalMs: 5250,
    beat1Ms: 1000,
    beat2Ms: 1000,
    beat3Ms: 1000,
    beat4Ms: 2250,
  },
};
