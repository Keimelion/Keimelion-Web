import { getPostVerificationPath } from '@/data-access/_shared/auth-storage'
import { AppPaths } from '@/lib/app-paths'
import { resolveLoginReturnPath } from '@/lib/login-return-path'

export function resolvePostVerificationPath(): string {
  const storedPath = getPostVerificationPath()
  return storedPath === null ? AppPaths.NEW_LIST : resolveLoginReturnPath(storedPath)
}
