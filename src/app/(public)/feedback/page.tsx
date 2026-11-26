import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('common.footer.feedback') }
}

export default function FeedbackPage(): React.JSX.Element {
  return (
    <PlaceholderPage
      titleId="common.footer.feedback"
      descriptionId="common.placeholder.coming_soon"
    />
  )
}
