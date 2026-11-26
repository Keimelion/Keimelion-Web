import { BottomBar } from '@/components/shared/bottom-bar'
import { SiteFooter } from '@/components/shared/site-footer'
import { TopNav } from '@/components/shared/top-nav'
import { BrandHeader } from './brand-header'

interface SiteShellProps {
  isSignedIn: boolean
  accountMenu: React.ReactNode
  hasMobileFooter: boolean
  children: React.ReactNode
}

export function SiteShell({
  isSignedIn,
  accountMenu,
  hasMobileFooter,
  children,
}: SiteShellProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col pb-bottom-bar lg:pb-0">
      <BrandHeader className="lg:hidden" />
      <TopNav isSignedIn={isSignedIn} accountMenu={accountMenu} />
      <main className="mx-auto flex w-full flex-1 flex-col px-4 pb-22 md:max-w-tablet lg:max-w-desktop lg:px-12 lg:pb-12">
        {children}
      </main>
      <SiteFooter className={hasMobileFooter ? undefined : 'hidden lg:block'} />
      <BottomBar isSignedIn={isSignedIn} />
    </div>
  )
}
