'use client'

import { motion } from 'motion/react'
import { FlowerShape, LinkIcon, PlusIcon, TeacupIcon } from '@/components/icons'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'
import { JOURNEY_STOPS, JourneyPhases } from './journey-timeline'
import type { JourneyPhase } from './journey-timeline'

const LIST_SWATCH_CLASS_NAMES = ['bg-paper-mustard', 'bg-paper-mint', 'bg-paper-sky'] as const
const PHONE_ROW_CLASS_NAMES = ['bg-paper-mustard', 'bg-paper-mint'] as const
const TAP_ARRIVAL_S = JOURNEY_STOPS.RESERVE.arrivalS
const TAP_DURATION_S = 0.8

export function ProductTile(): React.JSX.Element {
  const t = useTranslate()
  return (
    <div className="w-[130px] rounded-[18px] bg-raised p-[7px] shadow-float">
      <div className="relative flex h-[74px] items-center justify-center rounded-xl bg-paper-mustard text-ink">
        <TeacupIcon className="size-11" />
        <span className="absolute -right-1.5 -bottom-2 flex size-[30px] items-center justify-center rounded-pill bg-brand text-on-brand shadow-[0_0_0_3px_var(--raised)]">
          <PlusIcon className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-1 pt-2 pb-0.5">
        <span className="text-xs font-bold text-ink">{t('auth.journey.product_name')}</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {t('auth.journey.product_price')}
        </span>
      </div>
    </div>
  )
}

export function SharedListTile(): React.JSX.Element {
  const t = useTranslate()
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[140px] overflow-hidden rounded-2xl bg-raised px-3 pt-2.5 pb-5 shadow-float">
        <div className="absolute inset-x-0 top-0 h-[46px] bg-paper-lilac" />
        <div className="relative flex items-center gap-1.5 text-ink">
          <FlowerShape className="size-[18px]" />
          <span className="font-mono text-[9px] tracking-[0.08em] uppercase">
            {t('auth.journey.list_count')}
          </span>
        </div>
        <p className="relative mt-3.5 font-display text-sm leading-[1.05] font-extrabold text-ink">
          {t('auth.journey.list_title')}
        </p>
        <div className="mt-2 flex gap-1">
          {LIST_SWATCH_CLASS_NAMES.map((swatchClassName) => (
            <span key={swatchClassName} className={cn('size-[21px] rounded-md', swatchClassName)} />
          ))}
        </div>
      </div>
      <span className="inline-flex h-[26px] items-center gap-1.5 rounded-pill bg-inverse px-2.5 font-mono text-[10px] whitespace-nowrap text-on-inverse">
        <LinkIcon className="size-3" />
        {t('auth.journey.share_link')}
      </span>
    </div>
  )
}

interface PhoneTileProps {
  phase: JourneyPhase
}

export function PhoneTile({ phase }: PhoneTileProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <div className="h-[156px] w-24 rounded-[22px] bg-inverse p-1.5 shadow-float">
      <div className="relative h-full overflow-hidden rounded-[17px] bg-surface">
        <div className="h-[34px] bg-paper-lilac px-2 py-1.5">
          <span className="mx-auto mb-1.5 block h-1 w-[30px] rounded-pill bg-ink" />
          <span className="font-display text-[9px] font-extrabold text-ink">
            {t('auth.journey.list_title')}
          </span>
        </div>
        <div className="flex flex-col gap-[5px] p-1.5">
          {PHONE_ROW_CLASS_NAMES.map((rowClassName) => (
            <div
              key={rowClassName}
              className="flex items-center gap-[5px] rounded-lg bg-raised p-1"
            >
              <span className={cn('size-[22px] rounded-md', rowClassName)} />
              <span className="h-[5px] flex-1 rounded-pill bg-sunken" />
            </div>
          ))}
          <ReserveButton phase={phase} label={t('auth.journey.reserve')} />
        </div>
      </div>
    </div>
  )
}

interface ReserveButtonProps {
  phase: JourneyPhase
  label: string
}

function ReserveButton({ phase, label }: ReserveButtonProps): React.JSX.Element {
  return (
    <span className="relative mt-0.5 self-center rounded-pill bg-brand px-2.5 py-1 text-[9px] font-bold text-on-brand">
      {label}
      {phase === JourneyPhases.PLAYING ? (
        <motion.span
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 0.3, 2.2], opacity: [0, 0.7, 0] }}
          transition={{ duration: TAP_DURATION_S, delay: TAP_ARRIVAL_S, times: [0, 0.2, 1] }}
          className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 rounded-pill bg-raised"
        />
      ) : null}
    </span>
  )
}
