'use client'

import { BowIcon, CloseIcon } from '@/components/icons'
import type { LineIconProps } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

export const CalloutTones = {
  INFO: 'info',
  BRAND: 'brand',
  WARNING: 'warning',
} as const

export type CalloutTone = (typeof CalloutTones)[keyof typeof CalloutTones]

const TONE_CLASS_NAMES: Readonly<Record<CalloutTone, string>> = {
  [CalloutTones.INFO]: 'bg-sunken text-ink',
  [CalloutTones.BRAND]: 'bg-paper-rose text-ink',
  [CalloutTones.WARNING]: 'bg-raised text-ink shadow-[inset_0_0_0_1.5px_var(--warning)]',
}

const ICON_CLASS_NAMES: Readonly<Record<CalloutTone, string>> = {
  [CalloutTones.INFO]: 'text-muted-foreground',
  [CalloutTones.BRAND]: 'text-brand',
  [CalloutTones.WARNING]: 'text-warning',
}

interface CalloutProps {
  tone: CalloutTone
  title: string
  kicker: string | null
  icon: React.ComponentType<LineIconProps> | null
  action: React.ReactNode
  onDismiss: (() => void) | null
  children: React.ReactNode
}

export function Callout({
  tone,
  title,
  kicker,
  icon: Icon,
  action,
  onDismiss,
  children,
}: CalloutProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <aside
      aria-label={title}
      className={cn(
        'relative flex min-w-0 gap-3 rounded-card p-4 pr-12',
        TONE_CLASS_NAMES[tone],
        onDismiss === null && 'pr-4',
      )}
    >
      {tone === CalloutTones.BRAND ? (
        <BowIcon className={cn('mt-0.5 size-6', ICON_CLASS_NAMES[tone])} />
      ) : null}
      {tone !== CalloutTones.BRAND && Icon !== null ? (
        <Icon className={cn('mt-0.5 size-5', ICON_CLASS_NAMES[tone])} />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {kicker === null ? null : (
          <p className="font-hand text-[22px] leading-none font-semibold text-hand-on-paper">
            {kicker}
          </p>
        )}
        <p className="font-bold">{title}</p>
        <div className="text-small">{children}</div>
        {action}
      </div>
      {onDismiss === null ? null : (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2.5 right-2.5 shadow-none"
          onClick={onDismiss}
        >
          <CloseIcon />
          <span className="sr-only">{t('common.callout.dismiss')}</span>
        </Button>
      )}
    </aside>
  )
}
