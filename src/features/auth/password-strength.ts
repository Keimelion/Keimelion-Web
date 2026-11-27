import { MIN_PASSWORD_LENGTH } from '@keimelion/sdk/schemas'

export const PasswordStrengths = {
  EMPTY: 0,
  WEAK: 1,
  FAIR: 2,
  STRONG: 3,
  VERY_STRONG: 4,
} as const

export type PasswordStrength = (typeof PasswordStrengths)[keyof typeof PasswordStrengths]

const LONG_PASSWORD_LENGTH = 12
const VERY_LONG_PASSWORD_LENGTH = 16
const STRENGTH_BY_BONUS_COUNT: readonly PasswordStrength[] = [
  PasswordStrengths.FAIR,
  PasswordStrengths.STRONG,
  PasswordStrengths.VERY_STRONG,
  PasswordStrengths.VERY_STRONG,
]
const LETTER_PATTERN = /\p{L}/u
const NON_LETTER_PATTERN = /[^\p{L}]/u

export function ratePasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return PasswordStrengths.EMPTY
  if (password.length < MIN_PASSWORD_LENGTH) return PasswordStrengths.WEAK
  const bonusCount = [
    password.length >= LONG_PASSWORD_LENGTH,
    LETTER_PATTERN.test(password) && NON_LETTER_PATTERN.test(password),
    password.length >= VERY_LONG_PASSWORD_LENGTH,
  ].filter(Boolean).length
  return STRENGTH_BY_BONUS_COUNT[bonusCount] ?? PasswordStrengths.VERY_STRONG
}
