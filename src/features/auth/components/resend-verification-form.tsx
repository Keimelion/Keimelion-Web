'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AuthTextField } from '@/features/auth/components/auth-fields'
import { AuthStatusMessage } from '@/features/auth/components/auth-status-message'
import { useResendVerificationForm } from '@/features/auth/hooks/use-resend-verification-form'
import { useTranslate } from '@/lib/i18n/use-translate'

interface ResendVerificationFormProps {
  defaultEmail: string
}

export function ResendVerificationForm({
  defaultEmail,
}: ResendVerificationFormProps): React.JSX.Element {
  const t = useTranslate()
  const { form, submit, isPending, remainingSeconds, outcomeId } =
    useResendVerificationForm(defaultEmail)
  return (
    <Form {...form}>
      <form
        noValidate
        className="mt-2 flex flex-col gap-3 border-t border-rule pt-5"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event)
        }}
      >
        <h2 className="text-title">{t('auth.resend_verification.title')}</h2>
        <p className="text-small text-muted-foreground">{t('auth.resend_verification.hint')}</p>
        <AuthTextField
          control={form.control}
          name="email"
          type="email"
          label={t('auth.fields.email_label')}
          description={null}
          inputProps={{ autoComplete: 'email', disabled: isPending }}
        />
        <ResendSubmitButton remainingSeconds={remainingSeconds} isPending={isPending} />
        <AuthStatusMessage message={outcomeId === null ? null : t(outcomeId)} />
      </form>
    </Form>
  )
}

interface ResendSubmitButtonProps {
  remainingSeconds: number
  isPending: boolean
}

function ResendSubmitButton({
  remainingSeconds,
  isPending,
}: ResendSubmitButtonProps): React.JSX.Element {
  const t = useTranslate()
  const isCoolingDown = remainingSeconds > 0
  return (
    <Button
      type="submit"
      variant="ghost"
      className="w-full"
      disabled={isCoolingDown}
      isLoading={isPending}
    >
      {isCoolingDown
        ? t('auth.resend_verification.cooldown', { seconds: remainingSeconds })
        : t('auth.resend_verification.submit')}
    </Button>
  )
}
