import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EditIcon, TrashIcon } from '@/components/icons'
import { renderWithIntl } from '@/test/test-utils'
import { MoreMenu, MoreMenuTones } from './more-menu'

describe('MoreMenu', () => {
  it('opens from a named trigger and runs the chosen item', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    const onDelete = vi.fn()
    const onFeedback = vi.fn()
    renderWithIntl(
      <MoreMenu
        label="More actions"
        trigger={null}
        items={[
          {
            id: 'rename',
            label: 'Rename',
            icon: EditIcon,
            tone: MoreMenuTones.DEFAULT,
            onSelect: onRename,
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: TrashIcon,
            tone: MoreMenuTones.DANGER,
            onSelect: onDelete,
          },
        ]}
        footerItem={{
          id: 'feedback',
          label: 'Send feedback',
          icon: null,
          tone: MoreMenuTones.HIGHLIGHT,
          onSelect: onFeedback,
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'More actions' }))
    const items = screen.getAllByRole('menuitem')
    expect(items.map((item) => item.textContent)).toEqual(['Rename', 'Delete', 'Send feedback'])
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-danger')
    expect(screen.getByRole('separator')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: 'Send feedback' }))

    expect(onFeedback).toHaveBeenCalledTimes(1)
    expect(onRename).not.toHaveBeenCalled()
  })

  it('opens from a custom trigger instead of the dots', async () => {
    const user = userEvent.setup()
    renderWithIntl(
      <MoreMenu
        label="More actions"
        trigger={<button type="button">Your account</button>}
        items={[
          {
            id: 'profile',
            label: 'Profile',
            icon: null,
            tone: MoreMenuTones.DEFAULT,
            onSelect: vi.fn(),
          },
        ]}
        footerItem={null}
      />,
    )

    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Your account' }))

    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
  })
})
