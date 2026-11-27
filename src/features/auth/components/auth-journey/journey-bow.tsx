'use client'

import { motion } from 'motion/react'
import type { TargetAndTransition, Transition } from 'motion/react'
import { BowIcon } from '@/components/icons'
import { MotionEasings } from '@/lib/motion'
import { BOW_TRAVEL, JOURNEY_ROAD_PATH, JOURNEY_TRAVEL_S, JourneyPhases } from './journey-timeline'
import type { JourneyPhase } from './journey-timeline'

const ROAD_START = { offsetDistance: '0%', opacity: 1, y: 0, scale: 1 }
const MERGED_INTO_GIFT = { offsetDistance: '100%', opacity: 0, y: 40, scale: 0.4 }
const MERGE_DURATION_S = 0.5
const TRAVEL_EASE = [0.45, 0, 0.25, 1] as const

interface JourneyBowProps {
  phase: JourneyPhase
  hasArrived: boolean
  onArrive: () => void
}

export function JourneyBow({ phase, hasArrived, onArrive }: JourneyBowProps): React.JSX.Element {
  const { animate, transition } = resolveBowMotion(phase, hasArrived)
  return (
    <motion.span
      initial={ROAD_START}
      animate={animate}
      transition={transition}
      onAnimationComplete={() => {
        if (phase === JourneyPhases.PLAYING && !hasArrived) onArrive()
      }}
      style={{
        offsetPath: `path('${JOURNEY_ROAD_PATH}')`,
        offsetRotate: '0deg',
        offsetAnchor: '50% 150%',
      }}
      className="absolute top-0 left-0 z-10 flex size-[46px] items-center justify-center rounded-pill bg-raised text-brand shadow-float"
    >
      <BowIcon className="size-8" />
    </motion.span>
  )
}

interface BowMotion {
  animate: TargetAndTransition
  transition: Transition
}

function resolveBowMotion(phase: JourneyPhase, hasArrived: boolean): BowMotion {
  if (phase === JourneyPhases.DONE)
    return { animate: MERGED_INTO_GIFT, transition: { duration: 0 } }
  if (phase === JourneyPhases.IDLE) return { animate: ROAD_START, transition: { duration: 0 } }
  if (hasArrived) {
    return {
      animate: MERGED_INTO_GIFT,
      transition: { duration: MERGE_DURATION_S, ease: MotionEasings.STANDARD },
    }
  }
  return {
    animate: { offsetDistance: BOW_TRAVEL.offsetDistance },
    transition: { duration: JOURNEY_TRAVEL_S, times: BOW_TRAVEL.times, ease: TRAVEL_EASE },
  }
}
