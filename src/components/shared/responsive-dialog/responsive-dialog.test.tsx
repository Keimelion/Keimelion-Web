import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { mockDesktopViewport } from '@/test/viewport-mock'
import { ResponsiveDialog } from './responsive-dialog'

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderDialog(onOpenChange = vi.fn()): ReturnType<typeof vi.fn> {
  renderWithIntl(
    <ResponsiveDialog
      open
      onOpenChange={onOpenChange}
      title="Invite an editor"
      description="They get an email."
      footer={<button type="button">Send</button>}
    >
      <p>Body</p>
    </ResponsiveDialog>,
  )
  return onOpenChange
}

describe('ResponsiveDialog', () => {
  it('renders a bottom sheet with a grabber below the desktop breakpoint', () => {
    mockDesktopViewport(false)
    renderDialog()

    const dialog = screen.getByRole('dialog', { name: 'Invite an editor' })
    expect(dialog).toHaveAccessibleDescription('They get an email.')
    expect(dialog).toHaveClass('rounded-t-sheet')
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('renders a centred dialog with a close button from the desktop breakpoint', async () => {
    mockDesktopViewport(true)
    const user = userEvent.setup()
    const onOpenChange = renderDialog()

    expect(screen.getByRole('dialog', { name: 'Invite an editor' })).toHaveClass('rounded-sheet')
    expect(screen.getByText('Body')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
