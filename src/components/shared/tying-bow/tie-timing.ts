export const TieTiming = {
  LOOPS_DELAY_S: 0,
  LOOPS_S: 0.34,
  KNOT_DELAY_S: 0.3,
  KNOT_S: 0.2,
  TAILS_DELAY_S: 0.32,
  TAILS_S: 0.14,
  TUG_DELAY_S: 0.44,
  TUG_S: 0.22,
} as const

export const TIE_DURATION_S = TieTiming.TUG_DELAY_S + TieTiming.TUG_S
