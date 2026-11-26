'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import {
  AUTH_FORM_ROOT_ERROR,
  findRejectedField,
  resolveRequestErrorId,
} from '@/features/auth/auth-form-errors'
import type { AuthFormError } from '@/features/auth/auth-form-errors'
import { forgotPasswordInputSchema } from '@/features/auth/auth.input-schemas'
import type { ForgotPasswordInput } from '@/features/auth/auth.input-schemas'
import { useRequestPasswordReset } from '@/features/auth/hooks/use-request-password-reset'
import { translate } from '@/lib/i18n/translate'

const FORGOT_PASSWORD_FIELDS = ['email'] as const

type ForgotPasswordField = (typeof FORGOT_PASSWORD_FIELDS)[number]

interface ForgotPasswordForm {
  form: UseFormReturn<ForgotPasswordInput>
  submit: (values: ForgotPasswordInput) => void
  isPending: boolean
  sentToEmail: string | null
}

export function useForgotPasswordForm(): ForgotPasswordForm {
  const resetRequest = useRequestPasswordReset()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  })
  const submit = (values: ForgotPasswordInput): void => {
    resetRequest.mutate(values, {
      onError: (error) => {
        const { field, message } = resolveForgotPasswordError(error)
        form.setError(field, { message }, { shouldFocus: true })
      },
    })
  }
  return {
    form,
    submit,
    isPending: resetRequest.isPending,
    sentToEmail: resetRequest.isSuccess ? resetRequest.variables.email : null,
  }
}

function resolveForgotPasswordError(error: Error): AuthFormError<ForgotPasswordField> {
  if (findRejectedField(error, FORGOT_PASSWORD_FIELDS) === 'email') {
    return { field: 'email', message: translate('auth.fields.email_invalid') }
  }
  return { field: AUTH_FORM_ROOT_ERROR, message: translate(resolveRequestErrorId(error)) }
}
