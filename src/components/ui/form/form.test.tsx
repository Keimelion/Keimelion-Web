import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'

const HELP = 'We only use it to send your list.'
const ERROR = 'Enter a valid email address.'

interface EmailFormProps {
  hasHelp: boolean
}

function EmailForm({ hasHelp }: EmailFormProps): React.JSX.Element {
  const form = useForm<{ email: string }>({ defaultValues: { email: '' } })
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.setError('email', { message: ERROR })
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {hasHelp ? <FormDescription>{HELP}</FormDescription> : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Save</button>
      </form>
    </Form>
  )
}

describe('Form field', () => {
  it('describes the control with its help text', () => {
    render(<EmailForm hasHelp />)

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(HELP)
  })

  it('adds the error message to the description and marks the control invalid', async () => {
    const user = userEvent.setup()
    render(<EmailForm hasHelp />)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toHaveAccessibleDescription(`${HELP} ${ERROR}`)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('leaves the control undescribed without help or error', () => {
    render(<EmailForm hasHelp={false} />)

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-describedby')
  })
})
