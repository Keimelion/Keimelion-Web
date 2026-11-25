'use client'

import * as React from 'react'
import { CalendarIcon, CloseIcon } from '@/components/icons'
import { BottomSheet } from '@/components/shared/bottom-sheet'
import { FIELD_CONTROL_CLASS_NAME } from '@/components/ui/field-styles'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslate } from '@/lib/i18n/use-translate'
import { useIsDesktopViewport } from '@/lib/use-is-desktop-viewport'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'

interface DatePickerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange' | 'children'
> {
  value: Date | null
  onValueChange: (value: Date | null) => void
  label: string
  placeholder: string
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onValueChange, label, placeholder, className, ...triggerProps }, ref) => {
    const t = useTranslate()
    const isDesktop = useIsDesktopViewport()
    const [isOpen, setIsOpen] = React.useState(false)
    const selectDate = (date: Date | null): void => {
      onValueChange(date)
      setIsOpen(false)
    }
    const trigger = (
      <DateTrigger
        ref={ref}
        value={value}
        placeholder={placeholder}
        className={className}
        onOpen={() => {
          setIsOpen(true)
        }}
        {...triggerProps}
      />
    )
    const calendar = <Calendar selected={value} onSelect={selectDate} />
    return (
      <div className="relative w-full min-w-0">
        {isDesktop ? (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent align="start" aria-label={label} className="w-auto p-3">
              {calendar}
            </PopoverContent>
          </Popover>
        ) : (
          <>
            {trigger}
            <BottomSheet open={isOpen} onOpenChange={setIsOpen} title={label} description={null}>
              <div className="mt-3 flex justify-center">{calendar}</div>
            </BottomSheet>
          </>
        )}
        {value === null || triggerProps.disabled === true ? null : (
          <button
            type="button"
            onClick={() => {
              onValueChange(null)
            }}
            className="touch-target absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill text-muted-foreground transition-press outline-none hover:bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <CloseIcon className="size-4" />
            <span className="sr-only">{t('common.date_picker.clear')}</span>
          </button>
        )}
      </div>
    )
  },
)
DatePicker.displayName = 'DatePicker'

interface DateTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange' | 'children'
> {
  value: Date | null
  placeholder: string
  onOpen: () => void
}

const DateTrigger = React.forwardRef<HTMLButtonElement, DateTriggerProps>(
  (
    { value, placeholder, onOpen, className, onClick, 'aria-describedby': describedBy, ...props },
    ref,
  ) => {
    const t = useTranslate()
    const valueId = React.useId()
    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="dialog"
        aria-describedby={[valueId, describedBy].filter(Boolean).join(' ')}
        onClick={(event) => {
          onClick?.(event)
          onOpen()
        }}
        className={cn(
          FIELD_CONTROL_CLASS_NAME,
          'flex h-13 cursor-pointer items-center gap-2.5 pr-12 text-left',
          value === null && 'text-muted-foreground',
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-[18px] text-rule-strong" />
        <span id={valueId} className="min-w-0 truncate">
          {value === null ? placeholder : t('common.date_picker.value', { date: value.getTime() })}
        </span>
      </button>
    )
  },
)
DateTrigger.displayName = 'DateTrigger'
