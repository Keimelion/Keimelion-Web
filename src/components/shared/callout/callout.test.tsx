import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LockIcon } from '@/components/icons'
import { renderWithIntl } from '@/test/test-utils'
import { Callout, CalloutTones } from './callout'

describe('Callout', () => {
  it('labels itself with its title and shows its body and action', () => {
    renderWithIntl(
      <Callout
        tone={CalloutTones.WARNING}
        title="This list is private"
        kicker={null}
        icon={LockIcon}
        action={<button type="button">Make it public</button>}
        onDismiss={null}
      >
        Only the list team can see it.
      </Callout>,
    )

    const callout = screen.getByRole('complementary', { name: 'This list is private' })
    expect(callout).toHaveTextContent('Only the list team can see it.')
    expect(screen.getByRole('button', { name: 'Make it public' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
  })

  it('shows the handwritten kicker on the brand tone and can be dismissed', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    renderWithIntl(
      <Callout
        tone={CalloutTones.BRAND}
        title="In short"
        kicker="the gist"
        icon={null}
        action={null}
        onDismiss={onDismiss}
      >
        Body
      </Callout>,
    )

    expect(screen.getByText('the gist')).toHaveClass('font-hand')
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
