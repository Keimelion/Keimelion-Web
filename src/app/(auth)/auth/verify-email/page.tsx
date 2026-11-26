import type { Metadata } from 'next'
import { VerifyEmailScreen } from '@/features/auth/components/verify-email-screen'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.verify_email.title') }
}

export default function VerifyEmailPage(): React.JSX.Element {
  return <VerifyEmailScreen />
}
