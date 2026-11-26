import { cn } from '@/lib/utils'

interface DottedTrailProps {
  path: string
  width: number
  height: number
  className: string
}

export function DottedTrail({
  path,
  width,
  height,
  className,
}: DottedTrailProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      className={cn('absolute overflow-visible text-ink', className)}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
    </svg>
  )
}
