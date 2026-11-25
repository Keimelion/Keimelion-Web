import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

function LanguageForm(): React.JSX.Element {
  const form = useForm<{ language: string }>({ defaultValues: { language: '' } })
  useEffect(() => {
    form.setError('language', { message: 'Choose a language.' })
  }, [form])
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Used for emails.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}

describe('Select', () => {
  it('is a labelled combobox that carries the field contract', () => {
    render(<LanguageForm />)

    const trigger = screen.getByRole('combobox', { name: 'Language' })
    expect(trigger).toHaveTextContent('Choose a language')
    expect(trigger).toHaveAccessibleDescription('Used for emails. Choose a language.')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
  })
})
