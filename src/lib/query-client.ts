import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ErrorCode, HttpStatus } from '@keimelion/sdk/enums'
import { clearSession } from '@/data-access/_shared/auth-storage'
import { AppPaths, isPathWithin } from '@/lib/app-paths'
import { translate } from '@/lib/i18n/translate'
import { buildLoginPathFromCurrentPage } from '@/lib/login-return-path'
import { notifyError } from '@/lib/notify'
import { shareEqualStructure } from '@/lib/share-equal-structure'
import { ApiError } from '@keimelion/sdk/client'

const STALE_TIME_MS = 1000 * 60 * 5

interface MutationMeta {
  silent?: boolean
  skipUnauthorizedRedirect?: boolean
}

const EMAIL_VERIFICATION_PATHS: readonly string[] = [AppPaths.CHECK_INBOX, AppPaths.VERIFY_EMAIL]

let redirectInFlight = false
let accountBannedHandled = false

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === HttpStatus.UNAUTHORIZED
}

function isForbiddenWithCode(error: unknown, code: ErrorCode): boolean {
  return error instanceof ApiError && error.status === HttpStatus.FORBIDDEN && error.code === code
}

function isAccountBanned(error: unknown): boolean {
  return isForbiddenWithCode(error, ErrorCode.ACCOUNT_BANNED)
}

function isEmailNotVerified(error: unknown): boolean {
  return isForbiddenWithCode(error, ErrorCode.EMAIL_NOT_VERIFIED)
}

function sendToCheckInbox(): void {
  const { pathname } = window.location
  if (redirectInFlight || EMAIL_VERIFICATION_PATHS.some((path) => isPathWithin(pathname, path))) {
    return
  }
  redirectInFlight = true
  window.location.assign(AppPaths.CHECK_INBOX)
}

function handleAccountBanned(client: QueryClient): void {
  if (accountBannedHandled) return
  accountBannedHandled = true
  client.clear()
}

function handleUnauthorized(client: QueryClient): void {
  if (redirectInFlight) return
  redirectInFlight = true
  clearSession()
  client.clear()
  window.location.assign(buildLoginPathFromCurrentPage())
}

export function createQueryClient(): QueryClient {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorized(error)) {
          handleUnauthorized(client)
          return
        }
        if (isEmailNotVerified(error)) {
          sendToCheckInbox()
          return
        }
        if (isAccountBanned(error)) {
          handleAccountBanned(client)
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const meta = mutation.options.meta as MutationMeta | undefined

        if (isUnauthorized(error) && meta?.skipUnauthorizedRedirect !== true) {
          handleUnauthorized(client)
          return
        }

        if (isEmailNotVerified(error)) {
          sendToCheckInbox()
          return
        }

        if (isAccountBanned(error)) {
          handleAccountBanned(client)
        }

        if (meta?.silent === true) return

        if (error instanceof Error) {
          notifyError(error)
          return
        }
        notifyError({ title: translate('query.error.default') })
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        structuralSharing: shareEqualStructure,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < HttpStatus.INTERNAL_SERVER_ERROR) {
            return false
          }
          return failureCount < 2
        },
      },
    },
  })
  return client
}

export const queryClient = createQueryClient()
