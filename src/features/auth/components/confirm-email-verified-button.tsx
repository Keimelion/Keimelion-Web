'use client'

import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import { Button } from '@/components/ui/button'
import { AuthStatusMessage } from '@/features/auth/components/auth-status-message'
import { useConfirmEmailVerified } from '@/features/auth/hooks/use-confirm-email-verified'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'

export function ConfirmEmailVerifiedButton(): React.JSX.Element {
  const t = useTranslate()
  const confirmation = useConfirmEmailVerified()
  const hintId = confirmation.error === null ? null : resolveHintId(confirmation.error)
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-2">
      <Button
        className="w-full lg:w-fit"
        isLoading={confirmation.isPending}
        onClick={() => {
          confirmation.mutate()
        }}
      >
        {t('auth.check_inbox.confirm')}
      </Button>
      <AuthStatusMessage message={hintId === null ? null : t(hintId)} />
    </div>
  )
}

function resolveHintId(error: Error): MessageId {
  if (error instanceof ApiError && error.code === ErrorCode.EMAIL_NOT_VERIFIED) {
    return 'auth.check_inbox.not_verified_yet'
  }
  return 'auth.check_inbox.check_failed'
}
