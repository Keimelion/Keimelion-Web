import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/test-utils'
import { mockDesktopViewport } from '@/test/viewport-mock'
import { DatePicker } from './date-picker'

const EVENT_DATE = new Date(2027, 5, 14)

interface EventDateFieldProps {
  initialValue: Date | null
  onValueChange: (value: Date | null) => void
}

function EventDateField({ initialValue, onValueChange }: EventDateFieldProps): React.JSX.Element {
  const [value, setValue] = useState(initialValue)
  return (
    <>
      <label htmlFor="event-date">Event date</label>
      <DatePicker
        id="event-date"
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue)
          onValueChange(nextValue)
        }}
        label="Event date"
        placeholder="No date, no countdown"
      />
    </>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('DatePicker', () => {
  it('shows the placeholder and no clear button without a date', () => {
    mockDesktopViewport(true)
    renderWithIntl(<EventDateField initialValue={null} onValueChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Event date' })).toHaveAccessibleDescription(
      'No date, no countdown',
    )
    expect(screen.queryByRole('button', { name: 'Clear the date' })).not.toBeInTheDocument()
  })

  it('picks a day in a popover on desktop and closes it', async () => {
    mockDesktopViewport(true)
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderWithIntl(<EventDateField initialValue={EVENT_DATE} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Event date' }))
    const calendar = screen.getByRole('dialog', { name: 'Event date' })
    await user.click(within(calendar).getByRole('button', { name: 'Sunday, June 20, 2027' }))

    expect(onValueChange).toHaveBeenCalledWith(new Date(2027, 5, 20))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Event date' })).toHaveAccessibleDescription(
      'Sunday, June 20, 2027',
    )
  })

  it('opens the calendar in a bottom sheet on mobile', async () => {
    mockDesktopViewport(false)
    const user = userEvent.setup()
    renderWithIntl(<EventDateField initialValue={null} onValueChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Event date' }))

    const sheet = screen.getByRole('dialog', { name: 'Event date' })
    expect(sheet).toHaveClass('rounded-t-sheet')
    expect(within(sheet).getByRole('grid')).toBeInTheDocument()
  })

  it('clears the date', async () => {
    mockDesktopViewport(true)
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderWithIntl(<EventDateField initialValue={EVENT_DATE} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Clear the date' }))

    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(screen.getByRole('button', { name: 'Event date' })).toHaveAccessibleDescription(
      'No date, no countdown',
    )
  })
})
