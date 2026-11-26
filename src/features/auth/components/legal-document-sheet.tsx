'use client'

import { ResponsiveDialog } from '@/components/shared/responsive-dialog'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/lib/i18n/use-translate'

interface LegalDocumentSheetProps {
  title: string | null
  onClose: () => void
}

export function LegalDocumentSheet({ title, onClose }: LegalDocumentSheetProps): React.JSX.Element {
  const t = useTranslate()
  return (
    <ResponsiveDialog
      open={title !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      title={title ?? ''}
      description={null}
      footer={
        <Button variant="ghost" onClick={onClose}>
          {t('common.dialog.close')}
        </Button>
      }
    >
      <p className="text-body text-muted-foreground">{t('common.placeholder.coming_soon')}</p>
    </ResponsiveDialog>
  )
}
