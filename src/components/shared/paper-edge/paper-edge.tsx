import { useId } from 'react'
import { getOccasionPaper, OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'

interface PaperEdgeProps {
  occasionSlug: string | null
}

const DOT_PATTERN_SIZE = 14
const DOT_RADIUS = 2
const EDGE_LINE_HEIGHT = 3

export function PaperEdge({ occasionSlug }: PaperEdgeProps): React.JSX.Element {
  const patternId = useId()
  const paperFill = OCCASION_PAPER_CLASS_NAMES[getOccasionPaper(occasionSlug)].paperFill
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[18px] w-full"
    >
      <defs>
        <pattern
          id={patternId}
          width={DOT_PATTERN_SIZE}
          height={DOT_PATTERN_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect width={DOT_PATTERN_SIZE} height={DOT_PATTERN_SIZE} className={paperFill} />
          <circle cx="3.5" cy="3.5" r={DOT_RADIUS} className="fill-gift-ribbon" />
          <circle cx="10.5" cy="10.5" r={DOT_RADIUS} className="fill-gift-ribbon" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      <rect width="100%" height={EDGE_LINE_HEIGHT} className="fill-gift-ribbon" />
    </svg>
  )
}
