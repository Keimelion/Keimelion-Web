import type { Metadata } from 'next'
import { Bricolage_Grotesque, Caveat, DM_Mono, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/providers'
import { getRequestLocale, getServerTranslate } from '@/lib/i18n/server-translate'
import './globals.css'
import '@/styles/tokens.css'
import '@/components/ui/sonner/sonner.css'
import '@/components/shared/theme-picker/theme-picker.css'

const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: '800',
  variable: '--font-bricolage-grotesque',
})
const textFont = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const monoFont = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono' })
const handwrittenFont = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

const FONT_VARIABLES = [
  displayFont.variable,
  textFont.variable,
  monoFont.variable,
  handwrittenFont.variable,
].join(' ')

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL ?? ''

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  const appName = t('common.app_name')
  return {
    metadataBase: WEB_APP_URL === '' ? null : new URL(WEB_APP_URL),
    title: { default: appName, template: `%s · ${appName}` },
    description: t('common.metadata.description'),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const locale = await getRequestLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${FONT_VARIABLES} font-sans antialiased`}>
        <Providers requestLocale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
