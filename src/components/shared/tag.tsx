import { cn } from '@/lib/utils'

export const TagTones = {
  BRAND: 'brand',
  NEUTRAL: 'neutral',
} as const

export type TagTone = (typeof TagTones)[keyof typeof TagTones]

const TONE_CLASS_NAMES: Readonly<Record<TagTone, string>> = {
  [TagTones.BRAND]: 'bg-brand-soft text-on-brand-soft',
  [TagTones.NEUTRAL]: 'bg-sunken text-muted-foreground',
}

interface TagProps {
  tone: TagTone
  children: React.ReactNode
  className?: string | undefined
}

export function Tag({ tone, children, className }: TagProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-block h-6 max-w-full min-w-0 truncate rounded-pill px-[9px] align-middle font-mono text-label leading-6 tracking-normal',
        TONE_CLASS_NAMES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
