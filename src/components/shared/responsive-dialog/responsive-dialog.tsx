'use client'

import { BottomSheet } from '@/components/shared/bottom-sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useIsDesktopViewport } from '@/lib/use-is-desktop-viewport'

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string | null
  footer: React.ReactNode
  children: React.ReactNode
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: ResponsiveDialogProps): React.JSX.Element {
  const isDesktop = useIsDesktopViewport()
  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title={title} description={description}>
        <div className="mt-4 flex min-w-0 flex-col gap-4">{children}</div>
        {footer === null ? null : <div className="mt-5 flex flex-col-reverse gap-2">{footer}</div>}
      </BottomSheet>
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent {...(description === null ? { 'aria-describedby': undefined } : {})}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description === null ? null : <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex min-w-0 flex-col gap-4">{children}</div>
        {footer === null ? null : <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
