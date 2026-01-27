/**
 * Theme Constants - Design Tokens
 * Single source of truth for colors, gradients, and design system values
 */

// Brand Gradients
export const GRADIENTS = {
  // Primary brand gradient (burgundy to dark red) - Most common
  primary: "linear-gradient(90deg, #B34B71 0%, #4A0404 100%)",

  // Extended primary gradient with middle burgundy tone
  primaryExtended: "linear-gradient(90deg, #B34B71 0%, #8B2D5A 50%, #4A0404 100%)",

  // Alternate primary gradient variations
  primaryAlternate: "linear-gradient(90deg, #B34B71 0%, #7A3434 100%)",
  primaryDiagonal: "linear-gradient(135deg, #B34B71 0%, #6B2D4A 100%)",

  // Spotlight gradients for background effects
  spotlightWarm: {
    first:
      "radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255, 51, 26, 0.15) 0%, rgba(204, 26, 153, 0.05) 50%, transparent 80%)",
    second:
      "radial-gradient(50% 50% at 50% 50%, rgba(204, 26, 153, 0.12) 0%, rgba(102, 13, 204, 0.06) 80%, transparent 100%)",
  },

  spotlightCool: {
    first:
      "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
    second:
      "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
    third:
      "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  },

  // Radial burgundy gradients
  burgundyBloom: "radial-gradient(circle at 50% 50%, rgba(179,75,113,0.1), transparent 70%)",
  burgundyBloomIntense: "radial-gradient(circle, rgba(179,75,113,0.5) 0%, transparent 60%)",
  burgundyBloomMedium: "radial-gradient(circle, rgba(179,75,113,0.3) 0%, transparent 70%)",
  burgundyBloomSubtle:
    "radial-gradient(circle at center, rgba(179,75,113,0.1) 0%, transparent 70%)",

  // Dark red bloom
  darkRedBloom: "radial-gradient(circle, rgba(74,4,4,0.2) 0%, transparent 70%)",

  // Radial burgundy with multiple stops
  burgundyRadialComplex:
    "radial-gradient(circle at 50% 50%, #B34B71 0%, #8B2D5A 40%, #4A0404 100%)",
  burgundyRadialOffset: "radial-gradient(circle at 30% 30%, #B34B71 0%, #6B2D4A 50%, #2b0707 100%)",

  // Elliptical burgundy gradient (for large backgrounds)
  burgundyEllipse:
    "radial-gradient(ellipse at 30% 20%, #B34B71 0%, #6B2D4A 35%, #3D1A2E 60%, #1A0912 100%)",

  // White radial gradients (for light effects)
  whiteGlow:
    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
  whiteGlowSoft: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
  whiteGlowSubtle: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
  whiteGlowBright: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%)",

  // Glass/reflection effects
  glassReflection: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",

  // Dark backgrounds
  darkGradient: "linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)",
  darkGradientAlt: "linear-gradient(135deg, #2b0707 0%, #0a0a0a 100%)",

  // Light backgrounds
  lightGradient: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.9) 100%)",

  // Divider/line gradients
  horizontalDivider: "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
  verticalDivider: "linear-gradient(to bottom, rgba(255,255,255,0.15) 50%, transparent 50%)",

  // Grid patterns
  gridPattern: `radial-gradient(circle at center, rgba(179,75,113,0.1) 0%, transparent 70%),
                linear-gradient(to right, #444 1px, transparent 1px),
                linear-gradient(to bottom, #444 1px, transparent 1px)`,
} as const;

// Brand Colors
export const COLORS = {
  // Primary brand burgundy
  burgundy: {
    primary: "#B34B71",
    medium: "#8B2D5A",
    dark: "#6B2D4A",
    darker: "#4A0404",
    darkest: "#3D1A2E",
    accent: "#7A3434",
    deep: "#2b0707",
    deepest: "#1A0912",
  },

  // Grayscale with opacity variants
  white: {
    full: "#FFFFFF",
    95: "rgba(255, 255, 255, 0.95)",
    90: "rgba(255, 255, 255, 0.9)",
    80: "rgba(255, 255, 255, 0.8)",
    60: "rgba(255, 255, 255, 0.6)",
    50: "rgba(255, 255, 255, 0.5)",
    40: "rgba(255, 255, 255, 0.4)",
    20: "rgba(255, 255, 255, 0.2)",
    15: "rgba(255, 255, 255, 0.15)",
    12: "rgba(255, 255, 255, 0.12)",
    10: "rgba(255, 255, 255, 0.1)",
    5: "rgba(255, 255, 255, 0.05)",
    3: "rgba(255, 255, 255, 0.03)",
    2: "rgba(255, 255, 255, 0.02)",
  },

  black: {
    full: "#000000",
    95: "rgba(0, 0, 0, 0.95)",
    90: "rgba(0, 0, 0, 0.9)",
    dark: "#0a0a0a",
    darker: "#141414",
  },

  gray: {
    444: "#444444",
  },

  // Zinc palette
  zinc: {
    300: "#D4D4D8",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
  },

  // Accent colors (for spotlight effects)
  accent: {
    orange: "rgba(255, 51, 26, 0.15)",
    magenta: "rgba(204, 26, 153, 0.12)",
    purple: "rgba(102, 13, 204, 0.06)",
  },
} as const;

// Typography
export const FONTS = {
  serif: '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  bebas: '"Bebas Neue", sans-serif',
} as const;

// Border styles
export const BORDERS = {
  ghost: "rgba(255, 255, 255, 0.12)",
  ghostLight: "rgba(255, 255, 255, 0.15)",
  ghostSubtle: "rgba(255, 255, 255, 0.05)",
  transparent: "transparent",
} as const;
