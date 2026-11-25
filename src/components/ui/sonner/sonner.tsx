'use client'

import { OctagonX, TriangleAlert } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

import { ToastBow } from './toast-bow'

type ToasterProps = React.ComponentProps<typeof Sonner>

const LUCIDE_BRAND_STROKE_WIDTH = 1.75

const Toaster = ({ ...props }: ToasterProps): React.JSX.Element => {
  const { theme = 'system' } = useTheme()
  const resolvedTheme: 'light' | 'dark' | 'system' =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system'

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <ToastBow />,
        info: <ToastBow />,
        warning: (
          <TriangleAlert
            aria-hidden="true"
            strokeWidth={LUCIDE_BRAND_STROKE_WIDTH}
            className="size-5"
          />
        ),
        error: (
          <OctagonX aria-hidden="true" strokeWidth={LUCIDE_BRAND_STROKE_WIDTH} className="size-5" />
        ),
      }}
      toastOptions={{
        classNames: {
          title: 'group-[.toast]:font-semibold group-[.toast]:text-[15px]',
          description: 'group-[.toast]:text-small',
          actionButton:
            'group-[.toast]:rounded-pill group-[.toast]:bg-on-inverse group-[.toast]:text-inverse',
          cancelButton:
            'group-[.toast]:rounded-pill group-[.toast]:bg-transparent group-[.toast]:text-on-inverse',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
