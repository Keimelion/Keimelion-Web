'use client'

import Link from 'next/link'
import { AuthBackdrops, AuthShell } from '@/components/shared/auth-shell'
import { Button } from '@/components/ui/button'
import { KeyArt } from '@/features/auth/components/auth-art'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import { useResetPasswordForm } from '@/features/auth/hooks/use-reset-password-form'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

export function ResetPasswordScreen(): React.JSX.Element {
  const t = useTranslate()
  const { form, submit, isPending, isLinkExpired } = useResetPasswordForm()
  return (
    <AuthShell
      backdrop={AuthBackdrops.GINGHAM}
      art={<KeyArt />}
      desktopPanel={null}
      kicker={t(
        isLinkExpired ? 'auth.reset_password.expired_kicker' : 'auth.reset_password.kicker',
      )}
      title={t(isLinkExpired ? 'auth.reset_password.expired_title' : 'auth.reset_password.title')}
      backHref={AppPaths.LOGIN}
    >
      {isLinkExpired ? (
        <ExpiredResetLink />
      ) : (
        <ResetPasswordForm form={form} submit={submit} isPending={isPending} />
      )}
    </AuthShell>
  )
}

function ExpiredResetLink(): React.JSX.Element {
  const t = useTranslate()
  return (
    <>
      <p className="text-body text-muted-foreground">
        {t('auth.reset_password.expired_description')}
      </p>
      <Button asChild className="w-full">
        <Link href={AppPaths.FORGOT_PASSWORD}>{t('auth.reset_password.ask_new_link')}</Link>
      </Button>
    </>
  )
}
