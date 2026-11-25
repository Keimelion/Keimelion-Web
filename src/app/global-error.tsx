'use client'

import { useEffect } from 'react'
import '@/app/globals.css'
import '@/styles/tokens.css'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error('Root layout error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-center font-sans text-ink">
        <h1 className="text-title">Something went wrong</h1>
        <p className="max-w-lg text-body text-muted-foreground">
          A critical error prevented the application from loading. Please refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-pill border border-rule-strong bg-raised px-4 py-2"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
