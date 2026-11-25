import { cn } from '@/lib/utils'
import type { ShapeProps } from './shape-props'

export function ArchesShape({ className }: ShapeProps): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 -12 140 112" className={cn('size-6 shrink-0', className)}>
      <path fill="currentColor" d="M0 100V44a28 28 0 0 1 56 0v56zM64 100V30a38 38 0 0 1 76 0v70z" />
    </svg>
  )
}
