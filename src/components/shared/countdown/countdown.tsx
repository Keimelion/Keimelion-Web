'use client'

import { motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { BowIcon } from '@/components/icons'
import { Confetti } from '@/components/shared/confetti'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { flip, wiggle } from '@/lib/motion'
import { fromCalendarDate } from '@/lib/calendar-date'
import { cn } from '@/lib/utils'
import { claimDailyFlip, claimVisitCelebration } from './countdown-memory'
import { CountdownPhases, getCountdownState, toCalendarDayKey } from './countdown-state'
import type { CountdownPhase, CountdownState } from './countdown-state'
import { useClaimAfterMount } from './use-claim-after-mount'
import { useClientToday } from './use-client-today'

interface CountdownProps {
  date: Date | null
  today: Date | null
  occasionKicker: string
  children: React.ReactNode
}

const PHASE_KICKER_IDS: Readonly<Partial<Record<CountdownPhase, MessageId>>> = {
  [CountdownPhases.NEAR]: 'common.countdown.near_kicker',
  [CountdownPhases.TOMORROW]: 'common.countdown.tomorrow_kicker',
  [CountdownPhases.TODAY]: 'common.countdown.today_kicker',
  [CountdownPhases.PAST]: 'common.countdown.past_kicker',
}

export function Countdown({
  date,
  today,
  occasionKicker,
  children,
}: CountdownProps): React.JSX.Element {
  const t = useTranslate()
  const clientToday = useClientToday(today)
  if (date === null || clientToday === null) {
    return <CountdownFrame kicker={occasionKicker}>{children}</CountdownFrame>
  }
  const eventDay = fromCalendarDate(date)
  const state = getCountdownState(eventDay, clientToday)
  const kickerId = PHASE_KICKER_IDS[state.phase]
  return (
    <CountdownFrame kicker={kickerId === undefined ? occasionKicker : t(kickerId)}>
      {children}
      <CountdownValue
        state={state}
        eventDate={eventDay}
        eventDayKey={toCalendarDayKey(eventDay)}
        todayKey={toCalendarDayKey(clientToday)}
      />
    </CountdownFrame>
  )
}

interface CountdownFrameProps {
  kicker: string
  children: React.ReactNode
}

function CountdownFrame({ kicker, children }: CountdownFrameProps): React.JSX.Element {
  return (
    <div className="relative flex min-w-0 flex-col gap-2">
      <p className="font-hand text-[22px] leading-none font-semibold text-hand-on-paper">
        {kicker}
      </p>
      {children}
    </div>
  )
}

interface CountdownValueProps {
  state: CountdownState
  eventDate: Date
  eventDayKey: string
  todayKey: string
}

function CountdownValue({
  state,
  eventDate,
  eventDayKey,
  todayKey,
}: CountdownValueProps): React.JSX.Element {
  const t = useTranslate()
  switch (state.phase) {
    case CountdownPhases.FAR:
    case CountdownPhases.NEAR:
      return (
        <DaysLeft
          daysLeft={state.daysLeft}
          isNear={state.phase === CountdownPhases.NEAR}
          flipKey={`${eventDayKey}:${todayKey}`}
          claimFlip={() => claimDailyFlip(eventDayKey, todayKey)}
        />
      )
    case CountdownPhases.TOMORROW:
      return (
        <p className="flex items-center gap-2.5">
          <motion.span className="inline-flex text-brand" {...wiggle}>
            <BowIcon className="size-7" />
          </motion.span>
          <span className="font-display text-2xl font-extrabold tracking-[-0.035em]">
            {t('common.countdown.tomorrow')}
          </span>
        </p>
      )
    case CountdownPhases.TODAY:
      return <TheDay eventDate={eventDate} eventDayKey={eventDayKey} />
    case CountdownPhases.PAST:
      return <p className="text-sm">{t('common.countdown.past', { date: eventDate.getTime() })}</p>
    default:
      return state.phase satisfies never
  }
}

interface DaysLeftProps {
  daysLeft: number
  isNear: boolean
  flipKey: string
  claimFlip: () => boolean
}

function DaysLeft({ daysLeft, isNear, flipKey, claimFlip }: DaysLeftProps): React.JSX.Element {
  const t = useTranslate()
  const isFlipping = useClaimAfterMount(claimFlip, flipKey)
  const digits = Array.from(String(daysLeft))
  const lastPosition = digits.length - 1
  return (
    <p className="flex items-center gap-2">
      <span aria-hidden="true" className="inline-flex gap-[3px]">
        {digits.map((digit, position) =>
          position === lastPosition && isFlipping ? (
            <motion.span
              key={`flip-${String(position)}`}
              className={tileClassName(isNear)}
              {...flip}
            >
              {digit}
            </motion.span>
          ) : (
            <span key={String(position)} className={tileClassName(isNear)}>
              {digit}
            </span>
          ),
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'font-hand leading-none font-semibold text-hand-on-paper',
          isNear ? 'text-[21px]' : 'text-[17px]',
        )}
      >
        {t('common.countdown.days_to_go', { count: daysLeft })}
      </span>
      <span className="sr-only">{t('common.countdown.days_to_go_label', { count: daysLeft })}</span>
    </p>
  )
}

function tileClassName(isNear: boolean): string {
  return cn(
    'inline-flex items-center justify-center bg-raised font-display leading-none font-extrabold text-ink shadow-[inset_0_-2px_0_color-mix(in_srgb,var(--ink)_12%,transparent)]',
    isNear ? 'h-[42px] w-[27px] rounded-lg text-[34px]' : 'h-9 w-[22px] rounded-md text-[28px]',
  )
}

interface TheDayProps {
  eventDate: Date
  eventDayKey: string
}

function TheDay({ eventDate, eventDayKey }: TheDayProps): React.JSX.Element {
  const t = useTranslate()
  const shouldCelebrate = useClaimAfterMount(() => claimVisitCelebration(eventDayKey), eventDayKey)
  const [hasCelebrated, setHasCelebrated] = useState(false)
  const endCelebration = useCallback(() => {
    setHasCelebrated(true)
  }, [])
  return (
    <>
      {shouldCelebrate && !hasCelebrated ? <Confetti onDone={endCelebration} /> : null}
      <p className="font-display text-2xl font-extrabold tracking-[-0.035em]">
        {t('common.countdown.today', { date: eventDate.getTime() })}
      </p>
      <p className="text-small">{t('common.countdown.today_note')}</p>
    </>
  )
}
