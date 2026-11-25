import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { Stepper } from './stepper'

function renderStepper(value: number, onValueChange = vi.fn()): ReturnType<typeof vi.fn> {
  renderWithIntl(
    <Stepper value={value} min={1} max={3} label="How many?" onValueChange={onValueChange} />,
  )
  return onValueChange
}

describe('Stepper', () => {
  it('groups the controls under its label and shows the value', () => {
    renderStepper(2)

    expect(screen.getByRole('group', { name: 'How many?' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('2')
  })

  it('increases and decreases by one', async () => {
    const user = userEvent.setup()
    const onValueChange = renderStepper(2)

    await user.click(screen.getByRole('button', { name: 'Increase' }))
    await user.click(screen.getByRole('button', { name: 'Decrease' }))

    expect(onValueChange).toHaveBeenNthCalledWith(1, 3)
    expect(onValueChange).toHaveBeenNthCalledWith(2, 1)
  })

  it('cannot go below the minimum or above the maximum', () => {
    renderStepper(1)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeEnabled()
  })

  it('disables increase at the maximum', () => {
    renderStepper(3)

    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })
})
