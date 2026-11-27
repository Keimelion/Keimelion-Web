'use client'

import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons'
import { BowLogo, BowLogoTones } from '@/components/shared/bow-logo'
import { LocalePicker } from '@/components/shared/locale-picker'
import { ThemePicker } from '@/components/shared/theme-picker'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'
import { AuthBackdropFill } from './auth-backdrop'
import type { AuthBackdrop } from './auth-backdrop'

export interface AuthDesktopPanel {
  backdrop: AuthBackdrop
  art: React.ReactNode
}

interface AuthShellProps {
  backdrop: AuthBackdrop
  art: React.ReactNode
  desktopPanel: AuthDesktopPanel | null
  kicker: string
  title: string
  backHref: string | null
  className?: string | undefined
  children: React.ReactNode
}

export function AuthShell({
  backdrop,
  art,
  desktopPanel,
  kicker,
  title,
  backHref,
  className,
  children,
}: AuthShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex min-h-dvh flex-col lg:grid lg:grid-cols-2 lg:grid-rows-[1fr_auto_auto_1fr]',
        className,
      )}
    >
      <div className="relative isolate h-[340px] shrink-0 overflow-hidden lg:contents">
        <AuthShellBackdrops backdrop={backdrop} desktopPanel={desktopPanel} />
        <AuthShellHeader backHref={backHref} />
        <AuthShellArt art={art} desktopPanel={desktopPanel} />
        <AuthShellHeading kicker={kicker} title={title} />
      </div>
      <main className="relative z-10 -mt-[22px] flex-1 rounded-t-sheet bg-surface px-[22px] pt-[22px] pb-12 lg:col-start-2 lg:row-start-3 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-0">
        <div className="mx-auto flex w-full min-w-0 flex-col gap-4 md:max-w-tablet lg:max-w-[440px]">
          {children}
        </div>
      </main>
    </div>
  )
}

interface AuthShellPanelProps {
  desktopPanel: AuthDesktopPanel | null
}

interface AuthShellBackdropsProps extends AuthShellPanelProps {
  backdrop: AuthBackdrop
}

function AuthShellBackdrops({
  backdrop,
  desktopPanel,
}: AuthShellBackdropsProps): React.JSX.Element {
  return (
    <>
      <AuthBackdropFill
        backdrop={backdrop}
        className={cn(
          'absolute inset-0 -z-10 lg:static lg:z-auto lg:col-start-1 lg:row-span-full',
          desktopPanel !== null && 'lg:hidden',
        )}
      />
      {desktopPanel === null ? null : (
        <AuthBackdropFill
          backdrop={desktopPanel.backdrop}
          className="hidden lg:col-start-1 lg:row-span-full lg:block"
        />
      )}
    </>
  )
}

interface AuthShellArtProps extends AuthShellPanelProps {
  art: React.ReactNode
}

function AuthShellArt({ art, desktopPanel }: AuthShellArtProps): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[100px] flex h-[132px] items-center justify-center lg:static lg:col-start-1 lg:row-span-full lg:h-auto lg:min-w-0 lg:overflow-hidden"
    >
      {desktopPanel === null ? (
        <div className="lg:scale-[1.8]">{art}</div>
      ) : (
        <>
          <div className="lg:hidden">{art}</div>
          <div className="hidden size-full items-center justify-center lg:flex">
            {desktopPanel.art}
          </div>
        </>
      )}
    </div>
  )
}

interface AuthShellHeadingProps {
  kicker: string
  title: string
}

function AuthShellHeading({ kicker, title }: AuthShellHeadingProps): React.JSX.Element {
  return (
    <hgroup className="absolute inset-x-0 bottom-9 mx-auto flex w-full flex-col px-[22px] md:max-w-tablet lg:static lg:col-start-2 lg:row-start-2 lg:max-w-[440px] lg:px-0 lg:pb-4">
      <p className="font-hand text-[26px] leading-[26px] font-semibold text-hand-on-paper lg:text-[30px] lg:leading-[34px] lg:text-hand">
        {kicker}
      </p>
      <h1 className="text-display-m wrap-anywhere lg:text-[44px] lg:leading-[48px]">{title}</h1>
    </hgroup>
  )
}

interface AuthShellHeaderProps {
  backHref: string | null
}

function AuthShellHeader({ backHref }: AuthShellHeaderProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <header className="relative z-10 mx-auto flex h-13 w-full items-center justify-between gap-2 px-4 md:max-w-tablet lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:h-top-nav lg:max-w-none lg:self-start lg:px-12">
      {backHref === null ? (
        <span aria-hidden="true" className="size-9 lg:hidden" />
      ) : (
        <Link
          href={backHref}
          className="touch-target inline-flex size-9 items-center justify-center rounded-pill text-ink transition-press outline-none hover:bg-raised/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
        >
          <ChevronLeftIcon className="size-[22px]" />
          <span className="sr-only">{t('common.nav.back')}</span>
        </Link>
      )}
      <Link href={AppPaths.HOME} className="touch-target rounded-pill text-xl lg:text-2xl">
        <BowLogo tone={BowLogoTones.INK} hasWordmark />
        <span className="sr-only">{t('common.nav.home_link')}</span>
      </Link>
      <div className="flex items-center gap-1">
        <LocalePicker />
        <ThemePicker />
      </div>
    </header>
  )
}
