'use client'

import { ratePasswordStrength, PasswordStrengths } from '@/features/auth/password-strength'
import type { PasswordStrength } from '@/features/auth/password-strength'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

const METER_SEGMENTS = [1, 2, 3, 4] as const

const STRENGTH_LABEL_IDS: Readonly<Record<PasswordStrength, MessageId>> = {
  [PasswordStrengths.EMPTY]: 'auth.password_strength.empty',
  [PasswordStrengths.WEAK]: 'auth.password_strength.weak',
  [PasswordStrengths.FAIR]: 'auth.password_strength.fair',
  [PasswordStrengths.STRONG]: 'auth.password_strength.strong',
  [PasswordStrengths.VERY_STRONG]: 'auth.password_strength.very_strong',
}

const STRENGTH_COLOR_CLASS_NAMES: Readonly<Record<PasswordStrength, string>> = {
  [PasswordStrengths.EMPTY]: 'bg-rule',
  [PasswordStrengths.WEAK]: 'bg-danger',
  [PasswordStrengths.FAIR]: 'bg-warning',
  [PasswordStrengths.STRONG]: 'bg-success',
  [PasswordStrengths.VERY_STRONG]: 'bg-success',
}

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps): React.JSX.Element {
  const t = useTranslate()
  const strength = ratePasswordStrength(password)
  return (
    <span className="flex flex-col gap-1.5" data-strength={strength}>
      <span aria-hidden="true" className="grid grid-cols-4 gap-1">
        {METER_SEGMENTS.map((segment) => (
          <span
            key={segment}
            className={cn(
              'h-1 rounded-pill transition-colors',
              segment <= strength ? STRENGTH_COLOR_CLASS_NAMES[strength] : 'bg-rule',
            )}
          />
        ))}
      </span>
      <span>{t(STRENGTH_LABEL_IDS[strength])}</span>
    </span>
  )
}
