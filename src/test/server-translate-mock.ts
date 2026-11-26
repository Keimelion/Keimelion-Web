import { createIntl } from 'react-intl'
import { enMessages } from '@/lib/i18n/messages/en'
import type { TranslateFn } from '@/lib/i18n/use-translate'

export function createEnglishServerTranslate(): TranslateFn {
  const intl = createIntl({ locale: 'en', defaultLocale: 'en', messages: enMessages })
  return (id, values) => intl.formatMessage({ id }, values)
}
