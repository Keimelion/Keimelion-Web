import { cn } from '@/lib/utils'

interface KitSpecimenProps {
  label: string
  className?: string | undefined
  children: React.ReactNode
}

export function KitSpecimen({ label, className, children }: KitSpecimenProps): React.JSX.Element {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <div className={cn('flex min-w-0 flex-wrap items-center gap-3', className)}>{children}</div>
      <figcaption className="font-mono text-label text-muted-foreground uppercase">
        {label}
      </figcaption>
    </figure>
  )
}
