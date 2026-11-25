'use client'

import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { CheckIcon } from '@/components/icons'
import type { LineIconProps } from '@/components/icons'
import { CHIP_CLASS_NAME } from '@/components/shared/chip/chip-styles'
import { seq } from '@/lib/motion'

export interface ChipOption {
  value: string
  label: string
  count: number | null
  icon: React.ComponentType<LineIconProps> | null
}

interface SingleChipGroupProps {
  selectionMode: 'single'
  value: string
  onValueChange: (value: string) => void
}

interface MultipleChipGroupProps {
  selectionMode: 'multiple'
  value: readonly string[]
  onValueChange: (value: string[]) => void
}

type ChipGroupProps = (SingleChipGroupProps | MultipleChipGroupProps) & {
  label: string
  options: readonly ChipOption[]
}

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown'])
const PREVIOUS_KEYS = new Set(['ArrowLeft', 'ArrowUp'])

export function ChipGroup(props: ChipGroupProps): React.JSX.Element {
  const { label, options } = props
  const isSingle = props.selectionMode === 'single'
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedPosition, setFocusedPosition] = useState(() => findInitialPosition(props))

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = getKeyStep(event.key)
    if (step === 0 || options.length === 0) return
    event.preventDefault()
    const nextPosition = (focusedPosition + step + options.length) % options.length
    setFocusedPosition(nextPosition)
    chipRefs.current[nextPosition]?.focus()
    const nextOption = options[nextPosition]
    if (props.selectionMode === 'single' && nextOption !== undefined)
      props.onValueChange(nextOption.value)
  }

  return (
    <div
      role={isSingle ? 'radiogroup' : 'group'}
      aria-label={label}
      onKeyDown={moveFocus}
      className="flex min-w-0 flex-wrap gap-2.5"
    >
      {options.map((option, position) => (
        <button
          key={option.value}
          ref={(element) => {
            chipRefs.current[position] = element
          }}
          type="button"
          role={isSingle ? 'radio' : undefined}
          {...selectionAttributes(props, option.value)}
          tabIndex={position === focusedPosition ? 0 : -1}
          onFocus={() => {
            setFocusedPosition(position)
          }}
          onClick={() => {
            toggleOption(props, option.value)
          }}
          className={CHIP_CLASS_NAME}
        >
          <ChoiceIndicator
            selectionMode={props.selectionMode}
            isSelected={isOptionSelected(props, option.value)}
          />
          <ChipContent option={option} />
        </button>
      ))}
    </div>
  )
}

function findInitialPosition(props: ChipGroupProps): number {
  const selectedValues = props.selectionMode === 'single' ? [props.value] : props.value
  return Math.max(
    0,
    props.options.findIndex((option) => selectedValues.includes(option.value)),
  )
}

function getKeyStep(key: string): number {
  if (NEXT_KEYS.has(key)) return 1
  if (PREVIOUS_KEYS.has(key)) return -1
  return 0
}

function isOptionSelected(props: ChipGroupProps, optionValue: string): boolean {
  if (props.selectionMode === 'single') return props.value === optionValue
  return props.value.includes(optionValue)
}

function selectionAttributes(
  props: ChipGroupProps,
  optionValue: string,
): { 'aria-checked': boolean } | { 'aria-pressed': boolean } {
  const isSelected = isOptionSelected(props, optionValue)
  if (props.selectionMode === 'single') return { 'aria-checked': isSelected }
  return { 'aria-pressed': isSelected }
}

function toggleOption(props: ChipGroupProps, optionValue: string): void {
  if (props.selectionMode === 'single') {
    props.onValueChange(optionValue)
    return
  }
  const isSelected = props.value.includes(optionValue)
  props.onValueChange(
    isSelected
      ? props.value.filter((selectedValue) => selectedValue !== optionValue)
      : [...props.value, optionValue],
  )
}

interface ChipContentProps {
  option: ChipOption
}

function ChipContent({ option }: ChipContentProps): React.JSX.Element {
  const Icon = option.icon
  return (
    <>
      {Icon === null ? null : <Icon />}
      {option.label}
      {option.count === null ? null : ' '}
      {option.count === null ? null : (
        <span className="font-mono text-label tracking-normal">{option.count}</span>
      )}
    </>
  )
}

interface ChoiceIndicatorProps {
  selectionMode: 'single' | 'multiple'
  isSelected: boolean
}

function ChoiceIndicator({ selectionMode, isSelected }: ChoiceIndicatorProps): React.JSX.Element {
  if (selectionMode === 'single') {
    return (
      <span
        aria-hidden="true"
        data-indicator="radio"
        className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-pill shadow-[inset_0_0_0_1.5px_currentColor]"
      >
        {isSelected ? <span className="size-1.5 rounded-pill bg-current" /> : null}
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      data-indicator="checkbox"
      className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-[4px] shadow-[inset_0_0_0_1.5px_currentColor]"
    >
      {isSelected ? (
        <motion.span className="inline-flex" {...seq(0)}>
          <CheckIcon className="size-3!" />
        </motion.span>
      ) : null}
    </span>
  )
}
