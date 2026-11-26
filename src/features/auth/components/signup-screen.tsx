'use client'

import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { SignupArt } from '@/features/auth/components/auth-art'
import { AuthJourney } from '@/features/auth/components/auth-journey'
import { SignupForm } from '@/features/auth/components/signup-form'
import { useTranslate } from '@/lib/i18n/use-translate'

interface SignupScreenProps {
  loginHref: string
}

export function SignupScreen({ loginHref }: SignupScreenProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthShell
      backdrop={AuthBackdrops.MUSTARD}
      art={<SignupArt />}
      desktopPanel={{ backdrop: AuthBackdrops.SKY, art: <AuthJourney /> }}
      kicker={t('auth.signup.kicker')}
      title={t('auth.signup.title')}
      backHref={loginHref}
    >
      <SignupForm loginHref={loginHref} />
    </AuthShell>
  )
}
