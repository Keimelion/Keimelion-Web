'use client'

import { motion } from 'motion/react'
import { useId, useRef } from 'react'
import type { LineIconProps } from '@/components/icons'
import { MotionDurations, MotionEasings } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SegmentedOption<TValue extends string> {
  value: TValue
  label: string
  icon: React.ComponentType<LineIconProps>
}

interface SegmentedControlProps<TValue extends string> {
  label: string
  options: readonly SegmentedOption<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

const KNOB_TRANSITION = { duration: MotionDurations.M, ease: MotionEasings.STANDARD }
const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown'])
const PREVIOUS_KEYS = new Set(['ArrowLeft', 'ArrowUp'])

export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onValueChange,
}: SegmentedControlProps<TValue>): React.JSX.Element {
  const knobId = useId()
  const optionRefs = useRef(new Map<TValue, HTMLButtonElement>())

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = getKeyStep(event.key)
    if (step === 0) return
    event.preventDefault()
    const currentPosition = options.findIndex((option) => option.value === value)
    const nextOption = options.at((currentPosition + step) % options.length)
    if (nextOption === undefined) return
    onValueChange(nextOption.value)
    optionRefs.current.get(nextOption.value)?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="relative inline-flex h-9 max-w-full shrink-0 rounded-pill bg-sunken p-[3px]"
    >
      {options.map((option) => (
        <SegmentButton
          key={option.value}
          option={option}
          knobId={knobId}
          isSelected={option.value === value}
          registerRef={(element) => {
            registerOption(optionRefs.current, option.value, element)
          }}
          onSelect={() => {
            onValueChange(option.value)
          }}
        />
      ))}
    </div>
  )
}

function registerOption<TValue extends string>(
  registry: Map<TValue, HTMLButtonElement>,
  optionValue: TValue,
  element: HTMLButtonElement | null,
): void {
  if (element === null) {
    registry.delete(optionValue)
    return
  }
  registry.set(optionValue, element)
}

function getKeyStep(key: string): number {
  if (NEXT_KEYS.has(key)) return 1
  if (PREVIOUS_KEYS.has(key)) return -1
  return 0
}

interface SegmentButtonProps<TValue extends string> {
  option: SegmentedOption<TValue>
  knobId: string
  isSelected: boolean
  registerRef: (element: HTMLButtonElement | null) => void
  onSelect: () => void
}

function SegmentButton<TValue extends string>({
  option,
  knobId,
  isSelected,
  registerRef,
  onSelect,
}: SegmentButtonProps<TValue>): React.JSX.Element {
  const Icon = option.icon
  return (
    <button
      ref={registerRef}
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      className={cn(
        'touch-target inline-flex cursor-pointer items-center gap-1.5 rounded-pill px-[13px] text-[13px] font-bold whitespace-nowrap text-muted-foreground transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        isSelected && 'text-on-inverse',
      )}
    >
      {isSelected ? (
        <motion.span
          layoutId={knobId}
          transition={KNOB_TRANSITION}
          className="absolute inset-0 rounded-pill bg-inverse"
        />
      ) : null}
      <Icon className="relative size-3.5" />
      <span className="relative">{option.label}</span>
    </button>
  )
}
