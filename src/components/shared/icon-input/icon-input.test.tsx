import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SearchIcon } from '@/components/icons'
import { IconInput } from './icon-input'

describe('IconInput', () => {
  it('is a labelled input with a decorative leading icon', async () => {
    const user = userEvent.setup()
    render(
      <label>
        Search
        <IconInput type="search" icon={SearchIcon} />
      </label>,
    )
    const input = screen.getByRole('searchbox', { name: 'Search' })

    await user.type(input, 'teapot')

    expect(input).toHaveValue('teapot')
    expect(input).toHaveClass('pl-11', 'min-w-0')
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
