import type {
  ForgotPasswordResponseParsed,
  LoginRequestInput,
  LoginResponseParsed,
  RegisterRequestInput,
  RegisterResponseParsed,
  ResendVerificationResponseParsed,
  ResetPasswordRequestInput,
  ResetPasswordResponseParsed,
  VerifyEmailResponseParsed,
} from '@keimelion/sdk/schemas'
import { apiClient } from '@/data-access/_shared/client'

export async function login(input: LoginRequestInput): Promise<LoginResponseParsed> {
  return apiClient.auth.login(input)
}

export async function register(input: RegisterRequestInput): Promise<RegisterResponseParsed> {
  return apiClient.auth.register(input)
}

export async function logout(refreshToken: string | null): Promise<void> {
  await apiClient.auth.logout(refreshToken === null ? {} : { refreshToken })
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponseParsed> {
  return apiClient.auth.verifyEmail({ token })
}

export async function resendVerification(email: string): Promise<ResendVerificationResponseParsed> {
  return apiClient.auth.resendVerification({ email })
}

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResponseParsed> {
  return apiClient.auth.forgotPassword({ email })
}

export async function resetPassword(
  input: ResetPasswordRequestInput,
): Promise<ResetPasswordResponseParsed> {
  return apiClient.auth.resetPassword(input)
}
