'use client'

import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useShouldReduceMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ConfettiProps {
  onDone: () => void
}

interface ConfettiPiece {
  leftPercent: number
  colorClassName: string
  isRound: boolean
  delaySeconds: number
}

const PIECE_COUNT = 12
const PIECE_COLOR_CLASS_NAMES = [
  'bg-brand',
  'bg-gift-mustard',
  'bg-gift-sky',
  'bg-gift-mint',
  'bg-gift-lilac',
  'bg-gift-rose',
]
const LEFT_START_PERCENT = 5
const LEFT_STEP_PERCENT = 29
const DELAY_STEP_S = 0.07
const ROUND_PIECE_EVERY = 3
const FALL_DISTANCE_PX = 300
const FALL_ROTATION_DEGREES = 540
const FALL_DURATION_S = 2.4
const FALL_EASE = [0.3, 0.6, 0.5, 1] as const
const PERCENT = 100

const PIECES: readonly ConfettiPiece[] = Array.from({ length: PIECE_COUNT }, (_, position) => ({
  leftPercent: (LEFT_START_PERCENT + position * LEFT_STEP_PERCENT) % PERCENT,
  colorClassName: PIECE_COLOR_CLASS_NAMES[position % PIECE_COLOR_CLASS_NAMES.length] ?? 'bg-brand',
  isRound: position % ROUND_PIECE_EVERY === 0,
  delaySeconds: position * DELAY_STEP_S,
}))

const LAST_PIECE_POSITION = PIECE_COUNT - 1

export function Confetti({ onDone }: ConfettiProps): React.JSX.Element | null {
  const shouldReduceMotion = useShouldReduceMotion()

  useEffect(() => {
    if (shouldReduceMotion) onDone()
  }, [shouldReduceMotion, onDone])

  if (shouldReduceMotion) return null
  return (
    <span
      aria-hidden="true"
      data-testid="confetti"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PIECES.map((piece, position) => (
        <motion.span
          key={piece.leftPercent}
          className={cn(
            'absolute -top-3',
            piece.colorClassName,
            piece.isRound ? 'size-[9px] rounded-pill' : 'h-3 w-2 rounded-[2px]',
          )}
          style={{ left: `${String(piece.leftPercent)}%` }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{ y: FALL_DISTANCE_PX, rotate: FALL_ROTATION_DEGREES, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: FALL_DURATION_S,
            delay: piece.delaySeconds,
            ease: FALL_EASE,
            opacity: {
              duration: FALL_DURATION_S,
              delay: piece.delaySeconds,
              times: [0, 0.08, 0.7, 1],
            },
          }}
          {...(position === LAST_PIECE_POSITION ? { onAnimationComplete: onDone } : {})}
        />
      ))}
    </span>
  )
}
