import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  className?: string | undefined
}

export function Tag({ children, className }: TagProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-block h-6 max-w-full min-w-0 truncate rounded-pill bg-sunken px-[9px] align-middle font-mono text-label leading-6 tracking-normal text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
