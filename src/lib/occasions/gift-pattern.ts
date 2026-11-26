export const GiftPatterns = {
  DOTS: 'dots',
  STRIPES: 'stripes',
  GINGHAM: 'gingham',
  CONFETTI: 'confetti',
  BOWS: 'bows',
  STARS: 'stars',
} as const

export type GiftPattern = (typeof GiftPatterns)[keyof typeof GiftPatterns]

export const GIFT_PATTERN_LIST: readonly GiftPattern[] = Object.values(GiftPatterns)

const HASH_MULTIPLIER = 31

export function getGiftPattern(seed: string): GiftPattern {
  const hash = Array.from(seed).reduce(
    (total, character) => (total * HASH_MULTIPLIER + (character.codePointAt(0) ?? 0)) >>> 0,
    0,
  )
  return GIFT_PATTERN_LIST[hash % GIFT_PATTERN_LIST.length] ?? GiftPatterns.DOTS
}
