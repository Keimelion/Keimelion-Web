import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, isValidSessionCookie } from './auth-storage'

export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidSessionCookie(cookieStore.get(SESSION_COOKIE_NAME)?.value)
}
