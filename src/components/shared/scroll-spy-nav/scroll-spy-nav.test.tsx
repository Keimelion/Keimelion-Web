import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollSpyNav } from './scroll-spy-nav'

type ObserverCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void

const observerCallbacks: ObserverCallback[] = []
const scrollIntoView = vi.fn()

const SECTIONS = [
  { id: 'account', label: 'Account' },
  { id: 'appearance', label: 'Appearance' },
]

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        observerCallbacks.push(callback)
      }
      observe = vi.fn()
      disconnect = vi.fn()
    },
  )
  Element.prototype.scrollIntoView = scrollIntoView
})

afterEach(() => {
  vi.unstubAllGlobals()
  observerCallbacks.length = 0
  scrollIntoView.mockClear()
})

function renderNav(): void {
  render(
    <>
      <ScrollSpyNav
        label="Profile"
        sections={SECTIONS}
        trailing={<a href="#feedback">Send feedback</a>}
      />
      <section id="account">Account section</section>
      <section id="appearance">Appearance section</section>
    </>,
  )
}

describe('ScrollSpyNav', () => {
  it('marks the first section as current and keeps the trailing slot', () => {
    renderNav()

    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(screen.getByRole('link', { name: 'Send feedback' })).toBeInTheDocument()
  })

  it('follows the section in view', () => {
    renderNav()

    act(() => {
      observerCallbacks.at(-1)?.([
        { isIntersecting: true, target: document.getElementById('appearance') as Element },
      ])
    })

    expect(screen.getByRole('link', { name: 'Appearance' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(screen.getByRole('link', { name: 'Account' })).not.toHaveAttribute('aria-current')
  })

  it('scrolls to a section on click', async () => {
    const user = userEvent.setup()
    renderNav()

    await user.click(screen.getByRole('link', { name: 'Appearance' }))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(screen.getByRole('link', { name: 'Appearance' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(window.location.hash).toBe('#appearance')
  })
})
