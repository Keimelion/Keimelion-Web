'use client'

import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { KeyArt } from '@/features/auth/components/auth-art'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

export function ForgotPasswordScreen(): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthShell
      backdrop={AuthBackdrops.GINGHAM}
      art={<KeyArt />}
      desktopPanel={null}
      kicker={t('auth.forgot_password.kicker')}
      title={t('auth.forgot_password.title')}
      backHref={AppPaths.LOGIN}
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
