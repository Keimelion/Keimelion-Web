'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckIcon, LinkIcon } from '@/components/icons'
import { Confetti } from '@/components/shared/confetti'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { AuthScreen } from '@/features/auth/components/auth-screen'
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form'
import {
  EmailVerificationStatuses,
  useEmailVerificationLink,
} from '@/features/auth/hooks/use-email-verification-link'
import { useStoredUserEmail } from '@/features/auth/hooks/use-stored-user-email'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'

export function VerifyEmailScreen(): React.JSX.Element {
  const t = useTranslate()
  const { status, retry } = useEmailVerificationLink()
  switch (status) {
    case EmailVerificationStatuses.VERIFYING:
      return <VerifyingState />
    case EmailVerificationStatuses.INVALID_LINK:
      return <InvalidLinkState />
    case EmailVerificationStatuses.FAILED:
      return (
        <ErrorState
          title={t('auth.verify_email.failed_title')}
          description={t('auth.verify_email.failed_description')}
          isRetrying={false}
          onRetry={retry}
        />
      )
    case EmailVerificationStatuses.SIGNING_IN:
      return <VerifiedState description={t('auth.verify_email.signing_in_description')} />
    case EmailVerificationStatuses.VERIFIED:
      return (
        <VerifiedState description={t('auth.verify_email.verified_description')}>
          <Button asChild className="mt-2 w-full lg:w-fit">
            <Link href={AppPaths.LOGIN}>{t('auth.verify_email.log_in')}</Link>
          </Button>
        </VerifiedState>
      )
    default:
      return status satisfies never
  }
}

function VerifyingState(): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthScreen
      icon={LinkIcon}
      paper={OccasionPapers.SKY}
      title={t('auth.verify_email.verifying_title')}
      description={t('auth.verify_email.verifying_description')}
    >
      {null}
    </AuthScreen>
  )
}

function InvalidLinkState(): React.JSX.Element {
  const t = useTranslate()
  const storedEmail = useStoredUserEmail()
  return (
    <AuthScreen
      icon={LinkIcon}
      paper={OccasionPapers.LILAC}
      title={t('auth.verify_email.invalid_title')}
      description={t('auth.verify_email.invalid_description')}
    >
      <ResendVerificationForm key={storedEmail} defaultEmail={storedEmail ?? ''} />
    </AuthScreen>
  )
}

interface VerifiedStateProps {
  description: string
  children?: React.ReactNode
}

function VerifiedState({ description, children = null }: VerifiedStateProps): React.JSX.Element {
  const t = useTranslate()
  const [isCelebrating, setIsCelebrating] = useState(true)
  return (
    <AuthScreen
      icon={CheckIcon}
      paper={OccasionPapers.MINT}
      title={t('auth.verify_email.verified_title')}
      description={description}
    >
      {isCelebrating ? (
        <Confetti
          onDone={() => {
            setIsCelebrating(false)
          }}
        />
      ) : null}
      {children}
    </AuthScreen>
  )
}
