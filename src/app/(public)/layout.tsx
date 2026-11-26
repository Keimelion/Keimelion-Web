import { SiteShell } from '@/components/shared/site-shell'
import { hasServerSession } from '@/data-access/_shared/auth-storage/server-session'
import { AccountMenu } from '@/features/account/components/account-menu'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const isSignedIn = await hasServerSession()
  return (
    <SiteShell isSignedIn={isSignedIn} accountMenu={<AccountMenu />} hasMobileFooter={!isSignedIn}>
      {children}
    </SiteShell>
  )
}
