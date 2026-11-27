import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { TagInput } from './tag-input'

interface CategoriesProps {
  initialValue: string[]
  onValueChange: (value: string[]) => void
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
}

function Categories({
  initialValue,
  onValueChange,
  onKeyDown,
}: CategoriesProps): React.JSX.Element {
  const [value, setValue] = useState(initialValue)
  return (
    <TagInput
      aria-label="Categories"
      onKeyDown={onKeyDown}
      value={value}
      maxTags={3}
      maxTagLength={12}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        onValueChange(nextValue)
      }}
    />
  )
}

function renderCategories(
  initialValue: string[] = [],
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = vi.fn(),
): ReturnType<typeof vi.fn> {
  const onValueChange = vi.fn()
  renderWithIntl(
    <Categories initialValue={initialValue} onValueChange={onValueChange} onKeyDown={onKeyDown} />,
  )
  return onValueChange
}

describe('TagInput', () => {
  it('adds a tag on Enter and on comma, trimmed', async () => {
    const user = userEvent.setup()
    const onValueChange = renderCategories()

    await user.type(screen.getByRole('textbox', { name: 'Categories' }), '  kitchen {Enter}garden,')

    expect(onValueChange).toHaveBeenLastCalledWith(['kitchen', 'garden'])
    expect(screen.getByText('kitchen')).toBeInTheDocument()
  })

  it('ignores duplicates whatever their case', async () => {
    const user = userEvent.setup()
    const onValueChange = renderCategories(['Kitchen'])

    await user.type(screen.getByRole('textbox'), 'kitchen{Enter}')

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('removes a tag with its button and the last one with Backspace on an empty field', async () => {
    const user = userEvent.setup()
    const onValueChange = renderCategories(['kitchen', 'garden', 'books'])

    await user.click(screen.getByRole('button', { name: 'Remove garden' }))
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{Backspace}')

    expect(onValueChange).toHaveBeenNthCalledWith(1, ['kitchen', 'books'])
    expect(onValueChange).toHaveBeenNthCalledWith(2, ['kitchen'])
  })

  it('stops at the maximum count and caps the tag length', () => {
    renderCategories(['kitchen', 'garden', 'books'])

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
    expect(input).toBeEnabled()
    expect(input).toHaveAttribute('maxlength', '12')
  })

  it('keeps focus on the field when the last allowed tag is added, so Backspace still works', async () => {
    const user = userEvent.setup()
    const onValueChange = renderCategories(['kitchen', 'garden'])

    await user.type(screen.getByRole('textbox'), 'books{Enter}')
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.keyboard('{Backspace}')

    expect(onValueChange).toHaveBeenLastCalledWith(['kitchen', 'garden'])
  })

  it('does not add a tag when Enter confirms an IME composition', () => {
    const onValueChange = renderCategories()
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'にほん' } })
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })

    expect(onValueChange).not.toHaveBeenCalled()
    expect(input).toHaveValue('にほん')
  })

  it('runs the onKeyDown of the consumer and still adds tags', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    const onValueChange = renderCategories([], onKeyDown)

    await user.type(screen.getByRole('textbox'), 'kitchen{Enter}')

    expect(onKeyDown).toHaveBeenCalled()
    expect(onValueChange).toHaveBeenLastCalledWith(['kitchen'])
  })
})
