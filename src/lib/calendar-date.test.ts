import { describe, expect, it } from 'vitest'
import { fromCalendarDate, toCalendarDate } from './calendar-date'

describe('calendar dates', () => {
  it('stores a picked local day as midnight UTC of the same day', () => {
    expect(toCalendarDate(new Date(2026, 11, 25, 23, 30)).toISOString()).toBe(
      '2026-12-25T00:00:00.000Z',
    )
  })

  it('reads a midnight UTC date back as the same local day, whatever the timezone', () => {
    const localDay = fromCalendarDate(new Date('2026-12-25T00:00:00.000Z'))

    expect([localDay.getFullYear(), localDay.getMonth(), localDay.getDate()]).toEqual([
      2026, 11, 25,
    ])
  })
})
