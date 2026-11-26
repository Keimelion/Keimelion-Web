import type {
  ResendVerificationResponseParsed,
  VerifyEmailResponseParsed,
} from '@keimelion/sdk/schemas'
import { apiClient } from '@/data-access/_shared/client'

export async function logout(refreshToken: string | null): Promise<void> {
  await apiClient.auth.logout(refreshToken === null ? {} : { refreshToken })
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponseParsed> {
  return apiClient.auth.verifyEmail({ token })
}

export async function resendVerification(email: string): Promise<ResendVerificationResponseParsed> {
  return apiClient.auth.resendVerification({ email })
}
