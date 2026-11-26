'use client'

import { useEffect, useState } from 'react'
import { BottomSheet } from '@/components/shared/bottom-sheet'
import { ConfirmDialog, ConfirmTones } from '@/components/shared/confirm-dialog'
import { ResponsiveDialog } from '@/components/shared/responsive-dialog'
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
import { notifyError, notifySuccess, notifyWarning } from '@/lib/notify'
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
        <Button
          variant="ghost"
          onClick={() => {
            notifyWarning({ title: t('dev.kit.overlays.toast_warning') })
          }}
        >
          {t('dev.kit.overlays.show_warning_toast')}
        </Button>
      </KitSpecimen>
      <KitSpecimen label={t('dev.kit.overlays.responsive')}>
        <ResponsiveDialogDemo />
        <ConfirmDialogDemo />
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

function ResponsiveDialogDemo(): React.JSX.Element {
  const t = useTranslate()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {t('dev.kit.overlays.open_responsive')}
      </Button>
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t('dev.kit.overlays.responsive_title')}
        description={t('dev.kit.overlays.responsive_description')}
        footer={
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
          >
            {t('dev.kit.overlays.sheet_action')}
          </Button>
        }
      >
        <p className="text-sm">{t('dev.kit.overlays.responsive_body')}</p>
      </ResponsiveDialog>
    </>
  )
}

const SIMULATED_REQUEST_MS = 1500

function ConfirmDialogDemo(): React.JSX.Element {
  const t = useTranslate()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  useEffect(() => {
    if (!isPending) return undefined
    const timeout = window.setTimeout(() => {
      setIsPending(false)
      setIsOpen(false)
    }, SIMULATED_REQUEST_MS)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [isPending])
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {t('dev.kit.overlays.open_confirm')}
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t('dev.kit.overlays.confirm_title')}
        description={t('dev.kit.overlays.confirm_description')}
        confirmLabel={t('dev.kit.overlays.confirm_action')}
        tone={ConfirmTones.DANGER}
        isPending={isPending}
        onConfirm={() => {
          setIsPending(true)
        }}
      />
    </>
  )
}
