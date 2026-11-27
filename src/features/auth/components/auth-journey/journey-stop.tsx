'use client'

import { motion } from 'motion/react'
import { useTranslate } from '@/lib/i18n/use-translate'
import { MotionDurations } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { DIMMED_TILE_FILTER, JourneyPhases, LIT_TILE_FILTER } from './journey-timeline'
import type { JourneyPhase, JourneyStopPlacement } from './journey-timeline'

const LIGHT_UP_POP_SCALE = 1.05

interface JourneyStopProps {
  phase: JourneyPhase
  stop: JourneyStopPlacement
  children: React.ReactNode
}

export function JourneyStop({ phase, stop, children }: JourneyStopProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <motion.div
      data-journey-stop={stop.number}
      initial={{ filter: DIMMED_TILE_FILTER, scale: 1 }}
      animate={resolveStopAnimation(phase)}
      transition={
        phase === JourneyPhases.PLAYING
          ? { duration: MotionDurations.L, delay: stop.arrivalS }
          : { duration: 0 }
      }
      style={{ originY: 0 }}
      className={cn('absolute flex flex-col items-center', stop.className)}
    >
      {children}
      <span className="mt-2 flex items-center gap-1.5">
        <span className="inline-flex size-[22px] items-center justify-center rounded-pill bg-inverse text-xs font-bold text-on-inverse">
          {stop.number}
        </span>
        <span className="font-hand text-2xl leading-6 font-semibold text-hand-on-paper">
          {t(stop.labelId)}
        </span>
      </span>
    </motion.div>
  )
}

function resolveStopAnimation(phase: JourneyPhase): { filter: string; scale: number | number[] } {
  switch (phase) {
    case JourneyPhases.IDLE:
      return { filter: DIMMED_TILE_FILTER, scale: 1 }
    case JourneyPhases.PLAYING:
      return { filter: LIT_TILE_FILTER, scale: [1, LIGHT_UP_POP_SCALE, 1] }
    case JourneyPhases.DONE:
      return { filter: LIT_TILE_FILTER, scale: 1 }
    default:
      return phase satisfies never
  }
}
