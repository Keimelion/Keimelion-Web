'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { I18nProvider } from '@/lib/i18n/i18n-provider'
import type { Locale } from '@/lib/i18n/locale'
import { queryClient } from '@/lib/query-client'

interface ProvidersProps {
  requestLocale: Locale
  children: React.ReactNode
}

const TOAST_DURATION_MS = 5000

export function Providers({ requestLocale, children }: ProvidersProps): React.JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={400}>
          <QueryClientProvider client={queryClient}>
            <I18nProvider requestLocale={requestLocale}>
              {children}
              <Toaster position="top-right" closeButton duration={TOAST_DURATION_MS} />
            </I18nProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
