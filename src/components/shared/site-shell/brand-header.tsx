import Link from 'next/link'
import { BowLogo, BowLogoTones } from '@/components/shared/bow-logo'
import { LocalePicker } from '@/components/shared/locale-picker'
import { ThemePicker } from '@/components/shared/theme-picker'
import { AppPaths } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { cn } from '@/lib/utils'

interface BrandHeaderProps {
  className?: string | undefined
}

export async function BrandHeader({ className }: BrandHeaderProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <header
      className={cn(
        'mx-auto flex h-13 w-full items-center justify-between gap-4 px-4 md:max-w-tablet lg:h-top-nav lg:max-w-desktop lg:px-12',
        className,
      )}
    >
      <Link href={AppPaths.HOME} className="touch-target rounded-pill text-xl lg:text-[22px]">
        <BowLogo tone={BowLogoTones.BRAND} hasWordmark />
        <span className="sr-only">{t('common.nav.home_link')}</span>
      </Link>
      <div className="flex items-center gap-2">
        <LocalePicker />
        <ThemePicker />
      </div>
    </header>
  )
}
