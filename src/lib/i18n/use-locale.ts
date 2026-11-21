'use client'

import { useIntl } from 'react-intl'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/locale'

export function useLocale(): Locale {
  const { locale } = useIntl()
  return LOCALES.find((candidate) => candidate === locale) ?? DEFAULT_LOCALE
}
