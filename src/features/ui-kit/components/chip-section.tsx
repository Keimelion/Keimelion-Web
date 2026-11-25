'use client'

import { useState } from 'react'
import { Chip } from '@/components/shared/chip'
import { OccasionIcon } from '@/components/shared/occasion-icon'
import { Tag, TagTones } from '@/components/shared/tag'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { OccasionShapes } from '@/lib/occasions/occasion-shape'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const FILTER_IDS = ['all', 'available', 'under_50'] as const

type FilterId = (typeof FILTER_IDS)[number]

const FILTER_LABEL_IDS: Readonly<Record<FilterId, MessageId>> = {
  all: 'dev.kit.chips.all',
  available: 'dev.kit.chips.available',
  under_50: 'dev.kit.chips.under_50',
}

export function ChipSection(): React.JSX.Element {
  const t = useTranslate()
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')
  const [isWeddingSelected, setIsWeddingSelected] = useState(false)
  return (
    <KitSection title={t('dev.kit.chips.title')} kicker={null}>
      <KitSpecimen label={t('dev.kit.chips.filters')}>
        {FILTER_IDS.map((filterId) => (
          <Chip
            key={filterId}
            isSelected={activeFilter === filterId}
            onClick={() => {
              setActiveFilter(filterId)
            }}
          >
            {t(FILTER_LABEL_IDS[filterId])}
          </Chip>
        ))}
        <Chip
          isSelected={isWeddingSelected}
          onClick={() => {
            setIsWeddingSelected((isSelected) => !isSelected)
          }}
        >
          <OccasionIcon shape={OccasionShapes.FLOWER} />
          {t('dev.kit.occasions.wedding')}
        </Chip>
        <Chip isSelected={false} disabled>
          {t('dev.kit.chips.disabled')}
        </Chip>
      </KitSpecimen>
      <KitSpecimen label={t('dev.kit.chips.tags')}>
        <Tag tone={TagTones.BRAND}>{t('dev.kit.chips.kitchen')}</Tag>
        <Tag tone={TagTones.BRAND}>{t('dev.kit.chips.under_50')}</Tag>
        <Tag tone={TagTones.NEUTRAL} className="max-w-40">
          {t('dev.kit.cards.long_name')}
        </Tag>
      </KitSpecimen>
    </KitSection>
  )
}
