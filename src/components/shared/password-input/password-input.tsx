'use client'

import { EyeOff } from 'lucide-react'
import * as React from 'react'
import { EyeIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

const LUCIDE_BRAND_STROKE_WIDTH = 1.75

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, id, disabled, ...props }, ref) => {
    const t = useTranslate()
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const [isRevealed, setIsRevealed] = React.useState(false)
    return (
      <div className="relative w-full min-w-0">
        <Input
          ref={ref}
          id={inputId}
          type={isRevealed ? 'text' : 'password'}
          disabled={disabled}
          className={cn('pr-14', className)}
          {...props}
        />
        <button
          type="button"
          aria-pressed={isRevealed}
          aria-controls={inputId}
          disabled={disabled}
          onClick={() => {
            setIsRevealed((isShown) => !isShown)
          }}
          className="touch-target absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill text-muted-foreground transition-press outline-none hover:bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50"
        >
          {isRevealed ? (
            <EyeOff
              aria-hidden="true"
              strokeWidth={LUCIDE_BRAND_STROKE_WIDTH}
              className="size-[18px]"
            />
          ) : (
            <EyeIcon className="size-[18px]" />
          )}
          <span className="sr-only">{t('common.password_input.show')}</span>
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
