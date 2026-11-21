export const AppPaths = {
  HOME: '/',
  LOGIN: '/auth/login',
  VERIFY_EMAIL: '/auth/verify-email',
  RESET_PASSWORD: '/auth/reset-password',
  LISTS: '/lists',
  ACCEPT_LIST_INVITE: '/invites/accept',
} as const

export const SIGNED_IN_PATH_PREFIXES: readonly string[] = [AppPaths.LISTS]
