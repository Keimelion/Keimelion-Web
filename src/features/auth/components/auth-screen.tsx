import type { LineIconProps } from '@/components/icons'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'

interface AuthScreenProps {
  icon: React.ComponentType<LineIconProps>
  paper: OccasionPaper
  title: string
  description: string
  children: React.ReactNode
}

export function AuthScreen({
  icon: Icon,
  paper,
  title,
  description,
  children,
}: AuthScreenProps): React.JSX.Element {
  return (
    <section className="relative mx-auto flex w-full max-w-md min-w-0 flex-col items-center gap-3 py-10 text-center lg:py-16">
      <span
        className={cn(
          'mb-2 flex size-[92px] -rotate-6 items-center justify-center rounded-card text-ink',
          OCCASION_PAPER_CLASS_NAMES[paper].paper,
        )}
      >
        <Icon className="size-12" />
      </span>
      <h1 className="text-display-m">{title}</h1>
      <p className="text-body wrap-anywhere text-muted-foreground">{description}</p>
      {children}
    </section>
  )
}
