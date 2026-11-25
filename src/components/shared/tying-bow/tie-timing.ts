export const TieTiming = {
  TAILS_S: 0.14,
  LOOPS_DELAY_S: 0.08,
  LOOPS_S: 0.34,
  KNOT_DELAY_S: 0.36,
  KNOT_S: 0.2,
  TUG_DELAY_S: 0.4,
  TUG_S: 0.22,
} as const

export const TIE_DURATION_S = TieTiming.TUG_DELAY_S + TieTiming.TUG_S
