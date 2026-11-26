import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { TIE_DURATION_S } from './tie-timing'
import { TyingBow } from './tying-bow'

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

const ANIMATION_TIMEOUT_MS = 3000
const MAX_TIE_DURATION_S = 0.8

beforeEach(() => {
  reducedMotionPreference.isReduced = false
})

describe('TyingBow', () => {
  it('draws the tails, the loops and the knot of the bow', () => {
    const { container } = render(<TyingBow onDone={vi.fn()} />)

    expect(container.querySelectorAll('svg path')).toHaveLength(2)
    expect(container.querySelector('svg circle')).not.toBeNull()
  })

  it('ties the bow once and fires onDone', async () => {
    const onDone = vi.fn()
    render(<TyingBow onDone={onDone} />)

    await waitFor(
      () => {
        expect(onDone).toHaveBeenCalledTimes(1)
      },
      { timeout: ANIMATION_TIMEOUT_MS },
    )
  })

  it('shows the tied bow at once when motion is reduced', () => {
    reducedMotionPreference.isReduced = true
    const onDone = vi.fn()
    const { container } = render(<TyingBow onDone={onDone} />)

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(container.querySelector('svg circle')).not.toBeNull()
  })

  it('stays short enough to end a 1.2 s wrap', () => {
    expect(TIE_DURATION_S).toBeLessThanOrEqual(MAX_TIE_DURATION_S)
  })
})
