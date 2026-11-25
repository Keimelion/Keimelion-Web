import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { SearchIcon } from '@/components/icons'
import { IconInput } from '@/components/shared/icon-input'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
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

  it.each([
    ['switch', <Switch key="switch" aria-label="Field" />],
    [
      'radiogroup',
      <RadioGroup key="radios" aria-label="Field">
        <RadioGroupItem value="a" aria-label="A" />
      </RadioGroup>,
    ],
    ['textbox', <IconInput key="search" icon={SearchIcon} aria-label="Field" />],
  ])('forwards the field contract to a %s', (role, control) => {
    function ControlForm(): React.JSX.Element {
      const form = useForm<{ field: string }>({ defaultValues: { field: '' } })
      useEffect(() => {
        form.setError('field', { message: ERROR })
      }, [form])
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="field"
            render={() => (
              <FormItem>
                <FormControl>{control}</FormControl>
                <FormDescription>{HELP}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      )
    }
    render(<ControlForm />)

    const element = screen.getByRole(role, { name: 'Field' })
    expect(element).toHaveAccessibleDescription(`${HELP} ${ERROR}`)
    expect(element).toHaveAttribute('aria-invalid', 'true')
    expect(element.id).not.toBe('')
  })
})
