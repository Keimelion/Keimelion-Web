'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ResendVerificationInput } from '@/features/auth/auth.input-schemas'
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
      <Card className="mt-6 w-full p-4 text-left">
        <form
          noValidate
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            void form.handleSubmit(submit)(event)
          }}
        >
          <h2 className="text-title">{t('auth.resend_verification.title')}</h2>
          <p className="text-small text-muted-foreground">{t('auth.resend_verification.hint')}</p>
          <ResendEmailField form={form} isDisabled={isPending} />
          <ResendSubmitButton remainingSeconds={remainingSeconds} isPending={isPending} />
          <p role="status" className="min-h-[18px] text-small font-medium">
            {outcomeId === null ? null : t(outcomeId)}
          </p>
        </form>
      </Card>
    </Form>
  )
}

interface ResendEmailFieldProps {
  form: UseFormReturn<ResendVerificationInput>
  isDisabled: boolean
}

function ResendEmailField({ form, isDisabled }: ResendEmailFieldProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>{t('auth.resend_verification.email_label')}</FormLabel>
          <FormControl>
            <Input type="email" autoComplete="email" disabled={isDisabled} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
      className="w-full lg:w-fit"
      disabled={isCoolingDown}
      isLoading={isPending}
    >
      {isCoolingDown
        ? t('auth.resend_verification.cooldown', { seconds: remainingSeconds })
        : t('auth.resend_verification.submit')}
    </Button>
  )
}
