'use client'

import { useState } from 'react'
import { LockIcon, TrashIcon } from '@/components/icons'
import { AnimatedList, AnimatedListItem } from '@/components/shared/animated-list'
import { Callout, CalloutTones } from '@/components/shared/callout'
import { Button } from '@/components/ui/button'
import type { MessageId } from '@/lib/i18n/messages'
import { useTranslate } from '@/lib/i18n/use-translate'
import { notifyInfo } from '@/lib/notify'
import { notifyWithUndo } from '@/lib/notify-with-undo'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const INITIAL_GIFT_IDS = [
  'dev.kit.cards.tea_set',
  'dev.kit.activity.gift_casserole',
  'dev.kit.activity.gift_lamp',
] as const satisfies readonly MessageId[]

export function ListActivitySection(): React.JSX.Element {
  const t = useTranslate()
  const [isBannerShown, setIsBannerShown] = useState(true)
  return (
    <KitSection title={t('dev.kit.activity.title')} kicker={t('dev.kit.activity.kicker')}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Callout
          tone={CalloutTones.INFO}
          title={t('dev.kit.activity.info_title')}
          kicker={null}
          icon={LockIcon}
          action={null}
          onDismiss={null}
        >
          {t('dev.kit.activity.info_body')}
        </Callout>
        {isBannerShown ? (
          <Callout
            tone={CalloutTones.BRAND}
            title={t('dev.kit.activity.brand_title')}
            kicker={t('dev.kit.activity.brand_kicker')}
            icon={null}
            action={null}
            onDismiss={() => {
              setIsBannerShown(false)
            }}
          >
            {t('dev.kit.activity.brand_body')}
          </Callout>
        ) : (
          <Button
            variant="ghost"
            className="self-start"
            onClick={() => {
              setIsBannerShown(true)
            }}
          >
            {t('dev.kit.activity.show_banner')}
          </Button>
        )}
        <Callout
          tone={CalloutTones.WARNING}
          title={t('dev.kit.activity.warning_title')}
          kicker={null}
          icon={LockIcon}
          action={
            <Button variant="ghost" size="sm" className="self-start">
              {t('dev.kit.activity.warning_action')}
            </Button>
          }
          onDismiss={null}
        >
          {t('dev.kit.activity.warning_body')}
        </Callout>
      </div>
      <UndoableList />
    </KitSection>
  )
}

function UndoableList(): React.JSX.Element {
  const t = useTranslate()
  const [gifts, setGifts] = useState(() => INITIAL_GIFT_IDS.map((giftId) => t(giftId)))
  const [addedCount, setAddedCount] = useState(0)
  const removeGift = (gift: string): void => {
    const position = gifts.indexOf(gift)
    setGifts((current) => current.filter((candidate) => candidate !== gift))
    notifyWithUndo({
      message: t('dev.kit.activity.removed', { gift }),
      onCommit: () => {
        notifyInfo({ title: t('dev.kit.activity.committed', { gift }) })
      },
      onUndo: () => {
        setGifts((current) => [...current.slice(0, position), gift, ...current.slice(position)])
      },
    })
  }
  return (
    <KitSpecimen label={t('dev.kit.activity.list')} className="flex-col items-stretch">
      <AnimatedList label={t('dev.kit.activity.list')} className="gap-2">
        {gifts.map((gift) => (
          <AnimatedListItem key={gift}>
            <div className="flex min-h-14 items-center justify-between gap-3 rounded-[20px] bg-raised py-2 pr-2 pl-4 shadow-card">
              <span className="truncate font-bold">{gift}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  removeGift(gift)
                }}
              >
                <TrashIcon />
                <span className="sr-only">{t('dev.kit.activity.remove', { gift })}</span>
              </Button>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => {
          const nextCount = addedCount + 1
          setAddedCount(nextCount)
          setGifts((current) => [...current, t('dev.kit.activity.new_gift', { count: nextCount })])
        }}
      >
        {t('dev.kit.activity.add')}
      </Button>
    </KitSpecimen>
  )
}
