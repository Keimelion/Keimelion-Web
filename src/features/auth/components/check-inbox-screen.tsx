'use client'

import { MailIcon } from '@/components/icons'
import { AuthScreen } from '@/features/auth/components/auth-screen'
import { ConfirmEmailVerifiedButton } from '@/features/auth/components/confirm-email-verified-button'
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form'
import { useStoredUserEmail } from '@/features/auth/hooks/use-stored-user-email'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'

export function CheckInboxScreen(): React.JSX.Element {
  const t = useTranslate()
  const storedEmail = useStoredUserEmail()
  return (
    <AuthScreen
      icon={MailIcon}
      paper={OccasionPapers.SKY}
      title={t('auth.check_inbox.title')}
      description={
        storedEmail === null
          ? t('auth.check_inbox.description')
          : t('auth.check_inbox.description_with_email', { email: storedEmail })
      }
    >
      <ConfirmEmailVerifiedButton />
      <ResendVerificationForm key={storedEmail} defaultEmail={storedEmail ?? ''} />
    </AuthScreen>
  )
}
