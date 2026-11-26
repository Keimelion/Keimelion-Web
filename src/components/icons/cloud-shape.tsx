import { cn } from '@/lib/utils'
import type { ShapeProps } from './shape-props'

export function CloudShape({ className }: ShapeProps): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 100" className={cn('size-6 shrink-0', className)}>
      <path fill="currentColor" d="M30 82a20 20 0 0 1-2-40 26 26 0 0 1 50-8 22 22 0 0 1 14 48z" />
    </svg>
  )
}
