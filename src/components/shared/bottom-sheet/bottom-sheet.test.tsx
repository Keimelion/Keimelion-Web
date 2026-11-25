import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BottomSheet } from './bottom-sheet'

describe('BottomSheet', () => {
  it('renders nothing while closed', () => {
    render(
      <BottomSheet open={false} onOpenChange={vi.fn()} title="Reserve" description={null}>
        <p>Body</p>
      </BottomSheet>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens as a dialog named by its title and described by its description', () => {
    render(
      <BottomSheet
        open
        onOpenChange={vi.fn()}
        title="Reserve"
        description="So nobody else buys it."
      >
        <p>Body</p>
      </BottomSheet>,
    )

    const sheet = screen.getByRole('dialog', { name: 'Reserve' })
    expect(sheet).toHaveAccessibleDescription('So nobody else buys it.')
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('asks to close on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <BottomSheet open onOpenChange={onOpenChange} title="Reserve" description={null}>
        <p>Body</p>
      </BottomSheet>,
    )

    await user.keyboard('{Escape}')

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
