import { BowIcon } from '@/components/icons'
import { BowLogo, BowLogoTones } from '@/components/shared/bow-logo'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

export async function BrandSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.brand.title')} kicker={t('dev.kit.brand.kicker')}>
      <div className="grid gap-4 md:grid-cols-3">
        <KitSpecimen
          label={t('dev.kit.brand.primary')}
          className="rounded-card bg-surface p-6 text-4xl shadow-[inset_0_0_0_1px_var(--rule)]"
        >
          <BowLogo tone={BowLogoTones.BRAND} hasWordmark />
        </KitSpecimen>
        <KitSpecimen
          label={t('dev.kit.brand.inverse')}
          className="rounded-card bg-brand p-6 text-4xl"
        >
          <BowLogo tone={BowLogoTones.ON_BRAND} hasWordmark />
        </KitSpecimen>
        <KitSpecimen
          label={t('dev.kit.brand.on_paper')}
          className="rounded-card bg-paper-sky p-6 text-4xl"
        >
          <BowLogo tone={BowLogoTones.INK} hasWordmark />
        </KitSpecimen>
      </div>
      <KitSpecimen label={t('dev.kit.brand.app_icons')}>
        <span className="flex size-24 items-center justify-center rounded-[26px] bg-brand text-on-brand">
          <BowIcon className="size-[70px]" />
        </span>
        <span className="flex size-14 items-center justify-center rounded-thumb bg-brand text-on-brand">
          <BowIcon className="size-[42px]" />
        </span>
        <span className="flex size-8 items-center justify-center rounded-[9px] bg-brand text-on-brand">
          <BowIcon className="size-[26px]" />
        </span>
        <span className="flex h-[72px] items-center rounded-pill bg-inverse px-7 text-[36px]">
          <BowLogo tone={BowLogoTones.ON_INVERSE} hasWordmark />
        </span>
      </KitSpecimen>
    </KitSection>
  )
}
