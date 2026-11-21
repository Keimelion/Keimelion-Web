import type { Locale } from '@/lib/i18n/locale'
import { enMessages } from './en'
import { frMessages } from './fr'

export type { MessageId } from './en'

export const MESSAGES: Record<Locale, Record<string, string>> = {
  en: enMessages,
  fr: frMessages,
}
