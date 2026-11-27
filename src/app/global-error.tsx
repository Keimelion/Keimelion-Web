'use client'

import { useEffect } from 'react'
import '@/app/globals.css'
import '@/styles/tokens.css'
import { I18nProvider } from '@/lib/i18n/i18n-provider'
import { DEFAULT_LOCALE } from '@/lib/i18n/locale'
import { useTranslate } from '@/lib/i18n/use-translate'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error('Root layout error:', error)
  }, [error])

  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-center font-sans text-ink">
        <I18nProvider requestLocale={DEFAULT_LOCALE}>
          <GlobalErrorContent onRetry={reset} />
        </I18nProvider>
      </body>
    </html>
  )
}

interface GlobalErrorContentProps {
  onRetry: () => void
}

function GlobalErrorContent({ onRetry }: GlobalErrorContentProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <>
      <h1 className="text-title">{t('error.title')}</h1>
      <p className="max-w-lg text-body text-muted-foreground">{t('error.description')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-pill border border-rule-strong bg-raised px-4 py-2"
      >
        {t('common.error_state.try_again')}
      </button>
    </>
  )
}
