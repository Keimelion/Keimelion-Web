import { describe, expect, it } from 'vitest'
import { GIFT_PATTERN_LIST, getGiftPattern } from './gift-pattern'

describe('getGiftPattern', () => {
  it('always gives the same paper for the same seed', () => {
    expect(getGiftPattern('item-42')).toBe(getGiftPattern('item-42'))
  })

  it('mixes the six papers across a list', () => {
    const papers = new Set(
      Array.from({ length: 60 }, (_, position) => getGiftPattern(`item-${String(position)}`)),
    )

    expect([...papers].sort()).toEqual([...GIFT_PATTERN_LIST].sort())
  })
})
