'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'

const ThemeSettings = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

type ThemeSetting = (typeof ThemeSettings)[keyof typeof ThemeSettings]

interface ThemeOption {
  value: ThemeSetting
  labelId: MessageId
  icon: LucideIcon
}

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: ThemeSettings.LIGHT, labelId: 'common.theme_picker.light', icon: Sun },
  { value: ThemeSettings.DARK, labelId: 'common.theme_picker.dark', icon: Moon },
  { value: ThemeSettings.SYSTEM, labelId: 'common.theme_picker.system', icon: Monitor },
]

export function ThemePicker(): React.JSX.Element {
  const { theme, setTheme } = useTheme()
  const t = useTranslate()

  const selectTheme = (value: string): void => {
    if (!isThemeSetting(value)) return
    crossFadeThemeChange(() => {
      setTheme(value)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Sun aria-hidden="true" className="size-[1.2rem] dark:hidden" />
          <Moon aria-hidden="true" className="hidden size-[1.2rem] dark:block" />
          <span className="sr-only">{t('common.theme_picker.select_theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme ?? ThemeSettings.SYSTEM} onValueChange={selectTheme}>
          {THEME_OPTIONS.map(({ value, labelId, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon aria-hidden="true" className="size-4" />
              {t(labelId)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function isThemeSetting(value: string): value is ThemeSetting {
  return THEME_OPTIONS.some((option) => option.value === value)
}

function crossFadeThemeChange(applyTheme: () => void): void {
  if (!('startViewTransition' in document)) {
    applyTheme()
    return
  }
  document.startViewTransition(() => {
    flushSync(applyTheme)
  })
}
