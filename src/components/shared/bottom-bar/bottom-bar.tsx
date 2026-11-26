'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ListIcon, SearchIcon, UserIcon } from '@/components/icons'
import type { LineIconProps } from '@/components/icons'
import { AppPaths, isPathWithin } from '@/lib/app-paths'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'

interface BottomBarTab {
  href: string
  labelId: MessageId
  icon: React.ComponentType<LineIconProps>
}

const HOME_TAB: BottomBarTab = { href: AppPaths.HOME, labelId: 'common.nav.home', icon: HomeIcon }
const BROWSE_TAB: BottomBarTab = {
  href: AppPaths.BROWSE,
  labelId: 'common.nav.browse',
  icon: SearchIcon,
}

const SIGNED_IN_TABS: readonly BottomBarTab[] = [
  HOME_TAB,
  BROWSE_TAB,
  { href: AppPaths.LISTS, labelId: 'common.nav.my_lists', icon: ListIcon },
  { href: AppPaths.PROFILE, labelId: 'common.nav.profile', icon: UserIcon },
]

const GUEST_TABS: readonly BottomBarTab[] = [
  HOME_TAB,
  BROWSE_TAB,
  { href: AppPaths.LOGIN, labelId: 'common.nav.log_in', icon: UserIcon },
]

interface BottomBarProps {
  isSignedIn: boolean
}

export function BottomBar({ isSignedIn }: BottomBarProps): React.JSX.Element {
  const t = useTranslate()
  const pathname = usePathname()
  const tabs = isSignedIn ? SIGNED_IN_TABS : GUEST_TABS
  return (
    <nav
      aria-label={t('common.nav.label')}
      className="fixed inset-x-0 bottom-0 z-40 h-bottom-bar bg-raised shadow-[0_-1px_0_var(--rule)] lg:hidden"
    >
      <ul className="mx-auto flex justify-around px-[18px] pt-2.5 md:max-w-tablet">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <BottomBarLink tab={tab} isActive={isTabActive(tab.href, pathname)}>
              {t(tab.labelId)}
            </BottomBarLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function isTabActive(href: string, pathname: string): boolean {
  if (href === AppPaths.HOME) return pathname === AppPaths.HOME
  return isPathWithin(pathname, href)
}

interface BottomBarLinkProps {
  tab: BottomBarTab
  isActive: boolean
  children: React.ReactNode
}

function BottomBarLink({ tab, isActive, children }: BottomBarLinkProps): React.JSX.Element {
  const Icon = tab.icon
  return (
    <Link
      href={tab.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex min-h-11 min-w-16 flex-col items-center gap-[3px] text-[11px] font-semibold whitespace-nowrap transition-press',
        isActive ? 'text-brand' : 'text-muted-foreground',
      )}
    >
      <Icon className="size-6" />
      {children}
    </Link>
  )
}
