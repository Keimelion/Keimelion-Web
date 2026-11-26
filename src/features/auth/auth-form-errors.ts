import { ApiError, ClientErrorCode } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'
import type { MessageId } from '@/lib/i18n/messages'

export const AUTH_FORM_ROOT_ERROR = 'root.server'

export interface AuthFormError<TField extends string> {
  field: TField | typeof AUTH_FORM_ROOT_ERROR
  message: string
}

const VALIDATION_ERROR_CODES: readonly string[] = [
  ErrorCode.BAD_REQUEST,
  ErrorCode.UNPROCESSABLE_ENTITY,
]

export function hasErrorCode(error: unknown, code: ErrorCode): error is ApiError {
  return error instanceof ApiError && error.code === code
}

export function findRejectedField<TField extends string>(
  error: unknown,
  fields: readonly TField[],
): TField | null {
  if (!(error instanceof ApiError) || !VALIDATION_ERROR_CODES.includes(error.code)) return null
  const rejectedPaths = error.issues.map((issue) => issue.path)
  return fields.find((field) => rejectedPaths.includes(field)) ?? null
}

export function resolveRequestErrorId(error: unknown): MessageId {
  if (!(error instanceof ApiError)) return 'auth.errors.unexpected'
  switch (error.code) {
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      return 'auth.errors.too_many_attempts'
    case ErrorCode.ACCOUNT_BANNED:
      return 'auth.errors.account_banned'
    case ClientErrorCode.NETWORK_ERROR:
    case ClientErrorCode.TIMEOUT:
      return 'auth.errors.unreachable'
    default:
      return 'auth.errors.unexpected'
  }
}
