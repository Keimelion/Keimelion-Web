'use client'

import { MinusIcon, PlusIcon } from '@/components/icons'
import { useTranslate } from '@/lib/i18n/use-translate'

interface StepperProps {
  value: number
  min: number
  max: number
  label: string
  onValueChange: (value: number) => void
}

export function Stepper({
  value,
  min,
  max,
  label,
  onValueChange,
}: StepperProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-11 shrink-0 items-center rounded-pill shadow-[inset_0_0_0_1.5px_var(--rule)]"
    >
      <StepButton
        label={t('common.stepper.decrease')}
        isDisabled={value <= min}
        onPress={() => {
          onValueChange(value - 1)
        }}
      >
        <MinusIcon className="size-4" />
      </StepButton>
      <output aria-live="polite" className="w-[30px] text-center font-display text-title">
        {value}
      </output>
      <StepButton
        label={t('common.stepper.increase')}
        isDisabled={value >= max}
        onPress={() => {
          onValueChange(value + 1)
        }}
      >
        <PlusIcon className="size-4" />
      </StepButton>
    </div>
  )
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
      disabled={isDisabled}
      onClick={onPress}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-ink transition-[background-color,transform] duration-200 ease-spring outline-none hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.94] disabled:cursor-not-allowed disabled:text-rule-strong disabled:hover:bg-transparent"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}
