import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { ConfirmDialog, ConfirmTones } from './confirm-dialog'

interface RenderOptions {
  isPending: boolean
}

function renderConfirm({ isPending }: RenderOptions): {
  onOpenChange: ReturnType<typeof vi.fn>
  onConfirm: ReturnType<typeof vi.fn>
} {
  const onOpenChange = vi.fn()
  const onConfirm = vi.fn()
  renderWithIntl(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="Delete the list?"
      description="This can't be undone."
      confirmLabel="Delete"
      tone={ConfirmTones.DANGER}
      isPending={isPending}
      onConfirm={onConfirm}
    />,
  )
  return { onOpenChange, onConfirm }
}

describe('ConfirmDialog', () => {
  it('asks for confirmation in an alert dialog', () => {
    renderConfirm({ isPending: false })

    expect(
      screen.getByRole('alertdialog', { name: 'Delete the list?' }),
    ).toHaveAccessibleDescription("This can't be undone.")
  })

  it('confirms without closing so the caller can wait for the request', async () => {
    const user = userEvent.setup()
    const { onConfirm, onOpenChange } = renderConfirm({ isPending: false })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('closes on cancel', async () => {
    const user = userEvent.setup()
    const { onOpenChange } = renderConfirm({ isPending: false })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows the pending state and cannot be dismissed while pending', async () => {
    const user = userEvent.setup()
    const { onOpenChange, onConfirm } = renderConfirm({ isPending: true })

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onOpenChange).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
