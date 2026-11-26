import Link from 'next/link'
import { PlusIcon } from '@/components/icons'
import { BowLogo, BowLogoTones } from '@/components/shared/bow-logo'
import { LocalePicker } from '@/components/shared/locale-picker'
import { ThemePicker } from '@/components/shared/theme-picker'
import { Button } from '@/components/ui/button'
import { AppPaths } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import type { TranslateFn } from '@/lib/i18n/use-translate'
import { TopNavLink } from './top-nav-link'

interface TopNavProps {
  isSignedIn: boolean
  accountMenu: React.ReactNode
}

export async function TopNav({ isSignedIn, accountMenu }: TopNavProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <header className="hidden border-b border-rule lg:block">
      <div className="mx-auto flex h-top-nav w-full max-w-desktop items-center justify-between gap-6 px-12">
        <div className="flex items-center gap-10">
          <Link href={AppPaths.HOME} className="rounded-pill text-[22px]">
            <BowLogo tone={BowLogoTones.BRAND} hasWordmark />
            <span className="sr-only">{t('common.nav.home_link')}</span>
          </Link>
          <nav aria-label={t('common.nav.label')} className="flex gap-7">
            <TopNavLink href={AppPaths.BROWSE}>{t('common.nav.browse')}</TopNavLink>
            {isSignedIn ? (
              <TopNavLink href={AppPaths.LISTS}>{t('common.nav.my_lists')}</TopNavLink>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-3.5">
          <LocalePicker />
          <ThemePicker />
          {isSignedIn ? (
            <SignedInActions t={t} accountMenu={accountMenu} />
          ) : (
            <GuestActions t={t} />
          )}
        </div>
      </div>
    </header>
  )
}

interface SignedInActionsProps {
  t: TranslateFn
  accountMenu: React.ReactNode
}

function SignedInActions({ t, accountMenu }: SignedInActionsProps): React.JSX.Element {
  return (
    <>
      <Button asChild size="sm">
        <Link href={AppPaths.NEW_LIST}>
          <PlusIcon />
          {t('common.nav.new_list')}
        </Link>
      </Button>
      {accountMenu}
    </>
  )
}

interface GuestActionsProps {
  t: TranslateFn
}

function GuestActions({ t }: GuestActionsProps): React.JSX.Element {
  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href={AppPaths.LOGIN}>{t('common.nav.log_in')}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={AppPaths.NEW_LIST}>{t('common.nav.create_my_list')}</Link>
      </Button>
    </>
  )
}
