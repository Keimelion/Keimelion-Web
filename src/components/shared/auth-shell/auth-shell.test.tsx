import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { AuthBackdrops, AuthShell } from '.'

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

describe('AuthShell', () => {
  it('shows the kicker and title, the form in the main landmark and a back link', () => {
    renderWithIntl(
      <AuthShell
        backdrop={AuthBackdrops.LILAC}
        art={<span data-testid="hero-art" />}
        desktopPanel={null}
        kicker="welcome back!"
        title="Log in"
        backHref="/"
      >
        <button type="button">Submit</button>
      </AuthShell>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Log in' })).toBeInTheDocument()
    expect(screen.getByText('welcome back!')).toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).getByRole('button', { name: 'Submit' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /home/ })).toHaveAttribute('href', '/')
    expect(screen.getByTestId('hero-art').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('paints the desktop panel with its own backdrop and art, and omits the back link', () => {
    const { container } = renderWithIntl(
      <AuthShell
        backdrop={AuthBackdrops.MUSTARD}
        art={<span data-testid="hero-art" />}
        desktopPanel={{ backdrop: AuthBackdrops.SKY, art: <span data-testid="journey" /> }}
        kicker="let's start!"
        title="Create your account"
        backHref={null}
      >
        <p>Form</p>
      </AuthShell>,
    )

    expect(container.querySelector('[data-backdrop="mustard"]')).toHaveClass('lg:hidden')
    expect(container.querySelector('[data-backdrop="sky"]')).toHaveClass('hidden', 'lg:block')
    expect(screen.getByTestId('journey')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Back' })).not.toBeInTheDocument()
  })

  it('draws the gingham backdrop as a pattern', () => {
    const { container } = renderWithIntl(
      <AuthShell
        backdrop={AuthBackdrops.GINGHAM}
        art={null}
        desktopPanel={null}
        kicker="it happens"
        title="Forgot your password?"
        backHref="/auth/login"
      >
        <p>Form</p>
      </AuthShell>,
    )

    expect(container.querySelector('[data-backdrop="gingham"] pattern')).not.toBeNull()
  })
})
