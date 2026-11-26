import { BowGlyph } from '@/components/icons'
import { GiftPatterns } from '@/lib/occasions/gift-pattern'
import type { GiftPattern } from '@/lib/occasions/gift-pattern'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'

interface GiftPaperPatternProps {
  id: string
  pattern: GiftPattern
  paper: OccasionPaper
}

const DOT_PATTERN_SIZE = 16
const DOT_RADIUS = 16 / 7
const BOARD_SCALE = 2 / 3
const TINT_OPACITY = 0.45
const GINGHAM_OPACITY = 0.4
const MOTIF_CLASS_NAME = 'fill-gift-ribbon'

export function GiftPaperPattern({ id, pattern, paper }: GiftPaperPatternProps): React.JSX.Element {
  const backgroundClassName = OCCASION_PAPER_CLASS_NAMES[paper].giftFill
  switch (pattern) {
    case GiftPatterns.DOTS:
      return (
        <pattern
          id={id}
          width={DOT_PATTERN_SIZE}
          height={DOT_PATTERN_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={DOT_PATTERN_SIZE}
            height={DOT_PATTERN_SIZE}
            className={backgroundClassName}
          />
          <circle cx="4" cy="4" r={DOT_RADIUS} className={MOTIF_CLASS_NAME} />
          <circle cx="12" cy="12" r={DOT_RADIUS} className={MOTIF_CLASS_NAME} />
        </pattern>
      )
    case GiftPatterns.STRIPES:
      return (
        <BoardPattern id={id} size={22} extraTransform="rotate(45)">
          <rect width="22" height="22" className={backgroundClassName} />
          <rect width="8" height="22" opacity={TINT_OPACITY} className={MOTIF_CLASS_NAME} />
        </BoardPattern>
      )
    case GiftPatterns.GINGHAM:
      return (
        <BoardPattern id={id} size={28} extraTransform="">
          <rect width="28" height="28" className={backgroundClassName} />
          <rect width="14" height="28" opacity={GINGHAM_OPACITY} className={MOTIF_CLASS_NAME} />
          <rect width="28" height="14" opacity={GINGHAM_OPACITY} className={MOTIF_CLASS_NAME} />
        </BoardPattern>
      )
    case GiftPatterns.CONFETTI:
      return (
        <BoardPattern id={id} size={60} extraTransform="">
          <rect width="60" height="60" className={backgroundClassName} />
          <g className={MOTIF_CLASS_NAME}>
            <circle cx="10" cy="12" r="3" />
            <rect x="34" y="8" width="10" height="4" rx="2" transform="rotate(30 39 10)" />
            <path d="M22 40l6 8h-12z" />
            <circle cx="48" cy="44" r="2.5" />
            <rect x="4" y="50" width="9" height="4" rx="2" transform="rotate(-25 8 52)" />
          </g>
        </BoardPattern>
      )
    case GiftPatterns.BOWS:
      return (
        <BoardPattern id={id} size={44} extraTransform="">
          <rect width="44" height="44" className={backgroundClassName} />
          <g className="text-gift-ribbon">
            <g transform="translate(11 12) scale(0.13) translate(-50 -46)">
              <BowGlyph />
            </g>
            <g transform="translate(33 34) scale(0.13) translate(-50 -46)">
              <BowGlyph />
            </g>
          </g>
        </BoardPattern>
      )
    case GiftPatterns.STARS:
      return (
        <BoardPattern id={id} size={40} extraTransform="">
          <rect width="40" height="40" className={backgroundClassName} />
          <g className={MOTIF_CLASS_NAME}>
            <path d="M10 5l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" />
            <path d="M30 25l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" />
          </g>
        </BoardPattern>
      )
    default:
      return pattern satisfies never
  }
}

interface BoardPatternProps {
  id: string
  size: number
  extraTransform: string
  children: React.ReactNode
}

function BoardPattern({
  id,
  size,
  extraTransform,
  children,
}: BoardPatternProps): React.JSX.Element {
  return (
    <pattern
      id={id}
      data-pattern-kind="board"
      width={size}
      height={size}
      patternUnits="userSpaceOnUse"
      patternTransform={`${extraTransform} scale(${String(BOARD_SCALE)})`.trim()}
    >
      {children}
    </pattern>
  )
}
