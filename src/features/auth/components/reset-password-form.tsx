'use client'

import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import type { ResetPasswordInput } from '@/features/auth/auth.input-schemas'
import { AuthPasswordField } from '@/features/auth/components/auth-fields'
import { AuthFormRootError } from '@/features/auth/components/auth-form-root-error'
import { PasswordStrengthMeter } from '@/features/auth/components/password-strength-meter'
import { useTranslate } from '@/lib/i18n/use-translate'

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordInput>
  submit: (values: ResetPasswordInput) => void
  isPending: boolean
}

export function ResetPasswordForm({
  form,
  submit,
  isPending,
}: ResetPasswordFormProps): React.JSX.Element {
  const t = useTranslate()
  const password = useWatch({ control: form.control, name: 'password' })
  return (
    <Form {...form}>
      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event)
        }}
      >
        <AuthPasswordField
          control={form.control}
          name="password"
          label={t('auth.reset_password.password_label')}
          description={<PasswordStrengthMeter password={password} />}
          inputProps={{ autoComplete: 'new-password', disabled: isPending }}
        />
        <AuthPasswordField
          control={form.control}
          name="confirmation"
          label={t('auth.reset_password.confirmation_label')}
          description={null}
          inputProps={{ autoComplete: 'new-password', disabled: isPending }}
        />
        <AuthFormRootError message={form.formState.errors.root?.server?.message} />
        <Button type="submit" className="w-full" isLoading={isPending}>
          {t('auth.reset_password.submit')}
        </Button>
      </form>
    </Form>
  )
}
