import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { renderWithIntl } from '@/test/test-utils'
import { Stepper } from './stepper'

interface QuantityProps {
  initialValue: number
  isDisabled: boolean
  onValueChange: (value: number) => void
}

function Quantity({ initialValue, isDisabled, onValueChange }: QuantityProps): React.JSX.Element {
  const [value, setValue] = useState(initialValue)
  return (
    <Stepper
      value={value}
      min={1}
      max={3}
      label="How many?"
      disabled={isDisabled}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        onValueChange(nextValue)
      }}
    />
  )
}

function renderQuantity(initialValue: number, isDisabled = false): ReturnType<typeof vi.fn> {
  const onValueChange = vi.fn()
  renderWithIntl(
    <Quantity initialValue={initialValue} isDisabled={isDisabled} onValueChange={onValueChange} />,
  )
  return onValueChange
}

describe('Stepper', () => {
  it('is a named spin button showing its value and bounds', () => {
    renderQuantity(2)

    const spinButton = screen.getByRole('spinbutton', { name: 'How many?' })
    expect(spinButton).toHaveValue(2)
    expect(spinButton).toHaveAttribute('min', '1')
    expect(spinButton).toHaveAttribute('max', '3')
  })

  it('increases and decreases by one', async () => {
    const user = userEvent.setup()
    const onValueChange = renderQuantity(2)

    await user.click(screen.getByRole('button', { name: 'Increase' }))
    await user.click(screen.getByRole('button', { name: 'Decrease' }))

    expect(onValueChange).toHaveBeenNthCalledWith(1, 3)
    expect(onValueChange).toHaveBeenNthCalledWith(2, 2)
  })

  it('disables each button at its bound and clamps typed values', async () => {
    const user = userEvent.setup()
    const onValueChange = renderQuantity(1)

    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
    await user.clear(screen.getByRole('spinbutton'))
    await user.type(screen.getByRole('spinbutton'), '9')

    expect(onValueChange).toHaveBeenLastCalledWith(3)
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })

  it('disables the field and both buttons', () => {
    renderQuantity(2, true)

    expect(screen.getByRole('spinbutton')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
  })

  it('works as a form control with its help text and error', async () => {
    const user = userEvent.setup()
    function QuantityForm(): React.JSX.Element {
      const form = useForm<{ quantity: number }>({ defaultValues: { quantity: 1 } })
      return (
        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              form.setError('quantity', { message: 'Only 1 left.' })
            }}
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many?</FormLabel>
                  <FormControl>
                    <Stepper
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      min={1}
                      max={3}
                      label="How many?"
                    />
                  </FormControl>
                  <FormDescription>Up to 3.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit">Reserve</button>
          </form>
        </Form>
      )
    }
    renderWithIntl(<QuantityForm />)

    await user.click(screen.getByRole('button', { name: 'Reserve' }))

    const spinButton = screen.getByRole('spinbutton', { name: 'How many?' })
    expect(spinButton).toHaveAccessibleDescription('Up to 3. Only 1 left.')
    expect(spinButton).toHaveAttribute('aria-invalid', 'true')
    expect(spinButton).toHaveAttribute('name', 'quantity')
  })
})
