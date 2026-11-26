'use client'

import { motion } from 'motion/react'
import { HeadphonesIcon } from '@/components/icons'
import { land } from '@/lib/motion'
import { useTranslate } from '@/lib/i18n/use-translate'
import { DottedTrail } from './dotted-trail'

const EMPTY_SLOT_KEYS = ['first', 'second', 'third'] as const
const LAND_DELAY_S = 0.4

export function SignupArt(): React.JSX.Element {
  const t = useTranslate()
  return (
    <div className="relative h-[110px] w-[260px]">
      <DottedTrail
        path="M8 70 C30 20, 70 10, 106 30"
        width={110}
        height={80}
        className="top-[30px] left-0"
      />
      <div className="absolute top-2 left-[104px] w-[150px] -rotate-3 rounded-2xl bg-raised px-3 py-2.5 shadow-float">
        <p className="font-hand text-lg leading-[18px] font-semibold text-hand">
          {t('auth.art.first_list')}
        </p>
        <div className="mt-2 flex gap-1.5">
          {EMPTY_SLOT_KEYS.map((slotKey) => (
            <span
              key={slotKey}
              className="size-[38px] rounded-[9px] border-2 border-dashed border-rule"
            />
          ))}
        </div>
      </div>
      <motion.span
        {...land}
        transition={{ ...land.transition, delay: LAND_DELAY_S }}
        className="absolute top-[46px] left-[118px] flex size-[38px] items-center justify-center rounded-[9px] bg-paper-sky text-ink"
      >
        <HeadphonesIcon className="size-[26px]" />
      </motion.span>
    </div>
  )
}
