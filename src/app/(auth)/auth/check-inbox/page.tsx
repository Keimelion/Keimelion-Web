import type { Metadata } from 'next'
import { CheckInboxScreen } from '@/features/auth/components/check-inbox-screen'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('auth.check_inbox.title') }
}

export default function CheckInboxPage(): React.JSX.Element {
  return <CheckInboxScreen />
}
