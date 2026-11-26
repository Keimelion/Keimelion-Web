import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('invites.accept.title') }
}

export default function AcceptInvitePage(): React.JSX.Element {
  return (
    <PlaceholderPage
      titleId="invites.accept.title"
      descriptionId="common.placeholder.coming_soon"
    />
  )
}
