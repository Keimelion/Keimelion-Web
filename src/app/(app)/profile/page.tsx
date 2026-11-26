import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('common.nav.profile') }
}

export default function ProfilePage(): React.JSX.Element {
  return (
    <PlaceholderPage titleId="common.nav.profile" descriptionId="common.placeholder.coming_soon" />
  )
}
