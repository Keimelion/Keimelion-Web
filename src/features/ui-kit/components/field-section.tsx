'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SearchIcon } from '@/components/icons'
import { IconInput } from '@/components/shared/icon-input'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslate } from '@/lib/i18n/use-translate'
import { KitSection } from './kit-section'

interface KitFieldValues {
  email: string
  password: string
  title: string
  disabled: string
  note: string
  search: string
}

export function FieldSection(): React.JSX.Element {
  const t = useTranslate()
  const form = useForm<KitFieldValues>({
    defaultValues: {
      email: '',
      password: t('dev.kit.fields.short_value'),
      title: t('dev.kit.fields.long_value'),
      disabled: t('dev.kit.fields.disabled_value'),
      note: '',
      search: '',
    },
  })
  useShowcasedError(form, t('dev.kit.fields.password_error'))
  return (
    <KitSection title={t('dev.kit.fields.title')} kicker={t('dev.kit.fields.kicker')}>
      <Form {...form}>
        <form
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('dev.kit.fields.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('dev.kit.fields.email_placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t('dev.kit.fields.email_help')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.fields.password')}</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="max-w-60">
                <FormLabel>{t('dev.kit.fields.list_title')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{t('dev.kit.fields.overflow_help')}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.fields.disabled')}</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.fields.search')}</FormLabel>
                <FormControl>
                  <IconInput
                    type="search"
                    icon={SearchIcon}
                    placeholder={t('dev.kit.fields.search_placeholder')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('dev.kit.fields.note')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('dev.kit.fields.note_placeholder')} {...field} />
                </FormControl>
                <FormDescription>{t('dev.kit.fields.note_help')}</FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </KitSection>
  )
}

function useShowcasedError(form: UseFormReturn<KitFieldValues>, message: string): void {
  const { setError } = form
  useEffect(() => {
    setError('password', { type: 'minLength', message })
  }, [setError, message])
}
