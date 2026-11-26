import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('common.nav.new_list') }
}

export default function NewListPage(): React.JSX.Element {
  return (
    <PlaceholderPage titleId="common.nav.new_list" descriptionId="common.placeholder.coming_soon" />
  )
}
