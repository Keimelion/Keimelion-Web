'use client'

import { CopyIcon, EditIcon, ShareIcon, TrashIcon } from '@/components/icons'
import { CopyField } from '@/components/shared/copy-field'
import { MoreMenu, MoreMenuTones } from '@/components/shared/more-menu'
import type { MoreMenuItem } from '@/components/shared/more-menu'
import { ScrollSpyNav } from '@/components/shared/scroll-spy-nav'
import type { ScrollSpySection } from '@/components/shared/scroll-spy-nav'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/lib/i18n/use-translate'
import { notifyInfo } from '@/lib/notify'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const SHARE_LINK_SAMPLE = 'https://keimelion.example/l/lea-axel-2027'

export function NavigationSection(): React.JSX.Element {
  const t = useTranslate()
  const announce = (label: string): void => {
    notifyInfo({ title: label })
  }
  const menuItems: readonly MoreMenuItem[] = [
    {
      id: 'rename',
      label: t('dev.kit.navigation.rename'),
      icon: EditIcon,
      tone: MoreMenuTones.DEFAULT,
      onSelect: () => {
        announce(t('dev.kit.navigation.rename'))
      },
    },
    {
      id: 'share',
      label: t('dev.kit.navigation.share'),
      icon: ShareIcon,
      tone: MoreMenuTones.DEFAULT,
      onSelect: () => {
        announce(t('dev.kit.navigation.share'))
      },
    },
    {
      id: 'duplicate',
      label: t('dev.kit.navigation.duplicate'),
      icon: CopyIcon,
      tone: MoreMenuTones.DEFAULT,
      onSelect: () => {
        announce(t('dev.kit.navigation.duplicate'))
      },
    },
    {
      id: 'delete',
      label: t('dev.kit.navigation.delete'),
      icon: TrashIcon,
      tone: MoreMenuTones.DANGER,
      onSelect: () => {
        announce(t('dev.kit.navigation.delete'))
      },
    },
  ]
  return (
    <KitSection title={t('dev.kit.navigation.title')} kicker={t('dev.kit.navigation.kicker')}>
      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <KitSpecimen label={t('dev.kit.navigation.more_menu')}>
          <MoreMenu
            label={t('dev.kit.navigation.more_actions')}
            items={menuItems}
            footerItem={{
              id: 'feedback',
              label: t('dev.kit.navigation.send_feedback'),
              icon: null,
              tone: MoreMenuTones.HIGHLIGHT,
              onSelect: () => {
                announce(t('dev.kit.navigation.send_feedback'))
              },
            }}
          />
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.navigation.copy_field')} className="w-full">
          <CopyField value={SHARE_LINK_SAMPLE} label={t('dev.kit.navigation.share_link')} />
        </KitSpecimen>
      </div>
      <ScrollSpyDemo />
    </KitSection>
  )
}

function ScrollSpyDemo(): React.JSX.Element {
  const t = useTranslate()
  const sections: readonly ScrollSpySection[] = [
    { id: 'kit-spy-account', label: t('dev.kit.navigation.account') },
    { id: 'kit-spy-appearance', label: t('dev.kit.navigation.appearance') },
    { id: 'kit-spy-privacy', label: t('dev.kit.navigation.privacy') },
  ]
  return (
    <KitSpecimen label={t('dev.kit.navigation.scroll_spy')} className="items-start">
      <div className="grid w-full gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <ScrollSpyNav
            label={t('dev.kit.navigation.profile')}
            sections={sections}
            trailing={
              <Button variant="ghost" size="sm" asChild>
                <a href="#kit-spy-privacy">{t('dev.kit.navigation.send_feedback')}</a>
              </Button>
            }
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-label={section.label}
              className="flex min-h-72 scroll-mt-6 flex-col gap-2 rounded-card bg-raised p-5 shadow-card"
            >
              <h3 className="text-title">{section.label}</h3>
              <p className="text-small text-muted-foreground">
                {t('dev.kit.navigation.section_body')}
              </p>
            </section>
          ))}
        </div>
      </div>
    </KitSpecimen>
  )
}
