import type { CSSProperties } from 'react'
import { toast } from 'sonner'
import { translate } from '@/lib/i18n/translate'

const DEFAULT_UNDO_DELAY_MS = 5000

type ToastLifetimeStyle = CSSProperties & Record<'--toast-lifetime', string>

interface NotifyWithUndoInput {
  message: string
  undoLabel?: string
  delayMs?: number
  onCommit: () => void
  onUndo: () => void
}

export function notifyWithUndo({
  message,
  undoLabel = translate('common.undo.action'),
  delayMs = DEFAULT_UNDO_DELAY_MS,
  onCommit,
  onUndo,
}: NotifyWithUndoInput): void {
  const settlement = { isSettled: false }
  const settle = (outcome: () => void): void => {
    if (settlement.isSettled) return
    settlement.isSettled = true
    outcome()
  }
  const lifetimeStyle: ToastLifetimeStyle = { '--toast-lifetime': `${String(delayMs)}ms` }
  toast(message, {
    duration: delayMs,
    style: lifetimeStyle,
    action: {
      label: undoLabel,
      onClick: () => {
        settle(onUndo)
      },
    },
    onDismiss: () => {
      settle(onCommit)
    },
    onAutoClose: () => {
      settle(onCommit)
    },
  })
}
