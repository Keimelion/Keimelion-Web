import { CasseroleIcon, DragHandleIcon, PlusIcon, TeacupIcon } from '@/components/icons'
import { AvatarStack } from '@/components/shared/avatar-stack'
import { Thumb, ThumbSizes } from '@/components/shared/thumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getServerTranslate } from '@/lib/i18n/server-translate'
import { OccasionPapers } from '@/lib/occasions/occasion-paper'
import { KIT_PEOPLE } from '../ui-kit'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

const STACK_MAX_VISIBLE = 3

export async function CardSection(): Promise<React.JSX.Element> {
  const t = await getServerTranslate()
  return (
    <KitSection title={t('dev.kit.cards.title')} kicker={t('dev.kit.cards.kicker')}>
      <div className="grid gap-5 lg:grid-cols-[200px_minmax(0,380px)_1fr]">
        <KitSpecimen label={t('dev.kit.cards.product')}>
          <Card className="flex w-full flex-col gap-2 p-2">
            <span className="relative block">
              <span className="flex h-[130px] items-center justify-center rounded-thumb bg-paper-sky text-ink">
                <TeacupIcon className="size-16" />
              </span>
              <Button variant="light" size="icon-sm" className="absolute right-2 bottom-2">
                <PlusIcon />
                <span className="sr-only">{t('dev.kit.cards.add_to_list')}</span>
              </Button>
            </span>
            <span className="flex flex-col gap-0.5 px-1.5 pb-1.5">
              <span className="text-sm font-bold">{t('dev.kit.cards.tea_set')}</span>
              <span className="font-mono text-label text-muted-foreground">
                {t('dev.kit.cards.tea_set_price')}
              </span>
            </span>
          </Card>
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.cards.row')}>
          <Card className="flex w-full min-w-0 items-center gap-3 rounded-[20px] py-2.5 pr-2.5 pl-3">
            <Thumb
              kind="drawing"
              size={ThumbSizes.MD}
              paper={OccasionPapers.MUSTARD}
              icon={CasseroleIcon}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[15px] leading-[19px] font-bold">
                {t('dev.kit.cards.long_name')}
              </span>
              <span className="font-mono text-label text-muted-foreground">
                {t('dev.kit.cards.casserole_price')}
              </span>
              <span className="font-hand text-[19px] leading-[18px] text-hand">
                {t('dev.kit.cards.note')}
              </span>
            </span>
            <span className="flex flex-col items-center gap-2 text-rule-strong">
              <AvatarStack
                people={KIT_PEOPLE.slice(0, 1)}
                maxVisible={1}
                label={t('dev.kit.cards.added_by')}
              />
              <DragHandleIcon className="size-[18px]" />
            </span>
          </Card>
        </KitSpecimen>
        <KitSpecimen label={t('dev.kit.cards.avatars')}>
          <AvatarStack
            people={KIT_PEOPLE.slice(0, STACK_MAX_VISIBLE)}
            maxVisible={STACK_MAX_VISIBLE}
            label={t('dev.kit.cards.editors')}
          />
          <AvatarStack
            people={KIT_PEOPLE}
            maxVisible={STACK_MAX_VISIBLE}
            label={t('dev.kit.cards.editors')}
          />
        </KitSpecimen>
      </div>
    </KitSection>
  )
}
