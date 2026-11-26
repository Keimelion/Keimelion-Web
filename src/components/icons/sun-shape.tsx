import { cn } from '@/lib/utils'
import type { ShapeProps } from './shape-props'

export function SunShape({ className }: ShapeProps): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={cn('size-6 shrink-0', className)}>
      <g fill="currentColor">
        <circle cx="60" cy="60" r="26" />
        <circle cx="60" cy="14" r="8" />
        <circle cx="60" cy="106" r="8" />
        <circle cx="14" cy="60" r="8" />
        <circle cx="106" cy="60" r="8" />
        <circle cx="27" cy="27" r="7" />
        <circle cx="93" cy="27" r="7" />
        <circle cx="27" cy="93" r="7" />
        <circle cx="93" cy="93" r="7" />
      </g>
    </svg>
  )
}
