'use client'

import { useState } from 'react'
import { BottomSheet } from '@/components/shared/bottom-sheet'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslate } from '@/lib/i18n/use-translate'
import { notifyError, notifySuccess } from '@/lib/notify'
import { KitSection } from './kit-section'
import { KitSpecimen } from './kit-specimen'

export function OverlaySection(): React.JSX.Element {
  const t = useTranslate()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  return (
    <KitSection title={t('dev.kit.overlays.title')} kicker={t('dev.kit.overlays.kicker')}>
      <KitSpecimen label={t('dev.kit.overlays.triggers')}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">{t('dev.kit.overlays.open_dialog')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dev.kit.overlays.dialog_title')}</DialogTitle>
              <DialogDescription>{t('dev.kit.overlays.dialog_description')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  {t('dev.kit.overlays.keep')}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger" size="sm">
                  {t('dev.kit.overlays.cancel_reservation')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          onClick={() => {
            setIsSheetOpen(true)
          }}
        >
          {t('dev.kit.overlays.open_sheet')}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">{t('dev.kit.overlays.open_popover')}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm">{t('dev.kit.overlays.popover_body')}</p>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          onClick={() => {
            notifySuccess({ title: t('dev.kit.overlays.toast_success') })
          }}
        >
          {t('dev.kit.overlays.show_toast')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            notifyError({ title: t('dev.kit.overlays.toast_error') })
          }}
        >
          {t('dev.kit.overlays.show_error_toast')}
        </Button>
      </KitSpecimen>
      <BottomSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={t('dev.kit.overlays.sheet_title')}
        description={t('dev.kit.overlays.sheet_description')}
      >
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setIsSheetOpen(false)
          }}
        >
          {t('dev.kit.overlays.sheet_action')}
        </Button>
      </BottomSheet>
    </KitSection>
  )
}
