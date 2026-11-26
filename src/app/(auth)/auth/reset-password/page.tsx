import type { Metadata } from 'next'
import { ResetPasswordScreen } from '@/features/auth/components/reset-password-screen'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.reset_password.title') }
}

export default function ResetPasswordPage(): React.JSX.Element {
  return <ResetPasswordScreen />
}
