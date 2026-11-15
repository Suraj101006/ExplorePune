/**
 * Explore Pune: "Pune Through Time" Experience Design Tokens
 * 
 * Curated by Creative & Art Direction.
 * Defines the authentic cultural color palette, bilingual typography (English + Devanagari),
 * architectural spacing, atmospheric elevation glows, and cinematic motion curves.
 */

export const palette = {
  // Basalt Black (Deccan Traps Volcanic Rock)
  basalt: {
    950: '#04060a', // Deep Deccan void
    900: '#080b11', // Primary dark canvas
    800: '#0f172a', // Deep slate basalt
    700: '#1e293b', // Elevated basalt card
    600: '#334155', // Weathered stone border
    500: '#475569', // Muted basalt text
    400: '#64748b', // Basalt slate mid
    300: '#94a3b8', // Basalt mist
    200: '#cbd5e1', // Light stone line
    100: '#f1f5f9', // Basalt highlight
    50:  '#f8fafc', // Basalt frost
  },

  // Peshwa Saffron (Maratha Bhagwa & Royal Seal)
  saffron: {
    900: '#7c2d12', // Deep burnt saffron
    800: '#9a3412', // Terracotta shadow
    700: '#c2410c', // Royal Maratha vermilion
    600: '#ea580c', // Signature Peshwa Saffron
    500: '#f97316', // Vibrant flame saffron
    400: '#fb923c', // Sunset amber glow
    300: '#fdba74', // Warm morning petal
    200: '#fed7aa', // Diluted kesari wash
    100: '#ffedd5', // Saffron cream
    50:  '#fff7ed', // Pale kesari whisper
  },

  // Teak Brown (Shaniwar Wada Heavy Timber & Wooden Pillars)
  teak: {
    950: '#260e04', // Ancient charred pillar
    900: '#451a03', // Dark aged teakwood
    800: '#78350f', // Signature Teak Brown
    700: '#92400e', // Polished timber amber
    600: '#b45309', // Carved doorway bracket
    500: '#d97706', // Sandalwood oil sheen
    400: '#f59e0b', // Raw sapwood grain
    300: '#fcd34d', // Sunlit woodgrain
    200: '#fde68a', // Pale timber shavings
    100: '#fef3c7', // Warm teak cream
  },

  // Monsoon-Sky Blue (Sahyadri Cloudbursts, Sinhagad Mist & Khadakwasla Waters)
  monsoon: {
    950: '#032030', // Thunderstorm core
    900: '#073b4c', // Deep reservoir blue
    800: '#0369a1', // Sahyadri storm clouds
    700: '#0284c7', // Signature Monsoon-Sky Blue
    600: '#0ea5e9', // Rain cascade azure
    500: '#38bdf8', // Clearing monsoon sky
    400: '#7dd3fc', // Mountain mist veil
    300: '#bae6fd', // Morning fog
    200: '#e0f2fe', // Dewdrop glaze
    100: '#f0f9ff', // Sahyadri fresh vapor
  },

  // Shalu Gold (Paithani Zari, Ganpati Ornaments & Shaniwar Wada Chandeliers)
  gold: {
    900: '#713f12', // Antique bronze gold
    800: '#854d0e', // Heavy zari thread
    700: '#a16207', // Temple bell brass
    600: '#ca8a04', // Traditional Paithani gold
    500: '#eab308', // Signature Shalu Gold
    400: '#facc15', // Radiant festive luminance
    300: '#fde047', // Sunbeam reflection
    200: '#fef08a', // Silk sheen
    100: '#fef9c3', // Warm gold parchment
    50:  '#fefce8', // Pale gold aura
  },

  // Stone Gray (Sinhagad Ramparts, Pataleshwar Rock-Cut Basalt)
  stone: {
    900: '#1c1917', // Rock-cut cavern shadow
    800: '#292524', // Chiseled rock surface
    700: '#44403c', // Ancient stone rampart
    600: '#57534e', // Weathered stone face
    500: '#78716c', // Monsoon lichen gray
    400: '#a8a29e', // River-smoothed pebble
    300: '#d6d3d1', // Dry hill path stone
    200: '#e7e5e4', // Morning stone light
    100: '#f5f5f4', // Limestone plaster
    50:  '#fafaf9', // Chunam wash
  },

  // Parchment & Wari Cream (Modi Script Manuscripts & Warkari Khadi Cloth)
  parchment: {
    900: '#d5c4a1', // Aged Modi paper shadow
    800: '#ebdcc8', // Weathered palm leaf
    700: '#f3ece0', // Archival Pune manuscript
    600: '#f6efe0', // Signature Editorial Cream
    500: '#fbf7ed', // Fresh handloom khadi
    400: '#fdfbf7', // Pure wari parchment
    300: '#ffffff', // Clean white
  },

  // Sahyadri Emerald (Western Ghats Flora & Katraj Glades)
  emerald: {
    900: '#064e3b', // Deep ghat forest
    800: '#065f46', // Wet Sahyadri canopy
    700: '#047857', // Mossy basalt edge
    600: '#059669', // Signature Sahyadri Emerald
    500: '#10b981', // Vibrant monsoon sprout
    400: '#34d399', // Fresh hill grass
    300: '#6ee7b7', // Early morning dew green
    100: '#d1fae5', // Forest mist wash
  },

  // Tambat Copper (Tambat Ali Artisan Hand-beaten Metal)
  copper: {
    900: '#582106', // Oxidized dark copper
    800: '#7c2d12', // Beaten copper crucible
    700: '#9a3412', // Warm copper reflection
    600: '#b45309', // Signature Tambat Copper
    500: '#d97706', // Polished brass glint
    400: '#f59e0b', // Freshly hammered spark
  },
} as const;

export const themeTokens = {
  dark: {
    bg: {
      canvas: palette.basalt[900],        // #080b11
      surface: 'rgba(15, 23, 42, 0.85)', // Basalt card with glass blur
      surfaceHover: 'rgba(30, 41, 59, 0.95)',
      surfaceSubtle: palette.basalt[800], // #0f172a
      surfaceElevated: palette.basalt[700], // #1e293b
      overlay: 'rgba(4, 6, 10, 0.92)',
      vignette: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(4, 6, 10, 0.92) 100%)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
      accent: palette.gold[400],           // #facc15
      saffron: palette.saffron[500],       // #f97316
      inverse: palette.basalt[950],
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(255, 255, 255, 0.14)',
      strong: 'rgba(255, 255, 255, 0.24)',
      glowSaffron: 'rgba(234, 88, 12, 0.45)',
      glowGold: 'rgba(245, 158, 11, 0.45)',
      glowMonsoon: 'rgba(56, 189, 248, 0.45)',
    },
    accent: {
      primary: palette.saffron[600],       // #ea580c
      primaryHover: palette.saffron[500],  // #f97316
      secondary: palette.gold[500],        // #eab308
      secondaryHover: palette.gold[400],   // #facc15
      monsoon: palette.monsoon[500],       // #38bdf8
      teak: palette.teak[600],             // #b45309
      emerald: palette.emerald[500],       // #10b981
    },
    shadow: {
      subtle: '0 4px 12px rgba(0, 0, 0, 0.35)',
      card: '0 8px 30px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.1)',
      float: '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      modal: '0 32px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 158, 11, 0.25)',
      glowSaffron: '0 0 35px rgba(234, 88, 12, 0.28)',
      glowGold: '0 0 35px rgba(245, 158, 11, 0.28)',
      glowMonsoon: '0 0 35px rgba(56, 189, 248, 0.28)',
      goldRim: '0 0 0 1px rgba(245, 158, 11, 0.3), 0 4px 20px rgba(245, 158, 11, 0.15)',
    },
  },

  light: {
    bg: {
      canvas: palette.parchment[600],       // #f6efe0 (Signature Editorial Cream)
      surface: 'rgba(253, 251, 247, 0.92)', // Wari parchment glass
      surfaceHover: 'rgba(255, 255, 255, 0.98)',
      surfaceSubtle: palette.parchment[700], // #f3ece0
      surfaceElevated: '#ffffff',
      overlay: 'rgba(246, 239, 224, 0.94)',
      vignette: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(220, 208, 185, 0.6) 100%)',
    },
    text: {
      primary: palette.basalt[950],        // #04060a
      secondary: palette.stone[700],        // #44403c
      muted: palette.stone[500],            // #78716c
      accent: palette.teak[800],            // #78350f
      saffron: palette.saffron[700],        // #c2410c
      inverse: '#f8fafc',
    },
    border: {
      subtle: 'rgba(68, 64, 60, 0.12)',
      default: 'rgba(68, 64, 60, 0.2)',
      strong: 'rgba(68, 64, 60, 0.35)',
      glowSaffron: 'rgba(194, 65, 12, 0.4)',
      glowGold: 'rgba(180, 83, 9, 0.4)',
      glowMonsoon: 'rgba(2, 132, 199, 0.4)',
    },
    accent: {
      primary: palette.saffron[700],        // #c2410c
      primaryHover: palette.saffron[600],   // #ea580c
      secondary: palette.teak[700],         // #92400e
      secondaryHover: palette.teak[600],    // #b45309
      monsoon: palette.monsoon[700],        // #0284c7
      teak: palette.teak[800],              // #78350f
      emerald: palette.emerald[800],        // #065f46
    },
    shadow: {
      subtle: '0 2px 8px rgba(68, 64, 60, 0.08)',
      card: '0 6px 24px rgba(68, 64, 60, 0.12), 0 0 1px rgba(68, 64, 60, 0.15)',
      float: '0 16px 40px rgba(68, 64, 60, 0.18), 0 0 0 1px rgba(68, 64, 60, 0.1)',
      modal: '0 28px 70px rgba(68, 64, 60, 0.25), 0 0 0 1px rgba(120, 53, 15, 0.2)',
      glowSaffron: '0 0 25px rgba(234, 88, 12, 0.18)',
      glowGold: '0 0 25px rgba(202, 138, 4, 0.18)',
      glowMonsoon: '0 0 25px rgba(2, 132, 199, 0.18)',
      goldRim: '0 0 0 1px rgba(180, 83, 9, 0.25), 0 4px 16px rgba(180, 83, 9, 0.12)',
    },
  },
} as const;

export const typography = {
  fonts: {
    // English Display (Architectural, Monumental, Editorial)
    displayEn: "'Cinzel', 'Playfair Display', Georgia, serif",
    // Marathi Display (Devanagari Authentic Monumental & Calligraphic)
    displayMr: "'Rozha One', 'Gotu', 'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
    // Bilingual Display Stack (Fallback gracefully)
    displayBilingual: "'Rozha One', 'Cinzel', 'Playfair Display', 'Tiro Devanagari Marathi', Georgia, serif",
    
    // Body & UI English
    bodyEn: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // Body & UI Marathi
    bodyMr: "'Noto Sans Devanagari', 'Mukta', 'Poppins', system-ui, sans-serif",
    // Bilingual Body Stack
    bodyBilingual: "'Noto Sans Devanagari', 'Inter', 'Mukta', system-ui, sans-serif",

    // Precision Telemetry & Coordinates (Lat/Long, Speeds, Time Codes)
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace",
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  sizes: {
    // Modular type scale with clamp for fluid responsive typography
    display1: 'clamp(3.0rem, 7vw + 1rem, 6.5rem)',    // Hero Chapter Title
    display2: 'clamp(2.25rem, 5vw + 0.75rem, 4.5rem)', // Major Epoch Header
    h1:       'clamp(1.85rem, 3.5vw + 0.5rem, 3.25rem)', // Chapter Section Header
    h2:       'clamp(1.4rem, 2.5vw + 0.4rem, 2.25rem)',  // Sub-story / Landmark
    h3:       'clamp(1.15rem, 1.8vw + 0.3rem, 1.65rem)', // Card Title
    h4:       'clamp(1.0rem, 1.2vw + 0.2rem, 1.25rem)',  // Subsection title
    bodyLg:   'clamp(1.05rem, 1.1vw + 0.1rem, 1.2rem)',  // Editorial lead paragraph
    body:     '1rem',                                     // Standard editorial text (16px)
    bodySm:   '0.875rem',                                 // Secondary captions (14px)
    caption:  '0.75rem',                                  // Micro telemetry / tags (12px)
    micro:    '0.675rem',                                 // Coordinate ticks (10.8px)
  },

  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.7,
    loose: 1.9, // Specifically calibrated for Devanagari matras (काना, मात्रा, वेलांटी)
  },

  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.02em',
    normal: '0em',
    wide: '0.04em',
    wider: '0.08em',
    widest: '0.18em', // Regal monument caps
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
} as const;

export const radius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

export const motion = {
  durations: {
    instant: '0ms',
    micro: '100ms',
    fast: '200ms',       // Quick toggle, hover highlight, micro-pulse
    base: '400ms',       // Standard interactive transition, drawer, tooltip
    deliberate: '600ms', // Card expansion, modal slide, pathway tilt
    slow: '800ms',       // Scene cross-fade, epoch shift
    cinematic: '1200ms', // Hero shutter wipe, portal transition
    epic: '2000ms',      // Chapter entrance, panoramic camera pan
    ambient: '8000ms',   // Continuous atmospheric breathing / cloud drift
  },

  durationsMs: {
    instant: 0,
    micro: 100,
    fast: 200,
    base: 400,
    deliberate: 600,
    slow: 800,
    cinematic: 1200,
    epic: 2000,
    ambient: 8000,
  },

  easings: {
    // Signature Expo Out: Decelerating swift, modern & responsive
    expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',

    // Peshwa Regal Ease: Majestic acceleration into ultra-smooth graceful glide
    peshwaEase: 'cubic-bezier(0.22, 1, 0.36, 1)',

    // Cinematic Curtain: High-friction majestic curtain rise / epoch transition
    cinematicPeshwa: 'cubic-bezier(0.19, 1, 0.22, 1)',

    // Gentle Spring: Tactile bounce for physical cards, brass coins, and mini-game handles
    springGentle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

    // Sahyadri Mist: Soft, organic natural flow for clouds and weather fades
    sahyadriMist: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Monsoon Surge: Dramatic swelling curve for storm and scroll lock portals
    monsoonSurge: 'cubic-bezier(0.77, 0, 0.175, 1)',

    // Linear: Continuous steady scrubbers, compass rings and coordinate tickers
    linear: 'linear',
  },

  staggers: {
    tight: 30,       // Letters, numeric ticker ticks (ms)
    normal: 60,      // List items, pathway cards (ms)
    loose: 120,      // Grid landmark cards, epoch milestones (ms)
    theatrical: 200, // Cinematic chapter title phrases (ms)
  },
} as const;

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
  wide: '1536px',
} as const;

export type ThemeMode = 'light' | 'dark';
export type ExperiencePalette = typeof palette;
export type ExperienceTypography = typeof typography;
export type ExperienceMotion = typeof motion;
