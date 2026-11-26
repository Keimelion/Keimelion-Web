import { describe, expect, it } from 'vitest'
import {
  bob,
  flip,
  land,
  landGlow,
  press,
  scrim,
  seq,
  sheetUp,
  stamp,
  toastIn,
  unfold,
  wiggle,
} from './motion-presets'
import { MotionDurations, MotionEasings } from './motion-tokens'

describe('motion presets', () => {
  it('exposes the motion vocabulary of the boards', () => {
    const presets = { land, landGlow, toastIn, sheetUp, scrim, press, flip, unfold, wiggle, bob }

    Object.values(presets).forEach((preset) => {
      expect(preset).toEqual(expect.any(Object))
    })
    expect(seq(0)).toEqual(expect.objectContaining({ initial: { scale: 0 } }))
  })

  it('uses the springy curve for arrivals', () => {
    expect(land.transition).toEqual(expect.objectContaining({ ease: MotionEasings.SPRING }))
    expect(toastIn.transition).toEqual(expect.objectContaining({ ease: MotionEasings.SPRING }))
  })

  it('thumps the stamp down once, after the page has landed', () => {
    expect(stamp.initial).toEqual(expect.objectContaining({ opacity: 0 }))
    expect(stamp.animate).toEqual({ opacity: 1, scale: 1 })
    expect(stamp.transition).toEqual(expect.objectContaining({ ease: MotionEasings.POP }))
    expect(stamp.transition).not.toHaveProperty('repeat')
  })

  it('exits with the standard curve', () => {
    expect(sheetUp.exit).toHaveProperty('transition.ease', MotionEasings.STANDARD)
  })

  it('pops shapes in turn', () => {
    const secondDelay = (seq(1).transition as { delay: number }).delay
    const thirdDelay = (seq(2).transition as { delay: number }).delay

    expect(thirdDelay).toBeGreaterThan(secondDelay)
  })

  it('keeps UI durations between 120 and 600 ms', () => {
    const uiDurations = [
      MotionDurations.XS,
      MotionDurations.S,
      MotionDurations.M,
      MotionDurations.L,
    ]

    uiDurations.forEach((duration) => {
      expect(duration).toBeGreaterThanOrEqual(0.12)
      expect(duration).toBeLessThanOrEqual(0.6)
    })
    expect(MotionDurations.GIFT).toBe(1.2)
  })

  it('plays the wiggle and the bob once', () => {
    expect(wiggle.transition).not.toHaveProperty('repeat')
    expect(bob.transition).not.toHaveProperty('repeat')
  })
})
