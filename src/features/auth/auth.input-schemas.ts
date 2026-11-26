import { z } from 'zod'
import { verifyEmailRequestSchema } from '@keimelion/sdk/schemas'
import { translate } from '@/lib/i18n/translate'

const VERIFICATION_TOKEN_PARAM = 'token'
const URL_FRAGMENT_PREFIX = '#'

export const resendVerificationInputSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: () => translate('auth.resend_verification.email_invalid') })),
})

export type ResendVerificationInput = z.infer<typeof resendVerificationInputSchema>

export function parseVerificationToken(urlFragment: string): string | null {
  const fragment = urlFragment.startsWith(URL_FRAGMENT_PREFIX) ? urlFragment.slice(1) : urlFragment
  const token = new URLSearchParams(fragment).get(VERIFICATION_TOKEN_PARAM)
  const parsed = verifyEmailRequestSchema.safeParse({ token })
  return parsed.success ? parsed.data.token : null
}
