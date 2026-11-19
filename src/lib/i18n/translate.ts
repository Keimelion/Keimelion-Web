import { createIntl } from 'react-intl'
import { DEFAULT_LOCALE } from '@/lib/i18n/locale'
import { useLocaleStore } from '@/lib/i18n/locale-store'
import { MESSAGES, type MessageId } from '@/lib/i18n/messages'

export function translate(id: MessageId, values?: Record<string, string | number>): string {
  const locale = useLocaleStore.getState().locale
  const intl = createIntl({ locale, defaultLocale: DEFAULT_LOCALE, messages: MESSAGES[locale] })
  return intl.formatMessage({ id }, values)
}
