type CubicBezier = [number, number, number, number]

export const MotionEasings = {
  SPRING: [0.34, 1.56, 0.64, 1],
  POP: [0.34, 1.8, 0.64, 1],
  SOFT_OUT: [0.2, 0.9, 0.3, 1],
  SHEET: [0.2, 0.9, 0.3, 1.1],
  FLIP: [0.3, 1.4, 0.5, 1],
  STANDARD: [0.4, 0, 0.2, 1],
  ACCELERATE: [0.5, 0, 0.75, 0],
} as const satisfies Record<string, CubicBezier>

export const MotionDurations = {
  XS: 0.12,
  S: 0.2,
  M: 0.32,
  L: 0.6,
  GIFT: 1.2,
} as const

export const TOAST_LIFETIME_MS = 4000
