'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChipGroup } from '@/components/shared/chip-group'
import type { ChipOption } from '@/components/shared/chip-group'
import { PasswordInput } from '@/components/shared/password-input'
import { TagInput } from '@/components/shared/tag-input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LOCALE_NATIVE_NAMES, LOCALES } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/locale'
import { useTranslate } from '@/lib/i18n/use-translate'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

interface ControlFormValues {
  password: string
  language: Locale | ''
  categories: string[]
}

const MAX_CATEGORIES = 5
const MAX_CATEGORY_LENGTH = 24

export function FormControlSection(): React.JSX.Element {
  const t = useTranslate()
  const form = useForm<ControlFormValues>({
    defaultValues: { password: '', language: '', categories: [t('dev.kit.chips.kitchen')] },
  })
  return (
    <KitSection title={t('dev.kit.form_controls.title')} kicker={t('dev.kit.form_controls.kicker')}>
      <Form {...form}>
        <form
          className="grid gap-5 md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.fields.password')}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormDescription>{t('dev.kit.form_controls.password_help')}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.form_controls.language')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                      <SelectValue placeholder={t('dev.kit.form_controls.language_placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCALES.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {LOCALE_NATIVE_NAMES[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dev.kit.form_controls.categories')}</FormLabel>
                <FormControl>
                  <TagInput
                    ref={field.ref}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    maxTags={MAX_CATEGORIES}
                    maxTagLength={MAX_CATEGORY_LENGTH}
                    placeholder={t('dev.kit.form_controls.categories_placeholder')}
                  />
                </FormControl>
                <FormDescription>{t('dev.kit.form_controls.categories_help')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <ChipGroupDemos />
    </KitSection>
  )
}

function ChipGroupDemos(): React.JSX.Element {
  const t = useTranslate()
  const [filter, setFilter] = useState('all')
  const [occasions, setOccasions] = useState<string[]>(['wedding'])
  const filters: readonly ChipOption[] = [
    { value: 'all', label: t('dev.kit.form_controls.all'), count: 18, icon: null },
    { value: 'available', label: t('dev.kit.chips.available'), count: 12, icon: null },
    { value: 'reserved', label: t('dev.kit.form_controls.reserved'), count: 6, icon: null },
  ]
  const occasionOptions: readonly ChipOption[] = [
    { value: 'wedding', label: t('dev.kit.occasions.wedding'), count: null, icon: null },
    { value: 'birth', label: t('dev.kit.occasions.birth'), count: null, icon: null },
    { value: 'birthday', label: t('dev.kit.occasions.birthday'), count: null, icon: null },
  ]
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <KitSpecimen label={t('dev.kit.form_controls.single')}>
        <ChipGroup
          selectionMode="single"
          label={t('dev.kit.form_controls.filter')}
          options={filters}
          value={filter}
          onValueChange={setFilter}
        />
      </KitSpecimen>
      <KitSpecimen label={t('dev.kit.form_controls.multiple')}>
        <ChipGroup
          selectionMode="multiple"
          label={t('dev.kit.form_controls.occasions')}
          options={occasionOptions}
          value={occasions}
          onValueChange={setOccasions}
        />
      </KitSpecimen>
    </div>
  )
}
