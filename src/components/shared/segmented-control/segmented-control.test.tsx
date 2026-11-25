import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { EditIcon, EyeIcon } from '@/components/icons'
import { SegmentedControl } from './segmented-control'

type View = 'edit' | 'guest'

const OPTIONS = [
  { value: 'edit', label: 'Edit', icon: EditIcon },
  { value: 'guest', label: 'Guest view', icon: EyeIcon },
] as const

function ViewSwitch(): React.JSX.Element {
  const [view, setView] = useState<View>('edit')
  return (
    <SegmentedControl label="List view" options={OPTIONS} value={view} onValueChange={setView} />
  )
}

describe('SegmentedControl', () => {
  it('exposes the options as a radio group with the current one checked', () => {
    render(<ViewSwitch />)

    expect(screen.getByRole('radiogroup', { name: 'List view' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Edit' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Guest view' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('selects an option on click', async () => {
    const user = userEvent.setup()
    render(<ViewSwitch />)

    await user.click(screen.getByRole('radio', { name: 'Guest view' }))

    expect(screen.getByRole('radio', { name: 'Guest view' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('moves the selection and the focus with the arrow keys, wrapping around', async () => {
    const user = userEvent.setup()
    render(<ViewSwitch />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Edit' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Guest view' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Guest view' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: 'Edit' })).toHaveAttribute('aria-checked', 'true')
  })
})
