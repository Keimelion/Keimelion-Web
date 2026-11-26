'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import { resendVerificationInputSchema } from '@/features/auth/auth.input-schemas'
import type { ResendVerificationInput } from '@/features/auth/auth.input-schemas'
import { useResendCooldown } from '@/features/auth/hooks/use-resend-cooldown'
import { useResendVerification } from '@/features/auth/hooks/use-resend-verification'
import type { MessageId } from '@/lib/i18n/messages'

interface ResendVerificationForm {
  form: UseFormReturn<ResendVerificationInput>
  submit: (values: ResendVerificationInput) => void
  isPending: boolean
  remainingSeconds: number
  outcomeId: MessageId | null
}

export function useResendVerificationForm(defaultEmail: string): ResendVerificationForm {
  const resend = useResendVerification()
  const { remainingSeconds, startCooldown } = useResendCooldown()
  const form = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationInputSchema),
    mode: 'onTouched',
    defaultValues: { email: defaultEmail },
  })
  return {
    form,
    submit: (values) => {
      resend.mutate(values, { onSuccess: startCooldown })
    },
    isPending: resend.isPending,
    remainingSeconds,
    outcomeId: resolveOutcomeId(resend.isSuccess, resend.error),
  }
}

function resolveOutcomeId(isSuccess: boolean, error: Error | null): MessageId | null {
  if (isSuccess) return 'auth.resend_verification.sent'
  if (error === null) return null
  if (error instanceof ApiError && error.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
    return 'auth.resend_verification.too_many_attempts'
  }
  return 'auth.resend_verification.failed'
}
