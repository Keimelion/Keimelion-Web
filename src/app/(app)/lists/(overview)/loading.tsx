import { ListsSkeleton } from '@/features/lists/components/lists-skeleton'
import { getServerTranslate } from '@/lib/i18n/server-translate'

export default async function ListsLoading(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <section className="flex flex-col gap-4 py-10 lg:py-16">
      <h1 className="text-4xl lg:text-6xl">{t('lists.overview.title')}</h1>
      <ListsSkeleton loadingLabel={t('lists.overview.loading')} />
    </section>
  )
}
