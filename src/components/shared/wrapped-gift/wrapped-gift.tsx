'use client'

import { motion } from 'motion/react'
import { useEffect, useId } from 'react'
import { BowGlyph } from '@/components/icons'
import { TyingBowGlyph } from '@/components/shared/tying-bow'
import { useShouldReduceMotion } from '@/lib/motion'
import { OCCASION_PAPER_CLASS_NAMES } from '@/lib/occasions/occasion-paper'
import type { OccasionPaper } from '@/lib/occasions/occasion-paper'
import { cn } from '@/lib/utils'
import { UNWRAP_TIMELINE, WRAP_TIMELINE } from './gift-timelines'
import type { GiftTimeline } from './gift-timelines'

export const WrappedGiftModes = {
  STATIC: 'static',
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
} as const

export type WrappedGiftMode = (typeof WrappedGiftModes)[keyof typeof WrappedGiftModes]

const NO_MOTION: GiftTimeline = {
  paper: {},
  verticalRibbon: {},
  horizontalRibbon: {},
  bow: {},
  bowTieDelay: null,
}

interface WrappedGiftProps {
  paper: OccasionPaper
  mode: WrappedGiftMode
  onDone: () => void
  className?: string | undefined
  children?: React.ReactNode
}

export function WrappedGift({
  paper,
  mode,
  onDone,
  className,
  children,
}: WrappedGiftProps): React.JSX.Element {
  const shouldReduceMotion = useShouldReduceMotion()
  const isAnimated = mode !== WrappedGiftModes.STATIC && !shouldReduceMotion
  const isUnwrapped = mode === WrappedGiftModes.UNWRAP && shouldReduceMotion

  useEffect(() => {
    if (mode !== WrappedGiftModes.STATIC && shouldReduceMotion) onDone()
  }, [mode, shouldReduceMotion, onDone])

  return (
    <span
      data-mode={mode}
      className={cn('relative block overflow-hidden rounded-thumb', className)}
    >
      {children}
      {isUnwrapped ? null : (
        <GiftWrapping
          key={String(isAnimated)}
          paper={paper}
          timeline={isAnimated ? resolveTimeline(mode) : NO_MOTION}
          onDone={isAnimated ? onDone : null}
          isBowLast={mode === WrappedGiftModes.WRAP}
        />
      )}
    </span>
  )
}

function resolveTimeline(mode: WrappedGiftMode): GiftTimeline {
  return mode === WrappedGiftModes.UNWRAP ? UNWRAP_TIMELINE : WRAP_TIMELINE
}

const DOT_PATTERN_SIZE = 16
const DOT_RADIUS = 16 / 7
const RIBBON_WIDTH = 9
const RIBBON_OFFSET = 50 - RIBBON_WIDTH / 2

interface GiftWrappingProps {
  paper: OccasionPaper
  timeline: GiftTimeline
  onDone: (() => void) | null
  isBowLast: boolean
}

function GiftWrapping({
  paper,
  timeline,
  onDone,
  isBowLast,
}: GiftWrappingProps): React.JSX.Element {
  const patternId = useId()
  const paperCompletion = onDone === null || isBowLast ? {} : { onAnimationComplete: onDone }
  const bowCompletion = onDone === null || !isBowLast ? {} : { onAnimationComplete: onDone }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <pattern
          id={patternId}
          width={DOT_PATTERN_SIZE}
          height={DOT_PATTERN_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={DOT_PATTERN_SIZE}
            height={DOT_PATTERN_SIZE}
            className={OCCASION_PAPER_CLASS_NAMES[paper].giftFill}
          />
          <circle cx="4" cy="4" r={DOT_RADIUS} className="fill-gift-ribbon" />
          <circle cx="12" cy="12" r={DOT_RADIUS} className="fill-gift-ribbon" />
        </pattern>
      </defs>
      <motion.rect
        width="100"
        height="100"
        fill={`url(#${patternId})`}
        {...timeline.paper}
        {...paperCompletion}
      />
      <motion.rect
        x={RIBBON_OFFSET}
        width={RIBBON_WIDTH}
        height="100"
        className="fill-gift-ribbon"
        {...timeline.verticalRibbon}
      />
      <motion.rect
        y={RIBBON_OFFSET}
        width="100"
        height={RIBBON_WIDTH}
        className="fill-gift-ribbon"
        {...timeline.horizontalRibbon}
      />
      <g transform="translate(20 18) scale(0.6)" className="text-brand">
        {timeline.bowTieDelay === null ? (
          <motion.g {...timeline.bow} style={{ originX: 0.5, originY: 0.5 }} {...bowCompletion}>
            <BowGlyph />
          </motion.g>
        ) : (
          <TyingBowGlyph delay={timeline.bowTieDelay} onDone={isBowLast ? onDone : null} />
        )}
      </g>
    </svg>
  )
}
