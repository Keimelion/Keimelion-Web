import type { Metadata } from 'next'
import { ForgotPasswordScreen } from '@/features/auth/components/forgot-password-screen'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.forgot_password.title') }
}

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordScreen />
}
