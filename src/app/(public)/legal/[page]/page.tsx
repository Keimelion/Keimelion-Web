import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import type { MessageId } from '@/lib/i18n/messages'
import { getServerTranslate } from '@/lib/i18n/server-translate'

const LEGAL_PAGE_TITLES: ReadonlyMap<string, MessageId> = new Map([
  ['notice', 'common.footer.legal_notice'],
  ['terms', 'common.footer.terms_of_use'],
  ['privacy', 'common.footer.privacy'],
  ['affiliate-links', 'common.footer.affiliate_links'],
  ['cookies', 'common.footer.cookies'],
])

interface LegalPageProps {
  params: Promise<{ page: string }>
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const titleId = LEGAL_PAGE_TITLES.get((await params).page)
  if (titleId === undefined) return {}
  const t = await getServerTranslate()
  return { title: t(titleId) }
}

export default async function LegalPage({ params }: LegalPageProps): Promise<React.JSX.Element> {
  const titleId = LEGAL_PAGE_TITLES.get((await params).page)
  if (titleId === undefined) notFound()
  return <PlaceholderPage titleId={titleId} descriptionId="common.placeholder.coming_soon" />
}
