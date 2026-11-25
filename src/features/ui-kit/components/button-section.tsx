import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const VARIANTS = ['primary', 'ghost', 'light', 'danger'] as const

export async function ButtonSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.buttons.title')} kicker={t('dev.kit.buttons.kicker')}>
      <p className="max-w-prose text-small text-muted-foreground">
        {t('dev.kit.buttons.live_states')}
      </p>
      {VARIANTS.map((variant) => (
        <KitSpecimen key={variant} label={variant} className="rounded-card bg-sunken p-4">
          <Button variant={variant}>{t('dev.kit.buttons.reserve')}</Button>
          <Button variant={variant} size="sm">
            {t('dev.kit.buttons.small')}
          </Button>
          <Button variant={variant} disabled>
            {t('dev.kit.buttons.disabled')}
          </Button>
          <Button variant={variant} isLoading>
            {t('dev.kit.buttons.loading')}
          </Button>
          <Button variant={variant} size="icon">
            <PlusIcon />
            <span className="sr-only">{t('dev.kit.buttons.add')}</span>
          </Button>
          <Button variant={variant} size="icon-sm">
            <PlusIcon />
            <span className="sr-only">{t('dev.kit.buttons.add')}</span>
          </Button>
        </KitSpecimen>
      ))}
    </KitSection>
  )
}
