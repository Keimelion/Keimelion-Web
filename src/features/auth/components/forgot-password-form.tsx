'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AuthTextField } from '@/features/auth/components/auth-fields'
import { AuthFormRootError } from '@/features/auth/components/auth-form-root-error'
import { STANDALONE_AUTH_LINK_CLASS_NAME } from '@/features/auth/components/auth-link-styles'
import { useForgotPasswordForm } from '@/features/auth/hooks/use-forgot-password-form'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

export function ForgotPasswordForm(): React.JSX.Element {
  const t = useTranslate()
  const { form, submit, isPending, sentToEmail } = useForgotPasswordForm()
  return (
    <Form {...form}>
      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event)
        }}
      >
        <p className="text-body text-muted-foreground">{t('auth.forgot_password.description')}</p>
        <AuthTextField
          control={form.control}
          name="email"
          type="email"
          label={t('auth.fields.email_label')}
          description={null}
          inputProps={{ autoComplete: 'email', disabled: isPending }}
        />
        <AuthFormRootError message={form.formState.errors.root?.server?.message} />
        <Button type="submit" className="w-full" isLoading={isPending}>
          {t('auth.forgot_password.submit')}
        </Button>
        <p role="status" className="empty:hidden">
          {sentToEmail === null ? null : <ResetLinkSent email={sentToEmail} />}
        </p>
        <Link href={AppPaths.LOGIN} className={STANDALONE_AUTH_LINK_CLASS_NAME}>
          {t('auth.forgot_password.back_to_login')}
        </Link>
      </form>
    </Form>
  )
}

interface ResetLinkSentProps {
  email: string
}

function ResetLinkSent({ email }: ResetLinkSentProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <span className="flex gap-2.5 rounded-field bg-raised p-3.5 text-small text-ink">
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-pill bg-success" />
      <span className="wrap-anywhere">{t('auth.forgot_password.sent', { email })}</span>
    </span>
  )
}
