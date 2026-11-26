import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { renderWithIntl } from '@/test/test-utils'
import { mockDesktopViewport } from '@/test/viewport-mock'
import { AuthJourney } from './auth-journey'

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

beforeEach(() => {
  reducedMotionPreference.isReduced = false
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AuthJourney', () => {
  it('stays still below the desktop breakpoint, where it is hidden', () => {
    mockDesktopViewport(false)
    const { container } = renderWithIntl(<AuthJourney />)

    expect(container.querySelector('[data-journey-phase]')).toHaveAttribute(
      'data-journey-phase',
      'idle',
    )
  })

  it('travels the four stops on desktop', () => {
    mockDesktopViewport(true)
    const { container, getByText } = renderWithIntl(<AuthJourney />)

    expect(container.querySelector('[data-journey-phase]')).toHaveAttribute(
      'data-journey-phase',
      'playing',
    )
    expect(container.querySelectorAll('[data-journey-stop]')).toHaveLength(4)
    expect(getByText('From an idea to a wrapped gift.')).toBeInTheDocument()
  })

  it('shows the end state, every stop lit and the gift wrapped, under reduced motion', async () => {
    reducedMotionPreference.isReduced = true
    mockDesktopViewport(true)
    const { container } = renderWithIntl(<AuthJourney />)

    await waitFor(() => {
      expect(container.querySelector('[data-journey-phase]')).toHaveAttribute(
        'data-journey-phase',
        'done',
      )
    })
    expect(container.querySelector('[data-mode="static"]')).not.toBeNull()
  })
})
