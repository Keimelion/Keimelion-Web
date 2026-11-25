'use client'

import * as React from 'react'
import { MinusIcon, PlusIcon } from '@/components/icons'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

interface StepperProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'type' | 'children'
> {
  value: number
  min: number
  max: number
  label: string
  onValueChange: (value: number) => void
}

export const Stepper = React.forwardRef<HTMLInputElement, StepperProps>(
  ({ value, min, max, label, onValueChange, disabled = false, className, ...inputProps }, ref) => {
    const t = useTranslate()
    const changeValue = (nextValue: number): void => {
      onValueChange(clamp(nextValue, min, max))
    }
    return (
      <div
        className={cn(
          'inline-flex h-11 shrink-0 items-center rounded-pill shadow-[inset_0_0_0_1.5px_var(--rule)] has-[[aria-invalid=true]]:shadow-[inset_0_0_0_2px_var(--danger)]',
          disabled && 'bg-sunken shadow-none',
          className,
        )}
      >
        <StepButton
          label={t('common.stepper.decrease')}
          isDisabled={disabled || value <= min}
          onPress={() => {
            changeValue(value - 1)
          }}
        >
          <MinusIcon className="size-4" />
        </StepButton>
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          aria-label={label}
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const typedValue = event.currentTarget.valueAsNumber
            if (Number.isNaN(typedValue)) return
            changeValue(typedValue)
          }}
          className="h-11 w-11 [appearance:textfield] rounded-field bg-transparent text-center font-display text-title text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:text-muted-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...inputProps}
        />
        <StepButton
          label={t('common.stepper.increase')}
          isDisabled={disabled || value >= max}
          onPress={() => {
            changeValue(value + 1)
          }}
        >
          <PlusIcon className="size-4" />
        </StepButton>
      </div>
    )
  },
)
Stepper.displayName = 'Stepper'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

interface StepButtonProps {
  label: string
  isDisabled: boolean
  onPress: () => void
  children: React.ReactNode
}

function StepButton({ label, isDisabled, onPress, children }: StepButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={isDisabled}
      onClick={onPress}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-ink transition-press outline-none hover:bg-sunken active:scale-[0.94] disabled:cursor-not-allowed disabled:text-rule-strong disabled:hover:bg-transparent"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}
