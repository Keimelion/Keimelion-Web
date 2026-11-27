import { z } from 'zod'
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  USERNAME_REGEX,
  resetPasswordRequestSchema,
  verifyEmailRequestSchema,
} from '@keimelion/sdk/schemas'
import { translate } from '@/lib/i18n/translate'

const LINK_TOKEN_PARAM = 'token'
const URL_FRAGMENT_PREFIX = '#'

const emailInputSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: () => translate('auth.fields.email_invalid') }))

const newPasswordInputSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, {
    error: () => translate('auth.fields.password_too_short', { min: MIN_PASSWORD_LENGTH }),
  })
  .max(MAX_PASSWORD_LENGTH, {
    error: () => translate('auth.fields.password_too_long', { max: MAX_PASSWORD_LENGTH }),
  })

export const resendVerificationInputSchema = z.object({ email: emailInputSchema })

export type ResendVerificationInput = z.infer<typeof resendVerificationInputSchema>

export const loginInputSchema = z.object({
  email: emailInputSchema,
  password: z.string().min(1, { error: () => translate('auth.fields.password_required') }),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export const signupInputSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(USERNAME_REGEX, { error: () => translate('auth.fields.first_name_invalid') }),
  email: emailInputSchema,
  password: newPasswordInputSchema,
})

export type SignupInput = z.infer<typeof signupInputSchema>

export const forgotPasswordInputSchema = z.object({ email: emailInputSchema })

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>

export const resetPasswordInputSchema = z
  .object({ password: newPasswordInputSchema, confirmation: z.string() })
  .refine((values) => values.password === values.confirmation, {
    path: ['confirmation'],
    error: () => translate('auth.fields.confirmation_mismatch'),
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>

export function parseVerificationToken(urlFragment: string): string | null {
  const parsed = verifyEmailRequestSchema.shape.token.safeParse(readLinkToken(urlFragment))
  return parsed.success ? parsed.data : null
}

export function parseResetToken(urlFragment: string): string | null {
  const parsed = resetPasswordRequestSchema.shape.passwordResetToken.safeParse(
    readLinkToken(urlFragment),
  )
  return parsed.success ? parsed.data : null
}

function readLinkToken(urlFragment: string): string | null {
  const fragment = urlFragment.startsWith(URL_FRAGMENT_PREFIX) ? urlFragment.slice(1) : urlFragment
  return new URLSearchParams(fragment).get(LINK_TOKEN_PARAM)
}
