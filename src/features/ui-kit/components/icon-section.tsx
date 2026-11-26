import { LineIconWeights } from '@/components/icons'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { LINE_ICONS } from '../ui-kit'
import { KitSection } from './kit-section'

export async function IconSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.icons.title')} kicker={t('dev.kit.icons.kicker')}>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {LINE_ICONS.map(({ name, icon: Icon }) => (
          <li
            key={name}
            className="flex min-w-0 flex-col items-center gap-2 rounded-field bg-raised p-3"
          >
            <span className="flex items-center gap-2 text-ink">
              <Icon className="size-6" weight={LineIconWeights.REGULAR} />
              <Icon className="size-10" weight={LineIconWeights.FINE} />
            </span>
            <span className="w-full truncate text-center font-mono text-[11px] text-muted-foreground">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </KitSection>
  )
}
