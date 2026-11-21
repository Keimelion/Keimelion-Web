'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { IntlProvider } from 'react-intl'
import { DEFAULT_LOCALE } from '@/lib/i18n/locale'
import type { Locale } from '@/lib/i18n/locale'
import { useLocaleStore } from '@/lib/i18n/locale-store'
import { MESSAGES } from '@/lib/i18n/messages'

interface I18nProviderProps {
  requestLocale: Locale
  children: React.ReactNode
}

function readStoreLocale(): Locale {
  return useLocaleStore.getState().locale
}

export function I18nProvider({ requestLocale, children }: I18nProviderProps): React.JSX.Element {
  const locale = useSyncExternalStore(
    useLocaleStore.subscribe,
    readStoreLocale,
    () => requestLocale,
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <IntlProvider locale={locale} messages={MESSAGES[locale]} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  )
}
