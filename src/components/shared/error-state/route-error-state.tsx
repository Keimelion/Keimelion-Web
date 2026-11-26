'use client'

import { useEffect } from 'react'
import { useTranslate } from '@/lib/i18n/use-translate'
import { ErrorState } from './error-state'

interface RouteErrorStateProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function RouteErrorState({ error, reset }: RouteErrorStateProps): React.JSX.Element {
  const t = useTranslate()

  useEffect(() => {
    console.error('Route segment error:', error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10">
      <ErrorState
        title={t('error.title')}
        description={t('error.description')}
        isRetrying={false}
        onRetry={reset}
      />
    </div>
  )
}
