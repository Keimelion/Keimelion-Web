import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ShapeProps } from './shape-props'

export function LeafShape({ className }: ShapeProps): React.JSX.Element {
  const maskId = useId()
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={cn('size-6 shrink-0', className)}>
      <mask id={maskId}>
        <rect width="120" height="120" fill="white" />
        <path
          fill="none"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          d="M60 104V24M60 50l-18-14M60 50l18-14M60 74l-22-16M60 74l22-16"
        />
      </mask>
      <path
        fill="currentColor"
        mask={`url(#${maskId})`}
        d="M60 114C18 92 8 40 60 6c52 34 42 86 0 108z"
      />
    </svg>
  )
}
