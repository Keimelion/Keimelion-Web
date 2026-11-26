'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { MIN_PASSWORD_LENGTH } from '@keimelion/sdk/schemas'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import type { SignupInput } from '@/features/auth/auth.input-schemas'
import { AuthPasswordField, AuthTextField } from '@/features/auth/components/auth-fields'
import { AuthFormRootError } from '@/features/auth/components/auth-form-root-error'
import { INLINE_AUTH_LINK_CLASS_NAME } from '@/features/auth/components/auth-link-styles'
import { LegalDocumentSheet } from '@/features/auth/components/legal-document-sheet'
import { SignupTerms } from '@/features/auth/components/signup-terms'
import { useSignupForm } from '@/features/auth/hooks/use-signup-form'
import { useTranslate } from '@/lib/i18n/use-translate'

interface SignupFormProps {
  loginHref: string
  returnPath: string | null
}

export function SignupForm({ loginHref, returnPath }: SignupFormProps): React.JSX.Element {
  const t = useTranslate()
  const { form, submit, isPending } = useSignupForm(returnPath)
  const [openLegalTitle, setOpenLegalTitle] = useState<string | null>(null)
  return (
    <Form {...form}>
      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event)
        }}
      >
        <SignupFields form={form} isPending={isPending} />
        <SignupTerms onOpenDocument={setOpenLegalTitle} />
        <AuthFormRootError message={form.formState.errors.root?.server?.message} />
        <Button type="submit" className="w-full" isLoading={isPending}>
          {t('auth.signup.submit')}
        </Button>
        <p className="text-center text-[15px] text-muted-foreground lg:text-left">
          {t('auth.signup.have_account')}{' '}
          <Link href={loginHref} className={INLINE_AUTH_LINK_CLASS_NAME}>
            {t('auth.signup.log_in')}
          </Link>
        </p>
      </form>
      <LegalDocumentSheet
        title={openLegalTitle}
        onClose={() => {
          setOpenLegalTitle(null)
        }}
      />
    </Form>
  )
}

interface SignupFieldsProps {
  form: UseFormReturn<SignupInput>
  isPending: boolean
}

function SignupFields({ form, isPending }: SignupFieldsProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <>
      <AuthTextField
        control={form.control}
        name="username"
        type="text"
        label={t('auth.fields.first_name_label')}
        description={null}
        inputProps={{ autoComplete: 'given-name', disabled: isPending }}
      />
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
        description={t('auth.fields.password_hint', { min: MIN_PASSWORD_LENGTH })}
        inputProps={{ autoComplete: 'new-password', disabled: isPending }}
      />
    </>
  )
}
