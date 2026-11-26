import type { Metadata } from 'next'
import { UiKitBoard } from '@/features/ui-kit/components/ui-kit-board'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslate()
  return { title: t('dev.kit.title') }
}

export default async function UiKitPage(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <section className="flex flex-col gap-10 py-10 lg:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-m lg:text-display-xl">{t('dev.kit.title')}</h1>
        <p className="max-w-prose text-body text-muted-foreground">{t('dev.kit.description')}</p>
      </header>
      <UiKitBoard />
    </section>
  )
}
