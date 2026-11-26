import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { Confetti } from './confetti'

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

const CONFETTI_TIMEOUT_MS = 5000

beforeEach(() => {
  reducedMotionPreference.isReduced = false
})

describe('Confetti', () => {
  it('drops decorative pieces hidden from assistive technologies', () => {
    render(<Confetti onDone={vi.fn()} />)

    const confetti = screen.getByTestId('confetti')
    expect(confetti).toHaveAttribute('aria-hidden', 'true')
    expect(confetti.children.length).toBeGreaterThan(0)
  })

  it('fires onDone once the last piece has fallen', async () => {
    const onDone = vi.fn()
    render(<Confetti onDone={onDone} />)

    await waitFor(
      () => {
        expect(onDone).toHaveBeenCalledTimes(1)
      },
      { timeout: CONFETTI_TIMEOUT_MS },
    )
  })

  it('is skipped when motion is reduced', () => {
    reducedMotionPreference.isReduced = true
    const onDone = vi.fn()
    render(<Confetti onDone={onDone} />)

    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument()
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
