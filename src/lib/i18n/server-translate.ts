import { cookies, headers } from 'next/headers'
import { createIntl } from 'react-intl/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/locale'
import { MESSAGES } from '@/lib/i18n/messages'
import { resolveRequestLocale } from '@/lib/i18n/resolve-locale'
import type { TranslateFn } from '@/lib/i18n/use-translate'

const ACCEPT_LANGUAGE_HEADER = 'accept-language'

export async function getRequestLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  return resolveRequestLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
    headerStore.get(ACCEPT_LANGUAGE_HEADER),
  )
}

export async function getServerTranslate(): Promise<TranslateFn> {
  const locale = await getRequestLocale()
  const intl = createIntl({ locale, defaultLocale: DEFAULT_LOCALE, messages: MESSAGES[locale] })
  return (id, values) => intl.formatMessage({ id }, values)
}
