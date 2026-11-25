'use client'

import { useId, useState } from 'react'
import { EditIcon, LinkIcon } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupCard, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { cn } from '@/lib/utils'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const APPEARANCES = ['light', 'dark', 'system'] as const

type Appearance = (typeof APPEARANCES)[number]

const APPEARANCE_LABEL_IDS: Readonly<Record<Appearance, MessageId>> = {
  light: 'common.theme_picker.light',
  dark: 'common.theme_picker.dark',
  system: 'common.theme_picker.system',
}

const VISIBILITIES = ['public', 'private'] as const

type Visibility = (typeof VISIBILITIES)[number]

const VISIBILITY_LABEL_IDS: Readonly<Record<Visibility, MessageId>> = {
  public: 'dev.kit.choices.public',
  private: 'dev.kit.choices.private',
}

export function ChoiceSection(): React.JSX.Element {
  const t = useTranslate()
  return (
    <KitSection title={t('dev.kit.choices.title')} kicker={t('dev.kit.choices.kicker')}>
      <div className="grid gap-6 lg:grid-cols-3">
        <KitSpecimen label={t('dev.kit.choices.tabs')} className="flex-col items-stretch">
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="link">
                <LinkIcon />
                {t('dev.kit.choices.from_link')}
              </TabsTrigger>
              <TabsTrigger value="hand">
                <EditIcon />
                {t('dev.kit.choices.by_hand')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="link" className="text-small text-muted-foreground">
              {t('dev.kit.choices.from_link_body')}
            </TabsContent>
            <TabsContent value="hand" className="text-small text-muted-foreground">
              {t('dev.kit.choices.by_hand_body')}
            </TabsContent>
          </Tabs>
        </KitSpecimen>
        <VisibilityRadios />
        <AppearanceCards />
      </div>
    </KitSection>
  )
}

function VisibilityRadios(): React.JSX.Element {
  const t = useTranslate()
  const baseId = useId()
  return (
    <KitSpecimen label={t('dev.kit.choices.radios')}>
      <RadioGroup defaultValue="public" aria-label={t('dev.kit.choices.visibility')}>
        {VISIBILITIES.map((visibility) => (
          <span key={visibility} className="flex items-center gap-3">
            <RadioGroupItem value={visibility} id={`${baseId}-${visibility}`} />
            <Label htmlFor={`${baseId}-${visibility}`}>{t(VISIBILITY_LABEL_IDS[visibility])}</Label>
          </span>
        ))}
      </RadioGroup>
    </KitSpecimen>
  )
}

function AppearanceCards(): React.JSX.Element {
  const t = useTranslate()
  const [appearance, setAppearance] = useState<Appearance>('system')
  return (
    <KitSpecimen label={t('dev.kit.choices.radio_cards')} className="flex-col items-stretch">
      <RadioGroup
        value={appearance}
        onValueChange={(value) => {
          setAppearance(APPEARANCES.find((candidate) => candidate === value) ?? 'system')
        }}
        aria-label={t('dev.kit.choices.appearance')}
        className="grid-cols-3"
      >
        {APPEARANCES.map((option) => (
          <RadioGroupCard key={option} value={option}>
            <AppearancePreview appearance={option} />
            <span className="text-sm font-semibold">{t(APPEARANCE_LABEL_IDS[option])}</span>
          </RadioGroupCard>
        ))}
      </RadioGroup>
    </KitSpecimen>
  )
}

interface AppearancePreviewProps {
  appearance: Appearance
}

function AppearancePreview({ appearance }: AppearancePreviewProps): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="flex h-14 overflow-hidden rounded-thumb shadow-[inset_0_0_0_1px_var(--rule)]"
    >
      {appearance === 'dark' ? null : <PreviewHalf themeClassName="light" />}
      {appearance === 'light' ? null : <PreviewHalf themeClassName="dark" />}
    </span>
  )
}

interface PreviewHalfProps {
  themeClassName: string
}

function PreviewHalf({ themeClassName }: PreviewHalfProps): React.JSX.Element {
  return (
    <span className={cn(themeClassName, 'flex flex-1 flex-col justify-end gap-1 bg-surface p-2')}>
      <span className="h-1.5 w-3/4 rounded-pill bg-ink" />
      <span className="h-1.5 w-1/2 rounded-pill bg-brand" />
    </span>
  )
}
