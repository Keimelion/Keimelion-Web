import { getServerTranslate } from '@/lib/i18n/server-translate'
import type { MessageId } from '@/lib/i18n/messages'

interface PlaceholderPageProps {
  titleId: MessageId
  descriptionId: MessageId
}

export async function PlaceholderPage({
  titleId,
  descriptionId,
}: PlaceholderPageProps): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <section className="flex flex-col gap-3 py-10 lg:py-16">
      <h1 className="text-4xl lg:text-6xl">{t(titleId)}</h1>
      <p className="max-w-prose text-lg text-muted-foreground">{t(descriptionId)}</p>
    </section>
  )
}
