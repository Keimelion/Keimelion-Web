'use client'

import { useId, useState } from 'react'
import { EditIcon, EyeIcon } from '@/components/icons'
import { SegmentedControl } from '@/components/shared/segmented-control'
import type { SegmentedOption } from '@/components/shared/segmented-control'
import { Stepper } from '@/components/shared/stepper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTranslate } from '@/lib/i18n/use-translate'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const ListViews = {
  EDIT: 'edit',
  GUEST: 'guest',
} as const

type ListView = (typeof ListViews)[keyof typeof ListViews]

const STEPPER_MIN = 1
const STEPPER_MAX = 3

export function ControlSection(): React.JSX.Element {
  const t = useTranslate()
  const switchId = useId()
  const [isGivenShown, setIsGivenShown] = useState(true)
  const [quantity, setQuantity] = useState(STEPPER_MIN)
  const [view, setView] = useState<ListView>(ListViews.EDIT)
  const viewOptions: readonly SegmentedOption<ListView>[] = [
    { value: ListViews.EDIT, label: t('dev.kit.controls.edit'), icon: EditIcon },
    { value: ListViews.GUEST, label: t('dev.kit.controls.guest_view'), icon: EyeIcon },
  ]
  return (
    <KitSection title={t('dev.kit.controls.title')} kicker={null}>
      <div className="grid gap-6 md:grid-cols-3">
        <KitSpecimen label={t('dev.kit.controls.toggle')}>
          <Switch id={switchId} checked={isGivenShown} onCheckedChange={setIsGivenShown} />
          <Label htmlFor={switchId}>{t('dev.kit.controls.show_given')}</Label>
          <Switch disabled aria-label={t('dev.kit.controls.disabled_toggle')} />
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.controls.stepper')}>
          <Stepper
            value={quantity}
            min={STEPPER_MIN}
            max={STEPPER_MAX}
            label={t('dev.kit.controls.quantity')}
            onValueChange={setQuantity}
          />
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.controls.segmented')}>
          <SegmentedControl
            label={t('dev.kit.controls.view')}
            options={viewOptions}
            value={view}
            onValueChange={setView}
          />
        </KitSpecimen>
      </div>
    </KitSection>
  )
}
