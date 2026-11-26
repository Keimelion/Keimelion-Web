import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('common.nav.browse') }
}

export default function BrowsePage(): React.JSX.Element {
  return (
    <PlaceholderPage titleId="common.nav.browse" descriptionId="common.placeholder.coming_soon" />
  )
}
