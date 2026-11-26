'use client'

import { DayPicker } from 'react-day-picker'
import type { ClassNames, Modifiers } from 'react-day-picker'
import { enUS, fr } from 'react-day-picker/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import type { Locale } from '@/lib/i18n/locale'
import { useLocale } from '@/lib/i18n/use-locale'
import { useTranslate } from '@/lib/i18n/use-translate'

const DAY_PICKER_LOCALES = { en: enUS, fr } as const satisfies Record<Locale, unknown>

const DAY_CELL_CLASS_NAME =
  'touch-target inline-flex size-11 cursor-pointer items-center justify-center rounded-pill text-sm font-semibold transition-press outline-none hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'

const CALENDAR_CLASS_NAMES: Partial<ClassNames> = {
  root: 'text-ink',
  months: 'relative flex flex-col',
  month: 'flex flex-col gap-2',
  month_caption: 'flex h-11 items-center pl-2',
  caption_label: 'font-display text-title first-letter:uppercase',
  nav: 'absolute top-0 right-0 flex gap-1',
  button_previous: DAY_CELL_CLASS_NAME,
  button_next: DAY_CELL_CLASS_NAME,
  month_grid: 'border-collapse',
  weekday: 'size-11 font-mono text-label font-medium text-muted-foreground uppercase',
  day: 'p-0 text-center',
  day_button: DAY_CELL_CLASS_NAME,
  selected: '[&>button]:bg-brand [&>button]:text-on-brand [&>button]:hover:bg-brand-deep',
  today: '[&>button]:shadow-[inset_0_0_0_1.5px_var(--rule-strong)]',
}

interface CalendarProps {
  selected: Date | null
  onSelect: (date: Date | null) => void
}

export function Calendar({ selected, onSelect }: CalendarProps): React.JSX.Element {
  const locale = useLocale()
  const t = useTranslate()
  const labelDayButton = (date: Date, modifiers: Modifiers): string =>
    t(modifiers.today ? 'common.date_picker.today' : 'common.date_picker.value', {
      date: date.getTime(),
    })
  return (
    <DayPicker
      mode="single"
      {...(selected === null ? {} : { selected, defaultMonth: selected })}
      onSelect={(date) => {
        onSelect(date ?? null)
      }}
      locale={DAY_PICKER_LOCALES[locale]}
      labels={{ labelDayButton }}
      autoFocus
      classNames={CALENDAR_CLASS_NAMES}
      components={{ Chevron: CalendarChevron }}
    />
  )
}

interface CalendarChevronProps {
  orientation?: 'up' | 'down' | 'left' | 'right'
}

function CalendarChevron({ orientation }: CalendarChevronProps): React.JSX.Element {
  if (orientation === 'left') return <ChevronLeftIcon className="size-4" />
  return <ChevronRightIcon className="size-4" />
}
