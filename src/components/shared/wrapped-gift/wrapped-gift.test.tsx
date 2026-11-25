import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { WrappedGift, WrappedGiftModes } from './wrapped-gift'
import type { WrappedGiftMode } from './wrapped-gift'

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

const ANIMATION_TIMEOUT_MS = 3000

function renderGift(mode: WrappedGiftMode, onDone: () => void): ReturnType<typeof render> {
  return render(
    <WrappedGift paper={OccasionPapers.SKY} mode={mode} onDone={onDone}>
      <span>Tea set</span>
    </WrappedGift>,
  )
}

beforeEach(() => {
  reducedMotionPreference.isReduced = false
})

describe('WrappedGift', () => {
  it('wraps the gift in dotted occasion paper, cream ribbons and a bow', () => {
    const { container } = renderGift(WrappedGiftModes.STATIC, vi.fn())

    expect(container.querySelector('pattern rect')).toHaveClass('fill-gift-sky')
    expect(container.querySelectorAll('.fill-gift-ribbon')).toHaveLength(4)
    expect(container.querySelector('svg path')).not.toBeNull()
  })

  it('never fires onDone in the static mode', () => {
    const onDone = vi.fn()
    renderGift(WrappedGiftModes.STATIC, onDone)

    expect(onDone).not.toHaveBeenCalled()
  })

  it.each([WrappedGiftModes.WRAP, WrappedGiftModes.UNWRAP])(
    'plays the %s animation once and fires onDone',
    async (mode) => {
      const onDone = vi.fn()
      renderGift(mode, onDone)

      await waitFor(
        () => {
          expect(onDone).toHaveBeenCalledTimes(1)
        },
        { timeout: ANIMATION_TIMEOUT_MS },
      )
    },
  )

  it('jumps to the wrapped end state when motion is reduced', () => {
    reducedMotionPreference.isReduced = true
    const onDone = vi.fn()
    const { container } = renderGift(WrappedGiftModes.WRAP, onDone)

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('jumps to the unwrapped end state when motion is reduced', () => {
    reducedMotionPreference.isReduced = true
    const onDone = vi.fn()
    const { container } = renderGift(WrappedGiftModes.UNWRAP, onDone)

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(container.querySelector('svg')).toBeNull()
    expect(screen.getByText('Tea set')).toBeInTheDocument()
  })
})
