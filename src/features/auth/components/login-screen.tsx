'use client'

import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { LoginArt } from '@/features/auth/components/auth-art'
import { AuthJourney } from '@/features/auth/components/auth-journey'
import { LoginForm } from '@/features/auth/components/login-form'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

interface LoginScreenProps {
  returnPath: string
  signupHref: string
}

export function LoginScreen({ returnPath, signupHref }: LoginScreenProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthShell
      backdrop={AuthBackdrops.LILAC}
      art={<LoginArt />}
      desktopPanel={{ backdrop: AuthBackdrops.SKY, art: <AuthJourney /> }}
      kicker={t('auth.login.kicker')}
      title={t('auth.login.title')}
      backHref={AppPaths.HOME}
    >
      <LoginForm returnPath={returnPath} signupHref={signupHref} />
    </AuthShell>
  )
}
