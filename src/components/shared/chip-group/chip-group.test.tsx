import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import type { ChipOption } from './chip-group'
import { ChipGroup } from './chip-group'

const OPTIONS: readonly ChipOption[] = [
  { value: 'all', label: 'All', count: 18, icon: null },
  { value: 'available', label: 'Available', count: 12, icon: null },
  { value: 'gifted', label: 'Given', count: null, icon: null },
]

function SingleFilter(): React.JSX.Element {
  const [value, setValue] = useState('all')
  return (
    <ChipGroup
      selectionMode="single"
      label="Filter"
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
    />
  )
}

function MultipleFilter(): React.JSX.Element {
  const [value, setValue] = useState<string[]>(['available'])
  return (
    <ChipGroup
      selectionMode="multiple"
      label="Categories"
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
    />
  )
}

describe('ChipGroup', () => {
  it('is a radio group in single mode, with counts in the names', () => {
    render(<SingleFilter />)

    expect(screen.getByRole('radiogroup', { name: 'Filter' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'All 18' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Available 12' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves the selection with the arrow keys in single mode', async () => {
    const user = userEvent.setup()
    render(<SingleFilter />)

    await user.tab()
    await user.keyboard('{ArrowRight}')

    const available = screen.getByRole('radio', { name: 'Available 12' })
    expect(available).toHaveFocus()
    expect(available).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Given' })).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles several chips in multiple mode, arrows only moving the focus', async () => {
    const user = userEvent.setup()
    render(<MultipleFilter />)

    expect(screen.getByRole('group', { name: 'Categories' })).toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Available 12' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Given' })).toHaveAttribute('aria-pressed', 'false')
    await user.keyboard(' ')

    expect(screen.getByRole('button', { name: 'Given' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Available 12' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
