import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('is a labelled checkbox that toggles', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Checkbox id="price-drops" />
        <label htmlFor="price-drops">A price drops</label>
      </>,
    )
    const checkbox = screen.getByRole('checkbox', { name: 'A price drops' })

    expect(checkbox).not.toBeChecked()
    await user.click(screen.getByText('A price drops'))
    expect(checkbox).toBeChecked()
  })
})
