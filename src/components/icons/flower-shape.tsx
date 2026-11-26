import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ShapeProps } from './shape-props'

export function FlowerShape({ className }: ShapeProps): React.JSX.Element {
  const maskId = useId()
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn('size-6 shrink-0', className)}>
      <mask id={maskId}>
        <rect width="100" height="100" fill="white" />
        <circle cx="50" cy="50" r="11" fill="black" />
      </mask>
      <g fill="currentColor" mask={`url(#${maskId})`}>
        <circle cx="50" cy="24" r="20" />
        <circle cx="75" cy="42" r="20" />
        <circle cx="66" cy="72" r="20" />
        <circle cx="34" cy="72" r="20" />
        <circle cx="25" cy="42" r="20" />
      </g>
    </svg>
  )
}
