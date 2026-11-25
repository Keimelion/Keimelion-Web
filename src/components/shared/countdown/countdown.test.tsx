import { act, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reducedMotionPreference } from '@/test/reduced-motion-mock'
import { renderWithIntl } from '@/test/test-utils'
import { Countdown } from './countdown'

vi.mock('motion/react', async (importOriginal) => {
  const { mockMotionWithReducedMotionPreference } = await import('@/test/reduced-motion-mock')
  return mockMotionWithReducedMotionPreference(importOriginal)
})

const EVENT_DATE = new Date(2027, 5, 14)
const KICKER = "we're getting married!"
const TITLE = "Léa & Axel's wedding"

function daysBefore(days: number): Date {
  return new Date(2027, 5, 14 - days)
}

function renderCountdown(date: Date | null, today: Date | null): ReturnType<typeof renderWithIntl> {
  return renderWithIntl(
    <Countdown date={date} today={today} occasionKicker={KICKER}>
      <h3>{TITLE}</h3>
    </Countdown>,
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  reducedMotionPreference.isReduced = false
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Countdown', () => {
  it('shows digit tiles under the occasion kicker more than 7 days ahead', () => {
    renderCountdown(EVENT_DATE, daysBefore(209))

    expect(screen.getByText(KICKER)).toBeInTheDocument()
    expect(screen.getByText('209 days to go')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('switches the kicker to "almost there!" 7 days or less ahead', () => {
    renderCountdown(EVENT_DATE, daysBefore(3))

    expect(screen.getByText('almost there!')).toBeInTheDocument()
    expect(screen.getByText('3 days to go')).toBeInTheDocument()
    expect(screen.queryByText(KICKER)).not.toBeInTheDocument()
  })

  it('shows the word and the bow the day before', () => {
    renderCountdown(EVENT_DATE, daysBefore(1))

    expect(screen.getByText('see you tomorrow!')).toBeInTheDocument()
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('celebrates with confetti once per visit on the day itself', () => {
    const { unmount } = renderCountdown(EVENT_DATE, EVENT_DATE)

    expect(screen.getByText("it's the big day!")).toBeInTheDocument()
    expect(screen.getByText('Today, June 14')).toBeInTheDocument()
    expect(screen.getByTestId('confetti')).toBeInTheDocument()

    unmount()
    renderCountdown(EVENT_DATE, EVENT_DATE)

    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument()
  })

  it('skips the confetti when motion is reduced', () => {
    reducedMotionPreference.isReduced = true
    renderCountdown(EVENT_DATE, EVENT_DATE)

    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument()
  })

  it('thanks everyone after the day', () => {
    renderCountdown(EVENT_DATE, daysBefore(-2))

    expect(screen.getByText('thank you all!')).toBeInTheDocument()
    expect(
      screen.getByText('The big day was June 14. You can still offer a gift: the list stays open.'),
    ).toBeInTheDocument()
  })

  it('renders no countdown without a date', () => {
    renderCountdown(null, daysBefore(3))

    expect(screen.getByText(KICKER)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TITLE })).toBeInTheDocument()
    expect(screen.queryByText(/days to go/)).not.toBeInTheDocument()
  })

  it('flips the last tile only once a day', () => {
    const { container, unmount } = renderCountdown(EVENT_DATE, daysBefore(209))
    expect(container.querySelector('[style*="rotateX"], [style*="perspective"]')).not.toBeNull()

    unmount()
    const second = renderCountdown(EVENT_DATE, daysBefore(209))

    expect(second.container.querySelector('[style*="rotateX"], [style*="perspective"]')).toBeNull()
  })

  it('reads the visitor clock when no day is injected', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(daysBefore(3))
    act(() => {
      renderCountdown(EVENT_DATE, null)
    })

    expect(screen.getByText('3 days to go')).toBeInTheDocument()
  })
})
