import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { ErrorState } from './error-state'

describe('ErrorState', () => {
  it('names itself after its title and explains what happened', () => {
    renderWithIntl(
      <ErrorState
        title="Your lists are hiding"
        description="We couldn't load them."
        isRetrying={false}
        onRetry={vi.fn()}
      />,
    )

    const region = screen.getByRole('region', { name: 'Your lists are hiding' })
    expect(region).toHaveTextContent("We couldn't load them.")
  })

  it('retries when the user asks to try again', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderWithIntl(
      <ErrorState title="Oops" description="Failed" isRetrying={false} onRetry={onRetry} />,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows the retry as busy and ignores clicks while it runs', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderWithIntl(<ErrorState title="Oops" description="Failed" isRetrying onRetry={onRetry} />)

    const button = screen.getByRole('button', { name: 'Try again' })
    expect(button).toHaveAttribute('aria-busy', 'true')
    await user.click(button)

    expect(onRetry).not.toHaveBeenCalled()
  })

  it('links to the feedback form on the bug type', () => {
    renderWithIntl(
      <ErrorState title="Oops" description="Failed" isRetrying={false} onRetry={vi.fn()} />,
    )

    expect(screen.getByRole('link', { name: 'Tell us what happened' })).toHaveAttribute(
      'href',
      '/feedback?type=bug',
    )
  })
})
