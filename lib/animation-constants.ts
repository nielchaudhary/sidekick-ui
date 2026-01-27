/**
 * Animation Constants
 * Centralized animation timing, durations, and configuration values
 */

// Animation Durations (in seconds)
export const ANIMATION_DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.8,
  verySlow: 1.2,
  extraSlow: 2.0,
  spotlight: 7,
  breathing: 3,
} as const;

// Animation Delays (in milliseconds)
export const ANIMATION_DELAY = {
  instant: 100,
  short: 300,
  medium: 600,
  long: 1000,
  veryLong: 1400,
  extraLong: 2000,
} as const;

// Typewriter Effect Settings
export const TYPEWRITER = {
  baseDelay: 35, // Base delay between characters (ms)
  spaceMultiplier: 0.6, // Multiplier for spaces
  punctuationMultiplier: 3, // Multiplier for punctuation marks
  randomVariation: 10, // Random variation to add natural feel (ms)
} as const;

// Pulse/Breathing Effects
export const PULSE = {
  duration: 0.833, // 1.2Hz = 833ms period (in seconds)
  frequency: 1.2, // Hz
} as const;

// Easing Functions
export const EASING = {
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.33, 1, 0.68, 1)",
  elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  easeInOut: "easeInOut",
  linear: "linear",
} as const;

// Grid/Bento Grid Settings
export const GRID = {
  size: 20, // Grid cell size in pixels
  width: 340, // Grid width in pixels
  height: 420, // Grid height in pixels
} as const;

// Spotlight/Background Effect Settings
export const SPOTLIGHT = {
  translateY: -350,
  width: 560,
  height: 1380,
  smallWidth: 240,
  duration: 7,
  xOffset: 100,
} as const;

// Neural Pathway Settings (for reasoning animations)
export const NEURAL = {
  startRadius: 80,
  endRadius: 26,
  pathCount: 5,
} as const;

// Opacity Values for Animations
export const OPACITY = {
  invisible: 0,
  subtle: 0.015,
  faint: 0.1,
  visible: 0.9,
  full: 1,
  pulseMin: 0.9,
  pulseMax: 1,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  background: 0,
  base: 1,
  elevated: 10,
  dropdown: 50,
  modal: 100,
  tooltip: 200,
  notification: 300,
} as const;
