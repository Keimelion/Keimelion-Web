'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LOCALES, LOCALE_NATIVE_NAMES } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/locale'
import { useLocaleStore } from '@/lib/i18n/locale-store'
import { useLocale } from '@/lib/i18n/use-locale'
import { useTranslate } from '@/lib/i18n/use-translate'

const LOCALE_FLAG: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
}

export function LocalePicker(): React.JSX.Element {
  const locale = useLocale()
  const setLocale = useLocaleStore((state) => state.setLocale)
  const t = useTranslate()
  const router = useRouter()

  const selectLocale = (nextLocale: Locale): void => {
    setLocale(nextLocale)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="sr-only">{t('common.locale_picker.select_language')}</span>
          <span aria-hidden="true">{LOCALE_FLAG[locale]}</span> {LOCALE_NATIVE_NAMES[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.filter((localeOption) => localeOption !== locale).map((localeOption) => (
          <DropdownMenuItem
            key={localeOption}
            onClick={() => {
              selectLocale(localeOption)
            }}
          >
            <span aria-hidden="true">{LOCALE_FLAG[localeOption]}</span>{' '}
            {LOCALE_NATIVE_NAMES[localeOption]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
