'use client'

import { motion } from 'motion/react'
import { BowIcon } from '@/components/icons'
import { MotionDurations, MotionEasings, land } from '@/lib/motion'
import { DottedTrail } from './dotted-trail'

const ARRIVAL_OFFSET_PX = -48
const SEAL_DELAY_S = 0.45

export function EnvelopeArt(): React.JSX.Element {
  return (
    <div className="relative h-[104px] w-[250px]">
      <DottedTrail
        path="M4 50 C30 10, 60 40, 86 20"
        width={90}
        height={60}
        className="top-11 left-0"
      />
      <motion.div
        initial={{ opacity: 0, x: ARRIVAL_OFFSET_PX }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: MotionDurations.L, ease: MotionEasings.SOFT_OUT }}
        className="absolute top-0 left-[90px] h-[104px] w-40 rounded-[18px] bg-raised shadow-float"
      >
        <svg aria-hidden="true" viewBox="0 0 160 104" className="size-full overflow-visible">
          <path
            d="M8 10l72 50 72 -50"
            fill="none"
            strokeWidth="4"
            strokeLinejoin="round"
            className="stroke-parcel-top"
          />
        </svg>
        <motion.span
          {...land}
          transition={{ ...land.transition, delay: SEAL_DELAY_S }}
          className="absolute top-[34px] left-[58px] text-brand"
        >
          <BowIcon className="size-11" />
        </motion.span>
      </motion.div>
    </div>
  )
}
