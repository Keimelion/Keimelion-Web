import type { Metadata } from 'next'
import { PlaceholderPage } from '@/components/shared/placeholder-page'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.reset_password.title') }
}

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <PlaceholderPage
      titleId="auth.reset_password.title"
      descriptionId="common.placeholder.coming_soon"
    />
  )
}
