'use client'

import { motion } from 'motion/react'
import { BowGeometry } from '@/components/icons'
import { MotionEasings } from '@/lib/motion'
import { TieTiming } from './tie-timing'

const TUG_STRETCH = 1.1
const TUG_SQUASH = 0.9
const INSTANT_S = 0.01

interface TyingBowGlyphProps {
  delay: number
  onDone: (() => void) | null
}

export function TyingBowGlyph({ delay, onDone }: TyingBowGlyphProps): React.JSX.Element {
  const completion = onDone === null ? {} : { onAnimationComplete: onDone }
  return (
    <g transform={BowGeometry.OFFSET_TRANSFORM} fill="currentColor">
      <motion.path
        d={BowGeometry.TAILS_PATH}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ originY: 0 }}
        transition={{ duration: TieTiming.TAILS_S, delay, ease: MotionEasings.STANDARD }}
      />
      <motion.g
        initial={{ scaleX: 1, scaleY: 1 }}
        animate={{ scaleX: [1, TUG_STRETCH, 1], scaleY: [1, TUG_SQUASH, 1] }}
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{
          duration: TieTiming.TUG_S,
          delay: delay + TieTiming.TUG_DELAY_S,
          ease: MotionEasings.STANDARD,
        }}
        {...completion}
      >
        <motion.path
          d={BowGeometry.LOOPS_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={BowGeometry.LOOPS_STROKE_WIDTH}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration: TieTiming.LOOPS_S,
              delay: delay + TieTiming.LOOPS_DELAY_S,
              ease: MotionEasings.STANDARD,
            },
            opacity: { duration: INSTANT_S, delay: delay + TieTiming.LOOPS_DELAY_S },
          }}
        />
      </motion.g>
      <motion.circle
        cx={BowGeometry.KNOT_CENTER_X}
        cy={BowGeometry.KNOT_CENTER_Y}
        r={BowGeometry.KNOT_RADIUS}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{
          duration: TieTiming.KNOT_S,
          delay: delay + TieTiming.KNOT_DELAY_S,
          ease: MotionEasings.POP,
        }}
      />
    </g>
  )
}
