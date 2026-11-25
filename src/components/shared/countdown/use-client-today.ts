'use client'

import { useSyncExternalStore } from 'react'
import { toCalendarDayKey } from './countdown-state'

export function useClientToday(injectedToday: Date | null): Date | null {
  const todayKey = useSyncExternalStore(subscribeToNothing, readTodayKey, readServerTodayKey)
  if (injectedToday !== null) return injectedToday
  if (todayKey === null) return null
  return parseCalendarDayKey(todayKey)
}

function subscribeToNothing(): () => void {
  return () => undefined
}

function readTodayKey(): string {
  return toCalendarDayKey(new Date())
}

function readServerTodayKey(): null {
  return null
}

function parseCalendarDayKey(dayKey: string): Date {
  const [year = 0, month = 1, day = 1] = dayKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}
