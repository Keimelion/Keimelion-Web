'use client'

import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { EnvelopeArt } from '@/features/auth/components/auth-art'
import { ConfirmEmailVerifiedButton } from '@/features/auth/components/confirm-email-verified-button'
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form'
import { usePendingVerificationEmail } from '@/features/auth/hooks/use-pending-verification-email'
import { useStoredUserEmail } from '@/features/auth/hooks/use-stored-user-email'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { useTranslateRich } from '@/lib/i18n/use-translate-rich'

export function CheckInboxScreen(): React.JSX.Element {
  const t = useTranslate()
  const translateRich = useTranslateRich()
  const pendingEmail = usePendingVerificationEmail()
  const storedEmail = useStoredUserEmail()
  const email = pendingEmail ?? storedEmail
  return (
    <AuthShell
      backdrop={AuthBackdrops.SKY}
      art={<EnvelopeArt />}
      desktopPanel={null}
      kicker={t('auth.check_inbox.kicker')}
      title={t('auth.check_inbox.title')}
      backHref={AppPaths.HOME}
    >
      <p className="text-body wrap-anywhere text-muted-foreground">
        {email === null
          ? t('auth.check_inbox.description')
          : translateRich('auth.check_inbox.description_with_email', {
              email,
              strong: (chunks) => <strong className="font-bold text-ink">{chunks}</strong>,
            })}
      </p>
      <ConfirmEmailVerifiedButton />
      <ResendVerificationForm key={email} defaultEmail={email ?? ''} />
    </AuthShell>
  )
}
