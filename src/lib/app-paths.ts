export const AppPaths = {
  HOME: '/',
  BROWSE: '/browse',
  LOGIN: '/auth/login',
  VERIFY_EMAIL: '/auth/verify-email',
  CHECK_INBOX: '/auth/check-inbox',
  RESET_PASSWORD: '/auth/reset-password',
  LISTS: '/lists',
  NEW_LIST: '/lists/new',
  PROFILE: '/profile',
  FEEDBACK: '/feedback',
  LEGAL_NOTICE: '/legal/notice',
  TERMS_OF_USE: '/legal/terms',
  PRIVACY: '/legal/privacy',
  AFFILIATE_LINKS: '/legal/affiliate-links',
  COOKIES: '/legal/cookies',
  ACCEPT_LIST_INVITE: '/invites/accept',
  DEV_TOKENS: '/dev/tokens',
} as const

export const SIGNED_IN_PATH_PREFIXES: readonly string[] = [AppPaths.LISTS, AppPaths.PROFILE]

export const LOGIN_RETURN_PARAM = 'next'

export const FEEDBACK_BUG_PATH = `${AppPaths.FEEDBACK}?type=bug`

export function isPathWithin(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}
