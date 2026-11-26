import { BowIcon } from '@/components/icons'
import { BRAND_WORDMARK } from '@/lib/brand'
import { cn } from '@/lib/utils'

export const BowLogoTones = {
  BRAND: 'brand',
  ON_BRAND: 'on-brand',
  INK: 'ink',
  ON_INVERSE: 'on-inverse',
  ON_FOOTER: 'on-footer',
} as const

export type BowLogoTone = (typeof BowLogoTones)[keyof typeof BowLogoTones]

interface BowLogoToneClassNames {
  mark: string
  wordmark: string
}

const TONE_CLASS_NAMES: Readonly<Record<BowLogoTone, BowLogoToneClassNames>> = {
  [BowLogoTones.BRAND]: { mark: 'text-brand', wordmark: 'text-brand' },
  [BowLogoTones.ON_BRAND]: { mark: 'text-on-brand', wordmark: 'text-on-brand' },
  [BowLogoTones.INK]: { mark: 'text-ink', wordmark: 'text-ink' },
  [BowLogoTones.ON_INVERSE]: { mark: 'text-paper-rose', wordmark: 'text-on-inverse' },
  [BowLogoTones.ON_FOOTER]: { mark: 'text-footer-logo', wordmark: 'text-footer-logo' },
}

interface BowLogoProps {
  tone: BowLogoTone
  hasWordmark: boolean
  className?: string | undefined
}

export function BowLogo({ tone, hasWordmark, className }: BowLogoProps): React.JSX.Element {
  const toneClassNames = TONE_CLASS_NAMES[tone]
  return (
    <span className={cn('inline-flex items-center gap-[0.2em]', className)}>
      <BowIcon className={cn('size-[1.15em]', toneClassNames.mark)} />
      {hasWordmark ? (
        <span
          className={cn(
            'font-display leading-none font-extrabold tracking-[-0.05em]',
            toneClassNames.wordmark,
          )}
        >
          {BRAND_WORDMARK}
        </span>
      ) : null}
    </span>
  )
}
