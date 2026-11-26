'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { I18nProvider } from '@/lib/i18n/i18n-provider'
import { TOAST_LIFETIME_MS } from '@/lib/motion'
import type { Locale } from '@/lib/i18n/locale'
import { queryClient } from '@/lib/query-client'

interface ProvidersProps {
  requestLocale: Locale
  children: React.ReactNode
}

export function Providers({ requestLocale, children }: ProvidersProps): React.JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={400}>
          <QueryClientProvider client={queryClient}>
            <I18nProvider requestLocale={requestLocale}>
              {children}
              <Toaster position="bottom-center" closeButton duration={TOAST_LIFETIME_MS} />
            </I18nProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
