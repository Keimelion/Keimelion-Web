import { cn } from '@/lib/utils'
import { BowGlyph } from './bow-glyph'
import type { ShapeProps } from './shape-props'

export function BowIcon({ className }: ShapeProps): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn('size-6 shrink-0', className)}>
      <BowGlyph />
    </svg>
  )
}
