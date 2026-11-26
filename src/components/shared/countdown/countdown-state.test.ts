import { describe, expect, it } from 'vitest'
import { CountdownPhases, getCountdownState, toCalendarDayKey } from './countdown-state'

const EVENT_DATE = new Date(2027, 5, 14, 15, 30)

function daysBefore(days: number): Date {
  return new Date(2027, 5, 14 - days, 23, 59)
}

describe('getCountdownState', () => {
  it.each([
    [209, CountdownPhases.FAR],
    [8, CountdownPhases.FAR],
    [7, CountdownPhases.NEAR],
    [2, CountdownPhases.NEAR],
    [1, CountdownPhases.TOMORROW],
    [0, CountdownPhases.TODAY],
    [-1, CountdownPhases.PAST],
  ])('counts %i calendar days as %s', (days, phase) => {
    expect(getCountdownState(EVENT_DATE, daysBefore(days))).toEqual({ phase, daysLeft: days })
  })

  it('ignores the time of day', () => {
    expect(
      getCountdownState(new Date(2027, 5, 14, 0, 1), new Date(2027, 5, 13, 23, 59)).phase,
    ).toBe(CountdownPhases.TOMORROW)
  })
})

describe('toCalendarDayKey', () => {
  it('keys a date by its local calendar day', () => {
    expect(toCalendarDayKey(new Date(2027, 0, 5, 23, 59))).toBe('2027-01-05')
  })
})
