import { useId } from 'react'
import { OCCASION_PAPER_CLASS_NAMES, OccasionPapers } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'

export const AuthBackdrops = {
  ...OccasionPapers,
  GINGHAM: 'gingham',
} as const

export type AuthBackdrop = (typeof AuthBackdrops)[keyof typeof AuthBackdrops]

const GINGHAM_TILE_SIZE = 32
const GINGHAM_BAND_SIZE = GINGHAM_TILE_SIZE / 2
const GINGHAM_BAND_OPACITY = 0.4

interface AuthBackdropFillProps {
  backdrop: AuthBackdrop
  className: string
}

export function AuthBackdropFill({
  backdrop,
  className,
}: AuthBackdropFillProps): React.JSX.Element {
  if (backdrop === AuthBackdrops.GINGHAM) return <GinghamFill className={className} />
  return (
    <div
      aria-hidden="true"
      data-backdrop={backdrop}
      className={cn(OCCASION_PAPER_CLASS_NAMES[backdrop satisfies OccasionPaper].paper, className)}
    />
  )
}

interface GinghamFillProps {
  className: string
}

function GinghamFill({ className }: GinghamFillProps): React.JSX.Element {
  const patternId = useId()
  return (
    <svg
      aria-hidden="true"
      data-backdrop={AuthBackdrops.GINGHAM}
      className={cn('size-full', className)}
    >
      <defs>
        <pattern
          id={patternId}
          width={GINGHAM_TILE_SIZE}
          height={GINGHAM_TILE_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={GINGHAM_TILE_SIZE}
            height={GINGHAM_TILE_SIZE}
            className={OCCASION_PAPER_CLASS_NAMES[OccasionPapers.SKY].paperFill}
          />
          <rect
            width={GINGHAM_BAND_SIZE}
            height={GINGHAM_TILE_SIZE}
            opacity={GINGHAM_BAND_OPACITY}
            className="fill-gift-ribbon"
          />
          <rect
            width={GINGHAM_TILE_SIZE}
            height={GINGHAM_BAND_SIZE}
            opacity={GINGHAM_BAND_OPACITY}
            className="fill-gift-ribbon"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
