import Link from 'next/link'
import { LocalePicker } from '@/components/shared/locale-picker'
import { ThemePicker } from '@/components/shared/theme-picker'
import { AppPaths } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'

interface SiteShellProps {
  children: React.ReactNode
}

export async function SiteShell({ children }: SiteShellProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4 md:max-w-tablet lg:max-w-desktop lg:px-10">
        <Link href={AppPaths.HOME} className="font-display text-2xl font-extrabold tracking-tight">
          {t('common.app_name')}
        </Link>
        <div className="flex items-center gap-2">
          <LocalePicker />
          <ThemePicker />
        </div>
      </header>
      <main className="mx-auto flex w-full flex-1 flex-col px-4 pb-12 md:max-w-tablet lg:max-w-desktop lg:px-10">
        {children}
      </main>
    </div>
  )
}
