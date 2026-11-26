'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { Button } from '@/components/ui/button'
import { EnvelopeArt, VerifiedArt } from '@/features/auth/components/auth-art'
import { STANDALONE_AUTH_LINK_CLASS_NAME } from '@/features/auth/components/auth-link-styles'
import { ResendVerificationForm } from '@/features/auth/components/resend-verification-form'
import {
  EmailVerificationStatuses,
  useEmailVerificationLink,
} from '@/features/auth/hooks/use-email-verification-link'
import { useStoredUserEmail } from '@/features/auth/hooks/use-stored-user-email'
import { AppPaths, FEEDBACK_BUG_PATH } from '@/lib/app-paths'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { doNothing } from '@/lib/utils'

export function VerifyEmailScreen(): React.JSX.Element {
  const { status, retry } = useEmailVerificationLink()
  switch (status) {
    case EmailVerificationStatuses.VERIFYING:
      return <VerifyingState />
    case EmailVerificationStatuses.INVALID_LINK:
      return <InvalidLinkState />
    case EmailVerificationStatuses.FAILED:
    case EmailVerificationStatuses.TOO_MANY_ATTEMPTS:
      return <FailedState status={status} onRetry={retry} />
    case EmailVerificationStatuses.SIGNING_IN:
      return <SigningInState />
    case EmailVerificationStatuses.REDIRECTING_TO_LOGIN:
      return (
        <VerifiedState
          descriptionId="auth.verify_email.redirecting_to_login_description"
          onWrapped={null}
        />
      )
    case EmailVerificationStatuses.VERIFIED:
      return (
        <VerifiedState descriptionId="auth.verify_email.verified_description" onWrapped={null}>
          <ContinueLink href={AppPaths.LOGIN} labelId="auth.verify_email.log_in" />
        </VerifiedState>
      )
    default:
      return status satisfies never
  }
}

function VerifyingState(): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthShell
      backdrop={AuthBackdrops.SKY}
      art={<EnvelopeArt />}
      desktopPanel={null}
      kicker={t('auth.verify_email.verifying_kicker')}
      title={t('auth.verify_email.verifying_title')}
      backHref={AppPaths.HOME}
    >
      <p role="status" className="text-body text-muted-foreground">
        {t('auth.verify_email.verifying_description')}
      </p>
    </AuthShell>
  )
}

function InvalidLinkState(): React.JSX.Element {
  const t = useTranslate()
  const storedEmail = useStoredUserEmail()
  return (
    <AuthShell
      backdrop={AuthBackdrops.ROSE}
      art={<EnvelopeArt />}
      desktopPanel={null}
      kicker={t('auth.verify_email.invalid_kicker')}
      title={t('auth.verify_email.invalid_title')}
      backHref={AppPaths.HOME}
    >
      <p className="text-body text-muted-foreground">
        {t('auth.verify_email.invalid_description')}
      </p>
      <ResendVerificationForm key={storedEmail} defaultEmail={storedEmail ?? ''} />
    </AuthShell>
  )
}

type FailedStatus =
  typeof EmailVerificationStatuses.FAILED | typeof EmailVerificationStatuses.TOO_MANY_ATTEMPTS

interface FailedStateProps {
  status: FailedStatus
  onRetry: () => void
}

function FailedState({ status, onRetry }: FailedStateProps): React.JSX.Element {
  const t = useTranslate()
  const isRateLimited = status === EmailVerificationStatuses.TOO_MANY_ATTEMPTS
  return (
    <AuthShell
      backdrop={AuthBackdrops.ROSE}
      art={<EnvelopeArt />}
      desktopPanel={null}
      kicker={t('auth.verify_email.failed_kicker')}
      title={t(
        isRateLimited
          ? 'auth.verify_email.too_many_attempts_title'
          : 'auth.verify_email.failed_title',
      )}
      backHref={AppPaths.HOME}
    >
      <p role="alert" className="text-body text-muted-foreground">
        {t(
          isRateLimited
            ? 'auth.verify_email.too_many_attempts_description'
            : 'auth.verify_email.failed_description',
        )}
      </p>
      <Button className="w-full" onClick={onRetry}>
        {t('common.error_state.try_again')}
      </Button>
      <Link href={FEEDBACK_BUG_PATH} className={STANDALONE_AUTH_LINK_CLASS_NAME}>
        {t('common.error_state.report')}
      </Link>
    </AuthShell>
  )
}

function SigningInState(): React.JSX.Element {
  const router = useRouter()
  const openOnboarding = useCallback(() => {
    router.replace(AppPaths.NEW_LIST)
  }, [router])
  return (
    <VerifiedState
      descriptionId="auth.verify_email.signing_in_description"
      onWrapped={openOnboarding}
    >
      <ContinueLink href={AppPaths.NEW_LIST} labelId="auth.verify_email.continue" />
    </VerifiedState>
  )
}

interface VerifiedStateProps {
  descriptionId: MessageId
  onWrapped: (() => void) | null
  children?: React.ReactNode
}

function VerifiedState({
  descriptionId,
  onWrapped,
  children = null,
}: VerifiedStateProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <AuthShell
      backdrop={AuthBackdrops.MINT}
      art={<VerifiedArt onWrapped={onWrapped ?? doNothing} />}
      desktopPanel={null}
      kicker={t('auth.verify_email.verified_kicker')}
      title={t('auth.verify_email.verified_title')}
      backHref={AppPaths.HOME}
    >
      <p role="status" className="text-body text-muted-foreground">
        {t(descriptionId)}
      </p>
      {children}
    </AuthShell>
  )
}

interface ContinueLinkProps {
  href: string
  labelId: MessageId
}

function ContinueLink({ href, labelId }: ContinueLinkProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <Button asChild className="w-full">
      <Link href={href}>{t(labelId)}</Link>
    </Button>
  )
}
