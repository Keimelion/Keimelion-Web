'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { ErrorCode } from '@keimelion/sdk/enums'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@keimelion/sdk/schemas'
import {
  AUTH_FORM_ROOT_ERROR,
  findRejectedField,
  hasErrorCode,
  resolveRequestErrorId,
} from '@/features/auth/auth-form-errors'
import type { AuthFormError } from '@/features/auth/auth-form-errors'
import { resetPasswordInputSchema } from '@/features/auth/auth.input-schemas'
import type { ResetPasswordInput } from '@/features/auth/auth.input-schemas'
import { useResetPassword } from '@/features/auth/hooks/use-reset-password'
import {
  ResetTokenStates,
  useResetPasswordToken,
} from '@/features/auth/hooks/use-reset-password-token'
import { AppPaths } from '@/lib/app-paths'
import { translate } from '@/lib/i18n/translate'
import { notifySuccess } from '@/lib/notify'

const RESET_PASSWORD_FIELDS = ['password'] as const

type ResetPasswordField = (typeof RESET_PASSWORD_FIELDS)[number]

interface ResetPasswordForm {
  form: UseFormReturn<ResetPasswordInput>
  submit: (values: ResetPasswordInput) => void
  isPending: boolean
  isLinkExpired: boolean
}

export function useResetPasswordForm(): ResetPasswordForm {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { state, token } = useResetPasswordToken()
  const reset = useResetPassword()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmation: '' },
  })
  const submit = (values: ResetPasswordInput): void => {
    if (token === null) return
    reset.mutate(
      { passwordResetToken: token, password: values.password },
      {
        onSuccess: () => {
          queryClient.clear()
          notifySuccess({ title: translate('auth.reset_password.saved') })
          router.replace(AppPaths.LOGIN)
        },
        onError: (error) => {
          if (hasErrorCode(error, ErrorCode.INVALID_RESET_TOKEN)) return
          const { field, message } = resolveResetPasswordError(error)
          form.setError(field, { message }, { shouldFocus: true })
        },
      },
    )
  }
  return {
    form,
    submit,
    isPending: reset.isPending || reset.isSuccess || state === ResetTokenStates.READING,
    isLinkExpired:
      state === ResetTokenStates.MISSING ||
      hasErrorCode(reset.error, ErrorCode.INVALID_RESET_TOKEN),
  }
}

function resolveResetPasswordError(error: Error): AuthFormError<ResetPasswordField> {
  if (findRejectedField(error, RESET_PASSWORD_FIELDS) === 'password') {
    return {
      field: 'password',
      message: translate('auth.fields.password_rules', {
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH,
      }),
    }
  }
  return { field: AUTH_FORM_ROOT_ERROR, message: translate(resolveRequestErrorId(error)) }
}
