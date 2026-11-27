'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { ErrorCode } from '@keimelion/sdk/enums'
import {
  AUTH_FORM_ROOT_ERROR,
  findRejectedField,
  hasErrorCode,
  resolveRequestErrorId,
} from '@/features/auth/auth-form-errors'
import type { AuthFormError } from '@/features/auth/auth-form-errors'
import { loginInputSchema } from '@/features/auth/auth.input-schemas'
import type { LoginInput } from '@/features/auth/auth.input-schemas'
import { useLogin } from '@/features/auth/hooks/use-login'
import { rememberPendingVerificationEmail } from '@/features/auth/hooks/use-pending-verification-email'
import { AppPaths } from '@/lib/app-paths'
import { translate } from '@/lib/i18n/translate'

const LOGIN_FIELDS = ['email', 'password'] as const

type LoginField = (typeof LOGIN_FIELDS)[number]

interface LoginForm {
  form: UseFormReturn<LoginInput>
  submit: (values: LoginInput) => void
  isPending: boolean
}

export function useLoginForm(returnPath: string): LoginForm {
  const router = useRouter()
  const queryClient = useQueryClient()
  const loginMutation = useLogin()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })
  const submit = (values: LoginInput): void => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        queryClient.clear()
        router.replace(returnPath)
        router.refresh()
      },
      onError: (error) => {
        if (hasErrorCode(error, ErrorCode.EMAIL_NOT_VERIFIED)) {
          rememberPendingVerificationEmail(values.email)
          router.push(AppPaths.CHECK_INBOX)
          return
        }
        const { field, message } = resolveLoginError(error)
        form.setError(field, { message }, { shouldFocus: true })
      },
    })
  }
  return { form, submit, isPending: loginMutation.isPending || loginMutation.isSuccess }
}

function resolveLoginError(error: Error): AuthFormError<LoginField> {
  if (
    hasErrorCode(error, ErrorCode.UNAUTHORIZED) ||
    hasErrorCode(error, ErrorCode.INVALID_CREDENTIALS)
  ) {
    return { field: 'password', message: translate('auth.login.wrong_credentials') }
  }
  const rejectedField = findRejectedField(error, LOGIN_FIELDS)
  if (rejectedField === 'email') {
    return { field: 'email', message: translate('auth.fields.email_invalid') }
  }
  if (rejectedField === 'password') {
    return { field: 'password', message: translate('auth.fields.password_required') }
  }
  return { field: AUTH_FORM_ROOT_ERROR, message: translate(resolveRequestErrorId(error)) }
}
