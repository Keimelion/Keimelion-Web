export const CountdownPhases = {
  FAR: 'far',
  NEAR: 'near',
  TOMORROW: 'tomorrow',
  TODAY: 'today',
  PAST: 'past',
} as const

export type CountdownPhase = (typeof CountdownPhases)[keyof typeof CountdownPhases]

export interface CountdownState {
  phase: CountdownPhase
  daysLeft: number
}

const MILLISECONDS_PER_DAY = 86_400_000
const NEAR_THRESHOLD_DAYS = 7

export function getCountdownState(eventDate: Date, today: Date): CountdownState {
  const daysLeft = Math.round(
    (toCalendarDay(eventDate) - toCalendarDay(today)) / MILLISECONDS_PER_DAY,
  )
  return { phase: resolvePhase(daysLeft), daysLeft }
}

export function toCalendarDayKey(date: Date): string {
  return new Date(toCalendarDay(date)).toISOString().slice(0, 10)
}

function toCalendarDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

function resolvePhase(daysLeft: number): CountdownPhase {
  if (daysLeft < 0) return CountdownPhases.PAST
  if (daysLeft === 0) return CountdownPhases.TODAY
  if (daysLeft === 1) return CountdownPhases.TOMORROW
  if (daysLeft <= NEAR_THRESHOLD_DAYS) return CountdownPhases.NEAR
  return CountdownPhases.FAR
}
