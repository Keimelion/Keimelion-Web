'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { CheckIcon, TeacupIcon } from '@/components/icons'
import { Confetti } from '@/components/shared/confetti'
import { WrappedGift, WrappedGiftModes } from '@/components/shared/wrapped-gift'
import { MotionDurations, MotionEasings } from '@/lib/motion'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'

const CHECK_DELAY_S = MotionDurations.GIFT

interface VerifiedArtProps {
  onWrapped: () => void
}

export function VerifiedArt({ onWrapped }: VerifiedArtProps): React.JSX.Element {
  const [isCelebrating, setIsCelebrating] = useState(true)
  return (
    <div className="relative h-[104px] w-[200px]">
      {isCelebrating ? (
        <Confetti
          onDone={() => {
            setIsCelebrating(false)
          }}
        />
      ) : null}
      <WrappedGift
        paper={OccasionPapers.LILAC}
        mode={WrappedGiftModes.WRAP}
        onDone={onWrapped}
        className="absolute top-0 left-[41px] h-[104px] w-[118px] rounded-[18px] shadow-float"
      >
        <span className="flex size-full items-center justify-center bg-paper-mustard text-ink">
          <TeacupIcon className="size-16" />
        </span>
      </WrappedGift>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: MotionDurations.M, ease: MotionEasings.POP, delay: CHECK_DELAY_S }}
        className="absolute -top-4 left-[143px] flex size-12 items-center justify-center rounded-pill bg-success text-on-success shadow-[0_0_0_4px_var(--paper-mint)]"
      >
        <CheckIcon className="size-[26px]" />
      </motion.span>
    </div>
  )
}
