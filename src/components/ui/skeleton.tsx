import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-xl bg-[linear-gradient(90deg,var(--sunken)_0%,var(--raised)_40%,var(--sunken)_80%)] bg-size-[300%_100%]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
