'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { signupInputSchema } from '@/features/auth/auth.input-schemas'
import type { SignupInput } from '@/features/auth/auth.input-schemas'
import { useSignup } from '@/features/auth/hooks/use-signup'
import { translate } from '@/lib/i18n/translate'

const SIGNUP_FIELDS = ['username', 'email', 'password'] as const

type SignupField = (typeof SIGNUP_FIELDS)[number]

interface SignupForm {
  form: UseFormReturn<SignupInput>
  submit: (values: SignupInput) => void
  isPending: boolean
}

export function useSignupForm(returnPath: string | null): SignupForm {
  const router = useRouter()
  const signup = useSignup(returnPath)
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupInputSchema),
    mode: 'onTouched',
    defaultValues: { username: '', email: '', password: '' },
  })
  const submit = (values: SignupInput): void => {
    signup.mutate(values, {
      onSuccess: (destination) => {
        router.replace(destination)
        router.refresh()
      },
      onError: (error) => {
        const { field, message } = resolveSignupError(error)
        form.setError(field, { message }, { shouldFocus: true })
      },
    })
  }
  return { form, submit, isPending: signup.isPending || signup.isSuccess }
}

function resolveSignupError(error: Error): AuthFormError<SignupField> {
  if (hasErrorCode(error, ErrorCode.CONFLICT)) {
    return { field: 'email', message: translate('auth.signup.email_taken') }
  }
  switch (findRejectedField(error, SIGNUP_FIELDS)) {
    case 'username':
      return { field: 'username', message: translate('auth.fields.first_name_invalid') }
    case 'email':
      return { field: 'email', message: translate('auth.fields.email_invalid') }
    case 'password':
      return {
        field: 'password',
        message: translate('auth.fields.password_rules', {
          min: MIN_PASSWORD_LENGTH,
          max: MAX_PASSWORD_LENGTH,
        }),
      }
    default:
      return { field: AUTH_FORM_ROOT_ERROR, message: translate(resolveRequestErrorId(error)) }
  }
}
