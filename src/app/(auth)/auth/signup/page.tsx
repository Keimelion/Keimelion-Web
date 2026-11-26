import type { Metadata } from 'next'
import { SignupScreen } from '@/features/auth/components/signup-screen'
import { AppPaths, LOGIN_RETURN_PARAM } from '@/lib/app-paths'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { buildAuthPathKeepingReturn, readSearchParam } from '@/lib/login-return-path'

interface SignupPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.signup.title') }
}

export default async function SignupPage({
  searchParams,
}: SignupPageProps): Promise<React.JSX.Element> {
  const rawReturnPath = readSearchParam(await searchParams, LOGIN_RETURN_PARAM)
  return <SignupScreen loginHref={buildAuthPathKeepingReturn(AppPaths.LOGIN, rawReturnPath)} />
}
