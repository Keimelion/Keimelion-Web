'use client'

import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import type { MessageId } from '@/lib/i18n/messages'

type RichChunkRenderer = (chunks: React.ReactNode[]) => React.ReactNode

export type RichTranslateValues = Record<string, string | number | RichChunkRenderer>

export type RichTranslateFn = (id: MessageId, values: RichTranslateValues) => React.ReactNode

export function useTranslateRich(): RichTranslateFn {
  const intl = useIntl()
  return useCallback<RichTranslateFn>((id, values) => intl.formatMessage({ id }, values), [intl])
}
