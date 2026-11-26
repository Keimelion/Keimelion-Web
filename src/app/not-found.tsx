import type { Metadata } from 'next'
import { NotFound } from '@/components/shared/not-found'
import { SiteShell } from '@/components/shared/site-shell'
import { hasServerSession } from '@/data-access/_shared/auth-storage/server-session'
import { AccountMenu } from '@/features/account/components/account-menu'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('error.not_found.metadata_title') }
}

export default async function NotFoundPage(): Promise<React.JSX.Element> {
  const isSignedIn = await hasServerSession()
  return (
    <SiteShell isSignedIn={isSignedIn} accountMenu={<AccountMenu />} hasMobileFooter={!isSignedIn}>
      <NotFound isSignedIn={isSignedIn} />
    </SiteShell>
  )
}
