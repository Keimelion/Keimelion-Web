'use client'

import type { LineIconProps } from '@/components/icons'
import { MoreIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export const MoreMenuTones = {
  DEFAULT: 'default',
  DANGER: 'danger',
  HIGHLIGHT: 'highlight',
} as const

export type MoreMenuTone = (typeof MoreMenuTones)[keyof typeof MoreMenuTones]

export interface MoreMenuItem {
  id: string
  label: string
  icon: React.ComponentType<LineIconProps> | null
  tone: MoreMenuTone
  onSelect: () => void
}

interface MoreMenuProps {
  label: string
  trigger: React.ReactElement | null
  items: readonly MoreMenuItem[]
  footerItem: MoreMenuItem | null
}

const TONE_CLASS_NAMES: Readonly<Record<MoreMenuTone, string>> = {
  [MoreMenuTones.DEFAULT]: 'text-ink focus:bg-sunken',
  [MoreMenuTones.DANGER]: 'text-danger focus:bg-sunken focus:text-danger',
  [MoreMenuTones.HIGHLIGHT]: 'font-semibold text-brand focus:bg-sunken focus:text-brand',
}

export function MoreMenu({ label, trigger, items, footerItem }: MoreMenuProps): React.JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon-sm">
            <MoreIcon />
            <span className="sr-only">{label}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-56 rounded-field border-rule bg-raised p-1 shadow-float"
      >
        {items.map((item) => (
          <MoreMenuEntry key={item.id} item={item} />
        ))}
        {footerItem === null ? null : (
          <>
            <DropdownMenuSeparator className="bg-rule" />
            <MoreMenuEntry item={footerItem} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface MoreMenuEntryProps {
  item: MoreMenuItem
}

function MoreMenuEntry({ item }: MoreMenuEntryProps): React.JSX.Element {
  const Icon = item.icon
  return (
    <DropdownMenuItem
      onSelect={item.onSelect}
      className={cn(
        'min-h-11 cursor-pointer gap-2.5 rounded-xl px-3 text-base',
        TONE_CLASS_NAMES[item.tone],
      )}
    >
      {Icon === null ? null : <Icon className="size-[18px]" />}
      {item.label}
    </DropdownMenuItem>
  )
}
