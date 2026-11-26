import type { Metadata } from 'next'
import { LoginScreen } from '@/features/auth/components/login-screen'
import { AppPaths, LOGIN_RETURN_PARAM } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import {
  buildAuthPathKeepingReturn,
  readSearchParam,
  resolveLoginReturnPath,
} from '@/lib/login-return-path'

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.login.title') }
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.JSX.Element> {
  const rawReturnPath = readSearchParam(await searchParams, LOGIN_RETURN_PARAM)
  return (
    <LoginScreen
      returnPath={resolveLoginReturnPath(rawReturnPath)}
      signupHref={buildAuthPathKeepingReturn(AppPaths.SIGNUP, rawReturnPath)}
    />
  )
}
