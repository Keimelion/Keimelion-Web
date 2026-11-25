import type { Metadata } from 'next'
import { DesignTokensBoard } from '@/features/design-tokens/components/design-tokens-board'
import { BoardThemes } from '@/features/design-tokens/design-tokens'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('dev.tokens.title') }
}

export default async function DesignTokensPage(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <section className="flex flex-col gap-6 py-10 lg:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-m lg:text-display-xl">{t('dev.tokens.title')}</h1>
        <p className="max-w-prose text-body text-muted-foreground">{t('dev.tokens.description')}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <DesignTokensBoard theme={BoardThemes.LIGHT} />
        <DesignTokensBoard theme={BoardThemes.DARK} />
      </div>
    </section>
  )
}
