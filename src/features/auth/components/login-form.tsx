'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AuthPasswordField, AuthTextField } from '@/features/auth/components/auth-fields'
import { AuthFormRootError } from '@/features/auth/components/auth-form-root-error'
import {
  INLINE_AUTH_LINK_CLASS_NAME,
  STANDALONE_AUTH_LINK_CLASS_NAME,
} from '@/features/auth/components/auth-link-styles'
import { useLoginForm } from '@/features/auth/hooks/use-login-form'
import { AppPaths } from '@/lib/app-paths'
import { useTranslate } from '@/lib/i18n/use-translate'

interface LoginFormProps {
  returnPath: string
  signupHref: string
}

export function LoginForm({ returnPath, signupHref }: LoginFormProps): React.JSX.Element {
  const t = useTranslate()
  const { form, submit, isPending } = useLoginForm(returnPath)
  return (
    <Form {...form}>
      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event)
        }}
      >
        <AuthTextField
          control={form.control}
          name="email"
          type="email"
          label={t('auth.fields.email_label')}
          description={null}
          inputProps={{ autoComplete: 'email', disabled: isPending }}
        />
        <AuthPasswordField
          control={form.control}
          name="password"
          label={t('auth.fields.password_label')}
          description={null}
          inputProps={{ autoComplete: 'current-password', disabled: isPending }}
        >
          <Link href={AppPaths.FORGOT_PASSWORD} className={STANDALONE_AUTH_LINK_CLASS_NAME}>
            {t('auth.login.forgot_password')}
          </Link>
        </AuthPasswordField>
        <AuthFormRootError message={form.formState.errors.root?.server?.message} />
        <Button type="submit" className="w-full" isLoading={isPending}>
          {t('auth.login.submit')}
        </Button>
        <p className="text-center text-[15px] text-muted-foreground lg:text-left">
          {t('auth.login.new_here')}{' '}
          <Link href={signupHref} className={INLINE_AUTH_LINK_CLASS_NAME}>
            {t('auth.login.create_account')}
          </Link>
        </p>
      </form>
    </Form>
  )
}
