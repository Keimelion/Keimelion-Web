import Link from 'next/link'
import { BowLogo, BowLogoTones } from '@/components/shared/bow-logo'
import { AppPaths } from '@/lib/app-paths'
import type { MessageId } from '@/lib/i18n/messages'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { cn } from '@/lib/utils'

interface FooterLink {
  href: string
  labelId: MessageId
}

const FOOTER_LINKS: readonly FooterLink[] = [
  { href: AppPaths.LEGAL_NOTICE, labelId: 'common.footer.legal_notice' },
  { href: AppPaths.TERMS_OF_USE, labelId: 'common.footer.terms_of_use' },
  { href: AppPaths.PRIVACY, labelId: 'common.footer.privacy' },
  { href: AppPaths.AFFILIATE_LINKS, labelId: 'common.footer.affiliate_links' },
  { href: AppPaths.COOKIES, labelId: 'common.footer.cookies' },
  { href: AppPaths.FEEDBACK, labelId: 'common.footer.feedback' },
]

interface SiteFooterProps {
  className?: string | undefined
}

export async function SiteFooter({ className }: SiteFooterProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <footer className={cn('bg-footer text-on-footer', className)}>
      <div className="mx-auto flex w-full flex-col gap-2.5 px-[18px] pt-[22px] pb-[34px] md:max-w-tablet lg:max-w-desktop lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-12 lg:py-7">
        <Link href={AppPaths.HOME} className="touch-target w-fit rounded-pill text-xl">
          <BowLogo tone={BowLogoTones.ON_FOOTER} hasWordmark />
          <span className="sr-only">{t('common.nav.home_link')}</span>
        </Link>
        <nav aria-label={t('common.footer.legal_label')}>
          <ul className="flex flex-wrap gap-x-1.5 gap-y-2 text-small lg:gap-x-[22px] lg:text-sm">
            {FOOTER_LINKS.map((link, index) => (
              <li key={link.href} className="flex gap-x-1.5">
                <Link href={link.href} className="touch-target underline-offset-4 hover:underline">
                  {t(link.labelId)}
                </Link>
                {index === FOOTER_LINKS.length - 1 ? null : (
                  <span aria-hidden="true" className="lg:hidden">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-[11px] text-on-footer-muted lg:text-xs">
          {t('common.footer.copyright', {
            year: String(new Date().getFullYear()),
            version: process.env.NEXT_PUBLIC_APP_VERSION ?? '',
          })}
        </p>
      </div>
    </footer>
  )
}
