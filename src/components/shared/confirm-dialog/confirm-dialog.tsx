'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/lib/i18n/use-translate'

export const ConfirmTones = {
  DEFAULT: 'default',
  DANGER: 'danger',
} as const

export type ConfirmTone = (typeof ConfirmTones)[keyof typeof ConfirmTones]

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  tone: ConfirmTone
  isPending: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  tone,
  isPending,
  onConfirm,
}: ConfirmDialogProps): React.JSX.Element {
  const t = useTranslate()
  const changeOpenUnlessPending = (nextOpen: boolean): void => {
    if (isPending) return
    onOpenChange(nextOpen)
  }
  return (
    <AlertDialog open={open} onOpenChange={changeOpenUnlessPending}>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="mt-1.5 flex flex-col-reverse gap-2.5 lg:flex-row lg:justify-end">
          <AlertDialogCancel asChild>
            <Button variant="ghost" className="max-lg:w-full" disabled={isPending}>
              {t('common.confirm_dialog.cancel')}
            </Button>
          </AlertDialogCancel>
          <Button
            variant={tone === ConfirmTones.DANGER ? 'danger' : 'primary'}
            className="max-lg:w-full"
            isLoading={isPending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
