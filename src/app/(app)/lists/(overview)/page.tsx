import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('lists.overview.title') }
}

export default function ListsPage(): React.JSX.Element {
  return (
    <PlaceholderPage
      titleId="lists.overview.title"
      descriptionId="common.placeholder.coming_soon"
    />
  )
}
