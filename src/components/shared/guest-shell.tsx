import { SiteFooter } from '@/components/shared/site-footer'
import { BrandHeader } from '@/components/shared/site-shell'

interface GuestShellProps {
  children: React.ReactNode
}

export function GuestShell({ children }: GuestShellProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <BrandHeader />
      <main className="mx-auto flex w-full flex-1 flex-col px-4 pb-12 md:max-w-tablet lg:max-w-desktop lg:px-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
